/**
 * Context-based app state management factory.
 *
 * This module provides a factory function for creating isolated app state
 * that is scoped to the component tree using Svelte's Context API.
 *
 * ## Why Context over Singletons?
 *
 * 1. **Isolation**: Each page instance gets its own state
 * 2. **Cleanup**: State is automatically garbage collected when page unmounts
 * 3. **Testing**: Easy to inject mock state in tests
 * 4. **Multi-tab safe**: Multiple browser tabs don't share state
 *
 * ## Usage
 *
 * ```svelte
 * <!-- +page.svelte (top level) -->
 * <script>
 *   import { createAppStateContext } from '$lib/stores/create-app-state-context.svelte';
 *   import { createDependencyCheckModule } from '$lib/stores/modules/dependency-check.svelte';
 *
 *   const appState = createAppStateContext({
 *     toolId: 'my-tool',
 *     modules: {
 *       dependencyCheck: createDependencyCheckModule
 *     }
 *   });
 * </script>
 * ```
 *
 * ```svelte
 * <!-- Child component -->
 * <script>
 *   import { getAppState } from '$lib/stores/create-app-state-context.svelte';
 *
 *   const { dependencyCheck } = getAppState();
 * </script>
 * ```
 *
 * @module
 */

import { setContext, getContext } from 'svelte';
import type { AppStateConfig, ExtractModules, StateModule } from './types';

/**
 * Symbol key for the app state context.
 * Using Symbol ensures no collisions with other context keys.
 */
const APP_STATE_KEY = Symbol('app-state');

/**
 * Create and set up the app state context.
 *
 * This should be called at the top level of your page component (+page.svelte).
 * It creates instances of all state modules and makes them available to all
 * child components via Svelte's Context API.
 *
 * @param config - Configuration object
 * @returns The created app state object with all modules
 *
 * @example
 * ```typescript
 * const appState = createAppStateContext({
 *   toolId: 'token-balance-scanner',
 *   modules: {
 *     dependencyCheck: createDependencyCheckModule,
 *     tokenSelection: createTokenSelectionModule,
 *     wallets: createWalletAddressesModule,
 *     scanner: createScanProgressModule
 *   },
 *   persistence: {
 *     enabled: true,
 *     debounceMs: 1000,
 *     excludeKeys: ['scanner']
 *   }
 * });
 * ```
 */
export function createAppStateContext<TModules extends Record<string, () => StateModule>>(
	config: AppStateConfig<TModules>
): ExtractModules<TModules> & AppStateHelpers {
	const { modules } = config;

	// Create instances of all modules
	const state = {} as ExtractModules<TModules>;
	for (const [key, factory] of Object.entries(modules)) {
		(state as Record<string, StateModule>)[key] = factory();
	}

	// Add helper methods
	const helpers: AppStateHelpers = {
		toolId: config.toolId,

		resetAll() {
			for (const module of Object.values(state)) {
				(module as StateModule).reset();
			}
		},

		serializeAll() {
			const serialized: Record<string, unknown> = {};
			const excludeKeys = config.persistence?.excludeKeys ?? [];

			for (const [key, module] of Object.entries(state)) {
				if (!excludeKeys.includes(key)) {
					serialized[key] = (module as StateModule).serialize();
				}
			}
			return serialized;
		},

		deserializeAll(data: Record<string, unknown>) {
			for (const [key, module] of Object.entries(state)) {
				if (data[key] !== undefined) {
					try {
						(module as StateModule).deserialize(data[key]);
					} catch (error) {
						console.warn(`[AppState] Failed to deserialize module "${key}":`, error);
					}
				}
			}
		}
	};

	// Combine state and helpers
	const appState = { ...state, ...helpers };

	// Set context so child components can access it
	setContext(APP_STATE_KEY, appState);

	return appState;
}

/**
 * Helper methods available on the app state object.
 */
export interface AppStateHelpers {
	/** Tool identifier */
	readonly toolId: string;

	/** Reset all modules to their initial state */
	resetAll(): void;

	/** Serialize all modules for persistence */
	serializeAll(): Record<string, unknown>;

	/** Deserialize and restore all modules from persisted data */
	deserializeAll(data: Record<string, unknown>): void;
}

/**
 * Get the app state from context.
 *
 * This should be called in child components that need access to the app state.
 * It will throw an error if called outside of a component tree where
 * `createAppStateContext` was called.
 *
 * @returns The app state object
 * @throws Error if context is not found
 *
 * @example
 * ```typescript
 * // In a child component
 * const { dependencyCheck, tokenSelection } = getAppState<MyAppState>();
 *
 * // Access module state
 * if (dependencyCheck.canProceed) {
 *   // ...
 * }
 * ```
 */
export function getAppState<T>(): T {
	const state = getContext<T>(APP_STATE_KEY);
	if (!state) {
		throw new Error(
			'[AppState] Context not found. ' +
				'Make sure createAppStateContext() is called in a parent component.'
		);
	}
	return state;
}

/**
 * Check if app state context exists.
 *
 * Useful for conditional logic where state might not be available.
 *
 * @returns true if context exists, false otherwise
 */
export function hasAppState(): boolean {
	try {
		return getContext(APP_STATE_KEY) !== undefined;
	} catch {
		return false;
	}
}
