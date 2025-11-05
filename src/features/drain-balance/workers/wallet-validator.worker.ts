// Web Worker for validating private keys in batches
import { privateKeyToAccount } from 'viem/accounts';
import type { Hex } from 'viem';

export interface ValidationRequest {
	keys: string[];
	batchSize?: number;
}

export interface ValidationResult {
	validWallets: Array<{
		privateKey: string;
		address: string;
	}>;
	invalidKeys: string[];
	progress?: number;
	done: boolean;
}

// Validate a single private key
function validatePrivateKey(key: string): { isValid: boolean; address?: string } {
	try {
		const cleanKey = key.startsWith('0x') ? key : `0x${key}`;
		if (!/^0x[0-9a-fA-F]{64}$/.test(cleanKey)) {
			return { isValid: false };
		}
		const account = privateKeyToAccount(cleanKey as Hex);
		return { isValid: true, address: account.address };
	} catch {
		return { isValid: false };
	}
}

// Process validation in batches
self.addEventListener('message', (event: MessageEvent<ValidationRequest>) => {
	const { keys, batchSize = 100 } = event.data;
	const validWallets: ValidationResult['validWallets'] = [];
	const invalidKeys: string[] = [];

	let processed = 0;
	const total = keys.length;

	// Process keys in batches to provide progress updates
	function processBatch(startIndex: number) {
		const endIndex = Math.min(startIndex + batchSize, total);

		for (let i = startIndex; i < endIndex; i++) {
			const key = keys[i].trim();
			if (!key) continue;

			const result = validatePrivateKey(key);
			if (result.isValid && result.address) {
				validWallets.push({
					privateKey: key,
					address: result.address
				});
			} else {
				invalidKeys.push(key);
			}
			processed++;
		}

		// Send progress update
		const progress = (processed / total) * 100;
		const done = processed === total;

		self.postMessage({
			validWallets: done ? validWallets : [],
			invalidKeys: done ? invalidKeys : [],
			progress,
			done
		} as ValidationResult);

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
			validWallets: [],
			invalidKeys: [],
			progress: 100,
			done: true
		} as ValidationResult);
	}
});

export {};
