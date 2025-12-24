/**
 * Sweep executor composable
 * Handles the execution flow of token sweep operations
 */
import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import type { Address, Hex } from 'viem';
import type { Token, NativeToken, ERC20Token } from '$lib/types/token';
import type { ImportedWallet } from '@/features/wallet-sweep/types/wallet';
import type { MembershipStatus, TemporaryWallet } from '@/features/wallet-sweep/types/fee';
import {
	executeTokenSweep,
	type TokenSweepConfig,
	type TransactionSigner
} from '@/features/wallet-sweep/utils/tokensweep-executor';
import type { SweepProgress } from '@/features/wallet-sweep/utils/sweep-executor';

interface NetworkConfig {
	chainId: number;
	name: string;
	symbol: string;
	rpcEndpoints: Array<{ url: string }>;
}

interface UseSweepExecutorOptions {
	getConnectedAddress: () => Address | undefined;
	getWalletClient: () => Promise<{
		signMessage: (args: { account: Address; message: string }) => Promise<Hex>;
		sendTransaction: (args: {
			account: Address;
			to: Address;
			data: Hex;
			value: bigint;
			gas: bigint;
		}) => Promise<Hex>;
	}>;
}

export function useSweepExecutor(options: UseSweepExecutorOptions) {
	const { getConnectedAddress, getWalletClient } = options;

	// State
	let isSweeping = $state(false);
	let sweepProgress = $state<SweepProgress | null>(null);
	let errorMessage = $state('');

	/**
	 * Validate sweep inputs
	 */
	function validateInputs(
		targetAddress: string,
		selectedTokenCount: number,
		walletCount: number,
		connectedAddress: Address | undefined,
		chainId: number | undefined,
		temporaryWallet: TemporaryWallet | null
	): string | null {
		if (!connectedAddress) {
			return 'wallet-sweep.step5.content.errors.connect_wallet';
		}

		if (!chainId) {
			return 'wallet-sweep.step5.content.errors.no_network';
		}

		if (!targetAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
			return 'wallet-sweep.step5.content.errors.invalid_address';
		}

		if (selectedTokenCount === 0) {
			return 'wallet-sweep.step5.content.errors.select_tokens';
		}

		if (walletCount === 0) {
			return 'wallet-sweep.step5.content.errors.import_wallets';
		}

		if (!temporaryWallet) {
			return 'wallet-sweep.step5.content.errors.complete_fields';
		}

		return null;
	}

	/**
	 * Create member signer for fee discount (if user is a member)
	 */
	async function createMemberSigner(
		membershipStatus: MembershipStatus,
		connectedAddress: Address
	): Promise<TransactionSigner | undefined> {
		if (!membershipStatus.isMember) {
			return undefined;
		}

		console.log('👑 Member detected! Creating member signer for fee discount');
		const walletClient = await getWalletClient();

		return {
			address: connectedAddress,
			signMessage: async (message: string): Promise<Hex> => {
				console.log('🔔 Member signMessage called!');
				const sig = await walletClient.signMessage({
					account: connectedAddress,
					message
				});
				console.log('✅ Member signature obtained');
				return sig;
			},
			sendTransaction: async () => {
				throw new Error('Member signer should not send transactions');
			}
		};
	}

	/**
	 * Create transaction signer based on wallet mode
	 */
	async function createTransactionSigner(
		temporaryWallet: TemporaryWallet,
		network: NetworkConfig
	): Promise<TransactionSigner> {
		const rpcUrl = network.rpcEndpoints[0].url;
		const chain = {
			id: network.chainId,
			name: network.name,
			nativeCurrency: { name: network.symbol, symbol: network.symbol, decimals: 18 },
			rpcUrls: { default: { http: [rpcUrl] } }
		} as const;

		console.log('🔑 Using temporary wallet for EIP-7702 transaction');
		const account = privateKeyToAccount(temporaryWallet.privateKey as `0x${string}`);
		const tempWalletClient = createWalletClient({
			account,
			chain,
			transport: http(rpcUrl)
		});

		return {
			address: account.address,
			signMessage: async (message: string): Promise<Hex> => {
				return await account.signMessage({ message });
			},
			sendTransaction: async (tx) => {
				return await tempWalletClient.sendTransaction(tx);
			}
		};
	}

	/**
	 * Execute the sweep operation
	 */
	async function execute(
		targetAddress: Address,
		walletsToSweep: ImportedWallet[],
		selectedTokenObjects: Token[],
		network: NetworkConfig,
		temporaryWallet: TemporaryWallet,
		membershipStatus: MembershipStatus
	): Promise<{ success: boolean; error?: string }> {
		const connectedAddress = getConnectedAddress();
		if (!connectedAddress) {
			return { success: false, error: 'Not connected' };
		}

		isSweeping = true;
		errorMessage = '';
		sweepProgress = null;

		try {
			// Create member signer if applicable
			const memberSigner = await createMemberSigner(membershipStatus, connectedAddress);

			// Create transaction signer
			const signer = await createTransactionSigner(temporaryWallet, network);

			// Build config
			const tokenSweepConfig: TokenSweepConfig = {
				targetAddress,
				wallets: walletsToSweep,
				tokens: selectedTokenObjects as (NativeToken | ERC20Token)[],
				chainId: network.chainId,
				referrer: undefined,
				useTemporaryWallet: true,
				memberSigner,
				onProgress: (message: string, percentage: number) => {
					if (sweepProgress) {
						sweepProgress = {
							...sweepProgress,
							message,
							percentage
						};
					}
				}
			};

			// Initialize progress
			sweepProgress = {
				phase: 'preparing',
				currentBatch: 0,
				totalBatches: 1,
				currentWallet: 0,
				totalWallets: walletsToSweep.length,
				percentage: 5,
				message: '🚀 Starting TokenSweep (Temporary Wallet Mode)...',
				results: []
			};

			// Create public client
			const rpcUrl = network.rpcEndpoints[0].url;
			const chain = {
				id: network.chainId,
				name: network.name,
				nativeCurrency: { name: network.symbol, symbol: network.symbol, decimals: 18 },
				rpcUrls: { default: { http: [rpcUrl] } }
			} as const;
			const publicClient = createPublicClient({ chain, transport: http(rpcUrl) });

			// Execute
			const result = await executeTokenSweep(publicClient, signer, tokenSweepConfig);

			if (result.success) {
				sweepProgress = {
					phase: 'completed',
					currentBatch: 1,
					totalBatches: 1,
					currentWallet: result.walletsProcessed,
					totalWallets: walletsToSweep.length,
					percentage: 100,
					message: `✅ Sweep completed! TX: ${result.transactionHash}`,
					results: [
						{
							wallet: targetAddress,
							success: true,
							tokenSymbol: 'ALL',
							txHash: result.transactionHash as `0x${string}`
						}
					]
				};
				return { success: true };
			} else {
				errorMessage = result.error || 'Sweep failed';
				sweepProgress = {
					phase: 'error',
					currentBatch: 0,
					totalBatches: 1,
					currentWallet: 0,
					totalWallets: walletsToSweep.length,
					percentage: 0,
					message: result.error || 'Sweep failed',
					results: [],
					error: result.error
				};
				return { success: false, error: result.error };
			}
		} catch (error) {
			const errMsg = error instanceof Error ? error.message : 'Sweep failed';
			errorMessage = errMsg;
			sweepProgress = {
				phase: 'error',
				currentBatch: 0,
				totalBatches: 1,
				currentWallet: 0,
				totalWallets: walletsToSweep.length,
				percentage: 0,
				message: 'Sweep failed',
				results: [],
				error: errMsg
			};
			return { success: false, error: errMsg };
		} finally {
			isSweeping = false;
		}
	}

	/**
	 * Build confirmation message for user
	 */
	function buildConfirmationMessage(
		selectedTokenCount: number,
		sweepWalletCount: number,
		targetAddress: string,
		onlyWithBalance: boolean,
		isMember: boolean
	): string {
		const feeInfo = isMember
			? 'As a premium member, you will not be charged tool fees.'
			: 'Non-member fee: 0.005 ETH (refunded for premium members)';

		const signatureSteps = isMember
			? `\n📝 SIGNATURES YOU WILL NEED TO APPROVE:\n` +
				`1. Member Authorization (MetaMask) - Proves membership for fee discount\n` +
				`2. Transaction Submission (Temporary Wallet) - Sends the actual transaction\n\n`
			: `\n📝 SIGNATURES YOU WILL NEED TO APPROVE:\n` +
				`1. Transaction Submission (Temporary Wallet) - Sends the transaction\n\n`;

		const modeWarning =
			`\n✅ WALLET MODE:\n` +
			`• Using TEMPORARY WALLET (supports EIP-7702)\n` +
			(isMember
				? `• 👑 MEMBER: Your connected wallet will sign authorization for fee discount\n`
				: `• NON-MEMBER: 0.005 ETH tool fee will be charged\n`) +
			`\n`;

		return (
			`🚀 Ready to execute TokenSweep via EIP-7702:\n\n` +
			`• ${selectedTokenCount} token(s)\n` +
			`• From ${sweepWalletCount} wallet(s)${onlyWithBalance ? ' (with balance only)' : ''}\n` +
			`• To ${targetAddress}\n\n` +
			`How it works:\n` +
			`1. Your imported wallets will be temporarily upgraded to smart contracts (EIP-7702)\n` +
			`2. The TokenSweep contract (0x28ab...239) will execute on their behalf\n` +
			`3. All tokens will be transferred to the target address in one transaction\n\n` +
			`Fees:\n` +
			`${feeInfo}\n` +
			`Gas fees still apply (~0.01-0.05 ETH estimated)\n` +
			signatureSteps +
			modeWarning +
			`⚠️ NETWORK REQUIREMENTS:\n` +
			`• Your network MUST support EIP-7702 (Prague upgrade)\n` +
			`• Most public RPCs do NOT support EIP-7702 yet (2024)\n` +
			`• Requires local testnet (Anvil/Hardhat) or dedicated EIP-7702 RPC\n` +
			`• If error occurs, check console logs for details\n\n` +
			`Continue?`
		);
	}

	/**
	 * Reset executor state
	 */
	function reset() {
		isSweeping = false;
		sweepProgress = null;
		errorMessage = '';
	}

	/**
	 * Clear error message
	 */
	function clearError() {
		errorMessage = '';
	}

	return {
		get isSweeping() {
			return isSweeping;
		},
		get sweepProgress() {
			return sweepProgress;
		},
		get errorMessage() {
			return errorMessage;
		},
		validateInputs,
		execute,
		buildConfirmationMessage,
		reset,
		clearError
	};
}

export type SweepExecutorInstance = ReturnType<typeof useSweepExecutor>;
