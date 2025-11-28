<script lang="ts">
	import { fade } from 'svelte/transition';
	import { step4State } from '@/features/token-sweep/stores/step4-state.svelte';
	import { step3State } from '@/features/token-sweep/stores/step3-state.svelte';
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
	import StepSummary from '@/features/token-sweep/ui/components/step-summary.svelte';
	import { useI18n } from '@shelchin/i18n/svelte';
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import { SvelteMap } from 'svelte/reactivity';

	const i18n = useI18n();
	const connectStore = useConnectStore();

	// Derived state
	let importedWallets = $derived(step4State.importedWallets);
	let walletCount = $derived(importedWallets.length);
	let walletsWithBalance = $derived(step4State.getWalletsWithBalance().length);
	let isScanning = $derived(step4State.isScanning);
	let scanProgress = $derived(step4State.scanProgress);
	let hasScanned = $derived(step4State.hasScanned);

	// Get selected tokens from step3
	let selectedTokenIds = $derived(step3State.selectedTokenIds);

	// Calculate token balance statistics
	interface TokenStats {
		tokenId: string;
		symbol: string;
		totalBalance: bigint;
		addressCount: number;
	}

	let tokenStats = $derived.by(() => {
		if (!hasScanned || walletCount === 0) return [];

		// Get current network info to identify native token
		const currentNetwork = connectStore.currentChainId
			? connectStore.networks.find((n) => n.chainId === connectStore.currentChainId)
			: null;

		const stats = new SvelteMap<string, TokenStats>();

		// Initialize stats for selected tokens
		selectedTokenIds.forEach((tokenId) => {
			const isNative = tokenId.endsWith(':native');
			const symbol = isNative
				? currentNetwork?.symbol || 'Native'
				: tokenId.split(':')[1] || tokenId;

			stats.set(tokenId, {
				tokenId,
				symbol,
				totalBalance: 0n,
				addressCount: 0
			});
		});

		// Calculate balances for each wallet
		importedWallets.forEach((wallet) => {
			if (!wallet.balances) return;

			selectedTokenIds.forEach((tokenId) => {
				const isNative = tokenId.endsWith(':native');
				let balance: string | undefined;

				if (isNative) {
					balance = wallet.balances?.native;
				} else {
					// Use tokenId directly as the key (format: chainId:address)
					balance = wallet.balances?.tokens?.[tokenId];
				}

				if (balance && balance !== '0') {
					const stat = stats.get(tokenId)!;
					// Convert to BigInt - handle both integer strings and decimal strings
					try {
						// If balance contains decimal point, it's likely in ether units, convert to wei
						const balanceValue = balance.includes('.')
							? BigInt(Math.floor(parseFloat(balance) * 1e18))
							: BigInt(balance);
						stat.totalBalance += balanceValue;
						stat.addressCount += 1;
					} catch (e) {
						// Skip invalid balance values
						console.warn(`Invalid balance value: ${balance}`, e);
					}
				}
			});
		});

		return Array.from(stats.values()).filter((s) => s.addressCount > 0);
	});
</script>

<StepSidebar stepNumber={4} title="" description="">
	<!-- Performance Tip Card -->
	{#if walletCount > 10000}
		<div class="performance-tip-card" transition:fade>
			<div class="tip-header">
				<span class="tip-title"
					>{i18n.t('tools.token_sweep.step4.sidebar.performance_tip.title')}</span
				>
			</div>
			<p class="tip-message">
				{i18n.t('tools.token_sweep.step4.sidebar.performance_tip.message')}
			</p>
			<div class="tip-recommendation">
				<span class="tip-label"
					>{i18n.t('tools.token_sweep.step4.sidebar.performance_tip.recommended')}</span
				>
				<strong class="tip-value"
					>{i18n.t('tools.token_sweep.step4.sidebar.performance_tip.recommended_range')}</strong
				>
			</div>
		</div>
	{/if}

	{#if walletCount > 0}
		<div transition:fade>
			<StepSummary title={i18n.t('tools.token_sweep.step4.sidebar.title')}>
				<div class="summary-item">
					<span>{i18n.t('tools.token_sweep.step4.sidebar.total_label')}</span>
					<strong>{walletCount.toLocaleString()}</strong>
				</div>
				{#if hasScanned}
					<div class="summary-item">
						<span>{i18n.t('tools.token_sweep.step4.sidebar.with_balance_label')}</span>
						<strong class="balance-count">{walletsWithBalance.toLocaleString()}</strong>
					</div>
				{/if}
				{#if isScanning}
					<div class="summary-item">
						<span>{i18n.t('tools.token_sweep.step4.sidebar.scanning_label')}</span>
						<strong>{scanProgress}%</strong>
					</div>
				{/if}
			</StepSummary>

			{#if tokenStats.length > 0}
				<div class="token-stats" transition:fade>
					<h4 class="token-stats-title">
						{i18n.t('tools.token_sweep.step4.sidebar.token_stats.title')}
					</h4>
					{#each tokenStats as stat (stat.tokenId)}
						<div class="token-stat-item">
							<div class="token-stat-header">
								<span class="token-symbol">{stat.symbol}</span>
								<span class="address-count">
									{i18n.t('tools.token_sweep.step4.sidebar.token_stats.wallets_count', {
										count: stat.addressCount.toLocaleString()
									})}
								</span>
							</div>
							<div class="token-balance">
								{(Number(stat.totalBalance) / 1e18).toLocaleString(undefined, {
									minimumFractionDigits: 4,
									maximumFractionDigits: 8
								})}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{:else}
		<p class="empty-hint">{i18n.t('tools.token_sweep.step4.sidebar.empty_hint')}</p>
	{/if}
</StepSidebar>

<style>
	.performance-tip-card {
		margin-bottom: var(--space-4);
		padding: var(--space-4);
		background: rgba(245, 158, 11, 0.1);
		border: 1px solid rgba(245, 158, 11, 0.3);
		border-radius: var(--radius-lg);
		border-left: 4px solid rgba(245, 158, 11, 0.8);
	}

	:global([data-theme='dark']) .performance-tip-card {
		background: rgba(245, 158, 11, 0.15);
		border-color: rgba(245, 158, 11, 0.4);
	}

	.tip-header {
		margin-bottom: var(--space-2);
	}

	.tip-title {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: hsl(38, 92%, 45%);
	}

	:global([data-theme='dark']) .tip-title {
		color: hsl(38, 92%, 55%);
	}

	.tip-message {
		margin: 0 0 var(--space-3) 0;
		font-size: var(--text-sm);
		color: var(--gray-700);
		line-height: 1.5;
	}

	:global([data-theme='dark']) .tip-message {
		color: var(--gray-300);
	}

	.tip-recommendation {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2);
		background: rgba(255, 255, 255, 0.5);
		border-radius: var(--radius-md);
	}

	:global([data-theme='dark']) .tip-recommendation {
		background: rgba(0, 0, 0, 0.2);
	}

	.tip-label {
		font-size: var(--text-xs);
		color: var(--gray-600);
		font-weight: var(--font-medium);
	}

	:global([data-theme='dark']) .tip-label {
		color: var(--gray-400);
	}

	.tip-value {
		font-size: var(--text-sm);
		font-weight: var(--font-bold);
		color: hsl(38, 92%, 45%);
		font-family: var(--font-mono, 'Monaco', 'Courier New', monospace);
	}

	:global([data-theme='dark']) .tip-value {
		color: hsl(38, 92%, 55%);
	}

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

	.token-stats {
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: var(--color-panel-2);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
	}

	:global([data-theme='dark']) .token-stats {
		background: var(--gray-800);
		border-color: var(--gray-700);
	}

	.token-stats-title {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--color-heading-2);
		margin: 0 0 var(--space-3) 0;
	}

	.token-stat-item {
		padding: var(--space-2) 0;
		border-bottom: 1px solid var(--color-border);
	}

	.token-stat-item:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	.token-stat-item:first-child {
		padding-top: 0;
	}

	.token-stat-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-1);
	}

	.token-symbol {
		font-weight: var(--font-semibold);
		color: var(--color-heading-2);
		font-size: var(--text-sm);
	}

	.address-count {
		font-size: var(--text-xs);
		color: var(--gray-500);
	}

	.token-balance {
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		color: #10b981;
		font-family: var(--font-mono, 'Monaco', 'Courier New', monospace);
	}
</style>
