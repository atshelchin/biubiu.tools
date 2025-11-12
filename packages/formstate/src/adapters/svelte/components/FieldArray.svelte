<script lang="ts">
	/**
	 * FieldArray 组件 - 动态数组字段管理
	 * 支持添加、删除、移动数组项
	 */
	import { getContext } from 'svelte';
	import type { FormState } from '../useFormState.svelte';
	import type { FieldPath } from '../../../core/interfaces';
	import { PathUtils } from '../../../utils/PathUtils';
	import { debug } from '../../../utils/debug';

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
		debug.log('[FieldArray]', name, 'arrayValue derived');
		debug.log('  formState.values keys:', Object.keys(values));
		debug.log('  PathUtils.get result:', value);
		debug.log('  Is array?', Array.isArray(value));
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
		debug.log('[FieldArray.append] name:', name);
		debug.log('[FieldArray.append] current arrayValue:', JSON.stringify(arrayValue, null, 2));
		debug.log('[FieldArray.append] value to append:', JSON.stringify(value, null, 2));
		const newArray = [...arrayValue, value];
		debug.log('[FieldArray.append] newArray:', JSON.stringify(newArray, null, 2));
		formState.setValue(name, newArray);
	}

	function prepend(value: unknown) {
		const newArray = [value, ...arrayValue];
		formState.setValue(name, newArray);
	}

	function insert(index: number, value: unknown) {
		const newArray = [...arrayValue];
		newArray.splice(index, 0, value);
		formState.setValue(name, newArray);
	}

	function remove(index: number) {
		const newArray = [...arrayValue];
		newArray.splice(index, 1);
		formState.setValue(name, newArray);
	}

	function move(from: number, to: number) {
		const newArray = [...arrayValue];
		const [item] = newArray.splice(from, 1);
		newArray.splice(to, 0, item);
		formState.setValue(name, newArray);
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
