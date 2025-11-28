/**
 * Universal Task Management System
 *
 * A generic, persistent task management system that supports:
 * - Multi-subtask tasks (each subtask is an independent execution unit)
 * - Pause/Resume functionality
 * - Progress tracking and recovery
 * - IndexedDB persistence
 * - Browser session recovery
 *
 * Architecture:
 * - Task (任务): The overall job (e.g., "Sweep 5 tokens from 500 wallets")
 * - SubTask (子任务): An independent execution unit (e.g., "Process wallets 1-100 for ETH")
 *
 * Example for Token Sweep:
 * Task: "归集 3 个代币"
 *   ├── SubTask 1: ETH from wallets 1-100
 *   ├── SubTask 2: ETH from wallets 101-200
 *   ├── SubTask 3: USDC from wallets 1-100
 *   ├── SubTask 4: USDC from wallets 101-200
 *   ├── SubTask 5: DAI from wallets 1-100
 *   └── SubTask 6: DAI from wallets 101-200
 */

/**
 * Task/SubTask status lifecycle:
 * pending -> running -> paused/completed/failed/cancelled
 */
export type TaskStatus =
	| 'pending'
	| 'running'
	| 'paused'
	| 'completed'
	| 'failed'
	| 'cancelled'
	| 'partial';

/**
 * Task type - identifies which feature created this task
 */
export type TaskType =
	| 'token-sweep' // Token归集
	| 'token-distribution' // 代币分发
	| 'batch-transfer' // 批量转账
	| 'wallet-generation' // 钱包生成
	| 'balance-scan' // 余额扫描
	| string; // Allow custom types

/**
 * Pause reason - why was the task paused?
 */
export type PauseReason =
	| 'user' // User clicked pause
	| 'insufficient_gas' // Not enough gas
	| 'network_error' // Network/RPC error
	| 'rate_limit' // Rate limited
	| 'error' // Generic error
	| string; // Allow custom reasons

/**
 * SubTask (子任务) - an independent execution unit
 * Each subtask executes as a whole
 */
export interface SubTask {
	id: string; // Unique identifier (e.g., "subtask-1-eth-1-100")
	taskId: string; // Parent task ID
	subTaskNumber: number; // Sequential subtask number (1, 2, 3...)
	status: TaskStatus;

	// What does this subtask do?
	name: string; // e.g., "ETH: Wallets 1-100"
	description?: string;

	// Execution data (what will be processed)
	data: Record<string, unknown>; // SubTask-specific data (e.g., wallet addresses, token info)

	// Results
	result?: unknown; // Result after execution (e.g., transaction hash, result data)
	error?: string; // Error message if failed

	// Timing
	startedAt?: number;
	completedAt?: number;

	// Retry support
	attempts: number; // Number of execution attempts
	maxAttempts: number; // Maximum retry attempts

	// Progress (optional, for subtasks that report progress)
	progress?: number; // 0-100

	// Metadata
	metadata?: Record<string, unknown>;
}

/**
 * Main task that contains multiple subtasks
 */
export interface Task {
	id: string; // Unique task ID (e.g., "task-token-sweep-1234567890")
	type: TaskType; // What kind of task is this?
	name: string; // Human-readable name (e.g., "归集 ETH, USDC, DAI")
	description?: string; // Optional description
	status: TaskStatus;
	progress: number; // Overall progress percentage (0-100)

	// SubTask information
	totalSubTasks: number;
	completedSubTasks: number;
	failedSubTasks: number;
	currentSubTaskNumber: number; // Which subtask is currently being processed? (1-based)
	subTasks: SubTask[]; // All subtasks

	// Pause/Resume support
	isPaused: boolean;
	pauseReason?: PauseReason;
	pauseMessage?: string; // User-friendly message explaining why paused

	// Timestamps
	createdAt: number;
	updatedAt: number;
	startedAt?: number;
	pausedAt?: number;
	resumedAt?: number;
	completedAt?: number;
	failedAt?: number;
	cancelledAt?: number;

	// Configuration (task-specific data that doesn't change)
	config: Record<string, unknown>; // e.g., { targetAddress, selectedTokens, etc. }

	// Runtime state (task-specific data that changes during execution)
	state: Record<string, unknown>; // e.g., { temporaryWalletAddress, gasUsed, etc. }

	// Aggregated results and errors
	results: unknown[]; // Successful subtask results
	errors: string[]; // Error messages from failed subtasks

	// Metadata
	metadata?: Record<string, unknown>;
}

/**
 * Task creation options
 */
export interface CreateTaskOptions {
	type: TaskType;
	name: string;
	description?: string;
	config: Record<string, unknown>; // Task-level configuration
	subTasks: Array<{
		name: string;
		description?: string;
		data: Record<string, unknown>; // SubTask execution data
		maxAttempts?: number; // Defaults to 3
		metadata?: Record<string, unknown>;
	}>;
	metadata?: Record<string, unknown>;
}

/**
 * Task update payload
 */
export interface TaskUpdate {
	status?: TaskStatus;
	progress?: number;
	currentSubTaskNumber?: number;
	completedSubTasks?: number;
	failedSubTasks?: number;
	isPaused?: boolean;
	pauseReason?: PauseReason;
	pauseMessage?: string;
	state?: Record<string, unknown>; // Merge with existing state
	results?: unknown[]; // Append to existing results
	errors?: string[]; // Append to existing errors
}

/**
 * SubTask update payload
 */
export interface SubTaskUpdate {
	status?: TaskStatus;
	result?: unknown;
	error?: string;
	attempts?: number;
	progress?: number;
}

/**
 * Task execution context
 * Passed to subtask executors for control and progress reporting
 */
export interface TaskExecutionContext {
	task: Task; // Full task info
	subTask: SubTask; // Current subtask being executed
	subTaskNumber: number; // 1-based subtask number

	// Control methods
	isPaused: () => boolean; // Check if task should pause
	checkGasBalance?: () => Promise<boolean>; // Optional: Check if gas is sufficient

	// Progress methods
	updateProgress: (progress: number, message?: string) => Promise<void>; // Update current subtask progress
	updateTaskState: (state: Record<string, unknown>) => Promise<void>; // Update task runtime state

	// Completion methods
	completeSubTask: (result?: unknown) => Promise<void>; // Mark current subtask as complete
	failSubTask: (error: string) => Promise<void>; // Mark current subtask as failed

	// Task control
	pauseTask: (reason: PauseReason, message: string) => Promise<void>; // Pause entire task
	completeTask: () => Promise<void>; // Mark entire task as complete
	failTask: (error: string) => Promise<void>; // Mark entire task as failed
}

/**
 * SubTask executor function signature
 * Each subtask knows how to execute itself
 */
export type SubTaskExecutor = (context: TaskExecutionContext) => Promise<void>;

/**
 * Task executor registry
 * Maps task type to executor function
 */
export type TaskExecutorRegistry = Record<TaskType, SubTaskExecutor>;

/**
 * Task recovery info shown to user
 */
export interface TaskRecoveryInfo {
	task: Task;
	canResume: boolean; // Can this task be resumed?
	shouldAutoResume: boolean; // Should we auto-resume on load?
	recoveryMessage: string; // Message to show user
	nextSubTask?: SubTask; // Next subtask to execute
}

/**
 * Task manager configuration
 */
export interface TaskManagerConfig {
	autoCleanupDays?: number; // Auto cleanup completed/failed tasks after N days (default: 7)
	maxRetries?: number; // Default max retries per subtask (default: 3)
	autoRecoverOnLoad?: boolean; // Auto-recover paused tasks on page load (default: false)
}
