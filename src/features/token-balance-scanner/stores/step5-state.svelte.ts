/**
 * Shared state for Step 5 scan results
 * Module-level state is shared across all component instances automatically
 */
import type {
	ScanStatus,
	ScanProgress,
	ScanSummary,
	BalanceFilter,
	PaginationState,
	AddressBalance,
	ResumableSession,
	SortState
} from '../types/scanner';
import type { ScanEvent, TokenConfig } from '$lib/services/balance-scanner/types';
import type { ScanSession } from '$lib/services/balance-scanner/storage';
import { parseUnits } from 'viem';

// Module-level state class for reactivity
class Step5StateClass {
	// Scan state
	scanStatus = $state<ScanStatus>('idle');
	scanProgress = $state<ScanProgress>({
		current: 0,
		total: 0,
		percentage: 0
	});
	results = $state<AddressBalance[]>([]);
	summary = $state<ScanSummary | null>(null);
	error = $state<string | null>(null);
	sessionId = $state<string | null>(null);

	// Token configs (for export)
	tokenConfigs = $state<TokenConfig[]>([]);

	// Logs
	logs = $state<ScanEvent[]>([]);

	// Resumable session
	resumableSession = $state<ResumableSession | null>(null);

	// Session to restore from IndexedDB (set when user clicks Resume in modal)
	sessionToRestore = $state<ScanSession | null>(null);

	// Filter state
	filter = $state<BalanceFilter>({
		balanceStatus: 'all',
		tokenId: 'all'
	});

	// Sort state
	sortState = $state<SortState>({
		columnId: null,
		direction: null
	});

	// Pagination state
	pagination = $state<PaginationState>({
		page: 1,
		pageSize: 50,
		totalItems: 0,
		totalPages: 0
	});

	// Set scan status
	setScanStatus(status: ScanStatus) {
		this.scanStatus = status;
	}

	// Set error
	setError(error: string | null) {
		this.error = error;
	}

	// Set progress
	setProgress(progress: ScanProgress) {
		this.scanProgress = progress;
	}

	// Get progress
	get progress() {
		return this.scanProgress;
	}

	// Set results
	setResults(results: AddressBalance[]) {
		this.results = results;
		this.updatePagination();
	}

	// Set summary
	setSummary(summary: ScanSummary | null) {
		this.summary = summary;
	}

	// Set token configs
	setTokenConfigs(configs: TokenConfig[]) {
		this.tokenConfigs = configs;
	}

	// Set logs
	setLogs(logs: ScanEvent[]) {
		this.logs = logs;
	}

	// Add log entry
	addLog(event: ScanEvent) {
		this.logs = [...this.logs.slice(-99), event];
	}

	// Set session ID
	setSessionId(id: string | null) {
		this.sessionId = id;
	}

	// Set resumable session
	setResumableSession(session: ResumableSession | null) {
		this.resumableSession = session;
	}

	// Set session to restore (from IndexedDB when user clicks Resume)
	setSessionToRestore(session: ScanSession | null) {
		this.sessionToRestore = session;
	}

	// Filter methods
	setFilter(newFilter: Partial<BalanceFilter>) {
		this.filter = { ...this.filter, ...newFilter };
		this.pagination.page = 1; // Reset to first page when filter changes
		this.updatePagination();
	}

	resetFilter() {
		this.filter = {
			balanceStatus: 'all',
			tokenId: 'all'
		};
		this.pagination.page = 1;
		this.updatePagination();
	}

	// Sort methods
	setSortState(state: SortState) {
		this.sortState = state;
		this.pagination.page = 1; // Reset to first page when sort changes
	}

	resetSort() {
		this.sortState = { columnId: null, direction: null };
	}

	// Get filtered results (with sorting applied)
	get filteredResults(): AddressBalance[] {
		let filtered = this.results;

		// Filter by balance status
		if (this.filter.balanceStatus === 'has_balance') {
			filtered = filtered.filter((r) => r.hasBalance);
		} else if (this.filter.balanceStatus === 'no_balance') {
			filtered = filtered.filter((r) => !r.hasBalance);
		}

		// Filter by specific token
		if (this.filter.tokenId !== 'all') {
			// Find the token config to get decimals
			const tokenConfig = this.tokenConfigs.find((t) => t.id === this.filter.tokenId);
			const decimals = tokenConfig?.decimals ?? 18;

			// Parse user input (formatted values like "1.5") to raw BigInt
			let minBalance: bigint | undefined;
			let maxBalance: bigint | undefined;

			try {
				if (this.filter.minBalance) {
					minBalance = parseUnits(this.filter.minBalance, decimals);
				}
			} catch {
				// Invalid input, ignore min filter
			}

			try {
				if (this.filter.maxBalance) {
					maxBalance = parseUnits(this.filter.maxBalance, decimals);
				}
			} catch {
				// Invalid input, ignore max filter
			}

			filtered = filtered.filter((r) => {
				const tokenBalance = r.balances.find((b) => b.tokenId === this.filter.tokenId);
				if (!tokenBalance) return false;

				// Apply min/max balance filters
				if (minBalance !== undefined && tokenBalance.balance < minBalance) return false;
				if (maxBalance !== undefined && tokenBalance.balance > maxBalance) return false;

				return true;
			});
		}

		// Apply sorting
		if (this.sortState.columnId && this.sortState.direction) {
			const { columnId, direction } = this.sortState;
			const multiplier = direction === 'asc' ? 1 : -1;

			filtered = [...filtered].sort((a, b) => {
				// Sort by address
				if (columnId === 'address') {
					return multiplier * a.address.localeCompare(b.address);
				}

				// Sort by token balance (columnId is the tokenId)
				const aBalance = a.balances.find((bal) => bal.tokenId === columnId)?.balance ?? 0n;
				const bBalance = b.balances.find((bal) => bal.tokenId === columnId)?.balance ?? 0n;

				if (aBalance < bBalance) return -1 * multiplier;
				if (aBalance > bBalance) return 1 * multiplier;
				return 0;
			});
		}

		return filtered;
	}

	// Pagination methods
	setPage(page: number) {
		if (page >= 1 && page <= this.pagination.totalPages) {
			this.pagination.page = page;
		}
	}

	setPageSize(size: number) {
		this.pagination.pageSize = size;
		this.pagination.page = 1;
		this.updatePagination();
	}

	private updatePagination() {
		const totalItems = this.filteredResults.length;
		this.pagination.totalItems = totalItems;
		this.pagination.totalPages = Math.ceil(totalItems / this.pagination.pageSize);

		// Ensure current page is valid
		if (this.pagination.page > this.pagination.totalPages && this.pagination.totalPages > 0) {
			this.pagination.page = this.pagination.totalPages;
		}
	}

	// Get paginated results
	get paginatedResults(): AddressBalance[] {
		const start = (this.pagination.page - 1) * this.pagination.pageSize;
		const end = start + this.pagination.pageSize;
		return this.filteredResults.slice(start, end);
	}

	// Reset state
	reset() {
		this.scanStatus = 'idle';
		this.scanProgress = { current: 0, total: 0, percentage: 0 };
		this.results = [];
		this.summary = null;
		this.error = null;
		this.sessionId = null;
		this.tokenConfigs = [];
		this.logs = [];
		this.resumableSession = null;
		this.sessionToRestore = null;
		this.filter = {
			balanceStatus: 'all',
			tokenId: 'all'
		};
		this.sortState = {
			columnId: null,
			direction: null
		};
		this.pagination = {
			page: 1,
			pageSize: 50,
			totalItems: 0,
			totalPages: 0
		};
	}
}

// Export single shared instance
export const step5State = new Step5StateClass();
