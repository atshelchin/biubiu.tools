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
