/**
 * Merkle Hash Web Worker
 *
 * Offloads SHA-256 hash computation to a background thread
 * to prevent UI blocking during large task tree creation.
 *
 * Usage:
 * - Send leaf data to compute hashes
 * - Receive computed hashes and Merkle root
 */

// ============================================================================
// Types
// ============================================================================

interface LeafData {
	id: string;
	data: unknown;
}

interface WorkerMessage {
	type: 'computeHashes' | 'buildRoot';
	leaves?: LeafData[];
	hashes?: string[];
}

interface WorkerResponse {
	type: 'hashes' | 'root' | 'error';
	hashes?: string[];
	root?: string;
	error?: string;
}

// ============================================================================
// Hashing Utilities (copied from merkle.ts for worker isolation)
// ============================================================================

function bufferToHex(buffer: ArrayBuffer): string {
	return Array.from(new Uint8Array(buffer))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

async function sha256(data: string): Promise<string> {
	const encoder = new TextEncoder();
	const buffer = encoder.encode(data);
	const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
	return bufferToHex(hashBuffer);
}

async function hashPair(left: string, right: string): Promise<string> {
	const [a, b] = left < right ? [left, right] : [right, left];
	return sha256(a + b);
}

// ============================================================================
// Batch Processing
// ============================================================================

const HASH_BATCH_SIZE = 500;

async function computeLeafHashes(leaves: LeafData[]): Promise<string[]> {
	const hashes: string[] = [];

	for (let i = 0; i < leaves.length; i += HASH_BATCH_SIZE) {
		const batch = leaves.slice(i, i + HASH_BATCH_SIZE);
		const batchHashes = await Promise.all(
			batch.map((leaf) => {
				const dataStr = leaf.data ? JSON.stringify(leaf.data) : '';
				return sha256(leaf.id + dataStr);
			})
		);
		hashes.push(...batchHashes);
	}

	return hashes;
}

async function buildMerkleRoot(leafHashes: string[]): Promise<string> {
	if (leafHashes.length === 0) {
		return sha256('');
	}

	if (leafHashes.length === 1) {
		return leafHashes[0];
	}

	let level = [...leafHashes];

	while (level.length > 1) {
		const pairs: [string, string][] = [];
		for (let i = 0; i < level.length; i += 2) {
			const left = level[i];
			const right = level[i + 1] ?? level[i];
			pairs.push([left, right]);
		}

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

// ============================================================================
// Worker Message Handler
// ============================================================================

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
	const { type, leaves, hashes } = event.data;

	try {
		if (type === 'computeHashes' && leaves) {
			const computedHashes = await computeLeafHashes(leaves);
			const response: WorkerResponse = { type: 'hashes', hashes: computedHashes };
			self.postMessage(response);
		} else if (type === 'buildRoot' && hashes) {
			const root = await buildMerkleRoot(hashes);
			const response: WorkerResponse = { type: 'root', root };
			self.postMessage(response);
		}
	} catch (error) {
		const response: WorkerResponse = {
			type: 'error',
			error: error instanceof Error ? error.message : String(error)
		};
		self.postMessage(response);
	}
};

export type { LeafData, WorkerMessage, WorkerResponse };
