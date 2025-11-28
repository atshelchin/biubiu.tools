/**
 * Universal Task Management System - Tree Structure
 *
 * A completely generic task management system based on tree structure.
 * Each task can have children tasks, allowing infinite nesting.
 *
 * Architecture:
 * - Task: A node in the task tree (can be a parent or leaf)
 * - Parent Task: Has children, progress is aggregated from children
 * - Leaf Task: No children, has execution data, can be executed
 *
 * Examples:
 *
 * 1. Token Sweep (3 levels):
 * Task: "归集 3 个代币"
 * ├── Task: "USDT 归集"
 * │   ├── Task: "批次 1 (钱包 1-100)"     [leaf - executable]
 * │   ├── Task: "批次 2 (钱包 101-200)"   [leaf - executable]
 * │   └── Task: "批次 3 (钱包 201-300)"   [leaf - executable]
 * ├── Task: "USDC 归集"
 * │   ├── Task: "批次 1"                  [leaf - executable]
 * │   └── Task: "批次 2"                  [leaf - executable]
 * └── Task: "DAI 归集"
 *     └── Task: "批次 1"                  [leaf - executable]
 *
 * 2. Simple File Upload (2 levels):
 * Task: "上传 10 个文件"
 * ├── Task: "文件1.jpg"                   [leaf - executable]
 * ├── Task: "文件2.jpg"                   [leaf - executable]
 * └── ...
 *
 * 3. Single Task (1 level):
 * Task: "导出报表"                        [leaf - executable]
 */

/**
 * Task status
 */
export type TaskStatus =
	| 'pending' // Not started
	| 'running' // Currently executing
	| 'paused' // Paused (can be resumed)
	| 'completed' // Successfully completed
	| 'failed' // Failed
	| 'cancelled' // Cancelled by user
	| 'partial'; // Partially completed (some children failed)

/**
 * Task type - identifies the feature that created this task
 */
export type TaskType =
	| 'token-sweep'
	| 'token-distribution'
	| 'batch-transfer'
	| 'wallet-generation'
	| 'balance-scan'
	| 'file-upload'
	| 'data-export'
	| string; // Allow custom types

/**
 * Pause reason
 */
export type PauseReason =
	| 'user' // User clicked pause
	| 'insufficient_gas' // Not enough gas
	| 'network_error' // Network/RPC error
	| 'rate_limit' // Rate limited
	| 'error' // Generic error
	| string; // Allow custom reasons

/**
 * Universal Task (Tree Node)
 *
 * A task can be:
 * - Parent task: Has children, progress is calculated from children
 * - Leaf task: No children, has executionData, can be executed
 */
export interface Task {
	// Identity
	id: string; // Unique ID (e.g., "task-1", "task-1-usdt", "task-1-usdt-batch-1")
	parentId: string | null; // Parent task ID (null for root task)
	type: TaskType; // Task type (inherited from root or custom)
	name: string; // Human-readable name
	description?: string; // Optional description

	// Hierarchy
	children: Task[]; // Child tasks (empty array for leaf tasks)
	depth: number; // Depth in tree (0 for root, 1 for first level children, etc.)
	path: string[]; // Path from root to this task (array of IDs)

	// Status & Progress
	status: TaskStatus;
	progress: number; // 0-100
	// For parent tasks: aggregated from children
	// For leaf tasks: reported during execution

	// Execution (only for leaf tasks)
	isLeaf: boolean; // true if this task has no children and can be executed
	executionData?: Record<string, unknown>; // Data needed for execution (only for leaf tasks)
	executor?: string; // Executor function name (only for leaf tasks)
	result?: unknown; // Execution result (only for leaf tasks)
	error?: string; // Error message if failed

	// Retry (only for leaf tasks)
	attempts: number; // Number of execution attempts
	maxAttempts: number; // Maximum retry attempts

	// Pause/Resume
	isPaused: boolean;
	pauseReason?: PauseReason;
	pauseMessage?: string;

	// Timestamps
	createdAt: number;
	updatedAt: number;
	startedAt?: number;
	pausedAt?: number;
	completedAt?: number;
	failedAt?: number;
	cancelledAt?: number;

	// Statistics (calculated from children or self)
	totalLeaves: number; // Total number of leaf tasks in subtree
	completedLeaves: number; // Number of completed leaf tasks
	failedLeaves: number; // Number of failed leaf tasks

	// Configuration & State
	config: Record<string, unknown>; // Task-level configuration (immutable)
	state: Record<string, unknown>; // Runtime state (mutable)

	// Aggregated results and errors (for parent tasks)
	results: unknown[]; // Results from completed children
	errors: string[]; // Errors from failed children

	// Metadata
	metadata?: Record<string, unknown>;
}

/**
 * Options for creating a task tree
 */
export interface CreateTaskOptions {
	type: TaskType;
	name: string;
	description?: string;
	config?: Record<string, unknown>;
	metadata?: Record<string, unknown>;

	// Child tasks (can be nested recursively)
	children?: CreateTaskOptions[];

	// For leaf tasks (no children)
	executionData?: Record<string, unknown>;
	executor?: string;
	maxAttempts?: number;
}

/**
 * Task update payload
 */
export interface TaskUpdate {
	status?: TaskStatus;
	progress?: number;
	isPaused?: boolean;
	pauseReason?: PauseReason;
	pauseMessage?: string;
	state?: Record<string, unknown>;
	result?: unknown;
	error?: string;
	attempts?: number;
}

/**
 * Task execution context
 * Passed to executor functions for control and progress reporting
 */
export interface TaskExecutionContext {
	// Current task being executed (always a leaf task)
	task: Task;

	// Access to parent and root tasks
	parentTask: Task | null;
	rootTask: Task;

	// Control methods
	isPaused: () => boolean;
	checkGasBalance?: () => Promise<boolean>; // Optional custom check

	// Progress methods
	updateProgress: (progress: number, message?: string) => Promise<void>;
	updateTaskState: (state: Record<string, unknown>) => Promise<void>;

	// Completion methods
	completeTask: (result?: unknown) => Promise<void>;
	failTask: (error: string) => Promise<void>;

	// Parent/Root control
	pauseParent: (reason: PauseReason, message: string) => Promise<void>;
	pauseRoot: (reason: PauseReason, message: string) => Promise<void>;
}

/**
 * Task executor function signature
 * Only leaf tasks are executed
 */
export type TaskExecutor = (context: TaskExecutionContext) => Promise<void>;

/**
 * Task executor registry
 * Maps executor names to functions
 */
export interface TaskExecutorRegistry {
	[executorName: string]: TaskExecutor;
}

/**
 * Task recovery information
 * Used to display recoverable tasks to users
 */
export interface TaskRecoveryInfo {
	task: Task;
	canRecover: boolean;
	recoverFromTaskId: string; // Which task to resume from
	progressSummary: string; // e.g., "USDT: 10/25 批次完成"
}

/**
 * Task tree visitor function
 * Used for traversing the task tree
 */
export type TaskVisitor = (task: Task, depth: number) => boolean | void; // return false to stop traversal

/**
 * Task filter function
 */
export type TaskFilter = (task: Task) => boolean;
