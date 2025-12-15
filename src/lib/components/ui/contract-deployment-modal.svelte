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
	import type { ContractDeploymentConfig, DeploymentContext } from '$lib/types/deployment-config';
	import type { DeploymentStep } from '$lib/utils/contract-deployment';

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
				sendRawTransaction: connectStore.sendRawTransaction,
				t: i18n.t.bind(i18n)
			};

			const deployment = await config.deployFunction(context);
			steps = deployment.steps.map((step: DeploymentStep) => ({
				...step,
				completed: false,
				inProgress: false
			}));
		} catch (error) {
			console.error('Failed to initialize deployment:', error);
			errorMessage = i18n.t('tools.wallet_sweep.step2.content.deployment.errors.init_failed');
			status = 'error';
		}
	}

	async function handleDeploy() {
		if (!config.deployFunction || !connectStore.isConnected || !connectStore.address) {
			errorMessage = i18n.t(
				'tools.wallet_sweep.step2.content.deployment.errors.wallet_not_connected'
			);
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
				sendRawTransaction: connectStore.sendRawTransaction,
				t: i18n.t.bind(i18n)
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

					// Execute step with status callback
					await step.action?.((status) => {
						console.log(`[Deployment] Step ${i + 1} status:`, status.stage, status);

						// Update UI state based on transaction stage
						if (status.stage === 'signing') {
							isWaitingForSignature = true;
						} else if (status.stage === 'signed' || status.stage === 'broadcasting') {
							// Transaction signed, clear waiting state
							isWaitingForSignature = false;
						} else if (status.stage === 'confirming') {
							// Still in progress, waiting for confirmation
							isWaitingForSignature = false;
						} else if (status.stage === 'confirmed') {
							// Transaction confirmed on blockchain
							isWaitingForSignature = false;
						}
					});

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
			const hasActions = deployment.steps.some((s: DeploymentStep) => s.action);
			if (!hasActions) {
				console.log('[Deployment] No step actions found, using onDeploy');
				await deployment.onDeploy();
				steps = steps.map((step) => ({ ...step, completed: true }));
			}

			console.log('[Deployment] Deployment successful!');
			status = 'success';

			// Notify parent component immediately without closing
			console.log('[Deployment] Calling onSuccess callback');
			onSuccess();
		} catch (error) {
			console.error('[Deployment] Deployment failed:', error);
			isWaitingForSignature = false;
			status = 'error';

			// Handle different error types
			let message = i18n.t('tools.wallet_sweep.step2.content.deployment.errors.deployment_failed');
			if (error instanceof Error) {
				if (
					error.message.includes('BlockOutOfRangeError') ||
					error.message.includes('block height is') ||
					error.message.includes('nonce too high')
				) {
					if (isMetaMask()) {
						message = i18n.t('tools.wallet_sweep.step2.content.deployment.errors.metamask_cache');
						showClearCacheSteps = true;
					} else {
						message = i18n.t('tools.wallet_sweep.step2.content.deployment.errors.wallet_cache');
					}
				} else if (
					error.message.includes('Internal JSON-RPC error') ||
					error.message.includes('internal error was received')
				) {
					if (isMetaMask()) {
						message = i18n.t('tools.wallet_sweep.step2.content.deployment.errors.metamask_internal');
					} else {
						message = i18n.t('tools.wallet_sweep.step2.content.deployment.errors.wallet_internal');
					}
				} else if (
					error.message.includes('Failed to fetch') ||
					error.message.includes('fetch failed') ||
					error.message.includes('NetworkError')
				) {
					message = i18n.t('tools.wallet_sweep.step2.content.deployment.errors.connection_failed');
				} else if (error.message.includes('circuit breaker is open')) {
					message = i18n.t('tools.wallet_sweep.step2.content.deployment.errors.rpc_unavailable');
				} else if (error.message.includes('insufficient funds')) {
					message = i18n.t('tools.wallet_sweep.step2.content.deployment.errors.insufficient_funds');
				} else if (
					error.message.includes('user rejected') ||
					error.message.includes('User rejected')
				) {
					message = i18n.t('tools.wallet_sweep.step2.content.deployment.errors.user_rejected');
				} else if (
					error.message.includes('nonce too low') ||
					error.message.includes('already known')
				) {
					message = i18n.t('tools.wallet_sweep.step2.content.deployment.errors.already_deployed');
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
	title={i18n.t('tools.wallet_sweep.step2.content.deployment.modal_title', {
		contractName: config.contractName
	})}
	maxWidth="600px"
	height="fit-content"
>
	{#if status === 'idle'}
		<div class="info-section">
			<!-- <p class="contract-description">{config.description}</p> -->
			<ContractDetails
				contractAddress={config.contractAddress}
				addressLabel={i18n.t('tools.wallet_sweep.step2.content.deployment.contract_address_label')}
				{blockExplorer}
				details={[
					{
						label: i18n.t('tools.wallet_sweep.step2.content.deployment.network_label'),
						value: networkName
					}
				]}
			/>

			{#if steps.length > 0}
				<DeploymentSteps
					{steps}
					heading={i18n.t('tools.wallet_sweep.step2.content.deployment.deployment_steps_heading')}
				/>
			{/if}

			<ActionButton onclick={handleDeploy}
				>{i18n.t('tools.wallet_sweep.step2.content.deployment.start_deployment')}</ActionButton
			>
		</div>
	{:else if status === 'deploying'}
		<DeploymentProgress
			{steps}
			{isWaitingForSignature}
			title={i18n.t('tools.wallet_sweep.step2.content.deployment.deploying_contract')}
			messages={{
				waitingForSignature: i18n.t(
					'tools.wallet_sweep.step2.content.deployment.waiting_for_signature'
				),
				transactionSent: i18n.t('tools.wallet_sweep.step2.content.deployment.transaction_sent'),
				finalizing: i18n.t('tools.wallet_sweep.step2.content.deployment.finalizing'),
				confirmInWallet: i18n.t('tools.wallet_sweep.step2.content.deployment.confirm_in_wallet')
			}}
		/>
	{:else if status === 'success'}
		<DeploymentSuccess
			contractAddress={config.contractAddress}
			{blockExplorer}
			title={i18n.t('tools.wallet_sweep.step2.content.deployment.success_title')}
			description={i18n.t('tools.wallet_sweep.step2.content.deployment.success_description')}
			viewOnExplorerText={i18n.t('tools.wallet_sweep.step2.content.deployment.view_on_explorer')}
		/>
		<div class="success-actions">
			<ActionButton variant="primary" onclick={handleClose}>{i18n.t('common.done')}</ActionButton>
		</div>
	{:else if status === 'error'}
		<DeploymentError
			errorMessage={errorMessage ?? undefined}
			showClearCacheGuide={showClearCacheSteps}
			onRetry={handleRetry}
			title={i18n.t('tools.wallet_sweep.step2.content.deployment.error_title')}
		/>
	{/if}
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

	.success-actions {
		display: flex;
		justify-content: center;
		gap: var(--space-3);
		margin-top: var(--space-4);
		width: 100%;
	}
</style>
