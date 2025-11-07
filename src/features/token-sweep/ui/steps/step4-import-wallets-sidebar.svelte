<script lang="ts">
	import { fade } from 'svelte/transition';
	import { step4State } from '../stores/step4-state.svelte';
	import StepSidebar from './components/step-sidebar.svelte';
	import StepSummary from './components/step-summary.svelte';

	// Derived state
	let importedWallets = $derived(step4State.importedWallets);
	let walletCount = $derived(importedWallets.length);
	let walletsWithBalance = $derived(step4State.getWalletsWithBalance().length);
	let isScanning = $derived(step4State.isScanning);
	let scanProgress = $derived(step4State.scanProgress);
	let hasScanned = $derived(step4State.hasScanned);
</script>

<StepSidebar stepNumber={4} title="Import Wallets" description="Add source addresses">
	{#if walletCount > 0}
		<div transition:fade>
			<StepSummary title="Imported Wallets">
				<div class="summary-item">
					<span>Total:</span>
					<strong>{walletCount}</strong>
				</div>
				{#if hasScanned}
					<div class="summary-item">
						<span>With Balance:</span>
						<strong class="balance-count">{walletsWithBalance}</strong>
					</div>
				{/if}
				{#if isScanning}
					<div class="summary-item">
						<span>Scanning:</span>
						<strong>{scanProgress}%</strong>
					</div>
				{/if}
			</StepSummary>
		</div>
	{:else}
		<p class="empty-hint">No wallets imported</p>
	{/if}
</StepSidebar>

<style>
	.empty-hint {
		margin-top: var(--space-4);
		text-align: center;
		font-size: var(--text-sm);
		color: var(--gray-500);
		font-style: italic;
	}

	.balance-count {
		color: #10b981;
	}
</style>
