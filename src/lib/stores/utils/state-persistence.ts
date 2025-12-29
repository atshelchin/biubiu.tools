/**
 * State persistence utilities using IndexedDB.
 *
 * This module provides utilities for persisting and restoring app state
 * to/from IndexedDB. Features include:
 *
 * - Automatic save with debouncing
 * - Selective module exclusion
 * - Graceful error handling
 * - Browser compatibility checks
 *
 * ## Usage
 *
 * ```typescript
 * import { StatePersistence } from '$lib/stores/utils/state-persistence';
 *
 * // In your component
 * const persistence = new StatePersistence({
 *   toolId: 'my-tool',
 *   debounceMs: 1000,
 *   excludeModules: ['scanner'] // Don't persist scanner logs
 * });
 *
 * // Save state
 * await persistence.save(appState.serializeAll());
 *
 * // Restore state
 * const savedState = await persistence.load();
 * if (savedState) {
 *   appState.deserializeAll(savedState);
 * }
 *
 * // Clear saved state
 * await persistence.clear();
 * ```
 *
 * @module
 */

import { browser } from '$app/environment';

/**
 * Database configuration.
 */
const DB_NAME = 'biubiu-tools-state';
const DB_VERSION = 1;
const STORE_NAME = 'app-states';

/**
 * Stored state record.
 */
export interface StoredStateRecord {
	toolId: string;
	state: Record<string, unknown>;
	savedAt: number;
	version: number;
}

/**
 * Configuration for state persistence.
 */
export interface StatePersistenceConfig {
	/** Unique identifier for the tool */
	toolId: string;
	/** Debounce delay in milliseconds (default: 1000) */
	debounceMs?: number;
	/** Module keys to exclude from persistence */
	excludeModules?: string[];
	/** State version for migration support */
	version?: number;
}

/**
 * Open or create the IndexedDB database.
 */
async function openDatabase(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		if (!browser || typeof globalThis.indexedDB === 'undefined') {
			reject(new Error('IndexedDB is not available'));
			return;
		}

		const request = globalThis.indexedDB.open(DB_NAME, DB_VERSION);

		request.onerror = () => {
			reject(new Error(`Failed to open database: ${request.error?.message}`));
		};

		request.onsuccess = () => {
			resolve(request.result);
		};

		request.onupgradeneeded = (event) => {
			const db = (event.target as IDBOpenDBRequest).result;

			// Create object store if it doesn't exist
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME, { keyPath: 'toolId' });
			}
		};
	});
}

/**
 * State persistence manager.
 *
 * Provides methods for saving, loading, and clearing persisted state.
 */
export class StatePersistence {
	private config: Required<StatePersistenceConfig>;
	private saveTimeoutId: ReturnType<typeof setTimeout> | null = null;
	private db: IDBDatabase | null = null;

	constructor(config: StatePersistenceConfig) {
		this.config = {
			toolId: config.toolId,
			debounceMs: config.debounceMs ?? 1000,
			excludeModules: config.excludeModules ?? [],
			version: config.version ?? 1
		};
	}

	/**
	 * Check if persistence is available.
	 */
	get isAvailable(): boolean {
		return browser && typeof globalThis.indexedDB !== 'undefined';
	}

	/**
	 * Get the database connection.
	 */
	private async getDatabase(): Promise<IDBDatabase> {
		if (this.db && this.db.name) {
			return this.db;
		}
		this.db = await openDatabase();
		return this.db;
	}

	/**
	 * Save state to IndexedDB.
	 *
	 * @param state - Serialized state from appState.serializeAll()
	 */
	async save(state: Record<string, unknown>): Promise<void> {
		if (!this.isAvailable) {
			console.warn('[StatePersistence] IndexedDB not available, skipping save');
			return;
		}

		try {
			// Filter out excluded modules
			const filteredState: Record<string, unknown> = {};
			for (const [key, value] of Object.entries(state)) {
				if (!this.config.excludeModules.includes(key)) {
					filteredState[key] = value;
				}
			}

			const record: StoredStateRecord = {
				toolId: this.config.toolId,
				state: filteredState,
				savedAt: Date.now(),
				version: this.config.version
			};

			const db = await this.getDatabase();
			const transaction = db.transaction(STORE_NAME, 'readwrite');
			const store = transaction.objectStore(STORE_NAME);

			await new Promise<void>((resolve, reject) => {
				const request = store.put(record);
				request.onsuccess = () => resolve();
				request.onerror = () => reject(request.error);
			});
		} catch (error) {
			console.error('[StatePersistence] Failed to save state:', error);
		}
	}

	/**
	 * Save state with debouncing.
	 *
	 * Multiple calls within the debounce window will only result in one save.
	 *
	 * @param state - Serialized state from appState.serializeAll()
	 */
	saveDebounced(state: Record<string, unknown>): void {
		if (this.saveTimeoutId) {
			clearTimeout(this.saveTimeoutId);
		}

		this.saveTimeoutId = setTimeout(() => {
			this.save(state);
			this.saveTimeoutId = null;
		}, this.config.debounceMs);
	}

	/**
	 * Cancel any pending debounced save.
	 */
	cancelPendingSave(): void {
		if (this.saveTimeoutId) {
			clearTimeout(this.saveTimeoutId);
			this.saveTimeoutId = null;
		}
	}

	/**
	 * Load state from IndexedDB.
	 *
	 * @returns Saved state or null if not found
	 */
	async load(): Promise<Record<string, unknown> | null> {
		if (!this.isAvailable) {
			console.warn('[StatePersistence] IndexedDB not available, skipping load');
			return null;
		}

		try {
			const db = await this.getDatabase();
			const transaction = db.transaction(STORE_NAME, 'readonly');
			const store = transaction.objectStore(STORE_NAME);

			const record = await new Promise<StoredStateRecord | undefined>((resolve, reject) => {
				const request = store.get(this.config.toolId);
				request.onsuccess = () => resolve(request.result);
				request.onerror = () => reject(request.error);
			});

			if (!record) {
				return null;
			}

			// Version check - if versions don't match, discard saved state
			if (record.version !== this.config.version) {
				console.info(
					`[StatePersistence] State version mismatch (saved: ${record.version}, current: ${this.config.version}), discarding`
				);
				await this.clear();
				return null;
			}

			return record.state;
		} catch (error) {
			console.error('[StatePersistence] Failed to load state:', error);
			return null;
		}
	}

	/**
	 * Get metadata about the saved state.
	 *
	 * @returns Metadata or null if not found
	 */
	async getMetadata(): Promise<{ savedAt: number; version: number } | null> {
		if (!this.isAvailable) {
			return null;
		}

		try {
			const db = await this.getDatabase();
			const transaction = db.transaction(STORE_NAME, 'readonly');
			const store = transaction.objectStore(STORE_NAME);

			const record = await new Promise<StoredStateRecord | undefined>((resolve, reject) => {
				const request = store.get(this.config.toolId);
				request.onsuccess = () => resolve(request.result);
				request.onerror = () => reject(request.error);
			});

			if (!record) {
				return null;
			}

			return {
				savedAt: record.savedAt,
				version: record.version
			};
		} catch (error) {
			console.error('[StatePersistence] Failed to get metadata:', error);
			return null;
		}
	}

	/**
	 * Check if there is saved state for this tool.
	 */
	async hasSavedState(): Promise<boolean> {
		const metadata = await this.getMetadata();
		return metadata !== null;
	}

	/**
	 * Clear saved state from IndexedDB.
	 */
	async clear(): Promise<void> {
		if (!this.isAvailable) {
			return;
		}

		try {
			const db = await this.getDatabase();
			const transaction = db.transaction(STORE_NAME, 'readwrite');
			const store = transaction.objectStore(STORE_NAME);

			await new Promise<void>((resolve, reject) => {
				const request = store.delete(this.config.toolId);
				request.onsuccess = () => resolve();
				request.onerror = () => reject(request.error);
			});
		} catch (error) {
			console.error('[StatePersistence] Failed to clear state:', error);
		}
	}

	/**
	 * Close the database connection.
	 *
	 * Call this when the component unmounts.
	 */
	close(): void {
		this.cancelPendingSave();
		if (this.db) {
			this.db.close();
			this.db = null;
		}
	}
}

/**
 * Create a state persistence manager.
 *
 * Convenience function for creating a StatePersistence instance.
 *
 * @param config - Persistence configuration
 * @returns StatePersistence instance
 */
export function createStatePersistence(config: StatePersistenceConfig): StatePersistence {
	return new StatePersistence(config);
}
