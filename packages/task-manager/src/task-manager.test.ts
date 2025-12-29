import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
	initTaskManager,
	resetConfig,
	createTask,
	getTask,
	getAllTasks,
	getRecoverableTasks,
	updateTask,
	pauseTask,
	resumeTask,
	cancelTask,
	deleteTask,
	executeTask
} from './index';
import { clearAllTasks, closeDB } from './utils/db';
import type { TaskExecutorRegistry } from './types';

describe('Task Manager', () => {
	beforeEach(async () => {
		resetConfig();
		initTaskManager({
			db: {
				name: 'TestTaskManager',
				version: 1
			}
		});
		await clearAllTasks();
	});

	afterEach(async () => {
		await clearAllTasks();
		closeDB();
	});

	describe('createTask', () => {
		it('should create a simple leaf task', async () => {
			const task = await createTask({
				type: 'test',
				name: 'Simple Task',
				executionData: { value: 42 },
				executor: 'testExecutor'
			});

			expect(task).toBeDefined();
			expect(task.id).toMatch(/^task-\d+-[a-z0-9]+$/);
			expect(task.name).toBe('Simple Task');
			expect(task.type).toBe('test');
			expect(task.isLeaf).toBe(true);
			expect(task.status).toBe('pending');
			expect(task.executionData).toEqual({ value: 42 });
		});

		it('should create a task with children', async () => {
			const task = await createTask({
				type: 'test',
				name: 'Parent Task',
				children: [
					{ type: 'test', name: 'Child 1', executionData: {}, executor: 'exec1' },
					{ type: 'test', name: 'Child 2', executionData: {}, executor: 'exec2' }
				]
			});

			expect(task.isLeaf).toBe(false);
			expect(task.children).toHaveLength(2);
			expect(task.children[0].name).toBe('Child 1');
			expect(task.children[1].name).toBe('Child 2');
			expect(task.totalLeaves).toBe(2);
		});

		it('should create nested task tree', async () => {
			const task = await createTask({
				type: 'test',
				name: 'Root',
				children: [
					{
						type: 'test',
						name: 'Level 1',
						children: [
							{ type: 'test', name: 'Level 2a', executionData: {}, executor: 'exec' },
							{ type: 'test', name: 'Level 2b', executionData: {}, executor: 'exec' }
						]
					}
				]
			});

			expect(task.children[0].children).toHaveLength(2);
			expect(task.children[0].depth).toBe(1);
			expect(task.children[0].children[0].depth).toBe(2);
			expect(task.totalLeaves).toBe(2);
		});

		it('should set correct paths', async () => {
			const task = await createTask({
				type: 'test',
				name: 'Root',
				children: [{ type: 'test', name: 'Child', executionData: {}, executor: 'exec' }]
			});

			expect(task.path).toEqual([task.id]);
			expect(task.children[0].path).toEqual([task.id, task.children[0].id]);
		});
	});

	describe('getTask', () => {
		it('should retrieve created task', async () => {
			const created = await createTask({
				type: 'test',
				name: 'Test Task',
				executionData: {},
				executor: 'exec'
			});

			const retrieved = await getTask(created.id);

			expect(retrieved).not.toBeNull();
			expect(retrieved?.id).toBe(created.id);
			expect(retrieved?.name).toBe('Test Task');
		});

		it('should return null for non-existent task', async () => {
			const task = await getTask('non-existent-id');

			expect(task).toBeNull();
		});
	});

	describe('getAllTasks', () => {
		it('should return all tasks', async () => {
			await createTask({ type: 'test', name: 'Task 1', executionData: {}, executor: 'exec' });
			await createTask({ type: 'test', name: 'Task 2', executionData: {}, executor: 'exec' });

			const tasks = await getAllTasks();

			expect(tasks).toHaveLength(2);
		});

		it('should return empty array when no tasks', async () => {
			const tasks = await getAllTasks();

			expect(tasks).toHaveLength(0);
		});
	});

	describe('getRecoverableTasks', () => {
		it('should return pending, running, and paused tasks', async () => {
			await createTask({
				type: 'test',
				name: 'Pending',
				executionData: {},
				executor: 'exec'
			});
			const task2 = await createTask({
				type: 'test',
				name: 'Running',
				executionData: {},
				executor: 'exec'
			});
			const task3 = await createTask({
				type: 'test',
				name: 'Completed',
				executionData: {},
				executor: 'exec'
			});

			// Set statuses
			await updateTask(task2, task2.id, { status: 'running' });
			await updateTask(task3, task3.id, { status: 'completed' });

			const recoverable = await getRecoverableTasks();

			expect(recoverable.length).toBeGreaterThanOrEqual(1);
		});
	});

	describe('updateTask', () => {
		it('should update task status', async () => {
			const task = await createTask({
				type: 'test',
				name: 'Test',
				executionData: {},
				executor: 'exec'
			});

			const updated = await updateTask(task, task.id, { status: 'running' });

			expect(updated.status).toBe('running');
		});

		it('should update task progress', async () => {
			const task = await createTask({
				type: 'test',
				name: 'Test',
				executionData: {},
				executor: 'exec'
			});

			const updated = await updateTask(task, task.id, { progress: 50 });

			expect(updated.progress).toBe(50);
		});

		it('should merge state updates', async () => {
			const task = await createTask({
				type: 'test',
				name: 'Test',
				executionData: {},
				executor: 'exec'
			});

			await updateTask(task, task.id, { state: { key1: 'value1' } });
			const updated = await updateTask(task, task.id, { state: { key2: 'value2' } });

			expect(updated.state).toEqual({ key1: 'value1', key2: 'value2' });
		});
	});

	describe('pauseTask', () => {
		it('should pause a task', async () => {
			const task = await createTask({
				type: 'test',
				name: 'Test',
				executionData: {},
				executor: 'exec'
			});

			const paused = await pauseTask(task, task.id, 'user', 'User requested pause');

			expect(paused.status).toBe('paused');
			expect(paused.isPaused).toBe(true);
			expect(paused.pauseReason).toBe('user');
			expect(paused.pauseMessage).toBe('User requested pause');
		});

		it('should pause descendants', async () => {
			const task = await createTask({
				type: 'test',
				name: 'Parent',
				children: [{ type: 'test', name: 'Child', executionData: {}, executor: 'exec' }]
			});

			// Set child to running first
			task.children[0].status = 'running';

			const paused = await pauseTask(task, task.id, 'user', 'Pause all');

			expect(paused.children[0].status).toBe('paused');
		});
	});

	describe('resumeTask', () => {
		it('should resume a paused task', async () => {
			const task = await createTask({
				type: 'test',
				name: 'Test',
				executionData: {},
				executor: 'exec'
			});

			await pauseTask(task, task.id, 'user');
			const resumed = await resumeTask(task, task.id);

			expect(resumed.isPaused).toBe(false);
			expect(resumed.pauseReason).toBeUndefined();
		});
	});

	describe('cancelTask', () => {
		it('should cancel a task', async () => {
			const task = await createTask({
				type: 'test',
				name: 'Test',
				executionData: {},
				executor: 'exec'
			});

			const cancelled = await cancelTask(task, task.id);

			expect(cancelled.status).toBe('cancelled');
			expect(cancelled.cancelledAt).toBeDefined();
		});

		it('should cancel descendants', async () => {
			const task = await createTask({
				type: 'test',
				name: 'Parent',
				children: [{ type: 'test', name: 'Child', executionData: {}, executor: 'exec' }]
			});

			const cancelled = await cancelTask(task, task.id);

			expect(cancelled.children[0].status).toBe('cancelled');
		});
	});

	describe('deleteTask', () => {
		it('should delete a task', async () => {
			const task = await createTask({
				type: 'test',
				name: 'Test',
				executionData: {},
				executor: 'exec'
			});

			await deleteTask(task.id);
			const retrieved = await getTask(task.id);

			expect(retrieved).toBeNull();
		});
	});

	describe('executeTask', () => {
		it('should execute all leaf tasks', async () => {
			const executedTasks: string[] = [];

			const task = await createTask({
				type: 'test',
				name: 'Parent',
				children: [
					{ type: 'test', name: 'Child 1', executionData: { id: 1 }, executor: 'testExec' },
					{ type: 'test', name: 'Child 2', executionData: { id: 2 }, executor: 'testExec' }
				]
			});

			const registry: TaskExecutorRegistry = {
				testExec: async (ctx) => {
					executedTasks.push(ctx.task.id);
					await ctx.completeTask({ success: true });
				}
			};

			const result = await executeTask(task.id, registry);

			expect(executedTasks).toHaveLength(2);
			expect(result.status).toBe('completed');
			expect(result.completedLeaves).toBe(2);
		});

		it('should handle task failure', async () => {
			const task = await createTask({
				type: 'test',
				name: 'Failing Task',
				executionData: {},
				executor: 'failingExec',
				maxAttempts: 1
			});

			const registry: TaskExecutorRegistry = {
				failingExec: async (ctx) => {
					await ctx.failTask('Something went wrong');
				}
			};

			const result = await executeTask(task.id, registry);

			expect(result.status).toBe('failed');
			expect(result.errors).toContain('Something went wrong');
		});

		it('should update progress during execution', async () => {
			const progressUpdates: number[] = [];

			const task = await createTask({
				type: 'test',
				name: 'Progress Task',
				executionData: {},
				executor: 'progressExec'
			});

			const registry: TaskExecutorRegistry = {
				progressExec: async (ctx) => {
					await ctx.updateProgress(25);
					await ctx.updateProgress(50);
					await ctx.updateProgress(75);
					await ctx.completeTask();
				}
			};

			await executeTask(task.id, registry, (root, current) => {
				progressUpdates.push(current.progress);
			});

			expect(progressUpdates).toContain(25);
			expect(progressUpdates).toContain(50);
			expect(progressUpdates).toContain(75);
		});

		it('should stop when paused', async () => {
			const executedTasks: string[] = [];

			const task = await createTask({
				type: 'test',
				name: 'Parent',
				children: [
					{ type: 'test', name: 'Child 1', executionData: {}, executor: 'pausingExec' },
					{ type: 'test', name: 'Child 2', executionData: {}, executor: 'normalExec' }
				]
			});

			const registry: TaskExecutorRegistry = {
				pausingExec: async (ctx) => {
					executedTasks.push(ctx.task.id);
					await ctx.pauseRoot('user', 'Pausing');
				},
				normalExec: async (ctx) => {
					executedTasks.push(ctx.task.id);
					await ctx.completeTask();
				}
			};

			const result = await executeTask(task.id, registry);

			expect(executedTasks).toHaveLength(1);
			expect(result.isPaused).toBe(true);
		});

		it('should retry failed tasks', async () => {
			let attempts = 0;

			const task = await createTask({
				type: 'test',
				name: 'Retry Task',
				executionData: {},
				executor: 'retryExec',
				maxAttempts: 3
			});

			const registry: TaskExecutorRegistry = {
				retryExec: async (ctx) => {
					attempts++;
					if (attempts < 3) {
						throw new Error('Temporary failure');
					}
					await ctx.completeTask({ attempts });
				}
			};

			const result = await executeTask(task.id, registry);

			expect(attempts).toBe(3);
			expect(result.status).toBe('completed');
		});
	});
});
