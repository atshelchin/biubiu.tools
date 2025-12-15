<script lang="ts">
	import { fade } from 'svelte/transition';

	interface Props {
		title: string;
		message: string;
		recommendedLabel: string;
		recommendedValue: string;
	}

	let { title, message, recommendedLabel, recommendedValue }: Props = $props();
</script>

<div class="performance-tip-card" transition:fade>
	<div class="tip-header">
		<span class="tip-title">{title}</span>
	</div>
	<p class="tip-message">{message}</p>
	<div class="tip-recommendation">
		<span class="tip-label">{recommendedLabel}</span>
		<strong class="tip-value">{recommendedValue}</strong>
	</div>
</div>

<style>
	.performance-tip-card {
		margin-bottom: var(--space-4);
		padding: var(--space-4);
		background: rgba(245, 158, 11, 0.1);
		border: 1px solid rgba(245, 158, 11, 0.3);
		border-radius: var(--radius-lg);
		border-left: 4px solid rgba(245, 158, 11, 0.8);
	}

	:global([data-theme='dark']) .performance-tip-card {
		background: rgba(245, 158, 11, 0.15);
		border-color: rgba(245, 158, 11, 0.4);
	}

	.tip-header {
		margin-bottom: var(--space-2);
	}

	.tip-title {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: hsl(38, 92%, 45%);
	}

	:global([data-theme='dark']) .tip-title {
		color: hsl(38, 92%, 55%);
	}

	.tip-message {
		margin: 0 0 var(--space-3) 0;
		font-size: var(--text-sm);
		color: var(--gray-700);
		line-height: 1.5;
	}

	:global([data-theme='dark']) .tip-message {
		color: var(--gray-300);
	}

	.tip-recommendation {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2);
		background: rgba(255, 255, 255, 0.5);
		border-radius: var(--radius-md);
	}

	:global([data-theme='dark']) .tip-recommendation {
		background: rgba(0, 0, 0, 0.2);
	}

	.tip-label {
		font-size: var(--text-xs);
		color: var(--gray-600);
		font-weight: var(--font-medium);
	}

	:global([data-theme='dark']) .tip-label {
		color: var(--gray-400);
	}

	.tip-value {
		font-size: var(--text-sm);
		font-weight: var(--font-bold);
		color: hsl(38, 92%, 45%);
		font-family: var(--font-mono, 'Monaco', 'Courier New', monospace);
	}

	:global([data-theme='dark']) .tip-value {
		color: hsl(38, 92%, 55%);
	}
</style>
