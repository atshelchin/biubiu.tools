/**
 * Token statistics composable for wallet sweep sidebar
 * Calculates balance statistics per token across all imported wallets
 */
import { SvelteMap } from 'svelte/reactivity';
import { step4State } from '@/features/wallet-sweep/stores/step4-state.svelte';
import { step3State } from '@/features/wallet-sweep/stores/step3-state.svelte';
import type { ERC20Token } from '$lib/types/token';

/**
 * Token balance statistics
 */
export interface TokenStats {
	tokenId: string;
	symbol: string;
	address?: string;
	decimals: number;
	totalBalance: bigint;
	addressCount: number;
}

interface UseTokenStatsOptions {
	/** Get the current chain ID */
	getCurrentChainId: () => number | undefined;
	/** Get network info by chain ID */
	getNetworkInfo: (chainId: number) => { symbol: string; name: string } | undefined;
}

export function useTokenStats(options: UseTokenStatsOptions) {
	const { getCurrentChainId, getNetworkInfo } = options;

	/**
	 * Calculate token statistics from imported wallets
	 */
	function calculateStats(): TokenStats[] {
		const importedWallets = step4State.importedWallets;
		const hasScanned = step4State.hasScanned;
		const selectedTokenIds = step3State.selectedTokenIds;

		if (!hasScanned || importedWallets.length === 0) {
			return [];
		}

		// Get current network info
		const chainId = getCurrentChainId();
		const networkInfo = chainId ? getNetworkInfo(chainId) : undefined;

		// Get all available tokens to find symbol and address
		const availableTokens =
			chainId && networkInfo
				? step3State.getAvailableTokens(chainId, networkInfo.symbol, networkInfo.name)
				: [];

		/* eslint-disable-next-line svelte/prefer-svelte-reactivity -- local lookup map, not reactive state */
		const tokenMap = new Map(availableTokens.map((t) => [t.id, t]));
		const stats = new SvelteMap<string, TokenStats>();

		// Initialize stats for selected tokens
		selectedTokenIds.forEach((tokenId) => {
			const token = tokenMap.get(tokenId);
			const symbol = token?.symbol || tokenId;
			const address = token?.type === 'erc20' ? (token as ERC20Token).address : undefined;
			const decimals = token?.decimals || 18;

			stats.set(tokenId, {
				tokenId,
				symbol,
				address,
				decimals,
				totalBalance: 0n,
				addressCount: 0
			});
		});

		// Calculate balances for each wallet
		importedWallets.forEach((wallet) => {
			if (!wallet.balances) return;

			selectedTokenIds.forEach((tokenId) => {
				const isNative = tokenId.endsWith(':native');
				let balance: string | undefined;

				if (isNative) {
					balance = wallet.balances?.native;
				} else {
					// Use tokenId directly as the key (format: chainId:address)
					balance = wallet.balances?.tokens?.[tokenId];
				}

				if (balance && balance !== '0') {
					const stat = stats.get(tokenId)!;
					// Balance is stored as bigint string (smallest unit)
					try {
						const balanceValue = BigInt(balance);
						stat.totalBalance += balanceValue;
						stat.addressCount += 1;
					} catch (e) {
						// Skip invalid balance values
						console.warn(`Invalid balance value: ${balance}`, e);
					}
				}
			});
		});

		return Array.from(stats.values()).filter((s) => s.addressCount > 0);
	}

	return {
		calculateStats
	};
}

export type TokenStatsInstance = ReturnType<typeof useTokenStats>;
