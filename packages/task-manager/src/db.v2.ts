/**
 * IndexedDB storage for task management - Tree Structure
 *
 * Stores entire task trees as single documents in IndexedDB
 */

import type { Task } from './types.v2';

const DB_NAME = 'BiuBiuTaskManager';
const DB_VERSION = 3; // Incremented for tree structure
const TASKS_STORE = 'tasks';

/**
 * Initialize IndexedDB
 */
function openDB(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve(request.result);

		request.onupgradeneeded = (event) => {
			const db = (event.target as IDBOpenDBRequest).result;

			// Remove old stores if they exist
			if (db.objectStoreNames.contains('batches')) {
				db.deleteObjectStore('batches');
			}
			if (db.objectStoreNames.contains('subTasks')) {
				db.deleteObjectStore('subTasks');
			}

			// Tasks store (stores entire task trees)
			if (!db.objectStoreNames.contains(TASKS_STORE)) {
				const tasksStore = db.createObjectStore(TASKS_STORE, { keyPath: 'id' });
				tasksStore.createIndex('type', 'type', { unique: false });
				tasksStore.createIndex('status', 'status', { unique: false });
				tasksStore.createIndex('createdAt', 'createdAt', { unique: false });
			}
		};
	});
}

/**
 * Save a task tree to IndexedDB
 * The entire tree is stored as a single document
 */
export async function saveTask(task: Task): Promise<void> {
	const db = await openDB();
	const transaction = db.transaction([TASKS_STORE], 'readwrite');
	const store = transaction.objectStore(TASKS_STORE);

	return new Promise((resolve, reject) => {
		const request = store.put(task);
		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
}

/**
 * Get a task tree by ID
 */
export async function getTask(taskId: string): Promise<Task | null> {
	const db = await openDB();
	const transaction = db.transaction([TASKS_STORE], 'readonly');
	const store = transaction.objectStore(TASKS_STORE);

	return new Promise((resolve, reject) => {
		const request = store.get(taskId);
		request.onsuccess = () => resolve(request.result || null);
		request.onerror = () => reject(request.error);
	});
}

/**
 * Get all tasks
 */
export async function getAllTasks(): Promise<Task[]> {
	const db = await openDB();
	const transaction = db.transaction([TASKS_STORE], 'readonly');
	const store = transaction.objectStore(TASKS_STORE);

	return new Promise((resolve, reject) => {
		const request = store.getAll();
		request.onsuccess = () => resolve(request.result || []);
		request.onerror = () => reject(request.error);
	});
}

/**
 * Get tasks by status
 */
export async function getTasksByStatus(status: string): Promise<Task[]> {
	const db = await openDB();
	const transaction = db.transaction([TASKS_STORE], 'readonly');
	const store = transaction.objectStore(TASKS_STORE);
	const index = store.index('status');

	return new Promise((resolve, reject) => {
		const request = index.getAll(status);
		request.onsuccess = () => resolve(request.result || []);
		request.onerror = () => reject(request.error);
	});
}

/**
 * Get tasks by type
 */
export async function getTasksByType(type: string): Promise<Task[]> {
	const db = await openDB();
	const transaction = db.transaction([TASKS_STORE], 'readonly');
	const store = transaction.objectStore(TASKS_STORE);
	const index = store.index('type');

	return new Promise((resolve, reject) => {
		const request = index.getAll(type);
		request.onsuccess = () => resolve(request.result || []);
		request.onerror = () => reject(request.error);
	});
}

/**
 * Delete a task tree
 */
export async function deleteTask(taskId: string): Promise<void> {
	const db = await openDB();
	const transaction = db.transaction([TASKS_STORE], 'readwrite');
	const store = transaction.objectStore(TASKS_STORE);

	return new Promise((resolve, reject) => {
		const request = store.delete(taskId);
		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
}

/**
 * Get recoverable tasks (pending, running, or paused)
 */
export async function getRecoverableTasks(): Promise<Task[]> {
	const allTasks = await getAllTasks();
	return allTasks.filter(
		(task) => task.status === 'pending' || task.status === 'running' || task.status === 'paused'
	);
}

/**
 * Cleanup old completed tasks
 */
export async function cleanupOldTasks(olderThanDays: number = 7): Promise<number> {
	const allTasks = await getAllTasks();
	const cutoffTime = Date.now() - olderThanDays * 24 * 60 * 60 * 1000;

	let deletedCount = 0;

	for (const task of allTasks) {
		if (
			(task.status === 'completed' || task.status === 'failed' || task.status === 'cancelled') &&
			task.updatedAt < cutoffTime
		) {
			await deleteTask(task.id);
			deletedCount++;
		}
	}

	return deletedCount;
}
