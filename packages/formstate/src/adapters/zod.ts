/**
 * Zod Schema 验证器适配器
 * 允许使用 Zod schema 作为字段验证器
 */

import type { IValidator, FieldValue, FieldError } from '../core/interfaces';

/**
 * Zod 错误类型定义
 * 支持 Zod 3.x (errors) 和 Zod 4.x (issues)
 * Zod 4 使用 PropertyKey (string | number | symbol) 作为路径类型
 */
interface ZodIssue {
	message: string;
	path: PropertyKey[];
}

interface ZodError {
	issues?: ZodIssue[];
	errors?: ZodIssue[];
}

interface ZodSafeParseResult<T> {
	success: boolean;
	data?: T;
	error?: ZodError;
}

/**
 * Zod Schema 的基础类型定义
 * 使用最小化的类型定义避免直接依赖 zod 包
 * 兼容 Zod 3.x 和 Zod 4.x
 */
interface ZodSchema<T = unknown> {
	safeParse(data: unknown): ZodSafeParseResult<T>;
	parseAsync?(data: unknown): Promise<T>;
	safeParseAsync?(data: unknown): Promise<ZodSafeParseResult<T>>;
}

/**
 * 从 ZodError 中提取错误列表
 * 兼容 Zod 3.x (errors) 和 Zod 4.x (issues)
 */
function getZodIssues(error?: ZodError): ZodIssue[] {
	if (!error) return [];
	return error.issues || error.errors || [];
}

/**
 * 将 PropertyKey 路径转换为字符串
 * 处理 symbol 类型（Zod 4 可能使用 symbol 作为路径）
 */
function pathToString(path: PropertyKey[]): string {
	return path
		.map((p) => (typeof p === 'symbol' ? p.description || String(p) : String(p)))
		.join('.');
}

/**
 * 创建 Zod schema 验证器
 *
 * @example
 * ```typescript
 * import { z } from 'zod';
 * import { zodValidator } from '@formstate/adapters/zod';
 *
 * const emailSchema = z.string().email('请输入有效的邮箱地址');
 *
 * const form = useFormState({
 *   fields: {
 *     email: {
 *       defaultValue: '',
 *       validator: zodValidator(emailSchema)
 *     }
 *   }
 * });
 * ```
 *
 * @param schema - Zod schema 对象
 * @param options - 可选配置
 * @returns 符合 IValidator 接口的验证器
 */
export function zodValidator<T = FieldValue>(
	schema: ZodSchema<T>,
	options?: {
		/** 是否使用异步解析（支持异步 refine） */
		async?: boolean;
		/** 自定义错误消息（覆盖 schema 中的错误消息） */
		message?: string;
	}
): IValidator<T> {
	return {
		validate: async (value: T): Promise<FieldError> => {
			try {
				// 根据配置选择同步或异步解析
				const result =
					options?.async && schema.safeParseAsync
						? await schema.safeParseAsync(value)
						: schema.safeParse(value);

				if (result.success) {
					return null;
				}

				// 使用自定义消息或 schema 中的第一个错误消息
				if (options?.message) {
					return options.message;
				}

				// 返回第一个错误消息
				const issues = getZodIssues(result.error);
				return issues[0]?.message || 'Validation failed';
			} catch (error) {
				// 处理意外错误
				return error instanceof Error ? error.message : 'Validation error';
			}
		}
	};
}

/**
 * 创建表单级别的 Zod schema 验证器
 * 用于验证整个表单数据结构
 *
 * @example
 * ```typescript
 * import { z } from 'zod';
 * import { zodFormValidator } from '@formstate/adapters/zod';
 *
 * const formSchema = z.object({
 *   password: z.string().min(8),
 *   confirmPassword: z.string()
 * }).refine(
 *   data => data.password === data.confirmPassword,
 *   { message: '密码不匹配', path: ['confirmPassword'] }
 * );
 *
 * // 在表单提交时使用
 * const errors = await zodFormValidator(formSchema).validateForm(values);
 * ```
 *
 * @param schema - Zod object schema
 * @returns 返回表单验证器对象
 */
export function zodFormValidator<T extends Record<string, FieldValue>>(
	schema: ZodSchema<T>
): {
	validateForm: (values: T) => Promise<Record<string, FieldError>>;
	validateField: (field: keyof T, values: T) => Promise<FieldError>;
} {
	return {
		validateForm: async (values: T): Promise<Record<string, FieldError>> => {
			const result = schema.safeParseAsync
				? await schema.safeParseAsync(values)
				: schema.safeParse(values);

			if (result.success) {
				return {};
			}

			const errors: Record<string, FieldError> = {};
			const issues = getZodIssues(result.error);
			for (const issue of issues) {
				const path = pathToString(issue.path);
				// 只保留每个字段的第一个错误
				if (!errors[path]) {
					errors[path] = issue.message;
				}
			}
			return errors;
		},

		validateField: async (field: keyof T, values: T): Promise<FieldError> => {
			const result = schema.safeParseAsync
				? await schema.safeParseAsync(values)
				: schema.safeParse(values);

			if (result.success) {
				return null;
			}

			// 查找特定字段的错误
			const issues = getZodIssues(result.error);
			const fieldError = issues.find(
				(issue) => issue.path[0] === field || pathToString(issue.path) === field
			);
			return fieldError?.message || null;
		}
	};
}

/**
 * 组合多个 Zod schema 验证器
 * 按顺序执行，遇到第一个错误即停止
 *
 * @example
 * ```typescript
 * import { z } from 'zod';
 * import { composeZodValidators, zodValidator } from '@formstate/adapters/zod';
 *
 * const validator = composeZodValidators(
 *   zodValidator(z.string().min(1, '不能为空')),
 *   zodValidator(z.string().email('邮箱格式不正确'))
 * );
 * ```
 */
export function composeZodValidators<T = FieldValue>(
	...validators: IValidator<T>[]
): IValidator<T> {
	return {
		validate: async (value: T, allValues: Record<string, FieldValue>): Promise<FieldError> => {
			for (const validator of validators) {
				const error = await Promise.resolve(validator.validate(value, allValues));
				if (error) return error;
			}
			return null;
		}
	};
}
