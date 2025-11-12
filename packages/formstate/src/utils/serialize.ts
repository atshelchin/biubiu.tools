/**
 * 安全的序列化工具
 * 处理 BigInt、Date、undefined、循环引用等特殊值
 */

/**
 * JSON replacer 函数，处理特殊类型
 */
function createReplacer() {
	const seen = new WeakSet();

	return function replacer(key: string, value: unknown): unknown {
		// 处理 BigInt
		if (typeof value === 'bigint') {
			return { __type: 'bigint', value: value.toString() };
		}

		// 处理 Date
		if (value instanceof Date) {
			return { __type: 'date', value: value.toISOString() };
		}

		// 处理 undefined
		if (value === undefined) {
			return { __type: 'undefined' };
		}

		// 处理 Map
		if (value instanceof Map) {
			return {
				__type: 'map',
				value: Array.from(value.entries())
			};
		}

		// 处理 Set
		if (value instanceof Set) {
			return {
				__type: 'set',
				value: Array.from(value.values())
			};
		}

		// 处理循环引用
		if (typeof value === 'object' && value !== null) {
			if (seen.has(value)) {
				return { __type: 'circular' };
			}
			seen.add(value);
		}

		return value;
	};
}

/**
 * JSON reviver 函数，还原特殊类型
 */
function reviver(key: string, value: unknown): unknown {
	if (typeof value === 'object' && value !== null && '__type' in value) {
		const typed = value as { __type: string; value?: unknown };

		switch (typed.__type) {
			case 'bigint':
				return BigInt(typed.value as string);

			case 'date':
				return new Date(typed.value as string);

			case 'undefined':
				return undefined;

			case 'map':
				return new Map(typed.value as [unknown, unknown][]);

			case 'set':
				return new Set(typed.value as unknown[]);

			case 'circular':
				// 循环引用无法完全还原，返回 null
				return null;

			default:
				return value;
		}
	}

	return value;
}

/**
 * 安全的 JSON.stringify，支持 BigInt、Date、Map、Set 等
 *
 * @example
 * ```typescript
 * const data = {
 *   amount: 123456789012345678901234567890n,
 *   createdAt: new Date(),
 *   tags: new Set(['a', 'b']),
 *   metadata: new Map([['key', 'value']])
 * };
 * const json = safeStringify(data);
 * const restored = safeParse(json);
 * ```
 */
export function safeStringify(value: unknown, space?: string | number): string {
	try {
		return JSON.stringify(value, createReplacer(), space);
	} catch (error) {
		// 如果仍然失败，返回错误信息
		console.error('[safeStringify] Serialization failed:', error);
		return JSON.stringify({
			__error: 'Serialization failed',
			message: error instanceof Error ? error.message : String(error)
		});
	}
}

/**
 * 安全的 JSON.parse，还原特殊类型
 */
export function safeParse<T = unknown>(json: string): T {
	try {
		return JSON.parse(json, reviver) as T;
	} catch (error) {
		console.error('[safeParse] Deserialization failed:', error);
		throw new Error(
			`Failed to parse JSON: ${error instanceof Error ? error.message : String(error)}`
		);
	}
}

/**
 * 检查值是否可以安全序列化
 */
export function canSerialize(value: unknown): boolean {
	try {
		safeStringify(value);
		return true;
	} catch {
		return false;
	}
}

/**
 * 简单的深拷贝（使用序列化）
 * 注意：会丢失函数、Symbol 等不可序列化的值
 */
export function cloneViaSerialization<T>(value: T): T {
	return safeParse(safeStringify(value));
}
