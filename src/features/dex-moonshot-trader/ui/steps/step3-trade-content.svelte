<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte.js';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import { appState } from '../../stores/app-state.svelte';
	import type { TradeType } from '../../types/trade';
	import { formatUnits } from 'viem';

	const connectStore = useConnectStore();

	// Local state
	let activeTab = $state<TradeType>('buy');
	let amount = $state('');
	let slippage = $state(0.5);
	let isTrading = $state(false);
	let tradeError = $state<string | null>(null);
	let tradeSuccess = $state(false);
	let txHash = $state<string | null>(null);

	// Get network native token symbol
	const nativeTokenSymbol = $derived(() => {
		const chainId = connectStore.currentChainId;
		if (chainId === 1 || chainId === 11155111) return 'ETH';
		if (chainId === 56 || chainId === 97) return 'BNB';
		if (chainId === 137 || chainId === 80001) return 'MATIC';
		if (chainId === 8453) return 'ETH';
		if (chainId === 42161) return 'ETH';
		if (chainId === 10) return 'ETH';
		return 'ETH';
	});

	// Get native token balance (demo - would fetch from wallet in production)
	const nativeBalance = $derived(() => {
		// For demo purposes, return a placeholder balance
		// In production, fetch from public client using connectStore.address
		return '0.0';
	});

	// Get token balance
	const tokenBalance = $derived(() => {
		if (appState.tokenInfo) {
			return formatUnits(appState.tokenInfo.balance, appState.tokenInfo.decimals);
		}
		return '0';
	});

	// Validation
	const isValidAmount = $derived(() => {
		if (!amount || amount === '0') return false;
		try {
			const value = parseFloat(amount);
			if (isNaN(value) || value <= 0) return false;

			if (activeTab === 'buy') {
				// Check native token balance
				return value <= parseFloat(nativeBalance());
			} else {
				// Check token balance
				return value <= parseFloat(tokenBalance());
			}
		} catch {
			return false;
		}
	});

	const canTrade = $derived(isValidAmount() && !isTrading);

	// Switch tab
	function switchTab(tab: TradeType) {
		activeTab = tab;
		amount = '';
		tradeError = null;
		tradeSuccess = false;
		txHash = null;
	}

	// Execute trade (simplified - in production would interact with DEX router)
	async function executeTrade() {
		if (!canTrade || !appState.tokenInfo) {
			return;
		}

		isTrading = true;
		tradeError = null;
		tradeSuccess = false;
		txHash = null;

		try {
			// In a real implementation, this would:
			// 1. Get quote from DEX router (Uniswap, PancakeSwap, etc.)
			// 2. Build transaction with proper slippage protection
			// 3. Execute swap transaction
			// 4. Wait for confirmation

			// For now, we'll show a placeholder message
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Simulate success
			tradeSuccess = true;
			txHash = '0x' + Array.from({ length: 64 }, () => '0').join('');

			// Reset form after delay
			setTimeout(() => {
				amount = '';
				tradeSuccess = false;
				txHash = null;
			}, 5000);
		} catch (error) {
			console.error('Trade execution error:', error);
			tradeError = error instanceof Error ? error.message : 'Failed to execute trade';
		} finally {
			isTrading = false;
		}
	}

	// Set max amount
	function setMaxAmount() {
		if (activeTab === 'buy') {
			// Leave some for gas
			const maxBuy = Math.max(0, parseFloat(nativeBalance()) - 0.01);
			amount = maxBuy.toString();
		} else {
			amount = tokenBalance();
		}
	}
</script>

<div class="step-content">
	<StepContentHeader
		title="Trade Token"
		description="Buy or sell {appState.tokenInfo?.symbol ?? 'tokens'}"
	/>

	<!-- Tab Switcher -->
	<div class="tab-container">
		<button class="tab-button" class:active={activeTab === 'buy'} onclick={() => switchTab('buy')}>
			Buy
		</button>
		<button
			class="tab-button"
			class:active={activeTab === 'sell'}
			onclick={() => switchTab('sell')}
		>
			Sell
		</button>
	</div>

	<!-- Trade Form -->
	<div class="trade-form">
		<!-- Amount Input -->
		<div class="input-group">
			<div class="input-header">
				<label for="amount" class="input-label">
					{activeTab === 'buy' ? 'Amount to Spend' : 'Amount to Sell'}
				</label>
				<span class="balance-label">
					Balance: {activeTab === 'buy' ? nativeBalance() : tokenBalance()}
					{activeTab === 'buy' ? nativeTokenSymbol() : appState.tokenInfo?.symbol}
				</span>
			</div>
			<div class="input-wrapper">
				<input
					id="amount"
					type="number"
					step="any"
					min="0"
					class="amount-input"
					placeholder="0.0"
					bind:value={amount}
					disabled={isTrading}
				/>
				<span class="input-suffix">
					{activeTab === 'buy' ? nativeTokenSymbol() : appState.tokenInfo?.symbol}
				</span>
				<button class="max-button" onclick={setMaxAmount} disabled={isTrading}>MAX</button>
			</div>
		</div>

		<!-- Slippage Setting -->
		<div class="input-group">
			<label for="slippage" class="input-label">Slippage Tolerance (%)</label>
			<div class="slippage-options">
				<button
					class="slippage-preset"
					class:active={slippage === 0.5}
					onclick={() => (slippage = 0.5)}
					disabled={isTrading}
				>
					0.5%
				</button>
				<button
					class="slippage-preset"
					class:active={slippage === 1}
					onclick={() => (slippage = 1)}
					disabled={isTrading}
				>
					1%
				</button>
				<button
					class="slippage-preset"
					class:active={slippage === 3}
					onclick={() => (slippage = 3)}
					disabled={isTrading}
				>
					3%
				</button>
				<input
					id="slippage"
					type="number"
					step="0.1"
					min="0.1"
					max="50"
					class="slippage-input"
					bind:value={slippage}
					disabled={isTrading}
				/>
			</div>
		</div>

		<!-- Trade Info -->
		{#if amount && isValidAmount()}
			<div class="trade-info">
				<div class="info-row">
					<span class="info-label">You {activeTab === 'buy' ? 'pay' : 'receive'}</span>
					<span class="info-value"
						>{amount}
						{activeTab === 'buy' ? nativeTokenSymbol() : appState.tokenInfo?.symbol}</span
					>
				</div>
				<div class="info-row">
					<span class="info-label">You {activeTab === 'buy' ? 'receive' : 'pay'} (estimated)</span>
					<span class="info-value">
						~ {(parseFloat(amount) * 1000).toFixed(4)}
						{activeTab === 'buy' ? appState.tokenInfo?.symbol : nativeTokenSymbol()}
					</span>
				</div>
				<div class="info-row">
					<span class="info-label">Slippage</span>
					<span class="info-value">{slippage}%</span>
				</div>
			</div>
		{/if}

		<!-- Error Message -->
		{#if tradeError}
			<div class="error-banner">
				<span class="error-icon">⚠️</span>
				<span>{tradeError}</span>
			</div>
		{/if}

		<!-- Success Message -->
		{#if tradeSuccess && txHash}
			<div class="success-banner">
				<span class="success-icon">✅</span>
				<div>
					<p>Trade executed successfully!</p>
					<p class="tx-hash">Transaction: {txHash.slice(0, 10)}...{txHash.slice(-8)}</p>
				</div>
			</div>
		{/if}

		<!-- Trade Button -->
		<button
			class="trade-button"
			class:buy={activeTab === 'buy'}
			class:sell={activeTab === 'sell'}
			disabled={!canTrade}
			onclick={executeTrade}
		>
			{#if isTrading}
				<span class="spinner"></span>
				<span>Processing...</span>
			{:else}
				<span>{activeTab === 'buy' ? 'Buy' : 'Sell'} {appState.tokenInfo?.symbol}</span>
			{/if}
		</button>

		<!-- Disclaimer -->
		<div class="disclaimer">
			<p>
				⚠️ <strong>Important:</strong> This is a demo interface. In production, this would integrate
				with DEX routers (Uniswap, PancakeSwap, etc.) to execute real trades. Always verify contract
				addresses and understand the risks before trading.
			</p>
		</div>
	</div>
</div>

<style>
	.step-content {
		padding: var(--space-6);
	}

	/* Tab Container */
	.tab-container {
		display: flex;
		gap: var(--space-2);
		margin-top: var(--space-6);
		padding: var(--space-1);
		background: var(--color-panel-1);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
	}

	.tab-button {
		flex: 1;
		padding: var(--space-3) var(--space-4);
		background: transparent;
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-600);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.tab-button.active {
		background: white;
		color: var(--gray-900);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	:global([data-theme='dark']) .tab-button.active {
		background: var(--gray-800);
		color: white;
	}

	.tab-button:hover:not(.active) {
		color: var(--gray-800);
	}

	/* Trade Form */
	.trade-form {
		margin-top: var(--space-6);
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.input-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.input-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.input-label {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .input-label {
		color: var(--gray-300);
	}

	.balance-label {
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .balance-label {
		color: var(--gray-400);
	}

	.input-wrapper {
		position: relative;
		display: flex;
		align-items: center;
	}

	.amount-input {
		width: 100%;
		padding: var(--space-4);
		padding-right: 120px;
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-lg);
		background: var(--color-panel-1);
		color: var(--gray-900);
		transition: all 0.2s ease;
	}

	:global([data-theme='dark']) .amount-input {
		color: var(--gray-100);
	}

	.amount-input:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px hsla(210, 100%, 50%, 0.1);
	}

	.amount-input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.input-suffix {
		position: absolute;
		right: 80px;
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .input-suffix {
		color: var(--gray-400);
	}

	.max-button {
		position: absolute;
		right: var(--space-2);
		padding: var(--space-2) var(--space-3);
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.max-button:hover:not(:disabled) {
		background: hsl(210, 100%, 45%);
	}

	.max-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Slippage Options */
	.slippage-options {
		display: flex;
		gap: var(--space-2);
	}

	.slippage-preset {
		flex: 1;
		padding: var(--space-2) var(--space-3);
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-700);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	:global([data-theme='dark']) .slippage-preset {
		color: var(--gray-300);
	}

	.slippage-preset.active {
		border-color: var(--color-primary);
		background: hsla(210, 100%, 50%, 0.1);
		color: var(--color-primary);
	}

	.slippage-preset:hover:not(:disabled):not(.active) {
		border-color: var(--gray-400);
	}

	.slippage-preset:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.slippage-input {
		width: 100px;
		padding: var(--space-2) var(--space-3);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-panel-1);
		color: var(--gray-900);
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		text-align: center;
	}

	:global([data-theme='dark']) .slippage-input {
		color: var(--gray-100);
	}

	.slippage-input:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	/* Trade Info */
	.trade-info {
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.info-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.info-label {
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .info-label {
		color: var(--gray-400);
	}

	.info-value {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .info-value {
		color: var(--gray-100);
	}

	/* Banners */
	.error-banner {
		padding: var(--space-3);
		background: hsla(0, 70%, 95%, 1);
		border: 1px solid hsla(0, 70%, 80%, 1);
		border-radius: var(--radius-md);
		display: flex;
		align-items: center;
		gap: var(--space-2);
		color: hsl(0, 70%, 40%);
		font-size: var(--text-sm);
	}

	:global([data-theme='dark']) .error-banner {
		background: hsla(0, 70%, 15%, 0.3);
		border-color: hsla(0, 70%, 25%, 1);
		color: hsl(0, 70%, 60%);
	}

	.success-banner {
		padding: var(--space-3);
		background: hsla(120, 60%, 95%, 1);
		border: 1px solid hsla(120, 60%, 80%, 1);
		border-radius: var(--radius-md);
		display: flex;
		align-items: center;
		gap: var(--space-2);
		color: hsl(120, 60%, 30%);
		font-size: var(--text-sm);
	}

	:global([data-theme='dark']) .success-banner {
		background: hsla(120, 60%, 15%, 0.3);
		border-color: hsla(120, 60%, 25%, 1);
		color: hsl(120, 60%, 50%);
	}

	.success-banner p {
		margin: 0;
	}

	.tx-hash {
		font-family: 'Courier New', monospace;
		font-size: var(--text-xs);
		opacity: 0.8;
	}

	/* Trade Button */
	.trade-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		width: 100%;
		min-height: 56px;
		padding: var(--space-4) var(--space-6);
		border: none;
		border-radius: var(--radius-lg);
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.3s ease;
		color: white;
	}

	.trade-button.buy {
		background: linear-gradient(135deg, hsl(120, 60%, 45%), hsl(120, 60%, 35%));
		box-shadow: 0 4px 12px hsla(120, 60%, 45%, 0.3);
	}

	.trade-button.buy:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 8px 24px hsla(120, 60%, 45%, 0.4);
	}

	.trade-button.sell {
		background: linear-gradient(135deg, hsl(0, 70%, 50%), hsl(0, 70%, 40%));
		box-shadow: 0 4px 12px hsla(0, 70%, 50%, 0.3);
	}

	.trade-button.sell:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 8px 24px hsla(0, 70%, 50%, 0.4);
	}

	.trade-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none;
	}

	.trade-button:active:not(:disabled) {
		transform: translateY(0);
	}

	.spinner {
		width: 20px;
		height: 20px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* Disclaimer */
	.disclaimer {
		padding: var(--space-3);
		background: hsla(40, 100%, 95%, 1);
		border: 1px solid hsla(40, 100%, 80%, 1);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .disclaimer {
		background: hsla(40, 100%, 15%, 0.3);
		border-color: hsla(40, 100%, 25%, 1);
		color: var(--gray-300);
	}

	.disclaimer p {
		margin: 0;
		line-height: 1.5;
	}

	/* Responsive */
	@media (max-width: 640px) {
		.step-content {
			padding: var(--space-3);
		}

		.slippage-options {
			flex-wrap: wrap;
		}

		.slippage-input {
			width: 100%;
		}
	}
</style>
