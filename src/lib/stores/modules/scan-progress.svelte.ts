/**
 * Scan progress state module.
 *
 * This module manages the state for scan/processing operations in multi-step tools.
 * It handles scan status, progress, results, filtering, and pagination.
 *
 * ## Usage
 *
 * ```typescript
 * const appState = createAppStateContext({
 *   toolId: 'my-tool',
 *   modules: {
 *     scanner: createScanProgressModule
 *   }
 * });
 *
 * // Start scanning
 * scanner.startScan();
 *
 * // Update progress
 * scanner.setProgress({ current: 50, total: 100, percentage: 50 });
 *
 * // Set results
 * scanner.setResults(results);
 * ```
 *
 * @module
 */

import type { StateModule } from '../types';

/**
 * Scan status types.
 */
export type ScanStatus = 'idle' | 'scanning' | 'paused' | 'completed' | 'error';

/**
 * Progress information.
 */
export interface ScanProgressInfo {
	current: number;
	total: number;
	percentage: number;
}

/**
 * Generic result item constraint.
 * Result items should be objects - no specific shape required.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ScanResultItem {}

/**
 * Log entry for scan operations.
 */
export interface ScanLogEntry {
	timestamp: number;
	type: 'info' | 'warning' | 'error' | 'success';
	message: string;
}

/**
 * Pagination state.
 */
export interface PaginationState {
	page: number;
	pageSize: number;
	totalItems: number;
	totalPages: number;
}

/**
 * Serializable state for persistence.
 */
export interface ScanProgressSerializedState<TResult extends ScanResultItem> {
	status: ScanStatus;
	progress: ScanProgressInfo;
	results: TResult[];
	error: string | null;
	sessionId: string | null;
}

/**
 * Public interface for the scan progress module.
 */
export interface ScanProgressModule<TResult extends ScanResultItem>
	extends StateModule<ScanProgressSerializedState<TResult>> {
	// Readonly state
	readonly status: ScanStatus;
	readonly progress: ScanProgressInfo;
	readonly results: TResult[];
	readonly error: string | null;
	readonly sessionId: string | null;
	readonly logs: readonly ScanLogEntry[];
	readonly pagination: PaginationState;

	// Derived state
	readonly isIdle: boolean;
	readonly isScanning: boolean;
	readonly isPaused: boolean;
	readonly isCompleted: boolean;
	readonly hasError: boolean;
	readonly hasResults: boolean;
	readonly resultCount: number;
	readonly paginatedResults: TResult[];

	// Status actions
	startScan(sessionId?: string): void;
	pauseScan(): void;
	resumeScan(): void;
	completeScan(): void;
	setError(error: string): void;
	clearError(): void;

	// Progress actions
	setProgress(progress: ScanProgressInfo): void;
	incrementProgress(current: number): void;

	// Results actions
	setResults(results: TResult[]): void;
	addResult(result: TResult): void;
	addResults(results: TResult[]): void;
	clearResults(): void;

	// Log actions
	addLog(type: ScanLogEntry['type'], message: string): void;
	clearLogs(): void;

	// Pagination actions
	setPage(page: number): void;
	setPageSize(size: number): void;
}

/**
 * Create a new scan progress module instance.
 *
 * @returns A new ScanProgressModule instance
 */
export function createScanProgressModule<
	TResult extends ScanResultItem = ScanResultItem
>(): ScanProgressModule<TResult> {
	// Internal state
	let status = $state<ScanStatus>('idle');
	let progress = $state<ScanProgressInfo>({ current: 0, total: 0, percentage: 0 });
	let results = $state<TResult[]>([]);
	let error = $state<string | null>(null);
	let sessionId = $state<string | null>(null);
	let logs = $state<ScanLogEntry[]>([]);
	let pagination = $state<PaginationState>({
		page: 1,
		pageSize: 50,
		totalItems: 0,
		totalPages: 0
	});

	// Helper to update pagination
	function updatePagination() {
		const totalItems = results.length;
		pagination.totalItems = totalItems;
		pagination.totalPages = Math.ceil(totalItems / pagination.pageSize);

		// Ensure current page is valid
		if (pagination.page > pagination.totalPages && pagination.totalPages > 0) {
			pagination.page = pagination.totalPages;
		}
	}

	return {
		// Getters for readonly access
		get status() {
			return status;
		},
		get progress() {
			return progress;
		},
		get results() {
			return results;
		},
		get error() {
			return error;
		},
		get sessionId() {
			return sessionId;
		},
		get logs() {
			return logs;
		},
		get pagination() {
			return pagination;
		},

		// Derived state
		get isIdle() {
			return status === 'idle';
		},
		get isScanning() {
			return status === 'scanning';
		},
		get isPaused() {
			return status === 'paused';
		},
		get isCompleted() {
			return status === 'completed';
		},
		get hasError() {
			return status === 'error' || error !== null;
		},
		get hasResults() {
			return results.length > 0;
		},
		get resultCount() {
			return results.length;
		},
		get paginatedResults() {
			const start = (pagination.page - 1) * pagination.pageSize;
			const end = start + pagination.pageSize;
			return results.slice(start, end);
		},

		// Status actions
		startScan(newSessionId?: string) {
			status = 'scanning';
			progress = { current: 0, total: 0, percentage: 0 };
			error = null;
			sessionId = newSessionId ?? crypto.randomUUID();
			logs = [];
		},

		pauseScan() {
			if (status === 'scanning') {
				status = 'paused';
			}
		},

		resumeScan() {
			if (status === 'paused') {
				status = 'scanning';
			}
		},

		completeScan() {
			status = 'completed';
		},

		setError(newError: string) {
			status = 'error';
			error = newError;
		},

		clearError() {
			error = null;
			if (status === 'error') {
				status = 'idle';
			}
		},

		// Progress actions
		setProgress(newProgress: ScanProgressInfo) {
			progress = newProgress;
		},

		incrementProgress(current: number) {
			progress = {
				...progress,
				current,
				percentage: progress.total > 0 ? Math.round((current / progress.total) * 100) : 0
			};
		},

		// Results actions
		setResults(newResults: TResult[]) {
			results = newResults;
			updatePagination();
		},

		addResult(result: TResult) {
			results = [...results, result];
			updatePagination();
		},

		addResults(newResults: TResult[]) {
			results = [...results, ...newResults];
			updatePagination();
		},

		clearResults() {
			results = [];
			updatePagination();
		},

		// Log actions
		addLog(type: ScanLogEntry['type'], message: string) {
			const entry: ScanLogEntry = {
				timestamp: Date.now(),
				type,
				message
			};
			// Keep last 100 logs
			logs = [...logs.slice(-99), entry];
		},

		clearLogs() {
			logs = [];
		},

		// Pagination actions
		setPage(page: number) {
			if (page >= 1 && page <= pagination.totalPages) {
				pagination.page = page;
			}
		},

		setPageSize(size: number) {
			pagination.pageSize = size;
			pagination.page = 1;
			updatePagination();
		},

		// StateModule implementation
		reset() {
			status = 'idle';
			progress = { current: 0, total: 0, percentage: 0 };
			results = [];
			error = null;
			sessionId = null;
			logs = [];
			pagination = {
				page: 1,
				pageSize: 50,
				totalItems: 0,
				totalPages: 0
			};
		},

		serialize(): ScanProgressSerializedState<TResult> {
			return {
				status,
				progress,
				results,
				error,
				sessionId
			};
		},

		deserialize(data: ScanProgressSerializedState<TResult>) {
			if (!data) return;
			status = data.status ?? 'idle';
			progress = data.progress ?? { current: 0, total: 0, percentage: 0 };
			results = data.results ?? [];
			error = data.error ?? null;
			sessionId = data.sessionId ?? null;
			// Don't restore logs - they're transient
			updatePagination();
		}
	};
}
