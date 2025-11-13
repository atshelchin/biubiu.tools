<script lang="ts">
	import type { TemporaryWallet } from '@/features/token-sweep/types/fee';
	import {
		generateTemporaryWallet,
		downloadTemporaryWallet,
		storeTemporaryWallet,
		retrieveTemporaryWallet,
		clearTemporaryWallet
	} from '@/features/token-sweep/utils/temporary-wallet';
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import {
		AlertCircle,
		Download,
		Copy,
		Check,
		Key,
		Loader2,
		QrCode,
		Send,
		Wallet
	} from 'lucide-svelte';
	import QRCodeGenerator from '$lib/components/ui/qr-code.svelte';
	import type { Address, WalletClient } from 'viem';
	import { formatEther } from 'viem';

	interface Props {
		taskId: string;
		estimatedGasCost: bigint; // Estimated gas cost in wei
		networkSymbol: string;
		onWalletCreated?: (wallet: TemporaryWallet) => void;
		onWalletCleared?: () => void;
	}

	let { taskId, estimatedGasCost, networkSymbol, onWalletCreated, onWalletCleared }: Props =
		$props();

	const connectStore = useConnectStore();

	let temporaryWallet = $state<TemporaryWallet | null>(null);
	let isCreating = $state(false);
	let errorMessage = $state('');
	let copiedField = $state<string | null>(null);
	let showPrivateKey = $state(false);
	let showQR = $state(false);
	let isSendingGas = $state(false);
	let gasSendAmount = $state('');
	let walletBalance = $state<bigint>(0n);
	let isLoadingBalance = $state(false);

	// Format gas cost for display
	let formattedGasCost = $derived((Number(estimatedGasCost) / 1e18).toFixed(6));

	// Check if temporary wallet already exists in session storage
	$effect(() => {
		const existingWallet = retrieveTemporaryWallet(taskId);
		if (existingWallet) {
			temporaryWallet = existingWallet;
			loadWalletBalance();
		}
	});

	// Load wallet balance when wallet or network changes
	$effect(() => {
		if (temporaryWallet && connectStore.publicClient) {
			loadWalletBalance();
		}
	});

	async function loadWalletBalance() {
		if (!temporaryWallet || !connectStore.publicClient) return;

		isLoadingBalance = true;
		try {
			const balance = await connectStore.publicClient.getBalance({
				address: temporaryWallet.address as Address
			});
			walletBalance = balance;
		} catch (error) {
			console.error('Failed to load wallet balance:', error);
		} finally {
			isLoadingBalance = false;
		}
	}

	function handleCreateTemporaryWallet() {
		isCreating = true;
		errorMessage = '';

		try {
			// Generate a random temporary wallet
			const newWallet = generateTemporaryWallet(taskId);

			// Store in session storage
			storeTemporaryWallet(newWallet);

			// Update state
			temporaryWallet = newWallet;

			// Set suggested gas amount (estimated + 20% buffer)
			const suggestedAmount = Number(estimatedGasCost) * 1.2;
			gasSendAmount = (suggestedAmount / 1e18).toFixed(6);

			// Load wallet balance
			loadWalletBalance();

			// Notify parent
			if (onWalletCreated) {
				onWalletCreated(newWallet);
			}
		} catch (error) {
			console.error('Failed to create temporary wallet:', error);
			errorMessage = error instanceof Error ? error.message : 'Failed to create temporary wallet';
		} finally {
			isCreating = false;
		}
	}

	function handleDownloadWallet() {
		if (temporaryWallet) {
			downloadTemporaryWallet(temporaryWallet);
		}
	}

	function handleCopyToClipboard(text: string, field: string) {
		navigator.clipboard.writeText(text);
		copiedField = field;
		setTimeout(() => {
			copiedField = null;
		}, 2000);
	}

	function handleClearWallet() {
		if (
			confirm(
				'Are you sure you want to clear the temporary wallet? Make sure you have downloaded the private key if needed.'
			)
		) {
			clearTemporaryWallet(taskId);
			temporaryWallet = null;
			showPrivateKey = false;
			showQR = false;
			gasSendAmount = '';

			if (onWalletCleared) {
				onWalletCleared();
			}
		}
	}

	function togglePrivateKeyVisibility() {
		showPrivateKey = !showPrivateKey;
	}

	function toggleQR() {
		showQR = !showQR;
	}

	async function handleSendGasFromWallet() {
		if (!connectStore.walletClient || !connectStore.currentAddress || !temporaryWallet) {
			errorMessage = 'Please connect your wallet first';
			return;
		}

		if (!gasSendAmount || Number(gasSendAmount) <= 0) {
			errorMessage = 'Please enter a valid amount';
			return;
		}

		isSendingGas = true;
		errorMessage = '';

		try {
			const amountInWei = BigInt(Math.floor(Number(gasSendAmount) * 1e18));

			const hash = await (connectStore.walletClient as WalletClient).sendTransaction({
				account: connectStore.currentAddress as Address,
				to: temporaryWallet.address,
				value: amountInWei
			});

			alert(`Gas sent successfully!\n\nTransaction: ${hash}`);

			// Reload balance after successful transfer
			setTimeout(() => loadWalletBalance(), 2000);
		} catch (error) {
			console.error('Failed to send gas:', error);
			errorMessage = error instanceof Error ? error.message : 'Failed to send gas';
		} finally {
			isSendingGas = false;
		}
	}
</script>

<div class="temporary-wallet-manager">
	<div class="manager-header">
		<Key size={20} />
		<h4>Temporary Wallet</h4>
	</div>

	{#if !temporaryWallet}
		<!-- Create Temporary Wallet -->
		<div class="create-section">
			<p class="create-description">
				Create a random temporary wallet to automate batch transactions. The wallet will be stored
				in your browser session only.
			</p>

			<div class="create-warning">
				<AlertCircle size={18} />
				<div>
					<strong>Important:</strong> The temporary wallet will be created in your browser. You'll
					need to:
					<ul>
						<li>Download the private key for backup</li>
						<li>Fund it with <strong>{formattedGasCost} {networkSymbol}</strong> for gas fees</li>
						<li>Clear it after completing your tasks</li>
					</ul>
				</div>
			</div>

			<button class="btn-create" onclick={handleCreateTemporaryWallet} disabled={isCreating}>
				{#if isCreating}
					<Loader2 size={20} class="spinning" />
					Creating...
				{:else}
					<Key size={20} />
					Create Temporary Wallet
				{/if}
			</button>

			{#if errorMessage}
				<div class="error-message">
					<AlertCircle size={16} />
					<span>{errorMessage}</span>
				</div>
			{/if}
		</div>
	{:else}
		<!-- Display Temporary Wallet -->
		<div class="wallet-display">
			<div class="wallet-status">
				<div class="status-badge">
					<Check size={16} />
					<span>Wallet Ready</span>
				</div>
				<p class="status-info">
					Created: {new Date(temporaryWallet.createdAt).toLocaleString()}
				</p>
			</div>

			<!-- Wallet Address -->
			<div class="wallet-field">
				<label>Address</label>
				<div class="field-content">
					<code class="field-value">{temporaryWallet.address}</code>
					<button
						class="btn-icon"
						onclick={() => handleCopyToClipboard(temporaryWallet?.address || '', 'address')}
						title="Copy address"
					>
						{#if copiedField === 'address'}
							<Check size={16} />
						{:else}
							<Copy size={16} />
						{/if}
					</button>
					<button class="btn-qr" onclick={toggleQR} title="Show QR Code">
						<QrCode size={16} />
					</button>
				</div>
			</div>

			<!-- Balance Display -->
			<div class="wallet-field">
				<label>Balance (Current Network)</label>
				<div class="field-content balance-content">
					{#if isLoadingBalance}
						<Loader2 size={16} class="spinning" />
						<span class="balance-text">Loading...</span>
					{:else}
						<Wallet size={16} />
						<span class="balance-text">{formatEther(walletBalance)} {networkSymbol}</span>
					{/if}
				</div>
			</div>

			<!-- QR Code Display -->
			{#if showQR}
				<div class="qr-display">
					<QRCodeGenerator data={temporaryWallet.address} size={200} />
					<p class="qr-hint">Scan to send gas to this temporary wallet</p>
				</div>
			{/if}

			<!-- Private Key (Hidden by default) -->
			<div class="wallet-field">
				<label>Private Key</label>
				<div class="field-content">
					{#if showPrivateKey}
						<code class="field-value private-key">{temporaryWallet.privateKey}</code>
						<button
							class="btn-icon"
							onclick={() => handleCopyToClipboard(temporaryWallet?.privateKey || '', 'privateKey')}
							title="Copy private key"
						>
							{#if copiedField === 'privateKey'}
								<Check size={16} />
							{:else}
								<Copy size={16} />
							{/if}
						</button>
					{:else}
						<code class="field-value">{'•'.repeat(64)}</code>
					{/if}
					<button class="btn-toggle" onclick={togglePrivateKeyVisibility}>
						{showPrivateKey ? 'Hide' : 'Show'}
					</button>
				</div>
			</div>

			<!-- Gas Funding Section -->
			<div class="gas-funding-section">
				<h5>Fund Wallet with Gas</h5>
				<p class="gas-info">
					Estimated gas needed: <strong>{formattedGasCost} {networkSymbol}</strong>
				</p>

				<div class="gas-input-group">
					<input
						type="number"
						class="gas-input"
						bind:value={gasSendAmount}
						placeholder="Amount to send"
						step="0.001"
						min="0"
					/>
					<span class="gas-unit">{networkSymbol}</span>
				</div>

				<button
					class="btn-send-gas"
					onclick={handleSendGasFromWallet}
					disabled={isSendingGas || !connectStore.currentAddress}
				>
					{#if isSendingGas}
						<Loader2 size={16} class="spinning" />
						Sending...
					{:else}
						<Send size={16} />
						Send from Connected Wallet
					{/if}
				</button>

				<p class="gas-hint">
					💡 Tip: Add 20% extra gas to ensure sufficient funds. You can also scan the QR code to
					send from any wallet.
				</p>
			</div>

			<!-- Actions -->
			<div class="wallet-actions">
				<button class="btn-download" onclick={handleDownloadWallet}>
					<Download size={16} />
					Download Private Key
				</button>
				<button class="btn-clear" onclick={handleClearWallet}>Clear Wallet</button>
			</div>

			{#if errorMessage}
				<div class="error-message">
					<AlertCircle size={16} />
					<span>{errorMessage}</span>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.temporary-wallet-manager {
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		margin: var(--space-4) 0;
	}

	:global([data-theme='dark']) .temporary-wallet-manager {
		background: var(--gray-800);
		border-color: var(--gray-700);
	}

	.manager-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-4);
		color: var(--gray-800);
	}

	:global([data-theme='dark']) .manager-header {
		color: var(--gray-200);
	}

	.manager-header h4 {
		margin: 0;
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
	}

	.create-section {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.create-description {
		font-size: var(--text-sm);
		color: var(--gray-700);
		margin: 0;
		line-height: 1.5;
	}

	:global([data-theme='dark']) .create-description {
		color: var(--gray-300);
	}

	.create-warning {
		display: flex;
		gap: var(--space-2);
		padding: var(--space-3);
		background: hsla(45, 100%, 95%, 1);
		border: 1px solid hsl(45, 100%, 60%);
		border-radius: var(--radius-md);
		color: hsl(45, 100%, 25%);
		font-size: var(--text-sm);
	}

	:global([data-theme='dark']) .create-warning {
		background: hsla(45, 100%, 15%, 0.3);
		border-color: hsl(45, 100%, 40%);
		color: hsl(45, 100%, 70%);
	}

	.create-warning ul {
		margin: var(--space-2) 0 0 var(--space-4);
		padding: 0;
	}

	.create-warning li {
		margin: var(--space-1) 0;
	}

	.btn-create {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-4);
		background: linear-gradient(135deg, #3b82f6, #2563eb);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-create:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
	}

	.btn-create:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.error-message {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2);
		background: hsla(0, 80%, 95%, 1);
		border: 1px solid hsl(0, 80%, 60%);
		border-radius: var(--radius-sm);
		color: hsl(0, 80%, 40%);
		font-size: var(--text-sm);
	}

	:global([data-theme='dark']) .error-message {
		background: hsla(0, 80%, 15%, 0.3);
		border-color: hsl(0, 80%, 40%);
		color: hsl(0, 80%, 70%);
	}

	.wallet-display {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.wallet-status {
		padding: var(--space-3);
		background: hsla(142, 76%, 95%, 1);
		border: 1px solid #10b981;
		border-radius: var(--radius-md);
	}

	:global([data-theme='dark']) .wallet-status {
		background: hsla(142, 76%, 15%, 0.3);
		border-color: #10b981;
	}

	.status-badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-1) var(--space-2);
		background: #10b981;
		color: white;
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		margin-bottom: var(--space-2);
	}

	.status-info {
		margin: 0;
		font-size: var(--text-xs);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .status-info {
		color: var(--gray-300);
	}

	.wallet-field {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.wallet-field label {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .wallet-field label {
		color: var(--gray-300);
	}

	.field-content {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2);
		background: var(--gray-100);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
	}

	:global([data-theme='dark']) .field-content {
		background: var(--gray-900);
		border-color: var(--gray-700);
	}

	.field-value {
		flex: 1;
		font-family: 'Courier New', monospace;
		font-size: var(--text-sm);
		color: var(--gray-900);
		word-break: break-all;
	}

	:global([data-theme='dark']) .field-value {
		color: var(--gray-100);
	}

	.field-value.private-key {
		color: #ef4444;
		font-weight: var(--font-semibold);
	}

	.btn-icon,
	.btn-qr,
	.btn-toggle {
		padding: var(--space-1);
		background: transparent;
		border: none;
		cursor: pointer;
		color: var(--color-primary);
		transition: all 0.2s;
		flex-shrink: 0;
	}

	.btn-icon:hover,
	.btn-qr:hover,
	.btn-toggle:hover {
		opacity: 0.7;
	}

	.btn-toggle {
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		text-transform: uppercase;
	}

	.balance-content {
		background: hsla(142, 76%, 95%, 1);
		border-color: #10b981;
	}

	:global([data-theme='dark']) .balance-content {
		background: hsla(142, 76%, 15%, 0.3);
		border-color: #10b981;
	}

	.balance-text {
		flex: 1;
		font-family: 'Courier New', monospace;
		font-size: var(--text-base);
		font-weight: var(--font-bold);
		color: #10b981;
	}

	.balance-content :global(svg) {
		color: #10b981;
	}

	.qr-display {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-4);
		background: white;
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
	}

	:global([data-theme='dark']) .qr-display {
		background: var(--gray-900);
		border-color: var(--gray-700);
	}

	.qr-hint {
		margin: 0;
		font-size: var(--text-sm);
		color: var(--gray-600);
		text-align: center;
	}

	:global([data-theme='dark']) .qr-hint {
		color: var(--gray-400);
	}

	.gas-funding-section {
		padding: var(--space-4);
		background: hsla(204, 100%, 95%, 1);
		border: 2px solid #3b82f6;
		border-radius: var(--radius-md);
	}

	:global([data-theme='dark']) .gas-funding-section {
		background: hsla(204, 100%, 15%, 0.3);
		border-color: #3b82f6;
	}

	.gas-funding-section h5 {
		margin: 0 0 var(--space-2) 0;
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-800);
	}

	:global([data-theme='dark']) .gas-funding-section h5 {
		color: var(--gray-200);
	}

	.gas-info {
		margin: 0 0 var(--space-3) 0;
		font-size: var(--text-sm);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .gas-info {
		color: var(--gray-300);
	}

	.gas-input-group {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-3);
	}

	.gas-input {
		flex: 1;
		padding: var(--space-2);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		font-family: 'Courier New', monospace;
		font-size: var(--text-sm);
	}

	.gas-input:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.gas-unit {
		font-weight: var(--font-semibold);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .gas-unit {
		color: var(--gray-300);
	}

	.btn-send-gas {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.2s;
		margin-bottom: var(--space-2);
	}

	.btn-send-gas:hover:not(:disabled) {
		opacity: 0.9;
	}

	.btn-send-gas:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.gas-hint {
		margin: 0;
		font-size: var(--text-xs);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .gas-hint {
		color: var(--gray-400);
	}

	.wallet-actions {
		display: flex;
		gap: var(--space-2);
		margin-top: var(--space-2);
	}

	.btn-download,
	.btn-clear {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		border: none;
		border-radius: var(--radius-md);
		font-weight: var(--font-semibold);
		font-size: var(--text-sm);
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-download {
		background: var(--color-primary);
		color: white;
	}

	.btn-download:hover {
		opacity: 0.9;
	}

	.btn-clear {
		background: var(--gray-200);
		color: var(--gray-800);
	}

	.btn-clear:hover {
		background: var(--gray-300);
	}

	:global([data-theme='dark']) .btn-clear {
		background: var(--gray-700);
		color: var(--gray-200);
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
