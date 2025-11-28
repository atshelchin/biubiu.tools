<script lang="ts">
	import type { ImportedWallet } from '@/features/token-sweep/types/wallet';
	import WalletList from '$lib/components/ui/wallet-list.svelte';
	import ConfirmDialog from '$lib/components/ui/confirm-dialog.svelte';
	import { Loader2 } from '@lucide/svelte';
	import { useI18n } from '@shelchin/i18n/svelte';

	const i18n = useI18n();

	interface Props {
		wallets: ImportedWallet[];
		isScanning: boolean;
		scanProgress: number;
		hasScanned: boolean;
		walletsWithBalance: number;
		onScanBalances: () => void;
		onRemoveWallet: (address: string) => void;
		onClearAll: () => void;
	}

	let {
		wallets,
		isScanning,
		scanProgress,
		hasScanned,
		walletsWithBalance,
		onScanBalances,
		onRemoveWallet,
		onClearAll
	}: Props = $props();

	let walletCount = $derived(wallets.length);

	// Confirm dialog state
	let showRemoveDialog = $state(false);
	let showClearAllDialog = $state(false);
	let walletToRemove = $state<string>('');

	function handleRemoveWallet(address: string) {
		walletToRemove = address;
		showRemoveDialog = true;
	}

	function confirmRemoveWallet() {
		if (walletToRemove) {
			onRemoveWallet(walletToRemove);
			walletToRemove = '';
		}
		showRemoveDialog = false;
	}

	function handleClearAll() {
		showClearAllDialog = true;
	}

	function confirmClearAll() {
		onClearAll();
		showClearAllDialog = false;
	}

	function cancelRemoveDialog() {
		walletToRemove = '';
		showRemoveDialog = false;
	}

	function cancelClearAllDialog() {
		showClearAllDialog = false;
	}
</script>

<div class="form-section">
	<div class="wallet-list-header">
		<div class="form-label">
			{i18n.t('tools.token_sweep.step4.content.wallet_list.title')}
			<span class="wallet-count"
				>{i18n.t('tools.token_sweep.step4.content.wallet_list.count', { count: walletCount })}</span
			>
			<!-- {#if hasScanned}
				<span class="balance-badge"
					>{i18n.t('tools.token_sweep.step4.content.wallet_list.with_balance', {
						count: walletsWithBalance
					})}</span
				>
			{/if} -->
		</div>
		<div class="wallet-actions">
			{#if walletCount > 0}
				<button
					class="btn-scan"
					onclick={onScanBalances}
					disabled={isScanning}
					title={i18n.t('tools.token_sweep.step4.content.wallet_list.scan_button')}
				>
					{#if isScanning}
						<Loader2 size={14} class="spinning" />
						{i18n.t('tools.token_sweep.step4.content.wallet_list.scanning', {
							progress: scanProgress
						})}
					{:else}
						{i18n.t('tools.token_sweep.step4.content.wallet_list.scan_button')}
					{/if}
				</button>
				<button class="btn-text-danger" onclick={handleClearAll}
					>{i18n.t('tools.token_sweep.step4.content.wallet_list.clear_all')}</button
				>
			{/if}
		</div>
	</div>

	<WalletList
		{wallets}
		pageSize={20}
		showPagination={true}
		canRemove={true}
		onRemove={handleRemoveWallet}
		emptyMessage={i18n.t('tools.token_sweep.step4.content.wallet_list.empty_message')}
		showDerivationPath={true}
	/>
</div>

<!-- Confirm Dialogs -->
<ConfirmDialog
	bind:open={showRemoveDialog}
	title={i18n.t('tools.token_sweep.step4.content.dialogs.remove_wallet_title')}
	message={i18n.t('tools.token_sweep.step4.content.dialogs.remove_wallet_message', {
		address: walletToRemove
	})}
	confirmText={i18n.t('tools.token_sweep.step4.content.dialogs.remove_button')}
	cancelText={i18n.t('tools.token_sweep.step4.content.dialogs.cancel_button')}
	variant="danger"
	requireLongPress={false}
	onConfirm={confirmRemoveWallet}
	onCancel={cancelRemoveDialog}
/>

<ConfirmDialog
	bind:open={showClearAllDialog}
	title={i18n.t('tools.token_sweep.step4.content.dialogs.clear_all_title')}
	message={i18n.t('tools.token_sweep.step4.content.dialogs.clear_all_message', {
		count: walletCount.toLocaleString()
	})}
	confirmText={i18n.t('tools.token_sweep.step4.content.dialogs.clear_all_button')}
	confirmHint={i18n.t('tools.token_sweep.step4.content.dialogs.long_press_hint')}
	cancelText={i18n.t('tools.token_sweep.step4.content.dialogs.cancel_button')}
	variant="danger"
	requireLongPress={true}
	longPressDuration={3000}
	onConfirm={confirmClearAll}
	onCancel={cancelClearAllDialog}
/>

<style>
	.form-section {
		margin-bottom: var(--space-6);
	}

	.form-label {
		display: block;
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-700);
		margin-bottom: var(--space-2);
	}
	:global([data-theme='dark']) .form-label {
		color: var(--gray-300);
	}

	.wallet-list-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-3);
		gap: var(--space-3);
		flex-wrap: wrap;
	}

	.wallet-count {
		color: var(--color-primary);
	}

	.balance-badge {
		margin-left: var(--space-2);
		padding: 2px 8px;
		background: #10b981;
		color: white;
		font-size: var(--text-xs);
		border-radius: var(--radius-sm);
		font-weight: var(--font-medium);
	}

	.wallet-actions {
		display: flex;
		gap: var(--space-2);
		align-items: center;
	}

	.btn-scan {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-2) var(--space-3);
		background: linear-gradient(135deg, #3b82f6, #2563eb);
		color: white;
		border: none;
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-scan:hover:not(:disabled) {
		transform: translateY(-1px);
		box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
	}

	.btn-scan:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.btn-text-danger {
		background: none;
		border: none;
		color: hsl(0, 70%, 50%);
		cursor: pointer;
		font-size: var(--text-sm);
	}
	.btn-text-danger:hover {
		color: hsl(0, 80%, 40%);
	}

	:global(.spinning) {
		animation: spin 1s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
