/**
 * Simple and elegant Worker pool inspired by threads.js
 * Provides a clean API for running CPU-intensive tasks in background threads
 * with support for parallel execution across multiple workers
 */

export interface WorkerTask<TResult> {
	workerUrl: string;
	onProgress?: (progress: number) => void;
	onComplete: (result: TResult) => void;
	onError?: (error: Error) => void;
}

/**
 * Get optimal number of workers based on CPU cores
 * Default: CPU cores - 2, minimum 1
 */
export function getOptimalWorkerCount(): number {
	// navigator.hardwareConcurrency returns logical CPU cores
	const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4;
	return Math.max(1, cores - 2);
}

/**
 * Spawn a Worker and execute a task
 * Usage:
 *   const result = await spawn(walletImportWorker).execute({ mnemonic, ... })
 */
export function spawn<TRequest = unknown, TResult = unknown>(workerPath: string) {
	let worker: Worker | null = null;
	let isRunning = false;

	return {
		/**
		 * Execute task in Worker with promise-based API
		 */
		execute(
			data: TRequest,
			options?: {
				onProgress?: (progress: number) => void;
			}
		): Promise<TResult> {
			return new Promise((resolve, reject) => {
				if (isRunning) {
					reject(new Error('Worker is already running a task'));
					return;
				}

				try {
					// Create worker
					// workerPath is already a URL string from ?worker&url import
					console.log('[spawn] Creating worker:', workerPath);

					worker = new Worker(workerPath, {
						type: 'module'
					});

					isRunning = true;

					// Message handler
					worker.onmessage = (event) => {
						const result = event.data;
						console.log('[spawn] Worker message:', {
							done: result.done,
							progress: result.progress,
							hasError: !!result.error,
							hasWallets: !!result.wallets
						});

						// Report progress
						if (!result.done && result.progress !== undefined && options?.onProgress) {
							options.onProgress(result.progress);
						}

						// Task complete
						if (result.done) {
							isRunning = false;

							if (result.error) {
								console.error('[spawn] Worker returned error:', result.error);
								worker?.terminate();
								worker = null;
								reject(new Error(result.error));
							} else {
								console.log('[spawn] Worker completed successfully');
								worker?.terminate();
								worker = null;
								resolve(result as TResult);
							}
						}
					};

					// Error handler
					worker.onerror = (error) => {
						console.error('[spawn] Worker onerror:', {
							message: error.message,
							filename: error.filename,
							lineno: error.lineno,
							colno: error.colno,
							error: error
						});
						isRunning = false;
						worker?.terminate();
						worker = null;
						reject(new Error(`Worker error: ${error.message || 'Unknown error'}`));
					};

					// Start task
					console.log('[spawn] Posting message to worker:', data);
					worker.postMessage(data);
				} catch (error) {
					console.error('[spawn] Exception creating worker:', error);
					isRunning = false;
					reject(error);
				}
			});
		},

		/**
		 * Terminate the worker
		 */
		terminate() {
			if (worker) {
				worker.terminate();
				worker = null;
			}
			isRunning = false;
		},

		/**
		 * Check if worker is running
		 */
		get running() {
			return isRunning;
		}
	};
}

/**
 * Observable-style API for long-running tasks with progress
 * Usage:
 *   runWorker(walletImportWorker, { mnemonic, ... })
 *     .onProgress((p) => progress = p)
 *     .onComplete((result) => console.log(result))
 *     .onError((err) => console.error(err))
 */
export function runWorker<TRequest = unknown, TResult = unknown>(
	workerPath: string,
	data: TRequest
) {
	let worker: Worker | null = null;
	let progressHandler: ((progress: number) => void) | null = null;
	let completeHandler: ((result: TResult) => void) | null = null;
	let errorHandler: ((error: Error) => void) | null = null;

	const api = {
		onProgress(handler: (progress: number) => void) {
			progressHandler = handler;
			return api;
		},

		onComplete(handler: (result: TResult) => void) {
			completeHandler = handler;
			startWorker();
			return api;
		},

		onError(handler: (error: Error) => void) {
			errorHandler = handler;
			return api;
		},

		terminate() {
			if (worker) {
				worker.terminate();
				worker = null;
			}
		}
	};

	function startWorker() {
		try {
			// workerPath is already a URL string from ?worker&url import
			worker = new Worker(workerPath, {
				type: 'module'
			});

			worker.onmessage = (event) => {
				const result = event.data;

				// Progress update
				if (!result.done && result.progress !== undefined && progressHandler) {
					progressHandler(result.progress);
				}

				// Complete
				if (result.done) {
					if (result.error) {
						worker?.terminate();
						worker = null;
						if (errorHandler) {
							errorHandler(new Error(result.error));
						}
					} else {
						worker?.terminate();
						worker = null;
						if (completeHandler) {
							completeHandler(result as TResult);
						}
					}
				}
			};

			worker.onerror = (error) => {
				worker?.terminate();
				worker = null;
				if (errorHandler) {
					errorHandler(error instanceof Error ? error : new Error(error.message || 'Worker error'));
				}
			};

			worker.postMessage(data);
		} catch (error) {
			if (errorHandler) {
				errorHandler(error as Error);
			}
		}
	}

	return api;
}

/**
 * Execute a task using multiple workers in parallel
 * Automatically splits work across available CPU cores
 *
 * Usage:
 *   const result = await spawnPool(workerPath, {
 *     data: taskData,
 *     workerCount: 4, // or 'auto' for optimal detection
 *     splitTask: (data, workerIndex, totalWorkers) => partialTask,
 *     mergeResults: (results) => finalResult
 *   })
 */
export function spawnPool<TRequest = unknown, TResult = unknown, TMerged = TResult>(
	workerPath: string,
	options: {
		data: TRequest;
		workerCount?: number | 'auto';
		splitTask: (data: TRequest, workerIndex: number, totalWorkers: number) => TRequest;
		mergeResults: (results: TResult[]) => TMerged;
		onProgress?: (progress: number) => void;
	}
): Promise<TMerged> {
	const { data, workerCount = 'auto', splitTask, mergeResults, onProgress } = options;

	// Determine worker count
	const numWorkers = workerCount === 'auto' ? getOptimalWorkerCount() : workerCount;
	console.log('[spawnPool] Starting pool with', numWorkers, 'workers');

	return new Promise((resolve, reject) => {
		const workers: Worker[] = [];
		const results: (TResult | null)[] = new Array(numWorkers).fill(null);
		const progressByWorker: number[] = new Array(numWorkers).fill(0);
		let completedWorkers = 0;
		let hasError = false;

		// Update overall progress
		const updateProgress = () => {
			if (onProgress) {
				const totalProgress = progressByWorker.reduce((sum, p) => sum + p, 0) / numWorkers;
				onProgress(totalProgress);
			}
		};

		// Cleanup all workers
		const cleanup = () => {
			console.log('[spawnPool] Cleaning up', workers.length, 'workers');
			workers.forEach((w) => w.terminate());
			workers.length = 0;
		};

		// Create and start workers
		for (let i = 0; i < numWorkers; i++) {
			const workerIndex = i;

			try {
				// workerPath is already a URL string from ?worker&url import
				console.log(`[spawnPool] Creating worker ${workerIndex}:`, workerPath);

				const worker = new Worker(workerPath, {
					type: 'module'
				});

				worker.onmessage = (event) => {
					const result = event.data;
					console.log(`[spawnPool] Worker ${workerIndex} message:`, {
						done: result.done,
						progress: result.progress,
						hasError: !!result.error
					});

					// Progress update
					if (!result.done && result.progress !== undefined) {
						progressByWorker[workerIndex] = result.progress;
						updateProgress();
					}

					// Task complete
					if (result.done && !hasError) {
						if (result.error) {
							console.error(`[spawnPool] Worker ${workerIndex} returned error:`, result.error);
							hasError = true;
							cleanup();
							reject(new Error(result.error));
						} else {
							console.log(`[spawnPool] Worker ${workerIndex} completed`);
							results[workerIndex] = result as TResult;
							completedWorkers++;

							// All workers finished
							if (completedWorkers === numWorkers) {
								console.log('[spawnPool] All workers completed, merging results');
								cleanup();
								const merged = mergeResults(results.filter((r) => r !== null) as TResult[]);
								resolve(merged);
							}
						}
					}
				};

				worker.onerror = (error) => {
					console.error(`[spawnPool] Worker ${workerIndex} onerror:`, {
						message: error.message,
						filename: error.filename,
						lineno: error.lineno,
						colno: error.colno
					});
					if (!hasError) {
						hasError = true;
						cleanup();
						reject(new Error(`Worker ${workerIndex} error: ${error.message || 'Unknown error'}`));
					}
				};

				// Split the task for this worker
				const partialTask = splitTask(data, workerIndex, numWorkers);
				console.log(`[spawnPool] Worker ${workerIndex} task:`, partialTask);
				worker.postMessage(partialTask);

				workers.push(worker);
			} catch (error) {
				console.error(`[spawnPool] Exception creating worker ${workerIndex}:`, error);
				hasError = true;
				cleanup();
				reject(error);
				break;
			}
		}
	});
}
