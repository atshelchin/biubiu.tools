/**
 * Memory Storage Adapter - Unit Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryStorage, createMemoryStorage } from './memory';
import type { TaskRoot, TaskNode } from '../types';

// Helper to create mock TaskRoot
function createMockRoot(id: string, overrides: Partial<TaskRoot> = {}): TaskRoot {
	return {
		id,
		name: `Task ${id}`,
		type: 'test',
		status: 'pending',
		progress: 0,
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

describe('MemoryStorage', () => {
	let storage: MemoryStorage;

	beforeEach(() => {
		storage = new MemoryStorage();
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
				const root2 = createMockRoot('root-1', { status: 'running' });
				await storage.saveRoot(root1);
				await storage.saveRoot(root2);
				const saved = await storage.getRoot('root-1');
				expect(saved?.status).toBe('running');
			});

			it('should create a copy (not reference)', async () => {
				const root = createMockRoot('root-1');
				await storage.saveRoot(root);
				root.status = 'completed';
				const saved = await storage.getRoot('root-1');
				expect(saved?.status).toBe('pending');
			});
		});

		describe('getRoot', () => {
			it('should return null for non-existent root', async () => {
				const root = await storage.getRoot('non-existent');
				expect(root).toBeNull();
			});

			it('should return a copy (not reference)', async () => {
				const root = createMockRoot('root-1');
				await storage.saveRoot(root);
				const saved1 = await storage.getRoot('root-1');
				const saved2 = await storage.getRoot('root-1');
				expect(saved1).toEqual(saved2);
				expect(saved1).not.toBe(saved2);
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

			it('should return copies (not references)', async () => {
				await storage.saveRoot(createMockRoot('root-1'));
				const roots1 = await storage.getAllRoots();
				const roots2 = await storage.getAllRoots();
				expect(roots1[0]).toEqual(roots2[0]);
				expect(roots1[0]).not.toBe(roots2[0]);
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

			it('should overwrite existing node', async () => {
				const node1 = createMockNode('node-1', 'root-1', { progress: 0 });
				const node2 = createMockNode('node-1', 'root-1', { progress: 50 });
				await storage.saveNode(node1);
				await storage.saveNode(node2);
				const saved = await storage.getNode('node-1');
				expect(saved?.progress).toBe(50);
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
			it('should return empty array when no nodes', async () => {
				const nodes = await storage.getNodesByRoot('root-1');
				expect(nodes).toEqual([]);
			});

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
				await storage.saveNode(createMockNode('node-1', 'root-1', { parentId: null, index: 0 }));
				await storage.saveNode(createMockNode('node-2', 'root-1', { parentId: null, index: 1 }));
				await storage.saveNode(createMockNode('node-3', 'root-1', { parentId: 'node-1', index: 0 }));
				const children = await storage.getChildren(null, 'root-1');
				expect(children).toHaveLength(2);
			});

			it('should return children with specific parentId', async () => {
				await storage.saveNode(createMockNode('node-1', 'root-1', { parentId: null }));
				await storage.saveNode(createMockNode('node-2', 'root-1', { parentId: 'node-1', index: 0 }));
				await storage.saveNode(createMockNode('node-3', 'root-1', { parentId: 'node-1', index: 1 }));
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

			it('should update updatedAt timestamp', async () => {
				const originalTime = Date.now() - 1000;
				await storage.saveNode(createMockNode('node-1', 'root-1', { updatedAt: originalTime }));
				await storage.updateNodeStatus('node-1', 'running');
				const node = await storage.getNode('node-1');
				expect(node?.updatedAt).toBeGreaterThan(originalTime);
			});

			it('should not throw for non-existent node', async () => {
				await expect(storage.updateNodeStatus('non-existent', 'running')).resolves.toBeUndefined();
			});
		});
	});

	describe('Lifecycle', () => {
		describe('close', () => {
			it('should not throw', async () => {
				await expect(storage.close()).resolves.toBeUndefined();
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
		it('should create a new instance', () => {
			const storage = createMemoryStorage();
			expect(storage).toBeInstanceOf(MemoryStorage);
		});
	});
});
