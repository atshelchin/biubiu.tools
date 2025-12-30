<script lang="ts">
	import { useI18n } from '@shelchin/i18n';
	import { Filter, RotateCcw } from '@lucide/svelte';
	import type { BalanceFilter } from '../../types/scanner';
	import type { TokenConfig } from '$lib/services/balance-scanner/types';

	interface Props {
		filter: BalanceFilter;
		tokens: TokenConfig[];
		totalCount: number;
		filteredCount: number;
		onFilterChange: (filter: Partial<BalanceFilter>) => void;
		onReset: () => void;
	}

	let { filter, tokens, totalCount, filteredCount, onFilterChange, onReset }: Props = $props();

	const i18n = useI18n();

	// Balance status options
	const balanceStatusOptions = $derived([
		{
			value: 'all' as const,
			label: i18n.t('routes/apps/token-balance-scanner.step5.filter.status_all') || 'All'
		},
		{
			value: 'has_balance' as const,
			label:
				i18n.t('routes/apps/token-balance-scanner.step5.filter.status_has_balance') || 'Has Balance'
		},
		{
			value: 'no_balance' as const,
			label:
				i18n.t('routes/apps/token-balance-scanner.step5.filter.status_no_balance') || 'No Balance'
		}
	]);

	// Token options
	const tokenOptions = $derived([
		{
			value: 'all',
			label: i18n.t('routes/apps/token-balance-scanner.step5.filter.token_all') || 'All Tokens'
		},
		...tokens.map((t) => ({
			value: t.id,
			label: t.symbol || t.id
		}))
	]);

	// Whether a specific token is selected (for showing range inputs)
	const showRangeInputs = $derived(filter.tokenId !== 'all');

	// Handle balance status change
	function handleStatusChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		onFilterChange({ balanceStatus: target.value as BalanceFilter['balanceStatus'] });
	}

	// Handle token change
	function handleTokenChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		onFilterChange({
			tokenId: target.value,
			minBalance: undefined,
			maxBalance: undefined
		});
	}

	// Handle min balance change
	function handleMinBalanceChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const value = target.value.trim();
		onFilterChange({ minBalance: value || undefined });
	}

	// Handle max balance change
	function handleMaxBalanceChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const value = target.value.trim();
		onFilterChange({ maxBalance: value || undefined });
	}

	// Check if filter is active
	const isFilterActive = $derived(
		filter.balanceStatus !== 'all' ||
			filter.tokenId !== 'all' ||
			filter.minBalance !== undefined ||
			filter.maxBalance !== undefined
	);
</script>

<div class="balance-filter">
	<div class="filter-header">
		<div class="filter-title">
			<Filter size={16} />
			<span>{i18n.t('routes/apps/token-balance-scanner.step5.filter.title') || 'Filter'}</span>
		</div>
		{#if isFilterActive}
			<button class="reset-btn" onclick={onReset}>
				<RotateCcw size={14} />
				<span>{i18n.t('routes/apps/token-balance-scanner.step5.filter.reset') || 'Reset'}</span>
			</button>
		{/if}
	</div>

	<div class="filter-controls">
		<!-- Balance Status -->
		<div class="filter-group">
			<label class="filter-label" for="balance-status-select">
				{i18n.t('routes/apps/token-balance-scanner.step5.filter.balance_status') ||
					'Balance Status'}
			</label>
			<select
				id="balance-status-select"
				class="filter-select"
				value={filter.balanceStatus}
				onchange={handleStatusChange}
			>
				{#each balanceStatusOptions as option (option.value)}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</div>

		<!-- Token -->
		<div class="filter-group">
			<label class="filter-label" for="token-select">
				{i18n.t('routes/apps/token-balance-scanner.step5.filter.token') || 'Token'}
			</label>
			<select
				id="token-select"
				class="filter-select"
				value={filter.tokenId}
				onchange={handleTokenChange}
			>
				{#each tokenOptions as option (option.value)}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</div>

		<!-- Balance Range (only when specific token selected) -->
		{#if showRangeInputs}
			<div class="filter-group range-group">
				<span class="filter-label">
					{i18n.t('routes/apps/token-balance-scanner.step5.filter.balance_range') ||
						'Balance Range'}
				</span>
				<div class="range-inputs">
					<input
						type="text"
						class="range-input"
						placeholder={i18n.t('routes/apps/token-balance-scanner.step5.filter.min') || 'Min'}
						value={filter.minBalance || ''}
						oninput={handleMinBalanceChange}
						aria-label={i18n.t('routes/apps/token-balance-scanner.step5.filter.min') || 'Min'}
					/>
					<span class="range-separator">-</span>
					<input
						type="text"
						class="range-input"
						placeholder={i18n.t('routes/apps/token-balance-scanner.step5.filter.max') || 'Max'}
						value={filter.maxBalance || ''}
						oninput={handleMaxBalanceChange}
						aria-label={i18n.t('routes/apps/token-balance-scanner.step5.filter.max') || 'Max'}
					/>
				</div>
			</div>
		{/if}
	</div>

	<!-- Result count -->
	<div class="filter-result">
		{#if isFilterActive}
			<span class="result-count">
				{i18n.t('routes/apps/token-balance-scanner.step5.filter.showing', {
					filtered: filteredCount,
					total: totalCount
				}) || `Showing ${filteredCount} of ${totalCount}`}
			</span>
		{:else}
			<span class="result-count">
				{i18n.t('routes/apps/token-balance-scanner.step5.filter.total', { count: totalCount }) ||
					`${totalCount} results`}
			</span>
		{/if}
	</div>
</div>

<style>
	.balance-filter {
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
	}

	.filter-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-3);
	}

	.filter-title {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .filter-title {
		color: var(--gray-300);
	}

	.reset-btn {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-1) var(--space-2);
		background: none;
		border: none;
		color: var(--color-primary);
		font-size: var(--text-xs);
		cursor: pointer;
		border-radius: var(--radius-sm);
		transition: all 0.2s ease;
	}

	.reset-btn:hover {
		background: var(--color-panel-2);
	}

	.filter-controls {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
	}

	.filter-group {
		flex: 1;
		min-width: 150px;
	}

	.range-group {
		min-width: 200px;
	}

	.filter-label {
		display: block;
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		color: var(--gray-600);
		margin-bottom: var(--space-1);
	}

	:global([data-theme='dark']) .filter-label {
		color: var(--gray-400);
	}

	.filter-select {
		width: 100%;
		padding: var(--space-2);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		color: var(--gray-900);
		cursor: pointer;
	}

	:global([data-theme='dark']) .filter-select {
		color: var(--gray-100);
	}

	.filter-select:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.range-inputs {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.range-input {
		flex: 1;
		padding: var(--space-2);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .range-input {
		color: var(--gray-100);
	}

	.range-input:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.range-separator {
		color: var(--gray-500);
		font-size: var(--text-sm);
	}

	.filter-result {
		margin-top: var(--space-3);
		padding-top: var(--space-3);
		border-top: 1px solid var(--color-border);
	}

	.result-count {
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .result-count {
		color: var(--gray-400);
	}

	/* Responsive */
	@media (max-width: 640px) {
		.filter-controls {
			flex-direction: column;
		}

		.filter-group {
			min-width: 100%;
		}
	}
</style>
