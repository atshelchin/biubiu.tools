<script lang="ts">
	/**
	 * Task Status Icon
	 * Displays an icon representing the task status with appropriate color.
	 */
	import { CheckCircle2, XCircle, Loader2, Pause, Clock } from '@lucide/svelte';
	import type { TaskStatus } from './task-status-badge.svelte';

	interface Props {
		status: TaskStatus;
		size?: number;
		class?: string;
	}

	let { status, size = 16, class: className = '' }: Props = $props();

	const statusColors: Record<TaskStatus, string> = {
		pending: 'var(--color-muted-foreground)',
		running: 'var(--color-primary)',
		paused: 'var(--color-warning)',
		completed: 'var(--color-success)',
		failed: 'var(--color-danger)',
		cancelled: 'var(--color-muted)'
	};

	const color = $derived(statusColors[status] || 'var(--color-muted-foreground)');
	const isSpinning = $derived(status === 'running');
</script>

{#if status === 'completed'}
	<CheckCircle2 {size} style="color: {color}" class={className} />
{:else if status === 'failed'}
	<XCircle {size} style="color: {color}" class={className} />
{:else if status === 'running'}
	<Loader2 {size} style="color: {color}" class="{className} {isSpinning ? 'spin' : ''}" />
{:else if status === 'paused'}
	<Pause {size} style="color: {color}" class={className} />
{:else}
	<Clock {size} style="color: {color}" class={className} />
{/if}

<style>
	:global(.spin) {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
