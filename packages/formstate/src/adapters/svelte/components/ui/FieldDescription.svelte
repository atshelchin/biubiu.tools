<script lang="ts">
	/**
	 * FieldDescription - 可复用的字段描述/提示组件
	 */
	interface Props {
		children?: import('svelte').Snippet;
		class?: string;
	}

	let { children, class: className }: Props = $props();
</script>

{#if children}
	<div class="field-description {className || ''}">
		{@render children()}
	</div>
{/if}

<style>
	.field-description {
		margin-top: 0.375rem;
		font-size: 0.875rem;
		color: var(--form-description-color, #6b7280);
		line-height: 1.4;
	}
</style>
