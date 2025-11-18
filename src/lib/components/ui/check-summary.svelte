<script lang="ts">
	export interface CheckSummary {
		total: number;
		passed: number;
		failed: number;
	}

	interface Props {
		summary: CheckSummary;
	}

	let { summary }: Props = $props();
</script>

{#if summary && summary.total !== undefined}
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

<style>
	.check-summary {
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

	.summary-item.success .summary-value {
		color: hsl(120, 60%, 35%);
	}

	:global([data-theme='dark']) .summary-item.success .summary-value {
		color: hsl(120, 60%, 65%);
	}

	.summary-item.error .summary-value {
		color: hsl(0, 80%, 40%);
	}

	:global([data-theme='dark']) .summary-item.error .summary-value {
		color: hsl(0, 80%, 60%);
	}
</style>
