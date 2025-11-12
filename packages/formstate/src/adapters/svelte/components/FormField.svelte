<script lang="ts">
	/**
	 * FormField 组件 - 自动管理字段状态
	 * 包裹任何 input 组件，自动同步表单状态
	 */
	import { getContext, onMount, onDestroy } from 'svelte';
	import type { FormState } from '../useFormState.svelte';
	import type { IFieldConfig, FieldPath } from '../../../core/interfaces';
	import { PathUtils } from '../../../utils/PathUtils';

	interface Props {
		name: FieldPath;
		config?: IFieldConfig;
		label?: string;
		description?: string;
		showError?: boolean;
		children: import('svelte').Snippet<
			[
				{
					value: unknown;
					error: string | null;
					touched: boolean;
					dirty: boolean;
					validating: boolean;
					onInput: (value: unknown) => void;
					onBlur: () => void;
				}
			]
		>;
		class?: string;
	}

	let {
		name,
		config = {},
		label,
		description,
		showError = true,
		children,
		class: className
	}: Props = $props();

	const formState = getContext<FormState>('formState');

	if (!formState) {
		throw new Error('FormField must be used within a Form component');
	}

	// 注册字段（只在字段尚未注册时注册）
	onMount(() => {
		// 检查字段是否已经注册（通过 useFormState 配置）
		const existingState = formState._manager['fieldConfigs'].get(name);
		if (!existingState) {
			// 字段未注册，使用传入的 config 注册
			formState.registerField(name, config);
		}
		// 如果已注册，不重新注册（保留原有配置）
	});

	onDestroy(() => {
		// 不自动注销字段，因为可能是通过 useFormState 配置的
		// 如果需要注销，用户应该在 useFormState 中管理
	});

	// 响应式字段状态 - Immer 确保每次都是新引用
	const value = $derived(PathUtils.get(formState.values, name));
	const fieldState = $derived(formState.getFieldState(name));
	const error = $derived(fieldState.error);
	const touched = $derived(fieldState.touched);
	const dirty = $derived(fieldState.dirty);
	const validating = $derived(fieldState.validating);

	// 显示错误条件
	const showErrorMessage = $derived(showError && touched && error);

	// 事件处理
	function handleInput(newValue: unknown) {
		formState.setValue(name, newValue);
	}

	function handleBlur() {
		formState.setFieldTouched(name, true);
	}
</script>

<div class="form-field {className || ''}">
	{#if label}
		<label for={name} class="form-field__label">{label}</label>
	{/if}

	<div class="form-field__control">
		{@render children({
			value,
			error,
			touched,
			dirty,
			validating,
			onInput: handleInput,
			onBlur: handleBlur
		})}
	</div>

	{#if description && !showErrorMessage}
		<div class="form-field__description">{description}</div>
	{/if}

	{#if showErrorMessage}
		<div class="form-field__error">{error}</div>
	{/if}

	{#if validating}
		<div class="form-field__validating">Validating...</div>
	{/if}
</div>

<style>
	.form-field {
		margin-bottom: 1rem;
	}

	.form-field__label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
	}

	.form-field__control {
		width: 100%;
	}

	.form-field__description {
		margin-top: 0.25rem;
		font-size: 0.875rem;
		color: var(--color-text-secondary, #666);
	}

	.form-field__error {
		margin-top: 0.25rem;
		font-size: 0.875rem;
		color: var(--color-error, #dc2626);
	}

	.form-field__validating {
		margin-top: 0.25rem;
		font-size: 0.875rem;
		color: var(--color-info, #3b82f6);
	}
</style>
