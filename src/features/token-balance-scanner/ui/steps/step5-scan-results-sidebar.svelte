<script lang="ts">
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
	import { scannerState } from '../../stores/scanner-state.svelte';

	const status = $derived(scannerState.scanStatus);
	const progress = $derived(scannerState.progress);
	const balances = $derived(scannerState.balances);
	const totalWallets = $derived(balances.length);

	// Get first wallet's tokens to calculate totals
	const tokens = $derived(balances[0]?.balances.map((b) => b.token) || []);
</script>

<StepSidebar stepNumber={5} title="Scan & Results" description="Scan balances and export data">
	{#if status === 'scanning' && progress}
		<div class="progress-box">
			<div class="progress-stats">
				<span class="progress-label">Progress</span>
				<span class="progress-value">{progress.percentage}%</span>
			</div>
			<div class="progress-bar">
				<div class="progress-fill" style="width: {progress.percentage}%"></div>
			</div>
			<div class="progress-details">
				<span>Wallet {progress.current} of {progress.total}</span>
			</div>
		</div>
	{:else if status === 'completed'}
		<div class="stats-box completed">
			<div class="stat">
				<span class="stat-value">{totalWallets}</span>
				<span class="stat-label">Wallets Scanned</span>
			</div>
			<div class="stat">
				<span class="stat-value">{tokens.length}</span>
				<span class="stat-label">Tokens Checked</span>
			</div>
		</div>
	{:else}
		<div class="stats-box">
			<div class="stat">
				<span class="stat-value">{scannerState.wallets.length}</span>
				<span class="stat-label">Wallets to Scan</span>
			</div>
			<div class="stat">
				<span class="stat-value">{scannerState.selectedTokens.size}</span>
				<span class="stat-label">Tokens Selected</span>
			</div>
		</div>
	{/if}

	<div class="info-box">
		<h4>What's Happening?</h4>
		<ul class="info-list">
			<li>Querying blockchain for token balances</li>
			<li>Aggregating results across wallets</li>
			<li>Calculating total holdings</li>
		</ul>
	</div>

	{#if status === 'completed'}
		<div class="tip-box">
			<p>Use CSV export to analyze data in Excel or Google Sheets.</p>
		</div>
	{:else}
		<div class="tip-box">
			<p>This may take a few moments depending on the number of wallets and tokens.</p>
		</div>
	{/if}
</StepSidebar>

<style>
	/* Progress Box */
	.progress-box {
		margin: var(--space-4) 0;
		padding: var(--space-4);
		background: linear-gradient(135deg, hsl(210, 100%, 98%), hsl(210, 100%, 95%));
		border-radius: var(--radius-lg);
		border: 2px solid hsl(210, 100%, 85%);
	}

	:global([data-theme='dark']) .progress-box {
		background: linear-gradient(135deg, hsl(210, 100%, 15%), hsl(210, 100%, 10%));
		border-color: hsl(210, 100%, 25%);
	}

	.progress-stats {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-2);
	}

	.progress-label {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .progress-label {
		color: var(--gray-300);
	}

	.progress-value {
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		color: var(--color-primary);
	}

	.progress-bar {
		height: 8px;
		background: var(--color-panel-1);
		border-radius: var(--radius-full);
		overflow: hidden;
		margin-bottom: var(--space-2);
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--color-primary), hsl(210, 100%, 60%));
		transition: width 0.3s ease;
	}

	.progress-details {
		font-size: var(--text-xs);
		color: var(--gray-600);
		text-align: center;
	}

	:global([data-theme='dark']) .progress-details {
		color: var(--gray-400);
	}

	/* Stats Box */
	.stats-box {
		margin: var(--space-4) 0;
		padding: var(--space-4);
		background: linear-gradient(135deg, hsl(210, 100%, 98%), hsl(210, 100%, 95%));
		border-radius: var(--radius-lg);
		border: 2px solid hsl(210, 100%, 85%);
		display: flex;
		gap: var(--space-4);
	}

	.stats-box.completed {
		background: linear-gradient(135deg, hsl(120, 60%, 98%), hsl(120, 60%, 95%));
		border-color: hsl(120, 60%, 85%);
	}

	:global([data-theme='dark']) .stats-box {
		background: linear-gradient(135deg, hsl(210, 100%, 15%), hsl(210, 100%, 10%));
		border-color: hsl(210, 100%, 25%);
	}

	:global([data-theme='dark']) .stats-box.completed {
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
		color: var(--color-primary);
	}

	.stats-box.completed .stat-value {
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

	/* Info Box */
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

	.info-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.info-list li {
		padding-left: var(--space-5);
		position: relative;
		font-size: var(--text-sm);
		color: var(--gray-700);
		line-height: 1.5;
	}

	:global([data-theme='dark']) .info-list li {
		color: var(--gray-300);
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
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: hsla(45, 100%, 95%, 1);
		border-radius: var(--radius-md);
		border: 1px solid hsla(45, 100%, 80%, 1);
	}

	:global([data-theme='dark']) .tip-box {
		background: hsla(45, 100%, 15%, 0.3);
		border-color: hsla(45, 100%, 25%, 1);
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
