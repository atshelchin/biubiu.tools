// Local storage management for custom networks and tokens
import type { Network, Token } from '../types';

const STORAGE_KEYS = {
	CUSTOM_NETWORKS: 'drain_balance_custom_networks',
	CUSTOM_TOKENS: 'drain_balance_custom_tokens'
};

export class StorageManager {
	// Networks
	static getCustomNetworks(): Network[] {
		if (typeof window === 'undefined') return [];

		try {
			const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_NETWORKS);
			return stored ? JSON.parse(stored) : [];
		} catch (error) {
			console.error('Failed to load custom networks:', error);
			return [];
		}
	}

	static saveCustomNetworks(networks: Network[]): void {
		if (typeof window === 'undefined') return;

		try {
			localStorage.setItem(STORAGE_KEYS.CUSTOM_NETWORKS, JSON.stringify(networks));
		} catch (error) {
			console.error('Failed to save custom networks:', error);
		}
	}

	static addCustomNetwork(network: Network): void {
		const networks = this.getCustomNetworks();
		// Check if network already exists
		const exists = networks.some(n => n.chainId === network.chainId);
		if (!exists) {
			networks.push({ ...network, isCustom: true });
			this.saveCustomNetworks(networks);
		}
	}

	static removeCustomNetwork(chainId: number): void {
		const networks = this.getCustomNetworks();
		const filtered = networks.filter(n => n.chainId !== chainId);
		this.saveCustomNetworks(filtered);
	}

	static updateCustomNetwork(oldChainId: number, updatedNetwork: Network): void {
		const networks = this.getCustomNetworks();
		const index = networks.findIndex(n => n.chainId === oldChainId);
		if (index !== -1) {
			networks[index] = { ...updatedNetwork, isCustom: true };
			this.saveCustomNetworks(networks);
		}
	}

	// Network overrides for built-in networks
	static getNetworkOverrides(): Record<number, Partial<Network>> {
		if (typeof window === 'undefined') return {};

		try {
			const stored = localStorage.getItem('drain_balance_network_overrides');
			return stored ? JSON.parse(stored) : {};
		} catch (error) {
			console.error('Failed to load network overrides:', error);
			return {};
		}
	}

	static saveNetworkOverride(network: Network): void {
		if (typeof window === 'undefined') return;

		try {
			const overrides = this.getNetworkOverrides();
			overrides[network.chainId] = network;
			localStorage.setItem('drain_balance_network_overrides', JSON.stringify(overrides));
		} catch (error) {
			console.error('Failed to save network override:', error);
		}
	}

	static removeNetworkOverride(chainId: number): void {
		if (typeof window === 'undefined') return;

		try {
			const overrides = this.getNetworkOverrides();
			delete overrides[chainId];
			localStorage.setItem('drain_balance_network_overrides', JSON.stringify(overrides));
		} catch (error) {
			console.error('Failed to remove network override:', error);
		}
	}

	// Tokens
	static getCustomTokens(chainId: number): Token[] {
		if (typeof window === 'undefined') return [];

		try {
			const stored = localStorage.getItem(`${STORAGE_KEYS.CUSTOM_TOKENS}_${chainId}`);
			return stored ? JSON.parse(stored) : [];
		} catch (error) {
			console.error('Failed to load custom tokens:', error);
			return [];
		}
	}

	static saveCustomTokens(chainId: number, tokens: Token[]): void {
		if (typeof window === 'undefined') return;

		try {
			localStorage.setItem(`${STORAGE_KEYS.CUSTOM_TOKENS}_${chainId}`, JSON.stringify(tokens));
		} catch (error) {
			console.error('Failed to save custom tokens:', error);
		}
	}

	static addCustomToken(chainId: number, token: Token): void {
		const tokens = this.getCustomTokens(chainId);
		// Check if token already exists
		const exists = tokens.some(t => t.address.toLowerCase() === token.address.toLowerCase());
		if (!exists) {
			tokens.push({ ...token, isCustom: true });
			this.saveCustomTokens(chainId, tokens);
		}
	}

	static removeCustomToken(chainId: number, address: string): void {
		const tokens = this.getCustomTokens(chainId);
		const filtered = tokens.filter(t => t.address.toLowerCase() !== address.toLowerCase());
		this.saveCustomTokens(chainId, filtered);
	}
}