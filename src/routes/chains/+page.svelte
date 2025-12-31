<script lang="ts">
	import { useI18n } from '@shelchin/i18n';
	import {
		Search,
		Layers,
		TrendingUp,
		TestTube,
		Globe,
		ChevronRight,
		Filter,
		X
	} from '@lucide/svelte';
	import SeoHead from '$lib/components/seo-head.svelte';
	import { PromotionFooter } from '@/features/promotions';
	import { formatTvl, getChainSlug } from '@/features/chains/data/chains';
	import type { PageData } from './$types';
	import type { Chain } from '@/features/chains/types';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();

	// Search and filter state
	let searchQuery = $state('');
	let networkFilter = $state<'all' | 'mainnet' | 'testnet'>('all');
	let sortBy = $state<'name' | 'chainId' | 'tvl'>('tvl');

	// Filtered and sorted chains
	const filteredChains = $derived.by(() => {
		let result: Chain[] = data.chains;

		// Filter by network type
		if (networkFilter === 'mainnet') {
			result = result.filter((c) => !c.isTestnet);
		} else if (networkFilter === 'testnet') {
			result = result.filter((c) => c.isTestnet === true);
		}

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase().trim();
			result = result.filter((chain) => {
				const searchableText = [
					chain.name,
					chain.chain,
					chain.shortName,
					chain.chainSlug,
					chain.chainId.toString(),
					chain.nativeCurrency?.symbol
				]
					.filter(Boolean)
					.join(' ')
					.toLowerCase();
				return searchableText.includes(query);
			});
		}

		// Sort
		if (sortBy === 'name') {
			result = [...result].sort((a, b) => a.name.localeCompare(b.name));
		} else if (sortBy === 'chainId') {
			result = [...result].sort((a, b) => a.chainId - b.chainId);
		} else if (sortBy === 'tvl') {
			result = [...result].sort((a, b) => (b.tvl || 0) - (a.tvl || 0));
		}

		return result;
	});

	// Paginate for initial display
	let displayCount = $state(50);
	const displayedChains = $derived(filteredChains.slice(0, displayCount));
	const hasMore = $derived(displayCount < filteredChains.length);

	function loadMore() {
		displayCount += 50;
	}

	function clearSearch() {
		searchQuery = '';
	}
</script>

<SeoHead
	title={data.meta.title}
	description={data.meta.description}
	keywords={data.meta.keywords}
	canonical={data.meta.canonical}
	type={data.meta.type}
	image={data.meta.image}
	locale={data.meta.locale}
	structuredData={data.structuredData}
/>

<div class="chains-page">
	<!-- Header -->
	<header class="page-header">
		<div class="header-content">
			<h1 class="page-title">
				<Layers class="title-icon" />
				{i18n.t('routes/chains.title')}
			</h1>
			<p class="page-subtitle">{i18n.t('routes/chains.subtitle')}</p>
		</div>

		<!-- Stats -->
		<div class="stats-bar">
			<div class="stat-item">
				<Globe class="stat-icon" />
				<span class="stat-value">{data.stats.mainnetChains}</span>
				<span class="stat-label">{i18n.t('routes/chains.mainnet')}</span>
			</div>
			<div class="stat-item">
				<TestTube class="stat-icon" />
				<span class="stat-value">{data.stats.testnetChains}</span>
				<span class="stat-label">{i18n.t('routes/chains.testnet')}</span>
			</div>
			<div class="stat-item">
				<TrendingUp class="stat-icon" />
				<span class="stat-value">{formatTvl(data.stats.totalTvl)}</span>
				<span class="stat-label">Total TVL</span>
			</div>
		</div>
	</header>

	<!-- Search and Filters -->
	<div class="search-filters">
		<div class="search-box">
			<Search class="search-icon" />
			<input
				type="text"
				placeholder="Search by name, chain ID, or symbol..."
				bind:value={searchQuery}
				class="search-input"
			/>
			{#if searchQuery}
				<button class="clear-btn" onclick={clearSearch}>
					<X class="icon" />
				</button>
			{/if}
		</div>

		<div class="filters">
			<div class="filter-group">
				<Filter class="filter-icon" />
				<button
					class="filter-btn"
					class:active={networkFilter === 'all'}
					onclick={() => (networkFilter = 'all')}
				>
					{i18n.t('routes/chains.filter_all')} ({data.stats.totalChains})
				</button>
				<button
					class="filter-btn"
					class:active={networkFilter === 'mainnet'}
					onclick={() => (networkFilter = 'mainnet')}
				>
					{i18n.t('routes/chains.mainnet')} ({data.stats.mainnetChains})
				</button>
				<button
					class="filter-btn"
					class:active={networkFilter === 'testnet'}
					onclick={() => (networkFilter = 'testnet')}
				>
					{i18n.t('routes/chains.testnet')} ({data.stats.testnetChains})
				</button>
			</div>

			<div class="sort-group">
				<span class="sort-label">Sort:</span>
				<select bind:value={sortBy} class="sort-select">
					<option value="tvl">TVL</option>
					<option value="name">Name</option>
					<option value="chainId">Chain ID</option>
				</select>
			</div>
		</div>
	</div>

	<!-- Chain List -->
	<div class="chains-list">
		{#each displayedChains as chain, index (chain.chainId)}
			{@const slug = getChainSlug(chain)}
			<a href="/chains/{slug}" class="chain-card" style="--index: {index % 50}">
				<div class="chain-icon-wrapper">
					{#if chain.icon}
						<img
							src="/icons/{chain.icon}.svg"
							alt={chain.name}
							class="chain-icon"
							onerror={(e) => {
								(e.currentTarget as HTMLImageElement).style.display = 'none';
							}}
						/>
					{:else}
						<div class="chain-icon-placeholder">
							<Layers class="icon" />
						</div>
					{/if}
				</div>

				<div class="chain-info">
					<div class="chain-name-row">
						<span class="chain-name">{chain.name}</span>
						{#if chain.isTestnet}
							<span class="testnet-badge">{i18n.t('routes/chains.testnet')}</span>
						{/if}
					</div>
					<div class="chain-meta">
						<span class="chain-id">ID: {chain.chainId}</span>
						<span class="divider">|</span>
						<span class="chain-symbol">{chain.nativeCurrency?.symbol || chain.chain}</span>
						{#if chain.tvl && chain.tvl > 0 && !chain.isTestnet}
							<span class="divider">|</span>
							<span class="chain-tvl">TVL: {formatTvl(chain.tvl)}</span>
						{/if}
					</div>
				</div>

				<div class="chain-rpc-count">
					<span class="rpc-count">{chain.rpc.length}</span>
					<span class="rpc-label">RPCs</span>
				</div>

				<ChevronRight class="arrow-icon" />
			</a>
		{/each}
	</div>

	<!-- Load More -->
	{#if hasMore}
		<div class="load-more">
			<button class="load-more-btn" onclick={loadMore}>
				Load More ({filteredChains.length - displayCount} remaining)
			</button>
		</div>
	{/if}

	<!-- Results count -->
	<p class="results-count">
		Showing {displayedChains.length} of {filteredChains.length} chains
	</p>

	<!-- Promotions -->
	<PromotionFooter promotions={data.promotions} />

	<!-- Data Source -->
	<footer class="data-source">
		<p>
			{i18n.t('routes/chains.data_source')}:
			<a href="https://chainlist.org" target="_blank" rel="noopener noreferrer">chainlist.org</a>,
			<a href="https://defillama.com" target="_blank" rel="noopener noreferrer">DefiLlama</a>
		</p>
	</footer>
</div>

<style>
	.chains-page {
		max-width: 1000px;
		margin: 0 auto;
		padding: var(--space-6);
	}

	/* Header */
	.page-header {
		margin-bottom: var(--space-8);
	}

	.header-content {
		margin-bottom: var(--space-6);
	}

	.page-title {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--color-heading-1);
		margin: 0 0 var(--space-2) 0;
	}

	.page-title :global(.title-icon) {
		width: 28px;
		height: 28px;
		color: #8b5cf6;
	}

	.page-subtitle {
		font-size: var(--text-base);
		color: var(--color-description-2);
		margin: 0;
	}

	/* Stats */
	.stats-bar {
		display: flex;
		gap: var(--space-6);
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-xl);
	}

	:global(.light) .stats-bar {
		background: var(--color-panel-2);
	}

	.stat-item {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.stat-item :global(.stat-icon) {
		width: 18px;
		height: 18px;
		color: var(--color-description-3);
	}

	.stat-value {
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		color: var(--color-heading-1);
	}

	.stat-label {
		font-size: var(--text-sm);
		color: var(--color-description-3);
	}

	/* Search and Filters */
	.search-filters {
		margin-bottom: var(--space-6);
	}

	.search-box {
		position: relative;
		margin-bottom: var(--space-4);
	}

	.search-box :global(.search-icon) {
		position: absolute;
		left: var(--space-4);
		top: 50%;
		transform: translateY(-50%);
		width: 18px;
		height: 18px;
		color: var(--color-description-3);
	}

	.search-input {
		width: 100%;
		padding: var(--space-3) var(--space-4) var(--space-3) var(--space-10);
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-lg);
		font-size: var(--text-base);
		color: var(--color-heading-1);
		outline: none;
		transition: all 0.2s ease;
	}

	:global(.light) .search-input {
		background: var(--color-panel-2);
	}

	.search-input::placeholder {
		color: var(--color-description-3);
	}

	.search-input:focus {
		border-color: #8b5cf6;
		box-shadow: 0 0 0 3px color-mix(in srgb, #8b5cf6 20%, transparent);
	}

	.clear-btn {
		position: absolute;
		right: var(--space-3);
		top: 50%;
		transform: translateY(-50%);
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		background: transparent;
		border: none;
		cursor: pointer;
		color: var(--color-description-3);
		transition: color 0.2s ease;
	}

	.clear-btn:hover {
		color: var(--color-heading-1);
	}

	.clear-btn :global(.icon) {
		width: 16px;
		height: 16px;
	}

	.filters {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-4);
	}

	.filter-group {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.filter-group :global(.filter-icon) {
		width: 16px;
		height: 16px;
		color: var(--color-description-3);
	}

	.filter-btn {
		padding: var(--space-2) var(--space-3);
		background: transparent;
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-description-2);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.filter-btn:hover {
		background: var(--color-panel-2);
		border-color: var(--color-panel-border-3);
	}

	.filter-btn.active {
		background: color-mix(in srgb, #8b5cf6 15%, transparent);
		border-color: #8b5cf6;
		color: #8b5cf6;
	}

	.sort-group {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.sort-label {
		font-size: var(--text-sm);
		color: var(--color-description-3);
	}

	.sort-select {
		padding: var(--space-2) var(--space-3);
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		color: var(--color-heading-2);
		cursor: pointer;
		outline: none;
	}

	:global(.light) .sort-select {
		background: var(--color-panel-2);
	}

	/* Chain List */
	.chains-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.chain-card {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-lg);
		text-decoration: none;
		transition: all 0.2s ease;
		animation: fadeIn 0.3s calc(var(--index) * 0.01s) both;
	}

	:global(.light) .chain-card {
		background: var(--color-panel-2);
	}

	.chain-card:hover {
		background: var(--color-panel-2);
		border-color: #8b5cf6;
		transform: translateX(4px);
	}

	:global(.light) .chain-card:hover {
		background: var(--color-panel-3);
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateX(-8px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.chain-icon-wrapper {
		flex-shrink: 0;
		width: 40px;
		height: 40px;
	}

	.chain-icon {
		width: 100%;
		height: 100%;
		border-radius: var(--radius-md);
		object-fit: contain;
		background: var(--color-panel-2);
		padding: var(--space-1);
	}

	:global(.light) .chain-icon {
		background: var(--color-panel-1);
	}

	.chain-icon-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		background: var(--color-panel-2);
		border-radius: var(--radius-md);
	}

	:global(.light) .chain-icon-placeholder {
		background: var(--color-panel-1);
	}

	.chain-icon-placeholder :global(.icon) {
		width: 20px;
		height: 20px;
		color: var(--color-description-3);
	}

	.chain-info {
		flex: 1;
		min-width: 0;
	}

	.chain-name-row {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-1);
	}

	.chain-name {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--color-heading-1);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.testnet-badge {
		padding: var(--space-0-5) var(--space-2);
		background: color-mix(in srgb, #eab308 15%, transparent);
		border-radius: var(--radius-sm);
		font-size: 10px;
		font-weight: var(--font-semibold);
		color: #eab308;
		text-transform: uppercase;
	}

	.chain-meta {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
		color: var(--color-description-3);
	}

	.chain-meta .divider {
		opacity: 0.5;
	}

	.chain-tvl {
		color: #22c55e;
	}

	.chain-rpc-count {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: var(--space-2) var(--space-3);
		background: var(--color-panel-2);
		border-radius: var(--radius-md);
	}

	:global(.light) .chain-rpc-count {
		background: var(--color-panel-1);
	}

	.rpc-count {
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		color: var(--color-heading-1);
		line-height: 1;
	}

	.rpc-label {
		font-size: 10px;
		color: var(--color-description-3);
		text-transform: uppercase;
	}

	.chain-card :global(.arrow-icon) {
		flex-shrink: 0;
		width: 18px;
		height: 18px;
		color: var(--color-description-3);
		transition: all 0.2s ease;
	}

	.chain-card:hover :global(.arrow-icon) {
		color: #8b5cf6;
		transform: translateX(4px);
	}

	/* Load More */
	.load-more {
		display: flex;
		justify-content: center;
		margin-top: var(--space-6);
	}

	.load-more-btn {
		padding: var(--space-3) var(--space-6);
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-lg);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-heading-2);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.load-more-btn:hover {
		background: var(--color-panel-3);
		border-color: #8b5cf6;
		color: #8b5cf6;
	}

	/* Results Count */
	.results-count {
		margin-top: var(--space-4);
		font-size: var(--text-sm);
		color: var(--color-description-3);
		text-align: center;
	}

	/* Data Source */
	.data-source {
		margin-top: var(--space-8);
		padding-top: var(--space-5);
		border-top: 1px solid var(--color-panel-border-1);
		text-align: center;
	}

	.data-source p {
		font-size: var(--text-xs);
		color: var(--color-description-3);
	}

	.data-source a {
		color: var(--color-description-2);
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.data-source a:hover {
		color: var(--color-heading-2);
	}

	/* Mobile */
	@media (max-width: 768px) {
		.chains-page {
			padding: var(--space-4);
		}

		.page-title {
			font-size: var(--text-xl);
		}

		.page-title :global(.title-icon) {
			width: 24px;
			height: 24px;
		}

		.stats-bar {
			flex-wrap: wrap;
			gap: var(--space-3);
			padding: var(--space-3);
		}

		.stat-value {
			font-size: var(--text-base);
		}

		.stat-label {
			font-size: var(--text-xs);
		}

		.filters {
			flex-direction: column;
			align-items: stretch;
		}

		.filter-group {
			flex-wrap: wrap;
		}

		.filter-btn {
			flex: 1;
			text-align: center;
			padding: var(--space-2);
			font-size: var(--text-xs);
		}

		.chain-card {
			padding: var(--space-3);
			gap: var(--space-3);
		}

		.chain-icon-wrapper {
			width: 32px;
			height: 32px;
		}

		.chain-name {
			font-size: var(--text-sm);
		}

		.chain-meta {
			font-size: var(--text-xs);
			flex-wrap: wrap;
		}

		.chain-rpc-count {
			padding: var(--space-1-5) var(--space-2);
		}

		.rpc-count {
			font-size: var(--text-base);
		}
	}
</style>
