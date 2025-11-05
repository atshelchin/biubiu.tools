<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { LogOut } from '@lucide/svelte';
	import CopyButton from './copy-button.svelte';
	import CopyButtonWithText from './copy-button-with-text.svelte';
	import WalletInfo from './wallet-info.svelte';
	import Modal from './modal.svelte';
	import QRCode from './qr-code.svelte';
	import InstructionList from './instruction-list.svelte';
	import GradientButton from './gradient-button.svelte';
	import { useI18n } from '@shelchin/i18n/svelte';
	import { useConnectStore } from '$lib/stores/connect.svelte';

	const i18n = useI18n();
	const t = i18n.t;

	// 从 context 获取 connect store
	const connectStore = useConnectStore();

	// WalletConnect 说明步骤
	const walletConnectSteps = $derived([
		t('wallet.walletconnect.step_1'),
		t('wallet.walletconnect.step_2'),
		t('wallet.walletconnect.step_3')
	]);

	// 格式化地址显示
	function formatAddress(addr: string): string {
		return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
	}

	onMount(async () => {
		await connectStore.initialize();
	});

	onDestroy(() => {
		connectStore.cleanup();
	});
</script>

{#if connectStore.isConnected && connectStore.address}
	<div class="wallet-connected-group">
		<WalletInfo
			address={connectStore.address}
			{formatAddress}
			connectorIcon={connectStore.connectorIcon}
		/>
		<CopyButton value={connectStore.address} />
		<button
			class="icon-button disconnect-button"
			onclick={connectStore.disconnect}
			type="button"
			title={i18n.t('wallet.disconnect')}
		>
			<LogOut size={16} />
		</button>
	</div>
{:else}
	<GradientButton
		onclick={connectStore.isConnecting
			? connectStore.cancelConnection
			: connectStore.openConnectorModal}
	>
		{connectStore.isConnecting ? i18n.t('wallet.connecting') : i18n.t('wallet.connect')}
	</GradientButton>
{/if}

<!-- 连接器选择模态框 -->
<Modal
	open={connectStore.showConnectorModal}
	onClose={connectStore.closeModal}
	title={i18n.t('wallet.select_wallet')}
>
	<div class="connector-list">
		{#each connectStore.availableConnectors as connector (connector.id)}
			<button class="connector-item" onclick={() => connectStore.connectWallet(connector)}>
				{#if connector.icon}
					<img src={connector.icon} alt={connector.name} class="connector-icon" />
				{/if}
				<span class="connector-name">{connector.name}</span>
				{#if !connector.ready}
					<span class="not-ready">{i18n.t('wallet.not_installed')}</span>
				{/if}
			</button>
		{/each}
	</div>
</Modal>

<!-- WalletConnect QR 码模态框 -->
<Modal
	open={connectStore.showWalletConnectModal}
	onClose={connectStore.closeWalletConnectModal}
	title={i18n.t('wallet.scan_qr')}
	maxWidth="420px"
>
	<div class="walletconnect-content">
		{#if connectStore.walletConnectUri}
			<div class="qr-code-container">
				<QRCode data={connectStore.walletConnectUri} />
			</div>

			<InstructionList title={i18n.t('wallet.walletconnect.title')} items={walletConnectSteps} />

			<CopyButtonWithText
				value={connectStore.walletConnectUri}
				text={i18n.t('wallet.walletconnect.copy_link')}
				copiedText={i18n.t('wallet.walletconnect.link_copied')}
			/>
		{:else}
			<div class="loading-container">
				<div class="loading-spinner"></div>
				<p>{t('wallet.walletconnect.generating')}</p>
			</div>
		{/if}
	</div>
</Modal>

<style>
	/* Connected Wallet Group */
	.wallet-connected-group {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		flex-wrap: wrap;
	}

	/* Icon Buttons */
	.icon-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--space-8);
		height: var(--space-8);
		padding: 0;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-secondary);
		color: var(--color-foreground);
		cursor: pointer;
		transition: all 0.2s;
	}

	.icon-button:hover {
		background: var(--color-muted);
		transform: translateY(-1px);
		box-shadow: var(--shadow-sm);
	}

	.icon-button:active {
		transform: translateY(0);
	}

	.disconnect-button:hover {
		color: var(--color-danger);
		border-color: var(--color-danger);
	}

	.connector-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.connector-item {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		background: var(--color-secondary);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all 0.2s;
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		color: var(--color-foreground);
	}

	.connector-item:hover {
		background: var(--color-muted);
		transform: translateY(-1px);
		box-shadow: var(--shadow-sm);
	}

	.connector-icon {
		width: var(--space-8);
		height: var(--space-8);
		border-radius: var(--radius-md);
	}

	.connector-name {
		flex: 1;
	}

	.not-ready {
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		padding: var(--space-1) var(--space-2);
		background: var(--color-muted);
		border-radius: var(--radius);
	}

	/* WalletConnect Modal Styles */
	.walletconnect-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-6);
	}

	.qr-code-container {
		width: 100%;
		display: flex;
		justify-content: center;
		padding: var(--space-4);
		background: var(--color-background);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
	}

	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-8);
	}

	.loading-spinner {
		width: var(--space-12);
		height: var(--space-12);
		border: 3px solid var(--color-border);
		border-top-color: var(--brand-600);
		border-radius: var(--radius-full);
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.loading-container p {
		margin: 0;
		color: var(--color-muted-foreground);
		font-size: var(--text-sm);
	}

	@media (max-width: 768px) {
		.wallet-connected-group {
			width: 100%;
			justify-content: center;
			gap: var(--space-3);
		}

		.icon-button {
			min-width: var(--space-12);
			min-height: var(--space-10);
		}

		.qr-code-container {
			padding: var(--space-2);
		}
	}
</style>
