<script lang="ts">
	/**
	 * FieldError - 可复用的错误提示组件
	 */
	interface Props {
		error?: string | null;
		show?: boolean;
		children?: import('svelte').Snippet;
		class?: string;
	}

	let { error, show = true, children, class: className }: Props = $props();

	const shouldShow = $derived((error && show) || children);
</script>

{#if shouldShow}
	<div class="field-error {className || ''}" role="alert" aria-live="polite">
		{#if children}
			{@render children()}
		{:else if error}
			{error}
		{/if}
	</div>
{/if}

<style>
	.field-error {
		margin-top: 0.375rem;
		font-size: 0.875rem;
		color: var(--form-error-color, #dc2626);
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}
</style>
