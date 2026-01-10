<script lang="ts">
	import { Check, X, Zap, Crown, AlertTriangle, Github, Server, Loader2 } from '@lucide/svelte';
	import { useI18n } from '@shelchin/i18n';
	import { localizeHref } from '$lib/utils/localized-url';
	import { onMount } from 'svelte';
	import { createPublicClient, http, formatEther } from 'viem';
	import { readPricingFromContract, type FormattedPricing } from '@shelchin/paywall';

	const i18n = useI18n();
	// Use a wrapper that accepts any string key for dynamic translations
	const t = (key: string, options?: Record<string, string | number | Date>) =>
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		i18n.t(key as any, options);

	// BiuBiuPremium contract address (same on all chains via CREATE2)
	const PREMIUM_CONTRACT_ADDRESS = '0x61Ae52Bb677847853DB30091ccc32d9b68878B71' as const;

	// Minimal ABI for price reading
	const PRICE_ABI = [
		{
			type: 'function',
			name: 'DAILY_PRICE',
			inputs: [],
			outputs: [{ type: 'uint256' }],
			stateMutability: 'view'
		},
		{
			type: 'function',
			name: 'MONTHLY_PRICE',
			inputs: [],
			outputs: [{ type: 'uint256' }],
			stateMutability: 'view'
		},
		{
			type: 'function',
			name: 'YEARLY_PRICE',
			inputs: [],
			outputs: [{ type: 'uint256' }],
			stateMutability: 'view'
		},
		{
			type: 'function',
			name: 'NON_MEMBER_FEE',
			inputs: [],
			outputs: [{ type: 'uint256' }],
			stateMutability: 'view'
		}
	] as const;

	// Supported networks for pricing
	interface PricingNetwork {
		chainId: number;
		name: string;
		symbol: string;
		rpcUrl: string;
	}

	const PRICING_NETWORKS: PricingNetwork[] = [
		{ chainId: 11155111, name: 'Sepolia', symbol: 'ETH', rpcUrl: 'https://rpc.sepolia.org' },
		{ chainId: 1, name: 'Ethereum', symbol: 'ETH', rpcUrl: 'https://eth.llamarpc.com' },
		{ chainId: 137, name: 'Polygon', symbol: 'MATIC', rpcUrl: 'https://polygon-rpc.com' },
		{ chainId: 56, name: 'BNB Chain', symbol: 'BNB', rpcUrl: 'https://bsc-dataseed1.binance.org' },
		{ chainId: 42161, name: 'Arbitrum', symbol: 'ETH', rpcUrl: 'https://arb1.arbitrum.io/rpc' },
		{ chainId: 10, name: 'Optimism', symbol: 'ETH', rpcUrl: 'https://mainnet.optimism.io' }
	];

	// Membership billing cycle
	type BillingCycle = 'daily' | 'monthly' | 'yearly';
	let selectedCycle: BillingCycle = $state('monthly');
	let selectedNetwork = $state<PricingNetwork>(PRICING_NETWORKS[0]);

	// Dynamic pricing state
	let isLoadingPrices = $state(false);
	let pricingError = $state<string | null>(null);
	let dynamicPricing = $state<FormattedPricing | null>(null);

	// Compute pricing with save percentages
	const membershipPricing = $derived(() => {
		if (!dynamicPricing) {
			return {
				daily: { price: '--', unitKey: 'per_day', savePercent: 0 },
				monthly: { price: '--', unitKey: 'per_month', savePercent: 0 },
				yearly: { price: '--', unitKey: 'per_year', savePercent: 0 }
			};
		}

		const dailyPrice = parseFloat(dynamicPricing.daily);
		const monthlyPrice = parseFloat(dynamicPricing.monthly);
		const yearlyPrice = parseFloat(dynamicPricing.yearly);

		// Calculate savings compared to daily rate
		const monthlySave =
			dailyPrice > 0 ? Math.round((1 - monthlyPrice / (dailyPrice * 30)) * 100) : 0;
		const yearlySave =
			dailyPrice > 0 ? Math.round((1 - yearlyPrice / (dailyPrice * 365)) * 100) : 0;

		return {
			daily: { price: dynamicPricing.daily, unitKey: 'per_day', savePercent: 0 },
			monthly: {
				price: dynamicPricing.monthly,
				unitKey: 'per_month',
				savePercent: monthlySave > 0 ? monthlySave : 0
			},
			yearly: {
				price: dynamicPricing.yearly,
				unitKey: 'per_year',
				savePercent: yearlySave > 0 ? yearlySave : 0
			}
		};
	});

	const payPerUseFee = $derived(dynamicPricing?.perUse ?? '--');

	// Load prices from chain
	async function loadPrices(network: PricingNetwork) {
		isLoadingPrices = true;
		pricingError = null;

		try {
			const publicClient = createPublicClient({
				chain: {
					id: network.chainId,
					name: network.name,
					nativeCurrency: { name: network.symbol, symbol: network.symbol, decimals: 18 },
					rpcUrls: { default: { http: [network.rpcUrl] } }
				},
				transport: http(network.rpcUrl)
			});

			const pricing = await readPricingFromContract(
				publicClient,
				PREMIUM_CONTRACT_ADDRESS,
				PRICE_ABI
			);

			dynamicPricing = {
				daily: formatEther(pricing.dailyPrice),
				monthly: formatEther(pricing.monthlyPrice),
				yearly: formatEther(pricing.yearlyPrice),
				perUse: formatEther(pricing.nonMemberFee)
			};
		} catch (err) {
			console.error('Failed to load pricing:', err);
			pricingError = err instanceof Error ? err.message : 'Failed to load pricing';
		} finally {
			isLoadingPrices = false;
		}
	}

	// Handle network change
	function handleNetworkChange(network: PricingNetwork) {
		selectedNetwork = network;
		loadPrices(network);
	}

	// Load prices on mount
	onMount(() => {
		loadPrices(selectedNetwork);
	});

	// Available tool paths for random navigation
	const toolPaths = [
		'/apps/token-deployer',
		'/apps/wallet-generator',
		'/apps/one-to-many-transfer',
		'/apps/nft-deployer',
		'/apps/contract-deployer',
		'/apps/wallet-sweep'
	];

	// Get a random tool path
	const randomToolPath = toolPaths[Math.floor(Math.random() * toolPaths.length)];
</script>

<!-- Pricing section -->
<section id="pricing" class="pricing-section">
	<div class="container">
		<!-- Section header -->
		<div class="section-header">
			<h2 class="section-title">
				{t('common.pricing.title')}
			</h2>
			<p class="section-subtitle">
				{t('common.pricing.subtitle')}
			</p>
		</div>

		<!-- Network selector -->
		<div class="network-selector">
			<span class="network-label">{t('common.pricing.select_network')}</span>
			<div class="network-tabs">
				{#each PRICING_NETWORKS as network (network.chainId)}
					<button
						class="network-tab {selectedNetwork.chainId === network.chainId ? 'active' : ''}"
						onclick={() => handleNetworkChange(network)}
						disabled={isLoadingPrices}
					>
						{network.name}
					</button>
				{/each}
			</div>
			{#if isLoadingPrices}
				<div class="loading-indicator">
					<Loader2 size={16} class="spinner" />
					<span>{t('common.pricing.loading')}</span>
				</div>
			{/if}
			{#if pricingError}
				<div class="pricing-error">
					<AlertTriangle size={14} />
					<span>{pricingError}</span>
				</div>
			{/if}
		</div>

		<!-- Pricing grid - 3 cards in a row -->
		<div class="pricing-grid">
			<!-- Self Host Card -->
			<article class="pricing-card self-host">
				<div class="card-header">
					<div class="card-icon self-host-icon">
						<Server size={24} />
					</div>
					<h3 class="card-title">{t('common.pricing.self_host.title')}</h3>
					<p class="card-description">{t('common.pricing.self_host.description')}</p>
				</div>

				<!-- Spacer to align with membership billing tabs -->
				<div class="billing-tabs-spacer"></div>

				<div class="price-display">
					<span class="price-value">{t('common.pricing.self_host.price')}</span>
					<span class="price-unit">&nbsp;</span>
				</div>

				<div class="divider"></div>

				<ul class="features-list">
					<li class="feature-item included">
						<Check size={18} class="feature-icon" />
						<span>{t('common.pricing.self_host.features.full_source')}</span>
					</li>
					<li class="feature-item included">
						<Check size={18} class="feature-icon" />
						<span>{t('common.pricing.self_host.features.no_fees')}</span>
					</li>
					<li class="feature-item included">
						<Check size={18} class="feature-icon" />
						<span>{t('common.pricing.self_host.features.full_control')}</span>
					</li>
					<li class="feature-item included">
						<Check size={18} class="feature-icon" />
						<span>{t('common.pricing.self_host.features.community_support')}</span>
					</li>
				</ul>

				<div class="self-host-note">
					<Server size={16} />
					<span>{t('common.pricing.self_host.note')}</span>
				</div>

				<div class="security-warning">
					<AlertTriangle size={16} />
					<span>{t('common.pricing.self_host.security_warning')}</span>
				</div>

				<a
					href="https://github.com/atshelchin/biubiu.tools"
					target="_blank"
					rel="noopener noreferrer"
					class="cta-button tertiary"
				>
					<Github size={18} />
					{t('common.pricing.self_host.cta')}
				</a>
			</article>

			<!-- Pay per Use Card -->
			<article class="pricing-card pay-per-use">
				<div class="card-header">
					<div class="card-icon pay-per-use-icon">
						<Zap size={24} />
					</div>
					<h3 class="card-title">{t('common.pricing.pay_per_use.title')}</h3>
					<p class="card-description">{t('common.pricing.pay_per_use.description')}</p>
				</div>

				<!-- Spacer to align with membership billing tabs -->
				<div class="billing-tabs-spacer"></div>

				<div class="price-display">
					<span class="price-value">{payPerUseFee}</span>
					<span class="price-unit"
						>{selectedNetwork.symbol} {t('common.pricing.pay_per_use.unit')}</span
					>
				</div>

				<div class="divider"></div>

				<ul class="features-list">
					<li class="feature-item included">
						<Check size={18} class="feature-icon" />
						<span>{t('common.pricing.pay_per_use.features.no_subscription')}</span>
					</li>
					<li class="feature-item included">
						<Check size={18} class="feature-icon" />
						<span>{t('common.pricing.pay_per_use.features.pay_as_you_go')}</span>
					</li>
					<li class="feature-item included">
						<Check size={18} class="feature-icon" />
						<span>{t('common.pricing.pay_per_use.features.onchain_tools')}</span>
					</li>
					<li class="feature-item excluded">
						<X size={18} class="feature-icon" />
						<span>{t('common.pricing.pay_per_use.features.no_query_tools')}</span>
					</li>
				</ul>

				<div class="tool-examples">
					<p class="examples-label">{t('common.pricing.pay_per_use.examples_label')}</p>
					<p class="examples-text">{t('common.pricing.pay_per_use.examples')}</p>
				</div>

				<a href={localizeHref(randomToolPath)} class="cta-button secondary">
					{t('common.pricing.pay_per_use.cta')}
				</a>
			</article>

			<!-- Membership Card -->
			<article class="pricing-card membership featured">
				<div class="popular-badge">
					<Crown size={14} />
					<span>{t('common.pricing.membership.badge')}</span>
				</div>

				<div class="card-header">
					<div class="card-icon membership-icon">
						<Crown size={24} />
					</div>
					<h3 class="card-title">{t('common.pricing.membership.title')}</h3>
					<p class="card-description">{t('common.pricing.membership.description')}</p>
				</div>

				<!-- Billing cycle tabs -->
				<div class="billing-tabs">
					<button
						class="tab-button {selectedCycle === 'daily' ? 'active' : ''}"
						onclick={() => (selectedCycle = 'daily')}
					>
						{t('common.pricing.membership.daily')}
					</button>
					<button
						class="tab-button {selectedCycle === 'monthly' ? 'active' : ''}"
						onclick={() => (selectedCycle = 'monthly')}
					>
						{t('common.pricing.membership.monthly')}
					</button>
					<button
						class="tab-button {selectedCycle === 'yearly' ? 'active' : ''}"
						onclick={() => (selectedCycle = 'yearly')}
					>
						{t('common.pricing.membership.yearly')}
					</button>
				</div>

				<div class="price-display">
					<span class="price-value">{membershipPricing()[selectedCycle].price}</span>
					<span class="price-unit"
						>{selectedNetwork.symbol}/{t(
							`common.pricing.membership.${membershipPricing()[selectedCycle].unitKey}`
						)}</span
					>
					{#if membershipPricing()[selectedCycle].savePercent > 0}
						<span class="save-badge">
							{t('common.pricing.membership.save', {
								percent: membershipPricing()[selectedCycle].savePercent
							})}
						</span>
					{/if}
				</div>

				<div class="divider"></div>

				<ul class="features-list">
					<li class="feature-item included">
						<Check size={18} class="feature-icon" />
						<span>{t('common.pricing.membership.features.all_onchain')}</span>
					</li>
					<li class="feature-item included">
						<Check size={18} class="feature-icon" />
						<span>{t('common.pricing.membership.features.all_query')}</span>
					</li>
					<li class="feature-item included">
						<Check size={18} class="feature-icon" />
						<span>{t('common.pricing.membership.features.unlimited')}</span>
					</li>
					<li class="feature-item included">
						<Check size={18} class="feature-icon" />
						<span>{t('common.pricing.membership.features.priority_support')}</span>
					</li>
				</ul>

				<div class="chain-notice">
					<AlertTriangle size={16} />
					<span>{t('common.pricing.membership.chain_notice')}</span>
				</div>

				<a href={localizeHref(randomToolPath)} class="cta-button primary">
					{t('common.pricing.membership.cta')}
				</a>
				<!-- <p class="purchase-hint">{t('common.pricing.membership.purchase_hint')}</p> -->
			</article>
		</div>

		<!-- Tips section -->
		<div class="tips-section">
			<p class="tip-item">{t('common.pricing.tips.heavy_user')}</p>
			<p class="tip-item">{t('common.pricing.tips.query_tools')}</p>
			<p class="tip-item">{t('common.pricing.tips.multi_chain')}</p>
		</div>
	</div>
</section>

<style>
	.pricing-section {
		position: relative;
		padding: var(--space-20) var(--space-4);
		background: var(--color-background);
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
	}

	/* Section header */
	.section-header {
		text-align: center;
		margin-bottom: var(--space-12);
	}

	.section-title {
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		margin-bottom: var(--space-4);
		background: linear-gradient(to right, var(--color-foreground), var(--color-muted-foreground));
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.section-subtitle {
		font-size: var(--text-lg);
		color: var(--color-muted-foreground);
		max-width: 36rem;
		margin: 0 auto;
	}

	/* Network selector */
	.network-selector {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-3);
		margin-bottom: var(--space-8);
	}

	.network-label {
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
		font-weight: var(--font-medium);
	}

	.network-tabs {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: var(--space-2);
		padding: var(--space-1);
		background: var(--color-panel-2);
		border-radius: var(--radius-lg);
	}

	.network-tab {
		padding: var(--space-2) var(--space-3);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-muted-foreground);
		background: transparent;
		border: none;
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all 150ms ease;
	}

	.network-tab:hover:not(:disabled) {
		color: var(--color-foreground);
	}

	.network-tab.active {
		background: var(--color-background);
		color: var(--color-primary);
		box-shadow: var(--shadow-sm);
	}

	.network-tab:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.loading-indicator {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
	}

	.loading-indicator :global(.spinner) {
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

	.pricing-error {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-xs);
		color: hsl(0, 70%, 50%);
	}

	/* Pricing grid - 3 cards in a row */
	.pricing-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-6);
		margin-bottom: var(--space-10);
	}

	@media (min-width: 768px) {
		.pricing-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: var(--space-6);
		}
	}

	@media (min-width: 1024px) {
		.pricing-grid {
			grid-template-columns: repeat(3, 1fr);
			gap: var(--space-6);
		}
	}

	/* Pricing card */
	.pricing-card {
		position: relative;
		display: flex;
		flex-direction: column;
		padding: var(--space-6);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-xl);
		transition: all 200ms ease;
	}

	.pricing-card:hover {
		transform: translateY(-4px);
		box-shadow: var(--shadow-lg);
	}

	.pricing-card.featured {
		border-color: var(--color-primary);
		background: linear-gradient(
			135deg,
			var(--color-panel-1) 0%,
			hsla(var(--brand-hue), var(--brand-saturation), 50%, 0.05) 100%
		);
	}

	/* Popular badge */
	.popular-badge {
		position: absolute;
		top: -0.75rem;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-1) var(--space-3);
		background: var(--color-primary);
		color: white;
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		border-radius: var(--radius-full);
		white-space: nowrap;
	}

	/* Card header */
	.card-header {
		text-align: center;
		margin-bottom: var(--space-6);
	}

	.card-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 3rem;
		height: 3rem;
		border-radius: var(--radius-lg);
		margin-bottom: var(--space-3);
	}

	.pay-per-use-icon {
		background: hsla(45, 90%, 50%, 0.15);
		color: hsl(45, 90%, 45%);
	}

	.membership-icon {
		background: hsla(var(--brand-hue), var(--brand-saturation), 50%, 0.15);
		color: var(--color-primary);
	}

	.self-host-icon {
		background: hsla(200, 80%, 50%, 0.15);
		color: hsl(200, 80%, 45%);
	}

	.card-title {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		margin-bottom: var(--space-2);
		color: var(--color-foreground);
	}

	.card-description {
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
	}

	/* Billing tabs */
	.billing-tabs {
		display: flex;
		gap: var(--space-2);
		padding: var(--space-1);
		background: var(--color-panel-2);
		border-radius: var(--radius-lg);
		margin-bottom: var(--space-4);
	}

	/* Spacer to match billing tabs height for alignment */
	.billing-tabs-spacer {
		height: calc(var(--space-2) * 2 + var(--space-1) * 2 + 1.25rem);
		margin-bottom: var(--space-4);
	}

	.tab-button {
		flex: 1;
		padding: var(--space-2) var(--space-3);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-muted-foreground);
		background: transparent;
		border: none;
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all 150ms ease;
	}

	.tab-button:hover {
		color: var(--color-foreground);
	}

	.tab-button.active {
		background: var(--color-background);
		color: var(--color-primary);
		box-shadow: var(--shadow-sm);
	}

	/* Price display */
	.price-display {
		display: flex;
		align-items: baseline;
		justify-content: center;
		gap: var(--space-2);
		margin-bottom: var(--space-2);
		flex-wrap: wrap;
		min-height: 3.5rem;
	}

	.price-value {
		font-size: var(--text-4xl);
		font-weight: var(--font-bold);
		color: var(--color-foreground);
	}

	.featured .price-value {
		background: linear-gradient(135deg, var(--color-primary), var(--brand-600));
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.price-unit {
		font-size: var(--text-lg);
		color: var(--color-muted-foreground);
	}

	.save-badge {
		padding: var(--space-1) var(--space-2);
		background: hsla(142, 76%, 36%, 0.15);
		color: hsl(142, 76%, 36%);
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		border-radius: var(--radius-full);
	}

	/* Divider */
	.divider {
		height: 1px;
		background: var(--color-border);
		margin: var(--space-4) 0;
	}

	/* Features list */
	.features-list {
		list-style: none;
		padding: 0;
		margin: 0 0 var(--space-6) 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.feature-item {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		font-size: var(--text-sm);
	}

	.feature-item.included {
		color: var(--color-foreground);
	}

	.feature-item.included :global(.feature-icon) {
		color: hsl(142, 76%, 36%);
	}

	.feature-item.excluded {
		color: var(--color-muted-foreground);
	}

	.feature-item.excluded :global(.feature-icon) {
		color: var(--color-muted-foreground);
	}

	/* Tool examples */
	.tool-examples {
		padding: var(--space-3);
		background: var(--color-panel-2);
		border-radius: var(--radius-md);
		margin-bottom: var(--space-6);
	}

	.examples-label {
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		color: var(--color-muted-foreground);
		margin-bottom: var(--space-1);
	}

	.examples-text {
		font-size: var(--text-sm);
		color: var(--color-foreground);
	}

	/* Chain notice */
	.chain-notice {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3);
		background: hsla(45, 90%, 50%, 0.1);
		border-radius: var(--radius-md);
		margin-bottom: var(--space-6);
		font-size: var(--text-xs);
		color: hsl(45, 90%, 35%);
	}

	/* Self host note */
	.self-host-note {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3);
		background: hsla(200, 80%, 50%, 0.1);
		border-radius: var(--radius-md);
		margin-bottom: var(--space-3);
		font-size: var(--text-xs);
		color: hsl(200, 80%, 35%);
	}

	/* Security warning */
	.security-warning {
		display: flex;
		align-items: flex-start;
		gap: var(--space-2);
		padding: var(--space-3);
		background: hsla(0, 80%, 50%, 0.1);
		border: 1px solid hsla(0, 80%, 50%, 0.2);
		border-radius: var(--radius-md);
		margin-bottom: var(--space-6);
		font-size: var(--text-xs);
		color: hsl(0, 70%, 45%);
		line-height: 1.4;
	}

	.security-warning :global(svg) {
		flex-shrink: 0;
		margin-top: 0.1rem;
	}

	/* CTA button */
	.cta-button {
		display: block;
		width: 100%;
		padding: var(--space-3) var(--space-6);
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		border-radius: var(--radius-lg);
		cursor: pointer;
		transition: all 200ms ease;
		margin-top: auto;
		text-align: center;
		text-decoration: none;
	}

	.cta-button.primary {
		background: var(--color-primary);
		color: white;
		border: none;
	}

	.cta-button.primary:hover {
		background: var(--brand-600);
		transform: translateY(-1px);
		box-shadow: var(--shadow-md);
	}

	.cta-button.secondary {
		background: transparent;
		color: var(--color-foreground);
		border: 2px solid var(--color-border);
	}

	.cta-button.secondary:hover {
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	.cta-button.tertiary {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		background: transparent;
		color: hsl(200, 80%, 45%);
		border: 2px solid hsl(200, 80%, 45%);
	}

	.cta-button.tertiary:hover {
		background: hsla(200, 80%, 50%, 0.1);
		border-color: hsl(200, 80%, 35%);
		color: hsl(200, 80%, 35%);
	}

	/* Purchase hint */
	.purchase-hint {
		margin-top: var(--space-3);
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		text-align: center;
	}

	/* Tips section */
	.tips-section {
		text-align: center;
		padding: var(--space-6);
		background: var(--color-panel-1);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
	}

	.tip-item {
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
		margin-bottom: var(--space-2);
	}

	.tip-item:last-child {
		margin-bottom: 0;
	}

	/* Responsive */
	@media (min-width: 768px) {
		.pricing-section {
			padding: var(--space-24) var(--space-6);
		}

		.section-title {
			font-size: var(--text-4xl);
		}

		.pricing-card {
			padding: var(--space-8);
		}
	}
</style>
