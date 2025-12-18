<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import { step3State } from '../../stores/step3-state.svelte';
	import TokenSelector from '$lib/components/ui/token-selector.svelte';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import StepContent from '$lib/components/step/step-content.svelte';
	import EmptyState from '@/features/wallet-sweep/ui/components/empty-state.svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { useI18n } from '@shelchin/i18n/svelte';

	const connectStore = useConnectStore();
	const i18n = useI18n();

	// Get current network info
	let currentNetwork = $derived.by(() => {
		if (!connectStore.currentChainId) return null;
		return connectStore.networks.find((n) => n.chainId === connectStore.currentChainId);
	});

	function handleSelectionChange(newSelection: SvelteSet<string>) {
		// Clear existing and add new selections
		step3State.selectedTokens.clear();
		newSelection.forEach((tokenId) => step3State.selectedTokens.add(tokenId));
	}

	function handleTokenAdded(tokenId: string) {
		// Auto-select the newly added token
		step3State.addToken(tokenId);
	}

	function handleRemoveCustomToken(tokenId: string) {
		// Remove from selection if it was selected
		if (step3State.selectedTokens.has(tokenId)) {
			step3State.removeToken(tokenId);
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
				const filteredTokens = Array.from(step3State.selectedTokens).filter((tokenId) =>
					tokenId.startsWith(chainPrefix)
				);

				// Add native token for new chain
				const nativeTokenId = `${newChainId}:native`;
				if (!filteredTokens.includes(nativeTokenId)) {
					filteredTokens.push(nativeTokenId);
				}

				step3State.selectedTokens.clear();
				filteredTokens.forEach((tokenId) => step3State.selectedTokens.add(tokenId));
				initializedChainId = newChainId;
			}
		}
	});
</script>

<StepContent>
	<StepContentHeader
		title={i18n.t('tools.token_balance_scanner.step3.content.title')}
		description={currentNetwork?.name
			? i18n.t('tools.token_balance_scanner.step3.content.description', {
					network: currentNetwork.name
				})
			: i18n.t('tools.token_balance_scanner.step3.content.description_fallback')}
	></StepContentHeader>

	{#if !connectStore.isConnected}
		<EmptyState
			icon="🔌"
			title={i18n.t('tools.token_balance_scanner.step3.content.wallet_not_connected_title')}
			message={i18n.t('tools.token_balance_scanner.step3.content.wallet_not_connected_message')}
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
				selectedTokenIds={step3State.selectedTokens}
				onSelectionChange={handleSelectionChange}
				onTokenAdded={handleTokenAdded}
				onRemoveCustomToken={handleRemoveCustomToken}
				emptyMessage={i18n.t('tools.token_balance_scanner.step3.content.empty_message')}
				multiSelect={true}
			/>
		{/if}
	{/if}
</StepContent>
