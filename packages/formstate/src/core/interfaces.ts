/**
 * 核心接口定义 - 面向接口编程
 * 所有实现必须遵循这些接口约束
 */

// ========== 基础类型 ==========
export type FieldValue = unknown;
export type FieldPath = string;
export type FieldError = string | null;

// ========== 字段状态接口 ==========
export interface IFieldState<T = FieldValue> {
	readonly value: T;
	readonly error: FieldError;
	readonly touched: boolean;
	readonly dirty: boolean;
	readonly validating: boolean;
}

// ========== 验证器接口 ==========
export interface IValidator<T = FieldValue> {
	validate(value: T, allValues: Record<string, FieldValue>): FieldError | Promise<FieldError>;
}

export interface IValidatorFactory {
	required(message?: string): IValidator;
	email(message?: string): IValidator<string>;
	minLength(min: number, message?: string): IValidator<string>;
	maxLength(max: number, message?: string): IValidator<string>;
	min(min: number, message?: string): IValidator<number>;
	max(max: number, message?: string): IValidator<number>;
	pattern(regex: RegExp, message?: string): IValidator<string>;
	compose(...validators: IValidator[]): IValidator;
}

// ========== 转换器接口 ==========
export interface ITransformer<TInput = FieldValue, TOutput = FieldValue> {
	transform(value: TInput): TOutput;
}

// ========== 字段配置接口 ==========
export interface IFieldConfig<T = FieldValue> {
	defaultValue?: T;
	validator?: IValidator<T>;
	transformer?: ITransformer<T, T>;
	dependencies?: FieldPath[];
	validateOnChange?: boolean;
	validateOnBlur?: boolean;
	validateOnMount?: boolean;
	// 输入完成检测配置
	validateOnComplete?: boolean; // 输入完成时验证
	completeCondition?: (value: T) => boolean; // 自定义输入完成条件
	debounceMs?: number; // 防抖延迟（默认 300ms）
	// 字段生命周期配置
	persistent?: boolean; // 是否持久字段（默认 false，动态字段会在组件销毁时自动注销）
}

// ========== 表单配置接口 ==========
export interface IFormConfig {
	fields?: Record<FieldPath, IFieldConfig>;
	validateOnChange?: boolean;
	validateOnBlur?: boolean;
	validateOnMount?: boolean;
}

// ========== 观察者接口 ==========
export interface IFormObserver {
	onFieldChange?(path: FieldPath, value: FieldValue): void;
	onFieldBlur?(path: FieldPath): void;
	onFieldValidation?(path: FieldPath, error: FieldError): void;
	onFormValidation?(errors: Record<FieldPath, FieldError>): void;
	onSubmit?(values: Record<string, FieldValue>): void;
}

// ========== 表单状态管理器接口 ==========
export interface IFormStateManager {
	// 字段注册
	registerField(path: FieldPath, config?: IFieldConfig): void;
	unregisterField(path: FieldPath): void;

	// 值管理
	setValue(path: FieldPath, value: FieldValue, shouldValidate?: boolean): void;
	getValue(path: FieldPath): FieldValue;
	getValues(): Readonly<Record<string, FieldValue>>;
	setValues(values: Record<string, FieldValue>, shouldValidate?: boolean): void;

	// 初始值管理
	setInitialValues(values: Record<string, FieldValue>, shouldReset?: boolean): void;
	reset(newInitialValues?: Record<string, FieldValue>): void;

	// 字段状态管理
	getFieldState(path: FieldPath): IFieldState;
	setFieldTouched(path: FieldPath, touched?: boolean): void;
	setFieldError(path: FieldPath, error: FieldError): void;

	// 验证
	validateField(path: FieldPath): Promise<FieldError>;
	validateFields(paths: FieldPath[]): Promise<Record<FieldPath, FieldError>>;
	validateForm(): Promise<Record<FieldPath, FieldError>>;

	// 表单状态查询
	isDirty(): boolean;
	isValid(): boolean;
	isValidating(): boolean;
	getTouchedFields(): FieldPath[];
	getDirtyFields(): FieldPath[];
	getErrors(): Record<FieldPath, FieldError>;
	getDirtyValues(): Partial<Record<string, FieldValue>>;

	// 提交
	submit(onSubmit: (values: Record<string, FieldValue>) => void | Promise<void>): Promise<boolean>;

	// 观察者
	subscribe(observer: IFormObserver): () => void;

	// 持久化
	serialize(): string;
}

// ========== 路径工具接口 ==========
export interface IPathUtils {
	get(obj: unknown, path: FieldPath): FieldValue;
	set(obj: unknown, path: FieldPath, value: FieldValue): unknown;
	setMutable(obj: unknown, path: FieldPath, value: FieldValue): void;
	delete(obj: unknown, path: FieldPath): unknown;
}
