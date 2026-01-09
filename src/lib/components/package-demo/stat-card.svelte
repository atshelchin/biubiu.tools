<script lang="ts">
	/**
	 * Stat Card
	 * Displays a statistic with a value and label.
	 */
	export type StatVariant = 'default' | 'pending' | 'running' | 'completed' | 'failed' | 'paused';

	interface Props {
		value: number | string;
		label: string;
		variant?: StatVariant;
		class?: string;
	}

	let { value, label, variant = 'default', class: className = '' }: Props = $props();
</script>

<div class="stat-card {variant} {className}">
	<span class="stat-value">{value}</span>
	<span class="stat-label">{label}</span>
</div>

<style>
	.stat-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
	}

	.stat-value {
		font-size: var(--text-3xl);
		font-weight: 700;
		color: var(--color-foreground);
	}

	.stat-label {
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		text-transform: uppercase;
	}

	.stat-card.pending .stat-value {
		color: var(--color-muted-foreground);
	}

	.stat-card.running .stat-value {
		color: var(--color-primary);
	}

	.stat-card.completed .stat-value {
		color: var(--color-success);
	}

	.stat-card.failed .stat-value {
		color: var(--color-danger);
	}

	.stat-card.paused .stat-value {
		color: var(--color-warning);
	}
</style>
