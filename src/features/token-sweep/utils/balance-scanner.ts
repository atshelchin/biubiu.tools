/**
 * Balance scanning utilities for checking wallet balances
 */
import type { PublicClient } from 'viem';
import type { Address } from 'viem';
import { encodeFunctionData, decodeFunctionResult } from 'viem';
import type { ImportedWallet } from '../types/wallet';

// Multicall3 contract address (universal across all chains)
const MULTICALL3_ADDRESS = '0x2055A30B00555e7cAd48b1756eac4f917781489b' as Address;

// Batch size for multicall queries (1000 addresses per batch)
const BATCH_SIZE = 1000;

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
	chainId: number
): Promise<Map<Address, TokenBalance>> {
	const results = new Map<Address, TokenBalance>();

	// Process in batches of BATCH_SIZE
	for (let i = 0; i < addresses.length; i += BATCH_SIZE) {
		const batch = addresses.slice(i, i + BATCH_SIZE);

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
	chainId: number
): Promise<Map<Address, TokenBalance>> {
	const results = new Map<Address, TokenBalance>();
	const tokenId = `${chainId}:${tokenAddress.toLowerCase()}`;

	// Process in batches of BATCH_SIZE
	for (let i = 0; i < addresses.length; i += BATCH_SIZE) {
		const batch = addresses.slice(i, i + BATCH_SIZE);

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

	// Total steps: 1 (native) + N (ERC20 tokens)
	const totalSteps = 1 + tokenAddresses.filter((t) => t.address).length;
	let completedSteps = 0;

	// Step 1: Batch scan native balances for all addresses
	const nativeBalances = await batchScanNativeBalances(client, addresses, chainId);
	completedSteps++;

	if (onProgress) {
		onProgress({
			current: completedSteps,
			total: totalSteps,
			percentage: Math.round((completedSteps / totalSteps) * 100)
		});
	}

	// Step 2: Batch scan each ERC20 token for all addresses
	const tokenBalancesMaps = new Map<string, Map<Address, TokenBalance>>();

	for (const token of tokenAddresses) {
		if (token.address) {
			const balances = await batchScanERC20Balances(
				client,
				addresses,
				token.address,
				token.decimals,
				chainId
			);
			tokenBalancesMaps.set(token.tokenId, balances);

			completedSteps++;
			if (onProgress) {
				onProgress({
					current: completedSteps,
					total: totalSteps,
					percentage: Math.round((completedSteps / totalSteps) * 100)
				});
			}
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
