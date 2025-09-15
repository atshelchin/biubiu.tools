<script lang="ts">
	import { onMount } from 'svelte';
	import { t } from '@/i18n/create-i18n.svelte';

	// Stats data structure
	interface Stat {
		label: string;
		value: string;
		suffix: string;
		target: number;
	}

	// Animation state
	let animatedValues = $state<number[]>([0, 0, 0, 0]);
	let isVisible = $state(false);

	// Get stats dynamically
	function getStats(): Stat[] {
		return [
			{
				label: t('stats.registered_users'),
				value: '10K+',
				suffix: '',
				target: 10000
			},
			{
				label: t('stats.transactions'),
				value: '50K+',
				suffix: '',
				target: 50000
			},
			{
				label: t('stats.total_volume'),
				value: '$5M',
				suffix: '+',
				target: 5000000
			},
			{
				label: t('stats.chains_supported'),
				value: '8',
				suffix: '',
				target: 8
			}
		];
	}

	// Animate numbers when visible
	function animateNumbers() {
		if (!isVisible) return;

		const stats = getStats();
		const duration = 2000;
		const startTime = Date.now();

		function updateNumbers() {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);

			// Easing function for smooth animation
			const easeOutQuart = 1 - Math.pow(1 - progress, 4);

			animatedValues = stats.map((stat) => {
				return Math.floor(stat.target * easeOutQuart);
			});

			if (progress < 1) {
				requestAnimationFrame(updateNumbers);
			}
		}

		updateNumbers();
	}

	// Format number for display
	function formatNumber(value: number, index: number): string {
		if (index === 2) {
			// Total volume in millions
			return `$${(value / 1000000).toFixed(1)}M`;
		} else if (index === 0 || index === 1) {
			// Users and transactions in thousands
			return `${(value / 1000).toFixed(0)}K`;
		}
		return value.toString();
	}

	// Intersection observer for triggering animation
	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !isVisible) {
						isVisible = true;
						animateNumbers();
					}
				});
			},
			{ threshold: 0.3 }
		);

		const section = document.querySelector('#stats-section');
		if (section) observer.observe(section);

		return () => observer.disconnect();
	});
</script>

<!-- Stats section -->
<section id="stats-section" class="stats-section">
	<!-- Background mesh -->
	<div class="gradient-mesh"></div>

	<!-- Large flowing orbs -->
	<div class="orb orb-left"></div>
	<div class="orb orb-right"></div>

	<!-- Top transition -->
	<div class="transition-top"></div>

	<div class="stats-container">
		<!-- Section title -->
		<div class="section-header">
			<h2 class="section-title">
				<span class="title-gradient">
					{t('stats.title')}
				</span>
			</h2>
			<!-- Trust indicator -->
			<div class="trust-badge">
				<svg class="check-icon" fill="currentColor" viewBox="0 0 20 20">
					<path
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
						clip-rule="evenodd"
					/>
				</svg>
				<span class="badge-text">{t('stats.last_updated')}</span>
			</div>
		</div>

		<!-- Stats grid -->
		<div class="stats-grid">
			{#each getStats() as stat, index (stat.label)}
				<div class="stat-card">
					<!-- Card background -->
					<div class="card-bg"></div>
					<!-- Glow effect on hover -->
					<div class="card-glow"></div>

					<div class="stat-content">
						<!-- Animated number -->
						<div class="stat-value">
							{formatNumber(animatedValues[index], index)}{stat.suffix}
						</div>

						<!-- Stat label -->
						<p class="stat-label">
							{stat.label}
						</p>

						<!-- Accent line -->
						<div class="accent-line"></div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Bottom transition -->
	<div class="transition-bottom"></div>
</section>

<style>
	.stats-section {
		position: relative;
		overflow: hidden;
		padding: var(--spacing-32) var(--spacing-4);
	}

	@media (min-width: 640px) {
		.stats-section {
			padding: var(--spacing-32) var(--spacing-6);
		}
	}

	@media (min-width: 1024px) {
		.stats-section {
			padding: var(--spacing-32) var(--spacing-8);
		}
	}

	.gradient-mesh {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			135deg,
			hsl(var(--brand-hue), var(--brand-saturation), 50%, 0.1),
			transparent,
			hsl(var(--brand-hue), calc(var(--brand-saturation) * 0.8), 60%, 0.1)
		);
		opacity: 0.4;
	}

	.orb {
		position: absolute;
		border-radius: 50%;
		filter: blur(48px);
		animation: pulse 4s ease-in-out infinite;
	}

	.orb-left {
		top: -16rem;
		left: -16rem;
		width: 50rem;
		height: 50rem;
		background: linear-gradient(
			to bottom right,
			hsl(var(--brand-hue), var(--brand-saturation), 50%, 0.15),
			transparent
		);
	}

	.orb-right {
		bottom: -16rem;
		right: -16rem;
		width: 50rem;
		height: 50rem;
		background: linear-gradient(
			to top left,
			hsl(var(--brand-hue), calc(var(--brand-saturation) * 0.9), 55%, 0.15),
			transparent
		);
		animation-delay: 1s;
	}

	.transition-top,
	.transition-bottom {
		position: absolute;
		left: 0;
		right: 0;
		z-index: 10;
		height: 8rem;
	}

	.transition-top {
		top: 0;
		background: linear-gradient(
			to bottom,
			var(--color-background),
			color-mix(in srgb, var(--color-background) 60%, transparent),
			transparent
		);
	}

	.transition-bottom {
		bottom: 0;
		background: linear-gradient(
			to top,
			var(--color-background),
			color-mix(in srgb, var(--color-background) 60%, transparent),
			transparent
		);
	}

	.stats-container {
		position: relative;
		z-index: 20;
		max-width: 80rem;
		margin: 0 auto;
	}

	.section-header {
		margin-bottom: var(--spacing-20);
		text-align: center;
	}

	.section-title {
		margin-bottom: var(--spacing-6);
		font-size: var(--font-size-4xl);
		font-weight: var(--font-weight-black);
	}

	@media (min-width: 768px) {
		.section-title {
			font-size: var(--font-size-6xl);
		}
	}

	.title-gradient {
		background: linear-gradient(
			to right,
			var(--color-brand-primary),
			var(--color-brand-primary-dark),
			var(--color-brand-secondary)
		);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.trust-badge {
		display: inline-flex;
		align-items: center;
		gap: var(--spacing-2);
		padding: var(--spacing-2) var(--spacing-4);
		border-radius: var(--radius-full);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
	}

	.check-icon {
		width: 1rem;
		height: 1rem;
		color: var(--color-success);
	}

	.badge-text {
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-secondary);
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(1, 1fr);
		gap: var(--spacing-8);
	}

	@media (min-width: 640px) {
		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.stats-grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	.stat-card {
		position: relative;
		text-align: center;
		cursor: default;
	}

	.stat-card:hover .card-bg {
		border-color: hsl(var(--brand-hue), var(--brand-saturation), 50%, 0.2);
	}

	.stat-card:hover .card-glow {
		opacity: 1;
	}

	.stat-card:hover .stat-value {
		transform: scale(1.1);
	}

	.stat-card:hover .stat-label {
		color: color-mix(in srgb, var(--color-text-primary) 90%, transparent);
	}

	.stat-card:hover .accent-line {
		width: 5rem;
		height: 4px;
	}

	.card-bg {
		position: absolute;
		inset: 0;
		border-radius: var(--radius-xl);
		border: 1px solid color-mix(in srgb, var(--color-border) 20%, transparent);
		background: color-mix(in srgb, var(--color-panel-1) 30%, transparent);
		backdrop-filter: blur(8px);
		transition: all var(--duration-normal);
	}

	.card-glow {
		position: absolute;
		inset: 0;
		border-radius: var(--radius-xl);
		background: linear-gradient(
			to bottom right,
			hsl(var(--brand-hue), var(--brand-saturation), 50%, 0.05),
			hsl(var(--brand-hue), calc(var(--brand-saturation) * 0.9), 55%, 0.05)
		);
		opacity: 0;
		transition: opacity var(--duration-normal);
	}

	.stat-content {
		position: relative;
		z-index: 10;
		padding: var(--spacing-8);
	}

	.stat-value {
		margin-bottom: var(--spacing-4);
		font-size: var(--font-size-5xl);
		font-weight: var(--font-weight-black);
		background: linear-gradient(
			to bottom right,
			var(--color-brand-primary),
			var(--color-brand-primary-dark),
			var(--color-brand-secondary)
		);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		transition: transform var(--duration-normal);
	}

	@media (min-width: 768px) {
		.stat-value {
			font-size: var(--font-size-7xl);
		}
	}

	.stat-label {
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-medium);
		color: color-mix(in srgb, var(--color-text-secondary) 80%, transparent);
		transition: color var(--duration-fast);
	}

	.accent-line {
		width: 3rem;
		height: 2px;
		margin: var(--spacing-6) auto 0;
		border-radius: var(--radius-full);
		background: linear-gradient(to right, var(--color-brand-primary), var(--color-brand-secondary));
		transition: all var(--duration-normal);
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.8;
		}
		50% {
			opacity: 1;
		}
	}
</style>
