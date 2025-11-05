import {
	watchEIP6963Wallets,
	EIP6963Connector,
	type ConnectionState,
	type Connector
} from '@shelchin/ethereum-connectors';
import { mainnet } from 'viem/chains';
import type { Chain } from 'viem';
import { createWalletManager } from '$lib/utils/wallet-manager';
import { getContext, setContext } from 'svelte';

const CONNECT_STORE_KEY = Symbol('connect-store');

interface ConnectStoreConfig {
	projectId: string;
	appName: string;
	appUrl: string;
	appLogoUrl: string;
	chains: Chain[];
	storageKey?: string;
}

export function createConnectStore(config: ConnectStoreConfig) {
	// 创建 wallet manager
	const manager = createWalletManager({
		projectId: config.projectId,
		appName: config.appName,
		appUrl: config.appUrl,
		appLogoUrl: config.appLogoUrl,
		chains: config.chains,
		storageKey: config.storageKey
	});

	const walletManager = manager.getWalletManager();
	const networkManager = manager.getNetworkManager();

	// 钱包连接状态
	let connectionState = $state<ConnectionState>(walletManager.getState());
	let showConnectorModal = $state(false);
	let walletConnectUri = $state<string | undefined>();
	let showWalletConnectModal = $state(false);
	let currentConnector: Connector | undefined;
	let unsubscribe: (() => void) | undefined;
	let unwatchEIP6963: (() => void) | undefined;

	// 从状态派生的响应式变量
	const isConnected = $derived(connectionState.isConnected);
	const isConnecting = $derived(connectionState.isConnecting);
	const address = $derived(connectionState.address);
	const connectorIcon = $derived(connectionState.connector?.icon);
	const availableConnectors = $derived(walletManager.getConnectors());

	// 初始化
	async function initialize() {
		// 订阅钱包状态变化
		unsubscribe = walletManager.subscribe((state) => {
			connectionState = state;
		});

		// 监听 EIP6963 钱包
		// Note: Using unknown as intermediate type to handle viem version mismatch
		unwatchEIP6963 = watchEIP6963Wallets((wallets) => {
			const newConnectors = wallets.map(
				(wallet) =>
					new EIP6963Connector({
						chains: config.chains as unknown as ConstructorParameters<
							typeof EIP6963Connector
						>[0]['chains'],
						shimDisconnect: true,
						providerDetail: wallet
					})
			);
			newConnectors.forEach((connector) => walletManager.registerConnector(connector));
		});

		// 自动连接
		await walletManager.autoConnect();
	}

	// 清理
	function cleanup() {
		unsubscribe?.();
		unwatchEIP6963?.();
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

			const currentChainId =
				networkManager.getCurrentChainId(config.storageKey || 'biubiu-tools') || mainnet.id;
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

	// 取消连接
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

	const store = {
		// Reactive state
		get isConnected() {
			return isConnected;
		},
		get isConnecting() {
			return isConnecting;
		},
		get address() {
			return address;
		},
		get connectorIcon() {
			return connectorIcon;
		},
		get availableConnectors() {
			return availableConnectors;
		},
		get showConnectorModal() {
			return showConnectorModal;
		},
		get walletConnectUri() {
			return walletConnectUri;
		},
		get showWalletConnectModal() {
			return showWalletConnectModal;
		},
		// Methods
		initialize,
		cleanup,
		connectWallet,
		cancelConnection,
		disconnect,
		openConnectorModal,
		closeModal,
		closeWalletConnectModal
	};

	setContext(CONNECT_STORE_KEY, store);

	return store;
}

export function useConnectStore() {
	const store = getContext<ReturnType<typeof createConnectStore>>(CONNECT_STORE_KEY);
	if (!store) {
		throw new Error(
			'Connect store not found. Make sure to call createConnectStore() in a parent component.'
		);
	}
	return store;
}
