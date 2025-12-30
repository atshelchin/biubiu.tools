<script lang="ts">
	import { useI18n } from '@shelchin/i18n';
	import {
		Hash,
		Coins,
		Globe,
		ExternalLink,
		TestTube,
		Server,
		TrendingUp,
		Layers,
		FileCode
	} from '@lucide/svelte';
	import type { Chain } from '../types';
	import { formatTvl } from '../data/chains';

	interface Props {
		chain: Chain;
		rpcCount: number;
	}

	let { chain, rpcCount }: Props = $props();

	const i18n = useI18n();

	// Determine network type color
	const networkTypeColor = $derived(chain.isTestnet ? '#eab308' : '#22c55e');
	const networkTypeLabel = $derived(
		chain.isTestnet ? i18n.t('routes/chains.testnet') : i18n.t('routes/chains.mainnet')
	);

	// Get chain icon URL (from icons stored in static folder)
	const chainIconUrl = $derived(chain.icon ? `/icons/${chain.icon}.svg` : null);

	// Format features
	const features = $derived(chain.features?.map((f) => f.name) || []);

	// Ensure URL has a protocol
	function ensureProtocol(url: string): string {
		if (url.startsWith('http://') || url.startsWith('https://')) {
			return url;
		}
		return `https://${url}`;
	}
</script>

<div class="chain-overview">
	<!-- Header -->
	<div class="chain-header">
		<div class="chain-identity">
			{#if chainIconUrl}
				<img
					src={chainIconUrl}
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
			<div class="chain-name-block">
				<h1 class="chain-name">{chain.name}</h1>
				<div class="chain-badges">
					<span class="network-badge" style="--badge-color: {networkTypeColor}">
						{#if chain.isTestnet}
							<TestTube class="badge-icon" />
						{:else}
							<Globe class="badge-icon" />
						{/if}
						{networkTypeLabel}
					</span>
					{#if chain.status === 'deprecated'}
						<span class="network-badge deprecated">
							{i18n.t('routes/chains.deprecated')}
						</span>
					{/if}
				</div>
			</div>
		</div>

		{#if chain.infoURL}
			<a
				href={ensureProtocol(chain.infoURL)}
				target="_blank"
				rel="noopener noreferrer"
				class="official-link"
			>
				<span>{i18n.t('routes/chains.official_website')}</span>
				<ExternalLink class="icon" />
			</a>
		{/if}
	</div>

	<!-- Stats Grid -->
	<div class="stats-grid">
		<!-- Chain ID -->
		<div class="stat-card">
			<div class="stat-icon">
				<Hash class="icon" />
			</div>
			<div class="stat-content">
				<span class="stat-label">{i18n.t('routes/chains.chain_id')}</span>
				<span class="stat-value">{chain.chainId}</span>
			</div>
		</div>

		<!-- Native Currency -->
		<div class="stat-card">
			<div class="stat-icon">
				<Coins class="icon" />
			</div>
			<div class="stat-content">
				<span class="stat-label">{i18n.t('routes/chains.native_currency')}</span>
				<span class="stat-value">{chain.nativeCurrency?.symbol || chain.chain}</span>
				<span class="stat-sub">{chain.nativeCurrency?.name}</span>
			</div>
		</div>

		<!-- RPC Count -->
		<div class="stat-card">
			<div class="stat-icon">
				<Server class="icon" />
			</div>
			<div class="stat-content">
				<span class="stat-label">{i18n.t('routes/chains.rpc_endpoints')}</span>
				<span class="stat-value">{rpcCount}</span>
				<span class="stat-sub">{i18n.t('routes/chains.available')}</span>
			</div>
		</div>

		<!-- TVL (if available) -->
		{#if chain.tvl && chain.tvl > 0 && !chain.isTestnet}
			<div class="stat-card tvl">
				<div class="stat-icon">
					<TrendingUp class="icon" />
				</div>
				<div class="stat-content">
					<span class="stat-label">TVL</span>
					<span class="stat-value">{formatTvl(chain.tvl)}</span>
					<span class="stat-sub source">
						<a href="https://defillama.com" target="_blank" rel="noopener noreferrer">DefiLlama</a>
					</span>
				</div>
			</div>
		{/if}
	</div>

	<!-- Features -->
	{#if features.length > 0}
		<div class="features-section">
			<h3 class="section-title">
				<FileCode class="icon" />
				{i18n.t('routes/chains.supported_features')}
			</h3>
			<div class="features-list">
				{#each features as feature (feature)}
					<span class="feature-tag">{feature}</span>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Additional Info -->
	{#if chain.shortName || chain.slip44 || chain.ens}
		<div class="additional-info">
			{#if chain.shortName}
				<div class="info-item">
					<span class="info-label">{i18n.t('routes/chains.short_name')}:</span>
					<code class="info-value">{chain.shortName}</code>
				</div>
			{/if}
			{#if chain.slip44}
				<div class="info-item">
					<span class="info-label">SLIP-44:</span>
					<code class="info-value">{chain.slip44}</code>
				</div>
			{/if}
			{#if chain.ens?.registry}
				<div class="info-item">
					<span class="info-label">{i18n.t('routes/chains.ens_registry')}:</span>
					<code class="info-value ens">{chain.ens.registry}</code>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.chain-overview {
		padding: var(--space-6);
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-xl);
	}

	:global(.light) .chain-overview {
		background: var(--color-panel-2);
	}

	/* Header */
	.chain-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--space-4);
		margin-bottom: var(--space-6);
	}

	.chain-identity {
		display: flex;
		align-items: center;
		gap: var(--space-4);
	}

	.chain-icon {
		width: 64px;
		height: 64px;
		border-radius: var(--radius-lg);
		object-fit: contain;
		background: var(--color-panel-2);
		padding: var(--space-2);
	}

	:global(.light) .chain-icon {
		background: var(--color-panel-1);
	}

	.chain-icon-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 64px;
		height: 64px;
		background: linear-gradient(135deg, var(--color-panel-2), var(--color-panel-3));
		border-radius: var(--radius-lg);
	}

	.chain-icon-placeholder :global(.icon) {
		width: 32px;
		height: 32px;
		color: var(--color-description-3);
	}

	.chain-name-block {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.chain-name {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--color-heading-1);
		margin: 0;
		line-height: 1.2;
	}

	.chain-badges {
		display: flex;
		gap: var(--space-2);
	}

	.network-badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1-5);
		padding: var(--space-1) var(--space-2-5);
		background: color-mix(in srgb, var(--badge-color) 15%, transparent);
		border-radius: var(--radius-md);
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		color: var(--badge-color);
	}

	.network-badge.deprecated {
		--badge-color: #ef4444;
	}

	.network-badge :global(.badge-icon) {
		width: 12px;
		height: 12px;
	}

	.official-link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1-5);
		padding: var(--space-2) var(--space-4);
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-heading-2);
		text-decoration: none;
		transition: all 0.2s ease;
	}

	:global(.light) .official-link {
		background: var(--color-panel-1);
	}

	.official-link:hover {
		background: var(--color-panel-3);
		border-color: var(--color-panel-border-3);
		color: var(--color-heading-1);
	}

	.official-link :global(.icon) {
		width: 14px;
		height: 14px;
	}

	/* Stats Grid */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: var(--space-4);
	}

	.stat-card {
		display: flex;
		align-items: flex-start;
		gap: var(--space-3);
		padding: var(--space-4);
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-lg);
	}

	:global(.light) .stat-card {
		background: var(--color-panel-1);
	}

	.stat-card.tvl {
		border-color: color-mix(in srgb, #22c55e 30%, var(--color-panel-border-1));
	}

	.stat-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		background: var(--color-panel-3);
		border-radius: var(--radius-md);
		flex-shrink: 0;
	}

	.stat-icon :global(.icon) {
		width: 20px;
		height: 20px;
		color: var(--color-description-2);
	}

	.stat-card.tvl .stat-icon {
		background: color-mix(in srgb, #22c55e 15%, transparent);
	}

	.stat-card.tvl .stat-icon :global(.icon) {
		color: #22c55e;
	}

	.stat-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-0-5);
	}

	.stat-label {
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		color: var(--color-description-3);
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	.stat-value {
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		color: var(--color-heading-1);
	}

	.stat-sub {
		font-size: var(--text-xs);
		color: var(--color-description-3);
	}

	.stat-sub.source a {
		color: var(--color-description-3);
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.stat-sub.source a:hover {
		color: var(--color-heading-2);
	}

	/* Features Section */
	.features-section {
		margin-top: var(--space-6);
		padding-top: var(--space-6);
		border-top: 1px solid var(--color-panel-border-1);
	}

	.section-title {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--color-heading-2);
		margin: 0 0 var(--space-3) 0;
	}

	.section-title :global(.icon) {
		width: 16px;
		height: 16px;
		color: var(--color-description-3);
	}

	.features-list {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.feature-tag {
		padding: var(--space-1) var(--space-3);
		background: color-mix(in srgb, #3b82f6 12%, transparent);
		border-radius: var(--radius-md);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		color: #3b82f6;
		font-family: var(--font-mono);
	}

	/* Additional Info */
	.additional-info {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-4);
		margin-top: var(--space-5);
		padding-top: var(--space-5);
		border-top: 1px solid var(--color-panel-border-1);
	}

	.info-item {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.info-label {
		font-size: var(--text-xs);
		color: var(--color-description-3);
	}

	.info-value {
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		color: var(--color-heading-2);
		background: var(--color-panel-2);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-sm);
	}

	:global(.light) .info-value {
		background: var(--color-panel-1);
	}

	.info-value.ens {
		max-width: 180px;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* Mobile */
	@media (max-width: 768px) {
		.chain-overview {
			padding: var(--space-4);
		}

		.chain-header {
			flex-direction: column;
			gap: var(--space-4);
		}

		.chain-icon,
		.chain-icon-placeholder {
			width: 48px;
			height: 48px;
		}

		.chain-icon-placeholder :global(.icon) {
			width: 24px;
			height: 24px;
		}

		.chain-name {
			font-size: var(--text-xl);
		}

		.official-link {
			width: 100%;
			justify-content: center;
		}

		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: var(--space-3);
		}

		.stat-card {
			padding: var(--space-3);
		}

		.stat-icon {
			width: 36px;
			height: 36px;
		}

		.stat-icon :global(.icon) {
			width: 18px;
			height: 18px;
		}

		.stat-value {
			font-size: var(--text-base);
		}

		.additional-info {
			flex-direction: column;
			gap: var(--space-2);
		}
	}
</style>
