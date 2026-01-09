<script lang="ts">
	/**
	 * Package Demo Layout
	 * Main layout component for package demo pages with hero section and content area.
	 */
	import type { Snippet, Component } from 'svelte';

	interface Feature {
		icon: Component;
		text: string;
	}

	interface Props {
		packageName: string;
		title: string;
		subtitle: string;
		description: string;
		features?: Feature[];
		heroIcon?: Component;
		children: Snippet;
	}

	let {
		packageName,
		title,
		subtitle,
		description,
		features = [],
		heroIcon,
		children
	}: Props = $props();
</script>

<div class="demo-page">
	<!-- Hero Section -->
	<header class="hero">
		<div class="hero-content">
			<div class="hero-badge">
				{#if heroIcon}
					{@const HeroIcon = heroIcon}
					<HeroIcon size={16} />
				{/if}
				<span>{packageName}</span>
			</div>
			<h1 class="hero-title">{title}</h1>
			<p class="hero-subtitle">{subtitle}</p>
			<p class="hero-description">{description}</p>

			{#if features.length > 0}
				<div class="features-grid">
					{#each features as feature (feature.text)}
						{@const FeatureIcon = feature.icon}
						<div class="feature-item">
							<FeatureIcon size={20} />
							<span>{feature.text}</span>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</header>

	<!-- Demo Sections -->
	<main class="demos">
		{@render children()}
	</main>
</div>

<style>
	.demo-page {
		min-height: 100vh;
		background: var(--color-background);
	}

	.hero {
		background: linear-gradient(
			135deg,
			var(--color-panel-1) 0%,
			var(--color-panel-0) 50%,
			var(--color-panel-1) 100%
		);
		border-bottom: 1px solid var(--color-border);
		padding: var(--space-16) var(--space-6);
	}

	.hero-content {
		max-width: 900px;
		margin: 0 auto;
		text-align: center;
	}

	.hero-badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		background: var(--color-primary);
		color: white;
		border-radius: var(--radius-full);
		font-size: var(--text-sm);
		font-weight: 500;
		margin-bottom: var(--space-6);
	}

	.hero-title {
		font-size: var(--text-5xl);
		font-weight: 800;
		background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent, #10b981) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin-bottom: var(--space-4);
	}

	.hero-subtitle {
		font-size: var(--text-xl);
		color: var(--color-foreground);
		font-weight: 600;
		margin-bottom: var(--space-4);
	}

	.hero-description {
		font-size: var(--text-lg);
		color: var(--color-muted-foreground);
		max-width: 700px;
		margin: 0 auto var(--space-8);
		line-height: 1.6;
	}

	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: var(--space-4);
		max-width: 800px;
		margin: 0 auto;
	}

	.feature-item {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-4);
		background: var(--color-card);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		font-size: var(--text-sm);
		color: var(--color-foreground);
	}

	.feature-item :global(svg) {
		color: var(--color-primary);
		flex-shrink: 0;
	}

	.demos {
		max-width: 1200px;
		margin: 0 auto;
		padding: var(--space-8) var(--space-6);
	}

	@media (max-width: 1024px) {
		.features-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (max-width: 768px) {
		.hero {
			padding: var(--space-8) var(--space-4);
		}

		.hero-title {
			font-size: var(--text-3xl);
		}

		.demos {
			padding: var(--space-4);
		}

		.features-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
