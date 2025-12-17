<script lang="ts">
	import { fade } from 'svelte/transition';
	import { step4State } from '@/features/wallet-sweep/stores/step4-state.svelte';
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
	import StepSummary from '@/features/wallet-sweep/ui/components/step-summary.svelte';
	import EmptyHint from '$lib/components/ui/empty-hint.svelte';
	import TokenStatsPanel from '@/features/wallet-sweep/ui/components/token-stats-panel.svelte';
	import ScanLogPanel from '@/features/wallet-sweep/ui/components/scan-log-panel.svelte';
	import { useI18n } from '@shelchin/i18n/svelte';
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import { useTokenStats } from '@/features/wallet-sweep/composables/use-token-stats.svelte';

	const i18n = useI18n();
	const connectStore = useConnectStore();

	// Token stats composable
	const tokenStatsHelper = useTokenStats({
		getCurrentChainId: () => connectStore.currentChainId,
		getNetworkInfo: (chainId) => {
			const network = connectStore.networks.find((n) => n.chainId === chainId);
			return network ? { symbol: network.symbol, name: network.name } : undefined;
		}
	});

	// Derived state
	let importedWallets = $derived(step4State.importedWallets);

	// Get network name for Excel export
	let networkName = $derived.by(() => {
		const chainId = connectStore.currentChainId;
		if (!chainId) return 'Network';
		const network = connectStore.networks.find((n) => n.chainId === chainId);
		return network?.name || 'Network';
	});
	let walletCount = $derived(importedWallets.length);
	let isScanning = $derived(step4State.isScanning);
	let scanProgress = $derived(step4State.scanProgress);
	let hasScanned = $derived(step4State.hasScanned);
	let scanCompleted = $derived(step4State.scanCompleted);
	let scanEvents = $derived(step4State.scanEvents);
	let scanRate = $derived(step4State.getScanRate());

	// Calculate token stats using composable
	let tokenStats = $derived.by(() => tokenStatsHelper.calculateStats());
</script>

<StepSidebar stepNumber={4} title="" description="">
	{#if walletCount > 0}
		<div transition:fade>
			<StepSummary title={i18n.t('tools.wallet_sweep.step4.sidebar.title')}>
				<div class="summary-item">
					<span>{i18n.t('tools.wallet_sweep.step4.sidebar.total_label')}</span>
					<strong>{walletCount.toLocaleString()}</strong>
				</div>
				{#if isScanning}
					<div class="summary-item">
						<span>{i18n.t('tools.wallet_sweep.step4.sidebar.scanning_label')}</span>
						<strong>{scanProgress}%</strong>
					</div>
				{:else if scanCompleted}
					<div class="summary-item scan-status-completed">
						<span>{i18n.t('tools.wallet_sweep.step4.sidebar.scan_status_label')}</span>
						<strong>{i18n.t('tools.wallet_sweep.step4.sidebar.scan_completed')}</strong>
					</div>
				{:else}
					<div class="summary-item scan-status-pending">
						<span>{i18n.t('tools.wallet_sweep.step4.sidebar.scan_status_label')}</span>
						<strong>{i18n.t('tools.wallet_sweep.step4.sidebar.scan_pending')}</strong>
					</div>
				{/if}
			</StepSummary>

			{#if hasScanned && tokenStats.length > 0}
				<TokenStatsPanel
					title={i18n.t('tools.wallet_sweep.step4.sidebar.token_stats.title')}
					stats={tokenStats}
					walletsCountLabel={(count) =>
						i18n.t('tools.wallet_sweep.step4.sidebar.token_stats.wallets_count', { count })}
					copyAddressTitle={i18n.t('common.copy_address')}
					copiedTitle={i18n.t('common.copied')}
					wallets={importedWallets}
					{networkName}
					downloadTitle={i18n.t('tools.wallet_sweep.step4.sidebar.token_stats.download_title')}
				/>
			{:else if hasScanned}
				<div class="no-balance-hint" transition:fade>
					{i18n.t('tools.wallet_sweep.step4.sidebar.no_balance_found')}
				</div>
			{/if}
		</div>
	{:else}
		<EmptyHint message={i18n.t('tools.wallet_sweep.step4.sidebar.empty_hint')} />
	{/if}

	<!-- Scan Log Panel - show when scanning or has events -->
	{#if isScanning || scanEvents.length > 0}
		<ScanLogPanel
			events={scanEvents}
			title={i18n.t('tools.wallet_sweep.step4.sidebar.scan_log.title')}
			collapsed={!isScanning}
			onClear={() => step4State.clearScanEvents()}
			{scanRate}
		/>
	{/if}
</StepSidebar>

<style>
	.summary-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-2) 0;
		border-bottom: 1px solid var(--color-border);
	}

	.summary-item:last-child {
		border-bottom: none;
	}

	.scan-status-completed strong {
		color: var(--color-success, #10b981);
	}

	.scan-status-pending strong {
		color: var(--color-warning, #f59e0b);
	}

	.no-balance-hint {
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: var(--color-muted);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
		text-align: center;
	}
</style>
