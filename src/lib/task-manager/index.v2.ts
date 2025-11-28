/**
 * Task Manager - Universal Task Management System (Tree Structure)
 *
 * A completely generic task management system based on tree structure.
 * Supports infinite nesting of tasks for maximum flexibility.
 */

// Core types
export type * from './types.v2';

// Tree utilities
export * from './tree-utils';

// Database operations
export { saveTask, getTasksByStatus, getTasksByType, cleanupOldTasks } from './db.v2';

// Task manager functions (public API)
export {
	createTask,
	getTask,
	getAllTasks,
	getRecoverableTasks,
	updateTask,
	pauseTask,
	resumeTask,
	cancelTask,
	deleteTask,
	executeTask
} from './task-manager.v2';

// Svelte store
export { taskStore } from './task-store.v2.svelte';

// UI Components (these will need to be updated to support tree structure)
export { default as TaskRecoveryModal } from './components/task-recovery-modal.svelte';
export { default as TaskList } from './components/task-list.svelte';
export { default as TaskDetail } from './components/task-detail.svelte';
