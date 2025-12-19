/**
 * Distribution Session Storage
 * Handles persistence of distribution sessions in localStorage for resume capability
 */
import type { DelegatedSession, DelegatedBatch } from '../types/distribution';
import type { TransactionResult } from '../stores/step5-state.svelte';

const STORAGE_KEY_PREFIX = 'biubiu_distribution_session_';
const SESSION_LIST_KEY = 'biubiu_distribution_sessions';
const MAX_SESSIONS = 10; // Maximum number of sessions to keep

/**
 * Stored session metadata for listing
 */
export interface StoredSessionMeta {
	sessionId: string;
	chainId: number;
	tokenSymbol: string;
	recipientCount: number;
	totalBatches: number;
	completedBatches: number;
	status: DelegatedSession['status'];
	createdAt: number;
	expiresAt: number;
	lastUpdatedAt: number;
}

/**
 * Full stored session data
 */
export interface StoredSession {
	meta: StoredSessionMeta;
	session: DelegatedSession;
	results: TransactionResult[];
}

/**
 * Serialize bigint values for JSON storage
 */
function serializeForStorage(obj: unknown): string {
	return JSON.stringify(obj, (_, value) => {
		if (typeof value === 'bigint') {
			return { __type: 'bigint', value: value.toString() };
		}
		return value;
	});
}

/**
 * Deserialize bigint values from JSON storage
 */
function deserializeFromStorage<T>(json: string): T {
	return JSON.parse(json, (_, value) => {
		if (value && typeof value === 'object' && value.__type === 'bigint') {
			return BigInt(value.value);
		}
		return value;
	}) as T;
}

/**
 * Get session storage key
 */
function getSessionKey(sessionId: string): string {
	return `${STORAGE_KEY_PREFIX}${sessionId}`;
}

/**
 * Get list of stored sessions metadata
 */
export function getStoredSessionList(): StoredSessionMeta[] {
	try {
		const listJson = localStorage.getItem(SESSION_LIST_KEY);
		if (!listJson) return [];
		return deserializeFromStorage<StoredSessionMeta[]>(listJson);
	} catch {
		return [];
	}
}

/**
 * Save session list
 */
function saveSessionList(list: StoredSessionMeta[]): void {
	localStorage.setItem(SESSION_LIST_KEY, serializeForStorage(list));
}

/**
 * Save a distribution session
 */
export function saveSession(
	session: DelegatedSession,
	results: TransactionResult[],
	meta: {
		chainId: number;
		tokenSymbol: string;
		recipientCount: number;
	}
): void {
	const sessionId = session.sessionId;
	const completedBatches = session.batches.filter((b) => b.status === 'completed').length;

	const storedMeta: StoredSessionMeta = {
		sessionId,
		chainId: meta.chainId,
		tokenSymbol: meta.tokenSymbol,
		recipientCount: meta.recipientCount,
		totalBatches: session.batches.length,
		completedBatches,
		status: session.status,
		createdAt: session.createdAt,
		expiresAt: session.expiresAt,
		lastUpdatedAt: Date.now()
	};

	const storedSession: StoredSession = {
		meta: storedMeta,
		session,
		results
	};

	// Save session data
	localStorage.setItem(getSessionKey(sessionId), serializeForStorage(storedSession));

	// Update session list
	const list = getStoredSessionList();
	const existingIndex = list.findIndex((s) => s.sessionId === sessionId);

	if (existingIndex >= 0) {
		list[existingIndex] = storedMeta;
	} else {
		list.unshift(storedMeta);
	}

	// Enforce max sessions limit
	if (list.length > MAX_SESSIONS) {
		const removedSessions = list.splice(MAX_SESSIONS);
		// Clean up old session data
		for (const removed of removedSessions) {
			localStorage.removeItem(getSessionKey(removed.sessionId));
		}
	}

	saveSessionList(list);
}

/**
 * Load a stored session
 */
export function loadSession(sessionId: string): StoredSession | null {
	try {
		const json = localStorage.getItem(getSessionKey(sessionId));
		if (!json) return null;
		return deserializeFromStorage<StoredSession>(json);
	} catch {
		return null;
	}
}

/**
 * Delete a stored session
 */
export function deleteSession(sessionId: string): void {
	localStorage.removeItem(getSessionKey(sessionId));

	const list = getStoredSessionList();
	const filteredList = list.filter((s) => s.sessionId !== sessionId);
	saveSessionList(filteredList);
}

/**
 * Clear all stored sessions
 */
export function clearAllSessions(): void {
	const list = getStoredSessionList();
	for (const session of list) {
		localStorage.removeItem(getSessionKey(session.sessionId));
	}
	localStorage.removeItem(SESSION_LIST_KEY);
}

/**
 * Get sessions for a specific chain
 */
export function getSessionsForChain(chainId: number): StoredSessionMeta[] {
	return getStoredSessionList().filter((s) => s.chainId === chainId);
}

/**
 * Get active (non-completed, non-expired) sessions
 */
export function getActiveSessions(): StoredSessionMeta[] {
	const now = Date.now();
	return getStoredSessionList().filter(
		(s) => s.status !== 'completed' && s.status !== 'expired' && s.expiresAt > now
	);
}

/**
 * Check if session is resumable
 */
export function isSessionResumable(meta: StoredSessionMeta): boolean {
	const now = Date.now();
	return (
		meta.status !== 'completed' &&
		meta.status !== 'expired' &&
		meta.expiresAt > now &&
		meta.completedBatches < meta.totalBatches
	);
}

/**
 * Update session status after batch execution
 */
export function updateSessionBatch(
	sessionId: string,
	batchId: number,
	batchUpdate: Partial<DelegatedBatch>,
	newResult?: TransactionResult
): void {
	const stored = loadSession(sessionId);
	if (!stored) return;

	// Update batch
	const batchIndex = stored.session.batches.findIndex((b) => b.batchId === batchId);
	if (batchIndex >= 0) {
		stored.session.batches[batchIndex] = {
			...stored.session.batches[batchIndex],
			...batchUpdate
		};
	}

	// Add result if provided
	if (newResult) {
		stored.results.push(newResult);
	}

	// Update session status
	const allCompleted = stored.session.batches.every((b) => b.status === 'completed');
	const anyCompleted = stored.session.batches.some((b) => b.status === 'completed');

	if (allCompleted) {
		stored.session.status = 'completed';
	} else if (anyCompleted) {
		stored.session.status = 'partial';
	}

	// Re-save
	saveSession(stored.session, stored.results, {
		chainId: stored.meta.chainId,
		tokenSymbol: stored.meta.tokenSymbol,
		recipientCount: stored.meta.recipientCount
	});
}

/**
 * Export session as shareable JSON string
 */
export function exportSessionAsJson(sessionId: string): string | null {
	const stored = loadSession(sessionId);
	if (!stored) return null;
	return serializeForStorage(stored);
}

/**
 * Import session from JSON string
 */
export function importSessionFromJson(json: string): StoredSession | null {
	try {
		const stored = deserializeFromStorage<StoredSession>(json);
		if (!stored.session || !stored.meta) return null;

		// Save imported session
		saveSession(stored.session, stored.results, {
			chainId: stored.meta.chainId,
			tokenSymbol: stored.meta.tokenSymbol,
			recipientCount: stored.meta.recipientCount
		});

		return stored;
	} catch {
		return null;
	}
}

/**
 * Clean up expired sessions
 */
export function cleanupExpiredSessions(): number {
	const now = Date.now();
	const list = getStoredSessionList();
	let removed = 0;

	for (const meta of list) {
		if (meta.expiresAt < now) {
			deleteSession(meta.sessionId);
			removed++;
		}
	}

	return removed;
}
