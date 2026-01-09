/**
 * Task Manager - Core Implementation
 *
 * A tree-based task management system with:
 * - Split storage for efficient loading
 * - Merkle tree support for verification
 * - Event-driven architecture
 * - Clean, minimal API
 */

import type {
	TaskRoot,
	TaskNode,
	TaskStatus,
	CreateTaskOptions,
	CreateNodeOptions,
	ExecutionContext,
	TaskExecutor,
	ExecutorRegistry,
	TaskEvent,
	TaskEventHandler,
	StorageAdapter,
	TaskManagerConfig,
	ResolvedConfig,
	MerkleProof,
	DEFAULT_CONFIG
} from './types';
import { createIndexedDBStorage } from './storage/indexeddb';
import {
	computeLeafHash,
	buildMerkleRoot,
	generateMerkleProof,
	verifyMerkleProof
} from './merkle';

// ============================================================================
// ID Generation
// ============================================================================

function generateId(): string {
	const timestamp = Date.now().toString(36);
	const random = Math.random().toString(36).substring(2, 8);
	return `${timestamp}-${random}`;
}

function generateNodeId(rootId: string, index: number): string {
	return `${rootId}-n${index}`;
}

// ============================================================================
// Task Manager Class
// ============================================================================

export class TaskManager<T = unknown> {
	private storage: StorageAdapter;
	private config: ResolvedConfig;
	private eventHandlers = new Map<TaskEvent, Set<TaskEventHandler>>();
	private abortControllers = new Map<string, AbortController>();

	constructor(options: TaskManagerConfig = {}) {
		this.config = {
			dbName: options.dbName ?? 'TaskManager',
			retry: {
				maxAttempts: options.retry?.maxAttempts ?? 3,
				baseDelayMs: options.retry?.baseDelayMs ?? 1000,
				maxDelayMs: options.retry?.maxDelayMs ?? 10000
			},
			cleanupDays: options.cleanupDays ?? 7
		};

		this.storage = options.storage ?? createIndexedDBStorage(this.config.dbName);
	}

	// =========================================================================
	// Task Creation
	// =========================================================================

	/**
	 * Create a new task tree
	 */
	async create(options: CreateTaskOptions<T>): Promise<TaskRoot> {
		const now = Date.now();
		const rootId = generateId();

		// Build all nodes from options
		const { nodes, leafCount } = this.buildNodes(rootId, options.children ?? [], now);

		// Compute Merkle root from leaf hashes
		const leaves = nodes.filter((n) => n.isLeaf);
		const leafHashes = await Promise.all(leaves.map(computeLeafHash));
		const merkleRoot = leafHashes.length > 0 ? await buildMerkleRoot(leafHashes) : null;

		// Create root
		const root: TaskRoot = {
			id: rootId,
			name: options.name,
			type: options.type ?? 'default',
			status: 'pending',
			progress: 0,
			stats: {
				total: leafCount,
				completed: 0,
				failed: 0
			},
			merkleRoot,
			createdAt: now,
			updatedAt: now,
			metadata: options.metadata
		};

		// Save to storage
		await this.storage.saveRoot(root);
		if (nodes.length > 0) {
			await this.storage.saveNodes(nodes);
		}

		return root;
	}

	/**
	 * Build nodes from options (recursive)
	 */
	private buildNodes(
		rootId: string,
		options: CreateNodeOptions<T>[],
		now: number,
		parentId: string | null = null,
		depth: number = 0,
		globalIndex: { value: number } = { value: 0 }
	): { nodes: TaskNode<T>[]; leafCount: number } {
		const nodes: TaskNode<T>[] = [];
		let leafCount = 0;

		for (let i = 0; i < options.length; i++) {
			const opt = options[i];
			const nodeId = generateNodeId(rootId, globalIndex.value++);
			const isLeaf = !opt.children || opt.children.length === 0;

			const node: TaskNode<T> = {
				id: nodeId,
				rootId,
				parentId,
				name: opt.name,
				status: 'pending',
				progress: 0,
				depth,
				index: i,
				isLeaf,
				childCount: opt.children?.length ?? 0,
				hash: '', // Will be computed below
				data: isLeaf ? opt.data : undefined,
				executor: isLeaf ? opt.executor : undefined,
				attempts: 0,
				maxAttempts: opt.maxAttempts ?? this.config.retry.maxAttempts,
				createdAt: now,
				updatedAt: now
			};

			nodes.push(node);

			if (isLeaf) {
				leafCount++;
			} else if (opt.children) {
				const result = this.buildNodes(rootId, opt.children, now, nodeId, depth + 1, globalIndex);
				nodes.push(...result.nodes);
				leafCount += result.leafCount;
			}
		}

		return { nodes, leafCount };
	}

	// =========================================================================
	// Task Execution
	// =========================================================================

	/**
	 * Execute a task tree
	 */
	async execute(
		taskId: string,
		executorOrRegistry: TaskExecutor<T> | ExecutorRegistry<T>
	): Promise<TaskRoot> {
		const root = await this.storage.getRoot(taskId);
		if (!root) throw new Error(`Task ${taskId} not found`);

		// Get executor function
		const getExecutor = (name?: string): TaskExecutor<T> => {
			if (typeof executorOrRegistry === 'function') {
				return executorOrRegistry;
			}
			if (!name) throw new Error('No executor specified for leaf');
			const executor = executorOrRegistry[name];
			if (!executor) throw new Error(`Executor '${name}' not found`);
			return executor;
		};

		// Setup abort controller
		const abortController = new AbortController();
		this.abortControllers.set(taskId, abortController);

		// Update root status
		root.status = 'running';
		root.startedAt = root.startedAt ?? Date.now();
		root.updatedAt = Date.now();
		await this.storage.saveRoot(root);
		this.emit('start', { root });

		try {
			// Get all leaves in order
			const leaves = await this.storage.getLeaves(taskId);

			// Execute leaves one by one
			for (const leaf of leaves) {
				// Check if paused or cancelled (status may have changed)
				const currentStatus = root.status as TaskStatus;
				if (currentStatus === 'paused' || currentStatus === 'cancelled') {
					break;
				}

				// Skip completed/failed leaves
				if (leaf.status === 'completed' || leaf.status === 'failed') {
					continue;
				}

				// Skip if aborted
				if (abortController.signal.aborted) {
					break;
				}

				await this.executeLeaf(root, leaf as TaskNode<T>, getExecutor(leaf.executor), abortController.signal);

				// Refresh root to get updated stats
				const updatedRoot = await this.storage.getRoot(taskId);
				if (updatedRoot) {
					Object.assign(root, updatedRoot);
				}
			}

			// Update final status
			await this.updateRootStatus(root);

			return root;
		} finally {
			this.abortControllers.delete(taskId);
		}
	}

	/**
	 * Execute a single leaf task
	 */
	private async executeLeaf(
		root: TaskRoot,
		leaf: TaskNode<T>,
		executor: TaskExecutor<T>,
		signal: AbortSignal
	): Promise<void> {
		// Mark as running
		leaf.status = 'running';
		leaf.startedAt = Date.now();
		leaf.updatedAt = Date.now();
		await this.storage.saveNode(leaf);

		// Create execution context
		const ctx: ExecutionContext<T> = {
			node: leaf,
			data: leaf.data as T,
			signal,
			isPaused: () => root.status === 'paused',

			progress: async (percent: number) => {
				leaf.progress = Math.min(100, Math.max(0, percent));
				leaf.updatedAt = Date.now();
				await this.storage.saveNode(leaf);
				await this.updateRootProgress(root);
				this.emit('progress', { root, node: leaf });
			},

			complete: async (result?: unknown) => {
				leaf.status = 'completed';
				leaf.progress = 100;
				leaf.result = result;
				leaf.completedAt = Date.now();
				leaf.updatedAt = Date.now();
				await this.storage.saveNode(leaf);

				root.stats.completed++;
				await this.updateRootProgress(root);
				this.emit('complete', { root, node: leaf });
			},

			fail: async (error: string) => {
				leaf.status = 'failed';
				leaf.error = error;
				leaf.updatedAt = Date.now();
				await this.storage.saveNode(leaf);

				root.stats.failed++;
				await this.updateRootProgress(root);
				this.emit('fail', { root, node: leaf });
			},

			pauseTask: async (reason?: string) => {
				await this.pause(root.id, reason);
				// Update local root reference so the execution loop knows we're paused
				root.status = 'paused';
			}
		};

		// Execute with retry
		let lastError: string | undefined;
		const maxAttempts = leaf.maxAttempts;

		for (let attempt = 1; attempt <= maxAttempts; attempt++) {
			if (signal.aborted) break;

			try {
				leaf.attempts = attempt;
				await executor(ctx);

				// If executor didn't call complete/fail, mark as completed
				// But not if task was paused
				if (leaf.status === 'running' && root.status !== 'paused') {
					await ctx.complete();
				}

				lastError = undefined;
				break;
			} catch (error) {
				lastError = error instanceof Error ? error.message : String(error);

				if (attempt < maxAttempts && !signal.aborted) {
					const delay = Math.min(
						this.config.retry.baseDelayMs * attempt,
						this.config.retry.maxDelayMs
					);
					await this.delay(delay, signal);
				}
			}
		}

		// If all attempts failed
		const leafStatus = leaf.status as TaskStatus;
		if (lastError && leafStatus !== 'failed') {
			await ctx.fail(lastError);
		}
	}

	/**
	 * Update root progress based on leaves
	 */
	private async updateRootProgress(root: TaskRoot): Promise<void> {
		const leaves = await this.storage.getLeaves(root.id);
		const totalProgress = leaves.reduce((sum, leaf) => sum + leaf.progress, 0);
		root.progress = leaves.length > 0 ? Math.round(totalProgress / leaves.length) : 0;
		root.updatedAt = Date.now();
		await this.storage.saveRoot(root);
	}

	/**
	 * Update root status based on leaves
	 */
	private async updateRootStatus(root: TaskRoot): Promise<void> {
		const leaves = await this.storage.getLeaves(root.id);

		const allCompleted = leaves.every((l) => l.status === 'completed');
		const allFailed = leaves.every((l) => l.status === 'failed');
		const anyFailed = leaves.some((l) => l.status === 'failed');
		const anyCompleted = leaves.some((l) => l.status === 'completed');

		if (root.status === 'paused' || root.status === 'cancelled') {
			// Keep current status
		} else if (allCompleted) {
			root.status = 'completed';
			root.completedAt = Date.now();
		} else if (allFailed) {
			root.status = 'failed';
		} else if (anyFailed && anyCompleted) {
			root.status = 'failed'; // Partial failure
			root.completedAt = Date.now();
		}

		root.updatedAt = Date.now();
		await this.storage.saveRoot(root);
	}

	// =========================================================================
	// Task Control
	// =========================================================================

	/**
	 * Pause a task
	 */
	async pause(taskId: string, reason?: string): Promise<void> {
		const root = await this.storage.getRoot(taskId);
		if (!root) throw new Error(`Task ${taskId} not found`);

		root.status = 'paused';
		root.updatedAt = Date.now();
		if (reason) {
			root.metadata = { ...root.metadata, pauseReason: reason };
		}
		await this.storage.saveRoot(root);
		this.emit('pause', { root });
	}

	/**
	 * Resume a paused task
	 */
	async resume(
		taskId: string,
		executorOrRegistry: TaskExecutor<T> | ExecutorRegistry<T>
	): Promise<TaskRoot> {
		const root = await this.storage.getRoot(taskId);
		if (!root) throw new Error(`Task ${taskId} not found`);
		if (root.status !== 'paused') throw new Error(`Task ${taskId} is not paused`);

		root.status = 'running';
		root.updatedAt = Date.now();
		delete root.metadata?.pauseReason;
		await this.storage.saveRoot(root);
		this.emit('resume', { root });

		return this.execute(taskId, executorOrRegistry);
	}

	/**
	 * Cancel a task
	 */
	async cancel(taskId: string): Promise<void> {
		const root = await this.storage.getRoot(taskId);
		if (!root) throw new Error(`Task ${taskId} not found`);

		// Abort execution if running
		const controller = this.abortControllers.get(taskId);
		if (controller) {
			controller.abort();
		}

		root.status = 'cancelled';
		root.updatedAt = Date.now();
		await this.storage.saveRoot(root);

		// Cancel all pending nodes
		const nodes = await this.storage.getNodesByRoot(taskId);
		for (const node of nodes) {
			if (node.status === 'pending' || node.status === 'running') {
				node.status = 'cancelled';
				node.updatedAt = Date.now();
			}
		}
		await this.storage.saveNodes(nodes);

		this.emit('cancel', { root });
	}

	/**
	 * Delete a task and all its nodes
	 */
	async delete(taskId: string): Promise<void> {
		await this.cancel(taskId);
		await this.storage.deleteNodesByRoot(taskId);
		await this.storage.deleteRoot(taskId);
	}

	// =========================================================================
	// Queries
	// =========================================================================

	/**
	 * Get a task root by ID
	 */
	async getRoot(taskId: string): Promise<TaskRoot | null> {
		return this.storage.getRoot(taskId);
	}

	/**
	 * Get all task roots
	 */
	async getAllRoots(): Promise<TaskRoot[]> {
		return this.storage.getAllRoots();
	}

	/**
	 * Get a task node by ID
	 */
	async getNode(nodeId: string): Promise<TaskNode<T> | null> {
		return this.storage.getNode(nodeId) as Promise<TaskNode<T> | null>;
	}

	/**
	 * Get all nodes for a task
	 */
	async getNodes(taskId: string): Promise<TaskNode<T>[]> {
		return this.storage.getNodesByRoot(taskId) as Promise<TaskNode<T>[]>;
	}

	/**
	 * Get direct children of a node (or root)
	 */
	async getChildren(taskId: string, parentId: string | null = null): Promise<TaskNode<T>[]> {
		return this.storage.getChildren(parentId, taskId) as Promise<TaskNode<T>[]>;
	}

	/**
	 * Get all leaf nodes for a task
	 */
	async getLeaves(taskId: string): Promise<TaskNode<T>[]> {
		return this.storage.getLeaves(taskId) as Promise<TaskNode<T>[]>;
	}

	/**
	 * Get recoverable tasks (pending, running, or paused)
	 */
	async getRecoverable(): Promise<TaskRoot[]> {
		const roots = await this.storage.getAllRoots();
		return roots.filter(
			(r) => r.status === 'pending' || r.status === 'running' || r.status === 'paused'
		);
	}

	// =========================================================================
	// Merkle Tree
	// =========================================================================

	/**
	 * Get the Merkle root for a task
	 */
	async getMerkleRoot(taskId: string): Promise<string | null> {
		const root = await this.storage.getRoot(taskId);
		return root?.merkleRoot ?? null;
	}

	/**
	 * Generate Merkle proof for a leaf node
	 */
	async getMerkleProof(taskId: string, leafId: string): Promise<MerkleProof | null> {
		const leaves = await this.storage.getLeaves(taskId);
		return generateMerkleProof(leaves, leafId);
	}

	/**
	 * Verify a Merkle proof
	 */
	async verifyProof(proof: MerkleProof): Promise<boolean> {
		return verifyMerkleProof(proof);
	}

	/**
	 * Recompute and update the Merkle root
	 * Call this after modifying leaf data
	 */
	async updateMerkleRoot(taskId: string): Promise<string | null> {
		const root = await this.storage.getRoot(taskId);
		if (!root) return null;

		const leaves = await this.storage.getLeaves(taskId);
		const leafHashes = await Promise.all(leaves.map(computeLeafHash));
		const merkleRoot = leafHashes.length > 0 ? await buildMerkleRoot(leafHashes) : null;

		root.merkleRoot = merkleRoot;
		root.updatedAt = Date.now();
		await this.storage.saveRoot(root);

		return merkleRoot;
	}

	// =========================================================================
	// Events
	// =========================================================================

	/**
	 * Subscribe to task events
	 */
	on(event: TaskEvent, handler: TaskEventHandler): () => void {
		if (!this.eventHandlers.has(event)) {
			this.eventHandlers.set(event, new Set());
		}
		this.eventHandlers.get(event)!.add(handler);

		// Return unsubscribe function
		return () => {
			this.eventHandlers.get(event)?.delete(handler);
		};
	}

	/**
	 * Emit an event
	 */
	private emit(event: TaskEvent, data: { root: TaskRoot; node?: TaskNode }): void {
		const handlers = this.eventHandlers.get(event);
		if (handlers) {
			for (const handler of handlers) {
				try {
					handler(event, data);
				} catch (error) {
					console.error(`Error in ${event} handler:`, error);
				}
			}
		}
	}

	// =========================================================================
	// Utilities
	// =========================================================================

	/**
	 * Delay with abort support
	 */
	private delay(ms: number, signal?: AbortSignal): Promise<void> {
		return new Promise((resolve, reject) => {
			const timer = setTimeout(resolve, ms);
			signal?.addEventListener('abort', () => {
				clearTimeout(timer);
				reject(new Error('Aborted'));
			});
		});
	}

	/**
	 * Clean up old completed tasks
	 */
	async cleanup(olderThanDays?: number): Promise<number> {
		const days = olderThanDays ?? this.config.cleanupDays;
		const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
		const roots = await this.storage.getAllRoots();

		let deleted = 0;
		for (const root of roots) {
			if (
				(root.status === 'completed' || root.status === 'failed' || root.status === 'cancelled') &&
				root.updatedAt < cutoff
			) {
				await this.delete(root.id);
				deleted++;
			}
		}

		return deleted;
	}

	/**
	 * Close the storage connection
	 */
	async close(): Promise<void> {
		// Abort all running tasks
		for (const controller of this.abortControllers.values()) {
			controller.abort();
		}
		this.abortControllers.clear();
		this.eventHandlers.clear();
		await this.storage.close();
	}

	/**
	 * Clear all data (for testing)
	 */
	async clear(): Promise<void> {
		await this.storage.clear();
	}
}

// ============================================================================
// Factory Function
// ============================================================================

/**
 * Create a new TaskManager instance
 */
export function createTaskManager<T = unknown>(config?: TaskManagerConfig): TaskManager<T> {
	return new TaskManager<T>(config);
}
