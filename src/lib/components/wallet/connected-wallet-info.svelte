<script lang="ts">
	import { Wallet, Copy, LogOut, Check, ChevronDown } from '@lucide/svelte';
	import { formatAddress } from '$lib/utils/wallet-utils';
	import { useI18n } from '@shelchin/i18n/svelte';
	import NetworkIcon from '$lib/components/ui/network-icon.svelte';
	import AccountSelector from './account-selector.svelte';
	import type { NetworkConfig } from '@shelchin/ethereum-connectors';

	interface Props {
		/** Selected network configuration */
		network?: NetworkConfig;
		/** Chain ID */
		chainId: number;
		/** Wallet address */
		address: string;
		/** Wallet connector icon URL */
		connectorIcon?: string;
		/** List of accounts */
		accounts?: string[];
		/** Account balances */
		balances?: Map<string, string>;
		/** Whether copy was successful */
		copySuccess?: boolean;
		/** Handler for copying address */
		onCopyAddress?: () => void;
		/** Handler for disconnecting */
		onDisconnect?: () => void;
		/** Handler for switching account */
		onSwitchAccount?: (address: string) => void;
	}

	let {
		network,
		chainId,
		address,
		connectorIcon,
		accounts = [],
		balances = new Map(),
		copySuccess = false,
		onCopyAddress,
		onDisconnect,
		onSwitchAccount
	}: Props = $props();

	const i18n = useI18n();

	let showAccountDropdown = $state(false);
	let accountButtonElement = $state<HTMLElement | undefined>();

	const hasMultipleAccounts = $derived(accounts.length > 1);

	function handleAccountClick() {
		if (hasMultipleAccounts) {
			showAccountDropdown = !showAccountDropdown;
		}
	}

	function handleSwitchAccount(selectedAddress: string) {
		onSwitchAccount?.(selectedAddress);
		showAccountDropdown = false;
	}
</script>

<div class="connected-container">
	<div class="connected-card">
		<div class="account-section">
			<button
				bind:this={accountButtonElement}
				class="account-button"
				class:has-multiple={hasMultipleAccounts}
				onclick={handleAccountClick}
			>
				<div class="wallet-icon-wrapper">
					{#if connectorIcon}
						<img src={connectorIcon} alt="Wallet" class="wallet-icon" />
					{:else}
						<div class="wallet-icon-placeholder">
							<Wallet size={20} />
						</div>
					{/if}
				</div>

				<div class="account-content">
					<div class="network-info">
						<NetworkIcon {chainId} size={16} />
						<span class="network-name">{network?.name || `Chain ${chainId}`}</span>
					</div>
					<div class="address-info">
						<!-- <span class="address-label">{i18n.t('wallet.address_label')}</span> -->
						<span class="address-value">{formatAddress(address)}</span>
					</div>
				</div>

				{#if hasMultipleAccounts}
					<ChevronDown size={16} class="chevron-icon" />
				{/if}
			</button>

			<div class="account-actions">
				<button
					class="icon-action-button"
					onclick={onCopyAddress}
					title={i18n.t('wallet.copy_address_tooltip')}
				>
					{#if copySuccess}
						<Check size={16} />
					{:else}
						<Copy size={16} />
					{/if}
				</button>
				<button
					class="icon-action-button disconnect"
					onclick={onDisconnect}
					title={i18n.t('wallet.disconnect_wallet')}
				>
					<LogOut size={16} />
				</button>
			</div>
		</div>
	</div>
</div>

<!-- Account Dropdown -->
{#if hasMultipleAccounts}
	<AccountSelector
		{accounts}
		currentAccount={address}
		{balances}
		networkSymbol={network?.symbol || 'ETH'}
		bind:open={showAccountDropdown}
		trigger={accountButtonElement}
		onSelectAccount={handleSwitchAccount}
		onClose={() => (showAccountDropdown = false)}
	/>
{/if}

<style>
	.connected-container {
		width: 100%;
		container-type: inline-size;
		container-name: wallet-info;
	}

	.connected-card {
		border-radius: var(--radius-lg);
	}

	.account-section {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.account-button {
		flex: 1;
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		background: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		cursor: default;
		transition: all 0.2s ease;
		min-width: 0;
	}

	.account-button.has-multiple {
		cursor: pointer;
	}

	.account-button.has-multiple:hover {
		background: var(--color-panel-1);
		border-color: var(--color-primary);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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

	.account-content {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.network-info {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.network-name {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--color-primary);
	}

	.address-info {
		display: flex;
		align-items: baseline;
		gap: var(--space-2);
	}

	.address-label {
		font-size: var(--text-xs);
		color: var(--gray-500);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		flex-shrink: 0;
	}

	.address-value {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--gray-900);
		font-family: var(--font-mono, monospace);
	}

	:global([data-theme='dark']) .address-value {
		color: var(--gray-100);
	}

	:global(.chevron-icon) {
		color: var(--gray-600);
		flex-shrink: 0;
	}

	.account-actions {
		display: flex;
		gap: var(--space-2);
	}

	.icon-action-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		padding: 0;
		background: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		color: var(--gray-600);
		cursor: pointer;
		transition: all 0.2s ease;
		flex-shrink: 0;
	}

	.icon-action-button:hover {
		background: var(--color-panel-1);
		border-color: var(--color-primary);
		color: var(--color-primary);
		transform: translateY(-1px);
	}

	.icon-action-button.disconnect:hover {
		border-color: hsl(0, 80%, 50%);
		color: hsl(0, 80%, 50%);
	}

	@container wallet-info (max-width: 400px) {
		.account-section {
			flex-direction: column;
			gap: var(--space-2);
		}

		.account-button {
			width: 100%;
		}

		.wallet-icon,
		.wallet-icon-placeholder {
			width: 32px;
			height: 32px;
		}

		.network-name {
			font-size: var(--text-xs);
		}

		.address-info {
			/* flex-direction: column; */
			align-items: flex-start;
			gap: var(--space-1);
		}

		.address-value {
			font-size: var(--text-xs);
		}

		.account-actions {
			width: 100%;
			justify-content: stretch;
		}

		.icon-action-button {
			flex: 1;
			height: 36px;
		}
	}
</style>
