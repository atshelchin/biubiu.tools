<script lang="ts">
	import { ExternalLink } from '@lucide/svelte';
	import { useI18n } from '@shelchin/i18n/svelte';
	import type { ExternalTool } from '../types';
	import { getCategoryById } from '../data/tools-data';

	interface Props {
		tool: ExternalTool;
		index: number;
	}

	let { tool, index }: Props = $props();

	const i18n = useI18n();
	const Icon = tool.icon;
	const category = $derived(getCategoryById(tool.category));
</script>

<a
	href={tool.url}
	target="_blank"
	rel="noopener noreferrer"
	class="tool-card"
	style="--index: {index}; --tool-color: {tool.color}"
>
	<!-- Card background -->
	<div class="card-bg"></div>
	<div class="card-glow"></div>

	<!-- Icon -->
	<div class="icon-wrapper">
		<div class="icon-glow"></div>
		<div class="icon-box">
			<Icon class="tool-icon" />
		</div>
	</div>

	<!-- Content -->
	<div class="content">
		<h3 class="tool-name">{tool.name}</h3>
		<p class="tool-description">{i18n.t(tool.descriptionKey)}</p>

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
				{i18n.t(category.labelKey)}
			</span>
		{/if}
		<span class="visit-link">
			<span>{i18n.t('chain_tools.visit')}</span>
			<ExternalLink class="external-icon" />
		</span>
	</div>
</a>

<style>
	.tool-card {
		position: relative;
		display: flex;
		flex-direction: column;
		padding: var(--space-6);
		border-radius: var(--radius-xl);
		text-decoration: none;
		cursor: pointer;
		transition: all 0.2s ease;
		animation: fadeUp 0.4s calc(var(--index) * 0.05s) both;
		min-height: 220px;
	}

	@keyframes fadeUp {
		from {
			opacity: 0;
			transform: translateY(16px);
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
		transition: all 0.2s ease;
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
		transform: translateY(-4px);
	}

	.tool-card:hover .card-bg {
		background: var(--color-panel-2);
		border-color: var(--color-panel-border-3);
		box-shadow:
			0 10px 20px -5px rgb(0 0 0 / 0.1),
			0 4px 6px -4px rgb(0 0 0 / 0.05);
	}

	:global(.light) .tool-card:hover .card-bg {
		background: var(--color-panel-3);
	}

	.tool-card:hover .card-glow {
		opacity: 0.15;
	}

	/* Icon */
	.icon-wrapper {
		position: relative;
		width: 44px;
		height: 44px;
		margin-bottom: var(--space-4);
		z-index: 2;
	}

	.icon-glow {
		position: absolute;
		inset: -8px;
		background: radial-gradient(circle, var(--tool-color), transparent 60%);
		opacity: 0.15;
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
			color-mix(in srgb, var(--tool-color) 80%, black)
		);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-sm);
		transition: all 0.2s ease;
	}

	.tool-card:hover .icon-box {
		transform: translateY(-2px) scale(1.05);
		box-shadow: var(--shadow-md);
	}

	:global(.tool-icon) {
		width: 22px;
		height: 22px;
		color: white;
	}

	/* Content */
	.content {
		flex: 1;
		z-index: 2;
	}

	.tool-name {
		margin-bottom: var(--space-2);
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--color-heading-1);
		line-height: 1.3;
	}

	.tool-description {
		font-size: var(--text-sm);
		line-height: 1.5;
		color: var(--color-description-3);
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* Chains */
	.chains {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-1);
		margin-top: var(--space-3);
	}

	.chain-tag {
		padding: var(--space-0-5) var(--space-2);
		background: var(--color-panel-2);
		border-radius: var(--radius-sm);
		font-size: 10px;
		font-weight: var(--font-medium);
		color: var(--color-description-2);
	}

	:global(.light) .chain-tag {
		background: var(--color-panel-1);
	}

	.chain-tag.more {
		background: var(--color-panel-muted);
		color: var(--color-description-3);
	}

	/* Footer */
	.card-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: var(--space-4);
		padding-top: var(--space-4);
		border-top: 1px solid var(--color-panel-border-1);
		z-index: 2;
	}

	:global(.light) .card-footer {
		border-top-color: var(--color-panel-border-2);
	}

	.category-badge {
		padding: var(--space-1) var(--space-2);
		background: color-mix(in srgb, var(--category-color) 15%, transparent);
		border-radius: var(--radius-sm);
		font-size: 11px;
		font-weight: var(--font-semibold);
		color: var(--category-color);
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	.visit-link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-description-2);
		transition: all 0.15s ease;
	}

	.tool-card:hover .visit-link {
		color: var(--color-primary);
	}

	:global(.external-icon) {
		width: 14px;
		height: 14px;
		transition: transform 0.15s ease;
	}

	.tool-card:hover :global(.external-icon) {
		transform: translate(2px, -2px);
	}

	@media (max-width: 768px) {
		.tool-card {
			padding: var(--space-5);
			min-height: 200px;
		}

		.icon-wrapper {
			width: 40px;
			height: 40px;
		}

		:global(.tool-icon) {
			width: 20px;
			height: 20px;
		}

		.tool-name {
			font-size: var(--text-sm);
		}

		.tool-description {
			font-size: var(--text-xs);
		}
	}
</style>
