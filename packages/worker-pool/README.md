# @shelchin/worker-pool

A simple and elegant Worker pool for parallel task execution, inspired by threads.js.

## Features

- Promise-based API with `spawn()` for simple execution
- Observable-style API with `runWorker()` for progress tracking
- Parallel execution with `spawnPool()` for CPU-intensive tasks
- Automatic worker count detection based on CPU cores
- TypeScript support with full type definitions
- Zero dependencies

## Installation

```bash
npm install @shelchin/worker-pool
# or
bun add @shelchin/worker-pool
# or
pnpm add @shelchin/worker-pool
```

## Usage

### Basic Worker Execution

```ts
import { spawn } from '@shelchin/worker-pool';
import workerUrl from './my-worker.worker?worker&url';

interface Request {
	data: number[];
}

interface Result {
	done: boolean;
	sum: number;
}

const worker = spawn<Request, Result>(workerUrl);
const result = await worker.execute({ data: [1, 2, 3, 4, 5] });
console.log(result.sum); // 15
```

### With Progress Tracking

```ts
import { spawn } from '@shelchin/worker-pool';

const worker = spawn<Request, Result>(workerUrl);

const result = await worker.execute(
	{ data: largeDataset },
	{
		onProgress: (progress) => {
			console.log(`Progress: ${progress}%`);
		}
	}
);
```

### Observable-Style API

```ts
import { runWorker } from '@shelchin/worker-pool';

runWorker(workerUrl, { data: largeDataset })
	.onProgress((progress) => {
		progressBar.value = progress;
	})
	.onComplete((result) => {
		console.log('Done!', result);
	})
	.onError((error) => {
		console.error('Failed:', error);
	});
```

### Parallel Execution with Pool

```ts
import { spawnPool, getOptimalWorkerCount } from '@shelchin/worker-pool';

interface ChunkRequest {
	addresses: string[];
	startIndex: number;
}

interface ChunkResult {
	done: boolean;
	balances: { address: string; balance: bigint }[];
}

const addresses = ['0x...', '0x...' /* many addresses */];

const result = await spawnPool<ChunkRequest, ChunkResult, ChunkResult['balances']>(workerUrl, {
	data: { addresses, startIndex: 0 },
	workerCount: 'auto', // or specific number like 4
	splitTask: (data, workerIndex, totalWorkers) => {
		const chunkSize = Math.ceil(data.addresses.length / totalWorkers);
		const start = workerIndex * chunkSize;
		return {
			addresses: data.addresses.slice(start, start + chunkSize),
			startIndex: start
		};
	},
	mergeResults: (results) => {
		return results.flatMap((r) => r.balances);
	},
	onProgress: (progress) => {
		console.log(`Overall progress: ${progress}%`);
	}
});
```

## Worker Message Protocol

Workers should communicate using this message format:

```ts
// Progress update
self.postMessage({
	done: false,
	progress: 50 // 0-100
});

// Completion
self.postMessage({
	done: true,
	result: computedData
});

// Error
self.postMessage({
	done: true,
	error: 'Error message'
});
```

### Example Worker

```ts
// my-worker.worker.ts
interface Request {
	numbers: number[];
}

self.onmessage = async (event: MessageEvent<Request>) => {
	const { numbers } = event.data;

	let sum = 0;
	for (let i = 0; i < numbers.length; i++) {
		sum += numbers[i];

		// Report progress
		if (i % 100 === 0) {
			self.postMessage({
				done: false,
				progress: (i / numbers.length) * 100
			});
		}
	}

	// Report completion
	self.postMessage({
		done: true,
		sum
	});
};
```

## API Reference

### `spawn<TRequest, TResult>(workerPath: string)`

Creates a worker instance for executing tasks.

**Returns:** `SpawnedWorker<TRequest, TResult>`

| Method/Property           | Type                                              | Description             |
| ------------------------- | ------------------------------------------------- | ----------------------- |
| `execute(data, options?)` | `(TRequest, SpawnExecuteOptions?) => Promise<TR>` | Execute task            |
| `terminate()`             | `() => void`                                      | Terminate worker        |
| `running`                 | `boolean`                                         | Check if worker is busy |

### `runWorker<TRequest, TResult>(workerPath: string, data: TRequest)`

Creates an observable-style worker for tasks with progress.

**Returns:** `WorkerObservable<TResult>`

| Method         | Type                            | Description             |
| -------------- | ------------------------------- | ----------------------- |
| `onProgress()` | `(handler) => WorkerObservable` | Subscribe to progress   |
| `onComplete()` | `(handler) => WorkerObservable` | Subscribe to completion |
| `onError()`    | `(handler) => WorkerObservable` | Subscribe to errors     |
| `terminate()`  | `() => void`                    | Terminate worker        |

### `spawnPool<TRequest, TResult, TMerged>(workerPath: string, options)`

Executes a task in parallel across multiple workers.

**Options:**

| Option         | Type                               | Description                       |
| -------------- | ---------------------------------- | --------------------------------- |
| `data`         | `TRequest`                         | Task data to split                |
| `workerCount`  | `number \| 'auto'`                 | Number of workers (default: auto) |
| `splitTask`    | `(data, index, total) => TRequest` | Split data for each worker        |
| `mergeResults` | `(results: TResult[]) => TMerged`  | Merge worker results              |
| `onProgress`   | `(progress: number) => void`       | Progress callback (0-100)         |

**Returns:** `Promise<TMerged>`

### `getOptimalWorkerCount()`

Returns the optimal number of workers based on CPU cores (cores - 2, minimum 1).

**Returns:** `number`

## Requirements

- Browser with Web Worker support
- ES2022+ environment

## License

MIT
