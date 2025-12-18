/**
 * Shared state for Step 3 token selection
 * Module-level state is shared across all component instances automatically
 */
import { SvelteSet } from 'svelte/reactivity';
import type { NativeToken, ERC20Token } from '$lib/types/token';

// Module-level state class for reactivity
class Step3StateClass {
	selectedTokens = $state(new SvelteSet<string>()); // token IDs
	tokens = $state<(NativeToken | ERC20Token)[]>([]);

	// Toggle token selection
	toggleToken(tokenId: string) {
		if (this.selectedTokens.has(tokenId)) {
			this.selectedTokens.delete(tokenId);
		} else {
			this.selectedTokens.add(tokenId);
		}
	}

	// Add token
	addToken(tokenId: string) {
		this.selectedTokens.add(tokenId);
	}

	// Remove token
	removeToken(tokenId: string) {
		this.selectedTokens.delete(tokenId);
	}

	// Clear all tokens
	clearTokens() {
		this.selectedTokens.clear();
	}

	// Get selected tokens
	getSelectedTokens(): (NativeToken | ERC20Token)[] {
		return this.tokens.filter((t) => this.selectedTokens.has(t.id));
	}

	// Reset state
	reset() {
		this.selectedTokens.clear();
		this.tokens = [];
	}
}

// Export single shared instance
export const step3State = new Step3StateClass();
