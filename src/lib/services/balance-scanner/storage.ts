/**
 * Balance Scanner IndexedDB Storage
 *
 * Provides persistent storage for scan results to:
 * - Reduce memory usage by streaming results to disk
 * - Support resuming scans after page refresh
 * - Enable pagination for large result sets
 */

import type { Address } from 'viem';
import type { ScanTaskStatus, TokenConfig, ScanStats, ScanConfig } from './types';

// Database constants
const DB_NAME = 'balance-scanner';
const DB_VERSION = 1;

// Store names
const STORES = {
	SESSIONS: 'sessions',
	BALANCES: 'balances',
	TASK_STATUS: 'taskStatus'
} as const;

// Cleanup constants
const DEFAULT_SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const MAX_SESSIONS_TO_KEEP = 20; // Keep at most 20 sessions

// ============================================================================
// Types for IndexedDB Storage
// ============================================================================

/** Session status type */
export type SessionStatus = 'scanning' | 'paused' | 'completed' | 'abandoned';

/** Scan session metadata (lightweight, kept in memory) */
export interface ScanSession {
	sessionId: string;
	chainId: number;
	addresses: Address[];
	tokens: TokenConfig[];
	config: ScanConfig;
	stats: ScanStats;
	startedAt: number;
	lastActivityAt: number;
	isPaused: boolean;
	pauseReason?: 'rate_limit' | 'user_pause' | 'error';
	/** Session status for lifecycle management */
	status: SessionStatus;
	/** Whether the user has downloaded the report */
	hasDownloaded: boolean;
	/** Network name for display */
	networkName?: string;
}

/** Balance record stored in IndexedDB */
export interface BalanceRecord {
	/** Composite key: sessionId:address:tokenId */
	id: string;
	sessionId: string;
	address: Address;
	tokenId: string;
	balance: string; // Stored as string for IndexedDB compatibility
	updatedAt: number;
}

/** Task status record stored in IndexedDB */
export interface TaskStatusRecord {
	/** Composite key: sessionId:address:tokenId */
	id: string;
	sessionId: string;
	address: Address;
	tokenId: string;
	status: ScanTaskStatus;
	retryCount: number;
	lastError?: string;
	updatedAt: number;
}

/** Query options for pagination */
export interface QueryOptions {
	offset?: number;
	limit?: number;
	/** Filter by balance > 0 */
	hasBalanceOnly?: boolean;
}

/** Aggregated address balance for UI display */
export interface StoredAddressBalance {
	address: Address;
	balances: Array<{
		tokenId: string;
		balance: bigint;
		formatted: string;
	}>;
	hasBalance: boolean;
}

// ============================================================================
// IndexedDB Storage Class
// ============================================================================

export class BalanceScannerStorage {
	private db: IDBDatabase | null = null;
	private dbPromise: Promise<IDBDatabase> | null = null;

	/**
	 * Initialize the database connection
	 */
	async init(): Promise<void> {
		if (this.db) return;
		if (this.dbPromise) {
			await this.dbPromise;
			return;
		}

		this.dbPromise = this.openDatabase();
		this.db = await this.dbPromise;
	}

	/**
	 * Open or create the IndexedDB database
	 */
	private openDatabase(): Promise<IDBDatabase> {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(DB_NAME, DB_VERSION);

			request.onerror = () => {
				reject(new Error(`Failed to open database: ${request.error?.message}`));
			};

			request.onsuccess = () => {
				resolve(request.result);
			};

			request.onupgradeneeded = (event) => {
				const db = (event.target as IDBOpenDBRequest).result;

				// Sessions store - lightweight metadata
				if (!db.objectStoreNames.contains(STORES.SESSIONS)) {
					db.createObjectStore(STORES.SESSIONS, { keyPath: 'sessionId' });
				}

				// Balances store - indexed for efficient queries
				if (!db.objectStoreNames.contains(STORES.BALANCES)) {
					const balanceStore = db.createObjectStore(STORES.BALANCES, { keyPath: 'id' });
					balanceStore.createIndex('sessionId', 'sessionId', { unique: false });
					balanceStore.createIndex('address', 'address', { unique: false });
					balanceStore.createIndex('sessionAddress', ['sessionId', 'address'], { unique: false });
				}

				// Task status store - for tracking progress
				if (!db.objectStoreNames.contains(STORES.TASK_STATUS)) {
					const statusStore = db.createObjectStore(STORES.TASK_STATUS, { keyPath: 'id' });
					statusStore.createIndex('sessionId', 'sessionId', { unique: false });
					statusStore.createIndex('status', 'status', { unique: false });
					statusStore.createIndex('sessionStatus', ['sessionId', 'status'], { unique: false });
				}
			};
		});
	}

	/**
	 * Get the database instance, initializing if needed
	 */
	private async getDB(): Promise<IDBDatabase> {
		if (!this.db) {
			await this.init();
		}
		return this.db!;
	}

	// ============================================================================
	// Session Operations
	// ============================================================================

	/**
	 * Create a new scan session
	 */
	async createSession(session: ScanSession): Promise<void> {
		const db = await this.getDB();

		return new Promise((resolve, reject) => {
			const tx = db.transaction(STORES.SESSIONS, 'readwrite');
			const store = tx.objectStore(STORES.SESSIONS);

			const request = store.put(session);

			request.onerror = () =>
				reject(new Error(`Failed to create session: ${request.error?.message}`));
			request.onsuccess = () => resolve();
		});
	}

	/**
	 * Get a scan session by ID
	 */
	async getSession(sessionId: string): Promise<ScanSession | null> {
		const db = await this.getDB();

		return new Promise((resolve, reject) => {
			const tx = db.transaction(STORES.SESSIONS, 'readonly');
			const store = tx.objectStore(STORES.SESSIONS);

			const request = store.get(sessionId);

			request.onerror = () => reject(new Error(`Failed to get session: ${request.error?.message}`));
			request.onsuccess = () => resolve(request.result || null);
		});
	}

	/**
	 * Update session metadata (stats, pause state, etc.)
	 */
	async updateSession(session: ScanSession): Promise<void> {
		return this.createSession(session); // put() handles both create and update
	}

	/**
	 * Delete a session and all its data
	 */
	async deleteSession(sessionId: string): Promise<void> {
		const db = await this.getDB();

		// Delete balances
		await this.deleteBySessionId(db, STORES.BALANCES, sessionId);

		// Delete task status
		await this.deleteBySessionId(db, STORES.TASK_STATUS, sessionId);

		// Delete session
		return new Promise((resolve, reject) => {
			const tx = db.transaction(STORES.SESSIONS, 'readwrite');
			const store = tx.objectStore(STORES.SESSIONS);

			const request = store.delete(sessionId);

			request.onerror = () =>
				reject(new Error(`Failed to delete session: ${request.error?.message}`));
			request.onsuccess = () => resolve();
		});
	}

	/**
	 * Get all sessions (for listing/cleanup)
	 */
	async getAllSessions(): Promise<ScanSession[]> {
		const db = await this.getDB();

		return new Promise((resolve, reject) => {
			const tx = db.transaction(STORES.SESSIONS, 'readonly');
			const store = tx.objectStore(STORES.SESSIONS);

			const request = store.getAll();

			request.onerror = () =>
				reject(new Error(`Failed to get sessions: ${request.error?.message}`));
			request.onsuccess = () => resolve(request.result);
		});
	}

	// ============================================================================
	// Balance Operations
	// ============================================================================

	/**
	 * Save a batch of balance results
	 */
	async saveBalances(
		sessionId: string,
		results: Array<{ address: Address; tokenId: string; balance: bigint }>
	): Promise<void> {
		const db = await this.getDB();
		const now = Date.now();

		return new Promise((resolve, reject) => {
			const tx = db.transaction(STORES.BALANCES, 'readwrite');
			const store = tx.objectStore(STORES.BALANCES);

			for (const result of results) {
				const record: BalanceRecord = {
					id: `${sessionId}:${result.address.toLowerCase()}:${result.tokenId}`,
					sessionId,
					address: result.address.toLowerCase() as Address,
					tokenId: result.tokenId,
					balance: result.balance.toString(),
					updatedAt: now
				};
				store.put(record);
			}

			tx.onerror = () => reject(new Error(`Failed to save balances: ${tx.error?.message}`));
			tx.oncomplete = () => resolve();
		});
	}

	/**
	 * Get balance for a specific address and token
	 */
	async getBalance(sessionId: string, address: Address, tokenId: string): Promise<bigint | null> {
		const db = await this.getDB();
		const id = `${sessionId}:${address.toLowerCase()}:${tokenId}`;

		return new Promise((resolve, reject) => {
			const tx = db.transaction(STORES.BALANCES, 'readonly');
			const store = tx.objectStore(STORES.BALANCES);

			const request = store.get(id);

			request.onerror = () => reject(new Error(`Failed to get balance: ${request.error?.message}`));
			request.onsuccess = () => {
				const record = request.result as BalanceRecord | undefined;
				resolve(record ? BigInt(record.balance) : null);
			};
		});
	}

	/**
	 * Get all balances for a session with pagination
	 */
	async getBalancesBySession(
		sessionId: string,
		tokens: TokenConfig[],
		options: QueryOptions = {}
	): Promise<{ results: StoredAddressBalance[]; total: number }> {
		const db = await this.getDB();
		const { offset = 0, limit = 100, hasBalanceOnly = false } = options;

		// First, get unique addresses with balances
		const addressBalances = new Map<string, Map<string, bigint>>();

		return new Promise((resolve, reject) => {
			const tx = db.transaction(STORES.BALANCES, 'readonly');
			const store = tx.objectStore(STORES.BALANCES);
			const index = store.index('sessionId');

			const request = index.openCursor(IDBKeyRange.only(sessionId));

			request.onerror = () =>
				reject(new Error(`Failed to get balances: ${request.error?.message}`));

			request.onsuccess = () => {
				const cursor = request.result;

				if (cursor) {
					const record = cursor.value as BalanceRecord;
					const balance = BigInt(record.balance);

					if (!hasBalanceOnly || balance > 0n) {
						if (!addressBalances.has(record.address)) {
							addressBalances.set(record.address, new Map());
						}
						addressBalances.get(record.address)!.set(record.tokenId, balance);
					}

					cursor.continue();
				} else {
					// All records processed, build results
					const tokenMap = new Map(tokens.map((t) => [t.id, t]));
					const addresses = Array.from(addressBalances.keys()).sort();
					const total = addresses.length;

					const results: StoredAddressBalance[] = addresses
						.slice(offset, offset + limit)
						.map((address) => {
							const balanceMap = addressBalances.get(address)!;
							let hasBalance = false;

							const balances = Array.from(balanceMap.entries()).map(([tokenId, balance]) => {
								if (balance > 0n) hasBalance = true;
								const token = tokenMap.get(tokenId);
								return {
									tokenId,
									balance,
									formatted: this.formatBalance(balance, token?.decimals ?? 18)
								};
							});

							return {
								address: address as Address,
								balances,
								hasBalance
							};
						});

					resolve({ results, total });
				}
			};
		});
	}

	// ============================================================================
	// Task Status Operations
	// ============================================================================

	/**
	 * Save task status batch
	 */
	async saveTaskStatuses(
		sessionId: string,
		statuses: Array<{
			address: Address;
			tokenId: string;
			status: ScanTaskStatus;
			retryCount?: number;
			lastError?: string;
		}>
	): Promise<void> {
		const db = await this.getDB();
		const now = Date.now();

		return new Promise((resolve, reject) => {
			const tx = db.transaction(STORES.TASK_STATUS, 'readwrite');
			const store = tx.objectStore(STORES.TASK_STATUS);

			for (const item of statuses) {
				const record: TaskStatusRecord = {
					id: `${sessionId}:${item.address.toLowerCase()}:${item.tokenId}`,
					sessionId,
					address: item.address.toLowerCase() as Address,
					tokenId: item.tokenId,
					status: item.status,
					retryCount: item.retryCount ?? 0,
					lastError: item.lastError,
					updatedAt: now
				};
				store.put(record);
			}

			tx.onerror = () => reject(new Error(`Failed to save task statuses: ${tx.error?.message}`));
			tx.oncomplete = () => resolve();
		});
	}

	/**
	 * Get tasks by status (for retry logic)
	 */
	async getTasksByStatus(
		sessionId: string,
		status: ScanTaskStatus
	): Promise<Array<{ address: Address; tokenId: string; retryCount: number }>> {
		const db = await this.getDB();

		return new Promise((resolve, reject) => {
			const tx = db.transaction(STORES.TASK_STATUS, 'readonly');
			const store = tx.objectStore(STORES.TASK_STATUS);
			const index = store.index('sessionStatus');

			const request = index.getAll(IDBKeyRange.only([sessionId, status]));

			request.onerror = () => reject(new Error(`Failed to get tasks: ${request.error?.message}`));
			request.onsuccess = () => {
				const records = request.result as TaskStatusRecord[];
				resolve(
					records.map((r) => ({
						address: r.address,
						tokenId: r.tokenId,
						retryCount: r.retryCount
					}))
				);
			};
		});
	}

	/**
	 * Count tasks by status for a session
	 */
	async countTasksByStatus(sessionId: string): Promise<ScanStats> {
		const db = await this.getDB();

		return new Promise((resolve, reject) => {
			const tx = db.transaction(STORES.TASK_STATUS, 'readonly');
			const store = tx.objectStore(STORES.TASK_STATUS);
			const index = store.index('sessionId');

			const request = index.getAll(IDBKeyRange.only(sessionId));

			request.onerror = () => reject(new Error(`Failed to count tasks: ${request.error?.message}`));
			request.onsuccess = () => {
				const records = request.result as TaskStatusRecord[];
				let success = 0;
				let failed = 0;
				let pending = 0;

				for (const record of records) {
					if (record.status === 'success') success++;
					else if (record.status === 'failed') failed++;
					else pending++;
				}

				const total = records.length;
				const progress = total > 0 ? Math.round((success / total) * 100) : 0;

				resolve({ total, success, failed, pending, progress });
			};
		});
	}

	/**
	 * Initialize task statuses for a new scan
	 */
	async initializeTaskStatuses(
		sessionId: string,
		addresses: Address[],
		tokens: TokenConfig[]
	): Promise<void> {
		const statuses: Array<{
			address: Address;
			tokenId: string;
			status: ScanTaskStatus;
		}> = [];

		for (const address of addresses) {
			for (const token of tokens) {
				statuses.push({
					address,
					tokenId: token.id,
					status: 'pending'
				});
			}
		}

		// Save in batches to avoid transaction limits
		const batchSize = 5000;
		for (let i = 0; i < statuses.length; i += batchSize) {
			const batch = statuses.slice(i, i + batchSize);
			await this.saveTaskStatuses(sessionId, batch);
		}
	}

	// ============================================================================
	// Helper Methods
	// ============================================================================

	/**
	 * Delete all records for a session from a store
	 */
	private deleteBySessionId(db: IDBDatabase, storeName: string, sessionId: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const tx = db.transaction(storeName, 'readwrite');
			const store = tx.objectStore(storeName);
			const index = store.index('sessionId');

			const request = index.openKeyCursor(IDBKeyRange.only(sessionId));

			request.onerror = () =>
				reject(new Error(`Failed to delete records: ${request.error?.message}`));

			request.onsuccess = () => {
				const cursor = request.result;
				if (cursor) {
					store.delete(cursor.primaryKey);
					cursor.continue();
				}
			};

			tx.oncomplete = () => resolve();
		});
	}

	/**
	 * Format balance for display
	 */
	private formatBalance(balance: bigint, decimals: number): string {
		if (balance === 0n) return '0';

		const str = balance.toString().padStart(decimals + 1, '0');
		const intPart = str.slice(0, -decimals) || '0';
		const decPart = str.slice(-decimals).replace(/0+$/, '');

		return decPart ? `${intPart}.${decPart}` : intPart;
	}

	/**
	 * Close the database connection
	 */
	close(): void {
		if (this.db) {
			this.db.close();
			this.db = null;
			this.dbPromise = null;
		}
	}

	/**
	 * Clear all data (for testing/reset)
	 */
	async clearAll(): Promise<void> {
		const db = await this.getDB();

		const stores = [STORES.SESSIONS, STORES.BALANCES, STORES.TASK_STATUS];

		for (const storeName of stores) {
			await new Promise<void>((resolve, reject) => {
				const tx = db.transaction(storeName, 'readwrite');
				const store = tx.objectStore(storeName);
				const request = store.clear();

				request.onerror = () =>
					reject(new Error(`Failed to clear ${storeName}: ${request.error?.message}`));
				request.onsuccess = () => resolve();
			});
		}
	}

	// ============================================================================
	// Storage Cleanup Methods
	// ============================================================================

	/**
	 * Clean up expired sessions and their data
	 * Call this periodically or on app startup
	 */
	async cleanupExpiredSessions(ttlMs: number = DEFAULT_SESSION_TTL_MS): Promise<number> {
		const sessions = await this.getAllSessions();
		const now = Date.now();
		let deletedCount = 0;

		for (const session of sessions) {
			const age = now - session.lastActivityAt;
			if (age > ttlMs) {
				await this.deleteSession(session.sessionId);
				deletedCount++;
			}
		}

		return deletedCount;
	}

	/**
	 * Keep only the most recent N sessions, delete older ones
	 */
	async keepRecentSessions(maxSessions: number = MAX_SESSIONS_TO_KEEP): Promise<number> {
		const sessions = await this.getAllSessions();

		if (sessions.length <= maxSessions) {
			return 0;
		}

		// Sort by lastActivityAt descending (most recent first)
		sessions.sort((a, b) => b.lastActivityAt - a.lastActivityAt);

		// Delete sessions beyond the limit
		const toDelete = sessions.slice(maxSessions);
		let deletedCount = 0;

		for (const session of toDelete) {
			await this.deleteSession(session.sessionId);
			deletedCount++;
		}

		return deletedCount;
	}

	/**
	 * Clean up completed sessions older than specified time
	 * Keeps incomplete sessions for longer (for resume functionality)
	 */
	async cleanupCompletedSessions(completedTtlMs: number = 24 * 60 * 60 * 1000): Promise<number> {
		const sessions = await this.getAllSessions();
		const now = Date.now();
		let deletedCount = 0;

		for (const session of sessions) {
			const isComplete = session.stats.pending === 0 && session.stats.failed === 0;
			const age = now - session.lastActivityAt;

			// Delete completed sessions older than completedTtlMs (default 24 hours)
			if (isComplete && age > completedTtlMs) {
				await this.deleteSession(session.sessionId);
				deletedCount++;
			}
		}

		return deletedCount;
	}

	/**
	 * Get storage usage estimate
	 */
	async getStorageEstimate(): Promise<{
		usage: number;
		quota: number;
		sessionCount: number;
		balanceCount: number;
		taskCount: number;
	}> {
		const db = await this.getDB();

		// Get counts from each store
		const sessionCount = await this.countStore(db, STORES.SESSIONS);
		const balanceCount = await this.countStore(db, STORES.BALANCES);
		const taskCount = await this.countStore(db, STORES.TASK_STATUS);

		// Get storage estimate if available
		let usage = 0;
		let quota = 0;

		if (
			typeof navigator !== 'undefined' &&
			'storage' in navigator &&
			'estimate' in navigator.storage
		) {
			try {
				const estimate = await navigator.storage.estimate();
				usage = estimate.usage || 0;
				quota = estimate.quota || 0;
			} catch {
				// Storage estimate not available
			}
		}

		return {
			usage,
			quota,
			sessionCount,
			balanceCount,
			taskCount
		};
	}

	/**
	 * Count records in a store
	 */
	private countStore(db: IDBDatabase, storeName: string): Promise<number> {
		return new Promise((resolve, reject) => {
			const tx = db.transaction(storeName, 'readonly');
			const store = tx.objectStore(storeName);
			const request = store.count();

			request.onerror = () =>
				reject(new Error(`Failed to count ${storeName}: ${request.error?.message}`));
			request.onsuccess = () => resolve(request.result);
		});
	}

	/**
	 * Perform automatic cleanup based on storage pressure
	 * Returns cleanup summary
	 */
	async autoCleanup(): Promise<{
		expiredDeleted: number;
		completedDeleted: number;
		excessDeleted: number;
	}> {
		// 1. Delete expired sessions (older than 7 days)
		const expiredDeleted = await this.cleanupExpiredSessions();

		// 2. Delete completed sessions older than 24 hours
		const completedDeleted = await this.cleanupCompletedSessions();

		// 3. Keep only the most recent 10 sessions
		const excessDeleted = await this.keepRecentSessions();

		return {
			expiredDeleted,
			completedDeleted,
			excessDeleted
		};
	}

	/**
	 * Delete all sessions except the current one
	 */
	async deleteOtherSessions(currentSessionId: string): Promise<number> {
		const sessions = await this.getAllSessions();
		let deletedCount = 0;

		for (const session of sessions) {
			if (session.sessionId !== currentSessionId) {
				await this.deleteSession(session.sessionId);
				deletedCount++;
			}
		}

		return deletedCount;
	}

	// ============================================================================
	// Session Status Management
	// ============================================================================

	/**
	 * Update session status
	 */
	async updateSessionStatus(sessionId: string, status: SessionStatus): Promise<void> {
		const session = await this.getSession(sessionId);
		if (!session) return;

		session.status = status;
		session.lastActivityAt = Date.now();

		// Update isPaused based on status for backwards compatibility
		session.isPaused = status === 'paused';

		await this.updateSession(session);
	}

	/**
	 * Mark session as downloaded
	 */
	async markSessionDownloaded(sessionId: string): Promise<void> {
		const session = await this.getSession(sessionId);
		if (!session) return;

		session.hasDownloaded = true;
		session.lastActivityAt = Date.now();
		await this.updateSession(session);
	}

	/**
	 * Get active sessions (scanning, paused, or completed but not downloaded)
	 * These are sessions that need user attention
	 */
	async getActiveSessions(): Promise<ScanSession[]> {
		const sessions = await this.getAllSessions();
		const now = Date.now();
		const ttl = DEFAULT_SESSION_TTL_MS;

		return sessions.filter((s) => {
			// Filter out expired sessions
			if (now - s.lastActivityAt > ttl) return false;

			// Filter out abandoned sessions
			if (s.status === 'abandoned') return false;

			// Keep scanning, paused sessions
			if (s.status === 'scanning' || s.status === 'paused') return true;

			// Keep completed sessions that haven't been downloaded
			if (s.status === 'completed' && !s.hasDownloaded) return true;

			return false;
		});
	}

	/**
	 * Check if a session can be deleted
	 * Rules:
	 * - abandoned: can always delete
	 * - completed + hasDownloaded: can delete
	 * - completed + !hasDownloaded: cannot delete (must download first)
	 * - scanning/paused: cannot delete (must abandon first)
	 */
	canDeleteSession(session: ScanSession): { canDelete: boolean; reason?: string } {
		if (session.status === 'abandoned') {
			return { canDelete: true };
		}

		if (session.status === 'completed') {
			if (session.hasDownloaded) {
				return { canDelete: true };
			}
			return {
				canDelete: false,
				reason: 'Please download the report before deleting this session'
			};
		}

		// scanning or paused
		return {
			canDelete: false,
			reason: 'Please finish or abandon this scan before deleting'
		};
	}

	/**
	 * Abandon a session (mark as abandoned so it can be deleted)
	 */
	async abandonSession(sessionId: string): Promise<void> {
		await this.updateSessionStatus(sessionId, 'abandoned');
	}

	/**
	 * Get sessions by chain ID
	 */
	async getSessionsByChain(chainId: number): Promise<ScanSession[]> {
		const sessions = await this.getAllSessions();
		return sessions.filter((s) => s.chainId === chainId);
	}
}

// Singleton instance
let storageInstance: BalanceScannerStorage | null = null;

/**
 * Get the storage instance (singleton)
 */
export function getStorage(): BalanceScannerStorage {
	if (!storageInstance) {
		storageInstance = new BalanceScannerStorage();
	}
	return storageInstance;
}

/**
 * Check if IndexedDB is available
 */
export function isIndexedDBAvailable(): boolean {
	try {
		return typeof indexedDB !== 'undefined' && indexedDB !== null;
	} catch {
		return false;
	}
}
