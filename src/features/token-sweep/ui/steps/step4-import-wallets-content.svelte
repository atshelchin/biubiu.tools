<script lang="ts">
	import { step4State } from '@/features/token-sweep/stores/step4-state.svelte';
	import { step3State } from '@/features/token-sweep/stores/step3-state.svelte';
	import { useConnectStore } from '$lib/stores/connect.svelte.js';
	import ImportMethodSelector from '@/features/token-sweep/ui/components/import-method-selector.svelte';
	import {
		deriveAddressesFromMnemonic,
		importFromPrivateKeys,
		validateMnemonicPhrase
	} from '@/features/token-sweep/utils/wallet-import';
	import { scanMultipleWallets } from '@/features/token-sweep/utils/balance-scanner';
	import type { ImportMethod, DerivationPathType } from '@/features/token-sweep/types/wallet';
	import type { ERC20Token } from '$lib/types/token';
	import { createPublicClient, http } from 'viem';
	import { SvelteMap } from 'svelte/reactivity';
	import { Loader2, AlertCircle } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import AddressPathSelector from '$lib/components/ui/address-path-selector.svelte';
	import WalletList from '$lib/components/ui/wallet-list.svelte';
	import SimpleCodeEditor from '$lib/components/widgets/SimpleCodeEditor.svelte';
	import ConfirmDialog from '$lib/components/ui/confirm-dialog.svelte';

	const connectStore = useConnectStore();

	// Local state
	let importMethod = $state<ImportMethod>('mnemonic');
	let pathType = $state<DerivationPathType>('sequential');
	let mnemonicText = $state('');
	let startIndex = $state(0);
	let endIndex = $state(99);
	let startYear = $state(new Date().getFullYear() - 10);
	let endYear = $state(new Date().getFullYear());
	let includeMonth = $state(false);
	let includeDay = $state(false);
	let useLeadingZeros = $state(true);
	let privateKeysText = $state('');
	let isGenerating = $state(false);
	let errorMessage = $state('');

	// Confirm dialog state
	let showRemoveDialog = $state(false);
	let showClearAllDialog = $state(false);
	let walletToRemove = $state<string>('');

	// Derived state
	let importedWallets = $derived(step4State.importedWallets);
	let walletCount = $derived(importedWallets.length);
	let isScanning = $derived(step4State.isScanning);
	let scanProgress = $derived(step4State.scanProgress);
	let hasScanned = $derived(step4State.hasScanned);
	let walletsWithBalance = $derived(step4State.getWalletsWithBalance().length);

	function handleMethodSelect(method: ImportMethod) {
		importMethod = method;
		errorMessage = '';
	}

	function handlePathTypeChange(type: DerivationPathType) {
		pathType = type;
	}

	async function handleGenerateAddresses() {
		if (!mnemonicText.trim()) {
			errorMessage = 'Please enter a mnemonic phrase';
			return;
		}

		if (!validateMnemonicPhrase(mnemonicText.trim())) {
			errorMessage = 'Invalid mnemonic phrase. Please enter 12 or 24 words.';
			return;
		}

		// Clear existing wallets before generating new ones
		step4State.clearWallets();

		isGenerating = true;
		errorMessage = '';

		try {
			let result;

			if (pathType === 'sequential') {
				// Sequential mode
				if (startIndex < 0 || endIndex < startIndex) {
					errorMessage = 'Invalid address range';
					isGenerating = false;
					return;
				}

				if (endIndex - startIndex + 1 > 10000) {
					errorMessage = 'Range too large (max 10000 addresses at once)';
					isGenerating = false;
					return;
				}

				result = await deriveAddressesFromMnemonic({
					mnemonic: mnemonicText.trim(),
					pathType: 'sequential',
					startIndex,
					endIndex
				});
			} else {
				// Date mode
				const startDate = `${startYear}-01-01`;
				const endDate = `${endYear}-12-31`;

				// Determine date format based on granularity
				let dateFormat: 'yyyy' | 'yyyymm' | 'yyyym' | 'yyyymmdd' | 'yyyymdd';
				if (!includeMonth && !includeDay) {
					dateFormat = 'yyyy';
				} else if (includeMonth && !includeDay) {
					dateFormat = useLeadingZeros ? 'yyyymm' : 'yyyym';
				} else {
					dateFormat = useLeadingZeros ? 'yyyymmdd' : 'yyyymdd';
				}

				result = await deriveAddressesFromMnemonic({
					mnemonic: mnemonicText.trim(),
					pathType: 'date',
					startDate,
					endDate,
					dateFormat
				});
			}

			if (result.success) {
				step4State.addWallets(result.wallets);
				// Don't clear mnemonic - user might want to generate more addresses with different ranges
			} else {
				errorMessage = result.error || 'Failed to generate addresses';
			}
		} catch (error) {
			console.error('Generate addresses error:', error);
			errorMessage = error instanceof Error ? error.message : 'Failed to generate addresses';
		} finally {
			isGenerating = false;
		}
	}

	function handleImportPrivateKeys() {
		if (!privateKeysText.trim()) {
			errorMessage = 'Please enter private keys';
			return;
		}

		const lines = privateKeysText
			.split('\n')
			.map((line) => line.trim())
			.filter((line) => line.length > 0);

		if (lines.length === 0) {
			errorMessage = 'No valid private keys found';
			return;
		}

		errorMessage = '';

		const result = importFromPrivateKeys(lines);

		if (result.success) {
			step4State.addWallets(result.wallets);
			// Don't clear private keys - user might want to add more wallets
			if (result.error) {
				errorMessage = `Imported ${result.wallets.length} wallets. Some errors: ${result.error}`;
			}
		} else {
			errorMessage = result.error || 'Failed to import private keys';
		}
	}

	function handleRemoveWallet(address: string) {
		walletToRemove = address;
		showRemoveDialog = true;
	}

	function confirmRemoveWallet() {
		if (walletToRemove) {
			step4State.removeWallet(walletToRemove);
			walletToRemove = '';
		}
	}

	function handleClearAll() {
		showClearAllDialog = true;
	}

	function confirmClearAll() {
		step4State.clearWallets();
	}

	async function handleScanBalances() {
		// Validate prerequisites
		if (!connectStore.currentChainId) {
			errorMessage = 'No network connected';
			return;
		}

		if (importedWallets.length === 0) {
			errorMessage = 'No wallets to scan';
			return;
		}

		// Get selected tokens from step3
		const selectedTokenIds = Array.from(step3State.selectedTokenIds);
		if (selectedTokenIds.length === 0) {
			errorMessage = 'Please select tokens in Step 3 first';
			return;
		}

		// Get current network configuration
		const currentNetwork = connectStore.networks.find(
			(n) => n.chainId === connectStore.currentChainId
		);

		// Get all tokens for current chain
		const allTokens = step3State.getAvailableTokens(
			connectStore.currentChainId,
			currentNetwork?.symbol,
			currentNetwork?.name
		);
		const selectedTokens = allTokens.filter((token) => selectedTokenIds.includes(token.id));

		if (selectedTokens.length === 0) {
			errorMessage = 'No valid tokens selected for current network';
			return;
		}
		if (!currentNetwork || currentNetwork.rpcEndpoints.length === 0) {
			errorMessage = 'No RPC endpoint available for current network';
			return;
		}

		const rpcUrl = currentNetwork.rpcEndpoints[0].url;

		// Create chain object for viem
		const chain = {
			id: currentNetwork.chainId,
			name: currentNetwork.name,
			nativeCurrency: {
				name: currentNetwork.symbol,
				symbol: currentNetwork.symbol,
				decimals: 18
			},
			rpcUrls: {
				default: {
					http: [rpcUrl]
				}
			}
		} as const;

		// Create public client
		const publicClient = createPublicClient({
			chain,
			transport: http(rpcUrl)
		});

		// Prepare token addresses for scanning
		const tokenAddresses = selectedTokens.map((token) => ({
			address: token.type === 'erc20' ? (token as ERC20Token).address : undefined,
			decimals: token.decimals,
			chainId: token.chainId,
			tokenId: token.id
		}));

		// Start scanning
		step4State.isScanning = true;
		step4State.scanProgress = 0;
		errorMessage = '';

		try {
			// Scan all wallets
			const results = await scanMultipleWallets(
				publicClient,
				importedWallets,
				tokenAddresses,
				connectStore.currentChainId,
				(progress) => {
					step4State.scanProgress = progress.percentage;
				}
			);

			// Update wallet balances
			const updates = new SvelteMap<
				string,
				{ hasBalance: boolean; balances?: { native?: string; tokens?: Record<string, string> } }
			>();

			for (const [address, result] of results.entries()) {
				const balances: { native?: string; tokens?: Record<string, string> } = {
					tokens: {}
				};

				// Format balances for storage
				for (const balance of result.balances) {
					if (balance.tokenId.endsWith(':native')) {
						balances.native = balance.formatted;
					} else {
						balances.tokens![balance.tokenId] = balance.formatted;
					}
				}

				updates.set(address.toLowerCase(), {
					hasBalance: result.hasBalance,
					balances
				});
			}

			step4State.updateWalletBalances(updates);
			step4State.hasScanned = true;

			// Show summary
			const walletsWithBalance = step4State.getWalletsWithBalance().length;
			if (walletsWithBalance === 0) {
				errorMessage = 'No wallets have balance for selected tokens';
			}
		} catch (error) {
			console.error('Balance scanning error:', error);
			errorMessage = error instanceof Error ? error.message : 'Failed to scan balances';
		} finally {
			step4State.isScanning = false;
		}
	}
</script>

<div class="step-content">
	<StepContentHeader
		title="Import Wallets"
		description="Add source wallets that you want to sweep assets from"
	/>

	<!-- Import Method Selector -->
	<div class="form-section">
		<label class="form-label">Choose Import Method</label>
		<ImportMethodSelector selected={importMethod} onSelect={handleMethodSelect} />
	</div>

	<!-- Mnemonic Import -->
	{#if importMethod === 'mnemonic'}
		<div class="form-section" transition:slide>
			<label class="form-label">Enter Mnemonic Phrase</label>
			<SimpleCodeEditor
				bind:value={mnemonicText}
				placeholder="Enter 12 or 24 words separated by spaces"
				rows={6}
			/>
			<p class="form-hint">⚠️ Your mnemonic is never uploaded to any server</p>

			<div style="margin-top: var(--space-4);">
				<label class="form-label">Derivation Path Configuration</label>
				<AddressPathSelector
					bind:pathType
					bind:startIndex
					bind:endIndex
					bind:startYear
					bind:endYear
					bind:includeMonth
					bind:includeDay
					bind:useLeadingZeros
					maxAddresses={10000}
					onPathTypeChange={handlePathTypeChange}
				/>
			</div>

			<button
				class="btn-primary"
				onclick={handleGenerateAddresses}
				disabled={isGenerating}
				style="width: 100%; margin-top: var(--space-3);"
			>
				{#if isGenerating}
					<Loader2 size={18} class="spinning" />
					Generating...
				{:else}
					🔍 Generate Address List
				{/if}
			</button>
		</div>
	{/if}

	<!-- Private Key Import -->
	{#if importMethod === 'privateKey'}
		<div class="form-section" transition:slide>
			<label class="form-label">Batch Import Private Keys</label>
			<SimpleCodeEditor
				bind:value={privateKeysText}
				placeholder="One private key per line (starting with 0x)"
				rows={20}
			/>
			<button
				class="btn-primary"
				onclick={handleImportPrivateKeys}
				style="width: 100%; margin-top: var(--space-2);"
			>
				➕ Batch Add Wallets
			</button>
		</div>
	{/if}

	<!-- Error Message -->
	{#if errorMessage}
		<div class="error-banner" transition:slide>
			<AlertCircle size={20} />
			<span>{errorMessage}</span>
		</div>
	{/if}

	<!-- Wallet List -->
	<div class="form-section">
		<div class="wallet-list-header">
			<label class="form-label">
				Imported Wallets
				<span class="wallet-count">({walletCount})</span>
				{#if hasScanned}
					<span class="balance-badge">{walletsWithBalance} with balance</span>
				{/if}
			</label>
			<div class="wallet-actions">
				{#if walletCount > 0}
					<button
						class="btn-scan"
						onclick={handleScanBalances}
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
			wallets={importedWallets}
			pageSize={20}
			showPagination={true}
			canRemove={true}
			onRemove={handleRemoveWallet}
			emptyMessage="No wallets imported yet. Use the methods above to import wallets."
			showDerivationPath={true}
		/>
	</div>
</div>

<style>
	.form-hint {
		font-size: var(--text-sm);
		color: var(--gray-600);
		margin: 0;
	}
	:global([data-theme='dark']) .form-hint {
		color: var(--gray-400);
	}

	.form-hint {
		margin-top: var(--space-2);
	}

	.btn-primary {
		padding: var(--space-2) var(--space-4);
		border: none;
		border-radius: var(--radius-sm);
		font-weight: var(--font-medium);
		font-size: var(--text-sm);
		cursor: pointer;
		transition: all 0.2s;
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		background: var(--color-primary);
		color: white;
	}
	.btn-primary:hover:not(:disabled) {
		opacity: 0.9;
		transform: translateY(-1px);
	}
	.btn-primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

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

	.form-textarea,
	.form-input {
		width: 100%;
		padding: var(--space-3);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		font-size: var(--text-base);
		font-family: 'Courier New', monospace;
		background: var(--white);
		color: var(--gray-900);
		transition: all 0.2s;
	}

	.form-textarea {
		resize: none;
	}

	:global([data-theme='dark']) .form-textarea,
	:global([data-theme='dark']) .form-input {
		background: var(--gray-700);
		color: var(--gray-100);
		border-color: var(--gray-600);
	}
	.form-textarea:focus,
	.form-input:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	/* Scrollbar styling for textarea */
	.form-textarea::-webkit-scrollbar {
		width: 8px;
	}

	.form-textarea::-webkit-scrollbar-track {
		background: var(--gray-200);
		border-radius: var(--radius-md);
	}

	.form-textarea::-webkit-scrollbar-thumb {
		background: var(--gray-400);
		border-radius: var(--radius-md);
		transition: background 0.2s;
	}

	.form-textarea::-webkit-scrollbar-thumb:hover {
		background: var(--gray-500);
	}

	:global([data-theme='dark']) .form-textarea::-webkit-scrollbar-track {
		background: var(--gray-800);
	}

	:global([data-theme='dark']) .form-textarea::-webkit-scrollbar-thumb {
		background: var(--gray-600);
	}

	:global([data-theme='dark']) .form-textarea::-webkit-scrollbar-thumb:hover {
		background: var(--gray-500);
	}

	.error-banner {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3);
		background: hsla(0, 80%, 95%, 1);
		border: 1px solid hsl(0, 80%, 60%);
		border-radius: var(--radius-sm);
		color: hsl(0, 80%, 40%);
		margin-bottom: var(--space-4);
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
