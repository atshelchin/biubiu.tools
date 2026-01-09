/**
 * TaskManager - Unit Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TaskManager, createTaskManager } from './task-manager';
import { createMemoryStorage } from './storage/memory';
import type { TaskExecutor, ExecutorRegistry } from './types';

describe('TaskManager', () => {
	let tm: TaskManager<{ value: number }>;

	beforeEach(() => {
		tm = createTaskManager<{ value: number }>({
			storage: createMemoryStorage(),
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

	describe('create', () => {
		it('should create a task with no children', async () => {
			const root = await tm.create({
				name: 'Simple Task',
				type: 'test'
			});

			expect(root.id).toBeTruthy();
			expect(root.name).toBe('Simple Task');
			expect(root.type).toBe('test');
			expect(root.status).toBe('pending');
			expect(root.progress).toBe(0);
			expect(root.stats.total).toBe(0);
			expect(root.merkleRoot).toBeNull();
		});

		it('should create a task with flat children', async () => {
			const root = await tm.create({
				name: 'Batch Task',
				children: [
					{ name: 'Task 1', data: { value: 1 } },
					{ name: 'Task 2', data: { value: 2 } },
					{ name: 'Task 3', data: { value: 3 } }
				]
			});

			expect(root.stats.total).toBe(3);
			expect(root.merkleRoot).toBeTruthy();
			const leaves = await tm.getLeaves(root.id);
			expect(leaves).toHaveLength(3);
		});

		it('should create a task with nested children', async () => {
			const root = await tm.create({
				name: 'Nested Task',
				children: [
					{
						name: 'Group 1',
						children: [
							{ name: 'Task 1.1', data: { value: 11 } },
							{ name: 'Task 1.2', data: { value: 12 } }
						]
					},
					{
						name: 'Group 2',
						children: [{ name: 'Task 2.1', data: { value: 21 } }]
					}
				]
			});

			expect(root.stats.total).toBe(3);
			const leaves = await tm.getLeaves(root.id);
			expect(leaves).toHaveLength(3);
			expect(leaves.every((l) => l.isLeaf)).toBe(true);
		});

		it('should set correct depth and index for nodes', async () => {
			const root = await tm.create({
				name: 'Nested Task',
				children: [
					{
						name: 'Group 1',
						children: [
							{ name: 'Task 1.1', data: { value: 11 } },
							{ name: 'Task 1.2', data: { value: 12 } }
						]
					}
				]
			});

			const nodes = await tm.getNodes(root.id);
			const group = nodes.find((n) => n.name === 'Group 1');
			const task11 = nodes.find((n) => n.name === 'Task 1.1');
			const task12 = nodes.find((n) => n.name === 'Task 1.2');

			expect(group?.depth).toBe(0);
			expect(group?.index).toBe(0);
			expect(task11?.depth).toBe(1);
			expect(task11?.index).toBe(0);
			expect(task12?.depth).toBe(1);
			expect(task12?.index).toBe(1);
		});

		it('should compute merkle root from leaves', async () => {
			const root = await tm.create({
				name: 'Task',
				children: [
					{ name: 'Task 1', data: { value: 1 } },
					{ name: 'Task 2', data: { value: 2 } }
				]
			});

			expect(root.merkleRoot).toBeTruthy();
			expect(root.merkleRoot?.length).toBe(64);
		});
	});

	describe('execute', () => {
		it('should execute all leaves with single executor', async () => {
			const results: number[] = [];
			const executor: TaskExecutor<{ value: number }> = async (ctx) => {
				results.push(ctx.data.value);
				await ctx.complete({ result: ctx.data.value * 2 });
			};

			const root = await tm.create({
				name: 'Task',
				children: [
					{ name: 'Task 1', data: { value: 1 } },
					{ name: 'Task 2', data: { value: 2 } },
					{ name: 'Task 3', data: { value: 3 } }
				]
			});

			const finalRoot = await tm.execute(root.id, executor);

			expect(results).toEqual([1, 2, 3]);
			expect(finalRoot.status).toBe('completed');
			expect(finalRoot.progress).toBe(100);
			expect(finalRoot.stats.completed).toBe(3);
		});

		it('should execute with executor registry', async () => {
			const registry: ExecutorRegistry<{ value: number }> = {
				double: async (ctx) => {
					await ctx.complete({ result: ctx.data.value * 2 });
				},
				triple: async (ctx) => {
					await ctx.complete({ result: ctx.data.value * 3 });
				}
			};

			const root = await tm.create({
				name: 'Task',
				children: [
					{ name: 'Task 1', data: { value: 1 }, executor: 'double' },
					{ name: 'Task 2', data: { value: 2 }, executor: 'triple' }
				]
			});

			await tm.execute(root.id, registry);

			const leaves = await tm.getLeaves(root.id);
			expect(leaves[0].result).toEqual({ result: 2 });
			expect(leaves[1].result).toEqual({ result: 6 });
		});

		it('should update progress during execution', async () => {
			const progressUpdates: number[] = [];
			tm.on('progress', (_, data) => {
				if (data.node) {
					progressUpdates.push(data.node.progress);
				}
			});

			const executor: TaskExecutor<{ value: number }> = async (ctx) => {
				await ctx.progress(50);
				await ctx.progress(100);
				await ctx.complete();
			};

			const root = await tm.create({
				name: 'Task',
				children: [{ name: 'Task 1', data: { value: 1 } }]
			});

			await tm.execute(root.id, executor);

			expect(progressUpdates).toContain(50);
			expect(progressUpdates).toContain(100);
		});

		it('should handle executor errors with retry', async () => {
			let attempts = 0;
			const executor: TaskExecutor<{ value: number }> = async (ctx) => {
				attempts++;
				if (attempts < 2) {
					throw new Error('Temporary error');
				}
				await ctx.complete();
			};

			const root = await tm.create({
				name: 'Task',
				children: [{ name: 'Task 1', data: { value: 1 } }]
			});

			const finalRoot = await tm.execute(root.id, executor);

			expect(attempts).toBe(2);
			expect(finalRoot.status).toBe('completed');
		});

		it('should fail after max retries', async () => {
			const executor: TaskExecutor<{ value: number }> = async () => {
				throw new Error('Permanent error');
			};

			const root = await tm.create({
				name: 'Task',
				children: [{ name: 'Task 1', data: { value: 1 } }]
			});

			const finalRoot = await tm.execute(root.id, executor);

			expect(finalRoot.status).toBe('failed');
			expect(finalRoot.stats.failed).toBe(1);
			const leaves = await tm.getLeaves(root.id);
			expect(leaves[0].error).toBe('Permanent error');
		});

		it('should skip already completed leaves', async () => {
			let executionCount = 0;
			const executor: TaskExecutor<{ value: number }> = async (ctx) => {
				executionCount++;
				await ctx.complete();
			};

			const root = await tm.create({
				name: 'Task',
				children: [
					{ name: 'Task 1', data: { value: 1 } },
					{ name: 'Task 2', data: { value: 2 } }
				]
			});

			// Execute first time (all leaves)
			await tm.execute(root.id, executor);
			expect(executionCount).toBe(2);

			// Execute second time (should skip completed)
			await tm.execute(root.id, executor);
			expect(executionCount).toBe(2); // No additional executions
		});

		it('should emit events during execution', async () => {
			const events: string[] = [];
			tm.on('start', () => events.push('start'));
			tm.on('complete', () => events.push('complete'));

			const root = await tm.create({
				name: 'Task',
				children: [{ name: 'Task 1', data: { value: 1 } }]
			});

			await tm.execute(root.id, async (ctx) => ctx.complete());

			expect(events).toContain('start');
			expect(events).toContain('complete');
		});

		it('should throw for non-existent task', async () => {
			await expect(tm.execute('non-existent', async () => {})).rejects.toThrow();
		});

		it('should throw for non-existent executor', async () => {
			const root = await tm.create({
				name: 'Task',
				children: [{ name: 'Task 1', data: { value: 1 }, executor: 'unknown' }]
			});

			await expect(tm.execute(root.id, {})).rejects.toThrow();
		});
	});

	describe('pause', () => {
		it('should pause a running task', async () => {
			const root = await tm.create({
				name: 'Task',
				children: [{ name: 'Task 1', data: { value: 1 } }]
			});

			await tm.pause(root.id, 'user requested');

			const paused = await tm.getRoot(root.id);
			expect(paused?.status).toBe('paused');
			expect(paused?.metadata?.pauseReason).toBe('user requested');
		});

		it('should emit pause event', async () => {
			let pauseEventReceived = false;
			tm.on('pause', () => {
				pauseEventReceived = true;
			});

			const root = await tm.create({ name: 'Task' });
			await tm.pause(root.id);

			expect(pauseEventReceived).toBe(true);
		});

		it('should stop execution when paused', async () => {
			const executed: number[] = [];
			const executor: TaskExecutor<{ value: number }> = async (ctx) => {
				executed.push(ctx.data.value);
				if (ctx.data.value === 2) {
					await ctx.pauseTask('test pause');
					return; // Don't complete, just pause
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

			const finalRoot = await tm.execute(root.id, executor);

			// Should execute 1 and 2, but 3 should be skipped due to pause
			expect(executed).toContain(1);
			expect(executed).toContain(2);
			expect(executed).not.toContain(3);
			expect(finalRoot.status).toBe('paused');
		});
	});

	describe('resume', () => {
		it('should resume a paused task', async () => {
			const executed: number[] = [];
			const executor: TaskExecutor<{ value: number }> = async (ctx) => {
				executed.push(ctx.data.value);
				await ctx.complete();
			};

			const root = await tm.create({
				name: 'Task',
				children: [
					{ name: 'Task 1', data: { value: 1 } },
					{ name: 'Task 2', data: { value: 2 } }
				]
			});

			// Pause immediately
			await tm.pause(root.id);

			// Resume and execute
			const finalRoot = await tm.resume(root.id, executor);

			expect(finalRoot.status).toBe('completed');
			expect(executed).toHaveLength(2);
		});

		it('should throw if task is not paused', async () => {
			const root = await tm.create({ name: 'Task' });
			await expect(tm.resume(root.id, async () => {})).rejects.toThrow();
		});

		it('should emit resume event', async () => {
			let resumeEventReceived = false;
			tm.on('resume', () => {
				resumeEventReceived = true;
			});

			const root = await tm.create({ name: 'Task' });
			await tm.pause(root.id);
			await tm.resume(root.id, async () => {});

			expect(resumeEventReceived).toBe(true);
		});
	});

	describe('cancel', () => {
		it('should cancel a task', async () => {
			const root = await tm.create({
				name: 'Task',
				children: [
					{ name: 'Task 1', data: { value: 1 } },
					{ name: 'Task 2', data: { value: 2 } }
				]
			});

			await tm.cancel(root.id);

			const cancelled = await tm.getRoot(root.id);
			expect(cancelled?.status).toBe('cancelled');

			const leaves = await tm.getLeaves(root.id);
			expect(leaves.every((l) => l.status === 'cancelled')).toBe(true);
		});

		it('should emit cancel event', async () => {
			let cancelEventReceived = false;
			tm.on('cancel', () => {
				cancelEventReceived = true;
			});

			const root = await tm.create({ name: 'Task' });
			await tm.cancel(root.id);

			expect(cancelEventReceived).toBe(true);
		});

		it('should abort running execution', async () => {
			const executed: number[] = [];
			const executor: TaskExecutor<{ value: number }> = async (ctx) => {
				executed.push(ctx.data.value);
				// Simulate long running task
				await new Promise((resolve) => setTimeout(resolve, 100));
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

			// Start execution and cancel immediately
			const execPromise = tm.execute(root.id, executor);
			await new Promise((resolve) => setTimeout(resolve, 10));
			await tm.cancel(root.id);
			await execPromise;

			// Should have started at least one but not completed all
			expect(executed.length).toBeLessThan(3);
		});
	});

	describe('delete', () => {
		it('should delete a task and its nodes', async () => {
			const root = await tm.create({
				name: 'Task',
				children: [{ name: 'Task 1', data: { value: 1 } }]
			});

			await tm.delete(root.id);

			expect(await tm.getRoot(root.id)).toBeNull();
			expect(await tm.getNodes(root.id)).toHaveLength(0);
		});
	});

	describe('getRoot', () => {
		it('should return root by id', async () => {
			const created = await tm.create({ name: 'Task' });
			const fetched = await tm.getRoot(created.id);
			expect(fetched).toEqual(created);
		});

		it('should return null for non-existent root', async () => {
			const root = await tm.getRoot('non-existent');
			expect(root).toBeNull();
		});
	});

	describe('getAllRoots', () => {
		it('should return all roots', async () => {
			await tm.create({ name: 'Task 1' });
			await tm.create({ name: 'Task 2' });
			await tm.create({ name: 'Task 3' });

			const roots = await tm.getAllRoots();
			expect(roots).toHaveLength(3);
		});
	});

	describe('getNode', () => {
		it('should return node by id', async () => {
			const root = await tm.create({
				name: 'Task',
				children: [{ name: 'Task 1', data: { value: 1 } }]
			});

			const nodes = await tm.getNodes(root.id);
			const node = await tm.getNode(nodes[0].id);
			expect(node).not.toBeNull();
			expect(node?.name).toBe('Task 1');
		});
	});

	describe('getChildren', () => {
		it('should return direct children of root', async () => {
			const root = await tm.create({
				name: 'Task',
				children: [
					{ name: 'Task 1', data: { value: 1 } },
					{ name: 'Task 2', data: { value: 2 } }
				]
			});

			const children = await tm.getChildren(root.id);
			expect(children).toHaveLength(2);
		});

		it('should return children of specific node', async () => {
			const root = await tm.create({
				name: 'Task',
				children: [
					{
						name: 'Group',
						children: [
							{ name: 'Task 1', data: { value: 1 } },
							{ name: 'Task 2', data: { value: 2 } }
						]
					}
				]
			});

			const topChildren = await tm.getChildren(root.id);
			const group = topChildren[0];
			const groupChildren = await tm.getChildren(root.id, group.id);
			expect(groupChildren).toHaveLength(2);
		});
	});

	describe('getRecoverable', () => {
		it('should return pending, running, and paused tasks', async () => {
			await tm.create({ name: 'Pending' });
			const running = await tm.create({ name: 'Running' });
			await tm.create({ name: 'To Complete' });

			// Start execution to make it running
			const execPromise = tm.execute(
				running.id,
				async () => await new Promise((r) => setTimeout(r, 1000))
			);
			await new Promise((r) => setTimeout(r, 10));
			await tm.cancel(running.id);
			await execPromise;

			const recoverable = await tm.getRecoverable();
			expect(recoverable.length).toBeGreaterThanOrEqual(1);
		});
	});

	describe('Merkle Tree', () => {
		it('should get merkle root', async () => {
			const root = await tm.create({
				name: 'Task',
				children: [
					{ name: 'Task 1', data: { value: 1 } },
					{ name: 'Task 2', data: { value: 2 } }
				]
			});

			const merkleRoot = await tm.getMerkleRoot(root.id);
			expect(merkleRoot).toBeTruthy();
			expect(merkleRoot?.length).toBe(64);
		});

		it('should generate merkle proof', async () => {
			const root = await tm.create({
				name: 'Task',
				children: [
					{ name: 'Task 1', data: { value: 1 } },
					{ name: 'Task 2', data: { value: 2 } }
				]
			});

			const leaves = await tm.getLeaves(root.id);
			const proof = await tm.getMerkleProof(root.id, leaves[0].id);

			expect(proof).not.toBeNull();
			expect(proof?.leaf).toBeTruthy();
			expect(proof?.proof).toBeInstanceOf(Array);
			expect(proof?.root).toBe(root.merkleRoot);
		});

		it('should verify merkle proof', async () => {
			const root = await tm.create({
				name: 'Task',
				children: [
					{ name: 'Task 1', data: { value: 1 } },
					{ name: 'Task 2', data: { value: 2 } },
					{ name: 'Task 3', data: { value: 3 } }
				]
			});

			const leaves = await tm.getLeaves(root.id);
			const proof = await tm.getMerkleProof(root.id, leaves[1].id);

			const isValid = await tm.verifyProof(proof!);
			expect(isValid).toBe(true);
		});

		it('should update merkle root', async () => {
			const root = await tm.create({
				name: 'Task',
				children: [{ name: 'Task 1', data: { value: 1 } }]
			});

			const originalRoot = root.merkleRoot;
			const newRoot = await tm.updateMerkleRoot(root.id);

			expect(newRoot).toBe(originalRoot);
		});
	});

	describe('Events', () => {
		it('should subscribe and unsubscribe', async () => {
			let callCount = 0;
			const unsubscribe = tm.on('start', () => {
				callCount++;
			});

			const root = await tm.create({ name: 'Task' });
			await tm.execute(root.id, async () => {});
			expect(callCount).toBe(1);

			unsubscribe();
			const root2 = await tm.create({ name: 'Task 2' });
			await tm.execute(root2.id, async () => {});
			expect(callCount).toBe(1);
		});

		it('should handle errors in event handlers', async () => {
			const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

			tm.on('start', () => {
				throw new Error('Handler error');
			});

			const root = await tm.create({ name: 'Task' });
			await tm.execute(root.id, async () => {}); // Should not throw

			expect(consoleSpy).toHaveBeenCalled();
			consoleSpy.mockRestore();
		});
	});

	describe('cleanup', () => {
		it('should cleanup old completed tasks', async () => {
			const old = await tm.create({ name: 'Old Task' });
			// Manually set old timestamp
			const root = await tm.getRoot(old.id);
			if (root) {
				root.status = 'completed';
				root.updatedAt = Date.now() - 10 * 24 * 60 * 60 * 1000; // 10 days ago
				// Save directly to storage (hacky but needed for test)
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				await (tm as any).storage.saveRoot(root);
			}

			const deleted = await tm.cleanup(7);
			expect(deleted).toBe(1);
		});
	});

	describe('close', () => {
		it('should close and clear resources', async () => {
			await tm.create({ name: 'Task' });
			await tm.close();
			// Should be able to create new instance
			const tm2 = createTaskManager({ storage: createMemoryStorage() });
			const root = await tm2.create({ name: 'New Task' });
			expect(root).toBeTruthy();
			await tm2.close();
		});
	});

	describe('clear', () => {
		it('should clear all data', async () => {
			await tm.create({ name: 'Task 1' });
			await tm.create({ name: 'Task 2' });
			await tm.clear();

			const roots = await tm.getAllRoots();
			expect(roots).toHaveLength(0);
		});
	});

	describe('Factory Function', () => {
		it('should create TaskManager with defaults', () => {
			const manager = createTaskManager();
			expect(manager).toBeInstanceOf(TaskManager);
		});

		it('should create TaskManager with custom config', () => {
			const manager = createTaskManager({
				dbName: 'CustomDB',
				retry: { maxAttempts: 5 }
			});
			expect(manager).toBeInstanceOf(TaskManager);
		});
	});
});
