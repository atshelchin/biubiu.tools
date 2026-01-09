<script lang="ts">
	/**
	 * Task Status Badge
	 * Displays a task status with appropriate color coding.
	 */
	export type TaskStatus =
		| 'pending'
		| 'running'
		| 'paused'
		| 'completed'
		| 'failed'
		| 'cancelled';

	interface Props {
		status: TaskStatus;
		label?: string;
		class?: string;
	}

	let { status, label, class: className = '' }: Props = $props();

	const statusColors: Record<TaskStatus, string> = {
		pending: 'var(--color-muted-foreground)',
		running: 'var(--color-primary)',
		paused: 'var(--color-warning)',
		completed: 'var(--color-success)',
		failed: 'var(--color-danger)',
		cancelled: 'var(--color-muted)'
	};

	const color = $derived(statusColors[status] || 'var(--color-muted-foreground)');
</script>

<span class="status-badge {className}" style="--status-color: {color}">
	{label || status}
</span>

<style>
	.status-badge {
		display: inline-flex;
		align-items: center;
		padding: var(--space-1) var(--space-3);
		background: color-mix(in srgb, var(--status-color) 15%, transparent);
		color: var(--status-color);
		border-radius: var(--radius-full);
		font-size: var(--text-xs);
		font-weight: 500;
		text-transform: capitalize;
	}
</style>
