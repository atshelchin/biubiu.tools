import {
	watchEIP6963Wallets,
	EIP6963Connector,
	type ConnectionState,
	type Connector,
	type EIP6963ProviderDetail
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
	let isInitialized = $state(false);
	let connectionError = $state<{
		message: string;
		details?: string;
		solutions?: string[];
	} | null>(null);
	let unsubscribe: (() => void) | undefined;
	let unwatchEIP6963: (() => void) | undefined;

	// 从状态派生的响应式变量
	const isConnected = $derived(connectionState.isConnected);
	const isConnecting = $derived(connectionState.isConnecting);
	const address = $derived(connectionState.address);
	const connectorIcon = $derived(connectionState.connector?.icon);
	const availableConnectors = $derived(walletManager.getConnectors());
	const currentChainId = $derived(connectionState.chainId);
	let networks = $state(networkManager.getAllNetworks());

	// Get enabled networks as viem chains
	function getEnabledChains() {
		const namespace = config.storageKey || 'default';
		return networks
			.filter((network) => networkManager.isNetworkEnabled(namespace, network.chainId))
			.map((network) => ({
				id: network.chainId,
				name: network.name,
				nativeCurrency: {
					name: network.symbol,
					symbol: network.symbol,
					decimals: 18
				},
				rpcUrls: {
					default: {
						http: network.rpcEndpoints
							.filter((rpc) => rpc.isPrimary)
							.map((rpc) => rpc.url)
							.concat(network.rpcEndpoints.filter((rpc) => !rpc.isPrimary).map((rpc) => rpc.url))
					}
				},
				blockExplorers: network.blockExplorer
					? {
							default: {
								name: 'Explorer',
								url: network.blockExplorer
							}
						}
					: undefined
			}));
	}

	// Store detected wallets for re-registration when networks change
	let detectedWallets: EIP6963ProviderDetail[] = [];

	// Register EIP6963 connectors with enabled networks
	function registerEIP6963Connectors() {
		if (detectedWallets.length === 0) return;

		const enabledChains = getEnabledChains();

		// Only register if there are enabled networks
		if (enabledChains.length === 0) return;

		const newConnectors = detectedWallets.map(
			(wallet) =>
				new EIP6963Connector({
					chains: enabledChains as unknown as ConstructorParameters<
						typeof EIP6963Connector
					>[0]['chains'],
					shimDisconnect: true,
					providerDetail: wallet
				})
		);

		// Clear existing connectors and register new ones
		newConnectors.forEach((connector) => walletManager.registerConnector(connector));
	}

	// 初始化
	async function initialize() {
		// 订阅钱包状态变化
		unsubscribe = walletManager.subscribe((state) => {
			connectionState = state;
		});

		// 监听网络变化事件 - 当网络启用状态改变时，重新注册连接器
		networkManager.on('networkAdded', () => {
			networks = networkManager.getAllNetworks();
			registerEIP6963Connectors();
		});
		networkManager.on('networkUpdated', () => {
			networks = networkManager.getAllNetworks();
			registerEIP6963Connectors();
		});
		networkManager.on('networkRemoved', () => {
			networks = networkManager.getAllNetworks();
			registerEIP6963Connectors();
		});

		// 监听 EIP6963 钱包
		unwatchEIP6963 = watchEIP6963Wallets((wallets) => {
			detectedWallets = wallets;
			registerEIP6963Connectors();
		});

		// 自动连接
		await walletManager.autoConnect();

		// Mark as initialized after loading network preferences
		isInitialized = true;
	}

	// 清理
	function cleanup() {
		unsubscribe?.();
		unwatchEIP6963?.();
	}

	// Parse connection error and create friendly message
	function parseConnectionError(error: unknown, connector: Connector, chainId: number) {
		console.error('Failed to connect wallet:', error);

		if (error instanceof Error) {
			const errorMessage = error.message;

			// Chain not supported by connector
			if (errorMessage.includes('is not supported by this connector')) {
				const chainIdMatch = errorMessage.match(/Chain \[(\d+)\]/);
				const connectorMatch = errorMessage.match(/connector \[(.*?)\]/);

				const unsupportedChainId = chainIdMatch ? chainIdMatch[1] : chainId.toString();
				const connectorName = connectorMatch ? connectorMatch[1] : connector.name;
				const network = networks.find((n) => n.chainId === chainId);

				connectionError = {
					message: `${connectorName} doesn't support ${network?.name || `Chain ${unsupportedChainId}`}`,
					details: `The wallet you selected cannot connect to ${network?.name || 'this network'}. Different wallets support different blockchain networks.`,
					solutions: [
						`Select a different network that ${connectorName} supports`,
						'Try connecting with a different wallet that supports this network',
						'Check the wallet documentation for supported networks'
					]
				};
			}
			// User rejected request
			else if (errorMessage.includes('User rejected') || errorMessage.includes('rejected')) {
				connectionError = {
					message: 'Connection request was rejected',
					details: 'You declined the wallet connection request.',
					solutions: ['Click "Connect Wallet" again when you are ready to connect']
				};
			}
			// Generic error
			else {
				connectionError = {
					message: 'Failed to connect wallet',
					details: errorMessage,
					solutions: [
						'Make sure your wallet extension is installed and unlocked',
						'Try refreshing the page',
						'Try a different wallet'
					]
				};
			}
		} else {
			connectionError = {
				message: 'An unexpected error occurred',
				solutions: ['Please try again', 'Try refreshing the page']
			};
		}
	}

	// 连接钱包
	async function connectWallet(connector: Connector) {
		try {
			// Clear any previous errors
			connectionError = null;
			showConnectorModal = false;

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
		} catch (error) {
			showWalletConnectModal = false;
			walletConnectUri = undefined;

			// Get current chain ID for error message
			const currentChainId =
				networkManager.getCurrentChainId(config.storageKey || 'biubiu-tools') || mainnet.id;

			// Parse error and show friendly message
			parseConnectionError(error, connector, currentChainId);

			// Re-open connector modal so user can try another wallet
			showConnectorModal = true;
		}
	}

	// 取消连接
	async function cancelConnection() {
		if (isConnecting) {
			try {
				await walletManager.cancelConnect();
			} catch (error) {
				console.error('Failed to cancel connection:', error);
			}
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
		connectionError = null; // Clear error when closing modal
	}

	// 清除连接错误
	function clearConnectionError() {
		connectionError = null;
	}

	// 关闭 WalletConnect 模态框
	async function closeWalletConnectModal() {
		showWalletConnectModal = false;
		walletConnectUri = undefined;

		// 如果正在连接中，取消连接
		if (isConnecting) {
			try {
				await walletManager.cancelConnect();
			} catch (error) {
				console.error('Failed to cancel connection:', error);
			}
		}
	}

	// 网络管理方法
	async function switchNetwork(chainId: number) {
		await walletManager.switchChain(chainId);
	}

	function toggleNetwork(chainId: number, enabled: boolean) {
		const namespace = config.storageKey || 'default';
		const result = networkManager.toggleNetwork(namespace, chainId, enabled);
		// Trigger update to refresh networks state
		networks = networkManager.getAllNetworks();
		// Re-register connectors with updated enabled networks
		registerEIP6963Connectors();
		return result;
	}

	function isNetworkEnabled(chainId: number): boolean {
		const namespace = config.storageKey || 'default';
		return networkManager.isNetworkEnabled(namespace, chainId);
	}

	function updateNetworkRpc(
		chainId: number,
		rpcEndpoints: Array<{ url: string; isPrimary: boolean }>,
		blockExplorer?: string
	) {
		networkManager.updateNetworkRpc(chainId, rpcEndpoints, blockExplorer);
	}

	function addOrUpdateNetwork(network: {
		chainId: number;
		name: string;
		symbol: string;
		rpcEndpoints: Array<{ url: string; isPrimary: boolean }>;
		blockExplorer?: string;
	}) {
		networkManager.addOrUpdateCustomNetwork(network);
	}

	function setCurrentNetwork(chainId: number) {
		const namespace = config.storageKey || 'default';
		networkManager.setCurrentNetwork(namespace, chainId);
	}

	// 账户管理方法
	async function getAccounts() {
		try {
			return await walletManager.getState().connector?.getAccounts();
		} catch (error) {
			console.error('Failed to get accounts:', error);
			return [];
		}
	}

	async function switchAccount(address: string) {
		try {
			await walletManager.switchAccount(address as `0x${string}`);
		} catch (error) {
			console.error('Failed to switch account:', error);
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
		get currentChainId() {
			return currentChainId;
		},
		get networks() {
			return networks;
		},
		get isInitialized() {
			return isInitialized;
		},
		get connectionError() {
			return connectionError;
		},
		// Methods
		initialize,
		cleanup,
		connectWallet,
		cancelConnection,
		disconnect,
		openConnectorModal,
		closeModal,
		closeWalletConnectModal,
		clearConnectionError,
		// Network management
		switchNetwork,
		toggleNetwork,
		isNetworkEnabled,
		updateNetworkRpc,
		addOrUpdateNetwork,
		setCurrentNetwork,
		// Account management
		getAccounts,
		switchAccount
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
