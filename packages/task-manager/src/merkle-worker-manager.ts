/**
 * Merkle Worker Manager
 *
 * Manages Web Worker for background hash computation.
 * Provides a simple async interface and handles worker lifecycle.
 */

import type { LeafData, WorkerMessage, WorkerResponse } from './merkle-worker';
import type { TaskNode } from './types';

// ============================================================================
// Worker Manager
// ============================================================================

let worker: Worker | null = null;
let workerUrl: string | null = null;

/**
 * Get or create the hash worker
 * Uses inline worker creation for portability
 */
function getWorker(): Worker {
	if (worker) return worker;

	// Create inline worker from source
	const workerCode = `
// Hashing utilities
function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function sha256(data) {
  const encoder = new TextEncoder();
  const buffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  return bufferToHex(hashBuffer);
}

async function hashPair(left, right) {
  const [a, b] = left < right ? [left, right] : [right, left];
  return sha256(a + b);
}

const HASH_BATCH_SIZE = 500;

async function computeLeafHashes(leaves) {
  const hashes = [];
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

async function buildMerkleRoot(leafHashes) {
  if (leafHashes.length === 0) return sha256('');
  if (leafHashes.length === 1) return leafHashes[0];

  let level = [...leafHashes];
  while (level.length > 1) {
    const pairs = [];
    for (let i = 0; i < level.length; i += 2) {
      const left = level[i];
      const right = level[i + 1] ?? level[i];
      pairs.push([left, right]);
    }
    const nextLevel = [];
    for (let i = 0; i < pairs.length; i += HASH_BATCH_SIZE) {
      const batch = pairs.slice(i, i + HASH_BATCH_SIZE);
      const hashes = await Promise.all(batch.map(([l, r]) => hashPair(l, r)));
      nextLevel.push(...hashes);
    }
    level = nextLevel;
  }
  return level[0];
}

self.onmessage = async (event) => {
  const { type, leaves, hashes } = event.data;
  try {
    if (type === 'computeHashes' && leaves) {
      const computedHashes = await computeLeafHashes(leaves);
      self.postMessage({ type: 'hashes', hashes: computedHashes });
    } else if (type === 'buildRoot' && hashes) {
      const root = await buildMerkleRoot(hashes);
      self.postMessage({ type: 'root', root });
    }
  } catch (error) {
    self.postMessage({ type: 'error', error: error.message || String(error) });
  }
};
`;

	const blob = new Blob([workerCode], { type: 'application/javascript' });
	workerUrl = URL.createObjectURL(blob);
	worker = new Worker(workerUrl);

	return worker;
}

/**
 * Terminate the worker and clean up
 */
export function terminateWorker(): void {
	if (worker) {
		worker.terminate();
		worker = null;
	}
	if (workerUrl) {
		URL.revokeObjectURL(workerUrl);
		workerUrl = null;
	}
}

/**
 * Check if Web Workers are supported
 */
export function isWorkerSupported(): boolean {
	return typeof Worker !== 'undefined';
}

// ============================================================================
// Async API
// ============================================================================

/**
 * Compute leaf hashes using Web Worker
 */
export function computeHashesInWorker(leaves: TaskNode[]): Promise<string[]> {
	return new Promise((resolve, reject) => {
		if (!isWorkerSupported()) {
			reject(new Error('Web Workers not supported'));
			return;
		}

		const w = getWorker();

		const handleMessage = (event: MessageEvent<WorkerResponse>) => {
			w.removeEventListener('message', handleMessage);
			w.removeEventListener('error', handleError);

			if (event.data.type === 'error') {
				reject(new Error(event.data.error));
			} else if (event.data.type === 'hashes' && event.data.hashes) {
				resolve(event.data.hashes);
			}
		};

		const handleError = (error: ErrorEvent) => {
			w.removeEventListener('message', handleMessage);
			w.removeEventListener('error', handleError);
			reject(new Error(error.message));
		};

		w.addEventListener('message', handleMessage);
		w.addEventListener('error', handleError);

		// Convert TaskNodes to LeafData for worker
		const leafData: LeafData[] = leaves.map((node) => ({
			id: node.id,
			data: node.data
		}));

		const message: WorkerMessage = { type: 'computeHashes', leaves: leafData };
		w.postMessage(message);
	});
}

/**
 * Build Merkle root using Web Worker
 */
export function buildRootInWorker(hashes: string[]): Promise<string> {
	return new Promise((resolve, reject) => {
		if (!isWorkerSupported()) {
			reject(new Error('Web Workers not supported'));
			return;
		}

		const w = getWorker();

		const handleMessage = (event: MessageEvent<WorkerResponse>) => {
			w.removeEventListener('message', handleMessage);
			w.removeEventListener('error', handleError);

			if (event.data.type === 'error') {
				reject(new Error(event.data.error));
			} else if (event.data.type === 'root' && event.data.root) {
				resolve(event.data.root);
			}
		};

		const handleError = (error: ErrorEvent) => {
			w.removeEventListener('message', handleMessage);
			w.removeEventListener('error', handleError);
			reject(new Error(error.message));
		};

		w.addEventListener('message', handleMessage);
		w.addEventListener('error', handleError);

		const message: WorkerMessage = { type: 'buildRoot', hashes };
		w.postMessage(message);
	});
}

/**
 * Compute hashes and build Merkle root in one call
 * Returns both the leaf hashes and the root
 */
export async function computeMerkleInWorker(
	leaves: TaskNode[]
): Promise<{ hashes: string[]; root: string | null }> {
	if (leaves.length === 0) {
		return { hashes: [], root: null };
	}

	const hashes = await computeHashesInWorker(leaves);
	const root = await buildRootInWorker(hashes);

	return { hashes, root };
}
