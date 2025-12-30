<script lang="ts">
	import { CheckCircle, Sparkles } from '@lucide/svelte';
	import { useI18n, type TranslationKeys } from '@shelchin/i18n';

	interface Props {
		i18nPrefix: string;
		featureCount: number;
	}

	let { i18nPrefix, featureCount }: Props = $props();

	const i18n = useI18n();

	// Build features list from translations
	const features = $derived.by(() => {
		const list: Array<{ title: string; description: string }> = [];
		for (let i = 1; i <= featureCount; i++) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const title = i18n.t(`${i18nPrefix}.features.${i}.title` as any, { defaultValue: '' });
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const description = i18n.t(`${i18nPrefix}.features.${i}.description` as any, {
				defaultValue: ''
			});
			if (title && description) {
				list.push({ title, description });
			}
		}
		return list;
	});
</script>

{#if features.length > 0}
	<section class="features-section">
		<h2 class="section-title">
			<Sparkles class="section-icon" />
			<span
				>{i18n.t('routes/apps/chain-tools/chain-tools.key_features' as keyof TranslationKeys, {
					defaultValue: 'Key Features'
				})}</span
			>
		</h2>
		<div class="features-grid">
			{#each features as feature, index (index)}
				<div class="feature-card" style="--delay: {index * 0.05}s">
					<div class="feature-icon">
						<CheckCircle class="check-icon" />
					</div>
					<div class="feature-content">
						<h3 class="feature-title">{feature.title}</h3>
						<p class="feature-description">{feature.description}</p>
					</div>
				</div>
			{/each}
		</div>
	</section>
{/if}

<style>
	.features-section {
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

	.features-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-4);
	}

	.feature-card {
		display: flex;
		gap: var(--space-3);
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-lg);
		transition: all 0.2s ease;
		animation: fadeIn 0.4s var(--delay) both;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	:global(.light) .feature-card {
		background: var(--color-panel-2);
	}

	.feature-card:hover {
		border-color: var(--color-panel-border-3);
		transform: translateY(-2px);
	}

	.feature-icon {
		flex-shrink: 0;
	}

	:global(.check-icon) {
		width: 20px;
		height: 20px;
		color: #22c55e;
	}

	.feature-content {
		flex: 1;
		min-width: 0;
	}

	.feature-title {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--color-heading-1);
		margin: 0 0 var(--space-1) 0;
	}

	.feature-description {
		font-size: var(--text-sm);
		line-height: 1.5;
		color: var(--color-description-2);
		margin: 0;
	}

	/* Mobile */
	@media (max-width: 768px) {
		.features-section {
			margin-top: var(--space-6);
		}

		.section-title {
			font-size: var(--text-lg);
		}

		.features-grid {
			grid-template-columns: 1fr;
			gap: var(--space-3);
		}

		.feature-card {
			padding: var(--space-3);
		}

		.feature-title {
			font-size: var(--text-sm);
		}

		.feature-description {
			font-size: var(--text-xs);
		}
	}
</style>
