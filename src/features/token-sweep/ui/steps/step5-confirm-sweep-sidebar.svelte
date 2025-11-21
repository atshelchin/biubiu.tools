<script lang="ts">
	import { step3State } from '@/features/token-sweep/stores/step3-state.svelte';
	import { step4State } from '@/features/token-sweep/stores/step4-state.svelte';
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
	import StepSummary from '@/features/token-sweep/ui/components/step-summary.svelte';
	import MembershipPromo from '@/features/token-sweep/ui/components/membership-promo.svelte';
	import { useI18n } from '@shelchin/i18n/svelte';

	const i18n = useI18n();
	const connectStore = useConnectStore();

	// Derived from Step 3 (selected tokens)
	let selectedTokenCount = $derived(step3State.getSelectedCount());

	// Derived from Step 4 (imported wallets)
	let importedWallets = $derived(step4State.importedWallets);
	let walletsWithBalance = $derived(step4State.getWalletsWithBalance());
	let hasScanned = $derived(step4State.hasScanned);
	let walletCount = $derived(importedWallets.length);
	let walletWithBalanceCount = $derived(walletsWithBalance.length);
	let batchCount = $derived(Math.ceil(walletCount / 100));

	// Current network
	let currentNetwork = $derived.by(() => {
		if (!connectStore.currentChainId) return null;
		return connectStore.networks.find((n) => n.chainId === connectStore.currentChainId);
	});
</script>

<StepSidebar stepNumber={5} title="" description="">
	<StepSummary title={i18n.t('tools.token_sweep.step5.sidebar.summary_title')}>
		<div class="summary-item">
			<span>{i18n.t('tools.token_sweep.step5.sidebar.selected_tokens')}</span>
			<strong>{selectedTokenCount}</strong>
		</div>
		<div class="summary-item">
			<span>{i18n.t('tools.token_sweep.step5.sidebar.total_wallets')}</span>
			<strong>{walletCount}</strong>
		</div>
		{#if hasScanned}
			<div class="summary-item">
				<span>{i18n.t('tools.token_sweep.step5.sidebar.with_balance')}</span>
				<strong class="balance-highlight">{walletWithBalanceCount}</strong>
			</div>
		{/if}
		<div class="summary-item">
			<span>{i18n.t('tools.token_sweep.step5.sidebar.batches')}</span>
			<strong>{batchCount}</strong>
		</div>
	</StepSummary>

	<!-- Membership Promo -->
	<div class="promo-section">
		<MembershipPromo
			currentPrice="0.0025 {currentNetwork?.symbol || 'native coin'}/tx"
			compact={true}
		/>
	</div>
</StepSidebar>

<style>
	.balance-highlight {
		color: #10b981;
	}

	.promo-section {
		margin-top: var(--space-4);
	}
</style>
