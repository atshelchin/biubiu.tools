/**
 * Svelte 5 Reactive Task Store
 *
 * Provides reactive state management for task trees with automatic persistence sync
 */

import { SvelteMap } from 'svelte/reactivity';
import type { Task } from '../types';
import * as taskManager from '../task-manager';
import { findTasks, getLeafTasks } from '../utils/tree';

/**
 * Task store state
 */
class TaskStore {
	// Reactive map of root tasks by ID
	tasks = $state(new SvelteMap<string, Task>());

	// Derived values - all based on root tasks
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
	 * Initialize store by loading tasks from persistence
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
	 * Add or update a root task in the store
	 */
	setTask(task: Task) {
		this.tasks.set(task.id, task);
	}

	/**
	 * Get a root task by ID
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

	/**
	 * Get all leaf tasks from all root tasks
	 */
	getAllLeafTasks(): Task[] {
		const leaves: Task[] = [];
		this.allTasks.forEach((rootTask) => {
			leaves.push(...getLeafTasks(rootTask));
		});
		return leaves;
	}

	/**
	 * Find tasks matching a filter across all root tasks
	 */
	findTasks(filter: (task: Task) => boolean): Task[] {
		const results: Task[] = [];
		this.allTasks.forEach((rootTask) => {
			results.push(...findTasks(rootTask, filter));
		});
		return results;
	}

	/**
	 * Get total statistics across all tasks
	 */
	getTotalStatistics() {
		let totalLeaves = 0;
		let completedLeaves = 0;
		let failedLeaves = 0;

		this.allTasks.forEach((task) => {
			totalLeaves += task.totalLeaves;
			completedLeaves += task.completedLeaves;
			failedLeaves += task.failedLeaves;
		});

		return {
			totalLeaves,
			completedLeaves,
			failedLeaves,
			pendingLeaves: totalLeaves - completedLeaves - failedLeaves,
			completionRate: totalLeaves > 0 ? Math.round((completedLeaves / totalLeaves) * 100) : 0
		};
	}

	/**
	 * Reset store (useful for testing)
	 */
	reset() {
		this.tasks.clear();
		this.isLoading = false;
		this.isInitialized = false;
	}
}

/**
 * Create a new task store instance
 * Allows for multiple independent stores if needed
 */
export function createTaskStore(): TaskStore {
	return new TaskStore();
}

/**
 * Global task store instance (singleton)
 */
export const taskStore = createTaskStore();
