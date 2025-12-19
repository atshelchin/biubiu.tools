<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import { mainnet, polygon, arbitrum, optimism, base, bsc } from 'viem/chains';
	import { createConnectStore } from '$lib/stores/connect.svelte';
	import PageLayout from '$lib/components/page-layout.svelte';
	import FAQs from '$lib/components/ui/faqs.svelte';
	import SearchFilterBar from '@/features/chainlist/ui/search-filter-bar.svelte';
	import ChainCard from '@/features/chainlist/ui/chain-card.svelte';
	import type { NetworkFilter } from '@/features/chainlist/types/chain';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import type { Chain, RpcEndpoint, Explorer } from '@/features/chainlist/types/chain';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();

	// FAQs for SEO
	const faqs = $derived([
		{
			question: i18n.t('chainlist.faq.q1'),
			answer: i18n.t('chainlist.faq.a1')
		},
		{
			question: i18n.t('chainlist.faq.q2'),
			answer: i18n.t('chainlist.faq.a2')
		},
		{
			question: i18n.t('chainlist.faq.q3'),
			answer: i18n.t('chainlist.faq.a3')
		},
		{
			question: i18n.t('chainlist.faq.q4'),
			answer: i18n.t('chainlist.faq.a4')
		},
		{
			question: i18n.t('chainlist.faq.q5'),
			answer: i18n.t('chainlist.faq.a5')
		}
	]);

	// Initialize wallet connect store (required for PageLayout/AppsHeader)
	createConnectStore({
		projectId: 'e68249e217c8793807b7bb961a2f4297',
		appName: 'BiuBiu Tools',
		appUrl: 'https://biubiu.tools',
		appLogoUrl: 'https://biubiu.tools/logo.svg',
		chains: [mainnet, base, bsc, polygon, arbitrum, optimism],
		storageKey: 'biubiu-tools-chainlist',
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		i18n: i18n as any
	});

	// Local state for search and filter
	let searchQuery = $state('');
	let filter = $state<NetworkFilter>('all');
	let expandedChainId = $state<number | null>(null);

	let chains = $state<Chain[]>([]);

	// Filtered chains based on search and filter
	const filteredChains = $derived.by(() => {
		let result = chains;

		// Apply network filter
		if (filter === 'mainnet') {
			result = result.filter((chain: Chain) => !chain.isTestnet);
		} else if (filter === 'testnet') {
			result = result.filter((chain: Chain) => chain.isTestnet);
		}

		// Apply search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase().trim();
			result = result.filter(
				(chain: Chain) =>
					chain.name.toLowerCase().includes(query) ||
					chain.chainId.toString().includes(query) ||
					chain.shortName.toLowerCase().includes(query) ||
					chain.nativeCurrency.symbol.toLowerCase().includes(query) ||
					chain.chain.toLowerCase().includes(query)
			);
		}

		// Sort by TVL (descending), then by name
		return [...result].sort((a: Chain, b: Chain) => {
			const tvlA = a.tvl ?? 0;
			const tvlB = b.tvl ?? 0;
			if (tvlB !== tvlA) {
				return tvlB - tvlA;
			}
			return a.name.localeCompare(b.name);
		});
	});

	// Pagination
	const ITEMS_PER_PAGE = 20;
	let currentPage = $state(1);

	const paginatedChains = $derived(filteredChains.slice(0, currentPage * ITEMS_PER_PAGE));

	const hasMore = $derived(currentPage * ITEMS_PER_PAGE < filteredChains.length);

	function loadMore() {
		if (hasMore) {
			currentPage++;
		}
	}

	function handleSearchChange(query: string) {
		searchQuery = query;
		currentPage = 1;
	}

	function handleFilterChange(newFilter: NetworkFilter) {
		filter = newFilter;
		currentPage = 1;
	}

	function toggleExpanded(chainId: number) {
		if (expandedChainId === chainId) {
			expandedChainId = null;
		} else {
			expandedChainId = chainId;
		}
	}
	// Dedupe arrays by a key field (keep first occurrence)
	function dedupeByKey<T>(items: T[], keyFn: (item: T) => string): T[] {
		const seen = new Set<string>();
		return items.filter((item) => {
			const key = keyFn(item);
			if (seen.has(key)) return false;
			seen.add(key);
			return true;
		});
	}
	onMount(async () => {
		// Load chain data
		const response = await fetch('/rpcs.json');
		const chains_: Chain[] = await response.json();

		// Dedupe RPC endpoints and explorers for each chain
		chains = chains_.map((chain) => ({
			...chain,
			rpc: dedupeByKey<RpcEndpoint>(chain.rpc, (r) => r.url),
			explorers: chain.explorers ? dedupeByKey<Explorer>(chain.explorers, (e) => e.url) : undefined
		}));
	});
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<meta name="description" content={data.meta.description} />
	<meta name="keywords" content={data.meta.keywords} />
</svelte:head>

<PageLayout>
	<div class="chainlist-page">
		<header class="page-header">
			<h1 class="page-title">{i18n.t('chainlist.title')}</h1>
			<p class="page-description">{i18n.t('chainlist.description')}</p>
		</header>

		<SearchFilterBar
			{searchQuery}
			{filter}
			onSearchChange={handleSearchChange}
			onFilterChange={handleFilterChange}
			totalCount={chains.length}
			filteredCount={filteredChains.length}
		/>

		<div class="chains-list">
			{#each paginatedChains as chain (chain.chainId)}
				<ChainCard
					{chain}
					isExpanded={expandedChainId === chain.chainId}
					onToggle={() => toggleExpanded(chain.chainId)}
				/>
			{/each}
		</div>

		{#if paginatedChains.length === 0}
			<div class="empty-state">
				<p>{i18n.t('chainlist.no_results')}</p>
			</div>
		{/if}

		{#if hasMore}
			<div class="load-more-container">
				<button class="load-more-btn" onclick={loadMore}>
					{i18n.t('chainlist.load_more')}
					<span class="remaining-count">
						({filteredChains.length - paginatedChains.length}
						{i18n.t('chainlist.remaining')})
					</span>
				</button>
			</div>
		{/if}

		<!-- FAQ Section for SEO -->
		<FAQs {faqs} title={i18n.t('chainlist.faq.title')} />

		<footer class="data-source">
			{i18n.t('chainlist.data_source')}
			<a href="https://chainlist.org" target="_blank" rel="noopener noreferrer">chainlist.org</a>
		</footer>
	</div>
</PageLayout>

<style>
	.chainlist-page {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		max-width: 100%;
		overflow: hidden;
	}

	.page-header {
		margin-bottom: var(--space-4);
	}

	.page-title {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--color-foreground);
		margin: 0 0 var(--space-2) 0;
	}

	.page-description {
		font-size: var(--text-base);
		color: var(--color-muted-foreground);
		margin: 0;
	}

	.chains-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		max-width: 100%;
		overflow: hidden;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: var(--space-12);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		text-align: center;
	}

	.empty-state p {
		color: var(--color-muted-foreground);
		margin: 0;
	}

	.load-more-container {
		display: flex;
		justify-content: center;
		margin-top: var(--space-4);
	}

	.load-more-btn {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-6);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		color: var(--color-foreground);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.load-more-btn:hover {
		background: var(--color-panel-2);
		border-color: var(--color-brand);
	}

	.remaining-count {
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
	}

	.data-source {
		margin-top: var(--space-8);
		padding-top: var(--space-4);
		border-top: 1px solid var(--color-border);
		text-align: center;
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
	}

	.data-source a {
		color: var(--color-brand);
		text-decoration: none;
	}

	.data-source a:hover {
		text-decoration: underline;
	}
</style>
