/**
 * IndexedDB Storage Adapter
 *
 * Split storage implementation:
 * - 'roots' store: Task root metadata (lightweight, for list views)
 * - 'nodes' store: All task nodes (loaded on demand)
 */

import type { TaskRoot, TaskNode, TaskStatus, StorageAdapter } from '../types';

const DB_VERSION = 1;
const ROOTS_STORE = 'roots';
const NODES_STORE = 'nodes';

export class IndexedDBStorage implements StorageAdapter {
	private db: IDBDatabase | null = null;
	private dbName: string;
	private dbPromise: Promise<IDBDatabase> | null = null;

	constructor(dbName: string = 'TaskManager') {
		this.dbName = dbName;
	}

	private async getDB(): Promise<IDBDatabase> {
		if (this.db) return this.db;
		if (this.dbPromise) return this.dbPromise;

		this.dbPromise = new Promise((resolve, reject) => {
			const request = indexedDB.open(this.dbName, DB_VERSION);

			request.onerror = () => {
				this.dbPromise = null;
				reject(request.error);
			};

			request.onsuccess = () => {
				this.db = request.result;
				this.db.onclose = () => {
					this.db = null;
					this.dbPromise = null;
				};
				resolve(this.db);
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

		return this.dbPromise;
	}

	// =========================================================================
	// Root Operations
	// =========================================================================

	async saveRoot(root: TaskRoot): Promise<void> {
		const db = await this.getDB();
		return new Promise((resolve, reject) => {
			const tx = db.transaction([ROOTS_STORE], 'readwrite');
			const store = tx.objectStore(ROOTS_STORE);
			const request = store.put(root);
			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	}

	async getRoot(id: string): Promise<TaskRoot | null> {
		const db = await this.getDB();
		return new Promise((resolve, reject) => {
			const tx = db.transaction([ROOTS_STORE], 'readonly');
			const store = tx.objectStore(ROOTS_STORE);
			const request = store.get(id);
			request.onsuccess = () => resolve(request.result || null);
			request.onerror = () => reject(request.error);
		});
	}

	async getAllRoots(): Promise<TaskRoot[]> {
		const db = await this.getDB();
		return new Promise((resolve, reject) => {
			const tx = db.transaction([ROOTS_STORE], 'readonly');
			const store = tx.objectStore(ROOTS_STORE);
			const request = store.getAll();
			request.onsuccess = () => resolve(request.result || []);
			request.onerror = () => reject(request.error);
		});
	}

	async deleteRoot(id: string): Promise<void> {
		const db = await this.getDB();
		return new Promise((resolve, reject) => {
			const tx = db.transaction([ROOTS_STORE], 'readwrite');
			const store = tx.objectStore(ROOTS_STORE);
			const request = store.delete(id);
			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	}

	// =========================================================================
	// Node Operations
	// =========================================================================

	async saveNode(node: TaskNode): Promise<void> {
		const db = await this.getDB();
		return new Promise((resolve, reject) => {
			const tx = db.transaction([NODES_STORE], 'readwrite');
			const store = tx.objectStore(NODES_STORE);
			const request = store.put(node);
			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	}

	async saveNodes(nodes: TaskNode[]): Promise<void> {
		if (nodes.length === 0) return;

		const db = await this.getDB();
		return new Promise((resolve, reject) => {
			const tx = db.transaction([NODES_STORE], 'readwrite');
			const store = tx.objectStore(NODES_STORE);

			tx.oncomplete = () => resolve();
			tx.onerror = () => reject(tx.error);

			for (const node of nodes) {
				store.put(node);
			}
		});
	}

	async getNode(id: string): Promise<TaskNode | null> {
		const db = await this.getDB();
		return new Promise((resolve, reject) => {
			const tx = db.transaction([NODES_STORE], 'readonly');
			const store = tx.objectStore(NODES_STORE);
			const request = store.get(id);
			request.onsuccess = () => resolve(request.result || null);
			request.onerror = () => reject(request.error);
		});
	}

	async getNodesByRoot(rootId: string): Promise<TaskNode[]> {
		const db = await this.getDB();
		return new Promise((resolve, reject) => {
			const tx = db.transaction([NODES_STORE], 'readonly');
			const store = tx.objectStore(NODES_STORE);
			const index = store.index('rootId');
			const request = index.getAll(rootId);
			request.onsuccess = () => resolve(request.result || []);
			request.onerror = () => reject(request.error);
		});
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
		const db = await this.getDB();
		return new Promise((resolve, reject) => {
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
		});
	}

	/**
	 * Get pending leaf count using cursor (memory efficient)
	 */
	async getPendingLeafCount(rootId: string): Promise<number> {
		const db = await this.getDB();
		return new Promise((resolve, reject) => {
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
		});
	}

	/**
	 * Get leaf IDs only (memory efficient for large trees)
	 */
	async getLeafIds(rootId: string): Promise<string[]> {
		const db = await this.getDB();
		return new Promise((resolve, reject) => {
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
		});
	}

	/**
	 * Get pending leaf IDs only (memory efficient)
	 */
	async getPendingLeafIds(rootId: string): Promise<string[]> {
		const db = await this.getDB();
		return new Promise((resolve, reject) => {
			const tx = db.transaction([NODES_STORE], 'readonly');
			const store = tx.objectStore(NODES_STORE);
			const index = store.index('rootId');

			const ids: string[] = [];
			const request = index.openCursor(rootId);

			request.onsuccess = () => {
				const cursor = request.result;
				if (cursor) {
					const node = cursor.value;
					if (node.isLeaf && node.status !== 'completed' && node.status !== 'failed') {
						ids.push(node.id);
					}
					cursor.continue();
				} else {
					resolve(ids);
				}
			};

			request.onerror = () => reject(request.error);
		});
	}

	async deleteNodesByRoot(rootId: string): Promise<void> {
		const db = await this.getDB();
		return new Promise((resolve, reject) => {
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
		});
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
		if (this.db) {
			this.db.close();
			this.db = null;
			this.dbPromise = null;
		}
	}

	async clear(): Promise<void> {
		const db = await this.getDB();
		return new Promise((resolve, reject) => {
			const tx = db.transaction([ROOTS_STORE, NODES_STORE], 'readwrite');

			tx.objectStore(ROOTS_STORE).clear();
			tx.objectStore(NODES_STORE).clear();

			tx.oncomplete = () => resolve();
			tx.onerror = () => reject(tx.error);
		});
	}
}

/**
 * Create a new IndexedDB storage adapter
 * @param options - Database name as string, or options object with dbName property
 */
export function createIndexedDBStorage(
	options?: string | { dbName?: string }
): StorageAdapter {
	const dbName = typeof options === 'string' ? options : options?.dbName;
	return new IndexedDBStorage(dbName);
}
