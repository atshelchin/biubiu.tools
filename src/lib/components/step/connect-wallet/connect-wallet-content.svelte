<script lang="ts">
	/**
	 * Shared Step 1 Connect Wallet Content Component.
	 *
	 * This component provides the network selection and wallet connection UI
	 * used by step-based tools that require wallet connection.
	 *
	 * @example
	 * ```svelte
	 * <ConnectWalletContent i18nPrefix="token-balance-scanner" />
	 * ```
	 */
	import { useConnectStore } from '$lib/stores/connect.svelte.js';
	import NetworkSelector from '$lib/components/ui/network-selector.svelte';
	import WalletConnectButton from '$lib/components/ui/wallet-connect-button.svelte';
	import type { NetworkConfig } from '@shelchin/ethereum-connectors';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import StepContent from '$lib/components/step/step-content.svelte';
	import LoadingState from '$lib/components/ui/loading-state.svelte';
	import { useI18n, type TranslationKeys } from '@shelchin/i18n';

	interface Props {
		/** i18n prefix for this tool (e.g., 'token-balance-scanner', 'wallet-sweep') */
		i18nPrefix: string;
	}

	let { i18nPrefix }: Props = $props();

	const connectStore = useConnectStore();
	const i18n = useI18n();

	// Helper to translate dynamic keys with type assertion
	function t(key: string): string {
		return i18n.t(key as keyof TranslationKeys);
	}

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
		title={t(`${i18nPrefix}.step1.content.title`)}
		description={t(`${i18nPrefix}.step1.content.description`)}
	/>

	{#if isLoading}
		<LoadingState message={t(`${i18nPrefix}.step1.content.loading`)} />
	{:else}
		<NetworkSelector {connectStore} {isLoading} bind:selectedChainId bind:selectedNetwork />

		<!-- Wallet Connection Section -->
		{#if selectedChainId && hasEnabledNetworks}
			<WalletConnectButton {selectedChainId} {selectedNetwork} class="wallet-section" />
		{/if}
	{/if}
</StepContent>
