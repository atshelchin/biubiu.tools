/**
 * State management system for step-based tools.
 *
 * This module exports the Context-based state management system
 * and all shared state modules.
 *
 * ## Quick Start
 *
 * ```typescript
 * // In +page.svelte (top level)
 * import {
 *   createAppStateContext,
 *   createDependencyCheckModule,
 *   createTokenSelectionModule,
 *   createWalletAddressesModule,
 *   createScanProgressModule
 * } from '$lib/stores';
 *
 * const appState = createAppStateContext({
 *   toolId: 'my-tool',
 *   modules: {
 *     dependencyCheck: createDependencyCheckModule,
 *     tokenSelection: createTokenSelectionModule,
 *     wallets: createWalletAddressesModule,
 *     scanner: createScanProgressModule
 *   }
 * });
 * ```
 *
 * ```typescript
 * // In child components
 * import { getAppState } from '$lib/stores';
 *
 * const { dependencyCheck, tokenSelection } = getAppState();
 * ```
 *
 * @module
 */

// Context management
export {
	createAppStateContext,
	getAppState,
	hasAppState,
	type AppStateHelpers
} from './create-app-state-context.svelte';

// Types
export type { StateModule, PersistenceConfig, AppStateConfig, ExtractModules } from './types';

// All modules
export * from './modules';

// Persistence utilities
export * from './utils';
