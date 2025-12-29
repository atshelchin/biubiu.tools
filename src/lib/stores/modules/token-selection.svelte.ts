/**
 * Token selection state module.
 *
 * This module manages the state for token selection in multi-step tools.
 * It handles available tokens, selected tokens, and provides actions
 * for toggling, selecting all, and clearing selections.
 *
 * ## Usage
 *
 * ```typescript
 * const appState = createAppStateContext({
 *   toolId: 'my-tool',
 *   modules: {
 *     tokenSelection: createTokenSelectionModule
 *   }
 * });
 *
 * // Set available tokens
 * tokenSelection.setTokens(tokens);
 *
 * // Toggle selection
 * tokenSelection.toggle('token-id');
 *
 * // Get selected tokens
 * const selected = tokenSelection.selectedTokens;
 * ```
 *
 * @module
 */

import { SvelteSet } from 'svelte/reactivity';
import type { StateModule } from '../types';
import type { NativeToken, ERC20Token } from '$lib/types/token';

/**
 * Union type for all supported token types.
 */
export type Token = NativeToken | ERC20Token;

/**
 * Serializable state for persistence.
 */
export interface TokenSelectionSerializedState {
	selectedIds: string[];
	tokens: Token[];
}

/**
 * Public interface for the token selection module.
 */
export interface TokenSelectionModule extends StateModule<TokenSelectionSerializedState> {
	// Readonly state
	readonly tokens: Token[];
	readonly selectedIds: ReadonlySet<string>;

	// Derived state
	readonly selectedCount: number;
	readonly selectedTokens: Token[];
	readonly hasSelection: boolean;
	readonly allSelected: boolean;

	// Actions
	setTokens(tokens: Token[]): void;
	toggle(tokenId: string): void;
	select(tokenId: string): void;
	deselect(tokenId: string): void;
	selectAll(): void;
	selectByIds(ids: string[]): void;
	clear(): void;
}

/**
 * Create a new token selection module instance.
 *
 * @returns A new TokenSelectionModule instance
 */
export function createTokenSelectionModule(): TokenSelectionModule {
	// Internal state - SvelteSet is already reactive, no need for $state wrapper
	let selectedIds = new SvelteSet<string>();
	let tokens = $state<Token[]>([]);

	return {
		// Getters for readonly access
		get tokens() {
			return tokens;
		},
		get selectedIds() {
			return selectedIds as ReadonlySet<string>;
		},

		// Derived state
		get selectedCount() {
			return selectedIds.size;
		},
		get selectedTokens() {
			return tokens.filter((t) => selectedIds.has(t.id));
		},
		get hasSelection() {
			return selectedIds.size > 0;
		},
		get allSelected() {
			return tokens.length > 0 && selectedIds.size === tokens.length;
		},

		// Actions
		setTokens(newTokens: Token[]) {
			tokens = newTokens;
			// Clear selections that are no longer valid
			const validIds = new SvelteSet(newTokens.map((t) => t.id));
			for (const id of selectedIds) {
				if (!validIds.has(id)) {
					selectedIds.delete(id);
				}
			}
		},

		toggle(tokenId: string) {
			if (selectedIds.has(tokenId)) {
				selectedIds.delete(tokenId);
			} else {
				selectedIds.add(tokenId);
			}
		},

		select(tokenId: string) {
			selectedIds.add(tokenId);
		},

		deselect(tokenId: string) {
			selectedIds.delete(tokenId);
		},

		selectAll() {
			selectedIds = new SvelteSet(tokens.map((t) => t.id));
		},

		selectByIds(ids: string[]) {
			selectedIds = new SvelteSet(ids);
		},

		clear() {
			selectedIds.clear();
		},

		// StateModule implementation
		reset() {
			selectedIds = new SvelteSet<string>();
			tokens = [];
		},

		serialize(): TokenSelectionSerializedState {
			return {
				selectedIds: Array.from(selectedIds),
				tokens
			};
		},

		deserialize(data: TokenSelectionSerializedState) {
			if (!data) return;
			tokens = data.tokens ?? [];
			selectedIds = new SvelteSet(data.selectedIds ?? []);
		}
	};
}
