<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import { step3State } from '../../stores/step3-state.svelte';
	import { step4State } from '../../stores/step4-state.svelte';
	import { step5State } from '../../stores/step5-state.svelte';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import {
		scanMultipleWallets,
		exportToCSV,
		exportToJSON,
		calculateTotalBalance
	} from '../../utils/balance-scanner';
	import { PREDEFINED_TOKENS } from '$lib/config/tokens';
	import type { NativeToken, ERC20Token } from '$lib/types/token';
	import { AlertCircle, CheckCircle2, Loader2, Download, FileText, FileJson } from '@lucide/svelte';

	const connectStore = useConnectStore();

	// Get selected tokens
	const selectedTokens = $derived(() => {
		if (!connectStore.currentChainId) return [];

		const tokens: (NativeToken | ERC20Token)[] = [];

		// Add native token
		const currentNetwork = connectStore.networks.find(
			(n) => n.chainId === connectStore.currentChainId
		);
		if (currentNetwork) {
			const nativeToken: NativeToken = {
				id: `${connectStore.currentChainId}:native`,
				type: 'native',
				symbol: currentNetwork.symbol,
				name: currentNetwork.name,
				decimals: 18,
				chainId: connectStore.currentChainId,
				logoUrl: ''
			};
			tokens.push(nativeToken);
		}

		// Add ERC20 tokens
		const erc20Tokens = PREDEFINED_TOKENS[connectStore.currentChainId];
		if (erc20Tokens && erc20Tokens.length > 0) {
			tokens.push(...erc20Tokens);
		}

		return tokens.filter((token) => step3State.selectedTokens.has(token.id));
	});

	// Get current network
	const currentNetwork = $derived(
		connectStore.currentChainId
			? connectStore.networks.find((n) => n.chainId === connectStore.currentChainId)
			: undefined
	);

	// Scan status
	const status = $derived(step5State.scanStatus);
	const progress = $derived(step5State.progress);
	const error = $derived(step5State.error);
	const balances = $derived(step5State.balances);

	// Get unique tokens from first wallet (for results display)
	const resultTokens = $derived(balances[0]?.balances.map((b) => b.token) || []);

	// Calculate totals for each token
	const tokenTotals = $derived(
		resultTokens.map((token) => ({
			token,
			total: calculateTotalBalance(balances, token.id)
		}))
	);

	// Start scan
	async function startScan() {
		if (!currentNetwork || !connectStore.currentChainId) {
			step5State.setScanStatus('error');
			step5State.setError('No network selected');
			return;
		}

		const tokens = selectedTokens();
		if (tokens.length === 0) {
			step5State.setScanStatus('error');
			step5State.setError('No tokens selected');
			return;
		}

		if (step4State.wallets.length === 0) {
			step5State.setScanStatus('error');
			step5State.setError('No wallets added');
			return;
		}

		try {
			step5State.setScanStatus('scanning');
			step5State.setError(null);

			const results = await scanMultipleWallets(
				step4State.wallets,
				tokens,
				currentNetwork?.rpcEndpoints?.[0]?.url ?? '',
				(prog) => {
					step5State.setProgress(prog);
				}
			);

			step5State.setBalances(results);
			step5State.setScanStatus('completed');
		} catch (err) {
			console.error('Scan failed:', err);
			step5State.setScanStatus('error');
			step5State.setError(err instanceof Error ? err.message : 'Scan failed');
		}
	}

	// Retry scan
	function retryScan() {
		startScan();
	}

	// Export to CSV
	function handleExportCSV() {
		const csv = exportToCSV(balances);
		const blob = new Blob([csv], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `token-balances-${Date.now()}.csv`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	// Export to JSON
	function handleExportJSON() {
		const json = exportToJSON(balances);
		const blob = new Blob([json], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `token-balances-${Date.now()}.json`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}
</script>

<div class="step-content">
	<StepContentHeader
		title="Scan & View Results"
		description="Scan token balances and export data"
	/>

	{#if status === 'idle'}
		<!-- Ready to Scan -->
		<div class="scan-config">
			<div class="config-item">
				<span class="config-label">Network:</span>
				<span class="config-value">{currentNetwork?.name || 'Unknown'}</span>
			</div>
			<div class="config-item">
				<span class="config-label">Wallets:</span>
				<span class="config-value">{step4State.wallets.length}</span>
			</div>
			<div class="config-item">
				<span class="config-label">Tokens:</span>
				<span class="config-value">{step3State.selectedTokens.size}</span>
			</div>
		</div>

		<button class="start-scan-btn" onclick={startScan}>
			<Loader2 size={24} />
			<span>Start Scanning</span>
		</button>

		<div class="info-card">
			<p>Click "Start Scanning" to query token balances for all configured wallets.</p>
		</div>
	{:else if status === 'scanning'}
		<!-- Scanning Progress -->
		<div class="scanning-state">
			<div class="scanning-animation">
				<Loader2 size={64} class="spin" />
			</div>
			<h3>Scanning Balances...</h3>
			{#if progress}
				<div class="scan-progress">
					<div class="progress-bar">
						<div class="progress-fill" style="width: {progress.percentage}%"></div>
					</div>
					<p class="progress-text">
						Scanning wallet {progress.current} of {progress.total}
						{#if progress.currentWallet}
							<br />
							<span class="current-wallet">{progress.currentWallet}</span>
						{/if}
					</p>
				</div>
			{/if}
		</div>
	{:else if status === 'completed'}
		<!-- Results View -->
		<div class="results-section">
			<div class="success-banner">
				<CheckCircle2 size={24} class="success-icon" />
				<span>Scan Complete - {balances.length} wallets scanned</span>
			</div>

			<!-- Export Actions -->
			<div class="export-section">
				<h3>Export Results</h3>
				<div class="export-buttons">
					<button class="export-btn csv" onclick={handleExportCSV}>
						<FileText size={20} />
						<span>Export as CSV</span>
						<Download size={16} />
					</button>
					<button class="export-btn json" onclick={handleExportJSON}>
						<FileJson size={20} />
						<span>Export as JSON</span>
						<Download size={16} />
					</button>
				</div>
			</div>

			<!-- Token Totals -->
			<div class="totals-section">
				<h3>Total Holdings</h3>
				<div class="totals-grid">
					{#each tokenTotals as { token, total } (token.id)}
						<div class="total-card">
							<div class="token-info">
								<span class="token-symbol">{token.symbol}</span>
								<span class="token-name">{token.name}</span>
							</div>
							<div class="total-amount">{total}</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Wallet Balances Table -->
			<div class="balances-section">
				<h3>Wallet Balances</h3>
				<div class="table-container">
					<table class="balances-table">
						<thead>
							<tr>
								<th>Wallet Address</th>
								{#each resultTokens as token (token.id)}
									<th>{token.symbol}</th>
								{/each}
							</tr>
						</thead>
						<tbody>
							{#each balances as wallet (wallet.address)}
								<tr>
									<td class="wallet-cell">{wallet.address}</td>
									{#each wallet.balances as balance (balance.token.id)}
										<td class="balance-cell">{balance.formattedBalance}</td>
									{/each}
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	{:else if status === 'error'}
		<!-- Error State -->
		<div class="error-state">
			<AlertCircle size={64} class="error-icon" />
			<h3>Scan Failed</h3>
			<p class="error-message">{error || 'An unknown error occurred'}</p>
			<button class="retry-btn" onclick={retryScan}>Retry Scan</button>
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
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.config-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-2) 0;
		border-bottom: 1px solid var(--color-border);
	}

	.config-item:last-child {
		border-bottom: none;
	}

	.config-label {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--gray-600);
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

	/* Start Scan Button */
	.start-scan-btn {
		margin-top: var(--space-6);
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
		max-width: 500px;
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.progress-bar {
		height: 12px;
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

	.progress-text {
		margin: 0;
		font-size: var(--text-base);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .progress-text {
		color: var(--gray-300);
	}

	.current-wallet {
		font-family: monospace;
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .current-wallet {
		color: var(--gray-400);
	}

	/* Results Section */
	.results-section {
		margin-top: var(--space-6);
	}

	.success-banner {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-4);
		background: hsla(120, 60%, 98%, 1);
		border: 2px solid hsla(120, 60%, 80%, 1);
		border-radius: var(--radius-lg);
		margin-bottom: var(--space-6);
	}

	:global([data-theme='dark']) .success-banner {
		background: hsla(120, 60%, 15%, 0.3);
		border-color: hsla(120, 60%, 30%, 1);
	}

	:global(.success-icon) {
		color: hsla(120, 60%, 50%, 1);
	}

	.success-banner span {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .success-banner span {
		color: var(--gray-100);
	}

	h3 {
		margin: 0 0 var(--space-4) 0;
		font-size: var(--text-xl);
		font-weight: var(--font-bold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) h3 {
		color: var(--gray-100);
	}

	/* Export Section */
	.export-section {
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		margin-bottom: var(--space-6);
	}

	.export-buttons {
		display: flex;
		gap: var(--space-3);
		flex-wrap: wrap;
	}

	.export-btn {
		flex: 1;
		min-width: 200px;
		padding: var(--space-3) var(--space-4);
		background: var(--color-panel-0);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .export-btn {
		color: var(--gray-100);
	}

	.export-btn:hover {
		border-color: var(--color-primary);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px hsla(0, 0%, 0%, 0.1);
	}

	.export-btn.csv:hover {
		border-color: hsl(120, 60%, 50%);
		background: hsla(120, 60%, 98%, 1);
	}

	:global([data-theme='dark']) .export-btn.csv:hover {
		background: hsla(120, 60%, 15%, 0.3);
	}

	.export-btn.json:hover {
		border-color: hsl(45, 100%, 50%);
		background: hsla(45, 100%, 98%, 1);
	}

	:global([data-theme='dark']) .export-btn.json:hover {
		background: hsla(45, 100%, 15%, 0.3);
	}

	/* Totals Section */
	.totals-section {
		margin-bottom: var(--space-6);
	}

	.totals-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: var(--space-4);
	}

	.total-card {
		padding: var(--space-4);
		background: linear-gradient(135deg, hsl(210, 100%, 98%), hsl(210, 100%, 95%));
		border: 2px solid hsl(210, 100%, 85%);
		border-radius: var(--radius-lg);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	:global([data-theme='dark']) .total-card {
		background: linear-gradient(135deg, hsl(210, 100%, 15%), hsl(210, 100%, 10%));
		border-color: hsl(210, 100%, 25%);
	}

	.token-info {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.token-symbol {
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .token-symbol {
		color: var(--gray-100);
	}

	.token-name {
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .token-name {
		color: var(--gray-400);
	}

	.total-amount {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--color-primary);
		font-family: monospace;
	}

	/* Balances Section */
	.balances-section {
		margin-bottom: var(--space-6);
	}

	.table-container {
		overflow-x: auto;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		background: var(--color-panel-0);
	}

	.balances-table {
		width: 100%;
		border-collapse: collapse;
		font-size: var(--text-sm);
	}

	.balances-table thead {
		background: var(--color-panel-1);
		border-bottom: 2px solid var(--color-border);
	}

	.balances-table th {
		padding: var(--space-3);
		text-align: left;
		font-weight: var(--font-semibold);
		color: var(--gray-700);
		white-space: nowrap;
	}

	:global([data-theme='dark']) .balances-table th {
		color: var(--gray-300);
	}

	.balances-table tbody tr {
		border-bottom: 1px solid var(--color-border);
	}

	.balances-table tbody tr:hover {
		background: var(--color-panel-1);
	}

	.balances-table tbody tr:last-child {
		border-bottom: none;
	}

	.balances-table td {
		padding: var(--space-3);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .balances-table td {
		color: var(--gray-100);
	}

	.wallet-cell {
		font-family: monospace;
		font-size: var(--text-xs);
		max-width: 200px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.balance-cell {
		font-family: monospace;
		text-align: right;
		font-weight: var(--font-medium);
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

		.export-buttons {
			flex-direction: column;
		}

		.export-btn {
			min-width: 100%;
		}

		.totals-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
