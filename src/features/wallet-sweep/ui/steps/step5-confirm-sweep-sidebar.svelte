<script lang="ts">
	import { step3State } from '@/features/wallet-sweep/stores/step3-state.svelte';
	import { step4State } from '@/features/wallet-sweep/stores/step4-state.svelte';
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
	import StepSummary from '@/features/wallet-sweep/ui/components/step-summary.svelte';
	import MembershipPromo from '@/features/wallet-sweep/ui/components/membership-promo.svelte';
	import TokenBalanceDisplay from '$lib/components/ui/token-balance-display.svelte';
	import { useI18n } from '@shelchin/i18n/svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import type { ERC20Token } from '$lib/types/token';
	import { fade } from 'svelte/transition';

	const i18n = useI18n();
	const connectStore = useConnectStore();

	// Derived from Step 3 (selected tokens)
	let selectedTokenIds = $derived(step3State.getSelectedTokens());
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

	// Calculate token balance statistics
	interface TokenStats {
		tokenId: string;
		symbol: string;
		address?: string;
		decimals: number;
		totalBalance: bigint;
		addressCount: number;
		batchCount: number; // Number of batches needed for this token
	}

	let tokenStats = $derived.by(() => {
		if (!hasScanned || walletCount === 0) return [];

		// Get all available tokens to find symbol and address
		const availableTokens = currentNetwork
			? step3State.getAvailableTokens(
					currentNetwork.chainId,
					currentNetwork.symbol,
					currentNetwork.name
				)
			: [];

		const tokenMap = new Map(availableTokens.map((t) => [t.id, t]));

		const stats = new SvelteMap<string, TokenStats>();

		// Initialize stats for selected tokens
		selectedTokenIds.forEach((tokenId) => {
			const token = tokenMap.get(tokenId);
			const symbol = token?.symbol || tokenId;
			const address = token?.type === 'erc20' ? (token as ERC20Token).address : undefined;
			const decimals = token?.decimals || 18;

			stats.set(tokenId, {
				tokenId,
				symbol,
				address,
				decimals,
				totalBalance: 0n,
				addressCount: 0,
				batchCount: 0 // Will be calculated after counting addresses
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
					// Balance is stored as bigint string (smallest unit)
					try {
						const balanceValue = BigInt(balance);
						stat.totalBalance += balanceValue;
						stat.addressCount += 1;
					} catch (e) {
						// Skip invalid balance values
						console.warn(`Invalid balance value: ${balance}`, e);
					}
				}
			});
		});

		// Calculate batch count for each token (100 wallets per batch)
		const BATCH_SIZE = 100;
		stats.forEach((stat) => {
			stat.batchCount = Math.ceil(stat.addressCount / BATCH_SIZE);
		});

		return Array.from(stats.values()).filter((s) => s.addressCount > 0);
	});
</script>

<StepSidebar stepNumber={5} title="" description="">
	<StepSummary title={i18n.t('tools.wallet_sweep.step5.sidebar.summary_title')}>
		<div class="summary-item">
			<span>{i18n.t('tools.wallet_sweep.step5.sidebar.selected_tokens')}</span>
			<strong>{selectedTokenCount}</strong>
		</div>
		<div class="summary-item">
			<span>{i18n.t('tools.wallet_sweep.step5.sidebar.total_wallets')}</span>
			<strong>{walletCount}</strong>
		</div>
	</StepSummary>

	<!-- Token Balance Statistics -->
	{#if tokenStats.length > 0}
		<div class="token-stats" transition:fade>
			<h4 class="token-stats-title">
				{i18n.t('tools.wallet_sweep.step4.sidebar.token_stats.title')}
			</h4>
			{#each tokenStats as stat (stat.tokenId)}
				<div class="token-stat-item">
					<div class="token-stat-header">
						<div class="token-info">
							<span class="token-symbol">{stat.symbol}</span>
							<span class="address-count">
								{i18n.t('tools.wallet_sweep.step4.sidebar.token_stats.wallets_count', {
									count: stat.addressCount.toLocaleString()
								})}
							</span>
						</div>
						<span class="batch-info">
							{stat.batchCount}
							{i18n.t('tools.wallet_sweep.step5.sidebar.batches')}
						</span>
					</div>
					<div class="token-balance-wrapper">
						<TokenBalanceDisplay
							balance={stat.totalBalance}
							decimals={stat.decimals}
							mode="compact"
							class="token-balance"
						/>
					</div>
				</div>
			{/each}
		</div>
	{/if}

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

	.token-stats {
		margin-top: var(--space-4);
		padding: var(--space-4);
		background: var(--gray-50);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
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
		padding: var(--space-3) 0;
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
		align-items: flex-start;
		margin-bottom: var(--space-2);
		gap: var(--space-2);
	}

	.token-info {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		flex: 1;
		min-width: 0;
	}

	.token-symbol {
		font-weight: var(--font-semibold);
		color: var(--color-heading-2);
		font-size: var(--text-base);
	}

	.address-count {
		font-size: var(--text-xs);
		color: var(--gray-500);
	}

	.batch-info {
		font-size: var(--text-xs);
		color: var(--color-primary);
		font-weight: var(--font-semibold);
		white-space: nowrap;
		background: var(--color-primary-light);
		padding: var(--space-1-5) var(--space-2-5);
		border-radius: var(--radius-md);
		flex-shrink: 0;
	}

	:global([data-theme='dark']) .batch-info {
		background: rgba(var(--color-primary-rgb), 0.15);
	}

	.token-balance-wrapper {
		margin-top: var(--space-1);
	}

	:global(.token-balance) {
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		color: #10b981;
	}

	.promo-section {
		margin-top: var(--space-4);
	}
</style>
