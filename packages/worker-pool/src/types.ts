/**
 * Task configuration for worker execution
 */
export interface WorkerTask<TResult> {
	workerUrl: string;
	onProgress?: (progress: number) => void;
	onComplete: (result: TResult) => void;
	onError?: (error: Error) => void;
}

/**
 * Worker message format for progress and completion
 */
export interface WorkerMessage {
	done: boolean;
	progress?: number;
	error?: string;
	[key: string]: unknown;
}

/**
 * Options for spawn execute method
 */
export interface SpawnExecuteOptions {
	onProgress?: (progress: number) => void;
}

/**
 * Spawned worker instance with execute and terminate methods
 */
export interface SpawnedWorker<TRequest, TResult> {
	/**
	 * Execute task in Worker with promise-based API
	 */
	execute(data: TRequest, options?: SpawnExecuteOptions): Promise<TResult>;

	/**
	 * Terminate the worker
	 */
	terminate(): void;

	/**
	 * Check if worker is running
	 */
	readonly running: boolean;
}

/**
 * Observable-style API for worker tasks
 */
export interface WorkerObservable<TResult> {
	onProgress(handler: (progress: number) => void): WorkerObservable<TResult>;
	onComplete(handler: (result: TResult) => void): WorkerObservable<TResult>;
	onError(handler: (error: Error) => void): WorkerObservable<TResult>;
	terminate(): void;
}

/**
 * Options for spawnPool parallel execution
 */
export interface SpawnPoolOptions<TRequest, TResult, TMerged> {
	/** Data to be split across workers */
	data: TRequest;

	/** Number of workers or 'auto' for optimal detection */
	workerCount?: number | 'auto';

	/** Function to split task data for each worker */
	splitTask: (data: TRequest, workerIndex: number, totalWorkers: number) => TRequest;

	/** Function to merge results from all workers */
	mergeResults: (results: TResult[]) => TMerged;

	/** Progress callback (0-100) */
	onProgress?: (progress: number) => void;
}
