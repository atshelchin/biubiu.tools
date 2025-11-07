<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import { getAllTokensForChain } from '../config/tokens';
	import { loadCustomTokens, removeCustomToken } from '../utils/token-storage';
	import { Plus } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import type { StepManager } from '$lib/components/ui/step-indicator.svelte';
	import { step3State } from '../stores/step3-state.svelte';
	import AddTokenModal from './add-token-modal.svelte';
	import TokenSelector from './components/token-selector.svelte';
	import StepSidebar from './components/step-sidebar.svelte';
	import StepContentHeader from './components/step-content-header.svelte';
	import EmptyState from './components/empty-state.svelte';

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

	// Modal state for adding custom token
	let showAddTokenModal = $state(false);

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

	function selectAllTokens() {
		step3State.selectAll(availableTokens.map((t) => t.id));
	}

	function deselectAllTokens() {
		step3State.deselectAll();
	}

	function handleContinue() {
		if (canContinue && stepManager) {
			console.log('Selected tokens:', step3State.getSelectedTokens());
			stepManager.goTo(4);
		}
	}

	function openAddTokenModal() {
		showAddTokenModal = true;
	}

	function closeAddTokenModal() {
		showAddTokenModal = false;
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
			<div class="summary" transition:fade>
				<h4>Selected Tokens</h4>
				<div class="summary-item">
					<span>Count:</span>
					<strong>{selectedTokenIds.size}</strong>
				</div>
			</div>
		{:else}
			<p class="empty-hint">No tokens selected</p>
		{/if}
	</StepSidebar>
{:else if section === 'footer'}
	<div class="step-footer">
		{#if canContinue}
			<button class="continue-btn" onclick={handleContinue}>
				Continue to Next Step
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M5 12h14M12 5l7 7-7 7" />
				</svg>
			</button>
		{:else}
			<p class="footer-hint">Please select at least one token to continue</p>
		{/if}
	</div>
{:else if section === 'content'}
	<div class="step-content">
		<StepContentHeader
			title="Select Tokens"
			description="Choose which tokens you want to sweep from your addresses on {currentNetwork?.name ||
				'this network'}"
		>
			{#snippet actions()}
				<button class="btn-secondary" onclick={selectAllTokens}>Select All</button>
				<button class="btn-secondary" onclick={deselectAllTokens}>Deselect All</button>
				<button class="btn-primary" onclick={openAddTokenModal}>
					<Plus size={18} />
					Add Custom Token
				</button>
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
				onRemoveCustomToken={handleRemoveCustomToken}
				blockExplorer={currentNetwork?.blockExplorer}
				emptyMessage="No tokens available. Add a custom token to get started."
			/>
		{/if}
	</div>
{/if}

<!-- Add Token Modal -->
<AddTokenModal
	bind:open={showAddTokenModal}
	chainId={connectStore.currentChainId || 0}
	onClose={closeAddTokenModal}
	onTokenAdded={handleTokenAdded}
/>

<style>
	/* Common Styles */
	h4 {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		margin: 0;
		color: var(--gray-900);
	}

	:global([data-theme='dark']) h4 {
		color: var(--gray-100);
	}

	p {
		color: var(--gray-600);
		line-height: 1.6;
		margin: 0;
	}

	:global([data-theme='dark']) p {
		color: var(--gray-400);
	}

	/* Sidebar Summary */
	.summary {
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: var(--gray-50);
		border-radius: var(--radius-md);
		border: 1px solid var(--gray-200);
	}

	:global([data-theme='dark']) .summary {
		background: var(--gray-800);
		border-color: var(--gray-700);
	}

	.summary-item {
		display: flex;
		justify-content: space-between;
		padding: var(--space-2) 0;
	}

	.summary-item span {
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .summary-item span {
		color: var(--gray-400);
	}

	.summary-item strong {
		font-size: var(--text-sm);
		color: var(--gray-900);
		font-weight: var(--font-semibold);
	}

	:global([data-theme='dark']) .summary-item strong {
		color: var(--gray-100);
	}

	.empty-hint {
		margin-top: var(--space-4);
		padding: var(--space-3);
		text-align: center;
		font-size: var(--text-sm);
		color: var(--gray-500);
		font-style: italic;
	}

	/* Footer */
	.step-footer {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.continue-btn {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-6);
		background: linear-gradient(135deg, #3b82f6, #2563eb);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-weight: var(--font-semibold);
		font-size: var(--text-base);
		cursor: pointer;
		transition: all 0.2s;
		box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
	}

	.continue-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
	}

	.continue-btn:active {
		transform: translateY(0);
	}

	.footer-hint {
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
