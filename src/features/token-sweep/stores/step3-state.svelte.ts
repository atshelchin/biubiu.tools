/**
 * Shared state for Step 3 token selection
 * Module-level state is shared across all component instances automatically
 */
import { SvelteSet } from 'svelte/reactivity';
import { getTokensForChain } from '$lib/config/tokens';
import { loadCustomTokens } from '../utils/token-storage';
import type { Token, NativeToken } from '$lib/types/token';

// Module-level state - automatically shared across all imports
let selectedTokenIds = new SvelteSet<string>();

export const step3State = {
	get selectedTokenIds() {
		return selectedTokenIds;
	},
	set selectedTokenIds(value: SvelteSet<string>) {
		selectedTokenIds = value;
	},

	// Helper methods
	toggleToken(tokenId: string) {
		if (selectedTokenIds.has(tokenId)) {
			selectedTokenIds.delete(tokenId);
		} else {
			selectedTokenIds.add(tokenId);
		}
		// Force reactivity
		selectedTokenIds = new SvelteSet(selectedTokenIds);
	},

	selectAll(tokenIds: string[]) {
		selectedTokenIds = new SvelteSet(tokenIds);
	},

	deselectAll() {
		selectedTokenIds = new SvelteSet();
	},

	getSelectedTokens() {
		return Array.from(selectedTokenIds);
	},

	getSelectedCount() {
		return selectedTokenIds.size;
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
