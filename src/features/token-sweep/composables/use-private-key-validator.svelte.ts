import type {
	ValidateRequest,
	ValidateResponse
} from '$lib/workers/private-key-validator.worker';

interface InvalidKey {
	key: string;
	reason?: string;
}

export function usePrivateKeyValidator() {
	let worker: Worker | null = $state(null);
	let isValidating = $state(false);
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;

	// Initialize worker
	function initWorker() {
		if (typeof window === 'undefined') return null;

		if (!worker) {
			try {
				worker = new Worker(
					new URL('$lib/workers/private-key-validator.worker.ts', import.meta.url),
					{ type: 'module' }
				);

				worker.onerror = (error) => {
					console.error('❌ Worker error:', error);
				};

				console.log('✅ Private key validator worker initialized');
			} catch (error) {
				console.error('❌ Failed to initialize worker:', error);
				return null;
			}
		}

		return worker;
	}

	// Validate private keys with debouncing
	function validateKeys(
		currentLines: string[],
		previousInvalidKeys: InvalidKey[],
		onResult: (invalidKeys: InvalidKey[]) => void,
		debounceMs: number = 300
	) {
		// Clear previous timer
		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}

		// Set new timer
		debounceTimer = setTimeout(() => {
			const w = initWorker();
			if (!w) {
				console.warn('⚠️ Worker not available, skipping validation');
				// Fallback: just return the previous invalid keys
				onResult(previousInvalidKeys);
				return;
			}

			isValidating = true;

			// Set up one-time listener for this validation
			const handleMessage = (event: MessageEvent<ValidateResponse>) => {
				if (event.data.type === 'validate-result') {
					isValidating = false;
					onResult(event.data.invalidKeys);
					w.removeEventListener('message', handleMessage);
				}
			};

			w.addEventListener('message', handleMessage);

			// Send validation request - ensure data is serializable
			const request: ValidateRequest = {
				type: 'validate',
				lines: currentLines,
				previousInvalidKeys: previousInvalidKeys.map((k) => ({
					key: k.key,
					reason: k.reason
				}))
			};

			try {
				w.postMessage(request);
			} catch (error) {
				console.error('❌ Failed to post message to worker:', error);
				isValidating = false;
				// Fallback: return previous keys
				onResult(previousInvalidKeys);
			}
		}, debounceMs);
	}

	// Cleanup
	function cleanup() {
		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}
		if (worker) {
			worker.terminate();
			worker = null;
		}
	}

	return {
		get isValidating() {
			return isValidating;
		},
		validateKeys,
		cleanup
	};
}
