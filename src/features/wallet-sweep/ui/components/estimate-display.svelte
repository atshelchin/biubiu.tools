<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import { slide } from 'svelte/transition';

	interface EstimateData {
		totalTransactions: number;
		estimatedGas: bigint;
		estimatedCost: bigint;
	}

	interface Props {
		showEstimate: boolean;
		estimateData: EstimateData | null;
	}

	let { showEstimate, estimateData }: Props = $props();
	const i18n = useI18n();
</script>

{#if showEstimate && estimateData}
	<div class="estimate-card" transition:slide>
		<h4>{i18n.t('tools.token_sweep.step5.content.estimate.title')}</h4>
		<div class="estimate-row">
			<span>{i18n.t('tools.token_sweep.step5.content.estimate.total_transactions')}</span>
			<strong>{estimateData.totalTransactions}</strong>
		</div>
		<div class="estimate-row">
			<span>{i18n.t('tools.token_sweep.step5.content.estimate.estimated_gas')}</span>
			<strong
				>{i18n.t('tools.token_sweep.step5.content.estimate.gas_units', {
					amount: estimateData.estimatedGas.toString()
				})}</strong
			>
		</div>
		<div class="estimate-row">
			<span>{i18n.t('tools.token_sweep.step5.content.estimate.estimated_cost')}</span>
			<strong
				>{i18n.t('tools.token_sweep.step5.content.estimate.cost_eth', {
					amount: (Number(estimateData.estimatedCost) / 1e18).toFixed(6)
				})}</strong
			>
		</div>
	</div>
{/if}

<style>
	.estimate-card {
		background: linear-gradient(135deg, var(--color-panel-1) 0%, var(--color-panel-2) 100%);
		border: 2px solid var(--color-primary);
		border-radius: var(--radius-lg);
		padding: var(--space-4);
		margin-bottom: var(--space-4);
	}

	.estimate-card h4 {
		margin: 0 0 var(--space-3) 0;
		font-size: var(--text-lg);
		color: var(--color-heading-1);
	}

	.estimate-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-2) 0;
		border-bottom: 1px solid var(--color-border);
		font-size: var(--text-sm);
	}

	.estimate-row:last-child {
		border-bottom: none;
	}

	.estimate-row span {
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .estimate-row span {
		color: var(--gray-400);
	}

	.estimate-row strong {
		color: var(--color-heading-1);
		font-weight: var(--font-semibold);
	}
</style>
