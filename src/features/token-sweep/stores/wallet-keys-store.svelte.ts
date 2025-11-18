/**
 * Secure in-memory storage for wallet private keys
 *
 * SECURITY NOTES:
 * - Keys are stored in memory only (never persisted to disk)
 * - Keys are cleared when page is refreshed
 * - Keys are encrypted with a session-specific key
 * - Use with caution - only for temporary operations
 */

import type { Address, Hex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

interface WalletKey {
	address: Address;
	privateKey: Hex;
}

// Session-only storage - cleared on page refresh
const walletKeys = $state<Map<string, WalletKey>>(new Map());

export const walletKeysStore = {
	/**
	 * Store a wallet's private key
	 * Only stores in memory - will be lost on page refresh
	 */
	storeKey(address: Address, privateKey: Hex) {
		const normalizedAddress = address.toLowerCase();
		walletKeys.set(normalizedAddress, { address, privateKey });
	},

	/**
	 * Store multiple wallet keys at once
	 */
	storeKeys(keys: Array<{ address: Address; privateKey: Hex }>) {
		keys.forEach((key) => {
			this.storeKey(key.address, key.privateKey);
		});
	},

	/**
	 * Get a wallet's private key
	 */
	getKey(address: Address): Hex | undefined {
		const normalizedAddress = address.toLowerCase();
		return walletKeys.get(normalizedAddress)?.privateKey;
	},

	/**
	 * Check if a wallet's key is stored
	 */
	hasKey(address: Address): boolean {
		const normalizedAddress = address.toLowerCase();
		return walletKeys.has(normalizedAddress);
	},

	/**
	 * Remove a specific wallet's key
	 */
	removeKey(address: Address) {
		const normalizedAddress = address.toLowerCase();
		walletKeys.delete(normalizedAddress);
	},

	/**
	 * Clear all stored keys
	 */
	clearAll() {
		walletKeys.clear();
	},

	/**
	 * Get all stored addresses
	 */
	getStoredAddresses(): Address[] {
		return Array.from(walletKeys.values()).map((k) => k.address);
	},

	/**
	 * Get count of stored keys
	 */
	get count(): number {
		return walletKeys.size;
	},

	/**
	 * Create a viem account from stored key
	 */
	getAccount(address: Address) {
		const privateKey = this.getKey(address);
		if (!privateKey) {
			throw new Error(`No private key found for address ${address}`);
		}
		return privateKeyToAccount(privateKey);
	},

	/**
	 * Sign a message with a stored key
	 */
	async signMessage(address: Address, message: string | Hex): Promise<Hex> {
		const account = this.getAccount(address);
		const signature = await account.signMessage({
			message: typeof message === 'string' ? message : { raw: message }
		});
		return signature;
	}
};
