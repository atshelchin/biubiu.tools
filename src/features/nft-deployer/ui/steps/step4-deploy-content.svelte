<script lang="ts">
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import { step3NFTConfigState } from '../../stores/step3-nft-config-state.svelte';
	import { step4DeployState } from '../../stores/step4-deploy-state.svelte';
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import { CheckCircle2, XCircle, Loader2 } from '@lucide/svelte';
	import { encodeFunctionData, type Address } from 'viem';
	import { KNOWN_CONTRACTS } from '$lib/utils/blockchain-checker';
	import { getContractMethod } from '$lib/utils/contract-method';

	const connectStore = useConnectStore();

	// Real deployment function using NFTFactory
	async function handleDeploy() {
		if (step4DeployState.status === 'deploying') return;

		step4DeployState.setDeploying();

		try {
			// Validate wallet connection
			if (!connectStore.isConnected || !connectStore.address) {
				throw new Error('Please connect your wallet first');
			}

			// Get configuration
			const config = step3NFTConfigState.getConfig();

			// Fetch NFTFactory ABI
			const response = await fetch('/contracts/NFTFactory.json');
			const nftFactoryData = await response.json();
			const abi = nftFactoryData.abi;

			// Convert stakeAmount to BigInt
			const stakeAmountBigInt = BigInt(config.stakeAmount || '0');

			// Encode function call to NFTFactory.createERC721 (or createERC721Free in self-hosted mode)
			const data = encodeFunctionData({
				abi,
				functionName: getContractMethod('createERC721'),
				args: [
					config.name,
					config.symbol,
					config.baseURI,
					config.publicMintEnabled,
					config.stakeToMintEnabled,
					config.stakeToken || ('0x0000000000000000000000000000000000000000' as Address),
					stakeAmountBigInt
				]
			});

			console.log('[NFTDeployer] Encoded transaction data:', {
				name: config.name,
				symbol: config.symbol,
				baseURI: config.baseURI,
				publicMintEnabled: config.publicMintEnabled,
				stakeToMintEnabled: config.stakeToMintEnabled,
				stakeToken: config.stakeToken,
				stakeAmount: stakeAmountBigInt.toString()
			});

			// Send transaction
			const hash = await connectStore.sendTransaction({
				to: KNOWN_CONTRACTS.NFT_FACTORY,
				value: BigInt(0),
				data,
				gas: BigInt(10000000)
			});

			console.log('[NFTDeployer] Transaction sent! Hash:', hash);

			// Wait for transaction confirmation
			const receipt = await connectStore.waitForTransaction(hash);

			console.log('[NFTDeployer] Transaction confirmed:', receipt);
			console.log('[NFTDeployer] NFT_FACTORY address:', KNOWN_CONTRACTS.NFT_FACTORY);
			console.log('[NFTDeployer] All receipt logs:', receipt.logs);

			// Parse event logs to get the created NFT address
			const nftCreatedEvent = receipt.logs.find(
				(log) =>
					log.address.toLowerCase() === KNOWN_CONTRACTS.NFT_FACTORY.toLowerCase() &&
					log.topics.length >= 2
			);

			console.log('[NFTDeployer] NFT Created Event found:', nftCreatedEvent);

			if (nftCreatedEvent) {
				console.log('[NFTDeployer] Event topics:', nftCreatedEvent.topics);
				console.log('[NFTDeployer] Topics[1]:', nftCreatedEvent.topics[1]);
			}

			const createdNFTAddress = nftCreatedEvent
				? (`0x${nftCreatedEvent.topics[1]?.slice(26)}` as Address)
				: undefined;

			console.log('[NFTDeployer] Extracted NFT address:', createdNFTAddress);

			if (!createdNFTAddress) {
				throw new Error('Failed to get NFT address from transaction receipt');
			}

			// Calculate deployment cost
			const gasUsed = receipt.gasUsed;
			const effectiveGasPrice = receipt.effectiveGasPrice || BigInt(0);
			const deploymentCostWei = gasUsed * effectiveGasPrice;
			const deploymentCostEth = (Number(deploymentCostWei) / 1e18).toFixed(6);

			// Success!
			step4DeployState.setCompleted(createdNFTAddress, hash);
			step4DeployState.deploymentCost = deploymentCostEth;
		} catch (error) {
			console.error('[NFTDeployer] Deployment failed:', error);
			const errorMessage = error instanceof Error ? error.message : 'Deployment failed';
			step4DeployState.setError(errorMessage);
		}
	}

	const isDeploying = $derived(step4DeployState.status === 'deploying');
	const isCompleted = $derived(step4DeployState.status === 'completed');
	const hasError = $derived(step4DeployState.status === 'error');

	// Get current network
	const currentNetwork = $derived.by(() => {
		if (!connectStore.currentChainId) return null;
		return connectStore.networks.find((n) => n.chainId === connectStore.currentChainId);
	});

	// Get configuration for display
	const config = $derived(step3NFTConfigState.getConfig());
</script>

<div class="step-content">
	<StepContentHeader
		title="Review & Deploy NFT"
		description="Final review before deploying your NFT collection"
	/>

	{#if !isCompleted && !hasError}
		<!-- Configuration Review -->
		<div class="review-section">
			<h3 class="review-title">NFT Configuration</h3>

			<div class="config-grid">
				<div class="config-item">
					<span class="config-label">Name</span>
					<span class="config-value">{config.name}</span>
				</div>

				<div class="config-item">
					<span class="config-label">Symbol</span>
					<span class="config-value">{config.symbol}</span>
				</div>

				<div class="config-item">
					<span class="config-label">Minting Type</span>
					<span class="config-value">
						{config.publicMintEnabled ? 'Owner Mint' : 'Stake-to-Mint'}
					</span>
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

			<!-- Stake-to-Mint Settings -->
			{#if config.stakeToMintEnabled}
				<h3 class="review-title">Stake-to-Mint Settings</h3>
				<div class="config-grid">
					<div class="config-item">
						<span class="config-label">Stake Token</span>
						<span class="config-value mono">{config.stakeToken}</span>
					</div>

					<div class="config-item">
						<span class="config-label">Stake Amount</span>
						<span class="config-value">{config.stakeAmount} wei</span>
					</div>
				</div>
			{/if}
		</div>

		<!-- Estimated Costs -->
		<div class="cost-section">
			<h3 class="cost-title">Estimated Deployment Cost</h3>
			<div class="cost-item">
				<span>Gas Cost:</span>
				<span class="cost-value">~0.1 ETH</span>
			</div>
			<p class="cost-hint">Actual cost may vary based on network congestion</p>
		</div>

		<!-- Deploy Button -->
		<div class="deploy-section">
			<button class="deploy-button" onclick={handleDeploy} disabled={isDeploying}>
				{#if isDeploying}
					<Loader2 size={24} class="spinning" />
					<span>Deploying...</span>
				{:else}
					<span>Deploy NFT Contract</span>
				{/if}
			</button>
		</div>
	{:else if isCompleted && step4DeployState.nftAddress}
		<!-- Success State -->
		<div class="result-container success">
			<CheckCircle2 size={64} class="result-icon" />
			<h2 class="result-title">NFT Deployed Successfully! 🎉</h2>

			<div class="result-details">
				<div class="detail-item">
					<span class="detail-label">Contract Address:</span>
					<a
						href="{currentNetwork?.blockExplorer}/address/{step4DeployState.nftAddress}"
						target="_blank"
						rel="noopener noreferrer"
						class="detail-value mono link"
					>
						{step4DeployState.nftAddress}
					</a>
				</div>

				<div class="detail-item">
					<span class="detail-label">Transaction Hash:</span>
					<a
						href="{currentNetwork?.blockExplorer}/tx/{step4DeployState.txHash}"
						target="_blank"
						rel="noopener noreferrer"
						class="detail-value mono link"
					>
						{step4DeployState.txHash}
					</a>
				</div>

				{#if step4DeployState.deploymentCost}
					<div class="detail-item">
						<span class="detail-label">Deployment Cost:</span>
						<span class="detail-value">{step4DeployState.deploymentCost} ETH</span>
					</div>
				{/if}
			</div>

			<div class="actions">
				<a
					href="{currentNetwork?.blockExplorer}/address/{step4DeployState.nftAddress}"
					target="_blank"
					rel="noopener noreferrer"
					class="action-button primary"
				>
					View on Explorer
				</a>
				<a href="/apps/nft-manager" class="action-button">Manage NFTs</a>
			</div>
		</div>
	{:else if hasError}
		<!-- Error State -->
		<div class="result-container error">
			<XCircle size={64} class="result-icon" />
			<h2 class="result-title">Deployment Failed</h2>
			<p class="error-message">{step4DeployState.error || 'Unknown error'}</p>
			<button class="retry-button" onclick={handleDeploy}>Try Again</button>
		</div>
	{/if}
</div>

<style>
	.step-content {
		padding: var(--space-6);
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}

	.review-section {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.review-title {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
		margin: 0;
	}

	:global([data-theme='dark']) .review-title {
		color: var(--gray-100);
	}

	.config-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: var(--space-4);
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
		color: var(--gray-900);
		word-break: break-all;
	}

	:global([data-theme='dark']) .config-value {
		color: var(--gray-100);
	}

	.config-value.mono {
		font-family: 'Courier New', monospace;
		font-size: var(--text-sm);
	}

	.cost-section {
		padding: var(--space-4);
		background: var(--gray-50);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
	}

	:global([data-theme='dark']) .cost-section {
		background: var(--gray-800);
	}

	.cost-title {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
		margin: 0 0 var(--space-3) 0;
	}

	:global([data-theme='dark']) .cost-title {
		color: var(--gray-100);
	}

	.cost-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: var(--text-sm);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .cost-item {
		color: var(--gray-300);
	}

	.cost-value {
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .cost-value {
		color: var(--gray-100);
	}

	.cost-hint {
		margin: var(--space-2) 0 0 0;
		font-size: var(--text-xs);
		color: var(--gray-500);
	}

	.deploy-section {
		display: flex;
		justify-content: center;
	}

	.deploy-button {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-4) var(--space-8);
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: white;
		background: var(--color-primary);
		border: none;
		border-radius: var(--radius-lg);
		cursor: pointer;
		transition: all 0.2s;
	}

	.deploy-button:hover:not(:disabled) {
		background: var(--color-primary-hover);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
	}

	.deploy-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.deploy-button :global(.spinning) {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.result-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-6);
		padding: var(--space-8);
		border-radius: var(--radius-lg);
		text-align: center;
	}

	.result-container.success {
		background: rgba(34, 197, 94, 0.1);
		border: 2px solid rgb(34, 197, 94);
	}

	.result-container.error {
		background: rgba(239, 68, 68, 0.1);
		border: 2px solid rgb(239, 68, 68);
	}

	.result-title {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--gray-900);
		margin: 0;
	}

	:global([data-theme='dark']) .result-title {
		color: var(--gray-100);
	}

	.result-details {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
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
		color: var(--gray-900);
		word-break: break-all;
	}

	:global([data-theme='dark']) .detail-value {
		color: var(--gray-100);
	}

	.detail-value.mono {
		font-family: 'Courier New', monospace;
		font-size: var(--text-sm);
	}

	.detail-value.link {
		color: var(--color-primary);
		text-decoration: underline;
	}

	.detail-value.link:hover {
		color: var(--color-primary-hover);
	}

	.actions {
		display: flex;
		gap: var(--space-3);
		flex-wrap: wrap;
		justify-content: center;
	}

	.action-button {
		padding: var(--space-3) var(--space-6);
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		border: 2px solid var(--color-primary);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all 0.2s;
		text-decoration: none;
		display: inline-block;
	}

	.action-button.primary {
		background: var(--color-primary);
		color: white;
	}

	.action-button.primary:hover {
		background: var(--color-primary-hover);
	}

	.action-button:not(.primary) {
		background: transparent;
		color: var(--color-primary);
	}

	.action-button:not(.primary):hover {
		background: var(--color-primary);
		color: white;
	}

	.error-message {
		color: rgb(239, 68, 68);
		font-size: var(--text-base);
		margin: 0;
	}

	.retry-button {
		padding: var(--space-3) var(--space-6);
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: white;
		background: var(--color-primary);
		border: none;
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all 0.2s;
	}

	.retry-button:hover {
		background: var(--color-primary-hover);
	}
</style>
