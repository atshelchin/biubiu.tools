import { validatePrivateKey } from '@/features/wallet-sweep/utils/wallet-import';

export interface ValidateRequest {
	type: 'validate';
	lines: string[];
	previousInvalidKeys: Array<{ key: string; reason?: string }>;
}

export interface ValidateResponse {
	type: 'validate-result';
	invalidKeys: Array<{ key: string; reason?: string }>;
}

self.onmessage = (event: MessageEvent<ValidateRequest>) => {
	const { type, lines, previousInvalidKeys } = event.data;

	if (type === 'validate') {
		const updatedInvalidKeys: Array<{ key: string; reason?: string }> = [];

		// Check each original invalid key
		previousInvalidKeys.forEach((invalidKey) => {
			const trimmedKey = invalidKey.key.trim();
			// Check if this key still exists in the editor (exact match)
			const stillExists = lines.some((line) => line === trimmedKey);

			if (stillExists) {
				// Still exists, check if it's still invalid
				const isStillInvalid = !validatePrivateKey(trimmedKey);
				if (isStillInvalid) {
					updatedInvalidKeys.push(invalidKey);
				}
				// If valid now, don't add to list (error fixed)
			}
			// If doesn't exist, it was deleted or modified to something else
		});

		// Check for NEW invalid keys that weren't in original invalidKeys
		lines.forEach((line) => {
			// If this line is invalid and not already in our list
			const isInvalid = !validatePrivateKey(line);
			const alreadyTracked = updatedInvalidKeys.some((k) => k.key.trim() === line);

			if (isInvalid && !alreadyTracked) {
				// This is a newly created invalid key (user typed something wrong)
				updatedInvalidKeys.push({ key: line });
			}
		});

		const response: ValidateResponse = {
			type: 'validate-result',
			invalidKeys: updatedInvalidKeys
		};

		self.postMessage(response);
	}
};
