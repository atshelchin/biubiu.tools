<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** Button variant */
		variant?: 'primary' | 'secondary';
		/** Click handler */
		onclick?: () => void;
		/** Disabled state */
		disabled?: boolean;
		/** Full width */
		fullWidth?: boolean;
		/** Button content */
		children: Snippet;
	}

	let {
		variant = 'primary',
		onclick,
		disabled = false,
		fullWidth = true,
		children
	}: Props = $props();
</script>

<button
	class="action-button {variant}"
	class:full-width={fullWidth}
	{onclick}
	{disabled}
	type="button"
>
	{@render children()}
</button>

<style>
	.action-button {
		padding: var(--space-4) var(--space-5);
		border-radius: var(--radius-lg);
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		position: relative;
		overflow: hidden;
	}

	.action-button.full-width {
		width: 100%;
	}

	.action-button::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 0;
		height: 0;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.3);
		transform: translate(-50%, -50%);
		transition:
			width 0.6s,
			height 0.6s;
	}

	.action-button:hover::before {
		width: 300px;
		height: 300px;
	}

	.action-button.primary {
		background: linear-gradient(135deg, hsl(220, 70%, 55%) 0%, hsl(250, 70%, 60%) 100%);
		color: white;
		box-shadow: 0 4px 12px hsla(230, 70%, 55%, 0.4);
	}

	.action-button.primary:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 8px 20px hsla(230, 70%, 55%, 0.5);
	}

	.action-button.primary:active:not(:disabled) {
		transform: translateY(0);
	}

	.action-button.secondary {
		background: var(--gray-200);
		color: var(--gray-700);
		border: 1px solid var(--color-border);
	}

	:global([data-theme='dark']) .action-button.secondary {
		background: var(--gray-800);
		color: var(--gray-200);
		border-color: var(--gray-700);
	}

	.action-button.secondary:hover:not(:disabled) {
		background: var(--gray-300);
		transform: translateY(-1px);
	}

	:global([data-theme='dark']) .action-button.secondary:hover:not(:disabled) {
		background: var(--gray-700);
	}

	.action-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Mobile responsive */
	@media (max-width: 640px) {
		.action-button {
			padding: var(--space-3) var(--space-4);
			font-size: var(--text-base);
		}
	}
</style>
