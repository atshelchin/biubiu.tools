<script lang="ts">
	import { useI18n, type TranslationKeys } from '@shelchin/i18n';
	import { Search, Loader2 } from '@lucide/svelte';
	import SeoHead from '$lib/components/seo-head.svelte';
	import type { PageData } from './$types';
	import { CHAIN_META } from '@/features/address/types';
	import { getEntity } from '@/features/address/data';
	import type { LookupResult } from '@/features/address/client-lookup';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();

	// Search state
	let searchQuery = $state('');
	let searchResults = $state<
		Array<{ id: string; type: 'address' | 'name'; text: string; chain?: number }>
	>([]);
	let isSearching = $state(false);

	// Dynamic lookup state (for unlisted addresses/ENS)
	let dynamicLookupResult = $state<LookupResult | null>(null);
	let isLookingUp = $state(false);

	// Debounce timer for dynamic lookup
	let lookupTimer: ReturnType<typeof setTimeout> | null = null;

	// Handle search
	async function handleSearch() {
		// Clear dynamic lookup
		dynamicLookupResult = null;

		if (!searchQuery.trim()) {
			searchResults = [];
			return;
		}

		isSearching = true;
		// Dynamically import search function
		const { search } = await import('@/features/address/data');
		const results = search(searchQuery, 10);
		searchResults = results.map((r) => ({
			id: r.id,
			type: r.type,
			text: r.text,
			chain: r.chain
		}));
		isSearching = false;

		// If no indexed results found, try dynamic lookup
		if (searchResults.length === 0 && searchQuery.trim().length > 3) {
			debouncedLookup(searchQuery.trim());
		}
	}

	// Debounced dynamic lookup
	function debouncedLookup(query: string) {
		if (lookupTimer) {
			clearTimeout(lookupTimer);
		}
		lookupTimer = setTimeout(() => {
			performDynamicLookup(query);
		}, 500);
	}

	// Perform RPC-based lookup for unlisted addresses/ENS
	async function performDynamicLookup(query: string) {
		isLookingUp = true;
		try {
			const { clientLookup } = await import('@/features/address/client-lookup');
			dynamicLookupResult = await clientLookup(query);
		} catch {
			dynamicLookupResult = null;
		}
		isLookingUp = false;
	}

	// Navigate to result
	function goToResult(result: { id: string; type: 'address' | 'name'; chain?: number }) {
		if (result.type === 'address' && result.chain) {
			window.location.href = `/address/${result.chain}/${result.id}`;
		} else if (result.type === 'address') {
			// Default to Ethereum mainnet for dynamic results
			window.location.href = `/address/1/${result.id}`;
		} else {
			window.location.href = `/name/${result.id}`;
		}
	}

	// Navigate to dynamic lookup result
	function goToDynamicResult() {
		if (!dynamicLookupResult) return;
		if (dynamicLookupResult.ensName) {
			window.location.href = `/name/${dynamicLookupResult.ensName}`;
		} else {
			window.location.href = `/address/1/${dynamicLookupResult.address}`;
		}
	}

	// Label categories for quick navigation
	const labelCategories = [
		{ id: 'exchange', icon: '🏦' },
		{ id: 'defi', icon: '💰' },
		{ id: 'token', icon: '🪙' },
		{ id: 'nft', icon: '🖼️' },
		{ id: 'whale', icon: '🐋' },
		{ id: 'bridge', icon: '🌉' },
		{ id: 'dao', icon: '🏛️' },
		{ id: 'hacker', icon: '⚠️' }
	];
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

<div class="address-page">
	<!-- Hero Section -->
	<section class="hero">
		<h1 class="title">{i18n.t('routes/address.title')}</h1>
		<p class="subtitle">{i18n.t('routes/address.subtitle')}</p>

		<!-- Search Box -->
		<div class="search-container">
			<div class="search-box">
				<Search class="search-icon" />
				<input
					type="text"
					class="search-input"
					placeholder={i18n.t('routes/address.search_placeholder')}
					bind:value={searchQuery}
					oninput={handleSearch}
				/>
			</div>

			<!-- Search Results Dropdown -->
			{#if searchQuery.trim().length > 0}
				<div class="search-results">
					{#if isSearching}
						<div class="result-item no-results">
							<span class="result-type">⏳</span>
							<span class="result-id">{i18n.t('routes/address.searching')}</span>
						</div>
					{:else if searchResults.length > 0}
						<!-- Indexed results -->
						{#each searchResults as result (result.id + (result.chain || ''))}
							<button class="result-item" onclick={() => goToResult(result)}>
								<span class="result-type">{result.type === 'address' ? '📍' : '🔤'}</span>
								<span class="result-content">
									<span class="result-id">
										{result.type === 'address'
											? `${result.id.slice(0, 10)}...${result.id.slice(-8)}`
											: result.id}
									</span>
									{#if result.type === 'address' && result.chain}
										<span class="result-chain"
											>{CHAIN_META[result.chain]?.name || `Chain ${result.chain}`}</span
										>
									{/if}
								</span>
							</button>
						{/each}
					{:else if isLookingUp}
						<!-- Dynamic lookup in progress -->
						<div class="result-item no-results">
							<Loader2 class="spin-icon" />
							<span class="result-id">{i18n.t('routes/address.looking_up')}</span>
						</div>
					{:else if dynamicLookupResult}
						<!-- Dynamic lookup result -->
						{#if dynamicLookupResult.error}
							<div class="result-item no-results">
								<span class="result-type">❌</span>
								<span class="result-id">{dynamicLookupResult.error}</span>
							</div>
						{:else}
							<button class="result-item dynamic-result" onclick={goToDynamicResult}>
								<span class="result-type">{dynamicLookupResult.type === 'ens' ? '🔤' : '📍'}</span>
								<span class="result-content">
									<span class="result-id">
										{#if dynamicLookupResult.ensName}
											{dynamicLookupResult.ensName}
										{:else}
											{dynamicLookupResult.address.slice(
												0,
												10
											)}...{dynamicLookupResult.address.slice(-8)}
										{/if}
									</span>
									<span class="result-chain">
										{dynamicLookupResult.balance
											? `${parseFloat(dynamicLookupResult.balance).toFixed(4)} ETH`
											: 'Ethereum'}
									</span>
									{#if dynamicLookupResult.isContract}
										<span class="result-badge">Contract</span>
									{/if}
								</span>
								<span class="result-hint">{i18n.t('routes/address.view_details')}</span>
							</button>
						{/if}
					{:else}
						<!-- No results -->
						<div class="result-item no-results">
							<span class="result-type">🔍</span>
							<span class="result-id">{i18n.t('routes/address.no_results')}</span>
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Stats -->
		<div class="stats-row">
			<div class="stat-item">
				<span class="stat-value">{data.stats.totalAddresses.toLocaleString()}</span>
				<span class="stat-label">{i18n.t('routes/address.stats.addresses')}</span>
			</div>
			<div class="stat-divider"></div>
			<div class="stat-item">
				<span class="stat-value">{data.stats.totalNames.toLocaleString()}</span>
				<span class="stat-label">{i18n.t('routes/address.stats.names')}</span>
			</div>
		</div>
	</section>

	<!-- Category Stats -->
	<!-- <section class="categories-section">
		<h2 class="section-title">{i18n.t('routes/address.categories')}</h2>
		<div class="category-grid">
			{#each categoryStats as stat (stat.label)}
				<div class="category-card">
					<stat.icon class="category-icon" />
					<span class="category-count">{stat.count}</span>
					<span class="category-label">{stat.label}</span>
				</div>
			{/each}
		</div>
	</section> -->

	<!-- Browse by Label -->
	<section class="labels-section">
		<h2 class="section-title">{i18n.t('routes/address.browse_by_label')}</h2>
		<div class="label-grid">
			{#each labelCategories as label (label.id)}
				<a href="/address/labels/{label.id}" class="label-card">
					<span class="label-icon">{label.icon}</span>
					<span class="label-name"
						>{i18n.t(`routes/address.labels.${label.id}` as keyof TranslationKeys)}</span
					>
				</a>
			{/each}
		</div>
	</section>

	<!-- Popular Addresses -->
	<section class="popular-section">
		<h2 class="section-title">{i18n.t('routes/address.popular_addresses')}</h2>
		<div class="address-list">
			{#each data.popularAddresses as addr (`${addr.chainId}-${addr.address}`)}
				{@const entity = addr.entityId ? getEntity(addr.entityId) : undefined}
				<a href="/address/{addr.chainId}/{addr.address}" class="address-card">
					<div class="address-info">
						<span class="address-name">{addr.name}</span>
						<span class="address-entity">{entity?.name || ''}</span>
					</div>
					<div class="address-meta">
						<span class="address-chain">{CHAIN_META[addr.chainId]?.name || addr.chainId}</span>
						<code class="address-code">{addr.address.slice(0, 10)}...{addr.address.slice(-6)}</code>
					</div>
				</a>
			{/each}
		</div>
	</section>

	<!-- Popular ENS Names -->
	<section class="popular-section">
		<h2 class="section-title">{i18n.t('routes/address.popular_names')}</h2>
		<div class="name-grid">
			{#each data.popularNames as name (name.name)}
				<a href="/name/{name.name}" class="name-card">
					<span class="name-text">{name.name}</span>
					{#if name.description}
						<span class="name-desc">{name.description}</span>
					{/if}
				</a>
			{/each}
		</div>
	</section>
</div>

<style>
	.address-page {
		max-width: 1000px;
		margin: 0 auto;
		padding: var(--space-6);
	}

	/* Hero */
	.hero {
		text-align: center;
		padding: var(--space-10) 0;
	}

	.title {
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		color: var(--color-heading-1);
		margin: 0 0 var(--space-3);
	}

	.subtitle {
		font-size: var(--text-lg);
		color: var(--color-description-2);
		margin: 0 0 var(--space-8);
	}

	/* Search */
	.search-container {
		position: relative;
		max-width: 600px;
		margin: 0 auto var(--space-8);
	}

	.search-box {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-lg);
	}

	.search-box :global(.search-icon) {
		width: 20px;
		height: 20px;
		color: var(--color-description-3);
	}

	.search-input {
		flex: 1;
		background: transparent;
		border: none;
		outline: none;
		font-size: var(--text-base);
		color: var(--color-heading-1);
	}

	.search-input::placeholder {
		color: var(--color-description-3);
	}

	.search-results {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		margin-top: var(--space-2);
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-lg);
		overflow: hidden;
		z-index: 10;
	}

	.result-item {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		width: 100%;
		padding: var(--space-3) var(--space-4);
		background: transparent;
		border: none;
		border-bottom: 1px solid var(--color-panel-border-1);
		text-align: left;
		cursor: pointer;
		transition: background 0.2s;
	}

	.result-item:last-child {
		border-bottom: none;
	}

	.result-item:hover {
		background: var(--color-panel-2);
	}

	.result-type {
		font-size: var(--text-lg);
	}

	.result-content {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		flex: 1;
	}

	.result-id {
		font-family: var(--font-mono);
		font-size: var(--text-sm);
		color: var(--color-heading-2);
	}

	.result-chain {
		font-size: var(--text-xs);
		color: var(--color-description-3);
		background: var(--color-panel-2);
		padding: 2px var(--space-2);
		border-radius: var(--radius-sm);
		white-space: nowrap;
	}

	.no-results {
		cursor: default;
	}

	.no-results:hover {
		background: transparent;
	}

	/* Dynamic lookup styles */
	.result-item :global(.spin-icon) {
		width: 16px;
		height: 16px;
		color: var(--color-description-3);
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.dynamic-result {
		background: var(--color-panel-2);
		border-color: var(--color-panel-border-3);
	}

	.result-badge {
		font-size: var(--text-xs);
		color: var(--color-heading-2);
		background: var(--color-panel-3);
		padding: 2px var(--space-2);
		border-radius: var(--radius-sm);
	}

	.result-hint {
		font-size: var(--text-xs);
		color: #3b82f6;
		margin-left: auto;
	}

	/* Stats Row */
	.stats-row {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-6);
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-1);
	}

	.stat-value {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--color-heading-1);
	}

	.stat-label {
		font-size: var(--text-sm);
		color: var(--color-description-3);
	}

	.stat-divider {
		width: 1px;
		height: 40px;
		background: var(--color-panel-border-2);
	}

	/* Sections */
	.section-title {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		color: var(--color-heading-1);
		margin: 0 0 var(--space-4);
	}

	.labels-section,
	.popular-section {
		margin-top: var(--space-10);
	}

	/* Label Grid */
	.label-grid {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
	}

	.label-card {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-full);
		text-decoration: none;
		transition: all 0.2s;
	}

	.label-card:hover {
		background: var(--color-panel-2);
		border-color: var(--color-panel-border-3);
	}

	.label-icon {
		font-size: var(--text-lg);
	}

	.label-name {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-heading-2);
	}

	/* Address List */
	.address-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.address-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-lg);
		text-decoration: none;
		transition: all 0.2s;
	}

	.address-card:hover {
		background: var(--color-panel-2);
		border-color: var(--color-panel-border-3);
	}

	.address-info {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.address-name {
		font-weight: var(--font-medium);
		color: var(--color-heading-1);
	}

	.address-entity {
		font-size: var(--text-sm);
		color: var(--color-description-2);
	}

	.address-meta {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: var(--space-1);
	}

	.address-chain {
		font-size: var(--text-xs);
		color: var(--color-description-3);
	}

	.address-code {
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		color: var(--color-description-2);
		background: var(--color-panel-2);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-sm);
	}

	/* Name Grid */
	.name-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: var(--space-3);
	}

	.name-card {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-lg);
		text-decoration: none;
		transition: all 0.2s;
	}

	.name-card:hover {
		background: var(--color-panel-2);
		border-color: var(--color-panel-border-3);
	}

	.name-text {
		font-weight: var(--font-medium);
		color: #3b82f6;
	}

	.name-desc {
		font-size: var(--text-xs);
		color: var(--color-description-3);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/* Mobile */
	@media (max-width: 768px) {
		.address-page {
			padding: var(--space-4);
		}

		.title {
			font-size: var(--text-2xl);
		}

		.subtitle {
			font-size: var(--text-base);
		}

		.address-card {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--space-3);
		}

		.address-meta {
			align-items: flex-start;
		}

		.name-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
