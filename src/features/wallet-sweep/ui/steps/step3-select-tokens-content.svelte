<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import { step3State } from '@/features/wallet-sweep/stores/step3-state.svelte';
	import TokenSelector from '$lib/components/ui/token-selector.svelte';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import StepContent from '$lib/components/step/step-content.svelte';
	import EmptyState from '$lib/components/ui/empty-state.svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { useI18n } from '@shelchin/i18n';

	const connectStore = useConnectStore();
	const i18n = useI18n();

	// Get current network info
	let currentNetwork = $derived.by(() => {
		if (!connectStore.currentChainId) return null;
		return connectStore.networks.find((n) => n.chainId === connectStore.currentChainId);
	});

	function handleSelectionChange(newSelection: SvelteSet<string>) {
		console.log({ newSelection }, JSON.stringify(newSelection));
		step3State.selectedTokenIds = newSelection;
	}

	function handleTokenAdded(tokenId: string) {
		// Auto-select the newly added token
		step3State.selectedTokenIds.add(tokenId);
		// Trigger reactivity by creating new SvelteSet
		step3State.selectedTokenIds = new SvelteSet(step3State.selectedTokenIds);
	}

	function handleRemoveCustomToken(tokenId: string) {
		// Remove from selection if it was selected
		if (step3State.selectedTokenIds.has(tokenId)) {
			step3State.selectedTokenIds.delete(tokenId);
			// Trigger reactivity
			step3State.selectedTokenIds = new SvelteSet(step3State.selectedTokenIds);
		}
	}

	// Track which chainId has been initialized to avoid re-selecting after user deselects
	let initializedChainId = $state<number | null>(null);

	// Auto-select native token only on first load or network change
	$effect(() => {
		if (currentNetwork && connectStore.currentChainId) {
			// Only auto-select if this is a new network (not already initialized)
			if (initializedChainId !== connectStore.currentChainId) {
				const newChainId = connectStore.currentChainId;
				const chainPrefix = `${newChainId}:`;

				// Clear tokens from other chains, keep only tokens for current chain
				const filteredTokens = Array.from(step3State.selectedTokenIds).filter((tokenId) =>
					tokenId.startsWith(chainPrefix)
				);

				// Add native token for new chain
				const nativeTokenId = `${newChainId}:native`;
				if (!filteredTokens.includes(nativeTokenId)) {
					filteredTokens.push(nativeTokenId);
				}

				step3State.selectedTokenIds = new SvelteSet(filteredTokens);
				initializedChainId = newChainId;
			}
		}
	});
</script>

<StepContent>
	<StepContentHeader
		title={i18n.t('wallet-sweep.step3.content.title')}
		description={currentNetwork?.name
			? i18n.t('wallet-sweep.step3.content.description', { network: currentNetwork.name })
			: i18n.t('wallet-sweep.step3.content.description_fallback')}
	></StepContentHeader>

	{#if !connectStore.isConnected}
		<EmptyState
			icon="🔌"
			title={i18n.t('wallet-sweep.step3.content.wallet_not_connected_title')}
			message={i18n.t('wallet-sweep.step3.content.wallet_not_connected_message')}
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
				selectedTokenIds={step3State.selectedTokenIds}
				onSelectionChange={handleSelectionChange}
				onTokenAdded={handleTokenAdded}
				onRemoveCustomToken={handleRemoveCustomToken}
				emptyMessage={i18n.t('wallet-sweep.step3.content.empty_message')}
				multiSelect={true}
			/>
		{/if}
	{/if}
</StepContent>
