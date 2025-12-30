<script lang="ts">
	/**
	 * Shared Token Selection Step Content Component.
	 *
	 * Displays a token selector for multi-select token selection.
	 * Uses TokenSelector component internally.
	 *
	 * @example
	 * ```svelte
	 * <TokenSelectionContent
	 *   i18nPrefix="routes/apps/wallet-sweep"
	 *   selectedTokenIds={state.selectedTokenIds}
	 *   onSelectionChange={(ids) => state.selectedTokenIds = ids}
	 *   onTokenAdded={(id) => state.selectedTokenIds.add(id)}
	 *   onRemoveCustomToken={(id) => state.selectedTokenIds.delete(id)}
	 * />
	 * ```
	 */
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import TokenSelector from '$lib/components/ui/token-selector.svelte';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import StepContent from '$lib/components/step/step-content.svelte';
	import EmptyState from '$lib/components/ui/empty-state.svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { useI18n, type TranslationKeys } from '@shelchin/i18n';

	interface Props {
		/** i18n prefix for this tool (e.g., 'wallet-sweep') */
		i18nPrefix: string;
		/** Step number for i18n keys (default: 3) */
		stepNumber?: number;
		/** Currently selected token IDs */
		selectedTokenIds: SvelteSet<string>;
		/** Callback when selection changes */
		onSelectionChange: (newSelection: SvelteSet<string>) => void;
		/** Callback when a custom token is added */
		onTokenAdded: (tokenId: string) => void;
		/** Callback when a custom token is removed */
		onRemoveCustomToken: (tokenId: string) => void;
	}

	let {
		i18nPrefix,
		stepNumber = 3,
		selectedTokenIds,
		onSelectionChange,
		onTokenAdded,
		onRemoveCustomToken
	}: Props = $props();

	const connectStore = useConnectStore();
	const i18n = useI18n();

	// Helper to translate dynamic keys with type assertion
	function t(key: string, params?: Record<string, string>): string {
		return i18n.t(key as keyof TranslationKeys, params);
	}

	// Get current network info
	let currentNetwork = $derived.by(() => {
		if (!connectStore.currentChainId) return null;
		return connectStore.networks.find((n) => n.chainId === connectStore.currentChainId);
	});

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
				const filteredTokens = Array.from(selectedTokenIds).filter((tokenId) =>
					tokenId.startsWith(chainPrefix)
				);

				// Add native token for new chain
				const nativeTokenId = `${newChainId}:native`;
				if (!filteredTokens.includes(nativeTokenId)) {
					filteredTokens.push(nativeTokenId);
				}

				onSelectionChange(new SvelteSet(filteredTokens));
				initializedChainId = newChainId;
			}
		}
	});
</script>

<StepContent>
	<StepContentHeader
		title={t(`${i18nPrefix}.step${stepNumber}.content.title`)}
		description={currentNetwork?.name
			? t(`${i18nPrefix}.step${stepNumber}.content.description`, { network: currentNetwork.name })
			: t(`${i18nPrefix}.step${stepNumber}.content.description_fallback`)}
	></StepContentHeader>

	{#if !connectStore.isConnected}
		<EmptyState
			icon="🔌"
			title={t(`${i18nPrefix}.step${stepNumber}.content.wallet_not_connected_title`)}
			message={t(`${i18nPrefix}.step${stepNumber}.content.wallet_not_connected_message`)}
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
				{selectedTokenIds}
				{onSelectionChange}
				{onTokenAdded}
				{onRemoveCustomToken}
				emptyMessage={t(`${i18nPrefix}.step${stepNumber}.content.empty_message`)}
				multiSelect={true}
			/>
		{/if}
	{/if}
</StepContent>
