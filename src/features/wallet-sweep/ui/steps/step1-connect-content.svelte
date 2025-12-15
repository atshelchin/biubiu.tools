<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte.js';
	import NetworkSelector from '@/lib/components/ui/network-selector.svelte';
	import WalletConnectButton from '$lib/components/ui/wallet-connect-button.svelte';
	import type { NetworkConfig } from '@shelchin/ethereum-connectors';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import StepContent from '$lib/components/step/step-content.svelte';
	import { useI18n } from '@shelchin/i18n/svelte';

	const connectStore = useConnectStore();
	const i18n = useI18n();

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
		title={i18n.t('tools.wallet_sweep.step1.content.title')}
		description={i18n.t('tools.wallet_sweep.step1.content.description')}
	/>

	{#if isLoading}
		<!-- Loading State -->
		<div class="loading-container">
			<div class="loading-spinner"></div>
			<p class="loading-text">{i18n.t('tools.wallet_sweep.step1.content.loading')}</p>
		</div>
	{:else}
		<NetworkSelector {connectStore} {isLoading} bind:selectedChainId bind:selectedNetwork />

		<!-- Wallet Connection Section -->
		{#if selectedChainId && hasEnabledNetworks}
			<WalletConnectButton {selectedChainId} {selectedNetwork} class="wallet-section" />
		{/if}
	{/if}
</StepContent>

<style>
	/* Loading State */
	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: var(--space-12) var(--space-6);
		background: var(--color-panel-1);
		border-radius: var(--radius-lg);
		border: 2px solid var(--color-border);
		min-height: 200px;
	}

	.loading-spinner {
		width: 48px;
		height: 48px;
		border: 4px solid var(--color-border);
		border-top-color: var(--color-primary);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
		margin-bottom: var(--space-4);
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.loading-text {
		color: var(--gray-600);
		font-size: var(--text-base);
		font-weight: var(--font-medium);
	}

	:global([data-theme='dark']) .loading-text {
		color: var(--gray-400);
	}
</style>
