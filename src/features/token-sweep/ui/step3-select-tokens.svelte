<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import { getAllTokensForChain } from '../config/tokens';
	import { loadCustomTokens, removeCustomToken } from '../utils/token-storage';
	import { fade } from 'svelte/transition';
	import type { StepManager } from '$lib/components/ui/step-indicator.svelte';
	import { step3State } from '../stores/step3-state.svelte';
	import TokenSelector from './components/token-selector.svelte';
	import StepSidebar from './components/step-sidebar.svelte';
	import StepContentHeader from './components/step-content-header.svelte';
	import EmptyState from './components/empty-state.svelte';
	import TokenManager from './components/token-manager.svelte';
	import StepFooter from './components/step-footer.svelte';
	import StepSummary from './components/step-summary.svelte';

	interface Props {
		section: 'sidebar' | 'footer' | 'content';
		stepManager?: StepManager;
	}

	let { section, stepManager }: Props = $props();

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

	// Check if can continue
	let canContinue = $derived(selectedTokenIds.size > 0);

	function toggleToken(tokenId: string) {
		step3State.toggleToken(tokenId);
	}

	function handleContinue() {
		if (canContinue && stepManager) {
			console.log('Selected tokens:', step3State.getSelectedTokens());
			stepManager.goTo(4);
		}
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

{#if section === 'sidebar'}
	<StepSidebar stepNumber={3} title="Select Tokens" description="Choose which tokens to sweep">
		{#if selectedTokenIds.size > 0}
			<div transition:fade>
				<StepSummary title="Selected Tokens">
					<div class="summary-item">
						<span>Count:</span>
						<strong>{selectedTokenIds.size}</strong>
					</div>
				</StepSummary>
			</div>
		{:else}
			<p class="empty-hint">No tokens selected</p>
		{/if}
	</StepSidebar>
{:else if section === 'footer'}
	<StepFooter
		{canContinue}
		onContinue={handleContinue}
		hint="Please select at least one token to continue"
	/>
{:else if section === 'content'}
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
{/if}

<style>
	.empty-hint {
		margin-top: var(--space-4);
		padding: var(--space-3);
		text-align: center;
		font-size: var(--text-sm);
		color: var(--gray-500);
		font-style: italic;
	}

	/* Content */
	.step-content {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.btn-primary,
	.btn-secondary {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		border: none;
		border-radius: var(--radius-sm);
		font-weight: var(--font-medium);
		font-size: var(--text-sm);
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-primary {
		background: var(--color-primary);
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		opacity: 0.9;
		transform: translateY(-1px);
		box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
	}

	.btn-primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-secondary {
		background: var(--gray-200);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .btn-secondary {
		background: var(--gray-700);
		color: var(--gray-200);
	}

	.btn-secondary:hover {
		background: var(--gray-300);
	}

	:global([data-theme='dark']) .btn-secondary:hover {
		background: var(--gray-600);
	}
</style>
