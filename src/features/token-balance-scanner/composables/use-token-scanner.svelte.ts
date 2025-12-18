/**
 * Token Scanner Composable
 *
 * Provides a simplified interface for scanning token balances using the
 * balance-scanner service. Supports:
 * - Multi-RPC parallel scanning
 * - Session persistence (IndexedDB)
 * - Resume from interruption
 * - Real-time progress and logging
 */

import { formatUnits, type Address } from 'viem';
import { createScanner, type BalanceScanner } from '$lib/services/balance-scanner/scanner';
import { getStorage, isIndexedDBAvailable } from '$lib/services/balance-scanner/storage';
import type {
	ScanState,
	ScanStats,
	ScanEvent,
	TokenConfig,
	ScannerOptions,
	RPCEndpoint
} from '$lib/services/balance-scanner/types';
import type { Token, ERC20Token } from '$lib/types/token';
import type {
	ScanStatus,
	ScanSummary,
	TokenTotal,
	AddressBalance,
	ResumableSession
} from '../types/scanner';

// Maximum log entries to keep
const MAX_LOG_ENTRIES = 100;

/**
 * Parameters for starting a scan
 */
export interface StartScanParams {
	/** Addresses to scan */
	addresses: Address[];
	/** Address labels (optional, keyed by address) */
	addressLabels?: Map<string, string>;
	/** Tokens to scan */
	tokens: Token[];
	/** Chain ID */
	chainId: number;
	/** RPC endpoints */
	rpcEndpoints: RPCEndpoint[];
	/** Network name */
	networkName: string;
	/** Network symbol (native token symbol) */
	networkSymbol: string;
}

/**
 * Create a token scanner composable
 */
export function useTokenScanner() {
	// Scanner instance
	let scanner: BalanceScanner | null = null;

	// State
	let status = $state<ScanStatus>('idle');
	let stats = $state<ScanStats | null>(null);
	let results = $state<AddressBalance[]>([]);
	let logs = $state<ScanEvent[]>([]);
	let error = $state<string | null>(null);
	let sessionId = $state<string | null>(null);
	let startTime = $state<number | null>(null);

	// Address labels map - not reactive, used for passing to scanner
	// eslint-disable-next-line svelte/prefer-svelte-reactivity
	let addressLabels = $state<Map<string, string>>(new Map());

	// Token configs (for reference during export)
	let tokenConfigs = $state<TokenConfig[]>([]);

	/**
	 * Check for resumable sessions
	 */
	async function checkResumableSession(chainId: number): Promise<ResumableSession | null> {
		if (!isIndexedDBAvailable()) {
			return null;
		}

		try {
			const storage = getStorage();
			const sessions = await storage.getAllSessions();

			// Find incomplete session for this chain
			const resumable = sessions.find(
				(s) =>
					s.chainId === chainId &&
					!s.isPaused &&
					s.stats.pending > 0 &&
					// Not too old (within 7 days)
					Date.now() - s.lastActivityAt < 7 * 24 * 60 * 60 * 1000
			);

			if (resumable) {
				return {
					sessionId: resumable.sessionId,
					chainId: resumable.chainId,
					addressCount: resumable.addresses.length,
					tokenCount: resumable.tokens.length,
					progress: resumable.stats.progress,
					startedAt: resumable.startedAt,
					lastActivityAt: resumable.lastActivityAt,
					isPaused: resumable.isPaused,
					pauseReason: resumable.pauseReason
				};
			}

			// Also check for paused sessions
			const paused = sessions.find(
				(s) =>
					s.chainId === chainId &&
					s.isPaused &&
					// Not too old (within 7 days)
					Date.now() - s.lastActivityAt < 7 * 24 * 60 * 60 * 1000
			);

			if (paused) {
				return {
					sessionId: paused.sessionId,
					chainId: paused.chainId,
					addressCount: paused.addresses.length,
					tokenCount: paused.tokens.length,
					progress: paused.stats.progress,
					startedAt: paused.startedAt,
					lastActivityAt: paused.lastActivityAt,
					isPaused: paused.isPaused,
					pauseReason: paused.pauseReason
				};
			}

			return null;
		} catch (err) {
			console.error('Failed to check resumable sessions:', err);
			return null;
		}
	}

	/**
	 * Start a new scan
	 */
	async function startScan(params: StartScanParams): Promise<void> {
		const {
			addresses,
			addressLabels: labels,
			tokens,
			chainId,
			rpcEndpoints,
			networkName,
			networkSymbol
		} = params;

		// Store labels
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		addressLabels = labels || new Map();

		// Reset state
		status = 'scanning';
		stats = null;
		results = [];
		logs = [];
		error = null;
		startTime = Date.now();

		// Build token configs
		tokenConfigs = tokens.map((token) => ({
			id: token.id,
			address: token.type === 'erc20' ? (token as ERC20Token).address : undefined,
			decimals: token.decimals,
			chainId: token.chainId,
			symbol: token.symbol
		}));

		// Create scanner options
		const options: ScannerOptions = {
			chainId,
			addresses,
			tokens: tokenConfigs,
			rpcEndpoints,
			networkName,
			networkSymbol,
			callbacks: {
				onProgress: handleProgress,
				onEvent: handleEvent,
				onStateChange: handleStateChange,
				onPause: handlePause
			}
		};

		try {
			// Create and run scanner
			scanner = createScanner(options);
			sessionId = scanner.getState().sessionId;

			const scanResults = await scanner.scan();

			// Process results
			results = scanResults.map((r) => ({
				...r,
				label: addressLabels.get(r.address.toLowerCase())
			}));

			// Save to IndexedDB
			await saveResults();

			status = scanner.isComplete() ? 'completed' : 'paused';
		} catch (err) {
			console.error('Scan failed:', err);
			error = err instanceof Error ? err.message : 'Scan failed';
			status = 'error';
		} finally {
			scanner = null;
		}
	}

	/**
	 * Resume a paused scan
	 */
	async function resumeScan(
		resumeSessionId: string,
		rpcEndpoints: RPCEndpoint[],
		networkName: string,
		networkSymbol: string
	): Promise<void> {
		if (!isIndexedDBAvailable()) {
			error = 'IndexedDB not available';
			return;
		}

		try {
			const storage = getStorage();
			const session = await storage.getSession(resumeSessionId);

			if (!session) {
				error = 'Session not found';
				return;
			}

			// Reset state
			status = 'scanning';
			logs = [];
			error = null;
			startTime = Date.now();
			sessionId = resumeSessionId;
			tokenConfigs = session.tokens;

			// Load task statuses and balances from IndexedDB
			const taskStats = await storage.countTasksByStatus(resumeSessionId);

			// Reconstruct task status map
			// eslint-disable-next-line svelte/prefer-svelte-reactivity
			const taskStatus = new Map<string, 'pending' | 'success' | 'failed'>();
			// eslint-disable-next-line svelte/prefer-svelte-reactivity
			const balances = new Map<string, bigint>();

			// Initialize all tasks as pending
			for (const address of session.addresses) {
				for (const token of session.tokens) {
					const key = `${address.toLowerCase()}:${token.id}`;
					taskStatus.set(key, 'pending');
				}
			}

			// Load actual task statuses
			const pendingTasks = await storage.getTasksByStatus(resumeSessionId, 'pending');
			const successTasks = await storage.getTasksByStatus(resumeSessionId, 'success');
			const failedTasks = await storage.getTasksByStatus(resumeSessionId, 'failed');

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
			const balanceResults = await storage.getBalancesBySession(resumeSessionId, session.tokens, {
				limit: 100000
			});

			for (const result of balanceResults.results) {
				for (const balance of result.balances) {
					const key = `${result.address.toLowerCase()}:${balance.tokenId}`;
					balances.set(key, balance.balance);
				}
			}

			// Reconstruct scan state
			const initialState: ScanState = {
				sessionId: session.sessionId,
				chainId: session.chainId,
				addresses: session.addresses,
				tokens: session.tokens,
				taskStatus,
				balances,
				stats: taskStats,
				config: session.config,
				startedAt: session.startedAt,
				lastActivityAt: Date.now(),
				isPaused: false
			};

			// Create scanner options with initial state
			const options: ScannerOptions = {
				chainId: session.chainId,
				addresses: session.addresses,
				tokens: session.tokens,
				rpcEndpoints,
				networkName,
				networkSymbol,
				callbacks: {
					onProgress: handleProgress,
					onEvent: handleEvent,
					onStateChange: handleStateChange,
					onPause: handlePause
				},
				initialState
			};

			// Create and run scanner
			scanner = createScanner(options);

			const scanResults = await scanner.scan();

			// Process results
			results = scanResults.map((r) => ({
				...r,
				label: addressLabels.get(r.address.toLowerCase())
			}));

			// Save to IndexedDB
			await saveResults();

			status = scanner.isComplete() ? 'completed' : 'paused';
		} catch (err) {
			console.error('Resume failed:', err);
			error = err instanceof Error ? err.message : 'Resume failed';
			status = 'error';
		} finally {
			scanner = null;
		}
	}

	/**
	 * Pause the current scan
	 */
	function pause(): void {
		if (scanner) {
			scanner.pause();
		}
	}

	/**
	 * Delete a session
	 */
	async function deleteSession(deleteSessionId: string): Promise<void> {
		if (!isIndexedDBAvailable()) {
			return;
		}

		try {
			const storage = getStorage();
			await storage.deleteSession(deleteSessionId);
		} catch (err) {
			console.error('Failed to delete session:', err);
		}
	}

	/**
	 * Reset state
	 */
	function reset(): void {
		scanner = null;
		status = 'idle';
		stats = null;
		results = [];
		logs = [];
		error = null;
		sessionId = null;
		startTime = null;
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		addressLabels = new Map();
		tokenConfigs = [];
	}

	/**
	 * Handle progress updates
	 */
	function handleProgress(newStats: ScanStats): void {
		stats = newStats;
	}

	/**
	 * Handle scan events
	 */
	function handleEvent(event: ScanEvent): void {
		// Add to logs (keep limited)
		logs = [...logs.slice(-(MAX_LOG_ENTRIES - 1)), event];
	}

	/**
	 * Handle state changes
	 */
	function handleStateChange(state: ScanState): void {
		// Update stats from state
		stats = state.stats;
	}

	/**
	 * Handle pause
	 */
	function handlePause(reason: string, state: ScanState): void {
		status = 'paused';
		error = `Scan paused: ${reason}`;
		stats = state.stats;
	}

	/**
	 * Save results to IndexedDB
	 */
	async function saveResults(): Promise<void> {
		if (!isIndexedDBAvailable() || !scanner || !sessionId) {
			return;
		}

		try {
			const storage = getStorage();
			const state = scanner.getState();

			// Save session
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

			// Save balances
			const balanceRecords: Array<{ address: Address; tokenId: string; balance: bigint }> = [];
			for (const [key, balance] of state.balances.entries()) {
				const [address, ...tokenIdParts] = key.split(':');
				const tokenId = tokenIdParts.join(':');
				balanceRecords.push({
					address: address as Address,
					tokenId,
					balance
				});
			}

			if (balanceRecords.length > 0) {
				await storage.saveBalances(state.sessionId, balanceRecords);
			}

			// Save task statuses
			const taskRecords: Array<{
				address: Address;
				tokenId: string;
				status: 'pending' | 'success' | 'failed';
			}> = [];
			for (const [key, taskStatus] of state.taskStatus.entries()) {
				const [address, ...tokenIdParts] = key.split(':');
				const tokenId = tokenIdParts.join(':');
				taskRecords.push({
					address: address as Address,
					tokenId,
					status: taskStatus
				});
			}

			if (taskRecords.length > 0) {
				await storage.saveTaskStatuses(state.sessionId, taskRecords);
			}

			console.log('💾 Saved scan results to IndexedDB');
		} catch (err) {
			console.error('Failed to save results:', err);
		}
	}

	/**
	 * Calculate summary from results
	 */
	function calculateSummary(): ScanSummary | null {
		if (results.length === 0 || tokenConfigs.length === 0) {
			return null;
		}

		const walletsWithBalance = results.filter((r) => r.hasBalance).length;

		// Calculate totals for each token
		const tokenTotals: TokenTotal[] = tokenConfigs.map((token) => {
			let totalBalance = 0n;
			let walletsWithTokenBalance = 0;

			for (const result of results) {
				const tokenBalance = result.balances.find((b) => b.tokenId === token.id);
				if (tokenBalance && tokenBalance.balance > 0n) {
					totalBalance += tokenBalance.balance;
					walletsWithTokenBalance++;
				}
			}

			// Format with max 4 decimal places
			const formatted = formatUnits(totalBalance, token.decimals);
			const [intPart, decPart] = formatted.split('.');
			const formattedTotal = decPart
				? `${intPart}.${decPart.slice(0, 4).replace(/0+$/, '') || '0'}`
				: intPart;

			return {
				tokenId: token.id,
				symbol: token.symbol || '',
				name: token.symbol || '', // Use symbol as name if not available
				decimals: token.decimals,
				totalBalance,
				formattedTotal,
				walletsWithBalance: walletsWithTokenBalance
			};
		});

		return {
			totalWallets: results.length,
			walletsWithBalance,
			totalTokens: tokenConfigs.length,
			tokenTotals,
			scanDuration: startTime ? Date.now() - startTime : 0,
			successCount: stats?.success || 0,
			failureCount: stats?.failed || 0
		};
	}

	return {
		// State getters
		get status() {
			return status;
		},
		get stats() {
			return stats;
		},
		get results() {
			return results;
		},
		get logs() {
			return logs;
		},
		get error() {
			return error;
		},
		get sessionId() {
			return sessionId;
		},
		get tokenConfigs() {
			return tokenConfigs;
		},

		// Computed
		get summary() {
			return calculateSummary();
		},
		get isScanning() {
			return status === 'scanning';
		},
		get isPaused() {
			return status === 'paused';
		},
		get isComplete() {
			return status === 'completed';
		},

		// Actions
		checkResumableSession,
		startScan,
		resumeScan,
		pause,
		deleteSession,
		reset
	};
}

export type TokenScannerInstance = ReturnType<typeof useTokenScanner>;
