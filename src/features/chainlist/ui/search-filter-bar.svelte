<script lang="ts">
	import { Search } from '@lucide/svelte';
	import { useI18n, type TranslationKeys } from '@shelchin/i18n';
	import type { NetworkFilter } from '../types/chain';

	interface Props {
		searchQuery: string;
		filter: NetworkFilter;
		onSearchChange: (query: string) => void;
		onFilterChange: (filter: NetworkFilter) => void;
		totalCount: number;
		filteredCount: number;
	}

	let { searchQuery, filter, onSearchChange, onFilterChange, totalCount, filteredCount }: Props =
		$props();

	const i18n = useI18n();

	const filters: { key: NetworkFilter; labelKey: string }[] = [
		{ key: 'all', labelKey: 'chainlist.filter.all' },
		{ key: 'mainnet', labelKey: 'chainlist.filter.mainnet' },
		{ key: 'testnet', labelKey: 'chainlist.filter.testnet' }
	];
</script>

<div class="search-filter-bar">
	<div class="search-container">
		<Search size={20} class="search-icon" />
		<input
			type="text"
			class="search-input"
			placeholder={i18n.t('chainlist.search_placeholder')}
			value={searchQuery}
			oninput={(e) => onSearchChange(e.currentTarget.value)}
		/>
		{#if searchQuery}
			<button class="clear-btn" onclick={() => onSearchChange('')} aria-label="Clear search">
				&times;
			</button>
		{/if}
	</div>

	<div class="filter-container">
		<div class="filter-tabs">
			{#each filters as f (f.key)}
				<button
					class="filter-tab"
					class:active={filter === f.key}
					onclick={() => onFilterChange(f.key)}
				>
					{i18n.t(f.labelKey as keyof TranslationKeys)}
				</button>
			{/each}
		</div>

		<div class="result-count">
			{i18n.t('chainlist.showing_results', { count: filteredCount, total: totalCount })}
		</div>
	</div>
</div>

<style>
	.search-filter-bar {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		margin-bottom: var(--space-6);
	}

	.search-container {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		transition: all 0.2s ease;
	}

	.search-container:focus-within {
		border-color: var(--color-brand);
		box-shadow: 0 0 0 3px var(--color-brand-alpha-20);
	}

	.search-container :global(.search-icon) {
		color: var(--color-muted-foreground);
		flex-shrink: 0;
	}

	.search-input {
		flex: 1;
		border: none;
		background: transparent;
		font-size: var(--text-base);
		color: var(--color-foreground);
		outline: none;
	}

	.search-input::placeholder {
		color: var(--color-muted-foreground);
	}

	.clear-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		border: none;
		background: var(--color-panel-2);
		border-radius: var(--radius-full);
		color: var(--color-muted-foreground);
		font-size: 16px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.clear-btn:hover {
		background: var(--color-panel-3);
		color: var(--color-foreground);
	}

	.filter-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-4);
		flex-wrap: wrap;
	}

	.filter-tabs {
		display: flex;
		gap: var(--space-1);
		padding: var(--space-1);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
	}

	.filter-tab {
		padding: var(--space-2) var(--space-4);
		border: none;
		background: transparent;
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-foreground);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.filter-tab:hover:not(.active) {
		background: var(--color-panel-2);
	}

	.filter-tab.active {
		background: var(--color-foreground);
		color: var(--color-background);
	}

	.result-count {
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
	}

	@media (max-width: 640px) {
		.filter-container {
			flex-direction: column;
			align-items: stretch;
		}

		.filter-tabs {
			width: 100%;
		}

		.filter-tab {
			flex: 1;
			justify-content: center;
		}

		.result-count {
			text-align: center;
		}
	}
</style>
