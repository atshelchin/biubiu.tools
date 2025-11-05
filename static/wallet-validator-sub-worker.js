// Sub-worker for validating private keys
importScripts('https://cdn.jsdelivr.net/npm/viem@2.0.0/dist/index.global.js');

const { privateKeyToAccount } = viem;

// Validate a batch of private keys
function validateBatch(keys, startIndex) {
    const validWallets = [];
    const invalidKeys = [];

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
            const account = privateKeyToAccount(formattedKey);

            validWallets.push({
                privateKey: formattedKey,
                address: account.address,
                index: startIndex + i
            });
        } catch (error) {
            invalidKeys.push({
                key,
                index: startIndex + i,
                error: error.message || 'Validation failed'
            });
        }
    }

    return { validWallets, invalidKeys };
}

// Listen for messages from the coordinator
self.addEventListener('message', (e) => {
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
                    error: error.message,
                    startIndex
                }
            });
        }
    }
});