/**
 * IndexedDB Storage Adapter - Unit Tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { IndexedDBStorage, createIndexedDBStorage } from './indexeddb';
import type { TaskRoot, TaskNode } from '../types';

// Helper to create mock TaskRoot
function createMockRoot(id: string, overrides: Partial<TaskRoot> = {}): TaskRoot {
	return {
		id,
		name: `Task ${id}`,
		type: 'test',
		status: 'pending',
		progress: 0,
		concurrency: 1,
		stats: { total: 0, completed: 0, failed: 0 },
		merkleRoot: null,
		createdAt: Date.now(),
		updatedAt: Date.now(),
		...overrides
	};
}

// Helper to create mock TaskNode
function createMockNode(id: string, rootId: string, overrides: Partial<TaskNode> = {}): TaskNode {
	return {
		id,
		rootId,
		parentId: null,
		name: `Node ${id}`,
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
		updatedAt: Date.now(),
		...overrides
	};
}

describe('IndexedDBStorage', () => {
	let storage: IndexedDBStorage;
	const testDbName = `TaskManager_Test_${Date.now()}`;

	beforeEach(async () => {
		storage = new IndexedDBStorage(testDbName);
	});

	afterEach(async () => {
		await storage.clear();
		await storage.close();
	});

	describe('Root Operations', () => {
		describe('saveRoot', () => {
			it('should save a root', async () => {
				const root = createMockRoot('root-1');
				await storage.saveRoot(root);
				const saved = await storage.getRoot('root-1');
				expect(saved).toEqual(root);
			});

			it('should overwrite existing root', async () => {
				const root1 = createMockRoot('root-1', { status: 'pending' });
				await storage.saveRoot(root1);
				const root2 = createMockRoot('root-1', { status: 'running' });
				await storage.saveRoot(root2);
				const saved = await storage.getRoot('root-1');
				expect(saved?.status).toBe('running');
			});
		});

		describe('getRoot', () => {
			it('should return null for non-existent root', async () => {
				const root = await storage.getRoot('non-existent');
				expect(root).toBeNull();
			});
		});

		describe('getAllRoots', () => {
			it('should return empty array when no roots', async () => {
				const roots = await storage.getAllRoots();
				expect(roots).toEqual([]);
			});

			it('should return all roots', async () => {
				await storage.saveRoot(createMockRoot('root-1'));
				await storage.saveRoot(createMockRoot('root-2'));
				await storage.saveRoot(createMockRoot('root-3'));
				const roots = await storage.getAllRoots();
				expect(roots).toHaveLength(3);
			});
		});

		describe('deleteRoot', () => {
			it('should delete a root', async () => {
				await storage.saveRoot(createMockRoot('root-1'));
				await storage.deleteRoot('root-1');
				const root = await storage.getRoot('root-1');
				expect(root).toBeNull();
			});

			it('should not throw for non-existent root', async () => {
				await expect(storage.deleteRoot('non-existent')).resolves.toBeUndefined();
			});
		});
	});

	describe('Node Operations', () => {
		describe('saveNode', () => {
			it('should save a node', async () => {
				const node = createMockNode('node-1', 'root-1');
				await storage.saveNode(node);
				const saved = await storage.getNode('node-1');
				expect(saved).toEqual(node);
			});
		});

		describe('saveNodes', () => {
			it('should save multiple nodes', async () => {
				const nodes = [
					createMockNode('node-1', 'root-1'),
					createMockNode('node-2', 'root-1'),
					createMockNode('node-3', 'root-1')
				];
				await storage.saveNodes(nodes);
				expect(await storage.getNode('node-1')).not.toBeNull();
				expect(await storage.getNode('node-2')).not.toBeNull();
				expect(await storage.getNode('node-3')).not.toBeNull();
			});

			it('should handle empty array', async () => {
				await expect(storage.saveNodes([])).resolves.toBeUndefined();
			});
		});

		describe('getNode', () => {
			it('should return null for non-existent node', async () => {
				const node = await storage.getNode('non-existent');
				expect(node).toBeNull();
			});
		});

		describe('getNodesByRoot', () => {
			it('should return only nodes for specified root', async () => {
				await storage.saveNode(createMockNode('node-1', 'root-1'));
				await storage.saveNode(createMockNode('node-2', 'root-1'));
				await storage.saveNode(createMockNode('node-3', 'root-2'));
				const nodes = await storage.getNodesByRoot('root-1');
				expect(nodes).toHaveLength(2);
				expect(nodes.every((n) => n.rootId === 'root-1')).toBe(true);
			});
		});

		describe('getChildren', () => {
			it('should return children with null parentId', async () => {
				await storage.saveNode(createMockNode('node-1', 'root-1', { parentId: null }));
				await storage.saveNode(createMockNode('node-2', 'root-1', { parentId: null }));
				await storage.saveNode(createMockNode('node-3', 'root-1', { parentId: 'node-1' }));
				const children = await storage.getChildren(null, 'root-1');
				expect(children).toHaveLength(2);
			});

			it('should return children with specific parentId', async () => {
				await storage.saveNode(createMockNode('node-1', 'root-1', { parentId: null }));
				await storage.saveNode(
					createMockNode('node-2', 'root-1', { parentId: 'node-1', index: 0 })
				);
				await storage.saveNode(
					createMockNode('node-3', 'root-1', { parentId: 'node-1', index: 1 })
				);
				const children = await storage.getChildren('node-1', 'root-1');
				expect(children).toHaveLength(2);
			});

			it('should sort children by index', async () => {
				await storage.saveNode(createMockNode('node-2', 'root-1', { parentId: null, index: 1 }));
				await storage.saveNode(createMockNode('node-1', 'root-1', { parentId: null, index: 0 }));
				await storage.saveNode(createMockNode('node-3', 'root-1', { parentId: null, index: 2 }));
				const children = await storage.getChildren(null, 'root-1');
				expect(children[0].id).toBe('node-1');
				expect(children[1].id).toBe('node-2');
				expect(children[2].id).toBe('node-3');
			});
		});

		describe('getLeaves', () => {
			it('should return only leaf nodes', async () => {
				await storage.saveNode(createMockNode('node-1', 'root-1', { isLeaf: false }));
				await storage.saveNode(createMockNode('node-2', 'root-1', { isLeaf: true, index: 0 }));
				await storage.saveNode(createMockNode('node-3', 'root-1', { isLeaf: true, index: 1 }));
				const leaves = await storage.getLeaves('root-1');
				expect(leaves).toHaveLength(2);
				expect(leaves.every((n) => n.isLeaf)).toBe(true);
			});

			it('should sort leaves by index', async () => {
				await storage.saveNode(createMockNode('node-2', 'root-1', { isLeaf: true, index: 1 }));
				await storage.saveNode(createMockNode('node-1', 'root-1', { isLeaf: true, index: 0 }));
				const leaves = await storage.getLeaves('root-1');
				expect(leaves[0].id).toBe('node-1');
				expect(leaves[1].id).toBe('node-2');
			});
		});

		describe('deleteNodesByRoot', () => {
			it('should delete all nodes for a root', async () => {
				await storage.saveNode(createMockNode('node-1', 'root-1'));
				await storage.saveNode(createMockNode('node-2', 'root-1'));
				await storage.saveNode(createMockNode('node-3', 'root-2'));
				await storage.deleteNodesByRoot('root-1');
				expect(await storage.getNodesByRoot('root-1')).toHaveLength(0);
				expect(await storage.getNodesByRoot('root-2')).toHaveLength(1);
			});
		});

		describe('updateNodeStatus', () => {
			it('should update node status', async () => {
				await storage.saveNode(createMockNode('node-1', 'root-1', { status: 'pending' }));
				await storage.updateNodeStatus('node-1', 'running');
				const node = await storage.getNode('node-1');
				expect(node?.status).toBe('running');
			});

			it('should update additional fields', async () => {
				await storage.saveNode(createMockNode('node-1', 'root-1', { progress: 0 }));
				await storage.updateNodeStatus('node-1', 'running', { progress: 50 });
				const node = await storage.getNode('node-1');
				expect(node?.status).toBe('running');
				expect(node?.progress).toBe(50);
			});

			it('should not throw for non-existent node', async () => {
				await expect(storage.updateNodeStatus('non-existent', 'running')).resolves.toBeUndefined();
			});
		});
	});

	describe('Lifecycle', () => {
		describe('close', () => {
			it('should close and allow reopen', async () => {
				await storage.saveRoot(createMockRoot('root-1'));
				await storage.close();
				// Should be able to use again (auto-reconnects)
				const root = await storage.getRoot('root-1');
				expect(root).not.toBeNull();
			});
		});

		describe('clear', () => {
			it('should clear all data', async () => {
				await storage.saveRoot(createMockRoot('root-1'));
				await storage.saveNode(createMockNode('node-1', 'root-1'));
				await storage.clear();
				expect(await storage.getAllRoots()).toHaveLength(0);
				expect(await storage.getNodesByRoot('root-1')).toHaveLength(0);
			});
		});
	});

	describe('Factory Function', () => {
		it('should create instance with default db name', () => {
			const storage = createIndexedDBStorage();
			expect(storage).toBeInstanceOf(IndexedDBStorage);
		});

		it('should create instance with custom db name', () => {
			const storage = createIndexedDBStorage('CustomDB');
			expect(storage).toBeInstanceOf(IndexedDBStorage);
		});
	});

	describe('Database Reuse', () => {
		it('should reuse database connection', async () => {
			await storage.saveRoot(createMockRoot('root-1'));
			await storage.saveRoot(createMockRoot('root-2'));
			await storage.saveRoot(createMockRoot('root-3'));
			const roots = await storage.getAllRoots();
			expect(roots).toHaveLength(3);
		});
	});

	// =========================================================================
	// Data Integrity Tests
	// =========================================================================

	describe('Atomic Operations', () => {
		describe('saveRootWithNodes', () => {
			it('should save root and nodes atomically', async () => {
				const root = createMockRoot('root-1', { stats: { total: 3, completed: 0, failed: 0 } });
				const nodes = [
					createMockNode('node-1', 'root-1', { index: 0 }),
					createMockNode('node-2', 'root-1', { index: 1 }),
					createMockNode('node-3', 'root-1', { index: 2 })
				];

				await storage.saveRootWithNodes(root, nodes);

				const savedRoot = await storage.getRoot('root-1');
				const savedNodes = await storage.getNodesByRoot('root-1');

				expect(savedRoot).not.toBeNull();
				expect(savedNodes).toHaveLength(3);
			});

			it('should handle large batches with _creating flag', async () => {
				// Create more than 1000 nodes to trigger batched saving
				const nodeCount = 1500;
				const root = createMockRoot('root-large', {
					stats: { total: nodeCount, completed: 0, failed: 0 }
				});
				const nodes = Array.from({ length: nodeCount }, (_, i) =>
					createMockNode(`node-${i}`, 'root-large', { index: i })
				);

				await storage.saveRootWithNodes(root, nodes);

				const savedRoot = await storage.getRoot('root-large');
				const savedNodes = await storage.getNodesByRoot('root-large');

				expect(savedRoot).not.toBeNull();
				// After successful save, _creating flag should be removed
				expect(savedRoot?.metadata?._creating).toBeUndefined();
				expect(savedNodes).toHaveLength(nodeCount);
			});

			it('should work with empty nodes array', async () => {
				const root = createMockRoot('root-empty');
				await storage.saveRootWithNodes(root, []);

				const savedRoot = await storage.getRoot('root-empty');
				expect(savedRoot).not.toBeNull();
			});
		});

		describe('deleteRootWithNodes', () => {
			it('should delete root and all nodes atomically', async () => {
				const root = createMockRoot('root-1');
				const nodes = [
					createMockNode('node-1', 'root-1'),
					createMockNode('node-2', 'root-1'),
					createMockNode('node-3', 'root-1')
				];

				await storage.saveRoot(root);
				await storage.saveNodes(nodes);

				// Verify data exists
				expect(await storage.getRoot('root-1')).not.toBeNull();
				expect(await storage.getNodesByRoot('root-1')).toHaveLength(3);

				// Delete atomically
				await storage.deleteRootWithNodes('root-1');

				// Verify everything is deleted
				expect(await storage.getRoot('root-1')).toBeNull();
				expect(await storage.getNodesByRoot('root-1')).toHaveLength(0);
			});

			it('should not affect other roots', async () => {
				await storage.saveRoot(createMockRoot('root-1'));
				await storage.saveRoot(createMockRoot('root-2'));
				await storage.saveNodes([
					createMockNode('node-1', 'root-1'),
					createMockNode('node-2', 'root-2')
				]);

				await storage.deleteRootWithNodes('root-1');

				expect(await storage.getRoot('root-2')).not.toBeNull();
				expect(await storage.getNodesByRoot('root-2')).toHaveLength(1);
			});

			it('should handle non-existent root gracefully', async () => {
				await expect(storage.deleteRootWithNodes('non-existent')).resolves.toBeUndefined();
			});
		});

		describe('getAllNodes', () => {
			it('should return all nodes across all roots', async () => {
				await storage.saveNodes([
					createMockNode('node-1', 'root-1'),
					createMockNode('node-2', 'root-1'),
					createMockNode('node-3', 'root-2'),
					createMockNode('node-4', 'root-3')
				]);

				const allNodes = await storage.getAllNodes();
				expect(allNodes).toHaveLength(4);
			});

			it('should return empty array when no nodes exist', async () => {
				const allNodes = await storage.getAllNodes();
				expect(allNodes).toHaveLength(0);
			});
		});
	});

	describe('Pending Leaf IDs (Crash Recovery)', () => {
		describe('getPendingLeafIds', () => {
			it('should return pending leaf nodes', async () => {
				await storage.saveNodes([
					createMockNode('node-1', 'root-1', { isLeaf: true, status: 'pending' }),
					createMockNode('node-2', 'root-1', { isLeaf: true, status: 'pending' }),
					createMockNode('node-3', 'root-1', { isLeaf: false, status: 'pending' }) // not a leaf
				]);

				const pendingIds = await storage.getPendingLeafIds('root-1');
				expect(pendingIds).toHaveLength(2);
				expect(pendingIds).toContain('node-1');
				expect(pendingIds).toContain('node-2');
			});

			it('should include running status for crash recovery', async () => {
				await storage.saveNodes([
					createMockNode('node-1', 'root-1', { isLeaf: true, status: 'running' }),
					createMockNode('node-2', 'root-1', { isLeaf: true, status: 'pending' })
				]);

				const pendingIds = await storage.getPendingLeafIds('root-1');
				expect(pendingIds).toContain('node-1'); // running should be included
				expect(pendingIds).toContain('node-2');
			});

			it('should include paused status for resume', async () => {
				await storage.saveNodes([
					createMockNode('node-1', 'root-1', { isLeaf: true, status: 'paused' }),
					createMockNode('node-2', 'root-1', { isLeaf: true, status: 'pending' })
				]);

				const pendingIds = await storage.getPendingLeafIds('root-1');
				expect(pendingIds).toContain('node-1'); // paused should be included
				expect(pendingIds).toContain('node-2');
			});

			it('should exclude completed status', async () => {
				await storage.saveNodes([
					createMockNode('node-1', 'root-1', { isLeaf: true, status: 'completed' }),
					createMockNode('node-2', 'root-1', { isLeaf: true, status: 'pending' })
				]);

				const pendingIds = await storage.getPendingLeafIds('root-1');
				expect(pendingIds).not.toContain('node-1');
				expect(pendingIds).toContain('node-2');
			});

			it('should exclude failed status', async () => {
				await storage.saveNodes([
					createMockNode('node-1', 'root-1', { isLeaf: true, status: 'failed' }),
					createMockNode('node-2', 'root-1', { isLeaf: true, status: 'pending' })
				]);

				const pendingIds = await storage.getPendingLeafIds('root-1');
				expect(pendingIds).not.toContain('node-1');
				expect(pendingIds).toContain('node-2');
			});

			it('should exclude cancelled status', async () => {
				await storage.saveNodes([
					createMockNode('node-1', 'root-1', { isLeaf: true, status: 'cancelled' }),
					createMockNode('node-2', 'root-1', { isLeaf: true, status: 'pending' })
				]);

				const pendingIds = await storage.getPendingLeafIds('root-1');
				expect(pendingIds).not.toContain('node-1');
				expect(pendingIds).toContain('node-2');
			});
		});

		describe('getLeafCount', () => {
			it('should return correct leaf count', async () => {
				await storage.saveNodes([
					createMockNode('node-1', 'root-1', { isLeaf: true }),
					createMockNode('node-2', 'root-1', { isLeaf: true }),
					createMockNode('node-3', 'root-1', { isLeaf: false })
				]);

				const count = await storage.getLeafCount('root-1');
				expect(count).toBe(2);
			});
		});

		describe('getPendingLeafCount', () => {
			it('should return correct pending leaf count', async () => {
				await storage.saveNodes([
					createMockNode('node-1', 'root-1', { isLeaf: true, status: 'pending' }),
					createMockNode('node-2', 'root-1', { isLeaf: true, status: 'completed' }),
					createMockNode('node-3', 'root-1', { isLeaf: true, status: 'running' })
				]);

				const count = await storage.getPendingLeafCount('root-1');
				// pending and running should be counted as pending
				expect(count).toBe(2);
			});
		});

		describe('getLeafIds', () => {
			it('should return all leaf IDs', async () => {
				await storage.saveNodes([
					createMockNode('node-1', 'root-1', { isLeaf: true, index: 0 }),
					createMockNode('node-2', 'root-1', { isLeaf: true, index: 1 }),
					createMockNode('node-3', 'root-1', { isLeaf: false })
				]);

				const ids = await storage.getLeafIds('root-1');
				expect(ids).toHaveLength(2);
				expect(ids).toContain('node-1');
				expect(ids).toContain('node-2');
			});
		});
	});

	describe('Orphan Detection', () => {
		it('should detect orphaned nodes without valid root', async () => {
			// Create nodes with valid root
			await storage.saveRoot(createMockRoot('root-1'));
			await storage.saveNodes([
				createMockNode('node-1', 'root-1'),
				createMockNode('node-2', 'root-1')
			]);

			// Create orphaned nodes (root doesn't exist)
			await storage.saveNodes([
				createMockNode('orphan-1', 'non-existent-root'),
				createMockNode('orphan-2', 'non-existent-root')
			]);

			// Get all nodes and roots to find orphans
			const allNodes = await storage.getAllNodes();
			const allRoots = await storage.getAllRoots();
			const validRootIds = new Set(allRoots.map((r) => r.id));

			const orphanedNodes = allNodes.filter((n) => !validRootIds.has(n.rootId));

			expect(orphanedNodes).toHaveLength(2);
			expect(orphanedNodes.map((n) => n.id).sort()).toEqual(['orphan-1', 'orphan-2']);
		});
	});

	describe('Incomplete Save Detection', () => {
		it('should detect roots with _creating flag', async () => {
			const completeRoot = createMockRoot('root-complete');
			const incompleteRoot = createMockRoot('root-incomplete', {
				metadata: { _creating: true }
			});

			await storage.saveRoot(completeRoot);
			await storage.saveRoot(incompleteRoot);

			const allRoots = await storage.getAllRoots();
			const incompleteRoots = allRoots.filter((r) => r.metadata?._creating);

			expect(incompleteRoots).toHaveLength(1);
			expect(incompleteRoots[0].id).toBe('root-incomplete');
		});
	});

	describe('Connection Recovery', () => {
		it('should recover after connection close', async () => {
			await storage.saveRoot(createMockRoot('root-1'));
			await storage.close();

			// Should auto-reconnect on next operation
			const root = await storage.getRoot('root-1');
			expect(root).not.toBeNull();
		});

		it('should handle multiple close/reopen cycles', async () => {
			for (let i = 0; i < 3; i++) {
				await storage.saveRoot(createMockRoot(`root-${i}`));
				await storage.close();
			}

			const roots = await storage.getAllRoots();
			expect(roots).toHaveLength(3);
		});
	});
});
