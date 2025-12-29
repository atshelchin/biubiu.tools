/**
 * Type definitions for the modular state management system.
 *
 * This module defines the core interfaces that all state modules must implement.
 * Following these interfaces ensures consistent behavior across all tools.
 *
 * @module
 */

/**
 * Base interface that all state modules must implement.
 *
 * This ensures every module can be:
 * - Reset to initial state
 * - Serialized for persistence
 * - Deserialized from stored data
 */
export interface StateModule<TState = unknown> {
	/**
	 * Reset the module to its initial state.
	 * Called when starting fresh or clearing data.
	 */
	reset(): void;

	/**
	 * Serialize the module state for persistence.
	 * Only include data that should be saved.
	 */
	serialize(): TState;

	/**
	 * Restore the module state from persisted data.
	 * Should handle missing or invalid data gracefully.
	 */
	deserialize(data: TState): void;
}

/**
 * Configuration for state persistence.
 */
export interface PersistenceConfig {
	/** Whether persistence is enabled */
	enabled: boolean;
	/** Debounce delay in milliseconds (default: 1000) */
	debounceMs?: number;
	/** Module keys to exclude from persistence */
	excludeKeys?: string[];
}

/**
 * Configuration for creating an app state context.
 */
export interface AppStateConfig<TModules extends Record<string, () => StateModule>> {
	/** Unique identifier for this tool (used as persistence key) */
	toolId: string;
	/** Module factory functions */
	modules: TModules;
	/** Persistence configuration */
	persistence?: PersistenceConfig;
}

/**
 * Extract the return type of each module factory function.
 */
export type ExtractModules<T extends Record<string, () => StateModule>> = {
	[K in keyof T]: ReturnType<T[K]>;
};
