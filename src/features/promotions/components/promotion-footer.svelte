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
	<section class="promotion-footer">
		<h3 class="promotion-footer__title">
			<Sparkles class="promotion-footer__icon" />
			<span>{title}</span>
		</h3>
		<div class="promotion-footer__grid" style="--cols: {promotions.length}">
			{#each promotions as promotion, index (promotion.tool.id)}
				<PromotionCard {promotion} {index} />
			{/each}
		</div>
	</section>
{/if}

<style>
	.promotion-footer {
		margin-top: var(--space-8);
		padding-top: var(--space-6);
		border-top: 1px solid var(--color-panel-border-1);
	}

	.promotion-footer__title {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin: 0 0 var(--space-4) 0;
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--color-heading-1);
	}

	:global(.promotion-footer__icon) {
		width: 20px;
		height: 20px;
		color: var(--color-brand, oklch(0.65 0.2 250));
	}

	.promotion-footer__grid {
		display: grid;
		grid-template-columns: repeat(var(--cols, 3), 1fr);
		gap: var(--space-4);
	}

	/* Responsive grid */
	@media (max-width: 900px) {
		.promotion-footer__grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 600px) {
		.promotion-footer {
			margin-top: var(--space-6);
			padding-top: var(--space-4);
		}

		.promotion-footer__title {
			font-size: var(--text-base);
			margin-bottom: var(--space-3);
		}

		.promotion-footer__grid {
			grid-template-columns: 1fr;
			gap: var(--space-3);
		}
	}
</style>
