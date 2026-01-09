/**
 * Concurrency & Reliability Tests
 *
 * Tests for:
 * 1. Concurrent stats race condition
 * 2. Large batch operations (1k, 10k, 100k tasks)
 * 3. Storage quota handling
 * 4. Stats accuracy under high concurrency
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TaskManager, createTaskManager } from './task-manager';
import { createMemoryStorage, MemoryStorage } from './storage/memory';
import { IndexedDBStorage } from './storage/indexeddb';
import type { TaskExecutor } from './types';

describe('Concurrent Stats Race Condition', () => {
	let tm: TaskManager<{ index: number }>;
	let storage: MemoryStorage;

	beforeEach(() => {
		storage = createMemoryStorage() as MemoryStorage;
		tm = createTaskManager<{ index: number }>({
			storage,
			retry: { maxAttempts: 1, baseDelayMs: 10, maxDelayMs: 50 }
		});
	});

	afterEach(async () => {
		await tm.close();
	});

	it('should maintain accurate stats with high concurrency (10 parallel tasks)', async () => {
		const taskCount = 10;
		const root = await tm.create({
			name: 'Concurrent Test',
			concurrency: taskCount, // All tasks run in parallel
			children: Array.from({ length: taskCount }, (_, i) => ({
				name: `Task ${i}`,
				data: { index: i }
			}))
		});

		const executor: TaskExecutor<{ index: number }> = async (ctx) => {
			// Simulate some async work
			await new Promise((r) => setTimeout(r, Math.random() * 10));
			await ctx.complete();
		};

		await tm.execute(root.id, executor);

		const finalRoot = await tm.getRoot(root.id);
		expect(finalRoot?.stats.completed).toBe(taskCount);
		expect(finalRoot?.stats.failed).toBe(0);
		expect(finalRoot?.stats.total).toBe(taskCount);

		// Verify with actual data
		const result = await tm.verifyIntegrity(root.id);
		expect(result.valid).toBe(true);
		expect(result.issues).toHaveLength(0);
	});

	it('should maintain accurate stats with very high concurrency (100 parallel tasks)', async () => {
		const taskCount = 100;
		const root = await tm.create({
			name: 'High Concurrency Test',
			concurrency: 50, // 50 parallel workers
			children: Array.from({ length: taskCount }, (_, i) => ({
				name: `Task ${i}`,
				data: { index: i }
			}))
		});

		const executor: TaskExecutor<{ index: number }> = async (ctx) => {
			// Very fast completion to maximize race condition chance
			await ctx.complete();
		};

		await tm.execute(root.id, executor);

		const finalRoot = await tm.getRoot(root.id);
		expect(finalRoot?.stats.completed).toBe(taskCount);

		// Critical: verify stats match actual node states
		const result = await tm.verifyIntegrity(root.id);
		expect(result.valid).toBe(true);
		if (!result.valid) {
			console.error('Stats mismatch detected:', result.issues);
		}
	});

	it('should handle mixed success/failure with high concurrency', async () => {
		const taskCount = 50;
		const failEvery = 5; // Every 5th task fails

		const root = await tm.create({
			name: 'Mixed Concurrent Test',
			concurrency: 25,
			children: Array.from({ length: taskCount }, (_, i) => ({
				name: `Task ${i}`,
				data: { index: i }
			}))
		});

		const executor: TaskExecutor<{ index: number }> = async (ctx) => {
			if (ctx.data.index % failEvery === 0) {
				await ctx.fail('Intentional failure');
			} else {
				await ctx.complete();
			}
		};

		await tm.execute(root.id, executor);

		const finalRoot = await tm.getRoot(root.id);
		const expectedFailed = Math.floor(taskCount / failEvery);
		const expectedCompleted = taskCount - expectedFailed;

		expect(finalRoot?.stats.failed).toBe(expectedFailed);
		expect(finalRoot?.stats.completed).toBe(expectedCompleted);

		// Verify integrity
		const result = await tm.verifyIntegrity(root.id);
		expect(result.valid).toBe(true);
	});
});

describe('Large Batch Operations', () => {
	let tm: TaskManager<{ index: number }>;
	let storage: MemoryStorage;

	beforeEach(() => {
		storage = createMemoryStorage() as MemoryStorage;
		tm = createTaskManager<{ index: number }>({
			storage,
			skipMerkle: true, // Skip merkle for performance
			retry: { maxAttempts: 1, baseDelayMs: 10, maxDelayMs: 50 }
		});
	});

	afterEach(async () => {
		await tm.close();
	});

	it('should handle 1,000 tasks correctly', async () => {
		const taskCount = 1000;
		const root = await tm.create({
			name: '1K Tasks',
			concurrency: 10,
			children: Array.from({ length: taskCount }, (_, i) => ({
				name: `Task ${i}`,
				data: { index: i }
			}))
		});

		expect(root.stats.total).toBe(taskCount);

		const executor: TaskExecutor<{ index: number }> = async (ctx) => {
			await ctx.complete();
		};

		await tm.execute(root.id, executor);

		const finalRoot = await tm.getRoot(root.id);
		expect(finalRoot?.stats.completed).toBe(taskCount);
		expect(finalRoot?.status).toBe('completed');

		// Verify integrity
		const result = await tm.verifyIntegrity(root.id);
		expect(result.valid).toBe(true);
	});

	it('should handle 10,000 tasks correctly', async () => {
		const taskCount = 10000;
		const root = await tm.create({
			name: '10K Tasks',
			concurrency: 50,
			children: Array.from({ length: taskCount }, (_, i) => ({
				name: `Task ${i}`,
				data: { index: i }
			}))
		});

		expect(root.stats.total).toBe(taskCount);

		let completedCount = 0;
		const executor: TaskExecutor<{ index: number }> = async (ctx) => {
			completedCount++;
			await ctx.complete();
		};

		await tm.execute(root.id, executor);

		const finalRoot = await tm.getRoot(root.id);
		expect(finalRoot?.stats.completed).toBe(taskCount);
		expect(completedCount).toBe(taskCount);

		// Verify integrity
		const result = await tm.verifyIntegrity(root.id);
		expect(result.valid).toBe(true);
	}, 30000); // 30s timeout for large test
});

describe('Stats Atomic Update Verification', () => {
	let tm: TaskManager<{ index: number }>;
	let storage: MemoryStorage;

	beforeEach(() => {
		storage = createMemoryStorage() as MemoryStorage;
		tm = createTaskManager<{ index: number }>({
			storage,
			skipMerkle: true,
			retry: { maxAttempts: 1, baseDelayMs: 10, maxDelayMs: 50 }
		});
	});

	afterEach(async () => {
		await tm.close();
	});

	it('should not lose stats updates when tasks complete simultaneously', async () => {
		// This test specifically targets the race condition
		// where multiple tasks complete at the exact same time
		const taskCount = 20;
		const root = await tm.create({
			name: 'Simultaneous Complete Test',
			concurrency: taskCount, // All run at once
			children: Array.from({ length: taskCount }, (_, i) => ({
				name: `Task ${i}`,
				data: { index: i }
			}))
		});

		// All tasks will complete at approximately the same time
		const executor: TaskExecutor<{ index: number }> = async (ctx) => {
			// No delay - immediate completion to maximize race condition
			await ctx.complete();
		};

		await tm.execute(root.id, executor);

		const finalRoot = await tm.getRoot(root.id);

		// The key assertion: stats should be accurate
		expect(finalRoot?.stats.completed).toBe(taskCount);

		// Double-check by counting actual completed nodes
		const nodes = await tm.getNodes(root.id);
		const actualCompleted = nodes.filter((n) => n.isLeaf && n.status === 'completed').length;

		expect(actualCompleted).toBe(taskCount);
		expect(finalRoot?.stats.completed).toBe(actualCompleted);
	});

	it('should maintain consistency across multiple rapid executions', async () => {
		// Run multiple task batches in sequence
		for (let batch = 0; batch < 5; batch++) {
			const taskCount = 50;
			const root = await tm.create({
				name: `Batch ${batch}`,
				concurrency: 25,
				children: Array.from({ length: taskCount }, (_, i) => ({
					name: `Task ${i}`,
					data: { index: i }
				}))
			});

			const executor: TaskExecutor<{ index: number }> = async (ctx) => {
				await ctx.complete();
			};

			await tm.execute(root.id, executor);

			const finalRoot = await tm.getRoot(root.id);
			expect(finalRoot?.stats.completed).toBe(taskCount);

			// Verify each batch
			const result = await tm.verifyIntegrity(root.id);
			expect(result.valid).toBe(true);
		}
	});
});

describe('Progress Tracking Accuracy', () => {
	let tm: TaskManager<{ index: number }>;
	let storage: MemoryStorage;

	beforeEach(() => {
		storage = createMemoryStorage() as MemoryStorage;
		tm = createTaskManager<{ index: number }>({
			storage,
			skipMerkle: true,
			retry: { maxAttempts: 1, baseDelayMs: 10, maxDelayMs: 50 }
		});
	});

	afterEach(async () => {
		await tm.close();
	});

	it('should report accurate progress percentage', async () => {
		const taskCount = 100;
		const progressUpdates: number[] = [];

		const root = await tm.create({
			name: 'Progress Test',
			concurrency: 1, // Serial for predictable progress
			children: Array.from({ length: taskCount }, (_, i) => ({
				name: `Task ${i}`,
				data: { index: i }
			}))
		});

		// Track progress
		tm.on('complete', (_event, data) => {
			progressUpdates.push(data.root.progress);
		});

		const executor: TaskExecutor<{ index: number }> = async (ctx) => {
			await ctx.complete();
		};

		await tm.execute(root.id, executor);

		const finalRoot = await tm.getRoot(root.id);
		expect(finalRoot?.progress).toBe(100);

		// Progress should increase monotonically
		for (let i = 1; i < progressUpdates.length; i++) {
			expect(progressUpdates[i]).toBeGreaterThanOrEqual(progressUpdates[i - 1]);
		}

		// Final progress should be 100
		expect(progressUpdates[progressUpdates.length - 1]).toBe(100);
	});
});

// =============================================================================
// IndexedDB Storage Tests
// =============================================================================

// Polyfill IndexedDB for Node environment
import 'fake-indexeddb/auto';

describe('IndexedDB - Concurrent Stats Race Condition', () => {
	let tm: TaskManager<{ index: number }>;
	let storage: IndexedDBStorage;
	const testDbName = `TaskManager_ConcurrencyTest_${Date.now()}`;

	beforeEach(async () => {
		storage = new IndexedDBStorage(testDbName);
		tm = createTaskManager<{ index: number }>({
			storage,
			retry: { maxAttempts: 1, baseDelayMs: 10, maxDelayMs: 50 }
		});
	});

	afterEach(async () => {
		await tm.close();
		await storage.clear();
	});

	it('should maintain accurate stats with high concurrency (10 parallel tasks)', async () => {
		const taskCount = 10;
		const root = await tm.create({
			name: 'IndexedDB Concurrent Test',
			concurrency: taskCount,
			children: Array.from({ length: taskCount }, (_, i) => ({
				name: `Task ${i}`,
				data: { index: i }
			}))
		});

		const executor: TaskExecutor<{ index: number }> = async (ctx) => {
			await new Promise((r) => setTimeout(r, Math.random() * 10));
			await ctx.complete();
		};

		await tm.execute(root.id, executor);

		const finalRoot = await tm.getRoot(root.id);
		expect(finalRoot?.stats.completed).toBe(taskCount);
		expect(finalRoot?.stats.failed).toBe(0);

		const result = await tm.verifyIntegrity(root.id);
		expect(result.valid).toBe(true);
	});

	it('should maintain accurate stats with very high concurrency (100 parallel tasks)', async () => {
		const taskCount = 100;
		const root = await tm.create({
			name: 'IndexedDB High Concurrency Test',
			concurrency: 50,
			children: Array.from({ length: taskCount }, (_, i) => ({
				name: `Task ${i}`,
				data: { index: i }
			}))
		});

		const executor: TaskExecutor<{ index: number }> = async (ctx) => {
			await ctx.complete();
		};

		await tm.execute(root.id, executor);

		const finalRoot = await tm.getRoot(root.id);
		expect(finalRoot?.stats.completed).toBe(taskCount);

		const result = await tm.verifyIntegrity(root.id);
		expect(result.valid).toBe(true);
	});

	it('should handle mixed success/failure with high concurrency', async () => {
		const taskCount = 50;
		const failEvery = 5;

		const root = await tm.create({
			name: 'IndexedDB Mixed Concurrent Test',
			concurrency: 25,
			children: Array.from({ length: taskCount }, (_, i) => ({
				name: `Task ${i}`,
				data: { index: i }
			}))
		});

		const executor: TaskExecutor<{ index: number }> = async (ctx) => {
			if (ctx.data.index % failEvery === 0) {
				await ctx.fail('Intentional failure');
			} else {
				await ctx.complete();
			}
		};

		await tm.execute(root.id, executor);

		const finalRoot = await tm.getRoot(root.id);
		const expectedFailed = Math.floor(taskCount / failEvery);
		const expectedCompleted = taskCount - expectedFailed;

		expect(finalRoot?.stats.failed).toBe(expectedFailed);
		expect(finalRoot?.stats.completed).toBe(expectedCompleted);

		const result = await tm.verifyIntegrity(root.id);
		expect(result.valid).toBe(true);
	});
});

describe('IndexedDB - Large Batch Operations', () => {
	let tm: TaskManager<{ index: number }>;
	let storage: IndexedDBStorage;
	const testDbName = `TaskManager_LargeBatchTest_${Date.now()}`;

	beforeEach(async () => {
		storage = new IndexedDBStorage(testDbName);
		tm = createTaskManager<{ index: number }>({
			storage,
			skipMerkle: true,
			retry: { maxAttempts: 1, baseDelayMs: 10, maxDelayMs: 50 }
		});
	});

	afterEach(async () => {
		await tm.close();
		await storage.clear();
	});

	it('should handle 1,000 tasks correctly with IndexedDB', async () => {
		const taskCount = 1000;
		const root = await tm.create({
			name: 'IndexedDB 1K Tasks',
			concurrency: 10,
			children: Array.from({ length: taskCount }, (_, i) => ({
				name: `Task ${i}`,
				data: { index: i }
			}))
		});

		expect(root.stats.total).toBe(taskCount);

		const executor: TaskExecutor<{ index: number }> = async (ctx) => {
			await ctx.complete();
		};

		await tm.execute(root.id, executor);

		const finalRoot = await tm.getRoot(root.id);
		expect(finalRoot?.stats.completed).toBe(taskCount);
		expect(finalRoot?.status).toBe('completed');

		const result = await tm.verifyIntegrity(root.id);
		expect(result.valid).toBe(true);
	});
});

describe('IndexedDB - Atomic Operations Verification', () => {
	let tm: TaskManager<{ index: number }>;
	let storage: IndexedDBStorage;
	const testDbName = `TaskManager_AtomicTest_${Date.now()}`;

	beforeEach(async () => {
		storage = new IndexedDBStorage(testDbName);
		tm = createTaskManager<{ index: number }>({
			storage,
			skipMerkle: true,
			retry: { maxAttempts: 1, baseDelayMs: 10, maxDelayMs: 50 }
		});
	});

	afterEach(async () => {
		await tm.close();
		await storage.clear();
	});

	it('should atomically save root with nodes (small batch)', async () => {
		const taskCount = 100;
		const root = await tm.create({
			name: 'Atomic Small Batch',
			concurrency: 10,
			children: Array.from({ length: taskCount }, (_, i) => ({
				name: `Task ${i}`,
				data: { index: i }
			}))
		});

		// Verify all nodes were saved
		const nodes = await storage.getNodesByRoot(root.id);
		expect(nodes.length).toBe(taskCount);

		// Verify root was saved correctly
		const savedRoot = await storage.getRoot(root.id);
		expect(savedRoot).not.toBeNull();
		expect(savedRoot?.stats.total).toBe(taskCount);
		// _creating flag should be removed after successful save
		expect(savedRoot?.metadata?._creating).toBeUndefined();
	});

	it('should atomically save root with nodes (large batch > 1000)', async () => {
		const taskCount = 1500;
		const root = await tm.create({
			name: 'Atomic Large Batch',
			concurrency: 50,
			children: Array.from({ length: taskCount }, (_, i) => ({
				name: `Task ${i}`,
				data: { index: i }
			}))
		});

		// Verify all nodes were saved
		const nodes = await storage.getNodesByRoot(root.id);
		expect(nodes.length).toBe(taskCount);

		// Verify root was saved correctly
		const savedRoot = await storage.getRoot(root.id);
		expect(savedRoot).not.toBeNull();
		expect(savedRoot?.stats.total).toBe(taskCount);
		// _creating flag should be removed after successful save
		expect(savedRoot?.metadata?._creating).toBeUndefined();
	});

	it('should atomically delete root with nodes', async () => {
		const taskCount = 100;
		const root = await tm.create({
			name: 'Atomic Delete Test',
			children: Array.from({ length: taskCount }, (_, i) => ({
				name: `Task ${i}`,
				data: { index: i }
			}))
		});

		// Verify data exists
		expect(await storage.getRoot(root.id)).not.toBeNull();
		expect((await storage.getNodesByRoot(root.id)).length).toBe(taskCount);

		// Delete
		await tm.delete(root.id);

		// Verify everything is deleted
		expect(await storage.getRoot(root.id)).toBeNull();
		expect((await storage.getNodesByRoot(root.id)).length).toBe(0);
	});
});

describe('IndexedDB - Data Integrity Under Concurrent Access', () => {
	let tm: TaskManager<{ index: number }>;
	let storage: IndexedDBStorage;
	const testDbName = `TaskManager_IntegrityTest_${Date.now()}`;

	beforeEach(async () => {
		storage = new IndexedDBStorage(testDbName);
		tm = createTaskManager<{ index: number }>({
			storage,
			skipMerkle: true,
			retry: { maxAttempts: 1, baseDelayMs: 10, maxDelayMs: 50 }
		});
	});

	afterEach(async () => {
		await tm.close();
		await storage.clear();
	});

	it('should maintain data integrity with rapid task completions', async () => {
		const taskCount = 50;
		const root = await tm.create({
			name: 'Rapid Completions',
			concurrency: taskCount, // All at once
			children: Array.from({ length: taskCount }, (_, i) => ({
				name: `Task ${i}`,
				data: { index: i }
			}))
		});

		const executor: TaskExecutor<{ index: number }> = async (ctx) => {
			// No delay - maximize concurrent writes
			await ctx.complete();
		};

		await tm.execute(root.id, executor);

		// Verify final state
		const finalRoot = await tm.getRoot(root.id);
		expect(finalRoot?.stats.completed).toBe(taskCount);

		// Verify integrity
		const result = await tm.verifyIntegrity(root.id);
		expect(result.valid).toBe(true);

		// Double-check by counting nodes
		const nodes = await tm.getNodes(root.id);
		const completedNodes = nodes.filter((n) => n.isLeaf && n.status === 'completed');
		expect(completedNodes.length).toBe(taskCount);
	});

	it('should recover from interrupted operations', async () => {
		const taskCount = 20;
		const root = await tm.create({
			name: 'Recovery Test',
			concurrency: 1, // Serial execution for predictable pause point
			children: Array.from({ length: taskCount }, (_, i) => ({
				name: `Task ${i}`,
				data: { index: i }
			}))
		});

		let executedCount = 0;
		const executor: TaskExecutor<{ index: number }> = async (ctx) => {
			executedCount++;
			// Complete first 9 tasks, pause at 10th
			if (executedCount === 10) {
				// Pause to simulate interruption
				await ctx.pauseTask('Simulated interruption');
				return;
			}
			await ctx.complete();
		};

		// First execution - will pause at task 10
		await tm.execute(root.id, executor);

		const pausedRoot = await tm.getRoot(root.id);
		expect(pausedRoot?.status).toBe('paused');
		// 9 tasks completed before pause
		expect(pausedRoot?.stats.completed).toBe(9);

		// Resume execution - should complete remaining tasks including the paused one
		const resumeExecutor: TaskExecutor<{ index: number }> = async (ctx) => {
			await ctx.complete();
		};

		await tm.resume(root.id, resumeExecutor);

		// Verify all tasks completed
		const finalRoot = await tm.getRoot(root.id);
		expect(finalRoot?.stats.completed).toBe(taskCount);
		expect(finalRoot?.status).toBe('completed');

		// Verify integrity after recovery
		const result = await tm.verifyIntegrity(root.id);
		expect(result.valid).toBe(true);
	});
});
