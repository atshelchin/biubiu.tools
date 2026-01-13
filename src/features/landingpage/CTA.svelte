<script lang="ts">
	import { onMount } from 'svelte';
	import { useI18n } from '@shelchin/i18n';
	import { ArrowRight, Github, ShieldCheck, Users, Zap, Globe, Code2 } from '@lucide/svelte';
	import { trackCTAClick, trackToolClick, addUTMToUrl, SECTIONS } from '$lib/analytics';
	import { localizeHref } from '$lib/utils/localized-url';

	const i18n = useI18n();
	const t = i18n.t.bind(i18n);

	// CTA variant type
	type CTAVariant = 'default' | 'data_analyst' | 'developer' | 'airdrop_hunter';

	// Headline structure
	interface Headline {
		title: string;
		subtitle: string;
	}

	// Props for A/B variant
	interface Props {
		variant?: CTAVariant;
	}

	let { variant = 'default' }: Props = $props();

	// Random headline index (selected on mount for default variant)
	let headlineIndex = $state(0);

	// Get headlines array for random rotation
	const headlines = $derived.by(() => {
		const items = t('common.cta.headlines') as unknown as Headline[];
		return Array.isArray(items) ? items : [];
	});

	// Select random headline on mount
	onMount(() => {
		if (headlines.length > 0) {
			headlineIndex = Math.floor(Math.random() * headlines.length);
		}
	});

	// Get content based on variant (use random headline for default)
	const title = $derived.by(() => {
		if (variant !== 'default') {
			return t(`common.cta.variants.${variant}.title` as Parameters<typeof t>[0]);
		}
		// Use random headline for default variant
		return headlines[headlineIndex]?.title ?? t('common.cta.title');
	});

	const subtitle = $derived.by(() => {
		if (variant !== 'default') {
			return t(`common.cta.variants.${variant}.subtitle` as Parameters<typeof t>[0]);
		}
		// Use random headline for default variant
		return headlines[headlineIndex]?.subtitle ?? t('common.cta.subtitle');
	});

	const buttonText = $derived(
		variant === 'default'
			? t('common.cta.button_text')
			: t(`common.cta.variants.${variant}.button_text` as Parameters<typeof t>[0])
	);

	// Link based on variant
	const primaryLink = $derived.by(() => {
		switch (variant) {
			case 'data_analyst':
				return '/apps/token-balance-scanner';
			case 'developer':
				return '/apps/contract-deployer';
			case 'airdrop_hunter':
				return '/apps/wallet-sweep';
			default:
				return '#tools';
		}
	});

	function handlePrimaryClick(e: MouseEvent) {
		// Track the CTA click
		trackCTAClick(variant, 'primary', SECTIONS.CTA);

		if (variant === 'default') {
			e.preventDefault();
			const toolsSection = document.getElementById('tools');
			if (toolsSection) {
				toolsSection.scrollIntoView({ behavior: 'smooth' });
			}
		} else {
			// For variant-specific links, add UTM and track tool click
			e.preventDefault();
			const toolId = primaryLink.replace('/apps/', '');
			trackToolClick(toolId, SECTIONS.CTA, i18n.locale);

			const urlWithUtm = addUTMToUrl(primaryLink, {
				source: 'landing',
				medium: 'cta',
				campaign: variant,
				content: toolId,
				term: i18n.locale
			});
			window.location.href = localizeHref(urlWithUtm);
		}
	}

	function handleSecondaryClick() {
		// Track secondary CTA (GitHub link)
		trackCTAClick(variant, 'secondary', SECTIONS.CTA);
	}

	// Trust badges config
	const trustBadges = [
		{ icon: Users, key: 'users' },
		{ icon: Zap, key: 'transactions' },
		{ icon: Globe, key: 'chains' },
		{ icon: Code2, key: 'open_source' }
	] as const;
</script>

<!-- CTA section with premium design -->
<section id="cta" class="cta-section" aria-labelledby="cta-title">
	<!-- Animated background elements -->
	<div class="bg-pattern"></div>
	<div class="bg-glow bg-glow-1"></div>
	<div class="bg-glow bg-glow-2"></div>

	<div class="container">
		<!-- Badge -->
		<div class="badge">
			<ShieldCheck class="badge-icon" />
			<span>{t('common.cta.badge')}</span>
		</div>

		<!-- Main title with gradient -->
		<h2 id="cta-title" class="cta-title">
			{title}
		</h2>

		<!-- Subtitle -->
		<p class="cta-subtitle">
			{subtitle}
		</p>

		<!-- Trust badges -->
		<div class="trust-badges">
			{#each trustBadges as badge (badge.key)}
				{@const IconComponent = badge.icon}
				<div class="trust-badge">
					<IconComponent class="trust-icon" />
					<span>{t(`common.cta.trust.${badge.key}`)}</span>
				</div>
			{/each}
		</div>

		<!-- Action buttons -->
		<div class="button-group">
			<a href={primaryLink} class="btn-primary" onclick={handlePrimaryClick}>
				<span>{buttonText}</span>
				<ArrowRight class="btn-icon" />
			</a>
			<a
				href="https://github.com/AilentDE/biubiu.tools"
				target="_blank"
				rel="noopener noreferrer"
				class="btn-secondary"
				onclick={handleSecondaryClick}
			>
				<Github class="btn-icon-left" />
				<span>{t('common.cta.secondary_button')}</span>
			</a>
		</div>
	</div>
</section>

<style>
	/* Section layout */
	.cta-section {
		position: relative;
		padding: var(--space-24) var(--space-6);
		background: linear-gradient(
			180deg,
			var(--color-background) 0%,
			var(--color-panel-1) 50%,
			var(--color-background) 100%
		);
		overflow: hidden;
	}

	/* Background pattern */
	.bg-pattern {
		position: absolute;
		inset: 0;
		background-image: radial-gradient(
			circle at 1px 1px,
			var(--color-panel-border-1) 1px,
			transparent 0
		);
		background-size: 40px 40px;
		opacity: 0.5;
		mask-image: radial-gradient(ellipse 80% 50% at 50% 50%, black 20%, transparent 70%);
	}

	/* Animated glow orbs */
	.bg-glow {
		position: absolute;
		border-radius: 50%;
		filter: blur(80px);
		pointer-events: none;
	}

	.bg-glow-1 {
		width: 400px;
		height: 400px;
		top: -100px;
		left: 20%;
		background: var(--brand-500);
		opacity: 0.08;
		animation: float 10s ease-in-out infinite;
	}

	.bg-glow-2 {
		width: 350px;
		height: 350px;
		bottom: -50px;
		right: 15%;
		background: var(--brand-400);
		opacity: 0.06;
		animation: float 12s ease-in-out infinite reverse;
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0) scale(1);
		}
		50% {
			transform: translateY(-30px) scale(1.05);
		}
	}

	.container {
		position: relative;
		max-width: 48rem;
		margin: 0 auto;
		text-align: center;
		z-index: 1;
	}

	/* Badge */
	.badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		margin-bottom: var(--space-6);
		border-radius: var(--radius-full);
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-1);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-muted-foreground);
	}

	:global(.badge-icon) {
		width: 1rem;
		height: 1rem;
		color: var(--color-primary);
	}

	/* Title with premium gradient */
	.cta-title {
		margin-bottom: var(--space-6);
		font-size: var(--text-4xl);
		font-weight: var(--font-bold);
		line-height: 1.2;
		background: linear-gradient(
			135deg,
			var(--color-heading-1),
			var(--color-primary),
			var(--color-muted-foreground)
		);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	@media (min-width: 768px) {
		.cta-title {
			font-size: var(--text-5xl);
		}
	}

	/* Subtitle */
	.cta-subtitle {
		max-width: 36rem;
		margin: 0 auto var(--space-8);
		font-size: var(--text-lg);
		line-height: 1.7;
		color: var(--color-description-2);
	}

	/* Trust badges */
	.trust-badges {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: var(--space-3);
		margin-bottom: var(--space-10);
	}

	.trust-badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-full);
		font-size: var(--text-sm);
		color: var(--color-description-2);
		transition: all 0.15s ease;
	}

	.trust-badge:hover {
		background: var(--color-panel-2);
		border-color: var(--color-primary);
		color: var(--color-foreground);
		transform: translateY(-2px);
	}

	:global(.trust-icon) {
		width: 1rem;
		height: 1rem;
		color: var(--color-primary);
	}

	/* Button group */
	.button-group {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-4);
	}

	@media (min-width: 640px) {
		.button-group {
			flex-direction: row;
			justify-content: center;
			gap: var(--space-6);
		}
	}

	/* Primary button */
	.btn-primary {
		display: inline-flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-4) var(--space-8);
		border-radius: var(--radius-lg);
		background: linear-gradient(135deg, var(--brand-600), var(--brand-700));
		color: white;
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		text-decoration: none;
		box-shadow: var(--shadow-md);
		transition: all 0.2s ease;
		position: relative;
		overflow: hidden;
	}

	.btn-primary::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
		transition: left 0.3s ease;
	}

	.btn-primary:hover::before {
		left: 100%;
	}

	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-lg);
	}

	:global(.btn-icon) {
		width: 1.25rem;
		height: 1.25rem;
		transition: transform 0.15s ease;
	}

	.btn-primary:hover :global(.btn-icon) {
		transform: translateX(4px);
	}

	/* Secondary button */
	.btn-secondary {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-4) var(--space-8);
		border-radius: var(--radius-lg);
		background: var(--color-panel-2);
		border: 1px solid var(--color-border);
		color: var(--color-muted-foreground);
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		text-decoration: none;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.btn-secondary:hover {
		background: var(--color-panel-3);
		border-color: var(--color-primary);
		color: var(--color-foreground);
		transform: translateY(-1px);
	}

	:global(.btn-icon-left) {
		width: 1.125rem;
		height: 1.125rem;
	}

	/* Responsive adjustments */
	@media (min-width: 768px) {
		.cta-section {
			padding: var(--space-24) var(--space-8);
		}
	}

	@media (max-width: 640px) {
		.trust-badges {
			gap: var(--space-2);
		}

		.trust-badge {
			padding: var(--space-1) var(--space-3);
			font-size: var(--text-xs);
		}

		:global(.trust-icon) {
			width: 0.875rem;
			height: 0.875rem;
		}
	}
</style>
