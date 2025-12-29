/**
 * Composable for managing state persistence with Svelte 5 reactivity.
 *
 * This composable provides a reactive interface for persisting and restoring
 * app state, with automatic save on state changes.
 *
 * ## Usage
 *
 * ```svelte
 * <script>
 *   import { createAppStateContext } from '$lib/stores';
 *   import { useStatePersistence } from '$lib/stores/utils/use-state-persistence.svelte';
 *
 *   const appState = createAppStateContext({ ... });
 *
 *   const persistence = useStatePersistence({
 *     appState,
 *     toolId: 'my-tool',
 *     enabled: true,
 *     autoSave: true
 *   });
 *
 *   // Check for saved state on mount
 *   $effect(() => {
 *     if (persistence.hasSavedState && !persistence.isRestored) {
 *       // Show restore dialog
 *     }
 *   });
 * </script>
 * ```
 *
 * @module
 */

import { onDestroy } from 'svelte';
import { browser } from '$app/environment';
import { StatePersistence, type StatePersistenceConfig } from './state-persistence';
import type { AppStateHelpers } from '../create-app-state-context.svelte';

/**
 * Configuration for useStatePersistence.
 */
export interface UseStatePersistenceConfig extends Omit<StatePersistenceConfig, 'toolId'> {
	/** The app state object from createAppStateContext */
	appState: AppStateHelpers;
	/** Tool identifier (defaults to appState.toolId) */
	toolId?: string;
	/** Whether persistence is enabled (default: true) */
	enabled?: boolean;
	/** Whether to auto-save on state changes (default: false) */
	autoSave?: boolean;
	/** Callback when state is restored */
	onRestore?: () => void;
	/** Callback when state is saved */
	onSave?: () => void;
}

/**
 * Return type for useStatePersistence.
 */
export interface UseStatePersistenceReturn {
	/** Whether persistence is available (browser + IndexedDB) */
	readonly isAvailable: boolean;
	/** Whether there is saved state */
	readonly hasSavedState: boolean;
	/** Whether state has been restored in this session */
	readonly isRestored: boolean;
	/** Whether currently loading/saving */
	readonly isLoading: boolean;
	/** Last save timestamp */
	readonly lastSavedAt: number | null;
	/** Error message if any */
	readonly error: string | null;

	/** Check for saved state */
	checkSavedState(): Promise<void>;
	/** Restore saved state */
	restore(): Promise<boolean>;
	/** Save current state */
	save(): Promise<void>;
	/** Clear saved state */
	clear(): Promise<void>;
	/** Enable auto-save */
	enableAutoSave(): void;
	/** Disable auto-save */
	disableAutoSave(): void;
}

/**
 * Composable for managing state persistence.
 *
 * @param config - Configuration options
 * @returns Persistence state and methods
 */
export function useStatePersistence(config: UseStatePersistenceConfig): UseStatePersistenceReturn {
	const {
		appState,
		toolId = appState.toolId,
		enabled = true,
		autoSave = false,
		excludeModules = [],
		debounceMs = 1000,
		version = 1,
		onRestore,
		onSave
	} = config;

	// State
	let isAvailable = $state(false);
	let hasSavedState = $state(false);
	let isRestored = $state(false);
	let isLoading = $state(false);
	let lastSavedAt = $state<number | null>(null);
	let error = $state<string | null>(null);
	let autoSaveEnabled = $state(autoSave);

	// Persistence instance
	let persistence: StatePersistence | null = null;

	// Initialize on browser
	if (browser && enabled) {
		persistence = new StatePersistence({
			toolId,
			debounceMs,
			excludeModules,
			version
		});
		isAvailable = persistence.isAvailable;
	}

	// Check for saved state
	async function checkSavedState(): Promise<void> {
		if (!persistence || !isAvailable) return;

		try {
			isLoading = true;
			error = null;
			const metadata = await persistence.getMetadata();
			hasSavedState = metadata !== null;
			if (metadata) {
				lastSavedAt = metadata.savedAt;
			}
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to check saved state';
		} finally {
			isLoading = false;
		}
	}

	// Restore saved state
	async function restore(): Promise<boolean> {
		if (!persistence || !isAvailable) return false;

		try {
			isLoading = true;
			error = null;
			const savedState = await persistence.load();

			if (savedState) {
				appState.deserializeAll(savedState);
				isRestored = true;
				hasSavedState = true;
				onRestore?.();
				return true;
			}
			return false;
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to restore state';
			return false;
		} finally {
			isLoading = false;
		}
	}

	// Save current state
	async function save(): Promise<void> {
		if (!persistence || !isAvailable) return;

		try {
			error = null;
			const serialized = appState.serializeAll();
			await persistence.save(serialized);
			lastSavedAt = Date.now();
			hasSavedState = true;
			onSave?.();
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to save state';
		}
	}

	// Save with debouncing (for auto-save)
	function saveDebounced(): void {
		if (!persistence || !isAvailable) return;

		const serialized = appState.serializeAll();
		persistence.saveDebounced(serialized);
	}

	// Clear saved state
	async function clear(): Promise<void> {
		if (!persistence || !isAvailable) return;

		try {
			error = null;
			await persistence.clear();
			hasSavedState = false;
			lastSavedAt = null;
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to clear state';
		}
	}

	// Enable auto-save
	function enableAutoSave(): void {
		autoSaveEnabled = true;
	}

	// Disable auto-save
	function disableAutoSave(): void {
		autoSaveEnabled = false;
		persistence?.cancelPendingSave();
	}

	// Auto-save effect - watches state changes
	$effect(() => {
		if (!autoSaveEnabled || !persistence || !isAvailable) return;

		// Trigger save when state changes
		// This will be called whenever any state in appState changes
		// We call serializeAll to create a reactive dependency on appState
		appState.serializeAll();
		saveDebounced();
	});

	// Check for saved state on mount
	$effect(() => {
		if (browser && enabled && isAvailable) {
			checkSavedState();
		}
	});

	// Cleanup on destroy
	onDestroy(() => {
		persistence?.close();
	});

	return {
		get isAvailable() {
			return isAvailable;
		},
		get hasSavedState() {
			return hasSavedState;
		},
		get isRestored() {
			return isRestored;
		},
		get isLoading() {
			return isLoading;
		},
		get lastSavedAt() {
			return lastSavedAt;
		},
		get error() {
			return error;
		},
		checkSavedState,
		restore,
		save,
		clear,
		enableAutoSave,
		disableAutoSave
	};
}
