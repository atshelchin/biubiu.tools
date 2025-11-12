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

		// ⚠️ 修复 Bug 3: 重新映射字段状态以防止路径错位
		remapArrayFieldStates(index, 'insert');
	}

	function remove(index: number) {
		const newArray = [...arrayValue];
		newArray.splice(index, 1);
		formState.setValue(name, newArray);

		// ⚠️ 修复 Bug 3: 重新映射字段状态以防止路径错位
		remapArrayFieldStates(index, 'remove');
	}

	function move(from: number, to: number) {
		const newArray = [...arrayValue];
		const [item] = newArray.splice(from, 1);
		newArray.splice(to, 0, item);
		formState.setValue(name, newArray);

		// ⚠️ 修复 Bug 3: 重新映射字段状态以防止路径错位
		remapArrayFieldStates(from, 'move', to);
	}

	/**
	 * 重新映射数组字段的路径，防止删除/移动后路径错位
	 */
	function remapArrayFieldStates(
		fromIndex: number,
		operation: 'remove' | 'insert' | 'move',
		toIndex?: number
	) {
		const manager = formState._manager;
		const fieldStates = manager['fieldStates'];
		const fieldConfigs = manager['fieldConfigs'];

		// 找出所有受影响的字段路径
		const allPaths = Array.from(fieldStates.keys());
		const affectedPaths = allPaths.filter((path) => {
			// 匹配 name[index] 或 name[index].nested.path
			const regex = new RegExp(`^${escapeRegex(name)}\\[(\\d+)\\]`);
			const match = path.match(regex);
			if (!match) return false;
			const pathIndex = parseInt(match[1]);
			return pathIndex >= fromIndex;
		});

		// 按索引降序排序，避免覆盖问题
		affectedPaths.sort((a, b) => {
			const aIndex = parseInt(a.match(/\[(\d+)\]/)?.[1] || '0');
			const bIndex = parseInt(b.match(/\[(\d+)\]/)?.[1] || '0');
			return bIndex - aIndex;
		});

		// 计算新索引并重新映射
		const remapped = new Map<string, { oldPath: string; newPath: string; newIndex: number }>();

		for (const oldPath of affectedPaths) {
			const oldIndex = parseInt(oldPath.match(/\[(\d+)\]/)?.[1] || '0');
			let newIndex = oldIndex;

			if (operation === 'remove') {
				if (oldIndex === fromIndex) {
					// 被删除的项，跳过映射（会在后续清理）
					continue;
				} else if (oldIndex > fromIndex) {
					newIndex = oldIndex - 1;
				}
			} else if (operation === 'insert') {
				if (oldIndex >= fromIndex) {
					newIndex = oldIndex + 1;
				}
			} else if (operation === 'move' && toIndex !== undefined) {
				if (oldIndex === fromIndex) {
					newIndex = toIndex;
				} else if (fromIndex < toIndex) {
					// 向后移动
					if (oldIndex > fromIndex && oldIndex <= toIndex) {
						newIndex = oldIndex - 1;
					}
				} else {
					// 向前移动
					if (oldIndex >= toIndex && oldIndex < fromIndex) {
						newIndex = oldIndex + 1;
					}
				}
			}

			const newPath = oldPath.replace(/\[\d+\]/, `[${newIndex}]`);
			remapped.set(oldPath, { oldPath, newPath, newIndex });
		}

		// 执行重新映射（降序处理避免覆盖）
		for (const { oldPath, newPath } of remapped.values()) {
			if (oldPath !== newPath) {
				// 迁移 fieldStates
				const state = fieldStates.get(oldPath);
				if (state) {
					fieldStates.delete(oldPath);
					fieldStates.set(newPath, state);
				}

				// 迁移 fieldConfigs
				const config = fieldConfigs.get(oldPath);
				if (config) {
					fieldConfigs.delete(oldPath);
					fieldConfigs.set(newPath, config);
				}
			}
		}

		// 清理超出范围的索引
		const arrayLength = arrayValue.length;
		const allPathsAfterRemap = Array.from(fieldStates.keys());
		for (const path of allPathsAfterRemap) {
			const regex = new RegExp(`^${escapeRegex(name)}\\[(\\d+)\\]`);
			const match = path.match(regex);
			if (match) {
				const pathIndex = parseInt(match[1]);
				if (pathIndex >= arrayLength) {
					fieldStates.delete(path);
					fieldConfigs.delete(path);
				}
			}
		}
	}

	/**
	 * 转义正则表达式特殊字符
	 */
	function escapeRegex(str: string): string {
		return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
