/**
 * Wallet balance composable for loading and managing account balances
 * Uses Svelte 5 runes for reactive state management
 */

import type { PublicClient } from 'viem';
import { formatBalance } from '$lib/utils/wallet-utils';

export function useWalletBalance() {
	let balances = $state<Map<string, string>>(new Map());

	/**
	 * Load balance for a single account
	 * @param publicClient - Viem public client
	 * @param address - Account address
	 * @returns Formatted balance string
	 */
	async function loadBalance(publicClient: PublicClient, address: string): Promise<string> {
		try {
			const balance = await publicClient.getBalance({
				address: address as `0x${string}`
			});

			const formatted = formatBalance(balance);
			balances.set(address.toLowerCase(), formatted);
			return formatted;
		} catch (error) {
			console.error(`Failed to load balance for ${address}:`, error);
			const fallback = '0.0000';
			balances.set(address.toLowerCase(), fallback);
			return fallback;
		}
	}

	/**
	 * Load balances for multiple accounts
	 * @param publicClient - Viem public client
	 * @param addresses - Array of account addresses
	 */
	async function loadBalances(publicClient: PublicClient, addresses: string[]): Promise<void> {
		if (!publicClient) {
			console.error('Public client not available');
			return;
		}

		const newBalances = new Map<string, string>();

		await Promise.all(
			addresses.map(async (address) => {
				try {
					const balance = await publicClient.getBalance({
						address: address as `0x${string}`
					});

					const formatted = formatBalance(balance);
					newBalances.set(address.toLowerCase(), formatted);
				} catch (error) {
					console.error(`Failed to load balance for ${address}:`, error);
					newBalances.set(address.toLowerCase(), '0.0000');
				}
			})
		);

		balances = newBalances;
	}

	/**
	 * Get balance for a specific address
	 * @param address - Account address
	 * @returns Formatted balance or '...' if not loaded
	 */
	function getBalance(address: string): string {
		return balances.get(address.toLowerCase()) || '...';
	}

	/**
	 * Clear all balances
	 */
	function clearBalances(): void {
		balances = new Map();
	}

	return {
		get balances() {
			return balances;
		},
		loadBalance,
		loadBalances,
		getBalance,
		clearBalances
	};
}
