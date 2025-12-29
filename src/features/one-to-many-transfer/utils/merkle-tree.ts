/**
 * Merkle Tree utility for Token Distribution delegated mode
 * Implements a Merkle tree for batch verification in the TokenDistribution contract
 */
import { keccak256, encodeAbiParameters, type Address } from 'viem';

/**
 * Recipient data for merkle tree leaf
 */
export interface MerkleRecipient {
	to: Address;
	value: bigint;
}

/**
 * Batch data for merkle tree
 */
export interface MerkleBatch {
	batchId: number;
	recipients: MerkleRecipient[];
	leaf: `0x${string}`;
	proof: `0x${string}`[];
}

/**
 * Merkle tree result with root and batches
 */
export interface MerkleTreeResult {
	root: `0x${string}`;
	batches: MerkleBatch[];
	totalBatches: number;
}

/**
 * Hash a batch of recipients to create a merkle leaf
 * Matches the contract's _hashBatch function:
 * keccak256(abi.encodePacked(batchId, recipients))
 */
export function hashBatch(batchId: number, recipients: MerkleRecipient[]): `0x${string}` {
	// Encode batchId as uint256
	const batchIdEncoded = encodeAbiParameters([{ type: 'uint256' }], [BigInt(batchId)]);

	// Encode recipients array
	// Each recipient is (address to, uint256 value)
	const recipientsEncoded = encodeAbiParameters(
		[
			{
				type: 'tuple[]',
				components: [
					{ type: 'address', name: 'to' },
					{ type: 'uint256', name: 'value' }
				]
			}
		],
		[recipients.map((r) => ({ to: r.to, value: r.value }))]
	);

	// Concatenate and hash (matching abi.encodePacked behavior for these types)
	const packed = (batchIdEncoded + recipientsEncoded.slice(2)) as `0x${string}`;
	return keccak256(packed);
}

/**
 * Hash two nodes together to create parent node
 * Sorts the nodes to ensure consistent ordering (like OpenZeppelin's StandardMerkleTree)
 */
function hashPair(a: `0x${string}`, b: `0x${string}`): `0x${string}` {
	// Sort nodes to ensure consistent tree structure
	const [left, right] = a < b ? [a, b] : [b, a];
	const packed = (left + right.slice(2)) as `0x${string}`;
	return keccak256(packed);
}

/**
 * Build a Merkle tree from leaves
 * Returns the tree layers (bottom to top) and root
 */
function buildTree(leaves: `0x${string}`[]): {
	layers: `0x${string}`[][];
	root: `0x${string}`;
} {
	if (leaves.length === 0) {
		throw new Error('Cannot create Merkle tree with no leaves');
	}

	if (leaves.length === 1) {
		return {
			layers: [leaves],
			root: leaves[0]
		};
	}

	const layers: `0x${string}`[][] = [[...leaves]];

	while (layers[layers.length - 1].length > 1) {
		const currentLayer = layers[layers.length - 1];
		const nextLayer: `0x${string}`[] = [];

		for (let i = 0; i < currentLayer.length; i += 2) {
			if (i + 1 < currentLayer.length) {
				nextLayer.push(hashPair(currentLayer[i], currentLayer[i + 1]));
			} else {
				// Odd number of nodes - promote the last one
				nextLayer.push(currentLayer[i]);
			}
		}

		layers.push(nextLayer);
	}

	return {
		layers,
		root: layers[layers.length - 1][0]
	};
}

/**
 * Get the proof for a leaf at a given index
 */
function getProof(layers: `0x${string}`[][], index: number): `0x${string}`[] {
	const proof: `0x${string}`[] = [];
	let currentIndex = index;

	for (let i = 0; i < layers.length - 1; i++) {
		const layer = layers[i];
		const isRightNode = currentIndex % 2 === 1;
		const siblingIndex = isRightNode ? currentIndex - 1 : currentIndex + 1;

		if (siblingIndex < layer.length) {
			proof.push(layer[siblingIndex]);
		}

		currentIndex = Math.floor(currentIndex / 2);
	}

	return proof;
}

/**
 * Verify a proof for a leaf
 */
export function verifyProof(
	leaf: `0x${string}`,
	proof: `0x${string}`[],
	root: `0x${string}`
): boolean {
	let computedHash = leaf;

	for (const proofElement of proof) {
		computedHash = hashPair(computedHash, proofElement);
	}

	return computedHash === root;
}

/**
 * Split recipients into batches
 */
export function splitIntoBatches(
	recipients: MerkleRecipient[],
	batchSize: number = 100
): MerkleRecipient[][] {
	const batches: MerkleRecipient[][] = [];

	for (let i = 0; i < recipients.length; i += batchSize) {
		batches.push(recipients.slice(i, i + batchSize));
	}

	return batches;
}

/**
 * Build a Merkle tree for token distribution
 * Takes recipients and batch size, returns root and batch data with proofs
 */
export function buildDistributionMerkleTree(
	recipients: MerkleRecipient[],
	batchSize: number = 100
): MerkleTreeResult {
	// Split into batches
	const recipientBatches = splitIntoBatches(recipients, batchSize);

	// Create leaves for each batch
	const leaves: `0x${string}`[] = [];
	for (let i = 0; i < recipientBatches.length; i++) {
		leaves.push(hashBatch(i, recipientBatches[i]));
	}

	// Build the tree
	const { layers, root } = buildTree(leaves);

	// Create batch data with proofs
	const batches: MerkleBatch[] = recipientBatches.map((recipients, index) => ({
		batchId: index,
		recipients,
		leaf: leaves[index],
		proof: getProof(layers, index)
	}));

	return {
		root,
		batches,
		totalBatches: batches.length
	};
}

/**
 * Calculate total amount from recipients
 */
export function calculateTotalFromRecipients(recipients: MerkleRecipient[]): bigint {
	return recipients.reduce((sum, r) => sum + r.value, BigInt(0));
}

/**
 * Flatten proofs for contract call
 * The contract expects:
 * - proofs: bytes32[] - all proofs concatenated
 * - proofLengths: uint8[] - length of each recipient's proof
 *
 * For batch distribution, all recipients in a batch share the same proof
 */
export function flattenBatchProof(batch: MerkleBatch): {
	proofs: `0x${string}`[];
	proofLengths: number[];
} {
	// All recipients in the batch share the same proof
	const proofLength = batch.proof.length;

	return {
		proofs: batch.proof,
		proofLengths: batch.recipients.map(() => proofLength)
	};
}
