/**
 * Shared state for Step 3 token selection
 * Module-level state is shared across all component instances automatically
 */
import { SvelteSet } from 'svelte/reactivity';
import { getTokensForChain } from '$lib/config/tokens';
import { loadCustomTokens } from '../utils/token-storage';
import type { Token, NativeToken } from '$lib/types/token';

// Module-level state - automatically shared across all imports
// SvelteSet is already reactive, no need for $state wrapper
let _selectedTokenIds = new SvelteSet<string>();

export const step3State = {
	get selectedTokenIds() {
		return _selectedTokenIds;
	},
	set selectedTokenIds(value: SvelteSet<string>) {
		_selectedTokenIds = value;
	},

	// Helper methods
	toggleToken(tokenId: string) {
		if (_selectedTokenIds.has(tokenId)) {
			_selectedTokenIds.delete(tokenId);
		} else {
			_selectedTokenIds.add(tokenId);
		}
		// Force reactivity by creating new SvelteSet
		_selectedTokenIds = new SvelteSet(_selectedTokenIds);
	},

	selectAll(tokenIds: string[]) {
		_selectedTokenIds = new SvelteSet(tokenIds);
	},

	deselectAll() {
		_selectedTokenIds = new SvelteSet();
	},

	getSelectedTokens() {
		return Array.from(_selectedTokenIds);
	},

	getSelectedCount() {
		return _selectedTokenIds.size;
	},

	// Get all available tokens for a chain (native + predefined ERC20 + custom)
	// Note: This requires network config to be passed in, as we can't access connectStore in a module
	getAvailableTokens(chainId: number, networkSymbol?: string, networkName?: string): Token[] {
		const allTokens: Token[] = [];

		// Step 1: Auto-generate native token if network info provided
		if (networkSymbol && networkName) {
			const nativeToken: NativeToken = {
				id: `${chainId}:native`,
				type: 'native',
				symbol: networkSymbol,
				name: networkName,
				decimals: 18,
				chainId,
				logoUrl: ''
			};
			allTokens.push(nativeToken);
		}

		// Step 2: Add predefined ERC20 tokens
		const erc20Tokens = getTokensForChain(chainId);
		if (erc20Tokens.length > 0) {
			allTokens.push(...erc20Tokens);
		}

		// Step 3: Add custom tokens
		const custom = loadCustomTokens(chainId);
		allTokens.push(...custom);

		return allTokens;
	}
};
