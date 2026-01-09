/**
 * @shelchin/task-manager
 *
 * A tree-based task management system with:
 * - Split storage for efficient loading (roots + nodes)
 * - Merkle tree support for cryptographic verification
 * - Pause/resume/cancel functionality
 * - IndexedDB persistence
 * - Svelte 5 reactive store
 * - Event-driven architecture
 * - Clean, minimal API
 */

// ============================================================================
// Types
// ============================================================================

export type {
	// Core types
	TaskStatus,
	TaskMode,
	TaskRoot,
	TaskNode,
	// Creation options
	CreateTaskOptions,
	CreateNodeOptions,
	// Execution types
	ExecutionContext,
	TaskExecutor,
	ExecutorRegistry,
	// Event types
	TaskEvent,
	TaskEventData,
	TaskEventHandler,
	// Storage types
	StorageAdapter,
	IntegrityCheckResult,
	// Configuration
	TaskManagerConfig,
	ResolvedConfig,
	// Merkle types
	MerkleProof,
	// Error types
	StorageErrorType
} from './types';

export { DEFAULT_CONFIG, StorageError, isQuotaExceededError } from './types';

// ============================================================================
// Task Manager
// ============================================================================

export { TaskManager, createTaskManager } from './task-manager';

// ============================================================================
// Storage Adapters
// ============================================================================

export { IndexedDBStorage, createIndexedDBStorage } from './storage/indexeddb';
export { MemoryStorage, createMemoryStorage } from './storage/memory';

// ============================================================================
// Merkle Tree Utilities
// ============================================================================

export {
	// Hashing
	computeLeafHash,
	computeDataHash,
	computeLeafHashesBatched,
	// Building
	buildMerkleRoot,
	buildMerkleTreeFromNodes,
	// Proofs
	generateProof,
	generateMerkleProof,
	// Verification
	verifyProof,
	verifyMerkleProof,
	verifyLeafNode,
	// Utilities
	rootsEqual,
	getMerkleTreeDepth,
	getMerkleTreeNodeCount
} from './merkle';

// ============================================================================
// Web Worker Utilities
// ============================================================================

export {
	// Worker management
	terminateWorker,
	isWorkerSupported,
	// Async APIs
	computeHashesInWorker,
	buildRootInWorker,
	computeMerkleInWorker
} from './merkle-worker-manager';

// ============================================================================
// Multi-Tab Coordination
// ============================================================================

export { TabCoordinator, getTabCoordinator, withTabCoordination } from './tab-coordinator';

export type { TabCoordinatorOptions, LockHandle } from './tab-coordinator';

// ============================================================================
// Svelte Store
// ============================================================================

export { TaskStore, createTaskStore, taskStore } from './stores';
