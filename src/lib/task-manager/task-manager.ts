/**
 * Core task manager implementation
 *
 * Provides functions to create, execute, pause, resume, and manage tasks
 * with persistent storage in IndexedDB.
 */

import type {
	Task,
	SubTask,
	TaskType,
	TaskStatus,
	PauseReason,
	CreateTaskOptions,
	TaskUpdate,
	SubTaskUpdate,
	TaskExecutionContext,
	SubTaskExecutor
} from './types';
import * as db from './db';

/**
 * Generate a unique task ID
 */
function generateTaskId(type: TaskType): string {
	const timestamp = Date.now();
	const random = Math.random().toString(36).substring(2, 9);
	return `task-${type}-${timestamp}-${random}`;
}

/**
 * Generate a unique subtask ID
 */
function generateSubTaskId(taskId: string, subTaskNumber: number): string {
	return `${taskId}-subtask-${subTaskNumber}`;
}

/**
 * Create a new task
 */
export async function createTask(options: CreateTaskOptions): Promise<Task> {
	const now = Date.now();
	const taskId = generateTaskId(options.type);

	// Create subtasks
	const subTasks: SubTask[] = options.subTasks.map((subTaskData, index) => ({
		id: generateSubTaskId(taskId, index + 1),
		taskId,
		subTaskNumber: index + 1,
		status: 'pending' as TaskStatus,
		name: subTaskData.name || `SubTask ${index + 1}`,
		description: subTaskData.description,
		data: subTaskData.data,
		attempts: 0,
		maxAttempts: subTaskData.maxAttempts || 3,
		progress: 0,
		metadata: subTaskData.metadata
	}));

	const task: Task = {
		id: taskId,
		type: options.type,
		name: options.name,
		status: 'pending',
		progress: 0,
		totalSubTasks: subTasks.length,
		completedSubTasks: 0,
		failedSubTasks: 0,
		currentSubTaskNumber: 0,
		subTasks,
		isPaused: false,
		config: options.config || {},
		state: {},
		results: [],
		errors: [],
		createdAt: now,
		updatedAt: now
	};

	await db.saveTask(task);
	return task;
}

/**
 * Get a task by ID
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
 * Get recoverable tasks (pending, running, or paused)
 */
export async function getRecoverableTasks(): Promise<Task[]> {
	return db.getRecoverableTasks();
}

/**
 * Update task
 */
export async function updateTask(taskId: string, update: TaskUpdate): Promise<void> {
	const task = await db.getTask(taskId);
	if (!task) throw new Error(`Task ${taskId} not found`);

	Object.assign(task, update, { updatedAt: Date.now() });
	await db.saveTask(task);
}

/**
 * Update subtask
 */
export async function updateSubTask(
	taskId: string,
	subTaskId: string,
	update: SubTaskUpdate
): Promise<void> {
	const task = await db.getTask(taskId);
	if (!task) throw new Error(`Task ${taskId} not found`);

	const subTask = task.subTasks.find((st) => st.id === subTaskId);
	if (!subTask) throw new Error(`SubTask ${subTaskId} not found`);

	Object.assign(subTask, update);
	task.updatedAt = Date.now();
	await db.saveTask(task);
}

/**
 * Pause a task
 */
export async function pauseTask(
	taskId: string,
	reason: PauseReason,
	message?: string
): Promise<void> {
	const task = await db.getTask(taskId);
	if (!task) throw new Error(`Task ${taskId} not found`);

	task.isPaused = true;
	task.pauseReason = reason;
	task.status = 'paused';
	task.pausedAt = Date.now();
	task.updatedAt = Date.now();

	if (message) {
		task.errors.push(message);
	}

	await db.saveTask(task);
}

/**
 * Resume a paused task
 */
export async function resumeTask(taskId: string): Promise<void> {
	const task = await db.getTask(taskId);
	if (!task) throw new Error(`Task ${taskId} not found`);

	task.isPaused = false;
	task.pauseReason = undefined;
	task.status = 'running';
	task.pausedAt = undefined;
	task.updatedAt = Date.now();

	await db.saveTask(task);
}

/**
 * Cancel a task
 */
export async function cancelTask(taskId: string): Promise<void> {
	const task = await db.getTask(taskId);
	if (!task) throw new Error(`Task ${taskId} not found`);

	task.status = 'cancelled';
	task.cancelledAt = Date.now();
	task.updatedAt = Date.now();

	await db.saveTask(task);
}

/**
 * Delete a task
 */
export async function deleteTask(taskId: string): Promise<void> {
	await db.deleteTask(taskId);
}

/**
 * Execute a task
 */
export async function executeTask(
	taskId: string,
	executor: SubTaskExecutor,
	onProgress?: (task: Task, subTask: SubTask) => void
): Promise<Task> {
	const task = await db.getTask(taskId);
	if (!task) throw new Error(`Task ${taskId} not found`);

	// Mark task as running
	task.status = 'running';
	task.startedAt = task.startedAt || Date.now();
	task.updatedAt = Date.now();
	await db.saveTask(task);

	try {
		// Execute each subtask
		for (let i = task.currentSubTaskNumber; i < task.subTasks.length; i++) {
			const subTask = task.subTasks[i];

			// Check if task is paused
			if (task.isPaused) {
				break;
			}

			// Skip already completed subtasks
			if (subTask.status === 'completed') {
				continue;
			}

			// Update current subtask
			task.currentSubTaskNumber = i;
			subTask.status = 'running';
			subTask.startedAt = Date.now();
			task.updatedAt = Date.now();
			await db.saveTask(task);

			// Create execution context
			const context: TaskExecutionContext = {
				task,
				subTask,
				subTaskNumber: subTask.subTaskNumber,
				isPaused: () => task.isPaused,
				updateProgress: async (progress: number, message?: string) => {
					subTask.progress = progress;
					if (message) {
						subTask.metadata = { ...subTask.metadata, lastMessage: message };
					}
					task.updatedAt = Date.now();
					await db.saveTask(task);
					onProgress?.(task, subTask);
				},
				updateTaskState: async (state: Record<string, unknown>) => {
					task.state = { ...task.state, ...state };
					task.updatedAt = Date.now();
					await db.saveTask(task);
				},
				completeSubTask: async (result?: unknown) => {
					subTask.status = 'completed';
					subTask.result = result;
					subTask.completedAt = Date.now();
					subTask.progress = 100;
					task.completedSubTasks++;
					task.progress = Math.round((task.completedSubTasks / task.totalSubTasks) * 100);
					task.results.push(result);
					task.updatedAt = Date.now();
					await db.saveTask(task);
					onProgress?.(task, subTask);
				},
				failSubTask: async (error: string) => {
					subTask.status = 'failed';
					subTask.error = error;
					subTask.completedAt = Date.now();
					task.failedSubTasks++;
					task.errors.push(`SubTask ${subTask.subTaskNumber}: ${error}`);
					task.updatedAt = Date.now();
					await db.saveTask(task);
					onProgress?.(task, subTask);
				},
				pauseTask: async (reason: PauseReason, message: string) => {
					await pauseTask(taskId, reason, message);
				},
				completeTask: async () => {
					task.status = 'completed';
					task.progress = 100;
					task.completedAt = Date.now();
					task.updatedAt = Date.now();
					await db.saveTask(task);
				},
				failTask: async (error: string) => {
					task.status = 'failed';
					task.errors.push(error);
					task.failedAt = Date.now();
					task.updatedAt = Date.now();
					await db.saveTask(task);
				}
			};

			// Execute subtask with retry logic
			let lastError: string | undefined;
			for (let attempt = 1; attempt <= subTask.maxAttempts; attempt++) {
				try {
					subTask.attempts = attempt;
					await executor(context);
					lastError = undefined;
					break; // Success, exit retry loop
				} catch (error) {
					lastError = error instanceof Error ? error.message : String(error);

					if (attempt < subTask.maxAttempts) {
						// Retry after delay
						await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
					}
				}
			}

			// If all attempts failed, fail the subtask
			if (lastError) {
				await context.failSubTask(lastError);
			}

			// Check if task was paused during execution
			if (task.isPaused) {
				break;
			}
		}

		// Update final task status
		if (!task.isPaused) {
			if (task.failedSubTasks > 0 && task.completedSubTasks === 0) {
				task.status = 'failed';
				task.failedAt = Date.now();
			} else if (task.completedSubTasks === task.totalSubTasks) {
				task.status = 'completed';
				task.progress = 100;
				task.completedAt = Date.now();
			} else {
				task.status = 'partial';
				task.completedAt = Date.now();
			}
			task.updatedAt = Date.now();
			await db.saveTask(task);
		}

		return task;
	} catch (error) {
		// Handle unexpected errors
		task.status = 'failed';
		task.errors.push(error instanceof Error ? error.message : String(error));
		task.failedAt = Date.now();
		task.updatedAt = Date.now();
		await db.saveTask(task);
		throw error;
	}
}
