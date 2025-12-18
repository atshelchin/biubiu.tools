<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import { Copy, Check } from '@lucide/svelte';
	import { DataTable, type DataTableColumn } from '$lib/components/ui/data-table';
	import type { BalanceFilter, AddressBalance, SortState } from '../../types/scanner';
	import type { TokenConfig } from '$lib/services/balance-scanner/types';
	import { formatUnits } from 'viem';

	interface Props {
		/** All results (unfiltered) */
		results: AddressBalance[];
		/** Token configurations */
		tokens: TokenConfig[];
		/** Current filter state */
		filter: BalanceFilter;
		/** Sort state */
		sortState: SortState;
		/** Pagination state */
		pagination: {
			page: number;
			pageSize: number;
			totalPages: number;
			totalItems: number;
		};
		/** Paginated results to display */
		paginatedResults: AddressBalance[];
		/** Filtered results count */
		filteredCount: number;
		/** Callbacks */
		onFilterChange: (filter: Partial<BalanceFilter>) => void;
		onFilterReset: () => void;
		onSortChange: (state: SortState) => void;
		onPageChange: (page: number) => void;
		onPageSizeChange: (size: number) => void;
	}

	let {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		results: _results,
		tokens,
		filter,
		sortState,
		pagination,
		paginatedResults,
		filteredCount,
		onFilterChange,
		onFilterReset,
		onSortChange,
		onPageChange,
		onPageSizeChange
	}: Props = $props();

	const i18n = useI18n();

	// Copied address state
	let copiedAddress = $state<string | null>(null);

	// Get visible tokens based on filter
	const visibleTokens = $derived(() => {
		if (filter.tokenId === 'all') {
			return tokens;
		}
		return tokens.filter((t) => t.id === filter.tokenId);
	});

	// Balance status options
	const statusOptions = [
		{ value: 'all', label: i18n.t('tools.token_balance_scanner.step5.filter.status_all') || 'All' },
		{
			value: 'has_balance',
			label: i18n.t('tools.token_balance_scanner.step5.filter.status_has_balance') || 'Has Balance'
		},
		{
			value: 'no_balance',
			label: i18n.t('tools.token_balance_scanner.step5.filter.status_no_balance') || 'No Balance'
		}
	];

	// Token options for filter
	const tokenOptions = $derived(() => [
		{
			value: 'all',
			label: i18n.t('tools.token_balance_scanner.step5.filter.token_all') || 'All Tokens'
		},
		...tokens.map((t) => ({ value: t.id, label: t.symbol || t.id }))
	]);

	// Check if filter is active
	const isFilterActive = $derived(
		filter.balanceStatus !== 'all' ||
			filter.tokenId !== 'all' ||
			filter.minBalance !== undefined ||
			filter.maxBalance !== undefined
	);

	// Build columns dynamically based on visible tokens
	const columns = $derived.by(() => {
		const cols: DataTableColumn<AddressBalance>[] = [
			{
				id: 'address',
				header: i18n.t('tools.token_balance_scanner.step5.balances.address') || 'Address',
				sortable: true,
				minWidth: '160px',
				accessor: (row) => row.address
			}
		];

		// Add token columns
		for (const token of visibleTokens()) {
			cols.push({
				id: token.id,
				header: token.symbol || token.id,
				sortable: true,
				minWidth: '100px',
				align: 'right',
				accessor: (row) => {
					const balance = row.balances.find((b) => b.tokenId === token.id);
					return balance?.balance ?? 0n;
				}
			});
		}

		return cols;
	});

	// Format balance for display (max 4 decimal places)
	function formatBalance(balance: bigint, decimals: number): string {
		const formatted = formatUnits(balance, decimals);
		const [intPart, decPart] = formatted.split('.');
		if (!decPart) return intPart;
		const truncated = decPart.slice(0, 4).replace(/0+$/, '');
		return truncated ? `${intPart}.${truncated}` : intPart;
	}

	// Shorten address for display
	function shortenAddress(address: string): string {
		if (address.length <= 13) return address;
		return `${address.slice(0, 6)}...${address.slice(-4)}`;
	}

	// Copy address to clipboard
	async function copyAddress(address: string) {
		try {
			await navigator.clipboard.writeText(address);
			copiedAddress = address;
			setTimeout(() => {
				copiedAddress = null;
			}, 2000);
		} catch {
			console.error('Failed to copy address');
		}
	}

	// Handle filter changes
	function handleStatusChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		onFilterChange({ balanceStatus: target.value as BalanceFilter['balanceStatus'] });
	}

	function handleTokenChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		onFilterChange({ tokenId: target.value, minBalance: undefined, maxBalance: undefined });
	}

	function handleMinChange(e: Event) {
		const target = e.target as HTMLInputElement;
		onFilterChange({ minBalance: target.value.trim() || undefined });
	}

	function handleMaxChange(e: Event) {
		const target = e.target as HTMLInputElement;
		onFilterChange({ maxBalance: target.value.trim() || undefined });
	}

	// Row class based on balance status
	function getRowClass(row: AddressBalance): string {
		return row.hasBalance ? 'has-balance' : '';
	}
</script>

<div class="balance-table-container">
	<!-- Filter Bar -->
	<div class="filter-bar">
		<div class="filter-row">
			<select class="filter-select" value={filter.balanceStatus} onchange={handleStatusChange}>
				{#each statusOptions as opt (opt.value)}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</select>

			<select class="filter-select" value={filter.tokenId} onchange={handleTokenChange}>
				{#each tokenOptions() as opt (opt.value)}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</select>

			{#if filter.tokenId !== 'all'}
				<input
					type="text"
					class="range-input"
					placeholder={i18n.t('tools.token_balance_scanner.step5.filter.min') || 'Min'}
					value={filter.minBalance || ''}
					oninput={handleMinChange}
				/>
				<span class="range-sep">-</span>
				<input
					type="text"
					class="range-input"
					placeholder={i18n.t('tools.token_balance_scanner.step5.filter.max') || 'Max'}
					value={filter.maxBalance || ''}
					oninput={handleMaxChange}
				/>
			{/if}

			{#if isFilterActive}
				<button class="reset-btn" onclick={onFilterReset}>
					{i18n.t('tools.token_balance_scanner.step5.filter.reset') || 'Reset'}
				</button>
			{/if}
		</div>
	</div>

	<!-- Data Table -->
	<DataTable
		data={paginatedResults}
		{columns}
		getRowKey={(row) => row.address}
		{sortState}
		{onSortChange}
		{pagination}
		{onPageChange}
		{onPageSizeChange}
		{getRowClass}
		{filteredCount}
		resultsLabel={i18n.t('tools.token_balance_scanner.step5.balances.results') || 'results'}
		emptyMessage={i18n.t('tools.token_balance_scanner.step5.balances.no_results') || 'No results'}
	>
		{#snippet cellSnippet({ row, column, value })}
			{#if column.id === 'address'}
				<div class="cell-address">
					<span class="address-text" title={row.address}>{shortenAddress(row.address)}</span>
					<button class="copy-btn" onclick={() => copyAddress(row.address)}>
						{#if copiedAddress === row.address}
							<Check size={14} />
						{:else}
							<Copy size={14} />
						{/if}
					</button>
				</div>
			{:else}
				{@const token = tokens.find((t) => t.id === column.id)}
				{@const balance = typeof value === 'bigint' ? value : 0n}
				<span class="cell-balance" class:zero={balance === 0n}>
					{formatBalance(balance, token?.decimals ?? 18)}
				</span>
			{/if}
		{/snippet}
	</DataTable>
</div>

<style>
	.balance-table-container {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	/* Filter Bar */
	.filter-bar {
		padding: var(--space-3) var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
	}

	.filter-row {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		align-items: center;
	}

	.filter-select {
		padding: var(--space-2) var(--space-3);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		color: var(--gray-800);
		cursor: pointer;
		min-width: 120px;
	}

	:global([data-theme='dark']) .filter-select {
		color: var(--gray-200);
	}

	.filter-select:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.range-input {
		padding: var(--space-2);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		color: var(--gray-800);
		width: 80px;
	}

	:global([data-theme='dark']) .range-input {
		color: var(--gray-200);
	}

	.range-input:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.range-sep {
		color: var(--gray-500);
		font-size: var(--text-sm);
	}

	.reset-btn {
		padding: var(--space-2) var(--space-3);
		background: none;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		color: var(--gray-600);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	:global([data-theme='dark']) .reset-btn {
		color: var(--gray-400);
	}

	.reset-btn:hover {
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	/* Cell styles */
	.cell-address {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.address-text {
		font-family: monospace;
		font-size: var(--text-xs);
	}

	.copy-btn {
		padding: var(--space-1);
		background: transparent;
		border: none;
		color: var(--gray-400);
		cursor: pointer;
		transition: color 0.2s ease;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.copy-btn:hover {
		color: var(--color-primary);
	}

	.cell-balance {
		font-family: monospace;
	}

	.cell-balance.zero {
		color: var(--gray-400);
	}

	/* Row highlighting */
	:global(.data-table-wrapper tbody tr.has-balance) {
		background: hsla(142, 76%, 50%, 0.05);
	}

	:global([data-theme='dark'] .data-table-wrapper tbody tr.has-balance) {
		background: hsla(142, 40%, 25%, 0.2);
	}

	/* Mobile */
	@media (max-width: 640px) {
		.filter-bar {
			padding: var(--space-2) var(--space-3);
		}

		.filter-row {
			flex-direction: column;
			align-items: stretch;
		}

		.filter-select {
			width: 100%;
			min-width: 100%;
		}

		.range-input {
			flex: 1;
		}
	}
</style>
