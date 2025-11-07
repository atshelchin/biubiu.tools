<script lang="ts">
	import WalletConnectionStatus from '@/lib/components/ui/wallet-connection-status.svelte';
	import StepSidebar from '../components/step-sidebar.svelte';
	import { step2State } from '../stores/step2-state.svelte';
	import type { StepManager } from '@/lib/components/ui/step-indicator.svelte';

	interface Props {
		stepManager?: StepManager;
	}

	let { stepManager }: Props = $props();

	// Use $derived for easier access in template
	let summary = $derived(step2State.summary);

	// Go back to step 1
	function goBackToStep1() {
		if (stepManager) {
			stepManager.goTo(1);
		}
	}
</script>

<StepSidebar
	stepNumber={2}
	title="Check Dependencies"
	description="Verify network services and contracts"
>
	<WalletConnectionStatus
		showChangeButton={true}
		onChangeWallet={goBackToStep1}
		class="wallet-status-section"
	/>

	{#if summary}
		<div class="check-summary">
			<div class="summary-item">
				<span class="summary-label">Total Checks:</span>
				<span class="summary-value">{summary.total}</span>
			</div>
			<div class="summary-item success">
				<span class="summary-label">Passed:</span>
				<span class="summary-value">{summary.passed}</span>
			</div>
			{#if summary.failed > 0}
				<div class="summary-item error">
					<span class="summary-label">Failed:</span>
					<span class="summary-value">{summary.failed}</span>
				</div>
			{/if}
		</div>
	{/if}
</StepSidebar>

<style>
	/* Wallet Status Section */
	:global(.wallet-status-section) {
		margin: var(--space-4) 0;
	}

	/* Check Summary (Sidebar) */
	.check-summary {
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: var(--color-panel-1);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.summary-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-2);
		border-radius: var(--radius-sm);
		background: var(--gray-50);
	}

	:global([data-theme='dark']) .summary-item {
		background: var(--gray-800);
	}

	.summary-item.success {
		background: hsla(120, 60%, 95%, 1);
		border: 1px solid hsla(120, 60%, 80%, 1);
	}

	:global([data-theme='dark']) .summary-item.success {
		background: hsla(120, 60%, 15%, 0.3);
		border-color: hsla(120, 60%, 25%, 1);
	}

	.summary-item.error {
		background: hsla(0, 80%, 95%, 1);
		border: 1px solid hsla(0, 80%, 80%, 1);
	}

	:global([data-theme='dark']) .summary-item.error {
		background: hsla(0, 80%, 15%, 0.3);
		border-color: hsla(0, 80%, 25%, 1);
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
		font-size: var(--text-base);
		font-weight: var(--font-bold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .summary-value {
		color: var(--gray-100);
	}
</style>
