<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import type { NetworkConfig } from '@shelchin/ethereum-connectors';
	import { useI18n } from '@shelchin/i18n/svelte';
	import { parseWalletError } from '$lib/utils/wallet-utils';
	import { useClipboard } from '$lib/composables/use-clipboard.svelte';
	import { useWalletBalance } from '$lib/composables/use-wallet-balance.svelte';
	import LongPressButton from '$lib/components/wallet/long-press-button.svelte';
	import NetworkMismatchCard from '$lib/components/wallet/network-mismatch-card.svelte';
	import ConnectedWalletInfo from '$lib/components/wallet/connected-wallet-info.svelte';
	import ErrorCard from '$lib/components/ui/error-card.svelte';

	interface Props {
		selectedChainId: number;
		selectedNetwork?: NetworkConfig;
		class?: string;
	}

	let { selectedChainId, selectedNetwork, class: className = '' }: Props = $props();

	const connectStore = useConnectStore();
	const i18n = useI18n();
	const clipboard = useClipboard();
	const walletBalance = useWalletBalance();

	// Wallet connection states
	const isWalletConnected = $derived(connectStore.isConnected);
	const isWalletConnecting = $derived(connectStore.isConnecting);
	const walletChainId = $derived(connectStore.currentChainId);
	const isNetworkMismatch = $derived(isWalletConnected && walletChainId !== selectedChainId);

	let connectionError = $state<string | null>(null);
	let isSwitching = $state(false);
	let accounts = $state<string[]>([]);

	// Load accounts and their balances
	async function loadAccounts() {
		const accs = await connectStore.getAccounts();
		accounts = accs || [];

		if (accs && accs.length > 0 && connectStore.publicClient) {
			await walletBalance.loadBalances(connectStore.publicClient, accs);
		}
	}

	// Handle wallet connection
	async function handleConnectWallet() {
		connectionError = null;
		connectStore.openConnectorModal();
	}

	// Long press to force reset connection
	async function forceResetConnection() {
		console.log('forceResetConnection');
		await connectStore.cancelConnection();
	}

	// Handle network switching
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

	// Copy address to clipboard
	async function copyAddress() {
		if (!connectStore.address) return;
		await clipboard.copy(connectStore.address);
	}

	// Switch account
	async function handleSwitchAccount(address: string) {
		await connectStore.switchAccount(address);
	}

	// Parse and display friendly error messages
	function handleConnectionError(error: unknown) {
		console.error('Wallet connection error:', error);
		connectionError = parseWalletError(error, selectedChainId, selectedNetwork?.name);
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
		}
	});
</script>

<div class="wallet-connect-button-wrapper {className}">
	{#if !isWalletConnected}
		<!-- Not connected - show connect button -->
		<LongPressButton
			isLoading={isWalletConnecting}
			onclick={handleConnectWallet}
			onLongPress={forceResetConnection}
			showHint={isWalletConnecting}
		/>
	{:else if isNetworkMismatch}
		<!-- Connected but wrong network -->
		<NetworkMismatchCard
			targetNetwork={selectedNetwork}
			targetChainId={selectedChainId}
			{isSwitching}
			onSwitchNetwork={handleSwitchNetwork}
			onConnectWallet={handleConnectWallet}
		/>
	{:else}
		<!-- Connected and correct network -->
		<ConnectedWalletInfo
			network={selectedNetwork}
			chainId={selectedChainId}
			address={connectStore.address || ''}
			connectorIcon={connectStore.connectorIcon}
			{accounts}
			balances={walletBalance.balances}
			copySuccess={clipboard.copySuccess}
			onCopyAddress={copyAddress}
			onDisconnect={connectStore.disconnect}
			onSwitchAccount={handleSwitchAccount}
		/>
	{/if}

	<!-- Error Message Display -->
	{#if connectionError}
		<ErrorCard title={i18n.t('wallet.connection_error')} message={connectionError} />
	{/if}
</div>

<style>
	.wallet-connect-button-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		width: 100%;
	}
</style>
