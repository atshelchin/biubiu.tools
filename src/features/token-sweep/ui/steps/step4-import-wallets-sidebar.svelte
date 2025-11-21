<script lang="ts">
	import { fade } from 'svelte/transition';
	import { step4State } from '@/features/token-sweep/stores/step4-state.svelte';
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
	import StepSummary from '@/features/token-sweep/ui/components/step-summary.svelte';
	import { useI18n } from '@shelchin/i18n/svelte';

	const i18n = useI18n();

	// Derived state
	let importedWallets = $derived(step4State.importedWallets);
	let walletCount = $derived(importedWallets.length);
	let walletsWithBalance = $derived(step4State.getWalletsWithBalance().length);
	let isScanning = $derived(step4State.isScanning);
	let scanProgress = $derived(step4State.scanProgress);
	let hasScanned = $derived(step4State.hasScanned);
</script>

<StepSidebar stepNumber={4} title="" description="">
	{#if walletCount > 0}
		<div transition:fade>
			<StepSummary title={i18n.t('tools.token_sweep.step4.sidebar.title')}>
				<div class="summary-item">
					<span>{i18n.t('tools.token_sweep.step4.sidebar.total_label')}</span>
					<strong>{walletCount}</strong>
				</div>
				{#if hasScanned}
					<div class="summary-item">
						<span>{i18n.t('tools.token_sweep.step4.sidebar.with_balance_label')}</span>
						<strong class="balance-count">{walletsWithBalance}</strong>
					</div>
				{/if}
				{#if isScanning}
					<div class="summary-item">
						<span>{i18n.t('tools.token_sweep.step4.sidebar.scanning_label')}</span>
						<strong>{scanProgress}%</strong>
					</div>
				{/if}
			</StepSummary>
		</div>
	{:else}
		<p class="empty-hint">{i18n.t('tools.token_sweep.step4.sidebar.empty_hint')}</p>
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
