/**
 * @shelchin/task-manager
 *
 * Universal Task Management System with Tree Structure
 *
 * Features:
 * - Tree-based task structure (unlimited nesting)
 * - Pause/Resume functionality
 * - IndexedDB persistence
 * - Svelte 5 reactive store
 * - Progress tracking and aggregation
 * - Retry with backoff
 * - Custom persistence adapters
 */

// Configuration
export {
	initTaskManager,
	getConfig,
	isTaskManagerInitialized,
	resetConfig,
	DEFAULT_CONFIG,
	type TaskManagerConfig,
	type ResolvedConfig,
	type PersistenceAdapter
} from './config';

// Types
export type {
	Task,
	TaskStatus,
	TaskType,
	PauseReason,
	CreateTaskOptions,
	TaskUpdate,
	TaskExecutionContext,
	TaskExecutor,
	TaskExecutorRegistry,
	TaskRecoveryInfo,
	TaskVisitor,
	TaskFilter,
	TaskProgressCallback
} from './types';

// Task Manager Core API
export {
	createTask,
	getTask,
	getAllTasks,
	getRecoverableTasks,
	getTasksByType,
	getTasksByStatus,
	updateTask,
	pauseTask,
	resumeTask,
	cancelTask,
	deleteTask,
	executeTask
} from './task-manager';

// Tree Utilities
export {
	traverseTree,
	findTaskById,
	findTasks,
	getLeafTasks,
	getParentTasks,
	countLeaves,
	calculateProgress,
	calculateStatus,
	updateStatistics,
	getTaskPath,
	getParentTask,
	getNextExecutableTask,
	cloneTask,
	flattenTree,
	getTreeDepth,
	isAncestor,
	getDescendants
} from './utils/tree';

// Database Utilities
export {
	saveTask,
	getTask as getTaskFromDb,
	getAllTasks as getAllTasksFromDb,
	deleteTask as deleteTaskFromDb,
	getRecoverableTasks as getRecoverableTasksFromDb,
	getTasksByStatus as getTasksByStatusFromDb,
	getTasksByType as getTasksByTypeFromDb,
	cleanupOldTasks,
	clearAllTasks,
	closeDB
} from './utils/db';

// Stores
export { createTaskStore, taskStore } from './stores';
