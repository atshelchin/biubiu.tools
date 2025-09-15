<script lang="ts">
	import { t } from '@/i18n/create-i18n.svelte';
	import { ArrowRight, Sparkles } from '@lucide/svelte';
</script>

<!-- CTA section with premium design -->
<section id="cta" class="cta-section">
	<div class="container">
		<!-- Badge -->
		<div class="badge">
			<Sparkles class="badge-icon" />
			<span>Get Started</span>
		</div>

		<!-- Main title with gradient -->
		<h2 class="cta-title">
			{t('cta.title')}
		</h2>

		<!-- Subtitle -->
		<p class="cta-subtitle">
			{t('cta.subtitle')}
		</p>

		<!-- Action buttons -->
		<div class="button-group">
			<a href="/tools" class="btn-primary">
				<span>{t('cta.button_text')}</span>
				<ArrowRight class="btn-icon" />
			</a>
			<button class="btn-secondary">
				<span>Learn More</span>
			</button>
		</div>

		<!-- Trust indicators -->
		<div class="trust-indicators">
			<span class="indicator">✓ No Registration Required</span>
			<span class="indicator">✓ Free to Use</span>
			<span class="indicator">✓ Secure & Private</span>
		</div>
	</div>
</section>

<style>
	/* Section layout */
	.cta-section {
		position: relative;
		padding: var(--spacing-24) var(--spacing-6);
		background: linear-gradient(135deg, var(--color-panel-1), var(--color-background));
		border-top: 1px solid var(--color-border-subtle);
		border-bottom: 1px solid var(--color-border-subtle);
		overflow: hidden;
	}

	/* Background decoration */
	.cta-section::before {
		content: '';
		position: absolute;
		top: -50%;
		right: -25%;
		width: 50%;
		height: 200%;
		background: radial-gradient(ellipse at center, var(--color-brand-primary), transparent);
		opacity: 0.03;
		animation: pulse 8s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.03;
		}
		50% {
			opacity: 0.06;
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
		gap: var(--spacing-2);
		padding: var(--spacing-2) var(--spacing-4);
		margin-bottom: var(--spacing-6);
		border-radius: var(--radius-full);
		background: var(--color-panel-2);
		border: 1px solid var(--color-border-subtle);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-secondary);
	}

	:global(.badge-icon) {
		width: 1rem;
		height: 1rem;
		color: var(--color-brand-primary);
	}

	/* Title with premium gradient */
	.cta-title {
		margin-bottom: var(--spacing-6);
		font-size: var(--font-size-4xl);
		font-weight: var(--font-weight-bold);
		line-height: 1.2;
		background: linear-gradient(
			135deg,
			var(--color-text-primary),
			var(--color-brand-primary),
			var(--color-text-secondary)
		);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	@media (min-width: 768px) {
		.cta-title {
			font-size: var(--font-size-5xl);
		}
	}

	/* Subtitle */
	.cta-subtitle {
		max-width: 36rem;
		margin: 0 auto var(--spacing-10);
		font-size: var(--font-size-lg);
		line-height: 1.7;
		color: var(--color-text-muted);
	}

	/* Button group */
	.button-group {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-4);
		margin-bottom: var(--spacing-10);
	}

	@media (min-width: 640px) {
		.button-group {
			flex-direction: row;
			justify-content: center;
			gap: var(--spacing-6);
		}
	}

	/* Primary button */
	.btn-primary {
		display: inline-flex;
		align-items: center;
		gap: var(--spacing-3);
		padding: var(--spacing-4) var(--spacing-8);
		border-radius: var(--radius-lg);
		background: linear-gradient(
			135deg,
			var(--color-brand-primary),
			var(--color-brand-primary-dark)
		);
		color: white;
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-semibold);
		text-decoration: none;
		box-shadow: var(--shadow-md);
		transition: all var(--duration-normal) var(--ease-smooth);
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
		transition: left var(--duration-normal);
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
		transition: transform var(--duration-fast);
	}

	.btn-primary:hover :global(.btn-icon) {
		transform: translateX(4px);
	}

	/* Secondary button */
	.btn-secondary {
		padding: var(--spacing-4) var(--spacing-8);
		border-radius: var(--radius-lg);
		background: var(--color-panel-2);
		border: 1px solid var(--color-border);
		color: var(--color-text-secondary);
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-medium);
		cursor: pointer;
		transition: all var(--duration-fast);
	}

	.btn-secondary:hover {
		background: var(--color-panel-3);
		border-color: var(--color-brand-primary);
		color: var(--color-text-primary);
		transform: translateY(-1px);
	}

	/* Trust indicators */
	.trust-indicators {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: var(--spacing-6);
	}

	.indicator {
		display: flex;
		align-items: center;
		gap: var(--spacing-2);
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
		transition: color var(--duration-fast);
	}

	.indicator:hover {
		color: var(--color-text-secondary);
	}

	/* Responsive adjustments */
	@media (min-width: 768px) {
		.cta-section {
			padding: var(--spacing-32) var(--spacing-8);
		}
	}
</style>
