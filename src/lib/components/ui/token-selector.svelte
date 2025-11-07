<script lang="ts">
	import type { Token, NativeToken } from '$lib/types/token';
	import { SvelteSet } from 'svelte/reactivity';
	import { PREDEFINED_TOKENS } from '$lib/config/tokens';
	import { loadCustomTokens, removeCustomToken } from '$lib/utils/token-storage';
	import AddTokenButton from '$lib/components/ui/add-token-button.svelte';
	import TokenCard from '$lib/components/ui/token-card.svelte';
	import { onMount } from 'svelte';

	interface NetworkInfo {
		chainId: number;
		name: string;
		symbol: string; // Native token symbol
		rpcUrl: string; // Primary RPC URL
		blockExplorer?: string;
	}

	interface Props {
		network: NetworkInfo; // Network info (required)
		selectedTokenIds?: SvelteSet<string>; // Bindable - external selection state
		onSelectionChange?: (selectedIds: SvelteSet<string>) => void; // Callback when selection changes
		onTokenAdded?: (tokenId: string) => void; // Callback when token is added
		onRemoveCustomToken?: (tokenId: string, chainId: number) => void;
		emptyMessage?: string;
		showBulkActions?: boolean;
		showAddButton?: boolean; // Show dashed "Add Token" card
		multiSelect?: boolean; // Allow multiple selection
	}

	let {
		network,
		selectedTokenIds = $bindable(new SvelteSet<string>()),
		onSelectionChange,
		onTokenAdded,
		onRemoveCustomToken,
		emptyMessage = 'No tokens available',
		showBulkActions = true,
		showAddButton = true,
		multiSelect = true
	}: Props = $props();

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

	// Load tokens from network config and localStorage
	let displayTokens = $derived(() => {
		// Watch refresh trigger to force re-evaluation
		void refreshTrigger;

		const allTokens: Token[] = [];

		// Step 1: Auto-generate native token from network info
		const nativeToken: NativeToken = {
			id: `${network.chainId}:native`,
			type: 'native',
			symbol: network.symbol,
			name: network.name,
			decimals: 18,
			chainId: network.chainId,
			logoUrl: ''
		};
		allTokens.push(nativeToken);

		// Step 2: Add predefined ERC20 tokens from config (if any)
		const erc20Tokens = PREDEFINED_TOKENS[network.chainId];
		if (erc20Tokens && erc20Tokens.length > 0) {
			allTokens.push(...erc20Tokens);
		}

		// Step 3: Load custom tokens from localStorage
		const customTokens = loadCustomTokens(network.chainId);
		allTokens.push(...customTokens);

		return allTokens;
	});

	function handleToggle(tokenId: string) {
		// Create new Set to ensure reactivity
		const newSelection = new SvelteSet(selectedTokenIds);

		if (multiSelect) {
			// Multi-select mode: toggle selection
			if (newSelection.has(tokenId)) {
				newSelection.delete(tokenId);
			} else {
				newSelection.add(tokenId);
			}
		} else {
			// Single-select mode: replace selection
			newSelection.clear();
			newSelection.add(tokenId);
		}

		// Update and trigger callback
		selectedTokenIds = newSelection;
		onSelectionChange?.(selectedTokenIds);
	}

	function handleSelectAll() {
		// Create new Set with all tokens
		const newSelection = new SvelteSet<string>();
		displayTokens().forEach((token) => {
			newSelection.add(token.id);
		});

		selectedTokenIds = newSelection;
		onSelectionChange?.(selectedTokenIds);
	}

	function handleDeselectAll() {
		// Create new empty Set
		const newSelection = new SvelteSet<string>();

		selectedTokenIds = newSelection;
		onSelectionChange?.(selectedTokenIds);
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
	{#if showBulkActions}
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
				blockExplorer={network.blockExplorer}
				onToggle={handleToggle}
				onRemove={onRemoveCustomToken ? handleRemove : undefined}
			/>
		{/each}

		{#if showAddButton}
			<AddTokenButton chainId={network.chainId} rpcUrl={network.rpcUrl} {onTokenAdded} />
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
