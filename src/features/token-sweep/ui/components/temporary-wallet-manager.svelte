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
		Wallet,
		RefreshCw
	} from '@lucide/svelte';
	import QRCodeGenerator from '$lib/components/ui/qr-code.svelte';
	import GasFundingModal from '$lib/components/ui/gas-funding-modal.svelte';
	import type { Address } from 'viem';
	import { formatEther } from 'viem';
	import { useI18n } from '@shelchin/i18n';

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
	const i18n = useI18n();

	let temporaryWallet = $state<TemporaryWallet | null>(null);
	let isCreating = $state(false);
	let errorMessage = $state('');
	let successMessage = $state('');
	let copiedField = $state<string | null>(null);
	let showPrivateKey = $state(false);
	let showQR = $state(false);
	let showGasFundingModal = $state(false);
	let isSendingGas = $state(false);
	let gasSendAmount = $state('');
	let walletBalance = $state<bigint>(0n);
	let isLoadingBalance = $state(false);

	// Format gas cost for display (2x the estimated cost as suggested amount)
	let formattedGasCost = $derived((Number(estimatedGasCost) / 1e18).toFixed(6));
	let suggestedGasCost = $derived(((Number(estimatedGasCost) * 2) / 1e18).toFixed(6));

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
		// Only run when wallet exists and network is selected
		const wallet = temporaryWallet;
		const chainId = connectStore.currentChainId;

		if (wallet && chainId) {
			loadWalletBalance();
		}
	});

	async function loadWalletBalance() {
		if (!temporaryWallet) {
			console.warn('No temporary wallet available');
			return;
		}

		const publicClient = connectStore.publicClient;
		if (!publicClient) {
			console.warn('No public client available - network may not be selected');
			return;
		}

		isLoadingBalance = true;
		errorMessage = '';

		try {
			console.log('Loading balance for:', temporaryWallet.address);
			const balance = await publicClient.getBalance({
				address: temporaryWallet.address as Address
			});
			console.log('Balance loaded:', balance);
			walletBalance = balance;
		} catch (error) {
			console.error('Failed to load wallet balance:', error);
			errorMessage = error instanceof Error ? error.message : 'Failed to load balance';
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

			// Set suggested gas amount (2x the estimated cost)
			gasSendAmount = suggestedGasCost;

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
		if (confirm(i18n.t('tools.token_sweep.temporary_wallet.confirm_clear'))) {
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

	function openGasFundingModal() {
		showGasFundingModal = true;
	}

	function closeGasFundingModal() {
		showGasFundingModal = false;
	}

	async function handleSendGasFromWallet() {
		if (!connectStore.address || !temporaryWallet) {
			errorMessage = i18n.t('tools.token_sweep.temporary_wallet.error_no_wallet');
			return;
		}

		if (!gasSendAmount || Number(gasSendAmount) <= 0) {
			errorMessage = i18n.t('tools.token_sweep.temporary_wallet.error_invalid_amount');
			return;
		}

		isSendingGas = true;
		errorMessage = '';
		successMessage = '';

		try {
			const amountInWei = BigInt(Math.floor(Number(gasSendAmount) * 1e18));
			const amount = gasSendAmount;

			const hash = await connectStore.sendTransaction({
				to: temporaryWallet.address as Address,
				value: amountInWei,
				data: '0x',
				gas: BigInt(21000) // Basic transfer gas limit
			});

			// Show success message
			successMessage = i18n.t('tools.token_sweep.temporary_wallet.success_transfer', {
				amount,
				symbol: networkSymbol,
				tx: hash.slice(0, 10)
			});

			// Clear input field
			gasSendAmount = '';

			// Close modal
			closeGasFundingModal();

			// Auto-clear success message after 10 seconds
			setTimeout(() => {
				successMessage = '';
			}, 10000);

			// Reload balance after successful transfer with retry logic
			// Try multiple times to ensure blockchain has processed the transaction
			setTimeout(async () => {
				for (let i = 0; i < 3; i++) {
					await new Promise((resolve) => setTimeout(resolve, 2000));
					await loadWalletBalance();
				}
			}, 1000);
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
		<h4>{i18n.t('tools.token_sweep.temporary_wallet.title')}</h4>
	</div>

	{#if !temporaryWallet}
		<!-- Create Temporary Wallet -->
		<div class="create-section">
			<p class="create-description">
				{i18n.t('tools.token_sweep.temporary_wallet.description')}
			</p>

			<div class="create-warning">
				<AlertCircle size={18} />
				<div>
					<strong>{i18n.t('tools.token_sweep.temporary_wallet.important')}:</strong>
					{i18n.t('tools.token_sweep.temporary_wallet.warning_text')}
					<ul>
						<li>{i18n.t('tools.token_sweep.temporary_wallet.step_download')}</li>
						<li>
							{i18n.t('tools.token_sweep.temporary_wallet.step_fund', {
								amount: formattedGasCost,
								symbol: networkSymbol
							})}
						</li>
						<li>{i18n.t('tools.token_sweep.temporary_wallet.step_clear')}</li>
					</ul>
				</div>
			</div>

			<button class="btn-create" onclick={handleCreateTemporaryWallet} disabled={isCreating}>
				{#if isCreating}
					<Loader2 size={20} class="spinning" />
					{i18n.t('tools.token_sweep.temporary_wallet.creating')}
				{:else}
					<Key size={20} />
					{i18n.t('tools.token_sweep.temporary_wallet.btn_create')}
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
			<!-- <div class="wallet-status">
				<div class="status-badge">
					<Check size={16} />
					<span>{i18n.t('tools.token_sweep.temporary_wallet.wallet_ready')}</span>
				</div>
				<p class="status-info">
					{i18n.t('tools.token_sweep.temporary_wallet.created_at', {
						time: new Date(temporaryWallet.createdAt).toLocaleString()
					})}
				</p>
			</div> -->

			<!-- Wallet Address -->
			<div class="wallet-field">
				<div class="field-label">{i18n.t('tools.token_sweep.temporary_wallet.address')}</div>
				<div class="field-content">
					<code class="field-value">{temporaryWallet.address}</code>
					<button
						class="btn-icon"
						onclick={() => handleCopyToClipboard(temporaryWallet?.address || '', 'address')}
						title={i18n.t('tools.token_sweep.temporary_wallet.copy_address')}
					>
						{#if copiedField === 'address'}
							<Check size={16} />
						{:else}
							<Copy size={16} />
						{/if}
					</button>
					<button
						class="btn-qr"
						onclick={toggleQR}
						title={i18n.t('tools.token_sweep.temporary_wallet.show_qr')}
					>
						<QrCode size={16} />
					</button>
				</div>
			</div>

			<!-- Balance Display -->
			<div class="wallet-field">
				<div class="field-label">{i18n.t('tools.token_sweep.temporary_wallet.balance')}</div>
				<div class="field-content balance-content">
					{#if isLoadingBalance}
						<Loader2 size={16} class="spinning" />
						<span class="balance-text">{i18n.t('tools.token_sweep.temporary_wallet.loading')}</span>
					{:else}
						<Wallet size={16} />
						<span class="balance-text">{formatEther(walletBalance)} {networkSymbol}</span>
					{/if}
					<button
						class="btn-refresh {isLoadingBalance ? 'spinning' : ''}"
						onclick={loadWalletBalance}
						disabled={isLoadingBalance}
						title={i18n.t('tools.token_sweep.temporary_wallet.refresh_balance')}
					>
						<RefreshCw size={16} />
					</button>
				</div>
			</div>

			<!-- QR Code Display -->
			{#if showQR}
				<div class="qr-display">
					<QRCodeGenerator data={temporaryWallet.address} size={200} />
					<p class="qr-hint">{i18n.t('tools.token_sweep.temporary_wallet.qr_hint')}</p>
				</div>
			{/if}

			<!-- Actions -->
			<div class="wallet-actions">
				<button class="btn-download" onclick={handleDownloadWallet}>
					<Download size={16} />
					{i18n.t('tools.token_sweep.temporary_wallet.btn_download')}
				</button>
				<button class="btn-fund-gas" onclick={openGasFundingModal}>
					<Send size={16} />
					{i18n.t('tools.token_sweep.temporary_wallet.fund_title')}
				</button>
			</div>

			{#if errorMessage}
				<div class="error-message">
					<AlertCircle size={16} />
					<span>{errorMessage}</span>
				</div>
			{/if}

			{#if successMessage}
				<div class="success-message">
					<span>{successMessage}</span>
				</div>
			{/if}
		</div>
	{/if}
</div>

<!-- Gas Funding Modal -->
{#if temporaryWallet}
	<GasFundingModal
		open={showGasFundingModal}
		walletAddress={temporaryWallet.address}
		estimatedGasCost={formattedGasCost}
		suggestedAmount={suggestedGasCost}
		{networkSymbol}
		{isSendingGas}
		bind:gasSendAmount
		isConnected={Boolean(connectStore.address)}
		onClose={closeGasFundingModal}
		onSend={handleSendGasFromWallet}
		onAmountChange={(amount) => {
			gasSendAmount = amount;
		}}
	/>
{/if}

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

	.success-message {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3);
		background: hsla(142, 76%, 95%, 1);
		border: 1px solid #10b981;
		border-radius: var(--radius-sm);
		color: #059669;
		font-size: var(--text-sm);
		margin-top: var(--space-3);
	}

	:global([data-theme='dark']) .success-message {
		background: hsla(142, 76%, 15%, 0.3);
		border-color: #10b981;
		color: #10b981;
	}

	.wallet-display {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.wallet-field {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.wallet-field .field-label {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .wallet-field .field-label {
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

	.btn-icon,
	.btn-qr,
	.btn-refresh {
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
	.btn-refresh:hover:not(:disabled) {
		opacity: 0.7;
	}

	.btn-refresh {
		margin-left: auto;
		color: #10b981;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.btn-refresh:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-refresh.spinning {
		animation: spin 1s linear infinite;
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

	.wallet-actions {
		display: flex;
		gap: var(--space-2);
		margin-top: var(--space-2);
	}

	.btn-download,
	.btn-fund-gas {
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

	.btn-fund-gas {
		background: linear-gradient(135deg, #10b981, #059669);
		color: white;
	}

	.btn-fund-gas:hover {
		opacity: 0.9;
		transform: translateY(-1px);
		box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
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
