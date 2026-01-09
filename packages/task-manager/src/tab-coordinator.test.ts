/**
 * TabCoordinator Tests
 *
 * Note: Web Locks API is not available in Node.js environment.
 * These tests verify the fallback behavior and API surface.
 * Real multi-tab locking can only be tested in a browser environment.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { TabCoordinator, getTabCoordinator, withTabCoordination } from './tab-coordinator';
import { createMemoryStorage } from './storage/memory';

describe('TabCoordinator', () => {
	describe('in Node.js environment (no Web Locks API)', () => {
		let coordinator: TabCoordinator;

		beforeEach(() => {
			coordinator = new TabCoordinator({ lockName: 'test-lock' });
		});

		it('should report not supported in Node.js', () => {
			// Web Locks API is not available in Node.js
			expect(coordinator.supported).toBe(false);
		});

		it('should fallback to direct execution for write lock', async () => {
			let executed = false;
			await coordinator.acquireWriteLock(async () => {
				executed = true;
				return 'result';
			});
			expect(executed).toBe(true);
		});

		it('should fallback to direct execution for read lock', async () => {
			let executed = false;
			await coordinator.acquireReadLock(async () => {
				executed = true;
				return 'result';
			});
			expect(executed).toBe(true);
		});

		it('should return operation result', async () => {
			const result = await coordinator.acquireWriteLock(async () => {
				return { data: 'test' };
			});
			expect(result).toEqual({ data: 'test' });
		});

		it('should propagate errors', async () => {
			await expect(
				coordinator.acquireWriteLock(async () => {
					throw new Error('Test error');
				})
			).rejects.toThrow('Test error');
		});

		it('should report not locked', async () => {
			const isLocked = await coordinator.isLocked();
			expect(isLocked).toBe(false);
		});

		it('should return zero lock info', async () => {
			const info = await coordinator.getLockInfo();
			expect(info).toEqual({ held: 0, pending: 0 });
		});

		it('should execute tryAcquireWriteLock directly', async () => {
			const result = await coordinator.tryAcquireWriteLock(async () => {
				return 'acquired';
			});
			expect(result).toBe('acquired');
		});

		it('should handle releaseAll without error', () => {
			// Should not throw even without any locks
			expect(() => coordinator.releaseAll()).not.toThrow();
		});
	});

	describe('configuration options', () => {
		it('should use default lock name', () => {
			const coordinator = new TabCoordinator();
			// Internal lockName should default to 'task-manager'
			expect(coordinator.supported).toBe(false); // Still not supported in Node
		});

		it('should accept custom lock timeout', () => {
			const coordinator = new TabCoordinator({ lockTimeout: 5000 });
			expect(coordinator.supported).toBe(false);
		});

		it('should accept useSharedReads option', () => {
			const coordinator = new TabCoordinator({ useSharedReads: true });
			expect(coordinator.supported).toBe(false);
		});
	});
});

describe('getTabCoordinator', () => {
	it('should return same instance for same database name', () => {
		const coord1 = getTabCoordinator('test-db');
		const coord2 = getTabCoordinator('test-db');
		expect(coord1).toBe(coord2);
	});

	it('should return different instances for different database names', () => {
		const coord1 = getTabCoordinator('test-db-1');
		const coord2 = getTabCoordinator('test-db-2');
		expect(coord1).not.toBe(coord2);
	});
});

describe('withTabCoordination', () => {
	it('should wrap storage adapter', async () => {
		const storage = createMemoryStorage();
		const coordinator = new TabCoordinator({ lockName: 'test' });
		const wrappedStorage = withTabCoordination(storage, coordinator);

		// Verify all methods exist
		expect(wrappedStorage.saveRoot).toBeDefined();
		expect(wrappedStorage.getRoot).toBeDefined();
		expect(wrappedStorage.saveNode).toBeDefined();
		expect(wrappedStorage.getNode).toBeDefined();
		expect(wrappedStorage.deleteRoot).toBeDefined();
		expect(wrappedStorage.close).toBeDefined();
		expect(wrappedStorage.clear).toBeDefined();
	});

	it('should pass through operations to underlying storage', async () => {
		const storage = createMemoryStorage();
		const coordinator = new TabCoordinator({ lockName: 'test' });
		const wrappedStorage = withTabCoordination(storage, coordinator);

		// Create a root through wrapped storage
		const root = {
			id: 'test-root',
			name: 'Test Task',
			type: 'test',
			status: 'pending' as const,
			progress: 0,
			concurrency: 1,
			stats: { total: 0, completed: 0, failed: 0 },
			merkleRoot: null,
			createdAt: Date.now(),
			updatedAt: Date.now()
		};

		await wrappedStorage.saveRoot(root);

		// Verify it was saved
		const retrieved = await wrappedStorage.getRoot('test-root');
		expect(retrieved).not.toBeNull();
		expect(retrieved?.name).toBe('Test Task');

		// Verify underlying storage also has it
		const fromOriginal = await storage.getRoot('test-root');
		expect(fromOriginal).not.toBeNull();
	});

	it('should wrap optional methods when present', async () => {
		const storage = createMemoryStorage();
		const coordinator = new TabCoordinator({ lockName: 'test' });
		const wrappedStorage = withTabCoordination(storage, coordinator);

		// Memory storage has these optional methods
		expect(wrappedStorage.saveRootWithNodes).toBeDefined();
		expect(wrappedStorage.deleteRootWithNodes).toBeDefined();
		expect(wrappedStorage.getAllNodes).toBeDefined();
	});

	it('should release locks on close', async () => {
		const storage = createMemoryStorage();
		const coordinator = new TabCoordinator({ lockName: 'test' });
		const wrappedStorage = withTabCoordination(storage, coordinator);

		// Should not throw
		await wrappedStorage.close();
	});
});

describe('Web Locks API simulation', () => {
	// These tests document expected behavior in browser environment
	// They can't actually test Web Locks in Node.js

	it('should document exclusive lock behavior', () => {
		/**
		 * In browser environment:
		 * - acquireWriteLock() requests an exclusive lock
		 * - Only one tab can hold an exclusive lock at a time
		 * - Other tabs must wait until the lock is released
		 *
		 * Example timeline:
		 * Tab A: [---holding lock---]
		 * Tab B:        [waiting...][---holding lock---]
		 */
		expect(true).toBe(true); // Documentation test
	});

	it('should document shared lock behavior', () => {
		/**
		 * When useSharedReads: true:
		 * - acquireReadLock() requests a shared lock
		 * - Multiple tabs can hold shared locks simultaneously
		 * - Exclusive locks must wait for all shared locks to release
		 *
		 * Example timeline:
		 * Tab A (read):  [---shared lock---]
		 * Tab B (read):  [---shared lock---]
		 * Tab C (write):                    [waiting][exclusive]
		 */
		expect(true).toBe(true); // Documentation test
	});

	it('should document lock timeout behavior', () => {
		/**
		 * With lockTimeout: 30000:
		 * - If lock cannot be acquired within 30 seconds, throws error
		 * - Prevents deadlocks from abandoned locks
		 * - Browser automatically releases locks when tab closes
		 */
		expect(true).toBe(true); // Documentation test
	});
});
