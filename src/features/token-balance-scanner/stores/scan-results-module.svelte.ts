/**
 * Scan results module for token-balance-scanner.
 *
 * This module handles tool-specific state that isn't shared across tools:
 * - Result filtering (by balance status, token, min/max)
 * - Result sorting (by column)
 * - Pagination
 * - Session management
 * - Token configs (for export)
 *
 * @module
 */

import type { StateModule } from '$lib/stores/types';
import type {
	BalanceFilter,
	SortState,
	PaginationState,
	AddressBalance,
	ResumableSession
} from '../types/scanner';
import type { ScanSession } from '$lib/services/balance-scanner/storage';
import type { TokenConfig } from '$lib/services/balance-scanner/types';
import { parseUnits } from 'viem';

/**
 * Serializable state for persistence.
 */
export interface ScanResultsSerializedState {
	filter: BalanceFilter;
	sortState: SortState;
	pagination: Omit<PaginationState, 'totalItems' | 'totalPages'>;
	tokenConfigs: TokenConfig[];
}

/**
 * Public interface for the scan results module.
 */
export interface ScanResultsModule extends StateModule<ScanResultsSerializedState> {
	// Readonly state
	readonly filter: BalanceFilter;
	readonly sortState: SortState;
	readonly pagination: PaginationState;
	readonly tokenConfigs: readonly TokenConfig[];
	readonly resumableSession: ResumableSession | null;
	readonly sessionToRestore: ScanSession | null;

	// Actions - Filter
	setFilter(newFilter: Partial<BalanceFilter>): void;
	resetFilter(): void;

	// Actions - Sort
	setSortState(state: SortState): void;
	resetSort(): void;

	// Actions - Pagination
	setPage(page: number): void;
	setPageSize(size: number): void;

	// Actions - Token configs
	setTokenConfigs(configs: TokenConfig[]): void;

	// Actions - Session
	setResumableSession(session: ResumableSession | null): void;
	setSessionToRestore(session: ScanSession | null): void;

	// Computed - must be called with results
	getFilteredResults(results: AddressBalance[]): AddressBalance[];
	getPaginatedResults(results: AddressBalance[]): AddressBalance[];
	updatePaginationFromResults(results: AddressBalance[]): void;
}

/**
 * Create a new scan results module instance.
 *
 * @returns A new ScanResultsModule instance
 */
export function createScanResultsModule(): ScanResultsModule {
	// Internal state
	let filter = $state<BalanceFilter>({
		balanceStatus: 'all',
		tokenId: 'all'
	});

	let sortState = $state<SortState>({
		columnId: null,
		direction: null
	});

	let pagination = $state<PaginationState>({
		page: 1,
		pageSize: 50,
		totalItems: 0,
		totalPages: 0
	});

	let tokenConfigs = $state<TokenConfig[]>([]);
	let resumableSession = $state<ResumableSession | null>(null);
	let sessionToRestore = $state<ScanSession | null>(null);

	// Helper to filter results
	function filterResults(results: AddressBalance[]): AddressBalance[] {
		let filtered = results;

		// Filter by balance status
		if (filter.balanceStatus === 'has_balance') {
			filtered = filtered.filter((r) => r.hasBalance);
		} else if (filter.balanceStatus === 'no_balance') {
			filtered = filtered.filter((r) => !r.hasBalance);
		}

		// Filter by specific token
		if (filter.tokenId !== 'all') {
			const tokenConfig = tokenConfigs.find((t) => t.id === filter.tokenId);
			const decimals = tokenConfig?.decimals ?? 18;

			let minBalance: bigint | undefined;
			let maxBalance: bigint | undefined;

			try {
				if (filter.minBalance) {
					minBalance = parseUnits(filter.minBalance, decimals);
				}
			} catch {
				// Invalid input, ignore min filter
			}

			try {
				if (filter.maxBalance) {
					maxBalance = parseUnits(filter.maxBalance, decimals);
				}
			} catch {
				// Invalid input, ignore max filter
			}

			filtered = filtered.filter((r) => {
				const tokenBalance = r.balances.find((b) => b.tokenId === filter.tokenId);
				if (!tokenBalance) return false;

				if (minBalance !== undefined && tokenBalance.balance < minBalance) return false;
				if (maxBalance !== undefined && tokenBalance.balance > maxBalance) return false;

				return true;
			});
		}

		// Apply sorting
		if (sortState.columnId && sortState.direction) {
			const { columnId, direction } = sortState;
			const multiplier = direction === 'asc' ? 1 : -1;

			filtered = [...filtered].sort((a, b) => {
				if (columnId === 'address') {
					return multiplier * a.address.localeCompare(b.address);
				}

				const aBalance = a.balances.find((bal) => bal.tokenId === columnId)?.balance ?? 0n;
				const bBalance = b.balances.find((bal) => bal.tokenId === columnId)?.balance ?? 0n;

				if (aBalance < bBalance) return -1 * multiplier;
				if (aBalance > bBalance) return 1 * multiplier;
				return 0;
			});
		}

		return filtered;
	}

	return {
		// Getters for readonly access
		get filter() {
			return filter;
		},
		get sortState() {
			return sortState;
		},
		get pagination() {
			return pagination;
		},
		get tokenConfigs() {
			return tokenConfigs;
		},
		get resumableSession() {
			return resumableSession;
		},
		get sessionToRestore() {
			return sessionToRestore;
		},

		// Filter actions
		setFilter(newFilter: Partial<BalanceFilter>) {
			filter = { ...filter, ...newFilter };
			pagination = { ...pagination, page: 1 };
		},

		resetFilter() {
			filter = { balanceStatus: 'all', tokenId: 'all' };
			pagination = { ...pagination, page: 1 };
		},

		// Sort actions
		setSortState(state: SortState) {
			sortState = state;
			pagination = { ...pagination, page: 1 };
		},

		resetSort() {
			sortState = { columnId: null, direction: null };
		},

		// Pagination actions
		setPage(page: number) {
			if (page >= 1 && page <= pagination.totalPages) {
				pagination = { ...pagination, page };
			}
		},

		setPageSize(size: number) {
			pagination = { ...pagination, pageSize: size, page: 1 };
		},

		// Token configs
		setTokenConfigs(configs: TokenConfig[]) {
			tokenConfigs = configs;
		},

		// Session management
		setResumableSession(session: ResumableSession | null) {
			resumableSession = session;
		},

		setSessionToRestore(session: ScanSession | null) {
			sessionToRestore = session;
		},

		// Computed methods
		getFilteredResults(results: AddressBalance[]): AddressBalance[] {
			return filterResults(results);
		},

		getPaginatedResults(results: AddressBalance[]): AddressBalance[] {
			const filtered = filterResults(results);
			const start = (pagination.page - 1) * pagination.pageSize;
			const end = start + pagination.pageSize;
			return filtered.slice(start, end);
		},

		updatePaginationFromResults(results: AddressBalance[]) {
			const filtered = filterResults(results);
			const totalItems = filtered.length;
			const totalPages = Math.ceil(totalItems / pagination.pageSize);
			let page = pagination.page;

			if (page > totalPages && totalPages > 0) {
				page = totalPages;
			}

			pagination = { ...pagination, totalItems, totalPages, page };
		},

		// StateModule implementation
		reset() {
			filter = { balanceStatus: 'all', tokenId: 'all' };
			sortState = { columnId: null, direction: null };
			pagination = { page: 1, pageSize: 50, totalItems: 0, totalPages: 0 };
			tokenConfigs = [];
			resumableSession = null;
			sessionToRestore = null;
		},

		serialize(): ScanResultsSerializedState {
			return {
				filter,
				sortState,
				pagination: {
					page: pagination.page,
					pageSize: pagination.pageSize
				},
				tokenConfigs
			};
		},

		deserialize(data: ScanResultsSerializedState) {
			if (!data) return;
			if (data.filter) filter = data.filter;
			if (data.sortState) sortState = data.sortState;
			if (data.pagination) {
				pagination = {
					...pagination,
					page: data.pagination.page ?? 1,
					pageSize: data.pagination.pageSize ?? 50
				};
			}
			if (data.tokenConfigs) tokenConfigs = data.tokenConfigs;
		}
	};
}
