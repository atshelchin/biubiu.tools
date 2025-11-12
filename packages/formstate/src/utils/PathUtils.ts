/**
 * 路径工具 - 实现 IPathUtils 接口
 * 支持深层嵌套对象和数组路径（如 "user.addresses[0].street"）
 */

import type { IPathUtils, FieldPath, FieldValue } from '../core/interfaces';

/**
 * 解析路径为标准化的键数组
 * 支持：
 * - "user.name" => ["user", "name"]
 * - "addresses[0]" => ["addresses", "0"]
 * - "user.addresses[0].street" => ["user", "addresses", "0", "street"]
 */
function parsePath(path: FieldPath): string[] {
	return path
		.replace(/\[(\d+)\]/g, '.$1') // 转换 [0] 为 .0
		.split('.')
		.filter(Boolean);
}

/**
 * 判断键是否为数组索引
 */
function isArrayIndex(key: string): boolean {
	return /^\d+$/.test(key);
}

/**
 * 路径工具类实现
 */
class PathUtilsImpl implements IPathUtils {
	get(obj: unknown, path: FieldPath): FieldValue {
		const keys = parsePath(path);
		let result: unknown = obj;

		for (const key of keys) {
			if (result == null) return undefined;
			result = (result as Record<string, unknown>)[key];
		}

		return result as FieldValue;
	}

	set(obj: unknown, path: FieldPath, value: FieldValue): unknown {
		const keys = parsePath(path);
		const root = Array.isArray(obj) ? [...obj] : { ...(obj as object) };
		let current: Record<string, unknown> = root as Record<string, unknown>;

		for (let i = 0; i < keys.length - 1; i++) {
			const key = keys[i];
			const nextKey = keys[i + 1];
			const nextIsArray = isArrayIndex(nextKey);

			// 确保路径存在
			if (current[key] == null) {
				current[key] = nextIsArray ? [] : {};
			}

			// 复制引用以保持不可变性
			if (Array.isArray(current[key])) {
				current[key] = [...(current[key] as unknown[])];
			} else if (typeof current[key] === 'object') {
				current[key] = { ...(current[key] as object) };
			}

			current = current[key] as Record<string, unknown>;
		}

		current[keys[keys.length - 1]] = value;
		return root;
	}

	/**
	 * 在可变对象中设置值（用于 Immer draft）
	 * 直接修改对象，不创建副本
	 */
	setMutable(obj: unknown, path: FieldPath, value: FieldValue): void {
		const keys = parsePath(path);
		let current: any = obj;

		for (let i = 0; i < keys.length - 1; i++) {
			const key = keys[i];
			const nextKey = keys[i + 1];
			const nextIsArray = isArrayIndex(nextKey);

			// 确保路径存在
			if (current[key] == null || current[key] === undefined) {
				current[key] = nextIsArray ? [] : {};
			}

			current = current[key];
		}

		const lastKey = keys[keys.length - 1];
		current[lastKey] = value;

		console.log(
			'[PathUtils.setMutable] path:',
			path,
			'keys:',
			keys,
			'final value:',
			value,
			'result obj:',
			obj
		);
	}

	delete(obj: unknown, path: FieldPath): unknown {
		const keys = parsePath(path);
		const root = Array.isArray(obj) ? [...obj] : { ...(obj as object) };
		let current: Record<string, unknown> = root as Record<string, unknown>;

		for (let i = 0; i < keys.length - 1; i++) {
			const key = keys[i];
			if (current[key] == null) return root;

			// 复制引用
			if (Array.isArray(current[key])) {
				current[key] = [...(current[key] as unknown[])];
			} else {
				current[key] = { ...(current[key] as object) };
			}

			current = current[key] as Record<string, unknown>;
		}

		const lastKey = keys[keys.length - 1];

		// 如果父对象是数组，使用 splice 删除
		if (Array.isArray(current) && isArrayIndex(lastKey)) {
			(current as unknown[]).splice(Number(lastKey), 1);
		} else {
			delete current[lastKey];
		}

		return root;
	}

	/**
	 * 在指定路径的数组中插入元素
	 */
	insertAt(obj: unknown, path: FieldPath, index: number, value: FieldValue): unknown {
		const array = this.get(obj, path);
		if (!Array.isArray(array)) {
			throw new Error(`Path "${path}" does not point to an array`);
		}

		const newArray = [...array];
		newArray.splice(index, 0, value);
		return this.set(obj, path, newArray);
	}

	/**
	 * 在指定路径的数组末尾添加元素
	 */
	push(obj: unknown, path: FieldPath, value: FieldValue): unknown {
		const array = this.get(obj, path);
		if (!Array.isArray(array)) {
			throw new Error(`Path "${path}" does not point to an array`);
		}

		return this.set(obj, path, [...array, value]);
	}

	/**
	 * 移除指定路径数组中的元素
	 */
	removeAt(obj: unknown, path: FieldPath, index: number): unknown {
		const array = this.get(obj, path);
		if (!Array.isArray(array)) {
			throw new Error(`Path "${path}" does not point to an array`);
		}

		const newArray = [...array];
		newArray.splice(index, 1);
		return this.set(obj, path, newArray);
	}

	/**
	 * 移动数组中的元素
	 */
	move(obj: unknown, path: FieldPath, fromIndex: number, toIndex: number): unknown {
		const array = this.get(obj, path);
		if (!Array.isArray(array)) {
			throw new Error(`Path "${path}" does not point to an array`);
		}

		const newArray = [...array];
		const [item] = newArray.splice(fromIndex, 1);
		newArray.splice(toIndex, 0, item);
		return this.set(obj, path, newArray);
	}
}

/**
 * 导出单例
 */
export const PathUtils = new PathUtilsImpl();
