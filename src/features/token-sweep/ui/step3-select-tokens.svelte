<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import { getAllTokensForChain } from '../config/tokens';
	import { loadCustomTokens, removeCustomToken } from '../utils/token-storage';
	import type { Token } from '../types/token';
	import { CheckCircle2, Plus, Trash2, ExternalLink } from 'lucide-svelte';
	import { fade, slide } from 'svelte/transition';
	import type { StepManager } from '$lib/components/ui/step-indicator.svelte';
	import { step3State } from '../stores/step3-state.svelte';
	import AddTokenModal from './add-token-modal.svelte';

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
		if (confirm('Are you sure you want to remove this custom token?')) {
			removeCustomToken(tokenId);
			// Remove from selection if it was selected
			if (selectedTokenIds.has(tokenId)) {
				step3State.toggleToken(tokenId);
			}
		}
	}

	function getTokenLogo(token: Token): string {
		if (token.logoUrl) return token.logoUrl;
		// Fallback to generic icon
		return `https://ui-avatars.com/api/?name=${token.symbol}&background=random`;
	}
</script>

{#if section === 'sidebar'}
	<div class="step-sidebar">
		<h3>Step 3: Select Tokens</h3>
		<p>Choose which tokens to sweep</p>

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
	</div>
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
		<div class="content-header">
			<div>
				<h2>Select Tokens</h2>
				<p class="description">
					Choose which tokens you want to sweep from your addresses on {currentNetwork?.name ||
						'this network'}
				</p>
			</div>

			<div class="header-actions">
				<button class="btn-secondary" onclick={selectAllTokens}>Select All</button>
				<button class="btn-secondary" onclick={deselectAllTokens}>Deselect All</button>
				<button class="btn-primary" onclick={openAddTokenModal}>
					<Plus size={18} />
					Add Custom Token
				</button>
			</div>
		</div>

		{#if !connectStore.isConnected}
			<div class="empty-state">
				<div class="empty-icon">🔌</div>
				<h3>Wallet Not Connected</h3>
				<p>Please go back to Step 1 and connect your wallet</p>
			</div>
		{:else if availableTokens.length === 0}
			<div class="empty-state">
				<div class="empty-icon">🪙</div>
				<h3>No Tokens Available</h3>
				<p>Add a custom token to get started</p>
				<button class="btn-primary" onclick={openAddTokenModal}>
					<Plus size={18} />
					Add Custom Token
				</button>
			</div>
		{:else}
			<div class="tokens-grid">
				{#each availableTokens as token (token.id)}
					<div
						class="token-card"
						class:selected={selectedTokenIds.has(token.id)}
						onclick={() => toggleToken(token.id)}
						transition:slide={{ duration: 200 }}
					>
						<div class="token-card-content">
							<div class="token-header">
								<img src={getTokenLogo(token)} alt={token.symbol} class="token-logo" />
								<div class="token-info">
									<h4>{token.symbol}</h4>
									<p class="token-name">{token.name}</p>
								</div>
							</div>

							<div class="token-meta">
								<span class="token-type">{token.type === 'native' ? 'Native' : 'ERC20'}</span>
								{#if token.type === 'erc20'}
									<a
										href="{currentNetwork?.blockExplorer}/address/{token.address}"
										target="_blank"
										rel="noopener noreferrer"
										class="explorer-link"
										onclick={(e) => e.stopPropagation()}
									>
										<ExternalLink size={14} />
									</a>
								{/if}
								{#if token.isCustom}
									<button
										class="remove-btn"
										onclick={(e) => {
											e.stopPropagation();
											handleRemoveCustomToken(token.id);
										}}
										title="Remove custom token"
									>
										<Trash2 size={14} />
									</button>
								{/if}
							</div>
						</div>

						<div class="token-checkmark">
							{#if selectedTokenIds.has(token.id)}
								<CheckCircle2 size={24} />
							{:else}
								<div class="checkmark-placeholder"></div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
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
	h2 {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		margin: 0 0 var(--space-2) 0;
		color: var(--gray-900);
	}

	:global([data-theme='dark']) h2 {
		color: var(--gray-100);
	}

	h3 {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		margin: 0;
		color: var(--gray-800);
	}

	:global([data-theme='dark']) h3 {
		color: var(--gray-200);
	}

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

	.description {
		font-size: var(--text-sm);
		margin-bottom: var(--space-4);
	}

	/* Sidebar */
	.step-sidebar {
		height: 100%;
	}

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

	.content-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: var(--space-4);
		margin-bottom: var(--space-6);
	}

	.header-actions {
		display: flex;
		gap: var(--space-2);
		flex-wrap: wrap;
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

	/* Empty State */
	.empty-state {
		flex: 1;
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

	.empty-state h3 {
		font-size: var(--text-xl);
		margin: 0;
	}

	.empty-state p {
		max-width: 400px;
	}

	/* Tokens Grid */
	.tokens-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: var(--space-4);
		flex: 1;
		overflow-y: auto;
		padding: var(--space-2);
	}

	/* Token Card */
	.token-card {
		position: relative;
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-lg);
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	:global([data-theme='dark']) .token-card {
		background: var(--gray-800);
		border-color: var(--gray-700);
	}

	.token-card:hover {
		border-color: var(--color-primary);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	:global([data-theme='dark']) .token-card:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	.token-card.selected {
		border-color: var(--color-primary);
		background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.05) 100%);
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	:global([data-theme='dark']) .token-card.selected {
		background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%);
	}

	.token-card-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.token-header {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.token-logo {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		object-fit: cover;
		background: var(--gray-100);
	}

	:global([data-theme='dark']) .token-logo {
		background: var(--gray-700);
	}

	.token-info {
		flex: 1;
		min-width: 0;
	}

	.token-name {
		font-size: var(--text-sm);
		color: var(--gray-500);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.token-meta {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		flex-wrap: wrap;
	}

	.token-type {
		display: inline-block;
		padding: 2px 8px;
		background: var(--gray-200);
		color: var(--gray-700);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		border-radius: var(--radius-sm);
	}

	:global([data-theme='dark']) .token-type {
		background: var(--gray-700);
		color: var(--gray-300);
	}

	.explorer-link {
		display: inline-flex;
		align-items: center;
		padding: 4px;
		color: var(--color-primary);
		background: var(--color-panel-1);
		border-radius: var(--radius-sm);
		transition: all 0.2s;
		text-decoration: none;
	}

	.explorer-link:hover {
		background: var(--color-primary);
		color: white;
	}

	.remove-btn {
		display: inline-flex;
		align-items: center;
		padding: 4px;
		background: transparent;
		border: none;
		color: hsl(0, 70%, 50%);
		cursor: pointer;
		border-radius: var(--radius-sm);
		transition: all 0.2s;
	}

	.remove-btn:hover {
		background: hsla(0, 70%, 50%, 0.1);
		color: hsl(0, 80%, 40%);
	}

	.token-checkmark {
		position: absolute;
		top: var(--space-3);
		right: var(--space-3);
		color: var(--color-primary);
	}

	.checkmark-placeholder {
		width: 24px;
		height: 24px;
		border: 2px solid var(--gray-300);
		border-radius: 50%;
	}

	:global([data-theme='dark']) .checkmark-placeholder {
		border-color: var(--gray-600);
	}

	/* Responsive */
	@media (max-width: 768px) {
		.content-header {
			flex-direction: column;
		}

		.header-actions {
			width: 100%;
			justify-content: flex-start;
		}

		.tokens-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
