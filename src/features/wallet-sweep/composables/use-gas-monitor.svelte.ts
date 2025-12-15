/**
 * Gas balance monitoring composable
 * Monitors temporary wallet gas balance and handles insufficient gas scenarios
 */
import type { PublicClient, Address } from 'viem';
import type { FeeBreakdown, TemporaryWallet } from '@/features/wallet-sweep/types/fee';

interface UseGasMonitorOptions {
	getPublicClient: () => PublicClient | undefined;
}

export function useGasMonitor(options: UseGasMonitorOptions) {
	const { getPublicClient } = options;

	// State
	let isPausedForGas = $state(false);
	let requiredGas = $state<bigint>(0n);
	let currentGasBalance = $state<bigint>(0n);

	/**
	 * Check if temporary wallet has enough gas balance
	 * @returns true if has enough gas, false otherwise
	 */
	async function checkGasBalance(
		temporaryWallet: TemporaryWallet | null,
		feeBreakdown: FeeBreakdown | null
	): Promise<boolean> {
		if (!temporaryWallet) return false;

		const publicClient = getPublicClient();
		if (!publicClient) return false;

		try {
			const balance = await publicClient.getBalance({
				address: temporaryWallet.address as Address
			});

			currentGasBalance = balance;

			// Check if we have enough gas (require at least estimated gas cost)
			if (feeBreakdown && balance < feeBreakdown.estimatedGasFee) {
				requiredGas = feeBreakdown.estimatedGasFee - balance;
				return false;
			}

			return true;
		} catch (error) {
			console.error('Failed to check gas balance:', error);
			return false;
		}
	}

	/**
	 * Mark as paused for insufficient gas
	 */
	function pauseForGas() {
		isPausedForGas = true;
	}

	/**
	 * Try to resume after gas refill
	 * @returns true if can resume (has enough gas now)
	 */
	async function tryResume(
		temporaryWallet: TemporaryWallet | null,
		feeBreakdown: FeeBreakdown | null
	): Promise<boolean> {
		const hasEnoughGas = await checkGasBalance(temporaryWallet, feeBreakdown);

		if (hasEnoughGas) {
			isPausedForGas = false;
			return true;
		}

		return false;
	}

	/**
	 * Reset gas monitor state
	 */
	function reset() {
		isPausedForGas = false;
		requiredGas = 0n;
		currentGasBalance = 0n;
	}

	/**
	 * Format gas amount for display
	 */
	function formatGasAmount(amount: bigint): string {
		return (Number(amount) / 1e18).toFixed(6);
	}

	return {
		get isPausedForGas() {
			return isPausedForGas;
		},
		get requiredGas() {
			return requiredGas;
		},
		get currentGasBalance() {
			return currentGasBalance;
		},
		checkGasBalance,
		pauseForGas,
		tryResume,
		reset,
		formatGasAmount
	};
}

export type GasMonitorInstance = ReturnType<typeof useGasMonitor>;
