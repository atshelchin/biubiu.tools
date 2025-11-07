<script lang="ts">
	import { step3State } from '@/features/token-sweep/stores/step3-state.svelte';
	import { step4State } from '@/features/token-sweep/stores/step4-state.svelte';
	import StepSidebar from '@/features/token-sweep/ui/components/step-sidebar.svelte';
	import StepSummary from '@/features/token-sweep/ui/components/step-summary.svelte';

	// Derived from Step 3 (selected tokens)
	let selectedTokenCount = $derived(step3State.getSelectedCount());

	// Derived from Step 4 (imported wallets)
	let importedWallets = $derived(step4State.importedWallets);
	let walletsWithBalance = $derived(step4State.getWalletsWithBalance());
	let hasScanned = $derived(step4State.hasScanned);
	let walletCount = $derived(importedWallets.length);
	let walletWithBalanceCount = $derived(walletsWithBalance.length);
	let batchCount = $derived(Math.ceil(walletCount / 100));
</script>

<StepSidebar stepNumber={5} title="Confirm Sweep" description="Review and execute">
	<StepSummary title="Summary">
		<div class="summary-item">
			<span>Selected Tokens:</span>
			<strong>{selectedTokenCount}</strong>
		</div>
		<div class="summary-item">
			<span>Total Wallets:</span>
			<strong>{walletCount}</strong>
		</div>
		{#if hasScanned}
			<div class="summary-item">
				<span>With Balance:</span>
				<strong class="balance-highlight">{walletWithBalanceCount}</strong>
			</div>
		{/if}
		<div class="summary-item">
			<span>Batches:</span>
			<strong>{batchCount}</strong>
		</div>
	</StepSummary>
</StepSidebar>

<style>
	.balance-highlight {
		color: #10b981;
	}
</style>
