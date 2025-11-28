<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import { step3State } from '@/features/token-sweep/stores/step3-state.svelte';
	import TokenSelector from '$lib/components/ui/token-selector.svelte';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import StepContent from '$lib/components/step/step-content.svelte';
	import EmptyState from '@/features/token-sweep/ui/components/empty-state.svelte';
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

	// Auto-select native token when network changes or on first load
	$effect(() => {
		if (currentNetwork && connectStore.currentChainId) {
			const nativeTokenId = `${connectStore.currentChainId}:native`;

			// Auto-select native token if not already selected
			if (!step3State.selectedTokenIds.has(nativeTokenId)) {
				step3State.selectedTokenIds.add(nativeTokenId);
				// Trigger reactivity
				step3State.selectedTokenIds = new SvelteSet(step3State.selectedTokenIds);
			}
		}
	});

	$effect(() => {
		console.log('step3', step3State.selectedTokenIds);
	});
</script>

<StepContent>
	<StepContentHeader
		title={i18n.t('tools.token_sweep.step3.content.title')}
		description={currentNetwork?.name
			? i18n.t('tools.token_sweep.step3.content.description', { network: currentNetwork.name })
			: i18n.t('tools.token_sweep.step3.content.description_fallback')}
	></StepContentHeader>

	{#if !connectStore.isConnected}
		<EmptyState
			icon="🔌"
			title={i18n.t('tools.token_sweep.step3.content.wallet_not_connected_title')}
			message={i18n.t('tools.token_sweep.step3.content.wallet_not_connected_message')}
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
				emptyMessage={i18n.t('tools.token_sweep.step3.content.empty_message')}
				multiSelect={true}
			/>
		{/if}
	{/if}
</StepContent>
