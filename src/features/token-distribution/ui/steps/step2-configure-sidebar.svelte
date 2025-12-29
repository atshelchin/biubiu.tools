<script lang="ts">
	/**
	 * Token Distribution Step 2: Dependency Check Sidebar
	 * Uses shared DependencyCheckSidebar component with wallet status
	 */
	import { DependencyCheckSidebar } from '$lib/components/step/dependency-check';
	import { step2State } from '@/features/token-distribution/stores/step2-state.svelte';
	import WalletConnectionStatus from '@/lib/components/ui/wallet-connection-status.svelte';
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';

	const stepManager = useStepManager();

	// Use $derived to get reactive value from step2State
	const summary = $derived(step2State.summary);

	function goBackToStep1() {
		stepManager.goTo(1);
	}
</script>

<DependencyCheckSidebar {summary}>
	<div class="wallet-section">
		<WalletConnectionStatus showChangeButton={true} onChangeWallet={goBackToStep1} />
	</div>

	<div class="info-box">
		<p class="info-text">
			Ensure your wallet has sufficient balance of the token you want to distribute, plus enough gas
			for transaction fees.
		</p>
	</div>
</DependencyCheckSidebar>

<style>
	.wallet-section {
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
