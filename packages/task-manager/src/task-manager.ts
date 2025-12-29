/**
 * Task Manager - Core Implementation
 *
 * Manages task creation, execution, and lifecycle with tree structure support
 */

import type {
	Task,
	TaskStatus,
	PauseReason,
	CreateTaskOptions,
	TaskUpdate,
	TaskExecutionContext,
	TaskExecutorRegistry,
	TaskProgressCallback
} from './types';
import { getConfig, type PersistenceAdapter } from './config';
import * as defaultDb from './utils/db';
import {
	findTaskById,
	getNextExecutableTask,
	updateStatistics,
	getParentTask,
	traverseTree
} from './utils/tree';

/**
 * Get persistence adapter (custom or default IndexedDB)
 */
function getAdapter(): PersistenceAdapter {
	const config = getConfig();
	return config.persistenceAdapter || defaultDb;
}

/**
 * Generate unique task ID
 */
function generateTaskId(parentId: string | null, index: number): string {
	const timestamp = Date.now();
	const random = Math.random().toString(36).substring(2, 6);

	if (parentId === null) {
		return `task-${timestamp}-${random}`;
	} else {
		return `${parentId}-${index}`;
	}
}

/**
 * Build task tree from options (recursive)
 */
function buildTaskTree<TData, TResult>(
	options: CreateTaskOptions<TData>,
	parentId: string | null,
	depth: number,
	path: string[],
	index: number = 0
): Task<TData, TResult> {
	const now = Date.now();
	const config = getConfig();
	const taskId = generateTaskId(parentId, index);
	const taskPath = [...path, taskId];

	const isLeaf = !options.children || options.children.length === 0;

	const children: Task<TData, TResult>[] = options.children
		? options.children.map((childOptions, childIndex) =>
				buildTaskTree<TData, TResult>(childOptions, taskId, depth + 1, taskPath, childIndex)
			)
		: [];

	const task: Task<TData, TResult> = {
		id: taskId,
		parentId,
		type: options.type,
		name: options.name,
		description: options.description,

		children,
		depth,
		path: taskPath,

		status: 'pending',
		progress: 0,

		isLeaf,
		executionData: isLeaf ? options.executionData : undefined,
		executor: isLeaf ? options.executor : undefined,
		attempts: 0,
		maxAttempts: options.maxAttempts || config.retry.maxAttempts,

		isPaused: false,

		createdAt: now,
		updatedAt: now,

		totalLeaves: 0,
		completedLeaves: 0,
		failedLeaves: 0,

		config: options.config || {},
		state: {},

		results: [],
		errors: [],

		metadata: options.metadata
	};

	updateStatistics(task);

	return task;
}

/**
 * Create a task tree
 */
export async function createTask<TData = Record<string, unknown>, TResult = unknown>(
	options: CreateTaskOptions<TData>
): Promise<Task<TData, TResult>> {
	const task = buildTaskTree<TData, TResult>(options, null, 0, []);
	await getAdapter().saveTask(task);
	return task;
}

/**
 * Get task by ID
 */
export async function getTask<TData = Record<string, unknown>, TResult = unknown>(
	taskId: string
): Promise<Task<TData, TResult> | null> {
	return getAdapter().getTask<TData, TResult>(taskId);
}

/**
 * Get all tasks
 */
export async function getAllTasks<TData = Record<string, unknown>, TResult = unknown>(): Promise<
	Task<TData, TResult>[]
> {
	return getAdapter().getAllTasks<TData, TResult>();
}

/**
 * Get recoverable tasks
 */
export async function getRecoverableTasks<
	TData = Record<string, unknown>,
	TResult = unknown
>(): Promise<Task<TData, TResult>[]> {
	const allTasks = await getAdapter().getAllTasks<TData, TResult>();
	return allTasks.filter(
		(task) => task.status === 'pending' || task.status === 'running' || task.status === 'paused'
	);
}

/**
 * Get tasks by type
 */
export async function getTasksByType<TData = Record<string, unknown>, TResult = unknown>(
	type: string
): Promise<Task<TData, TResult>[]> {
	return getAdapter().getTasksByType<TData, TResult>(type);
}

/**
 * Get tasks by status
 */
export async function getTasksByStatus<TData = Record<string, unknown>, TResult = unknown>(
	status: TaskStatus
): Promise<Task<TData, TResult>[]> {
	return getAdapter().getTasksByStatus<TData, TResult>(status);
}

/**
 * Update a task within the tree
 */
export async function updateTask<TData = Record<string, unknown>, TResult = unknown>(
	rootTask: Task<TData, TResult>,
	taskId: string,
	update: TaskUpdate<TResult>
): Promise<Task<TData, TResult>> {
	const task = findTaskById(rootTask, taskId);
	if (!task) throw new Error(`Task ${taskId} not found`);

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

	updateStatistics(rootTask);
	await getAdapter().saveTask(rootTask);

	return rootTask;
}

/**
 * Pause a task (and optionally all descendants)
 */
export async function pauseTask<TData = Record<string, unknown>, TResult = unknown>(
	rootTask: Task<TData, TResult>,
	taskId: string,
	reason: PauseReason,
	message?: string,
	pauseDescendants: boolean = true
): Promise<Task<TData, TResult>> {
	const task = findTaskById(rootTask, taskId);
	if (!task) throw new Error(`Task ${taskId} not found`);

	task.isPaused = true;
	task.pauseReason = reason;
	task.pauseMessage = message;
	task.status = 'paused';
	task.pausedAt = Date.now();
	task.updatedAt = Date.now();

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
	await getAdapter().saveTask(rootTask);

	return rootTask;
}

/**
 * Resume a paused task
 */
export async function resumeTask<TData = Record<string, unknown>, TResult = unknown>(
	rootTask: Task<TData, TResult>,
	taskId: string
): Promise<Task<TData, TResult>> {
	const task = findTaskById(rootTask, taskId);
	if (!task) throw new Error(`Task ${taskId} not found`);

	task.isPaused = false;
	task.pauseReason = undefined;
	task.pauseMessage = undefined;
	task.pausedAt = undefined;
	task.updatedAt = Date.now();

	traverseTree(task, (descendant) => {
		if (descendant.isPaused) {
			descendant.isPaused = false;
			descendant.pauseReason = undefined;
			descendant.pauseMessage = undefined;
			descendant.pausedAt = undefined;
			descendant.updatedAt = Date.now();
		}
	});

	updateStatistics(rootTask);
	await getAdapter().saveTask(rootTask);

	return rootTask;
}

/**
 * Cancel a task
 */
export async function cancelTask<TData = Record<string, unknown>, TResult = unknown>(
	rootTask: Task<TData, TResult>,
	taskId: string
): Promise<Task<TData, TResult>> {
	const task = findTaskById(rootTask, taskId);
	if (!task) throw new Error(`Task ${taskId} not found`);

	task.status = 'cancelled';
	task.cancelledAt = Date.now();
	task.updatedAt = Date.now();

	traverseTree(task, (descendant) => {
		if (descendant.id !== taskId && descendant.status !== 'completed') {
			descendant.status = 'cancelled';
			descendant.updatedAt = Date.now();
		}
	});

	updateStatistics(rootTask);
	await getAdapter().saveTask(rootTask);

	return rootTask;
}

/**
 * Delete a task
 */
export async function deleteTask(taskId: string): Promise<void> {
	await getAdapter().deleteTask(taskId);
}

/**
 * Execute a task tree
 * Executes all leaf tasks in depth-first order
 */
export async function executeTask<TData = Record<string, unknown>, TResult = unknown>(
	taskId: string,
	executorRegistry: TaskExecutorRegistry<TData, TResult>,
	onProgress?: TaskProgressCallback<TData, TResult>
): Promise<Task<TData, TResult>> {
	const adapter = getAdapter();
	const config = getConfig();
	const rootTask = await adapter.getTask<TData, TResult>(taskId);
	if (!rootTask) throw new Error(`Task ${taskId} not found`);

	rootTask.status = 'running';
	rootTask.startedAt = rootTask.startedAt || Date.now();
	rootTask.updatedAt = Date.now();
	await adapter.saveTask(rootTask);

	try {
		while (true) {
			if (rootTask.isPaused) {
				break;
			}

			const leafTask = getNextExecutableTask(rootTask);
			if (!leafTask) {
				break;
			}

			const executorName = leafTask.executor;
			if (!executorName) {
				throw new Error(`Leaf task ${leafTask.id} has no executor specified`);
			}

			const executor = executorRegistry[executorName];
			if (!executor) {
				throw new Error(`Executor '${executorName}' not found in registry`);
			}

			leafTask.status = 'running';
			leafTask.startedAt = Date.now();
			leafTask.updatedAt = Date.now();
			updateStatistics(rootTask);
			await adapter.saveTask(rootTask);

			const parentTask = getParentTask(rootTask, leafTask);
			const context: TaskExecutionContext<TData, TResult> = {
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
					await adapter.saveTask(rootTask);

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
					await adapter.saveTask(rootTask);
				},
				completeTask: async (result?: TResult) => {
					leafTask.status = 'completed';
					leafTask.result = result;
					leafTask.completedAt = Date.now();
					leafTask.progress = 100;
					leafTask.updatedAt = Date.now();
					updateStatistics(rootTask);
					await adapter.saveTask(rootTask);

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
					await adapter.saveTask(rootTask);

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
			const maxAttempts = leafTask.maxAttempts || config.retry.maxAttempts;

			for (let attempt = 1; attempt <= maxAttempts; attempt++) {
				try {
					leafTask.attempts = attempt;
					await executor(context);
					lastError = undefined;
					break;
				} catch (error) {
					lastError = error instanceof Error ? error.message : String(error);

					if (attempt < maxAttempts) {
						const delay = Math.min(config.retry.baseDelayMs * attempt, config.retry.maxDelayMs);
						await new Promise((resolve) => setTimeout(resolve, delay));
					}
				}
			}

			if (lastError) {
				await context.failTask(lastError);
			}

			if (rootTask.isPaused) {
				break;
			}
		}

		// Update final root status
		if (!rootTask.isPaused) {
			updateStatistics(rootTask);

			const finalStatus = rootTask.status as TaskStatus;
			if (finalStatus === 'completed') {
				rootTask.completedAt = Date.now();
			} else if (finalStatus === 'failed') {
				rootTask.failedAt = Date.now();
			} else if (finalStatus === 'partial') {
				rootTask.completedAt = Date.now();
			}

			rootTask.updatedAt = Date.now();
			await adapter.saveTask(rootTask);
		}

		return rootTask;
	} catch (error) {
		rootTask.status = 'failed';
		rootTask.errors.push(error instanceof Error ? error.message : String(error));
		rootTask.failedAt = Date.now();
		rootTask.updatedAt = Date.now();
		await adapter.saveTask(rootTask);
		throw error;
	}
}
