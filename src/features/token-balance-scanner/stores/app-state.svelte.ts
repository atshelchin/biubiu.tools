/**
 * Token Balance Scanner App State.
 *
 * This file creates the centralized app state using the new Context-based
 * architecture with shared modules.
 *
 * ## Usage
 *
 * In the root +page.svelte:
 * ```svelte
 * <script>
 *   import { createTokenBalanceScannerState } from './stores/app-state.svelte';
 *   const appState = createTokenBalanceScannerState();
 * </script>
 * ```
 *
 * In child components:
 * ```svelte
 * <script>
 *   import { getTokenBalanceScannerState } from './stores/app-state.svelte';
 *   const { dependencyCheck, tokenSelection, wallets, scanner } = getTokenBalanceScannerState();
 * </script>
 * ```
 *
 * @module
 */

import { getContext, setContext } from 'svelte';
import {
	createDependencyCheckModule,
	createTokenSelectionModule,
	createWalletAddressesModule,
	createScanProgressModule,
	type DependencyCheckModule,
	type TokenSelectionModule,
	type WalletAddressesModule,
	type ScanProgressModule
} from '$lib/stores/modules';
import type { AddressBalance } from '../types/scanner';
import { createScanResultsModule, type ScanResultsModule } from './scan-results-module.svelte';

/**
 * Context key for the app state.
 */
const TOKEN_BALANCE_SCANNER_STATE_KEY = Symbol('token-balance-scanner-state');

/**
 * Tool ID for persistence.
 */
export const TOOL_ID = 'token-balance-scanner';

/**
 * App state interface combining all modules.
 */
export interface TokenBalanceScannerState {
	/** Tool identifier */
	readonly toolId: string;

	/** Step 2: Dependency checks module */
	dependencyCheck: DependencyCheckModule;

	/** Step 3: Token selection module */
	tokenSelection: TokenSelectionModule;

	/** Step 4: Wallet addresses module */
	wallets: WalletAddressesModule;

	/** Step 5: Scan progress module (shared base) */
	scanner: ScanProgressModule<AddressBalance>;

	/** Step 5: Scan results module (tool-specific filtering/sorting) */
	results: ScanResultsModule;

	/** Reset all modules */
	resetAll(): void;

	/** Serialize all module states for persistence */
	serializeAll(): Record<string, unknown>;

	/** Deserialize and restore all module states */
	deserializeAll(data: Record<string, unknown>): void;
}

/**
 * Create the token balance scanner app state.
 *
 * This should be called once in the root page component.
 * It creates all module instances and sets them in context.
 *
 * @returns The app state object
 */
export function createTokenBalanceScannerState(): TokenBalanceScannerState {
	// Create module instances
	const dependencyCheck = createDependencyCheckModule();
	const tokenSelection = createTokenSelectionModule();
	const wallets = createWalletAddressesModule();
	const scanner = createScanProgressModule<AddressBalance>();
	const results = createScanResultsModule();

	const state: TokenBalanceScannerState = {
		toolId: TOOL_ID,
		dependencyCheck,
		tokenSelection,
		wallets,
		scanner,
		results,

		resetAll() {
			dependencyCheck.reset();
			tokenSelection.reset();
			wallets.reset();
			scanner.reset();
			results.reset();
		},

		serializeAll() {
			return {
				dependencyCheck: dependencyCheck.serialize(),
				tokenSelection: tokenSelection.serialize(),
				wallets: wallets.serialize(),
				scanner: scanner.serialize(),
				results: results.serialize()
			};
		},

		deserializeAll(data: Record<string, unknown>) {
			if (data.dependencyCheck) {
				dependencyCheck.deserialize(data.dependencyCheck as Parameters<typeof dependencyCheck.deserialize>[0]);
			}
			if (data.tokenSelection) {
				tokenSelection.deserialize(data.tokenSelection as Parameters<typeof tokenSelection.deserialize>[0]);
			}
			if (data.wallets) {
				wallets.deserialize(data.wallets as Parameters<typeof wallets.deserialize>[0]);
			}
			if (data.scanner) {
				scanner.deserialize(data.scanner as Parameters<typeof scanner.deserialize>[0]);
			}
			if (data.results) {
				results.deserialize(data.results as Parameters<typeof results.deserialize>[0]);
			}
		}
	};

	// Set in context for child components
	setContext(TOKEN_BALANCE_SCANNER_STATE_KEY, state);

	return state;
}

/**
 * Get the token balance scanner app state from context.
 *
 * This should be called in child components that need access to the state.
 * Must be called during component initialization.
 *
 * @returns The app state object
 * @throws Error if called outside of the app state context
 */
export function getTokenBalanceScannerState(): TokenBalanceScannerState {
	const state = getContext<TokenBalanceScannerState>(TOKEN_BALANCE_SCANNER_STATE_KEY);
	if (!state) {
		throw new Error(
			'[TokenBalanceScannerState] Context not found. ' +
			'Make sure createTokenBalanceScannerState() is called in a parent component.'
		);
	}
	return state;
}
