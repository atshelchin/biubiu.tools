<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import { CheckCircle2, XCircle, AlertCircle, Loader2, ExternalLink } from 'lucide-svelte';
	import type { ContractDeploymentConfig, DeploymentContext } from '../types/deployment-config';

	interface Props {
		show: boolean;
		config: ContractDeploymentConfig;
		chainId: number;
		networkName: string;
		rpcUrl: string;
		blockExplorer?: string;
		onClose: () => void;
		onSuccess: () => void;
	}

	let {
		show = $bindable(false),
		config,
		chainId,
		networkName,
		rpcUrl,
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

	type DeploymentStatus = 'idle' | 'deploying' | 'success' | 'error';

	let status = $state<DeploymentStatus>('idle');
	let isProcessing = $state(false);
	let errorMessage = $state<string | null>(null);
	let steps = $state<
		Array<{ title: string; description: string; completed: boolean; inProgress: boolean }>
	>([]);
	let showClearCacheSteps = $state(false);

	// Reset state when modal opens
	$effect(() => {
		if (show) {
			status = 'idle';
			isProcessing = false;
			errorMessage = null;
			steps = [];
			showClearCacheSteps = false;

			// Initialize steps from deployment config
			initializeDeployment();
		}
	});

	async function initializeDeployment() {
		if (!config.deployFunction) return;

		try {
			const context: DeploymentContext = {
				chainId,
				networkName,
				rpcUrl,
				blockExplorer,
				sendTransaction: connectStore.sendTransaction,
				waitForTransaction: connectStore.waitForTransaction,
				sendRawTransaction: connectStore.sendRawTransaction
			};

			const deployment = await config.deployFunction(context);
			steps = deployment.steps.map((step) => ({ ...step, completed: false, inProgress: false }));
		} catch (error) {
			console.error('Failed to initialize deployment:', error);
			errorMessage = 'Failed to initialize deployment configuration';
			status = 'error';
		}
	}

	async function handleDeploy() {
		if (!config.deployFunction || !connectStore.isConnected || !connectStore.address) {
			errorMessage = 'Please connect your wallet first';
			return;
		}

		isProcessing = true;
		status = 'deploying';
		errorMessage = null;

		try {
			const context: DeploymentContext = {
				chainId,
				networkName,
				rpcUrl,
				blockExplorer,
				sendTransaction: connectStore.sendTransaction,
				waitForTransaction: connectStore.waitForTransaction,
				sendRawTransaction: connectStore.sendRawTransaction
			};

			console.log('[Deployment] Starting deployment...');
			const deployment = await config.deployFunction(context);
			console.log('[Deployment] Got deployment config:', deployment);

			// Execute each step one by one with action functions
			for (let i = 0; i < deployment.steps.length; i++) {
				const step = deployment.steps[i];

				// If step has an action, execute it
				if (step.action) {
					console.log(
						`[Deployment] Executing step ${i + 1}/${deployment.steps.length}:`,
						step.title
					);

					// Mark step as in progress
					steps = steps.map((s, idx) =>
						idx === i ? { ...s, inProgress: true, completed: false } : s
					);

					await step.action();

					console.log(`[Deployment] Step ${i + 1} completed:`, step.title);

					// Mark this step as completed
					steps = steps.map((s, idx) =>
						idx === i ? { ...s, inProgress: false, completed: true } : s
					);
					// Give UI time to update and show feedback
					await new Promise((resolve) => setTimeout(resolve, 500));
				}
			}

			// If no steps had actions, fall back to onDeploy
			const hasActions = deployment.steps.some((s) => s.action);
			if (!hasActions) {
				console.log('[Deployment] No step actions found, using onDeploy');
				await deployment.onDeploy();
				steps = steps.map((step) => ({ ...step, completed: true }));
			}

			console.log('[Deployment] Deployment successful!');
			status = 'success';

			// Notify parent component after brief success display
			setTimeout(() => {
				console.log('[Deployment] Calling onSuccess callback');
				onSuccess();
			}, 1500);
		} catch (error) {
			console.error('[Deployment] Deployment failed:', error);
			status = 'error';

			// Handle different error types
			let message = 'Failed to deploy contract';
			if (error instanceof Error) {
				if (
					error.message.includes('BlockOutOfRangeError') ||
					error.message.includes('block height is') ||
					error.message.includes('nonce too high')
				) {
					if (isMetaMask()) {
						message =
							'MetaMask cached old block data. This happens when your test network was reset.';
						showClearCacheSteps = true;
					} else {
						message = 'Wallet cache error. Please restart your wallet and try again.';
					}
				} else if (
					error.message.includes('Internal JSON-RPC error') ||
					error.message.includes('internal error was received')
				) {
					if (isMetaMask()) {
						message =
							'MetaMask internal error. Please try:\n\n1. Clear Activity Tab Data in MetaMask\n   (Settings → Advanced → Clear activity tab data)\n\n2. Update network RPC endpoint\n\n3. Restart MetaMask\n\n4. If deploying Multicall3, ensure CREATE2 Proxy is deployed first';
					} else {
						message =
							'Wallet internal error. Please try:\n\n1. Update network RPC endpoint\n\n2. Restart your wallet\n\n3. If deploying Multicall3, ensure CREATE2 Proxy is deployed first';
					}
				} else if (
					error.message.includes('Failed to fetch') ||
					error.message.includes('fetch failed') ||
					error.message.includes('NetworkError')
				) {
					message =
						'Connection failed. Please check:\n\n1. Your wallet is unlocked\n\n2. Your network connection is stable\n\nIf the issue persists, try updating the network RPC endpoint.';
				} else if (error.message.includes('circuit breaker is open')) {
					message =
						'RPC service is temporarily unavailable. This is likely because the RPC endpoint configured in your wallet has rate limits or is down.';
				} else if (error.message.includes('insufficient funds')) {
					message = 'Insufficient balance. You need enough funds for deployment and gas fees.';
				} else if (
					error.message.includes('user rejected') ||
					error.message.includes('User rejected')
				) {
					message = 'Transaction was rejected in your wallet.';
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

	function handleRetry() {
		status = 'idle';
		errorMessage = null;
		showClearCacheSteps = false;
		steps = steps.map((step) => ({ ...step, completed: false, inProgress: false }));
	}
</script>

{#if show}
	<div class="modal-overlay" onclick={handleClose}>
		<div class="modal-container" onclick={(e) => e.stopPropagation()}>
			<div class="modal-header">
				<h2>Deploy {config.contractName}</h2>
				<button class="close-button" onclick={handleClose} disabled={isProcessing}>×</button>
			</div>

			<div class="modal-body">
				{#if status === 'idle'}
					<div class="info-section">
						<p class="contract-description">{config.description}</p>
						<div class="contract-details">
							<div class="detail-row">
								<span class="label">Network:</span>
								<span class="value">{networkName}</span>
							</div>
							<div class="detail-row">
								<span class="label">Contract Address:</span>
								<div class="address-value">
									<code>{config.contractAddress}</code>
									{#if blockExplorer}
										<a
											href="{blockExplorer}/address/{config.contractAddress}"
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

						{#if steps.length > 0}
							<div class="deployment-steps">
								<h4>Deployment Steps:</h4>
								<ol>
									{#each steps as step (step.title)}
										<li>
											<strong>{step.title}</strong>
											<p>{step.description}</p>
										</li>
									{/each}
								</ol>
							</div>
						{/if}

						<button class="action-button primary" onclick={handleDeploy}> Start Deployment </button>
					</div>
				{:else if status === 'deploying'}
					<div class="deploying-section">
						<Loader2 size={48} class="spinning" />
						<h3>Deploying Contract...</h3>
						{#if steps.some((s) => s.inProgress)}
							<p>Processing transaction on blockchain...</p>
						{:else if steps.every((s) => s.completed)}
							<p>Finalizing deployment...</p>
						{:else}
							<p>Please confirm transactions in your wallet</p>
						{/if}

						{#if steps.length > 0}
							<div class="step-progress">
								{#each steps as step, index (step.title)}
									<div
										class="step-item"
										class:completed={step.completed}
										class:in-progress={step.inProgress}
									>
										<div class="step-marker">
											{#if step.completed}
												<CheckCircle2 size={20} />
											{:else if step.inProgress}
												<Loader2 size={20} class="spinning" />
											{:else}
												{index + 1}
											{/if}
										</div>
										<div class="step-info">
											<strong>{step.title}</strong>
											<p>{step.description}</p>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				{:else if status === 'success'}
					<div class="success-section">
						<CheckCircle2 size={64} />
						<h3>Deployment Successful!</h3>
						<p>The contract has been successfully deployed.</p>
						<div class="deployed-address">
							<code>{config.contractAddress}</code>
							{#if blockExplorer}
								<a
									href="{blockExplorer}/address/{config.contractAddress}"
									target="_blank"
									rel="noopener noreferrer"
									class="explorer-link large"
								>
									<ExternalLink size={16} />
									View on Explorer
								</a>
							{/if}
						</div>
					</div>
				{:else if status === 'error'}
					<div class="error-section">
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

						<button class="action-button secondary" onclick={handleRetry}> Try Again </button>
					</div>
				{/if}
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
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		backdrop-filter: blur(8px);
		animation: fadeIn 0.2s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.modal-container {
		background: var(--color-panel-1);
		border-radius: var(--radius-xl);
		box-shadow:
			0 20px 60px rgba(0, 0, 0, 0.3),
			0 0 0 1px rgba(255, 255, 255, 0.1);
		max-width: 600px;
		width: 90%;
		max-height: 90vh;
		overflow: hidden;
		animation: slideUp 0.3s ease-out;
	}

	@keyframes slideUp {
		from {
			transform: translateY(20px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	:global([data-theme='dark']) .modal-container {
		background: linear-gradient(135deg, hsl(220, 15%, 12%) 0%, hsl(220, 15%, 15%) 100%);
		box-shadow:
			0 20px 60px rgba(0, 0, 0, 0.5),
			0 0 0 1px rgba(255, 255, 255, 0.05);
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-5) var(--space-6);
		background: linear-gradient(135deg, hsl(220, 70%, 55%) 0%, hsl(250, 70%, 60%) 100%);
		position: relative;
		overflow: hidden;
	}

	.modal-header::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
		pointer-events: none;
	}

	.modal-header h2 {
		margin: 0;
		font-size: var(--text-xl);
		font-weight: var(--font-bold);
		color: white;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		position: relative;
		z-index: 1;
	}

	.close-button {
		background: rgba(255, 255, 255, 0.2);
		border: none;
		font-size: 28px;
		cursor: pointer;
		color: white;
		padding: 0;
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-md);
		transition: all 0.2s ease;
		position: relative;
		z-index: 1;
	}

	.close-button:hover {
		background: rgba(255, 255, 255, 0.3);
		transform: rotate(90deg);
	}

	.close-button:active {
		transform: rotate(90deg) scale(0.95);
	}

	.modal-body {
		padding: var(--space-6);
		overflow-y: auto;
		max-height: calc(90vh - 80px);
	}

	.action-button {
		width: 100%;
		padding: var(--space-4) var(--space-5);
		border-radius: var(--radius-lg);
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		position: relative;
		overflow: hidden;
	}

	.action-button::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 0;
		height: 0;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.3);
		transform: translate(-50%, -50%);
		transition:
			width 0.6s,
			height 0.6s;
	}

	.action-button:hover::before {
		width: 300px;
		height: 300px;
	}

	.action-button.primary {
		background: linear-gradient(135deg, hsl(220, 70%, 55%) 0%, hsl(250, 70%, 60%) 100%);
		color: white;
		box-shadow: 0 4px 12px hsla(230, 70%, 55%, 0.4);
	}

	.action-button.primary:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 8px 20px hsla(230, 70%, 55%, 0.5);
	}

	.action-button.primary:active:not(:disabled) {
		transform: translateY(0);
	}

	.action-button.secondary {
		background: var(--gray-200);
		color: var(--gray-700);
		border: 1px solid var(--color-border);
	}

	:global([data-theme='dark']) .action-button.secondary {
		background: var(--gray-800);
		color: var(--gray-200);
		border-color: var(--gray-700);
	}

	.action-button.secondary:hover:not(:disabled) {
		background: var(--gray-300);
		transform: translateY(-1px);
	}

	:global([data-theme='dark']) .action-button.secondary:hover:not(:disabled) {
		background: var(--gray-700);
	}

	.action-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.info-section,
	.deploying-section,
	.success-section,
	.error-section {
		display: flex;
		flex-direction: column;
		gap: var(--space-5);
		align-items: center;
		text-align: center;
		animation: fadeInUp 0.4s ease-out;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.deploying-section :global(.spinning) {
		color: hsl(220, 70%, 55%);
		filter: drop-shadow(0 0 8px hsla(220, 70%, 55%, 0.5));
	}

	.success-section :global(svg) {
		color: hsl(120, 60%, 45%);
		filter: drop-shadow(0 0 12px hsla(120, 60%, 50%, 0.6));
		animation: successPop 0.6s ease-out;
	}

	@keyframes successPop {
		0% {
			transform: scale(0);
			opacity: 0;
		}
		50% {
			transform: scale(1.2);
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	.error-section :global(svg) {
		color: hsl(0, 70%, 55%);
		filter: drop-shadow(0 0 12px hsla(0, 70%, 50%, 0.5));
	}

	.success-section h3,
	.deploying-section h3 {
		background: linear-gradient(135deg, hsl(220, 70%, 55%) 0%, hsl(250, 70%, 60%) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
	}

	.contract-description {
		color: var(--gray-600);
		line-height: 1.6;
	}

	:global([data-theme='dark']) .contract-description {
		color: var(--gray-400);
	}

	.contract-details {
		width: 100%;
		background: var(--color-panel-2);
		padding: var(--space-4);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}

	:global([data-theme='dark']) .contract-details {
		background: rgba(255, 255, 255, 0.02);
		border-color: rgba(255, 255, 255, 0.1);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	}

	.detail-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-2);
	}

	.detail-row:last-child {
		margin-bottom: 0;
	}

	.label {
		color: var(--gray-600);
		font-size: var(--text-sm);
	}

	:global([data-theme='dark']) .label {
		color: var(--gray-400);
	}

	.value {
		font-weight: var(--font-medium);
	}

	.address-value {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.address-value code {
		font-size: var(--text-xs);
		padding: 2px 6px;
		background: var(--gray-100);
		border-radius: var(--radius-sm);
	}

	:global([data-theme='dark']) .address-value code {
		background: var(--gray-800);
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
		text-decoration: none;
	}

	.explorer-link:hover {
		background: var(--color-primary);
		color: white;
	}

	.deployment-steps {
		width: 100%;
		text-align: left;
		background: var(--color-panel-2);
		padding: var(--space-4);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
	}

	:global([data-theme='dark']) .deployment-steps {
		background: rgba(255, 255, 255, 0.02);
		border-color: rgba(255, 255, 255, 0.1);
	}

	.deployment-steps h4 {
		margin-bottom: var(--space-3);
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-800);
	}

	:global([data-theme='dark']) .deployment-steps h4 {
		color: var(--gray-200);
	}

	.deployment-steps ol {
		margin: 0;
		padding-left: var(--space-5);
		counter-reset: step-counter;
	}

	.deployment-steps li {
		margin-bottom: var(--space-3);
		position: relative;
		counter-increment: step-counter;
	}

	.deployment-steps li:last-child {
		margin-bottom: 0;
	}

	.deployment-steps li::marker {
		font-weight: var(--font-bold);
		color: hsl(220, 70%, 55%);
	}

	.deployment-steps li strong {
		display: block;
		margin-bottom: var(--space-1);
		color: var(--gray-800);
	}

	:global([data-theme='dark']) .deployment-steps li strong {
		color: var(--gray-100);
	}

	.deployment-steps li p {
		margin: 0;
		color: var(--gray-600);
		font-size: var(--text-sm);
		line-height: 1.5;
	}

	:global([data-theme='dark']) .deployment-steps li p {
		color: var(--gray-400);
	}

	.step-progress {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		background: var(--color-panel-2);
		padding: var(--space-4);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
	}

	:global([data-theme='dark']) .step-progress {
		background: rgba(255, 255, 255, 0.02);
		border-color: rgba(255, 255, 255, 0.1);
	}

	.step-item {
		display: flex;
		gap: var(--space-3);
		align-items: flex-start;
		padding: var(--space-3);
		border-radius: var(--radius-md);
		background: rgba(0, 0, 0, 0.02);
		transition: all 0.3s ease;
		opacity: 0.6;
	}

	:global([data-theme='dark']) .step-item {
		background: rgba(255, 255, 255, 0.02);
	}

	.step-item.in-progress {
		opacity: 1;
		background: hsla(220, 70%, 55%, 0.1);
		border: 2px solid hsla(220, 70%, 55%, 0.3);
	}

	.step-item.completed {
		opacity: 1;
		background: hsla(120, 60%, 50%, 0.1);
		animation: stepComplete 0.5s ease-out;
	}

	@keyframes stepComplete {
		0% {
			transform: scale(0.95);
		}
		50% {
			transform: scale(1.02);
		}
		100% {
			transform: scale(1);
		}
	}

	.step-marker {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--gray-300);
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: var(--font-bold);
		flex-shrink: 0;
		font-size: var(--text-lg);
		transition: all 0.3s ease;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	:global([data-theme='dark']) .step-marker {
		background: var(--gray-700);
	}

	.step-item.in-progress .step-marker {
		background: linear-gradient(135deg, hsl(220, 70%, 55%) 0%, hsl(250, 70%, 60%) 100%);
		color: white;
		box-shadow: 0 4px 12px hsla(220, 70%, 55%, 0.4);
	}

	.step-item.completed .step-marker {
		background: linear-gradient(135deg, hsl(120, 60%, 50%) 0%, hsl(120, 60%, 40%) 100%);
		color: white;
		box-shadow: 0 4px 12px hsla(120, 60%, 50%, 0.4);
		animation: pulse 0.5s ease-out;
	}

	@keyframes pulse {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.1);
		}
		100% {
			transform: scale(1);
		}
	}

	.step-info {
		flex: 1;
		text-align: left;
	}

	.step-info strong {
		display: block;
		margin-bottom: var(--space-1);
	}

	.step-info p {
		margin: 0;
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .step-info p {
		color: var(--gray-400);
	}

	.error-message {
		color: hsl(0, 80%, 50%);
		line-height: 1.8;
		white-space: pre-line;
		text-align: left;
		max-width: 100%;
	}

	:global([data-theme='dark']) .error-message {
		color: hsl(0, 80%, 70%);
	}

	.clear-cache-guide {
		margin: var(--space-4) 0;
		padding: var(--space-4);
		background: hsla(45, 100%, 95%, 1);
		border: 2px solid hsl(45, 100%, 50%);
		border-radius: var(--radius-md);
		width: 100%;
		text-align: left;
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

	.steps-list .step-item {
		display: flex;
		gap: var(--space-3);
		align-items: flex-start;
		opacity: 1;
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

	:global(.spinning) {
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
</style>
