<script lang="ts">
	import type { ERC20Token } from '$lib/types/token';
	import { useConnectStore } from '$lib/stores/connect.svelte';
	// import { removeCustomToken } from '@/features/token-sweep/utils/token-storage';
	import { step3State } from '@/features/token-sweep/stores/step3-state.svelte';
	import TokenSelector from '$lib/components/ui/token-selector.svelte';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import EmptyState from '@/features/token-sweep/ui/components/empty-state.svelte';

	const connectStore = useConnectStore();

	// Use shared state from step3State
	let selectedTokenIds = $derived(step3State.selectedTokenIds);

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

	function saveCustomTokens(tokens: ERC20Token[], chainId: number): void {
		try {
			localStorage.setItem(`custom-tokens:${chainId}`, JSON.stringify(tokens));
		} catch (error) {
			console.error('Failed to save custom tokens:', error);
		}
	}

	function loadCustomTokens(chainId: number): ERC20Token[] {
		try {
			const stored = localStorage.getItem(`custom-tokens:${chainId}`);
			if (!stored) return [];

			const data: ERC20Token[] = JSON.parse(stored);

			const tokens = data || [];

			return tokens;
		} catch (error) {
			console.error('Failed to load custom tokens:', error);
			return [];
		}
	}
	/**
	 * Remove a custom token
	 */
	function removeCustomToken(tokenId: string, chainId: number): void {
		const tokens = loadCustomTokens(chainId);
		const filtered = tokens.filter((t) => t.id !== tokenId);
		saveCustomTokens(filtered, chainId);
	}

	function handleRemoveCustomToken(tokenId: string, chainId: number) {
		removeCustomToken(tokenId, chainId);
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
			{selectedTokenIds}
			onToggle={toggleToken}
			onSelectAll={() => {
				// Select all currently displayed tokens
				const chainId = connectStore.currentChainId || 1;
				const allTokenIds = step3State
					.getAvailableTokens(chainId, currentNetwork?.symbol, currentNetwork?.name)
					.map((t) => t.id);
				step3State.selectAll(allTokenIds);
			}}
			onDeselectAll={() => step3State.deselectAll()}
			onTokenAdded={handleTokenAdded}
			onRemoveCustomToken={handleRemoveCustomToken}
			blockExplorer={currentNetwork?.blockExplorer}
			emptyMessage="No tokens available. Add a custom token to get started."
			storageKey="custom-tokens"
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
