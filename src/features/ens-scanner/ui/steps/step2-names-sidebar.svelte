<script lang="ts">
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
	import { ensState } from '../../stores/ens-state.svelte';

	const totalNames = $derived(ensState.allNames.length);
</script>

<StepSidebar stepNumber={2} title="Generate Names" description="Create or import ENS names to scan">
	<div class="stats-box">
		<div class="stat">
			<span class="stat-value">{totalNames}</span>
			<span class="stat-label">Names Ready</span>
		</div>
	</div>

	<div class="info-box">
		<h4>Generation Patterns</h4>
		<ul class="pattern-list">
			<li>📅 Birthday - YYYYMMDD</li>
			<li>🔤 Triple - AAA, BBB</li>
			<li>🔄 ABAB - ABAB, CDCD</li>
			<li>🔢 Numeric - 001, 002</li>
		</ul>
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

	.pattern-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.pattern-list li {
		font-size: var(--text-sm);
		color: var(--gray-700);
		line-height: 1.5;
	}

	:global([data-theme='dark']) .pattern-list li {
		color: var(--gray-300);
	}
</style>
