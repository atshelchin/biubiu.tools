// Web Worker for validating and importing private keys in batches
import { privateKeyToAccount } from 'viem/accounts';
import type { Address } from 'viem';

export interface PrivateKeyImportRequest {
	keys: string[];
	batchSize?: number;
}

export interface PrivateKeyImportResult {
	wallets: Array<{
		id: string;
		address: Address;
	}>;
	invalidKeys: string[];
	progress: number;
	done: boolean;
	error?: string;
}

/**
 * Validate and convert a single private key to wallet
 */
function processPrivateKey(key: string): { wallet?: { id: string; address: Address }; isValid: boolean } {
	try {
		const cleanKey = key.startsWith('0x') ? key : `0x${key}`;

		// Validate format
		if (!/^0x[0-9a-fA-F]{64}$/.test(cleanKey)) {
			return { isValid: false };
		}

		const account = privateKeyToAccount(cleanKey as Address);

		return {
			wallet: {
				id: account.address,
				address: account.address
			},
			isValid: true
		};
	} catch {
		return { isValid: false };
	}
}

// Process private key import in batches
self.addEventListener('message', (event: MessageEvent<PrivateKeyImportRequest>) => {
	const { keys, batchSize = 100 } = event.data;
	const wallets: PrivateKeyImportResult['wallets'] = [];
	const invalidKeys: string[] = [];

	let processed = 0;
	const total = keys.length;

	// Process keys in batches to provide progress updates
	function processBatch(startIndex: number) {
		const endIndex = Math.min(startIndex + batchSize, total);

		for (let i = startIndex; i < endIndex; i++) {
			const key = keys[i].trim();
			if (!key) continue;

			const result = processPrivateKey(key);
			if (result.isValid && result.wallet) {
				wallets.push(result.wallet);
			} else {
				invalidKeys.push(key);
			}
			processed++;
		}

		// Send progress update
		const progress = (processed / total) * 100;
		const done = processed === total;

		self.postMessage({
			wallets: done ? wallets : [],
			invalidKeys: done ? invalidKeys : [],
			progress,
			done,
			error: undefined
		} as PrivateKeyImportResult);

		// Continue with next batch if not done
		if (!done) {
			// Use setTimeout to prevent blocking
			setTimeout(() => processBatch(endIndex), 0);
		}
	}

	// Start processing
	if (keys.length > 0) {
		processBatch(0);
	} else {
		self.postMessage({
			wallets: [],
			invalidKeys: [],
			progress: 100,
			done: true,
			error: undefined
		} as PrivateKeyImportResult);
	}
});

export {};
