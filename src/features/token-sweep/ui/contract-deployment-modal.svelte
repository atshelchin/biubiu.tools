<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import { useI18n } from '@shelchin/i18n';
	import Modal from '@/lib/components/ui/modal.svelte';
	import ContractDetails from '@/lib/components/ui/contract-details.svelte';
	import DeploymentSteps from '@/lib/components/ui/deployment-steps.svelte';
	import DeploymentSuccess from '@/lib/components/ui/deployment-success.svelte';
	import DeploymentError from '@/lib/components/ui/deployment-error.svelte';
	import DeploymentProgress from '@/lib/components/ui/deployment-progress.svelte';
	import ActionButton from '@/lib/components/ui/action-button.svelte';
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
	const i18n = useI18n();

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
	let isWaitingForSignature = $state(false); // Waiting for user to sign in wallet
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
			isWaitingForSignature = false;
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

					// Mark step as in progress and waiting for user signature
					isWaitingForSignature = true;
					steps = steps.map((s, idx) =>
						idx === i ? { ...s, inProgress: true, completed: false } : s
					);

					await step.action();

					// Transaction sent, no longer waiting for signature
					isWaitingForSignature = false;

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
			isWaitingForSignature = false;
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

<Modal
	open={show}
	onClose={handleClose}
	title="Deploy {config.contractName}"
	maxWidth="600px"
	height="fit-content"
>
	{#snippet children()}
		{#if status === 'idle'}
			<div class="info-section">
				<p class="contract-description">{config.description}</p>
				<ContractDetails
					contractAddress={config.contractAddress}
					{blockExplorer}
					details={[{ label: 'Network:', value: networkName }]}
				/>

				{#if steps.length > 0}
					<DeploymentSteps {steps} />
				{/if}

				<ActionButton onclick={handleDeploy}>Start Deployment</ActionButton>
			</div>
		{:else if status === 'deploying'}
			<DeploymentProgress
				{steps}
				{isWaitingForSignature}
				title={i18n.t('tools.token_sweep.step2.content.deployment.deploying_contract')}
				messages={{
					waitingForSignature: i18n.t(
						'tools.token_sweep.step2.content.deployment.waiting_for_signature'
					),
					transactionSent: i18n.t('tools.token_sweep.step2.content.deployment.transaction_sent'),
					finalizing: i18n.t('tools.token_sweep.step2.content.deployment.finalizing'),
					confirmInWallet: i18n.t('tools.token_sweep.step2.content.deployment.confirm_in_wallet')
				}}
			/>
		{:else if status === 'success'}
			<DeploymentSuccess contractAddress={config.contractAddress} {blockExplorer} />
		{:else if status === 'error'}
			<DeploymentError
				errorMessage={errorMessage ?? undefined}
				showClearCacheGuide={showClearCacheSteps}
				onRetry={handleRetry}
			/>
		{/if}
	{/snippet}
</Modal>

<style>
	.info-section {
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

	.contract-description {
		color: var(--gray-600);
		line-height: 1.6;
	}

	:global([data-theme='dark']) .contract-description {
		color: var(--gray-400);
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
