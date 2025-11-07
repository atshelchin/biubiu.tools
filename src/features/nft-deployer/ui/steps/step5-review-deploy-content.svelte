<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import { step2State } from '../../stores/step2-state.svelte';
	import { step3State } from '../../stores/step3-state.svelte';
	import { step4State } from '../../stores/step4-state.svelte';
	import { deploymentState } from '../../stores/deployment-state.svelte';
	import { getNFTStandardInfo } from '../../utils/nft-standards';
	import { buildNFTConfig, validateNFTConfig } from '../../utils/contract-builder';
	import { deployNFTContract } from '../../utils/deployment';

	const i18n = useI18n();
	const connectStore = useConnectStore();

	const standard = $derived(
		step2State.selectedStandard ? getNFTStandardInfo(step2State.selectedStandard) : null
	);
	const basicConfig = $derived(step3State.getConfig());
	const advancedSettings = $derived(step4State.getSettings());

	// Deployment function with real contract interaction
	async function handleDeploy() {
		try {
			// Validate wallet connection
			if (!connectStore.address || !connectStore.currentChainId) {
				deploymentState.setResult({
					success: false,
					error: 'Wallet not connected',
					timestamp: Date.now()
				});
				return;
			}

			// Validate standard is selected
			if (!step2State.selectedStandard) {
				deploymentState.setResult({
					success: false,
					error: 'NFT standard not selected',
					timestamp: Date.now()
				});
				return;
			}

			deploymentState.setStatus('preparing', 'Validating configuration...');
			deploymentState.setProgress(5);

			// Build NFT configuration
			const config = buildNFTConfig(
				connectStore.address,
				connectStore.currentChainId,
				step2State.selectedStandard,
				basicConfig,
				advancedSettings
			);

			// Validate configuration
			const validation = validateNFTConfig(config);
			if (!validation.isValid) {
				deploymentState.setResult({
					success: false,
					error: `Configuration errors: ${validation.errors.join(', ')}`,
					timestamp: Date.now()
				});
				return;
			}

			// Get wallet and public clients
			const walletClient = await connectStore.getWalletClient();
			const publicClient = connectStore.getPublicClient();

			if (!walletClient || !publicClient) {
				deploymentState.setResult({
					success: false,
					error: 'Failed to get blockchain clients',
					timestamp: Date.now()
				});
				return;
			}

			// Deploy contract
			const result = await deployNFTContract(
				config,
				walletClient,
				publicClient,
				(progress, message) => {
					deploymentState.setProgress(progress);
					deploymentState.setStatus('deploying', message);
				}
			);

			// Set deployment result
			deploymentState.setResult(result);
		} catch (error) {
			console.error('Deployment error:', error);
			deploymentState.setResult({
				success: false,
				error: error instanceof Error ? error.message : 'Unknown deployment error',
				timestamp: Date.now()
			});
		}
	}
</script>

<div class="step-content">
	<StepContentHeader
		title={i18n.t('tools.nft_deployer.step5.content.title')}
		description={i18n.t('tools.nft_deployer.step5.content.description')}
	/>

	{#if deploymentState.isCompleted && deploymentState.result?.success}
		<!-- Success State -->
		<div class="success-card">
			<div class="success-icon">✓</div>
			<h3 class="success-title">{i18n.t('tools.nft_deployer.step5.content.success_title')}</h3>
			<p class="success-message">
				{i18n.t('tools.nft_deployer.step5.content.success_message')}
			</p>

			<div class="result-details">
				<div class="detail-row">
					<span class="detail-label">{i18n.t('common.contract_address')}:</span>
					<span class="detail-value mono">{deploymentState.result.contractAddress}</span>
				</div>
				<div class="detail-row">
					<span class="detail-label">{i18n.t('common.transaction_hash')}:</span>
					<span class="detail-value mono">{deploymentState.result.transactionHash}</span>
				</div>
				<div class="detail-row">
					<span class="detail-label">{i18n.t('common.gas_used')}:</span>
					<span class="detail-value">{deploymentState.result.gasUsed?.toString()}</span>
				</div>
				<div class="detail-row">
					<span class="detail-label">{i18n.t('common.deployment_cost')}:</span>
					<span class="detail-value">{deploymentState.result.deploymentCost} ETH</span>
				</div>
			</div>
		</div>
	{:else}
		<!-- Review State -->
		<div class="review-container">
			<!-- Standard -->
			{#if standard}
				<div class="review-section">
					<h3 class="section-title">{i18n.t('tools.nft_deployer.step5.content.nft_standard')}</h3>
					<div class="review-card">
						<div class="review-item">
							<span class="item-label">{i18n.t('common.standard')}:</span>
							<span class="item-value">{standard.name}</span>
						</div>
						<div class="review-item">
							<span class="item-label">{i18n.t('common.description')}:</span>
							<span class="item-value">{standard.description}</span>
						</div>
					</div>
				</div>
			{/if}

			<!-- Basic Configuration -->
			<div class="review-section">
				<h3 class="section-title">{i18n.t('tools.nft_deployer.step5.content.basic_config')}</h3>
				<div class="review-card">
					<div class="review-item">
						<span class="item-label">{i18n.t('common.name')}:</span>
						<span class="item-value">{basicConfig.name}</span>
					</div>
					<div class="review-item">
						<span class="item-label">{i18n.t('common.symbol')}:</span>
						<span class="item-value">{basicConfig.symbol}</span>
					</div>
					<div class="review-item">
						<span class="item-label">{i18n.t('common.description')}:</span>
						<span class="item-value">{basicConfig.description}</span>
					</div>
					{#if basicConfig.baseUri}
						<div class="review-item">
							<span class="item-label">Base URI:</span>
							<span class="item-value truncate">{basicConfig.baseUri}</span>
						</div>
					{/if}
				</div>
			</div>

			<!-- Advanced Settings -->
			<div class="review-section">
				<h3 class="section-title">
					{i18n.t('tools.nft_deployer.step5.content.advanced_settings')}
				</h3>
				<div class="review-card">
					{#if advancedSettings.maxSupply}
						<div class="review-item">
							<span class="item-label">{i18n.t('common.max_supply')}:</span>
							<span class="item-value">{advancedSettings.maxSupply.toLocaleString()}</span>
						</div>
					{/if}
					{#if advancedSettings.mintPrice}
						<div class="review-item">
							<span class="item-label">{i18n.t('common.mint_price')}:</span>
							<span class="item-value">{advancedSettings.mintPrice} ETH</span>
						</div>
					{/if}
					{#if advancedSettings.royaltyEnabled}
						<div class="review-item">
							<span class="item-label">{i18n.t('common.royalty')}:</span>
							<span class="item-value"
								>{advancedSettings.royaltyPercentage}% to {advancedSettings.royaltyRecipient}</span
							>
						</div>
					{/if}
				</div>

				{#if advancedSettings.pausable || advancedSettings.burnable || advancedSettings.revealable}
					<div class="features-tags">
						{#if advancedSettings.pausable}
							<span class="feature-tag">Pausable</span>
						{/if}
						{#if advancedSettings.burnable}
							<span class="feature-tag">Burnable</span>
						{/if}
						{#if advancedSettings.revealable}
							<span class="feature-tag">Revealable</span>
						{/if}
					</div>
				{/if}
			</div>

			<!-- Deploy Button -->
			{#if !deploymentState.isDeploying}
				<button class="deploy-button" onclick={handleDeploy} disabled={deploymentState.isDeploying}>
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path
							d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
						/>
						<polyline points="3.27 6.96 12 12.01 20.73 6.96" />
						<line x1="12" y1="22.08" x2="12" y2="12" />
					</svg>
					<span>{i18n.t('tools.nft_deployer.step5.content.deploy_button')}</span>
				</button>
			{/if}
		</div>
	{/if}
</div>

<style>
	.step-content {
		padding: var(--space-6);
	}

	.review-container {
		max-width: 800px;
		margin: var(--space-6) auto 0;
	}

	.review-section {
		margin-bottom: var(--space-6);
	}

	.section-title {
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		color: var(--gray-900);
		margin: 0 0 var(--space-4) 0;
	}

	:global([data-theme='dark']) .section-title {
		color: var(--gray-100);
	}

	.review-card {
		padding: var(--space-5);
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-lg);
	}

	.review-item {
		display: grid;
		grid-template-columns: 150px 1fr;
		gap: var(--space-4);
		padding: var(--space-3) 0;
		border-bottom: 1px solid var(--color-border);
	}

	.review-item:last-child {
		border-bottom: none;
	}

	.item-label {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-600);
	}

	.item-value {
		font-size: var(--text-sm);
		color: var(--gray-900);
		word-break: break-word;
	}

	.item-value.truncate {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.item-value.mono {
		font-family: 'Courier New', monospace;
		font-size: var(--text-xs);
	}

	:global([data-theme='dark']) .item-label {
		color: var(--gray-400);
	}

	:global([data-theme='dark']) .item-value {
		color: var(--gray-100);
	}

	.features-tags {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		margin-top: var(--space-4);
	}

	.feature-tag {
		padding: var(--space-2) var(--space-3);
		background: var(--green-100);
		color: var(--green-700);
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		border-radius: var(--radius-md);
	}

	:global([data-theme='dark']) .feature-tag {
		background: hsla(142, 71%, 45%, 0.2);
		color: var(--green-400);
	}

	.deploy-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-3);
		width: 100%;
		max-width: 400px;
		min-height: 64px;
		margin: var(--space-8) auto 0;
		padding: var(--space-4) var(--space-6);
		background: linear-gradient(135deg, hsl(142, 71%, 45%), hsl(142, 71%, 35%));
		color: white;
		border: none;
		border-radius: var(--radius-lg);
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 12px hsla(142, 71%, 45%, 0.3);
	}

	.deploy-button:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 8px 24px hsla(142, 71%, 45%, 0.4);
	}

	.deploy-button:active:not(:disabled) {
		transform: translateY(0);
	}

	.deploy-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Success State */
	.success-card {
		max-width: 600px;
		margin: var(--space-8) auto;
		padding: var(--space-8);
		background: linear-gradient(to bottom, hsla(142, 71%, 45%, 0.1), var(--color-panel-1));
		border: 2px solid var(--green-500);
		border-radius: var(--radius-lg);
		text-align: center;
	}

	.success-icon {
		width: 80px;
		height: 80px;
		margin: 0 auto var(--space-4);
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--green-600);
		color: white;
		font-size: 48px;
		border-radius: 50%;
		box-shadow: 0 4px 12px hsla(142, 71%, 45%, 0.3);
	}

	.success-title {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--green-700);
		margin: 0 0 var(--space-2) 0;
	}

	:global([data-theme='dark']) .success-title {
		color: var(--green-400);
	}

	.success-message {
		font-size: var(--text-base);
		color: var(--gray-600);
		margin: 0 0 var(--space-6) 0;
	}

	:global([data-theme='dark']) .success-message {
		color: var(--gray-400);
	}

	.result-details {
		text-align: left;
		padding: var(--space-4);
		background: var(--color-panel-1);
		border-radius: var(--radius-md);
	}

	.detail-row {
		display: grid;
		grid-template-columns: 150px 1fr;
		gap: var(--space-3);
		padding: var(--space-3) 0;
		border-bottom: 1px solid var(--color-border);
	}

	.detail-row:last-child {
		border-bottom: none;
	}

	.detail-label {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-600);
	}

	.detail-value {
		font-size: var(--text-sm);
		color: var(--gray-900);
		word-break: break-all;
	}

	:global([data-theme='dark']) .detail-label {
		color: var(--gray-400);
	}

	:global([data-theme='dark']) .detail-value {
		color: var(--gray-100);
	}

	@media (max-width: 640px) {
		.step-content {
			padding: var(--space-3);
		}

		.review-item,
		.detail-row {
			grid-template-columns: 1fr;
			gap: var(--space-1);
		}
	}
</style>
