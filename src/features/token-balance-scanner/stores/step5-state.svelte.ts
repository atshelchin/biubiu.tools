/**
 * Shared state for Step 5 scan results
 * Module-level state is shared across all component instances automatically
 */
import type { WalletBalance, ScanStatus, ScanProgress, ScanSummary } from '../types/scanner';

// Module-level state class for reactivity
class Step5StateClass {
	scanStatus = $state<ScanStatus>('idle');
	scanProgress = $state<ScanProgress>({
		current: 0,
		total: 0,
		percentage: 0
	});
	balances = $state<WalletBalance[]>([]);
	summary = $state<ScanSummary | null>(null);
	error = $state<string | null>(null);

	// Set scan status
	setScanStatus(status: ScanStatus) {
		this.scanStatus = status;
	}

	// Set error
	setError(error: string | null) {
		this.error = error;
	}

	// Set progress
	setProgress(progress: ScanProgress) {
		this.scanProgress = progress;
	}

	// Get progress
	get progress() {
		return this.scanProgress;
	}

	// Set balances
	setBalances(balances: WalletBalance[]) {
		this.balances = balances;
	}

	// Reset state
	reset() {
		this.scanStatus = 'idle';
		this.scanProgress = { current: 0, total: 0, percentage: 0 };
		this.balances = [];
		this.summary = null;
		this.error = null;
	}
}

// Export single shared instance
export const step5State = new Step5StateClass();
