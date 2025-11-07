/**
 * Sweep execution engine with batch processing and nonce management
 */
import type { Address, PublicClient } from 'viem';
import type { ImportedWallet } from '../types/wallet';
import type { ERC20Token, NativeToken } from '$lib/types/token';
import {
	buildWalletSweepTransactions,
	type SweepResult,
	type SweepTransaction
} from './transaction-builder';

export interface SweepConfig {
	targetAddress: Address;
	wallets: ImportedWallet[];
	tokens: (NativeToken | ERC20Token)[];
	chainId: number;
	includeNative: boolean;
	batchSize: number; // Max wallets per batch
}

export interface SweepProgress {
	phase: 'preparing' | 'building' | 'executing' | 'confirming' | 'completed' | 'error';
	currentBatch: number;
	totalBatches: number;
	currentWallet: number;
	totalWallets: number;
	percentage: number;
	message: string;
	results: SweepResult[];
	error?: string;
}

export type SweepProgressCallback = (progress: SweepProgress) => void;

/**
 * Execute sweep for multiple wallets in batches
 */
export async function executeSweep(
	publicClient: PublicClient,
	config: SweepConfig,
	onProgress?: SweepProgressCallback
): Promise<SweepProgress> {
	const results: SweepResult[] = [];
	const totalWallets = config.wallets.length;
	const totalBatches = Math.ceil(totalWallets / config.batchSize);

	// Filter tokens by type
	const erc20Tokens = config.tokens.filter((t) => t.type === 'erc20') as ERC20Token[];
	const hasNativeToken = config.tokens.some((t) => t.type === 'native');
	const includeNative = hasNativeToken && config.includeNative;

	let progress: SweepProgress = {
		phase: 'preparing',
		currentBatch: 0,
		totalBatches,
		currentWallet: 0,
		totalWallets,
		percentage: 0,
		message: 'Preparing sweep...',
		results
	};

	onProgress?.(progress);

	try {
		// Process each batch
		for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
			const batchStart = batchIndex * config.batchSize;
			const batchEnd = Math.min(batchStart + config.batchSize, totalWallets);
			const batchWallets = config.wallets.slice(batchStart, batchEnd);

			progress = {
				...progress,
				phase: 'building',
				currentBatch: batchIndex + 1,
				message: `Building transactions for batch ${batchIndex + 1}/${totalBatches}...`
			};
			onProgress?.(progress);

			// Build transactions for each wallet in batch
			const batchTransactions: Array<{
				wallet: ImportedWallet;
				transactions: SweepTransaction[];
			}> = [];

			for (const wallet of batchWallets) {
				const transactions = await buildWalletSweepTransactions(
					publicClient,
					wallet,
					config.targetAddress,
					erc20Tokens,
					config.chainId,
					includeNative
				);

				if (transactions.length > 0) {
					batchTransactions.push({ wallet, transactions });
				}
			}

			// Execute transactions for batch
			progress = {
				...progress,
				phase: 'executing',
				message: `Executing batch ${batchIndex + 1}/${totalBatches}...`
			};
			onProgress?.(progress);

			for (let i = 0; i < batchTransactions.length; i++) {
				const { wallet, transactions } = batchTransactions[i];
				const walletIndex = batchStart + i;

				progress = {
					...progress,
					currentWallet: walletIndex + 1,
					percentage: Math.round(((walletIndex + 1) / totalWallets) * 100),
					message: `Processing wallet ${walletIndex + 1}/${totalWallets}...`
				};
				onProgress?.(progress);

				// Execute all transactions for this wallet
				for (const tx of transactions) {
					try {
						// For now, we can't execute transactions without private keys
						// This is a placeholder for the actual execution logic
						// In a real implementation, users would need to sign each transaction

						const result: SweepResult = {
							wallet: wallet.address,
							success: false,
							error: 'Transaction execution requires wallet private key access',
							tokenSymbol: tx.tokenSymbol
						};

						results.push(result);
					} catch (error) {
						const result: SweepResult = {
							wallet: wallet.address,
							success: false,
							error: error instanceof Error ? error.message : 'Unknown error',
							tokenSymbol: tx.tokenSymbol
						};

						results.push(result);
					}
				}
			}
		}

		// Completed
		progress = {
			...progress,
			phase: 'completed',
			currentBatch: totalBatches,
			currentWallet: totalWallets,
			percentage: 100,
			message: 'Sweep completed!',
			results
		};
		onProgress?.(progress);

		return progress;
	} catch (error) {
		progress = {
			...progress,
			phase: 'error',
			message: 'Sweep failed',
			error: error instanceof Error ? error.message : 'Unknown error',
			results
		};
		onProgress?.(progress);

		return progress;
	}
}

/**
 * Estimate total transactions and gas cost
 */
export async function estimateSweep(
	publicClient: PublicClient,
	config: SweepConfig
): Promise<{
	totalTransactions: number;
	estimatedGas: bigint;
	estimatedCost: bigint;
}> {
	let totalTransactions = 0;
	let estimatedGas = 0n;

	const erc20Tokens = config.tokens.filter((t) => t.type === 'erc20') as ERC20Token[];
	const hasNativeToken = config.tokens.some((t) => t.type === 'native');

	const gasPrice = await publicClient.getGasPrice();

	// Estimate for each wallet
	for (let i = 0; i < config.wallets.length; i++) {
		// ERC20 transfers
		totalTransactions += erc20Tokens.length;
		estimatedGas += BigInt(erc20Tokens.length) * 65000n; // Approximate ERC20 gas

		// Native transfer
		if (hasNativeToken) {
			totalTransactions += 1;
			estimatedGas += 21000n; // ETH transfer gas
		}
	}

	const estimatedCost = estimatedGas * gasPrice;

	return {
		totalTransactions,
		estimatedGas,
		estimatedCost
	};
}

/**
 * Validate sweep configuration
 */
export function validateSweepConfig(config: SweepConfig): {
	valid: boolean;
	errors: string[];
} {
	const errors: string[] = [];

	if (!config.targetAddress || !config.targetAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
		errors.push('Invalid target address');
	}

	if (config.wallets.length === 0) {
		errors.push('No wallets to sweep');
	}

	if (config.tokens.length === 0) {
		errors.push('No tokens selected');
	}

	if (config.batchSize < 1) {
		errors.push('Batch size must be at least 1');
	}

	if (config.batchSize > 100) {
		errors.push('Batch size cannot exceed 100');
	}

	return {
		valid: errors.length === 0,
		errors
	};
}

/**
 * Calculate sweep statistics
 */
export function calculateSweepStats(config: SweepConfig) {
	const totalWallets = config.wallets.length;
	const totalBatches = Math.ceil(totalWallets / config.batchSize);
	const erc20Count = config.tokens.filter((t) => t.type === 'erc20').length;
	const hasNative = config.tokens.some((t) => t.type === 'native');

	const txPerWallet = erc20Count + (hasNative ? 1 : 0);
	const totalTransactions = totalWallets * txPerWallet;

	return {
		totalWallets,
		totalBatches,
		totalTransactions,
		txPerWallet,
		avgBatchSize: Math.ceil(totalWallets / totalBatches)
	};
}
