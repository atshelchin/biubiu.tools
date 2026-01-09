# @shelchin/task-manager

A tree-based task management library with Merkle verification, persistence, and Svelte 5 reactivity.

## Features

- **Tree-based Structure** - Organize tasks hierarchically with unlimited nesting depth
- **Pause/Resume/Cancel** - Full lifecycle control at any time
- **Parallel & Serial Execution** - Configurable concurrency per task
- **IndexedDB Persistence** - Tasks survive browser refreshes
- **Merkle Tree Verification** - Cryptographic integrity checking
- **Svelte 5 Reactive Store** - Built-in reactive state management
- **Event-Driven Architecture** - Real-time progress updates
- **Automatic Retry** - Exponential backoff for failed tasks
- **TypeScript Support** - Full type safety with generics

## Installation

```bash
bun add @shelchin/task-manager
# or
npm install @shelchin/task-manager
```

## Peer Dependencies

- `svelte` ^5.0.0

## Quick Start

### Basic Usage

```ts
import { createTaskManager, createIndexedDBStorage } from '@shelchin/task-manager';

// Create a task manager with IndexedDB storage
const manager = createTaskManager({
  storage: createIndexedDBStorage('my-app-tasks')
});

// Create a task with subtasks
const task = await manager.create({
  name: 'Process Files',
  children: [
    { name: 'File 1', data: { path: '/a.jpg' } },
    { name: 'File 2', data: { path: '/b.png' } },
    { name: 'File 3', data: { path: '/c.pdf' } }
  ]
});

// Execute with a custom executor
await manager.execute(task.id, async (ctx) => {
  // Access task data
  const { path } = ctx.data;

  // Check for pause
  if (ctx.isPaused()) return;

  // Report progress (0-100)
  await ctx.progress(50);

  // Do the work
  await processFile(path);

  // Mark as complete
  await ctx.complete({ processed: true });
});
```

### Using the Svelte Store

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { createTaskStore, createIndexedDBStorage } from '@shelchin/task-manager';

  const store = createTaskStore({
    storage: createIndexedDBStorage('my-tasks')
  });

  onMount(() => {
    store.init();
  });
</script>

<!-- Reactive values auto-update -->
<p>Total: {store.allRoots.length}</p>
<p>Running: {store.runningRoots.length}</p>
<p>Completed: {store.completedRoots.length}</p>

{#each store.allRoots as task (task.id)}
  <div>
    {task.name} - {task.progress}% ({task.status})
  </div>
{/each}
```

## API Reference

### TaskManager

The core class for task management.

```ts
import { createTaskManager } from '@shelchin/task-manager';

const manager = createTaskManager(config);
```

#### Configuration

```ts
interface TaskManagerConfig {
  storage?: StorageAdapter;     // Custom storage (default: IndexedDB)
  dbName?: string;              // Database name (default: 'TaskManager')
  retry?: {
    maxAttempts?: number;       // Default: 3
    baseDelayMs?: number;       // Default: 1000
    maxDelayMs?: number;        // Default: 10000
  };
  cleanupDays?: number;         // Auto-cleanup after N days (default: 7)
}
```

#### Methods

| Method | Description |
|--------|-------------|
| `create(options)` | Create a new task tree |
| `execute(taskId, executor)` | Execute a task |
| `pause(taskId, reason?)` | Pause a running task |
| `resume(taskId, executor)` | Resume a paused task |
| `cancel(taskId)` | Cancel a task |
| `delete(taskId)` | Delete a task and all its nodes |
| `getRoot(taskId)` | Get task root by ID |
| `getAllRoots()` | Get all task roots |
| `getNodes(taskId)` | Get all nodes for a task |
| `getLeaves(taskId)` | Get leaf nodes only |
| `getChildren(taskId, parentId?)` | Get children of a node |
| `getMerkleRoot(taskId)` | Get the Merkle root hash |
| `getMerkleProof(taskId, leafId)` | Generate a Merkle proof |
| `verifyProof(proof)` | Verify a Merkle proof |
| `cleanup(olderThanDays?)` | Remove old completed tasks |
| `close()` | Close storage connection |
| `clear()` | Clear all data |
| `on(event, handler)` | Subscribe to events |
| `off(event, handler)` | Unsubscribe from events |

### Task Creation

```ts
interface CreateTaskOptions<T> {
  name: string;                    // Task name
  type?: string;                   // Task type identifier
  concurrency?: number;            // Parallel execution (default: 1 = serial)
  metadata?: Record<string, unknown>;
  children?: CreateNodeOptions<T>[];
}

interface CreateNodeOptions<T> {
  name: string;
  mode?: 'progressive' | 'atomic'; // Execution mode (default: 'progressive')
  data?: T;                        // Execution data
  executor?: string;               // Executor name (for registry)
  maxAttempts?: number;            // Retry attempts
  children?: CreateNodeOptions<T>[];
}
```

### Task Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| `progressive` | Shows progress 0-100% during execution | File uploads, data processing |
| `atomic` | No progress, just waiting → complete/fail | API calls, simple operations |

### Execution Context

Executors receive a context object:

```ts
interface ExecutionContext<T> {
  node: TaskNode<T>;           // Current node being executed
  data: T;                     // Node's execution data

  isPaused(): boolean;         // Check if task is paused
  signal: AbortSignal;         // Abort signal for cancellation

  progress(percent: number): Promise<void>;  // Report progress (0-100)
  complete(result?: unknown): Promise<void>; // Mark as completed
  fail(error: string): Promise<void>;        // Mark as failed
  pauseTask(reason?: string): Promise<void>; // Pause entire task
}
```

### Executor Registry

For tasks with different executor types:

```ts
import type { ExecutorRegistry } from '@shelchin/task-manager';

const executors: ExecutorRegistry<MyData> = {
  uploadFile: async (ctx) => {
    await uploadFile(ctx.data.file);
    await ctx.complete();
  },
  processData: async (ctx) => {
    const result = await process(ctx.data);
    await ctx.complete(result);
  }
};

// Create task with executor references
const task = await manager.create({
  name: 'Mixed Tasks',
  children: [
    { name: 'Upload', executor: 'uploadFile', data: { file: 'a.jpg' } },
    { name: 'Process', executor: 'processData', data: { id: 123 } }
  ]
});

// Execute with registry
await manager.execute(task.id, executors);
```

### Parallel Execution

```ts
// Serial execution (default)
const task = await manager.create({
  name: 'Serial Task',
  concurrency: 1, // Execute one at a time
  children: [/* ... */]
});

// Parallel execution
const task = await manager.create({
  name: 'Parallel Task',
  concurrency: 5, // Execute 5 at a time
  children: [/* ... */]
});

// Execute all in parallel
const task = await manager.create({
  name: 'All Parallel',
  concurrency: Infinity,
  children: [/* ... */]
});
```

### Events

```ts
// Subscribe to events
manager.on('start', (event, { root, node }) => {
  console.log(`Task ${node.name} started`);
});

manager.on('progress', (event, { root, node }) => {
  console.log(`Task ${node.name}: ${node.progress}%`);
});

manager.on('complete', (event, { root, node }) => {
  console.log(`Task ${node.name} completed`);
});

// Available events: 'start' | 'progress' | 'complete' | 'fail' | 'pause' | 'resume' | 'cancel'
```

### Merkle Tree Verification

Every task has a Merkle root computed from its leaf nodes, enabling cryptographic verification.

```ts
// Get Merkle root
const merkleRoot = await manager.getMerkleRoot(task.id);

// Generate proof for a specific leaf
const leaves = await manager.getLeaves(task.id);
const proof = await manager.getMerkleProof(task.id, leaves[0].id);

// Verify the proof
const isValid = await manager.verifyProof(proof);
console.log('Proof valid:', isValid);
```

You can also use the low-level Merkle utilities:

```ts
import {
  computeLeafHash,
  buildMerkleRoot,
  generateMerkleProof,
  verifyMerkleProof,
  getMerkleTreeDepth
} from '@shelchin/task-manager';
```

### TaskStore (Svelte 5)

A reactive store wrapper around TaskManager.

```ts
import { createTaskStore } from '@shelchin/task-manager';

const store = createTaskStore(config);

// Initialize (load from storage)
await store.init();

// Reactive derived values
store.allRoots;        // TaskRoot[]
store.pendingRoots;    // TaskRoot[]
store.runningRoots;    // TaskRoot[]
store.pausedRoots;     // TaskRoot[]
store.completedRoots;  // TaskRoot[]
store.failedRoots;     // TaskRoot[]
store.recoverableRoots; // Tasks that can be resumed
store.isLoading;       // boolean
store.isInitialized;   // boolean

// Aggregated stats
store.stats; // { total, completed, failed, pending, completionRate }

// All TaskManager methods are available
await store.create({ name: 'Task', children: [...] });
await store.execute(taskId, executor);
await store.pause(taskId);
await store.resume(taskId, executor);
await store.delete(taskId);
await store.clearCompleted();
await store.clearFailed();
await store.refreshAll();
```

### Storage Adapters

#### IndexedDB (Default)

```ts
import { createIndexedDBStorage } from '@shelchin/task-manager';

const storage = createIndexedDBStorage('my-database');
const manager = createTaskManager({ storage });
```

#### Memory (Testing)

```ts
import { createMemoryStorage } from '@shelchin/task-manager';

const storage = createMemoryStorage();
const manager = createTaskManager({ storage });
```

#### Custom Storage

Implement the `StorageAdapter` interface:

```ts
interface StorageAdapter {
  // Root operations
  saveRoot(root: TaskRoot): Promise<void>;
  getRoot(id: string): Promise<TaskRoot | null>;
  getAllRoots(): Promise<TaskRoot[]>;
  deleteRoot(id: string): Promise<void>;

  // Node operations
  saveNode(node: TaskNode): Promise<void>;
  saveNodes(nodes: TaskNode[]): Promise<void>;
  getNode(id: string): Promise<TaskNode | null>;
  getNodesByRoot(rootId: string): Promise<TaskNode[]>;
  getChildren(parentId: string | null, rootId: string): Promise<TaskNode[]>;
  getLeaves(rootId: string): Promise<TaskNode[]>;
  deleteNodesByRoot(rootId: string): Promise<void>;

  // Batch operations
  updateNodeStatus(id: string, status: TaskStatus, updates?: Partial<TaskNode>): Promise<void>;

  // Lifecycle
  close(): Promise<void>;
  clear(): Promise<void>;
}
```

## Type Definitions

### TaskRoot

```ts
interface TaskRoot {
  id: string;
  name: string;
  type: string;
  status: TaskStatus;
  progress: number;          // 0-100
  concurrency: number;
  stats: {
    total: number;           // Total leaf nodes
    completed: number;
    failed: number;
  };
  merkleRoot: string | null;
  createdAt: number;
  updatedAt: number;
  startedAt?: number;
  completedAt?: number;
  metadata?: Record<string, unknown>;
}
```

### TaskNode

```ts
interface TaskNode<T = unknown> {
  id: string;
  rootId: string;
  parentId: string | null;
  name: string;
  status: TaskStatus;
  progress: number;
  mode: TaskMode;
  depth: number;
  index: number;
  isLeaf: boolean;
  childCount: number;
  hash: string;              // Merkle hash
  data?: T;
  executor?: string;
  result?: unknown;
  error?: string;
  attempts: number;
  maxAttempts: number;
  createdAt: number;
  updatedAt: number;
  startedAt?: number;
  completedAt?: number;
}
```

### TaskStatus

```ts
type TaskStatus = 'pending' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';
```

## Task Status Lifecycle

```
pending → running → completed
                  → failed (auto-retry until maxAttempts)
                  → paused → running (resume)
                  → cancelled
```

## Architecture

### Storage Design

The library uses a split storage model for efficiency:

- **TaskRoot** - Lightweight metadata stored separately for fast list queries
- **TaskNode** - Full node data stored by root ID for batch loading

### Data Flow

```
Create Task → Build Nodes → Compute Merkle Root → Save to Storage
    ↓
Execute → Load Nodes → Run Executor → Update Progress → Emit Events
    ↓
Complete/Fail → Update Stats → Update Merkle Root → Save
```

## Development

### Project Structure

```
packages/task-manager/
├── src/
│   ├── index.ts           # Public API exports
│   ├── types.ts           # Type definitions
│   ├── task-manager.ts    # Core TaskManager class
│   ├── merkle.ts          # Merkle tree utilities
│   ├── storage/
│   │   ├── indexeddb.ts   # IndexedDB adapter
│   │   └── memory.ts      # Memory adapter (testing)
│   └── stores/
│       └── task-store.svelte.ts  # Svelte 5 reactive store
├── README.md
├── package.json
└── vitest.config.ts
```

### Testing

```bash
cd packages/task-manager

# Run all tests
bun run test

# Run with coverage
bun run test:coverage

# Run in watch mode
bun run test -- --watch
```

### Building

```bash
# Build the package
bun run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `bun run test`
5. Submit a pull request

## License

MIT
