<script lang="ts">
	import { t } from '@/i18n/create-i18n.svelte';
	import { Check, Star, Zap } from '@lucide/svelte';

	// Pricing plan structure
	interface PricingPlan {
		name: string;
		price: string;
		period: string;
		description: string;
		features: string[];
		highlighted?: boolean;
		ctaText: string;
	}

	// Get pricing plans dynamically
	function getPlans(): PricingPlan[] {
		return [
			{
				name: t('pricing.free.name'),
				price: t('pricing.free.price'),
				period: t('pricing.free.period'),
				description: t('pricing.free.description'),
				features: t('pricing.free.features') as unknown as string[],
				ctaText: t('pricing.free.cta')
			},
			{
				name: t('pricing.pro.name'),
				price: t('pricing.pro.price'),
				period: t('pricing.pro.period'),
				description: t('pricing.pro.description'),
				features: t('pricing.pro.features') as unknown as string[],
				highlighted: true,
				ctaText: t('pricing.pro.cta')
			},
			{
				name: t('pricing.enterprise.name'),
				price: t('pricing.enterprise.price'),
				period: t('pricing.enterprise.period'),
				description: t('pricing.enterprise.description'),
				features: t('pricing.enterprise.features') as unknown as string[],
				ctaText: t('pricing.enterprise.cta')
			}
		];
	}
</script>

<!-- Pricing section with premium design -->
<section id="pricing" class="pricing-section">
	<div class="container">
		<!-- Section header -->
		<div class="section-header">
			<div class="badge">
				<Zap class="badge-icon" />
				<span>Simple Pricing</span>
			</div>

			<h2 class="section-title">
				{t('pricing.title')}
			</h2>

			<p class="section-subtitle">
				{t('pricing.subtitle')}
			</p>
		</div>

		<!-- Pricing cards grid -->
		<div class="pricing-grid">
			{#each getPlans() as plan, index (plan.name)}
				<article
					class="pricing-card {plan.highlighted ? 'featured' : ''}"
					style="--index: {index};"
				>
					{#if plan.highlighted}
						<div class="popular-badge">
							<Star class="star-icon" />
							<span>Most Popular</span>
						</div>
					{/if}

					<!-- Plan header -->
					<div class="plan-header">
						<h3 class="plan-name">{plan.name}</h3>
						<p class="plan-description">{plan.description}</p>
					</div>

					<!-- Price display -->
					<div class="price-section">
						<div class="price-wrapper">
							<span class="price">{plan.price}</span>
							<span class="period">/{plan.period}</span>
						</div>
					</div>

					<!-- Divider -->
					<div class="divider"></div>

					<!-- Features list -->
					<ul class="features-list">
						{#each plan.features as feature (feature)}
							<li class="feature-item">
								<Check class="check-icon" />
								<span class="feature-text">{feature}</span>
							</li>
						{/each}
					</ul>

					<!-- CTA button -->
					<div class="action-section">
						<button class="cta-button {plan.highlighted ? 'primary' : 'secondary'}">
							{plan.ctaText}
						</button>
					</div>
				</article>
			{/each}
		</div>

		<!-- Trust note -->
		<div class="trust-note">
			<p class="note-text">{t('pricing.note')}</p>
			<p class="note-text">
				{t('pricing.custom_plan')}
				<a href="#contact" class="contact-link">
					{t('pricing.contact_us')}
				</a>
			</p>
		</div>
	</div>
</section>

<style>
	/* Section layout */
	.pricing-section {
		position: relative;
		padding: var(--spacing-20) var(--spacing-6);
		background: var(--color-background);
		overflow: hidden;
	}

	.container {
		max-width: 72rem;
		margin: 0 auto;
	}

	/* Section header */
	.section-header {
		text-align: center;
		margin-bottom: var(--spacing-16);
	}

	.badge {
		display: inline-flex;
		align-items: center;
		gap: var(--spacing-2);
		padding: var(--spacing-2) var(--spacing-4);
		margin-bottom: var(--spacing-4);
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

	/* Title with gradient */
	.section-title {
		font-size: var(--font-size-4xl);
		font-weight: var(--font-weight-bold);
		line-height: 1.2;
		margin-bottom: var(--spacing-4);
		background: linear-gradient(to right, var(--color-text-primary), var(--color-text-secondary));
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.section-subtitle {
		max-width: 36rem;
		margin: 0 auto;
		font-size: var(--font-size-lg);
		line-height: 1.7;
		color: var(--color-text-muted);
	}

	/* Pricing grid */
	.pricing-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: var(--spacing-8);
		padding: 0 var(--spacing-4);
		margin-bottom: var(--spacing-12);
	}

	@media (min-width: 1024px) {
		.pricing-grid {
			grid-template-columns: repeat(3, 1fr);
			gap: var(--spacing-10);
		}
	}

	/* Pricing card */
	.pricing-card {
		position: relative;
		display: flex;
		flex-direction: column;
		padding: var(--spacing-8);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-xl);
		transition: all var(--duration-normal) var(--ease-smooth);
		animation: fadeIn 0.5s calc(var(--index) * 0.1s) both;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.pricing-card:hover {
		transform: translateY(-4px);
		background: var(--color-panel-2);
		border-color: var(--color-border);
		box-shadow: var(--shadow-lg);
	}

	/* Featured card */
	.pricing-card.featured {
		transform: scale(1.05);
		background: var(--color-panel-2);
		border-color: var(--color-brand-primary);
		box-shadow: var(--shadow-xl);
	}

	.pricing-card.featured:hover {
		transform: scale(1.05) translateY(-4px);
	}

	/* Popular badge */
	.popular-badge {
		position: absolute;
		top: -1rem;
		right: var(--spacing-4);
		display: flex;
		align-items: center;
		gap: var(--spacing-1);
		padding: var(--spacing-2) var(--spacing-3);
		border-radius: var(--radius-md);
		background: var(--color-brand-primary);
		color: white;
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-semibold);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	:global(.star-icon) {
		width: 0.875rem;
		height: 0.875rem;
	}

	/* Plan header */
	.plan-header {
		margin-bottom: var(--spacing-6);
	}

	.plan-name {
		margin-bottom: var(--spacing-2);
		font-size: var(--font-size-xl);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
	}

	.featured .plan-name {
		background: linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-secondary));
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.plan-description {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
		line-height: 1.5;
	}

	/* Price section */
	.price-section {
		margin-bottom: var(--spacing-6);
	}

	.price-wrapper {
		display: flex;
		align-items: baseline;
		gap: var(--spacing-2);
	}

	.price {
		font-size: var(--font-size-4xl);
		font-weight: var(--font-weight-bold);
		color: var(--color-text-primary);
	}

	.featured .price {
		background: linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-secondary));
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.period {
		font-size: var(--font-size-base);
		color: var(--color-text-muted);
	}

	/* Divider */
	.divider {
		height: 1px;
		margin-bottom: var(--spacing-6);
		background: var(--color-border-subtle);
	}

	/* Features list */
	.features-list {
		flex: 1;
		list-style: none;
		padding: 0;
		margin: 0 0 var(--spacing-8) 0;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-4);
	}

	.feature-item {
		display: flex;
		align-items: center;
		gap: var(--spacing-3);
		transition: transform var(--duration-fast);
	}

	.feature-item:hover {
		transform: translateX(2px);
	}

	:global(.check-icon) {
		flex-shrink: 0;
		width: 1.25rem;
		height: 1.25rem;
		color: var(--color-success);
	}

	.featured :global(.check-icon) {
		color: var(--color-brand-primary);
	}

	.feature-text {
		font-size: var(--font-size-base);
		color: var(--color-text-secondary);
		line-height: 1.5;
	}

	.feature-item:hover .feature-text {
		color: var(--color-text-primary);
	}

	/* Action section */
	.action-section {
		padding-top: var(--spacing-4);
		border-top: 1px solid var(--color-border-subtle);
	}

	.cta-button {
		width: 100%;
		padding: var(--spacing-4) var(--spacing-6);
		border-radius: var(--radius-md);
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-medium);
		border: none;
		cursor: pointer;
		transition: all var(--duration-fast);
	}

	.cta-button.primary {
		background: var(--color-brand-primary);
		color: white;
	}

	.cta-button.primary:hover {
		background: var(--color-brand-primary-dark);
		transform: translateY(-1px);
		box-shadow: var(--shadow-md);
	}

	.cta-button.secondary {
		background: var(--color-panel-2);
		color: var(--color-text-secondary);
		border: 1px solid var(--color-border);
	}

	.cta-button.secondary:hover {
		background: var(--color-panel-3);
		color: var(--color-text-primary);
		border-color: var(--color-brand-primary);
		transform: translateY(-1px);
	}

	/* Trust note */
	.trust-note {
		text-align: center;
		padding: var(--spacing-6);
		background: var(--color-panel-1);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border-subtle);
		max-width: 48rem;
		margin: 0 auto;
	}

	.note-text {
		margin-bottom: var(--spacing-2);
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.note-text:last-child {
		margin-bottom: 0;
	}

	.contact-link {
		color: var(--color-brand-primary);
		text-decoration: none;
		font-weight: var(--font-weight-medium);
		transition: color var(--duration-fast);
	}

	.contact-link:hover {
		color: var(--color-brand-primary-dark);
		text-decoration: underline;
	}

	/* Responsive adjustments */
	@media (min-width: 768px) {
		.pricing-section {
			padding: var(--spacing-32) var(--spacing-8);
		}

		.section-title {
			font-size: var(--font-size-5xl);
		}
	}
</style>
