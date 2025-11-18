<script lang="ts">
	import { Check } from '@lucide/svelte';
	import { formatAddress } from '$lib/utils/wallet-utils';
	import { useI18n } from '@shelchin/i18n/svelte';
	import Dropdown from '$lib/components/ui/dropdown.svelte';

	interface Props {
		/** List of account addresses */
		accounts: string[];
		/** Current selected account address */
		currentAccount?: string;
		/** Account balances map (address -> balance string) */
		balances: Map<string, string>;
		/** Network symbol (e.g., 'ETH', 'MATIC') */
		networkSymbol?: string;
		/** Whether dropdown is open */
		open?: boolean;
		/** Dropdown trigger element */
		trigger?: HTMLElement;
		/** Handler when account is selected */
		onSelectAccount?: (address: string) => void;
		/** Handler when dropdown closes */
		onClose?: () => void;
	}

	let {
		accounts,
		currentAccount,
		balances,
		networkSymbol = 'ETH',
		open = $bindable(false),
		trigger,
		onSelectAccount,
		onClose = () => {}
	}: Props = $props();

	const i18n = useI18n();

	function handleSelect(address: string) {
		onSelectAccount?.(address);
	}

	function getBalance(address: string): string {
		return balances.get(address.toLowerCase()) || '...';
	}
</script>

<Dropdown bind:open {onClose} {trigger} align="left">
	<div class="accounts-dropdown">
		<div class="dropdown-header">
			<span>{i18n.t('wallet.select_account')}</span>
			<span class="account-count">{i18n.t('wallet.account_count', { count: accounts.length })}</span
			>
		</div>
		{#each accounts as account (account)}
			<button class="account-item" onclick={() => handleSelect(account)}>
				<div class="account-item-content">
					<div class="account-item-top">
						<span class="account-item-address">{formatAddress(account)}</span>
						<span class="account-item-balance"
							>{getBalance(account)}
							{networkSymbol}</span
						>
					</div>
					<span class="account-item-full">{account}</span>
				</div>
				<div class="account-item-check">
					{#if account.toLowerCase() === currentAccount?.toLowerCase()}
						<Check size={16} class="check-icon-small" />
					{/if}
				</div>
			</button>
		{/each}
	</div>
</Dropdown>

<style>
	.accounts-dropdown {
		min-width: 280px;
	}

	.dropdown-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-3) var(--space-4);
		border-bottom: 1px solid var(--color-border);
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .dropdown-header {
		color: var(--gray-300);
	}

	.account-count {
		font-size: var(--text-xs);
		color: var(--gray-500);
		font-weight: var(--font-normal);
	}

	.account-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		width: 100%;
		padding: var(--space-3) var(--space-4);
		background: transparent;
		border: none;
		cursor: pointer;
		transition: all 0.2s ease;
		text-align: left;
	}

	.account-item:hover {
		background: var(--color-muted);
	}

	.account-item-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		flex: 1;
		min-width: 0;
	}

	.account-item-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-2);
	}

	.account-item-address {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .account-item-address {
		color: var(--gray-300);
	}

	.account-item-balance {
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		color: var(--color-primary);
		white-space: nowrap;
	}

	.account-item-full {
		font-size: var(--text-xs);
		color: var(--gray-500);
		font-family: var(--font-mono, monospace);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.account-item-check {
		width: 20px;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	:global(.check-icon-small) {
		color: var(--gray-600);
		flex-shrink: 0;
	}
</style>
