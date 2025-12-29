# @shelchin/task-manager

A universal task management system with tree structure, persistence, pause/resume, and progress tracking for Svelte 5.

## Features

- **Tree-based structure** - Unlimited nesting depth for complex task hierarchies
- **Pause/Resume** - Interrupt and continue tasks at any time
- **IndexedDB persistence** - Tasks survive browser refreshes
- **Progress aggregation** - Parent tasks automatically aggregate child progress
- **Retry with backoff** - Automatic retry for failed tasks
- **Svelte 5 reactive store** - Full reactivity with runes
- **Custom persistence** - Plug in your own storage adapter
- **Type-safe** - Full TypeScript support with generics

## Installation

```bash
bun add @shelchin/task-manager
# or
npm install @shelchin/task-manager
```

## Peer Dependencies

- `svelte` ^5.0.0

## Quick Start

### 1. Initialize the task manager (optional)

```ts
import { initTaskManager } from '@shelchin/task-manager';

// Optional: customize configuration
initTaskManager({
	db: {
		name: 'MyAppTasks',
		version: 1
	},
	retry: {
		maxAttempts: 5,
		baseDelayMs: 1000
	}
});
```

### 2. Create a task

```ts
import { createTask } from '@shelchin/task-manager';

// Simple task
const task = await createTask({
	type: 'file-upload',
	name: 'Upload files',
	executionData: { files: ['a.jpg', 'b.png'] },
	executor: 'uploadFile'
});

// Task with children
const task = await createTask({
	type: 'batch-process',
	name: 'Process 3 batches',
	children: [
		{
			type: 'batch',
			name: 'Batch 1',
			executionData: { items: [1, 2, 3] },
			executor: 'processBatch'
		},
		{
			type: 'batch',
			name: 'Batch 2',
			executionData: { items: [4, 5, 6] },
			executor: 'processBatch'
		},
		{
			type: 'batch',
			name: 'Batch 3',
			executionData: { items: [7, 8, 9] },
			executor: 'processBatch'
		}
	]
});
```

### 3. Define executors

```ts
import type { TaskExecutorRegistry } from '@shelchin/task-manager';

const executors: TaskExecutorRegistry = {
	uploadFile: async (ctx) => {
		const { files } = ctx.task.executionData;

		for (let i = 0; i < files.length; i++) {
			if (ctx.isPaused()) return; // Check for pause

			await uploadSingleFile(files[i]);
			await ctx.updateProgress(((i + 1) / files.length) * 100);
		}

		await ctx.completeTask({ uploaded: files.length });
	},

	processBatch: async (ctx) => {
		const { items } = ctx.task.executionData;

		try {
			const result = await processItems(items);
			await ctx.completeTask(result);
		} catch (error) {
			await ctx.failTask(error.message);
		}
	}
};
```

### 4. Execute the task

```ts
import { executeTask } from '@shelchin/task-manager';

const result = await executeTask(task.id, executors, (root, current) => {
	console.log(`${current.name}: ${current.progress}%`);
});

console.log(`Completed: ${result.completedLeaves}/${result.totalLeaves}`);
```

### 5. Use with Svelte reactive store

```svelte
<script>
	import { taskStore } from '@shelchin/task-manager';

	// Initialize on mount
	$effect(() => {
		taskStore.init();
	});
</script>

{#if taskStore.isLoading}
	<p>Loading tasks...</p>
{:else}
	<p>Running: {taskStore.runningTasks.length}</p>
	<p>Completed: {taskStore.completedTasks.length}</p>

	{#each taskStore.allTasks as task}
		<div>
			{task.name} - {task.progress}% ({task.status})
		</div>
	{/each}
{/if}
```

## API Reference

### Configuration

```ts
interface TaskManagerConfig {
	db?: {
		name?: string; // Default: 'TaskManager'
		version?: number; // Default: 1
		storeName?: string; // Default: 'tasks'
	};
	retry?: {
		maxAttempts?: number; // Default: 3
		baseDelayMs?: number; // Default: 1000
		maxDelayMs?: number; // Default: 10000
	};
	cleanup?: {
		autoCleanupDays?: number; // Default: 7
		enableAutoCleanup?: boolean; // Default: false
	};
	persistenceAdapter?: PersistenceAdapter; // Custom storage
}

initTaskManager(config);
```

### Task Creation

```ts
interface CreateTaskOptions<TData> {
	type: string; // Task type identifier
	name: string; // Human-readable name
	description?: string;
	config?: Record<string, unknown>; // Immutable config
	metadata?: Record<string, unknown>;

	// For leaf tasks (no children)
	executionData?: TData; // Data for executor
	executor?: string; // Executor function name
	maxAttempts?: number; // Retry attempts (default: 3)

	// For parent tasks
	children?: CreateTaskOptions<TData>[];
}
```

### Task Execution Context

Executors receive a context object with these methods:

```ts
interface TaskExecutionContext<TData, TResult> {
	task: Task<TData, TResult>; // Current task
	parentTask: Task | null; // Parent task
	rootTask: Task; // Root task

	isPaused(): boolean; // Check if paused
	updateProgress(progress: number, message?: string): Promise<void>;
	updateTaskState(state: Record<string, unknown>): Promise<void>;
	completeTask(result?: TResult): Promise<void>;
	failTask(error: string): Promise<void>;
	pauseParent(reason: string, message: string): Promise<void>;
	pauseRoot(reason: string, message: string): Promise<void>;
}
```

### Task Control

```ts
// Pause a task
await pauseTask(rootTask, taskId, 'user', 'User requested pause');

// Resume a paused task
await resumeTask(rootTask, taskId);

// Cancel a task
await cancelTask(rootTask, taskId);

// Delete a task
await deleteTask(taskId);
```

### Tree Utilities

```ts
import {
	traverseTree,
	findTaskById,
	findTasks,
	getLeafTasks,
	getParentTasks,
	countLeaves,
	calculateProgress,
	updateStatistics,
	getTaskPath,
	getNextExecutableTask,
	cloneTask,
	flattenTree,
	getTreeDepth
} from '@shelchin/task-manager';

// Traverse all nodes
traverseTree(root, (task, depth) => {
	console.log(`${'  '.repeat(depth)}${task.name}`);
});

// Find specific task
const task = findTaskById(root, 'task-id');

// Get all leaf tasks
const leaves = getLeafTasks(root);

// Get task path
const path = getTaskPath(root, 'leaf-id');
```

### Svelte Store

```ts
import { taskStore, createTaskStore } from '@shelchin/task-manager';

// Global singleton
taskStore.init();
taskStore.allTasks; // All root tasks
taskStore.runningTasks; // Running tasks
taskStore.pausedTasks; // Paused tasks
taskStore.completedTasks; // Completed tasks
taskStore.failedTasks; // Failed tasks
taskStore.recoverableTasks; // Can be resumed

// Create independent store
const myStore = createTaskStore();
await myStore.init();
```

## Tree Structure Examples

### Simple (1 level)

```
Task: "Export Report" [leaf - executable]
```

### Medium (2 levels)

```
Task: "Upload Files"
├── Task: "file1.jpg" [leaf]
├── Task: "file2.png" [leaf]
└── Task: "file3.pdf" [leaf]
```

### Complex (3+ levels)

```
Task: "Token Sweep"
├── Task: "USDT"
│   ├── Task: "Batch 1" [leaf]
│   ├── Task: "Batch 2" [leaf]
│   └── Task: "Batch 3" [leaf]
├── Task: "USDC"
│   ├── Task: "Batch 1" [leaf]
│   └── Task: "Batch 2" [leaf]
└── Task: "DAI"
    └── Task: "Batch 1" [leaf]
```

## Custom Persistence Adapter

```ts
import type { PersistenceAdapter } from '@shelchin/task-manager';

const localStorageAdapter: PersistenceAdapter = {
	async saveTask(task) {
		localStorage.setItem(`task-${task.id}`, JSON.stringify(task));
	},
	async getTask(taskId) {
		const data = localStorage.getItem(`task-${taskId}`);
		return data ? JSON.parse(data) : null;
	},
	async getAllTasks() {
		// ... implementation
	},
	async deleteTask(taskId) {
		localStorage.removeItem(`task-${taskId}`);
	},
	async getTasksByStatus(status) {
		// ... implementation
	},
	async getTasksByType(type) {
		// ... implementation
	}
};

initTaskManager({
	persistenceAdapter: localStorageAdapter
});
```

## Task Status Lifecycle

```
pending → running → completed
                  → failed
                  → paused → running (resume)
                  → cancelled
                  → partial (some children failed)
```

## Testing

```bash
cd packages/task-manager
bun run test
```

## License

MIT
