<script lang="ts">
	/**
	 * FieldLabel - 可复用的字段标签组件
	 */
	interface Props {
		for?: string;
		required?: boolean;
		children?: import('svelte').Snippet;
		class?: string;
	}

	let { for: htmlFor, required = false, children, class: className }: Props = $props();
</script>

{#if children}
	<label for={htmlFor} class="field-label {className || ''}">
		{@render children()}
		{#if required}
			<span class="field-label__required" aria-label="required">*</span>
		{/if}
	</label>
{/if}

<style>
	.field-label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
		font-size: 0.875rem;
		color: var(--form-label-color, #374151);
	}

	.field-label__required {
		color: var(--form-error-color, #dc2626);
		margin-left: 0.25rem;
	}
</style>
