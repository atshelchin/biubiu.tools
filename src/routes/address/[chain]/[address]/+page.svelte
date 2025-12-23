<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import {
		ArrowLeft,
		Copy,
		ExternalLink,
		Shield,
		AlertTriangle,
		Check,
		Tag,
		Link2,
		Wallet,
		Loader2
	} from '@lucide/svelte';
	import SeoHead from '$lib/components/seo-head.svelte';
	import type { PageData } from './$types';
	import { CHAIN_META, LABEL_META } from '@/features/address/types';
	import {
		fetchBalance,
		formatBalance,
		type BalanceResult
	} from '@/features/address/balance-fetcher';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();

	// Copy state
	let copied = $state(false);

	// Balance state
	let balanceResult = $state<BalanceResult | null>(null);
	let balanceLoading = $state(true);

	// Fetch balance on mount
	$effect(() => {
		const address = data.address.address;
		const chainId = data.chainId;

		balanceLoading = true;
		fetchBalance(address, chainId).then((result) => {
			balanceResult = result;
			balanceLoading = false;
		});
	});

	async function copyAddress() {
		await navigator.clipboard.writeText(data.address.address);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	// Risk color
	const riskColors: Record<string, string> = {
		safe: '#22c55e',
		neutral: '#6b7280',
		warning: '#f59e0b',
		danger: '#ef4444'
	};

	// Explorer URL
	const explorerUrl = `${CHAIN_META[data.chainId]?.explorerUrl || 'https://etherscan.io'}/address/${data.address.address}`;
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

<div class="address-detail-page">
	<!-- Breadcrumb -->
	<nav class="breadcrumb">
		<a href="/address" class="back-link">
			<ArrowLeft class="icon" />
			<span>{i18n.t('address.all_addresses')}</span>
		</a>
	</nav>

	<!-- Main Card -->
	<div class="main-card">
		<!-- Header -->
		<div class="card-header">
			<div class="entity-info">
				{#if data.entity.logo}
					<img src={data.entity.logo} alt={data.entity.name} class="entity-logo" />
				{:else}
					<div class="entity-placeholder">
						{data.entity.name.charAt(0).toUpperCase()}
					</div>
				{/if}
				<div class="entity-text">
					<h1 class="address-name">{data.address.name}</h1>
					<span class="entity-name">{data.entity.name}</span>
				</div>
			</div>

			<!-- Risk Badge -->
			<div class="risk-badge" style="--risk-color: {riskColors[data.address.riskLevel]}">
				{#if data.address.riskLevel === 'safe'}
					<Shield class="risk-icon" />
				{:else if data.address.riskLevel === 'warning' || data.address.riskLevel === 'danger'}
					<AlertTriangle class="risk-icon" />
				{/if}
				<span>{i18n.t(`address.risk.${data.address.riskLevel}`)}</span>
			</div>
		</div>

		<!-- Address -->
		<div class="address-row">
			<code class="address-full">{data.address.address}</code>
			<button class="copy-btn" onclick={copyAddress}>
				{#if copied}
					<Check class="icon" />
				{:else}
					<Copy class="icon" />
				{/if}
			</button>
		</div>

		<!-- Balance -->
		<div class="balance-row">
			<div class="balance-label">
				<Wallet class="balance-icon" />
				<span>{i18n.t('address.balance')}</span>
			</div>
			<div class="balance-value">
				{#if balanceLoading}
					<Loader2 class="loading-icon spin" />
					<span class="balance-loading">{i18n.t('address.loading_balance')}</span>
				{:else if balanceResult?.error}
					<span class="balance-error">{balanceResult.error}</span>
				{:else if balanceResult}
					<span class="balance-amount">{formatBalance(balanceResult.balance)}</span>
					<span class="balance-symbol">{balanceResult.symbol}</span>
					{#if balanceResult.isContract}
						<span class="contract-badge">{i18n.t('address.contract')}</span>
					{/if}
				{:else}
					<span class="balance-na">-</span>
				{/if}
			</div>
		</div>

		<!-- Chain & Labels -->
		<div class="meta-row">
			<div class="chain-badges">
				<span class="chain-badge">{CHAIN_META[data.chainId]?.name || data.chainId}</span>
			</div>

			<div class="label-badges">
				{#each data.address.labels as label (label)}
					<span
						class="label-badge"
						style="--label-color: var(--color-{LABEL_META[label]?.color || 'gray'}-500)"
					>
						{i18n.t(`address.labels.${label}`)}
					</span>
				{/each}
			</div>
		</div>

		<!-- Description -->
		{#if data.address.description}
			<p class="description">{data.address.description}</p>
		{/if}

		<!-- External Links -->
		<div class="external-links">
			<a href={explorerUrl} target="_blank" rel="noopener noreferrer" class="external-link">
				<ExternalLink class="icon" />
				<span>{i18n.t('address.view_on_explorer')}</span>
			</a>

			{#if data.entity.website}
				<a
					href={data.entity.website}
					target="_blank"
					rel="noopener noreferrer"
					class="external-link"
				>
					<Link2 class="icon" />
					<span>{i18n.t('address.website')}</span>
				</a>
			{/if}
		</div>
	</div>

	<!-- Related Names -->
	{#if data.relatedNames.length > 0}
		<section class="related-section">
			<h2 class="section-title">
				<Tag class="section-icon" />
				{i18n.t('address.related_names')}
			</h2>
			<div class="related-grid">
				{#each data.relatedNames as name (name.name)}
					<a href="/name/{name.name}" class="related-card">
						<span class="related-name">{name.name}</span>
					</a>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Related Addresses -->
	{#if data.relatedAddresses.length > 0}
		<section class="related-section">
			<h2 class="section-title">
				<Link2 class="section-icon" />
				{i18n.t('address.related_addresses')}
			</h2>
			<div class="related-list">
				{#each data.relatedAddresses as addr (`${addr.chainId}-${addr.address}`)}
					<a href="/address/{addr.chainId}/{addr.address}" class="related-address">
						<span class="related-addr-name">{addr.name}</span>
						<code class="related-addr-code"
							>{addr.address.slice(0, 10)}...{addr.address.slice(-6)}</code
						>
					</a>
				{/each}
			</div>
		</section>
	{/if}

	<!-- FAQ Section for SEO -->
	<section class="faq-section">
		<h2 class="section-title">{i18n.t('address.faq.title')}</h2>

		<div class="faq-list">
			<details class="faq-item">
				<summary class="faq-question"
					>{i18n.t('address.faq.what_is', { name: data.address.name })}</summary
				>
				<p class="faq-answer">
					{i18n.t('address.faq.what_is_answer', {
						name: data.address.name,
						entity: data.entity.name,
						chain: CHAIN_META[data.chainId]?.name || 'Unknown'
					})}
				</p>
			</details>

			<details class="faq-item">
				<summary class="faq-question">{i18n.t('address.faq.is_safe')}</summary>
				<p class="faq-answer">
					{i18n.t(`address.faq.is_safe_answer_${data.address.riskLevel}`, {
						name: data.address.name
					})}
				</p>
			</details>

			<details class="faq-item">
				<summary class="faq-question">{i18n.t('address.faq.how_to_verify')}</summary>
				<p class="faq-answer">
					{i18n.t('address.faq.how_to_verify_answer', {
						explorer: CHAIN_META[data.chainId]?.name || 'Etherscan'
					})}
				</p>
			</details>
		</div>
	</section>

	<!-- Data Source Footer -->
	<footer class="data-source">
		<p>
			{i18n.t('address.data_source')}:
			{i18n.t('address.source_' + data.address.source)}
			· {i18n.t('address.updated')}: {data.address.updatedAt}
		</p>
	</footer>
</div>

<style>
	.address-detail-page {
		max-width: 800px;
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

	/* Main Card */
	.main-card {
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-xl);
		padding: var(--space-6);
	}

	.card-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--space-4);
		margin-bottom: var(--space-5);
	}

	.entity-info {
		display: flex;
		align-items: center;
		gap: var(--space-4);
	}

	.entity-logo {
		width: 48px;
		height: 48px;
		border-radius: var(--radius-lg);
		object-fit: contain;
		background: var(--color-panel-2);
		padding: var(--space-2);
	}

	.entity-placeholder {
		width: 48px;
		height: 48px;
		border-radius: var(--radius-lg);
		background: var(--color-panel-2);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--text-xl);
		font-weight: var(--font-bold);
		color: var(--color-description-2);
	}

	.entity-text {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.address-name {
		font-size: var(--text-xl);
		font-weight: var(--font-bold);
		color: var(--color-heading-1);
		margin: 0;
	}

	.entity-name {
		font-size: var(--text-sm);
		color: var(--color-description-2);
	}

	/* Risk Badge */
	.risk-badge {
		display: flex;
		align-items: center;
		gap: var(--space-1-5);
		padding: var(--space-2) var(--space-3);
		background: color-mix(in srgb, var(--risk-color) 15%, transparent);
		border: 1px solid var(--risk-color);
		border-radius: var(--radius-full);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--risk-color);
	}

	.risk-badge :global(.risk-icon) {
		width: 14px;
		height: 14px;
	}

	/* Address Row */
	.address-row {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-4);
		background: var(--color-panel-2);
		border-radius: var(--radius-lg);
		margin-bottom: var(--space-4);
	}

	.address-full {
		flex: 1;
		font-family: var(--font-mono);
		font-size: var(--text-sm);
		color: var(--color-heading-2);
		word-break: break-all;
	}

	.copy-btn {
		padding: var(--space-2);
		background: var(--color-panel-3);
		border: none;
		border-radius: var(--radius-md);
		color: var(--color-description-2);
		cursor: pointer;
		transition: all 0.2s;
	}

	.copy-btn:hover {
		background: var(--color-panel-4);
		color: var(--color-heading-1);
	}

	.copy-btn :global(.icon) {
		width: 16px;
		height: 16px;
	}

	/* Balance Row */
	.balance-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-3) var(--space-4);
		background: var(--color-panel-2);
		border-radius: var(--radius-lg);
		margin-bottom: var(--space-4);
	}

	.balance-label {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
		color: var(--color-description-2);
	}

	.balance-label :global(.balance-icon) {
		width: 16px;
		height: 16px;
	}

	.balance-value {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.balance-amount {
		font-family: var(--font-mono);
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--color-heading-1);
	}

	.balance-symbol {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-description-2);
	}

	.balance-loading {
		font-size: var(--text-sm);
		color: var(--color-description-3);
	}

	.balance-error {
		font-size: var(--text-sm);
		color: var(--color-danger);
	}

	.balance-na {
		font-size: var(--text-sm);
		color: var(--color-description-3);
	}

	.contract-badge {
		padding: var(--space-0-5) var(--space-2);
		background: color-mix(in srgb, #8b5cf6 15%, transparent);
		border: 1px solid #8b5cf6;
		border-radius: var(--radius-sm);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		color: #8b5cf6;
	}

	.balance-value :global(.loading-icon) {
		width: 14px;
		height: 14px;
		color: var(--color-description-3);
	}

	.balance-value :global(.spin) {
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

	/* Meta Row */
	.meta-row {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		margin-bottom: var(--space-4);
	}

	.chain-badges,
	.label-badges {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.chain-badge {
		padding: var(--space-1) var(--space-2);
		background: color-mix(in srgb, #3b82f6 15%, transparent);
		border: 1px solid #3b82f6;
		border-radius: var(--radius-sm);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		color: #3b82f6;
	}

	.label-badge {
		padding: var(--space-1) var(--space-2);
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-sm);
		font-size: var(--text-xs);
		color: var(--color-description-2);
	}

	/* Description */
	.description {
		font-size: var(--text-base);
		color: var(--color-description-1);
		line-height: 1.6;
		margin: 0 0 var(--space-5);
	}

	/* External Links */
	.external-links {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
	}

	.external-link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-description-2);
		text-decoration: none;
		transition: all 0.2s;
	}

	.external-link:hover {
		background: var(--color-panel-3);
		border-color: var(--color-panel-border-3);
		color: var(--color-heading-1);
	}

	.external-link :global(.icon) {
		width: 14px;
		height: 14px;
	}

	/* Related Sections */
	.related-section {
		margin-top: var(--space-8);
	}

	.section-title {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--color-heading-1);
		margin: 0 0 var(--space-4);
	}

	.section-title :global(.section-icon) {
		width: 18px;
		height: 18px;
		color: var(--color-description-3);
	}

	.related-grid {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.related-card {
		padding: var(--space-2) var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-md);
		text-decoration: none;
		transition: all 0.2s;
	}

	.related-card:hover {
		background: var(--color-panel-2);
		border-color: var(--color-panel-border-3);
	}

	.related-name {
		font-weight: var(--font-medium);
		color: #3b82f6;
	}

	.related-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.related-address {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-3) var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-md);
		text-decoration: none;
		transition: all 0.2s;
	}

	.related-address:hover {
		background: var(--color-panel-2);
		border-color: var(--color-panel-border-3);
	}

	.related-addr-name {
		font-weight: var(--font-medium);
		color: var(--color-heading-2);
	}

	.related-addr-code {
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		color: var(--color-description-3);
	}

	/* FAQ Section */
	.faq-section {
		margin-top: var(--space-10);
	}

	.faq-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.faq-item {
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-lg);
		overflow: hidden;
	}

	.faq-question {
		padding: var(--space-4);
		font-weight: var(--font-medium);
		color: var(--color-heading-2);
		cursor: pointer;
		list-style: none;
	}

	.faq-question::-webkit-details-marker {
		display: none;
	}

	.faq-question::before {
		content: '▶';
		display: inline-block;
		margin-right: var(--space-2);
		font-size: var(--text-xs);
		transition: transform 0.2s;
	}

	.faq-item[open] .faq-question::before {
		transform: rotate(90deg);
	}

	.faq-answer {
		padding: 0 var(--space-4) var(--space-4);
		font-size: var(--text-sm);
		color: var(--color-description-2);
		line-height: 1.6;
		margin: 0;
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
		margin: 0;
	}

	/* Mobile */
	@media (max-width: 768px) {
		.address-detail-page {
			padding: var(--space-4);
		}

		.main-card {
			padding: var(--space-4);
		}

		.card-header {
			flex-direction: column;
		}

		.entity-info {
			flex-direction: column;
			align-items: flex-start;
			text-align: left;
		}

		.address-full {
			font-size: var(--text-xs);
		}

		.meta-row {
			flex-direction: column;
		}
	}
</style>
