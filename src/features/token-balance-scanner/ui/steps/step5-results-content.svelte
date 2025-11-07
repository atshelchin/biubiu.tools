<script lang="ts">
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import { scannerState } from '../../stores/scanner-state.svelte';
	import { exportToCSV, exportToJSON, calculateTotalBalance } from '../../utils/balance-scanner';
	import { Download, FileText, FileJson } from 'lucide-svelte';

	const balances = $derived(scannerState.balances);

	// Get unique tokens from first wallet
	const tokens = $derived(balances[0]?.balances.map((b) => b.token) || []);

	// Calculate totals for each token
	const tokenTotals = $derived(
		tokens.map((token) => ({
			token,
			total: calculateTotalBalance(balances, token.id)
		}))
	);

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
		title="Balance Results"
		description="Review scanned balances and export data"
	/>

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
						{#each tokens as token (token.id)}
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

<style>
	.step-content {
		padding: var(--space-6);
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
		margin-top: var(--space-6);
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
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
		margin-top: var(--space-8);
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
		margin-top: var(--space-8);
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
