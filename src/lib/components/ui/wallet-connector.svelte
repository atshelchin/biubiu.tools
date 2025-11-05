<script lang="ts">
	import {
		IntegratedManager,
		WalletConnectConnector,
		EIP6963Connector,
		watchEIP6963Wallets,
		type Connector,
		type ConnectionState,
		type NetworkConfig
	} from '@shelchin/ethereum-connectors';
	import { mainnet, polygon, arbitrum, optimism, base } from 'viem/chains';
	import type { Chain } from 'viem';
	import { onMount, onDestroy } from 'svelte';

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

	// 初始化连接器
	const walletConnectConnector = new WalletConnectConnector({
		chains: [mainnet, polygon, arbitrum, optimism, base] as Chain[],
		shimDisconnect: true,
		projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo-project-id',
		showQrModal: true,
		metadata: {
			name: 'BiuBiu Tools',
			description: 'Blockchain utilities and tools',
			url: 'https://biubiu.tools',
			icons: ['https://biubiu.tools/logo.svg']
		}
	});

	// 初始化 IntegratedManager
	const manager = new IntegratedManager([walletConnectConnector], builtInNetworks, 'biubiu-tools');

	const walletManager = manager.getWalletManager();

	// 钱包连接状态
	let connectionState = $state<ConnectionState>(walletManager.getState());
	let eip6963Connectors = $state<Connector[]>([]);
	let showConnectorModal = $state(false);

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
			const networkManager = manager.getNetworkManager();
			const currentChainId = networkManager.getCurrentChainId('biubiu-tools') || mainnet.id;
			await walletManager.connect(connector, currentChainId);
		} catch (error) {
			console.error('Failed to connect wallet:', error);
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
						chains: [mainnet, polygon, arbitrum, optimism, base] as Chain[],
						shimDisconnect: true,
						providerDetail: wallet
					})
			);
			eip6963Connectors = newConnectors;
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

	@media (max-width: 768px) {
		.wallet-button {
			width: 100%;
			justify-content: center;
		}

		.modal-content {
			width: 95%;
			padding: var(--space-4);
		}
	}
</style>
