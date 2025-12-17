<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import { Sparkles, ChevronDown, ChevronUp } from '@lucide/svelte';
	import { toolsConfig, TELEGRAM_GROUP_LINK } from './data/tools-data';
	import ToolCard from './components/tool-card.svelte';
	import RandomToolDiscovery from './components/random-tool-discovery.svelte';

	const i18n = useI18n();
	const t = i18n.t;

	// Transform tool config with i18n translations - reactive to language changes
	const tools = $derived(
		toolsConfig.map((tool) => ({
			...tool,
			title: t(tool.titleKey),
			description: t(tool.descriptionKey),
			features: tool.featureKeys ? tool.featureKeys.map((key) => t(key)) : tool.features
		}))
	);

	// Show more/less state
	const INITIAL_VISIBLE_COUNT = 9;
	let showAll = $state(false);
</script>

<!-- Premium Tools Section -->
<section id="tools" class="tools-section">
	<!-- Animated background -->
	<div class="bg-gradient"></div>

	<div class="container">
		<!-- Premium header -->
		<div class="section-header">
			<div class="badge-wrapper">
				<div class="badge-glow"></div>
				<div class="badge">
					<Sparkles class="badge-icon" />
					<span>{t('tools.badge')}</span>
				</div>
			</div>

			<h2 class="section-title">
				<span class="title-line">{t('tools.section_title')}</span>
			</h2>

			<p class="section-subtitle">
				{t('tools.section_subtitle')}
			</p>
		</div>

		<!-- Premium cards grid -->
		<div class="tools-grid">
			{#each tools as tool, index (index)}
				<ToolCard
					icon={tool.icon}
					title={tool.title}
					description={tool.description}
					link={tool.link}
					status={tool.status}
					color={tool.color}
					features={tool.features}
					stage={tool.stage}
					{index}
					telegramLink={TELEGRAM_GROUP_LINK}
					hidden={!showAll && index >= INITIAL_VISIBLE_COUNT}
				/>
			{/each}
		</div>

		<!-- Show More / Show Less Button -->
		{#if tools.length > INITIAL_VISIBLE_COUNT}
			<div class="show-more-wrapper">
				<button class="show-more-btn" onclick={() => (showAll = !showAll)}>
					{#if showAll}
						<ChevronUp class="show-more-icon" />
						<span>{t('common.show_less')}</span>
					{:else}
						<ChevronDown class="show-more-icon" />
						<span>{t('common.show_more')} ({tools.length - INITIAL_VISIBLE_COUNT})</span>
					{/if}
				</button>
			</div>
		{/if}
	</div>

	<!-- Random Tool Discovery (Shake Button, Modal, 3D Dice) -->
	<RandomToolDiscovery {tools} />
</section>

<style>
	/* Premium section with proper spacing */
	.tools-section {
		position: relative;
		padding: var(--space-16) var(--space-6);
		background: var(--color-background);
		overflow: hidden;
	}

	/* Subtle background gradient */
	.bg-gradient {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			180deg,
			var(--color-background),
			var(--color-panel-1) 50%,
			var(--color-background)
		);
		opacity: 0.3;
	}

	:global(.light) .tools-section {
		background: var(--color-panel-1);
	}

	.container {
		position: relative;
		max-width: 80rem;
		margin: 0 auto;
		width: 100%;
		z-index: 1;
		padding: var(--space-4) var(--space-5);
	}

	/* Header with proper spacing */
	.section-header {
		text-align: center;
		margin-bottom: var(--space-16);
	}

	.badge-wrapper {
		position: relative;
		display: inline-block;
		margin-bottom: var(--space-8);
	}

	.badge-glow {
		position: absolute;
		inset: -8px;
		background: var(--color-brand-primary);
		border-radius: var(--radius-full);
		filter: blur(16px);
		opacity: 0.1;
	}

	.badge {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		border-radius: var(--radius-full);
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-2);
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		color: var(--color-description-2);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	:global(.badge-icon) {
		width: 0.875rem;
		height: 0.875rem;
		color: var(--color-primary);
	}

	/* Title with strong to weak gradient */
	.section-title {
		font-size: 2.25rem;
		font-weight: var(--font-bold);
		line-height: 1.2;
		margin-bottom: var(--space-6);
		letter-spacing: -0.02em;
	}

	.title-line {
		background: linear-gradient(
			to right,
			var(--color-heading-1) 0%,
			var(--color-heading-1) 30%,
			var(--color-heading-3) 70%,
			var(--color-heading-4) 100%
		);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.section-subtitle {
		max-width: 40rem;
		margin: 0 auto;
		padding: 0 var(--space-4);
		font-size: 1.0625rem;
		line-height: 1.65;
		color: var(--color-description-3);
	}

	/* Grid with compact spacing - 3 columns */
	.tools-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: var(--space-6);
		padding: 0;
	}

	@media (max-width: 768px) {
		.container {
			padding: var(--space-3) var(--space-1);
		}
	}

	@media (min-width: 768px) {
		.tools-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: var(--space-8);
		}
	}

	@media (min-width: 1024px) {
		.tools-grid {
			grid-template-columns: repeat(3, 1fr);
			gap: var(--space-6);
		}
	}

	/* Responsive with proper spacing */
	@media (min-width: 768px) {
		.tools-section {
			padding: var(--space-24) var(--space-12);
		}

		.section-title {
			font-size: var(--text-6xl);
		}

		.section-header {
			margin-bottom: var(--space-20);
		}
	}

	@media (max-width: 768px) {
		.tools-section {
			padding: var(--space-12) var(--space-5);
		}

		.section-header {
			margin-bottom: var(--space-12);
		}

		.section-title {
			font-size: 1.875rem;
			margin-bottom: var(--space-5);
		}

		.section-subtitle {
			font-size: 1rem;
			padding: 0 var(--space-2);
		}

		.tools-grid {
			grid-template-columns: 1fr;
			gap: var(--space-5);
		}
	}

	/* Show More Button */
	.show-more-wrapper {
		display: flex;
		justify-content: center;
		margin-top: var(--space-10);
	}

	.show-more-btn {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-6);
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-full);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-text-secondary);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.show-more-btn:hover {
		background: var(--color-panel-3);
		border-color: var(--color-primary);
		color: var(--color-primary);
		transform: translateY(-2px);
	}

	:global(.show-more-icon) {
		width: 18px;
		height: 18px;
	}
</style>
