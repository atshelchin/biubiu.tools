/**
 * Task Manager - Type Definitions
 *
 * A tree-based task management system with:
 * - Split storage (roots + nodes) for efficient loading
 * - Merkle tree support for cryptographic verification
 * - Minimal API surface for good DX
 */

// ============================================================================
// Core Types
// ============================================================================

/**
 * Task status lifecycle:
 * pending -> running -> completed | failed | cancelled
 *                    -> paused -> running (resume)
 */
export type TaskStatus = 'pending' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';

/**
 * Task execution mode:
 * - progressive: Has progress updates (0-100%), suitable for file uploads, data processing
 *   States: pending -> running (0% -> 50% -> 100%) -> completed/failed
 * - atomic: No progress, shows "waiting" during execution, suitable for API calls, simple operations
 *   States: pending -> running (waiting for result) -> completed/failed
 */
export type TaskMode = 'progressive' | 'atomic';

/**
 * Task root - metadata for the entire task tree
 * Stored separately for fast list queries
 */
export interface TaskRoot {
	id: string;
	name: string;
	type: string;
	status: TaskStatus;
	progress: number; // 0-100

	// Execution settings
	concurrency: number; // Number of parallel tasks (1 = serial, >1 = parallel)

	// Statistics
	stats: {
		total: number; // Total leaf nodes
		completed: number;
		failed: number;
	};

	// Merkle tree
	merkleRoot: string | null; // null until first leaf is added

	// Timestamps
	createdAt: number;
	updatedAt: number;
	startedAt?: number;
	completedAt?: number;

	// Optional metadata
	metadata?: Record<string, unknown>;
}

/**
 * Task node - a node in the task tree (intermediate or leaf)
 */
export interface TaskNode<T = unknown> {
	id: string;
	rootId: string; // Reference to TaskRoot
	parentId: string | null; // null for direct children of root
	name: string;
	status: TaskStatus;
	progress: number;

	// Execution mode
	mode: TaskMode; // 'progressive' (has progress) or 'atomic' (complete/fail only)

	// Tree position
	depth: number; // 0 for root's direct children
	index: number; // Position among siblings
	isLeaf: boolean;
	childCount: number; // Number of direct children

	// Merkle hash (for verification)
	hash: string;

	// Leaf-only fields
	data?: T; // Execution data
	executor?: string; // Executor function name
	result?: unknown;
	error?: string;

	// Retry
	attempts: number;
	maxAttempts: number;

	// Timestamps
	createdAt: number;
	updatedAt: number;
	startedAt?: number;
	completedAt?: number;
}

// ============================================================================
// Creation Options
// ============================================================================

/**
 * Options for creating a task tree
 */
export interface CreateTaskOptions<T = unknown> {
	name: string;
	type?: string;
	/**
	 * Number of parallel tasks to execute
	 * - 1: Serial execution (default)
	 * - >1: Parallel execution with specified concurrency
	 * - Infinity: Execute all tasks in parallel
	 */
	concurrency?: number;
	metadata?: Record<string, unknown>;
	children?: CreateNodeOptions<T>[];
}

/**
 * Options for creating a task node
 */
export interface CreateNodeOptions<T = unknown> {
	name: string;
	/**
	 * Task execution mode
	 * - 'progressive': Shows progress 0-100% (default)
	 * - 'atomic': No progress, just waiting -> complete/fail
	 */
	mode?: TaskMode;
	children?: CreateNodeOptions<T>[];
	// Leaf-only
	data?: T;
	executor?: string;
	maxAttempts?: number;
}

// ============================================================================
// Execution Types
// ============================================================================

/**
 * Execution context passed to executor functions
 */
export interface ExecutionContext<T = unknown> {
	// Current node being executed
	node: TaskNode<T>;
	data: T;

	// Control
	isPaused: () => boolean;
	signal: AbortSignal;

	// Progress reporting
	progress: (percent: number) => Promise<void>;

	// Completion
	complete: (result?: unknown) => Promise<void>;
	fail: (error: string) => Promise<void>;

	// Pause the entire task
	pauseTask: (reason?: string) => Promise<void>;
}

/**
 * Executor function signature
 */
export type TaskExecutor<T = unknown> = (ctx: ExecutionContext<T>) => Promise<void>;

/**
 * Executor registry - maps executor names to functions
 */
export type ExecutorRegistry<T = unknown> = Record<string, TaskExecutor<T>>;

// ============================================================================
// Event Types
// ============================================================================

export type TaskEvent = 'start' | 'progress' | 'complete' | 'fail' | 'pause' | 'resume' | 'cancel';

export interface TaskEventData {
	root: TaskRoot;
	node?: TaskNode;
}

export type TaskEventHandler = (event: TaskEvent, data: TaskEventData) => void;

// ============================================================================
// Storage Types
// ============================================================================

/**
 * Data integrity verification result
 */
export interface IntegrityCheckResult {
	valid: boolean;
	issues: string[];
	stats?: {
		expectedCompleted: number;
		actualCompleted: number;
		expectedFailed: number;
		actualFailed: number;
		orphanedNodes: number;
	};
}

/**
 * Storage adapter interface for custom persistence
 */
export interface StorageAdapter {
	// Root operations
	saveRoot(root: TaskRoot): Promise<void>;
	getRoot(id: string): Promise<TaskRoot | null>;
	getAllRoots(): Promise<TaskRoot[]>;
	deleteRoot(id: string): Promise<void>;

	// Node operations
	saveNode(node: TaskNode): Promise<void>;
	saveNodes(nodes: TaskNode[]): Promise<void>;
	getNode(id: string): Promise<TaskNode | null>;
	getNodesByRoot(rootId: string): Promise<TaskNode[]>;
	getChildren(parentId: string | null, rootId: string): Promise<TaskNode[]>;
	getLeaves(rootId: string): Promise<TaskNode[]>;
	deleteNodesByRoot(rootId: string): Promise<void>;

	// Batch operations
	updateNodeStatus(id: string, status: TaskStatus, updates?: Partial<TaskNode>): Promise<void>;

	// =========================================================================
	// Atomic Operations (for data integrity)
	// =========================================================================

	/**
	 * Atomically save root with all its nodes in a single transaction
	 * This prevents partial saves if browser crashes mid-operation
	 */
	saveRootWithNodes?(root: TaskRoot, nodes: TaskNode[]): Promise<void>;

	/**
	 * Atomically delete root and all its nodes in a single transaction
	 * This prevents orphaned nodes if browser crashes mid-operation
	 */
	deleteRootWithNodes?(rootId: string): Promise<void>;

	/**
	 * Get all nodes across all roots (for orphan detection)
	 */
	getAllNodes?(): Promise<TaskNode[]>;

	// Streaming operations (for memory-efficient execution)
	/**
	 * Get leaf count for a root (without loading all leaves)
	 */
	getLeafCount?(rootId: string): Promise<number>;

	/**
	 * Get pending leaf count for a root (without loading all leaves)
	 */
	getPendingLeafCount?(rootId: string): Promise<number>;

	/**
	 * Get leaf IDs in batches (memory efficient for large task trees)
	 * Returns only IDs, not full objects
	 */
	getLeafIds?(rootId: string): Promise<string[]>;

	/**
	 * Get pending leaf IDs (leaves with status 'pending')
	 * Returns only IDs, not full objects
	 */
	getPendingLeafIds?(rootId: string): Promise<string[]>;

	// Lifecycle
	close(): Promise<void>;
	clear(): Promise<void>;

	// Recovery (optional - for IndexedDB)
	/**
	 * Force reconnect to the database
	 */
	reconnect?(): Promise<void>;

	/**
	 * Check if the database is accessible
	 */
	isHealthy?(): Promise<boolean>;

	/**
	 * Delete and recreate the database (WARNING: deletes all data!)
	 */
	resetDatabase?(): Promise<void>;
}

// ============================================================================
// Configuration
// ============================================================================

export interface TaskManagerConfig {
	/**
	 * Custom storage adapter (defaults to IndexedDB)
	 */
	storage?: StorageAdapter;

	/**
	 * Database name for IndexedDB
	 */
	dbName?: string;

	/**
	 * Default retry settings
	 */
	retry?: {
		maxAttempts?: number;
		baseDelayMs?: number;
		maxDelayMs?: number;
	};

	/**
	 * Auto-cleanup old completed tasks
	 */
	cleanupDays?: number;

	/**
	 * Skip Merkle tree computation for better performance
	 * Set to true when cryptographic verification is not needed
	 * Can significantly improve performance for large task trees (50k+ tasks)
	 */
	skipMerkle?: boolean;

	/**
	 * Use Web Worker for Merkle hash computation
	 * Offloads CPU-intensive hashing to background thread
	 * Prevents UI blocking during large task tree creation
	 * Falls back to main thread if Workers are not supported
	 */
	useWorker?: boolean;

	/**
	 * Enable multi-tab coordination using Web Locks API
	 * Prevents data corruption when multiple browser tabs access the same database
	 * Default: false (for backwards compatibility)
	 */
	enableTabCoordination?: boolean;

	/**
	 * Multi-tab coordination options
	 */
	tabCoordination?: {
		/**
		 * Lock timeout in milliseconds (default: 30000)
		 */
		lockTimeout?: number;
		/**
		 * Use shared locks for reads (default: false)
		 * When true, multiple tabs can read simultaneously
		 */
		useSharedReads?: boolean;
	};
}

export interface ResolvedConfig {
	dbName: string;
	retry: {
		maxAttempts: number;
		baseDelayMs: number;
		maxDelayMs: number;
	};
	cleanupDays: number;
	skipMerkle: boolean;
	useWorker: boolean;
	enableTabCoordination: boolean;
	tabCoordination: {
		lockTimeout: number;
		useSharedReads: boolean;
	};
}

export const DEFAULT_CONFIG: ResolvedConfig = {
	dbName: 'TaskManager',
	retry: {
		maxAttempts: 3,
		baseDelayMs: 1000,
		maxDelayMs: 10000
	},
	cleanupDays: 7,
	skipMerkle: false,
	useWorker: false,
	enableTabCoordination: false,
	tabCoordination: {
		lockTimeout: 30000,
		useSharedReads: false
	}
};

// ============================================================================
// Merkle Types
// ============================================================================

export interface MerkleProof {
	leaf: string;
	proof: string[];
	root: string;
}

// ============================================================================
// Error Types
// ============================================================================

/**
 * Storage error types for better error handling
 */
export type StorageErrorType =
	| 'QUOTA_EXCEEDED' // Storage quota exceeded
	| 'CONNECTION_ERROR' // Database connection error
	| 'TRANSACTION_ERROR' // Transaction failed
	| 'NOT_FOUND' // Resource not found
	| 'UNKNOWN'; // Unknown error

/**
 * Custom storage error with type information
 */
export class StorageError extends Error {
	readonly type: StorageErrorType;
	readonly originalError?: Error;

	constructor(type: StorageErrorType, message: string, originalError?: Error) {
		super(message);
		this.name = 'StorageError';
		this.type = type;
		this.originalError = originalError;
	}

	/**
	 * Check if this is a quota exceeded error
	 */
	isQuotaExceeded(): boolean {
		return this.type === 'QUOTA_EXCEEDED';
	}

	/**
	 * Check if this is a recoverable error (can retry)
	 */
	isRecoverable(): boolean {
		return this.type === 'CONNECTION_ERROR' || this.type === 'TRANSACTION_ERROR';
	}
}

/**
 * Check if an error is a QuotaExceededError
 */
export function isQuotaExceededError(error: unknown): boolean {
	if (error instanceof StorageError) {
		return error.isQuotaExceeded();
	}
	if (error instanceof DOMException) {
		return error.name === 'QuotaExceededError';
	}
	if (error instanceof Error) {
		return error.name === 'QuotaExceededError' || error.message.includes('quota');
	}
	return false;
}
