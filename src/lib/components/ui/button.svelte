<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type $$Props = HTMLButtonAttributes & {
		variant?: 'default' | 'outline' | 'ghost' | 'destructive';
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	};

	let {
		variant = 'default',
		size = 'md',
		class: className = '',
		disabled = false,
		...restProps
	}: $$Props = $props();
</script>

<button class="btn btn-{variant} btn-{size} {className}" {disabled} {...restProps}>
	<slot />
</button>

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-md);
		font-weight: var(--font-weight-medium);
		transition: all var(--duration-fast) var(--ease-smooth);
		cursor: pointer;
		border: none;
		outline: none;
		position: relative;
		white-space: nowrap;
	}

	.btn:focus-visible {
		outline: 2px solid var(--color-brand-primary);
		outline-offset: 2px;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Sizes */
	.btn-sm {
		padding: var(--spacing-2) var(--spacing-4);
		font-size: var(--font-size-sm);
	}

	.btn-md {
		padding: var(--spacing-3) var(--spacing-6);
		font-size: var(--font-size-base);
	}

	.btn-lg {
		padding: var(--spacing-4) var(--spacing-8);
		font-size: var(--font-size-lg);
	}

	/* Variants */
	.btn-default {
		background: var(--color-brand-primary);
		color: var(--color-primary-foreground);
	}

	.btn-default:hover:not(:disabled) {
		background: var(--color-brand-primary-dark);
	}

	.btn-outline {
		background: transparent;
		border: 1px solid var(--color-border);
		color: var(--color-text-primary);
	}

	.btn-outline:hover:not(:disabled) {
		background: var(--color-panel-1);
		border-color: var(--color-brand-primary);
	}

	.btn-ghost {
		background: transparent;
		color: var(--color-text-primary);
	}

	.btn-ghost:hover:not(:disabled) {
		background: var(--color-panel-1);
	}

	.btn-destructive {
		background: var(--color-danger);
		color: white;
	}

	.btn-destructive:hover:not(:disabled) {
		background: var(--color-danger-dark);
	}
</style>
