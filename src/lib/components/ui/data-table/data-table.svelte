<script lang="ts" generics="T">
	import {
		ChevronLeft,
		ChevronRight,
		ChevronUp,
		ChevronDown,
		ChevronsUpDown
	} from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	import type { DataTableColumn, SortState, PaginationState } from './types';

	interface Props {
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
		/** Results count label */
		resultsLabel?: string;
		/** Filtered count (for showing filtered/total) */
		filteredCount?: number;
		/** Additional CSS class for the table wrapper */
		class?: string;
	}

	let {
		data,
		columns,
		getRowKey,
		sortState = { columnId: null, direction: null },
		onSortChange,
		pagination,
		onPageChange,
		onPageSizeChange,
		pageSizeOptions = [25, 50, 100],
		onRowClick,
		getRowClass,
		emptyMessage = 'No data',
		loading = false,
		cellSnippet,
		headerSnippet,
		showMobilePagination = true,
		resultsLabel = 'results',
		filteredCount,
		class: className = ''
	}: Props = $props();

	// Handle sort click
	function handleSort(column: DataTableColumn<T>) {
		if (!column.sortable || !onSortChange) return;

		let newDirection: 'asc' | 'desc' | null;
		if (sortState.columnId !== column.id) {
			newDirection = 'asc';
		} else if (sortState.direction === 'asc') {
			newDirection = 'desc';
		} else {
			newDirection = null;
		}

		onSortChange({
			columnId: newDirection ? column.id : null,
			direction: newDirection
		});
	}

	// Handle page size change
	function handlePageSizeChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		onPageSizeChange?.(parseInt(target.value, 10));
	}

	// Get cell value using accessor or render function
	function getCellValue(row: T, column: DataTableColumn<T>): unknown {
		if (column.render) {
			return column.render(row);
		}
		if (column.accessor) {
			return column.accessor(row);
		}
		return '';
	}

	// Get column style
	function getColumnStyle(column: DataTableColumn<T>): string {
		const styles: string[] = [];
		if (column.width) styles.push(`width: ${column.width}`);
		if (column.minWidth) styles.push(`min-width: ${column.minWidth}`);
		return styles.join('; ');
	}

	// Get cell alignment class
	function getAlignClass(column: DataTableColumn<T>): string {
		if (column.align === 'center') return 'text-center';
		if (column.align === 'right') return 'text-right';
		return 'text-left';
	}
</script>

<div class="data-table-wrapper {className}">
	<!-- Pagination Header -->
	{#if pagination}
		<div class="table-header">
			<span class="result-info">
				{#if filteredCount !== undefined && filteredCount !== data.length}
					{filteredCount} / {pagination.totalItems}
				{:else}
					{pagination.totalItems}
				{/if}
				{resultsLabel}
			</span>

			<div class="pagination-controls">
				<select class="page-size" value={pagination.pageSize} onchange={handlePageSizeChange}>
					{#each pageSizeOptions as size (size)}
						<option value={size}>{size}</option>
					{/each}
				</select>

				<button
					class="page-btn"
					disabled={pagination.page <= 1}
					onclick={() => onPageChange?.(pagination.page - 1)}
				>
					<ChevronLeft size={18} />
				</button>

				<span class="page-info">{pagination.page} / {pagination.totalPages || 1}</span>

				<button
					class="page-btn"
					disabled={pagination.page >= pagination.totalPages}
					onclick={() => onPageChange?.(pagination.page + 1)}
				>
					<ChevronRight size={18} />
				</button>
			</div>
		</div>
	{/if}

	<!-- Table Container with horizontal scroll -->
	<div class="table-scroll">
		<table class="data-table">
			<thead>
				<tr>
					{#each columns as column (column.id)}
						<th
							class="{getAlignClass(column)} {column.className || ''}"
							class:sortable={column.sortable}
							style={getColumnStyle(column)}
							onclick={() => handleSort(column)}
						>
							{#if headerSnippet}
								{@render headerSnippet({ column })}
							{:else}
								<span class="header-content">
									<span class="header-text">{column.header}</span>
									{#if column.sortable}
										<span class="sort-icon">
											{#if sortState.columnId === column.id}
												{#if sortState.direction === 'asc'}
													<ChevronUp size={14} />
												{:else}
													<ChevronDown size={14} />
												{/if}
											{:else}
												<ChevronsUpDown size={14} />
											{/if}
										</span>
									{/if}
								</span>
							{/if}
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#if loading}
					<tr class="loading-row">
						<td colspan={columns.length}>
							<div class="loading-indicator">Loading...</div>
						</td>
					</tr>
				{:else if data.length === 0}
					<tr class="empty-row">
						<td colspan={columns.length}>
							<div class="empty-message">{emptyMessage}</div>
						</td>
					</tr>
				{:else}
					{#each data as row (getRowKey(row))}
						<tr
							class={getRowClass?.(row) || ''}
							class:clickable={!!onRowClick}
							onclick={() => onRowClick?.(row)}
						>
							{#each columns as column (column.id)}
								{@const value = getCellValue(row, column)}
								<td class="{getAlignClass(column)} {column.className || ''}">
									{#if cellSnippet}
										{@render cellSnippet({ row, column, value })}
									{:else}
										{value}
									{/if}
								</td>
							{/each}
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>

	<!-- Mobile Bottom Pagination -->
	{#if pagination && showMobilePagination}
		<div class="pagination-bottom">
			<button
				class="page-btn-lg"
				disabled={pagination.page <= 1}
				onclick={() => onPageChange?.(pagination.page - 1)}
			>
				<ChevronLeft size={20} />
				Prev
			</button>

			<span class="page-info-lg">{pagination.page} / {pagination.totalPages || 1}</span>

			<button
				class="page-btn-lg"
				disabled={pagination.page >= pagination.totalPages}
				onclick={() => onPageChange?.(pagination.page + 1)}
			>
				Next
				<ChevronRight size={20} />
			</button>
		</div>
	{/if}
</div>

<style>
	.data-table-wrapper {
		display: flex;
		flex-direction: column;
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		overflow: hidden;
		/* Prevent wrapper from expanding beyond parent - forces internal scroll */
		width: 0;
		min-width: 100%;
	}

	/* Header with pagination */
	.table-header {
		padding: var(--space-3) var(--space-4);
		background: var(--color-panel-1);
		border-bottom: 1px solid var(--color-border);
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.result-info {
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .result-info {
		color: var(--gray-400);
	}

	.pagination-controls {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.page-size {
		padding: var(--space-1) var(--space-2);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
		color: var(--gray-700);
		cursor: pointer;
	}

	:global([data-theme='dark']) .page-size {
		color: var(--gray-300);
	}

	.page-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 32px;
		height: 32px;
		padding: 0 var(--space-2);
		background: var(--color-panel-0);
		border: 1px solid var(--gray-300);
		border-radius: var(--radius-md);
		color: var(--gray-600);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.page-btn :global(svg) {
		flex-shrink: 0;
		stroke: currentColor;
	}

	:global([data-theme='dark']) .page-btn {
		border-color: var(--gray-600);
		color: var(--gray-400);
	}

	.page-btn:hover:not(:disabled) {
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	.page-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.page-info {
		font-size: var(--text-sm);
		color: var(--gray-600);
		min-width: 60px;
		text-align: center;
	}

	:global([data-theme='dark']) .page-info {
		color: var(--gray-400);
	}

	/* Table scroll container - enables horizontal scroll */
	.table-scroll {
		overflow-x: auto;
		overflow-y: hidden;
		scrollbar-width: thin;
		scrollbar-color: var(--gray-300) transparent;
		/* Enable momentum scrolling on iOS */
		-webkit-overflow-scrolling: touch;
		/* Fade hint for horizontal scroll */
		background:
			linear-gradient(to right, var(--color-panel-0) 30%, transparent),
			linear-gradient(to left, var(--color-panel-0) 30%, transparent),
			linear-gradient(to right, rgba(0, 0, 0, 0.08), transparent 15px),
			linear-gradient(to left, rgba(0, 0, 0, 0.08), transparent 15px);
		background-position:
			left center,
			right center,
			left center,
			right center;
		background-repeat: no-repeat;
		background-size:
			40px 100%,
			40px 100%,
			15px 100%,
			15px 100%;
		background-attachment: local, local, scroll, scroll;
	}

	:global([data-theme='dark']) .table-scroll {
		scrollbar-color: var(--gray-600) transparent;
		background:
			linear-gradient(to right, var(--color-panel-0) 30%, transparent),
			linear-gradient(to left, var(--color-panel-0) 30%, transparent),
			linear-gradient(to right, rgba(255, 255, 255, 0.05), transparent 15px),
			linear-gradient(to left, rgba(255, 255, 255, 0.05), transparent 15px);
		background-position:
			left center,
			right center,
			left center,
			right center;
		background-repeat: no-repeat;
		background-size:
			40px 100%,
			40px 100%,
			15px 100%,
			15px 100%;
		background-attachment: local, local, scroll, scroll;
	}

	.table-scroll::-webkit-scrollbar {
		height: 6px;
	}

	.table-scroll::-webkit-scrollbar-track {
		background: var(--color-panel-1);
		border-radius: var(--radius-full);
	}

	.table-scroll::-webkit-scrollbar-thumb {
		background: var(--gray-300);
		border-radius: var(--radius-full);
	}

	.table-scroll::-webkit-scrollbar-thumb:hover {
		background: var(--gray-400);
	}

	:global([data-theme='dark']) .table-scroll::-webkit-scrollbar-track {
		background: var(--color-panel-2);
	}

	:global([data-theme='dark']) .table-scroll::-webkit-scrollbar-thumb {
		background: var(--gray-600);
	}

	:global([data-theme='dark']) .table-scroll::-webkit-scrollbar-thumb:hover {
		background: var(--gray-500);
	}

	/* Table styles */
	.data-table {
		/* Use min-content width so columns maintain their minWidth */
		/* Table will expand beyond container, triggering horizontal scroll */
		width: max-content;
		min-width: 100%;
		border-collapse: collapse;
		font-size: var(--text-sm);
		table-layout: auto;
	}

	.data-table th,
	.data-table td {
		padding: var(--space-3);
		border-bottom: 1px solid var(--color-border);
		white-space: nowrap;
	}

	.data-table th {
		background: var(--color-panel-1);
		font-weight: var(--font-semibold);
		color: var(--gray-700);
		user-select: none;
	}

	:global([data-theme='dark']) .data-table th {
		color: var(--gray-300);
	}

	.data-table th.sortable {
		cursor: pointer;
		transition: background 0.2s ease;
	}

	.data-table th.sortable:hover {
		background: var(--color-panel-2);
	}

	.header-content {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
	}

	.sort-icon {
		display: inline-flex;
		align-items: center;
		color: var(--gray-400);
	}

	.data-table th.sortable:hover .sort-icon {
		color: var(--color-primary);
	}

	.data-table td {
		color: var(--gray-800);
	}

	:global([data-theme='dark']) .data-table td {
		color: var(--gray-200);
	}

	.data-table tbody tr:hover {
		background: var(--color-panel-1);
	}

	.data-table tbody tr.clickable {
		cursor: pointer;
	}

	.data-table tbody tr:last-child td {
		border-bottom: none;
	}

	/* Text alignment */
	.text-left {
		text-align: left;
	}

	.text-center {
		text-align: center;
	}

	.text-right {
		text-align: right;
	}

	/* Empty and loading states */
	.loading-row td,
	.empty-row td {
		text-align: center;
		padding: var(--space-8);
	}

	.loading-indicator,
	.empty-message {
		color: var(--gray-500);
		font-size: var(--text-sm);
	}

	/* Bottom pagination (mobile) */
	.pagination-bottom {
		display: none;
		padding: var(--space-3) var(--space-4);
		border-top: 1px solid var(--color-border);
		justify-content: space-between;
		align-items: center;
	}

	.page-btn-lg {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-2) var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--gray-700);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.page-btn-lg :global(svg) {
		stroke: currentColor;
	}

	:global([data-theme='dark']) .page-btn-lg {
		color: var(--gray-300);
	}

	.page-btn-lg:hover:not(:disabled) {
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	.page-btn-lg:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.page-info-lg {
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .page-info-lg {
		color: var(--gray-300);
	}

	/* Mobile styles */
	@media (max-width: 640px) {
		.table-header {
			padding: var(--space-2) var(--space-3);
		}

		.pagination-controls {
			display: none;
		}

		.pagination-bottom {
			display: flex;
		}
	}
</style>
