/**
 * Balance Scanner Storage Tests
 *
 * Tests for IndexedDB storage layer using fake-indexeddb.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import 'fake-indexeddb/auto';
import { BalanceScannerStorage, type ScanSession } from './storage';
import type { Address } from 'viem';
import type { TokenConfig, ScanStats, ScanConfig } from './types';
import { DEFAULT_SCAN_CONFIG } from './types';

describe('BalanceScannerStorage', () => {
	let storage: BalanceScannerStorage;

	const mockAddress1 = '0x1111111111111111111111111111111111111111' as Address;
	const mockAddress2 = '0x2222222222222222222222222222222222222222' as Address;

	const mockToken: TokenConfig = {
		id: '1:native',
		decimals: 18,
		chainId: 1,
		symbol: 'ETH'
	};

	const mockStats: ScanStats = {
		total: 2,
		success: 0,
		failed: 0,
		pending: 2,
		progress: 0
	};

	const mockConfig: ScanConfig = DEFAULT_SCAN_CONFIG;

	const createMockSession = (
		sessionId: string,
		overrides: Partial<ScanSession> = {}
	): ScanSession => ({
		sessionId,
		chainId: 1,
		addresses: [mockAddress1, mockAddress2],
		tokens: [mockToken],
		config: mockConfig,
		stats: mockStats,
		startedAt: Date.now(),
		lastActivityAt: Date.now(),
		isPaused: false,
		status: 'scanning',
		hasDownloaded: false,
		...overrides
	});

	beforeEach(async () => {
		// Create a fresh storage instance for each test
		storage = new BalanceScannerStorage();
		await storage.init();
	});

	afterEach(async () => {
		// Clean up after each test
		await storage.clearAll();
		storage.close();
	});

	describe('init', () => {
		it('should initialize the database', async () => {
			const newStorage = new BalanceScannerStorage();
			await expect(newStorage.init()).resolves.not.toThrow();
			newStorage.close();
		});

		it('should be idempotent (can be called multiple times)', async () => {
			await expect(storage.init()).resolves.not.toThrow();
			await expect(storage.init()).resolves.not.toThrow();
		});
	});

	describe('Session Operations', () => {
		describe('createSession', () => {
			it('should create a new session', async () => {
				const session = createMockSession('test-session-1');

				await storage.createSession(session);

				const retrieved = await storage.getSession('test-session-1');
				expect(retrieved).not.toBeNull();
				expect(retrieved?.sessionId).toBe('test-session-1');
				expect(retrieved?.chainId).toBe(1);
			});

			it('should update existing session if same ID', async () => {
				const session1 = createMockSession('test-session-1', { isPaused: false });
				const session2 = createMockSession('test-session-1', { isPaused: true });

				await storage.createSession(session1);
				await storage.createSession(session2);

				const retrieved = await storage.getSession('test-session-1');
				expect(retrieved?.isPaused).toBe(true);
			});
		});

		describe('getSession', () => {
			it('should return null for non-existent session', async () => {
				const result = await storage.getSession('non-existent');
				expect(result).toBeNull();
			});

			it('should return session with correct data', async () => {
				const session = createMockSession('test-session-1');
				await storage.createSession(session);

				const retrieved = await storage.getSession('test-session-1');

				expect(retrieved).not.toBeNull();
				expect(retrieved?.addresses).toEqual([mockAddress1, mockAddress2]);
				expect(retrieved?.tokens).toEqual([mockToken]);
			});
		});

		describe('getAllSessions', () => {
			it('should return empty array when no sessions', async () => {
				const sessions = await storage.getAllSessions();
				expect(sessions).toEqual([]);
			});

			it('should return all sessions', async () => {
				await storage.createSession(createMockSession('session-1'));
				await storage.createSession(createMockSession('session-2'));
				await storage.createSession(createMockSession('session-3'));

				const sessions = await storage.getAllSessions();

				expect(sessions).toHaveLength(3);
				expect(sessions.map((s) => s.sessionId).sort()).toEqual([
					'session-1',
					'session-2',
					'session-3'
				]);
			});
		});

		describe('deleteSession', () => {
			it('should delete a session', async () => {
				await storage.createSession(createMockSession('test-session-1'));

				await storage.deleteSession('test-session-1');

				const retrieved = await storage.getSession('test-session-1');
				expect(retrieved).toBeNull();
			});

			it('should delete associated balances and task statuses', async () => {
				const sessionId = 'test-session-1';
				await storage.createSession(createMockSession(sessionId));

				// Add balances and task statuses
				await storage.saveBalances(sessionId, [
					{ address: mockAddress1, tokenId: mockToken.id, balance: 1000n }
				]);
				await storage.saveTaskStatuses(sessionId, [
					{ address: mockAddress1, tokenId: mockToken.id, status: 'success' }
				]);

				// Delete session
				await storage.deleteSession(sessionId);

				// Verify balances are deleted
				const balance = await storage.getBalance(sessionId, mockAddress1, mockToken.id);
				expect(balance).toBeNull();
			});

			it('should not throw when deleting non-existent session', async () => {
				await expect(storage.deleteSession('non-existent')).resolves.not.toThrow();
			});
		});

		describe('updateSession', () => {
			it('should update session stats', async () => {
				const session = createMockSession('test-session-1');
				await storage.createSession(session);

				const updatedSession = {
					...session,
					stats: { ...session.stats, success: 1, pending: 1, progress: 50 }
				};
				await storage.updateSession(updatedSession);

				const retrieved = await storage.getSession('test-session-1');
				expect(retrieved?.stats.success).toBe(1);
				expect(retrieved?.stats.progress).toBe(50);
			});
		});
	});

	describe('Balance Operations', () => {
		const sessionId = 'balance-test-session';

		beforeEach(async () => {
			await storage.createSession(createMockSession(sessionId));
		});

		describe('saveBalances', () => {
			it('should save balance records', async () => {
				await storage.saveBalances(sessionId, [
					{ address: mockAddress1, tokenId: mockToken.id, balance: 1000000000000000000n }
				]);

				const balance = await storage.getBalance(sessionId, mockAddress1, mockToken.id);
				expect(balance).toBe(1000000000000000000n);
			});

			it('should save multiple balances in batch', async () => {
				await storage.saveBalances(sessionId, [
					{ address: mockAddress1, tokenId: mockToken.id, balance: 1000n },
					{ address: mockAddress2, tokenId: mockToken.id, balance: 2000n }
				]);

				const balance1 = await storage.getBalance(sessionId, mockAddress1, mockToken.id);
				const balance2 = await storage.getBalance(sessionId, mockAddress2, mockToken.id);

				expect(balance1).toBe(1000n);
				expect(balance2).toBe(2000n);
			});

			it('should overwrite existing balance', async () => {
				await storage.saveBalances(sessionId, [
					{ address: mockAddress1, tokenId: mockToken.id, balance: 1000n }
				]);

				await storage.saveBalances(sessionId, [
					{ address: mockAddress1, tokenId: mockToken.id, balance: 2000n }
				]);

				const balance = await storage.getBalance(sessionId, mockAddress1, mockToken.id);
				expect(balance).toBe(2000n);
			});
		});

		describe('getBalance', () => {
			it('should return null for non-existent balance', async () => {
				const balance = await storage.getBalance(sessionId, mockAddress1, mockToken.id);
				expect(balance).toBeNull();
			});

			it('should handle zero balance', async () => {
				await storage.saveBalances(sessionId, [
					{ address: mockAddress1, tokenId: mockToken.id, balance: 0n }
				]);

				const balance = await storage.getBalance(sessionId, mockAddress1, mockToken.id);
				expect(balance).toBe(0n);
			});

			it('should handle very large balances', async () => {
				const largeBalance = 999999999999999999999999999999n;
				await storage.saveBalances(sessionId, [
					{ address: mockAddress1, tokenId: mockToken.id, balance: largeBalance }
				]);

				const balance = await storage.getBalance(sessionId, mockAddress1, mockToken.id);
				expect(balance).toBe(largeBalance);
			});
		});

		describe('getBalancesBySession', () => {
			it('should return empty results for session without balances', async () => {
				const { results, total } = await storage.getBalancesBySession(sessionId, [mockToken]);

				expect(results).toEqual([]);
				expect(total).toBe(0);
			});

			it('should return balances with pagination', async () => {
				// Save 5 balances
				const addresses = Array.from(
					{ length: 5 },
					(_, i) => `0x${(i + 1).toString().padStart(40, '0')}` as Address
				);

				await storage.saveBalances(
					sessionId,
					addresses.map((addr) => ({ address: addr, tokenId: mockToken.id, balance: 1000n }))
				);

				// Get first page
				const page1 = await storage.getBalancesBySession(sessionId, [mockToken], {
					offset: 0,
					limit: 2
				});
				expect(page1.results).toHaveLength(2);
				expect(page1.total).toBe(5);

				// Get second page
				const page2 = await storage.getBalancesBySession(sessionId, [mockToken], {
					offset: 2,
					limit: 2
				});
				expect(page2.results).toHaveLength(2);
			});

			it('should filter by hasBalanceOnly', async () => {
				await storage.saveBalances(sessionId, [
					{ address: mockAddress1, tokenId: mockToken.id, balance: 1000n },
					{ address: mockAddress2, tokenId: mockToken.id, balance: 0n }
				]);

				const { results } = await storage.getBalancesBySession(sessionId, [mockToken], {
					hasBalanceOnly: true
				});

				expect(results).toHaveLength(1);
				expect(results[0].address.toLowerCase()).toBe(mockAddress1.toLowerCase());
			});

			it('should format balances correctly', async () => {
				await storage.saveBalances(sessionId, [
					{ address: mockAddress1, tokenId: mockToken.id, balance: 1000000000000000000n } // 1 ETH
				]);

				const { results } = await storage.getBalancesBySession(sessionId, [mockToken]);

				expect(results[0].balances[0].formatted).toBe('1');
			});
		});
	});

	describe('Task Status Operations', () => {
		const sessionId = 'task-test-session';

		beforeEach(async () => {
			await storage.createSession(createMockSession(sessionId));
		});

		describe('saveTaskStatuses', () => {
			it('should save task statuses', async () => {
				await storage.saveTaskStatuses(sessionId, [
					{ address: mockAddress1, tokenId: mockToken.id, status: 'pending' },
					{ address: mockAddress2, tokenId: mockToken.id, status: 'success' }
				]);

				const stats = await storage.countTasksByStatus(sessionId);
				expect(stats.pending).toBe(1);
				expect(stats.success).toBe(1);
			});

			it('should update existing task status', async () => {
				await storage.saveTaskStatuses(sessionId, [
					{ address: mockAddress1, tokenId: mockToken.id, status: 'pending' }
				]);

				await storage.saveTaskStatuses(sessionId, [
					{ address: mockAddress1, tokenId: mockToken.id, status: 'success' }
				]);

				const stats = await storage.countTasksByStatus(sessionId);
				expect(stats.pending).toBe(0);
				expect(stats.success).toBe(1);
			});
		});

		describe('getTasksByStatus', () => {
			it('should return tasks filtered by status', async () => {
				await storage.saveTaskStatuses(sessionId, [
					{ address: mockAddress1, tokenId: mockToken.id, status: 'pending' },
					{ address: mockAddress2, tokenId: mockToken.id, status: 'failed', retryCount: 2 }
				]);

				const failedTasks = await storage.getTasksByStatus(sessionId, 'failed');

				expect(failedTasks).toHaveLength(1);
				expect(failedTasks[0].address.toLowerCase()).toBe(mockAddress2.toLowerCase());
				expect(failedTasks[0].retryCount).toBe(2);
			});

			it('should return empty array when no tasks match status', async () => {
				await storage.saveTaskStatuses(sessionId, [
					{ address: mockAddress1, tokenId: mockToken.id, status: 'pending' }
				]);

				const successTasks = await storage.getTasksByStatus(sessionId, 'success');

				expect(successTasks).toEqual([]);
			});
		});

		describe('countTasksByStatus', () => {
			it('should return correct stats', async () => {
				await storage.saveTaskStatuses(sessionId, [
					{ address: mockAddress1, tokenId: mockToken.id, status: 'success' },
					{ address: mockAddress2, tokenId: mockToken.id, status: 'failed' },
					{ address: mockAddress1, tokenId: '1:0xtoken', status: 'pending' }
				]);

				const stats = await storage.countTasksByStatus(sessionId);

				expect(stats.total).toBe(3);
				expect(stats.success).toBe(1);
				expect(stats.failed).toBe(1);
				expect(stats.pending).toBe(1);
				expect(stats.progress).toBe(33);
			});

			it('should return zero stats for empty session', async () => {
				const stats = await storage.countTasksByStatus(sessionId);

				expect(stats.total).toBe(0);
				expect(stats.progress).toBe(0);
			});
		});

		describe('initializeTaskStatuses', () => {
			it('should initialize all tasks as pending', async () => {
				const addresses = [mockAddress1, mockAddress2];
				const tokens = [mockToken, { ...mockToken, id: '1:0xtoken' }];

				await storage.initializeTaskStatuses(sessionId, addresses, tokens);

				const stats = await storage.countTasksByStatus(sessionId);

				expect(stats.total).toBe(4); // 2 addresses × 2 tokens
				expect(stats.pending).toBe(4);
				expect(stats.success).toBe(0);
				expect(stats.failed).toBe(0);
			});
		});
	});

	describe('Storage Cleanup', () => {
		describe('cleanupExpiredSessions', () => {
			it('should delete sessions older than TTL', async () => {
				const now = Date.now();
				const oldSession = createMockSession('old-session', {
					lastActivityAt: now - 8 * 24 * 60 * 60 * 1000 // 8 days ago
				});
				const newSession = createMockSession('new-session', {
					lastActivityAt: now
				});

				await storage.createSession(oldSession);
				await storage.createSession(newSession);

				const deleted = await storage.cleanupExpiredSessions();

				expect(deleted).toBe(1);

				const sessions = await storage.getAllSessions();
				expect(sessions).toHaveLength(1);
				expect(sessions[0].sessionId).toBe('new-session');
			});

			it('should respect custom TTL', async () => {
				const now = Date.now();
				const session = createMockSession('test-session', {
					lastActivityAt: now - 2 * 60 * 60 * 1000 // 2 hours ago
				});

				await storage.createSession(session);

				// TTL of 1 hour should delete the session
				const deleted = await storage.cleanupExpiredSessions(1 * 60 * 60 * 1000);

				expect(deleted).toBe(1);
			});
		});

		describe('keepRecentSessions', () => {
			it('should keep only most recent N sessions', async () => {
				const now = Date.now();

				// Create 5 sessions with different timestamps
				for (let i = 0; i < 5; i++) {
					await storage.createSession(
						createMockSession(`session-${i}`, {
							lastActivityAt: now - i * 1000 // session-0 is newest
						})
					);
				}

				const deleted = await storage.keepRecentSessions(3);

				expect(deleted).toBe(2);

				const sessions = await storage.getAllSessions();
				expect(sessions).toHaveLength(3);
			});

			it('should not delete if under limit', async () => {
				await storage.createSession(createMockSession('session-1'));
				await storage.createSession(createMockSession('session-2'));

				const deleted = await storage.keepRecentSessions(5);

				expect(deleted).toBe(0);
			});
		});

		describe('cleanupCompletedSessions', () => {
			it('should delete completed sessions older than TTL', async () => {
				const now = Date.now();

				// Completed session (old)
				const completedSession = createMockSession('completed-session', {
					lastActivityAt: now - 25 * 60 * 60 * 1000, // 25 hours ago
					stats: { total: 2, success: 2, failed: 0, pending: 0, progress: 100 }
				});

				// Incomplete session (old)
				const incompleteSession = createMockSession('incomplete-session', {
					lastActivityAt: now - 25 * 60 * 60 * 1000, // 25 hours ago
					stats: { total: 2, success: 1, failed: 0, pending: 1, progress: 50 }
				});

				await storage.createSession(completedSession);
				await storage.createSession(incompleteSession);

				const deleted = await storage.cleanupCompletedSessions();

				expect(deleted).toBe(1);

				const remaining = await storage.getSession('incomplete-session');
				expect(remaining).not.toBeNull();
			});
		});

		describe('autoCleanup', () => {
			it('should perform all cleanup operations', async () => {
				const now = Date.now();

				// Create various sessions
				await storage.createSession(
					createMockSession('expired', {
						lastActivityAt: now - 8 * 24 * 60 * 60 * 1000
					})
				);

				await storage.createSession(
					createMockSession('completed-old', {
						lastActivityAt: now - 25 * 60 * 60 * 1000,
						stats: { total: 2, success: 2, failed: 0, pending: 0, progress: 100 }
					})
				);

				await storage.createSession(createMockSession('recent'));

				const result = await storage.autoCleanup();

				expect(result.expiredDeleted).toBe(1);
				expect(result.completedDeleted).toBe(1);
				expect(result.excessDeleted).toBe(0);

				const sessions = await storage.getAllSessions();
				expect(sessions).toHaveLength(1);
				expect(sessions[0].sessionId).toBe('recent');
			});
		});

		describe('deleteOtherSessions', () => {
			it('should delete all sessions except specified one', async () => {
				await storage.createSession(createMockSession('keep'));
				await storage.createSession(createMockSession('delete-1'));
				await storage.createSession(createMockSession('delete-2'));

				const deleted = await storage.deleteOtherSessions('keep');

				expect(deleted).toBe(2);

				const sessions = await storage.getAllSessions();
				expect(sessions).toHaveLength(1);
				expect(sessions[0].sessionId).toBe('keep');
			});
		});

		describe('clearAll', () => {
			it('should clear all data', async () => {
				await storage.createSession(createMockSession('session-1'));
				await storage.saveBalances('session-1', [
					{ address: mockAddress1, tokenId: mockToken.id, balance: 1000n }
				]);
				await storage.saveTaskStatuses('session-1', [
					{ address: mockAddress1, tokenId: mockToken.id, status: 'success' }
				]);

				await storage.clearAll();

				const sessions = await storage.getAllSessions();
				expect(sessions).toEqual([]);
			});
		});
	});

	describe('getStorageEstimate', () => {
		it('should return storage counts', async () => {
			await storage.createSession(createMockSession('session-1'));
			await storage.saveBalances('session-1', [
				{ address: mockAddress1, tokenId: mockToken.id, balance: 1000n }
			]);
			await storage.saveTaskStatuses('session-1', [
				{ address: mockAddress1, tokenId: mockToken.id, status: 'success' }
			]);

			const estimate = await storage.getStorageEstimate();

			expect(estimate.sessionCount).toBe(1);
			expect(estimate.balanceCount).toBe(1);
			expect(estimate.taskCount).toBe(1);
		});
	});

	describe('close', () => {
		it('should close the database connection', () => {
			expect(() => storage.close()).not.toThrow();
		});

		it('should allow reinitializing after close', async () => {
			storage.close();

			const newStorage = new BalanceScannerStorage();
			await expect(newStorage.init()).resolves.not.toThrow();
			newStorage.close();
		});
	});
});
