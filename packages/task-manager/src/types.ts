/**
 * Universal Task Management System - Types
 *
 * A tree-based task management system supporting infinite nesting.
 * Parent tasks aggregate progress/status from children.
 * Only leaf tasks (no children) are executable.
 */

/**
 * Task status lifecycle:
 * pending -> running -> paused/completed/failed/cancelled/partial
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
 * Task type - identifies which feature created this task
 */
export type TaskType = string;

/**
 * Pause reason
 */
export type PauseReason =
	| 'user' // User clicked pause
	| 'insufficient_gas' // Not enough gas (blockchain)
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
export interface Task<TData = Record<string, unknown>, TResult = unknown> {
	// Identity
	id: string;
	parentId: string | null;
	type: TaskType;
	name: string;
	description?: string;

	// Hierarchy
	children: Task<TData, TResult>[];
	depth: number;
	path: string[];

	// Status & Progress
	status: TaskStatus;
	progress: number; // 0-100

	// Execution (only for leaf tasks)
	isLeaf: boolean;
	executionData?: TData;
	executor?: string;
	result?: TResult;
	error?: string;

	// Retry (only for leaf tasks)
	attempts: number;
	maxAttempts: number;

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
	totalLeaves: number;
	completedLeaves: number;
	failedLeaves: number;

	// Configuration & State
	config: Record<string, unknown>;
	state: Record<string, unknown>;

	// Aggregated results and errors
	results: TResult[];
	errors: string[];

	// Metadata
	metadata?: Record<string, unknown>;
}

/**
 * Options for creating a task tree
 */
export interface CreateTaskOptions<TData = Record<string, unknown>> {
	type: TaskType;
	name: string;
	description?: string;
	config?: Record<string, unknown>;
	metadata?: Record<string, unknown>;

	// Child tasks (can be nested recursively)
	children?: CreateTaskOptions<TData>[];

	// For leaf tasks (no children)
	executionData?: TData;
	executor?: string;
	maxAttempts?: number;
}

/**
 * Task update payload
 */
export interface TaskUpdate<TResult = unknown> {
	status?: TaskStatus;
	progress?: number;
	isPaused?: boolean;
	pauseReason?: PauseReason;
	pauseMessage?: string;
	state?: Record<string, unknown>;
	result?: TResult;
	error?: string;
	attempts?: number;
}

/**
 * Task execution context
 * Passed to executor functions for control and progress reporting
 */
export interface TaskExecutionContext<TData = Record<string, unknown>, TResult = unknown> {
	// Current task being executed (always a leaf task)
	task: Task<TData, TResult>;

	// Access to parent and root tasks
	parentTask: Task<TData, TResult> | null;
	rootTask: Task<TData, TResult>;

	// Control methods
	isPaused: () => boolean;
	checkCondition?: () => Promise<boolean>;
	checkGasBalance?: () => Promise<boolean>; // Optional custom gas check

	// Progress methods
	updateProgress: (progress: number, message?: string) => Promise<void>;
	updateTaskState: (state: Record<string, unknown>) => Promise<void>;

	// Completion methods
	completeTask: (result?: TResult) => Promise<void>;
	failTask: (error: string) => Promise<void>;

	// Parent/Root control
	pauseParent: (reason: PauseReason, message: string) => Promise<void>;
	pauseRoot: (reason: PauseReason, message: string) => Promise<void>;
}

/**
 * Task executor function signature
 * Only leaf tasks are executed
 */
export type TaskExecutor<TData = Record<string, unknown>, TResult = unknown> = (
	context: TaskExecutionContext<TData, TResult>
) => Promise<void>;

/**
 * Task executor registry
 * Maps executor names to functions
 */
export interface TaskExecutorRegistry<TData = Record<string, unknown>, TResult = unknown> {
	[executorName: string]: TaskExecutor<TData, TResult>;
}

/**
 * Task recovery information
 */
export interface TaskRecoveryInfo<TData = Record<string, unknown>, TResult = unknown> {
	task: Task<TData, TResult>;
	canRecover: boolean;
	recoverFromTaskId: string;
	progressSummary: string;
}

/**
 * Task tree visitor function
 */
export type TaskVisitor<TData = Record<string, unknown>, TResult = unknown> = (
	task: Task<TData, TResult>,
	depth: number
) => boolean | void;

/**
 * Task filter function
 */
export type TaskFilter<TData = Record<string, unknown>, TResult = unknown> = (
	task: Task<TData, TResult>
) => boolean;

/**
 * Task progress callback
 */
export type TaskProgressCallback<TData = Record<string, unknown>, TResult = unknown> = (
	rootTask: Task<TData, TResult>,
	currentTask: Task<TData, TResult>
) => void;
