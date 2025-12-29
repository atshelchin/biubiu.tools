/**
 * Task Manager Configuration
 *
 * Provides flexible configuration for the task manager including:
 * - Database name and version
 * - Retry settings
 * - Auto-cleanup settings
 * - Custom persistence adapter
 */

import type { Task } from './types';

/**
 * Persistence adapter interface
 * Allows custom storage implementations (IndexedDB, localStorage, etc.)
 */
export interface PersistenceAdapter {
	saveTask: <TData, TResult>(task: Task<TData, TResult>) => Promise<void>;
	getTask: <TData, TResult>(taskId: string) => Promise<Task<TData, TResult> | null>;
	getAllTasks: <TData, TResult>() => Promise<Task<TData, TResult>[]>;
	deleteTask: (taskId: string) => Promise<void>;
	getTasksByStatus: <TData, TResult>(status: string) => Promise<Task<TData, TResult>[]>;
	getTasksByType: <TData, TResult>(type: string) => Promise<Task<TData, TResult>[]>;
}

/**
 * Task manager configuration
 */
export interface TaskManagerConfig {
	/**
	 * Database configuration (for IndexedDB adapter)
	 */
	db?: {
		name?: string;
		version?: number;
		storeName?: string;
	};

	/**
	 * Retry configuration
	 */
	retry?: {
		maxAttempts?: number;
		baseDelayMs?: number;
		maxDelayMs?: number;
	};

	/**
	 * Auto cleanup configuration
	 */
	cleanup?: {
		autoCleanupDays?: number;
		enableAutoCleanup?: boolean;
	};

	/**
	 * Custom persistence adapter
	 * If not provided, uses the default IndexedDB adapter
	 */
	persistenceAdapter?: PersistenceAdapter;
}

/**
 * Resolved configuration with all defaults applied
 */
export interface ResolvedConfig {
	db: {
		name: string;
		version: number;
		storeName: string;
	};
	retry: {
		maxAttempts: number;
		baseDelayMs: number;
		maxDelayMs: number;
	};
	cleanup: {
		autoCleanupDays: number;
		enableAutoCleanup: boolean;
	};
	persistenceAdapter: PersistenceAdapter | null;
}

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG: ResolvedConfig = {
	db: {
		name: 'TaskManager',
		version: 1,
		storeName: 'tasks'
	},
	retry: {
		maxAttempts: 3,
		baseDelayMs: 1000,
		maxDelayMs: 10000
	},
	cleanup: {
		autoCleanupDays: 7,
		enableAutoCleanup: false
	},
	persistenceAdapter: null
};

let globalConfig: ResolvedConfig | null = null;

/**
 * Initialize the task manager with configuration
 */
export function initTaskManager(config: TaskManagerConfig = {}): void {
	globalConfig = {
		db: {
			name: config.db?.name ?? DEFAULT_CONFIG.db.name,
			version: config.db?.version ?? DEFAULT_CONFIG.db.version,
			storeName: config.db?.storeName ?? DEFAULT_CONFIG.db.storeName
		},
		retry: {
			maxAttempts: config.retry?.maxAttempts ?? DEFAULT_CONFIG.retry.maxAttempts,
			baseDelayMs: config.retry?.baseDelayMs ?? DEFAULT_CONFIG.retry.baseDelayMs,
			maxDelayMs: config.retry?.maxDelayMs ?? DEFAULT_CONFIG.retry.maxDelayMs
		},
		cleanup: {
			autoCleanupDays: config.cleanup?.autoCleanupDays ?? DEFAULT_CONFIG.cleanup.autoCleanupDays,
			enableAutoCleanup:
				config.cleanup?.enableAutoCleanup ?? DEFAULT_CONFIG.cleanup.enableAutoCleanup
		},
		persistenceAdapter: config.persistenceAdapter ?? null
	};
}

/**
 * Get the current configuration
 * Auto-initializes with defaults if not initialized
 */
export function getConfig(): ResolvedConfig {
	if (!globalConfig) {
		initTaskManager();
	}
	return globalConfig!;
}

/**
 * Check if task manager is initialized
 */
export function isTaskManagerInitialized(): boolean {
	return globalConfig !== null;
}

/**
 * Reset configuration (useful for testing)
 */
export function resetConfig(): void {
	globalConfig = null;
}
