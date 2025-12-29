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
		background: var(--color-panel-0, #ffffff);
		border: 1px solid var(--color-border, #e5e7eb);
		border-radius: var(--radius-lg, 0.5rem);
		overflow: hidden;
		width: 0;
		min-width: 100%;
	}

	.table-header {
		padding: 0.75rem 1rem;
		background: var(--color-panel-1, #f9fafb);
		border-bottom: 1px solid var(--color-border, #e5e7eb);
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.result-info {
		font-size: 0.875rem;
		color: var(--gray-600, #4b5563);
	}

	.pagination-controls {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.page-size {
		padding: 0.25rem 0.5rem;
		background: var(--color-panel-0, #ffffff);
		border: 1px solid var(--color-border, #e5e7eb);
		border-radius: 0.25rem;
		font-size: 0.875rem;
		color: var(--gray-700, #374151);
		cursor: pointer;
	}

	.page-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 32px;
		height: 32px;
		padding: 0 0.5rem;
		background: var(--color-panel-0, #ffffff);
		border: 1px solid var(--gray-300, #d1d5db);
		border-radius: 0.375rem;
		color: var(--gray-600, #4b5563);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.page-btn :global(svg) {
		flex-shrink: 0;
		stroke: currentColor;
	}

	.page-btn:hover:not(:disabled) {
		border-color: var(--color-primary, #3b82f6);
		color: var(--color-primary, #3b82f6);
	}

	.page-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.page-info {
		font-size: 0.875rem;
		color: var(--gray-600, #4b5563);
		min-width: 60px;
		text-align: center;
	}

	.table-scroll {
		overflow-x: auto;
		overflow-y: hidden;
		scrollbar-width: thin;
		scrollbar-color: var(--gray-300, #d1d5db) transparent;
		-webkit-overflow-scrolling: touch;
	}

	.table-scroll::-webkit-scrollbar {
		height: 6px;
	}

	.table-scroll::-webkit-scrollbar-track {
		background: var(--color-panel-1, #f9fafb);
		border-radius: 9999px;
	}

	.table-scroll::-webkit-scrollbar-thumb {
		background: var(--gray-300, #d1d5db);
		border-radius: 9999px;
	}

	.table-scroll::-webkit-scrollbar-thumb:hover {
		background: var(--gray-400, #9ca3af);
	}

	.data-table {
		width: max-content;
		min-width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
		table-layout: auto;
	}

	.data-table th,
	.data-table td {
		padding: 0.75rem;
		border-bottom: 1px solid var(--color-border, #e5e7eb);
		white-space: nowrap;
	}

	.data-table th {
		background: var(--color-panel-1, #f9fafb);
		font-weight: 600;
		color: var(--gray-700, #374151);
		user-select: none;
	}

	.data-table th.sortable {
		cursor: pointer;
		transition: background 0.2s ease;
	}

	.data-table th.sortable:hover {
		background: var(--color-panel-2, #f3f4f6);
	}

	.header-content {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
	}

	.sort-icon {
		display: inline-flex;
		align-items: center;
		color: var(--gray-400, #9ca3af);
	}

	.data-table th.sortable:hover .sort-icon {
		color: var(--color-primary, #3b82f6);
	}

	.data-table td {
		color: var(--gray-800, #1f2937);
	}

	.data-table tbody tr:hover {
		background: var(--color-panel-1, #f9fafb);
	}

	.data-table tbody tr.clickable {
		cursor: pointer;
	}

	.data-table tbody tr:last-child td {
		border-bottom: none;
	}

	.text-left {
		text-align: left;
	}

	.text-center {
		text-align: center;
	}

	.text-right {
		text-align: right;
	}

	.loading-row td,
	.empty-row td {
		text-align: center;
		padding: 2rem;
	}

	.loading-indicator,
	.empty-message {
		color: var(--gray-500, #6b7280);
		font-size: 0.875rem;
	}

	.pagination-bottom {
		display: none;
		padding: 0.75rem 1rem;
		border-top: 1px solid var(--color-border, #e5e7eb);
		justify-content: space-between;
		align-items: center;
	}

	.page-btn-lg {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.5rem 1rem;
		background: var(--color-panel-1, #f9fafb);
		border: 1px solid var(--color-border, #e5e7eb);
		border-radius: 0.375rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--gray-700, #374151);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.page-btn-lg :global(svg) {
		stroke: currentColor;
	}

	.page-btn-lg:hover:not(:disabled) {
		border-color: var(--color-primary, #3b82f6);
		color: var(--color-primary, #3b82f6);
	}

	.page-btn-lg:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.page-info-lg {
		font-size: 1rem;
		font-weight: 500;
		color: var(--gray-700, #374151);
	}

	@media (max-width: 640px) {
		.table-header {
			padding: 0.5rem 0.75rem;
		}

		.pagination-controls {
			display: none;
		}

		.pagination-bottom {
			display: flex;
		}
	}
</style>
