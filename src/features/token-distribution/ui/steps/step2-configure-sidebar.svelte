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
	stepNumber={2}
	title="Check Source Wallet"
	description="Verify your wallet balance and connection"
>
	<WalletConnectionStatus
		showChangeButton={true}
		onChangeWallet={goBackToStep1}
		class="wallet-status-section"
	/>

	<div class="info-box">
		<p class="info-text">
			Ensure your wallet has sufficient balance of the token you want to distribute, plus enough gas
			for transaction fees.
		</p>
	</div>
</StepSidebar>

<style>
	:global(.wallet-status-section) {
		margin: var(--space-4) 0;
	}

	.info-box {
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: var(--color-panel-1);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
	}

	.info-text {
		margin: 0;
		font-size: var(--text-sm);
		color: var(--gray-700);
		line-height: 1.5;
	}

	:global([data-theme='dark']) .info-text {
		color: var(--gray-300);
	}
</style>
