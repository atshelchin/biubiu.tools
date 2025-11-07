<script lang="ts">
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import {
		scanState,
		contractConfigState,
		timeRangeState
	} from '../../stores/scanner-state.svelte';
	import {
		scanContractEvents,
		dateToBlockNumber,
		estimateScanDuration
	} from '../../utils/event-scanner';
	import { eventsDB } from '../../db/events-db';
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import { createPublicClient, http } from 'viem';
	import { AlertCircle, CheckCircle2, Loader2, PlayCircle } from 'lucide-svelte';
	import type { ScanConfig } from '../../types/scanner';

	const connectStore = useConnectStore();

	// Get current network RPC URL
	const currentNetwork = $derived(
		connectStore.currentChainId
			? connectStore.networks.find((n) => n.chainId === connectStore.currentChainId)
			: undefined
	);

	// Scan state
	const status = $derived(scanState.progress.status);
	const progress = $derived(scanState.progress);

	// Estimated duration
	let estimatedDuration = $state(0);

	// Calculate estimated duration when range is set
	$effect(() => {
		if (timeRangeState.fromBlock !== null && timeRangeState.toBlock !== null) {
			estimatedDuration = estimateScanDuration(timeRangeState.fromBlock, timeRangeState.toBlock);
		}
	});

	// Start scan
	async function startScan() {
		if (!currentNetwork || !connectStore.currentChainId) {
			scanState.failScan('No network selected');
			return;
		}

		const contractConfig = contractConfigState.getScanConfig();
		if (!contractConfig || !contractConfig.contractAddress || !contractConfig.eventAbi) {
			scanState.failScan('Invalid contract configuration');
			return;
		}

		try {
			scanState.startScan();

			// Create public client
			const rpcUrl = currentNetwork.rpcEndpoints[0].url;
			const client = createPublicClient({
				chain: {
					id: connectStore.currentChainId,
					name: currentNetwork.name,
					nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
					rpcUrls: {
						default: { http: [rpcUrl] },
						public: { http: [rpcUrl] }
					}
				},
				transport: http(rpcUrl)
			});

			// Convert dates to blocks if using date range
			let fromBlock: bigint;
			let toBlock: bigint;

			if (timeRangeState.useBlockRange) {
				fromBlock = timeRangeState.fromBlock!;
				toBlock = timeRangeState.toBlock!;
			} else {
				// Convert dates to blocks
				fromBlock = await dateToBlockNumber(client, timeRangeState.fromDate!);
				toBlock = await dateToBlockNumber(client, timeRangeState.toDate!);
			}

			// Build scan config
			const scanConfig: ScanConfig = {
				chainId: connectStore.currentChainId,
				contractAddress: contractConfig.contractAddress,
				eventName: contractConfig.eventName!,
				eventAbi: contractConfig.eventAbi,
				fromBlock,
				toBlock,
				fromDate: timeRangeState.fromDate || undefined,
				toDate: timeRangeState.toDate || undefined
			};

			// Execute scan
			const events = await scanContractEvents(client, scanConfig, (prog) => {
				scanState.updateProgress(prog);
			});

			// Store events in IndexedDB
			if (events.length > 0) {
				await eventsDB.addEvents(events);

				// Store scan result metadata
				await eventsDB.addScanResult({
					id: crypto.randomUUID(),
					chainId: scanConfig.chainId,
					contractAddress: scanConfig.contractAddress,
					eventName: scanConfig.eventName,
					fromBlock,
					toBlock,
					fromDate: timeRangeState.fromDate || new Date(0),
					toDate: timeRangeState.toDate || new Date(),
					totalEvents: events.length,
					scannedAt: new Date(),
					scanDuration: 0 // TODO: Calculate actual duration
				});
			}

			scanState.completeScan();
		} catch (error) {
			console.error('Scan failed:', error);
			scanState.failScan(error instanceof Error ? error.message : 'Unknown error');
		}
	}

	// Retry scan
	function retryScan() {
		startScan();
	}
</script>

<div class="step-content">
	<StepContentHeader title="Scan Events" description="Execute the event scan and track progress" />

	{#if status === 'idle'}
		<!-- Ready to Scan -->
		<div class="scan-config">
			<h3>Scan Configuration</h3>
			<div class="config-grid">
				<div class="config-item">
					<span class="config-label">Network:</span>
					<span class="config-value">{currentNetwork?.name || 'Unknown'}</span>
				</div>
				<div class="config-item">
					<span class="config-label">Contract:</span>
					<span class="config-value contract-address">
						{contractConfigState.contractAddress}
					</span>
				</div>
				<div class="config-item">
					<span class="config-label">Event:</span>
					<span class="config-value">{contractConfigState.selectedEvent?.name}</span>
				</div>
				{#if timeRangeState.useBlockRange}
					<div class="config-item">
						<span class="config-label">Block Range:</span>
						<span class="config-value">
							{timeRangeState.fromBlock?.toString()} → {timeRangeState.toBlock?.toString()}
						</span>
					</div>
				{:else}
					<div class="config-item">
						<span class="config-label">Date Range:</span>
						<span class="config-value">
							{timeRangeState.fromDate?.toLocaleDateString()} → {timeRangeState.toDate?.toLocaleDateString()}
						</span>
					</div>
				{/if}
				<div class="config-item">
					<span class="config-label">Est. Duration:</span>
					<span class="config-value">{estimatedDuration} seconds</span>
				</div>
			</div>
		</div>

		<button class="start-scan-btn" onclick={startScan}>
			<PlayCircle size={24} />
			<span>Start Scanning</span>
		</button>

		<div class="info-card">
			<p>Click "Start Scanning" to begin querying events from the blockchain.</p>
		</div>
	{:else if status === 'scanning'}
		<!-- Scanning Progress -->
		<div class="scanning-state">
			<div class="scanning-animation">
				<Loader2 size={64} class="spin" />
			</div>
			<h3>Scanning Events...</h3>

			<div class="scan-progress">
				<div class="progress-bar">
					<div class="progress-fill" style="width: {progress.percentage}%"></div>
				</div>

				<div class="progress-stats">
					<div class="stat">
						<span class="stat-label">Progress:</span>
						<span class="stat-value">{progress.percentage.toFixed(1)}%</span>
					</div>
					<div class="stat">
						<span class="stat-label">Events Found:</span>
						<span class="stat-value">{progress.scannedEvents}</span>
					</div>
					<div class="stat">
						<span class="stat-label">Current Block:</span>
						<span class="stat-value">{progress.currentBlock.toString()}</span>
					</div>
					<div class="stat">
						<span class="stat-label">Total Blocks:</span>
						<span class="stat-value">{progress.totalBlocks.toString()}</span>
					</div>
				</div>

				<p class="progress-message">{progress.message}</p>
			</div>
		</div>
	{:else if status === 'completed'}
		<!-- Scan Complete -->
		<div class="success-state">
			<CheckCircle2 size={64} class="success-icon" />
			<h3>Scan Complete!</h3>
			<p class="success-message">
				Successfully scanned {progress.scannedEvents} events and saved them to IndexedDB
			</p>

			<div class="success-stats">
				<div class="stat-card">
					<span class="stat-number">{progress.scannedEvents}</span>
					<span class="stat-label">Events Found</span>
				</div>
				<div class="stat-card">
					<span class="stat-number">{progress.totalBlocks.toString()}</span>
					<span class="stat-label">Blocks Scanned</span>
				</div>
			</div>
		</div>
	{:else if status === 'error'}
		<!-- Error State -->
		<div class="error-state">
			<AlertCircle size={64} class="error-icon" />
			<h3>Scan Failed</h3>
			<p class="error-message">{progress.error || 'An unknown error occurred'}</p>
			<button class="retry-btn" onclick={retryScan}>
				<PlayCircle size={20} />
				<span>Retry Scan</span>
			</button>
		</div>
	{/if}
</div>

<style>
	.step-content {
		padding: var(--space-6);
	}

	/* Scan Configuration */
	.scan-config {
		margin-top: var(--space-6);
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
	}

	.scan-config h3 {
		margin: 0 0 var(--space-4) 0;
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .scan-config h3 {
		color: var(--gray-100);
	}

	.config-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-3);
	}

	.config-item {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		padding: var(--space-3);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
	}

	.config-label {
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		color: var(--gray-600);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	:global([data-theme='dark']) .config-label {
		color: var(--gray-400);
	}

	.config-value {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .config-value {
		color: var(--gray-100);
	}

	.config-value.contract-address {
		font-family: monospace;
		font-size: var(--text-sm);
		word-break: break-all;
	}

	/* Start Scan Button */
	.start-scan-btn {
		margin-top: var(--space-6);
		width: 100%;
		padding: var(--space-4) var(--space-8);
		background: linear-gradient(135deg, hsl(210, 100%, 50%), hsl(210, 100%, 40%));
		color: white;
		border: none;
		border-radius: var(--radius-lg);
		font-size: var(--text-xl);
		font-weight: var(--font-bold);
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-3);
		box-shadow: 0 4px 12px hsla(210, 100%, 50%, 0.3);
	}

	.start-scan-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 24px hsla(210, 100%, 50%, 0.4);
	}

	/* Info Card */
	.info-card {
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		text-align: center;
	}

	.info-card p {
		margin: 0;
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .info-card p {
		color: var(--gray-400);
	}

	/* Scanning State */
	.scanning-state {
		margin-top: var(--space-8);
		padding: var(--space-8);
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-4);
	}

	.scanning-animation :global(.spin) {
		color: var(--color-primary);
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.scanning-state h3 {
		margin: 0;
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .scanning-state h3 {
		color: var(--gray-100);
	}

	.scan-progress {
		width: 100%;
		max-width: 600px;
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.progress-bar {
		height: 16px;
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-full);
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--color-primary), hsl(210, 100%, 60%));
		transition: width 0.3s ease;
	}

	.progress-stats {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-3);
	}

	.stat {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		padding: var(--space-3);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
	}

	.stat-label {
		font-size: var(--text-xs);
		color: var(--gray-600);
		text-transform: uppercase;
	}

	:global([data-theme='dark']) .stat-label {
		color: var(--gray-400);
	}

	.stat-value {
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		color: var(--gray-900);
		font-family: monospace;
	}

	:global([data-theme='dark']) .stat-value {
		color: var(--gray-100);
	}

	.progress-message {
		margin: 0;
		font-size: var(--text-sm);
		color: var(--gray-700);
		text-align: center;
	}

	:global([data-theme='dark']) .progress-message {
		color: var(--gray-300);
	}

	/* Success State */
	.success-state {
		margin-top: var(--space-8);
		padding: var(--space-8);
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-4);
		background: hsla(120, 60%, 98%, 1);
		border: 2px solid hsla(120, 60%, 80%, 1);
		border-radius: var(--radius-lg);
	}

	:global([data-theme='dark']) .success-state {
		background: hsla(120, 60%, 15%, 0.3);
		border-color: hsla(120, 60%, 30%, 1);
	}

	:global(.success-icon) {
		color: hsla(120, 60%, 50%, 1);
	}

	.success-state h3 {
		margin: 0;
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .success-state h3 {
		color: var(--gray-100);
	}

	.success-message {
		margin: 0;
		font-size: var(--text-base);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .success-message {
		color: var(--gray-300);
	}

	.success-stats {
		display: flex;
		gap: var(--space-4);
		margin-top: var(--space-4);
	}

	.stat-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-4);
		background: var(--color-panel-0);
		border: 2px solid hsla(120, 60%, 70%, 1);
		border-radius: var(--radius-lg);
		min-width: 150px;
	}

	:global([data-theme='dark']) .stat-card {
		border-color: hsla(120, 60%, 40%, 1);
	}

	.stat-number {
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		color: hsla(120, 60%, 50%, 1);
		font-family: monospace;
	}

	.stat-card .stat-label {
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .stat-card .stat-label {
		color: var(--gray-400);
	}

	/* Error State */
	.error-state {
		margin-top: var(--space-8);
		padding: var(--space-8);
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-4);
		background: hsla(0, 80%, 98%, 1);
		border: 2px solid hsla(0, 80%, 80%, 1);
		border-radius: var(--radius-lg);
	}

	:global([data-theme='dark']) .error-state {
		background: hsla(0, 80%, 15%, 0.3);
		border-color: hsla(0, 80%, 30%, 1);
	}

	:global(.error-icon) {
		color: hsla(0, 80%, 50%, 1);
	}

	.error-state h3 {
		margin: 0;
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .error-state h3 {
		color: var(--gray-100);
	}

	.error-message {
		margin: 0;
		font-size: var(--text-base);
		color: var(--gray-700);
		font-family: monospace;
		padding: var(--space-3);
		background: var(--color-panel-0);
		border-radius: var(--radius-md);
		max-width: 500px;
	}

	:global([data-theme='dark']) .error-message {
		color: var(--gray-300);
	}

	.retry-btn {
		padding: var(--space-3) var(--space-6);
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.retry-btn:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px hsla(210, 100%, 50%, 0.3);
	}

	/* Responsive */
	@media (max-width: 640px) {
		.step-content {
			padding: var(--space-3);
		}

		.config-grid {
			grid-template-columns: 1fr;
		}

		.progress-stats {
			grid-template-columns: 1fr;
		}

		.success-stats {
			flex-direction: column;
			width: 100%;
		}

		.stat-card {
			width: 100%;
		}
	}
</style>
