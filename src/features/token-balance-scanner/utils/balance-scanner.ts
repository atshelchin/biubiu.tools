import { createPublicClient, http, formatUnits, type Address } from 'viem';
import type { NativeToken, ERC20Token } from '$lib/types/token';
import type { WalletBalance, TokenBalance, ScanProgress } from '../types/scanner';

const ERC20_ABI = [
	{
		inputs: [{ name: 'account', type: 'address' }],
		name: 'balanceOf',
		outputs: [{ name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function'
	}
] as const;

/**
 * Scan balances for a single wallet
 */
export async function scanWalletBalances(
	wallet: Address,
	tokens: (NativeToken | ERC20Token)[],
	rpcUrl: string
): Promise<TokenBalance[]> {
	const client = createPublicClient({
		transport: http(rpcUrl)
	});

	const balances: TokenBalance[] = [];

	for (const token of tokens) {
		try {
			let balance: bigint;

			if (token.type === 'native') {
				// Get native token balance
				balance = await client.getBalance({ address: wallet });
			} else {
				// Get ERC20 balance
				balance = await client.readContract({
					address: token.address,
					abi: ERC20_ABI,
					functionName: 'balanceOf',
					args: [wallet]
				});
			}

			const formattedBalance = formatUnits(balance, token.decimals);

			balances.push({
				token,
				balance: balance.toString(),
				formattedBalance
			});
		} catch (error) {
			console.error(`Failed to get balance for ${token.symbol}:`, error);
			// Add zero balance on error
			balances.push({
				token,
				balance: '0',
				formattedBalance: '0'
			});
		}
	}

	return balances;
}

/**
 * Scan balances for multiple wallets
 */
export async function scanMultipleWallets(
	wallets: Address[],
	tokens: (NativeToken | ERC20Token)[],
	rpcUrl: string,
	onProgress?: (progress: ScanProgress) => void
): Promise<WalletBalance[]> {
	const results: WalletBalance[] = [];
	const total = wallets.length;

	for (let i = 0; i < wallets.length; i++) {
		const wallet = wallets[i];

		// Report progress
		if (onProgress) {
			onProgress({
				current: i + 1,
				total,
				percentage: Math.round(((i + 1) / total) * 100),
				currentWallet: wallet
			});
		}

		try {
			const balances = await scanWalletBalances(wallet, tokens, rpcUrl);

			results.push({
				address: wallet,
				balances
			});
		} catch (error) {
			console.error(`Failed to scan wallet ${wallet}:`, error);
			results.push({
				address: wallet,
				balances: []
			});
		}
	}

	return results;
}

/**
 * Calculate total balance for a token across all wallets
 */
export function calculateTotalBalance(walletBalances: WalletBalance[], tokenId: string): string {
	let total = BigInt(0);

	for (const wallet of walletBalances) {
		const tokenBalance = wallet.balances.find((b) => b.token.id === tokenId);
		if (tokenBalance) {
			total += BigInt(tokenBalance.balance);
		}
	}

	// Get decimals from first wallet that has this token
	const decimals =
		walletBalances.flatMap((w) => w.balances).find((b) => b.token.id === tokenId)?.token.decimals ||
		18;

	return formatUnits(total, decimals);
}

/**
 * Export balances to CSV format
 */
export function exportToCSV(walletBalances: WalletBalance[]): string {
	const lines: string[] = [];

	// Header
	const tokens = walletBalances[0]?.balances.map((b) => b.token.symbol) || [];
	lines.push(['Wallet Address', ...tokens].join(','));

	// Data rows
	for (const wallet of walletBalances) {
		const balances = wallet.balances.map((b) => b.formattedBalance);
		lines.push([wallet.address, ...balances].join(','));
	}

	return lines.join('\n');
}

/**
 * Export balances to JSON format
 */
export function exportToJSON(walletBalances: WalletBalance[]): string {
	return JSON.stringify(walletBalances, null, 2);
}
