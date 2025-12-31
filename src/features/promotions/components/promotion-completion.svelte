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
	const title = $derived(i18n.t((titleKey ?? 'promotions.completion_title') as any));
</script>

{#if promotions.length > 0}
	<section class="promotion-completion">
		<h4 class="promotion-completion__title">
			<Sparkles class="promotion-completion__icon" />
			<span>{title}</span>
		</h4>
		<div class="promotion-completion__grid">
			{#each promotions as promotion, index (promotion.tool.id)}
				<PromotionCard {promotion} {index} />
			{/each}
		</div>
	</section>
{/if}

<style>
	.promotion-completion {
		margin-top: var(--space-6);
		padding: var(--space-5);
		background: var(--color-panel-1);
		border: 1px solid var(--color-brand-muted, oklch(0.6 0.15 250 / 0.3));
		border-radius: var(--radius-xl);
	}

	:global(.light) .promotion-completion {
		background: var(--color-panel-2);
	}

	.promotion-completion__title {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin: 0 0 var(--space-4) 0;
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--color-heading-1);
	}

	:global(.promotion-completion__icon) {
		width: 18px;
		height: 18px;
		color: var(--color-brand, oklch(0.65 0.2 250));
	}

	.promotion-completion__grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-3);
	}

	@media (max-width: 600px) {
		.promotion-completion {
			padding: var(--space-4);
		}

		.promotion-completion__title {
			font-size: var(--text-sm);
			margin-bottom: var(--space-3);
		}

		.promotion-completion__grid {
			grid-template-columns: 1fr;
		}
	}
</style>
