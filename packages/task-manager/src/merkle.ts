/**
 * Merkle Tree Utilities
 *
 * Provides cryptographic verification for task trees:
 * - Compute leaf hashes from task data
 * - Build Merkle tree from leaves
 * - Generate and verify proofs
 *
 * Uses Web Crypto API for SHA-256 hashing (browser compatible)
 */

import type { TaskNode, MerkleProof } from './types';

// ============================================================================
// Hashing Utilities
// ============================================================================

/**
 * Convert ArrayBuffer to hex string
 */
function bufferToHex(buffer: ArrayBuffer): string {
	return Array.from(new Uint8Array(buffer))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

/**
 * Hash a string using SHA-256
 */
async function sha256(data: string): Promise<string> {
	const encoder = new TextEncoder();
	const buffer = encoder.encode(data);
	const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
	return bufferToHex(hashBuffer);
}

/**
 * Hash two hashes together (for internal nodes)
 * Sorts them first for consistent ordering
 */
async function hashPair(left: string, right: string): Promise<string> {
	// Sort to ensure consistent ordering regardless of tree structure
	const [a, b] = left < right ? [left, right] : [right, left];
	return sha256(a + b);
}

// ============================================================================
// Leaf Hashing
// ============================================================================

/**
 * Compute hash for a leaf node
 * Hash = SHA256(id + JSON(data))
 */
export async function computeLeafHash<T>(node: TaskNode<T>): Promise<string> {
	const dataStr = node.data ? JSON.stringify(node.data) : '';
	return sha256(node.id + dataStr);
}

/**
 * Compute hash for a leaf node from raw data
 * Useful for verification without full node
 */
export async function computeDataHash(id: string, data: unknown): Promise<string> {
	const dataStr = data ? JSON.stringify(data) : '';
	return sha256(id + dataStr);
}

// ============================================================================
// Batch Processing Constants
// ============================================================================

/**
 * Batch size for parallel hash computation
 * Balances memory usage vs speed
 */
const HASH_BATCH_SIZE = 500;

// ============================================================================
// Merkle Tree Building
// ============================================================================

/**
 * Build Merkle tree and return root hash
 * Takes an array of leaf hashes (already computed)
 *
 * For a tree with leaves [A, B, C, D]:
 *          Root
 *         /    \
 *       AB      CD
 *      /  \    /  \
 *     A    B  C    D
 *
 * If odd number of leaves, last leaf is duplicated
 *
 * Optimized: Uses parallel batch processing for large trees
 */
export async function buildMerkleRoot(leafHashes: string[]): Promise<string> {
	if (leafHashes.length === 0) {
		return sha256(''); // Empty tree
	}

	if (leafHashes.length === 1) {
		return leafHashes[0];
	}

	let level = [...leafHashes];

	while (level.length > 1) {
		// Build pairs
		const pairs: [string, string][] = [];
		for (let i = 0; i < level.length; i += 2) {
			const left = level[i];
			const right = level[i + 1] ?? level[i];
			pairs.push([left, right]);
		}

		// Process in batches to avoid memory spikes
		const nextLevel: string[] = [];
		for (let i = 0; i < pairs.length; i += HASH_BATCH_SIZE) {
			const batch = pairs.slice(i, i + HASH_BATCH_SIZE);
			const hashes = await Promise.all(batch.map(([l, r]) => hashPair(l, r)));
			nextLevel.push(...hashes);
		}

		level = nextLevel;
	}

	return level[0];
}

/**
 * Compute leaf hashes in batches to avoid memory spikes
 * Returns an array of hashes in the same order as input leaves
 */
export async function computeLeafHashesBatched<T>(leaves: TaskNode<T>[]): Promise<string[]> {
	const hashes: string[] = [];

	for (let i = 0; i < leaves.length; i += HASH_BATCH_SIZE) {
		const batch = leaves.slice(i, i + HASH_BATCH_SIZE);
		const batchHashes = await Promise.all(batch.map(computeLeafHash));
		hashes.push(...batchHashes);
	}

	return hashes;
}

/**
 * Build Merkle tree from leaf nodes
 * Computes hashes for each leaf, then builds the tree
 * Optimized: Uses batched hash computation
 */
export async function buildMerkleTreeFromNodes(leaves: TaskNode[]): Promise<string> {
	const hashes = await computeLeafHashesBatched(leaves);
	return buildMerkleRoot(hashes);
}

// ============================================================================
// Proof Generation
// ============================================================================

/**
 * Generate Merkle proof for a leaf at given index
 *
 * Returns array of sibling hashes from leaf to root
 * Each element is the sibling needed to compute the parent
 */
export async function generateProof(leafHashes: string[], leafIndex: number): Promise<string[]> {
	if (leafIndex < 0 || leafIndex >= leafHashes.length) {
		throw new Error(`Invalid leaf index: ${leafIndex}`);
	}

	if (leafHashes.length === 1) {
		return []; // No proof needed for single leaf
	}

	const proof: string[] = [];
	let level = [...leafHashes];
	let index = leafIndex;

	while (level.length > 1) {
		const nextLevel: string[] = [];

		for (let i = 0; i < level.length; i += 2) {
			const left = level[i];
			const right = level[i + 1] ?? level[i];

			// If current index is in this pair, add sibling to proof
			if (i === index || i + 1 === index) {
				const sibling = i === index ? right : left;
				proof.push(sibling);
			}

			nextLevel.push(await hashPair(left, right));
		}

		// Update index for next level
		index = Math.floor(index / 2);
		level = nextLevel;
	}

	return proof;
}

/**
 * Generate full Merkle proof object for a leaf
 */
export async function generateMerkleProof(
	leaves: TaskNode[],
	leafId: string
): Promise<MerkleProof | null> {
	const leafIndex = leaves.findIndex((l) => l.id === leafId);
	if (leafIndex === -1) return null;

	const hashes = await Promise.all(leaves.map(computeLeafHash));
	const root = await buildMerkleRoot(hashes);
	const proof = await generateProof(hashes, leafIndex);

	return {
		leaf: hashes[leafIndex],
		proof,
		root
	};
}

// ============================================================================
// Proof Verification
// ============================================================================

/**
 * Verify a Merkle proof
 *
 * Given:
 * - leaf: The leaf hash
 * - proof: Array of sibling hashes
 * - root: The expected root hash
 *
 * Returns true if the proof is valid
 */
export async function verifyProof(leaf: string, proof: string[], root: string): Promise<boolean> {
	let current = leaf;

	for (const sibling of proof) {
		current = await hashPair(current, sibling);
	}

	return current === root;
}

/**
 * Verify a full Merkle proof object
 */
export async function verifyMerkleProof(proof: MerkleProof): Promise<boolean> {
	return verifyProof(proof.leaf, proof.proof, proof.root);
}

/**
 * Verify a leaf node against a root hash
 */
export async function verifyLeafNode(
	node: TaskNode,
	proof: string[],
	root: string
): Promise<boolean> {
	const leafHash = await computeLeafHash(node);
	return verifyProof(leafHash, proof, root);
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Check if two Merkle roots are equal
 */
export function rootsEqual(root1: string | null, root2: string | null): boolean {
	return root1 === root2;
}

/**
 * Get the depth of a Merkle tree given number of leaves
 */
export function getMerkleTreeDepth(leafCount: number): number {
	if (leafCount <= 1) return 0;
	return Math.ceil(Math.log2(leafCount));
}

/**
 * Get the number of nodes in a complete Merkle tree
 */
export function getMerkleTreeNodeCount(leafCount: number): number {
	if (leafCount <= 0) return 0;
	// Complete binary tree: 2n - 1 nodes for n leaves
	// But we may have duplicated leaves for odd counts
	const depth = getMerkleTreeDepth(leafCount);
	const fullLeaves = Math.pow(2, depth);
	return 2 * fullLeaves - 1;
}
