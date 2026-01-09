/**
 * 类型安全路径工具类型
 * 提供从对象类型推断有效字段路径的能力
 *
 * @example
 * ```typescript
 * interface FormValues {
 *   user: {
 *     name: string;
 *     email: string;
 *     addresses: Array<{ street: string; city: string }>;
 *   };
 *   tags: string[];
 * }
 *
 * // Path<FormValues> 会生成:
 * // "user" | "user.name" | "user.email" | "user.addresses" |
 * // `user.addresses.${number}` | `user.addresses.${number}.street` | ...
 *
 * // PathValue<FormValues, "user.name"> = string
 * // PathValue<FormValues, "user.addresses"> = Array<{ street: string; city: string }>
 * // PathValue<FormValues, `user.addresses.${number}`> = { street: string; city: string }
 * ```
 */

/**
 * 判断类型是否为原始类型（不需要继续展开路径）
 */
type Primitive = string | number | boolean | bigint | symbol | undefined | null;

/**
 * 判断是否为对象类型（排除数组、函数、日期等）
 */
type IsObject<T> = T extends Primitive
	? false
	: T extends Array<unknown>
		? false
		: T extends Function
			? false
			: T extends Date
				? false
				: T extends object
					? true
					: false;

/**
 * 获取数组元素类型
 */
type ArrayElement<T> = T extends Array<infer E> ? E : never;

/**
 * 限制递归深度，防止 TypeScript 编译器栈溢出
 * 使用元组长度来计数
 */
type MaxDepth = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
type Prev<D extends number> = MaxDepth[D];

/**
 * 生成对象的所有有效路径
 *
 * @typeParam T - 对象类型
 * @typeParam D - 当前递归深度（默认 5 层）
 *
 * 生成规则：
 * 1. 原始类型字段：直接返回字段名
 * 2. 嵌套对象字段：返回 "field" | "field.subfield" | ...
 * 3. 数组字段：返回 "field" | "field.${number}" | "field.${number}.subfield" | ...
 */
export type Path<T, D extends number = 5> = [D] extends [never]
	? never
	: T extends Primitive
		? never
		: T extends Array<infer E>
			? `${number}` | (E extends Primitive ? never : `${number}.${Path<E, Prev<D>>}`)
			: T extends object
				? {
						[K in keyof T & string]: T[K] extends Primitive
							? K
							: T[K] extends Array<infer E>
								? K | `${K}.${number}` | (E extends Primitive ? never : `${K}.${number}.${Path<E, Prev<D>>}`)
								: IsObject<T[K]> extends true
									? K | `${K}.${Path<T[K], Prev<D>>}`
									: K;
					}[keyof T & string]
				: never;

/**
 * 根据路径获取对应的值类型
 *
 * @typeParam T - 对象类型
 * @typeParam P - 路径字符串
 *
 * @example
 * PathValue<{ user: { name: string } }, "user.name"> = string
 * PathValue<{ items: number[] }, "items.0"> = number
 */
export type PathValue<T, P extends string> = P extends `${infer K}.${infer Rest}`
	? K extends keyof T
		? PathValue<T[K], Rest>
		: K extends `${number}`
			? T extends Array<infer E>
				? PathValue<E, Rest>
				: never
			: never
	: P extends keyof T
		? T[P]
		: P extends `${number}`
			? T extends Array<infer E>
				? E
				: never
			: never;

/**
 * 深度可选类型
 * 将对象的所有嵌套属性变为可选
 */
export type DeepPartial<T> = T extends Primitive
	? T
	: T extends Array<infer E>
		? Array<DeepPartial<E>>
		: T extends object
			? { [K in keyof T]?: DeepPartial<T[K]> }
			: T;

/**
 * 路径到值的映射类型
 * 用于类型安全的 errors 对象
 */
export type PathRecord<T, V> = {
	[P in Path<T>]?: V;
};

/**
 * 类型安全的字段错误记录
 */
export type TypedFieldErrors<T> = PathRecord<T, string | null>;

/**
 * 辅助类型：提取所有叶子路径（指向原始值的路径）
 */
export type LeafPath<T, D extends number = 5> = [D] extends [never]
	? never
	: T extends Primitive
		? never
		: T extends Array<infer E>
			? E extends Primitive
				? `${number}`
				: `${number}.${LeafPath<E, Prev<D>>}`
			: T extends object
				? {
						[K in keyof T & string]: T[K] extends Primitive
							? K
							: T[K] extends Array<infer E>
								? E extends Primitive
									? `${K}.${number}`
									: `${K}.${number}.${LeafPath<E, Prev<D>>}`
								: IsObject<T[K]> extends true
									? `${K}.${LeafPath<T[K], Prev<D>>}`
									: K;
					}[keyof T & string]
				: never;

/**
 * 辅助类型：提取所有数组路径
 */
export type ArrayPath<T, D extends number = 5> = [D] extends [never]
	? never
	: T extends Primitive
		? never
		: T extends Array<unknown>
			? ''
			: T extends object
				? {
						[K in keyof T & string]: T[K] extends Array<unknown>
							? K
							: IsObject<T[K]> extends true
								? ArrayPath<T[K], Prev<D>> extends never
									? never
									: `${K}.${ArrayPath<T[K], Prev<D>>}`
								: never;
					}[keyof T & string]
				: never;

/**
 * 辅助类型：获取数组路径对应的元素类型
 */
export type ArrayPathValue<T, P extends string> = PathValue<T, P> extends Array<infer E> ? E : never;
