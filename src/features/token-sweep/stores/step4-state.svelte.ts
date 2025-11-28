/**
 * Shared state for Step 4 wallet import
 * Module-level state is shared across all component instances automatically
 */
import { SvelteSet } from 'svelte/reactivity';
import type { ImportedWallet } from '../types/wallet';
import type { ScanState } from '../utils/balance-scanner';

// Module-level state - automatically shared across all imports
let importedWallets = $state<ImportedWallet[]>([]);
let isScanning = $state(false);
let scanProgress = $state(0);
let hasScanned = $state(false);

// Resumable scan state
let scanState = $state<ScanState | null>(null);
let isRateLimited = $state(false);
let rateLimitMessage = $state<string>('');
let canResumeScan = $state(false);

export const step4State = {
	get importedWallets() {
		return importedWallets;
	},
	set importedWallets(value: ImportedWallet[]) {
		importedWallets = value;
	},
	get isScanning() {
		return isScanning;
	},
	set isScanning(value: boolean) {
		isScanning = value;
	},
	get scanProgress() {
		return scanProgress;
	},
	set scanProgress(value: number) {
		scanProgress = value;
	},
	get hasScanned() {
		return hasScanned;
	},
	set hasScanned(value: boolean) {
		hasScanned = value;
	},

	// Helper methods
	addWallets(wallets: ImportedWallet[]) {
		// Avoid duplicates
		const existing = new SvelteSet(importedWallets.map((w) => w.address.toLowerCase()));
		const newWallets = wallets.filter((w) => !existing.has(w.address.toLowerCase()));
		importedWallets = [...importedWallets, ...newWallets];
	},

	clearWallets() {
		importedWallets = [];
		hasScanned = false;
		scanProgress = 0;
	},

	removeWallet(address: string) {
		importedWallets = importedWallets.filter(
			(w) => w.address.toLowerCase() !== address.toLowerCase()
		);
	},

	getWalletsWithBalance() {
		return importedWallets.filter((w) => w.hasBalance);
	},

	// Update wallet balance information
	updateWalletBalance(
		address: string,
		hasBalance: boolean,
		balances?: { native?: string; tokens?: Record<string, string> }
	) {
		importedWallets = importedWallets.map((w) => {
			if (w.address.toLowerCase() === address.toLowerCase()) {
				return { ...w, hasBalance, balances };
			}
			return w;
		});
	},

	// Batch update wallet balances
	updateWalletBalances(
		updates: Map<
			string,
			{ hasBalance: boolean; balances?: { native?: string; tokens?: Record<string, string> } }
		>
	) {
		importedWallets = importedWallets.map((w) => {
			const update = updates.get(w.address.toLowerCase());
			if (update) {
				return { ...w, ...update };
			}
			return w;
		});
	},

	// Reset scan state
	resetScanState() {
		hasScanned = false;
		scanProgress = 0;
		isScanning = false;
		scanState = null;
		isRateLimited = false;
		rateLimitMessage = '';
		canResumeScan = false;
	},

	// Resumable scan state management
	get scanState() {
		return scanState;
	},
	set scanState(value: ScanState | null) {
		scanState = value;
	},

	get isRateLimited() {
		return isRateLimited;
	},
	set isRateLimited(value: boolean) {
		isRateLimited = value;
	},

	get rateLimitMessage() {
		return rateLimitMessage;
	},
	set rateLimitMessage(value: string) {
		rateLimitMessage = value;
	},

	get canResumeScan() {
		return canResumeScan;
	},
	set canResumeScan(value: boolean) {
		canResumeScan = value;
	},

	// Handle rate limit error
	handleRateLimitError(message: string, state: ScanState) {
		isRateLimited = true;
		rateLimitMessage = message;
		scanState = state;
		canResumeScan = true;
		isScanning = false;
	},

	// Clear rate limit state
	clearRateLimitError() {
		isRateLimited = false;
		rateLimitMessage = '';
	}
};
