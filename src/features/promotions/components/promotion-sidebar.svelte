<script lang="ts">
	import { Sparkles } from '@lucide/svelte';
	import { useI18n } from '@shelchin/i18n';
	import type { Promotion } from '../types';
	import PromotionCard from './promotion-card.svelte';

	interface Props {
		promotions: Promotion[];
		/** Custom title (uses i18n key or string) */
		titleKey?: string;
	}

	let { promotions, titleKey }: Props = $props();

	const i18n = useI18n();

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const title = $derived(i18n.t((titleKey ?? 'promotions.section_title') as any));
</script>

{#if promotions.length > 0}
	<aside class="promotion-sidebar">
		<h4 class="promotion-sidebar__title">
			<Sparkles class="promotion-sidebar__icon" />
			<span>{title}</span>
		</h4>
		<div class="promotion-sidebar__list">
			{#each promotions as promotion, index (promotion.tool.id)}
				<PromotionCard {promotion} {index} size="sm" />
			{/each}
		</div>
	</aside>
{/if}

<style>
	.promotion-sidebar {
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-lg);
	}

	:global(.light) .promotion-sidebar {
		background: var(--color-panel-2);
	}

	.promotion-sidebar__title {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin: 0 0 var(--space-3) 0;
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--color-heading-1);
	}

	:global(.promotion-sidebar__icon) {
		width: 16px;
		height: 16px;
		color: var(--color-brand, oklch(0.65 0.2 250));
	}

	.promotion-sidebar__list {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}
</style>
