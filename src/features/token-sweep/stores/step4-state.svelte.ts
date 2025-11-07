/**
 * Shared state for Step 4 wallet import
 * Module-level state is shared across all component instances automatically
 */
import { SvelteSet } from 'svelte/reactivity';
import type { ImportedWallet } from '../types/wallet';

// Module-level state - automatically shared across all imports
let importedWallets = $state<ImportedWallet[]>([]);
let isScanning = $state(false);
let scanProgress = $state(0);
let hasScanned = $state(false);

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
	}
};
