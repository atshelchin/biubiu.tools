<script lang="ts">
	/**
	 * Demo Button
	 * A button component with various variants for demo controls.
	 */
	import type { Snippet, Component } from 'svelte';
	import { Loader2 } from '@lucide/svelte';

	type ButtonVariant =
		| 'primary'
		| 'secondary'
		| 'success'
		| 'warning'
		| 'danger'
		| 'outline'
		| 'success-outline'
		| 'danger-outline';

	interface Props {
		variant?: ButtonVariant;
		size?: 'sm' | 'md' | 'lg';
		disabled?: boolean;
		loading?: boolean;
		icon?: Component;
		iconSize?: number;
		onclick?: () => void;
		class?: string;
		children: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		disabled = false,
		loading = false,
		icon,
		iconSize = 16,
		onclick,
		class: className = '',
		children
	}: Props = $props();
</script>

<button
	class="btn btn-{variant} btn-{size} {className}"
	disabled={disabled || loading}
	{onclick}
	type="button"
>
	{#if loading}
		<Loader2 size={iconSize} class="spin" />
	{:else if icon}
		{@const Icon = icon}
		<Icon size={iconSize} />
	{/if}
	{@render children()}
</button>

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		border: none;
		border-radius: var(--radius);
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Sizes */
	.btn-sm {
		padding: var(--space-2) var(--space-3);
		font-size: var(--text-xs);
	}

	.btn-md {
		padding: var(--space-3) var(--space-5);
		font-size: var(--text-sm);
	}

	.btn-lg {
		padding: var(--space-4) var(--space-6);
		font-size: var(--text-base);
	}

	/* Variants */
	.btn-primary {
		background: var(--color-primary);
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		filter: brightness(1.1);
	}

	.btn-secondary {
		background: var(--color-secondary);
		color: var(--color-secondary-foreground);
	}

	.btn-success {
		background: var(--color-success);
		color: white;
	}

	.btn-warning {
		background: var(--color-warning);
		color: white;
	}

	.btn-danger {
		background: var(--color-danger);
		color: white;
	}

	.btn-outline {
		background: transparent;
		border: 1px solid var(--color-border);
		color: var(--color-foreground);
	}

	.btn-outline:hover:not(:disabled) {
		background: var(--color-panel-1);
	}

	.btn-success-outline {
		background: transparent;
		border: 1px solid var(--color-success);
		color: var(--color-success);
	}

	.btn-success-outline:hover:not(:disabled) {
		background: rgba(34, 197, 94, 0.1);
	}

	.btn-danger-outline {
		background: transparent;
		border: 1px solid var(--color-danger);
		color: var(--color-danger);
	}

	.btn-danger-outline:hover:not(:disabled) {
		background: rgba(239, 68, 68, 0.1);
	}

	/* Spin animation */
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
