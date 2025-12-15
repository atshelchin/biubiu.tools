<script lang="ts">
	import { CheckCircle2, AlertCircle, Info, AlertTriangle } from '@lucide/svelte';

	interface Props {
		variant: 'success' | 'error' | 'warning' | 'info';
		title: string;
		message?: string;
		iconSize?: number;
	}

	let { variant, title, message, iconSize = 32 }: Props = $props();
</script>

<div class="status-banner {variant}">
	<div class="icon">
		{#if variant === 'success'}
			<CheckCircle2 size={iconSize} />
		{:else if variant === 'error'}
			<AlertCircle size={iconSize} />
		{:else if variant === 'warning'}
			<AlertTriangle size={iconSize} />
		{:else}
			<Info size={iconSize} />
		{/if}
	</div>
	<div class="content">
		<h3>{title}</h3>
		{#if message}
			<p>{message}</p>
		{/if}
	</div>
</div>

<style>
	.status-banner {
		display: flex;
		gap: var(--space-3);
		padding: var(--space-4);
		border-radius: var(--radius-lg);
		align-items: center;
	}

	.icon {
		flex-shrink: 0;
	}

	.content {
		flex: 1;
		min-width: 0;
	}

	.content h3 {
		margin: 0;
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
	}

	.content p {
		margin: var(--space-1) 0 0 0;
		font-size: var(--text-sm);
		opacity: 0.9;
	}

	/* Success: Green */
	.status-banner.success {
		background: hsla(120, 60%, 95%, 1);
		border: 2px solid hsl(120, 60%, 60%);
		color: hsl(120, 60%, 30%);
	}

	:global([data-theme='dark']) .status-banner.success {
		background: hsla(120, 60%, 15%, 0.5);
		border-color: hsl(120, 60%, 40%);
		color: hsl(120, 60%, 70%);
	}

	/* Error: Red */
	.status-banner.error {
		background: hsla(0, 80%, 95%, 1);
		border: 2px solid hsl(0, 80%, 60%);
		color: hsl(0, 80%, 30%);
	}

	:global([data-theme='dark']) .status-banner.error {
		background: hsla(0, 80%, 15%, 0.5);
		border-color: hsl(0, 80%, 40%);
		color: hsl(0, 80%, 70%);
	}

	/* Warning: Orange */
	.status-banner.warning {
		background: hsla(30, 100%, 95%, 1);
		border: 2px solid hsl(30, 100%, 50%);
		color: hsl(30, 100%, 25%);
	}

	:global([data-theme='dark']) .status-banner.warning {
		background: hsla(30, 100%, 15%, 0.5);
		border-color: hsl(30, 100%, 40%);
		color: hsl(30, 100%, 70%);
	}

	/* Info: Blue */
	.status-banner.info {
		background: hsla(210, 100%, 95%, 1);
		border: 2px solid hsl(210, 100%, 50%);
		color: hsl(210, 100%, 30%);
	}

	:global([data-theme='dark']) .status-banner.info {
		background: hsla(210, 100%, 15%, 0.5);
		border-color: hsl(210, 100%, 40%);
		color: hsl(210, 100%, 70%);
	}
</style>
