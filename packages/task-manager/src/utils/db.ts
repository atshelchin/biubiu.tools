/**
 * IndexedDB Storage for Task Management
 *
 * Stores entire task trees as single documents in IndexedDB.
 * Uses configuration from config.ts for database name/version.
 */

import type { Task } from '../types';
import { getConfig } from '../config';

let dbInstance: IDBDatabase | null = null;

/**
 * Initialize IndexedDB
 */
function openDB(): Promise<IDBDatabase> {
	// Return cached instance if available
	if (dbInstance) {
		return Promise.resolve(dbInstance);
	}

	const config = getConfig();

	return new Promise((resolve, reject) => {
		const request = indexedDB.open(config.db.name, config.db.version);

		request.onerror = () => reject(request.error);

		request.onsuccess = () => {
			dbInstance = request.result;

			// Handle connection close
			dbInstance.onclose = () => {
				dbInstance = null;
			};

			resolve(dbInstance);
		};

		request.onupgradeneeded = (event) => {
			const db = (event.target as IDBOpenDBRequest).result;
			const storeName = config.db.storeName;

			// Create tasks store if it doesn't exist
			if (!db.objectStoreNames.contains(storeName)) {
				const tasksStore = db.createObjectStore(storeName, { keyPath: 'id' });
				tasksStore.createIndex('type', 'type', { unique: false });
				tasksStore.createIndex('status', 'status', { unique: false });
				tasksStore.createIndex('createdAt', 'createdAt', { unique: false });
			}
		};
	});
}

/**
 * Close the database connection
 */
export function closeDB(): void {
	if (dbInstance) {
		dbInstance.close();
		dbInstance = null;
	}
}

/**
 * Save a task tree to IndexedDB
 */
export async function saveTask<TData, TResult>(task: Task<TData, TResult>): Promise<void> {
	const db = await openDB();
	const config = getConfig();
	const transaction = db.transaction([config.db.storeName], 'readwrite');
	const store = transaction.objectStore(config.db.storeName);

	return new Promise((resolve, reject) => {
		const request = store.put(task);
		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
}

/**
 * Get a task tree by ID
 */
export async function getTask<TData, TResult>(
	taskId: string
): Promise<Task<TData, TResult> | null> {
	const db = await openDB();
	const config = getConfig();
	const transaction = db.transaction([config.db.storeName], 'readonly');
	const store = transaction.objectStore(config.db.storeName);

	return new Promise((resolve, reject) => {
		const request = store.get(taskId);
		request.onsuccess = () => resolve(request.result || null);
		request.onerror = () => reject(request.error);
	});
}

/**
 * Get all tasks
 */
export async function getAllTasks<TData, TResult>(): Promise<Task<TData, TResult>[]> {
	const db = await openDB();
	const config = getConfig();
	const transaction = db.transaction([config.db.storeName], 'readonly');
	const store = transaction.objectStore(config.db.storeName);

	return new Promise((resolve, reject) => {
		const request = store.getAll();
		request.onsuccess = () => resolve(request.result || []);
		request.onerror = () => reject(request.error);
	});
}

/**
 * Get tasks by status
 */
export async function getTasksByStatus<TData, TResult>(
	status: string
): Promise<Task<TData, TResult>[]> {
	const db = await openDB();
	const config = getConfig();
	const transaction = db.transaction([config.db.storeName], 'readonly');
	const store = transaction.objectStore(config.db.storeName);
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
export async function getTasksByType<TData, TResult>(
	type: string
): Promise<Task<TData, TResult>[]> {
	const db = await openDB();
	const config = getConfig();
	const transaction = db.transaction([config.db.storeName], 'readonly');
	const store = transaction.objectStore(config.db.storeName);
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
	const config = getConfig();
	const transaction = db.transaction([config.db.storeName], 'readwrite');
	const store = transaction.objectStore(config.db.storeName);

	return new Promise((resolve, reject) => {
		const request = store.delete(taskId);
		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
}

/**
 * Get recoverable tasks (pending, running, or paused)
 */
export async function getRecoverableTasks<TData, TResult>(): Promise<Task<TData, TResult>[]> {
	const allTasks = await getAllTasks<TData, TResult>();
	return allTasks.filter(
		(task) => task.status === 'pending' || task.status === 'running' || task.status === 'paused'
	);
}

/**
 * Cleanup old completed tasks
 */
export async function cleanupOldTasks(olderThanDays?: number): Promise<number> {
	const config = getConfig();
	const days = olderThanDays ?? config.cleanup.autoCleanupDays;
	const allTasks = await getAllTasks();
	const cutoffTime = Date.now() - days * 24 * 60 * 60 * 1000;

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

/**
 * Clear all tasks (useful for testing)
 */
export async function clearAllTasks(): Promise<void> {
	const db = await openDB();
	const config = getConfig();
	const transaction = db.transaction([config.db.storeName], 'readwrite');
	const store = transaction.objectStore(config.db.storeName);

	return new Promise((resolve, reject) => {
		const request = store.clear();
		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
}
