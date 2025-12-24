<script lang="ts">
	import { useI18n } from '@shelchin/i18n';
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import StepContent from '$lib/components/step/step-content.svelte';
	import { step3State } from '@/features/token-distribution/stores/step3-state.svelte';
	import { step4State } from '@/features/token-distribution/stores/step4-state.svelte';
	import { useDistributionExecutor } from '@/features/token-distribution/composables/use-distribution-executor.svelte';
	import { useDelegatedExecutor } from '@/features/token-distribution/composables/use-delegated-executor.svelte';
	import {
		buildDistributionTransactions,
		calculateTotalAmount,
		estimateTotalGas,
		getGasLimitForTokenType
	} from '@/features/token-distribution/utils/distribution-builder';
	import { getActiveSessions } from '@/features/token-distribution/utils/session-storage';
	import type { StoredSession } from '@/features/token-distribution/utils/session-storage';
	import { formatUnits } from 'viem';
	import type { Address } from 'viem';
	import type {
		DistributionConfig,
		ExecutionMode
	} from '@/features/token-distribution/types/distribution';
	import {
		AlertCircle,
		CheckCircle2,
		Play,
		Pause,
		RotateCcw,
		Loader2,
		Check,
		X,
		History
	} from '@lucide/svelte';
	import { fade } from 'svelte/transition';
	import ExecutorWallet from '@/features/token-distribution/ui/components/executor-wallet.svelte';
	import ExecutionModeSelector from '@/features/token-distribution/ui/components/execution-mode-selector.svelte';
	import SessionManager from '@/features/token-distribution/ui/components/session-manager.svelte';

	const i18n = useI18n();
	const connectStore = useConnectStore();

	// Execution mode state
	let executionMode = $state<ExecutionMode>('self');
	let showSessionManager = $state(false);
	let activeSessions = $state(getActiveSessions());

	// Initialize the distribution executor composable (for self-execution mode)
	const executor = useDistributionExecutor({
		getSendTransaction: () => connectStore.sendTransaction.bind(connectStore),
		getWaitForTransaction: () => connectStore.waitForTransaction.bind(connectStore)
	});

	// Initialize the delegated executor composable (for delegated mode)
	const delegatedExecutor = useDelegatedExecutor({
		getSignTypedData: () => async (params) => {
			const walletClient = await connectStore.getWalletClient();
			return walletClient.signTypedData(params);
		},
		getSendTransaction: () => connectStore.sendTransaction.bind(connectStore),
		getWaitForTransaction: () => connectStore.waitForTransaction.bind(connectStore)
	});

	// Helper function to refresh active sessions
	function refreshActiveSessions() {
		activeSessions = getActiveSessions();
	}

	// Derived state
	const currentNetwork = $derived(
		connectStore.currentChainId
			? connectStore.networks.find((n) => n.chainId === connectStore.currentChainId)
			: undefined
	);

	const distributionConfig = $derived.by((): DistributionConfig | null => {
		if (!step3State.selectedToken || !connectStore.address || !connectStore.currentChainId) {
			return null;
		}

		return {
			sourceWallet: connectStore.address as Address,
			token: step3State.selectedToken,
			amountMode: step3State.amountMode,
			amountPerRecipient: step3State.amountPerRecipient,
			recipients: step4State.recipients,
			chainId: connectStore.currentChainId,
			gasLimit: getGasLimitForTokenType(step3State.selectedToken.type)
		};
	});

	const transactions = $derived.by(() => {
		if (!distributionConfig) return [];
		return buildDistributionTransactions(distributionConfig);
	});

	const totalAmount = $derived.by(() => {
		if (!distributionConfig) return '0';
		return calculateTotalAmount(distributionConfig);
	});

	const estimatedGas = $derived.by(() => {
		if (!transactions.length) return '0';
		const gasPrice = BigInt(30) * BigInt(1e9); // 30 gwei estimate
		const total = estimateTotalGas(transactions, gasPrice);
		return formatUnits(total, 18);
	});

	const isNFT = $derived(
		step3State.selectedToken?.type === 'erc721' || step3State.selectedToken?.type === 'erc1155'
	);

	const amountModeLabel = $derived.by(() => {
		switch (step3State.amountMode) {
			case 'equal':
				return i18n.t('one-to-many-transfer.step5.content.mode_equal');
			case 'random':
				return i18n.t('one-to-many-transfer.step5.content.mode_random');
			case 'custom':
				return i18n.t('one-to-many-transfer.step5.content.mode_custom');
			default:
				return step3State.amountMode;
		}
	});

	// Self-execution mode derived state
	const canExecute = $derived(
		Boolean(connectStore.isConnected) &&
			Boolean(distributionConfig) &&
			transactions.length > 0 &&
			!executor.isExecuting
	);

	const canResume = $derived(executor.canResume && !executor.isExecuting);

	// Delegated mode derived state
	const canAuthorize = $derived(
		Boolean(connectStore.isConnected) &&
			Boolean(distributionConfig) &&
			step4State.totalRecipients > 0 &&
			!delegatedExecutor.isAuthorizing &&
			!delegatedExecutor.session
	);

	const canExecuteDelegated = $derived(
		Boolean(connectStore.isConnected) &&
			Boolean(delegatedExecutor.session) &&
			delegatedExecutor.pendingBatches > 0 &&
			!delegatedExecutor.isExecuting
	);

	// Check if execution is in progress (either mode)
	const isAnyExecutionInProgress = $derived(
		executor.isExecuting || delegatedExecutor.isAuthorizing || delegatedExecutor.isExecuting
	);

	// Self-execution handlers
	async function handleExecute() {
		if (!distributionConfig) {
			alert(i18n.t('one-to-many-transfer.step5.content.errors.invalid_config'));
			return;
		}

		// Confirmation dialog
		const confirmMsg = executor.buildConfirmationMessage(distributionConfig, currentNetwork?.name);
		const detailsText = confirmMsg.details.join('\n• ');
		if (
			!confirm(
				`${confirmMsg.title}\n\n• ${detailsText}\n\n${confirmMsg.warning}\n\n${i18n.t('one-to-many-transfer.step5.content.confirm_continue')}`
			)
		) {
			return;
		}

		await executor.execute(distributionConfig);
	}

	async function handleResume() {
		if (!distributionConfig) return;
		await executor.resume(distributionConfig);
	}

	function handleStop() {
		executor.stop();
	}

	function handleReset() {
		executor.reset();
		delegatedExecutor.reset();
	}

	// Delegated mode handlers
	async function handleAuthorize() {
		if (!distributionConfig || !connectStore.currentChainId) {
			alert(i18n.t('one-to-many-transfer.step5.content.errors.invalid_config'));
			return;
		}

		const result = await delegatedExecutor.authorize(distributionConfig);

		if (!result.success) {
			alert(result.error);
		}

		// Refresh sessions list
		refreshActiveSessions();
	}

	async function handleExecuteBatch(batchIndex: number) {
		const result = await delegatedExecutor.executeBatch(batchIndex);
		if (!result.success) {
			alert(result.error);
		}
		refreshActiveSessions();
	}

	async function handleExecuteAllBatches() {
		const result = await delegatedExecutor.executeAll();
		if (!result.success) {
			alert(result.error);
		}
		refreshActiveSessions();
	}

	function handleResetDelegated() {
		delegatedExecutor.reset();
	}

	// Session management handlers
	function handleSessionResume(session: StoredSession) {
		delegatedExecutor.importSession(session);
		executionMode = 'delegated';
		showSessionManager = false;
	}

	function getRecipientAmount(recipient: (typeof step4State.recipients)[0]): string {
		if (isNFT) {
			return `#${recipient.tokenId?.toString() || '?'}`;
		}
		if (step3State.amountMode === 'custom' || step3State.amountMode === 'random') {
			return recipient.amount || '0';
		}
		return step3State.amountPerRecipient;
	}
</script>

<StepContent>
	<StepContentHeader
		title={i18n.t('one-to-many-transfer.step5.content.title')}
		description={i18n.t('one-to-many-transfer.step5.content.description')}
	/>

	<!-- Error Banner -->
	{#if executor.errorMessage || delegatedExecutor.errorMessage}
		<div class="error-banner" transition:fade>
			<AlertCircle size={20} />
			<span>{executor.errorMessage || delegatedExecutor.errorMessage}</span>
			<button class="dismiss-btn" onclick={handleReset}>
				<X size={16} />
			</button>
		</div>
	{/if}

	<!-- Session Manager Toggle -->
	{#if activeSessions.length > 0}
		<button class="session-toggle" onclick={() => (showSessionManager = !showSessionManager)}>
			<History size={18} />
			<span>{i18n.t('one-to-many-transfer.step5.session.title')}</span>
			<span class="session-badge">{activeSessions.length}</span>
		</button>
	{/if}

	<!-- Session Manager Panel -->
	{#if showSessionManager}
		<div class="session-panel" transition:fade>
			<SessionManager onResume={handleSessionResume} onClose={() => (showSessionManager = false)} />
		</div>
	{/if}

	<!-- Execution Mode Selector -->
	<div class="mode-section">
		<h3 class="section-title">
			{i18n.t('one-to-many-transfer.step5.mode.title')}
		</h3>
		<ExecutionModeSelector bind:value={executionMode} disabled={isAnyExecutionInProgress} />
	</div>

	<!-- Executor Wallet -->
	{#if connectStore.address && connectStore.currentChainId}
		<div class="wallet-section">
			<h3 class="section-title">
				{i18n.t('one-to-many-transfer.step5.content.executor_wallet')}
			</h3>
			<ExecutorWallet
				address={connectStore.address}
				network={currentNetwork}
				chainId={connectStore.currentChainId}
				connectorIcon={connectStore.connectorIcon}
				balanceSymbol={currentNetwork?.symbol || 'ETH'}
			/>
		</div>
	{/if}

	<!-- Distribution Summary -->
	<div class="summary-section">
		<h3 class="section-title">
			{i18n.t('one-to-many-transfer.step5.content.summary_title')}
		</h3>
		<div class="summary-grid">
			<div class="summary-card">
				<div class="summary-label">
					{i18n.t('one-to-many-transfer.step5.content.token')}
				</div>
				<div class="summary-value">
					{step3State.selectedToken?.symbol} ({step3State.selectedToken?.name})
				</div>
			</div>
			<div class="summary-card">
				<div class="summary-label">
					{i18n.t('one-to-many-transfer.step5.content.mode')}
				</div>
				<div class="summary-value">
					{amountModeLabel}
				</div>
			</div>
			<div class="summary-card">
				<div class="summary-label">
					{i18n.t('one-to-many-transfer.step5.content.recipients')}
				</div>
				<div class="summary-value">{step4State.totalRecipients}</div>
			</div>
			<div class="summary-card">
				<div class="summary-label">
					{isNFT
						? i18n.t('one-to-many-transfer.step5.content.total_nfts')
						: i18n.t('one-to-many-transfer.step5.content.total_amount')}
				</div>
				<div class="summary-value highlighted">
					{totalAmount}
					{isNFT ? 'NFTs' : step3State.selectedToken?.symbol}
				</div>
			</div>
			<div class="summary-card">
				<div class="summary-label">
					{i18n.t('one-to-many-transfer.step5.content.estimated_gas')}
				</div>
				<div class="summary-value">{estimatedGas} {currentNetwork?.symbol || 'ETH'}</div>
			</div>
			<div class="summary-card">
				<div class="summary-label">
					{i18n.t('one-to-many-transfer.step5.content.network')}
				</div>
				<div class="summary-value">{currentNetwork?.name}</div>
			</div>
		</div>
	</div>

	<!-- Recipients Preview -->
	<div class="recipients-section">
		<h3 class="section-title">
			{i18n.t('one-to-many-transfer.step5.content.preview_title')}
		</h3>
		<div class="recipients-preview">
			{#each step4State.recipients.slice(0, 10) as recipient (recipient.id)}
				{@const result = executor.results.find((r) => r.recipientAddress === recipient.address)}
				<div
					class="recipient-row"
					class:success={result?.success}
					class:failed={result && !result.success}
				>
					<div class="recipient-address">
						{recipient.label || recipient.address}
					</div>
					<div class="recipient-amount">
						{getRecipientAmount(recipient)}
						{!isNFT ? step3State.selectedToken?.symbol : ''}
					</div>
					{#if result}
						<div class="recipient-status">
							{#if result.success}
								<Check size={16} class="status-icon success" />
							{:else}
								<X size={16} class="status-icon failed" />
							{/if}
						</div>
					{/if}
				</div>
			{/each}
			{#if step4State.totalRecipients > 10}
				<div class="more-recipients">
					+{step4State.totalRecipients - 10}
					{i18n.t('one-to-many-transfer.step5.content.more_recipients')}
				</div>
			{/if}
		</div>
	</div>

	<!-- Execution Progress -->
	{#if executor.isExecuting || executor.progress.phase !== 'idle'}
		<div class="progress-section" transition:fade>
			<h3 class="section-title">
				{i18n.t('one-to-many-transfer.step5.content.progress_title')}
			</h3>
			<div class="progress-bar">
				<div
					class="progress-fill"
					class:error={executor.progress.phase === 'error'}
					class:paused={executor.progress.phase === 'paused'}
					style="width: {executor.progress.percentage}%"
				></div>
			</div>
			<div class="progress-info">
				<span class="progress-text">{executor.progress.message}</span>
				<span class="progress-count">
					{executor.progress.currentIndex}/{executor.progress.totalCount}
				</span>
			</div>

			<!-- Results Summary -->
			{#if executor.summary.success > 0 || executor.summary.failed > 0}
				<div class="results-summary">
					<span class="result-item success">
						<Check size={14} />
						{executor.summary.success}
						{i18n.t('one-to-many-transfer.step5.content.successful')}
					</span>
					{#if executor.summary.failed > 0}
						<span class="result-item failed">
							<X size={14} />
							{executor.summary.failed}
							{i18n.t('one-to-many-transfer.step5.content.failed')}
						</span>
					{/if}
					{#if executor.summary.pending > 0}
						<span class="result-item pending">
							{executor.summary.pending}
							{i18n.t('one-to-many-transfer.step5.content.pending')}
						</span>
					{/if}
				</div>
			{/if}
		</div>
	{/if}

	<!-- Action Buttons - Self Execution Mode -->
	{#if executionMode === 'self'}
		<div class="action-section">
			{#if executor.isExecuting}
				<button class="action-button stop" onclick={handleStop}>
					<Pause size={20} />
					{i18n.t('one-to-many-transfer.step5.content.stop')}
				</button>
			{:else if canResume}
				<button class="action-button resume" onclick={handleResume}>
					<RotateCcw size={20} />
					{i18n.t('one-to-many-transfer.step5.content.resume')}
				</button>
				<button class="action-button secondary" onclick={handleReset}>
					{i18n.t('one-to-many-transfer.step5.content.reset')}
				</button>
			{:else if executor.progress.phase === 'completed'}
				<div class="completed-banner">
					<CheckCircle2 size={24} />
					<span>{i18n.t('one-to-many-transfer.step5.content.completed')}</span>
				</div>
				<button class="action-button secondary" onclick={handleReset}>
					{i18n.t('one-to-many-transfer.step5.content.start_new')}
				</button>
			{:else}
				<button class="action-button execute" onclick={handleExecute} disabled={!canExecute}>
					{#if executor.isExecuting}
						<Loader2 size={20} class="spinning" />
					{:else}
						<Play size={20} />
					{/if}
					{i18n.t('one-to-many-transfer.step5.content.execute')}
				</button>
			{/if}
		</div>
	{/if}

	<!-- Delegated Execution Mode -->
	{#if executionMode === 'delegated'}
		<!-- Delegated Progress Section -->
		{#if delegatedExecutor.session}
			<div class="delegated-section" transition:fade>
				<h3 class="section-title">
					{i18n.t('one-to-many-transfer.step5.delegated.batch_status')}
				</h3>

				<!-- Batch Progress List -->
				<div class="batch-list">
					{#each delegatedExecutor.session.batches as batch, index (batch.batchId)}
						<div
							class="batch-item"
							class:completed={batch.status === 'completed'}
							class:executing={batch.status === 'executing'}
							class:failed={batch.status === 'failed'}
						>
							<div class="batch-info">
								<span class="batch-id">
									{i18n
										.t('one-to-many-transfer.step5.delegated.execute_batch')
										.replace('{current}', String(index + 1))
										.replace('{total}', String(delegatedExecutor.session?.batches.length || 0))}
								</span>
								<span class="batch-recipients">
									{batch.recipients.length}
									{i18n.t('one-to-many-transfer.step5.content.recipients').toLowerCase()}
								</span>
							</div>
							<div class="batch-status-indicator">
								{#if batch.status === 'completed'}
									<Check size={16} class="status-icon success" />
								{:else if batch.status === 'executing'}
									<Loader2 size={16} class="spinning" />
								{:else if batch.status === 'failed'}
									<X size={16} class="status-icon failed" />
								{:else if canExecuteDelegated}
									<button class="batch-execute-btn" onclick={() => handleExecuteBatch(index)}>
										<Play size={14} />
									</button>
								{/if}
							</div>
						</div>
					{/each}
				</div>

				<!-- Delegated Summary -->
				<div class="delegated-summary">
					<span class="summary-stat">
						<Check size={14} />
						{delegatedExecutor.completedBatches} / {delegatedExecutor.session.batches.length}
						{i18n.t('one-to-many-transfer.step5.session.batches')}
					</span>
				</div>
			</div>
		{/if}

		<!-- Delegated Action Buttons -->
		<div class="action-section">
			{#if !delegatedExecutor.session}
				<!-- Not authorized yet - show authorize button -->
				<button class="action-button execute" onclick={handleAuthorize} disabled={!canAuthorize}>
					{#if delegatedExecutor.isAuthorizing}
						<Loader2 size={20} class="spinning" />
						{i18n.t('one-to-many-transfer.step5.delegated.authorizing')}
					{:else}
						<Play size={20} />
						{i18n.t('one-to-many-transfer.step5.delegated.authorize')}
					{/if}
				</button>
			{:else if delegatedExecutor.pendingBatches === 0}
				<!-- All batches completed -->
				<div class="completed-banner">
					<CheckCircle2 size={24} />
					<span>{i18n.t('one-to-many-transfer.step5.content.completed')}</span>
				</div>
				<button class="action-button secondary" onclick={handleResetDelegated}>
					{i18n.t('one-to-many-transfer.step5.content.start_new')}
				</button>
			{:else}
				<!-- Session active with pending batches -->
				<button
					class="action-button execute"
					onclick={handleExecuteAllBatches}
					disabled={!canExecuteDelegated}
				>
					{#if delegatedExecutor.isExecuting}
						<Loader2 size={20} class="spinning" />
					{:else}
						<Play size={20} />
					{/if}
					{i18n.t('one-to-many-transfer.step5.delegated.execute_all')}
				</button>
				<button class="action-button secondary" onclick={handleResetDelegated}>
					{i18n.t('one-to-many-transfer.step5.content.reset')}
				</button>
			{/if}
		</div>
	{/if}

	<!-- Warning Box -->
	<div class="warning-box">
		<AlertCircle size={20} />
		<div>
			<strong>{i18n.t('one-to-many-transfer.step5.content.warning_title')}</strong>
			<p>{i18n.t('one-to-many-transfer.step5.content.warning_message')}</p>
		</div>
	</div>
</StepContent>

<style>
	.mode-section,
	.wallet-section,
	.summary-section,
	.recipients-section,
	.progress-section,
	.delegated-section,
	.action-section {
		margin-bottom: var(--space-6);
	}

	.section-title {
		margin: 0 0 var(--space-4) 0;
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .section-title {
		color: var(--gray-100);
	}

	/* Session Toggle Button */
	.session-toggle {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		width: 100%;
		padding: var(--space-3) var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		cursor: pointer;
		margin-bottom: var(--space-4);
		transition: all 0.2s ease;
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .session-toggle {
		color: var(--gray-300);
	}

	.session-toggle:hover {
		background: var(--color-panel-2);
		border-color: hsl(210, 80%, 60%);
	}

	.session-badge {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 20px;
		height: 20px;
		padding: 0 var(--space-1);
		background: hsl(210, 100%, 50%);
		color: white;
		border-radius: var(--radius-full);
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		margin-left: auto;
	}

	.session-panel {
		margin-bottom: var(--space-4);
	}

	/* Delegated Mode Batch List */
	.batch-list {
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		overflow: hidden;
	}

	.batch-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-3) var(--space-4);
		border-bottom: 1px solid var(--color-border);
		transition: background 0.2s ease;
	}

	.batch-item:last-child {
		border-bottom: none;
	}

	.batch-item.completed {
		background: hsla(120, 60%, 95%, 0.5);
	}

	.batch-item.executing {
		background: hsla(210, 100%, 95%, 0.5);
	}

	.batch-item.failed {
		background: hsla(0, 60%, 95%, 0.5);
	}

	:global([data-theme='dark']) .batch-item.completed {
		background: hsla(120, 60%, 20%, 0.2);
	}

	:global([data-theme='dark']) .batch-item.executing {
		background: hsla(210, 100%, 20%, 0.2);
	}

	:global([data-theme='dark']) .batch-item.failed {
		background: hsla(0, 60%, 20%, 0.2);
	}

	.batch-info {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.batch-id {
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .batch-id {
		color: var(--gray-100);
	}

	.batch-recipients {
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .batch-recipients {
		color: var(--gray-400);
	}

	.batch-status-indicator {
		display: flex;
		align-items: center;
	}

	.batch-status-indicator :global(.status-icon.success) {
		color: hsl(120, 60%, 40%);
	}

	.batch-status-indicator :global(.status-icon.failed) {
		color: hsl(0, 60%, 50%);
	}

	.batch-execute-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		padding: 0;
		background: hsl(210, 100%, 50%);
		border: none;
		border-radius: var(--radius-md);
		color: white;
		cursor: pointer;
		transition: background 0.2s ease;
	}

	.batch-execute-btn:hover {
		background: hsl(210, 100%, 45%);
	}

	.delegated-summary {
		display: flex;
		gap: var(--space-4);
		margin-top: var(--space-3);
		flex-wrap: wrap;
	}

	.summary-stat {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: hsl(120, 60%, 35%);
	}

	/* Summary Grid */
	.summary-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
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
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .summary-value {
		color: var(--gray-100);
	}

	.summary-value.highlighted {
		color: hsl(210, 100%, 50%);
		font-size: var(--text-xl);
	}

	/* Recipients Preview */
	.recipients-preview {
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		overflow: hidden;
		max-height: 400px;
		overflow-y: auto;
	}

	.recipient-row {
		padding: var(--space-3);
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-2);
		border-bottom: 1px solid var(--color-border);
		transition: background-color 0.2s ease;
	}

	.recipient-row:last-child {
		border-bottom: none;
	}

	.recipient-row.success {
		background: hsla(120, 60%, 95%, 0.5);
	}

	.recipient-row.failed {
		background: hsla(0, 60%, 95%, 0.5);
	}

	:global([data-theme='dark']) .recipient-row.success {
		background: hsla(120, 60%, 20%, 0.2);
	}

	:global([data-theme='dark']) .recipient-row.failed {
		background: hsla(0, 60%, 20%, 0.2);
	}

	.recipient-address {
		font-family: monospace;
		font-size: var(--text-sm);
		color: var(--gray-900);
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	:global([data-theme='dark']) .recipient-address {
		color: var(--gray-100);
	}

	.recipient-amount {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-700);
		flex-shrink: 0;
	}

	:global([data-theme='dark']) .recipient-amount {
		color: var(--gray-300);
	}

	.recipient-status {
		flex-shrink: 0;
		display: flex;
		align-items: center;
	}

	.recipient-status :global(.status-icon.success) {
		color: hsl(120, 60%, 40%);
	}

	.recipient-status :global(.status-icon.failed) {
		color: hsl(0, 60%, 50%);
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

	/* Progress Section */
	.progress-bar {
		width: 100%;
		height: 24px;
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

	.progress-fill.error {
		background: linear-gradient(90deg, hsl(0, 60%, 50%), hsl(0, 60%, 40%));
	}

	.progress-fill.paused {
		background: linear-gradient(90deg, hsl(40, 80%, 50%), hsl(40, 80%, 40%));
	}

	.progress-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: var(--space-2);
	}

	.progress-text {
		font-size: var(--text-sm);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .progress-text {
		color: var(--gray-300);
	}

	.progress-count {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .progress-count {
		color: var(--gray-100);
	}

	.results-summary {
		display: flex;
		gap: var(--space-4);
		margin-top: var(--space-3);
		flex-wrap: wrap;
	}

	.result-item {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
	}

	.result-item.success {
		color: hsl(120, 60%, 35%);
	}

	.result-item.failed {
		color: hsl(0, 60%, 45%);
	}

	.result-item.pending {
		color: var(--gray-500);
	}

	/* Action Buttons */
	.action-section {
		display: flex;
		gap: var(--space-3);
		flex-wrap: wrap;
	}

	.action-button {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-5);
		border: none;
		border-radius: var(--radius-lg);
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.action-button.execute {
		flex: 1;
		justify-content: center;
		background: linear-gradient(135deg, hsl(210, 100%, 50%), hsl(210, 100%, 40%));
		color: white;
		box-shadow: 0 4px 12px hsla(210, 100%, 50%, 0.3);
	}

	.action-button.execute:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 8px 24px hsla(210, 100%, 50%, 0.4);
	}

	.action-button.execute:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.action-button.stop {
		flex: 1;
		justify-content: center;
		background: linear-gradient(135deg, hsl(40, 80%, 50%), hsl(40, 80%, 40%));
		color: white;
	}

	.action-button.resume {
		flex: 1;
		justify-content: center;
		background: linear-gradient(135deg, hsl(120, 60%, 45%), hsl(120, 60%, 35%));
		color: white;
	}

	.action-button.secondary {
		background: var(--color-panel-1);
		color: var(--gray-700);
		border: 1px solid var(--color-border);
	}

	:global([data-theme='dark']) .action-button.secondary {
		color: var(--gray-300);
	}

	.completed-banner {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-4);
		background: hsla(120, 60%, 95%, 1);
		border: 1px solid hsl(120, 60%, 60%);
		border-radius: var(--radius-md);
		color: hsl(120, 60%, 30%);
		font-weight: var(--font-semibold);
	}

	:global([data-theme='dark']) .completed-banner {
		background: hsla(120, 60%, 15%, 0.3);
		border-color: hsl(120, 60%, 40%);
		color: hsl(120, 60%, 70%);
	}

	/* Error Banner */
	.error-banner {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3);
		background: hsla(0, 80%, 95%, 1);
		border: 1px solid hsl(0, 80%, 60%);
		border-radius: var(--radius-sm);
		color: hsl(0, 80%, 40%);
		margin-bottom: var(--space-4);
	}

	:global([data-theme='dark']) .error-banner {
		background: hsla(0, 80%, 15%, 0.3);
		border-color: hsl(0, 80%, 40%);
		color: hsl(0, 80%, 70%);
	}

	.error-banner span {
		flex: 1;
	}

	.dismiss-btn {
		padding: var(--space-1);
		background: transparent;
		border: none;
		cursor: pointer;
		color: inherit;
		opacity: 0.7;
	}

	.dismiss-btn:hover {
		opacity: 1;
	}

	/* Warning Box */
	.warning-box {
		display: flex;
		gap: var(--space-3);
		margin-top: var(--space-6);
		padding: var(--space-4);
		background: hsla(40, 100%, 95%, 1);
		border: 1px solid hsla(40, 100%, 80%, 1);
		border-radius: var(--radius-md);
		color: hsl(40, 80%, 30%);
	}

	:global([data-theme='dark']) .warning-box {
		background: hsla(40, 100%, 10%, 0.3);
		border-color: hsla(40, 100%, 30%, 1);
		color: hsl(40, 80%, 70%);
	}

	.warning-box p {
		margin: var(--space-1) 0 0;
		font-size: var(--text-sm);
		line-height: 1.5;
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

	@media (max-width: 640px) {
		.summary-grid {
			grid-template-columns: 1fr 1fr;
		}

		.action-section {
			flex-direction: column;
		}

		.action-button {
			width: 100%;
			justify-content: center;
		}
	}
</style>
