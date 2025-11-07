<script lang="ts">
	import WalletConnectionStatus from '@/lib/components/ui/wallet-connection-status.svelte';
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import { step4State } from '@/features/token-distribution/stores/step4-state.svelte';

	const stepManager = useStepManager();

	const totalRecipients = $derived(step4State.totalRecipients);

	function goBackToStep1() {
		stepManager.goTo(1);
	}
</script>

<StepSidebar stepNumber={4} title="Import Recipients" description="Add recipient wallet addresses">
	<WalletConnectionStatus
		showChangeButton={true}
		onChangeWallet={goBackToStep1}
		class="wallet-status-section"
	/>

	{#if totalRecipients > 0}
		<div class="recipients-summary">
			<div class="summary-item">
				<span class="summary-label">Total Recipients:</span>
				<span class="summary-value">{totalRecipients}</span>
			</div>
		</div>
	{/if}

	<div class="help-box">
		<h4>Import Methods</h4>
		<ul class="help-list">
			<li>Manually add addresses one by one</li>
			<li>Paste multiple addresses (one per line)</li>
			<li>Upload CSV file with addresses</li>
		</ul>
	</div>
</StepSidebar>

<style>
	:global(.wallet-status-section) {
		margin: var(--space-4) 0;
	}

	.recipients-summary {
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: var(--color-panel-1);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
	}

	.summary-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.summary-label {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .summary-label {
		color: var(--gray-300);
	}

	.summary-value {
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .summary-value {
		color: var(--gray-100);
	}

	.help-box {
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: var(--color-panel-1);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
	}

	.help-box h4 {
		margin: 0 0 var(--space-2) 0;
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .help-box h4 {
		color: var(--gray-100);
	}

	.help-list {
		margin: 0;
		padding-left: var(--space-4);
		font-size: var(--text-sm);
		color: var(--gray-700);
		line-height: 1.6;
	}

	:global([data-theme='dark']) .help-list {
		color: var(--gray-300);
	}

	.help-list li {
		margin-bottom: var(--space-1);
	}
</style>
