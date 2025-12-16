<script lang="ts">
	import { slide } from 'svelte/transition';
	import { AlertTriangle, AlertCircle, Info } from '@lucide/svelte';

	interface Props {
		variant?: 'error' | 'warning' | 'info';
		title?: string;
		message: string;
		hint?: string;
		primaryButtonText?: string;
		secondaryButtonText?: string;
		onPrimaryClick?: () => void;
		onSecondaryClick?: () => void;
	}

	let {
		variant = 'warning',
		title,
		message,
		hint,
		primaryButtonText,
		secondaryButtonText,
		onPrimaryClick,
		onSecondaryClick
	}: Props = $props();

	const icons = {
		error: AlertCircle,
		warning: AlertTriangle,
		info: Info
	};

	let IconComponent = $derived(icons[variant]);
</script>

<div class="inline-alert {variant}" transition:slide>
	<div class="alert-header">
		<IconComponent size={16} class="alert-icon" />
		{#if title}
			<span class="alert-title">{title}</span>
		{/if}
	</div>

	<div class="alert-message">{message}</div>

	{#if hint}
		<div class="alert-hint">{hint}</div>
	{/if}

	{#if onPrimaryClick || onSecondaryClick}
		<div class="alert-actions">
			{#if onPrimaryClick && primaryButtonText}
				<button class="btn btn-primary" onclick={onPrimaryClick}>
					{primaryButtonText}
				</button>
			{/if}
			{#if onSecondaryClick && secondaryButtonText}
				<button class="btn btn-secondary" onclick={onSecondaryClick}>
					{secondaryButtonText}
				</button>
			{/if}
		</div>
	{/if}
</div>

<style>
	.inline-alert {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		padding: var(--space-3);
		border-radius: var(--radius-md);
		border: 1px solid;
		font-size: var(--text-sm);
	}

	/* Warning variant (default) */
	.inline-alert.warning {
		background: color-mix(in srgb, var(--color-warning, #f59e0b) 10%, transparent);
		border-color: color-mix(in srgb, var(--color-warning, #f59e0b) 30%, transparent);
		color: var(--color-warning-foreground, #92400e);
	}

	:global([data-theme='dark']) .inline-alert.warning {
		color: var(--color-warning, #fbbf24);
	}

	/* Error variant */
	.inline-alert.error {
		background: color-mix(in srgb, var(--color-danger, #ef4444) 10%, transparent);
		border-color: color-mix(in srgb, var(--color-danger, #ef4444) 30%, transparent);
		color: var(--color-danger-foreground, #991b1b);
	}

	:global([data-theme='dark']) .inline-alert.error {
		color: hsl(0, 80%, 70%);
	}

	/* Info variant - softer blue/gray */
	.inline-alert.info {
		background: color-mix(in srgb, #64748b 8%, transparent);
		border-color: color-mix(in srgb, #64748b 20%, transparent);
		color: #475569;
	}

	:global([data-theme='dark']) .inline-alert.info {
		background: color-mix(in srgb, #94a3b8 10%, transparent);
		border-color: color-mix(in srgb, #94a3b8 20%, transparent);
		color: #94a3b8;
	}

	.alert-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.alert-title {
		font-weight: var(--font-semibold);
	}

	.alert-message {
		line-height: 1.5;
	}

	.alert-hint {
		font-size: var(--text-xs);
		opacity: 0.8;
		padding: var(--space-2);
		background: rgba(0, 0, 0, 0.05);
		border-radius: var(--radius-sm);
	}

	:global([data-theme='dark']) .alert-hint {
		background: rgba(255, 255, 255, 0.05);
	}

	.alert-actions {
		display: flex;
		gap: var(--space-2);
		margin-top: var(--space-1);
	}

	.btn {
		padding: var(--space-1-5) var(--space-3);
		border-radius: var(--radius-sm);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.2s;
		border: 1px solid transparent;
	}

	.btn-primary {
		background: var(--color-primary, #3b82f6);
		color: white;
	}

	.btn-primary:hover {
		background: var(--color-primary-hover, #2563eb);
	}

	.btn-secondary {
		background: transparent;
		border-color: currentColor;
		color: inherit;
	}

	.btn-secondary:hover {
		background: rgba(0, 0, 0, 0.05);
	}

	:global([data-theme='dark']) .btn-secondary:hover {
		background: rgba(255, 255, 255, 0.1);
	}

	:global(.alert-icon) {
		flex-shrink: 0;
	}
</style>
