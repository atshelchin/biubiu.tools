<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte.js';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import { appState } from '../../stores/app-state.svelte';
	import type { TradeType } from '../../types/trade';
	import { formatUnits, parseUnits, createPublicClient, http, type Address } from 'viem';
	import { MoonshotService, formatEthAmount, applySlippage } from '../../services/moonshot-service';
	import type { MoonshotQuote } from '../../types/moonshot';

	const connectStore = useConnectStore();

	// Local state
	let activeTab = $state<TradeType>('buy');
	let amount = $state('');
	let slippage = $state(1); // Default 1%
	let isTrading = $state(false);
	let tradeError = $state<string | null>(null);
	let tradeSuccess = $state(false);
	let txHash = $state<string | null>(null);
	let quote = $state<MoonshotQuote | null>(null);
	let isLoadingQuote = $state(false);

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

	// ETH balance
	let ethBalance = $state<bigint>(BigInt(0));

	// Get native token balance
	const nativeBalance = $derived(() => {
		return formatEthAmount(ethBalance);
	});

	// Get token balance
	const tokenBalance = $derived(() => {
		if (appState.tokenInfo) {
			return formatUnits(appState.tokenInfo.balance, appState.tokenInfo.decimals);
		}
		return '0';
	});

	// Load balances on mount and when active tab changes
	$effect(() => {
		loadBalances();
	});

	// Reload token balance when switching to sell tab
	$effect(() => {
		if (activeTab === 'sell' && appState.tokenAddress && connectStore.address) {
			reloadTokenBalance();
		}
	});

	async function loadBalances() {
		if (!connectStore.address || !connectStore.currentChainId) return;

		try {
			const currentNetwork = connectStore.networks.find(
				(n) => n.chainId === connectStore.currentChainId
			);
			if (!currentNetwork) return;

			const networkObj = currentNetwork as
				| { rpcEndpoints?: Array<{ url: string; isPrimary: boolean }> }
				| undefined;
			const rpcUrl =
				networkObj?.rpcEndpoints?.find((endpoint) => endpoint.isPrimary)?.url ||
				networkObj?.rpcEndpoints?.[0]?.url;
			if (!rpcUrl) return;

			const publicClient = createPublicClient({
				transport: http(rpcUrl)
			});

			ethBalance = await publicClient.getBalance({ address: connectStore.address as Address });
		} catch (error) {
			console.error('Failed to load balances:', error);
		}
	}

	async function reloadTokenBalance() {
		if (
			!connectStore.address ||
			!connectStore.currentChainId ||
			!appState.tokenAddress ||
			!appState.factoryAddress
		)
			return;

		try {
			const currentNetwork = connectStore.networks.find(
				(n) => n.chainId === connectStore.currentChainId
			);
			if (!currentNetwork) return;

			const networkObj = currentNetwork as
				| { rpcEndpoints?: Array<{ url: string; isPrimary: boolean }> }
				| undefined;
			const rpcUrl =
				networkObj?.rpcEndpoints?.find((endpoint) => endpoint.isPrimary)?.url ||
				networkObj?.rpcEndpoints?.[0]?.url;
			if (!rpcUrl) return;

			const publicClient = createPublicClient({
				transport: http(rpcUrl)
			});

			const moonshotService = new MoonshotService(
				publicClient,
				null,
				appState.factoryAddress as Address
			);

			const balance = await moonshotService.getTokenBalance(
				appState.tokenAddress as Address,
				connectStore.address as Address
			);

			// Update token info balance in app state
			if (appState.tokenInfo) {
				appState.tokenInfo = {
					...appState.tokenInfo,
					balance
				};
			}
		} catch (error) {
			console.error('Failed to reload token balance:', error);
		}
	}

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

	// Slippage warning
	const slippageWarning = $derived(() => {
		if (slippage < 1) {
			return 'Slippage too low may cause transaction failure';
		}
		return null;
	});

	// Balance warning
	const balanceWarning = $derived(() => {
		if (!amount || amount === '0') return null;
		try {
			const value = parseFloat(amount);
			if (isNaN(value) || value <= 0) return null;

			if (activeTab === 'buy') {
				const balance = parseFloat(nativeBalance());
				if (value > balance) {
					return `Insufficient ${nativeTokenSymbol()} balance. You have ${nativeBalance()} ${nativeTokenSymbol()}`;
				}
			} else {
				const balance = parseFloat(tokenBalance());
				if (value > balance) {
					return `Insufficient ${appState.tokenInfo?.symbol} balance. You have ${tokenBalance()} ${appState.tokenInfo?.symbol}`;
				}
			}
		} catch {
			return null;
		}
		return null;
	});

	// Switch tab
	function switchTab(tab: TradeType) {
		activeTab = tab;
		amount = '';
		tradeError = null;
		tradeSuccess = false;
		txHash = null;
	}

	// Load quote when amount changes
	$effect(() => {
		if (amount && parseFloat(amount) > 0 && appState.tokenAddress) {
			loadQuote();
		} else {
			quote = null;
		}
	});

	async function loadQuote() {
		if (!appState.tokenAddress || !appState.factoryAddress || !connectStore.currentChainId) return;

		// Validate amount is a valid number string
		if (!amount || amount === '' || isNaN(parseFloat(amount))) {
			quote = null;
			return;
		}

		isLoadingQuote = true;
		try {
			const currentNetwork = connectStore.networks.find(
				(n) => n.chainId === connectStore.currentChainId
			);
			if (!currentNetwork) return;

			const networkObj = currentNetwork as
				| { rpcEndpoints?: Array<{ url: string; isPrimary: boolean }> }
				| undefined;
			const rpcUrl =
				networkObj?.rpcEndpoints?.find((endpoint) => endpoint.isPrimary)?.url ||
				networkObj?.rpcEndpoints?.[0]?.url;
			if (!rpcUrl) return;

			const publicClient = createPublicClient({
				transport: http(rpcUrl)
			});

			const moonshotService = new MoonshotService(
				publicClient,
				null,
				appState.factoryAddress as Address
			);

			if (activeTab === 'buy') {
				// Ensure amount is a string
				const amountStr = String(amount);
				quote = await moonshotService.getBuyQuoteExactIn(
					appState.tokenAddress as Address,
					amountStr
				);
			} else {
				const amountStr = String(amount);
				const tokenAmount = parseUnits(amountStr, appState.tokenInfo?.decimals ?? 18);
				quote = await moonshotService.getSellQuoteExactIn(
					appState.tokenAddress as Address,
					tokenAmount
				);
			}
		} catch (error) {
			console.error('Failed to load quote:', error);
			quote = null;
		} finally {
			isLoadingQuote = false;
		}
	}

	// Execute trade
	async function executeTrade() {
		if (!canTrade || !appState.tokenInfo || !appState.tokenAddress || !appState.factoryAddress) {
			return;
		}

		if (!connectStore.address || !connectStore.currentChainId) {
			tradeError = 'Wallet not connected';
			return;
		}

		isTrading = true;
		tradeError = null;
		tradeSuccess = false;
		txHash = null;

		try {
			console.log('=== Starting trade execution ===');
			console.log('Trade type:', activeTab);
			console.log('Amount:', amount);
			console.log('Slippage:', slippage);
			console.log('Token address:', appState.tokenAddress);
			console.log('Factory address:', appState.factoryAddress);

			const currentNetwork = connectStore.networks.find(
				(n) => n.chainId === connectStore.currentChainId
			);
			if (!currentNetwork) {
				throw new Error('Network not found');
			}

			const networkObj = currentNetwork as
				| { rpcEndpoints?: Array<{ url: string; isPrimary: boolean }> }
				| undefined;
			const rpcUrl = networkObj?.rpcEndpoints?.[0]?.url;
			if (!rpcUrl) {
				throw new Error('RPC URL not available');
			}

			const publicClient = createPublicClient({
				transport: http(rpcUrl)
			});

			// Get wallet client from connectStore
			const walletClient = await connectStore.getWalletClient();

			if (!walletClient) {
				throw new Error('Wallet not connected. Please connect your wallet first.');
			}

			const moonshotService = new MoonshotService(
				publicClient,
				walletClient,
				appState.factoryAddress as Address
			);

			let hash: string;

			if (activeTab === 'buy') {
				// Buy tokens with ETH
				const minTokensOut = quote ? applySlippage(quote.amountOut, slippage, true) : BigInt(0);

				hash = await moonshotService.buyExactIn(
					appState.tokenAddress as Address,
					String(amount),
					minTokensOut,
					connectStore.address as Address
				);
			} else {
				// Sell tokens for ETH
				const tokenAmount = parseUnits(String(amount), appState.tokenInfo.decimals);
				const minEthOutBigInt = quote ? applySlippage(quote.amountOut, slippage, true) : BigInt(0);

				hash = await moonshotService.sellExactIn(
					appState.tokenAddress as Address,
					tokenAmount,
					minEthOutBigInt,
					connectStore.address as Address
				);
			}

			// Wait for transaction confirmation
			const receipt = await publicClient.waitForTransactionReceipt({ hash: hash as `0x${string}` });

			if (receipt.status === 'success') {
				tradeSuccess = true;
				txHash = hash;

				// Reload balances
				await loadBalances();

				// Reset form after delay
				setTimeout(() => {
					amount = '';
					tradeSuccess = false;
					txHash = null;
					quote = null;
				}, 5000);
			} else {
				throw new Error('Transaction failed');
			}
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
					class:error={balanceWarning()}
					placeholder="0.0"
					bind:value={amount}
					disabled={isTrading}
				/>
				<span class="input-suffix">
					{activeTab === 'buy' ? nativeTokenSymbol() : appState.tokenInfo?.symbol}
				</span>
				<button class="max-button" onclick={setMaxAmount} disabled={isTrading}>MAX</button>
			</div>
			{#if balanceWarning()}
				<p class="balance-warning">⚠️ {balanceWarning()}</p>
			{/if}
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
			{#if slippageWarning()}
				<p class="slippage-warning">⚠️ {slippageWarning()}</p>
			{/if}
		</div>

		<!-- Trade Info -->
		{#if amount && isValidAmount()}
			<div class="trade-info">
				{#if isLoadingQuote}
					<div class="loading-quote">
						<span class="spinner small"></span>
						<span>Getting quote...</span>
					</div>
				{:else if quote}
					<div class="info-row">
						<span class="info-label">You {activeTab === 'buy' ? 'pay' : 'sell'}</span>
						<span class="info-value">
							{amount}
							{activeTab === 'buy' ? nativeTokenSymbol() : appState.tokenInfo?.symbol}
						</span>
					</div>
					<div class="info-row">
						<span class="info-label">You {activeTab === 'buy' ? 'receive' : 'get'} (estimated)</span
						>
						<span class="info-value">
							{activeTab === 'buy'
								? formatUnits(quote.amountOut, appState.tokenInfo?.decimals ?? 18)
								: formatEthAmount(quote.amountOut)}
							{activeTab === 'buy' ? appState.tokenInfo?.symbol : nativeTokenSymbol()}
						</span>
					</div>
					<div class="info-row">
						<span class="info-label">Fee</span>
						<span class="info-value">{formatEthAmount(quote.fee)} {nativeTokenSymbol()}</span>
					</div>
					<div class="info-row">
						<span class="info-label">Price Impact</span>
						<span class="info-value" class:warning={quote.priceImpact > 5}>
							{quote.priceImpact.toFixed(2)}%
						</span>
					</div>
					<div class="info-row">
						<span class="info-label">Slippage Tolerance</span>
						<span class="info-value">{slippage}%</span>
					</div>
					<div class="info-row">
						<span class="info-label">Minimum Received</span>
						<span class="info-value">
							{activeTab === 'buy'
								? formatUnits(
										applySlippage(quote.amountOut, slippage, true),
										appState.tokenInfo?.decimals ?? 18
									)
								: formatEthAmount(applySlippage(quote.amountOut, slippage, true))}
							{activeTab === 'buy' ? appState.tokenInfo?.symbol : nativeTokenSymbol()}
						</span>
					</div>
				{/if}
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
	</div>
</div>

<style>
	.loading-quote {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		justify-content: center;
		padding: var(--space-3);
		color: var(--gray-600);
	}

	.spinner.small {
		width: 16px;
		height: 16px;
	}

	.info-value.warning {
		color: hsl(40, 100%, 50%);
		font-weight: var(--font-bold);
	}

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

	.amount-input.error {
		border-color: hsl(0, 70%, 50%);
	}

	.balance-warning {
		font-size: var(--text-sm);
		color: hsl(0, 70%, 50%);
		margin: var(--space-2) 0 0 0;
		font-weight: var(--font-medium);
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

	.slippage-warning {
		font-size: var(--text-sm);
		color: hsl(40, 100%, 50%);
		margin: var(--space-1) 0 0 0;
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
