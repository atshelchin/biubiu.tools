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
		padding: var(--space-2) var(--space-5);
		border: none;
		border-radius: var(--radius-full);
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.2s;
		background: linear-gradient(135deg, var(--brand-500) 0%, var(--brand-600) 100%);
		color: var(--color-primary-foreground);
	}

	.gradient-button:hover:not(:disabled) {
		background: linear-gradient(135deg, var(--brand-600) 0%, var(--brand-700) 100%);
		transform: translateY(-1px);
		box-shadow: var(--shadow-md);
	}

	.gradient-button:active:not(:disabled) {
		transform: translateY(0);
	}

	.gradient-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.gradient-button.full-width {
		width: 100%;
		justify-content: center;
	}
</style>
