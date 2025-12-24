<script lang="ts">
	import { useI18n } from '@shelchin/i18n';
	import { useConnectStore } from '$lib/stores/connect.svelte.js';
	import NetworkSelector from '@/lib/components/ui/network-selector.svelte';
	import WalletConnectButton from '@/lib/components/ui/wallet-connect-button.svelte';
	import type { NetworkConfig } from '@shelchin/ethereum-connectors';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import StepContent from '$lib/components/step/step-content.svelte';
	import LoadingState from '$lib/components/ui/loading-state.svelte';

	const i18n = useI18n();
	const connectStore = useConnectStore();

	// Loading state
	const isLoading = $derived(!connectStore.isInitialized);

	// Bind selected network state from NetworkSelector
	let selectedChainId = $state<number | null>(null);
	let selectedNetwork = $state<NetworkConfig | undefined>(undefined);

	const hasEnabledNetworks = $derived(
		connectStore.networks.some((n) => connectStore.isNetworkEnabled(n.chainId))
	);
</script>

<StepContent>
	<StepContentHeader
		title={i18n.t('nft-deployer.step1.content.title')}
		description={i18n.t('nft-deployer.step1.content.description')}
	/>

	{#if isLoading}
		<LoadingState message={i18n.t('common.loading')} />
	{:else}
		<NetworkSelector {connectStore} {isLoading} bind:selectedChainId bind:selectedNetwork />

		<!-- Wallet Connection Section -->
		{#if selectedChainId && hasEnabledNetworks}
			<WalletConnectButton {selectedChainId} {selectedNetwork} class="wallet-section" />
		{/if}
	{/if}
</StepContent>
