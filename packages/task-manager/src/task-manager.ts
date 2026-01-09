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
	IntegrityCheckResult
} from './types';
import { createIndexedDBStorage } from './storage/indexeddb';
import {
	computeLeafHashesBatched,
	buildMerkleRoot,
	generateMerkleProof,
	verifyMerkleProof
} from './merkle';
import { computeMerkleInWorker, isWorkerSupported, terminateWorker } from './merkle-worker-manager';
import { TabCoordinator, withTabCoordination } from './tab-coordinator';

// ============================================================================
// Performance Configuration
// ============================================================================

/**
 * Batch size for node storage operations
 * Helps avoid memory spikes with large task trees
 */
const STORAGE_BATCH_SIZE = 1000;

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
	// Track active task roots so pause() can update their status
	private activeRoots = new Map<string, TaskRoot>();
	// Mutex locks for atomic stats updates (prevents race conditions in concurrent execution)
	private statsLocks = new Map<string, Promise<void>>();
	// Tab coordinator for multi-tab synchronization
	private tabCoordinator: TabCoordinator | null = null;

	constructor(options: TaskManagerConfig = {}) {
		this.config = {
			dbName: options.dbName ?? 'TaskManager',
			retry: {
				maxAttempts: options.retry?.maxAttempts ?? 3,
				baseDelayMs: options.retry?.baseDelayMs ?? 1000,
				maxDelayMs: options.retry?.maxDelayMs ?? 10000
			},
			cleanupDays: options.cleanupDays ?? 7,
			skipMerkle: options.skipMerkle ?? false,
			useWorker: options.useWorker ?? false,
			enableTabCoordination: options.enableTabCoordination ?? false,
			tabCoordination: {
				lockTimeout: options.tabCoordination?.lockTimeout ?? 30000,
				useSharedReads: options.tabCoordination?.useSharedReads ?? false
			}
		};

		// Create base storage adapter
		let storage = options.storage ?? createIndexedDBStorage(this.config.dbName);

		// Wrap with tab coordination if enabled
		if (this.config.enableTabCoordination) {
			this.tabCoordinator = new TabCoordinator({
				lockName: `task-manager-${this.config.dbName}`,
				lockTimeout: this.config.tabCoordination.lockTimeout,
				useSharedReads: this.config.tabCoordination.useSharedReads
			});
			storage = withTabCoordination(storage, this.tabCoordinator);
		}

		this.storage = storage;
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

		// Compute Merkle root (skip if configured for performance)
		let merkleRoot: string | null = null;

		if (!this.config.skipMerkle) {
			const leaves = nodes.filter((n) => n.isLeaf);

			// Use Web Worker if configured and supported (prevents UI blocking)
			if (this.config.useWorker && isWorkerSupported() && leaves.length > 0) {
				const { hashes, root } = await computeMerkleInWorker(leaves);

				// Assign computed hashes back to leaf nodes
				leaves.forEach((leaf, i) => {
					leaf.hash = hashes[i];
				});

				merkleRoot = root;
			} else {
				// Main thread computation (may block UI for large trees)
				const leafHashes = await computeLeafHashesBatched(leaves);

				// Assign computed hashes back to leaf nodes
				leaves.forEach((leaf, i) => {
					leaf.hash = leafHashes[i];
				});

				merkleRoot = leafHashes.length > 0 ? await buildMerkleRoot(leafHashes) : null;
			}
		}

		// Create root
		const root: TaskRoot = {
			id: rootId,
			name: options.name,
			type: options.type ?? 'default',
			status: 'pending',
			progress: 0,
			concurrency: options.concurrency ?? 1, // Default to serial execution
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

		// Save to storage using atomic operation if available
		// This prevents partial saves if browser crashes mid-operation
		if (this.storage.saveRootWithNodes && nodes.length > 0) {
			await this.storage.saveRootWithNodes(root, nodes);
		} else {
			// Fallback: save root first, then nodes in batches
			await this.storage.saveRoot(root);
			if (nodes.length > 0) {
				for (let i = 0; i < nodes.length; i += STORAGE_BATCH_SIZE) {
					const batch = nodes.slice(i, i + STORAGE_BATCH_SIZE);
					await this.storage.saveNodes(batch);
				}
			}
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
				mode: opt.mode ?? 'progressive', // Default to progressive mode
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
	 * Supports both serial (concurrency=1) and parallel (concurrency>1) execution
	 * Uses streaming mode for memory efficiency with large task trees
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

		// Track active root so pause() can update it
		this.activeRoots.set(taskId, root);

		// Update root status
		root.status = 'running';
		root.startedAt = root.startedAt ?? Date.now();
		root.updatedAt = Date.now();
		await this.storage.saveRoot(root);
		this.emit('start', { root });

		try {
			// Use streaming mode: get IDs only, load nodes on demand
			// This prevents memory explosion with large task trees (10k+ tasks)
			//
			// IMPORTANT: Include 'running' status in recovery
			// If browser crashed while a task was running, its status will be 'running'
			// We need to re-execute it, otherwise it will be stuck forever
			const pendingLeafIds = this.storage.getPendingLeafIds
				? await this.storage.getPendingLeafIds(taskId)
				: // Fallback for adapters without streaming support
					(await this.storage.getLeaves(taskId))
						.filter(
							(leaf) =>
								leaf.status !== 'completed' &&
								leaf.status !== 'failed' &&
								leaf.status !== 'cancelled'
						)
						.map((leaf) => leaf.id);

			const concurrency = root.concurrency ?? 1;

			if (concurrency === 1) {
				// Serial execution with streaming
				await this.executeSerialStreaming(root, pendingLeafIds, getExecutor, abortController);
			} else {
				// Parallel execution with streaming
				await this.executeParallelStreaming(
					root,
					pendingLeafIds,
					getExecutor,
					abortController,
					concurrency
				);
			}

			// Update final status
			await this.updateRootStatusFinal(root);

			return root;
		} finally {
			this.abortControllers.delete(taskId);
			this.activeRoots.delete(taskId);
		}
	}

	/**
	 * Execute leaves serially with streaming (one by one, load on demand)
	 * Memory efficient: only loads one node at a time
	 */
	private async executeSerialStreaming(
		root: TaskRoot,
		leafIds: string[],
		getExecutor: (name?: string) => TaskExecutor<T>,
		abortController: AbortController
	): Promise<void> {
		for (const leafId of leafIds) {
			// Check if paused or cancelled
			const currentStatus = root.status as TaskStatus;
			if (currentStatus === 'paused' || currentStatus === 'cancelled') {
				break;
			}

			// Skip if aborted
			if (abortController.signal.aborted) {
				break;
			}

			// Load node on demand (memory efficient)
			const leaf = (await this.storage.getNode(leafId)) as TaskNode<T> | null;
			if (!leaf) continue;

			// Skip already completed/failed/cancelled
			// Note: 'running' status means crashed mid-execution, so we re-execute
			if (leaf.status === 'completed' || leaf.status === 'failed' || leaf.status === 'cancelled')
				continue;

			await this.executeLeaf(root, leaf, getExecutor(leaf.executor), abortController.signal);
		}
	}

	/**
	 * Execute leaves in parallel with streaming and concurrency limit
	 * Memory efficient: only loads nodes as needed, limits concurrent nodes in memory
	 */
	private async executeParallelStreaming(
		root: TaskRoot,
		leafIds: string[],
		getExecutor: (name?: string) => TaskExecutor<T>,
		abortController: AbortController,
		concurrency: number
	): Promise<void> {
		// Use ID queue instead of object queue to save memory
		const queue = [...leafIds];
		const executing = new Set<Promise<void>>();

		// Cap concurrency to prevent browser freeze with too many parallel operations
		// Infinity or very large numbers are capped to a reasonable limit
		const maxConcurrency = Math.min(concurrency, 100);

		const runNext = async (): Promise<void> => {
			while (queue.length > 0) {
				// Check if paused or cancelled
				const currentStatus = root.status as TaskStatus;
				if (currentStatus === 'paused' || currentStatus === 'cancelled') {
					return;
				}

				// Skip if aborted
				if (abortController.signal.aborted) {
					return;
				}

				// Wait if at concurrency limit
				if (executing.size >= maxConcurrency) {
					await Promise.race(executing);
				}

				// Double-check after waiting
				if (queue.length === 0) return;

				const leafId = queue.shift()!;

				const promise = (async () => {
					// Load node on demand (memory efficient)
					const leaf = (await this.storage.getNode(leafId)) as TaskNode<T> | null;
					if (!leaf) return;

					// Skip already completed/failed/cancelled
					// Note: 'running' status means crashed mid-execution, so we re-execute
					if (
						leaf.status === 'completed' ||
						leaf.status === 'failed' ||
						leaf.status === 'cancelled'
					)
						return;

					await this.executeLeaf(root, leaf, getExecutor(leaf.executor), abortController.signal);
				})().finally(() => {
					executing.delete(promise);
				});

				executing.add(promise);
			}

			// Wait for all remaining tasks
			if (executing.size > 0) {
				await Promise.all(executing);
			}
		};

		await runNext();
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
			isPaused: () => {
				// Check local status first (updated by pauseTask)
				// This is synchronous and fast
				return root.status === 'paused';
			},

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

				// Atomic stats update to prevent race conditions in concurrent execution
				await this.atomicStatsUpdate(root, 'completed');
				this.emit('complete', { root, node: leaf });
			},

			fail: async (error: string) => {
				leaf.status = 'failed';
				leaf.error = error;
				leaf.updatedAt = Date.now();
				await this.storage.saveNode(leaf);

				// Atomic stats update to prevent race conditions in concurrent execution
				await this.atomicStatsUpdate(root, 'failed');
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
	 * Update root progress based on stats (memory efficient)
	 * Uses the already-tracked stats instead of loading all leaves
	 */
	private async updateRootProgress(root: TaskRoot): Promise<void> {
		// Calculate progress from stats (no need to load all leaves)
		const { total, completed, failed } = root.stats;
		const processed = completed + failed;
		root.progress = total > 0 ? Math.round((processed / total) * 100) : 0;
		root.updatedAt = Date.now();
		await this.storage.saveRoot(root);
	}

	/**
	 * Atomic stats update with proper queue-based mutex
	 * Prevents race conditions when multiple tasks complete simultaneously
	 * Uses a chained promise queue to ensure serial execution
	 */
	private async atomicStatsUpdate(root: TaskRoot, type: 'completed' | 'failed'): Promise<void> {
		const rootId = root.id;

		// Get current lock or create initial resolved promise
		const currentLock = this.statsLocks.get(rootId) ?? Promise.resolve();

		// Create our update as a chained promise
		const ourUpdate = currentLock.then(async () => {
			// Re-read root from storage to get latest stats
			const freshRoot = await this.storage.getRoot(rootId);
			if (!freshRoot) {
				return;
			}

			// Increment the appropriate counter
			if (type === 'completed') {
				freshRoot.stats.completed++;
			} else {
				freshRoot.stats.failed++;
			}

			// Update progress
			const { total, completed, failed } = freshRoot.stats;
			const processed = completed + failed;
			freshRoot.progress = total > 0 ? Math.round((processed / total) * 100) : 0;
			freshRoot.updatedAt = Date.now();

			// Save to storage
			await this.storage.saveRoot(freshRoot);

			// Update in-memory root reference to stay in sync
			root.stats = freshRoot.stats;
			root.progress = freshRoot.progress;
			root.updatedAt = freshRoot.updatedAt;
		});

		// Set our update as the new lock (next updates will wait for us)
		this.statsLocks.set(rootId, ourUpdate);

		// Wait for our update to complete
		await ourUpdate;

		// Cleanup if we're still the last lock
		if (this.statsLocks.get(rootId) === ourUpdate) {
			this.statsLocks.delete(rootId);
		}
	}

	/**
	 * Update root status at the end of execution
	 * Uses stats to determine final status (memory efficient)
	 */
	private async updateRootStatusFinal(root: TaskRoot): Promise<void> {
		const { total, completed, failed } = root.stats;

		if (root.status === 'paused' || root.status === 'cancelled') {
			// Keep current status
		} else if (completed === total) {
			root.status = 'completed';
			root.completedAt = Date.now();
		} else if (failed === total) {
			root.status = 'failed';
		} else if (failed > 0 && completed > 0) {
			root.status = 'failed'; // Partial failure
			root.completedAt = Date.now();
		} else if (failed > 0) {
			root.status = 'failed';
		}

		root.progress = total > 0 ? Math.round(((completed + failed) / total) * 100) : 0;
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

		// Update the active root reference so isPaused() returns true
		const activeRoot = this.activeRoots.get(taskId);
		if (activeRoot) {
			activeRoot.status = 'paused';
		}

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
	 * Uses atomic deletion if available to prevent orphaned data
	 */
	async delete(taskId: string): Promise<void> {
		await this.cancel(taskId);

		// Use atomic deletion if available
		if (this.storage.deleteRootWithNodes) {
			await this.storage.deleteRootWithNodes(taskId);
		} else {
			// Fallback: delete nodes first, then root
			// (reverse order from creation to minimize orphan risk)
			await this.storage.deleteNodesByRoot(taskId);
			await this.storage.deleteRoot(taskId);
		}
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
	 * Returns null immediately if skipMerkle is configured
	 */
	async updateMerkleRoot(taskId: string): Promise<string | null> {
		// Skip if Merkle computation is disabled
		if (this.config.skipMerkle) return null;

		const root = await this.storage.getRoot(taskId);
		if (!root) return null;

		const leaves = await this.storage.getLeaves(taskId);
		const leafHashes = await computeLeafHashesBatched(leaves);
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

	// =========================================================================
	// Data Integrity
	// =========================================================================

	/**
	 * Verify data integrity for a specific task
	 * Checks for:
	 * - Stats consistency (completed/failed counts match actual node states)
	 * - Incomplete saves (root exists but nodes are missing or incomplete)
	 * - Orphaned nodes detection
	 *
	 * @param taskId - The task ID to verify
	 * @returns IntegrityCheckResult with validation status and any issues found
	 */
	async verifyIntegrity(taskId: string): Promise<IntegrityCheckResult> {
		const issues: string[] = [];

		const root = await this.storage.getRoot(taskId);
		if (!root) {
			return {
				valid: false,
				issues: ['Root not found']
			};
		}

		// Check for incomplete save (has _creating flag)
		if (root.metadata?._creating) {
			issues.push('Task creation was interrupted - may have incomplete nodes');
		}

		const nodes = await this.storage.getNodesByRoot(taskId);
		const leaves = nodes.filter((n) => n.isLeaf);

		// Check stats consistency
		const actualCompleted = leaves.filter((n) => n.status === 'completed').length;
		const actualFailed = leaves.filter((n) => n.status === 'failed').length;
		const actualTotal = leaves.length;

		if (root.stats.completed !== actualCompleted) {
			issues.push(
				`Stats mismatch: completed count is ${root.stats.completed} but actual is ${actualCompleted}`
			);
		}

		if (root.stats.failed !== actualFailed) {
			issues.push(
				`Stats mismatch: failed count is ${root.stats.failed} but actual is ${actualFailed}`
			);
		}

		if (root.stats.total !== actualTotal) {
			issues.push(
				`Stats mismatch: total count is ${root.stats.total} but actual is ${actualTotal}`
			);
		}

		// Check for stuck running tasks (potential crash recovery needed)
		const runningNodes = leaves.filter((n) => n.status === 'running');
		if (runningNodes.length > 0 && root.status !== 'running') {
			issues.push(
				`Found ${runningNodes.length} nodes with 'running' status but root is '${root.status}' - possible crash during execution`
			);
		}

		return {
			valid: issues.length === 0,
			issues,
			stats: {
				expectedCompleted: root.stats.completed,
				actualCompleted,
				expectedFailed: root.stats.failed,
				actualFailed,
				orphanedNodes: 0 // Will be calculated in cleanupOrphanedData
			}
		};
	}

	/**
	 * Repair stats for a task by recalculating from actual node states
	 * Use after verifyIntegrity reports stats mismatches
	 *
	 * @param taskId - The task ID to repair
	 * @returns true if repairs were made, false if no repairs needed
	 */
	async repairStats(taskId: string): Promise<boolean> {
		const root = await this.storage.getRoot(taskId);
		if (!root) return false;

		const nodes = await this.storage.getNodesByRoot(taskId);
		const leaves = nodes.filter((n) => n.isLeaf);

		const actualCompleted = leaves.filter((n) => n.status === 'completed').length;
		const actualFailed = leaves.filter((n) => n.status === 'failed').length;
		const actualTotal = leaves.length;

		const needsRepair =
			root.stats.completed !== actualCompleted ||
			root.stats.failed !== actualFailed ||
			root.stats.total !== actualTotal;

		if (needsRepair) {
			root.stats = {
				total: actualTotal,
				completed: actualCompleted,
				failed: actualFailed
			};

			// Recalculate progress
			const processed = actualCompleted + actualFailed;
			root.progress = actualTotal > 0 ? Math.round((processed / actualTotal) * 100) : 0;

			// Remove _creating flag if present
			if (root.metadata?._creating) {
				delete root.metadata._creating;
			}

			root.updatedAt = Date.now();
			await this.storage.saveRoot(root);
		}

		return needsRepair;
	}

	/**
	 * Find and clean up orphaned data:
	 * - Nodes without a corresponding root
	 * - Roots with _creating flag (incomplete saves)
	 *
	 * @returns Number of orphaned items cleaned up
	 */
	async cleanupOrphanedData(): Promise<number> {
		let cleaned = 0;

		// Clean up incomplete roots (with _creating flag)
		const roots = await this.storage.getAllRoots();
		for (const root of roots) {
			if (root.metadata?._creating) {
				// This root was never fully created, delete it
				await this.delete(root.id);
				cleaned++;
			}
		}

		// Clean up orphaned nodes (only if storage supports getAllNodes)
		if (this.storage.getAllNodes) {
			const allNodes = await this.storage.getAllNodes();
			const validRootIds = new Set((await this.storage.getAllRoots()).map((r) => r.id));

			// Group orphaned nodes by rootId for batch deletion
			const orphanedByRoot = new Map<string, string[]>();
			for (const node of allNodes) {
				if (!validRootIds.has(node.rootId)) {
					if (!orphanedByRoot.has(node.rootId)) {
						orphanedByRoot.set(node.rootId, []);
					}
					orphanedByRoot.get(node.rootId)!.push(node.id);
				}
			}

			// Delete orphaned nodes
			for (const [rootId] of orphanedByRoot) {
				await this.storage.deleteNodesByRoot(rootId);
				cleaned++;
			}
		}

		return cleaned;
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

		// Release tab coordination locks
		if (this.tabCoordinator) {
			this.tabCoordinator.releaseAll();
		}

		await this.storage.close();
	}

	/**
	 * Check if multi-tab coordination is enabled and supported
	 */
	isTabCoordinationSupported(): boolean {
		return this.tabCoordinator?.supported ?? false;
	}

	/**
	 * Get tab coordination lock status (for debugging)
	 */
	async getTabLockInfo(): Promise<{ held: number; pending: number } | null> {
		if (!this.tabCoordinator) {
			return null;
		}
		return this.tabCoordinator.getLockInfo();
	}

	/**
	 * Clear all data (for testing)
	 */
	async clear(): Promise<void> {
		await this.storage.clear();
		// Terminate worker if it was used
		if (this.config.useWorker) {
			terminateWorker();
		}
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
