<script lang="ts">
	import WalletConnectionStatus from '@/lib/components/ui/wallet-connection-status.svelte';
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';

	const stepManager = useStepManager();

	function goBackToStep1() {
		stepManager.goTo(1);
	}
</script>

<StepSidebar
	stepNumber={3}
	title="Select Token & Amount"
	description="Choose which token to distribute and set amounts"
>
	<WalletConnectionStatus
		showChangeButton={true}
		onChangeWallet={goBackToStep1}
		class="wallet-status-section"
	/>

	<div class="help-box">
		<h4>Distribution Modes</h4>
		<div class="mode-info">
			<strong>Equal Distribution:</strong> Send the same amount to all recipients
		</div>
		<div class="mode-info">
			<strong>Custom Amounts:</strong> Set individual amounts for each recipient (configured in Step
			4)
		</div>
	</div>
</StepSidebar>

<style>
	:global(.wallet-status-section) {
		margin: var(--space-4) 0;
	}

	.help-box {
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: var(--color-panel-1);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
	}

	.help-box h4 {
		margin: 0 0 var(--space-3) 0;
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .help-box h4 {
		color: var(--gray-100);
	}

	.mode-info {
		font-size: var(--text-sm);
		color: var(--gray-700);
		line-height: 1.6;
		margin-bottom: var(--space-2);
	}

	:global([data-theme='dark']) .mode-info {
		color: var(--gray-300);
	}

	.mode-info strong {
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .mode-info strong {
		color: var(--gray-100);
	}
</style>
