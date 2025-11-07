<script lang="ts">
	import type { Token, NativeToken } from '$lib/types/token';
	import { SvelteSet } from 'svelte/reactivity';
	import { PREDEFINED_TOKENS } from '$lib/config/tokens';
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import { loadCustomTokens, removeCustomToken } from '$lib/utils/token-storage';
	import AddTokenButton from '$lib/components/ui/add-token-button.svelte';
	import TokenCard from '$lib/components/ui/token-card.svelte';
	import { onMount } from 'svelte';

	interface Props {
		chainId?: number; // If provided, auto-load tokens for this chain
		tokens?: Token[]; // Manual token list (overrides chainId)
		selectedTokenIds?: SvelteSet<string>;
		onToggle?: (tokenId: string) => void;
		onSelectAll?: () => void;
		onDeselectAll?: () => void;
		onTokenAdded?: (tokenId: string) => void; // Callback when token is added
		onRemoveCustomToken?: (tokenId: string, chainId: number) => void;
		blockExplorer?: string;
		emptyMessage?: string;
		showBulkActions?: boolean;
		showAddButton?: boolean; // Show dashed "Add Token" card
		storageKey?: string; // LocalStorage key for custom tokens
	}

	let {
		chainId,
		tokens = [],
		selectedTokenIds = new SvelteSet<string>(),
		onToggle,
		onSelectAll,
		onDeselectAll,
		onTokenAdded,
		onRemoveCustomToken,
		blockExplorer,
		emptyMessage = 'No tokens available',
		showBulkActions = true,
		showAddButton = true,
		storageKey
	}: Props = $props();

	const connectStore = useConnectStore();

	// Force refresh when custom tokens change
	let refreshTrigger = $state(0);

	// Listen for custom token events
	onMount(() => {
		const handleTokenChange = () => {
			refreshTrigger++;
		};
		window.addEventListener('custom-token-added', handleTokenChange);
		window.addEventListener('custom-token-removed', handleTokenChange);

		return () => {
			window.removeEventListener('custom-token-added', handleTokenChange);
			window.removeEventListener('custom-token-removed', handleTokenChange);
		};
	});

	// Load tokens from network config or localStorage
	let displayTokens = $derived(() => {
		// Watch refresh trigger to force re-evaluation
		void refreshTrigger;
		// If manual tokens provided, use them
		if (tokens.length > 0) return tokens;

		console.log({ tokens });
		// Otherwise, load from chain config + custom tokens
		const currentChainId = chainId ?? connectStore.currentChainId;
		if (!currentChainId) return [];

		const allTokens: Token[] = [];

		// Step 1: Auto-generate native token from network config
		// This works for ALL networks (predefined + custom networks)
		const currentNetwork = connectStore.networks.find((n) => n.chainId === currentChainId);
		if (currentNetwork) {
			const nativeToken: NativeToken = {
				id: `${currentChainId}:native`,
				type: 'native',
				symbol: currentNetwork.symbol,
				name: currentNetwork.name,
				decimals: 18,
				chainId: currentChainId,
				logoUrl: '' // Will be handled by getTokenLogo fallback
			};
			allTokens.push(nativeToken);
		}

		// Step 2: Add predefined ERC20 tokens from config (if any)
		const erc20Tokens = PREDEFINED_TOKENS[currentChainId];
		if (erc20Tokens && erc20Tokens.length > 0) {
			allTokens.push(...erc20Tokens);
		}

		// Step 3: Load custom tokens from localStorage using unified storage
		const customTokens = loadCustomTokens(currentChainId);
		console.log({ customTokens });
		allTokens.push(...customTokens);

		return allTokens;
	});

	function handleToggle(tokenId: string) {
		onToggle?.(tokenId);
	}

	function handleSelectAll() {
		onSelectAll?.();
	}

	function handleDeselectAll() {
		onDeselectAll?.();
	}

	function handleRemove(tokenId: string, chainId: number) {
		onRemoveCustomToken?.(tokenId, chainId);

		// Remove from unified localStorage
		removeCustomToken(tokenId);
	}
</script>

{#if displayTokens().length === 0}
	<div class="empty-state">
		<div class="empty-icon">🪙</div>
		<p>{emptyMessage}</p>
	</div>
{:else}
	{#if showBulkActions && displayTokens().length > 0}
		<div class="bulk-actions">
			<button class="btn-secondary" onclick={handleSelectAll}>Select All</button>
			<button class="btn-secondary" onclick={handleDeselectAll}>Deselect All</button>
		</div>
	{/if}
	<div class="tokens-grid">
		{#each displayTokens() as token (token.id)}
			<TokenCard
				{token}
				isSelected={selectedTokenIds.has(token.id)}
				{blockExplorer}
				onToggle={handleToggle}
				onRemove={onRemoveCustomToken ? handleRemove : undefined}
			/>
		{/each}

		{#if showAddButton && storageKey}
			{@const currentChainId = chainId ?? connectStore.currentChainId ?? 1}
			{@const currentNetwork = connectStore.networks.find((n) => n.chainId === currentChainId)}
			{@const rpcUrl = currentNetwork?.rpcEndpoints?.[0]?.url || ''}
			{#if rpcUrl}
				<AddTokenButton chainId={currentChainId} {rpcUrl} {onTokenAdded} />
			{/if}
		{/if}
	</div>
{/if}

<style>
	.bulk-actions {
		display: flex;
		gap: var(--space-2);
		margin-bottom: var(--space-4);
	}

	.btn-secondary {
		padding: var(--space-2) var(--space-4);
		background: var(--color-panel-2);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-heading-2);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.btn-secondary:hover {
		background: var(--color-panel-3);
		border-color: var(--color-primary);
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--space-3);
		padding: var(--space-8);
		text-align: center;
	}

	.empty-icon {
		font-size: 4rem;
	}

	.empty-state p {
		color: var(--gray-600);
		max-width: 400px;
	}

	:global([data-theme='dark']) .empty-state p {
		color: var(--gray-400);
	}

	.tokens-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: var(--space-4);
		/* padding: var(--space-2); */
	}

	@media (max-width: 768px) {
		.tokens-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
