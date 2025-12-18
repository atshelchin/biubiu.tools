<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import StepContent from '$lib/components/step/step-content.svelte';
	import SegmentedControl from '$lib/components/ui/segmented-control.svelte';
	import AddressTextImport from '$lib/components/ui/address-text-import.svelte';
	import XpubImportForm from '$lib/components/ui/xpub-import-form.svelte';
	import WalletList from '$lib/components/ui/wallet-list.svelte';
	import InlineAlert from '$lib/components/ui/inline-alert.svelte';
	import ConfirmDialog from '$lib/components/ui/confirm-dialog.svelte';
	import { step4State } from '../../stores/step4-state.svelte';
	import { useXpubImport } from '../../composables/use-xpub-import.svelte';
	import type { Address } from 'viem';

	const i18n = useI18n();
	const xpubImport = useXpubImport();

	// Import method type
	type ImportMethod = 'address' | 'xpub';
	let importMethod = $state<ImportMethod>('address');

	// Address text import state
	let addressText = $state('');

	// Dialog state
	let showRemoveDialog = $state(false);
	let showClearAllDialog = $state(false);
	let walletToRemove = $state<string>('');

	// Derived state
	const wallets = $derived(step4State.wallets);
	const walletCount = $derived(wallets.length);

	// Import method options
	const importMethodOptions = $derived([
		{
			value: 'address' as const,
			label: i18n.t('tools.token_balance_scanner.step4.import_method.address') || 'Addresses'
		},
		{
			value: 'xpub' as const,
			label: i18n.t('tools.token_balance_scanner.step4.import_method.xpub') || 'Extended Public Key'
		}
	]);

	// Convert wallets to format expected by WalletList
	const walletListItems = $derived(
		wallets.map((address, index) => ({
			id: `wallet-${index}`,
			address,
			derivationPath: step4State.walletLabels.get(address)
		}))
	);

	// Handle method change
	function handleMethodChange(method: ImportMethod) {
		importMethod = method;
		// Clear errors when switching
		xpubImport.clearError();
	}

	// Handle address import
	function handleAddressImport(addresses: Address[]) {
		addresses.forEach((addr) => step4State.addWallet(addr));
		addressText = '';
	}

	// Handle xpub derivation
	async function handleXpubDerive() {
		await xpubImport.deriveAddresses();
	}

	// Handle wallet removal
	function handleRemoveWallet(address: string) {
		walletToRemove = address;
		showRemoveDialog = true;
	}

	function confirmRemoveWallet() {
		if (walletToRemove) {
			step4State.removeWallet(walletToRemove as Address);
			walletToRemove = '';
		}
		showRemoveDialog = false;
	}

	// Handle clear all
	function handleClearAll() {
		showClearAllDialog = true;
	}

	function confirmClearAll() {
		step4State.clearWallets();
		showClearAllDialog = false;
	}
</script>

<StepContent>
	<StepContentHeader
		title={i18n.t('tools.token_balance_scanner.step4.content.title') || 'Import Wallet Addresses'}
		description={i18n.t('tools.token_balance_scanner.step4.content.description') ||
			'Add wallet addresses to scan for token balances'}
	/>

	<!-- Import Method Selector -->
	<div>
		<div class="form-label">
			{i18n.t('tools.token_balance_scanner.step4.content.choose_method') || 'Choose Import Method'}
		</div>
		<SegmentedControl
			options={importMethodOptions}
			bind:value={importMethod}
			onValueChange={handleMethodChange}
		/>
	</div>

	<!-- Address Text Import -->
	{#if importMethod === 'address'}
		<AddressTextImport
			bind:value={addressText}
			onImport={handleAddressImport}
			placeholder={i18n.t('tools.token_balance_scanner.step4.content.address_placeholder') ||
				'Paste wallet addresses here (one per line)\n0x1234...\n0x5678...'}
			rows={8}
		/>
	{/if}

	<!-- Xpub Import -->
	{#if importMethod === 'xpub'}
		<XpubImportForm
			bind:xpubText={xpubImport.xpubText}
			bind:pathType={xpubImport.pathType}
			bind:startIndex={xpubImport.startIndex}
			bind:endIndex={xpubImport.endIndex}
			bind:startYear={xpubImport.startYear}
			bind:endYear={xpubImport.endYear}
			bind:includeMonth={xpubImport.includeMonth}
			bind:includeDay={xpubImport.includeDay}
			bind:useLeadingZeros={xpubImport.useLeadingZeros}
			isGenerating={xpubImport.isGenerating}
			generationProgress={xpubImport.generationProgress}
			onGenerate={handleXpubDerive}
		/>
	{/if}

	<!-- Error Message -->
	{#if xpubImport.errorMessage}
		<InlineAlert variant="error" message={xpubImport.errorMessage} />
	{/if}

	<!-- Wallet List -->
	{#if walletCount > 0}
		<div class="form-section">
			<div class="wallet-list-header">
				<div class="form-label">
					{i18n.t('tools.token_balance_scanner.step4.content.wallet_list.title') || 'Wallets'}
					<span class="wallet-count">
						{i18n.t('tools.token_balance_scanner.step4.content.wallet_list.count', {
							count: walletCount
						}) || `(${walletCount})`}
					</span>
				</div>
				<button class="btn-text-danger" onclick={handleClearAll}>
					{i18n.t('tools.token_balance_scanner.step4.content.wallet_list.clear_all') || 'Clear All'}
				</button>
			</div>

			<WalletList
				wallets={walletListItems}
				pageSize={20}
				showPagination={true}
				canRemove={true}
				onRemove={handleRemoveWallet}
				emptyMessage={i18n.t('tools.token_balance_scanner.step4.content.wallet_list.empty') ||
					'No wallets added yet'}
				showDerivationPath={importMethod === 'xpub'}
			/>
		</div>
	{/if}
</StepContent>

<!-- Confirm Dialogs -->
<ConfirmDialog
	bind:open={showRemoveDialog}
	title={i18n.t('tools.token_balance_scanner.step4.dialogs.remove_wallet_title') || 'Remove Wallet'}
	message={i18n.t('tools.token_balance_scanner.step4.dialogs.remove_wallet_message', {
		address: walletToRemove
	}) || `Are you sure you want to remove this wallet?\n${walletToRemove}`}
	confirmText={i18n.t('tools.token_balance_scanner.step4.dialogs.remove_button') || 'Remove'}
	cancelText={i18n.t('tools.token_balance_scanner.step4.dialogs.cancel_button') || 'Cancel'}
	variant="danger"
	requireLongPress={false}
	onConfirm={confirmRemoveWallet}
	onCancel={() => {
		walletToRemove = '';
		showRemoveDialog = false;
	}}
/>

<ConfirmDialog
	bind:open={showClearAllDialog}
	title={i18n.t('tools.token_balance_scanner.step4.dialogs.clear_all_title') || 'Clear All Wallets'}
	message={i18n.t('tools.token_balance_scanner.step4.dialogs.clear_all_message', {
		count: walletCount
	}) || `Are you sure you want to remove all ${walletCount} wallets?`}
	confirmText={i18n.t('tools.token_balance_scanner.step4.dialogs.clear_all_button') || 'Clear All'}
	confirmHint={i18n.t('tools.token_balance_scanner.step4.dialogs.long_press_hint') ||
		'Hold to confirm'}
	cancelText={i18n.t('tools.token_balance_scanner.step4.dialogs.cancel_button') || 'Cancel'}
	variant="danger"
	requireLongPress={true}
	longPressDuration={3000}
	onConfirm={confirmClearAll}
	onCancel={() => (showClearAllDialog = false)}
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
		margin-left: var(--space-1);
	}

	.btn-text-danger {
		background: none;
		border: none;
		color: hsl(0, 70%, 50%);
		cursor: pointer;
		font-size: var(--text-sm);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-sm);
		transition: all 0.2s ease;
	}

	.btn-text-danger:hover {
		color: hsl(0, 80%, 40%);
		background: hsl(0, 70%, 95%);
	}

	:global([data-theme='dark']) .btn-text-danger:hover {
		background: hsl(0, 70%, 20%);
	}
</style>
