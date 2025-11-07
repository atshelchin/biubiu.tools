<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import { step3State } from '@/features/token-distribution/stores/step3-state.svelte';
	import { step4State } from '@/features/token-distribution/stores/step4-state.svelte';
	import {
		buildDistributionTransactions,
		calculateTotalAmount,
		estimateTotalGas
	} from '@/features/token-distribution/utils/distribution-builder';
	import { formatUnits } from 'viem';
	import type { Address } from 'viem';
	import type { DistributionConfig } from '@/features/token-distribution/types/distribution';

	const connectStore = useConnectStore();

	let isExecuting = $state(false);
	let executionProgress = $state(0);
	let executionStatus = $state('');

	const currentNetwork = $derived(
		connectStore.currentChainId
			? connectStore.networks.find((n) => n.chainId === connectStore.currentChainId)
			: undefined
	);

	const distributionConfig = $derived(() => {
		if (!step3State.selectedToken || !connectStore.address || !connectStore.currentChainId)
			return null;

		const config: DistributionConfig = {
			sourceWallet: connectStore.address as Address,
			token: step3State.selectedToken,
			amountMode: step3State.amountMode,
			amountPerRecipient: step3State.amountPerRecipient,
			recipients: step4State.recipients,
			chainId: connectStore.currentChainId,
			gasLimit: step3State.selectedToken.type === 'native' ? BigInt(21000) : BigInt(65000)
		};

		return config;
	});

	const transactions = $derived(() => {
		if (!distributionConfig()) return [];
		return buildDistributionTransactions(distributionConfig()!);
	});

	const totalAmount = $derived(() => {
		if (!distributionConfig()) return '0';
		return calculateTotalAmount(distributionConfig()!);
	});

	const estimatedGas = $derived(() => {
		if (!transactions().length) return '0';
		const gasPrice = BigInt(30) * BigInt(1e9); // 30 gwei estimate
		const total = estimateTotalGas(transactions(), gasPrice);
		return formatUnits(total, 18);
	});

	async function executeDistribution() {
		if (!connectStore.isConnected) {
			alert('Wallet not connected');
			return;
		}

		isExecuting = true;
		executionProgress = 0;
		executionStatus = 'Preparing transactions...';

		try {
			const txs = transactions();
			const totalTxs = txs.length;

			for (let i = 0; i < txs.length; i++) {
				const tx = txs[i];
				executionStatus = `Sending to ${tx.recipient.address.slice(0, 6)}...${tx.recipient.address.slice(-4)} (${i + 1}/${totalTxs})`;

				// Send transaction using sendTransaction method
				const hash = await connectStore.sendTransaction({
					to: tx.to,
					value: tx.value || BigInt(0),
					data: tx.data || '0x',
					gas: tx.gasLimit
				});

				console.log(`Transaction ${i + 1} sent: ${hash}`);

				executionProgress = Math.round(((i + 1) / totalTxs) * 100);
			}

			executionStatus = 'Distribution complete!';
			alert('Distribution completed successfully!');
		} catch (error) {
			console.error('Distribution failed:', error);
			executionStatus = 'Distribution failed';
			alert(`Distribution failed: ${error instanceof Error ? error.message : String(error)}`);
		} finally {
			isExecuting = false;
		}
	}
</script>

<div class="step-content">
	<StepContentHeader
		title="Review Distribution"
		description="Confirm the details and execute token distribution"
	/>

	<!-- Distribution Summary -->
	<div class="summary-section">
		<h3 class="section-title">Distribution Summary</h3>
		<div class="summary-grid">
			<div class="summary-card">
				<div class="summary-label">Token</div>
				<div class="summary-value">
					{step3State.selectedToken?.symbol} ({step3State.selectedToken?.name})
				</div>
			</div>
			<div class="summary-card">
				<div class="summary-label">Mode</div>
				<div class="summary-value">
					{step3State.amountMode === 'equal' ? 'Equal Distribution' : 'Custom Amounts'}
				</div>
			</div>
			<div class="summary-card">
				<div class="summary-label">Recipients</div>
				<div class="summary-value">{step4State.totalRecipients}</div>
			</div>
			<div class="summary-card">
				<div class="summary-label">Total Amount</div>
				<div class="summary-value highlighted">
					{totalAmount()}
					{step3State.selectedToken?.symbol}
				</div>
			</div>
			<div class="summary-card">
				<div class="summary-label">Estimated Gas</div>
				<div class="summary-value">{estimatedGas()} ETH</div>
			</div>
			<div class="summary-card">
				<div class="summary-label">Network</div>
				<div class="summary-value">{currentNetwork?.name}</div>
			</div>
		</div>
	</div>

	<!-- Recipients Preview -->
	<div class="recipients-section">
		<h3 class="section-title">Recipients Preview (showing first 10)</h3>
		<div class="recipients-preview">
			{#each step4State.recipients.slice(0, 10) as recipient (recipient.id)}
				<div class="recipient-row">
					<div class="recipient-address">{recipient.address}</div>
					<div class="recipient-amount">
						{step3State.amountMode === 'custom' ? recipient.amount : step3State.amountPerRecipient}
						{step3State.selectedToken?.symbol}
					</div>
				</div>
			{/each}
			{#if step4State.totalRecipients > 10}
				<div class="more-recipients">+{step4State.totalRecipients - 10} more recipients</div>
			{/if}
		</div>
	</div>

	<!-- Execute Button -->
	<div class="execute-section">
		<button class="execute-button" onclick={executeDistribution} disabled={isExecuting}>
			{isExecuting ? 'Executing...' : 'Execute Distribution'}
		</button>
		{#if isExecuting}
			<div class="progress-section">
				<div class="progress-bar">
					<div class="progress-fill" style="width: {executionProgress}%"></div>
				</div>
				<p class="progress-text">{executionStatus}</p>
			</div>
		{/if}
	</div>

	<div class="warning-box">
		<p>
			<strong>Important:</strong> Make sure you have sufficient balance and gas fees. Each recipient
			will receive a separate transaction. Review all details carefully before executing.
		</p>
	</div>
</div>

<style>
	.step-content {
		padding: var(--space-6);
	}

	.summary-section,
	.recipients-section,
	.execute-section {
		margin-bottom: var(--space-8);
	}

	.section-title {
		margin: 0 0 var(--space-4) 0;
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .section-title {
		color: var(--gray-100);
	}

	/* Summary Grid */
	.summary-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: var(--space-3);
	}

	.summary-card {
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
	}

	.summary-label {
		font-size: var(--text-sm);
		color: var(--gray-600);
		margin-bottom: var(--space-1);
	}

	:global([data-theme='dark']) .summary-label {
		color: var(--gray-400);
	}

	.summary-value {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .summary-value {
		color: var(--gray-100);
	}

	.summary-value.highlighted {
		color: hsl(210, 100%, 50%);
		font-size: var(--text-2xl);
	}

	/* Recipients Preview */
	.recipients-preview {
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		overflow: hidden;
	}

	.recipient-row {
		padding: var(--space-3);
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid var(--color-border);
	}

	.recipient-row:last-child {
		border-bottom: none;
	}

	.recipient-address {
		font-family: monospace;
		font-size: var(--text-sm);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .recipient-address {
		color: var(--gray-100);
	}

	.recipient-amount {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .recipient-amount {
		color: var(--gray-300);
	}

	.more-recipients {
		padding: var(--space-3);
		text-align: center;
		font-size: var(--text-sm);
		color: var(--gray-600);
		font-style: italic;
	}

	:global([data-theme='dark']) .more-recipients {
		color: var(--gray-400);
	}

	/* Execute Section */
	.execute-button {
		width: 100%;
		padding: var(--space-4) var(--space-6);
		background: linear-gradient(135deg, hsl(210, 100%, 50%), hsl(210, 100%, 40%));
		color: white;
		border: none;
		border-radius: var(--radius-lg);
		font-size: var(--text-xl);
		font-weight: var(--font-bold);
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 12px hsla(210, 100%, 50%, 0.3);
	}

	.execute-button:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 8px 24px hsla(210, 100%, 50%, 0.4);
	}

	.execute-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.progress-section {
		margin-top: var(--space-4);
	}

	.progress-bar {
		width: 100%;
		height: 32px;
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, hsl(210, 100%, 50%), hsl(210, 100%, 40%));
		transition: width 0.3s ease;
	}

	.progress-text {
		margin-top: var(--space-2);
		text-align: center;
		font-size: var(--text-sm);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .progress-text {
		color: var(--gray-300);
	}

	/* Warning Box */
	.warning-box {
		margin-top: var(--space-6);
		padding: var(--space-4);
		background: hsla(40, 100%, 95%, 1);
		border: 1px solid hsla(40, 100%, 80%, 1);
		border-radius: var(--radius-md);
	}

	:global([data-theme='dark']) .warning-box {
		background: hsla(40, 100%, 10%, 0.3);
		border-color: hsla(40, 100%, 30%, 1);
	}

	.warning-box p {
		margin: 0;
		font-size: var(--text-sm);
		color: var(--gray-700);
		line-height: 1.5;
	}

	:global([data-theme='dark']) .warning-box p {
		color: var(--gray-300);
	}

	@media (max-width: 640px) {
		.step-content {
			padding: var(--space-3);
		}

		.summary-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
