/**
 * 开发模式警告系统
 * 提供清晰的错误信息和使用建议，帮助开发者快速定位问题
 *
 * 特性：
 * - 只在开发模式下显示警告
 * - 相同警告只显示一次（避免控制台刷屏）
 * - 包含解决方案建议
 */

// 检测是否为开发模式
const isDev = (): boolean => {
	try {
		// Vite/SvelteKit 环境变量
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const importMeta = (globalThis as any).import?.meta;
		if (importMeta?.env?.DEV === true || importMeta?.env?.MODE === 'development') {
			return true;
		}
	} catch {
		// 忽略错误
	}

	try {
		// Node.js 环境
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const globalWithProcess = globalThis as any;
		if (globalWithProcess.process?.env?.NODE_ENV === 'development') {
			return true;
		}
	} catch {
		// 忽略错误
	}

	return false;
};

const devMode = isDev();

// 记录已显示的警告，避免重复
const shownWarnings = new Set<string>();

export const DevWarnings = {
	/**
	 * 显示开发警告（只在开发模式下，且每条消息只显示一次）
	 */
	warn(code: string, message: string, suggestion?: string): void {
		if (!devMode) return;
		if (shownWarnings.has(code)) return;

		shownWarnings.add(code);

		const fullMessage = [
			`[FormState Warning] ${code}`,
			message,
			suggestion ? `\nSuggestion: ${suggestion}` : '',
			'\nThis warning will only be shown once in development mode.'
		]
			.filter(Boolean)
			.join('\n');

		console.warn(fullMessage);
	},

	/**
	 * 开发模式错误（总是显示，但提供更详细的信息）
	 */
	error(code: string, message: string, details?: Record<string, unknown>): void {
		const fullMessage = [
			`[FormState Error] ${code}`,
			message,
			details ? `\nDetails: ${JSON.stringify(details, null, 2)}` : ''
		]
			.filter(Boolean)
			.join('\n');

		console.error(fullMessage);
	},

	/**
	 * 重置警告记录（用于测试）
	 */
	resetWarnings(): void {
		shownWarnings.clear();
	}
};

/**
 * 警告代码定义
 * 统一管理所有警告消息
 */
export const WarningCodes = {
	// 字段相关
	FIELD_NOT_REGISTERED: 'FIELD_NOT_REGISTERED',
	FIELD_ALREADY_REGISTERED: 'FIELD_ALREADY_REGISTERED',
	FIELD_CONFIG_MISSING: 'FIELD_CONFIG_MISSING',

	// 验证相关
	VALIDATOR_THREW_ERROR: 'VALIDATOR_THREW_ERROR',
	ASYNC_VALIDATOR_WITHOUT_FLAG: 'ASYNC_VALIDATOR_WITHOUT_FLAG',

	// 数组操作相关
	ARRAY_PATH_NOT_ARRAY: 'ARRAY_PATH_NOT_ARRAY',
	ARRAY_INDEX_OUT_OF_BOUNDS: 'ARRAY_INDEX_OUT_OF_BOUNDS',

	// 提交相关
	SUBMIT_WHILE_VALIDATING: 'SUBMIT_WHILE_VALIDATING',
	DUPLICATE_SUBMISSION: 'DUPLICATE_SUBMISSION',
	SUBMIT_HANDLER_ERROR: 'SUBMIT_HANDLER_ERROR',

	// 类型相关
	INVALID_PATH_TYPE: 'INVALID_PATH_TYPE',
	VALUE_TYPE_MISMATCH: 'VALUE_TYPE_MISMATCH',

	// 性能相关
	LARGE_FORM_WITHOUT_OPTIMIZATION: 'LARGE_FORM_WITHOUT_OPTIMIZATION',
	EXCESSIVE_RERENDERS: 'EXCESSIVE_RERENDERS',

	// 内存相关
	MISSING_DESTROY_CALL: 'MISSING_DESTROY_CALL',
	ORPHANED_FIELD: 'ORPHANED_FIELD'
} as const;

/**
 * 预定义的警告消息
 */
export const FormWarnings = {
	fieldNotRegistered(path: string) {
		DevWarnings.warn(
			WarningCodes.FIELD_NOT_REGISTERED,
			`Attempting to access field "${path}" which is not registered.`,
			`Make sure to register the field first using registerField("${path}", config) or include it in the initial form config.`
		);
	},

	fieldAlreadyRegistered(path: string) {
		DevWarnings.warn(
			WarningCodes.FIELD_ALREADY_REGISTERED,
			`Field "${path}" is being registered again. The config will be merged.`,
			`This is usually fine, but if you see this warning repeatedly, consider using a single registration point.`
		);
	},

	validatorThrewError(path: string, error: unknown) {
		DevWarnings.error(WarningCodes.VALIDATOR_THREW_ERROR, `Validator for field "${path}" threw an error.`, {
			field: path,
			error: error instanceof Error ? error.message : String(error),
			stack: error instanceof Error ? error.stack : undefined
		});
	},

	asyncValidatorWithoutFlag(path: string) {
		DevWarnings.warn(
			WarningCodes.ASYNC_VALIDATOR_WITHOUT_FLAG,
			`Validator for field "${path}" returned a Promise but async: true was not set in zodValidator options.`,
			`For Zod schemas with async refine(), use: zodValidator(schema, { async: true })`
		);
	},

	arrayPathNotArray(path: string, actualType: string) {
		DevWarnings.error(WarningCodes.ARRAY_PATH_NOT_ARRAY, `Expected array at path "${path}" but got ${actualType}.`, {
			path,
			actualType
		});
	},

	arrayIndexOutOfBounds(path: string, index: number, length: number) {
		DevWarnings.warn(
			WarningCodes.ARRAY_INDEX_OUT_OF_BOUNDS,
			`Array index ${index} is out of bounds for array at "${path}" with length ${length}.`,
			`Make sure the index is within 0 to ${length - 1}.`
		);
	},

	duplicateSubmission() {
		DevWarnings.warn(
			WarningCodes.DUPLICATE_SUBMISSION,
			`Form submit was called while a previous submission is still in progress.`,
			`The duplicate submission was ignored. Consider disabling the submit button while isSubmitting is true.`
		);
	},

	submitHandlerError(error: unknown) {
		DevWarnings.error(WarningCodes.SUBMIT_HANDLER_ERROR, `Error occurred in submit handler.`, {
			error: error instanceof Error ? error.message : String(error),
			stack: error instanceof Error ? error.stack : undefined
		});
	},

	largeFormWithoutOptimization(fieldCount: number) {
		DevWarnings.warn(
			WarningCodes.LARGE_FORM_WITHOUT_OPTIMIZATION,
			`Form has ${fieldCount} fields. Consider enabling fine-grained updates for better performance.`,
			`Use: useFormState(config, { fineGrainedUpdates: true }) or useTypedFormState(config, { fineGrainedUpdates: true })`
		);
	},

	missingDestroyCall() {
		DevWarnings.warn(
			WarningCodes.MISSING_DESTROY_CALL,
			`Form state was not properly destroyed. This may cause memory leaks.`,
			`Call form.destroy() when the component unmounts, or use onDestroy(() => form.destroy()) in Svelte.`
		);
	},

	orphanedField(path: string) {
		DevWarnings.warn(
			WarningCodes.ORPHANED_FIELD,
			`Field "${path}" was unregistered but had active subscriptions or pending validations.`,
			`This is usually fine, but may indicate a component lifecycle issue.`
		);
	}
};

/**
 * 类型安全的断言函数
 * 在开发模式下检查条件，生产模式下跳过
 */
export function devAssert(condition: boolean, code: string, message: string): asserts condition {
	if (!devMode) return;

	if (!condition) {
		throw new Error(`[FormState Assertion Failed] ${code}: ${message}`);
	}
}

/**
 * 开发模式下检查性能问题
 */
export function checkPerformance(fieldCount: number): void {
	if (!devMode) return;

	// 大型表单警告阈值
	const LARGE_FORM_THRESHOLD = 50;

	if (fieldCount >= LARGE_FORM_THRESHOLD) {
		FormWarnings.largeFormWithoutOptimization(fieldCount);
	}
}
