<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import WalletConnectionStatus from '@/lib/components/ui/wallet-connection-status.svelte';
	import type { StepManager } from '@/lib/components/ui/step-indicator.svelte';
	import { CheckCircle2, XCircle, AlertCircle, RefreshCw, ExternalLink } from 'lucide-svelte';
	import { fade, slide } from 'svelte/transition';
	import { checkAllDependencies, calculateCheckSummary } from '../utils/dependency-checker';
	// import type { DependencyCheck, DependencyCheckSummary } from '../types/dependencies';
	import ContractDeploymentModal from './contract-deployment-modal.svelte';
	import { getDeploymentConfig } from '../config/deployment-configs';
	import type { ContractDeploymentConfig } from '../types/deployment-config';
	import StepSidebar from './components/step-sidebar.svelte';
	import StepContentHeader from './components/step-content-header.svelte';
	import EmptyState from './components/empty-state.svelte';
	import StepFooter from './components/step-footer.svelte';

	interface Props {
		section: 'sidebar' | 'footer' | 'content';
		stepManager?: StepManager;
	}

	let { section, stepManager }: Props = $props();

	const connectStore = useConnectStore();

	// Import shared module-level state - all component instances automatically share this
	import { step2State } from '../stores/step2-state.svelte';

	// Use $derived for easier access in template
	let checks = $derived(step2State.checks);
	let summary = $derived(step2State.summary);
	let isChecking = $derived(step2State.isChecking);
	let hasChecked = $derived(step2State.hasChecked);

	// Contract deployment modal state
	let showDeploymentModal = $state(false);
	let deploymentConfig = $state<ContractDeploymentConfig | null>(null);

	// Get current network details
	const currentNetwork = $derived(
		connectStore.currentChainId
			? connectStore.networks.find((n) => n.chainId === connectStore.currentChainId)
			: undefined
	);

	// Run dependency checks
	async function runDependencyChecks() {
		if (!currentNetwork || !connectStore.isConnected) {
			console.log('[Step2] Cannot run checks - network or wallet not ready');
			return;
		}

		console.log('[Step2] Starting dependency checks for', currentNetwork.name);
		step2State.isChecking = true;
		step2State.hasChecked = false;

		try {
			// For now, we'll use hardcoded contract addresses
			// These should come from configuration later
			const membershipContract = undefined; // TODO: Get from config
			const sweepContract = undefined; // TODO: Get from config

			const results = await checkAllDependencies(
				currentNetwork.rpcEndpoints[0].url,
				currentNetwork.chainId,
				currentNetwork.name,
				membershipContract,
				sweepContract
			);

			console.log('[Step2] Dependency check results:', results);

			// Update shared state - force new references for Svelte reactivity
			step2State.checks = [...results];

			// Force new object reference for summary
			const newSummary = calculateCheckSummary(results);
			step2State.summary = { ...newSummary };

			console.log('[Step2] Calculated summary:', step2State.summary);
			step2State.hasChecked = true;
		} catch (error) {
			console.error('[Step2] Failed to run dependency checks:', error);
		} finally {
			step2State.isChecking = false;
		}
	}

	// Auto-run checks when wallet is connected and network is selected
	$effect(() => {
		if (connectStore.isConnected && currentNetwork && !hasChecked) {
			runDependencyChecks();
		}
	});

	// Reset checks when network changes
	$effect(() => {
		if (connectStore.currentChainId) {
			step2State.hasChecked = false;
			step2State.checks = [];
			step2State.summary = null;
		}
	});

	// Go back to step 1
	function goBackToStep1() {
		if (stepManager) {
			stepManager.goTo(1);
		}
	}

	// Find the first failed check index
	const firstFailedCheckIndex = $derived(() => {
		return checks.findIndex((check) => check.status === 'error');
	});

	// Check if a specific check can be fixed (only the first failed check)
	function canFixCheck(checkIndex: number): boolean {
		const firstFailedIdx = firstFailedCheckIndex();
		return firstFailedIdx === checkIndex;
	}

	// Check if ready to continue
	const isReadyToContinue = $derived(summary?.allPassed === true);

	// Dynamic footer hint based on state
	const footerHint = $derived.by(() => {
		if (isChecking) return 'Checking dependencies...';
		if (summary && !summary.allPassed) return 'Please resolve all dependency issues to continue';
		return 'Waiting for dependency checks...';
	});

	// Debug logging
	$effect(() => {
		console.log('[Step2] Dependency check summary:', {
			summary,
			checks: checks.map((c) => ({ name: c.name, status: c.status })),
			isReadyToContinue
		});
	});

	// Handle continue to next step
	function handleContinue() {
		console.log('handleContinue called', { stepManager, isReadyToContinue, summary });
		if (stepManager && isReadyToContinue) {
			console.log('Calling stepManager.next()');
			stepManager.next();
		} else {
			console.log('Cannot continue:', {
				hasStepManager: !!stepManager,
				isReady: isReadyToContinue,
				summary
			});
		}
	}

	// Format timestamp to human-readable format
	function formatTimestamp(timestamp: number): string {
		const date = new Date(timestamp * 1000);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

		// Format the date
		const dateStr = date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});

		const timeStr = date.toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		});

		// Add relative time
		let relativeStr = '';
		if (diffDays === 0) {
			relativeStr = 'today';
		} else if (diffDays === 1) {
			relativeStr = 'yesterday';
		} else if (diffDays < 30) {
			relativeStr = `${diffDays} days ago`;
		} else if (diffDays < 365) {
			const months = Math.floor(diffDays / 30);
			relativeStr = `${months} month${months > 1 ? 's' : ''} ago`;
		} else {
			const years = Math.floor(diffDays / 365);
			relativeStr = `${years} year${years > 1 ? 's' : ''} ago`;
		}

		return `${dateStr} ${timeStr} (${relativeStr})`;
	}
</script>

{#if section === 'sidebar'}
	<StepSidebar
		stepNumber={2}
		title="Check Dependencies"
		description="Verify network services and contracts"
	>
		<WalletConnectionStatus
			showChangeButton={true}
			onChangeWallet={goBackToStep1}
			class="wallet-status-section"
		/>

		{#if summary}
			<div class="check-summary">
				<div class="summary-item">
					<span class="summary-label">Total Checks:</span>
					<span class="summary-value">{summary.total}</span>
				</div>
				<div class="summary-item success">
					<span class="summary-label">Passed:</span>
					<span class="summary-value">{summary.passed}</span>
				</div>
				{#if summary.failed > 0}
					<div class="summary-item error">
						<span class="summary-label">Failed:</span>
						<span class="summary-value">{summary.failed}</span>
					</div>
				{/if}
			</div>
		{/if}
	</StepSidebar>
{:else if section === 'footer'}
	<StepFooter canContinue={isReadyToContinue} onContinue={handleContinue} hint={footerHint} />
{:else if section === 'content'}
	<div class="step-content">
		<StepContentHeader
			title="Dependency Check"
			description="Verifying network services and required contracts are deployed"
		/>

		{#if isChecking}
			<!-- Checking State -->
			<div class="checking-container">
				<div class="checking-spinner"><RefreshCw class="spin-icon" size={48} /></div>
				<p class="checking-text">Checking dependencies for {currentNetwork?.name}...</p>
			</div>
		{:else if !connectStore.isConnected}
			<!-- Not Connected State -->
			<EmptyState
				icon="🔌"
				title="Wallet Not Connected"
				message="Please go back to Step 1 and connect your wallet"
			>
				{#snippet action()}
					<button class="back-button" onclick={goBackToStep1}> Go to Step 1 </button>
				{/snippet}
			</EmptyState>
		{:else if hasChecked && checks.length > 0}
			<!-- Check Results -->
			<div class="checks-container" in:fade={{ duration: 300 }}>
				{#each checks as check, index (check.id)}
					<div
						class="check-card"
						class:success={check.status === 'success'}
						class:error={check.status === 'error'}
						in:slide={{ duration: 200, delay: 50 }}
					>
						<div class="check-header">
							<div class="check-icon">
								{#if check.status === 'checking'}
									<RefreshCw size={24} class="spinning" />
								{:else if check.status === 'success'}
									<CheckCircle2 size={24} />
								{:else if check.status === 'warning'}
									<AlertCircle size={24} />
								{:else}
									<XCircle size={24} />
								{/if}
							</div>
							<div class="check-info">
								<h4>{check.name}</h4>
								<p class="check-description">{check.description}</p>
							</div>
						</div>

						<div class="check-details">
							{#if check.message}
								<p class="check-message">{check.message}</p>
							{/if}

							{#if check.type === 'contract' && check.address}
								<div class="check-address">
									<span class="label">Address:</span>
									<div class="address-content">
										<code>{check.address}</code>
										{#if currentNetwork?.blockExplorer}
											<a
												href="{currentNetwork.blockExplorer}/address/{check.address}"
												target="_blank"
												rel="noopener noreferrer"
												class="explorer-link"
												title="View on Block Explorer"
											>
												<ExternalLink size={14} />
											</a>
										{/if}
									</div>
								</div>
								{#if check.blockNumber !== undefined}
									<div class="check-block">
										<span class="label">Block:</span>
										<span>#{check.blockNumber.toLocaleString()}</span>
									</div>
								{/if}
								{#if check.blockTimestamp}
									<div class="check-timestamp">
										<span class="label">Verified:</span>
										<span>{formatTimestamp(check.blockTimestamp)}</span>
									</div>
								{/if}
							{/if}

							{#if check.type === 'network-service' && check.endpoint}
								<div class="check-endpoint">
									<span class="label">Endpoint:</span>
									<div class="endpoint-content">
										<code>{check.endpoint}</code>
										<a
											href={check.endpoint}
											target="_blank"
											rel="noopener noreferrer"
											class="explorer-link"
											title="Open RPC Endpoint"
										>
											<ExternalLink size={14} />
										</a>
									</div>
								</div>
								{#if check.responseTime}
									<div class="check-time">
										<span class="label">Response Time:</span>
										<span>{check.responseTime}ms</span>
									</div>
								{/if}
							{/if}
						</div>

						{#if check.status === 'error' && check.canDeploy}
							{@const canFix = canFixCheck(index)}
							<div class="check-actions">
								{#if !canFix}
									<div class="blocked-hint">
										<AlertCircle size={16} />
										<span>Please resolve the previous issue first</span>
									</div>
								{:else if check.type === 'contract' && check.address}
									{@const config = getDeploymentConfig(check.address as `0x${string}`)}
									{#if config && config.deployFunction}
										<button
											class="deploy-button"
											onclick={() => {
												deploymentConfig = config;
												showDeploymentModal = true;
											}}
										>
											Deploy {config.contractName}
										</button>
									{:else if check.deployGuideUrl}
										<a
											href={check.deployGuideUrl}
											target="_blank"
											rel="noopener noreferrer"
											class="deploy-link"
										>
											<ExternalLink size={16} />
											View Deployment Guide
										</a>
									{:else}
										<button class="deploy-button" disabled> Deploy Contract (Coming Soon) </button>
									{/if}
								{/if}
							</div>
						{/if}
					</div>
				{/each}
			</div>

			<!-- Summary and Continue -->
			{#if summary}
				<div class="summary-container">
					{#if summary.allPassed}
						<div class="success-banner">
							<CheckCircle2 size={32} />
							<div>
								<h3>All Dependencies Satisfied</h3>
								<p>Your network is properly configured for token sweeping</p>
							</div>
						</div>
					{:else}
						<div class="error-banner">
							<AlertCircle size={32} />
							<div>
								<h3>Dependency Issues Found</h3>
								<p>Please resolve the issues above before continuing</p>
							</div>
						</div>
					{/if}

					<button class="retry-button" onclick={runDependencyChecks}>
						<RefreshCw size={18} />
						Re-check Dependencies
					</button>
				</div>
			{/if}
		{/if}
	</div>
{/if}

<!-- Generic Contract Deployment Modal -->
{#if currentNetwork && deploymentConfig}
	<ContractDeploymentModal
		bind:show={showDeploymentModal}
		config={deploymentConfig}
		chainId={currentNetwork.chainId}
		networkName={currentNetwork.name}
		rpcUrl={currentNetwork.rpcEndpoints[0].url}
		blockExplorer={currentNetwork.blockExplorer}
		onClose={() => {
			showDeploymentModal = false;
			deploymentConfig = null;
		}}
		onSuccess={() => {
			console.log('[Step2] Deployment successful, closing modal and re-checking dependencies');
			showDeploymentModal = false;
			deploymentConfig = null;
			// Re-run dependency checks after successful deployment
			setTimeout(() => {
				console.log('[Step2] Re-running dependency checks after deployment');
				runDependencyChecks();
			}, 500);
		}}
	/>
{/if}

<style>
	h2 {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		margin-bottom: var(--space-2);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) h2 {
		color: var(--gray-100);
	}

	h3 {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		margin-bottom: var(--space-2);
		color: var(--gray-800);
	}

	:global([data-theme='dark']) h3 {
		color: var(--gray-200);
	}

	.description {
		color: var(--gray-600);
		line-height: 1.6;
		margin-bottom: var(--space-6);
	}

	:global([data-theme='dark']) .description {
		color: var(--gray-400);
	}

	p {
		color: var(--gray-600);
		line-height: 1.6;
	}

	:global([data-theme='dark']) p {
		color: var(--gray-400);
	}

	/* Wallet Status Section */
	:global(.wallet-status-section) {
		margin: var(--space-4) 0;
	}

	/* Check Summary (Sidebar) */
	.check-summary {
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: var(--color-panel-1);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.summary-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-2);
		border-radius: var(--radius-sm);
		background: var(--gray-50);
	}

	:global([data-theme='dark']) .summary-item {
		background: var(--gray-800);
	}

	.summary-item.success {
		background: hsla(120, 60%, 95%, 1);
		border: 1px solid hsla(120, 60%, 80%, 1);
	}

	:global([data-theme='dark']) .summary-item.success {
		background: hsla(120, 60%, 15%, 0.3);
		border-color: hsla(120, 60%, 25%, 1);
	}

	.summary-item.error {
		background: hsla(0, 80%, 95%, 1);
		border: 1px solid hsla(0, 80%, 80%, 1);
	}

	:global([data-theme='dark']) .summary-item.error {
		background: hsla(0, 80%, 15%, 0.3);
		border-color: hsla(0, 80%, 25%, 1);
	}

	.summary-label {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .summary-label {
		color: var(--gray-300);
	}

	.summary-value {
		font-size: var(--text-base);
		font-weight: var(--font-bold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .summary-value {
		color: var(--gray-100);
	}

	/* Footer */
	.step-footer {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		align-items: stretch;
	}

	.continue-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		width: 100%;
		padding: var(--space-3) var(--space-4);
		background: linear-gradient(135deg, hsl(120, 60%, 50%), hsl(120, 60%, 40%));
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.continue-btn:hover {
		background: hsl(120, 60%, 45%);
		transform: translateY(-1px);
		box-shadow: 0 4px 12px hsla(120, 60%, 50%, 0.3);
	}

	.footer-hint {
		margin: 0;
		text-align: center;
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .footer-hint {
		color: var(--gray-400);
	}

	/* Checking State */
	.checking-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: var(--space-12) var(--space-6);
		background: var(--color-panel-1);
		border-radius: var(--radius-lg);
		border: 2px solid var(--color-border);
		min-height: 300px;
	}

	.checking-spinner {
		color: var(--color-primary);
		margin-bottom: var(--space-4);
	}

	:global(.spin-icon) {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.checking-text {
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .checking-text {
		color: var(--gray-300);
	}

	/* Empty State */
	.back-button {
		margin-top: var(--space-4);
		padding: var(--space-2) var(--space-4);
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.2s;
	}

	.back-button:hover {
		opacity: 0.9;
		transform: translateY(-1px);
	}

	/* Check Cards */
	.checks-container {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		margin-bottom: var(--space-6);
	}

	.check-card {
		padding: var(--space-4);
		background: var(--white);
		border-radius: var(--radius-lg);
		border: 2px solid var(--color-border);
		transition: all 0.2s;
	}

	:global([data-theme='dark']) .check-card {
		background: var(--gray-800);
	}

	.check-card.success {
		border-color: hsl(120, 60%, 60%);
		background: hsla(120, 60%, 98%, 1);
	}

	:global([data-theme='dark']) .check-card.success {
		border-color: hsl(120, 60%, 40%);
		background: hsla(120, 60%, 10%, 0.3);
	}

	.check-card.error {
		border-color: hsl(0, 80%, 60%);
		background: hsla(0, 80%, 98%, 1);
	}

	:global([data-theme='dark']) .check-card.error {
		border-color: hsl(0, 80%, 40%);
		background: hsla(0, 80%, 10%, 0.3);
	}

	.check-header {
		display: flex;
		gap: var(--space-3);
		margin-bottom: var(--space-3);
	}

	.check-icon {
		flex-shrink: 0;
	}

	.check-icon :global(svg) {
		color: var(--gray-500);
	}

	.check-card.success .check-icon :global(svg) {
		color: hsl(120, 60%, 50%);
	}

	.check-card.error .check-icon :global(svg) {
		color: hsl(0, 80%, 50%);
	}

	.check-info {
		flex: 1;
		min-width: 0;
	}

	.check-info h4 {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
		margin: 0 0 var(--space-1) 0;
	}

	:global([data-theme='dark']) .check-info h4 {
		color: var(--gray-100);
	}

	.check-description {
		font-size: var(--text-sm);
		color: var(--gray-600);
		margin: 0;
	}

	:global([data-theme='dark']) .check-description {
		color: var(--gray-400);
	}

	.check-details {
		margin-left: calc(24px + var(--space-3));
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.check-message {
		font-size: var(--text-sm);
		color: var(--gray-700);
		margin: 0;
	}

	:global([data-theme='dark']) .check-message {
		color: var(--gray-300);
	}

	.check-address,
	.check-endpoint,
	.check-time,
	.check-block,
	.check-timestamp {
		display: flex;
		gap: var(--space-2);
		align-items: baseline;
		font-size: var(--text-xs);
	}

	.check-address .label,
	.check-endpoint .label,
	.check-time .label,
	.check-block .label,
	.check-timestamp .label {
		font-weight: var(--font-semibold);
		color: var(--gray-600);
		min-width: 80px;
		flex-shrink: 0;
	}

	:global([data-theme='dark']) .check-address .label,
	:global([data-theme='dark']) .check-endpoint .label,
	:global([data-theme='dark']) .check-time .label,
	:global([data-theme='dark']) .check-block .label,
	:global([data-theme='dark']) .check-timestamp .label {
		color: var(--gray-400);
	}

	.check-block span:not(.label),
	.check-timestamp span:not(.label) {
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .check-block span:not(.label),
	:global([data-theme='dark']) .check-timestamp span:not(.label) {
		color: var(--gray-300);
	}

	.address-content,
	.endpoint-content {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		flex: 1;
		min-width: 0;
	}

	.check-address code,
	.check-endpoint code {
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

	:global([data-theme='dark']) .check-address code,
	:global([data-theme='dark']) .check-endpoint code {
		color: var(--gray-200);
		background: var(--gray-700);
	}

	.explorer-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 4px;
		color: var(--color-primary);
		background: var(--color-panel-1);
		border-radius: var(--radius-sm);
		transition: all 0.2s;
		flex-shrink: 0;
	}

	.explorer-link:hover {
		background: var(--color-primary);
		color: white;
		transform: translateY(-1px);
	}

	:global([data-theme='dark']) .explorer-link {
		background: var(--gray-700);
	}

	:global([data-theme='dark']) .explorer-link:hover {
		background: var(--color-primary);
	}

	.check-actions {
		margin-top: var(--space-3);
		margin-left: calc(24px + var(--space-3));
		display: flex;
		gap: var(--space-2);
	}

	.deploy-link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		background: var(--color-primary);
		color: white;
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		text-decoration: none;
		transition: all 0.2s;
	}

	.deploy-link:hover {
		opacity: 0.9;
		transform: translateY(-1px);
	}

	.deploy-button {
		padding: var(--space-2) var(--space-3);
		background: var(--gray-300);
		color: var(--gray-600);
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		cursor: not-allowed;
	}

	/* Blocked Hint */
	.blocked-hint {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		background: hsla(45, 100%, 95%, 1);
		border: 1px solid hsla(45, 100%, 70%, 1);
		border-radius: var(--radius-md);
		color: hsl(45, 100%, 30%);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
	}

	:global([data-theme='dark']) .blocked-hint {
		background: hsla(45, 100%, 15%, 0.3);
		border-color: hsla(45, 100%, 40%, 1);
		color: hsl(45, 100%, 70%);
	}

	.blocked-hint :global(svg) {
		flex-shrink: 0;
	}

	/* Summary Container */
	.summary-container {
		margin-top: var(--space-6);
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.success-banner,
	.error-banner {
		display: flex;
		gap: var(--space-3);
		padding: var(--space-4);
		border-radius: var(--radius-lg);
		align-items: center;
	}

	.success-banner {
		background: hsla(120, 60%, 95%, 1);
		border: 2px solid hsl(120, 60%, 60%);
		color: hsl(120, 60%, 30%);
	}

	:global([data-theme='dark']) .success-banner {
		background: hsla(120, 60%, 15%, 0.5);
		border-color: hsl(120, 60%, 40%);
		color: hsl(120, 60%, 70%);
	}

	.error-banner {
		background: hsla(0, 80%, 95%, 1);
		border: 2px solid hsl(0, 80%, 60%);
		color: hsl(0, 80%, 30%);
	}

	:global([data-theme='dark']) .error-banner {
		background: hsla(0, 80%, 15%, 0.5);
		border-color: hsl(0, 80%, 40%);
		color: hsl(0, 80%, 70%);
	}

	.success-banner h3,
	.error-banner h3 {
		margin: 0 0 var(--space-1) 0;
		font-size: var(--text-lg);
	}

	.success-banner p,
	.error-banner p {
		margin: 0;
		font-size: var(--text-sm);
		opacity: 0.9;
	}

	.retry-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-4);
		background: var(--gray-200);
		color: var(--gray-700);
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.2s;
	}

	:global([data-theme='dark']) .retry-button {
		background: var(--gray-700);
		color: var(--gray-200);
	}

	.retry-button:hover {
		background: var(--gray-300);
		transform: translateY(-1px);
	}

	:global([data-theme='dark']) .retry-button:hover {
		background: var(--gray-600);
	}

	/* Responsive */
	@media (max-width: 640px) {
		.check-details {
			margin-left: 0;
		}

		.check-actions {
			margin-left: 0;
		}
	}
</style>
