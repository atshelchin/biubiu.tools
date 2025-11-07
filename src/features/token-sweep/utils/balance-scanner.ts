/**
 * Balance scanning utilities for checking wallet balances
 */
import type { PublicClient } from 'viem';
import type { Address } from 'viem';
import type { ImportedWallet } from '../types/wallet';

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
 */
export async function scanMultipleWallets(
	client: PublicClient,
	wallets: ImportedWallet[],
	tokenAddresses: { address?: Address; decimals: number; chainId: number; tokenId: string }[],
	chainId: number,
	onProgress?: (progress: ScanProgress) => void
): Promise<Map<Address, WalletBalanceResult>> {
	const results = new Map<Address, WalletBalanceResult>();
	const total = wallets.length;

	for (let i = 0; i < wallets.length; i++) {
		const wallet = wallets[i];

		// Scan this wallet
		const result = await scanWalletBalances(client, wallet, tokenAddresses, chainId);
		results.set(wallet.address, result);

		// Report progress
		if (onProgress) {
			onProgress({
				current: i + 1,
				total,
				percentage: Math.round(((i + 1) / total) * 100)
			});
		}
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
