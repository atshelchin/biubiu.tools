import { createPublicClient, http } from 'viem';
import {
	scanMultipleWalletsResumable,
	RateLimitError,
	isRateLimitError,
	type ScanState
} from '@/features/wallet-sweep/utils/balance-scanner';
import type { ImportedWallet } from '@/features/wallet-sweep/types/wallet';
import type { ERC20Token, Token } from '$lib/types/token';
import { SvelteMap } from 'svelte/reactivity';
import { RPCManager, type RPCEndpoint } from '@/features/wallet-sweep/utils/rpc-manager';

interface ScanBalancesParams {
	wallets: ImportedWallet[];
	selectedTokens: Token[];
	currentChainId: number;
	rpcEndpoints: RPCEndpoint[]; // Changed from single rpcUrl to array
	networkName: string;
	networkSymbol: string;
	onProgress: (progress: number) => void;
	onRateLimitError?: (error: RateLimitError, state: ScanState) => void;
	onAllRPCsExhausted?: () => void; // New callback when all RPCs are exhausted
	initialState?: ScanState;
}

export function useBalanceScanner() {
	async function scanBalances(params: ScanBalancesParams) {
		const {
			wallets,
			selectedTokens,
			currentChainId,
			rpcEndpoints,
			networkName,
			networkSymbol,
			onProgress,
			onRateLimitError,
			onAllRPCsExhausted,
			initialState
		} = params;

		// Create RPC Manager
		const rpcManager = new RPCManager(rpcEndpoints);
		console.log('🔧 RPC Manager initialized with endpoints:', rpcEndpoints);
		console.log(rpcManager.getStatusReport());

		// Prepare token addresses for scanning
		const tokenAddresses = selectedTokens.map((token) => ({
			address: token.type === 'erc20' ? (token as ERC20Token).address : undefined,
			decimals: token.decimals,
			chainId: token.chainId,
			tokenId: token.id
		}));

		// Retry loop with RPC rotation
		let scanState = initialState;

		while (!rpcManager.isAllExhausted()) {
			const currentRpcUrl = rpcManager.getCurrentRPC();
			console.log(`🚀 Attempting scan with RPC: ${currentRpcUrl}`);

			// Create chain object for viem
			const chain = {
				id: currentChainId,
				name: networkName,
				nativeCurrency: {
					name: networkSymbol,
					symbol: networkSymbol,
					decimals: 18
				},
				rpcUrls: {
					default: {
						http: [currentRpcUrl]
					}
				}
			} as const;

			// Create public client for current RPC
			// Disable viem's internal retries - we handle RPC switching ourselves
			const publicClient = createPublicClient({
				chain,
				transport: http(currentRpcUrl, {
					retryCount: 0, // Disable transport-level retries
					retryDelay: 0, // No delay between retries (since retryCount is 0)
					timeout: 30000 // 30 second timeout
				}),
				batch: {
					multicall: false // Disable built-in multicall batching
				},
				pollingInterval: undefined // Disable polling
			});

			try {
				// Use resumable scan with rate limit handling
				const { results, state } = await scanMultipleWalletsResumable(
					publicClient,
					wallets,
					tokenAddresses,
					currentChainId,
					(progress) => {
						onProgress(progress.percentage);
					},
					// Capture the state when rate limit error occurs
					(_error, capturedState) => {
						console.log('📋 Captured state from rate limit error:', capturedState);
						scanState = capturedState; // Save the state for retry
					},
					scanState
				);

				// Success! Mark RPC as working
				rpcManager.markSuccess();
				console.log('✅ Scan completed successfully');
				console.log(rpcManager.getStatusReport());

				// Format results for storage
				const updates = new SvelteMap<
					string,
					{ hasBalance: boolean; balances?: { native?: string; tokens?: Record<string, string> } }
				>();

				for (const [address, result] of results.entries()) {
					const balances: { native?: string; tokens?: Record<string, string> } = {
						tokens: {}
					};

					// Format balances for storage
					for (const balance of result.balances) {
						if (balance.tokenId.endsWith(':native')) {
							// Store as string to maintain bigint precision
							balances.native = balance.balance.toString();
						} else {
							// Store as string to maintain bigint precision
							balances.tokens![balance.tokenId] = balance.balance.toString();
						}
					}

					updates.set(address.toLowerCase(), {
						hasBalance: result.hasBalance,
						balances
					});
				}

				return { updates, state };
			} catch (error) {
				console.error('❌ Scan error:', error);

				// Check if it's a RateLimitError instance OR matches rate limit patterns (CORS, network errors, etc.)
				if (error instanceof RateLimitError || isRateLimitError(error)) {
					console.log('⚠️ Rate limit/RPC error detected, switching to next RPC...');

					// scanState should already be updated by the onRateLimitError callback above
					// If not, create a minimal scanState for safety
					if (!scanState) {
						const currentTokenIndex =
							error instanceof RateLimitError ? (error.scanType === 'native' ? -1 : 0) : -1;
						const currentBatchIndex = error instanceof RateLimitError ? error.currentBatch - 1 : 0;

						scanState = {
							addresses: wallets.map((w) => w.address),
							chainId: currentChainId,
							currentTokenIndex,
							currentBatchIndex,
							tokenBalances: new SvelteMap(),
							isPaused: true,
							pauseReason: 'rate_limit'
						};
					}

					const switched = rpcManager.markRateLimitedAndSwitch();
					if (!switched) {
						// All RPCs exhausted - wait 10 seconds and retry once
						console.log(
							'⏳ All RPCs are rate limited or failed, waiting 10 seconds before final retry...'
						);
						await new Promise((resolve) => setTimeout(resolve, 10000));

						// Try to get available RPCs after cooldown
						const availableAfterWait = rpcManager.getAvailableRPCs();
						if (availableAfterWait.length > 0) {
							console.log(
								`🔄 ${availableAfterWait.length} RPC(s) recovered after waiting, retrying...`
							);
							continue; // Retry with recovered RPC
						}

						// Still no available RPCs - show error to user
						console.log('❌ All RPCs still unavailable after waiting 10 seconds');
						if (onAllRPCsExhausted) {
							onAllRPCsExhausted();
						}
						if (onRateLimitError) {
							// Create RateLimitError for consistent error handling if it's not already one
							const rateLimitError =
								error instanceof RateLimitError
									? error
									: new RateLimitError(
											'native',
											(scanState?.currentBatchIndex ?? 0) + 1,
											Math.ceil(wallets.length / 1000)
										);
							onRateLimitError(rateLimitError, scanState!);
						}
						break;
					}

					// Continue with next RPC
					console.log('🔄 Retrying with next RPC...');
					continue;
				}

				// Non-rate-limit error - fail the RPC and throw
				rpcManager.markFailed();
				throw error;
			}
		}

		// If we exit loop, all RPCs are exhausted
		throw new Error('All RPC endpoints are rate limited or failed');
	}

	return {
		scanBalances
	};
}
