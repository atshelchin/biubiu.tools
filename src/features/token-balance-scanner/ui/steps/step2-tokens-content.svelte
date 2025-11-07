<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import { scannerState } from '../../stores/scanner-state.svelte';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import { PREDEFINED_TOKENS } from '$lib/config/tokens';
	import type { NativeToken, ERC20Token } from '$lib/types/token';

	const connectStore = useConnectStore();

	// Get tokens for current network
	const availableTokens = $derived(() => {
		if (!connectStore.currentChainId) return [];

		const tokens: (NativeToken | ERC20Token)[] = [];

		// Add native token
		const currentNetwork = connectStore.networks.find(
			(n) => n.chainId === connectStore.currentChainId
		);
		if (currentNetwork) {
			const nativeToken: NativeToken = {
				id: `${connectStore.currentChainId}:native`,
				type: 'native',
				symbol: currentNetwork.symbol,
				name: currentNetwork.name,
				decimals: 18,
				chainId: connectStore.currentChainId,
				logoUrl: ''
			};
			tokens.push(nativeToken);
		}

		// Add ERC20 tokens
		const erc20Tokens = PREDEFINED_TOKENS[connectStore.currentChainId];
		if (erc20Tokens && erc20Tokens.length > 0) {
			tokens.push(...erc20Tokens);
		}

		return tokens;
	});

	// Check if token is selected
	function isTokenSelected(tokenId: string): boolean {
		return scannerState.selectedTokens.has(tokenId);
	}

	// Toggle token selection
	function toggleToken(token: NativeToken | ERC20Token) {
		if (isTokenSelected(token.id)) {
			scannerState.removeToken(token.id);
		} else {
			scannerState.addToken(token.id);
		}
	}

	// Select all tokens
	function selectAll() {
		const tokens = availableTokens();
		tokens.forEach((token) => scannerState.addToken(token.id));
	}

	// Clear all selections
	function clearAll() {
		scannerState.clearTokens();
	}

	const hasSelections = $derived(scannerState.selectedTokens.size > 0);
</script>

<div class="step-content">
	<StepContentHeader
		title="Select Tokens to Scan"
		description="Choose which tokens you want to check balances for"
	/>

	<div class="selection-controls">
		<button class="control-btn" onclick={selectAll}>Select All</button>
		<button class="control-btn" onclick={clearAll} disabled={!hasSelections}>Clear All</button>
		<div class="selection-count">
			{scannerState.selectedTokens.size} token{scannerState.selectedTokens.size === 1 ? '' : 's'} selected
		</div>
	</div>

	<div class="tokens-grid">
		{#each availableTokens() as token (token.id)}
			{@const selected = isTokenSelected(token.id)}
			<button class="token-card" class:selected onclick={() => toggleToken(token)}>
				<div class="token-header">
					<div class="token-info">
						<span class="token-symbol">{token.symbol}</span>
						<span class="token-name">{token.name}</span>
					</div>
					<div class="checkbox" class:checked={selected}>
						{#if selected}
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<path d="M5 12l5 5L20 7" stroke-width="3" stroke-linecap="round" />
							</svg>
						{/if}
					</div>
				</div>
				<div class="token-type">
					{token.type === 'native' ? 'Native Token' : 'ERC-20'}
				</div>
			</button>
		{/each}
	</div>

	{#if !hasSelections}
		<div class="empty-state">
			<p>👆 Select at least one token to continue</p>
		</div>
	{/if}
</div>

<style>
	.step-content {
		padding: var(--space-6);
	}

	/* Selection Controls */
	.selection-controls {
		display: flex;
		gap: var(--space-3);
		align-items: center;
		margin-top: var(--space-6);
		padding-bottom: var(--space-4);
		border-bottom: 1px solid var(--color-border);
	}

	.control-btn {
		padding: var(--space-2) var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.control-btn:hover:not(:disabled) {
		background: var(--color-panel-2);
		border-color: var(--color-primary);
	}

	.control-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.selection-count {
		margin-left: auto;
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .selection-count {
		color: var(--gray-400);
	}

	/* Tokens Grid */
	.tokens-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: var(--space-4);
		margin-top: var(--space-6);
	}

	.token-card {
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-lg);
		cursor: pointer;
		transition: all 0.2s ease;
		text-align: left;
	}

	.token-card:hover {
		border-color: var(--color-primary);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px hsla(0, 0%, 0%, 0.1);
	}

	.token-card.selected {
		border-color: var(--color-primary);
		background: hsla(210, 100%, 98%, 1);
	}

	:global([data-theme='dark']) .token-card.selected {
		background: hsla(210, 100%, 15%, 0.3);
	}

	.token-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: var(--space-3);
	}

	.token-info {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.token-symbol {
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .token-symbol {
		color: var(--gray-100);
	}

	.token-name {
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .token-name {
		color: var(--gray-400);
	}

	.token-type {
		margin-top: var(--space-2);
		font-size: var(--text-xs);
		color: var(--gray-500);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	/* Checkbox */
	.checkbox {
		width: 24px;
		height: 24px;
		border: 2px solid var(--color-border);
		border-radius: var(--radius-sm);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		transition: all 0.2s ease;
	}

	.checkbox.checked {
		background: var(--color-primary);
		border-color: var(--color-primary);
		color: white;
	}

	/* Empty State */
	.empty-state {
		margin-top: var(--space-8);
		padding: var(--space-6);
		text-align: center;
		background: var(--color-panel-1);
		border-radius: var(--radius-lg);
		border: 2px dashed var(--color-border);
	}

	.empty-state p {
		margin: 0;
		font-size: var(--text-base);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .empty-state p {
		color: var(--gray-400);
	}

	/* Responsive */
	@media (max-width: 640px) {
		.step-content {
			padding: var(--space-3);
		}

		.tokens-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
