// Wallet validation using multi-threaded Web Workers
export class WalletValidator {
	private coordinatorWorker: Worker | null = null;
	private validationInProgress = false;
	private currentValidationId = 0;
	private currentResolve: ((value: any) => void) | null = null;
	private currentReject: ((reason: any) => void) | null = null;

	constructor() {
		this.initWorker();
	}

	private initWorker() {
		if (typeof Worker !== 'undefined') {
			try {
				// Use the coordinator worker for multi-threading with proper module loading
				this.coordinatorWorker = new Worker(
					new URL('../workers/coordinator.ts', import.meta.url),
					{ type: 'module' }
				);

				// Log hardware info
				const cores = navigator.hardwareConcurrency || 4;
				console.log(`System has ${cores} logical processors available`);
			} catch (error) {
				console.error('Failed to initialize coordinator worker:', error);
			}
		}
	}

	// Cancel any ongoing validation
	cancel() {
		this.validationInProgress = false;
		this.currentValidationId++;

		if (this.coordinatorWorker) {
			// Send cancel message to coordinator
			this.coordinatorWorker.postMessage({ type: 'CANCEL' });
		}

		// Reject current promise if exists
		if (this.currentReject) {
			this.currentReject(new Error('Validation cancelled'));
			this.currentResolve = null;
			this.currentReject = null;
		}
	}

	async validateKeys(
		keys: string[],
		onProgress?: (progress: number, validCount?: number, processedCount?: number) => void
	): Promise<{
		validWallets: Array<{ privateKey: string; address: string }>;
		invalidKeys: string[];
	}> {
		if (!this.coordinatorWorker) {
			throw new Error('Web Workers are not supported in this environment');
		}

		// Cancel any existing validation
		if (this.validationInProgress) {
			this.cancel();
			// Wait a bit for cancellation to complete
			await new Promise(resolve => setTimeout(resolve, 100));
		}

		return new Promise((resolve, reject) => {
			this.validationInProgress = true;
			this.currentValidationId++;
			this.currentResolve = resolve;
			this.currentReject = reject;

			const validationId = this.currentValidationId;

			const handleMessage = (event: MessageEvent) => {
				// Ignore messages from previous validations
				if (validationId !== this.currentValidationId) {
					return;
				}

				const { type, data } = event.data;

				switch (type) {
					case 'WORKERS_INITIALIZED':
						console.log(`Validation using ${data.count} worker threads`);
						break;

					case 'PROGRESS':
						if (onProgress) {
							onProgress(data.progress, data.validCount, data.processedKeys);
						}
						break;

					case 'COMPLETE':
						this.validationInProgress = false;
						this.coordinatorWorker?.removeEventListener('message', handleMessage);
						this.coordinatorWorker?.removeEventListener('error', handleError);
						this.currentResolve = null;
						this.currentReject = null;

						// Return results
						resolve({
							validWallets: data.validWallets || [],
							invalidKeys: data.invalidKeys || []
						});

						// The coordinator will automatically clean up workers after completion
						console.log('Validation complete, workers cleaned up');
						break;

					case 'ERROR':
						this.validationInProgress = false;
						this.coordinatorWorker?.removeEventListener('message', handleMessage);
						this.coordinatorWorker?.removeEventListener('error', handleError);
						this.currentResolve = null;
						this.currentReject = null;
						reject(new Error(data.error));
						break;

					case 'CANCELLED':
						this.validationInProgress = false;
						this.coordinatorWorker?.removeEventListener('message', handleMessage);
						this.coordinatorWorker?.removeEventListener('error', handleError);
						// Don't reject here as cancel() already handles it
						break;
				}
			};

			const handleError = (error: ErrorEvent) => {
				// Ignore errors from previous validations
				if (validationId !== this.currentValidationId) {
					return;
				}

				this.validationInProgress = false;
				this.coordinatorWorker?.removeEventListener('message', handleMessage);
				this.coordinatorWorker?.removeEventListener('error', handleError);
				this.currentResolve = null;
				this.currentReject = null;
				reject(error);
			};

			if (this.coordinatorWorker) {
				// Remove any existing listeners
				this.coordinatorWorker.removeEventListener('message', handleMessage);
				this.coordinatorWorker.removeEventListener('error', handleError);

				// Add new listeners
				this.coordinatorWorker.addEventListener('message', handleMessage);
				this.coordinatorWorker.addEventListener('error', handleError);

				// Start validation
				console.log(`Starting validation of ${keys.length} keys using multi-threading`);
				this.coordinatorWorker.postMessage({
					type: 'VALIDATE',
					data: { keys }
				});
			} else {
				reject(new Error('Worker not initialized'));
			}
		});
	}

	isValidating(): boolean {
		return this.validationInProgress;
	}

	destroy() {
		this.cancel();
		if (this.coordinatorWorker) {
			// Send destroy message to coordinator
			this.coordinatorWorker.postMessage({ type: 'DESTROY' });
			this.coordinatorWorker.terminate();
			this.coordinatorWorker = null;
		}
	}
}