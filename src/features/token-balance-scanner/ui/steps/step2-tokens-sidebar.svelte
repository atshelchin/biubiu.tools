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
	title="Select Tokens"
	description="Choose which tokens to scan across wallets"
>
	<WalletConnectionStatus
		showChangeButton={true}
		onChangeWallet={goBackToStep1}
		class="wallet-status-section"
	/>

	<div class="info-box">
		<p class="info-text">
			Select the tokens you want to scan. You can choose native tokens (ETH, MATIC, etc.) and any
			ERC-20 tokens available on the network.
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
