<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import { Server, Filter, ArrowLeft, Zap, RefreshCw } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import SeoHead from '$lib/components/seo-head.svelte';
	import ChainOverview from '@/features/chains/components/chain-overview.svelte';
	import RpcEndpointCard from '@/features/chains/components/rpc-endpoint-card.svelte';
	import ExplorersSection from '@/features/chains/components/explorers-section.svelte';
	import FaucetsSection from '@/features/chains/components/faucets-section.svelte';
	import { testMultipleRpcs, sortByLatency } from '@/features/chains/utils/rpc-tester';
	import type { PageData } from './$types';
	import type { ParsedRpcEndpoint, RpcLatencyResult } from '@/features/chains/types';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();

	// Filter state
	type TrackingFilter = 'all' | 'none' | 'limited';
	type ProtocolFilter = 'all' | 'http' | 'ws';

	let trackingFilter = $state<TrackingFilter>('all');
	let protocolFilter = $state<ProtocolFilter>('all');

	// Latency testing state
	let latencyResults = new SvelteMap<string, RpcLatencyResult>();
	let isTesting = $state(false);
	let testProgress = $state({ completed: 0, total: 0 });

	// Start latency test
	async function runLatencyTest() {
		if (isTesting) return;

		isTesting = true;
		latencyResults.clear();

		const httpUrls = data.parsedRpcs.filter((r) => !r.isWebSocket).map((r) => r.url);
		testProgress = { completed: 0, total: httpUrls.length };

		const results = await testMultipleRpcs(httpUrls, {
			concurrency: 5,
			timeoutMs: 5000,
			onProgress: (completed, total) => {
				testProgress = { completed, total };
			}
		});

		// Update map with results
		for (const [url, result] of results) {
			latencyResults.set(url, result);
		}
		isTesting = false;
	}

	// Auto-run test on mount
	onMount(() => {
		runLatencyTest();
	});

	// Sorted and filtered RPCs
	const filteredRpcs = $derived.by(() => {
		let rpcs: ParsedRpcEndpoint[] = data.parsedRpcs;

		// Filter by tracking
		if (trackingFilter === 'none') {
			rpcs = rpcs.filter((r) => r.tracking === 'none');
		} else if (trackingFilter === 'limited') {
			rpcs = rpcs.filter((r) => r.tracking === 'none' || r.tracking === 'limited');
		}

		// Filter by protocol
		if (protocolFilter === 'http') {
			rpcs = rpcs.filter((r) => !r.isWebSocket);
		} else if (protocolFilter === 'ws') {
			rpcs = rpcs.filter((r) => r.isWebSocket);
		}

		// Sort by latency if we have results
		if (latencyResults.size > 0) {
			rpcs = sortByLatency(rpcs, latencyResults);
		}

		return rpcs;
	});

	// Count stats
	const httpCount = $derived(data.parsedRpcs.filter((r) => !r.isWebSocket).length);
	const wsCount = $derived(data.parsedRpcs.filter((r) => r.isWebSocket).length);
	const noTrackingCount = $derived(data.parsedRpcs.filter((r) => r.tracking === 'none').length);

	// Latency stats
	const onlineCount = $derived(
		Array.from(latencyResults.values()).filter((r) => r.latency !== null).length
	);
	const offlineCount = $derived(
		Array.from(latencyResults.values()).filter((r) => r.latency === null).length
	);
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

<div class="chain-page">
	<!-- Breadcrumb -->
	<nav class="breadcrumb">
		<a href="/chains" class="back-link">
			<ArrowLeft class="icon" />
			<span>{i18n.t('chains.all_chains')}</span>
		</a>
	</nav>

	<!-- Chain Overview -->
	<ChainOverview chain={data.chain} rpcCount={data.parsedRpcs.length} />

	<!-- Block Explorers -->
	{#if data.chain.explorers && data.chain.explorers.length > 0}
		<ExplorersSection explorers={data.chain.explorers} />
	{/if}

	<!-- Faucets (for testnets) -->
	{#if data.chain.faucets && data.chain.faucets.length > 0}
		<FaucetsSection faucets={data.chain.faucets} />
	{/if}
	<!-- RPC Endpoints Section -->
	<section class="rpc-section">
		<div class="section-header">
			<h2 class="section-title">
				<Server class="icon" />
				{i18n.t('chains.rpc_endpoints')}
			</h2>
			<div class="rpc-stats">
				<span class="stat">{httpCount} HTTPS</span>
				<span class="divider">|</span>
				<span class="stat">{wsCount} WSS</span>
				<span class="divider">|</span>
				<span class="stat privacy">{noTrackingCount} {i18n.t('chains.privacy_friendly')}</span>
			</div>
		</div>

		<!-- Latency Test Status -->
		<div class="latency-bar">
			<div class="latency-info">
				<Zap class="latency-icon" />
				{#if isTesting}
					<span class="latency-text">
						{i18n.t('chains.testing_latency')} ({testProgress.completed}/{testProgress.total})
					</span>
					<div class="progress-bar">
						<div
							class="progress-fill"
							style="width: {(testProgress.completed / testProgress.total) * 100}%"
						></div>
					</div>
				{:else if latencyResults.size > 0}
					<span class="latency-text">
						<span class="online">{onlineCount} {i18n.t('chains.online')}</span>
						{#if offlineCount > 0}
							<span class="separator">·</span>
							<span class="offline">{offlineCount} {i18n.t('chains.offline')}</span>
						{/if}
					</span>
				{:else}
					<span class="latency-text">{i18n.t('chains.click_to_test')}</span>
				{/if}
			</div>
			<button class="retest-btn" onclick={runLatencyTest} disabled={isTesting}>
				<RefreshCw class="icon {isTesting ? 'spinning' : ''}" />
				{i18n.t('chains.retest')}
			</button>
		</div>

		<!-- Filters -->
		<div class="filters">
			<div class="filter-group">
				<Filter class="filter-icon" />
				<span class="filter-label">{i18n.t('chains.filter_tracking')}:</span>
				<div class="filter-buttons">
					<button
						class="filter-btn"
						class:active={trackingFilter === 'all'}
						onclick={() => (trackingFilter = 'all')}
					>
						{i18n.t('chains.filter_all')}
					</button>
					<button
						class="filter-btn"
						class:active={trackingFilter === 'none'}
						onclick={() => (trackingFilter = 'none')}
					>
						{i18n.t('chains.filter_no_tracking')}
					</button>
					<button
						class="filter-btn"
						class:active={trackingFilter === 'limited'}
						onclick={() => (trackingFilter = 'limited')}
					>
						{i18n.t('chains.filter_limited')}
					</button>
				</div>
			</div>

			<div class="filter-group">
				<span class="filter-label">{i18n.t('chains.filter_protocol')}:</span>
				<div class="filter-buttons">
					<button
						class="filter-btn"
						class:active={protocolFilter === 'all'}
						onclick={() => (protocolFilter = 'all')}
					>
						{i18n.t('chains.filter_all')}
					</button>
					<button
						class="filter-btn"
						class:active={protocolFilter === 'http'}
						onclick={() => (protocolFilter = 'http')}
					>
						HTTPS
					</button>
					<button
						class="filter-btn"
						class:active={protocolFilter === 'ws'}
						onclick={() => (protocolFilter = 'ws')}
					>
						WSS
					</button>
				</div>
			</div>
		</div>
		<!-- RPC List -->
		{#if filteredRpcs.length > 0}
			<div class="rpc-list">
				{#each filteredRpcs as rpc, index (rpc.url)}
					<RpcEndpointCard endpoint={rpc} {index} latencyResult={latencyResults.get(rpc.url)} />
				{/each}
			</div>
		{:else}
			<div class="empty-state">
				<p>{i18n.t('chains.no_rpc_match')}</p>
			</div>
		{/if}

		<!-- Showing count -->
		<p class="showing-count">
			{i18n.t('chains.showing_rpc', {
				count: filteredRpcs.length,
				total: data.parsedRpcs.length
			})}
		</p>
	</section>

	<!-- Data Source Footer -->
	<footer class="data-source">
		<p>
			{i18n.t('chains.data_source')}:
			<a href="https://chainlist.org" target="_blank" rel="noopener noreferrer">chainlist.org</a>
			{#if data.chain.tvl}
				,
				<a href="https://defillama.com" target="_blank" rel="noopener noreferrer">DefiLlama</a>
			{/if}
		</p>
	</footer>
</div>

<style>
	.chain-page {
		max-width: 1000px;
		margin: 0 auto;
		padding: var(--space-6);
	}

	/* Breadcrumb */
	.breadcrumb {
		margin-bottom: var(--space-6);
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-description-2);
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.back-link:hover {
		color: var(--color-heading-1);
	}

	.back-link :global(.icon) {
		width: 16px;
		height: 16px;
	}

	/* RPC Section */
	.rpc-section {
		margin-top: var(--space-8);
	}

	/* Latency Test Bar */
	.latency-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		margin-bottom: var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-lg);
	}

	:global(.light) .latency-bar {
		background: var(--color-panel-2);
	}

	.latency-info {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		flex: 1;
	}

	.latency-info :global(.latency-icon) {
		width: 16px;
		height: 16px;
		color: #eab308;
	}

	.latency-text {
		font-size: var(--text-sm);
		color: var(--color-description-2);
	}

	.latency-text .online {
		color: #22c55e;
		font-weight: var(--font-medium);
	}

	.latency-text .offline {
		color: #ef4444;
		font-weight: var(--font-medium);
	}

	.latency-text .separator {
		color: var(--color-description-3);
		margin: 0 var(--space-1);
	}

	.progress-bar {
		flex: 1;
		max-width: 200px;
		height: 4px;
		background: var(--color-panel-border-2);
		border-radius: 2px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #22c55e, #3b82f6);
		border-radius: 2px;
		transition: width 0.3s ease;
	}

	.retest-btn {
		display: flex;
		align-items: center;
		gap: var(--space-1-5);
		padding: var(--space-2) var(--space-3);
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-description-2);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	:global(.light) .retest-btn {
		background: var(--color-panel-1);
	}

	.retest-btn:hover:not(:disabled) {
		background: var(--color-panel-3);
		border-color: var(--color-panel-border-3);
		color: var(--color-heading-1);
	}

	.retest-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.retest-btn :global(.icon) {
		width: 14px;
		height: 14px;
	}

	.retest-btn :global(.icon.spinning) {
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

	.section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: var(--space-3);
		margin-bottom: var(--space-4);
	}

	.section-title {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--color-heading-1);
		margin: 0;
	}

	.section-title :global(.icon) {
		width: 20px;
		height: 20px;
		color: var(--color-description-3);
	}

	.rpc-stats {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
		color: var(--color-description-3);
	}

	.rpc-stats .stat.privacy {
		color: #22c55e;
	}

	.rpc-stats .divider {
		opacity: 0.5;
	}

	/* Filters */
	.filters {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-4);
		margin-bottom: var(--space-5);
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-lg);
	}

	:global(.light) .filters {
		background: var(--color-panel-2);
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

	.filter-label {
		font-size: var(--text-sm);
		color: var(--color-description-2);
	}

	.filter-buttons {
		display: flex;
		gap: var(--space-1);
	}

	.filter-btn {
		padding: var(--space-1-5) var(--space-3);
		background: transparent;
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-md);
		font-size: var(--text-xs);
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
		background: color-mix(in srgb, #3b82f6 15%, transparent);
		border-color: #3b82f6;
		color: #3b82f6;
	}

	/* RPC List */
	.rpc-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	/* Empty State */
	.empty-state {
		padding: var(--space-8);
		text-align: center;
		color: var(--color-description-3);
	}

	/* Showing Count */
	.showing-count {
		margin-top: var(--space-4);
		font-size: var(--text-sm);
		color: var(--color-description-3);
		text-align: center;
	}

	/* Data Source Footer */
	.data-source {
		margin-top: var(--space-10);
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
		.chain-page {
			padding: var(--space-4);
		}

		.section-header {
			flex-direction: column;
			align-items: flex-start;
		}

		.filters {
			flex-direction: column;
			gap: var(--space-3);
			padding: var(--space-3);
		}

		.filter-group {
			flex-wrap: wrap;
		}

		.filter-buttons {
			flex-wrap: wrap;
		}

		.filter-btn {
			padding: var(--space-1) var(--space-2);
			font-size: 10px;
		}

		.rpc-stats {
			font-size: var(--text-xs);
		}
	}
</style>
