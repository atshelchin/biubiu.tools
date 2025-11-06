<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import { Wallet, AlertCircle, ArrowLeft } from 'lucide-svelte';
	import NetworkIcon from './network-icon.svelte';

	interface Props {
		showChangeButton?: boolean;
		showReconnectButton?: boolean;
		onChangeWallet?: () => void;
		onReconnect?: () => void;
		class?: string;
	}

	let {
		showChangeButton = true,
		showReconnectButton = true,
		onChangeWallet,
		onReconnect,
		class: className = ''
	}: Props = $props();

	const connectStore = useConnectStore();

	// Format address
	function formatAddress(addr: string): string {
		return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
	}

	// Get current network
	const currentNetwork = $derived(
		connectStore.currentChainId
			? connectStore.networks.find((n) => n.chainId === connectStore.currentChainId)
			: undefined
	);

	// Handle reconnection
	function handleReconnect() {
		if (onReconnect) {
			onReconnect();
		} else {
			connectStore.openConnectorModal();
		}
	}

	// Handle change wallet
	function handleChangeWallet() {
		if (onChangeWallet) {
			onChangeWallet();
		}
	}
</script>

<div class="wallet-connection-status {className}">
	{#if connectStore.isConnected && connectStore.address}
		<!-- Connected State -->
		<div class="status-card connected">
			<div class="status-header">
				<div class="header-icon connected-badge">
					<div class="pulse-dot"></div>
					<span>Connected</span>
				</div>
			</div>

			<div class="connection-details">
				<!-- Wallet Info -->
				<div class="detail-row">
					<div class="detail-label">Wallet</div>
					<div class="detail-value wallet-info">
						{#if connectStore.connectorIcon}
							<img src={connectStore.connectorIcon} alt="Wallet" class="wallet-icon" />
						{:else}
							<div class="wallet-icon-placeholder">
								<Wallet size={20} />
							</div>
						{/if}
						<span class="wallet-address">{formatAddress(connectStore.address)}</span>
					</div>
				</div>

				<!-- Network Info -->
				{#if currentNetwork}
					<div class="detail-row">
						<div class="detail-label">Network</div>
						<div class="detail-value network-info">
							<NetworkIcon chainId={currentNetwork.chainId} size={28} />
							<div class="network-details">
								<span class="network-name">{currentNetwork.name}</span>
								<span class="network-chain-id">Chain ID: {currentNetwork.chainId}</span>
							</div>
						</div>
					</div>
				{/if}
			</div>

			<!-- Change Wallet Button -->
			{#if showChangeButton && onChangeWallet}
				<button class="action-button change-button" onclick={handleChangeWallet}>
					<ArrowLeft size={16} />
					<span>Change Wallet/Network</span>
				</button>
			{/if}
		</div>
	{:else}
		<!-- Disconnected State -->
		<div class="status-card disconnected">
			<div class="disconnect-header">
				<div class="disconnect-icon">
					<AlertCircle size={24} />
				</div>
				<div class="disconnect-info">
					<h4>Wallet Disconnected</h4>
					<p>Your wallet connection was lost. Please reconnect to continue.</p>
				</div>
			</div>

			<!-- Reconnect Button -->
			{#if showReconnectButton}
				<button class="action-button reconnect-button" onclick={handleReconnect}>
					<Wallet size={18} />
					<span>Reconnect Wallet</span>
				</button>
			{/if}
		</div>
	{/if}
</div>

<style>
	.wallet-connection-status {
		width: 100%;
	}

	/* Status Card */
	.status-card {
		padding: var(--space-4);
		border-radius: var(--radius-lg);
		border: 2px solid var(--color-border);
		transition: all 0.2s ease;
	}

	.status-card.connected {
		background: linear-gradient(135deg, hsla(120, 60%, 50%, 0.08), hsla(120, 60%, 50%, 0.04));
		border-color: hsl(120, 60%, 50%);
	}

	:global([data-theme='dark']) .status-card.connected {
		background: linear-gradient(135deg, hsla(120, 60%, 60%, 0.12), hsla(120, 60%, 60%, 0.06));
		border-color: hsl(120, 60%, 60%);
	}

	.status-card.disconnected {
		background: linear-gradient(135deg, hsla(0, 80%, 50%, 0.08), hsla(0, 80%, 50%, 0.04));
		border-color: hsl(0, 80%, 50%);
	}

	:global([data-theme='dark']) .status-card.disconnected {
		background: linear-gradient(135deg, hsla(0, 80%, 60%, 0.12), hsla(0, 80%, 60%, 0.06));
		border-color: hsl(0, 80%, 60%);
	}

	/* Status Header */
	.status-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-4);
	}

	.header-icon {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
	}

	.connected-badge {
		color: hsl(120, 60%, 40%);
		position: relative;
	}

	:global([data-theme='dark']) .connected-badge {
		color: hsl(120, 60%, 60%);
	}

	/* Pulse Animation */
	.pulse-dot {
		width: 8px;
		height: 8px;
		background: hsl(120, 60%, 50%);
		border-radius: 50%;
		position: relative;
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
			transform: scale(1);
		}
		50% {
			opacity: 0.6;
			transform: scale(1.2);
		}
	}

	.pulse-dot::before {
		content: '';
		position: absolute;
		top: -4px;
		left: -4px;
		right: -4px;
		bottom: -4px;
		background: hsl(120, 60%, 50%);
		border-radius: 50%;
		opacity: 0.3;
		animation: pulse-ring 2s ease-in-out infinite;
	}

	@keyframes pulse-ring {
		0% {
			transform: scale(0.8);
			opacity: 0.5;
		}
		100% {
			transform: scale(1.5);
			opacity: 0;
		}
	}

	/* Connection Details */
	.connection-details {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		margin-bottom: var(--space-4);
	}

	.detail-row {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.detail-label {
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		color: var(--gray-500);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.detail-value {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3);
		background: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
	}

	:global([data-theme='dark']) .detail-value {
		background: hsla(0, 0%, 0%, 0.2);
	}

	/* Wallet Info */
	.wallet-info {
		position: relative;
	}

	.wallet-icon {
		width: 32px;
		height: 32px;
		border-radius: var(--radius-sm);
		flex-shrink: 0;
		object-fit: contain;
	}

	.wallet-icon-placeholder {
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-muted);
		border-radius: var(--radius-sm);
		color: var(--gray-600);
		flex-shrink: 0;
	}

	.wallet-address {
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		color: var(--gray-900);
		font-family: var(--font-mono, monospace);
	}

	:global([data-theme='dark']) .wallet-address {
		color: var(--gray-100);
	}

	/* Network Info */
	.network-info {
		gap: var(--space-3);
	}

	.network-details {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		flex: 1;
		min-width: 0;
	}

	.network-name {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .network-name {
		color: var(--gray-100);
	}

	.network-chain-id {
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		color: var(--gray-500);
		font-family: var(--font-mono, monospace);
	}

	/* Action Buttons */
	.action-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		width: 100%;
		padding: var(--space-3) var(--space-4);
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.change-button {
		background: transparent;
		border: 1px solid var(--color-border);
		color: var(--gray-700);
	}

	.change-button:hover {
		background: var(--color-panel-1);
		border-color: var(--color-primary);
		color: var(--color-primary);
		transform: translateY(-1px);
	}

	:global([data-theme='dark']) .change-button {
		color: var(--gray-300);
	}

	.reconnect-button {
		background: hsl(0, 80%, 50%);
		color: white;
	}

	.reconnect-button:hover {
		background: hsl(0, 80%, 45%);
		transform: translateY(-1px);
		box-shadow: 0 4px 12px hsla(0, 80%, 50%, 0.3);
	}

	:global([data-theme='dark']) .reconnect-button {
		background: hsl(0, 80%, 60%);
	}

	:global([data-theme='dark']) .reconnect-button:hover {
		background: hsl(0, 80%, 55%);
	}

	/* Disconnected State */
	.disconnect-header {
		display: flex;
		gap: var(--space-3);
		margin-bottom: var(--space-4);
	}

	.disconnect-icon {
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: hsla(0, 80%, 50%, 0.15);
		border-radius: var(--radius-md);
		color: hsl(0, 80%, 50%);
		flex-shrink: 0;
	}

	:global([data-theme='dark']) .disconnect-icon {
		background: hsla(0, 80%, 60%, 0.2);
		color: hsl(0, 80%, 65%);
	}

	.disconnect-info {
		flex: 1;
	}

	.disconnect-info h4 {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: hsl(0, 80%, 45%);
		margin: 0 0 var(--space-1) 0;
	}

	:global([data-theme='dark']) .disconnect-info h4 {
		color: hsl(0, 80%, 65%);
	}

	.disconnect-info p {
		font-size: var(--text-sm);
		color: var(--gray-700);
		margin: 0;
		line-height: 1.5;
	}

	:global([data-theme='dark']) .disconnect-info p {
		color: var(--gray-300);
	}

	/* Responsive */
	@media (max-width: 640px) {
		.wallet-address {
			font-size: var(--text-sm);
		}

		.network-name {
			font-size: var(--text-sm);
		}
	}
</style>
