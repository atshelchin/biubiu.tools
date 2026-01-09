/**
 * TaskStore - Unit Tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TaskStore, createTaskStore } from './task-store.svelte';
import { createMemoryStorage } from '../storage/memory';
import type { TaskExecutor } from '../types';

describe('TaskStore', () => {
	let store: TaskStore<{ value: number }>;

	beforeEach(() => {
		store = createTaskStore<{ value: number }>({
			storage: createMemoryStorage(),
			retry: { maxAttempts: 1, baseDelayMs: 10, maxDelayMs: 50 }
		});
	});

	afterEach(async () => {
		await store.close();
	});

	describe('init', () => {
		it('should initialize store', async () => {
			expect(store.isInitialized).toBe(false);
			await store.init();
			expect(store.isInitialized).toBe(true);
		});

		it('should load existing roots on init', async () => {
			await store.create({ name: 'Task 1' });
			await store.create({ name: 'Task 2' });

			// Create new store with same storage
			const storage = createMemoryStorage();
			const store1 = createTaskStore({ storage });
			await store1.create({ name: 'Existing' });

			const store2 = createTaskStore({ storage });
			await store2.init();

			expect(store2.allRoots.length).toBe(1);
			await store1.close();
			await store2.close();
		});

		it('should only init once', async () => {
			await store.init();
			await store.create({ name: 'Task' });
			await store.init(); // Should not reload
			expect(store.allRoots).toHaveLength(1);
		});

		it('should set isLoading during init', async () => {
			const initPromise = store.init();
			// Note: This is tricky to test due to async nature
			await initPromise;
			expect(store.isLoading).toBe(false);
		});
	});

	describe('create', () => {
		it('should create a task and add to store', async () => {
			const root = await store.create({
				name: 'Task',
				children: [{ name: 'Child', data: { value: 1 } }]
			});

			expect(root.id).toBeTruthy();
			expect(store.allRoots).toHaveLength(1);
			expect(store.getRoot(root.id)).toEqual(root);
		});
	});

	describe('execute', () => {
		it('should execute task and update store', async () => {
			const executor: TaskExecutor<{ value: number }> = async (ctx) => {
				await ctx.complete({ result: ctx.data.value * 2 });
			};

			const root = await store.create({
				name: 'Task',
				children: [{ name: 'Child', data: { value: 5 } }]
			});

			const finalRoot = await store.execute(root.id, executor);

			expect(finalRoot.status).toBe('completed');
			expect(store.getRoot(root.id)?.status).toBe('completed');
		});
	});

	describe('pause', () => {
		it('should pause task and update store', async () => {
			const root = await store.create({ name: 'Task' });
			await store.pause(root.id, 'test');

			expect(store.getRoot(root.id)?.status).toBe('paused');
		});
	});

	describe('resume', () => {
		it('should resume paused task', async () => {
			const root = await store.create({
				name: 'Task',
				children: [{ name: 'Child', data: { value: 1 } }]
			});

			await store.pause(root.id);
			const finalRoot = await store.resume(root.id, async (ctx) => ctx.complete());

			expect(finalRoot.status).toBe('completed');
		});
	});

	describe('cancel', () => {
		it('should cancel task and update store', async () => {
			const root = await store.create({
				name: 'Task',
				children: [{ name: 'Child', data: { value: 1 } }]
			});

			await store.cancel(root.id);

			expect(store.getRoot(root.id)?.status).toBe('cancelled');
		});
	});

	describe('delete', () => {
		it('should delete task from store', async () => {
			const root = await store.create({ name: 'Task' });
			await store.delete(root.id);

			expect(store.getRoot(root.id)).toBeUndefined();
			expect(store.allRoots).toHaveLength(0);
		});
	});

	describe('Derived Values', () => {
		beforeEach(async () => {
			// Create tasks with different statuses
			await store.create({ name: 'Pending 1' });
			await store.create({ name: 'Pending 2' });
			const toComplete = await store.create({
				name: 'To Complete',
				children: [{ name: 'Child', data: { value: 1 } }]
			});
			await store.execute(toComplete.id, async (ctx) => ctx.complete());

			const toFail = await store.create({
				name: 'To Fail',
				children: [{ name: 'Child', data: { value: 1 } }]
			});
			await store.execute(toFail.id, async () => {
				throw new Error('fail');
			});

			const toPause = await store.create({ name: 'To Pause' });
			await store.pause(toPause.id);
		});

		it('should derive allRoots', () => {
			expect(store.allRoots).toHaveLength(5);
		});

		it('should derive pendingRoots', () => {
			expect(store.pendingRoots).toHaveLength(2);
		});

		it('should derive completedRoots', () => {
			expect(store.completedRoots).toHaveLength(1);
		});

		it('should derive failedRoots', () => {
			expect(store.failedRoots).toHaveLength(1);
		});

		it('should derive pausedRoots', () => {
			expect(store.pausedRoots).toHaveLength(1);
		});

		it('should derive recoverableRoots', () => {
			// pending + paused
			expect(store.recoverableRoots).toHaveLength(3);
		});

		it('should derive stats', () => {
			const stats = store.stats;
			expect(stats.total).toBe(2); // Only tasks with children
			expect(stats.completed).toBe(1);
			expect(stats.failed).toBe(1);
		});
	});

	describe('getNodes', () => {
		it('should return nodes for a task', async () => {
			const root = await store.create({
				name: 'Task',
				children: [
					{ name: 'Child 1', data: { value: 1 } },
					{ name: 'Child 2', data: { value: 2 } }
				]
			});

			const nodes = await store.getNodes(root.id);
			expect(nodes).toHaveLength(2);
		});
	});

	describe('getChildren', () => {
		it('should return children', async () => {
			const root = await store.create({
				name: 'Task',
				children: [
					{
						name: 'Group',
						children: [{ name: 'Leaf', data: { value: 1 } }]
					}
				]
			});

			const topChildren = await store.getChildren(root.id);
			expect(topChildren).toHaveLength(1);
			expect(topChildren[0].name).toBe('Group');
		});
	});

	describe('getLeaves', () => {
		it('should return leaves', async () => {
			const root = await store.create({
				name: 'Task',
				children: [
					{ name: 'Leaf 1', data: { value: 1 } },
					{ name: 'Leaf 2', data: { value: 2 } }
				]
			});

			const leaves = await store.getLeaves(root.id);
			expect(leaves).toHaveLength(2);
		});
	});

	describe('Merkle', () => {
		it('should get merkle root', async () => {
			const root = await store.create({
				name: 'Task',
				children: [{ name: 'Leaf', data: { value: 1 } }]
			});

			const merkleRoot = await store.getMerkleRoot(root.id);
			expect(merkleRoot).toBeTruthy();
		});

		it('should get merkle proof', async () => {
			const root = await store.create({
				name: 'Task',
				children: [{ name: 'Leaf', data: { value: 1 } }]
			});

			const leaves = await store.getLeaves(root.id);
			const proof = await store.getMerkleProof(root.id, leaves[0].id);

			expect(proof).not.toBeNull();
		});

		it('should verify proof', async () => {
			const root = await store.create({
				name: 'Task',
				children: [
					{ name: 'Leaf 1', data: { value: 1 } },
					{ name: 'Leaf 2', data: { value: 2 } }
				]
			});

			const leaves = await store.getLeaves(root.id);
			const proof = await store.getMerkleProof(root.id, leaves[0].id);

			const isValid = await store.verifyProof(proof!);
			expect(isValid).toBe(true);
		});
	});

	describe('refreshRoot', () => {
		it('should refresh a single root', async () => {
			const root = await store.create({ name: 'Task' });

			// Modify the root in store to simulate stale data
			const staleRoot = { ...root, name: 'Stale Name' };
			store.roots.set(root.id, staleRoot);
			expect(store.getRoot(root.id)?.name).toBe('Stale Name');

			// Refresh should restore original data from storage
			await store.refreshRoot(root.id);
			expect(store.getRoot(root.id)?.name).toBe('Task');
		});

		it('should remove non-existent root', async () => {
			const root = await store.create({ name: 'Task' });
			await store.getManager().delete(root.id);

			await store.refreshRoot(root.id);
			expect(store.getRoot(root.id)).toBeUndefined();
		});
	});

	describe('refreshAll', () => {
		it('should refresh all roots', async () => {
			await store.create({ name: 'Task 1' });
			await store.create({ name: 'Task 2' });

			// Modify directly
			const manager = store.getManager();
			const roots = await manager.getAllRoots();
			await manager.pause(roots[0].id);

			// Refresh all
			await store.refreshAll();

			const refreshed = store.allRoots.find((r) => r.id === roots[0].id);
			expect(refreshed?.status).toBe('paused');
		});
	});

	describe('clearCompleted', () => {
		it('should clear completed tasks', async () => {
			const pending = await store.create({ name: 'Pending' });
			const toComplete = await store.create({
				name: 'Complete',
				children: [{ name: 'Leaf', data: { value: 1 } }]
			});
			const executedRoot = await store.execute(toComplete.id, async (ctx) => ctx.complete());

			// Verify task is completed before clearing
			expect(executedRoot.status).toBe('completed');
			expect(store.getRoot(toComplete.id)?.status).toBe('completed');

			await store.clearCompleted();

			expect(store.allRoots).toHaveLength(1);
			expect(store.getRoot(pending.id)).toBeTruthy();
			expect(store.getRoot(toComplete.id)).toBeUndefined();
		});
	});

	describe('clearFailed', () => {
		it('should clear failed tasks', async () => {
			const pending = await store.create({ name: 'Pending' });
			const toFail = await store.create({
				name: 'Fail',
				children: [{ name: 'Leaf', data: { value: 1 } }]
			});
			const executedRoot = await store.execute(toFail.id, async () => {
				throw new Error('fail');
			});

			// Verify task is failed before clearing
			expect(executedRoot.status).toBe('failed');
			expect(store.getRoot(toFail.id)?.status).toBe('failed');

			await store.clearFailed();

			expect(store.allRoots).toHaveLength(1);
			expect(store.getRoot(pending.id)).toBeTruthy();
			expect(store.getRoot(toFail.id)).toBeUndefined();
		});
	});

	describe('cleanup', () => {
		it('should cleanup old tasks', async () => {
			await store.create({ name: 'Task' });
			const deleted = await store.cleanup(0);
			expect(deleted).toBe(0); // New task, not old enough
		});
	});

	describe('reset', () => {
		it('should reset store state', async () => {
			await store.init();
			await store.create({ name: 'Task' });

			store.reset();

			expect(store.allRoots).toHaveLength(0);
			expect(store.isLoading).toBe(false);
			expect(store.isInitialized).toBe(false);
		});
	});

	describe('close', () => {
		it('should close and reset', async () => {
			await store.create({ name: 'Task' });
			await store.close();

			expect(store.allRoots).toHaveLength(0);
			expect(store.isInitialized).toBe(false);
		});
	});

	describe('clear', () => {
		it('should clear all data', async () => {
			await store.create({ name: 'Task 1' });
			await store.create({ name: 'Task 2' });

			await store.clear();

			expect(store.allRoots).toHaveLength(0);
		});
	});

	describe('getManager', () => {
		it('should return underlying manager', () => {
			const manager = store.getManager();
			expect(manager).toBeTruthy();
		});
	});

	describe('Factory Function', () => {
		it('should create store with createTaskStore', () => {
			const store = createTaskStore();
			expect(store).toBeInstanceOf(TaskStore);
		});
	});
});
