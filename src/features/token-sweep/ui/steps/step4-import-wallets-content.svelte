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
	import { getAllTokensForChain } from '@/features/token-sweep/config/tokens';
	import type { ImportMethod, DerivationPathType } from '@/features/token-sweep/types/wallet';
	import type { ERC20Token } from '@/features/token-sweep/types/token';
	import { createPublicClient, http } from 'viem';
	import { SvelteMap } from 'svelte/reactivity';
	import { Loader2, Trash2, AlertCircle } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import StepContentHeader from '@/features/token-sweep/ui/components/step-content-header.svelte';

	const connectStore = useConnectStore();

	// Local state
	let importMethod = $state<ImportMethod>('mnemonic');
	let pathType = $state<DerivationPathType>('sequential');
	let mnemonicText = $state('');
	let startIndex = $state('0');
	let endIndex = $state('99');
	let privateKeysText = $state('');
	let isGenerating = $state(false);
	let errorMessage = $state('');

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

		const start = parseInt(startIndex);
		const end = parseInt(endIndex);

		if (isNaN(start) || isNaN(end) || start < 0 || end < start) {
			errorMessage = 'Invalid address range';
			return;
		}

		if (end - start > 1000) {
			errorMessage = 'Range too large (max 1000 addresses at once)';
			return;
		}

		isGenerating = true;
		errorMessage = '';

		try {
			const result = await deriveAddressesFromMnemonic({
				mnemonic: mnemonicText.trim(),
				pathType,
				startIndex: start,
				endIndex: end
			});

			if (result.success) {
				step4State.addWallets(result.wallets);
				// Clear mnemonic for security
				mnemonicText = '';
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
			privateKeysText = '';
			if (result.error) {
				errorMessage = `Imported ${result.wallets.length} wallets. Some errors: ${result.error}`;
			}
		} else {
			errorMessage = result.error || 'Failed to import private keys';
		}
	}

	function handleRemoveWallet(address: string) {
		if (confirm('Remove this wallet?')) {
			step4State.removeWallet(address);
		}
	}

	function handleClearAll() {
		if (confirm(`Remove all ${walletCount} wallets?`)) {
			step4State.clearWallets();
		}
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

		// Get all tokens for current chain
		const allTokens = getAllTokensForChain(connectStore.currentChainId);
		const selectedTokens = allTokens.filter((token) => selectedTokenIds.includes(token.id));

		if (selectedTokens.length === 0) {
			errorMessage = 'No valid tokens selected for current network';
			return;
		}

		// Get current network configuration
		const currentNetwork = connectStore.networks.find(
			(n) => n.chainId === connectStore.currentChainId
		);
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
			<textarea
				class="form-textarea"
				bind:value={mnemonicText}
				placeholder="Enter 12 or 24 words separated by spaces&#10;Example: word1 word2 word3 ..."
				rows="3"
			></textarea>
			<p class="form-hint">⚠️ Your mnemonic is never uploaded to any server</p>

			<label class="form-label" style="margin-top: var(--space-4);">Derivation Path Type</label>
			<div class="path-type-selector">
				<button
					class="path-option"
					class:selected={pathType === 'sequential'}
					onclick={() => handlePathTypeChange('sequential')}
				>
					<div class="path-icon">📊</div>
					<div class="path-label">Sequential</div>
					<div class="path-desc">0, 1, 2, 3...</div>
				</button>
				<button
					class="path-option"
					class:selected={pathType === 'date'}
					onclick={() => handlePathTypeChange('date')}
					disabled
					title="Coming soon"
				>
					<div class="path-icon">📅</div>
					<div class="path-label">Date-based</div>
					<div class="path-desc">20240919...</div>
				</button>
			</div>

			{#if pathType === 'sequential'}
				<div class="range-inputs" transition:slide>
					<label class="form-label">Address Range</label>
					<div class="range-row">
						<input
							type="number"
							class="form-input"
							bind:value={startIndex}
							placeholder="Start"
							min="0"
						/>
						<span class="range-separator">to</span>
						<input type="number" class="form-input" bind:value={endIndex} placeholder="End" />
					</div>
					<p class="form-hint">💡 Example: 0-99 will generate 100 addresses</p>
				</div>
			{/if}

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
			<textarea
				class="form-textarea"
				bind:value={privateKeysText}
				placeholder="One private key per line (starting with 0x)&#10;0x1234...&#10;0x5678..."
				rows="8"
			></textarea>
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

		{#if walletCount === 0}
			<div class="empty-state-small">
				<p>No wallets imported yet</p>
				<small>Use the methods above to import wallets</small>
			</div>
		{:else}
			<div class="wallet-list">
				{#each importedWallets as wallet (wallet.id)}
					<div class="wallet-item" transition:slide>
						<div class="wallet-info">
							<code class="wallet-address">{wallet.address}</code>
							{#if wallet.derivationPath}
								<small class="wallet-path">{wallet.derivationPath}</small>
							{/if}
						</div>
						<button
							class="btn-icon-danger"
							onclick={() => handleRemoveWallet(wallet.address)}
							title="Remove wallet"
						>
							<Trash2 size={16} />
						</button>
					</div>
				{/each}
			</div>
		{/if}
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

	.btn-secondary,
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
	}

	.btn-primary {
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

	.btn-secondary {
		background: var(--gray-200);
		color: var(--gray-700);
	}
	:global([data-theme='dark']) .btn-secondary {
		background: var(--gray-700);
		color: var(--gray-200);
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
		transition: all 0.2s;
	}
	.form-textarea:focus,
	.form-input:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.path-type-selector {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: var(--space-3);
		margin-bottom: var(--space-4);
	}

	.path-option {
		padding: var(--space-3);
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all 0.2s;
		text-align: center;
	}
	.path-option:hover:not(:disabled) {
		border-color: var(--color-primary);
	}
	.path-option.selected {
		border-color: var(--color-primary);
		background: rgba(59, 130, 246, 0.05);
	}
	.path-option:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.path-icon {
		font-size: 1.5rem;
		margin-bottom: var(--space-1);
	}
	.path-label {
		font-weight: var(--font-semibold);
	}
	.path-desc {
		font-size: var(--text-xs);
		color: var(--gray-500);
	}

	.range-row {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}
	.range-separator {
		color: var(--gray-600);
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

	.empty-state-small {
		text-align: center;
		padding: var(--space-6);
		color: var(--gray-500);
	}

	.wallet-list {
		max-height: 300px;
		overflow-y: auto;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
	}

	.wallet-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-3);
		border-bottom: 1px solid var(--color-border);
	}
	.wallet-item:last-child {
		border-bottom: none;
	}

	.wallet-info {
		flex: 1;
		min-width: 0;
	}

	.wallet-address {
		display: block;
		font-size: var(--text-sm);
		color: var(--gray-900);
		word-break: break-all;
	}
	:global([data-theme='dark']) .wallet-address {
		color: var(--gray-100);
	}

	.wallet-path {
		display: block;
		font-size: var(--text-xs);
		color: var(--gray-500);
		margin-top: var(--space-1);
	}

	.btn-icon-danger {
		background: none;
		border: none;
		color: hsl(0, 70%, 50%);
		cursor: pointer;
		padding: var(--space-2);
		border-radius: var(--radius-sm);
		transition: all 0.2s;
	}
	.btn-icon-danger:hover {
		background: hsla(0, 70%, 50%, 0.1);
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
