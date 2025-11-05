<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		loading?: boolean;
		loadingText?: string;
		fullWidth?: boolean;
		class?: string;
		children?: import('svelte').Snippet;
	}

	let {
		loading = false,
		loadingText,
		fullWidth = false,
		disabled = false,
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	const isDisabled = $derived(disabled || loading);
</script>

<button
	class="gradient-button {className}"
	class:full-width={fullWidth}
	disabled={isDisabled}
	type="button"
	{...restProps}
>
	{#if children}
		{@render children()}
	{:else if loading && loadingText}
		{loadingText}
	{/if}
</button>

<style>
	.gradient-button {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2-5) var(--space-5);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.3s ease;
		background: var(--color-secondary);
		color: var(--color-foreground);
		position: relative;
		overflow: hidden;
	}

	.gradient-button::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(
			135deg,
			var(--brand-500) 0%,
			var(--brand-600) 50%,
			var(--brand-700) 100%
		);
		opacity: 0;
		transition: opacity 0.3s ease;
		z-index: -1;
	}

	.gradient-button:hover:not(:disabled) {
		border-color: transparent;
		color: white;
		transform: translateY(-2px);
		box-shadow: 0 8px 16px var(--color-ring);
	}

	.gradient-button:hover:not(:disabled)::before {
		opacity: 1;
	}

	.gradient-button:active:not(:disabled) {
		transform: translateY(-1px);
		box-shadow: 0 4px 8px var(--color-ring);
	}

	.gradient-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.gradient-button.full-width {
		width: 100%;
		justify-content: center;
	}

	@media (max-width: 768px) {
		.gradient-button {
			width: 100%;
			justify-content: center;
		}
	}
</style>
