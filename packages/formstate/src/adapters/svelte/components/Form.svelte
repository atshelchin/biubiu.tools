<script lang="ts">
	/**
	 * Form 根组件 - 提供表单上下文
	 */
	import { setContext } from 'svelte';
	import type { FormState } from '../useFormState.svelte';
	import type { FormSchema } from '../schema';
	import { useFormState } from '../useFormState.svelte';
	import type { IFormConfig } from '../../../core/interfaces';
	import SchemaRenderer from './SchemaRenderer.svelte';

	interface Props {
		schema?: FormSchema;
		config?: IFormConfig;
		formState?: FormState;
		onSubmit?: (values: Record<string, unknown>) => void | Promise<void>;
		children?: import('svelte').Snippet;
		class?: string;
	}

	let {
		schema,
		config = {},
		formState: externalFormState,
		onSubmit,
		children,
		class: className
	}: Props = $props();

	// 如果没有传入 formState，创建一个
	const formState = externalFormState || useFormState(config);

	// 提供表单上下文
	setContext('formState', formState);

	// 提交处理
	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (onSubmit) {
			const success = await formState.submit(onSubmit);
			if (!success) {
				console.warn('Form validation failed');
			}
		}
	}
</script>

<form onsubmit={handleSubmit} class={className}>
	{#if schema}
		<SchemaRenderer {schema} />
	{:else if children}
		{@render children()}
	{/if}
</form>

<style>
	form {
		width: 100%;
	}
</style>
