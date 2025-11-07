<script lang="ts">
	import WalletConnectionStatus from '@/lib/components/ui/wallet-connection-status.svelte';
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import { step3State } from '@/features/token-distribution/stores/step3-state.svelte';
	import { step4State } from '@/features/token-distribution/stores/step4-state.svelte';
	import { calculateTotalAmount } from '@/features/token-distribution/utils/distribution-builder';
	import { useConnectStore } from '$lib/stores/connect.svelte';

	const stepManager = useStepManager();
	const connectStore = useConnectStore();

	const totalAmount = $derived(() => {
		if (!step3State.selectedToken || !connectStore.address || !connectStore.currentChainId)
			return '0';
		const config = {
			sourceWallet: connectStore.address,
			token: step3State.selectedToken,
			amountMode: step3State.amountMode,
			amountPerRecipient: step3State.amountPerRecipient,
			recipients: step4State.recipients,
			chainId: connectStore.currentChainId
		};
		return calculateTotalAmount(config);
	});

	function goBackToStep1() {
		stepManager.goTo(1);
	}
</script>

<StepSidebar stepNumber={5} title="Review & Execute" description="Confirm and execute distribution">
	<WalletConnectionStatus
		showChangeButton={true}
		onChangeWallet={goBackToStep1}
		class="wallet-status-section"
	/>

	<div class="summary-box">
		<h4>Distribution Summary</h4>
		<div class="summary-item">
			<span class="label">Token:</span>
			<span class="value">{step3State.selectedToken?.symbol || 'N/A'}</span>
		</div>
		<div class="summary-item">
			<span class="label">Recipients:</span>
			<span class="value">{step4State.totalRecipients}</span>
		</div>
		<div class="summary-item">
			<span class="label">Total Amount:</span>
			<span class="value">{totalAmount()} {step3State.selectedToken?.symbol}</span>
		</div>
	</div>
</StepSidebar>

<style>
	:global(.wallet-status-section) {
		margin: var(--space-4) 0;
	}

	.summary-box {
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: var(--color-panel-1);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
	}

	.summary-box h4 {
		margin: 0 0 var(--space-3) 0;
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .summary-box h4 {
		color: var(--gray-100);
	}

	.summary-item {
		display: flex;
		justify-content: space-between;
		padding: var(--space-2) 0;
		border-bottom: 1px solid var(--color-border);
	}

	.summary-item:last-child {
		border-bottom: none;
	}

	.label {
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .label {
		color: var(--gray-400);
	}

	.value {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .value {
		color: var(--gray-100);
	}
</style>
