<script lang="ts">
	import { useI18n } from '@shelchin/i18n';
	import { Search, ExternalLink } from '@lucide/svelte';
	import type { Explorer } from '../types';

	interface Props {
		explorers: Explorer[];
	}

	let { explorers }: Props = $props();

	const i18n = useI18n();
</script>

{#if explorers.length > 0}
	<section class="explorers-section">
		<h2 class="section-title">
			<Search class="icon" />
			{i18n.t('routes/chains.block_explorers')}
		</h2>
		<div class="explorers-grid">
			{#each explorers as explorer, index (explorer.url)}
				<a
					href={explorer.url}
					target="_blank"
					rel="noopener noreferrer"
					class="explorer-card"
					style="--index: {index}"
				>
					<div class="explorer-info">
						<span class="explorer-name">{explorer.name}</span>
						<span class="explorer-url">{explorer.url.replace(/^https?:\/\//, '')}</span>
					</div>
					<ExternalLink class="icon" />
				</a>
			{/each}
		</div>
	</section>
{/if}

<style>
	.explorers-section {
		margin-top: var(--space-8);
	}

	.section-title {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--color-heading-1);
		margin: 0 0 var(--space-4) 0;
	}

	.section-title :global(.icon) {
		width: 20px;
		height: 20px;
		color: var(--color-description-3);
	}

	.explorers-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: var(--space-3);
	}

	.explorer-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-lg);
		text-decoration: none;
		transition: all 0.2s ease;
		animation: fadeIn 0.3s calc(var(--index) * 0.05s) both;
	}

	:global(.light) .explorer-card {
		background: var(--color-panel-2);
	}

	.explorer-card:hover {
		background: var(--color-panel-2);
		border-color: #8b5cf6;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgb(0 0 0 / 0.08);
	}

	:global(.light) .explorer-card:hover {
		background: var(--color-panel-3);
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

	.explorer-info {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		min-width: 0;
	}

	.explorer-name {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--color-heading-1);
		text-transform: capitalize;
	}

	.explorer-url {
		font-size: var(--text-xs);
		color: var(--color-description-3);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.explorer-card :global(.icon) {
		flex-shrink: 0;
		width: 16px;
		height: 16px;
		color: var(--color-description-3);
		transition: all 0.2s ease;
	}

	.explorer-card:hover :global(.icon) {
		color: #8b5cf6;
		transform: translate(2px, -2px);
	}

	@media (max-width: 640px) {
		.explorers-grid {
			grid-template-columns: 1fr;
		}

		.explorer-card {
			padding: var(--space-3);
		}
	}
</style>
