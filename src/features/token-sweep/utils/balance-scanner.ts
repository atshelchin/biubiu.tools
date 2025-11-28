/**
 * Balance scanning utilities for checking wallet balances
 */
import type { PublicClient } from 'viem';
import type { Address } from 'viem';
import { encodeFunctionData, decodeFunctionResult } from 'viem';
import type { ImportedWallet } from '../types/wallet';

// Multicall3 contract address (universal across all chains)
const MULTICALL3_ADDRESS = '0x2055A30B00555e7cAd48b1756eac4f917781489b' as Address;

// Debug mode configuration (set via environment or dev tools)
interface DebugConfig {
	enableRateLimitTest: boolean;
	batchSize: number;
}

// Default debug config (can be overridden)
let debugConfig: DebugConfig = {
	enableRateLimitTest: false,
	batchSize: 1000
};

// Export function to set debug config
export function setDebugConfig(config: Partial<DebugConfig>) {
	debugConfig = { ...debugConfig, ...config };
	console.log('🐛 Debug config updated:', debugConfig);
}

// Get current batch size (respects debug config)
export function getBatchSize(): number {
	return debugConfig.batchSize;
}

// Batch size for multicall queries (1000 addresses per batch, or 1 in debug mode)
const getBatchSizeDynamic = () => debugConfig.batchSize;
const BATCH_SIZE = 1000; // Keep for backward compatibility

// ERC20 balanceOf ABI
const ERC20_BALANCE_ABI = [
	{
		name: 'balanceOf',
		type: 'function',
		stateMutability: 'view',
		inputs: [{ name: 'account', type: 'address' }],
		outputs: [{ name: 'balance', type: 'uint256' }]
	}
] as const;

// Multicall3 aggregate3 ABI
const MULTICALL3_ABI = [
	{
		name: 'aggregate3',
		type: 'function',
		stateMutability: 'payable',
		inputs: [
			{
				name: 'calls',
				type: 'tuple[]',
				components: [
					{ name: 'target', type: 'address' },
					{ name: 'allowFailure', type: 'bool' },
					{ name: 'callData', type: 'bytes' }
				]
			}
		],
		outputs: [
			{
				name: 'returnData',
				type: 'tuple[]',
				components: [
					{ name: 'success', type: 'bool' },
					{ name: 'returnData', type: 'bytes' }
				]
			}
		]
	},
	{
		name: 'getEthBalance',
		type: 'function',
		stateMutability: 'view',
		inputs: [{ name: 'addr', type: 'address' }],
		outputs: [{ name: 'balance', type: 'uint256' }]
	}
] as const;

// Scan state for pause/resume functionality
export interface ScanState {
	addresses: Address[];
	chainId: number;
	currentTokenIndex: number; // Which token we're scanning
	currentBatchIndex: number; // Which batch within current token
	nativeBalances?: Map<Address, TokenBalance>;
	tokenBalances: Map<string, Map<Address, TokenBalance>>;
	isPaused: boolean;
	pauseReason?: 'rate_limit' | 'user_pause' | 'error';
	error?: string;
}

// Rate limit error detection
export class RateLimitError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'RateLimitError';
	}
}

// Scan control interface for pause/resume
export interface ScanControl {
	pause: () => void;
	resume: () => void;
	isPaused: () => boolean;
}

export interface TokenBalance {
	tokenId: string; // chainId:address or chainId:native
	balance: bigint;
	formatted: string; // Human readable balance
}

export interface WalletBalanceResult {
	address: Address;
	balances: TokenBalance[];
	hasBalance: boolean; // true if any balance > 0
}

export interface ScanProgress {
	current: number;
	total: number;
	percentage: number;
}

/**
 * Detect if an error is caused by RPC rate limiting
 */
export function isRateLimitError(error: unknown): boolean {
	if (!error) return false;

	const errorStr = String(error).toLowerCase();
	const errorMessage = error instanceof Error ? error.message.toLowerCase() : errorStr;

	// Common rate limit indicators
	const rateLimitPatterns = [
		'rate limit',
		'too many requests',
		'429',
		'quota exceeded',
		'request limit',
		'throttle',
		'rate exceeded',
		'too fast',
		'slow down'
	];

	return rateLimitPatterns.some(
		(pattern) => errorMessage.includes(pattern) || errorStr.includes(pattern)
	);
}

/**
 * Scan native token balance for a single wallet
 */
export async function scanNativeBalance(
	client: PublicClient,
	address: Address,
	chainId: number
): Promise<TokenBalance> {
	const balance = await client.getBalance({ address });

	return {
		tokenId: `${chainId}:native`,
		balance,
		formatted: formatBalance(balance, 18)
	};
}

/**
 * Scan ERC20 token balance for a single wallet
 */
export async function scanERC20Balance(
	client: PublicClient,
	walletAddress: Address,
	tokenAddress: Address,
	decimals: number,
	chainId: number
): Promise<TokenBalance> {
	try {
		const balance = await client.readContract({
			address: tokenAddress,
			abi: ERC20_BALANCE_ABI,
			functionName: 'balanceOf',
			args: [walletAddress]
		});

		return {
			tokenId: `${chainId}:${tokenAddress.toLowerCase()}`,
			balance: balance as bigint,
			formatted: formatBalance(balance as bigint, decimals)
		};
	} catch (error) {
		console.error(`Failed to scan ERC20 balance for ${tokenAddress}:`, error);
		return {
			tokenId: `${chainId}:${tokenAddress.toLowerCase()}`,
			balance: 0n,
			formatted: '0'
		};
	}
}

/**
 * Batch scan native balances for multiple addresses using Multicall3
 */
export async function batchScanNativeBalances(
	client: PublicClient,
	addresses: Address[],
	chainId: number,
	onBatchProgress?: (current: number, total: number) => void
): Promise<Map<Address, TokenBalance>> {
	const results = new Map<Address, TokenBalance>();
	const totalBatches = Math.ceil(addresses.length / BATCH_SIZE);

	// Process in batches of BATCH_SIZE
	for (let i = 0; i < addresses.length; i += BATCH_SIZE) {
		const batch = addresses.slice(i, i + BATCH_SIZE);
		const batchIndex = Math.floor(i / BATCH_SIZE) + 1;

		// Prepare multicall calls for native balance
		const calls = batch.map((address) => ({
			target: MULTICALL3_ADDRESS,
			allowFailure: true,
			callData: encodeFunctionData({
				abi: MULTICALL3_ABI,
				functionName: 'getEthBalance',
				args: [address]
			})
		}));

		try {
			// Execute multicall
			// @ts-ignore - Multicall3 aggregate3 not in default viem types
			const response = (await (client as any).readContract({
				address: MULTICALL3_ADDRESS,
				abi: MULTICALL3_ABI,
				functionName: 'aggregate3',
				args: [calls]
			})) as unknown as Array<{ success: boolean; returnData: string }>;

			// Process results
			batch.forEach((address, index) => {
				const result = response[index];
				let balance = 0n;

				if (result.success && result.returnData !== '0x') {
					try {
						balance = decodeFunctionResult({
							abi: MULTICALL3_ABI,
							functionName: 'getEthBalance',
							data: result.returnData as `0x${string}`
						}) as bigint;
					} catch (e) {
						console.warn(`Failed to decode balance for ${address}:`, e);
					}
				}

				results.set(address, {
					tokenId: `${chainId}:native`,
					balance,
					formatted: formatBalance(balance, 18)
				});
			});
		} catch (error) {
			console.error('Multicall failed for native balances:', error);
			// Fallback: set all to zero
			batch.forEach((address) => {
				results.set(address, {
					tokenId: `${chainId}:native`,
					balance: 0n,
					formatted: '0'
				});
			});
		}

		// Report batch progress
		if (onBatchProgress) {
			onBatchProgress(batchIndex, totalBatches);
		}
	}

	return results;
}

/**
 * Batch scan ERC20 token balances for multiple addresses using Multicall3
 */
export async function batchScanERC20Balances(
	client: PublicClient,
	addresses: Address[],
	tokenAddress: Address,
	decimals: number,
	chainId: number,
	onBatchProgress?: (current: number, total: number) => void
): Promise<Map<Address, TokenBalance>> {
	const results = new Map<Address, TokenBalance>();
	const tokenId = `${chainId}:${tokenAddress.toLowerCase()}`;
	const totalBatches = Math.ceil(addresses.length / BATCH_SIZE);

	// Process in batches of BATCH_SIZE
	for (let i = 0; i < addresses.length; i += BATCH_SIZE) {
		const batch = addresses.slice(i, i + BATCH_SIZE);
		const batchIndex = Math.floor(i / BATCH_SIZE) + 1;

		// Prepare multicall calls for ERC20 balanceOf
		const calls = batch.map((address) => ({
			target: tokenAddress,
			allowFailure: true,
			callData: encodeFunctionData({
				abi: ERC20_BALANCE_ABI,
				functionName: 'balanceOf',
				args: [address]
			})
		}));

		try {
			// Execute multicall
			// @ts-ignore - Multicall3 aggregate3 not in default viem types
			const response = (await (client as any).readContract({
				address: MULTICALL3_ADDRESS,
				abi: MULTICALL3_ABI,
				functionName: 'aggregate3',
				args: [calls]
			})) as unknown as Array<{ success: boolean; returnData: string }>;

			// Process results
			batch.forEach((address, index) => {
				const result = response[index];
				let balance = 0n;

				if (result.success && result.returnData !== '0x') {
					try {
						balance = decodeFunctionResult({
							abi: ERC20_BALANCE_ABI,
							functionName: 'balanceOf',
							data: result.returnData as `0x${string}`
						}) as bigint;
					} catch (e) {
						console.warn(`Failed to decode ERC20 balance for ${address}:`, e);
					}
				}

				results.set(address, {
					tokenId,
					balance,
					formatted: formatBalance(balance, decimals)
				});
			});
		} catch (error) {
			console.error(`Multicall failed for ERC20 ${tokenAddress}:`, error);
			// Fallback: set all to zero
			batch.forEach((address) => {
				results.set(address, {
					tokenId,
					balance: 0n,
					formatted: '0'
				});
			});
		}

		// Report batch progress
		if (onBatchProgress) {
			onBatchProgress(batchIndex, totalBatches);
		}
	}

	return results;
}

/**
 * Scan all balances for a single wallet
 */
export async function scanWalletBalances(
	client: PublicClient,
	wallet: ImportedWallet,
	tokenAddresses: { address?: Address; decimals: number; chainId: number; tokenId: string }[],
	chainId: number
): Promise<WalletBalanceResult> {
	const balances: TokenBalance[] = [];

	// Scan native token
	const nativeBalance = await scanNativeBalance(client, wallet.address, chainId);
	balances.push(nativeBalance);

	// Scan ERC20 tokens
	for (const token of tokenAddresses) {
		if (token.address) {
			const balance = await scanERC20Balance(
				client,
				wallet.address,
				token.address,
				token.decimals,
				chainId
			);
			balances.push(balance);
		}
	}

	// Check if wallet has any balance
	const hasBalance = balances.some((b) => b.balance > 0n);

	return {
		address: wallet.address,
		balances,
		hasBalance
	};
}

/**
 * Scan balances for multiple wallets with progress tracking
 * Uses Multicall3 for optimized batch queries (1000 addresses per token per batch)
 */
export async function scanMultipleWallets(
	client: PublicClient,
	wallets: ImportedWallet[],
	tokenAddresses: { address?: Address; decimals: number; chainId: number; tokenId: string }[],
	chainId: number,
	onProgress?: (progress: ScanProgress) => void
): Promise<Map<Address, WalletBalanceResult>> {
	const results = new Map<Address, WalletBalanceResult>();
	const addresses = wallets.map((w) => w.address);

	// Calculate total batches for accurate progress tracking
	const batchCount = Math.ceil(addresses.length / BATCH_SIZE);
	const totalTokens = 1 + tokenAddresses.filter((t) => t.address).length; // native + ERC20s
	const totalBatches = batchCount * totalTokens;
	let completedBatches = 0;

	// Progress callback for batch-level updates
	const updateProgress = () => {
		if (onProgress) {
			onProgress({
				current: completedBatches,
				total: totalBatches,
				percentage: Math.round((completedBatches / totalBatches) * 100)
			});
		}
	};

	// Step 1: Batch scan native balances for all addresses
	const nativeBalances = await batchScanNativeBalances(
		client,
		addresses,
		chainId,
		(current, total) => {
			completedBatches = current;
			updateProgress();
		}
	);

	// Step 2: Batch scan each ERC20 token for all addresses
	const tokenBalancesMaps = new Map<string, Map<Address, TokenBalance>>();
	let tokenIndex = 0;

	for (const token of tokenAddresses) {
		if (token.address) {
			tokenIndex++;
			const balances = await batchScanERC20Balances(
				client,
				addresses,
				token.address,
				token.decimals,
				chainId,
				(current, total) => {
					// Calculate cumulative progress: native batches + previous tokens + current token
					completedBatches = batchCount + (tokenIndex - 1) * batchCount + current;
					updateProgress();
				}
			);
			tokenBalancesMaps.set(token.tokenId, balances);
		}
	}

	// Combine results for each wallet
	for (const wallet of wallets) {
		const balances: TokenBalance[] = [];

		// Add native balance
		const nativeBalance = nativeBalances.get(wallet.address);
		if (nativeBalance) {
			balances.push(nativeBalance);
		}

		// Add ERC20 balances
		for (const [tokenId, tokenBalances] of tokenBalancesMaps.entries()) {
			const balance = tokenBalances.get(wallet.address);
			if (balance) {
				balances.push(balance);
			}
		}

		// Check if wallet has any balance
		const hasBalance = balances.some((b) => b.balance > 0n);

		results.set(wallet.address, {
			address: wallet.address,
			balances,
			hasBalance
		});
	}

	return results;
}

/**
 * Format balance from wei to human readable format
 */
export function formatBalance(balance: bigint, decimals: number): string {
	const divisor = BigInt(10 ** decimals);
	const integerPart = balance / divisor;
	const fractionalPart = balance % divisor;

	// Format fractional part with leading zeros
	const fractionalStr = fractionalPart.toString().padStart(decimals, '0');

	// Trim trailing zeros
	const trimmed = fractionalStr.replace(/0+$/, '');

	if (trimmed.length === 0) {
		return integerPart.toString();
	}

	return `${integerPart}.${trimmed}`;
}

/**
 * Check if a wallet has any balance for selected tokens
 */
export function hasBalanceForTokens(
	result: WalletBalanceResult,
	selectedTokenIds: string[]
): boolean {
	return result.balances.some(
		(balance) => selectedTokenIds.includes(balance.tokenId) && balance.balance > 0n
	);
}

/**
 * Filter wallets that have balance for selected tokens
 */
export function filterWalletsWithBalance(
	results: Map<Address, WalletBalanceResult>,
	selectedTokenIds: string[]
): Address[] {
	const walletsWithBalance: Address[] = [];

	for (const [address, result] of results.entries()) {
		if (hasBalanceForTokens(result, selectedTokenIds)) {
			walletsWithBalance.push(address);
		}
	}

	return walletsWithBalance;
}

/**
 * Calculate total balance for a specific token across all wallets
 */
export function calculateTotalBalance(
	results: Map<Address, WalletBalanceResult>,
	tokenId: string
): bigint {
	let total = 0n;

	for (const result of results.values()) {
		const balance = result.balances.find((b) => b.tokenId === tokenId);
		if (balance) {
			total += balance.balance;
		}
	}

	return total;
}

/**
 * Resumable scan balances for multiple wallets with pause/resume support
 * This function supports pausing when rate limits are hit and resuming from where it left off
 */
export async function scanMultipleWalletsResumable(
	client: PublicClient,
	wallets: ImportedWallet[],
	tokenAddresses: { address?: Address; decimals: number; chainId: number; tokenId: string }[],
	chainId: number,
	onProgress?: (progress: ScanProgress) => void,
	onRateLimitError?: (error: RateLimitError, state: ScanState) => void,
	initialState?: ScanState
): Promise<{ results: Map<Address, WalletBalanceResult>; state: ScanState }> {
	const addresses = wallets.map((w) => w.address);

	// Initialize or resume from saved state
	const state: ScanState = initialState || {
		addresses,
		chainId,
		currentTokenIndex: -1, // -1 means native token
		currentBatchIndex: 0,
		tokenBalances: new Map(),
		isPaused: false
	};

	const batchCount = Math.ceil(addresses.length / getBatchSize());
	const totalTokens = 1 + tokenAddresses.filter((t) => t.address).length;

	// Pause control
	let shouldPause = false;
	const control: ScanControl = {
		pause: () => {
			shouldPause = true;
			state.isPaused = true;
			state.pauseReason = 'user_pause';
		},
		resume: () => {
			shouldPause = false;
			state.isPaused = false;
			state.pauseReason = undefined;
		},
		isPaused: () => shouldPause
	};

	try {
		// Step 1: Scan native balances (if not already done)
		if (state.currentTokenIndex === -1) {
			const nativeBalances = new Map<Address, TokenBalance>();

			for (let i = state.currentBatchIndex; i < batchCount; i++) {
				if (shouldPause) {
					state.currentBatchIndex = i;
					break;
				}

				const batchStart = i * getBatchSize();
				const batch = addresses.slice(batchStart, batchStart + getBatchSize());
				const calls = batch.map((address) => ({
					target: MULTICALL3_ADDRESS,
					allowFailure: true,
					callData: encodeFunctionData({
						abi: MULTICALL3_ABI,
						functionName: 'getEthBalance',
						args: [address]
					})
				}));

				try {
					// @ts-ignore
					const response = (await (client as any).readContract({
						address: MULTICALL3_ADDRESS,
						abi: MULTICALL3_ABI,
						functionName: 'aggregate3',
						args: [calls]
					})) as unknown as Array<{ success: boolean; returnData: string }>;

					batch.forEach((address, index) => {
						const result = response[index];
						let balance = 0n;
						if (result.success && result.returnData !== '0x') {
							try {
								balance = decodeFunctionResult({
									abi: MULTICALL3_ABI,
									functionName: 'getEthBalance',
									data: result.returnData as `0x${string}`
								}) as bigint;
							} catch (e) {
								console.warn(`Failed to decode balance for ${address}:`, e);
							}
						}
						nativeBalances.set(address, {
							tokenId: `${chainId}:native`,
							balance,
							formatted: formatBalance(balance, 18)
						});
					});

					// Update progress
					if (onProgress) {
						const completedBatches = i + 1;
						onProgress({
							current: completedBatches,
							total: batchCount * totalTokens,
							percentage: Math.round((completedBatches / (batchCount * totalTokens)) * 100)
						});
					}
				} catch (error) {
					if (isRateLimitError(error)) {
						state.isPaused = true;
						state.pauseReason = 'rate_limit';
						state.currentBatchIndex = i;
						state.nativeBalances = nativeBalances;
						const rateLimitError = new RateLimitError(
							`RPC rate limit detected while scanning native balances at batch ${i + 1}/${batchCount}`
						);
						if (onRateLimitError) {
							onRateLimitError(rateLimitError, state);
						}
						throw rateLimitError;
					}
					throw error;
				}
			}

			state.nativeBalances = nativeBalances;
			if (!shouldPause) {
				state.currentTokenIndex = 0;
				state.currentBatchIndex = 0;
			}
		}

		// Step 2: Scan ERC20 tokens
		const erc20Tokens = tokenAddresses.filter((t) => t.address);
		for (
			let tokenIdx = Math.max(0, state.currentTokenIndex);
			tokenIdx < erc20Tokens.length;
			tokenIdx++
		) {
			if (shouldPause) {
				state.currentTokenIndex = tokenIdx;
				break;
			}

			const token = erc20Tokens[tokenIdx];
			if (!token.address) continue;

			const tokenBalances =
				state.tokenBalances.get(token.tokenId) || new Map<Address, TokenBalance>();

			for (let i = state.currentBatchIndex; i < batchCount; i++) {
				if (shouldPause) {
					state.currentTokenIndex = tokenIdx;
					state.currentBatchIndex = i;
					break;
				}

				const batchStart = i * getBatchSize();
				const batch = addresses.slice(batchStart, batchStart + getBatchSize());
				const calls = batch.map((address) => ({
					target: token.address!,
					allowFailure: true,
					callData: encodeFunctionData({
						abi: ERC20_BALANCE_ABI,
						functionName: 'balanceOf',
						args: [address]
					})
				}));

				try {
					// @ts-ignore
					const response = (await (client as any).readContract({
						address: MULTICALL3_ADDRESS,
						abi: MULTICALL3_ABI,
						functionName: 'aggregate3',
						args: [calls]
					})) as unknown as Array<{ success: boolean; returnData: string }>;

					batch.forEach((address, index) => {
						const result = response[index];
						let balance = 0n;
						if (result.success && result.returnData !== '0x') {
							try {
								balance = decodeFunctionResult({
									abi: ERC20_BALANCE_ABI,
									functionName: 'balanceOf',
									data: result.returnData as `0x${string}`
								}) as bigint;
							} catch (e) {
								console.warn(`Failed to decode ERC20 balance for ${address}:`, e);
							}
						}
						tokenBalances.set(address, {
							tokenId: token.tokenId,
							balance,
							formatted: formatBalance(balance, token.decimals)
						});
					});

					// Update progress
					if (onProgress) {
						const completedBatches = batchCount + tokenIdx * batchCount + (i + 1);
						onProgress({
							current: completedBatches,
							total: batchCount * totalTokens,
							percentage: Math.round((completedBatches / (batchCount * totalTokens)) * 100)
						});
					}
				} catch (error) {
					if (isRateLimitError(error)) {
						state.isPaused = true;
						state.pauseReason = 'rate_limit';
						state.currentTokenIndex = tokenIdx;
						state.currentBatchIndex = i;
						state.tokenBalances.set(token.tokenId, tokenBalances);
						const rateLimitError = new RateLimitError(
							`RPC rate limit detected while scanning ${token.tokenId} at batch ${i + 1}/${batchCount}`
						);
						if (onRateLimitError) {
							onRateLimitError(rateLimitError, state);
						}
						throw rateLimitError;
					}
					throw error;
				}
			}

			state.tokenBalances.set(token.tokenId, tokenBalances);
			if (!shouldPause) {
				state.currentBatchIndex = 0; // Reset for next token
			}
		}

		// Combine results
		const results = new Map<Address, WalletBalanceResult>();
		for (const wallet of wallets) {
			const balances: TokenBalance[] = [];

			// Add native balance
			if (state.nativeBalances) {
				const nativeBalance = state.nativeBalances.get(wallet.address);
				if (nativeBalance) {
					balances.push(nativeBalance);
				}
			}

			// Add ERC20 balances
			for (const [tokenId, tokenBalances] of state.tokenBalances.entries()) {
				const balance = tokenBalances.get(wallet.address);
				if (balance) {
					balances.push(balance);
				}
			}

			const hasBalance = balances.some((b) => b.balance > 0n);
			results.set(wallet.address, {
				address: wallet.address,
				balances,
				hasBalance
			});
		}

		return { results, state };
	} catch (error) {
		if (error instanceof RateLimitError) {
			// Return partial results with current state
			const results = new Map<Address, WalletBalanceResult>();
			for (const wallet of wallets) {
				const balances: TokenBalance[] = [];
				if (state.nativeBalances) {
					const nativeBalance = state.nativeBalances.get(wallet.address);
					if (nativeBalance) balances.push(nativeBalance);
				}
				for (const [tokenId, tokenBalances] of state.tokenBalances.entries()) {
					const balance = tokenBalances.get(wallet.address);
					if (balance) balances.push(balance);
				}
				const hasBalance = balances.some((b) => b.balance > 0n);
				results.set(wallet.address, { address: wallet.address, balances, hasBalance });
			}
			return { results, state };
		}
		throw error;
	}
}
