<script lang="ts">
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import { step3State } from '@/features/token-deployer/stores/step3-state.svelte';
	import { step4State } from '@/features/token-deployer/stores/step4-state.svelte';
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import { CheckCircle2, XCircle, Loader2 } from '@lucide/svelte';
	import { encodeFunctionData, parseEther, type Address } from 'viem';
	import { KNOWN_CONTRACTS } from '$lib/utils/blockchain-checker';

	const connectStore = useConnectStore();

	// Real deployment function using TokenFactory
	async function handleDeploy() {
		if (step4State.deploymentStatus === 'deploying') return;

		step4State.deploymentStatus = 'preparing';

		try {
			// Validate wallet connection
			if (!connectStore.isConnected || !connectStore.address) {
				throw new Error('Please connect your wallet first');
			}

			// Fetch TokenFactory ABI
			const response = await fetch('/contracts/TokenFactory.json');
			const tokenFactoryData = await response.json();
			const abi = tokenFactoryData.abi;

			// Calculate initial supply with decimals
			// e.g., if user enters "1000000" and decimals is 18, we need 1000000 * 10^18
			const initialSupplyBigInt = BigInt(
				Math.floor(parseFloat(step3State.initialSupply)) * 10 ** step3State.decimals
			);

			// Encode function call to TokenFactory.createToken
			const data = encodeFunctionData({
				abi,
				functionName: 'createToken',
				args: [
					step3State.name, // string name
					step3State.symbol, // string symbol
					step3State.decimals, // uint8 decimals
					initialSupplyBigInt, // uint256 initialSupply
					step3State.mintable // bool mintable
				]
			});

			console.log('[TokenDeployer] Encoded transaction data:', {
				name: step3State.name,
				symbol: step3State.symbol,
				decimals: step3State.decimals,
				initialSupply: initialSupplyBigInt.toString(),
				mintable: step3State.mintable
			});

			step4State.deploymentStatus = 'deploying';

			// Send transaction
			const hash = await connectStore.sendTransaction({
				to: KNOWN_CONTRACTS.TOKEN_FACTORY,
				value: BigInt(0),
				data,
				gas: BigInt(5000000) // 5M gas should be enough for token creation
			});

			console.log('[TokenDeployer] Transaction sent! Hash:', hash);

			// Wait for transaction confirmation
			const receipt = await connectStore.waitForTransaction(hash);

			console.log('[TokenDeployer] Transaction confirmed:', receipt);

			// Parse event logs to get the created token address
			// TokenFactory emits TokenCreated(address indexed token, address indexed creator)
			const tokenCreatedEvent = receipt.logs.find(
				(log) =>
					log.address.toLowerCase() === KNOWN_CONTRACTS.TOKEN_FACTORY.toLowerCase() &&
					log.topics.length >= 2
			);

			const createdTokenAddress = tokenCreatedEvent
				? (`0x${tokenCreatedEvent.topics[1]?.slice(26)}` as Address)
				: undefined;

			console.log('[TokenDeployer] Created token address:', createdTokenAddress);

			// Calculate deployment cost (gas used * effective gas price)
			const gasUsed = receipt.gasUsed;
			const effectiveGasPrice = receipt.effectiveGasPrice || BigInt(0);
			const deploymentCostWei = gasUsed * effectiveGasPrice;
			const deploymentCostEth = (Number(deploymentCostWei) / 1e18).toFixed(6);

			// Success!
			step4State.deploymentResult = {
				success: true,
				contractAddress:
					createdTokenAddress || ('0x0000000000000000000000000000000000000000' as Address),
				transactionHash: hash,
				deploymentCost: deploymentCostEth,
				gasUsed,
				timestamp: Date.now()
			};
			step4State.deploymentStatus = 'completed';
		} catch (error) {
			console.error('[TokenDeployer] Deployment failed:', error);
			step4State.deploymentResult = {
				success: false,
				error: error instanceof Error ? error.message : 'Deployment failed'
			};
			step4State.deploymentStatus = 'error';
		}
	}

	const isDeploying = $derived(
		step4State.deploymentStatus === 'preparing' || step4State.deploymentStatus === 'deploying'
	);
	const isCompleted = $derived(step4State.deploymentStatus === 'completed');
	const hasError = $derived(step4State.deploymentStatus === 'error');

	// Get current network
	const currentNetwork = $derived.by(() => {
		if (!connectStore.currentChainId) return null;
		return connectStore.networks.find((n) => n.chainId === connectStore.currentChainId);
	});

	// Add token to wallet
	async function handleAddToWallet() {
		if (!step4State.deploymentResult?.success || !step4State.deploymentResult.contractAddress) {
			return;
		}

		try {
			// Get wallet client to access the provider
			const walletClient = await connectStore.getWalletClient();
			if (!walletClient?.transport) {
				throw new Error('Wallet client not available');
			}

			// Get provider from wallet client transport
			// This works for all wallet types (MetaMask, WalletConnect, TokenPocket, etc.)
			const provider = (walletClient.transport as { request?: unknown }).request
				? walletClient.transport
				: null;

			if (!provider || typeof provider.request !== 'function') {
				// Fallback to window.ethereum for browser extension wallets
				if (window.ethereum?.request) {
					await window.ethereum.request({
						method: 'wallet_watchAsset',
						params: {
							type: 'ERC20',
							options: {
								address: step4State.deploymentResult.contractAddress,
								symbol: step3State.symbol,
								decimals: step3State.decimals
							}
						}
					});
					console.log('[TokenDeployer] Token added to wallet successfully (via window.ethereum)');
					return;
				}
				throw new Error('No compatible wallet provider found');
			}

			// Use provider.request for universal wallet support
			const wasAdded = await provider.request({
				method: 'wallet_watchAsset',
				params: {
					type: 'ERC20',
					options: {
						address: step4State.deploymentResult.contractAddress,
						symbol: step3State.symbol,
						decimals: step3State.decimals
					}
				}
			});

			if (wasAdded) {
				console.log('[TokenDeployer] Token added to wallet successfully');
			}
		} catch (error) {
			console.error('[TokenDeployer] Failed to add token to wallet:', error);
			// Show user-friendly error message
			alert(
				error instanceof Error
					? error.message
					: 'Failed to add token to wallet. Please add it manually.'
			);
		}
	}
</script>

<div class="step-content">
	<StepContentHeader
		title="Review & Deploy Token"
		description="Final review before deploying your ERC20 token"
	/>

	{#if !isCompleted && !hasError}
		<!-- Configuration Review -->
		<div class="review-section">
			<h3 class="review-title">Token Configuration</h3>

			<div class="config-grid">
				<div class="config-item">
					<span class="config-label">Name</span>
					<span class="config-value">{step3State.name}</span>
				</div>

				<div class="config-item">
					<span class="config-label">Symbol</span>
					<span class="config-value">{step3State.symbol}</span>
				</div>

				<div class="config-item">
					<span class="config-label">Decimals</span>
					<span class="config-value">{step3State.decimals}</span>
				</div>

				<div class="config-item">
					<span class="config-label">Initial Supply</span>
					<span class="config-value"
						>{parseFloat(step3State.initialSupply).toLocaleString()} {step3State.symbol}</span
					>
				</div>

				<div class="config-item">
					<span class="config-label">Network</span>
					<span class="config-value">{currentNetwork?.name || 'Unknown'}</span>
				</div>

				<div class="config-item">
					<span class="config-label">Deployer</span>
					<span class="config-value mono">{connectStore.address || ''}</span>
				</div>
			</div>

			<!-- Advanced Features -->
			{#if step3State.mintable}
				<h3 class="review-title">Advanced Features</h3>
				<div class="features-list">
					<div class="feature-badge">✨ Mintable</div>
				</div>
			{/if}
		</div>

		<!-- Estimated Costs -->
		<div class="cost-section">
			<h3 class="cost-title">Estimated Deployment Cost</h3>
			<div class="cost-item">
				<span>Gas Cost:</span>
				<span class="cost-value">~0.05 ETH</span>
			</div>
			<p class="cost-hint">Actual cost may vary based on network congestion</p>
		</div>

		<!-- Deploy Button -->
		<div class="deploy-section">
			<button class="deploy-button" onclick={handleDeploy} disabled={isDeploying}>
				{#if isDeploying}
					<Loader2 size={24} class="spinning" />
					<span>
						{step4State.deploymentStatus === 'preparing' ? 'Preparing...' : 'Deploying...'}
					</span>
				{:else}
					<span>Deploy Token Contract</span>
				{/if}
			</button>
		</div>
	{:else if isCompleted && step4State.deploymentResult?.success}
		<!-- Success State -->
		<div class="result-container success">
			<CheckCircle2 size={64} class="result-icon" />
			<h2 class="result-title">Token Deployed Successfully! 🎉</h2>

			<div class="result-details">
				<div class="detail-item">
					<span class="detail-label">Contract Address:</span>
					<a
						href={`${currentNetwork?.blockExplorer}/address/${step4State.deploymentResult.contractAddress}`}
						target="_blank"
						rel="noopener noreferrer"
						class="detail-value mono link"
					>
						{step4State.deploymentResult.contractAddress}
					</a>
				</div>

				<div class="detail-item">
					<span class="detail-label">Transaction Hash:</span>
					<a
						href={`${currentNetwork?.blockExplorer}/tx/${step4State.deploymentResult.transactionHash}`}
						target="_blank"
						rel="noopener noreferrer"
						class="detail-value mono link"
					>
						{step4State.deploymentResult.transactionHash}
					</a>
				</div>

				<div class="detail-item">
					<span class="detail-label">Deployment Cost:</span>
					<span class="detail-value">{step4State.deploymentResult.deploymentCost} ETH</span>
				</div>
			</div>

			<div class="actions">
				<a
					href={`${currentNetwork?.blockExplorer}/address/${step4State.deploymentResult.contractAddress}`}
					target="_blank"
					rel="noopener noreferrer"
					class="action-button primary"
				>
					View on Explorer
				</a>
				<button class="action-button" onclick={handleAddToWallet}>Add to Wallet</button>
			</div>
		</div>
	{:else if hasError}
		<!-- Error State -->
		<div class="result-container error">
			<XCircle size={64} class="result-icon" />
			<h2 class="result-title">Deployment Failed</h2>
			<p class="error-message">{step4State.deploymentResult?.error || 'Unknown error'}</p>
			<button class="retry-button" onclick={handleDeploy}>Try Again</button>
		</div>
	{/if}
</div>

<style>
	.step-content {
		padding: var(--space-6);
	}

	/* Review Section */
	.review-section {
		margin-top: var(--space-6);
		padding: var(--space-6);
		background: var(--color-panel-1);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
	}

	.review-title {
		margin: 0 0 var(--space-4) 0;
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .review-title {
		color: var(--gray-100);
	}

	.config-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: var(--space-4);
		margin-bottom: var(--space-6);
	}

	.config-item {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.config-label {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .config-label {
		color: var(--gray-400);
	}

	.config-value {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .config-value {
		color: var(--gray-100);
	}

	.config-value.mono {
		font-family: monospace;
		font-size: var(--text-sm);
		word-break: break-all;
	}

	.features-list {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.feature-badge {
		padding: var(--space-2) var(--space-3);
		background: hsl(210, 100%, 95%);
		color: hsl(210, 100%, 40%);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
	}

	:global([data-theme='dark']) .feature-badge {
		background: hsl(210, 100%, 20%);
		color: hsl(210, 100%, 70%);
	}

	/* Cost Section */
	.cost-section {
		margin-top: var(--space-6);
		padding: var(--space-4);
		background: hsla(45, 100%, 96%, 1);
		border-radius: var(--radius-md);
		border: 1px solid hsla(45, 100%, 80%, 1);
	}

	:global([data-theme='dark']) .cost-section {
		background: hsla(45, 100%, 15%, 0.3);
		border-color: hsla(45, 100%, 25%, 1);
	}

	.cost-title {
		margin: 0 0 var(--space-3) 0;
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .cost-title {
		color: var(--gray-100);
	}

	.cost-item {
		display: flex;
		justify-content: space-between;
		font-size: var(--text-base);
		color: var(--gray-700);
		margin-bottom: var(--space-2);
	}

	:global([data-theme='dark']) .cost-item {
		color: var(--gray-300);
	}

	.cost-value {
		font-weight: var(--font-bold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .cost-value {
		color: var(--gray-100);
	}

	.cost-hint {
		margin: 0;
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .cost-hint {
		color: var(--gray-400);
	}

	/* Deploy Section */
	.deploy-section {
		margin-top: var(--space-8);
		display: flex;
		justify-content: center;
	}

	.deploy-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-3);
		min-width: 300px;
		padding: var(--space-4) var(--space-8);
		background: linear-gradient(135deg, hsl(120, 60%, 50%), hsl(120, 60%, 40%));
		color: white;
		border: none;
		border-radius: var(--radius-lg);
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 16px hsla(120, 60%, 50%, 0.3);
	}

	.deploy-button:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 8px 24px hsla(120, 60%, 50%, 0.4);
	}

	.deploy-button:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	:global(.spinning) {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* Result Container */
	.result-container {
		margin-top: var(--space-6);
		padding: var(--space-8);
		background: var(--color-panel-1);
		border-radius: var(--radius-lg);
		border: 2px solid var(--color-border);
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-4);
	}

	.result-container.success {
		border-color: hsl(120, 60%, 50%);
		background: hsla(120, 60%, 98%, 1);
	}

	:global([data-theme='dark']) .result-container.success {
		background: hsla(120, 60%, 10%, 0.2);
		border-color: hsl(120, 60%, 30%);
	}

	.result-container.error {
		border-color: hsl(0, 70%, 50%);
		background: hsla(0, 70%, 98%, 1);
	}

	:global([data-theme='dark']) .result-container.error {
		background: hsla(0, 70%, 10%, 0.2);
		border-color: hsl(0, 70%, 30%);
	}

	:global(.result-icon) {
		color: hsl(120, 60%, 50%);
	}

	.result-container.error :global(.result-icon) {
		color: hsl(0, 70%, 50%);
	}

	.result-title {
		margin: 0;
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .result-title {
		color: var(--gray-100);
	}

	.result-details {
		width: 100%;
		max-width: 600px;
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		text-align: left;
	}

	.detail-item {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.detail-label {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .detail-label {
		color: var(--gray-400);
	}

	.detail-value {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .detail-value {
		color: var(--gray-100);
	}

	.detail-value.mono {
		font-family: monospace;
		font-size: var(--text-sm);
		word-break: break-all;
	}

	.detail-value.link {
		color: hsl(210, 100%, 50%);
		text-decoration: none;
	}

	.detail-value.link:hover {
		text-decoration: underline;
	}

	.error-message {
		color: hsl(0, 70%, 50%);
		font-size: var(--text-base);
	}

	.actions {
		display: flex;
		gap: var(--space-3);
		margin-top: var(--space-4);
	}

	.action-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-3) var(--space-6);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.2s ease;
		background: var(--color-panel-1);
		color: var(--gray-900);
		text-decoration: none;
	}

	:global([data-theme='dark']) .action-button {
		color: var(--gray-100);
	}

	.action-button.primary {
		background: hsl(210, 100%, 50%);
		border-color: hsl(210, 100%, 50%);
		color: white;
	}

	.action-button.primary:hover {
		background: hsl(210, 100%, 45%);
	}

	.action-button:hover {
		transform: translateY(-1px);
	}

	.retry-button {
		padding: var(--space-3) var(--space-6);
		background: hsl(0, 70%, 50%);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.retry-button:hover {
		opacity: 0.9;
	}

	@media (max-width: 640px) {
		.step-content {
			padding: var(--space-3);
		}

		.config-grid {
			grid-template-columns: 1fr;
		}

		.actions {
			flex-direction: column;
			width: 100%;
		}
	}
</style>
