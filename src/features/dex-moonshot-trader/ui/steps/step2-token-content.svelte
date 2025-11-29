<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte.js';
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import { appState } from '../../stores/app-state.svelte';
	import type { Address } from 'viem';
	import { isAddress, createPublicClient, http, formatEther } from 'viem';
	import type { TokenInfo } from '../../types/token';
	import type { MoonshotTokenInfo } from '../../types/moonshot';
	import { MoonshotService } from '../../services/moonshot-service';
	import { MOONSHOT_TOKEN_ABI } from '../../contracts/moonshot-abi';

	const connectStore = useConnectStore();
	const stepManager = useStepManager();

	// Local state
	let tokenAddressInput = $state('');
	let isValidating = $state(false);
	let validationError = $state<string | null>(null);
	let tokenInfo = $state<TokenInfo | null>(null);
	let moonshotInfo = $state<MoonshotTokenInfo | null>(null);

	// Get current network
	const currentNetwork = $derived(
		connectStore.currentChainId
			? connectStore.networks.find((n) => n.chainId === connectStore.currentChainId)
			: undefined
	);

	// Derived state
	const isValidAddress = $derived(isAddress(tokenAddressInput));
	const canValidate = $derived(isValidAddress && !isValidating);
	const isReadyToContinue = $derived(Boolean(tokenInfo && appState.tokenAddress));

	// Validate token address and fetch token info
	async function validateToken() {
		if (!canValidate || !currentNetwork || !connectStore.address) {
			return;
		}

		isValidating = true;
		validationError = null;
		tokenInfo = null;
		moonshotInfo = null;

		try {
			const tokenAddress = tokenAddressInput as Address;

			// Create public client for reading contract data
			const networkObj = currentNetwork as
				| { rpcEndpoints?: Array<{ url: string; isPrimary: boolean }> }
				| undefined;
			const rpcUrl =
				networkObj?.rpcEndpoints?.find((endpoint) => endpoint.isPrimary)?.url ||
				networkObj?.rpcEndpoints?.[0]?.url;

			if (!rpcUrl) {
				throw new Error('RPC URL not available for current network');
			}

			const publicClient = createPublicClient({
				transport: http(rpcUrl)
			});

			// First, get the factory address from the token contract
			const factoryAddress = (await publicClient.readContract({
				address: tokenAddress,
				abi: MOONSHOT_TOKEN_ABI,
				functionName: 'factory'
			})) as Address;

			if (!factoryAddress || factoryAddress === '0x0000000000000000000000000000000000000000') {
				throw new Error('This token is not a valid Moonshot token');
			}

			// Create wallet client if available (optional for read-only operations)
			const walletClient = null;

			// Create Moonshot service
			const moonshotService = new MoonshotService(publicClient, walletClient, factoryAddress);

			// Get Moonshot token info
			const msInfo = await moonshotService.getTokenInfo(tokenAddress);

			// Get user's token balance
			const balance = await moonshotService.getTokenBalance(
				tokenAddress,
				connectStore.address as Address
			);

			// Create basic token info object
			const info: TokenInfo = {
				address: tokenAddress,
				name: msInfo.name,
				symbol: msInfo.symbol,
				decimals: msInfo.decimals,
				balance: balance,
				totalSupply: msInfo.totalSupply
			};

			tokenInfo = info;
			moonshotInfo = msInfo;
			appState.tokenAddress = tokenAddress;
			appState.tokenInfo = info;
			appState.moonshotTokenInfo = msInfo;
			appState.factoryAddress = factoryAddress;

			validationError = null;
		} catch (error) {
			console.error('Token validation error:', error);
			validationError =
				error instanceof Error ? error.message : 'Failed to validate token contract';
			tokenInfo = null;
			moonshotInfo = null;
			appState.tokenAddress = null;
			appState.tokenInfo = null;
			appState.moonshotTokenInfo = null;
		} finally {
			isValidating = false;
		}
	}

	// Handle continue to next step
	function handleContinue() {
		if (isReadyToContinue) {
			stepManager.next();
		}
	}

	// Format balance for display
	function formatBalance(balance: bigint, decimals: number): string {
		const divisor = BigInt(10 ** decimals);
		const whole = balance / divisor;
		const fraction = balance % divisor;
		const fractionStr = fraction.toString().padStart(decimals, '0').slice(0, 6);
		return `${whole}.${fractionStr}`;
	}
</script>

<div class="step-content">
	<StepContentHeader
		title="Enter Token Address"
		description="Input the token contract address you want to trade"
	/>

	<div class="token-input-section">
		<div class="input-group">
			<label for="token-address" class="input-label">Token Contract Address</label>
			<input
				id="token-address"
				type="text"
				class="token-input"
				class:has-error={validationError}
				placeholder="0x..."
				bind:value={tokenAddressInput}
				disabled={isValidating}
			/>
			{#if validationError}
				<p class="error-message">{validationError}</p>
			{/if}
		</div>

		<button
			class="validate-button"
			disabled={!canValidate}
			onclick={validateToken}
			class:loading={isValidating}
		>
			{#if isValidating}
				<span class="spinner"></span>
				<span>Validating...</span>
			{:else}
				<span>Validate Token</span>
			{/if}
		</button>
	</div>

	{#if tokenInfo}
		<div class="token-info-card">
			<h3 class="info-title">Token Information</h3>
			<div class="info-grid">
				<div class="info-item">
					<span class="info-label">Name</span>
					<span class="info-value">{tokenInfo.name}</span>
				</div>
				<div class="info-item">
					<span class="info-label">Symbol</span>
					<span class="info-value">{tokenInfo.symbol}</span>
				</div>
				<div class="info-item">
					<span class="info-label">Decimals</span>
					<span class="info-value">{tokenInfo.decimals}</span>
				</div>
				<div class="info-item">
					<span class="info-label">Your Balance</span>
					<span class="info-value"
						>{formatBalance(tokenInfo.balance, tokenInfo.decimals)}
						{tokenInfo.symbol}</span
					>
				</div>
				{#if moonshotInfo}
					<div class="info-item">
						<span class="info-label">Market Cap</span>
						<span class="info-value"
							>{parseFloat(formatEther(moonshotInfo.marketCap)).toFixed(4)} ETH</span
						>
					</div>
					<div class="info-item">
						<span class="info-label">Curve Progress</span>
						<span class="info-value"
							>{(Number(moonshotInfo.curveProgressBps) / 100).toFixed(2)}%</span
						>
					</div>
					<div class="info-item">
						<span class="info-label">Trading Status</span>
						<span class="info-value" class:error={moonshotInfo.tradingStopped}>
							{moonshotInfo.tradingStopped ? 'Stopped' : 'Active'}
						</span>
					</div>
				{/if}
				<div class="info-item full-width">
					<span class="info-label">Contract Address</span>
					<span class="info-value address">{tokenInfo.address}</span>
				</div>
			</div>
		</div>

		<div class="continue-section">
			<button class="continue-button" onclick={handleContinue}>
				<span>Continue to Trading</span>
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M5 12h14M12 5l7 7-7 7" />
				</svg>
			</button>
			<p class="continue-hint">Token validated successfully. Ready to trade!</p>
		</div>
	{/if}
</div>

<style>
	.step-content {
		padding: var(--space-6);
	}

	/* Token Input Section */
	.token-input-section {
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

	.input-label {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .input-label {
		color: var(--gray-300);
	}

	.token-input {
		width: 100%;
		padding: var(--space-3) var(--space-4);
		font-size: var(--text-base);
		font-family: 'Courier New', monospace;
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-panel-1);
		color: var(--gray-900);
		transition: all 0.2s ease;
	}

	:global([data-theme='dark']) .token-input {
		color: var(--gray-100);
	}

	.token-input:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px hsla(210, 100%, 50%, 0.1);
	}

	.token-input.has-error {
		border-color: hsl(0, 70%, 50%);
	}

	.token-input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.error-message {
		font-size: var(--text-sm);
		color: hsl(0, 70%, 50%);
		margin: 0;
	}

	/* Validate Button */
	.validate-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-6);
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.validate-button:hover:not(:disabled) {
		background: hsl(210, 100%, 45%);
		transform: translateY(-1px);
	}

	.validate-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none;
	}

	.validate-button.loading {
		cursor: wait;
	}

	.spinner {
		width: 16px;
		height: 16px;
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

	/* Token Info Card */
	.token-info-card {
		margin-top: var(--space-6);
		padding: var(--space-6);
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-lg);
	}

	.info-title {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
		margin: 0 0 var(--space-4) 0;
	}

	:global([data-theme='dark']) .info-title {
		color: var(--gray-100);
	}

	.info-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-4);
	}

	.info-item {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.info-item.full-width {
		grid-column: 1 / -1;
	}

	.info-label {
		font-size: var(--text-sm);
		color: var(--gray-600);
		font-weight: var(--font-medium);
	}

	:global([data-theme='dark']) .info-label {
		color: var(--gray-400);
	}

	.info-value {
		font-size: var(--text-base);
		color: var(--gray-900);
		font-weight: var(--font-semibold);
	}

	:global([data-theme='dark']) .info-value {
		color: var(--gray-100);
	}

	.info-value.address {
		font-family: 'Courier New', monospace;
		font-size: var(--text-sm);
		word-break: break-all;
	}

	.info-value.error {
		color: hsl(0, 70%, 50%);
	}

	/* Continue Section */
	.continue-section {
		margin-top: var(--space-8);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-3);
	}

	.continue-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-3);
		width: 100%;
		max-width: 400px;
		min-height: 56px;
		padding: var(--space-4) var(--space-6);
		background: linear-gradient(135deg, hsl(120, 60%, 45%), hsl(120, 60%, 35%));
		color: white;
		border: none;
		border-radius: var(--radius-lg);
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 12px hsla(120, 60%, 45%, 0.3);
	}

	.continue-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 24px hsla(120, 60%, 45%, 0.4);
	}

	.continue-button:active {
		transform: translateY(0);
	}

	.continue-hint {
		font-size: var(--text-sm);
		color: var(--gray-600);
		text-align: center;
		margin: 0;
	}

	:global([data-theme='dark']) .continue-hint {
		color: var(--gray-400);
	}

	/* Responsive */
	@media (max-width: 640px) {
		.step-content {
			padding: var(--space-3);
		}

		.info-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
