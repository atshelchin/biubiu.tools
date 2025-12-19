/**
 * Distribution executor composable
 * Handles the execution flow of token distribution operations (Self-Execute mode)
 */
import type { Address } from 'viem';
import type { DistributionConfig } from '../types/distribution';
import { step5State, type TransactionResult } from '../stores/step5-state.svelte';
import { buildDistributionTransactions, calculateTotalAmount } from '../utils/distribution-builder';

interface UseDistributionExecutorOptions {
	getSendTransaction: () => (params: {
		to: Address;
		value: bigint;
		data: `0x${string}`;
		gas?: bigint;
	}) => Promise<`0x${string}`>;
	getWaitForTransaction: () => (hash: `0x${string}`) => Promise<{ status: 'success' | 'reverted' }>;
}

export function useDistributionExecutor(options: UseDistributionExecutorOptions) {
	const { getSendTransaction, getWaitForTransaction } = options;

	// Local state
	let isExecuting = $state(false);
	let shouldStop = $state(false);

	/**
	 * Validate distribution configuration
	 */
	function validateConfig(config: DistributionConfig): { valid: boolean; error?: string } {
		if (!config.sourceWallet) {
			return { valid: false, error: 'Source wallet not connected' };
		}

		if (!config.token) {
			return { valid: false, error: 'No token selected' };
		}

		if (config.recipients.length === 0) {
			return { valid: false, error: 'No recipients provided' };
		}

		// Validate amounts for fungible tokens
		if (config.token.type === 'native' || config.token.type === 'erc20') {
			if (config.amountMode === 'equal' && !config.amountPerRecipient) {
				return { valid: false, error: 'Amount per recipient not specified' };
			}

			if (
				config.amountMode === 'custom' &&
				config.recipients.some((r) => !r.amount || parseFloat(r.amount) <= 0)
			) {
				return { valid: false, error: 'Some recipients have invalid amounts' };
			}

			// For random mode, amounts should already be set on recipients
			if (
				config.amountMode === 'random' &&
				config.recipients.some((r) => !r.amount || parseFloat(r.amount) <= 0)
			) {
				return { valid: false, error: 'Random amounts not generated for some recipients' };
			}
		}

		// Validate NFT tokens
		if (config.token.type === 'erc721' || config.token.type === 'erc1155') {
			if (config.recipients.some((r) => r.tokenId === undefined)) {
				return { valid: false, error: 'Some recipients have no token ID assigned' };
			}
		}

		return { valid: true };
	}

	/**
	 * Execute distribution in self-execute mode (batch signing)
	 * Each transaction is signed individually by the connected wallet
	 */
	async function execute(
		config: DistributionConfig,
		options?: {
			startFromIndex?: number;
			batchDelay?: number; // Delay between transactions in ms
		}
	): Promise<{ success: boolean; error?: string }> {
		const startIndex = options?.startFromIndex ?? 0;
		const batchDelay = options?.batchDelay ?? 500; // 500ms default delay

		// Validate config
		const validation = validateConfig(config);
		if (!validation.valid) {
			step5State.setError(validation.error!);
			return { success: false, error: validation.error };
		}

		isExecuting = true;
		shouldStop = false;

		try {
			// Build transactions
			const transactions = buildDistributionTransactions(config);

			if (transactions.length === 0) {
				step5State.setError('No valid transactions to execute');
				return { success: false, error: 'No valid transactions to execute' };
			}

			// Initialize session if starting fresh
			if (startIndex === 0) {
				step5State.initSession(transactions.length);
			} else {
				// Resume from checkpoint
				step5State.resume();
				step5State.updateProgress(
					startIndex,
					'executing',
					`Resuming from transaction ${startIndex + 1}...`
				);
			}

			const sendTransaction = getSendTransaction();
			const waitForTransaction = getWaitForTransaction();

			// Execute transactions one by one
			for (let i = startIndex; i < transactions.length; i++) {
				// Check if execution should stop
				if (shouldStop) {
					step5State.pause('Execution paused by user');
					return { success: false, error: 'Execution paused by user' };
				}

				// Check if paused
				if (step5State.isPaused) {
					return { success: false, error: 'Execution paused' };
				}

				const tx = transactions[i];
				const recipientAddress = tx.recipient.address;
				const shortAddress = `${recipientAddress.slice(0, 6)}...${recipientAddress.slice(-4)}`;

				// Update progress
				step5State.updateProgress(
					i,
					'executing',
					`Sending to ${shortAddress} (${i + 1}/${transactions.length})`,
					recipientAddress
				);

				try {
					// Send transaction
					const hash = await sendTransaction({
						to: tx.to,
						value: tx.value || BigInt(0),
						data: tx.data || '0x',
						gas: tx.gasLimit
					});

					console.log(`Transaction ${i + 1} sent: ${hash}`);

					// Wait for confirmation
					step5State.updateProgress(
						i,
						'executing',
						`Waiting for confirmation... (${i + 1}/${transactions.length})`,
						recipientAddress
					);

					const receipt = await waitForTransaction(hash);

					// Record result
					const result: TransactionResult = {
						recipientAddress: tx.recipient.address,
						recipientLabel: tx.recipient.label,
						amount: tx.recipient.amount,
						tokenId: tx.recipient.tokenId,
						success: receipt.status === 'success',
						hash,
						timestamp: Date.now()
					};

					if (receipt.status !== 'success') {
						result.error = 'Transaction reverted';
					}

					step5State.addResult(result);
				} catch (error) {
					// Record failed transaction
					const errorMessage = error instanceof Error ? error.message : String(error);

					// Check if user rejected
					if (errorMessage.includes('rejected') || errorMessage.includes('denied')) {
						step5State.pause('Transaction rejected by user');
						return { success: false, error: 'Transaction rejected by user' };
					}

					const result: TransactionResult = {
						recipientAddress: tx.recipient.address,
						recipientLabel: tx.recipient.label,
						amount: tx.recipient.amount,
						tokenId: tx.recipient.tokenId,
						success: false,
						error: errorMessage,
						timestamp: Date.now()
					};

					step5State.addResult(result);
					console.error(`Transaction ${i + 1} failed:`, errorMessage);

					// Continue with next transaction (don't stop on individual failures)
				}

				// Add delay between transactions
				if (i < transactions.length - 1 && batchDelay > 0) {
					await new Promise((resolve) => setTimeout(resolve, batchDelay));
				}
			}

			// Mark as completed
			step5State.complete();
			return { success: true };
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			step5State.setError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			isExecuting = false;
		}
	}

	/**
	 * Resume execution from last checkpoint
	 */
	async function resume(config: DistributionConfig): Promise<{ success: boolean; error?: string }> {
		if (!step5State.canResume) {
			return { success: false, error: 'Cannot resume - no valid checkpoint' };
		}

		return execute(config, { startFromIndex: step5State.resumeFromIndex });
	}

	/**
	 * Stop execution (will pause at next transaction)
	 */
	function stop() {
		shouldStop = true;
	}

	/**
	 * Get estimated totals for display
	 */
	function getEstimates(config: DistributionConfig): {
		totalAmount: string;
		recipientCount: number;
		transactionCount: number;
	} {
		const transactions = buildDistributionTransactions(config);
		return {
			totalAmount: calculateTotalAmount(config),
			recipientCount: config.recipients.length,
			transactionCount: transactions.length
		};
	}

	/**
	 * Build confirmation message
	 */
	function buildConfirmationMessage(
		config: DistributionConfig,
		networkName?: string
	): {
		title: string;
		details: string[];
		warning: string;
	} {
		const estimates = getEstimates(config);
		const tokenSymbol = config.token.symbol;
		const isNFT = config.token.type === 'erc721' || config.token.type === 'erc1155';

		const details: string[] = [];

		if (isNFT) {
			details.push(`Token: ${config.token.name} (${tokenSymbol})`);
			details.push(`Recipients: ${estimates.recipientCount}`);
			details.push(`Transactions: ${estimates.transactionCount}`);
		} else {
			details.push(`Token: ${tokenSymbol}`);
			details.push(`Total Amount: ${estimates.totalAmount} ${tokenSymbol}`);
			details.push(`Recipients: ${estimates.recipientCount}`);
			details.push(`Transactions: ${estimates.transactionCount}`);
		}

		if (networkName) {
			details.push(`Network: ${networkName}`);
		}

		return {
			title: 'Execute Token Distribution',
			details,
			warning:
				'Each recipient will require a separate transaction. You will need to approve each transaction in your wallet.'
		};
	}

	/**
	 * Reset executor state
	 */
	function reset() {
		isExecuting = false;
		shouldStop = false;
		step5State.reset();
	}

	return {
		// State
		get isExecuting() {
			return isExecuting;
		},
		get progress() {
			return step5State.progress;
		},
		get results() {
			return step5State.results;
		},
		get summary() {
			return step5State.summary;
		},
		get canResume() {
			return step5State.canResume;
		},
		get isPaused() {
			return step5State.isPaused;
		},
		get errorMessage() {
			return step5State.errorMessage;
		},

		// Methods
		validateConfig,
		execute,
		resume,
		stop,
		getEstimates,
		buildConfirmationMessage,
		reset
	};
}

export type DistributionExecutorInstance = ReturnType<typeof useDistributionExecutor>;
