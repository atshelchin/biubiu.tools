<script lang="ts">
	import { ExternalLink, ArrowRight } from '@lucide/svelte';
	import { useI18n, type TranslationKeys } from '@shelchin/i18n';
	import type { ExternalTool, SerializableExternalTool } from '../types';
	import { getCategoryById } from '../data/categories';
	import { hasDetailPage } from '../data/tool-details';
	import { getToolById } from '../data/tools';

	interface Props {
		tool: ExternalTool | SerializableExternalTool;
		index: number;
	}

	let { tool, index }: Props = $props();

	const i18n = useI18n();

	// Get icon - either from tool directly or lookup from registry
	const Icon = $derived('icon' in tool ? tool.icon : getToolById(tool.id)?.icon);
	const category = $derived(getCategoryById(tool.category));

	// Check if this tool has a detail page
	const hasDetail = $derived(hasDetailPage(tool.id));
	const href = $derived(hasDetail ? `/apps/chain-tools/tool/${tool.id}` : tool.url);
	const isExternal = $derived(!hasDetail);
</script>

<a
	{href}
	target={isExternal ? '_blank' : undefined}
	rel={isExternal ? 'noopener noreferrer' : undefined}
	class="tool-card"
	class:has-detail={hasDetail}
	style="--index: {index}; --tool-color: {tool.color}"
>
	<!-- Card background -->
	<div class="card-bg"></div>
	<div class="card-glow"></div>

	<!-- Icon -->
	<div class="icon-wrapper">
		<div class="icon-glow"></div>
		<div class="icon-box">
			{#if Icon}
				<Icon class="tool-icon" />
			{/if}
		</div>
	</div>

	<!-- Content -->
	<div class="content">
		<h3 class="tool-name">{tool.name}</h3>
		<p class="tool-description">{i18n.t(tool.descriptionKey as keyof TranslationKeys)}</p>

		<!-- Tags -->
		{#if tool.chains && tool.chains.length > 0}
			<div class="chains">
				{#each tool.chains.slice(0, 3) as chain (chain)}
					<span class="chain-tag">{chain}</span>
				{/each}
				{#if tool.chains.length > 3}
					<span class="chain-tag more">+{tool.chains.length - 3}</span>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Footer -->
	<div class="card-footer">
		{#if category}
			<span class="category-badge" style="--category-color: {category.color}">
				{i18n.t(category.labelKey as keyof TranslationKeys)}
			</span>
		{/if}
		<span class="visit-link">
			{#if hasDetail}
				<span
					>{i18n.t('routes/apps/chain-tools.learn_more' as keyof TranslationKeys, {
						defaultValue: 'Learn more'
					})}</span
				>
				<ArrowRight class="arrow-icon" />
			{:else}
				<span>{i18n.t('routes/apps/chain-tools.visit')}</span>
				<ExternalLink class="external-icon" />
			{/if}
		</span>
	</div>
</a>

<style>
	.tool-card {
		position: relative;
		display: flex;
		flex-direction: column;
		padding: var(--space-5);
		border-radius: var(--radius-xl);
		text-decoration: none;
		cursor: pointer;
		transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
		animation: fadeUp 0.4s calc(var(--index) * 0.03s) both;
		min-height: 200px;
	}

	@keyframes fadeUp {
		from {
			opacity: 0;
			transform: translateY(12px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.card-bg {
		position: absolute;
		inset: 0;
		border-radius: var(--radius-xl);
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-2);
		z-index: 1;
		transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
	}

	:global(.light) .card-bg {
		background: var(--color-panel-2);
	}

	.card-glow {
		position: absolute;
		inset: -1px;
		border-radius: var(--radius-xl);
		background: radial-gradient(circle at 50% 0%, var(--tool-color), transparent 70%);
		opacity: 0;
		transition: opacity 0.3s ease;
		z-index: 0;
	}

	.tool-card:hover {
		transform: translateY(-6px);
	}

	.tool-card:hover .card-bg {
		background: var(--color-panel-2);
		border-color: color-mix(in srgb, var(--tool-color) 30%, var(--color-panel-border-3));
		box-shadow:
			0 12px 24px -6px rgb(0 0 0 / 0.12),
			0 6px 12px -4px rgb(0 0 0 / 0.08);
	}

	:global(.light) .tool-card:hover .card-bg {
		background: var(--color-panel-3);
	}

	.tool-card:hover .card-glow {
		opacity: 0.2;
	}

	/* Icon */
	.icon-wrapper {
		position: relative;
		width: 42px;
		height: 42px;
		margin-bottom: var(--space-3);
		z-index: 2;
	}

	.icon-glow {
		position: absolute;
		inset: -6px;
		background: radial-gradient(circle, var(--tool-color), transparent 60%);
		opacity: 0.12;
		filter: blur(6px);
		transition: opacity 0.25s ease;
	}

	.tool-card:hover .icon-glow {
		opacity: 0.25;
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
		box-shadow: 0 2px 6px color-mix(in srgb, var(--tool-color) 30%, transparent);
		transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.tool-card:hover .icon-box {
		transform: translateY(-2px) scale(1.08);
		box-shadow: 0 4px 12px color-mix(in srgb, var(--tool-color) 40%, transparent);
	}

	:global(.tool-icon) {
		width: 20px;
		height: 20px;
		color: white;
	}

	/* Content */
	.content {
		flex: 1;
		z-index: 2;
		display: flex;
		flex-direction: column;
	}

	.tool-name {
		margin-bottom: var(--space-1-5);
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--color-heading-1);
		line-height: 1.3;
		transition: color 0.2s ease;
	}

	.tool-card:hover .tool-name {
		color: var(--tool-color);
	}

	.tool-description {
		font-size: var(--text-sm);
		line-height: 1.55;
		color: var(--color-description-2);
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* Chains */
	.chains {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-1-5);
		margin-top: var(--space-3);
	}

	.chain-tag {
		padding: var(--space-1) var(--space-2);
		background: var(--color-panel-2);
		border-radius: var(--radius-sm);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		color: var(--color-description-2);
		line-height: 1;
	}

	:global(.light) .chain-tag {
		background: var(--color-panel-1);
	}

	.chain-tag.more {
		background: color-mix(in srgb, var(--tool-color) 15%, transparent);
		color: var(--tool-color);
	}

	/* Footer */
	.card-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: auto;
		padding-top: var(--space-3);
		border-top: 1px solid var(--color-panel-border-1);
		z-index: 2;
	}

	:global(.light) .card-footer {
		border-top-color: var(--color-panel-border-2);
	}

	.category-badge {
		padding: var(--space-1) var(--space-2-5);
		background: color-mix(in srgb, var(--category-color) 12%, transparent);
		border-radius: var(--radius-md);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		color: var(--category-color);
		line-height: 1.4;
	}

	.visit-link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-description-3);
		transition: all 0.2s ease;
	}

	.tool-card:hover .visit-link {
		color: var(--tool-color);
	}

	:global(.external-icon) {
		width: 14px;
		height: 14px;
		transition: transform 0.2s ease;
	}

	.tool-card:hover :global(.external-icon) {
		transform: translate(2px, -2px);
	}

	:global(.arrow-icon) {
		width: 14px;
		height: 14px;
		transition: transform 0.2s ease;
	}

	.tool-card:hover :global(.arrow-icon) {
		transform: translateX(3px);
	}

	@media (max-width: 768px) {
		.tool-card {
			padding: var(--space-4);
			min-height: 180px;
		}

		.icon-wrapper {
			width: 36px;
			height: 36px;
		}

		:global(.tool-icon) {
			width: 18px;
			height: 18px;
		}

		.tool-name {
			font-size: var(--text-sm);
		}

		.tool-description {
			font-size: var(--text-xs);
			-webkit-line-clamp: 2;
			line-clamp: 2;
		}

		.chains {
			margin-top: var(--space-2);
		}

		.chain-tag {
			font-size: 10px;
			padding: var(--space-0-5) var(--space-1-5);
		}

		.card-footer {
			padding-top: var(--space-2);
		}

		.category-badge {
			font-size: 10px;
			padding: var(--space-0-5) var(--space-2);
		}

		.visit-link {
			font-size: var(--text-xs);
		}

		:global(.external-icon) {
			width: 12px;
			height: 12px;
		}
	}
</style>
