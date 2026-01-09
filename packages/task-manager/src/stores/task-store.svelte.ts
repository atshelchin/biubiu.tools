/**
 * Svelte 5 Reactive Task Store
 *
 * Provides reactive state management for task management with:
 * - Automatic sync with TaskManager
 * - Derived computed values
 * - Event subscription
 */

import { SvelteMap } from 'svelte/reactivity';
import type {
	TaskRoot,
	TaskNode,
	TaskManagerConfig,
	TaskExecutor,
	ExecutorRegistry
} from '../types';
import { TaskManager, createTaskManager } from '../task-manager';

/**
 * Reactive Task Store
 */
export class TaskStore<T = unknown> {
	private manager: TaskManager<T>;

	// Reactive state
	roots = $state(new SvelteMap<string, TaskRoot>());
	isLoading = $state(false);
	isInitialized = $state(false);

	// Derived values
	allRoots = $derived(Array.from(this.roots.values()));
	pendingRoots = $derived(this.allRoots.filter((r) => r.status === 'pending'));
	runningRoots = $derived(this.allRoots.filter((r) => r.status === 'running'));
	pausedRoots = $derived(this.allRoots.filter((r) => r.status === 'paused'));
	completedRoots = $derived(this.allRoots.filter((r) => r.status === 'completed'));
	failedRoots = $derived(this.allRoots.filter((r) => r.status === 'failed'));
	recoverableRoots = $derived(
		this.allRoots.filter(
			(r) => r.status === 'pending' || r.status === 'running' || r.status === 'paused'
		)
	);

	// Statistics
	stats = $derived({
		total: this.allRoots.reduce((sum, r) => sum + r.stats.total, 0),
		completed: this.allRoots.reduce((sum, r) => sum + r.stats.completed, 0),
		failed: this.allRoots.reduce((sum, r) => sum + r.stats.failed, 0),
		pending: this.allRoots.reduce(
			(sum, r) => sum + r.stats.total - r.stats.completed - r.stats.failed,
			0
		),
		completionRate: (() => {
			const total = this.allRoots.reduce((sum, r) => sum + r.stats.total, 0);
			const completed = this.allRoots.reduce((sum, r) => sum + r.stats.completed, 0);
			return total > 0 ? Math.round((completed / total) * 100) : 0;
		})()
	});

	constructor(config?: TaskManagerConfig) {
		this.manager = createTaskManager<T>(config);
		this.setupEventListeners();
	}

	/**
	 * Setup event listeners to sync state
	 */
	private setupEventListeners(): void {
		const events = ['start', 'progress', 'complete', 'fail', 'pause', 'resume', 'cancel'] as const;
		for (const event of events) {
			this.manager.on(event, (_, data) => {
				this.roots.set(data.root.id, { ...data.root });
			});
		}
	}

	/**
	 * Initialize store by loading from storage
	 */
	async init(): Promise<void> {
		if (this.isInitialized) return;

		this.isLoading = true;
		try {
			const roots = await this.manager.getAllRoots();
			this.roots.clear();
			for (const root of roots) {
				this.roots.set(root.id, root);
			}
			this.isInitialized = true;
		} finally {
			this.isLoading = false;
		}
	}

	// =========================================================================
	// Task Operations (delegate to manager)
	// =========================================================================

	/**
	 * Create a new task
	 */
	async create(options: Parameters<TaskManager<T>['create']>[0]): Promise<TaskRoot> {
		const root = await this.manager.create(options);
		this.roots.set(root.id, root);
		return root;
	}

	/**
	 * Execute a task
	 */
	async execute(
		taskId: string,
		executorOrRegistry: TaskExecutor<T> | ExecutorRegistry<T>
	): Promise<TaskRoot> {
		const root = await this.manager.execute(taskId, executorOrRegistry);
		this.roots.set(root.id, root);
		return root;
	}

	/**
	 * Pause a task
	 */
	async pause(taskId: string, reason?: string): Promise<void> {
		await this.manager.pause(taskId, reason);
		await this.refreshRoot(taskId);
	}

	/**
	 * Resume a paused task
	 */
	async resume(
		taskId: string,
		executorOrRegistry: TaskExecutor<T> | ExecutorRegistry<T>
	): Promise<TaskRoot> {
		const root = await this.manager.resume(taskId, executorOrRegistry);
		this.roots.set(root.id, root);
		return root;
	}

	/**
	 * Cancel a task
	 */
	async cancel(taskId: string): Promise<void> {
		await this.manager.cancel(taskId);
		await this.refreshRoot(taskId);
	}

	/**
	 * Delete a task
	 */
	async delete(taskId: string): Promise<void> {
		await this.manager.delete(taskId);
		this.roots.delete(taskId);
	}

	// =========================================================================
	// Queries
	// =========================================================================

	/**
	 * Get a root by ID
	 */
	getRoot(taskId: string): TaskRoot | undefined {
		return this.roots.get(taskId);
	}

	/**
	 * Get nodes for a task
	 */
	async getNodes(taskId: string): Promise<TaskNode<T>[]> {
		return this.manager.getNodes(taskId);
	}

	/**
	 * Get children of a node
	 */
	async getChildren(taskId: string, parentId?: string | null): Promise<TaskNode<T>[]> {
		return this.manager.getChildren(taskId, parentId);
	}

	/**
	 * Get leaves of a task
	 */
	async getLeaves(taskId: string): Promise<TaskNode<T>[]> {
		return this.manager.getLeaves(taskId);
	}

	// =========================================================================
	// Merkle
	// =========================================================================

	/**
	 * Get Merkle root
	 */
	async getMerkleRoot(taskId: string): Promise<string | null> {
		return this.manager.getMerkleRoot(taskId);
	}

	/**
	 * Get Merkle proof
	 */
	async getMerkleProof(taskId: string, leafId: string) {
		return this.manager.getMerkleProof(taskId, leafId);
	}

	/**
	 * Verify Merkle proof
	 */
	async verifyProof(proof: Parameters<TaskManager<T>['verifyProof']>[0]): Promise<boolean> {
		return this.manager.verifyProof(proof);
	}

	// =========================================================================
	// Sync & Cleanup
	// =========================================================================

	/**
	 * Refresh a single root from storage
	 */
	async refreshRoot(taskId: string): Promise<void> {
		const root = await this.manager.getRoot(taskId);
		if (root) {
			this.roots.set(root.id, root);
		} else {
			this.roots.delete(taskId);
		}
	}

	/**
	 * Refresh all roots from storage
	 */
	async refreshAll(): Promise<void> {
		this.isLoading = true;
		try {
			const roots = await this.manager.getAllRoots();
			this.roots.clear();
			for (const root of roots) {
				this.roots.set(root.id, root);
			}
		} finally {
			this.isLoading = false;
		}
	}

	/**
	 * Clear completed tasks from store
	 */
	async clearCompleted(): Promise<void> {
		// Get completed roots directly from the map to avoid derived value timing issues
		const completed = Array.from(this.roots.values()).filter((r) => r.status === 'completed');
		await Promise.all(completed.map((r) => this.delete(r.id)));
	}

	/**
	 * Clear failed tasks from store
	 */
	async clearFailed(): Promise<void> {
		// Get failed roots directly from the map to avoid derived value timing issues
		const failed = Array.from(this.roots.values()).filter((r) => r.status === 'failed');
		await Promise.all(failed.map((r) => this.delete(r.id)));
	}

	/**
	 * Cleanup old tasks
	 */
	async cleanup(olderThanDays?: number): Promise<number> {
		const count = await this.manager.cleanup(olderThanDays);
		await this.refreshAll();
		return count;
	}

	/**
	 * Reset store
	 */
	reset(): void {
		this.roots.clear();
		this.isLoading = false;
		this.isInitialized = false;
	}

	/**
	 * Close store and manager
	 */
	async close(): Promise<void> {
		await this.manager.close();
		this.reset();
	}

	/**
	 * Clear all data
	 */
	async clear(): Promise<void> {
		await this.manager.clear();
		this.reset();
	}

	/**
	 * Get underlying manager (for advanced use)
	 */
	getManager(): TaskManager<T> {
		return this.manager;
	}
}

/**
 * Create a new task store
 */
export function createTaskStore<T = unknown>(config?: TaskManagerConfig): TaskStore<T> {
	return new TaskStore<T>(config);
}

/**
 * Global task store singleton
 */
export const taskStore = createTaskStore();
