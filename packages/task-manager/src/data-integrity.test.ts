/**
 * Data Integrity Tests
 *
 * Tests for verifying data reliability, crash recovery, and orphan cleanup scenarios.
 * These tests simulate various failure scenarios to ensure data integrity.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TaskManager, createTaskManager } from './task-manager';
import { createMemoryStorage, MemoryStorage } from './storage/memory';
import type { TaskExecutor, TaskRoot, TaskNode, StorageAdapter } from './types';

/**
 * Custom storage adapter that can simulate failures
 */
class FailableMemoryStorage extends MemoryStorage {
	private shouldFailOnSaveNodes = false;
	private shouldFailAfterNNodes = -1;
	private savedNodesCount = 0;

	failOnSaveNodes(afterN = -1): void {
		this.shouldFailOnSaveNodes = true;
		this.shouldFailAfterNNodes = afterN;
		this.savedNodesCount = 0;
	}

	resetFailures(): void {
		this.shouldFailOnSaveNodes = false;
		this.shouldFailAfterNNodes = -1;
		this.savedNodesCount = 0;
	}

	async saveNodes(nodes: TaskNode[]): Promise<void> {
		if (this.shouldFailOnSaveNodes) {
			if (this.shouldFailAfterNNodes === -1) {
				throw new Error('Simulated storage failure');
			}
			if (this.savedNodesCount + nodes.length > this.shouldFailAfterNNodes) {
				// Save partial nodes before failing
				const toSave = nodes.slice(0, this.shouldFailAfterNNodes - this.savedNodesCount);
				await super.saveNodes(toSave);
				this.savedNodesCount += toSave.length;
				throw new Error('Simulated storage failure after partial save');
			}
		}
		await super.saveNodes(nodes);
		this.savedNodesCount += nodes.length;
	}
}

describe('Data Integrity', () => {
	let tm: TaskManager<{ value: number }>;
	let storage: MemoryStorage;

	beforeEach(() => {
		storage = createMemoryStorage() as MemoryStorage;
		tm = createTaskManager<{ value: number }>({
			storage,
			retry: {
				maxAttempts: 2,
				baseDelayMs: 10,
				maxDelayMs: 50
			}
		});
	});

	afterEach(async () => {
		await tm.close();
	});

	describe('verifyIntegrity', () => {
		it('should return valid for a correctly created task', async () => {
			const root = await tm.create({
				name: 'Valid Task',
				children: [
					{ name: 'Task 1', data: { value: 1 } },
					{ name: 'Task 2', data: { value: 2 } },
					{ name: 'Task 3', data: { value: 3 } }
				]
			});

			const result = await tm.verifyIntegrity(root.id);

			expect(result.valid).toBe(true);
			expect(result.issues).toHaveLength(0);
			expect(result.stats).toEqual({
				expectedCompleted: 0,
				actualCompleted: 0,
				expectedFailed: 0,
				actualFailed: 0,
				orphanedNodes: 0
			});
		});

		it('should detect stats mismatch after execution', async () => {
			const root = await tm.create({
				name: 'Task',
				children: [
					{ name: 'Task 1', data: { value: 1 } },
					{ name: 'Task 2', data: { value: 2 } }
				]
			});

			// Execute tasks
			await tm.execute(root.id, async (ctx) => ctx.complete());

			// Manually corrupt stats (simulate crash/bug scenario)
			const storedRoot = await storage.getRoot(root.id);
			if (storedRoot) {
				storedRoot.stats.completed = 999; // Wrong value
				await storage.saveRoot(storedRoot);
			}

			const result = await tm.verifyIntegrity(root.id);

			expect(result.valid).toBe(false);
			expect(result.issues.some((i) => i.includes('Stats mismatch'))).toBe(true);
			expect(result.stats?.expectedCompleted).toBe(999);
			expect(result.stats?.actualCompleted).toBe(2);
		});

		it('should detect running nodes with non-running root (crash scenario)', async () => {
			const root = await tm.create({
				name: 'Task',
				children: [
					{ name: 'Task 1', data: { value: 1 } },
					{ name: 'Task 2', data: { value: 2 } }
				]
			});

			// Simulate crash: set node to running but root to pending
			const nodes = await storage.getNodesByRoot(root.id);
			if (nodes.length > 0) {
				nodes[0].status = 'running';
				await storage.saveNode(nodes[0]);
			}

			const result = await tm.verifyIntegrity(root.id);

			expect(result.valid).toBe(false);
			expect(result.issues.some((i) => i.includes("'running' status"))).toBe(true);
		});

		it('should detect incomplete task creation (_creating flag)', async () => {
			const root = await tm.create({
				name: 'Task',
				children: [{ name: 'Task 1', data: { value: 1 } }]
			});

			// Simulate incomplete creation
			const storedRoot = await storage.getRoot(root.id);
			if (storedRoot) {
				storedRoot.metadata = { ...storedRoot.metadata, _creating: true };
				await storage.saveRoot(storedRoot);
			}

			const result = await tm.verifyIntegrity(root.id);

			expect(result.valid).toBe(false);
			expect(result.issues.some((i) => i.includes('interrupted'))).toBe(true);
		});

		it('should return invalid for non-existent task', async () => {
			const result = await tm.verifyIntegrity('non-existent-id');

			expect(result.valid).toBe(false);
			expect(result.issues).toContain('Root not found');
		});
	});

	describe('repairStats', () => {
		it('should repair mismatched stats', async () => {
			const root = await tm.create({
				name: 'Task',
				children: [
					{ name: 'Task 1', data: { value: 1 } },
					{ name: 'Task 2', data: { value: 2 } },
					{ name: 'Task 3', data: { value: 3 } }
				]
			});

			// Execute all tasks
			await tm.execute(root.id, async (ctx) => ctx.complete());

			// Corrupt stats
			const storedRoot = await storage.getRoot(root.id);
			if (storedRoot) {
				storedRoot.stats.completed = 1; // Should be 3
				storedRoot.stats.failed = 5; // Should be 0
				storedRoot.progress = 10; // Should be 100
				await storage.saveRoot(storedRoot);
			}

			// Repair
			const repaired = await tm.repairStats(root.id);
			expect(repaired).toBe(true);

			// Verify repair
			const result = await tm.verifyIntegrity(root.id);
			expect(result.valid).toBe(true);

			const repairedRoot = await tm.getRoot(root.id);
			expect(repairedRoot?.stats.completed).toBe(3);
			expect(repairedRoot?.stats.failed).toBe(0);
			expect(repairedRoot?.progress).toBe(100);
		});

		it('should return false when no repair needed', async () => {
			const root = await tm.create({
				name: 'Task',
				children: [{ name: 'Task 1', data: { value: 1 } }]
			});

			await tm.execute(root.id, async (ctx) => ctx.complete());

			const repaired = await tm.repairStats(root.id);
			expect(repaired).toBe(false);
		});

		it('should remove _creating flag during repair', async () => {
			const root = await tm.create({
				name: 'Task',
				children: [{ name: 'Task 1', data: { value: 1 } }]
			});

			// Add _creating flag
			const storedRoot = await storage.getRoot(root.id);
			if (storedRoot) {
				storedRoot.metadata = { ...storedRoot.metadata, _creating: true };
				storedRoot.stats.completed = 999; // Force repair
				await storage.saveRoot(storedRoot);
			}

			await tm.repairStats(root.id);

			const repairedRoot = await tm.getRoot(root.id);
			expect(repairedRoot?.metadata?._creating).toBeUndefined();
		});
	});

	describe('cleanupOrphanedData', () => {
		it('should cleanup incomplete roots with _creating flag', async () => {
			// Create a normal task
			const goodRoot = await tm.create({
				name: 'Good Task',
				children: [{ name: 'Task 1', data: { value: 1 } }]
			});

			// Create an incomplete task
			const incompleteRoot = await tm.create({
				name: 'Incomplete Task',
				children: [{ name: 'Task 2', data: { value: 2 } }]
			});

			// Mark as incomplete
			const storedRoot = await storage.getRoot(incompleteRoot.id);
			if (storedRoot) {
				storedRoot.metadata = { ...storedRoot.metadata, _creating: true };
				await storage.saveRoot(storedRoot);
			}

			// Run cleanup
			const cleaned = await tm.cleanupOrphanedData();

			expect(cleaned).toBeGreaterThanOrEqual(1);
			expect(await tm.getRoot(goodRoot.id)).not.toBeNull();
			expect(await tm.getRoot(incompleteRoot.id)).toBeNull();
		});

		it('should cleanup orphaned nodes', async () => {
			// Create a task
			const root = await tm.create({
				name: 'Task',
				children: [{ name: 'Task 1', data: { value: 1 } }]
			});

			// Delete root directly (simulating crash during delete)
			await storage.deleteRoot(root.id);

			// Nodes should still exist (orphaned)
			const orphanedNodes = await storage.getNodesByRoot(root.id);
			expect(orphanedNodes.length).toBeGreaterThan(0);

			// Run cleanup
			const cleaned = await tm.cleanupOrphanedData();

			expect(cleaned).toBeGreaterThanOrEqual(1);

			// Orphaned nodes should be gone
			const remainingNodes = await storage.getNodesByRoot(root.id);
			expect(remainingNodes).toHaveLength(0);
		});
	});

	describe('Running Status Recovery', () => {
		it('should re-execute tasks stuck in running status after crash', async () => {
			const executedValues: number[] = [];
			const executor: TaskExecutor<{ value: number }> = async (ctx) => {
				executedValues.push(ctx.data.value);
				await ctx.complete();
			};

			const root = await tm.create({
				name: 'Task',
				children: [
					{ name: 'Task 1', data: { value: 1 } },
					{ name: 'Task 2', data: { value: 2 } },
					{ name: 'Task 3', data: { value: 3 } }
				]
			});

			// Simulate crash: set one task to 'running' (as if it was mid-execution)
			const nodes = await storage.getNodesByRoot(root.id);
			const leaves = nodes.filter((n) => n.isLeaf);
			if (leaves.length >= 2) {
				// Mark task 1 as completed
				leaves[0].status = 'completed';
				await storage.saveNode(leaves[0]);

				// Mark task 2 as running (crashed)
				leaves[1].status = 'running';
				await storage.saveNode(leaves[1]);

				// Update root stats
				const storedRoot = await storage.getRoot(root.id);
				if (storedRoot) {
					storedRoot.stats.completed = 1;
					await storage.saveRoot(storedRoot);
				}
			}

			// Execute - should pick up running task 2 and pending task 3
			await tm.execute(root.id, executor);

			// Task 1 was already completed, so shouldn't be re-executed
			// Task 2 was 'running' (crashed), should be re-executed
			// Task 3 was 'pending', should be executed
			expect(executedValues).toContain(2);
			expect(executedValues).toContain(3);
			expect(executedValues).not.toContain(1);

			const finalRoot = await tm.getRoot(root.id);
			expect(finalRoot?.stats.completed).toBe(3);
		});

		it('should not re-execute cancelled or failed tasks', async () => {
			const executedValues: number[] = [];
			const executor: TaskExecutor<{ value: number }> = async (ctx) => {
				executedValues.push(ctx.data.value);
				await ctx.complete();
			};

			const root = await tm.create({
				name: 'Task',
				children: [
					{ name: 'Task 1', data: { value: 1 } },
					{ name: 'Task 2', data: { value: 2 } },
					{ name: 'Task 3', data: { value: 3 } }
				]
			});

			// Set various statuses
			const nodes = await storage.getNodesByRoot(root.id);
			const leaves = nodes.filter((n) => n.isLeaf);
			if (leaves.length >= 3) {
				leaves[0].status = 'cancelled';
				leaves[1].status = 'failed';
				// leaves[2] stays pending
				await storage.saveNodes(leaves);
			}

			await tm.execute(root.id, executor);

			// Only pending task should be executed
			expect(executedValues).toEqual([3]);
		});
	});

	describe('Atomic Operations', () => {
		it('should use atomic save when available', async () => {
			// Test that saveRootWithNodes is called for create
			let atomicSaveWasCalled = false;
			const atomicStorage = createMemoryStorage();
			(atomicStorage as any).saveRootWithNodes = async (
				root: TaskRoot,
				nodes: TaskNode[]
			) => {
				atomicSaveWasCalled = true;
				await atomicStorage.saveRoot(root);
				await atomicStorage.saveNodes(nodes);
			};

			const atomicTm = createTaskManager<{ value: number }>({
				storage: atomicStorage
			});

			await atomicTm.create({
				name: 'Task',
				children: [{ name: 'Task 1', data: { value: 1 } }]
			});

			expect(atomicSaveWasCalled).toBe(true);
			await atomicTm.close();
		});

		it('should use atomic delete when available', async () => {
			let atomicDeleteWasCalled = false;
			const atomicStorage = createMemoryStorage();
			(atomicStorage as any).deleteRootWithNodes = async (rootId: string) => {
				atomicDeleteWasCalled = true;
				await atomicStorage.deleteNodesByRoot(rootId);
				await atomicStorage.deleteRoot(rootId);
			};

			const atomicTm = createTaskManager<{ value: number }>({
				storage: atomicStorage
			});

			const root = await atomicTm.create({
				name: 'Task',
				children: [{ name: 'Task 1', data: { value: 1 } }]
			});

			await atomicTm.delete(root.id);

			expect(atomicDeleteWasCalled).toBe(true);
			await atomicTm.close();
		});
	});

	describe('Stats Consistency During Execution', () => {
		it('should maintain accurate stats during partial execution', async () => {
			const executor: TaskExecutor<{ value: number }> = async (ctx) => {
				if (ctx.data.value === 2) {
					// Always fail task 2 - use ctx.fail to ensure it's marked as failed
					await ctx.fail('Simulated failure for task 2');
					return;
				}
				await ctx.complete();
			};

			const root = await tm.create({
				name: 'Task',
				children: [
					{ name: 'Task 1', data: { value: 1 } },
					{ name: 'Task 2', data: { value: 2 } },
					{ name: 'Task 3', data: { value: 3 } }
				]
			});

			await tm.execute(root.id, executor);

			const finalRoot = await tm.getRoot(root.id);
			expect(finalRoot?.stats.completed).toBe(2); // Task 1 and 3
			expect(finalRoot?.stats.failed).toBe(1); // Task 2
			expect(finalRoot?.stats.total).toBe(3);

			// Verify integrity
			const result = await tm.verifyIntegrity(root.id);
			expect(result.valid).toBe(true);
		});

		it('should maintain stats after pause and resume', async () => {
			let pausedAt = 0;
			const executor: TaskExecutor<{ value: number }> = async (ctx) => {
				if (ctx.data.value === 2) {
					await ctx.pauseTask('test');
					return;
				}
				await ctx.complete();
			};

			const root = await tm.create({
				name: 'Task',
				children: [
					{ name: 'Task 1', data: { value: 1 } },
					{ name: 'Task 2', data: { value: 2 } },
					{ name: 'Task 3', data: { value: 3 } }
				]
			});

			// First execution - will pause at task 2
			await tm.execute(root.id, executor);

			let pausedRoot = await tm.getRoot(root.id);
			expect(pausedRoot?.status).toBe('paused');
			expect(pausedRoot?.stats.completed).toBe(1); // Task 1 completed

			// Resume and complete
			const resumeExecutor: TaskExecutor<{ value: number }> = async (ctx) => {
				await ctx.complete();
			};

			const finalRoot = await tm.resume(root.id, resumeExecutor);
			expect(finalRoot.stats.completed).toBe(3);

			// Verify integrity after resume
			const result = await tm.verifyIntegrity(root.id);
			expect(result.valid).toBe(true);
		});
	});

	describe('Parallel Execution Integrity', () => {
		it('should maintain stats during parallel execution', async () => {
			const root = await tm.create({
				name: 'Parallel Task',
				concurrency: 3,
				children: [
					{ name: 'Task 1', data: { value: 1 } },
					{ name: 'Task 2', data: { value: 2 } },
					{ name: 'Task 3', data: { value: 3 } },
					{ name: 'Task 4', data: { value: 4 } },
					{ name: 'Task 5', data: { value: 5 } }
				]
			});

			let failCount = 0;
			const executor: TaskExecutor<{ value: number }> = async (ctx) => {
				// Simulate varying execution times
				await new Promise((r) => setTimeout(r, Math.random() * 20));
				if (ctx.data.value === 3) {
					failCount++;
					throw new Error('Simulated failure');
				}
				await ctx.complete();
			};

			await tm.execute(root.id, executor);

			const finalRoot = await tm.getRoot(root.id);
			expect(finalRoot?.stats.total).toBe(5);
			expect(finalRoot?.stats.completed + finalRoot!.stats.failed).toBe(5);

			// Verify integrity
			const result = await tm.verifyIntegrity(root.id);
			expect(result.valid).toBe(true);
		});
	});
});

describe('MemoryStorage Integrity', () => {
	let storage: MemoryStorage;

	beforeEach(() => {
		storage = createMemoryStorage() as MemoryStorage;
	});

	it('should support getAllNodes for orphan detection', async () => {
		const root: TaskRoot = {
			id: 'root-1',
			name: 'Test',
			type: 'test',
			status: 'pending',
			progress: 0,
			concurrency: 1,
			stats: { total: 2, completed: 0, failed: 0 },
			merkleRoot: null,
			createdAt: Date.now(),
			updatedAt: Date.now()
		};

		const node1: TaskNode = {
			id: 'node-1',
			rootId: 'root-1',
			parentId: null,
			name: 'Node 1',
			status: 'pending',
			progress: 0,
			mode: 'progressive',
			depth: 0,
			index: 0,
			isLeaf: true,
			childCount: 0,
			hash: '',
			attempts: 0,
			maxAttempts: 3,
			createdAt: Date.now(),
			updatedAt: Date.now()
		};

		const orphanNode: TaskNode = {
			...node1,
			id: 'orphan-1',
			rootId: 'non-existent-root'
		};

		await storage.saveRoot(root);
		await storage.saveNode(node1);
		await storage.saveNode(orphanNode);

		if (storage.getAllNodes) {
			const allNodes = await storage.getAllNodes();
			expect(allNodes).toHaveLength(2);

			// Find orphaned nodes
			const rootIds = new Set([(await storage.getAllRoots()).map((r) => r.id)].flat());
			const orphans = allNodes.filter((n) => !rootIds.has(n.rootId));
			expect(orphans).toHaveLength(1);
			expect(orphans[0].id).toBe('orphan-1');
		}
	});
});
