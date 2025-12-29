/**
 * Tests for state-persistence utility.
 *
 * These tests mock IndexedDB to test the persistence logic.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { StatePersistence, createStatePersistence } from './state-persistence';

// Mock browser environment
vi.mock('$app/environment', () => ({
	browser: true
}));

// Mock IndexedDB
const mockObjectStore = {
	put: vi.fn(),
	get: vi.fn(),
	delete: vi.fn()
};

const mockTransaction = {
	objectStore: vi.fn(() => mockObjectStore)
};

const mockDB = {
	transaction: vi.fn(() => mockTransaction),
	objectStoreNames: { contains: vi.fn(() => true) },
	createObjectStore: vi.fn(),
	close: vi.fn(),
	name: 'test-db'
};

const mockRequest = {
	result: mockDB,
	error: null as Error | null,
	onsuccess: null as (() => void) | null,
	onerror: null as (() => void) | null,
	onupgradeneeded: null as ((event: { target: { result: typeof mockDB } }) => void) | null
};

// Helper to simulate successful request
function simulateSuccess<T>(value: T) {
	return {
		result: value,
		onsuccess: null as (() => void) | null,
		onerror: null as (() => void) | null
	};
}

// Create a mock IndexedDB implementation
function createMockIndexedDB() {
	return {
		open: vi.fn(() => {
			setTimeout(() => {
				if (mockRequest.onsuccess) {
					mockRequest.onsuccess();
				}
			}, 0);
			return mockRequest;
		})
	};
}

describe('StatePersistence', () => {
	beforeEach(() => {
		vi.clearAllMocks();

		// Setup IndexedDB mock on globalThis
		const mockIndexedDB = createMockIndexedDB();
		vi.stubGlobal('indexedDB', mockIndexedDB);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	describe('constructor', () => {
		it('should create instance with default config', () => {
			const persistence = new StatePersistence({
				toolId: 'test-tool'
			});

			expect(persistence).toBeDefined();
			expect(persistence.isAvailable).toBe(true);
		});

		it('should accept custom config', () => {
			const persistence = new StatePersistence({
				toolId: 'test-tool',
				debounceMs: 2000,
				excludeModules: ['logs'],
				version: 2
			});

			expect(persistence).toBeDefined();
		});
	});

	describe('createStatePersistence', () => {
		it('should create instance via factory function', () => {
			const persistence = createStatePersistence({
				toolId: 'test-tool'
			});

			expect(persistence).toBeInstanceOf(StatePersistence);
		});
	});

	describe('isAvailable', () => {
		it('should return true when IndexedDB is available', () => {
			const persistence = new StatePersistence({ toolId: 'test' });
			expect(persistence.isAvailable).toBe(true);
		});

		it('should return false when IndexedDB is not available', () => {
			vi.stubGlobal('indexedDB', undefined);

			const persistence = new StatePersistence({ toolId: 'test' });
			expect(persistence.isAvailable).toBe(false);
		});
	});

	describe('save', () => {
		it('should save state to IndexedDB', async () => {
			const persistence = new StatePersistence({ toolId: 'test-tool' });

			// Setup mock to resolve successfully
			mockObjectStore.put.mockImplementation(() => {
				const req = simulateSuccess(undefined);
				setTimeout(() => req.onsuccess?.(), 0);
				return req;
			});

			const state = {
				module1: { value: 1 },
				module2: { value: 2 }
			};

			await persistence.save(state);

			expect(mockObjectStore.put).toHaveBeenCalledWith(
				expect.objectContaining({
					toolId: 'test-tool',
					state,
					version: 1
				})
			);
		});

		it('should filter out excluded modules', async () => {
			const persistence = new StatePersistence({
				toolId: 'test-tool',
				excludeModules: ['excluded']
			});

			mockObjectStore.put.mockImplementation(() => {
				const req = simulateSuccess(undefined);
				setTimeout(() => req.onsuccess?.(), 0);
				return req;
			});

			const state = {
				included: { value: 1 },
				excluded: { value: 2 }
			};

			await persistence.save(state);

			expect(mockObjectStore.put).toHaveBeenCalledWith(
				expect.objectContaining({
					state: { included: { value: 1 } }
				})
			);
		});
	});

	describe('saveDebounced', () => {
		it('should debounce multiple saves', async () => {
			vi.useFakeTimers();

			const persistence = new StatePersistence({
				toolId: 'test-tool',
				debounceMs: 100
			});

			mockObjectStore.put.mockImplementation(() => {
				const req = simulateSuccess(undefined);
				setTimeout(() => req.onsuccess?.(), 0);
				return req;
			});

			// Multiple rapid calls
			persistence.saveDebounced({ value: 1 });
			persistence.saveDebounced({ value: 2 });
			persistence.saveDebounced({ value: 3 });

			// Should not have saved yet
			expect(mockObjectStore.put).not.toHaveBeenCalled();

			// Fast-forward time
			await vi.advanceTimersByTimeAsync(150);

			// Should have saved only once with last value
			expect(mockObjectStore.put).toHaveBeenCalledTimes(1);

			vi.useRealTimers();
		});

		it('cancelPendingSave should cancel debounced save', async () => {
			vi.useFakeTimers();

			const persistence = new StatePersistence({
				toolId: 'test-tool',
				debounceMs: 100
			});

			persistence.saveDebounced({ value: 1 });
			persistence.cancelPendingSave();

			await vi.advanceTimersByTimeAsync(150);

			expect(mockObjectStore.put).not.toHaveBeenCalled();

			vi.useRealTimers();
		});
	});

	describe('load', () => {
		it('should load state from IndexedDB', async () => {
			const persistence = new StatePersistence({ toolId: 'test-tool' });

			const savedRecord = {
				toolId: 'test-tool',
				state: { module1: { value: 42 } },
				savedAt: Date.now(),
				version: 1
			};

			mockObjectStore.get.mockImplementation(() => {
				const req = simulateSuccess(savedRecord);
				setTimeout(() => req.onsuccess?.(), 0);
				return req;
			});

			const result = await persistence.load();

			expect(result).toEqual({ module1: { value: 42 } });
		});

		it('should return null when no saved state', async () => {
			const persistence = new StatePersistence({ toolId: 'test-tool' });

			mockObjectStore.get.mockImplementation(() => {
				const req = simulateSuccess(undefined);
				setTimeout(() => req.onsuccess?.(), 0);
				return req;
			});

			const result = await persistence.load();

			expect(result).toBeNull();
		});

		it('should discard state with version mismatch', async () => {
			const persistence = new StatePersistence({
				toolId: 'test-tool',
				version: 2
			});

			const savedRecord = {
				toolId: 'test-tool',
				state: { module1: { value: 42 } },
				savedAt: Date.now(),
				version: 1 // Old version
			};

			mockObjectStore.get.mockImplementation(() => {
				const req = simulateSuccess(savedRecord);
				setTimeout(() => req.onsuccess?.(), 0);
				return req;
			});

			mockObjectStore.delete.mockImplementation(() => {
				const req = simulateSuccess(undefined);
				setTimeout(() => req.onsuccess?.(), 0);
				return req;
			});

			const result = await persistence.load();

			expect(result).toBeNull();
			expect(mockObjectStore.delete).toHaveBeenCalled();
		});
	});

	describe('getMetadata', () => {
		it('should return metadata for saved state', async () => {
			const persistence = new StatePersistence({ toolId: 'test-tool' });

			const savedAt = Date.now();
			const savedRecord = {
				toolId: 'test-tool',
				state: {},
				savedAt,
				version: 1
			};

			mockObjectStore.get.mockImplementation(() => {
				const req = simulateSuccess(savedRecord);
				setTimeout(() => req.onsuccess?.(), 0);
				return req;
			});

			const metadata = await persistence.getMetadata();

			expect(metadata).toEqual({
				savedAt,
				version: 1
			});
		});

		it('should return null when no saved state', async () => {
			const persistence = new StatePersistence({ toolId: 'test-tool' });

			mockObjectStore.get.mockImplementation(() => {
				const req = simulateSuccess(undefined);
				setTimeout(() => req.onsuccess?.(), 0);
				return req;
			});

			const metadata = await persistence.getMetadata();

			expect(metadata).toBeNull();
		});
	});

	describe('hasSavedState', () => {
		it('should return true when state exists', async () => {
			const persistence = new StatePersistence({ toolId: 'test-tool' });

			mockObjectStore.get.mockImplementation(() => {
				const req = simulateSuccess({
					toolId: 'test-tool',
					state: {},
					savedAt: Date.now(),
					version: 1
				});
				setTimeout(() => req.onsuccess?.(), 0);
				return req;
			});

			const result = await persistence.hasSavedState();

			expect(result).toBe(true);
		});

		it('should return false when no state exists', async () => {
			const persistence = new StatePersistence({ toolId: 'test-tool' });

			mockObjectStore.get.mockImplementation(() => {
				const req = simulateSuccess(undefined);
				setTimeout(() => req.onsuccess?.(), 0);
				return req;
			});

			const result = await persistence.hasSavedState();

			expect(result).toBe(false);
		});
	});

	describe('clear', () => {
		it('should delete saved state', async () => {
			const persistence = new StatePersistence({ toolId: 'test-tool' });

			mockObjectStore.delete.mockImplementation(() => {
				const req = simulateSuccess(undefined);
				setTimeout(() => req.onsuccess?.(), 0);
				return req;
			});

			await persistence.clear();

			expect(mockObjectStore.delete).toHaveBeenCalledWith('test-tool');
		});
	});

	describe('close', () => {
		it('should close database connection', () => {
			const persistence = new StatePersistence({ toolId: 'test-tool' });

			// Force db to be set
			(persistence as unknown as { db: typeof mockDB }).db = mockDB;

			persistence.close();

			expect(mockDB.close).toHaveBeenCalled();
		});

		it('should cancel pending saves', () => {
			vi.useFakeTimers();

			const persistence = new StatePersistence({
				toolId: 'test-tool',
				debounceMs: 100
			});

			persistence.saveDebounced({ value: 1 });
			persistence.close();

			vi.advanceTimersByTime(150);

			expect(mockObjectStore.put).not.toHaveBeenCalled();

			vi.useRealTimers();
		});
	});
});
