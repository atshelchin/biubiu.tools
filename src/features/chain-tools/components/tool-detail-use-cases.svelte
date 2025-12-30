<script lang="ts">
	import { Target, ArrowRight } from '@lucide/svelte';
	import { useI18n, type TranslationKeys } from '@shelchin/i18n';

	interface Props {
		i18nPrefix: string;
		useCaseCount: number;
	}

	let { i18nPrefix, useCaseCount }: Props = $props();

	const i18n = useI18n();

	// Build use cases list from translations
	const useCases = $derived.by(() => {
		const list: Array<{ title: string; description: string }> = [];
		for (let i = 1; i <= useCaseCount; i++) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const title = i18n.t(`${i18nPrefix}.use_cases.${i}.title` as any, { defaultValue: '' });
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const description = i18n.t(`${i18nPrefix}.use_cases.${i}.description` as any, {
				defaultValue: ''
			});
			if (title && description) {
				list.push({ title, description });
			}
		}
		return list;
	});
</script>

{#if useCases.length > 0}
	<section class="use-cases-section">
		<h2 class="section-title">
			<Target class="section-icon" />
			<span
				>{i18n.t('routes/apps/chain-tools/chain-tools.use_cases' as keyof TranslationKeys, {
					defaultValue: 'Use Cases'
				})}</span
			>
		</h2>
		<div class="use-cases-list">
			{#each useCases as useCase, index (index)}
				<div class="use-case-item" style="--delay: {index * 0.05}s">
					<div class="use-case-marker">
						<ArrowRight class="marker-icon" />
					</div>
					<div class="use-case-content">
						<h3 class="use-case-title">{useCase.title}</h3>
						<p class="use-case-description">{useCase.description}</p>
					</div>
				</div>
			{/each}
		</div>
	</section>
{/if}

<style>
	.use-cases-section {
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

	.use-cases-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		padding: var(--space-6);
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-xl);
	}

	:global(.light) .use-cases-list {
		background: var(--color-panel-2);
	}

	.use-case-item {
		display: flex;
		gap: var(--space-3);
		padding: var(--space-3);
		border-radius: var(--radius-lg);
		transition: all 0.2s ease;
		animation: slideIn 0.3s var(--delay) both;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateX(-8px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.use-case-item:hover {
		background: var(--color-panel-2);
	}

	:global(.light) .use-case-item:hover {
		background: var(--color-panel-1);
	}

	.use-case-marker {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		background: color-mix(in srgb, #3b82f6 15%, transparent);
		border-radius: var(--radius-sm);
	}

	:global(.marker-icon) {
		width: 14px;
		height: 14px;
		color: #3b82f6;
	}

	.use-case-content {
		flex: 1;
		min-width: 0;
	}

	.use-case-title {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--color-heading-1);
		margin: 0 0 var(--space-1) 0;
	}

	.use-case-description {
		font-size: var(--text-sm);
		line-height: 1.5;
		color: var(--color-description-2);
		margin: 0;
	}

	/* Mobile */
	@media (max-width: 768px) {
		.use-cases-section {
			margin-top: var(--space-6);
		}

		.section-title {
			font-size: var(--text-lg);
		}

		.use-cases-list {
			padding: var(--space-4);
			gap: var(--space-2);
		}

		.use-case-item {
			padding: var(--space-2);
		}

		.use-case-title {
			font-size: var(--text-sm);
		}

		.use-case-description {
			font-size: var(--text-xs);
		}
	}
</style>
