/**
 * Task Manager - Tree Structure Implementation
 *
 * Manages task creation, execution, and lifecycle with tree structure support
 */

import type {
	Task,
	TaskType,
	TaskStatus,
	PauseReason,
	CreateTaskOptions,
	TaskUpdate,
	TaskExecutionContext,
	TaskExecutor,
	TaskExecutorRegistry
} from './types.v2';
import * as db from './db.v2';
import {
	findTaskById,
	getNextExecutableTask,
	updateStatistics,
	getParentTask,
	traverseTree
} from './tree-utils';

/**
 * Generate unique task ID
 */
function generateTaskId(parentId: string | null, index: number): string {
	const timestamp = Date.now();
	const random = Math.random().toString(36).substring(2, 6);

	if (parentId === null) {
		// Root task
		return `task-${timestamp}-${random}`;
	} else {
		// Child task
		return `${parentId}-${index}`;
	}
}

/**
 * Build task tree from options (recursive)
 */
function buildTaskTree(
	options: CreateTaskOptions,
	parentId: string | null,
	depth: number,
	path: string[],
	index: number = 0
): Task {
	const now = Date.now();
	const taskId = generateTaskId(parentId, index);
	const taskPath = [...path, taskId];

	// Determine if this is a leaf task
	const isLeaf = !options.children || options.children.length === 0;

	// Build children recursively
	const children: Task[] = options.children
		? options.children.map((childOptions, childIndex) =>
				buildTaskTree(childOptions, taskId, depth + 1, taskPath, childIndex)
			)
		: [];

	const task: Task = {
		// Identity
		id: taskId,
		parentId,
		type: options.type,
		name: options.name,
		description: options.description,

		// Hierarchy
		children,
		depth,
		path: taskPath,

		// Status & Progress
		status: 'pending',
		progress: 0,

		// Execution (only for leaf tasks)
		isLeaf,
		executionData: isLeaf ? options.executionData : undefined,
		executor: isLeaf ? options.executor : undefined,
		attempts: 0,
		maxAttempts: options.maxAttempts || 3,

		// Pause/Resume
		isPaused: false,

		// Timestamps
		createdAt: now,
		updatedAt: now,

		// Statistics (will be calculated)
		totalLeaves: 0,
		completedLeaves: 0,
		failedLeaves: 0,

		// Configuration & State
		config: options.config || {},
		state: {},

		// Results & Errors
		results: [],
		errors: [],

		// Metadata
		metadata: options.metadata
	};

	// Calculate initial statistics
	updateStatistics(task);

	return task;
}

/**
 * Create a task tree
 */
export async function createTask(options: CreateTaskOptions): Promise<Task> {
	const task = buildTaskTree(options, null, 0, []);
	await db.saveTask(task);
	return task;
}

/**
 * Get task by ID
 */
export async function getTask(taskId: string): Promise<Task | null> {
	return db.getTask(taskId);
}

/**
 * Get all tasks
 */
export async function getAllTasks(): Promise<Task[]> {
	return db.getAllTasks();
}

/**
 * Get recoverable tasks
 */
export async function getRecoverableTasks(): Promise<Task[]> {
	return db.getRecoverableTasks();
}

/**
 * Update a task within the tree
 */
export async function updateTask(
	rootTask: Task,
	taskId: string,
	update: TaskUpdate
): Promise<Task> {
	const task = findTaskById(rootTask, taskId);
	if (!task) throw new Error(`Task ${taskId} not found`);

	// Apply updates
	if (update.status !== undefined) task.status = update.status;
	if (update.progress !== undefined) task.progress = update.progress;
	if (update.isPaused !== undefined) task.isPaused = update.isPaused;
	if (update.pauseReason !== undefined) task.pauseReason = update.pauseReason;
	if (update.pauseMessage !== undefined) task.pauseMessage = update.pauseMessage;
	if (update.result !== undefined) task.result = update.result;
	if (update.error !== undefined) task.error = update.error;
	if (update.attempts !== undefined) task.attempts = update.attempts;

	if (update.state) {
		task.state = { ...task.state, ...update.state };
	}

	task.updatedAt = Date.now();

	// Update statistics up the tree
	updateStatistics(rootTask);

	// Save the entire tree
	await db.saveTask(rootTask);

	return rootTask;
}

/**
 * Pause a task (and optionally all descendants)
 */
export async function pauseTask(
	rootTask: Task,
	taskId: string,
	reason: PauseReason,
	message?: string,
	pauseDescendants: boolean = true
): Promise<Task> {
	const task = findTaskById(rootTask, taskId);
	if (!task) throw new Error(`Task ${taskId} not found`);

	task.isPaused = true;
	task.pauseReason = reason;
	task.pauseMessage = message;
	task.status = 'paused';
	task.pausedAt = Date.now();
	task.updatedAt = Date.now();

	// Pause all descendants if requested
	if (pauseDescendants) {
		traverseTree(task, (descendant) => {
			if (descendant.id !== taskId && descendant.status === 'running') {
				descendant.isPaused = true;
				descendant.status = 'paused';
				descendant.updatedAt = Date.now();
			}
		});
	}

	updateStatistics(rootTask);
	await db.saveTask(rootTask);

	return rootTask;
}

/**
 * Resume a paused task
 */
export async function resumeTask(rootTask: Task, taskId: string): Promise<Task> {
	const task = findTaskById(rootTask, taskId);
	if (!task) throw new Error(`Task ${taskId} not found`);

	task.isPaused = false;
	task.pauseReason = undefined;
	task.pauseMessage = undefined;
	task.pausedAt = undefined;
	task.updatedAt = Date.now();

	// Resume all descendants
	traverseTree(task, (descendant) => {
		if (descendant.isPaused) {
			descendant.isPaused = false;
			descendant.pauseReason = undefined;
			descendant.pauseMessage = undefined;
			descendant.pausedAt = undefined;
			descendant.updatedAt = Date.now();
		}
	});

	// Update statistics will recalculate the correct status based on children
	updateStatistics(rootTask);
	await db.saveTask(rootTask);

	return rootTask;
}

/**
 * Cancel a task
 */
export async function cancelTask(rootTask: Task, taskId: string): Promise<Task> {
	const task = findTaskById(rootTask, taskId);
	if (!task) throw new Error(`Task ${taskId} not found`);

	task.status = 'cancelled';
	task.cancelledAt = Date.now();
	task.updatedAt = Date.now();

	// Cancel all descendants
	traverseTree(task, (descendant) => {
		if (descendant.id !== taskId && descendant.status !== 'completed') {
			descendant.status = 'cancelled';
			descendant.updatedAt = Date.now();
		}
	});

	updateStatistics(rootTask);
	await db.saveTask(rootTask);

	return rootTask;
}

/**
 * Delete a task
 */
export async function deleteTask(taskId: string): Promise<void> {
	await db.deleteTask(taskId);
}

/**
 * Execute a task tree
 * Executes all leaf tasks in depth-first order
 */
export async function executeTask(
	taskId: string,
	executorRegistry: TaskExecutorRegistry,
	onProgress?: (rootTask: Task, currentTask: Task) => void
): Promise<Task> {
	const rootTask = await db.getTask(taskId);
	if (!rootTask) throw new Error(`Task ${taskId} not found`);

	// Mark root as running
	rootTask.status = 'running';
	rootTask.startedAt = rootTask.startedAt || Date.now();
	rootTask.updatedAt = Date.now();
	await db.saveTask(rootTask);

	try {
		// Execute leaf tasks one by one
		while (true) {
			// Check if root is paused
			if (rootTask.isPaused) {
				break;
			}

			// Get next executable leaf task
			const leafTask = getNextExecutableTask(rootTask);
			if (!leafTask) {
				// No more tasks to execute
				break;
			}

			// Get executor function
			const executorName = leafTask.executor;
			if (!executorName) {
				throw new Error(`Leaf task ${leafTask.id} has no executor specified`);
			}

			const executor = executorRegistry[executorName];
			if (!executor) {
				throw new Error(`Executor '${executorName}' not found in registry`);
			}

			// Mark leaf task as running
			leafTask.status = 'running';
			leafTask.startedAt = Date.now();
			leafTask.updatedAt = Date.now();
			updateStatistics(rootTask);
			await db.saveTask(rootTask);

			// Create execution context
			const parentTask = getParentTask(rootTask, leafTask);
			const context: TaskExecutionContext = {
				task: leafTask,
				parentTask,
				rootTask,
				isPaused: () => rootTask.isPaused || leafTask.isPaused,
				updateProgress: async (progress: number, message?: string) => {
					leafTask.progress = progress;
					if (message) {
						leafTask.metadata = { ...leafTask.metadata, lastMessage: message };
					}
					leafTask.updatedAt = Date.now();
					updateStatistics(rootTask);
					await db.saveTask(rootTask);

					// Call progress callback with error handling
					if (onProgress) {
						try {
							onProgress(rootTask, leafTask);
						} catch (error) {
							console.error('Error in onProgress callback:', error);
						}
					}
				},
				updateTaskState: async (state: Record<string, unknown>) => {
					leafTask.state = { ...leafTask.state, ...state };
					leafTask.updatedAt = Date.now();
					await db.saveTask(rootTask);
				},
				completeTask: async (result?: unknown) => {
					leafTask.status = 'completed';
					leafTask.result = result;
					leafTask.completedAt = Date.now();
					leafTask.progress = 100;
					leafTask.updatedAt = Date.now();
					updateStatistics(rootTask);
					await db.saveTask(rootTask);

					// Call progress callback with error handling
					if (onProgress) {
						try {
							onProgress(rootTask, leafTask);
						} catch (error) {
							console.error('Error in onProgress callback:', error);
						}
					}
				},
				failTask: async (error: string) => {
					leafTask.status = 'failed';
					leafTask.error = error;
					leafTask.failedAt = Date.now();
					leafTask.updatedAt = Date.now();
					leafTask.errors.push(error);
					updateStatistics(rootTask);
					await db.saveTask(rootTask);

					// Call progress callback with error handling
					if (onProgress) {
						try {
							onProgress(rootTask, leafTask);
						} catch (error) {
							console.error('Error in onProgress callback:', error);
						}
					}
				},
				pauseParent: async (reason: PauseReason, message: string) => {
					if (parentTask) {
						await pauseTask(rootTask, parentTask.id, reason, message);
					}
				},
				pauseRoot: async (reason: PauseReason, message: string) => {
					await pauseTask(rootTask, rootTask.id, reason, message);
				}
			};

			// Execute with retry logic
			let lastError: string | undefined;
			for (let attempt = 1; attempt <= leafTask.maxAttempts; attempt++) {
				try {
					leafTask.attempts = attempt;
					await executor(context);
					lastError = undefined;
					break; // Success
				} catch (error) {
					lastError = error instanceof Error ? error.message : String(error);

					if (attempt < leafTask.maxAttempts) {
						// Retry after delay
						await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
					}
				}
			}

			// If all attempts failed, fail the task
			if (lastError) {
				await context.failTask(lastError);
			}

			// Check if paused during execution
			if (rootTask.isPaused) {
				break;
			}
		}

		// Update final root status
		if (!rootTask.isPaused) {
			updateStatistics(rootTask);

			// Set completion timestamp based on final status
			// Note: updateStatistics() can change the status from 'running' to other states
			const finalStatus = rootTask.status as TaskStatus;
			if (finalStatus === 'completed') {
				rootTask.completedAt = Date.now();
			} else if (finalStatus === 'failed') {
				rootTask.failedAt = Date.now();
			} else if (finalStatus === 'partial') {
				rootTask.completedAt = Date.now();
			}

			rootTask.updatedAt = Date.now();
			await db.saveTask(rootTask);
		}

		return rootTask;
	} catch (error) {
		// Handle unexpected errors
		rootTask.status = 'failed';
		rootTask.errors.push(error instanceof Error ? error.message : String(error));
		rootTask.failedAt = Date.now();
		rootTask.updatedAt = Date.now();
		await db.saveTask(rootTask);
		throw error;
	}
}
