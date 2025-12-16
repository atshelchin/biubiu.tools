/**
 * Balance Scanner Service
 *
 * A robust, reusable balance scanner that:
 * - Tracks progress at the address level (not request level)
 * - Auto-retries failed tasks
 * - Handles rate limiting gracefully with RPC rotation
 * - Never loses data - can pause and resume anytime
 * - Provides real-time logging for user feedback
 *
 * Usage:
 * ```typescript
 * import { createScanner, type ScannerOptions } from '$lib/services/balance-scanner';
 *
 * const scanner = createScanner({
 *   chainId: 1,
 *   addresses: ['0x...', '0x...'],
 *   tokens: [
 *     { id: '1:native', decimals: 18, chainId: 1, symbol: 'ETH' },
 *     { id: '1:0xdAC17...', address: '0xdAC17...', decimals: 6, chainId: 1, symbol: 'USDT' }
 *   ],
 *   rpcEndpoints: [{ url: 'https://...', name: 'Alchemy' }],
 *   networkName: 'Ethereum',
 *   networkSymbol: 'ETH',
 *   callbacks: {
 *     onProgress: (stats, state) => { ... },
 *     onEvent: (event) => { console.log(event.message) },
 *     onComplete: (results) => { ... },
 *     onPause: (reason, state) => { ... },
 *     onStateChange: (state) => { saveToStorage(state) }
 *   }
 * });
 *
 * // Start scan
 * const results = await scanner.scan();
 *
 * // Or pause and resume later
 * scanner.pause();
 * const state = scanner.getState();
 * // ... save state ...
 *
 * // Resume later
 * const resumedScanner = createScanner({ ...options, initialState: savedState });
 * const results = await resumedScanner.scan();
 * ```
 */

// Types
export type {
	TokenConfig,
	TokenBalance,
	AddressBalance,
	ScanTaskStatus,
	ScanTask,
	ScanState,
	ScanStats,
	ScanConfig,
	RPCEndpoint,
	ScanEventType,
	ScanEvent,
	ScanCallbacks,
	ScannerOptions
} from './types';

// Constants
export { DEFAULT_SCAN_CONFIG } from './types';

// Utilities
export {
	getTaskKey,
	parseTaskKey,
	generateSessionId,
	calculateProgress,
	createInitialState,
	serializeState,
	deserializeState
} from './types';

// Scanner
export { BalanceScanner, createScanner } from './scanner';

// RPC Manager
export { RPCManager } from './rpc-manager';
