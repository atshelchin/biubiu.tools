import Dexie, { type Table } from 'dexie';
import type { AssetMovement, ScanSession, AssetBalance } from '../types/assets';

/**
 * Assets Monitor Database
 * Stores scan sessions, asset movements, and balance snapshots
 */
export class AssetsMonitorDB extends Dexie {
	// Tables
	movements!: Table<AssetMovement, string>;
	sessions!: Table<ScanSession, string>;
	balances!: Table<AssetBalance & { id: string; sessionId: string }, string>;

	constructor() {
		super('AssetsMonitorDB');

		// Define schema
		this.version(1).stores({
			movements:
				'id, txHash, blockNumber, timestamp, from, to, direction, assetType, tokenAddress, [sessionId+assetType], [sessionId+direction]',
			sessions: 'id, createdAt, updatedAt, status, config.walletAddress',
			balances: 'id, sessionId, assetType, tokenAddress'
		});
	}

	/**
	 * Clear all data for a session
	 */
	async clearSession(sessionId: string) {
		await this.transaction('rw', [this.movements, this.sessions, this.balances], async () => {
			await this.movements.where('id').startsWith(`${sessionId}-`).delete();
			await this.balances.where('sessionId').equals(sessionId).delete();
			await this.sessions.delete(sessionId);
		});
	}

	/**
	 * Get movements for a session
	 */
	async getSessionMovements(sessionId: string): Promise<AssetMovement[]> {
		return await this.movements.where('id').startsWith(`${sessionId}-`).toArray();
	}

	/**
	 * Get balances for a session
	 */
	async getSessionBalances(sessionId: string): Promise<AssetBalance[]> {
		return await this.balances.where('sessionId').equals(sessionId).toArray();
	}

	/**
	 * Batch add movements
	 */
	async addMovements(sessionId: string, movements: AssetMovement[]) {
		const movementsWithSessionId = movements.map((m) => ({
			...m,
			id: `${sessionId}-${m.id}`
		}));
		await this.movements.bulkAdd(movementsWithSessionId);
	}

	/**
	 * Update session status
	 */
	async updateSessionStatus(sessionId: string, status: ScanSession['status']) {
		await this.sessions.update(sessionId, {
			status,
			updatedAt: Date.now()
		});
	}

	/**
	 * Get all sessions
	 */
	async getAllSessions(): Promise<ScanSession[]> {
		return await this.sessions.orderBy('updatedAt').reverse().toArray();
	}

	/**
	 * Export session data
	 */
	async exportSession(sessionId: string) {
		const session = await this.sessions.get(sessionId);
		const movements = await this.getSessionMovements(sessionId);
		const balances = await this.getSessionBalances(sessionId);

		return {
			session,
			movements,
			balances,
			exportedAt: Date.now()
		};
	}
}

// Create singleton instance
export const assetsDB = new AssetsMonitorDB();

/**
 * Helper function to generate session ID
 */
export function generateSessionId(): string {
	return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Helper function to generate movement ID
 */
export function generateMovementId(txHash: string, logIndex: number = 0): string {
	return `${txHash}-${logIndex}`;
}
