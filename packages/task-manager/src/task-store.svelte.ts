/**
 * Svelte 5 reactive task store
 *
 * Provides reactive state management for tasks with automatic IndexedDB sync
 */

import { SvelteMap } from 'svelte/reactivity';
import type { Task } from './types';
import * as taskManager from './task-manager';

/**
 * Task store state
 */
class TaskStore {
	// Reactive map of tasks by ID
	tasks = $state(new SvelteMap<string, Task>());

	// Derived values
	allTasks = $derived(Array.from(this.tasks.values()));
	runningTasks = $derived(this.allTasks.filter((t) => t.status === 'running'));
	pausedTasks = $derived(this.allTasks.filter((t) => t.status === 'paused'));
	completedTasks = $derived(this.allTasks.filter((t) => t.status === 'completed'));
	failedTasks = $derived(this.allTasks.filter((t) => t.status === 'failed'));
	recoverableTasks = $derived(
		this.allTasks.filter(
			(t) => t.status === 'pending' || t.status === 'running' || t.status === 'paused'
		)
	);

	// Loading state
	isLoading = $state(false);
	isInitialized = $state(false);

	/**
	 * Initialize store by loading tasks from IndexedDB
	 */
	async init() {
		if (this.isInitialized) return;

		this.isLoading = true;
		try {
			const tasks = await taskManager.getAllTasks();
			this.tasks.clear();
			tasks.forEach((task) => {
				this.tasks.set(task.id, task);
			});
			this.isInitialized = true;
		} finally {
			this.isLoading = false;
		}
	}

	/**
	 * Add or update a task in the store
	 */
	setTask(task: Task) {
		this.tasks.set(task.id, task);
	}

	/**
	 * Get a task by ID
	 */
	getTask(taskId: string): Task | undefined {
		return this.tasks.get(taskId);
	}

	/**
	 * Remove a task from the store
	 */
	removeTask(taskId: string) {
		this.tasks.delete(taskId);
	}

	/**
	 * Refresh a task from database
	 */
	async refreshTask(taskId: string) {
		const task = await taskManager.getTask(taskId);
		if (task) {
			this.setTask(task);
		} else {
			this.removeTask(taskId);
		}
	}

	/**
	 * Refresh all tasks from database
	 */
	async refreshAll() {
		this.isLoading = true;
		try {
			const tasks = await taskManager.getAllTasks();
			this.tasks.clear();
			tasks.forEach((task) => {
				this.tasks.set(task.id, task);
			});
		} finally {
			this.isLoading = false;
		}
	}

	/**
	 * Delete a task
	 */
	async deleteTask(taskId: string) {
		await taskManager.deleteTask(taskId);
		this.removeTask(taskId);
	}

	/**
	 * Clear completed tasks
	 */
	async clearCompleted() {
		const completedIds = this.completedTasks.map((t) => t.id);
		await Promise.all(completedIds.map((id) => this.deleteTask(id)));
	}

	/**
	 * Clear failed tasks
	 */
	async clearFailed() {
		const failedIds = this.failedTasks.map((t) => t.id);
		await Promise.all(failedIds.map((id) => this.deleteTask(id)));
	}
}

/**
 * Global task store instance
 */
export const taskStore = new TaskStore();

/**
 * Initialize task store on module load
 */
if (typeof window !== 'undefined') {
	taskStore.init();
}
