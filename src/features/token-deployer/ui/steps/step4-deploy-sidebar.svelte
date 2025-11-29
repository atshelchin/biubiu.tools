<script lang="ts">
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
	import StepSummary from '$lib/components/step/step-summary.svelte';
	import { step3State } from '@/features/token-deployer/stores/step3-state.svelte';

	const summaryItems = $derived([
		{
			label: 'Token Name',
			value: step3State.name || 'Not set'
		},
		{
			label: 'Symbol',
			value: step3State.symbol || 'Not set'
		},
		{
			label: 'Decimals',
			value: step3State.decimals.toString()
		},
		{
			label: 'Initial Supply',
			value: step3State.initialSupply
				? `${parseFloat(step3State.initialSupply).toLocaleString()} ${step3State.symbol}`
				: 'Not set'
		},
		{
			label: 'Features',
			value: step3State.mintable ? 'Mintable' : 'None'
		}
	]);
</script>

<StepSidebar
	stepNumber={4}
	title="Review & Deploy"
	description="Verify your token configuration and deploy"
>
	<StepSummary title="Token Summary">
		{#each summaryItems as item (item.label)}
			<div class="summary-item">
				<span>{item.label}</span>
				<strong>{item.value}</strong>
			</div>
		{/each}
	</StepSummary>

	<div class="final-note">
		<span class="note-icon">📝</span>
		<p>Please review carefully. Token properties cannot be changed after deployment.</p>
	</div>
</StepSidebar>

<style>
	.final-note {
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: hsla(210, 100%, 95%, 1);
		border-radius: var(--radius-md);
		border: 1px solid hsla(210, 100%, 80%, 1);
		display: flex;
		gap: var(--space-2);
		align-items: flex-start;
	}

	:global([data-theme='dark']) .final-note {
		background: hsla(210, 100%, 15%, 0.3);
		border-color: hsla(210, 100%, 25%, 1);
	}

	.note-icon {
		font-size: var(--text-xl);
		flex-shrink: 0;
		line-height: 1;
	}

	.final-note p {
		margin: 0;
		font-size: var(--text-sm);
		color: var(--gray-700);
		line-height: 1.5;
		font-weight: var(--font-medium);
	}

	:global([data-theme='dark']) .final-note p {
		color: var(--gray-300);
	}
</style>
