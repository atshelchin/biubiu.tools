<script lang="ts">
	import { onMount } from 'svelte';
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import { useStepManager } from '$lib/components/ui/step-context.svelte';
	import { monitorState } from '../../stores/monitor-state.svelte';
	import { scanAssetMovements } from '../../utils/asset-scanner';
	import { assetsDB } from '../../db/assets-db';
	import { SvelteMap } from 'svelte/reactivity';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import { Loader2, CheckCircle2, AlertCircle, Activity } from 'lucide-svelte';
	import type { AssetMovement } from '../../types/assets';

	const connectStore = useConnectStore();
	const stepManager = useStepManager();

	let scanStarted = $state(false);
	let scanCompleted = $state(false);
	let scanError = $state<string | null>(null);

	// Start scan on mount
	onMount(() => {
		if (!scanStarted) {
			startScan();
		}
	});

	async function startScan() {
		if (!monitorState.scanConfig || !connectStore.rpcUrl) {
			scanError = 'Missing scan configuration or RPC URL';
			return;
		}

		scanStarted = true;
		monitorState.setScanStatus('scanning');

		try {
			// Generate session ID
			const sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
			monitorState.currentSessionId = sessionId;

			// Start scanning
			const movements = await scanAssetMovements(
				monitorState.scanConfig,
				connectStore.rpcUrl,
				(progress) => {
					monitorState.setProgress(progress);
				}
			);

			// Save to IndexedDB
			await assetsDB.addMovements(sessionId, movements);

			// Calculate balances
			const balanceMap = await calculateBalancesFromMovements(movements);
			const balances = Array.from(balanceMap.values());
			await assetsDB.addBalances(
				sessionId,
				balances.map((b) => ({
					...b,
					balance: b.netChange
				}))
			);

			// Save session
			const session = {
				id: sessionId,
				config: monitorState.scanConfig,
				summary: {
					totalMovements: movements.length,
					totalAssets: balances.length,
					startTime: Date.now(),
					endTime: Date.now()
				},
				createdAt: Date.now(),
				updatedAt: Date.now(),
				status: 'completed' as const
			};
			await assetsDB.sessions.add(session);

			// Update state
			monitorState.setMovements(movements);
			monitorState.setBalances(balances);
			monitorState.setSummary(session.summary);
			monitorState.setScanStatus('completed');

			scanCompleted = true;
			stepManager?.setStepValid(true);
		} catch (error) {
			console.error('Scan failed:', error);
			scanError = error instanceof Error ? error.message : 'Unknown error occurred';
			monitorState.setScanStatus('error');
			monitorState.setError(scanError);
		}
	}

	async function calculateBalancesFromMovements(movements: AssetMovement[]) {
		const balanceMap = new SvelteMap<
			string,
			{
				symbol: string;
				totalIn: bigint;
				totalOut: bigint;
				netChange: bigint;
				movementCount: number;
			}
		>();

		for (const movement of movements) {
			const key =
				movement.assetType === 'native'
					? 'ETH'
					: movement.tokenAddress || movement.contractAddress || 'unknown';

			if (!balanceMap.has(key)) {
				balanceMap.set(key, {
					assetType: movement.assetType,
					tokenAddress: movement.tokenAddress,
					tokenSymbol: movement.tokenSymbol || 'ETH',
					tokenName: movement.tokenName || 'Ethereum',
					tokenDecimals: movement.tokenDecimals || 18,
					totalIn: 0n,
					totalOut: 0n,
					netChange: '0',
					transactionCount: 0
				});
			}

			const balance = balanceMap.get(key);
			balance.transactionCount++;

			if (movement.value) {
				const value = BigInt(movement.value);
				if (movement.direction === 'in') {
					balance.totalIn += value;
				} else {
					balance.totalOut += value;
				}
			}
		}

		// Calculate net changes
		for (const balance of balanceMap.values()) {
			balance.netChange = (balance.totalIn - balance.totalOut).toString();
		}

		return balanceMap;
	}

	const statusText = $derived(() => {
		if (scanError) return 'Scan Failed';
		if (scanCompleted) return 'Scan Completed';
		if (monitorState.scanStatus === 'scanning') return 'Scanning...';
		return 'Preparing Scan...';
	});
</script>

<div class="step-content">
	<StepContentHeader title="Scanning Asset Movements" description={statusText()} />

	<div class="scan-container">
		<!-- Status Icon -->
		<div class="status-icon">
			{#if scanError}
				<div class="icon-wrapper error">
					<AlertCircle size={48} />
				</div>
			{:else if scanCompleted}
				<div class="icon-wrapper success">
					<CheckCircle2 size={48} />
				</div>
			{:else}
				<div class="icon-wrapper scanning">
					<Loader2 size={48} class="spinning" />
				</div>
			{/if}
		</div>

		<!-- Error Message -->
		{#if scanError}
			<div class="error-card">
				<h3>Scan Failed</h3>
				<p>{scanError}</p>
				<button class="retry-btn" onclick={startScan}>Retry Scan</button>
			</div>
		{:else if scanCompleted}
			<!-- Success Message -->
			<div class="success-card">
				<h3>Scan Completed Successfully!</h3>
				<div class="summary-stats">
					<div class="stat-item">
						<div class="stat-value">{monitorState.movements.length}</div>
						<div class="stat-label">Movements Found</div>
					</div>
					<div class="stat-item">
						<div class="stat-value">{monitorState.balances.length}</div>
						<div class="stat-label">Assets Tracked</div>
					</div>
				</div>
				<p class="success-hint">Click "View Results" to analyze your asset movements</p>
			</div>
		{:else}
			<!-- Progress Display -->
			<div class="progress-card">
				<h3>Scanning Blockchain...</h3>

				<!-- Progress Bar -->
				<div class="progress-section">
					<div class="progress-info">
						<span class="progress-label">Block Progress</span>
						<span class="progress-value">{monitorState.scanProgress.percentage}%</span>
					</div>
					<div class="progress-bar-container">
						<div class="progress-bar" style="width: {monitorState.scanProgress.percentage}%"></div>
					</div>
					<div class="progress-details">
						<span>
							Block {monitorState.scanProgress.currentBlock.toLocaleString()} /
							{monitorState.scanProgress.totalBlocks.toLocaleString()}
						</span>
					</div>
				</div>

				<!-- Statistics -->
				<div class="stats-grid">
					<div class="stat-card">
						<Activity size={20} />
						<div class="stat-info">
							<div class="stat-number">{monitorState.scanProgress.foundMovements}</div>
							<div class="stat-text">Movements Found</div>
						</div>
					</div>
					<div class="stat-card">
						<Activity size={20} />
						<div class="stat-info">
							<div class="stat-number">{monitorState.scanProgress.processedTransactions}</div>
							<div class="stat-text">Transactions Processed</div>
						</div>
					</div>
				</div>

				<!-- Scanning Info -->
				<div class="scanning-info">
					<Loader2 size={16} class="spinning" />
					<span>Analyzing {monitorState.scanConfig?.assetTypes.join(', ')} transfers...</span>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.step-content {
		padding: var(--space-6);
		max-width: 900px;
		margin: 0 auto;
	}

	.scan-container {
		margin-top: var(--space-8);
	}

	/* Status Icon */
	.status-icon {
		display: flex;
		justify-content: center;
		margin-bottom: var(--space-8);
	}

	.icon-wrapper {
		width: 96px;
		height: 96px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-full);
		background: var(--color-panel-1);
		border: 3px solid var(--color-border);
	}

	.icon-wrapper.scanning {
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	.icon-wrapper.success {
		border-color: var(--color-success);
		color: var(--color-success);
		background: color-mix(in srgb, var(--color-success) 10%, var(--color-panel-1));
	}

	.icon-wrapper.error {
		border-color: var(--color-error);
		color: var(--color-error);
		background: color-mix(in srgb, var(--color-error) 10%, var(--color-panel-1));
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

	/* Progress Card */
	.progress-card,
	.success-card,
	.error-card {
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-2xl);
		padding: var(--space-8);
		text-align: center;
	}

	.progress-card h3,
	.success-card h3,
	.error-card h3 {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--color-heading-1);
		margin-bottom: var(--space-6);
	}

	/* Progress Section */
	.progress-section {
		margin: var(--space-6) 0;
	}

	.progress-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-2);
	}

	.progress-label {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-description-2);
	}

	.progress-value {
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		color: var(--color-primary);
	}

	.progress-bar-container {
		height: 12px;
		background: var(--color-panel-2);
		border-radius: var(--radius-full);
		overflow: hidden;
		margin-bottom: var(--space-2);
	}

	.progress-bar {
		height: 100%;
		background: linear-gradient(90deg, var(--color-primary), var(--brand-700));
		border-radius: var(--radius-full);
		transition: width 0.3s ease;
	}

	.progress-details {
		font-size: var(--text-sm);
		color: var(--color-description-3);
	}

	/* Stats Grid */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-4);
		margin: var(--space-6) 0;
	}

	.stat-card {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-4);
		background: var(--color-panel-2);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
		text-align: left;
	}

	.stat-card :global(svg) {
		color: var(--color-primary);
		flex-shrink: 0;
	}

	.stat-info {
		flex: 1;
	}

	.stat-number {
		font-size: var(--text-xl);
		font-weight: var(--font-bold);
		color: var(--color-heading-1);
	}

	.stat-text {
		font-size: var(--text-xs);
		color: var(--color-description-3);
		margin-top: var(--space-1);
	}

	/* Scanning Info */
	.scanning-info {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		margin-top: var(--space-6);
		padding: var(--space-3);
		background: color-mix(in srgb, var(--color-primary) 5%, transparent);
		border-radius: var(--radius-lg);
		font-size: var(--text-sm);
		color: var(--color-description-2);
	}

	.scanning-info :global(svg) {
		color: var(--color-primary);
	}

	/* Success Card */
	.success-card {
		border-color: var(--color-success);
		background: color-mix(in srgb, var(--color-success) 5%, var(--color-panel-1));
	}

	.summary-stats {
		display: flex;
		justify-content: center;
		gap: var(--space-12);
		margin: var(--space-8) 0;
	}

	.stat-item {
		text-align: center;
	}

	.stat-value {
		font-size: var(--text-5xl);
		font-weight: var(--font-bold);
		color: var(--color-success);
		line-height: 1;
		margin-bottom: var(--space-2);
	}

	.stat-label {
		font-size: var(--text-sm);
		color: var(--color-description-2);
		font-weight: var(--font-medium);
	}

	.success-hint {
		margin-top: var(--space-6);
		font-size: var(--text-base);
		color: var(--color-description-3);
	}

	/* Error Card */
	.error-card {
		border-color: var(--color-error);
		background: color-mix(in srgb, var(--color-error) 5%, var(--color-panel-1));
	}

	.error-card p {
		margin: var(--space-4) 0;
		font-size: var(--text-base);
		color: var(--color-description-2);
		font-family: 'Monaco', 'Menlo', monospace;
	}

	.retry-btn {
		margin-top: var(--space-4);
		padding: var(--space-3) var(--space-6);
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.retry-btn:hover {
		background: var(--brand-700);
		transform: translateY(-1px);
	}

	/* Responsive */
	@media (max-width: 640px) {
		.step-content {
			padding: var(--space-4);
		}

		.stats-grid {
			grid-template-columns: 1fr;
		}

		.summary-stats {
			flex-direction: column;
			gap: var(--space-6);
		}
	}
</style>
