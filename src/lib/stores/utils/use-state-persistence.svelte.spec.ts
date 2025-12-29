/**
 * Tests for use-state-persistence composable.
 *
 * These tests verify the reactive persistence wrapper works correctly.
 * Since useStatePersistence uses $effect, we need to run tests within
 * an effect root to properly execute effects.
 *
 * Note: Async operations are tested in state-persistence.spec.ts.
 * This file focuses on the composable's reactive interface.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock onDestroy first, before any imports that use it
vi.mock('svelte', async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...(actual as object),
		onDestroy: vi.fn()
	};
});

// Mock browser environment
vi.mock('$app/environment', () => ({
	browser: true
}));

// Create mock IndexedDB
function createMockIndexedDB() {
	const mockDB = {
		transaction: vi.fn(() => ({
			objectStore: vi.fn(() => ({
				put: vi.fn(),
				get: vi.fn(),
				delete: vi.fn()
			}))
		})),
		objectStoreNames: { contains: vi.fn(() => true) },
		createObjectStore: vi.fn(),
		close: vi.fn(),
		name: 'test-db'
	};

	const mockRequest = {
		result: mockDB,
		onsuccess: null as (() => void) | null,
		onerror: null as (() => void) | null
	};

	return {
		open: vi.fn(() => {
			setTimeout(() => mockRequest.onsuccess?.(), 0);
			return mockRequest;
		})
	};
}

// Create a mock app state
function createMockAppState() {
	return {
		toolId: 'test-tool',
		serializeAll: vi.fn(() => ({ module1: { value: 1 } })),
		deserializeAll: vi.fn(),
		resetAll: vi.fn()
	};
}

// Import after mocking
import { useStatePersistence } from './use-state-persistence.svelte';
import type { AppStateHelpers } from '../create-app-state-context.svelte';

// Helper to run test within effect root
function withEffectRoot<T>(fn: () => T): { result: T; cleanup: () => void } {
	let result: T;
	const cleanup = $effect.root(() => {
		result = fn();
	});
	return { result: result!, cleanup };
}

describe('useStatePersistence', () => {
	let cleanupFn: (() => void) | null = null;

	beforeEach(() => {
		vi.clearAllMocks();

		// Setup IndexedDB mock
		const mockIndexedDB = createMockIndexedDB();
		vi.stubGlobal('indexedDB', mockIndexedDB);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		cleanupFn?.();
		cleanupFn = null;
	});

	describe('initialization', () => {
		it('should initialize with default values', () => {
			const appState = createMockAppState() as unknown as AppStateHelpers;

			const { result, cleanup } = withEffectRoot(() => useStatePersistence({ appState }));
			cleanupFn = cleanup;

			expect(result.isAvailable).toBe(true);
			expect(result.hasSavedState).toBe(false);
			expect(result.isRestored).toBe(false);
			expect(result.isLoading).toBe(false);
			expect(result.lastSavedAt).toBeNull();
			expect(result.error).toBeNull();
		});

		it('should use toolId from appState if not provided', () => {
			const appState = createMockAppState() as unknown as AppStateHelpers;

			const { result, cleanup } = withEffectRoot(() => useStatePersistence({ appState }));
			cleanupFn = cleanup;

			// The persistence instance should use the toolId from appState
			expect(result.isAvailable).toBe(true);
		});

		it('should allow custom toolId', () => {
			const appState = createMockAppState() as unknown as AppStateHelpers;

			const { result, cleanup } = withEffectRoot(() =>
				useStatePersistence({
					appState,
					toolId: 'custom-tool'
				})
			);
			cleanupFn = cleanup;

			expect(result.isAvailable).toBe(true);
		});

		it('should be disabled when enabled is false', () => {
			const appState = createMockAppState() as unknown as AppStateHelpers;

			const { result, cleanup } = withEffectRoot(() =>
				useStatePersistence({
					appState,
					enabled: false
				})
			);
			cleanupFn = cleanup;

			expect(result.isAvailable).toBe(false);
		});
	});

	describe('methods exist', () => {
		it('should have all required methods', () => {
			const appState = createMockAppState() as unknown as AppStateHelpers;

			const { result, cleanup } = withEffectRoot(() => useStatePersistence({ appState }));
			cleanupFn = cleanup;

			expect(typeof result.checkSavedState).toBe('function');
			expect(typeof result.restore).toBe('function');
			expect(typeof result.save).toBe('function');
			expect(typeof result.clear).toBe('function');
			expect(typeof result.enableAutoSave).toBe('function');
			expect(typeof result.disableAutoSave).toBe('function');
		});
	});

	describe('enableAutoSave/disableAutoSave', () => {
		it('should toggle auto-save without errors', () => {
			const appState = createMockAppState() as unknown as AppStateHelpers;

			const { result, cleanup } = withEffectRoot(() =>
				useStatePersistence({
					appState,
					autoSave: false
				})
			);
			cleanupFn = cleanup;

			// These should not throw
			expect(() => result.enableAutoSave()).not.toThrow();
			expect(() => result.disableAutoSave()).not.toThrow();
		});
	});

	describe('configuration options', () => {
		it('should accept excludeModules option', () => {
			const appState = createMockAppState() as unknown as AppStateHelpers;

			const { result, cleanup } = withEffectRoot(() =>
				useStatePersistence({
					appState,
					excludeModules: ['logs', 'scanner']
				})
			);
			cleanupFn = cleanup;

			expect(result.isAvailable).toBe(true);
		});

		it('should accept debounceMs option', () => {
			const appState = createMockAppState() as unknown as AppStateHelpers;

			const { result, cleanup } = withEffectRoot(() =>
				useStatePersistence({
					appState,
					debounceMs: 2000
				})
			);
			cleanupFn = cleanup;

			expect(result.isAvailable).toBe(true);
		});

		it('should accept version option', () => {
			const appState = createMockAppState() as unknown as AppStateHelpers;

			const { result, cleanup } = withEffectRoot(() =>
				useStatePersistence({
					appState,
					version: 2
				})
			);
			cleanupFn = cleanup;

			expect(result.isAvailable).toBe(true);
		});

		it('should accept callback options', () => {
			const appState = createMockAppState() as unknown as AppStateHelpers;
			const onRestore = vi.fn();
			const onSave = vi.fn();

			const { result, cleanup } = withEffectRoot(() =>
				useStatePersistence({
					appState,
					onRestore,
					onSave
				})
			);
			cleanupFn = cleanup;

			expect(result.isAvailable).toBe(true);
		});
	});

	describe('when IndexedDB is unavailable', () => {
		it('should handle missing IndexedDB gracefully', () => {
			vi.stubGlobal('indexedDB', undefined);

			const appState = createMockAppState() as unknown as AppStateHelpers;

			const { result, cleanup } = withEffectRoot(() => useStatePersistence({ appState }));
			cleanupFn = cleanup;

			expect(result.isAvailable).toBe(false);
		});

		it('should not fail when calling methods with IndexedDB unavailable', () => {
			vi.stubGlobal('indexedDB', undefined);

			const appState = createMockAppState() as unknown as AppStateHelpers;

			const { result, cleanup } = withEffectRoot(() => useStatePersistence({ appState }));
			cleanupFn = cleanup;

			// These should not throw even when IndexedDB is unavailable
			expect(() => result.enableAutoSave()).not.toThrow();
			expect(() => result.disableAutoSave()).not.toThrow();
		});
	});
});
