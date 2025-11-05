// Sub-worker for validating private keys
import { privateKeyToAccount } from 'viem/accounts';
import type { Address } from 'viem';

interface ValidateMessage {
	type: 'VALIDATE_BATCH';
	data: {
		keys: string[];
		startIndex: number;
		workerId: number;
	};
}

interface WalletResult {
	privateKey: string;
	address: Address;
	index: number;
}

interface InvalidKey {
	key: string;
	index: number;
	error: string;
}

// Validate a batch of private keys
function validateBatch(
	keys: string[],
	startIndex: number
): {
	validWallets: WalletResult[];
	invalidKeys: InvalidKey[];
} {
	const validWallets: WalletResult[] = [];
	const invalidKeys: InvalidKey[] = [];

	for (let i = 0; i < keys.length; i++) {
		const key = keys[i].trim();
		if (!key) continue;

		try {
			// Add 0x prefix if missing
			const formattedKey = key.startsWith('0x') ? key : `0x${key}`;

			// Validate length (64 hex chars + 0x prefix = 66)
			if (formattedKey.length !== 66) {
				invalidKeys.push({ key, index: startIndex + i, error: 'Invalid length' });
				continue;
			}

			// Validate hex format
			if (!/^0x[a-fA-F0-9]{64}$/.test(formattedKey)) {
				invalidKeys.push({ key, index: startIndex + i, error: 'Invalid format' });
				continue;
			}

			// Get address from private key
			const account = privateKeyToAccount(formattedKey as `0x${string}`);

			validWallets.push({
				privateKey: formattedKey,
				address: account.address,
				index: startIndex + i
			});
		} catch (error) {
			invalidKeys.push({
				key,
				index: startIndex + i,
				error: error instanceof Error ? error.message : 'Validation failed'
			});
		}
	}

	return { validWallets, invalidKeys };
}

// Listen for messages from the coordinator
self.addEventListener('message', (e: MessageEvent<ValidateMessage>) => {
	const { type, data } = e.data;

	if (type === 'VALIDATE_BATCH') {
		const { keys, startIndex, workerId } = data;

		try {
			const result = validateBatch(keys, startIndex);

			self.postMessage({
				type: 'BATCH_COMPLETE',
				data: {
					...result,
					workerId,
					batchSize: keys.length,
					startIndex
				}
			});
		} catch (error) {
			self.postMessage({
				type: 'BATCH_ERROR',
				data: {
					workerId,
					error: error instanceof Error ? error.message : 'Unknown error',
					startIndex
				}
			});
		}
	}
});
