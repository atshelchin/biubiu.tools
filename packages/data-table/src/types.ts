import type { Snippet } from 'svelte';

/**
 * Table style variants
 */
export type DataTableVariant = 'default' | 'striped' | 'bordered' | 'minimal' | 'modern';

/**
 * Column definition for DataTable
 */
export interface DataTableColumn<T = unknown> {
	/** Unique column identifier */
	id: string;
	/** Display header text */
	header: string;
	/** Whether this column is sortable (default: false) */
	sortable?: boolean;
	/** Column width (CSS value, e.g., '100px', '20%') */
	width?: string;
	/** Minimum width (CSS value) */
	minWidth?: string;
	/** Text alignment */
	align?: 'left' | 'center' | 'right';
	/** Custom CSS class for this column */
	className?: string;
	/** Accessor function to get cell value for sorting */
	accessor?: (row: T) => string | number | bigint | boolean | null | undefined;
	/** Render function for cell content (returns string) */
	render?: (row: T) => string;
}

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc' | null;

/**
 * Current sort state
 */
export interface SortState {
	columnId: string | null;
	direction: SortDirection;
}

/**
 * Pagination state
 */
export interface PaginationState {
	page: number;
	pageSize: number;
	totalItems: number;
	totalPages: number;
}

/**
 * DataTable props
 */
export interface DataTableProps<T> {
	/** Data rows to display */
	data: T[];
	/** Column definitions */
	columns: DataTableColumn<T>[];
	/** Unique key accessor for each row */
	getRowKey: (row: T) => string | number;
	/** Current sort state */
	sortState?: SortState;
	/** Sort change callback */
	onSortChange?: (state: SortState) => void;
	/** Pagination state (if paginated) */
	pagination?: PaginationState;
	/** Page change callback */
	onPageChange?: (page: number) => void;
	/** Page size change callback */
	onPageSizeChange?: (size: number) => void;
	/** Page size options */
	pageSizeOptions?: number[];
	/** Row click callback */
	onRowClick?: (row: T) => void;
	/** Custom row class function */
	getRowClass?: (row: T) => string;
	/** Empty state message */
	emptyMessage?: string;
	/** Whether to show loading state */
	loading?: boolean;
	/** Custom cell snippet for advanced rendering */
	cellSnippet?: Snippet<[{ row: T; column: DataTableColumn<T>; value: unknown }]>;
	/** Custom header cell snippet */
	headerSnippet?: Snippet<[{ column: DataTableColumn<T> }]>;
	/** Whether to show bottom pagination on mobile */
	showMobilePagination?: boolean;
	/** Table style variant */
	variant?: DataTableVariant;
	/** Additional CSS class for the table wrapper */
	class?: string;
}
