/**
 * Shared state modules for step-based tools.
 *
 * These modules can be composed together using createAppStateContext
 * to create tool-specific state management.
 *
 * @module
 */

// Dependency check module
export {
	createDependencyCheckModule,
	type DependencyCheckModule,
	type DependencyCheckSerializedState
} from './dependency-check.svelte';

// Token selection module
export {
	createTokenSelectionModule,
	type TokenSelectionModule,
	type TokenSelectionSerializedState,
	type Token
} from './token-selection.svelte';

// Wallet addresses module
export {
	createWalletAddressesModule,
	type WalletAddressesModule,
	type WalletAddressesSerializedState,
	type WalletEntry
} from './wallet-addresses.svelte';

// Scan progress module
export {
	createScanProgressModule,
	type ScanProgressModule,
	type ScanProgressSerializedState,
	type ScanStatus,
	type ScanProgressInfo,
	type ScanResultItem,
	type ScanLogEntry,
	type PaginationState
} from './scan-progress.svelte';
