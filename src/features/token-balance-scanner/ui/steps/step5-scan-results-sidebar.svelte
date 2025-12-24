<script lang="ts">
	import { useI18n } from '@shelchin/i18n';
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
	import { step3State } from '../../stores/step3-state.svelte';
	import { step4State } from '../../stores/step4-state.svelte';
	import { step5State } from '../../stores/step5-state.svelte';
	import { exportToCSV, exportToJSON, exportToExcel } from '../../utils/export';
	import {
		Terminal,
		ChevronDown,
		ChevronUp,
		FileSpreadsheet,
		FileText,
		FileJson,
		RefreshCw,
		AlertTriangle
	} from '@lucide/svelte';

	const i18n = useI18n();
	const connectStore = useConnectStore();
	const stepManager = useStepManager();

	// Get current network
	const currentNetwork = $derived(
		connectStore.currentChainId
			? connectStore.networks.find((n) => n.chainId === connectStore.currentChainId)
			: undefined
	);

	// Export handlers
	function handleExportCSV() {
		exportToCSV(step5State.results, step5State.tokenConfigs, {
			networkName: currentNetwork?.name,
			includeZeroBalance: true
		});
	}

	function handleExportJSON() {
		exportToJSON(step5State.results, step5State.tokenConfigs, step5State.summary, {
			networkName: currentNetwork?.name,
			includeZeroBalance: true
		});
	}

	async function handleExportExcel() {
		await exportToExcel(step5State.results, step5State.tokenConfigs, step5State.summary, {
			networkName: currentNetwork?.name,
			includeZeroBalance: true
		});
	}

	function handleNewScan() {
		step3State.reset();
		step4State.reset();
		step5State.reset();
		stepManager.goTo(1);
	}

	// Reactive state
	const status = $derived(step5State.scanStatus);
	const progress = $derived(step5State.progress);
	const summary = $derived(step5State.summary);
	const logs = $derived(step5State.logs);

	// Logs collapsed state
	let logsExpanded = $state(false);

	// Get recent logs (last 10)
	const recentLogs = $derived(logs.slice(-10).reverse());

	// Format log time
	function formatLogTime(timestamp: number): string {
		const date = new Date(timestamp);
		return date.toLocaleTimeString('en-US', {
			hour12: false,
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		});
	}

	// Get log type color class
	function getLogTypeClass(type: string): string {
		if (type.includes('success') || type.includes('completed')) return 'log-success';
		if (type.includes('failed') || type.includes('error')) return 'log-error';
		if (type.includes('started') || type.includes('progress')) return 'log-info';
		if (type.includes('paused') || type.includes('waiting')) return 'log-warning';
		return 'log-default';
	}
</script>

<StepSidebar stepNumber={5} title="" description="">
	{#if status === 'scanning'}
		<!-- Scanning Progress -->
		<div class="section-box">
			<div class="section-header">
				<span class="section-title"
					>{i18n.t('token-balance-scanner.step5.sidebar.progress') || 'Progress'}</span
				>
				<span class="progress-percent">{progress.percentage}%</span>
			</div>
			<div class="progress-bar">
				<div class="progress-fill" style="width: {progress.percentage}%"></div>
			</div>
			<div class="progress-stats">
				<span class="stat-item">
					<span class="stat-num">{progress.success || 0}</span>
					<span class="stat-label"
						>{i18n.t('token-balance-scanner.step5.sidebar.completed') || 'completed'}</span
					>
				</span>
				<span class="stat-divider">/</span>
				<span class="stat-item">
					<span class="stat-num">{progress.total}</span>
					<span class="stat-label"
						>{i18n.t('token-balance-scanner.step5.sidebar.total') || 'total'}</span
					>
				</span>
			</div>
			{#if progress.failed && progress.failed > 0}
				<div class="failed-notice">
					<AlertTriangle size={14} />
					<span
						>{progress.failed}
						{i18n.t('token-balance-scanner.step5.sidebar.queries_failed') || 'queries failed'}</span
					>
				</div>
			{/if}
		</div>

		<!-- Live Logs -->
		<div class="logs-section">
			<button class="logs-toggle" onclick={() => (logsExpanded = !logsExpanded)}>
				<Terminal size={14} />
				<span>{i18n.t('token-balance-scanner.step5.sidebar.logs') || 'Live Logs'}</span>
				{#if logsExpanded}
					<ChevronUp size={14} />
				{:else}
					<ChevronDown size={14} />
				{/if}
			</button>
			{#if logsExpanded && recentLogs.length > 0}
				<div class="logs-list">
					{#each recentLogs as log, index (`${log.timestamp}-${index}`)}
						<div class="log-entry {getLogTypeClass(log.type)}">
							<span class="log-time">{formatLogTime(log.timestamp)}</span>
							<span class="log-message">{log.message}</span>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{:else if status === 'paused'}
		<!-- Paused Stats -->
		<div class="section-box">
			<div class="section-header">
				<span class="section-title"
					>{i18n.t('token-balance-scanner.step5.sidebar.paused') || 'Paused'}</span
				>
			</div>
			<div class="stats-row">
				<div class="stat-block">
					<span class="stat-value">{progress.success || 0}</span>
					<span class="stat-label"
						>{i18n.t('token-balance-scanner.step5.sidebar.completed') || 'Completed'}</span
					>
				</div>
				<div class="stat-block">
					<span class="stat-value warning">{progress.pending || 0}</span>
					<span class="stat-label"
						>{i18n.t('token-balance-scanner.step5.sidebar.remaining') || 'Remaining'}</span
					>
				</div>
			</div>
		</div>
	{:else if status === 'completed' && summary}
		<!-- Completed: Scan Results -->
		<div class="section-box">
			<div class="section-header">
				<span class="section-title"
					>{i18n.t('token-balance-scanner.step5.sidebar.scan_results') || 'Scan Results'}</span
				>
			</div>
			<div class="result-list">
				<div class="result-item">
					<span class="result-value">{summary.totalWallets}</span>
					<span class="result-label"
						>{i18n.t('token-balance-scanner.step5.sidebar.addresses_scanned') ||
							'addresses scanned'}</span
					>
				</div>
				<div class="result-item highlight">
					<span class="result-value success">{summary.walletsWithBalance}</span>
					<span class="result-label"
						>{i18n.t('token-balance-scanner.step5.sidebar.with_balance') ||
							'addresses with balance'}</span
					>
				</div>
				{#if summary.failureCount > 0}
					<div class="result-item">
						<span class="result-value warning">{summary.failureCount}</span>
						<span class="result-label"
							>{i18n.t('token-balance-scanner.step5.sidebar.queries_failed') ||
								'queries failed'}</span
						>
					</div>
				{/if}
			</div>
		</div>

		<!-- Export Actions -->
		<div class="section-box">
			<div class="section-header">
				<span class="section-title"
					>{i18n.t('token-balance-scanner.step5.sidebar.export') || 'Export'}</span
				>
			</div>
			<div class="action-buttons">
				<button class="action-btn primary" onclick={handleExportExcel}>
					<FileSpreadsheet size={16} />
					<span>Excel</span>
				</button>
				<button class="action-btn" onclick={handleExportCSV}>
					<FileText size={16} />
					<span>CSV</span>
				</button>
				<button class="action-btn" onclick={handleExportJSON}>
					<FileJson size={16} />
					<span>JSON</span>
				</button>
			</div>
		</div>

		<!-- New Scan -->
		<button class="new-scan-btn" onclick={handleNewScan}>
			<RefreshCw size={16} />
			<span>{i18n.t('token-balance-scanner.step5.sidebar.new_scan') || 'Start New Scan'}</span>
		</button>
	{:else}
		<!-- Idle: Ready to Scan -->
		<div class="section-box">
			<div class="section-header">
				<span class="section-title"
					>{i18n.t('token-balance-scanner.step5.sidebar.ready') || 'Ready to Scan'}</span
				>
			</div>
			<div class="result-list">
				<div class="result-item">
					<span class="result-value">{step4State.wallets.length}</span>
					<span class="result-label"
						>{i18n.t('token-balance-scanner.step5.sidebar.wallets') || 'wallets'}</span
					>
				</div>
				<div class="result-item">
					<span class="result-value">{step3State.selectedTokens.size}</span>
					<span class="result-label"
						>{i18n.t('token-balance-scanner.step5.sidebar.tokens') || 'tokens'}</span
					>
				</div>
			</div>
		</div>
	{/if}

	<!-- Info Box -->
	<div class="info-box">
		<h4>{i18n.t('token-balance-scanner.step5.sidebar.info_title') || "What's Happening?"}</h4>
		<ul class="info-list">
			<li>
				{i18n.t('token-balance-scanner.step5.sidebar.info_1') ||
					'Querying blockchain for token balances'}
			</li>
			<li>
				{i18n.t('token-balance-scanner.step5.sidebar.info_2') || 'Using multiple RPCs in parallel'}
			</li>
			<li>
				{i18n.t('token-balance-scanner.step5.sidebar.info_3') || 'Auto-retrying failed requests'}
			</li>
		</ul>
	</div>

	<!-- Tip Box -->
	{#if status === 'completed'}
		<div class="tip-box">
			<p>
				{i18n.t('token-balance-scanner.step5.sidebar.tip_completed') ||
					'Export to Excel for advanced analysis, or CSV for simple spreadsheets.'}
			</p>
		</div>
	{:else if status === 'scanning'}
		<div class="tip-box">
			<p>
				{i18n.t('token-balance-scanner.step5.sidebar.tip_scanning') ||
					'You can close the browser - progress is saved automatically.'}
			</p>
		</div>
	{:else}
		<div class="tip-box">
			<p>
				{i18n.t('token-balance-scanner.step5.sidebar.tip_idle') ||
					'Large scans may take time but can be paused and resumed anytime.'}
			</p>
		</div>
	{/if}
</StepSidebar>

<style>
	/* Section Box - Clean flat style */
	.section-box {
		padding: var(--space-4);
		background: var(--color-panel-1);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-3);
	}

	.section-title {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-700);
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	:global([data-theme='dark']) .section-title {
		color: var(--gray-300);
	}

	/* Progress */
	.progress-percent {
		font-size: var(--text-xl);
		font-weight: var(--font-bold);
		color: var(--color-primary);
	}

	.progress-bar {
		height: 6px;
		background: var(--color-panel-2);
		border-radius: var(--radius-full);
		overflow: hidden;
		margin-bottom: var(--space-3);
	}

	.progress-fill {
		height: 100%;
		background: var(--color-primary);
		transition: width 0.3s ease;
	}

	.progress-stats {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .progress-stats {
		color: var(--gray-400);
	}

	.stat-item {
		display: flex;
		align-items: baseline;
		gap: var(--space-1);
	}

	.stat-num {
		font-weight: var(--font-semibold);
		color: var(--gray-800);
	}

	:global([data-theme='dark']) .stat-num {
		color: var(--gray-200);
	}

	.stat-divider {
		color: var(--gray-400);
	}

	.failed-notice {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-top: var(--space-3);
		padding: var(--space-2);
		background: hsla(0, 80%, 50%, 0.1);
		border-radius: var(--radius-sm);
		font-size: var(--text-xs);
		color: hsl(0, 80%, 45%);
	}

	/* Stats Row */
	.stats-row {
		display: flex;
		gap: var(--space-4);
	}

	.stat-block {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-1);
	}

	.stat-value {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--color-primary);
	}

	.stat-value.warning {
		color: hsl(45, 100%, 40%);
	}

	.stat-label {
		font-size: var(--text-xs);
		color: var(--gray-500);
		text-transform: uppercase;
	}

	/* Result List */
	.result-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.result-item {
		display: flex;
		align-items: baseline;
		gap: var(--space-2);
	}

	.result-item.highlight {
		padding: var(--space-2);
		background: hsla(142, 76%, 50%, 0.08);
		border-radius: var(--radius-sm);
		margin: var(--space-1) 0;
	}

	.result-value {
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		color: var(--gray-900);
		min-width: 40px;
	}

	:global([data-theme='dark']) .result-value {
		color: var(--gray-100);
	}

	.result-value.success {
		color: hsl(142, 71%, 40%);
	}

	.result-value.warning {
		color: hsl(45, 100%, 40%);
	}

	.result-label {
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .result-label {
		color: var(--gray-400);
	}

	/* Action Buttons */
	.action-buttons {
		display: flex;
		gap: var(--space-2);
	}

	.action-btn {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-1);
		padding: var(--space-2) var(--space-3);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--gray-700);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	:global([data-theme='dark']) .action-btn {
		color: var(--gray-300);
	}

	.action-btn:hover {
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	.action-btn.primary {
		background: var(--color-primary);
		border-color: var(--color-primary);
		color: white;
	}

	.action-btn.primary:hover {
		background: var(--color-primary-hover);
		border-color: var(--color-primary-hover);
		color: white;
	}

	/* New Scan Button */
	.new-scan-btn {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		padding: var(--space-3);
		background: transparent;
		border: 1px dashed var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--gray-600);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	:global([data-theme='dark']) .new-scan-btn {
		color: var(--gray-400);
	}

	.new-scan-btn:hover {
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	/* Logs Section */
	.logs-section {
		margin-top: var(--space-3);
	}

	.logs-toggle {
		width: 100%;
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--gray-700);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	:global([data-theme='dark']) .logs-toggle {
		color: var(--gray-300);
	}

	.logs-toggle:hover {
		background: var(--color-panel-2);
	}

	.logs-toggle span {
		flex: 1;
		text-align: left;
	}

	.logs-list {
		margin-top: var(--space-2);
		max-height: 200px;
		overflow-y: auto;
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
	}

	.log-entry {
		display: flex;
		gap: var(--space-2);
		padding: var(--space-1) var(--space-2);
		border-bottom: 1px solid var(--color-border);
		font-size: var(--text-xs);
	}

	.log-entry:last-child {
		border-bottom: none;
	}

	.log-time {
		font-family: monospace;
		color: var(--gray-500);
		flex-shrink: 0;
	}

	.log-message {
		color: var(--gray-700);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	:global([data-theme='dark']) .log-message {
		color: var(--gray-300);
	}

	.log-success .log-message {
		color: hsl(142, 60%, 40%);
	}

	.log-error .log-message {
		color: hsl(0, 80%, 50%);
	}

	.log-warning .log-message {
		color: hsl(45, 100%, 40%);
	}

	.log-info .log-message {
		color: var(--color-primary);
	}

	/* Info Box */
	.info-box {
		padding: var(--space-3);
		background: var(--color-panel-1);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
	}

	.info-box h4 {
		margin: 0 0 var(--space-2) 0;
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .info-box h4 {
		color: var(--gray-100);
	}

	.info-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.info-list li {
		padding-left: var(--space-4);
		position: relative;
		font-size: var(--text-sm);
		color: var(--gray-600);
		line-height: 1.4;
	}

	:global([data-theme='dark']) .info-list li {
		color: var(--gray-400);
	}

	.info-list li::before {
		content: '>';
		position: absolute;
		left: 0;
		color: var(--color-primary);
		font-weight: bold;
	}

	/* Tip Box */
	.tip-box {
		padding: var(--space-3);
		background: var(--color-panel-1);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
		border-left: 3px solid var(--color-primary);
	}

	.tip-box p {
		margin: 0;
		font-size: var(--text-sm);
		color: var(--gray-600);
		line-height: 1.4;
	}

	:global([data-theme='dark']) .tip-box p {
		color: var(--gray-400);
	}
</style>
