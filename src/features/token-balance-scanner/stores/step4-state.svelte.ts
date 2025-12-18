/**
 * Shared state for Step 4 wallet addresses
 * Module-level state is shared across all component instances automatically
 */
import type { Address } from 'viem';
import { SvelteMap } from 'svelte/reactivity';

// Module-level state class for reactivity
class Step4StateClass {
	wallets = $state<Address[]>([]);
	walletLabels = $state(new SvelteMap<Address, string>());

	// Add wallet
	addWallet(address: Address, label?: string) {
		if (!this.wallets.includes(address)) {
			this.wallets = [...this.wallets, address];
			if (label) {
				this.walletLabels.set(address, label);
			}
		}
	}

	// Add multiple wallets at once (batch operation for performance)
	addWallets(items: Array<{ address: Address; label?: string }>) {
		// Filter out duplicates
		const existingSet = new Set(this.wallets);
		const newItems = items.filter((item) => !existingSet.has(item.address));

		if (newItems.length === 0) return;

		// Batch update wallets array (single reactive update)
		this.wallets = [...this.wallets, ...newItems.map((item) => item.address)];

		// Batch update labels
		for (const item of newItems) {
			if (item.label) {
				this.walletLabels.set(item.address, item.label);
			}
		}
	}

	// Remove wallet
	removeWallet(address: Address) {
		this.wallets = this.wallets.filter((w) => w !== address);
		this.walletLabels.delete(address);
	}

	// Clear all wallets
	clearWallets() {
		this.wallets = [];
		this.walletLabels.clear();
	}

	// Reset state
	reset() {
		this.wallets = [];
		this.walletLabels.clear();
	}
}

// Export single shared instance
export const step4State = new Step4StateClass();
