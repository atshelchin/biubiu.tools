/**
 * Shared state for Step 3 token selection
 * Module-level state is shared across all component instances automatically
 */
import { SvelteSet } from 'svelte/reactivity';

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
	}
};
