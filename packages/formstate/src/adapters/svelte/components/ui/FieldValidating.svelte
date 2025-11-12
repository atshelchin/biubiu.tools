<script lang="ts">
	/**
	 * FieldValidating - 验证中状态指示器（带动画）
	 */
	interface Props {
		show?: boolean;
		message?: string;
		children?: import('svelte').Snippet;
		class?: string;
	}

	let { show = false, message = 'Validating...', children, class: className }: Props = $props();
</script>

{#if show}
	<div class="field-validating {className || ''}" role="status" aria-live="polite">
		<span class="field-validating__spinner" aria-hidden="true"></span>
		{#if children}
			{@render children()}
		{:else}
			<span class="field-validating__message">{message}</span>
		{/if}
	</div>
{/if}

<style>
	.field-validating {
		margin-top: 0.375rem;
		font-size: 0.875rem;
		color: var(--form-info-color, #3b82f6);
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.field-validating__spinner {
		display: inline-block;
		width: 0.875rem;
		height: 0.875rem;
		border: 2px solid var(--form-info-color, #3b82f6);
		border-radius: 50%;
		border-top-color: transparent;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.field-validating__message {
		font-weight: 500;
	}
</style>
