<script lang="ts">
	import { useI18n } from '@shelchin/i18n';
	import { ArrowLeft, Tag } from '@lucide/svelte';
	import SeoHead from '$lib/components/seo-head.svelte';
	import type { PageData } from './$types';
	import { CHAIN_META, LABEL_META } from '@/features/address/types';
	import { getEntity } from '@/features/address/data';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();

	// Get label info
	const labelMeta = LABEL_META[data.label];
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

<div class="label-page">
	<!-- Breadcrumb -->
	<nav class="breadcrumb">
		<a href="/address" class="back-link">
			<ArrowLeft class="icon" />
			<span>{i18n.t('address.all_addresses')}</span>
		</a>
	</nav>

	<!-- Header -->
	<header class="page-header">
		<div class="label-badge" style="--label-color: var(--color-{labelMeta.color}-500, #6b7280)">
			<Tag class="label-icon" />
			<span>{i18n.t(`address.labels.${data.label}`)}</span>
		</div>
		<h1 class="page-title">{i18n.t(`address.labels.${data.label}`)} Addresses</h1>
		<p class="page-subtitle">{data.addresses.length} addresses found</p>
	</header>

	<!-- Address List -->
	<div class="address-list">
		{#each data.addresses as addr (`${addr.chainId}-${addr.address}`)}
			{@const entity = addr.entityId ? getEntity(addr.entityId) : undefined}
			<a href="/address/{addr.chainId}/{addr.address}" class="address-card">
				<div class="address-info">
					<span class="address-name">{addr.name}</span>
					<span class="address-entity">{entity?.name || ''}</span>
				</div>
				<div class="address-meta">
					<div class="chain-badges">
						<span class="chain-badge">{CHAIN_META[addr.chainId]?.name || addr.chainId}</span>
					</div>
					<code class="address-code">{addr.address.slice(0, 10)}...{addr.address.slice(-6)}</code>
				</div>
			</a>
		{/each}
	</div>

	{#if data.addresses.length === 0}
		<div class="empty-state">
			<p>No addresses found with this label.</p>
		</div>
	{/if}
</div>

<style>
	.label-page {
		max-width: 900px;
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

	/* Header */
	.page-header {
		margin-bottom: var(--space-8);
	}

	.label-badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		background: color-mix(in srgb, var(--label-color) 15%, transparent);
		border: 1px solid var(--label-color);
		border-radius: var(--radius-full);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--label-color);
		margin-bottom: var(--space-4);
	}

	.label-badge :global(.label-icon) {
		width: 14px;
		height: 14px;
	}

	.page-title {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--color-heading-1);
		margin: 0 0 var(--space-2);
	}

	.page-subtitle {
		font-size: var(--text-base);
		color: var(--color-description-2);
		margin: 0;
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
		gap: var(--space-2);
	}

	.chain-badges {
		display: flex;
		gap: var(--space-1);
	}

	.chain-badge {
		padding: var(--space-0-5) var(--space-2);
		background: var(--color-panel-2);
		border-radius: var(--radius-sm);
		font-size: var(--text-xs);
		color: var(--color-description-2);
	}

	.address-code {
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		color: var(--color-description-3);
	}

	/* Empty State */
	.empty-state {
		padding: var(--space-10);
		text-align: center;
		color: var(--color-description-3);
	}

	/* Mobile */
	@media (max-width: 768px) {
		.label-page {
			padding: var(--space-4);
		}

		.address-card {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--space-3);
		}

		.address-meta {
			align-items: flex-start;
		}
	}
</style>
