<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import { Lock, MessageCircle, ArrowRight } from '@lucide/svelte';
	import ToolStatusBadge from '$lib/components/ui/tool-status-badge.svelte';
	import type { Component } from 'svelte';

	interface Props {
		icon: Component;
		title: string;
		description: string;
		link?: string;
		status: 'active' | 'coming-soon';
		color: string;
		features?: string[];
		stage?: 'coming-soon' | 'alpha' | 'beta' | 'stable' | 'new';
		index: number;
		telegramLink: string;
		hidden?: boolean;
	}

	let {
		icon: Icon,
		title,
		description,
		link,
		status,
		color,
		features,
		stage,
		index,
		telegramLink,
		hidden = false
	}: Props = $props();

	const i18n = useI18n();
	const t = i18n.t;

	function joinTelegramGroup() {
		window.open(telegramLink, '_blank');
	}
</script>

<article
	class="tool-card {status === 'coming-soon' ? 'coming-soon' : ''}"
	class:visually-hidden={hidden}
	style="--index: {index}; --tool-color: {color};"
	aria-hidden={hidden ? 'true' : undefined}
>
	<!-- Card glow effect -->
	<div class="card-glow"></div>

	<!-- Glass morphism background -->
	<div class="card-bg"></div>

	{#if status === 'coming-soon'}
		<div class="status-ribbon">
			<Lock class="ribbon-icon" />
			<span>{t('tools.coming_soon')}</span>
		</div>
	{:else if stage}
		<ToolStatusBadge status={stage} />
	{/if}

	<!-- Premium icon with animation -->
	<div class="icon-wrapper">
		<div class="icon-glow"></div>
		<div class="icon-box">
			<Icon class="tool-icon" />
		</div>
	</div>

	<!-- Content with better typography -->
	<div class="content-wrapper">
		<h3 class="tool-title">{title}</h3>
		<p class="tool-description">{description}</p>

		<!-- Premium feature pills -->
		{#if features && features.length > 0}
			<div class="features-list">
				{#each features as feature (feature)}
					<div class="feature-pill">
						<span class="pill-dot"></span>
						<span>{feature}</span>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Premium action button -->
	<div class="action-wrapper">
		{#if status === 'active' && link}
			{#if link === telegramLink}
				<button class="action-btn telegram" onclick={joinTelegramGroup}>
					<MessageCircle class="btn-icon" />
					<span class="btn-text">{t('tools.join_telegram')}</span>
				</button>
			{:else}
				<a href={link} class="action-btn primary">
					<span class="btn-text">{t('tools.launch_app')}</span>
					<ArrowRight class="btn-arrow" />
				</a>
			{/if}
		{:else}
			<button class="action-btn telegram" onclick={joinTelegramGroup}>
				<MessageCircle class="btn-icon" />
				<span class="btn-text">{t('tools.join_telegram')}</span>
			</button>
		{/if}
	</div>
</article>

<style>
	/* Card with proper layer hierarchy - more compact */
	.tool-card {
		position: relative;
		display: flex;
		flex-direction: column;
		padding: var(--space-8);
		border-radius: var(--radius-xl);
		transition: all 200ms ease;
		animation: fadeUp 0.5s calc(var(--index) * 0.08s) both;
		cursor: default;
		min-height: 380px;
	}

	@keyframes fadeUp {
		from {
			opacity: 0;
			transform: translateY(24px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Card background with panel hierarchy */
	.card-bg {
		position: absolute;
		inset: 0;
		border-radius: var(--radius-xl);
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-2);
		z-index: 1;
		box-shadow:
			0 1px 3px 0 rgb(0 0 0 / 0.05),
			0 1px 2px -1px rgb(0 0 0 / 0.05);
		transition: all 200ms ease;
	}

	/* Light mode specific enhancements */
	:global(.light) .card-bg {
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-2);
		box-shadow:
			0 4px 6px -1px rgb(0 0 0 / 0.05),
			0 2px 4px -2px rgb(0 0 0 / 0.05);
	}

	.card-glow {
		position: absolute;
		inset: -1px;
		border-radius: var(--radius-xl);
		background: radial-gradient(circle at 50% 0%, var(--brand-100), transparent 70%);
		opacity: 0;
		transition: opacity 300ms ease;
	}

	.tool-card:hover .card-glow {
		opacity: 0.5;
	}

	.tool-card:hover {
		transform: translateY(-4px);
	}

	.tool-card:hover .card-bg {
		background: var(--color-panel-2);
		border-color: var(--color-panel-border-3);
		box-shadow:
			0 10px 15px -3px rgb(0 0 0 / 0.1),
			0 4px 6px -4px rgb(0 0 0 / 0.05);
	}

	:global(.light) .tool-card:hover .card-bg {
		background: var(--color-panel-3);
		border-color: var(--color-panel-border-3);
		box-shadow:
			0 12px 20px -5px rgb(0 0 0 / 0.08),
			0 6px 8px -4px rgb(0 0 0 / 0.04);
	}

	/* Coming soon ribbon */
	.status-ribbon {
		position: absolute;
		top: var(--space-6);
		right: var(--space-6);
		display: flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-1) var(--space-3);
		background: var(--color-panel-muted);
		border-radius: var(--radius-md);
		color: var(--color-warning);
		font-size: 10px;
		font-weight: var(--font-semibold);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		z-index: 10;
	}

	:global(.ribbon-icon) {
		width: 12px;
		height: 12px;
	}

	.tool-card.coming-soon {
		opacity: 0.8;
	}

	.tool-card.coming-soon:hover {
		transform: translateY(-3px);
	}

	/* Icon with clean design - more compact */
	.icon-wrapper {
		position: relative;
		width: 52px;
		height: 52px;
		margin-bottom: var(--space-6);
		z-index: 2;
	}

	.icon-glow {
		position: absolute;
		inset: -10px;
		background: radial-gradient(circle, var(--tool-color), transparent 60%);
		opacity: 0.15;
		filter: blur(10px);
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
		box-shadow: var(--shadow-md);
		transition: all 200ms ease;
	}

	:global(.light) .icon-box {
		box-shadow:
			0 4px 14px 0 color-mix(in srgb, var(--tool-color) 30%, transparent),
			0 2px 4px 0 color-mix(in srgb, var(--tool-color) 20%, transparent),
			inset 0 1px 0 0 rgb(255 255 255 / 0.2);
	}

	.tool-card:hover .icon-box {
		transform: translateY(-2px) scale(1.05);
		box-shadow: var(--shadow-lg);
	}

	:global(.tool-icon) {
		width: 24px;
		height: 24px;
		color: white;
	}

	/* Content with proper text hierarchy - more compact */
	.content-wrapper {
		flex: 1;
		z-index: 2;
		display: flex;
		flex-direction: column;
	}

	.tool-title {
		margin-bottom: var(--space-3);
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--color-heading-1);
		line-height: 1.3;
	}

	.tool-description {
		margin-bottom: var(--space-5);
		font-size: var(--text-sm);
		line-height: 1.6;
		color: var(--color-description-3);
	}

	/* Feature pills with subtle styling - more compact */
	.features-list {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		margin-top: auto;
		margin-bottom: var(--space-5);
	}

	.feature-pill {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-1) var(--space-2);
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-full);
		font-size: 11px;
		font-weight: var(--font-medium);
		color: var(--color-description-2);
		transition: all 150ms ease;
	}

	:global(.light) .feature-pill {
		background: var(--color-background);
		border: 1px solid var(--color-panel-border-2);
		color: var(--color-description-2);
	}

	.pill-dot {
		width: 4px;
		height: 4px;
		background: var(--tool-color);
		border-radius: 50%;
		opacity: 0.7;
	}

	.tool-card:hover .feature-pill {
		background: var(--color-panel-2);
		border-color: var(--color-panel-border-2);
		color: var(--color-description-1);
	}

	:global(.light) .tool-card:hover .feature-pill {
		background: var(--color-panel-1);
		border-color: var(--color-panel-border-3);
		color: var(--color-heading-3);
	}

	/* Action button with clean design - more compact */
	.action-wrapper {
		padding-top: var(--space-4);
		border-top: 1px solid var(--color-panel-border-1);
		position: relative;
		z-index: 10;
	}

	:global(.light) .action-wrapper {
		border-top: 1px solid var(--color-panel-border-2);
	}

	.action-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		width: 100%;
		padding: var(--space-3) var(--space-5);
		border-radius: var(--radius-md);
		font-weight: var(--font-semibold);
		font-size: var(--text-sm);
		transition: all 200ms ease;
		text-decoration: none;
		position: relative;
		cursor: pointer;
		z-index: 10;
	}

	/* Dark mode - subtle default, vibrant on hover */
	.action-btn.primary {
		background: var(--color-panel-2);
		color: var(--color-text-primary);
		border: 1px solid var(--color-panel-border-2);
		box-shadow: none;
	}

	.action-btn.primary:hover {
		background: linear-gradient(
			135deg,
			var(--color-primary),
			color-mix(in srgb, var(--color-primary) 85%, black)
		);
		color: white;
		border-color: var(--color-primary);
		transform: translateY(-2px);
		box-shadow:
			0 8px 20px 0 color-mix(in srgb, var(--color-primary) 40%, transparent),
			0 2px 8px 0 color-mix(in srgb, var(--color-primary) 30%, transparent);
	}

	.action-btn.primary:active {
		transform: translateY(0);
		box-shadow:
			0 4px 12px 0 color-mix(in srgb, var(--color-primary) 30%, transparent),
			0 1px 4px 0 color-mix(in srgb, var(--color-primary) 20%, transparent);
	}

	/* Light mode - clean default, bold gradient on hover */
	:global(.light) .action-btn.primary {
		background: white;
		color: var(--color-text-primary);
		border: 1px solid var(--color-border);
		box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
	}

	:global(.light) .action-btn.primary:hover {
		background: linear-gradient(
			135deg,
			var(--color-primary),
			color-mix(in srgb, var(--color-primary) 90%, black)
		);
		color: white;
		border-color: var(--color-primary);
		box-shadow:
			0 8px 24px 0 color-mix(in srgb, var(--color-primary) 35%, transparent),
			0 4px 12px 0 color-mix(in srgb, var(--color-primary) 25%, transparent);
	}

	:global(.light) .action-btn.primary:active {
		box-shadow:
			0 4px 16px 0 color-mix(in srgb, var(--color-primary) 30%, transparent),
			0 2px 8px 0 color-mix(in srgb, var(--color-primary) 20%, transparent);
	}

	:global(.btn-text) {
		transition: all 200ms ease;
	}

	:global(.btn-arrow) {
		width: 18px;
		height: 18px;
		transition: all 200ms ease;
		flex-shrink: 0;
		opacity: 0.5;
	}

	.action-btn.primary:hover :global(.btn-text) {
		letter-spacing: 0.02em;
	}

	.action-btn.primary:hover :global(.btn-arrow) {
		transform: translateX(4px);
		opacity: 1;
	}

	.action-btn.primary:active :global(.btn-arrow) {
		transform: translateX(2px);
		opacity: 0.9;
	}

	.action-btn.telegram {
		background: linear-gradient(135deg, #229ed9, #2aabee);
		color: white;
		border: none;
		cursor: pointer;
		box-shadow: var(--shadow-sm);
	}

	.action-btn.telegram:hover {
		background: linear-gradient(135deg, #1e8cc7, #2498d5);
		transform: translateY(-1px);
		box-shadow: var(--shadow-md);
	}

	:global(.btn-icon) {
		width: 18px;
		height: 18px;
	}

	/* SEO-friendly hidden cards - content remains in DOM for crawlers */
	.tool-card.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	/* Mobile adjustments */
	@media (max-width: 768px) {
		.tool-card {
			padding: var(--space-7);
			min-height: 320px;
		}

		.icon-wrapper {
			width: 48px;
			height: 48px;
			margin-bottom: var(--space-5);
		}

		:global(.tool-icon) {
			width: 22px;
			height: 22px;
		}

		.tool-title {
			font-size: 1.0625rem;
			margin-bottom: var(--space-2);
		}

		.tool-description {
			font-size: 0.9375rem;
			margin-bottom: var(--space-4);
		}

		.feature-pill {
			font-size: 0.6875rem;
			padding: 0.1875rem var(--space-2);
		}

		.action-btn {
			padding: var(--space-3) var(--space-4);
			font-size: 0.9375rem;
		}
	}
</style>
