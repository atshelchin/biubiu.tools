<script lang="ts">
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
	import { scannerState } from '../../stores/scanner-state.svelte';

	const balances = $derived(scannerState.balances);
	const totalWallets = $derived(balances.length);

	// Get first wallet's tokens to calculate totals
	const tokens = $derived(balances[0]?.balances.map((b) => b.token) || []);
</script>

<StepSidebar stepNumber={5} title="View Results" description="Review balances and export data">
	<div class="stats-box">
		<div class="stat">
			<span class="stat-value">{totalWallets}</span>
			<span class="stat-label">Wallets Scanned</span>
		</div>
		<div class="stat">
			<span class="stat-value">{tokens.length}</span>
			<span class="stat-label">Tokens Checked</span>
		</div>
	</div>

	<div class="info-box">
		<h4>Export Options</h4>
		<ul class="export-list">
			<li>📄 CSV - Spreadsheet format</li>
			<li>📋 JSON - Raw data format</li>
		</ul>
	</div>

	<div class="tip-box">
		<span class="tip-icon">💡</span>
		<p>Tip: Use CSV export to analyze data in Excel or Google Sheets.</p>
	</div>
</StepSidebar>

<style>
	.stats-box {
		margin: var(--space-4) 0;
		padding: var(--space-4);
		background: linear-gradient(135deg, hsl(120, 60%, 98%), hsl(120, 60%, 95%));
		border-radius: var(--radius-lg);
		border: 2px solid hsl(120, 60%, 85%);
		display: flex;
		gap: var(--space-4);
	}

	:global([data-theme='dark']) .stats-box {
		background: linear-gradient(135deg, hsl(120, 60%, 15%), hsl(120, 60%, 10%));
		border-color: hsl(120, 60%, 25%);
	}

	.stat {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-1);
	}

	.stat-value {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: hsla(120, 60%, 50%, 1);
	}

	.stat-label {
		font-size: var(--text-xs);
		color: var(--gray-600);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		text-align: center;
	}

	:global([data-theme='dark']) .stat-label {
		color: var(--gray-400);
	}

	.info-box {
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: var(--color-panel-1);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
	}

	.info-box h4 {
		margin: 0 0 var(--space-2) 0;
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .info-box h4 {
		color: var(--gray-100);
	}

	.export-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.export-list li {
		font-size: var(--text-sm);
		color: var(--gray-700);
		line-height: 1.5;
	}

	:global([data-theme='dark']) .export-list li {
		color: var(--gray-300);
	}

	.tip-box {
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: hsla(45, 100%, 95%, 1);
		border-radius: var(--radius-md);
		border: 1px solid hsla(45, 100%, 80%, 1);
		display: flex;
		gap: var(--space-2);
		align-items: flex-start;
	}

	:global([data-theme='dark']) .tip-box {
		background: hsla(45, 100%, 15%, 0.3);
		border-color: hsla(45, 100%, 25%, 1);
	}

	.tip-icon {
		font-size: var(--text-xl);
		flex-shrink: 0;
		line-height: 1;
	}

	.tip-box p {
		margin: 0;
		font-size: var(--text-sm);
		color: var(--gray-700);
		line-height: 1.5;
	}

	:global([data-theme='dark']) .tip-box p {
		color: var(--gray-300);
	}
</style>
