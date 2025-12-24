<script lang="ts">
	import { useI18n } from '@shelchin/i18n';
	import { CheckCircle2 } from '@lucide/svelte';
	import BalanceTable from '../balance-table.svelte';
	import type {
		AddressBalance,
		BalanceFilter,
		ScanSummary,
		SortState
	} from '../../../types/scanner';
	import type { TokenConfig } from '$lib/services/balance-scanner/types';

	interface Props {
		results: AddressBalance[];
		summary: ScanSummary | null;
		tokens: TokenConfig[];
		filter: BalanceFilter;
		sortState: SortState;
		pagination: {
			page: number;
			pageSize: number;
			totalPages: number;
			totalItems: number;
		};
		paginatedResults: AddressBalance[];
		filteredCount: number;
		onFilterChange: (filter: Partial<BalanceFilter>) => void;
		onFilterReset: () => void;
		onSortChange: (state: SortState) => void;
		onPageChange: (page: number) => void;
		onPageSizeChange: (size: number) => void;
	}

	let {
		results,
		summary,
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
</script>

<div class="completed-state">
	<!-- Success Banner -->
	<div class="success-banner">
		<CheckCircle2 size={20} />
		<span>
			{i18n.t('token-balance-scanner.step5.completed.banner', {
				count: results.length
			}) || `Scan Complete - ${results.length} wallets scanned`}
		</span>
	</div>

	<!-- Token Totals -->
	{#if summary && summary.tokenTotals.length > 0}
		<div class="totals-section">
			<h3>{i18n.t('token-balance-scanner.step5.totals.title') || 'Total Holdings'}</h3>
			<div class="totals-grid">
				{#each summary.tokenTotals as tokenTotal (tokenTotal.tokenId)}
					<div class="total-card">
						<div class="token-header">
							<span class="token-symbol">{tokenTotal.symbol}</span>
							<span class="token-wallets">
								{tokenTotal.walletsWithBalance}
								{i18n.t('token-balance-scanner.step5.totals.wallets_short') || 'wallets'}
							</span>
						</div>
						<div class="total-amount">{tokenTotal.formattedTotal}</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Balance Table -->
	<BalanceTable
		{results}
		{tokens}
		{filter}
		{sortState}
		{pagination}
		{paginatedResults}
		{filteredCount}
		{onFilterChange}
		{onFilterReset}
		{onSortChange}
		{onPageChange}
		{onPageSizeChange}
	/>
</div>

<style>
	.completed-state {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	/* Success Banner - Simple and clean */
	.success-banner {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-left: 3px solid hsl(142, 71%, 45%);
		border-radius: var(--radius-md);
		color: hsl(142, 71%, 40%);
	}

	.success-banner span {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--gray-800);
	}

	:global([data-theme='dark']) .success-banner span {
		color: var(--gray-200);
	}

	/* Totals Section */
	.totals-section h3 {
		margin: 0 0 var(--space-3) 0;
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-700);
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	:global([data-theme='dark']) .totals-section h3 {
		color: var(--gray-300);
	}

	.totals-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: var(--space-2);
	}

	.total-card {
		padding: var(--space-3);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
	}

	.token-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-2);
	}

	.token-symbol {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .token-symbol {
		color: var(--gray-100);
	}

	.token-wallets {
		font-size: var(--text-xs);
		color: var(--gray-500);
	}

	.total-amount {
		font-size: var(--text-base);
		font-weight: var(--font-bold);
		color: var(--color-primary);
		font-family: monospace;
		word-break: break-all;
	}

	/* Responsive */
	@media (max-width: 640px) {
		.totals-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
