<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import NetworkSelector from '@/lib/components/ui/network-selector.svelte';
	import WalletConnectButton from '@/lib/components/ui/wallet-connect-button.svelte';
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import type { NetworkConfig } from '@shelchin/ethereum-connectors';

	const connectStore = useConnectStore();
	const stepManager = useStepManager();

	let selectedChainId = $state<number | null>(null);
	let selectedNetwork = $state<NetworkConfig | undefined>(undefined);

	const isReadyToContinue = $derived(
		connectStore.isConnected && selectedChainId && connectStore.currentChainId === selectedChainId
	);
</script>

<div class="step-content">
	<StepContentHeader title="Select Network & Connect" description="Choose network to monitor" />

	<NetworkSelector {connectStore} isLoading={false} bind:selectedChainId bind:selectedNetwork />

	{#if selectedChainId}
		<WalletConnectButton {selectedChainId} {selectedNetwork} class="wallet-section" />
	{/if}

	{#if isReadyToContinue}
		<button class="continue-btn" onclick={() => stepManager.next()}>
			Continue to Configuration
		</button>
	{/if}
</div>

<style>
	.step-content {
		padding: var(--space-6);
	}
	.continue-btn {
		margin-top: var(--space-6);
		padding: var(--space-4) var(--space-6);
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-weight: var(--font-semibold);
		cursor: pointer;
	}
	:global(.wallet-section) {
		margin-top: var(--space-6);
	}
</style>
