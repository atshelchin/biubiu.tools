/**
 * Tests for create-app-state-context.
 *
 * Note: Context functions require a Svelte component context to work.
 * These tests focus on the module creation and helper logic.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { StateModule } from './types';

// Mock svelte context functions
vi.mock('svelte', () => ({
	setContext: vi.fn(),
	getContext: vi.fn()
}));

import { setContext, getContext } from 'svelte';
import { createAppStateContext, getAppState, hasAppState } from './create-app-state-context.svelte';

// Test module factory
function createTestModule(): StateModule<{ count: number }> & { count: number; increment(): void } {
	let count = $state(0);

	return {
		get count() {
			return count;
		},
		increment() {
			count++;
		},
		reset() {
			count = 0;
		},
		serialize() {
			return { count };
		},
		deserialize(data) {
			count = data.count;
		}
	};
}

// Another test module
function createAnotherModule(): StateModule<{ name: string }> & {
	name: string;
	setName(n: string): void;
} {
	let name = $state('default');

	return {
		get name() {
			return name;
		},
		setName(n: string) {
			name = n;
		},
		reset() {
			name = 'default';
		},
		serialize() {
			return { name };
		},
		deserialize(data) {
			name = data.name;
		}
	};
}

describe('createAppStateContext', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('module creation', () => {
		it('should create instances of all provided modules', () => {
			const appState = createAppStateContext({
				toolId: 'test-tool',
				modules: {
					testModule: createTestModule,
					anotherModule: createAnotherModule
				}
			});

			expect(appState.testModule).toBeDefined();
			expect(appState.anotherModule).toBeDefined();
			expect(appState.testModule.count).toBe(0);
			expect(appState.anotherModule.name).toBe('default');
		});

		it('should set context with the created state', () => {
			createAppStateContext({
				toolId: 'test-tool',
				modules: {
					testModule: createTestModule
				}
			});

			expect(setContext).toHaveBeenCalledTimes(1);
			expect(setContext).toHaveBeenCalledWith(
				expect.any(Symbol),
				expect.objectContaining({
					testModule: expect.any(Object),
					toolId: 'test-tool'
				})
			);
		});

		it('should include toolId in the state', () => {
			const appState = createAppStateContext({
				toolId: 'my-unique-tool',
				modules: {
					testModule: createTestModule
				}
			});

			expect(appState.toolId).toBe('my-unique-tool');
		});
	});

	describe('helper methods', () => {
		it('resetAll should reset all modules', () => {
			const appState = createAppStateContext({
				toolId: 'test-tool',
				modules: {
					testModule: createTestModule,
					anotherModule: createAnotherModule
				}
			});

			// Modify state
			appState.testModule.increment();
			appState.anotherModule.setName('modified');

			expect(appState.testModule.count).toBe(1);
			expect(appState.anotherModule.name).toBe('modified');

			// Reset all
			appState.resetAll();

			expect(appState.testModule.count).toBe(0);
			expect(appState.anotherModule.name).toBe('default');
		});

		it('serializeAll should serialize all modules', () => {
			const appState = createAppStateContext({
				toolId: 'test-tool',
				modules: {
					testModule: createTestModule,
					anotherModule: createAnotherModule
				}
			});

			appState.testModule.increment();
			appState.testModule.increment();
			appState.anotherModule.setName('serialized');

			const serialized = appState.serializeAll();

			expect(serialized).toEqual({
				testModule: { count: 2 },
				anotherModule: { name: 'serialized' }
			});
		});

		it('serializeAll should exclude specified keys', () => {
			const appState = createAppStateContext({
				toolId: 'test-tool',
				modules: {
					testModule: createTestModule,
					anotherModule: createAnotherModule
				},
				persistence: {
					enabled: true,
					excludeKeys: ['anotherModule']
				}
			});

			appState.testModule.increment();
			appState.anotherModule.setName('excluded');

			const serialized = appState.serializeAll();

			expect(serialized).toEqual({
				testModule: { count: 1 }
			});
			expect(serialized.anotherModule).toBeUndefined();
		});

		it('deserializeAll should restore all modules', () => {
			const appState = createAppStateContext({
				toolId: 'test-tool',
				modules: {
					testModule: createTestModule,
					anotherModule: createAnotherModule
				}
			});

			appState.deserializeAll({
				testModule: { count: 42 },
				anotherModule: { name: 'restored' }
			});

			expect(appState.testModule.count).toBe(42);
			expect(appState.anotherModule.name).toBe('restored');
		});

		it('deserializeAll should handle missing module data gracefully', () => {
			const appState = createAppStateContext({
				toolId: 'test-tool',
				modules: {
					testModule: createTestModule,
					anotherModule: createAnotherModule
				}
			});

			// Only provide data for one module
			appState.deserializeAll({
				testModule: { count: 10 }
			});

			expect(appState.testModule.count).toBe(10);
			expect(appState.anotherModule.name).toBe('default'); // Unchanged
		});

		it('deserializeAll should handle errors gracefully without crashing', () => {
			// Create a module that throws on deserialize
			function createThrowingModule(): StateModule<{ value: number }> & { value: number } {
				let value = $state(0);
				return {
					get value() {
						return value;
					},
					reset() {
						value = 0;
					},
					serialize() {
						return { value };
					},
					deserialize(data) {
						if (data === null || data === undefined) {
							throw new Error('Invalid data');
						}
						value = data.value;
					}
				};
			}

			const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

			const appState = createAppStateContext({
				toolId: 'test-tool',
				modules: {
					throwingModule: createThrowingModule
				}
			});

			// Should not throw, just warn
			expect(() => {
				appState.deserializeAll({
					throwingModule: null as unknown as { value: number }
				});
			}).not.toThrow();

			expect(consoleSpy).toHaveBeenCalledWith(
				expect.stringContaining('Failed to deserialize'),
				expect.any(Error)
			);

			consoleSpy.mockRestore();
		});
	});
});

describe('getAppState', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should return the context value when it exists', () => {
		const mockState = { testModule: { count: 5 } };
		vi.mocked(getContext).mockReturnValue(mockState);

		const result = getAppState();

		expect(result).toBe(mockState);
	});

	it('should throw an error when context is not found', () => {
		vi.mocked(getContext).mockReturnValue(undefined);

		expect(() => getAppState()).toThrow('[AppState] Context not found');
	});
});

describe('hasAppState', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should return true when context exists', () => {
		vi.mocked(getContext).mockReturnValue({ some: 'state' });

		expect(hasAppState()).toBe(true);
	});

	it('should return false when context is undefined', () => {
		vi.mocked(getContext).mockReturnValue(undefined);

		expect(hasAppState()).toBe(false);
	});

	it('should return false when getContext throws', () => {
		vi.mocked(getContext).mockImplementation(() => {
			throw new Error('No context');
		});

		expect(hasAppState()).toBe(false);
	});
});
