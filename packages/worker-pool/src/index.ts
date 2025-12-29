/**
 * @shelchin/worker-pool
 *
 * Simple and elegant Worker pool for parallel task execution
 * Provides a clean API for running CPU-intensive tasks in background threads
 */

export { getOptimalWorkerCount, spawn, runWorker, spawnPool } from './worker-pool.js';

export type {
	WorkerTask,
	WorkerMessage,
	SpawnExecuteOptions,
	SpawnedWorker,
	WorkerObservable,
	SpawnPoolOptions
} from './types.js';
