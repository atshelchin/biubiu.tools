<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import { Droplets, ExternalLink } from '@lucide/svelte';

	interface Props {
		faucets: string[];
	}

	let { faucets }: Props = $props();

	const i18n = useI18n();

	// Extract domain from URL for display
	function getDomain(url: string): string {
		try {
			return new URL(url).hostname;
		} catch {
			return url;
		}
	}
</script>

{#if faucets.length > 0}
	<section class="faucets-section">
		<h2 class="section-title">
			<Droplets class="icon" />
			{i18n.t('chains.faucets')}
		</h2>
		<p class="section-description">{i18n.t('chains.faucets_description')}</p>
		<div class="faucets-grid">
			{#each faucets as faucet, index (faucet)}
				<a
					href={faucet}
					target="_blank"
					rel="noopener noreferrer"
					class="faucet-card"
					style="--index: {index}"
				>
					<Droplets class="faucet-icon" />
					<span class="faucet-url">{getDomain(faucet)}</span>
					<ExternalLink class="external-icon" />
				</a>
			{/each}
		</div>
	</section>
{/if}

<style>
	.faucets-section {
		margin-top: var(--space-8);
	}

	.section-title {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--color-heading-1);
		margin: 0 0 var(--space-2) 0;
	}

	.section-title :global(.icon) {
		width: 20px;
		height: 20px;
		color: #3b82f6;
	}

	.section-description {
		font-size: var(--text-sm);
		color: var(--color-description-3);
		margin: 0 0 var(--space-4) 0;
	}

	.faucets-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		gap: var(--space-3);
	}

	.faucet-card {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-4);
		background: color-mix(in srgb, #3b82f6 8%, var(--color-panel-1));
		border: 1px solid color-mix(in srgb, #3b82f6 20%, var(--color-panel-border-2));
		border-radius: var(--radius-lg);
		text-decoration: none;
		transition: all 0.2s ease;
		animation: fadeIn 0.3s calc(var(--index) * 0.05s) both;
	}

	.faucet-card:hover {
		background: color-mix(in srgb, #3b82f6 15%, var(--color-panel-2));
		border-color: #3b82f6;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px color-mix(in srgb, #3b82f6 20%, transparent);
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

	.faucet-card :global(.faucet-icon) {
		flex-shrink: 0;
		width: 20px;
		height: 20px;
		color: #3b82f6;
	}

	.faucet-url {
		flex: 1;
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-heading-2);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.faucet-card :global(.external-icon) {
		flex-shrink: 0;
		width: 14px;
		height: 14px;
		color: var(--color-description-3);
		transition: all 0.2s ease;
	}

	.faucet-card:hover :global(.external-icon) {
		color: #3b82f6;
		transform: translate(2px, -2px);
	}

	@media (max-width: 640px) {
		.faucets-grid {
			grid-template-columns: 1fr;
		}

		.faucet-card {
			padding: var(--space-3);
		}
	}
</style>
