<script lang="ts">
	import { useI18n } from '@shelchin/i18n';
	import { ArrowRight, Sparkles, Github, Check, ShieldCheck, Code2, Lock } from '@lucide/svelte';
	import { localizeHref } from '$lib/utils/localized-url';

	const i18n = useI18n();
	const t = i18n.t.bind(i18n);

	// Featured batch operation tools - randomly pick one for CTA
	const featuredTools = [
		'/apps/one-to-many-transfer',
		'/apps/wallet-sweep',
		'/apps/token-balance-scanner'
	];
	const randomToolHref = localizeHref(
		featuredTools[Math.floor(Math.random() * featuredTools.length)]
	);
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
			<span>Start Building</span>
		</div>

		<!-- Main title with gradient -->
		<h2 id="cta-title" class="cta-title">
			{t('common.cta.title')}
		</h2>

		<!-- Subtitle -->
		<p class="cta-subtitle">
			{t('common.cta.subtitle')}
		</p>

		<!-- Action buttons -->
		<div class="button-group">
			<a href={randomToolHref} class="btn-primary">
				<span>{t('common.cta.button_text')}</span>
				<ArrowRight class="btn-icon" />
			</a>
			<a
				href="https://github.com/atshelchin/biubiu.tools"
				target="_blank"
				rel="noopener noreferrer"
				class="btn-secondary"
			>
				<Github class="btn-icon-left" />
				<span>{t('common.cta.secondary_button')}</span>
			</a>
		</div>

		<!-- Trust indicators with icons -->
		<!-- <div class="trust-indicators">
			<div class="indicator">
				<Check class="indicator-icon" />
				<span>{t('common.cta.trust.no_registration')}</span>
			</div>
			<div class="indicator">
				<Sparkles class="indicator-icon" />
				<span>{t('common.cta.trust.free_tools')}</span>
			</div>
			<div class="indicator">
				<Code2 class="indicator-icon" />
				<span>{t('common.cta.trust.open_source')}</span>
			</div>
			<div class="indicator">
				<Lock class="indicator-icon" />
				<span>{t('common.cta.trust.privacy_first')}</span>
			</div>
		</div> -->
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
		margin: 0 auto var(--space-10);
		font-size: var(--text-lg);
		line-height: 1.7;
		color: var(--color-description-2);
	}

	/* Button group */
	.button-group {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-4);
		margin-bottom: var(--space-10);
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

	/* Trust indicators */
	.trust-indicators {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-4) var(--space-6);
		max-width: 36rem;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		.trust-indicators {
			grid-template-columns: repeat(4, auto);
			justify-content: center;
			gap: var(--space-8);
			max-width: none;
		}
	}

	.indicator {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		color: var(--color-description-2);
		transition: all 0.15s ease;
		white-space: nowrap;
	}

	.indicator:hover {
		background: var(--color-panel-2);
		border-color: var(--color-primary);
		color: var(--color-foreground);
		transform: translateY(-2px);
	}

	:global(.indicator-icon) {
		width: 1rem;
		height: 1rem;
		color: var(--color-primary);
		flex-shrink: 0;
	}

	/* Responsive adjustments */
	@media (min-width: 768px) {
		.cta-section {
			padding: var(--space-24) var(--space-8);
		}
	}
</style>
