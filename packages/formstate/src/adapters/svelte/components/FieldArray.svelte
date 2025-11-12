<script lang="ts">
	/**
	 * FieldArray 组件 - 动态数组字段管理
	 * 支持添加、删除、移动数组项
	 */
	import { getContext } from 'svelte';
	import type { FormState } from '../useFormState.svelte';
	import type { FieldPath } from '../../../core/interfaces';
	import { PathUtils } from '../../../utils/PathUtils';

	interface Props {
		name: FieldPath;
		children: import('svelte').Snippet<
			[
				{
					fields: Array<{ key: string; name: string; index: number }>;
					append: (value: unknown) => void;
					prepend: (value: unknown) => void;
					insert: (index: number, value: unknown) => void;
					remove: (index: number) => void;
					move: (from: number, to: number) => void;
					replace: (index: number, value: unknown) => void;
				}
			]
		>;
	}

	let { name, children }: Props = $props();

	const formState = getContext<FormState>('formState');

	if (!formState) {
		throw new Error('FieldArray must be used within a Form component');
	}

	// 获取数组值 - 从 formState.values 读取，Immer 确保每次都是新引用
	const arrayValue = $derived.by(() => {
		const values = formState.values;
		const value = PathUtils.get(values, name);
		console.log('[FieldArray]', name, 'arrayValue derived');
		console.log('  formState.values keys:', Object.keys(values));
		console.log('  PathUtils.get result:', value);
		console.log('  Is array?', Array.isArray(value));
		return Array.isArray(value) ? value : [];
	});

	// 生成字段列表
	const fields = $derived.by(() => {
		return arrayValue.map((_, index) => ({
			key: `${name}[${index}]`,
			name: `${name}[${index}]`,
			index
		}));
	});

	// 操作方法
	function append(value: unknown) {
		console.log('[FieldArray.append] name:', name);
		console.log('[FieldArray.append] current arrayValue:', JSON.stringify(arrayValue, null, 2));
		console.log('[FieldArray.append] value to append:', JSON.stringify(value, null, 2));
		const newArray = [...arrayValue, value];
		console.log('[FieldArray.append] newArray:', JSON.stringify(newArray, null, 2));
		formState.setValue(name, newArray);
	}

	function prepend(value: unknown) {
		const newArray = [value, ...arrayValue];
		formState.setValue(name, newArray);
	}

	function insert(index: number, value: unknown) {
		const values = formState.values;
		const newValues = PathUtils.insertAt(values, name, index, value);
		formState.setValues(newValues as Record<string, unknown>);
	}

	function remove(index: number) {
		const values = formState.values;
		const newValues = PathUtils.removeAt(values, name, index);
		formState.setValues(newValues as Record<string, unknown>);
	}

	function move(from: number, to: number) {
		const values = formState.values;
		const newValues = PathUtils.move(values, name, from, to);
		formState.setValues(newValues as Record<string, unknown>);
	}

	function replace(index: number, value: unknown) {
		const newArray = [...arrayValue];
		newArray[index] = value;
		formState.setValue(name, newArray);
	}
</script>

{@render children({
	fields,
	append,
	prepend,
	insert,
	remove,
	move,
	replace
})}
