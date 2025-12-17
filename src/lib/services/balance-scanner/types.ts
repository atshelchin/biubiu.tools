/**
 * Balance Scanner Types
 *
 * Core type definitions for the robust balance scanner.
 * Designed for reusability across wallet-sweep and token-balance-scanner apps.
 */

import type { Address } from 'viem';

// ============================================================================
// Token & Balance Types
// ============================================================================

export interface TokenConfig {
	/** Unique identifier (e.g., "1:native" or "1:0xdAC17F958D2ee523a2206206994597C13D831ec7") */
	id: string;
	/** Token contract address (undefined for native token) */
	address?: Address;
	/** Token decimals */
	decimals: number;
	/** Chain ID */
	chainId: number;
	/** Human-readable symbol (optional, for logging) */
	symbol?: string;
}

export interface TokenBalance {
	tokenId: string;
	balance: bigint;
	formatted: string;
}

export interface AddressBalance {
	address: Address;
	balances: TokenBalance[];
	hasBalance: boolean;
}

// ============================================================================
// Scan Status Types
// ============================================================================

/** Status of a single scan task (address + token combination) */
export type ScanTaskStatus = 'pending' | 'success' | 'failed';

/** A single scan task: one address + one token */
export interface ScanTask {
	address: Address;
	tokenId: string;
	status: ScanTaskStatus;
	/** Number of retry attempts */
	retryCount: number;
	/** The balance if successfully scanned */
	balance?: bigint;
	/** Last error message if failed */
	lastError?: string;
}

// ============================================================================
// Scan State (Serializable for persistence)
// ============================================================================

/**
 * Complete scan state - can be serialized and restored
 * This is the "checkpoint" that allows resuming scans
 */
export interface ScanState {
	/** Unique scan session ID */
	sessionId: string;

	/** Chain ID being scanned */
	chainId: number;

	/** All addresses being scanned */
	addresses: Address[];

	/** All tokens being scanned */
	tokens: TokenConfig[];

	/** Status of each scan task (key: "address:tokenId") */
	taskStatus: Map<string, ScanTaskStatus>;

	/** Collected balances (key: "address:tokenId") */
	balances: Map<string, bigint>;

	/** Statistics */
	stats: ScanStats;

	/** Scan configuration */
	config: ScanConfig;

	/** Timestamp when scan started */
	startedAt: number;

	/** Timestamp of last activity */
	lastActivityAt: number;

	/** Whether scan is currently paused */
	isPaused: boolean;

	/** Pause reason if paused */
	pauseReason?: 'rate_limit' | 'user_pause' | 'error';
}

export interface ScanStats {
	/** Total number of tasks (addresses × tokens) */
	total: number;
	/** Successfully completed tasks */
	success: number;
	/** Failed tasks (will retry) */
	failed: number;
	/** Pending tasks */
	pending: number;
	/** Progress percentage (0-100) */
	progress: number;
}

// ============================================================================
// Configuration
// ============================================================================

export interface ScanConfig {
	/** Batch size for multicall (default: 1000) */
	batchSize: number;
	/** Max retry attempts per task (default: 3) */
	maxRetries: number;
	/** Delay between retries in ms (default: 1000) */
	retryDelay: number;
	/** Delay when rate limited in ms (default: 5000) */
	rateLimitDelay: number;
	/** Max consecutive errors before pausing (default: 5) */
	maxConsecutiveErrors: number;
	/** Auto-recovery configuration */
	autoRecovery?: AutoRecoveryConfig;
}

/**
 * Configuration for automatic recovery when all RPCs fail
 * Enables unattended operation - scanner will wait and retry automatically
 */
export interface AutoRecoveryConfig {
	/** Enable auto-recovery (default: true) */
	enabled: boolean;
	/** Initial delay before first retry in ms (default: 10000 = 10s) */
	initialDelay: number;
	/** Maximum delay between retries in ms (default: 300000 = 5 minutes) */
	maxDelay: number;
	/** Backoff multiplier (default: 2) */
	backoffMultiplier: number;
	/** Maximum number of recovery attempts before giving up (default: 10) */
	maxAttempts: number;
}

export const DEFAULT_AUTO_RECOVERY_CONFIG: AutoRecoveryConfig = {
	enabled: true,
	initialDelay: 10000, // 10 seconds
	maxDelay: 300000, // 5 minutes
	backoffMultiplier: 2,
	maxAttempts: 10
};

export const DEFAULT_SCAN_CONFIG: ScanConfig = {
	batchSize: 500,
	maxRetries: 3,
	retryDelay: 1000,
	rateLimitDelay: 5000,
	maxConsecutiveErrors: 5,
	autoRecovery: DEFAULT_AUTO_RECOVERY_CONFIG
};

// ============================================================================
// RPC Types
// ============================================================================

export interface RPCEndpoint {
	url: string;
	name?: string;
	priority?: number;
}

// ============================================================================
// Event Types (for logging and UI updates)
// ============================================================================

export type ScanEventType =
	| 'scan_started'
	| 'batch_started'
	| 'batch_completed'
	| 'batch_failed'
	| 'task_success'
	| 'task_failed'
	| 'rpc_switched'
	| 'rate_limited'
	| 'retrying'
	| 'scan_paused'
	| 'scan_resumed'
	| 'scan_completed'
	| 'progress_update'
	| 'recovery_started'
	| 'recovery_waiting'
	| 'recovery_attempt'
	| 'recovery_success'
	| 'recovery_failed';

export interface ScanEvent {
	type: ScanEventType;
	timestamp: number;
	message: string;
	details?: Record<string, unknown>;
}

// ============================================================================
// Callback Types
// ============================================================================

export interface ScanCallbacks {
	/** Called on every progress update */
	onProgress?: (stats: ScanStats, state: ScanState) => void;

	/** Called when a scan event occurs (for logging) */
	onEvent?: (event: ScanEvent) => void;

	/** Called when scan completes successfully */
	onComplete?: (results: AddressBalance[]) => void;

	/** Called when scan is paused (rate limit, error, etc.) */
	onPause?: (reason: string, state: ScanState) => void;

	/** Called when state changes (for persistence) */
	onStateChange?: (state: ScanState) => void;
}

// ============================================================================
// Scanner Options
// ============================================================================

export interface ScannerOptions {
	/** Chain ID */
	chainId: number;

	/** Addresses to scan */
	addresses: Address[];

	/** Tokens to scan */
	tokens: TokenConfig[];

	/** RPC endpoints (will rotate on failure) */
	rpcEndpoints: RPCEndpoint[];

	/** Network name (for logging) */
	networkName: string;

	/** Network symbol (for native token) */
	networkSymbol: string;

	/** Scan configuration */
	config?: Partial<ScanConfig>;

	/** Callbacks */
	callbacks?: ScanCallbacks;

	/** Initial state (for resuming) */
	initialState?: ScanState;
}

// ============================================================================
// Helper Functions
// ============================================================================

/** Generate task key from address and tokenId */
export function getTaskKey(address: Address, tokenId: string): string {
	return `${address.toLowerCase()}:${tokenId}`;
}

/** Parse task key back to address and tokenId */
export function parseTaskKey(key: string): { address: Address; tokenId: string } {
	const firstColonIndex = key.indexOf(':');
	const address = key.slice(0, firstColonIndex);
	const tokenId = key.slice(firstColonIndex + 1);
	return { address: address as Address, tokenId };
}

/** Generate unique session ID */
export function generateSessionId(): string {
	return `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/** Calculate progress from stats */
export function calculateProgress(stats: ScanStats): number {
	if (stats.total === 0) return 0;
	return Math.round((stats.success / stats.total) * 100);
}

/** Create initial scan state */
export function createInitialState(options: ScannerOptions): ScanState {
	const config = { ...DEFAULT_SCAN_CONFIG, ...options.config };
	const taskStatus = new Map<string, ScanTaskStatus>();
	const balances = new Map<string, bigint>();

	// Initialize all tasks as pending
	for (const address of options.addresses) {
		for (const token of options.tokens) {
			const key = getTaskKey(address, token.id);
			taskStatus.set(key, 'pending');
		}
	}

	const total = options.addresses.length * options.tokens.length;

	return {
		sessionId: generateSessionId(),
		chainId: options.chainId,
		addresses: options.addresses,
		tokens: options.tokens,
		taskStatus,
		balances,
		stats: {
			total,
			success: 0,
			failed: 0,
			pending: total,
			progress: 0
		},
		config,
		startedAt: Date.now(),
		lastActivityAt: Date.now(),
		isPaused: false
	};
}

/** Serialize state for storage (converts Maps to arrays) */
export function serializeState(state: ScanState): string {
	return JSON.stringify({
		...state,
		taskStatus: Array.from(state.taskStatus.entries()),
		balances: Array.from(state.balances.entries()).map(([k, v]) => [k, v.toString()])
	});
}

/** Deserialize state from storage */
export function deserializeState(json: string): ScanState {
	const parsed = JSON.parse(json);
	return {
		...parsed,
		taskStatus: new Map(parsed.taskStatus),
		balances: new Map(parsed.balances.map(([k, v]: [string, string]) => [k, BigInt(v)]))
	};
}
