<script lang="ts">
	/**
	 * Icon Button
	 * A small button with only an icon for compact actions.
	 */
	import type { Component } from 'svelte';

	type ButtonVariant = 'default' | 'primary' | 'success' | 'danger';

	interface Props {
		icon: Component;
		iconSize?: number;
		variant?: ButtonVariant;
		disabled?: boolean;
		title?: string;
		onclick?: () => void;
		class?: string;
	}

	let {
		icon: Icon,
		iconSize = 16,
		variant = 'default',
		disabled = false,
		title,
		onclick,
		class: className = ''
	}: Props = $props();
</script>

<button
	class="btn-icon btn-icon-{variant} {className}"
	{disabled}
	{title}
	{onclick}
	type="button"
>
	<Icon size={iconSize} />
</button>

<style>
	.btn-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		padding: 0;
		border: none;
		border-radius: var(--radius);
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-icon:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-icon-default {
		background: var(--color-panel-1);
		color: var(--color-foreground);
	}

	.btn-icon-default:hover:not(:disabled) {
		background: var(--color-panel-2);
	}

	.btn-icon-primary {
		background: transparent;
		color: var(--color-primary);
	}

	.btn-icon-primary:hover:not(:disabled) {
		background: rgba(59, 130, 246, 0.1);
	}

	.btn-icon-success {
		background: transparent;
		color: var(--color-success);
	}

	.btn-icon-success:hover:not(:disabled) {
		background: rgba(34, 197, 94, 0.1);
	}

	.btn-icon-danger {
		background: transparent;
		color: var(--color-danger);
	}

	.btn-icon-danger:hover:not(:disabled) {
		background: rgba(239, 68, 68, 0.1);
	}
</style>
