<script lang="ts">
	/**
	 * Field - 无样式的字段控制器（Headless Component）
	 * 只提供状态和方法，UI 完全由用户控制
	 */
	import { getContext, onMount, onDestroy } from 'svelte';
	import type { FormState } from '../useFormState.svelte';
	import type { IFieldConfig, FieldPath } from '../../../core/interfaces';

	interface Props {
		name: FieldPath;
		config?: IFieldConfig;
		children: import('svelte').Snippet<
			[
				{
					value: unknown;
					error: string | null;
					touched: boolean;
					dirty: boolean;
					validating: boolean;
					setValue: (value: unknown) => void;
					setTouched: (touched?: boolean) => void;
					validate: () => Promise<string | null>;
					reset: () => void;
				}
			]
		>;
	}

	let { name, config = {}, children }: Props = $props();

	const formState = getContext<FormState>('formState');

	if (!formState) {
		throw new Error('Field must be used within a Form component');
	}

	// 标记字段是否由此组件注册（用于决定是否注销）
	let registeredByComponent = false;

	// 注册字段（只在字段尚未注册时注册）
	onMount(() => {
		// 检查字段是否已经注册（通过 useFormState 配置）
		const existingConfig = formState._manager['fieldConfigs'].get(name);
		if (!existingConfig) {
			// 字段未注册，使用传入的 config 注册
			formState.registerField(name, config);
			registeredByComponent = true;
		}
	});

	onDestroy(() => {
		// 只有动态字段（非 persistent）且由此组件注册的才自动注销
		if (registeredByComponent) {
			const fieldConfig = formState._manager['fieldConfigs'].get(name);
			if (!fieldConfig?.persistent) {
				formState.unregisterField(name);
			}
		}
	});

	// 响应式字段状态
	const fieldState = $derived(formState.getFieldState(name));

	// 操作方法
	function setValue(value: unknown) {
		formState.setValue(name, value);
	}

	function setTouched(touched = true) {
		formState.setFieldTouched(name, touched);
	}

	async function validate() {
		return await formState.validateField(name);
	}

	function reset() {
		const initialValue = config.defaultValue;
		formState.setValue(name, initialValue, false);
		formState.setFieldTouched(name, false);
	}
</script>

{@render children({
	value: fieldState.value,
	error: fieldState.error,
	touched: fieldState.touched,
	dirty: fieldState.dirty,
	validating: fieldState.validating,
	setValue,
	setTouched,
	validate,
	reset
})}
