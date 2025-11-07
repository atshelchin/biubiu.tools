<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import { step3State } from '@/features/token-distribution/stores/step3-state.svelte';
	import { PREDEFINED_TOKENS } from '$lib/config/tokens';
	import type { NativeToken, ERC20Token } from '$lib/types/token';

	const connectStore = useConnectStore();

	// Get available tokens for current network
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

	// Handle token selection
	function selectToken(token: NativeToken | ERC20Token) {
		step3State.selectedToken = token;
	}

	// Handle amount mode change
	function setAmountMode(mode: 'equal' | 'custom') {
		step3State.amountMode = mode;
		if (mode === 'custom') {
			step3State.amountPerRecipient = '';
			step3State.totalAmount = '';
		}
	}
</script>

<div class="step-content">
	<StepContentHeader
		title="Select Token and Configure Amount"
		description="Choose the token to distribute and set distribution amounts"
	/>

	<!-- Token Selection -->
	<div class="section">
		<h3 class="section-title">Select Token</h3>
		<div class="token-grid">
			{#each availableTokens() as token (token.id)}
				<button
					class="token-card"
					class:selected={step3State.selectedToken?.id === token.id}
					onclick={() => selectToken(token)}
				>
					<div class="token-info">
						<div class="token-symbol">{token.symbol}</div>
						<div class="token-name">{token.name}</div>
					</div>
					{#if step3State.selectedToken?.id === token.id}
						<div class="check-icon">✓</div>
					{/if}
				</button>
			{/each}
		</div>
	</div>

	<!-- Distribution Mode -->
	{#if step3State.selectedToken}
		<div class="section">
			<h3 class="section-title">Distribution Mode</h3>
			<div class="mode-selector">
				<button
					class="mode-button"
					class:active={step3State.amountMode === 'equal'}
					onclick={() => setAmountMode('equal')}
				>
					<div class="mode-icon">⚖️</div>
					<div class="mode-label">Equal Distribution</div>
					<div class="mode-desc">Same amount to all recipients</div>
				</button>
				<button
					class="mode-button"
					class:active={step3State.amountMode === 'custom'}
					onclick={() => setAmountMode('custom')}
				>
					<div class="mode-icon">✏️</div>
					<div class="mode-label">Custom Amounts</div>
					<div class="mode-desc">Set individual amounts per recipient</div>
				</button>
			</div>
		</div>

		<!-- Amount Input (for equal mode) -->
		{#if step3State.amountMode === 'equal'}
			<div class="section">
				<h3 class="section-title">Amount Per Recipient</h3>
				<div class="amount-input-group">
					<input
						type="number"
						class="amount-input"
						placeholder="0.0"
						bind:value={step3State.amountPerRecipient}
						step="0.000001"
						min="0"
					/>
					<div class="token-suffix">{step3State.selectedToken.symbol}</div>
				</div>
				<p class="input-hint">
					This amount will be sent to each recipient. Total will be calculated based on number of
					recipients.
				</p>
			</div>
		{:else}
			<div class="section">
				<div class="info-message">
					<p>
						You've selected custom amounts mode. You'll be able to set individual amounts for each
						recipient in Step 4.
					</p>
				</div>
			</div>
		{/if}
	{/if}
</div>

<style>
	.step-content {
		padding: var(--space-6);
	}

	.section {
		margin-bottom: var(--space-8);
	}

	.section-title {
		margin: 0 0 var(--space-4) 0;
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .section-title {
		color: var(--gray-100);
	}

	/* Token Grid */
	.token-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: var(--space-3);
	}

	.token-card {
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		justify-content: space-between;
		align-items: center;
		text-align: left;
	}

	.token-card:hover {
		border-color: var(--color-primary);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px hsla(0, 0%, 0%, 0.1);
	}

	.token-card.selected {
		border-color: hsl(210, 100%, 50%);
		background: hsla(210, 100%, 98%, 1);
	}

	:global([data-theme='dark']) .token-card.selected {
		background: hsla(210, 100%, 10%, 0.3);
		border-color: hsl(210, 100%, 50%);
	}

	.token-info {
		flex: 1;
	}

	.token-symbol {
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		color: var(--gray-900);
		margin-bottom: var(--space-1);
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

	.check-icon {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: hsl(210, 100%, 50%);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		font-size: var(--text-sm);
	}

	/* Mode Selector */
	.mode-selector {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: var(--space-4);
	}

	.mode-button {
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all 0.2s ease;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2);
	}

	.mode-button:hover {
		border-color: var(--color-primary);
		transform: translateY(-2px);
	}

	.mode-button.active {
		border-color: hsl(210, 100%, 50%);
		background: hsla(210, 100%, 98%, 1);
	}

	:global([data-theme='dark']) .mode-button.active {
		background: hsla(210, 100%, 10%, 0.3);
	}

	.mode-icon {
		font-size: var(--text-3xl);
	}

	.mode-label {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .mode-label {
		color: var(--gray-100);
	}

	.mode-desc {
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .mode-desc {
		color: var(--gray-400);
	}

	/* Amount Input */
	.amount-input-group {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		max-width: 400px;
	}

	.amount-input {
		flex: 1;
		padding: var(--space-3) var(--space-4);
		font-size: var(--text-lg);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-panel-1);
		color: var(--gray-900);
		transition: border-color 0.2s ease;
	}

	:global([data-theme='dark']) .amount-input {
		color: var(--gray-100);
	}

	.amount-input:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.token-suffix {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .token-suffix {
		color: var(--gray-300);
	}

	.input-hint {
		margin-top: var(--space-2);
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .input-hint {
		color: var(--gray-400);
	}

	.info-message {
		padding: var(--space-4);
		background: hsla(210, 100%, 95%, 1);
		border: 1px solid hsla(210, 100%, 80%, 1);
		border-radius: var(--radius-md);
	}

	:global([data-theme='dark']) .info-message {
		background: hsla(210, 100%, 10%, 0.3);
		border-color: hsla(210, 100%, 30%, 1);
	}

	.info-message p {
		margin: 0;
		font-size: var(--text-sm);
		color: var(--gray-700);
		line-height: 1.5;
	}

	:global([data-theme='dark']) .info-message p {
		color: var(--gray-300);
	}

	@media (max-width: 640px) {
		.step-content {
			padding: var(--space-3);
		}

		.token-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
