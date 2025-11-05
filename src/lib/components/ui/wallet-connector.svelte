<script lang="ts">
	import {
		IntegratedManager,
		WalletConnectConnector,
		EIP6963Connector,
		CoinbaseSmartWalletConnector,
		InjectedConnector,
		watchEIP6963Wallets,
		type Connector,
		type ConnectionState,
		type NetworkConfig
	} from '@shelchin/ethereum-connectors';
	import { mainnet, polygon, arbitrum, optimism, base } from 'viem/chains';
	import type { Chain } from 'viem';
	import { onMount, onDestroy } from 'svelte';
	import QRCodeStyling from 'qr-code-styling';

	// 内置网络配置
	const builtInNetworks: NetworkConfig[] = [
		{
			chainId: mainnet.id,
			name: mainnet.name,
			symbol: mainnet.nativeCurrency.symbol,
			rpcEndpoints: [{ url: mainnet.rpcUrls.default.http[0], isPrimary: true }],
			blockExplorer: mainnet.blockExplorers?.default.url,
			isCustom: false,
			isBuiltIn: true
		},
		{
			chainId: polygon.id,
			name: polygon.name,
			symbol: polygon.nativeCurrency.symbol,
			rpcEndpoints: [{ url: polygon.rpcUrls.default.http[0], isPrimary: true }],
			blockExplorer: polygon.blockExplorers?.default.url,
			isCustom: false,
			isBuiltIn: true
		},
		{
			chainId: arbitrum.id,
			name: arbitrum.name,
			symbol: arbitrum.nativeCurrency.symbol,
			rpcEndpoints: [{ url: arbitrum.rpcUrls.default.http[0], isPrimary: true }],
			blockExplorer: arbitrum.blockExplorers?.default.url,
			isCustom: false,
			isBuiltIn: true
		},
		{
			chainId: optimism.id,
			name: optimism.name,
			symbol: optimism.nativeCurrency.symbol,
			rpcEndpoints: [{ url: optimism.rpcUrls.default.http[0], isPrimary: true }],
			blockExplorer: optimism.blockExplorers?.default.url,
			isCustom: false,
			isBuiltIn: true
		},
		{
			chainId: base.id,
			name: base.name,
			symbol: base.nativeCurrency.symbol,
			rpcEndpoints: [{ url: base.rpcUrls.default.http[0], isPrimary: true }],
			blockExplorer: base.blockExplorers?.default.url,
			isCustom: false,
			isBuiltIn: true
		}
	];

	// 初始化连接器列表
	const chains = [mainnet, polygon, arbitrum, optimism, base] as Chain[];

	const walletConnectConnector = new WalletConnectConnector({
		chains,
		shimDisconnect: true,
		projectId: 'e68249e217c8793807b7bb961a2f4297',
		showQrModal: false, // 使用自定义 UI
		metadata: {
			name: 'BiuBiu Tools',
			description: 'Blockchain utilities and tools',
			url: 'https://biubiu.tools',
			icons: ['https://biubiu.tools/logo.svg']
		}
	});

	const coinbaseConnector = new CoinbaseSmartWalletConnector({
		chains,
		shimDisconnect: true,
		appName: 'BiuBiu Tools',
		appLogoUrl: 'https://biubiu.tools/logo.svg',
		preference: 'all'
	});

	const injectedConnector = new InjectedConnector({
		chains,
		shimDisconnect: true,
		id: 'injected',
		name: 'Browser Wallet',
		target: 'ethereum'
	});

	// 初始化 IntegratedManager
	const manager = new IntegratedManager(
		[walletConnectConnector, coinbaseConnector, injectedConnector],
		builtInNetworks,
		'biubiu-tools'
	);

	const walletManager = manager.getWalletManager();

	// 钱包连接状态
	let connectionState = $state<ConnectionState>(walletManager.getState());
	let showConnectorModal = $state(false);
	let walletConnectUri = $state<string | undefined>();
	let showWalletConnectModal = $state(false);
	let qrCodeElement: HTMLDivElement | undefined;

	// 从状态派生的响应式变量
	const isConnected = $derived(connectionState.isConnected);
	const isConnecting = $derived(connectionState.isConnecting);
	const address = $derived(connectionState.address);

	// 格式化地址显示
	function formatAddress(addr: string): string {
		return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
	}

	// 连接钱包
	async function connectWallet(connector: Connector) {
		try {
			showConnectorModal = false;

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
		} catch (error) {
			console.error('Failed to connect wallet:', error);
			showWalletConnectModal = false;
			walletConnectUri = undefined;
		}
	}

	// 断开连接
	async function disconnect() {
		try {
			await walletManager.disconnect();
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
	function closeWalletConnectModal() {
		showWalletConnectModal = false;
		walletConnectUri = undefined;
	}

	// 复制 URI 到剪贴板
	async function copyUri() {
		if (walletConnectUri) {
			try {
				await navigator.clipboard.writeText(walletConnectUri);
				alert('已复制到剪贴板');
			} catch (error) {
				console.error('Failed to copy URI:', error);
			}
		}
	}

	// 渲染 QR 码
	$effect(() => {
		if (walletConnectUri && qrCodeElement) {
			const qrCode = new QRCodeStyling({
				width: 280,
				height: 280,
				data: walletConnectUri,
				image: '/logo.svg',
				dotsOptions: {
					color: '#1a1a1a',
					type: 'rounded'
				},
				backgroundOptions: {
					color: '#ffffff'
				},
				imageOptions: {
					crossOrigin: 'anonymous',
					margin: 8,
					imageSize: 0.4
				},
				cornersSquareOptions: {
					color: '#2563eb',
					type: 'extra-rounded'
				},
				cornersDotOptions: {
					color: '#3b82f6',
					type: 'dot'
				}
			});

			qrCode.append(qrCodeElement);
		}
	});

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
	<button class="wallet-button connected" onclick={disconnect} type="button">
		<span class="wallet-indicator"></span>
		<span class="wallet-address">{formatAddress(address)}</span>
	</button>
{:else}
	<button
		class="wallet-button connect"
		onclick={openConnectorModal}
		disabled={isConnecting}
		type="button"
	>
		{isConnecting ? '连接中...' : '连接钱包'}
	</button>
{/if}

<!-- 连接器选择模态框 -->
{#if showConnectorModal}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="modal-overlay" onclick={closeModal}>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="modal-content" onclick={(e) => e.stopPropagation()}>
			<div class="modal-header">
				<h3>选择钱包</h3>
				<button class="close-button" onclick={closeModal}>✕</button>
			</div>
			<div class="connector-list">
				{#each availableConnectors as connector (connector.id)}
					<button class="connector-item" onclick={() => connectWallet(connector)}>
						{#if connector.icon}
							<img src={connector.icon} alt={connector.name} class="connector-icon" />
						{/if}
						<span class="connector-name">{connector.name}</span>
						{#if !connector.ready}
							<span class="not-ready">未安装</span>
						{/if}
					</button>
				{/each}
			</div>
		</div>
	</div>
{/if}

<!-- WalletConnect QR 码模态框 -->
{#if showWalletConnectModal}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="modal-overlay" onclick={closeWalletConnectModal}>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="modal-content walletconnect-modal" onclick={(e) => e.stopPropagation()}>
			<div class="modal-header">
				<h3>扫描二维码</h3>
				<button class="close-button" onclick={closeWalletConnectModal}>✕</button>
			</div>

			<div class="walletconnect-content">
				{#if walletConnectUri}
					<div class="qr-code-container">
						<div bind:this={qrCodeElement} class="qr-code"></div>
					</div>

					<div class="walletconnect-instructions">
						<p class="instruction-title">使用 WalletConnect 连接钱包</p>
						<ol class="instruction-list">
							<li>打开支持 WalletConnect 的钱包应用</li>
							<li>扫描上方二维码</li>
							<li>在钱包中确认连接</li>
						</ol>
					</div>

					<button class="copy-uri-button" onclick={copyUri}>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
							<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
						</svg>
						复制连接链接
					</button>
				{:else}
					<div class="loading-container">
						<div class="loading-spinner"></div>
						<p>生成二维码中...</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.wallet-button {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-5);
		border: none;
		border-radius: var(--radius-full);
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.2s;
	}

	.wallet-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.wallet-button.connect {
		background: linear-gradient(135deg, var(--brand-500) 0%, var(--brand-600) 100%);
		color: var(--color-primary-foreground);
	}

	.wallet-button.connect:hover:not(:disabled) {
		background: linear-gradient(135deg, var(--brand-600) 0%, var(--brand-700) 100%);
		transform: translateY(-1px);
		box-shadow: var(--shadow-md);
	}

	.wallet-button.connect:active:not(:disabled) {
		transform: translateY(0);
	}

	.wallet-button.connected {
		background: var(--color-secondary);
		color: var(--color-secondary-foreground);
		border: 1px solid var(--color-border);
	}

	.wallet-button.connected:hover {
		background: var(--color-muted);
		transform: translateY(-1px);
		box-shadow: var(--shadow-sm);
	}

	.wallet-indicator {
		width: var(--space-2);
		height: var(--space-2);
		border-radius: var(--radius-full);
		background: var(--color-success);
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	.wallet-address {
		font-family: var(--font-family-mono);
		font-size: var(--text-sm);
	}

	/* Modal styles */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		backdrop-filter: blur(4px);
	}

	.modal-content {
		background: var(--color-card);
		border-radius: var(--radius-xl);
		padding: var(--space-6);
		max-width: 400px;
		width: 90%;
		box-shadow: var(--shadow-2xl);
		border: 1px solid var(--color-border);
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-4);
	}

	.modal-header h3 {
		margin: 0;
		font-size: var(--text-xl);
		font-weight: var(--font-bold);
		color: var(--color-foreground);
	}

	.close-button {
		background: none;
		border: none;
		font-size: var(--text-2xl);
		cursor: pointer;
		color: var(--color-muted-foreground);
		padding: 0;
		width: var(--space-8);
		height: var(--space-8);
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-md);
		transition: all 0.2s;
	}

	.close-button:hover {
		background: var(--color-muted);
		color: var(--color-foreground);
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
	.walletconnect-modal {
		max-width: 420px;
	}

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

	.qr-code {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.walletconnect-instructions {
		width: 100%;
		text-align: left;
	}

	.instruction-title {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--color-foreground);
		margin: 0 0 var(--space-3) 0;
	}

	.instruction-list {
		margin: 0;
		padding-left: var(--space-5);
		color: var(--color-muted-foreground);
		font-size: var(--text-sm);
		line-height: 1.6;
	}

	.instruction-list li {
		margin-bottom: var(--space-2);
	}

	.copy-uri-button {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-4);
		background: var(--color-secondary);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all 0.2s;
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-foreground);
	}

	.copy-uri-button:hover {
		background: var(--color-muted);
		transform: translateY(-1px);
		box-shadow: var(--shadow-sm);
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
		.wallet-button {
			width: 100%;
			justify-content: center;
		}

		.modal-content {
			width: 95%;
			padding: var(--space-4);
		}

		.walletconnect-modal {
			max-width: 95%;
		}

		.qr-code-container {
			padding: var(--space-2);
		}
	}
</style>
