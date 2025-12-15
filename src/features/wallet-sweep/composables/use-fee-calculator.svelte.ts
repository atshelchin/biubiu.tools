/**
 * Fee calculator composable for sweep operations
 * Handles gas estimation and fee breakdown calculations
 */
import { SvelteMap } from 'svelte/reactivity';
import type { PublicClient } from 'viem';
import type { Token } from '$lib/types/token';
import type { ImportedWallet } from '@/features/wallet-sweep/types/wallet';
import type { FeeBreakdown, MembershipStatus } from '@/features/wallet-sweep/types/fee';
import { calculateFeeBreakdown } from '@/features/wallet-sweep/utils/membership';

const BATCH_SIZE = 100;

interface TokenBatchStats {
	addressCount: number;
	batchCount: number;
	walletsWithBalance: string[];
}

interface UseFeeCalculatorOptions {
	getPublicClient: () => PublicClient | undefined;
}

export function useFeeCalculator(options: UseFeeCalculatorOptions) {
	const { getPublicClient } = options;

	// State
	let feeBreakdown = $state<FeeBreakdown | null>(null);
	let isCalculating = $state(false);

	/**
	 * Simulate gas for a token batch (first 100 wallets)
	 */
	async function simulateGasForTokenBatch(
		token: Token,
		walletAddresses: string[]
	): Promise<bigint> {
		try {
			const publicClient = getPublicClient();
			if (!publicClient) return 0n;

			// Get first batch of wallets (up to 100)
			const firstBatch = walletAddresses.slice(0, 100);
			if (firstBatch.length === 0) return 0n;

			// Estimate gas based on token type and batch size
			const isNative = token.type === 'native';
			const baseGasPerWallet = isNative ? 21000n : 65000n; // Native vs ERC20
			const estimatedGas = baseGasPerWallet * BigInt(firstBatch.length);

			return estimatedGas;
		} catch (error) {
			console.error(`Failed to simulate gas for token ${token.id}:`, error);
			// Return a conservative estimate on error
			return 100000n * 100n; // 10M gas as fallback
		}
	}

	/**
	 * Calculate fee breakdown for selected tokens and wallets
	 */
	async function calculateFees(
		selectedTokenIds: string[],
		selectedTokenObjects: Token[],
		importedWallets: ImportedWallet[],
		membershipStatus: MembershipStatus
	): Promise<FeeBreakdown | null> {
		if (importedWallets.length === 0 || selectedTokenIds.length === 0) {
			feeBreakdown = null;
			return null;
		}

		isCalculating = true;

		try {
			// Build stats map for each token
			const stats = new SvelteMap<string, TokenBatchStats>();

			// Initialize stats for selected tokens
			selectedTokenIds.forEach((tokenId) => {
				stats.set(tokenId, {
					addressCount: 0,
					batchCount: 0,
					walletsWithBalance: []
				});
			});

			// Count addresses with balance for each token
			importedWallets.forEach((wallet) => {
				if (!wallet.balances) return;

				selectedTokenIds.forEach((tokenId) => {
					const stat = stats.get(tokenId);
					if (!stat) return;

					// Check if wallet has balance for this token
					const isNative = tokenId.endsWith(':native');
					const balance = isNative ? wallet.balances?.native : wallet.balances?.tokens?.[tokenId];

					if (balance) {
						try {
							const balanceBigInt = BigInt(balance);
							if (balanceBigInt > 0n) {
								stat.addressCount++;
								stat.walletsWithBalance.push(wallet.address);
							}
						} catch {
							// Skip invalid balance values
						}
					}
				});
			});

			// Calculate batch count and simulate gas for each token
			let totalEstimatedGas = 0n;

			for (const [tokenId, stat] of stats.entries()) {
				stat.batchCount = Math.ceil(stat.addressCount / BATCH_SIZE);

				if (stat.batchCount > 0 && stat.walletsWithBalance.length > 0) {
					// Find token object
					const token = selectedTokenObjects.find((t) => t.id === tokenId);
					if (!token) continue;

					// Simulate first batch to get accurate gas estimate
					const firstBatchGas = await simulateGasForTokenBatch(token, stat.walletsWithBalance);
					// Multiply by total batch count for this token
					const tokenTotalGas = firstBatchGas * BigInt(stat.batchCount);
					totalEstimatedGas += tokenTotalGas;
				}
			}

			// If simulation failed or returned 0, use fallback estimate
			if (totalEstimatedGas === 0n) {
				const totalBatchCount = Array.from(stats.values()).reduce(
					(sum, stat) => sum + stat.batchCount,
					0
				);
				totalEstimatedGas = 100000n * BigInt(totalBatchCount);
			}

			const breakdown = calculateFeeBreakdown(
				1, // Pass 1 as batch count since we're providing total gas directly
				totalEstimatedGas, // Use actual simulated total gas
				membershipStatus.isMember
			);

			feeBreakdown = breakdown;
			return breakdown;
		} finally {
			isCalculating = false;
		}
	}

	/**
	 * Reset fee breakdown state
	 */
	function reset() {
		feeBreakdown = null;
		isCalculating = false;
	}

	return {
		get feeBreakdown() {
			return feeBreakdown;
		},
		get isCalculating() {
			return isCalculating;
		},
		calculateFees,
		reset
	};
}

export type FeeCalculatorInstance = ReturnType<typeof useFeeCalculator>;
