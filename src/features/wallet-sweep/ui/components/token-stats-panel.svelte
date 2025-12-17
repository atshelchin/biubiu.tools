<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Copy, Check, Download } from '@lucide/svelte';
	import TokenBalanceDisplay from '$lib/components/ui/token-balance-display.svelte';
	import { useClipboard } from '$lib/composables/use-clipboard.svelte';
	import { formatAddress } from '$lib/utils/wallet-utils';
	import type { TokenStats } from '@/features/wallet-sweep/composables/use-token-stats.svelte';
	import type { ImportedWallet } from '@/features/wallet-sweep/types/wallet';
	import { exportTokenSummaryReport } from '@/features/wallet-sweep/utils/export-excel';

	interface Props {
		title: string;
		stats: TokenStats[];
		walletsCountLabel: (count: string) => string;
		copyAddressTitle: string;
		copiedTitle: string;
		/** Wallets for Excel export (optional) */
		wallets?: ImportedWallet[];
		/** Network name for Excel export */
		networkName?: string;
		/** Download button title */
		downloadTitle?: string;
	}

	let {
		title,
		stats,
		walletsCountLabel,
		copyAddressTitle,
		copiedTitle,
		wallets = [],
		networkName = 'Network',
		downloadTitle = 'Download Excel Report'
	}: Props = $props();

	const clipboard = useClipboard();

	// Track which address was just copied for visual feedback
	let copiedAddress = $state<string | null>(null);
	let isDownloading = $state(false);

	async function copyAddress(address: string) {
		await clipboard.copy(address);
		copiedAddress = address;
		setTimeout(() => {
			copiedAddress = null;
		}, 2000);
	}

	function handleDownload() {
		if (stats.length === 0 || wallets.length === 0) return;

		isDownloading = true;
		try {
			exportTokenSummaryReport(stats, wallets, networkName);
		} finally {
			setTimeout(() => {
				isDownloading = false;
			}, 500);
		}
	}

	// Check if download is available
	let canDownload = $derived(stats.length > 0 && wallets.length > 0);
</script>

<div class="token-stats" transition:fade>
	<div class="token-stats-header">
		<h4 class="token-stats-title">{title}</h4>
		{#if canDownload}
			<button
				class="download-btn"
				class:downloading={isDownloading}
				onclick={handleDownload}
				title={downloadTitle}
				disabled={isDownloading}
			>
				<Download size={14} />
			</button>
		{/if}
	</div>
	{#each stats as stat (stat.tokenId)}
		<div class="token-stat-item">
			<div class="token-stat-header">
				<div class="token-info">
					<span class="token-symbol">{stat.symbol}</span>
					{#if stat.address}
						{@const isCopied = copiedAddress === stat.address}
						<button
							class="token-address"
							class:copied={isCopied}
							onclick={() => copyAddress(stat.address!)}
							title={isCopied ? copiedTitle : copyAddressTitle}
						>
							<span class="address-text">{formatAddress(stat.address)}</span>
							{#if isCopied}
								<Check size={12} />
							{:else}
								<Copy size={12} />
							{/if}
						</button>
					{/if}
				</div>

				<div style="display:flex;flex-direction: column;">
					<span class="address-count">
						{walletsCountLabel(stat.addressCount.toLocaleString())}
					</span>
					<TokenBalanceDisplay
						balance={stat.totalBalance}
						decimals={stat.decimals}
						mode="compact"
						class="token-balance"
					/>
				</div>
			</div>
		</div>
	{/each}
</div>

<style>
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

	.token-stats-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-3);
	}

	.token-stats-title {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--color-heading-2);
		margin: 0;
	}

	.download-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-1-5);
		border: none;
		background: var(--color-primary);
		color: white;
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: all 0.2s;
	}

	.download-btn:hover:not(:disabled) {
		background: var(--color-primary-hover, var(--color-primary));
		transform: scale(1.05);
	}

	.download-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.download-btn.downloading {
		animation: pulse 1s infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.6;
		}
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
		align-items: flex-start;
		margin-bottom: var(--space-1);
	}

	.token-info {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.token-symbol {
		font-weight: var(--font-semibold);
		color: var(--color-heading-2);
		font-size: var(--text-sm);
	}

	.token-address {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		padding: 2px var(--space-1);
		background: transparent;
		border: none;
		border-radius: var(--radius-sm);
		font-size: var(--text-xs);
		color: var(--gray-500);
		font-family: var(--font-mono, 'Monaco', 'Courier New', monospace);
		cursor: pointer;
		transition: all 0.2s;
	}

	.token-address:hover {
		background: var(--gray-100);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .token-address:hover {
		background: var(--gray-700);
		color: var(--gray-300);
	}

	.token-address.copied {
		color: #10b981;
		background: rgba(16, 185, 129, 0.1);
	}

	:global([data-theme='dark']) .token-address.copied {
		color: #34d399;
		background: rgba(52, 211, 153, 0.1);
	}

	.address-text {
		user-select: none;
	}

	.address-count {
		font-size: var(--text-xs);
		color: var(--gray-500);
		white-space: nowrap;
	}

	:global(.token-balance) {
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		color: #10b981;
	}
</style>
