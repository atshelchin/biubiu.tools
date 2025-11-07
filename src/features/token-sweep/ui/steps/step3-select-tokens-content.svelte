<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import { step3State } from '@/features/token-sweep/stores/step3-state.svelte';
	import TokenSelector from '$lib/components/ui/token-selector.svelte';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import EmptyState from '@/features/token-sweep/ui/components/empty-state.svelte';
	import { SvelteSet } from 'svelte/reactivity';

	const connectStore = useConnectStore();

	// Get current network info
	let currentNetwork = $derived.by(() => {
		if (!connectStore.currentChainId) return null;
		return connectStore.networks.find((n) => n.chainId === connectStore.currentChainId);
	});

	function handleTokenAdded(tokenId: string) {
		// Auto-select the newly added token
		const newSelection = new SvelteSet(step3State.selectedTokenIds);
		newSelection.add(tokenId);
		step3State.selectedTokenIds = newSelection;
	}

	function handleRemoveCustomToken(tokenId: string) {
		// Remove from selection if it was selected
		if (step3State.selectedTokenIds.has(tokenId)) {
			const newSelection = new SvelteSet(step3State.selectedTokenIds);
			newSelection.delete(tokenId);
			step3State.selectedTokenIds = newSelection;
		}
	}
</script>

<div class="step-content">
	<StepContentHeader
		title="Select Tokens"
		description="Choose which tokens you want to sweep from your addresses on {currentNetwork?.name ||
			'this network'}"
	></StepContentHeader>

	{#if !connectStore.isConnected}
		<EmptyState
			icon="🔌"
			title="Wallet Not Connected"
			message="Please go back to Step 1 and connect your wallet"
		/>
	{:else if currentNetwork && connectStore.currentChainId}
		{@const rpcUrl = currentNetwork.rpcEndpoints?.[0]?.url || ''}
		{#if rpcUrl}
			<TokenSelector
				network={{
					chainId: connectStore.currentChainId,
					name: currentNetwork.name,
					symbol: currentNetwork.symbol,
					rpcUrl,
					blockExplorer: currentNetwork.blockExplorer
				}}
				bind:selectedTokenIds={step3State.selectedTokenIds}
				onTokenAdded={handleTokenAdded}
				onRemoveCustomToken={handleRemoveCustomToken}
				emptyMessage="No tokens available. Add a custom token to get started."
				multiSelect={true}
			/>
		{/if}
	{/if}
</div>

<style>
	/* Content */
	.step-content {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
</style>
