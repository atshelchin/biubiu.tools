/**
 * Task Manager - Universal Task Management System
 *
 * A generic, reusable task management system for handling long-running,
 * multi-step operations with pause/resume support and IndexedDB persistence.
 */

// Core types
export type * from './types';

// Database operations (internal - use task manager functions instead)
export { saveTask, getTasksByStatus, getTasksByType, cleanupOldTasks } from './db';

// Task manager functions (public API)
export {
	createTask,
	getTask,
	getAllTasks,
	getRecoverableTasks,
	updateTask,
	updateSubTask,
	pauseTask,
	resumeTask,
	cancelTask,
	deleteTask,
	executeTask
} from './task-manager';

// Svelte store
export { taskStore } from './task-store.svelte';

// UI Components
export { default as TaskRecoveryModal } from './components/task-recovery-modal.svelte';
export { default as TaskList } from './components/task-list.svelte';
export { default as TaskDetail } from './components/task-detail.svelte';
