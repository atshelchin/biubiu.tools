/**
 * Merkle Tree Utilities - Unit Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
	computeLeafHash,
	computeDataHash,
	buildMerkleRoot,
	buildMerkleTreeFromNodes,
	generateProof,
	generateMerkleProof,
	verifyProof,
	verifyMerkleProof,
	verifyLeafNode,
	rootsEqual,
	getMerkleTreeDepth,
	getMerkleTreeNodeCount
} from './merkle';
import type { TaskNode } from './types';

// Helper to create mock TaskNode
function createMockLeaf(id: string, data: unknown): TaskNode {
	return {
		id,
		rootId: 'root-1',
		parentId: null,
		name: `Task ${id}`,
		status: 'pending',
		progress: 0,
		mode: 'progressive',
		depth: 0,
		index: 0,
		isLeaf: true,
		childCount: 0,
		hash: '',
		data,
		attempts: 0,
		maxAttempts: 3,
		createdAt: Date.now(),
		updatedAt: Date.now()
	};
}

describe('Merkle Tree Utilities', () => {
	describe('computeLeafHash', () => {
		it('should compute consistent hash for same node', async () => {
			const node = createMockLeaf('leaf-1', { address: '0x123', amount: 100 });
			const hash1 = await computeLeafHash(node);
			const hash2 = await computeLeafHash(node);
			expect(hash1).toBe(hash2);
		});

		it('should compute different hash for different data', async () => {
			const node1 = createMockLeaf('leaf-1', { address: '0x123' });
			const node2 = createMockLeaf('leaf-1', { address: '0x456' });
			const hash1 = await computeLeafHash(node1);
			const hash2 = await computeLeafHash(node2);
			expect(hash1).not.toBe(hash2);
		});

		it('should compute different hash for different ids', async () => {
			const node1 = createMockLeaf('leaf-1', { address: '0x123' });
			const node2 = createMockLeaf('leaf-2', { address: '0x123' });
			const hash1 = await computeLeafHash(node1);
			const hash2 = await computeLeafHash(node2);
			expect(hash1).not.toBe(hash2);
		});

		it('should handle node without data', async () => {
			const node = createMockLeaf('leaf-1', undefined);
			const hash = await computeLeafHash(node);
			expect(hash).toBeTruthy();
			expect(typeof hash).toBe('string');
			expect(hash.length).toBe(64); // SHA-256 = 32 bytes = 64 hex chars
		});
	});

	describe('computeDataHash', () => {
		it('should compute hash from id and data', async () => {
			const hash = await computeDataHash('leaf-1', { address: '0x123' });
			expect(hash).toBeTruthy();
			expect(hash.length).toBe(64);
		});

		it('should match computeLeafHash for same inputs', async () => {
			const data = { address: '0x123', amount: 100 };
			const node = createMockLeaf('leaf-1', data);
			const hashFromNode = await computeLeafHash(node);
			const hashFromData = await computeDataHash('leaf-1', data);
			expect(hashFromNode).toBe(hashFromData);
		});

		it('should handle null data', async () => {
			const hash = await computeDataHash('leaf-1', null);
			expect(hash).toBeTruthy();
		});
	});

	describe('buildMerkleRoot', () => {
		it('should return empty hash for empty array', async () => {
			const root = await buildMerkleRoot([]);
			expect(root).toBeTruthy();
		});

		it('should return leaf hash for single leaf', async () => {
			const leafHash = 'abc123def456789012345678901234567890123456789012345678901234';
			const root = await buildMerkleRoot([leafHash]);
			expect(root).toBe(leafHash);
		});

		it('should compute root for two leaves', async () => {
			const hash1 = await computeDataHash('leaf-1', { a: 1 });
			const hash2 = await computeDataHash('leaf-2', { a: 2 });
			const root = await buildMerkleRoot([hash1, hash2]);
			expect(root).toBeTruthy();
			expect(root).not.toBe(hash1);
			expect(root).not.toBe(hash2);
		});

		it('should compute consistent root for same leaves', async () => {
			const hashes = [
				await computeDataHash('leaf-1', { a: 1 }),
				await computeDataHash('leaf-2', { a: 2 }),
				await computeDataHash('leaf-3', { a: 3 })
			];
			const root1 = await buildMerkleRoot(hashes);
			const root2 = await buildMerkleRoot(hashes);
			expect(root1).toBe(root2);
		});

		it('should handle odd number of leaves', async () => {
			const hashes = [
				await computeDataHash('leaf-1', { a: 1 }),
				await computeDataHash('leaf-2', { a: 2 }),
				await computeDataHash('leaf-3', { a: 3 })
			];
			const root = await buildMerkleRoot(hashes);
			expect(root).toBeTruthy();
			expect(root.length).toBe(64);
		});

		it('should compute different root for different leaves', async () => {
			const hashes1 = [
				await computeDataHash('leaf-1', { a: 1 }),
				await computeDataHash('leaf-2', { a: 2 })
			];
			const hashes2 = [
				await computeDataHash('leaf-1', { a: 1 }),
				await computeDataHash('leaf-3', { a: 3 })
			];
			const root1 = await buildMerkleRoot(hashes1);
			const root2 = await buildMerkleRoot(hashes2);
			expect(root1).not.toBe(root2);
		});

		it('should handle large number of leaves', async () => {
			const hashes = await Promise.all(
				Array.from({ length: 100 }, (_, i) => computeDataHash(`leaf-${i}`, { index: i }))
			);
			const root = await buildMerkleRoot(hashes);
			expect(root).toBeTruthy();
			expect(root.length).toBe(64);
		});
	});

	describe('buildMerkleTreeFromNodes', () => {
		it('should build tree from leaf nodes', async () => {
			const leaves = [
				createMockLeaf('leaf-1', { a: 1 }),
				createMockLeaf('leaf-2', { a: 2 }),
				createMockLeaf('leaf-3', { a: 3 })
			];
			const root = await buildMerkleTreeFromNodes(leaves);
			expect(root).toBeTruthy();
			expect(root.length).toBe(64);
		});

		it('should return consistent root for same nodes', async () => {
			const leaves = [createMockLeaf('leaf-1', { a: 1 }), createMockLeaf('leaf-2', { a: 2 })];
			const root1 = await buildMerkleTreeFromNodes(leaves);
			const root2 = await buildMerkleTreeFromNodes(leaves);
			expect(root1).toBe(root2);
		});
	});

	describe('generateProof', () => {
		it('should generate empty proof for single leaf', async () => {
			const hashes = [await computeDataHash('leaf-1', { a: 1 })];
			const proof = await generateProof(hashes, 0);
			expect(proof).toEqual([]);
		});

		it('should generate proof for two leaves', async () => {
			const hashes = [
				await computeDataHash('leaf-1', { a: 1 }),
				await computeDataHash('leaf-2', { a: 2 })
			];
			const proof0 = await generateProof(hashes, 0);
			const proof1 = await generateProof(hashes, 1);
			expect(proof0).toHaveLength(1);
			expect(proof1).toHaveLength(1);
			expect(proof0[0]).toBe(hashes[1]);
			expect(proof1[0]).toBe(hashes[0]);
		});

		it('should generate proof for larger tree', async () => {
			const hashes = await Promise.all(
				Array.from({ length: 8 }, (_, i) => computeDataHash(`leaf-${i}`, { index: i }))
			);
			const proof = await generateProof(hashes, 3);
			// For 8 leaves (depth 3), proof should have 3 elements
			expect(proof).toHaveLength(3);
		});

		it('should throw for invalid index', async () => {
			const hashes = [await computeDataHash('leaf-1', { a: 1 })];
			await expect(generateProof(hashes, -1)).rejects.toThrow();
			await expect(generateProof(hashes, 1)).rejects.toThrow();
		});
	});

	describe('generateMerkleProof', () => {
		it('should generate full proof object', async () => {
			const leaves = [
				createMockLeaf('leaf-1', { a: 1 }),
				createMockLeaf('leaf-2', { a: 2 }),
				createMockLeaf('leaf-3', { a: 3 })
			];
			const proof = await generateMerkleProof(leaves, 'leaf-2');
			expect(proof).not.toBeNull();
			expect(proof!.leaf).toBeTruthy();
			expect(proof!.proof).toBeInstanceOf(Array);
			expect(proof!.root).toBeTruthy();
		});

		it('should return null for non-existent leaf', async () => {
			const leaves = [createMockLeaf('leaf-1', { a: 1 })];
			const proof = await generateMerkleProof(leaves, 'leaf-999');
			expect(proof).toBeNull();
		});
	});

	describe('verifyProof', () => {
		it('should verify valid proof for two leaves', async () => {
			const hashes = [
				await computeDataHash('leaf-1', { a: 1 }),
				await computeDataHash('leaf-2', { a: 2 })
			];
			const root = await buildMerkleRoot(hashes);
			const proof = await generateProof(hashes, 0);
			const isValid = await verifyProof(hashes[0], proof, root);
			expect(isValid).toBe(true);
		});

		it('should verify valid proof for larger tree', async () => {
			const hashes = await Promise.all(
				Array.from({ length: 8 }, (_, i) => computeDataHash(`leaf-${i}`, { index: i }))
			);
			const root = await buildMerkleRoot(hashes);

			for (let i = 0; i < hashes.length; i++) {
				const proof = await generateProof(hashes, i);
				const isValid = await verifyProof(hashes[i], proof, root);
				expect(isValid).toBe(true);
			}
		});

		it('should reject invalid proof', async () => {
			const hashes = [
				await computeDataHash('leaf-1', { a: 1 }),
				await computeDataHash('leaf-2', { a: 2 })
			];
			const root = await buildMerkleRoot(hashes);
			const proof = await generateProof(hashes, 0);
			// Use wrong leaf
			const isValid = await verifyProof(hashes[1], proof, root);
			expect(isValid).toBe(false);
		});

		it('should reject tampered proof', async () => {
			const hashes = [
				await computeDataHash('leaf-1', { a: 1 }),
				await computeDataHash('leaf-2', { a: 2 })
			];
			const root = await buildMerkleRoot(hashes);
			const proof = await generateProof(hashes, 0);
			// Tamper with proof
			const tamperedProof = ['0000000000000000000000000000000000000000000000000000000000000000'];
			const isValid = await verifyProof(hashes[0], tamperedProof, root);
			expect(isValid).toBe(false);
		});

		it('should reject wrong root', async () => {
			const hashes = [
				await computeDataHash('leaf-1', { a: 1 }),
				await computeDataHash('leaf-2', { a: 2 })
			];
			const proof = await generateProof(hashes, 0);
			const wrongRoot = '0000000000000000000000000000000000000000000000000000000000000000';
			const isValid = await verifyProof(hashes[0], proof, wrongRoot);
			expect(isValid).toBe(false);
		});
	});

	describe('verifyMerkleProof', () => {
		it('should verify full proof object', async () => {
			const leaves = [
				createMockLeaf('leaf-1', { a: 1 }),
				createMockLeaf('leaf-2', { a: 2 }),
				createMockLeaf('leaf-3', { a: 3 }),
				createMockLeaf('leaf-4', { a: 4 })
			];
			const proof = await generateMerkleProof(leaves, 'leaf-3');
			expect(proof).not.toBeNull();
			const isValid = await verifyMerkleProof(proof!);
			expect(isValid).toBe(true);
		});
	});

	describe('verifyLeafNode', () => {
		it('should verify leaf node with proof', async () => {
			const leaves = [createMockLeaf('leaf-1', { a: 1 }), createMockLeaf('leaf-2', { a: 2 })];
			const hashes = await Promise.all(leaves.map(computeLeafHash));
			const root = await buildMerkleRoot(hashes);
			const proof = await generateProof(hashes, 1);

			const isValid = await verifyLeafNode(leaves[1], proof, root);
			expect(isValid).toBe(true);
		});

		it('should reject node with wrong data', async () => {
			const leaves = [createMockLeaf('leaf-1', { a: 1 }), createMockLeaf('leaf-2', { a: 2 })];
			const hashes = await Promise.all(leaves.map(computeLeafHash));
			const root = await buildMerkleRoot(hashes);
			const proof = await generateProof(hashes, 1);

			// Create a tampered node
			const tamperedNode = createMockLeaf('leaf-2', { a: 999 });
			const isValid = await verifyLeafNode(tamperedNode, proof, root);
			expect(isValid).toBe(false);
		});
	});

	describe('rootsEqual', () => {
		it('should return true for equal roots', () => {
			expect(rootsEqual('abc123', 'abc123')).toBe(true);
		});

		it('should return false for different roots', () => {
			expect(rootsEqual('abc123', 'def456')).toBe(false);
		});

		it('should handle null values', () => {
			expect(rootsEqual(null, null)).toBe(true);
			expect(rootsEqual('abc123', null)).toBe(false);
			expect(rootsEqual(null, 'abc123')).toBe(false);
		});
	});

	describe('getMerkleTreeDepth', () => {
		it('should return 0 for 0 or 1 leaves', () => {
			expect(getMerkleTreeDepth(0)).toBe(0);
			expect(getMerkleTreeDepth(1)).toBe(0);
		});

		it('should return correct depth', () => {
			expect(getMerkleTreeDepth(2)).toBe(1);
			expect(getMerkleTreeDepth(3)).toBe(2);
			expect(getMerkleTreeDepth(4)).toBe(2);
			expect(getMerkleTreeDepth(5)).toBe(3);
			expect(getMerkleTreeDepth(8)).toBe(3);
			expect(getMerkleTreeDepth(9)).toBe(4);
			expect(getMerkleTreeDepth(16)).toBe(4);
		});
	});

	describe('getMerkleTreeNodeCount', () => {
		it('should return 0 for 0 leaves', () => {
			expect(getMerkleTreeNodeCount(0)).toBe(0);
		});

		it('should return correct node count', () => {
			expect(getMerkleTreeNodeCount(1)).toBe(1);
			expect(getMerkleTreeNodeCount(2)).toBe(3);
			expect(getMerkleTreeNodeCount(4)).toBe(7);
			expect(getMerkleTreeNodeCount(8)).toBe(15);
		});
	});
});
