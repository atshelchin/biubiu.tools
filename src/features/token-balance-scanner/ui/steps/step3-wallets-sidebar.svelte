<script lang="ts">
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
	import { scannerState } from '../../stores/scanner-state.svelte';

	const walletCount = $derived(scannerState.wallets.length);
</script>

<StepSidebar stepNumber={3} title="Import Wallets" description="Add wallet addresses to scan">
	<div class="stats-box">
		<div class="stat">
			<span class="stat-value">{walletCount}</span>
			<span class="stat-label">Wallets Added</span>
		</div>
	</div>

	<div class="info-box">
		<h4>Import Methods</h4>
		<ul class="method-list">
			<li>📝 Paste addresses (one per line)</li>
			<li>📄 Upload CSV or TXT file</li>
			<li>✍️ Add addresses manually</li>
		</ul>
	</div>

	<div class="tip-box">
		<span class="tip-icon">💡</span>
		<p>Tip: You can scan up to 1000 wallets at once.</p>
	</div>
</StepSidebar>

<style>
	.stats-box {
		margin: var(--space-4) 0;
		padding: var(--space-4);
		background: linear-gradient(135deg, hsl(210, 100%, 98%), hsl(210, 100%, 95%));
		border-radius: var(--radius-lg);
		border: 2px solid hsl(210, 100%, 85%);
	}

	:global([data-theme='dark']) .stats-box {
		background: linear-gradient(135deg, hsl(210, 100%, 15%), hsl(210, 100%, 10%));
		border-color: hsl(210, 100%, 25%);
	}

	.stat {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-1);
	}

	.stat-value {
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		color: var(--color-primary);
	}

	.stat-label {
		font-size: var(--text-sm);
		color: var(--gray-600);
		text-transform: uppercase;
		letter-spacing: 0.05em;
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

	.method-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.method-list li {
		font-size: var(--text-sm);
		color: var(--gray-700);
		line-height: 1.5;
	}

	:global([data-theme='dark']) .method-list li {
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
