/**
 * Tab Coordinator - Multi-tab synchronization for IndexedDB
 *
 * Prevents data corruption when multiple browser tabs access the same database.
 * Uses Web Locks API for cross-tab synchronization.
 *
 * Features:
 * - Exclusive locks for write operations
 * - Shared locks for read operations
 * - Automatic lock release on tab close
 * - Fallback for unsupported browsers
 */

// ============================================================================
// Types
// ============================================================================

export interface TabCoordinatorOptions {
	/**
	 * Unique identifier for the lock scope (defaults to database name)
	 */
	lockName?: string;

	/**
	 * Lock timeout in milliseconds (default: 30000)
	 * If a lock is held longer than this, it may indicate a stuck operation
	 */
	lockTimeout?: number;

	/**
	 * Whether to use shared locks for reads (default: false)
	 * When true, multiple tabs can read simultaneously
	 * When false, all operations are exclusive (safer but slower)
	 */
	useSharedReads?: boolean;
}

export interface LockHandle {
	release: () => void;
}

type LockMode = 'exclusive' | 'shared';

// ============================================================================
// Web Locks API Type Declarations
// ============================================================================

interface LockInfo {
	name: string;
	mode: LockMode;
	clientId: string;
}

interface LockManagerSnapshot {
	held: LockInfo[];
	pending: LockInfo[];
}

interface LockManager {
	request<T>(
		name: string,
		options: { mode?: LockMode; ifAvailable?: boolean; signal?: AbortSignal },
		callback: (lock: unknown) => Promise<T>
	): Promise<T | undefined>;
	query(): Promise<LockManagerSnapshot>;
}

declare global {
	interface Navigator {
		locks?: LockManager;
	}
}

// ============================================================================
// TabCoordinator Class
// ============================================================================

export class TabCoordinator {
	private lockName: string;
	private lockTimeout: number;
	private useSharedReads: boolean;
	private isSupported: boolean;

	// Track active locks for cleanup
	private activeLocks = new Set<AbortController>();

	constructor(options: TabCoordinatorOptions = {}) {
		this.lockName = options.lockName ?? 'task-manager';
		this.lockTimeout = options.lockTimeout ?? 30000;
		this.useSharedReads = options.useSharedReads ?? false;
		this.isSupported = typeof navigator !== 'undefined' && 'locks' in navigator;
	}

	/**
	 * Check if Web Locks API is supported
	 */
	get supported(): boolean {
		return this.isSupported;
	}

	/**
	 * Acquire an exclusive write lock
	 * Only one tab can hold this lock at a time
	 */
	async acquireWriteLock<T>(operation: () => Promise<T>): Promise<T> {
		return this.acquireLock('exclusive', operation);
	}

	/**
	 * Acquire a read lock
	 * Behavior depends on useSharedReads option
	 */
	async acquireReadLock<T>(operation: () => Promise<T>): Promise<T> {
		const mode = this.useSharedReads ? 'shared' : 'exclusive';
		return this.acquireLock(mode, operation);
	}

	/**
	 * Internal lock acquisition
	 */
	private async acquireLock<T>(mode: LockMode, operation: () => Promise<T>): Promise<T> {
		// Fallback for unsupported browsers
		if (!this.isSupported) {
			return operation();
		}

		const controller = new AbortController();
		this.activeLocks.add(controller);

		// Set timeout to prevent deadlocks
		const timeoutId = setTimeout(() => {
			controller.abort();
		}, this.lockTimeout);

		try {
			const result = await navigator.locks!.request(
				this.lockName,
				{ mode, signal: controller.signal },
				async () => {
					return operation();
				}
			);

			return result as T;
		} catch (error) {
			if (error instanceof Error && error.name === 'AbortError') {
				throw new Error(`Lock acquisition timed out after ${this.lockTimeout}ms`);
			}
			throw error;
		} finally {
			clearTimeout(timeoutId);
			this.activeLocks.delete(controller);
		}
	}

	/**
	 * Try to acquire lock immediately without waiting
	 * Returns undefined if lock is not available
	 */
	async tryAcquireWriteLock<T>(operation: () => Promise<T>): Promise<T | undefined> {
		if (!this.isSupported) {
			return operation();
		}

		return navigator.locks!.request(
			this.lockName,
			{ mode: 'exclusive', ifAvailable: true },
			async (lock) => {
				if (!lock) {
					return undefined;
				}
				return operation();
			}
		);
	}

	/**
	 * Check if any lock is currently held on this resource
	 */
	async isLocked(): Promise<boolean> {
		if (!this.isSupported) {
			return false;
		}

		const state = await navigator.locks!.query();
		return state.held.some((lock) => lock.name === this.lockName);
	}

	/**
	 * Get information about current locks
	 */
	async getLockInfo(): Promise<{ held: number; pending: number }> {
		if (!this.isSupported) {
			return { held: 0, pending: 0 };
		}

		const state = await navigator.locks!.query();
		const held = state.held.filter((lock) => lock.name === this.lockName).length;
		const pending = state.pending.filter((lock) => lock.name === this.lockName).length;

		return { held, pending };
	}

	/**
	 * Release all active locks held by this coordinator
	 * Use this when closing the application
	 */
	releaseAll(): void {
		for (const controller of this.activeLocks) {
			controller.abort();
		}
		this.activeLocks.clear();
	}
}

// ============================================================================
// Singleton Factory
// ============================================================================

const coordinators = new Map<string, TabCoordinator>();

/**
 * Get or create a TabCoordinator for a specific database
 */
export function getTabCoordinator(
	dbName: string,
	options?: Omit<TabCoordinatorOptions, 'lockName'>
): TabCoordinator {
	const existing = coordinators.get(dbName);
	if (existing) {
		return existing;
	}

	const coordinator = new TabCoordinator({ ...options, lockName: `task-manager-${dbName}` });
	coordinators.set(dbName, coordinator);
	return coordinator;
}

// ============================================================================
// Helper: Wrap Storage Adapter with Tab Coordination
// ============================================================================

import type { StorageAdapter, TaskRoot, TaskNode, TaskStatus } from './types';

/**
 * Wrap a storage adapter with tab coordination
 * All write operations will acquire exclusive locks
 */
export function withTabCoordination(
	adapter: StorageAdapter,
	coordinator: TabCoordinator
): StorageAdapter {
	return {
		// Write operations (exclusive lock)
		saveRoot: (root: TaskRoot) => coordinator.acquireWriteLock(() => adapter.saveRoot(root)),

		saveNode: (node: TaskNode) => coordinator.acquireWriteLock(() => adapter.saveNode(node)),

		saveNodes: (nodes: TaskNode[]) => coordinator.acquireWriteLock(() => adapter.saveNodes(nodes)),

		deleteRoot: (id: string) => coordinator.acquireWriteLock(() => adapter.deleteRoot(id)),

		deleteNodesByRoot: (rootId: string) =>
			coordinator.acquireWriteLock(() => adapter.deleteNodesByRoot(rootId)),

		updateNodeStatus: (id: string, status: TaskStatus, updates?: Partial<TaskNode>) =>
			coordinator.acquireWriteLock(() => adapter.updateNodeStatus(id, status, updates)),

		// Read operations (shared or exclusive based on config)
		getRoot: (id: string) => coordinator.acquireReadLock(() => adapter.getRoot(id)),

		getAllRoots: () => coordinator.acquireReadLock(() => adapter.getAllRoots()),

		getNode: (id: string) => coordinator.acquireReadLock(() => adapter.getNode(id)),

		getNodesByRoot: (rootId: string) =>
			coordinator.acquireReadLock(() => adapter.getNodesByRoot(rootId)),

		getChildren: (parentId: string | null, rootId: string) =>
			coordinator.acquireReadLock(() => adapter.getChildren(parentId, rootId)),

		getLeaves: (rootId: string) => coordinator.acquireReadLock(() => adapter.getLeaves(rootId)),

		// Atomic operations (exclusive lock)
		saveRootWithNodes: adapter.saveRootWithNodes
			? (root: TaskRoot, nodes: TaskNode[]) =>
					coordinator.acquireWriteLock(() => adapter.saveRootWithNodes!(root, nodes))
			: undefined,

		deleteRootWithNodes: adapter.deleteRootWithNodes
			? (rootId: string) => coordinator.acquireWriteLock(() => adapter.deleteRootWithNodes!(rootId))
			: undefined,

		getAllNodes: adapter.getAllNodes
			? () => coordinator.acquireReadLock(() => adapter.getAllNodes!())
			: undefined,

		// Streaming operations
		getLeafCount: adapter.getLeafCount
			? (rootId: string) => coordinator.acquireReadLock(() => adapter.getLeafCount!(rootId))
			: undefined,

		getPendingLeafCount: adapter.getPendingLeafCount
			? (rootId: string) => coordinator.acquireReadLock(() => adapter.getPendingLeafCount!(rootId))
			: undefined,

		getLeafIds: adapter.getLeafIds
			? (rootId: string) => coordinator.acquireReadLock(() => adapter.getLeafIds!(rootId))
			: undefined,

		getPendingLeafIds: adapter.getPendingLeafIds
			? (rootId: string) => coordinator.acquireReadLock(() => adapter.getPendingLeafIds!(rootId))
			: undefined,

		// Lifecycle
		close: () => {
			coordinator.releaseAll();
			return adapter.close();
		},

		clear: () => coordinator.acquireWriteLock(() => adapter.clear()),

		// Recovery
		reconnect: adapter.reconnect,
		isHealthy: adapter.isHealthy,
		resetDatabase: adapter.resetDatabase
			? () => coordinator.acquireWriteLock(() => adapter.resetDatabase!())
			: undefined
	};
}
