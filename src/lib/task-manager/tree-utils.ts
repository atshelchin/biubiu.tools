/**
 * Task Tree Utilities
 *
 * Utilities for working with task trees (traversal, search, aggregation, etc.)
 */

import type { Task, TaskStatus, TaskVisitor, TaskFilter } from './types.v2';

/**
 * Traverse task tree (depth-first, pre-order)
 */
export function traverseTree(task: Task, visitor: TaskVisitor): void {
	const shouldContinue = visitor(task, task.depth);
	if (shouldContinue === false) return;

	for (const child of task.children) {
		traverseTree(child, visitor);
	}
}

/**
 * Find a task by ID in the tree
 */
export function findTaskById(root: Task, taskId: string): Task | null {
	let found: Task | null = null;

	traverseTree(root, (task) => {
		if (task.id === taskId) {
			found = task;
			return false; // Stop traversal
		}
	});

	return found;
}

/**
 * Find tasks matching a filter
 */
export function findTasks(root: Task, filter: TaskFilter): Task[] {
	const results: Task[] = [];

	traverseTree(root, (task) => {
		if (filter(task)) {
			results.push(task);
		}
	});

	return results;
}

/**
 * Get all leaf tasks (tasks with no children)
 */
export function getLeafTasks(root: Task): Task[] {
	return findTasks(root, (task) => task.isLeaf);
}

/**
 * Get all parent tasks (tasks with children)
 */
export function getParentTasks(root: Task): Task[] {
	return findTasks(root, (task) => !task.isLeaf);
}

/**
 * Calculate total number of leaf tasks in a tree/subtree
 */
export function countLeaves(task: Task): number {
	if (task.isLeaf) return 1;

	let count = 0;
	for (const child of task.children) {
		count += countLeaves(child);
	}
	return count;
}

/**
 * Calculate aggregated progress from children
 * Returns 0-100
 */
export function calculateProgress(task: Task): number {
	if (task.isLeaf) {
		return task.progress;
	}

	if (task.children.length === 0) {
		return 0;
	}

	const totalProgress = task.children.reduce((sum, child) => {
		return sum + calculateProgress(child);
	}, 0);

	return Math.round(totalProgress / task.children.length);
}

/**
 * Calculate aggregated status from children
 */
export function calculateStatus(task: Task): TaskStatus {
	if (task.isLeaf) {
		return task.status;
	}

	if (task.children.length === 0) {
		return 'pending';
	}

	const statuses = task.children.map((child) => child.status);

	// If any child is running, parent is running
	if (statuses.includes('running')) return 'running';

	// If any child is paused, parent is paused
	if (statuses.includes('paused')) return 'paused';

	// If all children are completed, parent is completed
	if (statuses.every((s) => s === 'completed')) return 'completed';

	// If all children are failed, parent is failed
	if (statuses.every((s) => s === 'failed')) return 'failed';

	// If all children are cancelled, parent is cancelled
	if (statuses.every((s) => s === 'cancelled')) return 'cancelled';

	// If some completed and some failed, parent is partial
	if (statuses.some((s) => s === 'completed') && statuses.some((s) => s === 'failed')) {
		return 'partial';
	}

	// Default to pending
	return 'pending';
}

/**
 * Update aggregated statistics (totalLeaves, completedLeaves, failedLeaves)
 * Call this after updating a leaf task
 */
export function updateStatistics(task: Task): void {
	if (task.isLeaf) {
		task.totalLeaves = 1;
		task.completedLeaves = task.status === 'completed' ? 1 : 0;
		task.failedLeaves = task.status === 'failed' ? 1 : 0;
	} else {
		task.totalLeaves = 0;
		task.completedLeaves = 0;
		task.failedLeaves = 0;

		for (const child of task.children) {
			updateStatistics(child);
			task.totalLeaves += child.totalLeaves;
			task.completedLeaves += child.completedLeaves;
			task.failedLeaves += child.failedLeaves;
		}
	}

	// Update progress and status
	task.progress = calculateProgress(task);
	task.status = calculateStatus(task);
}

/**
 * Get the path from root to a specific task
 */
export function getTaskPath(root: Task, taskId: string): Task[] | null {
	const path: Task[] = [];

	function findPath(task: Task): boolean {
		path.push(task);

		if (task.id === taskId) {
			return true;
		}

		for (const child of task.children) {
			if (findPath(child)) {
				return true;
			}
		}

		path.pop();
		return false;
	}

	return findPath(root) ? path : null;
}

/**
 * Get parent task
 */
export function getParentTask(root: Task, task: Task): Task | null {
	if (!task.parentId) return null;
	return findTaskById(root, task.parentId);
}

/**
 * Get next executable leaf task (pending or running)
 */
export function getNextExecutableTask(root: Task): Task | null {
	const leaves = getLeafTasks(root);

	// First, check for running tasks (resume)
	const running = leaves.find((task) => task.status === 'running');
	if (running) return running;

	// Then, find the first pending task
	const pending = leaves.find((task) => task.status === 'pending');
	return pending || null;
}

/**
 * Clone a task tree (deep copy)
 */
export function cloneTask(task: Task): Task {
	return {
		...task,
		children: task.children.map((child) => cloneTask(child)),
		config: { ...task.config },
		state: { ...task.state },
		results: [...task.results],
		errors: [...task.errors],
		metadata: task.metadata ? { ...task.metadata } : undefined
	};
}

/**
 * Flatten task tree to array (breadth-first)
 */
export function flattenTree(root: Task): Task[] {
	const result: Task[] = [];
	const queue: Task[] = [root];

	while (queue.length > 0) {
		const task = queue.shift()!;
		result.push(task);
		queue.push(...task.children);
	}

	return result;
}

/**
 * Get task tree depth (max depth)
 */
export function getTreeDepth(task: Task): number {
	if (task.isLeaf) return task.depth;

	let maxDepth = task.depth;
	for (const child of task.children) {
		maxDepth = Math.max(maxDepth, getTreeDepth(child));
	}
	return maxDepth;
}

/**
 * Check if task is ancestor of another task
 */
export function isAncestor(ancestor: Task, descendant: Task): boolean {
	return descendant.path.includes(ancestor.id);
}

/**
 * Get all descendants of a task
 */
export function getDescendants(task: Task): Task[] {
	const descendants: Task[] = [];

	function collect(t: Task) {
		for (const child of t.children) {
			descendants.push(child);
			collect(child);
		}
	}

	collect(task);
	return descendants;
}
