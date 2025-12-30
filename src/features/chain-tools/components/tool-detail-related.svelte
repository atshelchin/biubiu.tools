<script lang="ts">
	import { Grid3x3 } from '@lucide/svelte';
	import { useI18n } from '@shelchin/i18n';
	import type { SerializableExternalTool } from '../types';
	import ExternalToolCard from './external-tool-card.svelte';

	interface Props {
		tools: SerializableExternalTool[];
	}

	let { tools }: Props = $props();

	const i18n = useI18n();

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const sectionTitle = $derived(
		i18n.t('routes/apps/chain-tools.related_tools' as any, {
			defaultValue: 'Related Tools'
		})
	);
</script>

{#if tools.length > 0}
	<section class="related-section">
		<h2 class="section-title">
			<Grid3x3 class="section-icon" />
			<span>{sectionTitle}</span>
		</h2>
		<div class="related-grid">
			{#each tools as tool, index (tool.id)}
				<ExternalToolCard {tool} {index} />
			{/each}
		</div>
	</section>
{/if}

<style>
	.related-section {
		margin-top: var(--space-8);
	}

	.section-title {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		color: var(--color-heading-1);
		margin: 0 0 var(--space-5) 0;
	}

	:global(.section-icon) {
		width: 22px;
		height: 22px;
		color: var(--color-description-3);
	}

	.related-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-4);
	}

	/* Mobile */
	@media (max-width: 900px) {
		.related-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 600px) {
		.related-section {
			margin-top: var(--space-6);
		}

		.section-title {
			font-size: var(--text-lg);
		}

		.related-grid {
			grid-template-columns: 1fr;
			gap: var(--space-3);
		}
	}
</style>
