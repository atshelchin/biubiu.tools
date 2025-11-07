<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import { getAllTokensForChain } from '../config/tokens';
	import { loadCustomTokens, removeCustomToken } from '../utils/token-storage';
	import { step3State } from '../stores/step3-state.svelte';
	import TokenSelector from './components/token-selector.svelte';
	import StepContentHeader from './components/step-content-header.svelte';
	import EmptyState from './components/empty-state.svelte';
	import TokenManager from './components/token-manager.svelte';

	const connectStore = useConnectStore();

	// Use shared state from step3State
	let selectedTokenIds = $derived(step3State.selectedTokenIds);

	// All available tokens for current chain
	let availableTokens = $derived.by(() => {
		if (!connectStore.currentChainId) return [];
		const predefined = getAllTokensForChain(connectStore.currentChainId);
		const custom = loadCustomTokens(connectStore.currentChainId);
		return [...predefined, ...custom];
	});

	// Get current network info
	let currentNetwork = $derived.by(() => {
		if (!connectStore.currentChainId) return null;
		return connectStore.networks.find((n) => n.chainId === connectStore.currentChainId);
	});

	function toggleToken(tokenId: string) {
		step3State.toggleToken(tokenId);
	}

	function handleTokenAdded(tokenId: string) {
		// Auto-select the newly added token
		step3State.toggleToken(tokenId);
	}

	function handleRemoveCustomToken(tokenId: string) {
		removeCustomToken(tokenId);
		// Remove from selection if it was selected
		if (selectedTokenIds.has(tokenId)) {
			step3State.toggleToken(tokenId);
		}
	}
</script>

<div class="step-content">
	<StepContentHeader
		title="Select Tokens"
		description="Choose which tokens you want to sweep from your addresses on {currentNetwork?.name ||
			'this network'}"
	>
		{#snippet actions()}
			<TokenManager
				chainId={connectStore.currentChainId || 0}
				onTokenAdded={handleTokenAdded}
				buttonClass="btn-primary"
			/>
		{/snippet}
	</StepContentHeader>

	{#if !connectStore.isConnected}
		<EmptyState
			icon="🔌"
			title="Wallet Not Connected"
			message="Please go back to Step 1 and connect your wallet"
		/>
	{:else}
		<TokenSelector
			tokens={availableTokens}
			{selectedTokenIds}
			onToggle={toggleToken}
			onSelectAll={() => step3State.selectAll(availableTokens.map((t) => t.id))}
			onDeselectAll={() => step3State.deselectAll()}
			onRemoveCustomToken={handleRemoveCustomToken}
			blockExplorer={currentNetwork?.blockExplorer}
			emptyMessage="No tokens available. Add a custom token to get started."
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
