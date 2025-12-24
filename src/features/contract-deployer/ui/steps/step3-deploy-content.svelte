<script lang="ts">
	/* eslint-disable svelte/no-useless-mustaches -- Template literal needed for JSON placeholder */
	import { useConnectStore } from '$lib/stores/connect.svelte.js';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import StepContent from '$lib/components/step/step-content.svelte';
	import { useI18n } from '@shelchin/i18n';
	import {
		calculateCreate2Address,
		parseAbiInput,
		encodeConstructorArgs,
		deployViaCreate2
	} from '../../utils/create2-deployer';
	import type { Hex, Address } from 'viem';
	import { toHex } from 'viem';
	import { Loader2, Copy, ExternalLink } from '@lucide/svelte';

	const connectStore = useConnectStore();
	const i18n = useI18n();

	// Form state
	let bytecode = $state('');
	let abiInput = $state('');
	let constructorArgsInput = $state('');
	let salt = $state('0x0000000000000000000000000000000000000000000000000000000000000000');

	// Deployment state
	let isDeploying = $state(false);
	let deploymentResult = $state<{ address: Address; txHash: string } | null>(null);
	let deploymentError = $state<string | null>(null);

	// Predicted address
	let predictedAddress = $state<Address | null>(null);
	let predictionError = $state<string | null>(null);

	// Calculate predicted address
	function calculatePredictedAddress() {
		try {
			if (!bytecode || !abiInput) {
				predictedAddress = null;
				predictionError = null;
				return;
			}

			const abi = parseAbiInput(abiInput);
			const args = constructorArgsInput ? JSON.parse(constructorArgsInput) : [];
			const initCode = encodeConstructorArgs(abi, bytecode as Hex, args);
			const saltHex = salt as Hex;

			predictedAddress = calculateCreate2Address(saltHex, initCode);
			predictionError = null;
		} catch (error) {
			predictedAddress = null;
			predictionError = error instanceof Error ? error.message : String(error);
		}
	}

	// Auto-calculate when inputs change
	$effect(() => {
		calculatePredictedAddress();
	});

	// Deploy contract
	async function handleDeploy() {
		if (!connectStore.publicClient) {
			deploymentError = 'Wallet not connected';
			return;
		}

		try {
			isDeploying = true;
			deploymentError = null;
			deploymentResult = null;

			const walletClient = await connectStore.getWalletClient();
			if (!walletClient) {
				deploymentError = 'Failed to get wallet client';
				return;
			}

			const abi = parseAbiInput(abiInput);
			const args = constructorArgsInput ? JSON.parse(constructorArgsInput) : [];
			const saltHex = salt as Hex;

			const result = await deployViaCreate2(
				walletClient,
				connectStore.publicClient,
				bytecode as Hex,
				abi,
				args,
				saltHex
			);

			deploymentResult = {
				address: result.contractAddress,
				txHash: result.transactionHash
			};
		} catch (error) {
			deploymentError = error instanceof Error ? error.message : String(error);
		} finally {
			isDeploying = false;
		}
	}

	// Copy to clipboard
	async function copyToClipboard(text: string) {
		try {
			await navigator.clipboard.writeText(text);
		} catch (error) {
			console.error('Failed to copy:', error);
		}
	}

	// Generate random salt
	function generateRandomSalt() {
		const randomBytes = crypto.getRandomValues(new Uint8Array(32));
		salt = toHex(randomBytes);
	}

	// Get block explorer URL
	const blockExplorerUrl = $derived(() => {
		if (!connectStore.currentChainId) return null;
		const network = connectStore.networks.find((n) => n.chainId === connectStore.currentChainId);
		if (!network) return null;
		return network.blockExplorer;
	});

	// Export deployment status for footer
	export function getDeploymentStatus() {
		return {
			isValid: Boolean(bytecode && abiInput && predictedAddress && !predictionError),
			isDeploying,
			deploymentResult
		};
	}
</script>

<StepContent>
	<StepContentHeader
		title={i18n.t('contract-deployer.step3.content.title')}
		description={i18n.t('contract-deployer.step3.content.description')}
	/>

	<div class="deploy-form">
		<!-- Bytecode Input -->
		<div class="form-group">
			<label for="bytecode">
				{i18n.t('contract-deployer.step3.content.bytecode_label')}
				<span class="required">*</span>
			</label>
			<textarea
				id="bytecode"
				bind:value={bytecode}
				placeholder="0x608060405234801561001057600080fd5b5060405161..."
				rows={4}
			></textarea>
			<p class="help-text">{i18n.t('contract-deployer.step3.content.bytecode_help')}</p>
		</div>

		<!-- ABI Input -->
		<div class="form-group">
			<label for="abi">
				{i18n.t('contract-deployer.step3.content.abi_label')}
				<span class="required">*</span>
			</label>
			<textarea
				id="abi"
				bind:value={abiInput}
				placeholder={'[{"inputs":[{"name":"_name","type":"string"}],"stateMutability":"nonpayable","type":"constructor"}]'}
				rows={6}
			></textarea>
			<p class="help-text">{i18n.t('contract-deployer.step3.content.abi_help')}</p>
		</div>

		<!-- Constructor Args Input -->
		<div class="form-group">
			<label for="constructor-args">
				{i18n.t('contract-deployer.step3.content.constructor_args_label')}
			</label>
			<textarea
				id="constructor-args"
				bind:value={constructorArgsInput}
				placeholder={`["MyToken", "MTK", 18]`}
				rows={3}
			></textarea>
			<p class="help-text">
				{i18n.t('contract-deployer.step3.content.constructor_args_help')}
			</p>
		</div>

		<!-- Salt Input -->
		<div class="form-group">
			<label for="salt">
				{i18n.t('contract-deployer.step3.content.salt_label')}
				<span class="required">*</span>
			</label>
			<div class="salt-input-group">
				<input
					id="salt"
					type="text"
					bind:value={salt}
					placeholder="0x0000000000000000000000000000000000000000000000000000000000000000"
				/>
				<button type="button" class="random-button" onclick={generateRandomSalt}>
					{i18n.t('contract-deployer.step3.content.generate_random')}
				</button>
			</div>
			<p class="help-text">{i18n.t('contract-deployer.step3.content.salt_help')}</p>
		</div>

		<!-- Predicted Address -->
		{#if predictedAddress}
			<div class="predicted-address">
				<h4>{i18n.t('contract-deployer.step3.content.predicted_address')}</h4>
				<div class="address-display">
					<code>{predictedAddress}</code>
					<button
						type="button"
						class="icon-button"
						onclick={() => copyToClipboard(predictedAddress!)}
					>
						<Copy size={16} />
					</button>
				</div>
			</div>
		{/if}

		{#if predictionError}
			<div class="error-box">
				<p>{predictionError}</p>
			</div>
		{/if}

		<!-- Deploy Button -->
		<button
			type="button"
			class="deploy-button"
			onclick={handleDeploy}
			disabled={isDeploying ||
				!bytecode ||
				!abiInput ||
				!predictedAddress ||
				Boolean(predictionError)}
		>
			{#if isDeploying}
				<Loader2 size={20} class="spin" />
				{i18n.t('contract-deployer.step3.content.deploying')}
			{:else}
				{i18n.t('contract-deployer.step3.content.deploy_button')}
			{/if}
		</button>

		<!-- Deployment Result -->
		{#if deploymentResult}
			<div class="success-box">
				<h4>{i18n.t('contract-deployer.step3.content.deployment_success')}</h4>
				<div class="result-item">
					<span>{i18n.t('contract-deployer.step3.content.contract_address')}:</span>
					<div class="address-display">
						<code>{deploymentResult.address}</code>
						<button
							type="button"
							class="icon-button"
							onclick={() => copyToClipboard(deploymentResult!.address)}
						>
							<Copy size={16} />
						</button>
						{#if blockExplorerUrl()}
							<a
								href="{blockExplorerUrl()}/address/{deploymentResult.address}"
								target="_blank"
								rel="noopener noreferrer"
								class="icon-button"
							>
								<ExternalLink size={16} />
							</a>
						{/if}
					</div>
				</div>
				<div class="result-item">
					<span>{i18n.t('contract-deployer.step3.content.transaction_hash')}:</span>
					<div class="address-display">
						<code>{deploymentResult.txHash}</code>
						<button
							type="button"
							class="icon-button"
							onclick={() => copyToClipboard(deploymentResult!.txHash)}
						>
							<Copy size={16} />
						</button>
						{#if blockExplorerUrl()}
							<a
								href="{blockExplorerUrl()}/tx/{deploymentResult.txHash}"
								target="_blank"
								rel="noopener noreferrer"
								class="icon-button"
							>
								<ExternalLink size={16} />
							</a>
						{/if}
					</div>
				</div>
			</div>
		{/if}

		{#if deploymentError}
			<div class="error-box">
				<h4>{i18n.t('contract-deployer.step3.content.deployment_error')}</h4>
				<p>{deploymentError}</p>
			</div>
		{/if}
	</div>
</StepContent>

<style>
	.deploy-form {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
		margin-top: var(--space-6);
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.form-group label {
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-primary);
	}

	.required {
		color: var(--color-error);
	}

	.form-group textarea,
	.form-group input[type='text'] {
		padding: var(--space-3);
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius-md);
		background: var(--color-panel-1);
		color: var(--color-text-primary);
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
		resize: vertical;
	}

	.form-group textarea:focus,
	.form-group input[type='text']:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.help-text {
		font-size: var(--font-size-xs);
		color: var(--color-text-secondary);
		margin: 0;
	}

	.salt-input-group {
		display: flex;
		gap: var(--space-2);
	}

	.salt-input-group input {
		flex: 1;
	}

	.random-button {
		padding: var(--space-2) var(--space-4);
		background: var(--color-panel-2);
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius-md);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-primary);
		cursor: pointer;
		transition: background-color 0.2s;
		white-space: nowrap;
	}

	.random-button:hover {
		background: var(--color-panel-3);
	}

	.predicted-address,
	.success-box {
		padding: var(--space-4);
		background: var(--color-success-bg);
		border: 1px solid var(--color-success);
		border-radius: var(--border-radius-md);
	}

	.predicted-address h4,
	.success-box h4 {
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
		color: var(--color-success);
		margin: 0 0 var(--space-2) 0;
	}

	.address-display {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		background: var(--color-panel-1);
		padding: var(--space-2);
		border-radius: var(--border-radius-sm);
	}

	.address-display code {
		flex: 1;
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		color: var(--color-text-primary);
		word-break: break-all;
	}

	.icon-button {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-1);
		background: transparent;
		border: none;
		color: var(--color-text-secondary);
		cursor: pointer;
		transition: color 0.2s;
	}

	.icon-button:hover {
		color: var(--color-primary);
	}

	.result-item {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		margin-top: var(--space-3);
	}

	.result-item span {
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-primary);
	}

	.deploy-button {
		padding: var(--space-3) var(--space-6);
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: var(--border-radius-md);
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-medium);
		cursor: pointer;
		transition: background-color 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
	}

	.deploy-button:hover:not(:disabled) {
		background: var(--color-primary-hover);
	}

	.deploy-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.error-box {
		padding: var(--space-4);
		background: var(--color-error-bg);
		border: 1px solid var(--color-error);
		border-radius: var(--border-radius-md);
	}

	.error-box h4 {
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
		color: var(--color-error);
		margin: 0 0 var(--space-2) 0;
	}

	.error-box p {
		font-size: var(--font-size-sm);
		color: var(--color-error);
		margin: 0;
	}

	:global(.spin) {
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
