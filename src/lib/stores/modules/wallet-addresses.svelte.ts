/**
 * Wallet addresses state module.
 *
 * This module manages the state for wallet addresses in multi-step tools.
 * It handles importing wallets, storing labels, and provides batch operations
 * for performance.
 *
 * ## Usage
 *
 * ```typescript
 * const appState = createAppStateContext({
 *   toolId: 'my-tool',
 *   modules: {
 *     wallets: createWalletAddressesModule
 *   }
 * });
 *
 * // Add wallets
 * wallets.addWallet('0x...', 'My Wallet');
 *
 * // Batch add for performance
 * wallets.addWallets([
 *   { address: '0x...', label: 'Wallet 1' },
 *   { address: '0x...', label: 'Wallet 2' }
 * ]);
 * ```
 *
 * @module
 */

import { SvelteMap } from 'svelte/reactivity';
import type { Address } from 'viem';
import type { StateModule } from '../types';

/**
 * Wallet entry with address and optional label.
 */
export interface WalletEntry {
	address: Address;
	label?: string;
}

/**
 * Serializable state for persistence.
 */
export interface WalletAddressesSerializedState {
	wallets: WalletEntry[];
}

/**
 * Public interface for the wallet addresses module.
 */
export interface WalletAddressesModule extends StateModule<WalletAddressesSerializedState> {
	// Readonly state
	readonly addresses: readonly Address[];
	readonly labels: ReadonlyMap<Address, string>;

	// Derived state
	readonly count: number;
	readonly hasWallets: boolean;
	readonly entries: readonly WalletEntry[];

	// Actions
	addWallet(address: Address, label?: string): void;
	addWallets(wallets: WalletEntry[]): void;
	removeWallet(address: Address): void;
	updateLabel(address: Address, label: string): void;
	clearWallets(): void;
	hasAddress(address: Address): boolean;
	getLabel(address: Address): string | undefined;
}

/**
 * Create a new wallet addresses module instance.
 *
 * @returns A new WalletAddressesModule instance
 */
export function createWalletAddressesModule(): WalletAddressesModule {
	// Internal state - SvelteMap is already reactive, no need for $state wrapper
	let addresses = $state<Address[]>([]);
	const labels = new SvelteMap<Address, string>();

	return {
		// Getters for readonly access
		get addresses() {
			return addresses;
		},
		get labels() {
			return labels as ReadonlyMap<Address, string>;
		},

		// Derived state
		get count() {
			return addresses.length;
		},
		get hasWallets() {
			return addresses.length > 0;
		},
		get entries(): readonly WalletEntry[] {
			return addresses.map((address) => ({
				address,
				label: labels.get(address)
			}));
		},

		// Actions
		addWallet(address: Address, label?: string) {
			if (!addresses.includes(address)) {
				addresses = [...addresses, address];
				if (label) {
					labels.set(address, label);
				}
			}
		},

		addWallets(wallets: WalletEntry[]) {
			// Filter out duplicates - using Array.includes for simplicity
			const newWallets = wallets.filter((w) => !addresses.includes(w.address));

			if (newWallets.length === 0) return;

			// Batch update addresses array (single reactive update)
			addresses = [...addresses, ...newWallets.map((w) => w.address)];

			// Batch update labels
			for (const wallet of newWallets) {
				if (wallet.label) {
					labels.set(wallet.address, wallet.label);
				}
			}
		},

		removeWallet(address: Address) {
			addresses = addresses.filter((a) => a !== address);
			labels.delete(address);
		},

		updateLabel(address: Address, label: string) {
			if (addresses.includes(address)) {
				labels.set(address, label);
			}
		},

		clearWallets() {
			addresses = [];
			labels.clear();
		},

		hasAddress(address: Address): boolean {
			return addresses.includes(address);
		},

		getLabel(address: Address): string | undefined {
			return labels.get(address);
		},

		// StateModule implementation
		reset() {
			addresses = [];
			labels.clear();
		},

		serialize(): WalletAddressesSerializedState {
			return {
				wallets: addresses.map((address) => ({
					address,
					label: labels.get(address)
				}))
			};
		},

		deserialize(data: WalletAddressesSerializedState) {
			if (!data) return;
			const wallets = data.wallets ?? [];
			addresses = wallets.map((w) => w.address);
			labels.clear();
			for (const w of wallets) {
				if (w.label) {
					labels.set(w.address, w.label);
				}
			}
		}
	};
}
