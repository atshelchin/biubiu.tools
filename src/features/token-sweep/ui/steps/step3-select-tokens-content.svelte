<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import { step3State } from '@/features/token-sweep/stores/step3-state.svelte';
	import TokenSelector from '$lib/components/ui/token-selector.svelte';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import EmptyState from '@/features/token-sweep/ui/components/empty-state.svelte';

	const connectStore = useConnectStore();

	// Get current network info
	let currentNetwork = $derived.by(() => {
		if (!connectStore.currentChainId) return null;
		return connectStore.networks.find((n) => n.chainId === connectStore.currentChainId);
	});

	function handleSelectionChange(newSelection: typeof step3State.selectedTokenIds) {
		step3State.selectedTokenIds = newSelection;
	}

	function handleTokenAdded(tokenId: string) {
		// Auto-select the newly added token
		step3State.toggleToken(tokenId);
	}

	function handleRemoveCustomToken(tokenId: string, _chainId: number) {
		// Remove from selection if it was selected
		if (step3State.selectedTokenIds.has(tokenId)) {
			step3State.toggleToken(tokenId);
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
	{:else}
		<TokenSelector
			chainId={connectStore.currentChainId}
			bind:selectedTokenIds={step3State.selectedTokenIds}
			onSelectionChange={handleSelectionChange}
			onTokenAdded={handleTokenAdded}
			onRemoveCustomToken={handleRemoveCustomToken}
			blockExplorer={currentNetwork?.blockExplorer}
			emptyMessage="No tokens available. Add a custom token to get started."
			storageKey="custom-tokens"
			multiSelect={true}
		/>
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
