<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import {
		ArrowRight,
		AtSign,
		Bell,
		Coins,
		FileCode,
		Image,
		KeyRound,
		LayoutGrid,
		LineChart,
		Link,
		Search,
		Send,
		Terminal,
		TrendingUp,
		Wallet
	} from '@lucide/svelte';
	import { useI18n } from '@shelchin/i18n';
	import type { Promotion } from '../types';
	import { addTrackingParams, isBrowser } from '../utils/tracking';
	import type { Component } from 'svelte';

	// Icon mapping for promotable tools
	const iconMap: Record<string, Component<{ size?: number }>> = {
		AtSign,
		Bell,
		Coins,
		FileCode,
		Image,
		KeyRound,
		LayoutGrid,
		LineChart,
		Link,
		Search,
		Send,
		Terminal,
		TrendingUp,
		Wallet
	};

	interface Props {
		promotion: Promotion;
		/** Card size variant */
		size?: 'sm' | 'md';
		/** Animation delay index */
		index?: number;
	}

	let { promotion, size = 'md', index = 0 }: Props = $props();

	const i18n = useI18n();

	// Get icon component from mapping
	const IconComponent = $derived(iconMap[promotion.tool.icon]);

	// SSR: clean URL, Client: add tracking params after hydration
	// Use derived to capture latest promotion value
	const baseHref = $derived(promotion.href);
	let trackingHref = $state<string | null>(null);
	const href = $derived(trackingHref ?? baseHref);

	onMount(() => {
		if (isBrowser()) {
			trackingHref = addTrackingParams(promotion.tool.path, {
				sourcePath: $page.url.pathname,
				placement: promotion.placement,
				locale: $page.data.locale ?? 'en'
			});
		}
	});

	// Translate tool name and description
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const toolName = $derived(i18n.t(promotion.tool.nameKey as any));
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const toolDescription = $derived(i18n.t(promotion.tool.descriptionKey as any));
</script>

<a {href} class="promotion-card promotion-card--{size}" style="--index: {index}">
	<span class="promotion-card__badge">BiuBiu</span>

	<div class="promotion-card__icon">
		{#if IconComponent}
			<IconComponent size={size === 'sm' ? 18 : 22} />
		{/if}
	</div>

	<div class="promotion-card__content">
		<h4 class="promotion-card__name">{toolName}</h4>
		{#if size === 'md'}
			<p class="promotion-card__desc">{toolDescription}</p>
		{/if}
	</div>

	<div class="promotion-card__arrow">
		<ArrowRight size={14} />
	</div>
</a>

<style>
	.promotion-card {
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-4);
		background: var(--color-panel-accent);
		border: 1px solid var(--brand-200);
		border-radius: var(--radius-lg);
		text-decoration: none;
		transition: all 0.2s ease;
		animation: fadeUp 0.3s calc(var(--index) * 0.05s) both;
	}

	@keyframes fadeUp {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.promotion-card:hover {
		background: var(--brand-100);
		border-color: var(--brand-400);
		transform: translateY(-2px);
		box-shadow: 0 4px 16px hsla(var(--brand-hue), 50%, 50%, 0.15);
	}

	:global([data-theme='dark']) .promotion-card {
		background: var(--color-panel-accent);
		border-color: hsla(var(--brand-hue), 50%, 50%, 0.3);
	}

	:global([data-theme='dark']) .promotion-card:hover {
		background: hsla(var(--brand-hue), 40%, 20%, 0.5);
		border-color: var(--brand-500);
	}

	/* Badge */
	.promotion-card__badge {
		position: absolute;
		top: -8px;
		right: var(--space-3);
		padding: var(--space-0-5) var(--space-2);
		background: var(--color-primary);
		border-radius: var(--radius-sm);
		font-size: 10px;
		font-weight: var(--font-semibold);
		color: var(--color-primary-foreground);
		line-height: 1.4;
		letter-spacing: 0.02em;
	}

	/* Icon */
	.promotion-card__icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		background: var(--brand-100);
		border-radius: var(--radius-md);
		color: var(--brand-600);
		flex-shrink: 0;
		transition: all 0.2s ease;
	}

	:global([data-theme='dark']) .promotion-card__icon {
		background: hsla(var(--brand-hue), 50%, 30%, 0.4);
		color: var(--brand-400);
	}

	.promotion-card:hover .promotion-card__icon {
		background: var(--color-primary);
		color: var(--color-primary-foreground);
	}

	/* Content */
	.promotion-card__content {
		flex: 1;
		min-width: 0;
	}

	.promotion-card__name {
		margin: 0;
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--color-heading-1);
		line-height: 1.3;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.promotion-card__desc {
		margin: var(--space-1) 0 0;
		font-size: var(--text-xs);
		color: var(--color-description-2);
		line-height: 1.4;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* Arrow */
	.promotion-card__arrow {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-description-3);
		transition: all 0.2s ease;
		flex-shrink: 0;
	}

	.promotion-card:hover .promotion-card__arrow {
		color: var(--color-primary);
		transform: translateX(3px);
	}

	/* Size variants */
	.promotion-card--sm {
		padding: var(--space-3);
		gap: var(--space-2);
	}

	.promotion-card--sm .promotion-card__icon {
		width: 32px;
		height: 32px;
	}

	.promotion-card--sm .promotion-card__badge {
		top: -6px;
		font-size: 9px;
		padding: 2px var(--space-1-5);
	}

	/* Mobile */
	@media (max-width: 640px) {
		.promotion-card {
			padding: var(--space-3);
		}

		.promotion-card__icon {
			width: 36px;
			height: 36px;
		}

		.promotion-card__name {
			font-size: var(--text-xs);
		}

		.promotion-card__desc {
			display: none;
		}
	}
</style>
