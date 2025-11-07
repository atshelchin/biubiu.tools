<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import { getAllNFTStandards } from '../../utils/nft-standards';
	import { step2State } from '../../stores/step2-state.svelte';
	import NFTStandardCard from '../components/nft-standard-card.svelte';
	import type { NFTStandard } from '../../types/nft';

	const i18n = useI18n();
	const standards = getAllNFTStandards();

	function handleSelectStandard(standardId: NFTStandard) {
		step2State.selectedStandard = standardId;
	}
</script>

<div class="step-content">
	<StepContentHeader
		title={i18n.t('tools.nft_deployer.step2.content.title')}
		description={i18n.t('tools.nft_deployer.step2.content.description')}
	/>

	<div class="standards-grid">
		{#each standards as standard (standard.id)}
			<NFTStandardCard
				{standard}
				selected={step2State.selectedStandard === standard.id}
				onclick={() => handleSelectStandard(standard.id)}
			/>
		{/each}
	</div>

	{#if step2State.selectedStandard}
		<div class="selection-confirmation">
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
				<polyline points="22 4 12 14.01 9 11.01" />
			</svg>
			<span>{i18n.t('tools.nft_deployer.step2.content.selected_confirmation')}</span>
		</div>
	{/if}
</div>

<style>
	.step-content {
		padding: var(--space-6);
	}

	.standards-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		gap: var(--space-6);
		margin-top: var(--space-6);
	}

	.selection-confirmation {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-3);
		margin-top: var(--space-8);
		padding: var(--space-4);
		background: hsla(142, 71%, 45%, 0.1);
		border: 1px solid var(--green-500);
		border-radius: var(--radius-md);
		color: var(--green-700);
		font-size: var(--text-base);
		font-weight: var(--font-medium);
	}

	.selection-confirmation svg {
		color: var(--green-600);
	}

	:global([data-theme='dark']) .selection-confirmation {
		background: hsla(142, 71%, 45%, 0.15);
		color: var(--green-400);
	}

	@media (max-width: 768px) {
		.standards-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 640px) {
		.step-content {
			padding: var(--space-3);
		}
	}
</style>
