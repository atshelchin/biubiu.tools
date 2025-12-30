<script lang="ts">
	import { ExternalLink } from '@lucide/svelte';
	import { useI18n, type TranslationKeys } from '@shelchin/i18n';
	import type { SerializableExternalTool, SerializableCategory } from '../types';
	import { getToolById } from '../data/tools';

	interface Props {
		tool: SerializableExternalTool;
		category: SerializableCategory;
	}

	let { tool, category }: Props = $props();

	const i18n = useI18n();

	// Get icon from tool registry (client-side)
	const toolWithIcon = getToolById(tool.id);
	const Icon = toolWithIcon?.icon;
</script>

<section class="hero" style="--tool-color: {tool.color}">
	<!-- Background glow -->
	<div class="hero-glow"></div>

	<div class="hero-content">
		<!-- Icon and Title -->
		<div class="hero-header">
			<div class="icon-wrapper">
				<div class="icon-glow"></div>
				<div class="icon-box">
					{#if Icon}
						<Icon class="tool-icon" />
					{/if}
				</div>
			</div>

			<div class="title-section">
				<h1 class="tool-name">{tool.name}</h1>
				<p class="tool-tagline">{i18n.t(tool.descriptionKey as keyof TranslationKeys)}</p>
			</div>

			<!-- CTA Button -->
			<a href={tool.url} target="_blank" rel="noopener noreferrer" class="cta-button">
				<span>{i18n.t('routes/apps/chain-tools.visit', { defaultValue: 'Visit' })}</span>
				<ExternalLink class="cta-icon" />
			</a>
		</div>

		<!-- Chains -->
		{#if tool.chains && tool.chains.length > 0}
			<div class="chains-section">
				<span class="section-label"
					>{i18n.t('routes/apps/chain-tools.supported_chains' as keyof TranslationKeys, {
						defaultValue: 'Supported Chains'
					})}:</span
				>
				<div class="chains-list">
					{#each tool.chains as chain (chain)}
						<span class="chain-tag">{chain}</span>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Category and Tags -->
		<div class="meta-section">
			<span class="category-badge" style="--category-color: {category.color}">
				{i18n.t(category.labelKey as keyof TranslationKeys)}
			</span>
			<div class="tags-list">
				{#each tool.tags as tag (tag)}
					<span class="tag">{tag}</span>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.hero {
		position: relative;
		padding: var(--space-8);
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-xl);
		overflow: hidden;
	}

	:global(.light) .hero {
		background: var(--color-panel-2);
	}

	.hero-glow {
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: radial-gradient(circle at 50% 100%, var(--tool-color), transparent 50%);
		opacity: 0.08;
		pointer-events: none;
	}

	.hero-content {
		position: relative;
		z-index: 1;
	}

	/* Header */
	.hero-header {
		display: flex;
		align-items: flex-start;
		gap: var(--space-5);
		margin-bottom: var(--space-6);
	}

	/* Icon */
	.icon-wrapper {
		position: relative;
		width: 64px;
		height: 64px;
		flex-shrink: 0;
	}

	.icon-glow {
		position: absolute;
		inset: -8px;
		background: radial-gradient(circle, var(--tool-color), transparent 60%);
		opacity: 0.2;
		filter: blur(8px);
	}

	.icon-box {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(
			135deg,
			var(--tool-color),
			color-mix(in srgb, var(--tool-color) 75%, black)
		);
		border-radius: var(--radius-lg);
		box-shadow: 0 4px 12px color-mix(in srgb, var(--tool-color) 30%, transparent);
	}

	:global(.tool-icon) {
		width: 32px;
		height: 32px;
		color: white;
	}

	/* Title */
	.title-section {
		flex: 1;
		min-width: 0;
	}

	.tool-name {
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		color: var(--color-heading-1);
		margin: 0 0 var(--space-2) 0;
		line-height: 1.2;
	}

	.tool-tagline {
		font-size: var(--text-base);
		color: var(--color-description-2);
		margin: 0;
		line-height: 1.5;
	}

	/* CTA Button */
	.cta-button {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-5);
		background: var(--tool-color);
		border-radius: var(--radius-lg);
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: white;
		text-decoration: none;
		white-space: nowrap;
		transition: all 0.2s ease;
		box-shadow: 0 2px 8px color-mix(in srgb, var(--tool-color) 40%, transparent);
	}

	.cta-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 16px color-mix(in srgb, var(--tool-color) 50%, transparent);
	}

	:global(.cta-icon) {
		width: 18px;
		height: 18px;
	}

	/* Chains Section */
	.chains-section {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: var(--space-3);
		margin-bottom: var(--space-4);
	}

	.section-label {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-description-3);
	}

	.chains-list {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.chain-tag {
		padding: var(--space-1) var(--space-2-5);
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-md);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		color: var(--color-description-2);
	}

	:global(.light) .chain-tag {
		background: var(--color-panel-1);
	}

	/* Meta Section */
	.meta-section {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: var(--space-3);
	}

	.category-badge {
		padding: var(--space-1-5) var(--space-3);
		background: color-mix(in srgb, var(--category-color) 15%, transparent);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--category-color);
	}

	.tags-list {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.tag {
		padding: var(--space-1) var(--space-2-5);
		background: var(--color-panel-2);
		border-radius: var(--radius-sm);
		font-size: var(--text-xs);
		color: var(--color-description-3);
	}

	:global(.light) .tag {
		background: var(--color-panel-1);
	}

	/* Mobile */
	@media (max-width: 768px) {
		.hero {
			padding: var(--space-5);
		}

		.hero-header {
			flex-direction: column;
			gap: var(--space-4);
		}

		.icon-wrapper {
			width: 56px;
			height: 56px;
		}

		:global(.tool-icon) {
			width: 28px;
			height: 28px;
		}

		.tool-name {
			font-size: var(--text-2xl);
		}

		.tool-tagline {
			font-size: var(--text-sm);
		}

		.cta-button {
			width: 100%;
			justify-content: center;
			padding: var(--space-3) var(--space-4);
		}

		.chains-section {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--space-2);
		}

		.meta-section {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--space-2);
		}
	}
</style>
