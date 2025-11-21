<script lang="ts">
	import type { ImportedWallet } from '@/features/token-sweep/types/wallet';
	import WalletList from '$lib/components/ui/wallet-list.svelte';
	import ConfirmDialog from '$lib/components/ui/confirm-dialog.svelte';
	import { Loader2 } from '@lucide/svelte';

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
	}

	function handleClearAll() {
		showClearAllDialog = true;
	}

	function confirmClearAll() {
		onClearAll();
	}
</script>

<div class="form-section">
	<div class="wallet-list-header">
		<div class="form-label">
			Imported Wallets
			<span class="wallet-count">({walletCount})</span>
			{#if hasScanned}
				<span class="balance-badge">{walletsWithBalance} with balance</span>
			{/if}
		</div>
		<div class="wallet-actions">
			{#if walletCount > 0}
				<button
					class="btn-scan"
					onclick={onScanBalances}
					disabled={isScanning}
					title="Scan balances for all wallets"
				>
					{#if isScanning}
						<Loader2 size={14} class="spinning" />
						Scanning... {scanProgress}%
					{:else}
						🔍 Scan Balances
					{/if}
				</button>
				<button class="btn-text-danger" onclick={handleClearAll}>Clear All</button>
			{/if}
		</div>
	</div>

	<WalletList
		{wallets}
		pageSize={20}
		showPagination={true}
		canRemove={true}
		onRemove={handleRemoveWallet}
		emptyMessage="No wallets imported yet. Use the methods above to import wallets."
		showDerivationPath={true}
	/>
</div>

<!-- Confirm Dialogs -->
<ConfirmDialog
	bind:open={showRemoveDialog}
	title="Remove Wallet"
	message={`Are you sure you want to remove this wallet from the import list?\n\nAddress: ${walletToRemove}`}
	confirmText="Remove"
	cancelText="Cancel"
	variant="danger"
	requireLongPress={false}
	onConfirm={confirmRemoveWallet}
	onCancel={() => {
		walletToRemove = '';
	}}
/>

<ConfirmDialog
	bind:open={showClearAllDialog}
	title="Clear All Wallets"
	message={`Are you sure you want to remove all ${walletCount.toLocaleString()} wallets from the import list? This action cannot be undone.`}
	confirmText="Clear All"
	cancelText="Cancel"
	variant="danger"
	requireLongPress={true}
	longPressDuration={3000}
	onConfirm={confirmClearAll}
	onCancel={() => {}}
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
