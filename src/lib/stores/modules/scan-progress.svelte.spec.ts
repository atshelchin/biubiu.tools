/**
 * Tests for scan-progress module.
 */

import { describe, it, expect } from 'vitest';
import { createScanProgressModule, type ScanResultItem } from './scan-progress.svelte';

// Test result type
interface TestResult extends ScanResultItem {
	id: string;
	value: number;
}

// Test data
const mockResults: TestResult[] = [
	{ id: '1', value: 100 },
	{ id: '2', value: 200 },
	{ id: '3', value: 300 }
];

describe('createScanProgressModule', () => {
	describe('initial state', () => {
		it('should have correct initial values', () => {
			const module = createScanProgressModule<TestResult>();

			expect(module.status).toBe('idle');
			expect(module.isIdle).toBe(true);
			expect(module.progress).toEqual({ current: 0, total: 0, percentage: 0 });
			expect(module.results).toEqual([]);
			expect(module.error).toBeNull();
			expect(module.hasResults).toBe(false);
		});
	});

	describe('status transitions', () => {
		it('startScan should set scanning status and generate sessionId', () => {
			const module = createScanProgressModule<TestResult>();

			module.startScan();

			expect(module.status).toBe('scanning');
			expect(module.isScanning).toBe(true);
			expect(module.sessionId).toBeTruthy();
		});

		it('startScan should use provided sessionId', () => {
			const module = createScanProgressModule<TestResult>();

			module.startScan('custom-session-id');

			expect(module.sessionId).toBe('custom-session-id');
		});

		it('pauseScan should pause only when scanning', () => {
			const module = createScanProgressModule<TestResult>();

			module.startScan();
			module.pauseScan();

			expect(module.status).toBe('paused');
			expect(module.isPaused).toBe(true);
		});

		it('pauseScan should not change status when not scanning', () => {
			const module = createScanProgressModule<TestResult>();

			module.pauseScan(); // Should do nothing

			expect(module.status).toBe('idle');
		});

		it('resumeScan should resume only when paused', () => {
			const module = createScanProgressModule<TestResult>();

			module.startScan();
			module.pauseScan();
			module.resumeScan();

			expect(module.status).toBe('scanning');
		});

		it('completeScan should set completed status', () => {
			const module = createScanProgressModule<TestResult>();

			module.startScan();
			module.completeScan();

			expect(module.status).toBe('completed');
			expect(module.isCompleted).toBe(true);
		});

		it('setError should set error status and message', () => {
			const module = createScanProgressModule<TestResult>();

			module.setError('Something went wrong');

			expect(module.status).toBe('error');
			expect(module.error).toBe('Something went wrong');
			expect(module.hasError).toBe(true);
		});

		it('clearError should clear error and reset to idle', () => {
			const module = createScanProgressModule<TestResult>();

			module.setError('Error');
			module.clearError();

			expect(module.error).toBeNull();
			expect(module.status).toBe('idle');
		});
	});

	describe('progress', () => {
		it('setProgress should update progress', () => {
			const module = createScanProgressModule<TestResult>();

			module.setProgress({ current: 50, total: 100, percentage: 50 });

			expect(module.progress.current).toBe(50);
			expect(module.progress.total).toBe(100);
			expect(module.progress.percentage).toBe(50);
		});

		it('incrementProgress should update current and calculate percentage', () => {
			const module = createScanProgressModule<TestResult>();

			module.setProgress({ current: 0, total: 100, percentage: 0 });
			module.incrementProgress(25);

			expect(module.progress.current).toBe(25);
			expect(module.progress.percentage).toBe(25);
		});
	});

	describe('results', () => {
		it('setResults should replace all results', () => {
			const module = createScanProgressModule<TestResult>();

			module.setResults(mockResults);

			expect(module.results).toEqual(mockResults);
			expect(module.resultCount).toBe(3);
			expect(module.hasResults).toBe(true);
		});

		it('addResult should append a single result', () => {
			const module = createScanProgressModule<TestResult>();

			module.addResult({ id: '1', value: 100 });
			module.addResult({ id: '2', value: 200 });

			expect(module.resultCount).toBe(2);
		});

		it('addResults should append multiple results', () => {
			const module = createScanProgressModule<TestResult>();

			module.addResult({ id: '0', value: 0 });
			module.addResults(mockResults);

			expect(module.resultCount).toBe(4);
		});

		it('clearResults should remove all results', () => {
			const module = createScanProgressModule<TestResult>();

			module.setResults(mockResults);
			module.clearResults();

			expect(module.resultCount).toBe(0);
			expect(module.hasResults).toBe(false);
		});
	});

	describe('logs', () => {
		it('addLog should add log entries', () => {
			const module = createScanProgressModule<TestResult>();

			module.addLog('info', 'Starting scan');
			module.addLog('success', 'Scan complete');

			expect(module.logs.length).toBe(2);
			expect(module.logs[0].type).toBe('info');
			expect(module.logs[0].message).toBe('Starting scan');
		});

		it('addLog should keep only last 100 entries', () => {
			const module = createScanProgressModule<TestResult>();

			// Add 150 logs
			for (let i = 0; i < 150; i++) {
				module.addLog('info', `Log ${i}`);
			}

			expect(module.logs.length).toBe(100);
			expect(module.logs[0].message).toBe('Log 50'); // First 50 should be removed
		});

		it('clearLogs should remove all logs', () => {
			const module = createScanProgressModule<TestResult>();

			module.addLog('info', 'Test');
			module.clearLogs();

			expect(module.logs.length).toBe(0);
		});
	});

	describe('pagination', () => {
		it('should calculate pagination correctly', () => {
			const module = createScanProgressModule<TestResult>();

			// Add 75 results with pageSize 50
			const manyResults = Array.from({ length: 75 }, (_, i) => ({ id: String(i), value: i }));
			module.setResults(manyResults);

			expect(module.pagination.totalItems).toBe(75);
			expect(module.pagination.totalPages).toBe(2);
			expect(module.pagination.page).toBe(1);
		});

		it('paginatedResults should return correct slice', () => {
			const module = createScanProgressModule<TestResult>();

			const manyResults = Array.from({ length: 75 }, (_, i) => ({ id: String(i), value: i }));
			module.setResults(manyResults);

			expect(module.paginatedResults.length).toBe(50); // First page

			module.setPage(2);
			expect(module.paginatedResults.length).toBe(25); // Second page
		});

		it('setPageSize should reset to first page', () => {
			const module = createScanProgressModule<TestResult>();

			const manyResults = Array.from({ length: 75 }, (_, i) => ({ id: String(i), value: i }));
			module.setResults(manyResults);
			module.setPage(2);
			module.setPageSize(25);

			expect(module.pagination.page).toBe(1);
			expect(module.pagination.totalPages).toBe(3);
		});

		it('should adjust page if current page becomes invalid', () => {
			const module = createScanProgressModule<TestResult>();

			const manyResults = Array.from({ length: 100 }, (_, i) => ({ id: String(i), value: i }));
			module.setResults(manyResults);
			module.setPage(2);

			// Now reduce results so page 2 is invalid
			module.setResults(manyResults.slice(0, 30));

			expect(module.pagination.page).toBe(1);
		});
	});

	describe('reset', () => {
		it('should reset all state', () => {
			const module = createScanProgressModule<TestResult>();

			module.startScan();
			module.setResults(mockResults);
			module.addLog('info', 'Test');

			module.reset();

			expect(module.status).toBe('idle');
			expect(module.results).toEqual([]);
			expect(module.logs.length).toBe(0);
			expect(module.sessionId).toBeNull();
		});
	});

	describe('serialization', () => {
		it('should serialize state correctly', () => {
			const module = createScanProgressModule<TestResult>();

			module.startScan('session-123');
			module.setProgress({ current: 50, total: 100, percentage: 50 });
			module.setResults(mockResults);

			const serialized = module.serialize();

			expect(serialized.status).toBe('scanning');
			expect(serialized.sessionId).toBe('session-123');
			expect(serialized.results).toEqual(mockResults);
		});

		it('should deserialize state correctly', () => {
			const module = createScanProgressModule<TestResult>();

			module.deserialize({
				status: 'completed',
				progress: { current: 100, total: 100, percentage: 100 },
				results: mockResults,
				error: null,
				sessionId: 'restored-session'
			});

			expect(module.status).toBe('completed');
			expect(module.results).toEqual(mockResults);
			expect(module.sessionId).toBe('restored-session');
			expect(module.pagination.totalItems).toBe(3); // Pagination should be updated
		});

		it('should handle null/undefined data gracefully', () => {
			const module = createScanProgressModule<TestResult>();

			module.deserialize(null as unknown as ReturnType<typeof module.serialize>);
			module.deserialize(undefined as unknown as ReturnType<typeof module.serialize>);

			expect(module.status).toBe('idle');
		});
	});
});
