<script lang="ts">
	import { AlertTriangle } from '@lucide/svelte';

	interface Props {
		/** Error title */
		title: string;
		/** Error message to display */
		message: string;
	}

	let { title, message }: Props = $props();
</script>

<div class="error-card">
	<div class="error-header">
		<AlertTriangle size={20} class="error-icon" />
		<h4>{title}</h4>
	</div>
	<p class="error-text">{message}</p>
</div>

<style>
	.error-card {
		padding: var(--space-4);
		background: hsla(0, 80%, 50%, 0.08);
		border: 2px solid hsl(0, 80%, 50%);
		border-radius: var(--radius-lg);
	}

	:global([data-theme='dark']) .error-card {
		background: hsla(0, 80%, 60%, 0.12);
		border-color: hsl(0, 80%, 60%);
	}

	.error-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-2);
	}

	.error-header h4 {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: hsl(0, 80%, 40%);
		margin: 0;
	}

	:global([data-theme='dark']) .error-header h4 {
		color: hsl(0, 80%, 65%);
	}

	:global(.error-icon) {
		color: hsl(0, 80%, 50%);
		flex-shrink: 0;
	}

	:global([data-theme='dark']) :global(.error-icon) {
		color: hsl(0, 80%, 65%);
	}

	.error-text {
		font-size: var(--text-sm);
		color: var(--gray-700);
		line-height: 1.6;
		margin: 0;
	}

	:global([data-theme='dark']) .error-text {
		color: var(--gray-300);
	}
</style>
