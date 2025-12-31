/**
 * Membership Verifier Composable
 *
 * Provides a simple API to use the membership verification worker.
 * Verifies that cached membership data matches on-chain state.
 */

import type { Address } from 'viem';
import type {
	VerifyRequest,
	VerifyResponse,
	VerifyAllRequest,
	VerifyAllResponse
} from '../workers/membership-verifier.worker';
import { getConfig } from '../config';

let worker: Worker | null = null;
const pendingRequests = new Map<
	string,
	{
		resolve: (value: VerifyResponse) => void;
		reject: (error: Error) => void;
	}
>();

/**
 * Get or create the worker instance
 */
function getWorker(): Worker {
	if (!worker) {
		worker = new Worker(new URL('../workers/membership-verifier.worker.js', import.meta.url), {
			type: 'module'
		});

		worker.onmessage = (event: MessageEvent<VerifyResponse | VerifyAllResponse>) => {
			const data = event.data;

			if (data.type === 'verify-result') {
				const key = `${data.address}:${data.chainId}`;
				const pending = pendingRequests.get(key);
				if (pending) {
					pending.resolve(data);
					pendingRequests.delete(key);
				}
			}
		};

		worker.onerror = (error) => {
			console.error('[MembershipVerifier] Worker error:', error);
			// Reject all pending requests
			for (const [key, pending] of pendingRequests) {
				pending.reject(new Error('Worker error'));
				pendingRequests.delete(key);
			}
		};
	}

	return worker;
}

/**
 * Verify cached membership for a single address/chain
 */
export async function verifyMembership(
	address: Address,
	chainId: number,
	rpcUrl: string
): Promise<VerifyResponse> {
	const config = getConfig();

	return new Promise((resolve, reject) => {
		const key = `${address}:${chainId}`;
		pendingRequests.set(key, { resolve, reject });

		const request: VerifyRequest = {
			type: 'verify',
			address,
			chainId,
			rpcUrl,
			// Pass contract config to worker
			contractAddress: config.contract.address,
			contractAbi: config.contract.abi,
			contractFunctionName: config.contract.functionName,
			cacheKeyPrefix: config.cache.membershipKeyPrefix,
			checksumSalt: config.cache.checksumSalt
		};

		getWorker().postMessage(request);

		// Timeout after 30 seconds
		setTimeout(() => {
			if (pendingRequests.has(key)) {
				pendingRequests.delete(key);
				reject(new Error('Verification timeout'));
			}
		}, 30000);
	});
}

/**
 * Verify cached membership for multiple addresses/chains
 */
export async function verifyAllMemberships(
	entries: Array<{
		address: Address;
		chainId: number;
		rpcUrl: string;
	}>
): Promise<VerifyAllResponse['results']> {
	const config = getConfig();

	return new Promise((resolve, reject) => {
		const request: VerifyAllRequest = {
			type: 'verify-all',
			entries,
			// Pass contract config to worker
			contractAddress: config.contract.address,
			contractAbi: config.contract.abi,
			contractFunctionName: config.contract.functionName,
			cacheKeyPrefix: config.cache.membershipKeyPrefix,
			checksumSalt: config.cache.checksumSalt
		};

		const handleMessage = (event: MessageEvent<VerifyAllResponse>) => {
			if (event.data.type === 'verify-all-result') {
				getWorker().removeEventListener('message', handleMessage);
				resolve(event.data.results);
			}
		};

		getWorker().addEventListener('message', handleMessage);
		getWorker().postMessage(request);

		// Timeout after 60 seconds for batch verification
		setTimeout(() => {
			getWorker().removeEventListener('message', handleMessage);
			reject(new Error('Batch verification timeout'));
		}, 60000);
	});
}

/**
 * Terminate the worker (cleanup)
 */
export function terminateVerifier(): void {
	if (worker) {
		worker.terminate();
		worker = null;
		pendingRequests.clear();
	}
}
