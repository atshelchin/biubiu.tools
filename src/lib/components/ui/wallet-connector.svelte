<script lang="ts">
	import {
		EIP6963Connector,
		watchEIP6963Wallets,
		type Connector,
		type ConnectionState
	} from '@shelchin/ethereum-connectors';
	import { mainnet } from 'viem/chains';
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
	import { createWalletManager } from '$lib/utils/wallet-manager';

	const i18n = useI18n();
	const t = i18n.t;

	// WalletConnect 说明步骤
	const walletConnectSteps = $derived([
		t('wallet.walletconnect.step_1'),
		t('wallet.walletconnect.step_2'),
		t('wallet.walletconnect.step_3')
	]);

	// 初始化 IntegratedManager
	const manager = createWalletManager({
		projectId: 'e68249e217c8793807b7bb961a2f4297',
		appName: 'BiuBiu Tools',
		appUrl: 'https://biubiu.tools',
		appLogoUrl: 'https://biubiu.tools/logo.svg'
	});

	const walletManager = manager.getWalletManager();

	// 钱包连接状态
	let connectionState = $state<ConnectionState>(walletManager.getState());
	let showConnectorModal = $state(false);
	let walletConnectUri = $state<string | undefined>();
	let showWalletConnectModal = $state(false);
	let currentConnector: Connector | undefined;

	// 从状态派生的响应式变量
	const isConnected = $derived(connectionState.isConnected);
	const isConnecting = $derived(connectionState.isConnecting);
	const address = $derived(connectionState.address);
	const connectorIcon = $derived(connectionState.connector?.icon);

	// 格式化地址显示
	function formatAddress(addr: string): string {
		return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
	}

	// 连接钱包
	async function connectWallet(connector: Connector) {
		try {
			showConnectorModal = false;
			currentConnector = connector;

			// 如果是 WalletConnect，显示自定义 QR 码模态框
			if (connector.id === 'walletconnect') {
				showWalletConnectModal = true;

				// 监听 display_uri 事件获取 URI
				connector.on('display_uri', (uri: string) => {
					walletConnectUri = uri;
				});
			}

			const networkManager = manager.getNetworkManager();
			const currentChainId = networkManager.getCurrentChainId('biubiu-tools') || mainnet.id;
			await walletManager.connect(connector, currentChainId);

			// 连接成功后关闭模态框
			showWalletConnectModal = false;
			walletConnectUri = undefined;
			currentConnector = undefined;
		} catch (error) {
			console.error('Failed to connect wallet:', error);
			showWalletConnectModal = false;
			walletConnectUri = undefined;
			currentConnector = undefined;
		}
	}

	// 取消连接 - 用于重置连接状态
	async function cancelConnection() {
		if (currentConnector && isConnecting) {
			try {
				await currentConnector.disconnect();
			} catch (error) {
				console.error('Failed to cancel connection:', error);
			}
			currentConnector = undefined;
		}
	}

	// 断开连接
	async function disconnect() {
		try {
			await walletManager.disconnect();
			currentConnector = undefined;
		} catch (error) {
			console.error('Failed to disconnect wallet:', error);
		}
	}

	// 打开连接器选择模态框
	function openConnectorModal() {
		showConnectorModal = true;
	}

	// 关闭模态框
	function closeModal() {
		showConnectorModal = false;
	}

	// 关闭 WalletConnect 模态框
	async function closeWalletConnectModal() {
		showWalletConnectModal = false;
		walletConnectUri = undefined;

		// 如果正在连接中，取消连接
		if (currentConnector && !isConnected) {
			try {
				await currentConnector.disconnect();
			} catch (error) {
				console.error('Failed to cancel connection:', error);
			}
			currentConnector = undefined;
		}
	}

	// 获取所有可用连接器
	const availableConnectors = $derived(walletManager.getConnectors());

	let unsubscribe: (() => void) | undefined;
	let unwatchEIP6963: (() => void) | undefined;

	onMount(async () => {
		// 订阅钱包状态变化
		unsubscribe = walletManager.subscribe((state) => {
			connectionState = state;
		});

		// 监听 EIP6963 钱包
		unwatchEIP6963 = watchEIP6963Wallets((wallets) => {
			const newConnectors = wallets.map(
				(wallet) =>
					new EIP6963Connector({
						chains,
						shimDisconnect: true,
						providerDetail: wallet
					})
			);
			newConnectors.forEach((connector) => walletManager.registerConnector(connector));
		});

		// 自动连接
		await walletManager.autoConnect();
	});

	onDestroy(() => {
		unsubscribe?.();
		unwatchEIP6963?.();
	});
</script>

{#if isConnected && address}
	<div class="wallet-connected-group">
		<WalletInfo {address} {formatAddress} {connectorIcon} />
		<CopyButton value={address} />
		<button
			class="icon-button disconnect-button"
			onclick={disconnect}
			type="button"
			title={i18n.t('wallet.disconnect')}
		>
			<LogOut size={16} />
		</button>
	</div>
{:else}
	<GradientButton onclick={isConnecting ? cancelConnection : openConnectorModal}>
		{isConnecting ? i18n.t('wallet.connecting') : i18n.t('wallet.connect')}
	</GradientButton>
{/if}

<!-- 连接器选择模态框 -->
<Modal open={showConnectorModal} onClose={closeModal} title={i18n.t('wallet.select_wallet')}>
	<div class="connector-list">
		{#each availableConnectors as connector (connector.id)}
			<button class="connector-item" onclick={() => connectWallet(connector)}>
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
	open={showWalletConnectModal}
	onClose={closeWalletConnectModal}
	title={i18n.t('wallet.scan_qr')}
	maxWidth="420px"
>
	<div class="walletconnect-content">
		{#if walletConnectUri}
			<div class="qr-code-container">
				<QRCode data={walletConnectUri} />
			</div>

			<InstructionList title={i18n.t('wallet.walletconnect.title')} items={walletConnectSteps} />

			<CopyButtonWithText
				value={walletConnectUri}
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
