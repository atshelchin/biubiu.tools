/**
 * Balance Scanner V2 Composable
 *
 * Uses the new robust balance scanner service with:
 * - Address-level progress tracking (not batch-based)
 * - Auto-retry of failed tasks
 * - IndexedDB storage for large datasets
 * - Real-time logging
 */

import { SvelteMap } from 'svelte/reactivity';
import { BalanceScanner, createScanner } from '$lib/services/balance-scanner/scanner';
import { getStorage, isIndexedDBAvailable } from '$lib/services/balance-scanner/storage';
import type {
	ScanState,
	ScanStats,
	ScanEvent,
	TokenConfig,
	AddressBalance,
	ScannerOptions,
	ScanTaskStatus
} from '$lib/services/balance-scanner/types';
import type { ImportedWallet } from '@/features/wallet-sweep/types/wallet';
import type { ERC20Token, Token } from '$lib/types/token';
import type { Address } from 'viem';

// Re-export types for convenience
export type { ScanState, ScanStats, ScanEvent, AddressBalance };

/**
 * Parameters for scanning balances
 */
export interface ScanBalancesParamsV2 {
	/** Wallets to scan */
	wallets: ImportedWallet[];
	/** Tokens to scan (native + ERC20) */
	selectedTokens: Token[];
	/** Chain ID */
	currentChainId: number;
	/** RPC endpoints */
	rpcEndpoints: Array<{ url: string; name?: string; priority?: number }>;
	/** Network name (for display) */
	networkName: string;
	/** Network symbol (native token symbol) */
	networkSymbol: string;
	/** Progress callback */
	onProgress?: (stats: ScanStats) => void;
	/** Event callback (for logging) */
	onEvent?: (event: ScanEvent) => void;
	/** State change callback (for persistence) */
	onStateChange?: (state: ScanState) => void;
	/** Pause callback */
	onPause?: (reason: string, state: ScanState) => void;
	/** Initial state (for resuming) */
	initialState?: ScanState;
	/** Use IndexedDB storage for large datasets */
	useIndexedDB?: boolean;
}

/**
 * Result of a balance scan
 */
export interface ScanResultV2 {
	/** Balance updates for each wallet */
	updates: SvelteMap<
		string,
		{
			hasBalance: boolean;
			balances?: { native?: string; tokens?: Record<string, string> };
		}
	>;
	/** Final scan state */
	state: ScanState;
	/** Whether scan completed successfully */
	completed: boolean;
}

/**
 * Create a balance scanner V2 composable
 */
export function useBalanceScannerV2() {
	let currentScanner: BalanceScanner | null = null;

	/**
	 * Scan balances for wallets
	 */
	async function scanBalances(params: ScanBalancesParamsV2): Promise<ScanResultV2> {
		const {
			wallets,
			selectedTokens,
			currentChainId,
			rpcEndpoints,
			networkName,
			networkSymbol,
			onProgress,
			onEvent,
			onStateChange,
			onPause,
			initialState,
			useIndexedDB = false
		} = params;

		// Build token configs from selected tokens
		const tokens: TokenConfig[] = selectedTokens.map((token) => ({
			id: token.id,
			address: token.type === 'erc20' ? (token as ERC20Token).address : undefined,
			decimals: token.decimals,
			chainId: token.chainId,
			symbol: token.symbol
		}));

		// Build scanner options
		const options: ScannerOptions = {
			chainId: currentChainId,
			addresses: wallets.map((w) => w.address),
			tokens,
			rpcEndpoints,
			networkName,
			networkSymbol,
			callbacks: {
				onProgress: (stats, state) => {
					onProgress?.(stats);
					onStateChange?.(state);
				},
				onEvent,
				onPause,
				onStateChange
			},
			initialState
		};

		// Create scanner
		const scanner = createScanner(options);
		currentScanner = scanner;

		// Log start
		console.log('🚀 Starting balance scan V2');
		console.log(`   Addresses: ${wallets.length}`);
		console.log(`   Tokens: ${tokens.length}`);
		console.log(`   RPCs: ${rpcEndpoints.length}`);

		try {
			// Run scan
			const results = await scanner.scan();

			// If using IndexedDB, save results
			if (useIndexedDB) {
				await saveToIndexedDB(scanner.getState(), results);
			}

			// Format results for wallet-sweep UI
			const updates = formatResults(results);
			const finalState = scanner.getState();

			return {
				updates,
				state: finalState,
				completed: scanner.isComplete()
			};
		} finally {
			currentScanner = null;
		}
	}

	/**
	 * Pause the current scan
	 */
	function pause(): void {
		if (currentScanner) {
			currentScanner.pause();
		}
	}

	/**
	 * Get current scanner instance
	 */
	function getScanner(): BalanceScanner | null {
		return currentScanner;
	}

	/**
	 * Check if a scan is running
	 */
	function isRunning(): boolean {
		return currentScanner?.getIsRunning() ?? false;
	}

	/**
	 * Save results to IndexedDB
	 */
	async function saveToIndexedDB(state: ScanState, results: AddressBalance[]): Promise<void> {
		if (!isIndexedDBAvailable()) {
			console.warn('IndexedDB not available, skipping save');
			return;
		}

		try {
			const storage = getStorage();

			// Save session with full state data for reconstruction
			await storage.createSession({
				sessionId: state.sessionId,
				chainId: state.chainId,
				addresses: state.addresses,
				tokens: state.tokens,
				config: state.config,
				stats: state.stats,
				startedAt: state.startedAt,
				lastActivityAt: state.lastActivityAt,
				isPaused: state.isPaused,
				pauseReason: state.pauseReason
			});

			// Save balances in batches
			const balanceRecords = [];
			for (const result of results) {
				for (const balance of result.balances) {
					balanceRecords.push({
						address: result.address,
						tokenId: balance.tokenId,
						balance: balance.balance
					});
				}
			}

			if (balanceRecords.length > 0) {
				await storage.saveBalances(state.sessionId, balanceRecords);
			}

			// Save task statuses in batches
			const taskRecords = [];
			for (const [key, status] of state.taskStatus.entries()) {
				const [address, ...tokenIdParts] = key.split(':');
				const tokenId = tokenIdParts.join(':');
				taskRecords.push({
					address: address as Address,
					tokenId,
					status
				});
			}

			if (taskRecords.length > 0) {
				await storage.saveTaskStatuses(state.sessionId, taskRecords);
			}

			console.log('💾 Saved scan results to IndexedDB');
		} catch (error) {
			console.error('Failed to save to IndexedDB:', error);
		}
	}

	/**
	 * Format results for wallet-sweep UI
	 */
	function formatResults(results: AddressBalance[]): SvelteMap<
		string,
		{
			hasBalance: boolean;
			balances?: { native?: string; tokens?: Record<string, string> };
		}
	> {
		const updates = new SvelteMap<
			string,
			{
				hasBalance: boolean;
				balances?: { native?: string; tokens?: Record<string, string> };
			}
		>();

		for (const result of results) {
			const balances: { native?: string; tokens?: Record<string, string> } = {
				tokens: {}
			};

			for (const balance of result.balances) {
				if (balance.tokenId.endsWith(':native')) {
					// Native token balance
					balances.native = balance.balance.toString();
				} else {
					// ERC20 token balance
					balances.tokens![balance.tokenId] = balance.balance.toString();
				}
			}

			updates.set(result.address.toLowerCase(), {
				hasBalance: result.hasBalance,
				balances
			});
		}

		return updates;
	}

	/**
	 * Load session from IndexedDB and reconstruct state
	 */
	async function loadSession(sessionId: string): Promise<ScanState | null> {
		if (!isIndexedDBAvailable()) {
			return null;
		}

		try {
			const storage = getStorage();
			const session = await storage.getSession(sessionId);

			if (!session) {
				return null;
			}

			// Load task stats from IndexedDB
			const stats = await storage.countTasksByStatus(sessionId);

			// Reconstruct task status map
			// Note: Using regular Map here since this is for scanner internal state, not reactive UI
			// eslint-disable-next-line svelte/prefer-svelte-reactivity
			const taskStatus = new Map<string, ScanTaskStatus>();
			// eslint-disable-next-line svelte/prefer-svelte-reactivity
			const balances = new Map<string, bigint>();

			// Initialize all tasks as pending
			for (const address of session.addresses) {
				for (const token of session.tokens) {
					const key = `${address.toLowerCase()}:${token.id}`;
					taskStatus.set(key, 'pending');
				}
			}

			// Load actual task statuses from IndexedDB
			const pendingTasks = await storage.getTasksByStatus(sessionId, 'pending');
			const successTasks = await storage.getTasksByStatus(sessionId, 'success');
			const failedTasks = await storage.getTasksByStatus(sessionId, 'failed');

			for (const task of pendingTasks) {
				const key = `${task.address.toLowerCase()}:${task.tokenId}`;
				taskStatus.set(key, 'pending');
			}
			for (const task of successTasks) {
				const key = `${task.address.toLowerCase()}:${task.tokenId}`;
				taskStatus.set(key, 'success');
			}
			for (const task of failedTasks) {
				const key = `${task.address.toLowerCase()}:${task.tokenId}`;
				taskStatus.set(key, 'failed');
			}

			// Load balances
			const balanceResults = await storage.getBalancesBySession(
				sessionId,
				session.tokens,
				{ limit: 100000 } // Load all
			);

			for (const result of balanceResults.results) {
				for (const balance of result.balances) {
					const key = `${result.address.toLowerCase()}:${balance.tokenId}`;
					balances.set(key, balance.balance);
				}
			}

			console.log('📂 Loaded session from IndexedDB:', {
				sessionId,
				addressCount: session.addresses.length,
				tokenCount: session.tokens.length,
				taskCount: taskStatus.size,
				balanceCount: balances.size
			});

			// Reconstruct full state
			const state: ScanState = {
				sessionId: session.sessionId,
				chainId: session.chainId,
				addresses: session.addresses,
				tokens: session.tokens,
				taskStatus,
				balances,
				stats,
				config: session.config,
				startedAt: session.startedAt,
				lastActivityAt: session.lastActivityAt,
				isPaused: session.isPaused,
				pauseReason: session.pauseReason
			};

			return state;
		} catch (error) {
			console.error('Failed to load from IndexedDB:', error);
			return null;
		}
	}

	/**
	 * Cleanup old sessions from IndexedDB
	 */
	async function cleanupStorage(): Promise<void> {
		try {
			const storage = getStorage();
			const result = await storage.autoCleanup();
			console.log('🧹 IndexedDB cleanup:', result);
		} catch (error) {
			console.error('Failed to cleanup IndexedDB:', error);
		}
	}

	return {
		scanBalances,
		pause,
		getScanner,
		isRunning,
		loadSession,
		cleanupStorage
	};
}
