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

	// Lifecycle
	close(): Promise<void>;
	clear(): Promise<void>;
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
}

export interface ResolvedConfig {
	dbName: string;
	retry: {
		maxAttempts: number;
		baseDelayMs: number;
		maxDelayMs: number;
	};
	cleanupDays: number;
}

export const DEFAULT_CONFIG: ResolvedConfig = {
	dbName: 'TaskManager',
	retry: {
		maxAttempts: 3,
		baseDelayMs: 1000,
		maxDelayMs: 10000
	},
	cleanupDays: 7
};

// ============================================================================
// Merkle Types
// ============================================================================

export interface MerkleProof {
	leaf: string;
	proof: string[];
	root: string;
}
