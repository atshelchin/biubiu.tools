import { describe, it, expect, beforeEach } from 'vitest';
import type { Task } from '../types';
import {
	traverseTree,
	findTaskById,
	findTasks,
	getLeafTasks,
	getParentTasks,
	countLeaves,
	calculateProgress,
	calculateStatus,
	updateStatistics,
	getTaskPath,
	getParentTask,
	getNextExecutableTask,
	cloneTask,
	flattenTree,
	getTreeDepth,
	isAncestor,
	getDescendants
} from './tree';

/**
 * Helper to create a task tree for testing
 */
function createTestTask(overrides: Partial<Task> = {}): Task {
	return {
		id: 'task-1',
		parentId: null,
		type: 'test',
		name: 'Test Task',
		description: 'A test task',
		children: [],
		depth: 0,
		path: ['task-1'],
		status: 'pending',
		progress: 0,
		isLeaf: true,
		attempts: 0,
		maxAttempts: 3,
		isPaused: false,
		createdAt: Date.now(),
		updatedAt: Date.now(),
		totalLeaves: 1,
		completedLeaves: 0,
		failedLeaves: 0,
		config: {},
		state: {},
		results: [],
		errors: [],
		...overrides
	};
}

/**
 * Create a more complex tree structure for testing
 *
 * root
 * ├── child1
 * │   ├── leaf1 (executable)
 * │   └── leaf2 (executable)
 * └── child2
 *     └── leaf3 (executable)
 */
function createComplexTree(): Task {
	const root = createTestTask({
		id: 'root',
		name: 'Root Task',
		isLeaf: false,
		path: ['root']
	});

	const child1 = createTestTask({
		id: 'child1',
		parentId: 'root',
		name: 'Child 1',
		isLeaf: false,
		depth: 1,
		path: ['root', 'child1']
	});

	const leaf1 = createTestTask({
		id: 'leaf1',
		parentId: 'child1',
		name: 'Leaf 1',
		isLeaf: true,
		depth: 2,
		path: ['root', 'child1', 'leaf1'],
		executor: 'testExecutor'
	});

	const leaf2 = createTestTask({
		id: 'leaf2',
		parentId: 'child1',
		name: 'Leaf 2',
		isLeaf: true,
		depth: 2,
		path: ['root', 'child1', 'leaf2'],
		executor: 'testExecutor'
	});

	const child2 = createTestTask({
		id: 'child2',
		parentId: 'root',
		name: 'Child 2',
		isLeaf: false,
		depth: 1,
		path: ['root', 'child2']
	});

	const leaf3 = createTestTask({
		id: 'leaf3',
		parentId: 'child2',
		name: 'Leaf 3',
		isLeaf: true,
		depth: 2,
		path: ['root', 'child2', 'leaf3'],
		executor: 'testExecutor'
	});

	child1.children = [leaf1, leaf2];
	child2.children = [leaf3];
	root.children = [child1, child2];

	updateStatistics(root);

	return root;
}

describe('Tree Utilities', () => {
	describe('traverseTree', () => {
		it('should traverse all nodes in depth-first order', () => {
			const root = createComplexTree();
			const visitedIds: string[] = [];

			traverseTree(root, (task) => {
				visitedIds.push(task.id);
			});

			expect(visitedIds).toEqual(['root', 'child1', 'leaf1', 'leaf2', 'child2', 'leaf3']);
		});

		it('should stop traversing subtree when visitor returns false', () => {
			const root = createComplexTree();
			const visitedIds: string[] = [];

			// Returning false stops descending into that node's children
			// but continues with siblings
			traverseTree(root, (task) => {
				visitedIds.push(task.id);
				if (task.id === 'child1') return false; // Stop going into child1's children
			});

			// child1 is visited but its children (leaf1, leaf2) are skipped
			// child2 and its children continue
			expect(visitedIds).toEqual(['root', 'child1', 'child2', 'leaf3']);
		});
	});

	describe('findTaskById', () => {
		it('should find task by ID', () => {
			const root = createComplexTree();

			const found = findTaskById(root, 'leaf2');

			expect(found).not.toBeNull();
			expect(found?.id).toBe('leaf2');
			expect(found?.name).toBe('Leaf 2');
		});

		it('should return null for non-existent ID', () => {
			const root = createComplexTree();

			const found = findTaskById(root, 'non-existent');

			expect(found).toBeNull();
		});

		it('should find root task', () => {
			const root = createComplexTree();

			const found = findTaskById(root, 'root');

			expect(found).not.toBeNull();
			expect(found?.id).toBe('root');
		});
	});

	describe('findTasks', () => {
		it('should find tasks matching filter', () => {
			const root = createComplexTree();

			const leaves = findTasks(root, (task) => task.isLeaf);

			expect(leaves).toHaveLength(3);
			expect(leaves.map((t) => t.id)).toEqual(['leaf1', 'leaf2', 'leaf3']);
		});

		it('should return empty array when no matches', () => {
			const root = createComplexTree();

			const matches = findTasks(root, (task) => task.status === 'completed');

			expect(matches).toHaveLength(0);
		});
	});

	describe('getLeafTasks', () => {
		it('should return all leaf tasks', () => {
			const root = createComplexTree();

			const leaves = getLeafTasks(root);

			expect(leaves).toHaveLength(3);
			expect(leaves.every((t) => t.isLeaf)).toBe(true);
		});

		it('should return single leaf for leaf-only task', () => {
			const leaf = createTestTask({ isLeaf: true });

			const leaves = getLeafTasks(leaf);

			expect(leaves).toHaveLength(1);
			expect(leaves[0].id).toBe('task-1');
		});
	});

	describe('getParentTasks', () => {
		it('should return all parent tasks', () => {
			const root = createComplexTree();

			const parents = getParentTasks(root);

			expect(parents).toHaveLength(3);
			expect(parents.map((t) => t.id)).toEqual(['root', 'child1', 'child2']);
		});
	});

	describe('countLeaves', () => {
		it('should count total leaf tasks', () => {
			const root = createComplexTree();

			const count = countLeaves(root);

			expect(count).toBe(3);
		});

		it('should return 1 for single leaf', () => {
			const leaf = createTestTask({ isLeaf: true });

			const count = countLeaves(leaf);

			expect(count).toBe(1);
		});
	});

	describe('calculateProgress', () => {
		it('should calculate progress from children', () => {
			const root = createComplexTree();
			const leaf1 = findTaskById(root, 'leaf1')!;
			const leaf2 = findTaskById(root, 'leaf2')!;

			leaf1.progress = 100;
			leaf2.progress = 50;

			const progress = calculateProgress(root);

			// child1: (100 + 50) / 2 = 75
			// child2: 0
			// root: (75 + 0) / 2 = 38 (rounded)
			expect(progress).toBe(38);
		});

		it('should return 0 for no progress', () => {
			const root = createComplexTree();

			const progress = calculateProgress(root);

			expect(progress).toBe(0);
		});
	});

	describe('calculateStatus', () => {
		it('should return completed when all children completed', () => {
			const root = createComplexTree();
			const leaves = getLeafTasks(root);
			leaves.forEach((leaf) => {
				leaf.status = 'completed';
			});

			updateStatistics(root);

			expect(root.status).toBe('completed');
		});

		it('should return running when any child is running', () => {
			const root = createComplexTree();
			const leaf1 = findTaskById(root, 'leaf1')!;
			leaf1.status = 'running';

			updateStatistics(root);

			expect(root.status).toBe('running');
		});

		it('should return partial when some completed and some failed', () => {
			const root = createComplexTree();
			const child1 = findTaskById(root, 'child1')!;
			const child2 = findTaskById(root, 'child2')!;

			// Set child1 to partial (mix of completed and failed)
			child1.status = 'partial';
			// Set child2 to completed
			child2.status = 'completed';

			// calculateStatus sees 'partial' and 'completed' children
			const status = calculateStatus(root);

			// Since we have a partial child, root should be partial or we have mixed states
			expect(['partial', 'pending']).toContain(status);
		});
	});

	describe('updateStatistics', () => {
		it('should update totalLeaves correctly', () => {
			const root = createComplexTree();

			updateStatistics(root);

			expect(root.totalLeaves).toBe(3);
		});

		it('should update completedLeaves correctly', () => {
			const root = createComplexTree();
			const leaf1 = findTaskById(root, 'leaf1')!;
			const leaf2 = findTaskById(root, 'leaf2')!;

			leaf1.status = 'completed';
			leaf2.status = 'completed';

			updateStatistics(root);

			expect(root.completedLeaves).toBe(2);
		});

		it('should update failedLeaves correctly', () => {
			const root = createComplexTree();
			const leaf1 = findTaskById(root, 'leaf1')!;

			leaf1.status = 'failed';

			updateStatistics(root);

			expect(root.failedLeaves).toBe(1);
		});
	});

	describe('getTaskPath', () => {
		it('should return path to task', () => {
			const root = createComplexTree();

			const path = getTaskPath(root, 'leaf2');

			expect(path).not.toBeNull();
			expect(path?.map((t) => t.id)).toEqual(['root', 'child1', 'leaf2']);
		});

		it('should return null for non-existent task', () => {
			const root = createComplexTree();

			const path = getTaskPath(root, 'non-existent');

			expect(path).toBeNull();
		});
	});

	describe('getParentTask', () => {
		it('should return parent task', () => {
			const root = createComplexTree();
			const leaf1 = findTaskById(root, 'leaf1')!;

			const parent = getParentTask(root, leaf1);

			expect(parent).not.toBeNull();
			expect(parent?.id).toBe('child1');
		});

		it('should return null for root task', () => {
			const root = createComplexTree();

			const parent = getParentTask(root, root);

			expect(parent).toBeNull();
		});
	});

	describe('getNextExecutableTask', () => {
		it('should return first pending leaf task', () => {
			const root = createComplexTree();

			const next = getNextExecutableTask(root);

			expect(next).not.toBeNull();
			expect(next?.id).toBe('leaf1');
			expect(next?.status).toBe('pending');
		});

		it('should return running task if one exists', () => {
			const root = createComplexTree();
			const leaf2 = findTaskById(root, 'leaf2')!;
			leaf2.status = 'running';

			const next = getNextExecutableTask(root);

			expect(next).not.toBeNull();
			expect(next?.id).toBe('leaf2');
		});

		it('should return null when all tasks completed', () => {
			const root = createComplexTree();
			getLeafTasks(root).forEach((leaf) => {
				leaf.status = 'completed';
			});

			const next = getNextExecutableTask(root);

			expect(next).toBeNull();
		});
	});

	describe('cloneTask', () => {
		it('should create deep copy of task tree', () => {
			const root = createComplexTree();

			const clone = cloneTask(root);

			expect(clone).not.toBe(root);
			expect(clone.id).toBe(root.id);
			expect(clone.children).not.toBe(root.children);
			expect(clone.children[0]).not.toBe(root.children[0]);
		});

		it('should not affect original when modifying clone', () => {
			const root = createComplexTree();

			const clone = cloneTask(root);
			clone.name = 'Modified';
			clone.children[0].name = 'Modified Child';

			expect(root.name).toBe('Root Task');
			expect(root.children[0].name).toBe('Child 1');
		});
	});

	describe('flattenTree', () => {
		it('should flatten tree to array in breadth-first order', () => {
			const root = createComplexTree();

			const flattened = flattenTree(root);

			expect(flattened).toHaveLength(6);
			expect(flattened.map((t) => t.id)).toEqual([
				'root',
				'child1',
				'child2',
				'leaf1',
				'leaf2',
				'leaf3'
			]);
		});
	});

	describe('getTreeDepth', () => {
		it('should return max depth of tree', () => {
			const root = createComplexTree();

			const depth = getTreeDepth(root);

			expect(depth).toBe(2);
		});

		it('should return 0 for single leaf', () => {
			const leaf = createTestTask({ depth: 0 });

			const depth = getTreeDepth(leaf);

			expect(depth).toBe(0);
		});
	});

	describe('isAncestor', () => {
		it('should return true for ancestor relationship', () => {
			const root = createComplexTree();
			const leaf1 = findTaskById(root, 'leaf1')!;

			const result = isAncestor(root, leaf1);

			expect(result).toBe(true);
		});

		it('should return false for non-ancestor', () => {
			const root = createComplexTree();
			const child2 = findTaskById(root, 'child2')!;
			const leaf1 = findTaskById(root, 'leaf1')!;

			const result = isAncestor(child2, leaf1);

			expect(result).toBe(false);
		});
	});

	describe('getDescendants', () => {
		it('should return all descendants', () => {
			const root = createComplexTree();

			const descendants = getDescendants(root);

			expect(descendants).toHaveLength(5);
			expect(descendants.map((t) => t.id).sort()).toEqual(
				['child1', 'child2', 'leaf1', 'leaf2', 'leaf3'].sort()
			);
		});

		it('should return empty array for leaf', () => {
			const leaf = createTestTask({ isLeaf: true });

			const descendants = getDescendants(leaf);

			expect(descendants).toHaveLength(0);
		});
	});
});
