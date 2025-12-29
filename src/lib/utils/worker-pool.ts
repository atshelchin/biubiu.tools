/**
 * @deprecated Use `@shelchin/worker-pool` instead
 * This re-export is kept for backwards compatibility
 */
export { getOptimalWorkerCount, spawn, runWorker, spawnPool } from '@shelchin/worker-pool';

export type {
	WorkerTask,
	WorkerMessage,
	SpawnExecuteOptions,
	SpawnedWorker,
	WorkerObservable,
	SpawnPoolOptions
} from '@shelchin/worker-pool';
