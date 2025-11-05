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
	import { LogOut, X } from '@lucide/svelte';
	import CopyButton from './copy-button.svelte';
	import CopyButtonWithText from './copy-button-with-text.svelte';
	import { useI18n } from '@shelchin/i18n/svelte';

	const i18n = useI18n();
	const t = i18n.t;

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
		icon: 'data:image/svg+xml,%3Csvg%20width%3D%2228%22%20height%3D%2228%22%20viewBox%3D%220%200%2028%2028%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Crect%20width%3D%2228%22%20height%3D%2228%22%20fill%3D%22white%22%2F%3E%0A%3Cpath%20d%3D%22M24.0891%203.1199L15.3446%209.61456L16.9617%205.7828L24.0891%203.1199Z%22%20fill%3D%22%23E2761B%22%20stroke%3D%22%23E2761B%22%20stroke-width%3D%220.0878845%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3Cpath%20d%3D%22M3.90207%203.1199L12.5763%209.67608L11.0383%205.7828L3.90207%203.1199Z%22%20fill%3D%22%23E4761B%22%20stroke%3D%22%23E4761B%22%20stroke-width%3D%220.0878845%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3Cpath%20d%3D%22M20.9429%2018.1745L18.6139%2021.7426L23.597%2023.1136L25.0295%2018.2536L20.9429%2018.1745Z%22%20fill%3D%22%23E4761B%22%20stroke%3D%22%23E4761B%22%20stroke-width%3D%220.0878845%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3Cpath%20d%3D%22M2.97929%2018.2536L4.40301%2023.1136L9.38607%2021.7426L7.05713%2018.1745L2.97929%2018.2536Z%22%20fill%3D%22%23E4761B%22%20stroke%3D%22%23E4761B%22%20stroke-width%3D%220.0878845%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3Cpath%20d%3D%22M9.10483%2012.1456L7.71626%2014.2461L12.6642%2014.4658L12.4884%209.14877L9.10483%2012.1456Z%22%20fill%3D%22%23E4761B%22%20stroke%3D%22%23E4761B%22%20stroke-width%3D%220.0878845%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3Cpath%20d%3D%22M18.8864%2012.1456L15.4589%209.08725L15.3446%2014.4658L20.2837%2014.2461L18.8864%2012.1456Z%22%20fill%3D%22%23E4761B%22%20stroke%3D%22%23E4761B%22%20stroke-width%3D%220.0878845%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3Cpath%20d%3D%22M9.38606%2021.7426L12.3566%2020.2925L9.79033%2018.2888L9.38606%2021.7426Z%22%20fill%3D%22%23E4761B%22%20stroke%3D%22%23E4761B%22%20stroke-width%3D%220.0878845%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3Cpath%20d%3D%22M15.6347%2020.2925L18.6139%2021.7426L18.2009%2018.2888L15.6347%2020.2925Z%22%20fill%3D%22%23E4761B%22%20stroke%3D%22%23E4761B%22%20stroke-width%3D%220.0878845%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3Cpath%20d%3D%22M18.6139%2021.7426L15.6347%2020.2925L15.8719%2022.2348L15.8456%2023.0521L18.6139%2021.7426Z%22%20fill%3D%22%23D7C1B3%22%20stroke%3D%22%23D7C1B3%22%20stroke-width%3D%220.0878845%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3Cpath%20d%3D%22M9.38606%2021.7426L12.1544%2023.0521L12.1368%2022.2348L12.3566%2020.2925L9.38606%2021.7426Z%22%20fill%3D%22%23D7C1B3%22%20stroke%3D%22%23D7C1B3%22%20stroke-width%3D%220.0878845%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3Cpath%20d%3D%22M12.1984%2017.0056L9.72002%2016.2762L11.4689%2015.4765L12.1984%2017.0056Z%22%20fill%3D%22%23233447%22%20stroke%3D%22%23233447%22%20stroke-width%3D%220.0878845%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3Cpath%20d%3D%22M15.7928%2017.0056L16.5223%2015.4765L18.28%2016.2762L15.7928%2017.0056Z%22%20fill%3D%22%23233447%22%20stroke%3D%22%23233447%22%20stroke-width%3D%220.0878845%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3Cpath%20d%3D%22M9.38606%2021.7426L9.80791%2018.1745L7.05712%2018.2536L9.38606%2021.7426Z%22%20fill%3D%22%23CD6116%22%20stroke%3D%22%23CD6116%22%20stroke-width%3D%220.0878845%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3Cpath%20d%3D%22M18.1921%2018.1745L18.6139%2021.7426L20.9429%2018.2536L18.1921%2018.1745Z%22%20fill%3D%22%23CD6116%22%20stroke%3D%22%23CD6116%22%20stroke-width%3D%220.0878845%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3Cpath%20d%3D%22M20.2837%2014.2461L15.3446%2014.4658L15.8016%2017.0057L16.5311%2015.4765L18.2888%2016.2762L20.2837%2014.2461Z%22%20fill%3D%22%23CD6116%22%20stroke%3D%22%23CD6116%22%20stroke-width%3D%220.0878845%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3Cpath%20d%3D%22M9.72002%2016.2762L11.4777%2015.4765L12.1984%2017.0057L12.6642%2014.4658L7.71626%2014.2461L9.72002%2016.2762Z%22%20fill%3D%22%23CD6116%22%20stroke%3D%22%23CD6116%22%20stroke-width%3D%220.0878845%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3Cpath%20d%3D%22M7.71626%2014.2461L9.79033%2018.2888L9.72002%2016.2762L7.71626%2014.2461Z%22%20fill%3D%22%23E4751F%22%20stroke%3D%22%23E4751F%22%20stroke-width%3D%220.0878845%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3Cpath%20d%3D%22M18.2888%2016.2762L18.2009%2018.2888L20.2837%2014.2461L18.2888%2016.2762Z%22%20fill%3D%22%23E4751F%22%20stroke%3D%22%23E4751F%22%20stroke-width%3D%220.0878845%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3Cpath%20d%3D%22M12.6642%2014.4658L12.1984%2017.0057L12.7784%2020.0025L12.9102%2016.0565L12.6642%2014.4658Z%22%20fill%3D%22%23E4751F%22%20stroke%3D%22%23E4751F%22%20stroke-width%3D%220.0878845%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3Cpath%20d%3D%22M15.3446%2014.4658L15.1073%2016.0477L15.2128%2020.0025L15.8016%2017.0057L15.3446%2014.4658Z%22%20fill%3D%22%23E4751F%22%20stroke%3D%22%23E4751F%22%20stroke-width%3D%220.0878845%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3Cpath%20d%3D%22M15.8016%2017.0056L15.2128%2020.0025L15.6347%2020.2925L18.2009%2018.2888L18.2888%2016.2762L15.8016%2017.0056Z%22%20fill%3D%22%23F6851B%22%20stroke%3D%22%23F6851B%22%20stroke-width%3D%220.0878845%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3Cpath%20d%3D%22M9.72002%2016.2762L9.79033%2018.2888L12.3566%2020.2925L12.7784%2020.0025L12.1984%2017.0056L9.72002%2016.2762Z%22%20fill%3D%22%23F6851B%22%20stroke%3D%22%23F6851B%22%20stroke-width%3D%220.0878845%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3Cpath%20d%3D%22M15.8456%2023.0521L15.8719%2022.2348L15.6522%2022.0414H12.339L12.1368%2022.2348L12.1544%2023.0521L9.38606%2021.7426L10.3528%2022.5336L12.3126%2023.8958H15.6786L17.6472%2022.5336L18.6139%2021.7426L15.8456%2023.0521Z%22%20fill%3D%22%23C0AD9E%22%20stroke%3D%22%23C0AD9E%22%20stroke-width%3D%220.0878845%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3Cpath%20d%3D%22M15.6347%2020.2925L15.2128%2020.0025H12.7784L12.3566%2020.2925L12.1368%2022.2348L12.339%2022.0414H15.6522L15.8719%2022.2348L15.6347%2020.2925Z%22%20fill%3D%22%23161616%22%20stroke%3D%22%23161616%22%20stroke-width%3D%220.0878845%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3Cpath%20d%3D%22M24.4583%2010.0364L25.2053%206.45072L24.0891%203.1199L15.6347%209.39485L18.8864%2012.1456L23.4827%2013.4903L24.5022%2012.3038L24.0628%2011.9874L24.7658%2011.3459L24.221%2010.924L24.924%2010.3879L24.4583%2010.0364Z%22%20fill%3D%22%23763D16%22%20stroke%3D%22%23763D16%22%20stroke-width%3D%220.0878845%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3Cpath%20d%3D%22M2.79472%206.45072L3.54174%2010.0364L3.06717%2010.3879L3.77024%2010.924L3.23415%2011.3459L3.93722%2011.9874L3.4978%2012.3038L4.50847%2013.4903L9.10483%2012.1456L12.3566%209.39485L3.90207%203.1199L2.79472%206.45072Z%22%20fill%3D%22%23763D16%22%20stroke%3D%22%23763D16%22%20stroke-width%3D%220.0878845%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3Cpath%20d%3D%22M23.4827%2013.4903L18.8864%2012.1456L20.2837%2014.2461L18.2009%2018.2888L20.9429%2018.2536H25.0295L23.4827%2013.4903Z%22%20fill%3D%22%23F6851B%22%20stroke%3D%22%23F6851B%22%20stroke-width%3D%220.0878845%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3Cpath%20d%3D%22M9.10484%2012.1456L4.50848%2013.4903L2.97929%2018.2536H7.05713L9.79033%2018.2888L7.71626%2014.2461L9.10484%2012.1456Z%22%20fill%3D%22%23F6851B%22%20stroke%3D%22%23F6851B%22%20stroke-width%3D%220.0878845%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3Cpath%20d%3D%22M15.3446%2014.4658L15.6347%209.39485L16.9705%205.7828H11.0383L12.3566%209.39485L12.6642%2014.4658L12.7696%2016.0653L12.7784%2020.0025H15.2128L15.2304%2016.0653L15.3446%2014.4658Z%22%20fill%3D%22%23F6851B%22%20stroke%3D%22%23F6851B%22%20stroke-width%3D%220.0878845%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3C%2Fsvg%3E%0A',
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
	let currentConnector: Connector | undefined;

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
		} catch (error) {
			console.error('Failed to connect wallet:', error);
			showWalletConnectModal = false;
			walletConnectUri = undefined;
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

	// 获取 CSS 变量值
	function getCssVariable(variable: string): string {
		return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
	}

	// 渲染 QR 码
	$effect(() => {
		if (walletConnectUri && qrCodeElement) {
			// 获取主题颜色
			const foregroundColor = getCssVariable('--color-foreground');
			const backgroundColor = getCssVariable('--color-card');
			const primaryColor = getCssVariable('--brand-600');
			const accentColor = getCssVariable('--brand-500');

			const qrCode = new QRCodeStyling({
				width: 280,
				height: 280,
				data: walletConnectUri,
				image: '/logo.svg',
				dotsOptions: {
					color: foregroundColor || '#1a1a1a',
					type: 'rounded'
				},
				backgroundOptions: {
					color: backgroundColor || '#ffffff'
				},
				imageOptions: {
					crossOrigin: 'anonymous',
					margin: 8,
					imageSize: 0.4
				},
				cornersSquareOptions: {
					color: primaryColor || '#2563eb',
					type: 'extra-rounded'
				},
				cornersDotOptions: {
					color: accentColor || '#3b82f6',
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
	<div class="wallet-connected-group">
		<div class="wallet-info">
			<span class="wallet-indicator"></span>
			<span class="wallet-address">{formatAddress(address)}</span>
		</div>
		<CopyButton value={address} />
		<button
			class="icon-button disconnect-button"
			onclick={disconnect}
			type="button"
			title="断开连接"
		>
			<LogOut size={16} />
		</button>
	</div>
{:else}
	<button
		class="wallet-button connect"
		onclick={openConnectorModal}
		disabled={isConnecting}
		type="button"
	>
		{isConnecting ? i18n.t('wallet.connecting') : i18n.t('wallet.connect')}
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
				<h3>{i18n.t('wallet.select_wallet')}</h3>
				<button class="close-button" onclick={closeModal}>
					<X size={20} />
				</button>
			</div>
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
				<h3>{i18n.t('wallet.scan_qr')}</h3>
				<button class="close-button" onclick={closeWalletConnectModal}>
					<X size={20} />
				</button>
			</div>

			<div class="walletconnect-content">
				{#if walletConnectUri}
					<div class="qr-code-container">
						<div bind:this={qrCodeElement} class="qr-code"></div>
					</div>

					<div class="walletconnect-instructions">
						<p class="instruction-title">{i18n.t('wallet.walletconnect.title')}</p>
						<ol class="instruction-list">
							<li>{i18n.t('wallet.walletconnect.step_1')}</li>
							<li>{i18n.t('wallet.walletconnect.step_2')}</li>
							<li>{i18n.t('wallet.walletconnect.step_3')}</li>
						</ol>
					</div>

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

	/* Connected Wallet Group */
	.wallet-connected-group {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.wallet-info {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		background: var(--color-secondary);
		color: var(--color-secondary-foreground);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-full);
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

		.wallet-connected-group {
			width: 100%;
		}

		.wallet-info {
			flex: 1;
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
