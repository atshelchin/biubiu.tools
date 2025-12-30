<script lang="ts">
	import { BookOpen } from '@lucide/svelte';
	import { useI18n, type TranslationKeys } from '@shelchin/i18n';

	interface Props {
		toolId: string;
		i18nPrefix: string;
	}

	let { toolId, i18nPrefix }: Props = $props();

	const i18n = useI18n();

	// Get overview text from translations
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const overview = $derived(i18n.t(`${i18nPrefix}.overview` as any, { defaultValue: '' }));

	// Split into paragraphs
	const paragraphs = $derived(overview.split('\n\n').filter((p: string) => p.trim()));
</script>

{#if paragraphs.length > 0}
	<section class="overview-section">
		<h2 class="section-title">
			<BookOpen class="section-icon" />
			<span
				>{i18n.t('chain-tools.about' as keyof TranslationKeys, { defaultValue: 'About' })}
				{toolId.charAt(0).toUpperCase() + toolId.slice(1)}</span
			>
		</h2>
		<div class="overview-content">
			{#each paragraphs as paragraph, index (index)}
				<p class="paragraph">{paragraph}</p>
			{/each}
		</div>
	</section>
{/if}

<style>
	.overview-section {
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

	.overview-content {
		padding: var(--space-6);
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-xl);
	}

	:global(.light) .overview-content {
		background: var(--color-panel-2);
	}

	.paragraph {
		font-size: var(--text-base);
		line-height: 1.75;
		color: var(--color-description-1);
		margin: 0;
	}

	.paragraph + .paragraph {
		margin-top: var(--space-4);
	}

	/* Mobile */
	@media (max-width: 768px) {
		.overview-section {
			margin-top: var(--space-6);
		}

		.section-title {
			font-size: var(--text-lg);
		}

		.overview-content {
			padding: var(--space-4);
		}

		.paragraph {
			font-size: var(--text-sm);
			line-height: 1.7;
		}
	}
</style>
