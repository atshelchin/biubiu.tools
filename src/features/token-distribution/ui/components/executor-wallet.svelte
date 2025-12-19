<script lang="ts">
	import { Wallet, ExternalLink } from '@lucide/svelte';
	import { useI18n } from '@shelchin/i18n/svelte';
	import { formatAddress } from '$lib/utils/wallet-utils';
	import NetworkIcon from '$lib/components/ui/network-icon.svelte';
	import type { Address } from 'viem';
	import type { NetworkConfig } from '@shelchin/ethereum-connectors';

	interface Props {
		/** Wallet address */
		address: Address;
		/** Network configuration */
		network?: NetworkConfig;
		/** Chain ID */
		chainId: number;
		/** Wallet balance (formatted string) */
		balance?: string;
		/** Balance symbol */
		balanceSymbol?: string;
		/** Connector icon URL */
		connectorIcon?: string;
		/** Show block explorer link */
		showExplorerLink?: boolean;
		/** Compact mode */
		compact?: boolean;
	}

	let {
		address,
		network,
		chainId,
		balance,
		balanceSymbol = 'ETH',
		connectorIcon,
		showExplorerLink = true,
		compact = false
	}: Props = $props();

	const i18n = useI18n();

	const explorerUrl = $derived.by(() => {
		if (!network?.blockExplorerUrl || !showExplorerLink) return null;
		return `${network.blockExplorerUrl}/address/${address}`;
	});
</script>

<div class="executor-wallet" class:compact>
	<div class="wallet-icon-wrapper">
		{#if connectorIcon}
			<img src={connectorIcon} alt="Wallet" class="wallet-icon" />
		{:else}
			<div class="wallet-icon-placeholder">
				<Wallet size={compact ? 16 : 20} />
			</div>
		{/if}
	</div>

	<div class="wallet-info">
		<div class="wallet-header">
			<div class="network-badge">
				<NetworkIcon {chainId} size={compact ? 14 : 16} />
				<span class="network-name">{network?.name || `Chain ${chainId}`}</span>
			</div>
		</div>

		<div class="wallet-address">
			<span class="address-text">{formatAddress(address, compact ? 4 : 6)}</span>
			{#if explorerUrl}
				<a
					href={explorerUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="explorer-link"
					title={i18n.t('wallet.view_on_explorer')}
				>
					<ExternalLink size={12} />
				</a>
			{/if}
		</div>

		{#if balance}
			<div class="wallet-balance">
				<span class="balance-value">{balance}</span>
				<span class="balance-symbol">{balanceSymbol}</span>
			</div>
		{/if}
	</div>
</div>

<style>
	.executor-wallet {
		display: flex;
		align-items: flex-start;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
	}

	.executor-wallet.compact {
		padding: var(--space-2) var(--space-3);
		gap: var(--space-2);
	}

	.wallet-icon-wrapper {
		flex-shrink: 0;
	}

	.wallet-icon {
		width: 36px;
		height: 36px;
		border-radius: var(--radius-md);
		display: block;
	}

	.compact .wallet-icon {
		width: 28px;
		height: 28px;
	}

	.wallet-icon-placeholder {
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-muted);
		border-radius: var(--radius-md);
		color: var(--gray-600);
	}

	.compact .wallet-icon-placeholder {
		width: 28px;
		height: 28px;
	}

	.wallet-info {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.wallet-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.network-badge {
		display: flex;
		align-items: center;
		gap: var(--space-1);
	}

	.network-name {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-primary);
	}

	.compact .network-name {
		font-size: var(--text-xs);
	}

	.wallet-address {
		display: flex;
		align-items: center;
		gap: var(--space-1);
	}

	.address-text {
		font-size: var(--text-sm);
		font-family: var(--font-mono, monospace);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .address-text {
		color: var(--gray-100);
	}

	.compact .address-text {
		font-size: var(--text-xs);
	}

	.explorer-link {
		display: flex;
		align-items: center;
		color: var(--gray-500);
		transition: color 0.2s ease;
	}

	.explorer-link:hover {
		color: var(--color-primary);
	}

	.wallet-balance {
		display: flex;
		align-items: baseline;
		gap: var(--space-1);
		margin-top: var(--space-1);
	}

	.balance-value {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .balance-value {
		color: var(--gray-100);
	}

	.compact .balance-value {
		font-size: var(--text-sm);
	}

	.balance-symbol {
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .balance-symbol {
		color: var(--gray-400);
	}

	.compact .balance-symbol {
		font-size: var(--text-xs);
	}
</style>
