/**
 * IndexedDB Storage Adapter
 *
 * Split storage implementation:
 * - 'roots' store: Task root metadata (lightweight, for list views)
 * - 'nodes' store: All task nodes (loaded on demand)
 *
 * Features:
 * - Automatic connection recovery with retry
 * - Timeout handling for database operations
 * - Blocked database handling (e.g., other tabs)
 */

import type { TaskRoot, TaskNode, TaskStatus, StorageAdapter } from '../types';
import { StorageError } from '../types';

const DB_VERSION = 1;
const ROOTS_STORE = 'roots';
const NODES_STORE = 'nodes';

// Configuration
const OPEN_TIMEOUT_MS = 5000; // 5 seconds timeout for opening database
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 100;

export class IndexedDBStorage implements StorageAdapter {
	private db: IDBDatabase | null = null;
	private dbName: string;
	private dbPromise: Promise<IDBDatabase> | null = null;
	private isOpening = false;

	constructor(dbName: string = 'TaskManager') {
		this.dbName = dbName;
	}

	/**
	 * Reset connection state - useful when database becomes inaccessible
	 */
	private resetConnection(): void {
		if (this.db) {
			try {
				this.db.close();
			} catch {
				// Ignore close errors
			}
		}
		this.db = null;
		this.dbPromise = null;
		this.isOpening = false;
	}

	/**
	 * Open database with timeout and retry support
	 */
	private async openDB(): Promise<IDBDatabase> {
		return new Promise((resolve, reject) => {
			let timeoutId: ReturnType<typeof setTimeout> | null = null;
			let resolved = false;

			const cleanup = () => {
				if (timeoutId) {
					clearTimeout(timeoutId);
					timeoutId = null;
				}
			};

			// Set timeout
			timeoutId = setTimeout(() => {
				if (!resolved) {
					resolved = true;
					this.resetConnection();
					reject(
						new Error(
							`IndexedDB open timeout after ${OPEN_TIMEOUT_MS}ms for database: ${this.dbName}`
						)
					);
				}
			}, OPEN_TIMEOUT_MS);

			const request = indexedDB.open(this.dbName, DB_VERSION);

			request.onerror = () => {
				if (!resolved) {
					resolved = true;
					cleanup();
					this.resetConnection();
					reject(request.error || new Error('Failed to open IndexedDB'));
				}
			};

			request.onblocked = () => {
				// Database is blocked by another connection (e.g., other tab)
				// Wait for it to be unblocked, timeout will handle if it takes too long
				console.warn(`[IndexedDB] Database "${this.dbName}" is blocked by another connection`);
			};

			request.onsuccess = () => {
				if (!resolved) {
					resolved = true;
					cleanup();
					this.db = request.result;

					// Handle unexpected close
					this.db.onclose = () => {
						console.warn(`[IndexedDB] Database "${this.dbName}" was closed unexpectedly`);
						this.resetConnection();
					};

					// Handle version change (another tab upgraded the database)
					this.db.onversionchange = () => {
						console.warn(
							`[IndexedDB] Database "${this.dbName}" version changed, closing connection`
						);
						this.resetConnection();
					};

					resolve(this.db);
				}
			};

			request.onupgradeneeded = (event) => {
				const db = (event.target as IDBOpenDBRequest).result;

				// Roots store
				if (!db.objectStoreNames.contains(ROOTS_STORE)) {
					const rootsStore = db.createObjectStore(ROOTS_STORE, { keyPath: 'id' });
					rootsStore.createIndex('type', 'type', { unique: false });
					rootsStore.createIndex('status', 'status', { unique: false });
					rootsStore.createIndex('createdAt', 'createdAt', { unique: false });
				}

				// Nodes store
				if (!db.objectStoreNames.contains(NODES_STORE)) {
					const nodesStore = db.createObjectStore(NODES_STORE, { keyPath: 'id' });
					nodesStore.createIndex('rootId', 'rootId', { unique: false });
					nodesStore.createIndex('parentId', 'parentId', { unique: false });
					nodesStore.createIndex('status', 'status', { unique: false });
				}
			};
		});
	}

	/**
	 * Get database connection with automatic retry
	 */
	private async getDB(retryCount = 0): Promise<IDBDatabase> {
		// Return existing connection if valid
		if (this.db) {
			return this.db;
		}

		// Wait for existing open operation
		if (this.dbPromise) {
			return this.dbPromise;
		}

		// Prevent concurrent open attempts
		if (this.isOpening) {
			// Wait a bit and retry
			await new Promise((r) => setTimeout(r, 50));
			return this.getDB(retryCount);
		}

		this.isOpening = true;

		try {
			this.dbPromise = this.openDB();
			const db = await this.dbPromise;
			this.isOpening = false;
			return db;
		} catch (error) {
			this.isOpening = false;
			this.dbPromise = null;

			// Retry if we haven't exceeded max retries
			if (retryCount < MAX_RETRIES) {
				console.warn(
					`[IndexedDB] Retrying database open (attempt ${retryCount + 1}/${MAX_RETRIES})`
				);
				await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * (retryCount + 1)));
				return this.getDB(retryCount + 1);
			}

			throw error;
		}
	}

	/**
	 * Convert IndexedDB errors to StorageError with proper type
	 */
	private wrapError(error: unknown): StorageError {
		if (error instanceof StorageError) {
			return error;
		}

		if (error instanceof DOMException) {
			// QuotaExceededError - storage is full
			if (error.name === 'QuotaExceededError') {
				return new StorageError(
					'QUOTA_EXCEEDED',
					'Storage quota exceeded. Please free up space by deleting old tasks.',
					error
				);
			}

			// Connection errors
			if (
				error.name === 'InvalidStateError' ||
				error.name === 'TransactionInactiveError' ||
				error.message.includes('database connection is closing')
			) {
				return new StorageError(
					'CONNECTION_ERROR',
					`Database connection error: ${error.message}`,
					error
				);
			}

			// Transaction errors
			if (error.name === 'AbortError' || error.name === 'TransactionInactiveError') {
				return new StorageError('TRANSACTION_ERROR', `Transaction failed: ${error.message}`, error);
			}

			// NotFoundError
			if (error.name === 'NotFoundError') {
				return new StorageError('NOT_FOUND', `Resource not found: ${error.message}`, error);
			}
		}

		// Unknown error
		const message = error instanceof Error ? error.message : String(error);
		return new StorageError(
			'UNKNOWN',
			`Unknown storage error: ${message}`,
			error instanceof Error ? error : undefined
		);
	}

	/**
	 * Execute a database operation with automatic retry on connection errors
	 */
	private async withRetry<R>(
		operation: (db: IDBDatabase) => Promise<R>,
		retryCount = 0
	): Promise<R> {
		try {
			const db = await this.getDB();
			return await operation(db);
		} catch (error) {
			const storageError = this.wrapError(error);

			// QuotaExceededError - don't retry, throw immediately
			if (storageError.type === 'QUOTA_EXCEEDED') {
				console.error('[IndexedDB] Storage quota exceeded');
				throw storageError;
			}

			// Connection errors - retry
			if (storageError.isRecoverable() && retryCount < MAX_RETRIES) {
				console.warn(
					`[IndexedDB] ${storageError.type}, retrying operation (attempt ${retryCount + 1}/${MAX_RETRIES})`
				);
				this.resetConnection();
				await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * (retryCount + 1)));
				return this.withRetry(operation, retryCount + 1);
			}

			throw storageError;
		}
	}

	// =========================================================================
	// Root Operations
	// =========================================================================

	async saveRoot(root: TaskRoot): Promise<void> {
		return this.withRetry(
			(db) =>
				new Promise((resolve, reject) => {
					const tx = db.transaction([ROOTS_STORE], 'readwrite');
					const store = tx.objectStore(ROOTS_STORE);
					const request = store.put(root);
					request.onsuccess = () => resolve();
					request.onerror = () => reject(request.error);
				})
		);
	}

	async getRoot(id: string): Promise<TaskRoot | null> {
		return this.withRetry(
			(db) =>
				new Promise((resolve, reject) => {
					const tx = db.transaction([ROOTS_STORE], 'readonly');
					const store = tx.objectStore(ROOTS_STORE);
					const request = store.get(id);
					request.onsuccess = () => resolve(request.result || null);
					request.onerror = () => reject(request.error);
				})
		);
	}

	async getAllRoots(): Promise<TaskRoot[]> {
		return this.withRetry(
			(db) =>
				new Promise((resolve, reject) => {
					const tx = db.transaction([ROOTS_STORE], 'readonly');
					const store = tx.objectStore(ROOTS_STORE);
					const request = store.getAll();
					request.onsuccess = () => resolve(request.result || []);
					request.onerror = () => reject(request.error);
				})
		);
	}

	async deleteRoot(id: string): Promise<void> {
		return this.withRetry(
			(db) =>
				new Promise((resolve, reject) => {
					const tx = db.transaction([ROOTS_STORE], 'readwrite');
					const store = tx.objectStore(ROOTS_STORE);
					const request = store.delete(id);
					request.onsuccess = () => resolve();
					request.onerror = () => reject(request.error);
				})
		);
	}

	// =========================================================================
	// Node Operations
	// =========================================================================

	async saveNode(node: TaskNode): Promise<void> {
		return this.withRetry(
			(db) =>
				new Promise((resolve, reject) => {
					const tx = db.transaction([NODES_STORE], 'readwrite');
					const store = tx.objectStore(NODES_STORE);
					const request = store.put(node);
					request.onsuccess = () => resolve();
					request.onerror = () => reject(request.error);
				})
		);
	}

	async saveNodes(nodes: TaskNode[]): Promise<void> {
		if (nodes.length === 0) return;

		return this.withRetry(
			(db) =>
				new Promise((resolve, reject) => {
					const tx = db.transaction([NODES_STORE], 'readwrite');
					const store = tx.objectStore(NODES_STORE);

					tx.oncomplete = () => resolve();
					tx.onerror = () => reject(tx.error);

					for (const node of nodes) {
						store.put(node);
					}
				})
		);
	}

	async getNode(id: string): Promise<TaskNode | null> {
		return this.withRetry(
			(db) =>
				new Promise((resolve, reject) => {
					const tx = db.transaction([NODES_STORE], 'readonly');
					const store = tx.objectStore(NODES_STORE);
					const request = store.get(id);
					request.onsuccess = () => resolve(request.result || null);
					request.onerror = () => reject(request.error);
				})
		);
	}

	async getNodesByRoot(rootId: string): Promise<TaskNode[]> {
		return this.withRetry(
			(db) =>
				new Promise((resolve, reject) => {
					const tx = db.transaction([NODES_STORE], 'readonly');
					const store = tx.objectStore(NODES_STORE);
					const index = store.index('rootId');
					const request = index.getAll(rootId);
					request.onsuccess = () => resolve(request.result || []);
					request.onerror = () => reject(request.error);
				})
		);
	}

	async getChildren(parentId: string | null, rootId: string): Promise<TaskNode[]> {
		// Get all nodes for this root and filter by parentId
		const allNodes = await this.getNodesByRoot(rootId);
		const children = allNodes.filter((n) => n.parentId === parentId);
		children.sort((a, b) => a.index - b.index);
		return children;
	}

	async getLeaves(rootId: string): Promise<TaskNode[]> {
		// Get all nodes for this root and filter for leaves
		const allNodes = await this.getNodesByRoot(rootId);
		const leaves = allNodes.filter((n) => n.isLeaf);
		leaves.sort((a, b) => a.index - b.index);
		return leaves;
	}

	/**
	 * Get leaf count using cursor (memory efficient)
	 */
	async getLeafCount(rootId: string): Promise<number> {
		return this.withRetry(
			(db) =>
				new Promise((resolve, reject) => {
					const tx = db.transaction([NODES_STORE], 'readonly');
					const store = tx.objectStore(NODES_STORE);
					const index = store.index('rootId');

					let count = 0;
					const request = index.openCursor(rootId);

					request.onsuccess = () => {
						const cursor = request.result;
						if (cursor) {
							if (cursor.value.isLeaf) {
								count++;
							}
							cursor.continue();
						} else {
							resolve(count);
						}
					};

					request.onerror = () => reject(request.error);
				})
		);
	}

	/**
	 * Get pending leaf count using cursor (memory efficient)
	 */
	async getPendingLeafCount(rootId: string): Promise<number> {
		return this.withRetry(
			(db) =>
				new Promise((resolve, reject) => {
					const tx = db.transaction([NODES_STORE], 'readonly');
					const store = tx.objectStore(NODES_STORE);
					const index = store.index('rootId');

					let count = 0;
					const request = index.openCursor(rootId);

					request.onsuccess = () => {
						const cursor = request.result;
						if (cursor) {
							const node = cursor.value;
							if (node.isLeaf && node.status !== 'completed' && node.status !== 'failed') {
								count++;
							}
							cursor.continue();
						} else {
							resolve(count);
						}
					};

					request.onerror = () => reject(request.error);
				})
		);
	}

	/**
	 * Get leaf IDs only (memory efficient for large trees)
	 */
	async getLeafIds(rootId: string): Promise<string[]> {
		return this.withRetry(
			(db) =>
				new Promise((resolve, reject) => {
					const tx = db.transaction([NODES_STORE], 'readonly');
					const store = tx.objectStore(NODES_STORE);
					const index = store.index('rootId');

					const ids: string[] = [];
					const request = index.openCursor(rootId);

					request.onsuccess = () => {
						const cursor = request.result;
						if (cursor) {
							if (cursor.value.isLeaf) {
								ids.push(cursor.value.id);
							}
							cursor.continue();
						} else {
							// Sort by index (need to read each node's index for proper ordering)
							resolve(ids);
						}
					};

					request.onerror = () => reject(request.error);
				})
		);
	}

	/**
	 * Get pending leaf IDs only (memory efficient)
	 * Includes 'pending', 'running', and 'paused' statuses for recovery:
	 * - pending: not started yet
	 * - running: may have crashed mid-execution, needs re-execution
	 * - paused: was paused, can be resumed
	 */
	async getPendingLeafIds(rootId: string): Promise<string[]> {
		return this.withRetry(
			(db) =>
				new Promise((resolve, reject) => {
					const tx = db.transaction([NODES_STORE], 'readonly');
					const store = tx.objectStore(NODES_STORE);
					const index = store.index('rootId');

					const ids: string[] = [];
					const request = index.openCursor(rootId);

					request.onsuccess = () => {
						const cursor = request.result;
						if (cursor) {
							const node = cursor.value;
							// Include pending, running (crashed), and paused statuses
							// Exclude completed, failed, and cancelled
							if (
								node.isLeaf &&
								node.status !== 'completed' &&
								node.status !== 'failed' &&
								node.status !== 'cancelled'
							) {
								ids.push(node.id);
							}
							cursor.continue();
						} else {
							resolve(ids);
						}
					};

					request.onerror = () => reject(request.error);
				})
		);
	}

	async deleteNodesByRoot(rootId: string): Promise<void> {
		return this.withRetry(
			(db) =>
				new Promise((resolve, reject) => {
					const tx = db.transaction([NODES_STORE], 'readwrite');
					const store = tx.objectStore(NODES_STORE);
					const index = store.index('rootId');

					const request = index.openCursor(rootId);
					request.onsuccess = () => {
						const cursor = request.result;
						if (cursor) {
							cursor.delete();
							cursor.continue();
						}
					};

					tx.oncomplete = () => resolve();
					tx.onerror = () => reject(tx.error);
				})
		);
	}

	// =========================================================================
	// Atomic Operations (for data integrity)
	// =========================================================================

	/**
	 * Atomically save root with all its nodes in a single transaction
	 * This prevents partial saves if browser crashes mid-operation
	 *
	 * For large node counts (>1000), uses batched transactions to avoid
	 * IndexedDB transaction timeout. Each batch is atomic, but the overall
	 * operation is not. Use verifyIntegrity() to check for partial saves.
	 */
	async saveRootWithNodes(root: TaskRoot, nodes: TaskNode[]): Promise<void> {
		// For small batches, use single atomic transaction
		if (nodes.length <= 1000) {
			return this.withRetry(
				(db) =>
					new Promise((resolve, reject) => {
						const tx = db.transaction([ROOTS_STORE, NODES_STORE], 'readwrite');
						const rootsStore = tx.objectStore(ROOTS_STORE);
						const nodesStore = tx.objectStore(NODES_STORE);

						tx.oncomplete = () => resolve();
						tx.onerror = () => reject(tx.error);
						tx.onabort = () => reject(tx.error || new Error('Transaction aborted'));

						rootsStore.put(root);
						for (const node of nodes) {
							nodesStore.put(node);
						}
					})
			);
		}

		// For large batches, save in chunks to avoid transaction timeout
		// First save root, then save nodes in batches
		// Mark root as 'creating' status to detect incomplete saves
		const tempRoot = { ...root, metadata: { ...root.metadata, _creating: true } };
		await this.saveRoot(tempRoot);

		// Save nodes in batches
		const BATCH_SIZE = 1000;
		for (let i = 0; i < nodes.length; i += BATCH_SIZE) {
			const batch = nodes.slice(i, i + BATCH_SIZE);
			await this.saveNodes(batch);
		}

		// Mark root as complete (remove _creating flag)
		const finalRoot = { ...root };
		if (finalRoot.metadata) {
			delete finalRoot.metadata._creating;
		}
		await this.saveRoot(finalRoot);
	}

	/**
	 * Atomically delete root and all its nodes in a single transaction
	 * This prevents orphaned nodes if browser crashes mid-operation
	 */
	async deleteRootWithNodes(rootId: string): Promise<void> {
		return this.withRetry(
			(db) =>
				new Promise((resolve, reject) => {
					const tx = db.transaction([ROOTS_STORE, NODES_STORE], 'readwrite');
					const rootsStore = tx.objectStore(ROOTS_STORE);
					const nodesStore = tx.objectStore(NODES_STORE);
					const nodesIndex = nodesStore.index('rootId');

					tx.oncomplete = () => resolve();
					tx.onerror = () => reject(tx.error);
					tx.onabort = () => reject(tx.error || new Error('Transaction aborted'));

					// Delete all nodes for this root
					const cursorRequest = nodesIndex.openCursor(rootId);
					cursorRequest.onsuccess = () => {
						const cursor = cursorRequest.result;
						if (cursor) {
							cursor.delete();
							cursor.continue();
						}
					};

					// Delete the root
					rootsStore.delete(rootId);
				})
		);
	}

	/**
	 * Get all nodes across all roots (for orphan detection)
	 */
	async getAllNodes(): Promise<TaskNode[]> {
		return this.withRetry(
			(db) =>
				new Promise((resolve, reject) => {
					const tx = db.transaction([NODES_STORE], 'readonly');
					const store = tx.objectStore(NODES_STORE);
					const request = store.getAll();
					request.onsuccess = () => resolve(request.result || []);
					request.onerror = () => reject(request.error);
				})
		);
	}

	async updateNodeStatus(
		id: string,
		status: TaskStatus,
		updates?: Partial<TaskNode>
	): Promise<void> {
		const node = await this.getNode(id);
		if (!node) return;

		const updatedNode: TaskNode = {
			...node,
			...updates,
			status,
			updatedAt: Date.now()
		};

		await this.saveNode(updatedNode);
	}

	// =========================================================================
	// Lifecycle
	// =========================================================================

	async close(): Promise<void> {
		this.resetConnection();
	}

	async clear(): Promise<void> {
		return this.withRetry(
			(db) =>
				new Promise((resolve, reject) => {
					const tx = db.transaction([ROOTS_STORE, NODES_STORE], 'readwrite');

					tx.objectStore(ROOTS_STORE).clear();
					tx.objectStore(NODES_STORE).clear();

					tx.oncomplete = () => resolve();
					tx.onerror = () => reject(tx.error);
				})
		);
	}

	/**
	 * Force reconnect to the database
	 * Useful when the database becomes inaccessible
	 */
	async reconnect(): Promise<void> {
		this.resetConnection();
		await this.getDB();
	}

	/**
	 * Check if the database is accessible
	 * Returns true if healthy, false if there are issues
	 */
	async isHealthy(): Promise<boolean> {
		try {
			const db = await this.getDB();
			// Try a simple read operation
			return new Promise((resolve) => {
				const tx = db.transaction([ROOTS_STORE], 'readonly');
				const store = tx.objectStore(ROOTS_STORE);
				const request = store.count();

				request.onsuccess = () => resolve(true);
				request.onerror = () => resolve(false);
				tx.onerror = () => resolve(false);

				// Timeout after 2 seconds
				setTimeout(() => resolve(false), 2000);
			});
		} catch {
			return false;
		}
	}

	/**
	 * Delete and recreate the database
	 * WARNING: This will delete all data!
	 */
	async resetDatabase(): Promise<void> {
		this.resetConnection();

		return new Promise((resolve, reject) => {
			const request = indexedDB.deleteDatabase(this.dbName);

			request.onsuccess = async () => {
				console.log(`[IndexedDB] Database "${this.dbName}" deleted successfully`);
				// Recreate by opening
				try {
					await this.getDB();
					resolve();
				} catch (err) {
					reject(err);
				}
			};

			request.onerror = () => {
				reject(request.error || new Error('Failed to delete database'));
			};

			request.onblocked = () => {
				console.warn(
					`[IndexedDB] Database deletion blocked - close other tabs using this database`
				);
			};
		});
	}
}

/**
 * Create a new IndexedDB storage adapter
 * @param options - Database name as string, or options object with dbName property
 */
export function createIndexedDBStorage(options?: string | { dbName?: string }): StorageAdapter {
	const dbName = typeof options === 'string' ? options : options?.dbName;
	return new IndexedDBStorage(dbName);
}
