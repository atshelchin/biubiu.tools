<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import {
		Wallet,
		RefreshCw,
		Check,
		ChevronDown,
		Copy,
		LogOut,
		AlertTriangle
	} from 'lucide-svelte';
	import type { NetworkConfig } from '@shelchin/ethereum-connectors';
	import Dropdown from './dropdown.svelte';
	import { longPress } from '$lib/utils/long-press';

	interface Props {
		selectedChainId: number;
		selectedNetwork?: NetworkConfig;
		class?: string;
	}

	let { selectedChainId, selectedNetwork, class: className = '' }: Props = $props();

	const connectStore = useConnectStore();

	// Wallet connection states
	const isWalletConnected = $derived(connectStore.isConnected);
	const isWalletConnecting = $derived(connectStore.isConnecting);
	const walletChainId = $derived(connectStore.currentChainId);
	const isNetworkMismatch = $derived(isWalletConnected && walletChainId !== selectedChainId);

	let connectionError = $state<string | null>(null);
	let isSwitching = $state(false);

	// Long press reset
	let longPressProgress = $state(0);
	let isPressing = $state(false);

	// Account management
	let accounts = $state<string[]>([]);
	let showAccountDropdown = $state(false);
	let accountButtonElement = $state<HTMLElement | undefined>();
	let copySuccess = $state(false);

	// Format address for display
	function formatAddress(addr: string): string {
		return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
	}

	// Load accounts
	async function loadAccounts() {
		const accs = await connectStore.getAccounts();
		accounts = accs || [];
	}

	// Switch account
	async function handleSwitchAccount(address: string) {
		await connectStore.switchAccount(address);
		showAccountDropdown = false;
	}

	// Copy address
	async function copyAddress() {
		if (!connectStore.address) return;
		try {
			await navigator.clipboard.writeText(connectStore.address);
			copySuccess = true;
			setTimeout(() => {
				copySuccess = false;
			}, 2000);
		} catch (error) {
			console.error('Failed to copy address:', error);
		}
	}

	// Handle wallet connection with error handling
	async function handleConnectWallet() {
		connectionError = null;
		connectStore.openConnectorModal();
	}

	// Long press to force reset connection
	async function forceResetConnection() {
		console.log('forceResetConnection');
		await connectStore.cancelConnection();
		isPressing = false;
		longPressProgress = 0;
	}

	// Handle network switching with error handling
	async function handleSwitchNetwork() {
		connectionError = null;
		isSwitching = true;

		try {
			await connectStore.switchNetwork(selectedChainId);
		} catch (error) {
			handleConnectionError(error);
		} finally {
			isSwitching = false;
		}
	}

	// Parse and display friendly error messages
	function handleConnectionError(error: unknown) {
		console.error('Wallet connection error:', error);

		if (error instanceof Error) {
			const errorMessage = error.message;

			// Chain not supported error
			if (errorMessage.includes('is not supported by this connector')) {
				const chainIdMatch = errorMessage.match(/Chain \[(\d+)\]/);
				const connectorMatch = errorMessage.match(/connector \[(.*?)\]/);

				const chainId = chainIdMatch ? chainIdMatch[1] : selectedChainId.toString();
				const connectorName = connectorMatch ? connectorMatch[1] : 'Your wallet';

				connectionError = `${connectorName} doesn't support ${selectedNetwork?.name || `Chain ${chainId}`}. Please try a different wallet or select another network that your wallet supports.`;
			}
			// User rejected request
			else if (errorMessage.includes('User rejected') || errorMessage.includes('rejected')) {
				connectionError = 'Connection request was rejected. Please try again when you are ready.';
			}
			// Network switch error
			else if (errorMessage.includes('switch') || errorMessage.includes('Switch')) {
				connectionError = `Failed to switch to ${selectedNetwork?.name || 'the selected network'}. Please try switching manually in your wallet settings.`;
			}
			// Generic error
			else {
				connectionError = `Failed to connect: ${errorMessage}`;
			}
		} else {
			connectionError = 'An unexpected error occurred. Please try again or contact support.';
		}
	}

	// Clear error when network changes
	$effect(() => {
		if (selectedChainId) {
			connectionError = null;
		}
	});

	// Load accounts when connected
	$effect(() => {
		if (isWalletConnected) {
			loadAccounts();
		} else {
			accounts = [];
		}
	});
</script>

<div class="wallet-connect-button-wrapper {className}">
	{#if !isWalletConnected}
		<!-- Not connected - show connect button -->
		<div class="connect-button-container">
			<div
				use:longPress={{
					duration: 3000,
					onProgress: (progress) => {
						if (progress > 0) {
							isPressing = true;
							longPressProgress = progress;
						} else {
							isPressing = false;
							longPressProgress = 0;
						}
					},
					onComplete: forceResetConnection
				}}
			>
				<button class="connect-button" onclick={handleConnectWallet} disabled={isWalletConnecting}>
					<div class="button-content">
						<Wallet size={24} />
						<span class="button-text">
							{isWalletConnecting ? 'Connecting Wallet...' : 'Connect Wallet'}
						</span>
					</div>
				</button>
			</div>

			<!-- Long press indicator -->
			{#if isWalletConnecting && isPressing && longPressProgress > 0}
				<div class="long-press-indicator">
					<div class="progress-bar" style:width="{longPressProgress}%"></div>
				</div>
			{/if}
		</div>

		<!-- Reset hint -->
		{#if isWalletConnecting}
			<div class="reset-hint">💡 Long press the button to cancel connection</div>
		{/if}
	{:else if isNetworkMismatch}
		<!-- Connected but wrong network -->
		<div class="network-mismatch-container">
			<div class="warning-card">
				<div class="warning-header">
					<AlertTriangle size={24} class="warning-icon" />
					<h4>Network Mismatch</h4>
				</div>
				<p class="warning-text">
					Your wallet is on a different network. Please switch to <strong
						>{selectedNetwork?.name || `Chain ${selectedChainId}`}</strong
					> to continue.
				</p>
			</div>

			<div class="action-buttons">
				<button class="switch-button primary" onclick={handleSwitchNetwork} disabled={isSwitching}>
					<RefreshCw size={20} class={isSwitching ? 'spinning' : ''} />
					<span>{isSwitching ? 'Switching Network...' : 'Switch Network in Wallet'}</span>
				</button>
				<button class="switch-button secondary" onclick={handleConnectWallet}>
					<Wallet size={20} />
					<span>Connect Different Wallet</span>
				</button>
			</div>
		</div>
	{:else}
		<!-- Connected and correct network -->
		<div class="connected-container">
			<div class="connected-card">
				<div class="connected-header">
					<Check size={20} class="check-icon" />
					<span class="connected-label"
						>Connected to {selectedNetwork?.name || `Chain ${selectedChainId}`}</span
					>
				</div>

				<div class="wallet-details">
					<div class="account-info">
						<div class="account-section">
							<button
								bind:this={accountButtonElement}
								class="account-button"
								class:has-multiple={accounts.length > 1}
								onclick={() => {
									if (accounts.length > 1) {
										showAccountDropdown = !showAccountDropdown;
									}
								}}
							>
								{#if connectStore.connectorIcon}
									<img src={connectStore.connectorIcon} alt="Wallet" class="wallet-icon" />
								{:else}
									<div class="wallet-icon-placeholder">
										<Wallet size={20} />
									</div>
								{/if}
								<div class="account-address-display">
									<span class="address-label">Address</span>
									<span class="address-value">{formatAddress(connectStore.address || '')}</span>
								</div>
								{#if accounts.length > 1}
									<ChevronDown size={16} class="chevron-icon" />
								{/if}
							</button>

							<div class="account-actions">
								<button class="icon-action-button" onclick={copyAddress} title="Copy address">
									{#if copySuccess}
										<Check size={16} />
									{:else}
										<Copy size={16} />
									{/if}
								</button>
								<button
									class="icon-action-button disconnect"
									onclick={connectStore.disconnect}
									title="Disconnect wallet"
								>
									<LogOut size={16} />
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Account Dropdown -->
		{#if accounts.length > 1}
			<Dropdown
				bind:open={showAccountDropdown}
				onClose={() => (showAccountDropdown = false)}
				trigger={accountButtonElement}
				align="left"
			>
				<div class="accounts-dropdown">
					<div class="dropdown-header">
						<span>Select Account</span>
						<span class="account-count">{accounts.length} accounts</span>
					</div>
					{#each accounts as account (account)}
						<button class="account-item" onclick={() => handleSwitchAccount(account)}>
							<div class="account-item-content">
								<span class="account-item-address">{formatAddress(account)}</span>
								<span class="account-item-full">{account}</span>
							</div>
							{#if account.toLowerCase() === connectStore.address?.toLowerCase()}
								<Check size={16} class="check-icon-small" />
							{/if}
						</button>
					{/each}
				</div>
			</Dropdown>
		{/if}
	{/if}

	<!-- Error Message Display -->
	{#if connectionError}
		<div class="error-card">
			<div class="error-header">
				<AlertTriangle size={20} class="error-icon" />
				<h4>Connection Error</h4>
			</div>
			<p class="error-text">{connectionError}</p>
		</div>
	{/if}
</div>

<style>
	.wallet-connect-button-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		width: 100%;
	}

	/* Connect Button */
	.connect-button-container {
		position: relative;
		width: 100%;
	}

	.connect-button {
		width: 100%;
		min-height: 64px;
		padding: var(--space-4) var(--space-6);
		background: linear-gradient(
			135deg,
			var(--color-primary),
			hsl(var(--brand-hue), var(--brand-saturation), 45%)
		);
		color: white;
		border: none;
		border-radius: var(--radius-lg);
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 12px hsla(var(--brand-hue), var(--brand-saturation), 50%, 0.3);
	}

	.connect-button:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 8px 24px hsla(var(--brand-hue), var(--brand-saturation), 50%, 0.4);
	}

	.connect-button:active:not(:disabled) {
		transform: translateY(0);
	}

	.connect-button:disabled {
		opacity: 0.8;
		cursor: not-allowed;
	}

	/* Long Press Indicator */
	.long-press-indicator {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: hsla(0, 0%, 100%, 0.2);
		border-radius: 0 0 var(--radius-lg) var(--radius-lg);
		overflow: hidden;
	}

	.progress-bar {
		height: 100%;
		background: linear-gradient(90deg, hsl(45, 100%, 50%), hsl(0, 80%, 50%));
		transition: width 0.05s linear;
	}

	.reset-hint {
		font-size: var(--text-sm);
		color: var(--gray-600);
		text-align: center;
		margin-top: var(--space-2);
		animation: fadeIn 0.3s ease-out;
	}

	:global([data-theme='dark']) .reset-hint {
		color: var(--gray-400);
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.button-content {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-3);
	}

	.button-text {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
	}

	/* Network Mismatch */
	.network-mismatch-container {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.warning-card {
		padding: var(--space-5);
		background: hsla(45, 100%, 50%, 0.08);
		border: 2px solid hsl(45, 100%, 50%);
		border-radius: var(--radius-lg);
	}

	:global([data-theme='dark']) .warning-card {
		background: hsla(45, 100%, 60%, 0.12);
		border-color: hsl(45, 100%, 60%);
	}

	.warning-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-3);
	}

	.warning-header h4 {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: hsl(45, 100%, 35%);
		margin: 0;
	}

	:global([data-theme='dark']) .warning-header h4 {
		color: hsl(45, 100%, 60%);
	}

	.warning-icon {
		color: hsl(45, 100%, 45%);
		flex-shrink: 0;
	}

	:global([data-theme='dark']) .warning-icon {
		color: hsl(45, 100%, 60%);
	}

	.warning-text {
		font-size: var(--text-base);
		color: var(--gray-700);
		line-height: 1.6;
		margin: 0;
	}

	:global([data-theme='dark']) .warning-text {
		color: var(--gray-300);
	}

	.warning-text strong {
		color: hsl(45, 100%, 30%);
	}

	:global([data-theme='dark']) .warning-text strong {
		color: hsl(45, 100%, 70%);
	}

	/* Action Buttons */
	.action-buttons {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-3);
	}

	.switch-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		min-height: 56px;
		padding: var(--space-4) var(--space-5);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-lg);
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.switch-button.primary {
		background: var(--color-primary);
		color: white;
		border-color: var(--color-primary);
	}

	.switch-button.primary:hover:not(:disabled) {
		background: hsl(var(--brand-hue), var(--brand-saturation), 45%);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px hsla(var(--brand-hue), var(--brand-saturation), 50%, 0.3);
	}

	.switch-button.secondary {
		background: var(--color-background);
		color: var(--gray-700);
		border-color: var(--color-border);
	}

	:global([data-theme='dark']) .switch-button.secondary {
		color: var(--gray-300);
	}

	.switch-button.secondary:hover {
		background: var(--color-panel-1);
		border-color: var(--color-primary);
		transform: translateY(-2px);
	}

	.switch-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.switch-button :global(.spinning) {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* Connected State */
	.connected-container {
		width: 100%;
	}

	.connected-card {
		padding: var(--space-5);
		background: hsla(120, 60%, 50%, 0.08);
		border: 2px solid hsl(120, 60%, 50%);
		border-radius: var(--radius-lg);
	}

	:global([data-theme='dark']) .connected-card {
		background: hsla(120, 60%, 60%, 0.12);
		border-color: hsl(120, 60%, 60%);
	}

	.connected-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-4);
	}

	.check-icon {
		color: hsl(120, 60%, 40%);
		flex-shrink: 0;
	}

	:global([data-theme='dark']) .check-icon {
		color: hsl(120, 60%, 60%);
	}

	.connected-label {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: hsl(120, 60%, 30%);
	}

	:global([data-theme='dark']) .connected-label {
		color: hsl(120, 60%, 70%);
	}

	.wallet-details {
		display: flex;
		align-items: center;
		gap: var(--space-4);
	}

	.wallet-icon {
		width: 48px;
		height: 48px;
		border-radius: var(--radius-md);
		flex-shrink: 0;
	}

	.wallet-icon-placeholder {
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-muted);
		border-radius: var(--radius-md);
		color: var(--gray-600);
		flex-shrink: 0;
	}

	.account-info {
		flex: 1;
		min-width: 0;
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
		justify-content: space-between;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-4);
		background: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
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
	}

	.account-address-display {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		flex: 1;
		min-width: 0;
	}

	.address-label {
		font-size: var(--text-xs);
		color: var(--gray-500);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.address-value {
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		color: var(--gray-900);
		font-family: var(--font-mono, monospace);
	}

	:global([data-theme='dark']) .address-value {
		color: var(--gray-100);
	}

	.chevron-icon {
		color: var(--gray-500);
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

	/* Account Dropdown */
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

	.account-item-address {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .account-item-address {
		color: var(--gray-100);
	}

	.account-item-full {
		font-size: var(--text-xs);
		color: var(--gray-500);
		font-family: var(--font-mono, monospace);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.check-icon-small {
		color: var(--color-primary);
		flex-shrink: 0;
	}

	/* Error Card */
	.error-card {
		padding: var(--space-4);
		background: hsla(0, 80%, 50%, 0.08);
		border: 2px solid hsl(0, 80%, 50%);
		border-radius: var(--radius-lg);
	}

	:global([data-theme='dark']) .error-card {
		background: hsla(0, 80%, 60%, 0.12);
		border-color: hsl(0, 80%, 60%);
	}

	.error-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-2);
	}

	.error-header h4 {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: hsl(0, 80%, 40%);
		margin: 0;
	}

	:global([data-theme='dark']) .error-header h4 {
		color: hsl(0, 80%, 65%);
	}

	.error-icon {
		color: hsl(0, 80%, 50%);
		flex-shrink: 0;
	}

	:global([data-theme='dark']) .error-icon {
		color: hsl(0, 80%, 65%);
	}

	.error-text {
		font-size: var(--text-sm);
		color: var(--gray-700);
		line-height: 1.6;
		margin: 0;
	}

	:global([data-theme='dark']) .error-text {
		color: var(--gray-300);
	}

	/* Responsive */
	@media (max-width: 640px) {
		.action-buttons {
			grid-template-columns: 1fr;
		}

		.wallet-details {
			/* Keep flex-row to maintain icon and address on same line */
			gap: var(--space-3);
		}

		.wallet-icon,
		.wallet-icon-placeholder {
			width: 32px;
			height: 32px;
			flex-shrink: 0;
		}

		.account-info {
			flex: 1;
			min-width: 0;
		}

		.account-section {
			width: 100%;
			flex-direction: column;
			gap: var(--space-2);
		}

		.account-button {
			width: 100%;
			font-size: var(--text-sm);
		}

		.account-actions {
			width: 100%;
			justify-content: stretch;
		}

		.icon-action-button {
			flex: 1;
		}
	}
</style>
