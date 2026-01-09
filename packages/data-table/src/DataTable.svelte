<script lang="ts" generics="T">
	import {
		ChevronLeft,
		ChevronRight,
		ChevronUp,
		ChevronDown,
		ChevronsUpDown
	} from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	import type { DataTableColumn, DataTableVariant, SortState, PaginationState } from './types';

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
		/** Table style variant */
		variant?: DataTableVariant;
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
		variant = 'default',
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

<div class="data-table-wrapper variant-{variant} {className}">
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
					{#each data as row, index (getRowKey(row))}
						<tr
							class={getRowClass?.(row) || ''}
							class:clickable={!!onRowClick}
							class:row-even={index % 2 === 0}
							class:row-odd={index % 2 === 1}
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
	/* ===== CSS Custom Properties for theming ===== */
	.data-table-wrapper {
		/* Background colors - use elevated panel for better contrast */
		--dt-bg: var(--color-panel-elevated, var(--color-card, #ffffff));
		--dt-bg-header: var(--color-panel-2, var(--color-muted, #f9fafb));
		--dt-bg-hover: var(--color-panel-3, var(--color-accent, #f9fafb));
		--dt-bg-stripe: var(--color-panel-1, var(--color-muted, #f4f4f5));

		/* Border - use stronger border for better visibility */
		--dt-border: var(--color-panel-border-2, var(--color-border, #e5e7eb));
		--dt-border-strong: var(--color-panel-border-3, var(--color-border, #d1d5db));

		/* Text colors */
		--dt-text: var(--color-foreground, #1f2937);
		--dt-text-muted: var(--color-muted-foreground, #6b7280);
		--dt-text-header: var(--color-foreground, #374151);

		/* Accent */
		--dt-primary: var(--color-primary, #3b82f6);
		--dt-radius: var(--radius-lg, 0.5rem);
	}

	/* ===== Base Styles ===== */
	.data-table-wrapper {
		display: flex;
		flex-direction: column;
		background: var(--dt-bg);
		border: 1px solid var(--dt-border-strong);
		border-radius: var(--dt-radius);
		overflow: hidden;
		width: 0;
		min-width: 100%;
	}

	.table-header {
		padding: 0.75rem 1rem;
		background: var(--dt-bg-header);
		border-bottom: 1px solid var(--dt-border-strong);
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.result-info {
		font-size: 0.875rem;
		color: var(--dt-text-muted);
	}

	.pagination-controls {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.page-size {
		padding: 0.25rem 0.5rem;
		background: var(--dt-bg);
		border: 1px solid var(--dt-border-strong);
		border-radius: 0.25rem;
		font-size: 0.875rem;
		color: var(--dt-text);
		cursor: pointer;
	}

	.page-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 32px;
		height: 32px;
		padding: 0 0.5rem;
		background: var(--dt-bg);
		border: 1px solid var(--dt-border-strong);
		border-radius: 0.375rem;
		color: var(--dt-text);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.page-btn :global(svg) {
		flex-shrink: 0;
		stroke: currentColor;
	}

	.page-btn:hover:not(:disabled) {
		border-color: var(--dt-primary);
		color: var(--dt-primary);
	}

	.page-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.page-info {
		font-size: 0.875rem;
		color: var(--dt-text-muted);
		min-width: 60px;
		text-align: center;
	}

	.table-scroll {
		overflow-x: auto;
		overflow-y: hidden;
		scrollbar-width: thin;
		scrollbar-color: var(--dt-border) transparent;
		-webkit-overflow-scrolling: touch;
	}

	.table-scroll::-webkit-scrollbar {
		height: 6px;
	}

	.table-scroll::-webkit-scrollbar-track {
		background: var(--dt-bg-header);
		border-radius: 9999px;
	}

	.table-scroll::-webkit-scrollbar-thumb {
		background: var(--dt-border);
		border-radius: 9999px;
	}

	.table-scroll::-webkit-scrollbar-thumb:hover {
		background: var(--dt-text-muted);
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
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--dt-border-strong);
		white-space: nowrap;
	}

	.data-table th {
		background: var(--dt-bg-header);
		font-weight: 600;
		color: var(--dt-text-header);
		user-select: none;
		border-bottom: 2px solid var(--dt-border-strong);
	}

	.data-table th.sortable {
		cursor: pointer;
		transition: background 0.2s ease;
	}

	.data-table th.sortable:hover {
		background: var(--dt-bg-hover);
	}

	.header-content {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
	}

	.sort-icon {
		display: inline-flex;
		align-items: center;
		color: var(--dt-text-muted);
		opacity: 0.6;
	}

	.data-table th.sortable:hover .sort-icon {
		color: var(--dt-primary);
		opacity: 1;
	}

	.data-table td {
		color: var(--dt-text);
	}

	.data-table tbody tr:hover {
		background: var(--dt-bg-hover);
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
		color: var(--dt-text-muted);
		font-size: 0.875rem;
	}

	.pagination-bottom {
		display: none;
		padding: 0.75rem 1rem;
		border-top: 1px solid var(--dt-border-strong);
		justify-content: space-between;
		align-items: center;
	}

	.page-btn-lg {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.5rem 1rem;
		background: var(--dt-bg-header);
		border: 1px solid var(--dt-border-strong);
		border-radius: 0.375rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--dt-text);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.page-btn-lg :global(svg) {
		stroke: currentColor;
	}

	.page-btn-lg:hover:not(:disabled) {
		border-color: var(--dt-primary);
		color: var(--dt-primary);
	}

	.page-btn-lg:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.page-info-lg {
		font-size: 1rem;
		font-weight: 500;
		color: var(--dt-text);
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

	/* ===== Variant: Striped ===== */
	.variant-striped .data-table tbody tr.row-odd {
		background: var(--dt-bg-stripe);
	}

	.variant-striped .data-table tbody tr.row-odd:hover {
		background: var(--dt-bg-hover);
	}

	/* ===== Variant: Bordered ===== */
	.variant-bordered .data-table th,
	.variant-bordered .data-table td {
		border: 1px solid var(--dt-border-strong);
	}

	.variant-bordered .data-table tbody tr:last-child td {
		border-bottom: 1px solid var(--dt-border-strong);
	}

	/* ===== Variant: Minimal ===== */
	.variant-minimal {
		border: none;
		background: transparent;
	}

	.variant-minimal .table-header {
		background: transparent;
		border-bottom: 2px solid var(--dt-border-strong);
	}

	.variant-minimal .data-table th {
		background: transparent;
		border-bottom: 2px solid var(--dt-border-strong);
	}

	.variant-minimal .data-table td {
		border-bottom: 1px solid var(--dt-border);
	}

	.variant-minimal .data-table tbody tr:last-child td {
		border-bottom: none;
	}

	.variant-minimal .pagination-bottom {
		border-top: 2px solid var(--dt-border-strong);
	}

	/* ===== Variant: Modern ===== */
	.variant-modern {
		border: none;
		border-radius: var(--radius-xl, 0.75rem);
		box-shadow:
			0 1px 3px rgba(0, 0, 0, 0.1),
			0 1px 2px rgba(0, 0, 0, 0.06);
	}

	.variant-modern .table-header {
		background: var(--dt-bg);
		border-bottom: none;
		padding: 1rem 1.25rem;
	}

	.variant-modern .data-table th {
		background: transparent;
		border-bottom: 2px solid var(--dt-primary);
		color: var(--dt-primary);
		font-weight: 700;
		text-transform: uppercase;
		font-size: 0.75rem;
		letter-spacing: 0.05em;
		padding: 1rem 1.25rem;
	}

	.variant-modern .data-table td {
		padding: 1rem 1.25rem;
		border-bottom: 1px solid var(--dt-border);
	}

	.variant-modern .data-table tbody tr:hover {
		background: color-mix(in srgb, var(--dt-primary) 5%, transparent);
	}

	.variant-modern .data-table tbody tr:last-child td {
		border-bottom: none;
	}

	.variant-modern .pagination-bottom {
		border-top: none;
		padding: 1rem 1.25rem;
	}

	.variant-modern .page-btn,
	.variant-modern .page-btn-lg {
		border-radius: 0.5rem;
	}
</style>
