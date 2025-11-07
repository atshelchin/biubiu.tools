<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import { CheckCircle2, XCircle, AlertCircle, Loader2, ExternalLink } from 'lucide-svelte';
	import type { Address } from 'viem';

	interface Props {
		show: boolean;
		chainId: number;
		networkName: string;
		blockExplorer?: string;
		onClose: () => void;
		onSuccess: () => void;
	}

	let {
		show = $bindable(false),
		chainId,
		networkName,
		blockExplorer,
		onClose,
		onSuccess
	}: Props = $props();

	const connectStore = useConnectStore();

	// Check if current connector is MetaMask
	const isMetaMask = $derived(() => {
		const connectorId = connectStore.connectorId;
		const connectorName = connectStore.connectorName;
		return (
			connectorId === 'injected' ||
			connectorId === 'metamask' ||
			connectorName?.toLowerCase().includes('metamask')
		);
	});

	// Deployment constants
	const DEPLOYER_ADDRESS: Address = '0x3fab184622dc19b6109349b94811493bf2a45362';
	const FUNDING_AMOUNT = '0.01'; // ETH
	const DEPLOYMENT_TX =
		'0xf8a58085174876e800830186a08080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf31ba02222222222222222222222222222222222222222222222222222222222222222a02222222222222222222222222222222222222222222222222222222222222222';
	const CREATE2_PROXY_ADDRESS: Address = '0x4e59b44847b379578588920cA78FbF26c0B4956C';

	type DeploymentStep = 'funding' | 'deploying' | 'completed' | 'error';

	let currentStep = $state<DeploymentStep>('funding');
	let isProcessing = $state(false);
	let isWaitingForSignature = $state(false); // Waiting for user to sign in wallet
	let errorMessage = $state<string | null>(null);
	let fundingTxHash = $state<string | null>(null);
	let deploymentTxHash = $state<string | null>(null);
	let showRpcUpdatePrompt = $state(false);
	let isUpdatingRpc = $state(false);
	let showClearCacheSteps = $state(false);

	// Reset state when modal opens
	$effect(() => {
		if (show) {
			currentStep = 'funding';
			isProcessing = false;
			isWaitingForSignature = false;
			errorMessage = null;
			fundingTxHash = null;
			deploymentTxHash = null;
			showRpcUpdatePrompt = false;
			isUpdatingRpc = false;
			showClearCacheSteps = false;
		}
	});

	// Handle RPC update
	async function handleUpdateRpc() {
		isUpdatingRpc = true;
		try {
			await connectStore.updateWalletNetwork(chainId);
			showRpcUpdatePrompt = false;
			errorMessage = 'Network RPC updated successfully. Please try again.';
			// Auto retry after 1 second
			setTimeout(() => {
				errorMessage = null;
				if (currentStep === 'error') {
					currentStep = 'funding';
				}
			}, 1000);
		} catch (error) {
			console.error('Failed to update RPC:', error);
			if (error instanceof Error && error.message.includes('User rejected')) {
				errorMessage = 'You rejected the network update request.';
			} else {
				errorMessage = 'Failed to update network RPC. Please update it manually in your wallet.';
			}
		} finally {
			isUpdatingRpc = false;
		}
	}

	async function handleFunding() {
		if (!connectStore.isConnected || !connectStore.address) {
			errorMessage = 'Please connect your wallet first';
			return;
		}

		isProcessing = true;
		isWaitingForSignature = true;
		errorMessage = null;

		try {
			// Send 0.01 ETH to deployer address
			const hash = await connectStore.sendTransaction({
				to: DEPLOYER_ADDRESS,
				value: BigInt(10000000000000000), // 0.01 ETH in wei
				data: '0x'
			});

			// User signed, transaction sent
			isWaitingForSignature = false;
			fundingTxHash = hash;

			// Wait for transaction confirmation
			await connectStore.waitForTransaction(hash);

			// Move to deployment step
			currentStep = 'deploying';
		} catch (error) {
			console.error('Funding failed:', error);
			isWaitingForSignature = false;
			currentStep = 'error';

			// Provide user-friendly error messages
			let message = 'Failed to send funding transaction';
			if (error instanceof Error) {
				if (
					error.message.includes('BlockOutOfRangeError') ||
					error.message.includes('block height is') ||
					error.message.includes('nonce too high')
				) {
					// MetaMask cache issue when network was reset
					if (isMetaMask()) {
						message =
							'MetaMask cached old block data. This happens when your test network was reset.';
						showClearCacheSteps = true;
					} else {
						message = 'Wallet cache error. Please restart your wallet and try again.';
					}
					showRpcUpdatePrompt = false;
				} else if (
					error.message.includes('Internal JSON-RPC error') ||
					error.message.includes('internal error was received')
				) {
					// MetaMask-specific error handling
					if (isMetaMask()) {
						message =
							'MetaMask internal error. Please try: 1) Clear Activity Tab Data in MetaMask (Settings → Advanced → Clear activity tab data), 2) Update network RPC, 3) Restart MetaMask.';
					} else {
						message =
							'Wallet internal error. Please try: 1) Update network RPC, 2) Restart your wallet.';
					}
					showRpcUpdatePrompt = true;
				} else if (
					error.message.includes('Failed to fetch') ||
					error.message.includes('fetch failed') ||
					error.message.includes('NetworkError')
				) {
					message =
						'Connection failed. Please check: 1) Your wallet is unlocked, 2) Your network connection is stable. If the issue persists, try updating the network RPC.';
					showRpcUpdatePrompt = true;
				} else if (error.message.includes('circuit breaker is open')) {
					message =
						'RPC service is temporarily unavailable. This is likely because the RPC endpoint configured in your wallet has rate limits or is down.';
					showRpcUpdatePrompt = true;
				} else if (error.message.includes('insufficient funds')) {
					message = 'Insufficient balance. You need at least 0.01 ETH plus gas fees.';
				} else if (
					error.message.includes('user rejected') ||
					error.message.includes('User rejected')
				) {
					message = 'Transaction was rejected in your wallet.';
				} else {
					message = error.message;
				}
			}
			errorMessage = message;
		} finally {
			isProcessing = false;
		}
	}

	async function handleDeployment() {
		isProcessing = true;
		errorMessage = null;

		try {
			// Send raw deployment transaction
			const hash = await connectStore.sendRawTransaction(DEPLOYMENT_TX);
			deploymentTxHash = hash;

			// Wait for transaction confirmation
			await connectStore.waitForTransaction(hash);

			// Deployment successful
			currentStep = 'completed';

			// Notify parent component
			setTimeout(() => {
				onSuccess();
			}, 2000);
		} catch (error) {
			console.error('Deployment failed:', error);
			currentStep = 'error';

			// Provide user-friendly error messages
			let message = 'Failed to deploy contract';
			if (error instanceof Error) {
				if (
					error.message.includes('BlockOutOfRangeError') ||
					error.message.includes('block height is') ||
					error.message.includes('nonce too high')
				) {
					// MetaMask cache issue when network was reset
					if (isMetaMask()) {
						message =
							'MetaMask cached old block data. This happens when your test network was reset.';
						showClearCacheSteps = true;
					} else {
						message = 'Wallet cache error. Please restart your wallet and try again.';
					}
					showRpcUpdatePrompt = false;
				} else if (
					error.message.includes('Internal JSON-RPC error') ||
					error.message.includes('internal error was received')
				) {
					// MetaMask-specific error handling
					if (isMetaMask()) {
						message =
							'MetaMask internal error. Please try: 1) Clear Activity Tab Data in MetaMask (Settings → Advanced → Clear activity tab data), 2) Update network RPC, 3) Restart MetaMask.';
					} else {
						message =
							'Wallet internal error. Please try: 1) Update network RPC, 2) Restart your wallet.';
					}
					showRpcUpdatePrompt = true;
				} else if (
					error.message.includes('Failed to fetch') ||
					error.message.includes('fetch failed') ||
					error.message.includes('NetworkError')
				) {
					message =
						'Connection failed. Please check: 1) Your wallet is unlocked, 2) Your network connection is stable. If the issue persists, try updating the network RPC.';
					showRpcUpdatePrompt = true;
				} else if (error.message.includes('circuit breaker is open')) {
					message =
						'RPC service is temporarily unavailable. This is likely because the RPC endpoint configured in your wallet has rate limits or is down.';
					showRpcUpdatePrompt = true;
				} else if (
					error.message.includes('nonce too low') ||
					error.message.includes('already known')
				) {
					message = 'This contract may already be deployed. Please refresh the dependency check.';
				} else {
					message = error.message;
				}
			}
			errorMessage = message;
		} finally {
			isProcessing = false;
		}
	}

	function handleClose() {
		if (!isProcessing) {
			show = false;
			onClose();
		}
	}
</script>

{#if show}
	<div class="modal-overlay" onclick={handleClose}>
		<div class="modal-container" onclick={(e) => e.stopPropagation()}>
			<div class="modal-header">
				<h2>Deploy CREATE2 Proxy</h2>
				<button class="close-button" onclick={handleClose} disabled={isProcessing}>×</button>
			</div>

			<div class="modal-body">
				<!-- Step Indicator -->
				<div class="step-indicator">
					<div
						class="step"
						class:active={currentStep === 'funding'}
						class:completed={['deploying', 'completed'].includes(currentStep)}
					>
						<div class="step-number">
							{#if ['deploying', 'completed'].includes(currentStep)}
								<CheckCircle2 size={20} />
							{:else}
								1
							{/if}
						</div>
						<span class="step-label">Fund Deployer</span>
					</div>
					<div
						class="step-line"
						class:completed={['deploying', 'completed'].includes(currentStep)}
					></div>
					<div
						class="step"
						class:active={currentStep === 'deploying'}
						class:completed={currentStep === 'completed'}
					>
						<div class="step-number">
							{#if currentStep === 'completed'}
								<CheckCircle2 size={20} />
							{:else}
								2
							{/if}
						</div>
						<span class="step-label">Deploy Contract</span>
					</div>
				</div>

				<!-- Content based on current step -->
				{#if currentStep === 'funding'}
					<div class="step-content">
						<div class="info-card">
							<h3>Step 1: Fund the Deployer</h3>
							{#if isWaitingForSignature}
								<p class="status-message waiting">⏳ Please confirm the transaction in your wallet...</p>
							{:else if fundingTxHash && isProcessing}
								<p class="status-message processing">
									⚡ Transaction sent! Waiting for blockchain confirmation...
								</p>
							{:else if fundingTxHash && !isProcessing}
								<p class="status-message success">
									✅ Funding transaction confirmed! Proceeding to deployment...
								</p>
							{:else if isProcessing}
								<p class="status-message processing">🔄 Processing transaction...</p>
							{:else}
								<p>
									To deploy the CREATE2 Proxy, we need to send <strong>{FUNDING_AMOUNT} ETH</strong>
									to the deployer address.
								</p>
							{/if}

							<div class="detail-row">
								<span class="label">Network:</span>
								<span class="value">{networkName}</span>
							</div>
							<div class="detail-row">
								<span class="label">Deployer Address:</span>
								<div class="address-value">
									<code>{DEPLOYER_ADDRESS}</code>
									{#if blockExplorer}
										<a
											href="{blockExplorer}/address/{DEPLOYER_ADDRESS}"
											target="_blank"
											rel="noopener noreferrer"
											class="explorer-link"
										>
											<ExternalLink size={14} />
										</a>
									{/if}
								</div>
							</div>
							<div class="detail-row">
								<span class="label">Amount:</span>
								<span class="value highlight">{FUNDING_AMOUNT} ETH</span>
							</div>
						</div>

						{#if fundingTxHash}
							<div class="tx-info success">
								<CheckCircle2 size={20} />
								<div>
									<p><strong>Funding Transaction Sent</strong></p>
									<div class="tx-hash">
										<code>{fundingTxHash.slice(0, 10)}...{fundingTxHash.slice(-8)}</code>
										{#if blockExplorer}
											<a
												href="{blockExplorer}/tx/{fundingTxHash}"
												target="_blank"
												rel="noopener noreferrer"
												class="explorer-link"
											>
												<ExternalLink size={14} />
											</a>
										{/if}
									</div>
								</div>
							</div>
						{/if}

						<button
							class="action-button primary"
							onclick={handleFunding}
							disabled={isProcessing || !!fundingTxHash}
						>
							{#if isProcessing}
								<Loader2 size={20} class="spinning" />
								Sending Transaction...
							{:else if fundingTxHash}
								<CheckCircle2 size={20} />
								Funded Successfully
							{:else}
								Send {FUNDING_AMOUNT} ETH
							{/if}
						</button>
					</div>
				{:else if currentStep === 'deploying'}
					<div class="step-content">
						<div class="info-card">
							<h3>Step 2: Deploy the Contract</h3>
							{#if deploymentTxHash && isProcessing}
								<p class="status-message processing">
									⚡ Transaction sent! Waiting for blockchain confirmation...
								</p>
							{:else if deploymentTxHash && !isProcessing}
								<p class="status-message success">
									✅ Deployment transaction confirmed! Finalizing...
								</p>
							{:else if isProcessing}
								<p class="status-message processing">🔄 Sending deployment transaction...</p>
							{:else}
								<p>Ready to deploy the CREATE2 Proxy contract using a pre-signed transaction.</p>
							{/if}

							<div class="detail-row">
								<span class="label">Contract Address:</span>
								<div class="address-value">
									<code>{CREATE2_PROXY_ADDRESS}</code>
									{#if blockExplorer}
										<a
											href="{blockExplorer}/address/{CREATE2_PROXY_ADDRESS}"
											target="_blank"
											rel="noopener noreferrer"
											class="explorer-link"
										>
											<ExternalLink size={14} />
										</a>
									{/if}
								</div>
							</div>
							<div class="detail-row">
								<span class="label">Deployment Method:</span>
								<span class="value">Raw Transaction</span>
							</div>
						</div>

						{#if deploymentTxHash}
							<div class="tx-info success">
								<CheckCircle2 size={20} />
								<div>
									<p><strong>Deployment Transaction Sent</strong></p>
									<div class="tx-hash">
										<code>{deploymentTxHash.slice(0, 10)}...{deploymentTxHash.slice(-8)}</code>
										{#if blockExplorer}
											<a
												href="{blockExplorer}/tx/{deploymentTxHash}"
												target="_blank"
												rel="noopener noreferrer"
												class="explorer-link"
											>
												<ExternalLink size={14} />
											</a>
										{/if}
									</div>
								</div>
							</div>
						{/if}

						<button
							class="action-button primary"
							onclick={handleDeployment}
							disabled={isProcessing || !!deploymentTxHash}
						>
							{#if isProcessing}
								<Loader2 size={20} class="spinning" />
								Deploying Contract...
							{:else if deploymentTxHash}
								<CheckCircle2 size={20} />
								Deployed Successfully
							{:else}
								Deploy Contract
							{/if}
						</button>
					</div>
				{:else if currentStep === 'completed'}
					<div class="step-content">
						<div class="success-card">
							<CheckCircle2 size={64} />
							<h3>Deployment Successful!</h3>
							<p>The CREATE2 Proxy has been successfully deployed to:</p>
							<div class="deployed-address">
								<code>{CREATE2_PROXY_ADDRESS}</code>
								{#if blockExplorer}
									<a
										href="{blockExplorer}/address/{CREATE2_PROXY_ADDRESS}"
										target="_blank"
										rel="noopener noreferrer"
										class="explorer-link large"
									>
										<ExternalLink size={16} />
										View on Explorer
									</a>
								{/if}
							</div>
							<p class="success-note">The dependency check will automatically refresh.</p>
						</div>
					</div>
				{:else if currentStep === 'error'}
					<div class="step-content">
						<div class="error-card">
							<XCircle size={64} />
							<h3>Deployment Failed</h3>
							{#if errorMessage}
								<p class="error-message">{errorMessage}</p>
							{/if}

							{#if showClearCacheSteps}
								<div class="clear-cache-guide">
									<div class="guide-header">
										<AlertCircle size={20} />
										<h4>Clear MetaMask Cache</h4>
									</div>
									<p class="guide-description">Follow these steps to clear cached data:</p>
									<div class="steps-list">
										<div class="step-item">
											<span class="step-number">1</span>
											<div class="step-content">
												<strong>Open MetaMask Settings</strong>
												<p>Click the menu icon → Settings</p>
											</div>
										</div>
										<div class="step-item">
											<span class="step-number">2</span>
											<div class="step-content">
												<strong>Go to Advanced Settings</strong>
												<p>Navigate to: Advanced</p>
											</div>
										</div>
										<div class="step-item">
											<span class="step-number">3</span>
											<div class="step-content">
												<strong>Clear Activity Tab Data</strong>
												<p>Click "Clear activity tab data" and confirm</p>
											</div>
										</div>
									</div>
								</div>
							{/if}

							{#if showRpcUpdatePrompt}
								<div class="rpc-update-prompt">
									<p class="prompt-text">
										💡 We can update your wallet to use a better RPC endpoint that should work
										properly.
									</p>
									<button
										class="action-button primary"
										onclick={handleUpdateRpc}
										disabled={isUpdatingRpc}
									>
										{#if isUpdatingRpc}
											<Loader2 size={20} class="spinning" />
											Updating Network...
										{:else}
											Update Network RPC
										{/if}
									</button>
								</div>
							{/if}

							<button
								class="action-button secondary"
								onclick={() => {
									currentStep = 'funding';
									errorMessage = null;
									showRpcUpdatePrompt = false;
								}}
							>
								Try Again
							</button>
						</div>
					</div>
				{/if}

				{#if errorMessage && currentStep !== 'error'}
					<div class="error-banner">
						<AlertCircle size={20} />
						<span>{errorMessage}</span>
					</div>
				{/if}
			</div>

			<div class="modal-footer">
				<button class="button secondary" onclick={handleClose} disabled={isProcessing}>
					{currentStep === 'completed' ? 'Close' : 'Cancel'}
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: var(--space-4);
		backdrop-filter: blur(4px);
	}

	.modal-container {
		background: var(--white);
		border-radius: var(--radius-lg);
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
		max-width: 600px;
		width: 100%;
		max-height: 90vh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	:global([data-theme='dark']) .modal-container {
		background: var(--gray-800);
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-4);
		border-bottom: 1px solid var(--color-border);
	}

	.modal-header h2 {
		margin: 0;
		font-size: var(--text-xl);
		font-weight: var(--font-bold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .modal-header h2 {
		color: var(--gray-100);
	}

	.close-button {
		width: 32px;
		height: 32px;
		border-radius: var(--radius-sm);
		border: none;
		background: transparent;
		color: var(--gray-600);
		font-size: 24px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
	}

	.close-button:hover:not(:disabled) {
		background: var(--gray-100);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .close-button:hover:not(:disabled) {
		background: var(--gray-700);
		color: var(--gray-100);
	}

	.close-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.modal-body {
		padding: var(--space-6);
		overflow-y: auto;
		flex: 1;
	}

	/* Step Indicator */
	.step-indicator {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: var(--space-6);
		gap: var(--space-2);
	}

	.step {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2);
	}

	.step-number {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--gray-200);
		color: var(--gray-600);
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: var(--font-bold);
		transition: all 0.3s;
	}

	:global([data-theme='dark']) .step-number {
		background: var(--gray-700);
		color: var(--gray-400);
	}

	.step.active .step-number {
		background: var(--color-primary);
		color: white;
		box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
	}

	.step.completed .step-number {
		background: hsl(120, 60%, 50%);
		color: white;
	}

	:global([data-theme='dark']) .step.completed .step-number {
		background: hsl(120, 60%, 60%);
	}

	.step-label {
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		color: var(--gray-600);
		text-align: center;
	}

	:global([data-theme='dark']) .step-label {
		color: var(--gray-400);
	}

	.step.active .step-label {
		color: var(--gray-900);
		font-weight: var(--font-semibold);
	}

	:global([data-theme='dark']) .step.active .step-label {
		color: var(--gray-100);
	}

	.step-line {
		width: 60px;
		height: 2px;
		background: var(--gray-300);
		margin: 0 var(--space-2);
		margin-bottom: 24px;
		transition: all 0.3s;
	}

	:global([data-theme='dark']) .step-line {
		background: var(--gray-600);
	}

	.step-line.completed {
		background: hsl(120, 60%, 50%);
	}

	/* Step Content */
	.step-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.info-card {
		padding: var(--space-4);
		background: var(--color-panel-1);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
	}

	.info-card h3 {
		margin: 0 0 var(--space-2) 0;
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .info-card h3 {
		color: var(--gray-100);
	}

	.info-card p {
		margin: 0 0 var(--space-3) 0;
		color: var(--gray-600);
		line-height: 1.6;
	}

	:global([data-theme='dark']) .info-card p {
		color: var(--gray-400);
	}

	.status-message {
		font-weight: var(--font-medium);
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-sm);
		margin: 0 0 var(--space-3) 0;
		font-size: var(--text-base);
	}

	.status-message.waiting {
		background: hsla(45, 100%, 95%, 1);
		color: hsl(45, 100%, 35%);
		border: 1px solid hsl(45, 100%, 60%);
	}

	:global([data-theme='dark']) .status-message.waiting {
		background: hsla(45, 100%, 15%, 0.3);
		color: hsl(45, 100%, 75%);
		border-color: hsl(45, 100%, 40%);
	}

	.status-message.processing {
		background: hsla(210, 100%, 95%, 1);
		color: hsl(210, 100%, 35%);
		border: 1px solid hsl(210, 100%, 60%);
	}

	:global([data-theme='dark']) .status-message.processing {
		background: hsla(210, 100%, 15%, 0.3);
		color: hsl(210, 100%, 75%);
		border-color: hsl(210, 100%, 40%);
	}

	.status-message.success {
		background: hsla(120, 60%, 95%, 1);
		color: hsl(120, 60%, 35%);
		border: 1px solid hsl(120, 60%, 60%);
	}

	:global([data-theme='dark']) .status-message.success {
		background: hsla(120, 60%, 15%, 0.3);
		color: hsl(120, 60%, 75%);
		border-color: hsl(120, 60%, 40%);
	}

	.detail-row {
		display: flex;
		gap: var(--space-2);
		align-items: baseline;
		margin-bottom: var(--space-2);
		font-size: var(--text-sm);
	}

	.detail-row:last-child {
		margin-bottom: 0;
	}

	.detail-row .label {
		font-weight: var(--font-semibold);
		color: var(--gray-600);
		min-width: 140px;
		flex-shrink: 0;
	}

	:global([data-theme='dark']) .detail-row .label {
		color: var(--gray-400);
	}

	.detail-row .value {
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .detail-row .value {
		color: var(--gray-100);
	}

	.detail-row .value.highlight {
		color: var(--color-primary);
		font-weight: var(--font-bold);
	}

	.address-value {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		flex: 1;
		min-width: 0;
	}

	.address-value code {
		font-family: var(--font-mono, monospace);
		font-size: var(--text-xs);
		color: var(--gray-800);
		background: var(--gray-100);
		padding: 2px 6px;
		border-radius: var(--radius-sm);
		word-break: break-all;
		flex: 1;
		min-width: 0;
	}

	:global([data-theme='dark']) .address-value code {
		color: var(--gray-200);
		background: var(--gray-700);
	}

	.explorer-link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		padding: 4px;
		color: var(--color-primary);
		background: var(--color-panel-1);
		border-radius: var(--radius-sm);
		transition: all 0.2s;
		flex-shrink: 0;
		text-decoration: none;
	}

	.explorer-link:hover {
		background: var(--color-primary);
		color: white;
		transform: translateY(-1px);
	}

	.explorer-link.large {
		padding: var(--space-2) var(--space-3);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
	}

	/* Transaction Info */
	.tx-info {
		display: flex;
		gap: var(--space-3);
		padding: var(--space-3);
		border-radius: var(--radius-md);
		align-items: flex-start;
	}

	.tx-info.success {
		background: hsla(120, 60%, 95%, 1);
		border: 1px solid hsl(120, 60%, 60%);
		color: hsl(120, 60%, 30%);
	}

	:global([data-theme='dark']) .tx-info.success {
		background: hsla(120, 60%, 15%, 0.5);
		border-color: hsl(120, 60%, 40%);
		color: hsl(120, 60%, 70%);
	}

	.tx-info p {
		margin: 0 0 var(--space-1) 0;
	}

	.tx-hash {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-top: var(--space-1);
	}

	.tx-hash code {
		font-family: var(--font-mono, monospace);
		font-size: var(--text-xs);
		background: rgba(255, 255, 255, 0.5);
		padding: 2px 6px;
		border-radius: var(--radius-sm);
	}

	:global([data-theme='dark']) .tx-hash code {
		background: rgba(0, 0, 0, 0.3);
	}

	/* Success/Error Cards */
	.success-card,
	.error-card {
		text-align: center;
		padding: var(--space-6) var(--space-4);
	}

	.success-card {
		color: hsl(120, 60%, 30%);
	}

	:global([data-theme='dark']) .success-card {
		color: hsl(120, 60%, 70%);
	}

	.error-card {
		color: hsl(0, 80%, 30%);
	}

	:global([data-theme='dark']) .error-card {
		color: hsl(0, 80%, 70%);
	}

	.success-card h3,
	.error-card h3 {
		margin: var(--space-4) 0 var(--space-2) 0;
		font-size: var(--text-xl);
	}

	.success-card p,
	.error-card p {
		margin: 0 0 var(--space-3) 0;
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .success-card p,
	:global([data-theme='dark']) .error-card p {
		color: var(--gray-300);
	}

	.deployed-address {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-3);
		margin: var(--space-4) 0;
		padding: var(--space-4);
		background: var(--color-panel-1);
		border-radius: var(--radius-md);
	}

	.deployed-address code {
		font-family: var(--font-mono, monospace);
		font-size: var(--text-sm);
		color: var(--gray-900);
		background: var(--white);
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-sm);
		word-break: break-all;
	}

	:global([data-theme='dark']) .deployed-address code {
		color: var(--gray-100);
		background: var(--gray-800);
	}

	.success-note {
		font-size: var(--text-sm);
		font-style: italic;
		opacity: 0.8;
	}

	.error-message {
		color: hsl(0, 80%, 40%) !important;
		font-weight: var(--font-medium);
	}

	:global([data-theme='dark']) .error-message {
		color: hsl(0, 80%, 60%) !important;
	}

	/* Buttons */
	.action-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		width: 100%;
		padding: var(--space-3) var(--space-4);
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.2s;
	}

	.action-button.primary {
		background: var(--color-primary);
		color: white;
	}

	.action-button.primary:hover:not(:disabled) {
		opacity: 0.9;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
	}

	.action-button.secondary {
		background: var(--gray-200);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .action-button.secondary {
		background: var(--gray-700);
		color: var(--gray-200);
	}

	.action-button.secondary:hover:not(:disabled) {
		background: var(--gray-300);
	}

	:global([data-theme='dark']) .action-button.secondary:hover:not(:disabled) {
		background: var(--gray-600);
	}

	.action-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none !important;
	}

	:global(.spinning) {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* Error Banner */
	.error-banner {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3);
		background: hsla(0, 80%, 95%, 1);
		border: 1px solid hsl(0, 80%, 60%);
		border-radius: var(--radius-md);
		color: hsl(0, 80%, 30%);
		font-size: var(--text-sm);
	}

	:global([data-theme='dark']) .error-banner {
		background: hsla(0, 80%, 15%, 0.5);
		border-color: hsl(0, 80%, 40%);
		color: hsl(0, 80%, 70%);
	}

	/* Footer */
	.modal-footer {
		padding: var(--space-4);
		border-top: 1px solid var(--color-border);
		display: flex;
		justify-content: flex-end;
	}

	.button {
		padding: var(--space-2) var(--space-4);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.2s;
		border: none;
	}

	.button.secondary {
		background: var(--gray-200);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .button.secondary {
		background: var(--gray-700);
		color: var(--gray-200);
	}

	.button.secondary:hover:not(:disabled) {
		background: var(--gray-300);
	}

	:global([data-theme='dark']) .button.secondary:hover:not(:disabled) {
		background: var(--gray-600);
	}

	.button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Responsive */
	@media (max-width: 640px) {
		.modal-body {
			padding: var(--space-4);
		}

		.step-indicator {
			gap: var(--space-1);
		}

		.step-line {
			width: 40px;
		}

		.detail-row {
			flex-direction: column;
			gap: var(--space-1);
		}

		.detail-row .label {
			min-width: unset;
		}
	}

	/* RPC Update Prompt */
	.rpc-update-prompt {
		margin: var(--space-4) 0;
		padding: var(--space-4);
		background: hsla(210, 100%, 95%, 1);
		border: 2px solid hsl(210, 100%, 60%);
		border-radius: var(--radius-md);
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	:global([data-theme='dark']) .rpc-update-prompt {
		background: hsla(210, 100%, 15%, 0.5);
		border-color: hsl(210, 100%, 50%);
	}

	.prompt-text {
		margin: 0;
		color: hsl(210, 100%, 30%);
		font-size: var(--text-sm);
		line-height: 1.5;
	}

	:global([data-theme='dark']) .prompt-text {
		color: hsl(210, 100%, 80%);
	}

	/* Clear Cache Guide */
	.clear-cache-guide {
		margin: var(--space-4) 0;
		padding: var(--space-4);
		background: hsla(45, 100%, 95%, 1);
		border: 2px solid hsl(45, 100%, 50%);
		border-radius: var(--radius-md);
	}

	:global([data-theme='dark']) .clear-cache-guide {
		background: hsla(45, 100%, 15%, 0.5);
		border-color: hsl(45, 100%, 40%);
	}

	.guide-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-3);
		color: hsl(45, 100%, 30%);
	}

	:global([data-theme='dark']) .guide-header {
		color: hsl(45, 100%, 70%);
	}

	.guide-header h4 {
		margin: 0;
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
	}

	.guide-description {
		margin: 0 0 var(--space-3) 0;
		color: hsl(45, 100%, 25%);
		font-size: var(--text-sm);
	}

	:global([data-theme='dark']) .guide-description {
		color: hsl(45, 100%, 75%);
	}

	.steps-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.step-item {
		display: flex;
		gap: var(--space-3);
		align-items: flex-start;
	}

	.step-number {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: hsl(45, 100%, 50%);
		color: white;
		font-weight: var(--font-bold);
		font-size: var(--text-sm);
		flex-shrink: 0;
	}

	:global([data-theme='dark']) .step-number {
		background: hsl(45, 100%, 45%);
	}

	.step-content {
		flex: 1;
	}

	.step-content strong {
		display: block;
		margin-bottom: var(--space-1);
		color: hsl(45, 100%, 20%);
		font-size: var(--text-sm);
	}

	:global([data-theme='dark']) .step-content strong {
		color: hsl(45, 100%, 80%);
	}

	.step-content p {
		margin: 0;
		color: hsl(45, 100%, 30%);
		font-size: var(--text-xs);
		line-height: 1.5;
	}

	:global([data-theme='dark']) .step-content p {
		color: hsl(45, 100%, 70%);
	}
</style>
