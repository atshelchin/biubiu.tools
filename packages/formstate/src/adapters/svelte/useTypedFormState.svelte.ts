/**
 * 类型安全的 Svelte 5 表单状态 Hook
 * 提供完整的 TypeScript 类型推断和路径自动补全
 *
 * @example
 * ```typescript
 * interface FormValues {
 *   user: { name: string; email: string };
 *   tags: string[];
 * }
 *
 * const form = useTypedFormState<FormValues>({
 *   initialValues: {
 *     user: { name: '', email: '' },
 *     tags: []
 *   }
 * });
 *
 * // TypeScript 会自动补全有效路径
 * form.setValue('user.name', 'John'); // ✓
 * form.setValue('user.invalid', 'x'); // ✗ 类型错误
 *
 * // 值类型也会自动推断
 * const name = form.getValue('user.name'); // 类型为 string
 * const tags = form.getValue('tags'); // 类型为 string[]
 * ```
 */

import { FormStateManager } from '../../core/FormStateManager';
import type {
	IFormConfig,
	FieldPath,
	FieldValue,
	FieldError,
	IFieldConfig,
	IFieldState,
	IFormObserver
} from '../../core/interfaces';
import type { Path, PathValue, ArrayPath, ArrayPathValue, DeepPartial } from '../../core/path-types';
import { PathUtils } from '../../utils/PathUtils';
import { debug } from '../../utils/debug';
import { safeStringify } from '../../utils/serialize';

let instanceCounter = 0;

/**
 * 表单值的基础约束类型
 * 使用 object 约束而不是 Record<string, unknown>，允许普通接口传入
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type FormValuesConstraint = {};

/**
 * 类型安全的表单配置
 */
export interface TypedFormConfig<T extends FormValuesConstraint> extends Omit<IFormConfig, 'fields'> {
	/** 初始值（必须提供完整的类型结构） */
	initialValues: T;
	/** 字段配置（使用类型安全的路径） */
	fields?: {
		[P in Path<T>]?: IFieldConfig<PathValue<T, P>>;
	};
}

/**
 * 类型安全的表单状态选项
 */
export interface TypedFormStateOptions {
	/**
	 * 启用细粒度状态更新（实验性）
	 * @default false
	 */
	fineGrainedUpdates?: boolean;
}

/**
 * 类型安全的表单状态 API
 */
export interface TypedFormState<T extends FormValuesConstraint> {
	// 响应式状态（只读）
	readonly values: T;
	readonly errors: Record<string, FieldError>;
	readonly isDirty: boolean;
	readonly isValid: boolean;
	readonly isValidating: boolean;
	readonly isSubmitting: boolean;

	// 类型安全的字段操作
	getValue<P extends Path<T>>(path: P): PathValue<T, P>;
	setValue<P extends Path<T>>(path: P, value: PathValue<T, P>, shouldValidate?: boolean): void;
	getFieldState<P extends Path<T>>(path: P): IFieldState<PathValue<T, P>>;
	getFieldError<P extends Path<T>>(path: P): FieldError;
	setFieldTouched<P extends Path<T>>(path: P, touched?: boolean): void;
	setFieldError<P extends Path<T>>(path: P, error: FieldError): void;

	// 类型安全的验证
	validateField<P extends Path<T>>(path: P): Promise<FieldError>;
	validateFields<P extends Path<T>>(paths: P[]): Promise<Record<P, FieldError>>;
	validateForm(): Promise<Record<string, FieldError>>;

	// 类型安全的数组操作
	getArrayValue<P extends ArrayPath<T>>(path: P): ArrayPathValue<T, P>[];
	pushArrayItem<P extends ArrayPath<T>>(path: P, item: ArrayPathValue<T, P>): void;
	removeArrayItem<P extends ArrayPath<T>>(path: P, index: number): void;
	insertArrayItem<P extends ArrayPath<T>>(path: P, index: number, item: ArrayPathValue<T, P>): void;
	moveArrayItem<P extends ArrayPath<T>>(path: P, fromIndex: number, toIndex: number): void;

	// 类型安全的监听
	watch<P extends Path<T>>(path: P, callback: (value: PathValue<T, P>, prevValue: PathValue<T, P>) => void): () => void;
	watch<P extends Path<T>>(paths: P[], callback: (values: { [K in P]: PathValue<T, K> }) => void): () => void;

	// 表单操作
	setValues(values: DeepPartial<T>, shouldValidate?: boolean): void;
	reset(newInitialValues?: DeepPartial<T>): void;
	setInitialValues(values: DeepPartial<T>, shouldReset?: boolean): void;
	submit(onSubmit: (values: T) => void | Promise<void>): Promise<boolean>;

	// 字段查询
	hasField<P extends Path<T>>(path: P): boolean;
	getFieldConfig<P extends Path<T>>(path: P): IFieldConfig<PathValue<T, P>> | undefined;
	getRegisteredFields(): Path<T>[];
	getDirtyFields(): Path<T>[];
	getDirtyValues(): DeepPartial<T>;

	// 高级 API
	registerField<P extends Path<T>>(path: P, config?: IFieldConfig<PathValue<T, P>>): void;
	unregisterField<P extends Path<T>>(path: P): void;
	batchUpdate(fn: () => void): void;
	subscribe(observer: IFormObserver): () => void;

	// 细粒度更新支持
	getFieldVersion<P extends Path<T>>(path: P): number;

	// 资源清理
	destroy(): void;

	// 原始 manager（高级用法）
	_manager: FormStateManager;
}

/**
 * 创建类型安全的表单状态
 *
 * @example
 * ```typescript
 * interface LoginForm {
 *   email: string;
 *   password: string;
 *   rememberMe: boolean;
 * }
 *
 * const form = useTypedFormState<LoginForm>({
 *   initialValues: {
 *     email: '',
 *     password: '',
 *     rememberMe: false
 *   },
 *   fields: {
 *     email: { validator: Validators.email() },
 *     password: { validator: Validators.minLength(8) }
 *   }
 * });
 *
 * // 完整的类型推断和自动补全
 * form.setValue('email', 'user@example.com');
 * form.setValue('password', '12345678');
 *
 * // 类型错误示例
 * form.setValue('email', 123); // Error: number 不能赋值给 string
 * form.setValue('invalid', 'x'); // Error: 'invalid' 不是有效路径
 * ```
 */
export function useTypedFormState<T extends FormValuesConstraint>(
	config: TypedFormConfig<T>,
	options: TypedFormStateOptions = {}
): TypedFormState<T> {
	const instanceId = ++instanceCounter;
	const { fineGrainedUpdates = false } = options;

	debug.log(
		`[useTypedFormState #${instanceId}] Called with fineGrainedUpdates: ${fineGrainedUpdates}`
	);

	// 转换配置为标准 IFormConfig
	const standardConfig: IFormConfig = {
		fields: {},
		validateOnChange: config.validateOnChange,
		validateOnBlur: config.validateOnBlur,
		validateOnMount: config.validateOnMount
	};

	// 设置初始值作为默认值
	if (config.initialValues) {
		flattenObject(config.initialValues, '', (path, value) => {
			if (!standardConfig.fields) standardConfig.fields = {};
			standardConfig.fields[path] = { defaultValue: value };
		});
	}

	// 合并字段配置
	if (config.fields) {
		for (const [path, fieldConfig] of Object.entries(config.fields)) {
			if (fieldConfig) {
				if (!standardConfig.fields) standardConfig.fields = {};
				standardConfig.fields[path] = {
					...standardConfig.fields[path],
					...fieldConfig
				};
			}
		}
	}

	const manager = new FormStateManager(standardConfig);

	// 直接使用 $state 维护响应式状态副本
	const initialValues = manager.getValues() as T;
	debug.log(`[useTypedFormState #${instanceId}] Initial values:`, safeStringify(initialValues, 2));

	// 创建响应式容器
	const state = $state({
		values: initialValues,
		errors: manager.getErrors(),
		isDirty: manager.isDirty(),
		isValid: manager.isValid(),
		isValidating: manager.isValidating(),
		fieldStatesVersion: 0
	});

	// 细粒度字段状态追踪
	const fieldVersions = $state<Record<FieldPath, number>>({});

	function getFieldVersion(path: FieldPath): number {
		return fieldVersions[path] ?? 0;
	}

	function incrementFieldVersion(path: FieldPath): void {
		fieldVersions[path] = (fieldVersions[path] ?? 0) + 1;
	}

	// 订阅管理器变化
	const unsubscribe = manager.subscribe({
		onFieldChange: (path) => {
			const newValues = manager.getValues() as T;
			debug.log(`[useTypedFormState #${instanceId}] Field changed:`, path);

			if (fineGrainedUpdates) {
				const newValue = PathUtils.get(newValues, path);
				PathUtils.setMutable(state.values, path, newValue);
				incrementFieldVersion(path);
			} else {
				state.values = newValues;
			}

			state.isDirty = manager.isDirty();
			state.isValid = manager.isValid();
			state.fieldStatesVersion++;
		},
		onFieldValidation: (path) => {
			state.errors = manager.getErrors();
			state.isValid = manager.isValid();
			state.isValidating = manager.isValidating();

			if (fineGrainedUpdates && path) {
				incrementFieldVersion(path);
			}

			state.fieldStatesVersion++;
		},
		onFieldBlur: (path) => {
			if (fineGrainedUpdates && path) {
				incrementFieldVersion(path);
			}
			state.fieldStatesVersion++;
		}
	});

	// 返回类型安全的 API
	return {
		get values() {
			return state.values;
		},
		get errors() {
			return state.errors;
		},
		get isDirty() {
			return state.isDirty;
		},
		get isValid() {
			return state.isValid;
		},
		get isValidating() {
			return state.isValidating;
		},
		get isSubmitting() {
			return manager.isSubmitting();
		},

		getValue<P extends Path<T>>(path: P): PathValue<T, P> {
			if (fineGrainedUpdates) {
				// eslint-disable-next-line @typescript-eslint/no-unused-expressions
				getFieldVersion(path);
			}
			return PathUtils.get(state.values, path) as PathValue<T, P>;
		},

		setValue<P extends Path<T>>(path: P, value: PathValue<T, P>, shouldValidate?: boolean): void {
			manager.setValue(path, value as FieldValue, shouldValidate);
		},

		getFieldState<P extends Path<T>>(path: P): IFieldState<PathValue<T, P>> {
			if (fineGrainedUpdates) {
				// eslint-disable-next-line @typescript-eslint/no-unused-expressions
				getFieldVersion(path);
			} else {
				// eslint-disable-next-line @typescript-eslint/no-unused-expressions
				state.fieldStatesVersion;
			}
			const fieldState = manager.getFieldState(path);
			return {
				...fieldState,
				value: PathUtils.get(state.values, path) as PathValue<T, P>
			} as IFieldState<PathValue<T, P>>;
		},

		getFieldError<P extends Path<T>>(path: P): FieldError {
			if (fineGrainedUpdates) {
				// eslint-disable-next-line @typescript-eslint/no-unused-expressions
				getFieldVersion(path);
			}
			return state.errors[path] ?? null;
		},

		setFieldTouched<P extends Path<T>>(path: P, touched?: boolean): void {
			manager.setFieldTouched(path, touched);
		},

		setFieldError<P extends Path<T>>(path: P, error: FieldError): void {
			manager.setFieldError(path, error);
		},

		validateField<P extends Path<T>>(path: P): Promise<FieldError> {
			return manager.validateField(path);
		},

		validateFields<P extends Path<T>>(paths: P[]): Promise<Record<P, FieldError>> {
			return manager.validateFields(paths) as Promise<Record<P, FieldError>>;
		},

		validateForm(): Promise<Record<string, FieldError>> {
			return manager.validateForm();
		},

		// 类型安全的数组操作
		getArrayValue<P extends ArrayPath<T>>(path: P): ArrayPathValue<T, P>[] {
			const value = PathUtils.get(state.values, path);
			return Array.isArray(value) ? (value as ArrayPathValue<T, P>[]) : [];
		},

		pushArrayItem<P extends ArrayPath<T>>(path: P, item: ArrayPathValue<T, P>): void {
			const array = PathUtils.get(state.values, path);
			if (Array.isArray(array)) {
				manager.setValue(path, [...array, item]);
			}
		},

		removeArrayItem<P extends ArrayPath<T>>(path: P, index: number): void {
			const array = PathUtils.get(state.values, path);
			if (Array.isArray(array)) {
				const newArray = [...array];
				newArray.splice(index, 1);
				manager.setValue(path, newArray);
				manager.remapArrayFields(path, 'remove', index);
			}
		},

		insertArrayItem<P extends ArrayPath<T>>(path: P, index: number, item: ArrayPathValue<T, P>): void {
			const array = PathUtils.get(state.values, path);
			if (Array.isArray(array)) {
				const newArray = [...array];
				newArray.splice(index, 0, item);
				manager.setValue(path, newArray);
				manager.remapArrayFields(path, 'insert', index);
			}
		},

		moveArrayItem<P extends ArrayPath<T>>(path: P, fromIndex: number, toIndex: number): void {
			const array = PathUtils.get(state.values, path);
			if (Array.isArray(array)) {
				const newArray = [...array];
				const [item] = newArray.splice(fromIndex, 1);
				newArray.splice(toIndex, 0, item);
				manager.setValue(path, newArray);
				manager.remapArrayFields(path, 'move', fromIndex, toIndex);
			}
		},

		watch<P extends Path<T>>(
			pathOrPaths: P | P[],
			callback: ((value: PathValue<T, P>, prevValue: PathValue<T, P>) => void) | ((values: { [K in P]: PathValue<T, K> }) => void)
		): () => void {
			if (Array.isArray(pathOrPaths)) {
				return manager.watch(
					pathOrPaths,
					callback as (values: Record<FieldPath, FieldValue>) => void
				);
			}
			return manager.watch(
				pathOrPaths,
				callback as (value: FieldValue, prevValue: FieldValue) => void
			);
		},

		setValues(values: DeepPartial<T>, shouldValidate?: boolean): void {
			manager.setValues(values as Record<string, FieldValue>, shouldValidate);
		},

		reset(newInitialValues?: DeepPartial<T>): void {
			manager.reset(newInitialValues as Record<string, FieldValue>);
		},

		setInitialValues(values: DeepPartial<T>, shouldReset?: boolean): void {
			manager.setInitialValues(values as Record<string, FieldValue>, shouldReset);
		},

		submit(onSubmit: (values: T) => void | Promise<void>): Promise<boolean> {
			return manager.submit(onSubmit as (values: Record<string, FieldValue>) => void | Promise<void>);
		},

		hasField<P extends Path<T>>(path: P): boolean {
			return manager.hasField(path);
		},

		getFieldConfig<P extends Path<T>>(path: P): IFieldConfig<PathValue<T, P>> | undefined {
			return manager.getFieldConfig(path) as IFieldConfig<PathValue<T, P>> | undefined;
		},

		getRegisteredFields(): Path<T>[] {
			return manager.getRegisteredFields() as Path<T>[];
		},

		getDirtyFields(): Path<T>[] {
			return manager.getDirtyFields() as Path<T>[];
		},

		getDirtyValues(): DeepPartial<T> {
			return manager.getDirtyValues() as DeepPartial<T>;
		},

		registerField<P extends Path<T>>(path: P, config?: IFieldConfig<PathValue<T, P>>): void {
			manager.registerField(path, config as IFieldConfig);
		},

		unregisterField<P extends Path<T>>(path: P): void {
			manager.unregisterField(path);
		},

		batchUpdate(fn: () => void): void {
			manager.batchUpdate(fn);
		},

		subscribe(observer: IFormObserver): () => void {
			return manager.subscribe(observer);
		},

		getFieldVersion<P extends Path<T>>(path: P): number {
			return getFieldVersion(path);
		},

		destroy(): void {
			debug.log(`[useTypedFormState #${instanceId}] Destroying form state`);
			unsubscribe();
		},

		_manager: manager
	};
}

/**
 * 将嵌套对象扁平化为路径-值对
 */
function flattenObject(
	obj: unknown,
	prefix: string,
	callback: (path: string, value: FieldValue) => void
): void {
	if (obj === null || obj === undefined) {
		if (prefix) callback(prefix, obj);
		return;
	}

	if (Array.isArray(obj)) {
		callback(prefix, obj);
		// 不展开数组元素为独立路径
		return;
	}

	if (typeof obj === 'object') {
		const entries = Object.entries(obj as Record<string, unknown>);
		if (entries.length === 0) {
			if (prefix) callback(prefix, obj);
			return;
		}

		for (const [key, value] of entries) {
			const path = prefix ? `${prefix}.${key}` : key;

			if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
				// 递归处理嵌套对象
				flattenObject(value, path, callback);
			} else {
				callback(path, value);
			}
		}
	} else {
		if (prefix) callback(prefix, obj);
	}
}

export type { Path, PathValue, ArrayPath, ArrayPathValue, DeepPartial } from '../../core/path-types';
