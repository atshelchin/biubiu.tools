/**
 * 表单状态管理器 - 实现 IFormStateManager 接口
 * 核心业务逻辑：字段管理、验证、状态追踪
 */

import { produce, setAutoFreeze } from 'immer';
import { PathUtils } from '../utils/PathUtils';
import { debug } from '../utils/debug';
import type {
	IFormStateManager,
	IFieldState,
	IFieldConfig,
	IFormConfig,
	IFormObserver,
	FieldPath,
	FieldValue,
	FieldError
} from './interfaces';

// 禁用 Immer 的 autoFreeze，避免与 Svelte 5 的 $state 代理冲突
// Svelte 5 的响应式系统需要对象保持可配置（configurable）
setAutoFreeze(false);

export class FormStateManager implements IFormStateManager {
	private values: Record<string, FieldValue> = {};
	private initialValues: Record<string, FieldValue> = {};
	private fieldStates: Map<FieldPath, IFieldState> = new Map();
	private fieldConfigs: Map<FieldPath, IFieldConfig> = new Map();
	private observers: Set<IFormObserver> = new Set();
	private config: IFormConfig;
	private validationAbortControllers: Map<FieldPath, AbortController> = new Map();
	private debounceTimers: Map<FieldPath, ReturnType<typeof setTimeout>> = new Map();

	constructor(config: IFormConfig = {}) {
		debug.log(
			'[FormStateManager.constructor] config.fields:',
			config.fields ? Object.keys(config.fields) : 'undefined'
		);
		this.config = {
			validateOnChange: true,
			validateOnBlur: true,
			validateOnMount: false,
			...config
		};

		// 注册字段配置
		if (config.fields) {
			debug.log(
				'[FormStateManager.constructor] Registering',
				Object.keys(config.fields).length,
				'fields'
			);
			Object.entries(config.fields).forEach(([path, fieldConfig]) => {
				this.registerField(path, fieldConfig);
			});
		} else {
			debug.log('[FormStateManager.constructor] NO FIELDS TO REGISTER!');
		}
		debug.log(
			'[FormStateManager.constructor] Final this.values:',
			JSON.stringify(this.values, null, 2)
		);
	}

	// ========== 字段注册 ==========
	registerField(path: FieldPath, config: IFieldConfig = {}): void {
		// 如果字段已注册，合并配置而不是覆盖
		const existingConfig = this.fieldConfigs.get(path);
		if (existingConfig) {
			// 已存在配置，只更新非空字段
			this.fieldConfigs.set(path, {
				...existingConfig,
				...Object.fromEntries(Object.entries(config).filter(([_, v]) => v !== undefined))
			});
		} else {
			// 新字段，直接设置
			this.fieldConfigs.set(path, config);
		}

		// 初始化字段状态
		if (!this.fieldStates.has(path)) {
			const defaultValue = config.defaultValue ?? PathUtils.get(this.initialValues, path);

			this.fieldStates.set(path, {
				value: defaultValue,
				error: null,
				touched: false,
				dirty: false,
				validating: false
			});

			// 设置初始值
			if (defaultValue !== undefined) {
				this.values = PathUtils.set(this.values, path, defaultValue) as Record<string, FieldValue>;
				this.initialValues = PathUtils.set(this.initialValues, path, defaultValue) as Record<
					string,
					FieldValue
				>;
			}
		}

		// 如果配置了立即验证
		if (this.config.validateOnMount && config.validator) {
			this.validateField(path);
		}
	}

	unregisterField(path: FieldPath): void {
		// 清理防抖计时器
		const timer = this.debounceTimers.get(path);
		if (timer) {
			clearTimeout(timer);
			this.debounceTimers.delete(path);
		}

		// 取消进行中的验证
		const abortController = this.validationAbortControllers.get(path);
		if (abortController) {
			abortController.abort();
			this.validationAbortControllers.delete(path);
		}

		// 清理配置和状态
		this.fieldConfigs.delete(path);
		this.fieldStates.delete(path);
		this.values = PathUtils.delete(this.values, path) as Record<string, FieldValue>;
	}

	// ========== 值管理 ==========
	setValue(path: FieldPath, value: FieldValue, shouldValidate = true): void {
		const config = this.fieldConfigs.get(path);

		// 应用转换
		const transformedValue = config?.transformer ? config.transformer.transform(value) : value;

		// 使用 Immer 更新值，确保不可变性和深层嵌套的正确更新
		debug.log('[setValue] BEFORE produce, path:', path);
		debug.log('[setValue] this.values:', JSON.stringify(this.values, null, 2));
		const newValues = produce(this.values, (draft) => {
			debug.log('[setValue] IN produce draft keys:', Object.keys(draft));
			PathUtils.setMutable(draft, path, transformedValue);
			debug.log('[setValue] AFTER setMutable, draft keys:', Object.keys(draft));
		});
		debug.log('[setValue] AFTER produce, newValues keys:', Object.keys(newValues));
		this.values = newValues as Record<string, FieldValue>;

		// 更新字段状态
		const fieldState = this.getFieldState(path);
		const initialValue = PathUtils.get(this.initialValues, path);

		this.fieldStates.set(path, {
			...fieldState,
			value: transformedValue,
			dirty: transformedValue !== initialValue
		});

		// 通知观察者
		this.observers.forEach((observer) => {
			observer.onFieldChange?.(path, transformedValue);
		});

		// 验证当前字段
		if (shouldValidate) {
			// 检查是否配置了输入完成验证
			if (config?.validateOnComplete) {
				this.handleCompleteValidation(path, transformedValue, config);
			} else if (this.config.validateOnChange) {
				this.validateField(path);
			}
		}

		// 验证依赖此字段的其他字段
		this.validateDependentFields(path);
	}

	/**
	 * 处理输入完成验证
	 * 使用防抖和自定义完成条件
	 */
	private handleCompleteValidation(path: FieldPath, value: FieldValue, config: IFieldConfig): void {
		// 清除之前的定时器
		const existingTimer = this.debounceTimers.get(path);
		if (existingTimer) {
			clearTimeout(existingTimer);
		}

		// 检查是否满足完成条件
		const isComplete = config.completeCondition
			? config.completeCondition(value)
			: this.defaultCompleteCondition(value);

		if (!isComplete) {
			// 未完成，不验证
			return;
		}

		// 设置防抖延迟
		const debounceMs = config.debounceMs ?? 300;

		const timer = setTimeout(() => {
			this.validateField(path);
			this.debounceTimers.delete(path);
		}, debounceMs);

		this.debounceTimers.set(path, timer);
	}

	/**
	 * 默认的输入完成条件
	 * - 字符串：长度 > 0
	 * - 数字：不为 NaN
	 * - 数组：长度 > 0
	 * - 对象：不为 null
	 */
	private defaultCompleteCondition(value: FieldValue): boolean {
		if (value == null) return false;
		if (typeof value === 'string') return value.trim().length > 0;
		if (typeof value === 'number') return !isNaN(value);
		if (Array.isArray(value)) return value.length > 0;
		return true;
	}

	getValue(path: FieldPath): FieldValue {
		return PathUtils.get(this.values, path);
	}

	getValues(): Readonly<Record<string, FieldValue>> {
		// Immer 已经确保了 values 是不可变的，直接返回即可
		return this.values;
	}

	setValues(values: Record<string, FieldValue>, shouldValidate = false): void {
		// 使用 Immer 确保深层不可变性，与 setValue 保持一致
		this.values = produce({}, (draft) => {
			Object.assign(draft, values);
		}) as Record<string, FieldValue>;

		// 更新所有字段状态
		this.fieldStates.forEach((state, path) => {
			const value = PathUtils.get(values, path);
			const initialValue = PathUtils.get(this.initialValues, path);

			this.fieldStates.set(path, {
				...state,
				value,
				dirty: value !== initialValue
			});

			// 通知观察者字段已更新
			this.observers.forEach((observer) => {
				observer.onFieldChange?.(path, value);
			});
		});

		if (shouldValidate) {
			this.validateForm();
		}
	}

	// 重置到初始值
	reset(newInitialValues?: Record<string, FieldValue>): void {
		if (newInitialValues) {
			// 使用 structuredClone 进行深拷贝，避免共享嵌套引用
			this.initialValues = structuredClone(newInitialValues);
		}

		// 深拷贝初始值以确保不可变性
		this.values = structuredClone(this.initialValues);

		this.fieldStates.forEach((state, path) => {
			const value = PathUtils.get(this.initialValues, path);
			this.fieldStates.set(path, {
				value,
				error: null,
				touched: false,
				dirty: false,
				validating: false
			});

			// 通知观察者字段已重置
			this.observers.forEach((observer) => {
				observer.onFieldChange?.(path, value);
			});
		});
	}

	// 设置初始值（用于表单加载后填充数据）
	setInitialValues(values: Record<string, FieldValue>, shouldReset = false): void {
		// 深拷贝以避免外部修改影响内部状态
		this.initialValues = structuredClone(values);

		if (shouldReset) {
			this.reset();
		} else {
			// 只更新那些未被修改过的字段
			this.fieldStates.forEach((state, path) => {
				if (!state.dirty) {
					const value = PathUtils.get(values, path);
					this.setValue(path, value, false);
				}
			});
		}
	}

	// ========== 字段状态管理 ==========
	getFieldState(path: FieldPath): IFieldState {
		return (
			this.fieldStates.get(path) || {
				value: undefined,
				error: null,
				touched: false,
				dirty: false,
				validating: false
			}
		);
	}

	setFieldTouched(path: FieldPath, touched = true): void {
		const state = this.getFieldState(path);
		this.fieldStates.set(path, { ...state, touched });

		if (touched && this.config.validateOnBlur) {
			this.validateField(path);
		}

		this.observers.forEach((observer) => {
			observer.onFieldBlur?.(path);
		});
	}

	setFieldError(path: FieldPath, error: FieldError): void {
		const state = this.getFieldState(path);
		this.fieldStates.set(path, { ...state, error });
	}

	// ========== 验证 ==========
	async validateField(path: FieldPath): Promise<FieldError> {
		const config = this.fieldConfigs.get(path);
		if (!config?.validator) return null;

		// 取消之前的验证
		this.validationAbortControllers.get(path)?.abort();
		const abortController = new AbortController();
		this.validationAbortControllers.set(path, abortController);

		const state = this.getFieldState(path);
		this.fieldStates.set(path, { ...state, validating: true });

		try {
			const value = this.getValue(path);
			const error = await Promise.resolve(config.validator.validate(value, this.values));

			// 检查是否已被取消
			if (abortController.signal.aborted) return state.error;

			this.fieldStates.set(path, {
				...this.getFieldState(path),
				error,
				validating: false
			});

			this.observers.forEach((observer) => {
				observer.onFieldValidation?.(path, error);
			});

			return error;
		} catch (err) {
			if (!abortController.signal.aborted) {
				const error = 'Validation error';
				this.fieldStates.set(path, {
					...this.getFieldState(path),
					error,
					validating: false
				});
				return error;
			}
			return state.error;
		}
	}

	/**
	 * 验证指定的多个字段（局部验证）
	 */
	async validateFields(paths: FieldPath[]): Promise<Record<FieldPath, FieldError>> {
		const validations = paths.map((path) =>
			this.validateField(path).then((error) => ({ path, error }))
		);

		const results = await Promise.all(validations);
		const errors: Record<FieldPath, FieldError> = {};

		results.forEach(({ path, error }) => {
			if (error) errors[path] = error;
		});

		return errors;
	}

	async validateForm(): Promise<Record<FieldPath, FieldError>> {
		const validations = Array.from(this.fieldConfigs.keys()).map((path) =>
			this.validateField(path).then((error) => ({ path, error }))
		);

		const results = await Promise.all(validations);
		const errors: Record<FieldPath, FieldError> = {};

		results.forEach(({ path, error }) => {
			if (error) errors[path] = error;
		});

		this.observers.forEach((observer) => {
			observer.onFormValidation?.(errors);
		});

		return errors;
	}

	private validateDependentFields(changedPath: FieldPath): void {
		this.fieldConfigs.forEach((config, path) => {
			if (config.dependencies?.includes(changedPath)) {
				this.validateField(path);

				// ⚠️ 修复 Bug 4: 触发依赖字段的 onFieldChange 事件
				// 即使值没变，验证状态可能已经改变，需要通知 UI 更新
				const value = this.getValue(path);
				this.observers.forEach((observer) => {
					observer.onFieldChange?.(path, value);
				});
			}
		});
	}

	// ========== 表单状态查询 ==========
	isDirty(): boolean {
		return Array.from(this.fieldStates.values()).some((state) => state.dirty);
	}

	isValid(): boolean {
		return !Array.from(this.fieldStates.values()).some((state) => state.error);
	}

	isValidating(): boolean {
		return Array.from(this.fieldStates.values()).some((state) => state.validating);
	}

	getTouchedFields(): FieldPath[] {
		return Array.from(this.fieldStates.entries())
			.filter(([, state]) => state.touched)
			.map(([path]) => path);
	}

	getDirtyFields(): FieldPath[] {
		return Array.from(this.fieldStates.entries())
			.filter(([, state]) => state.dirty)
			.map(([path]) => path);
	}

	getErrors(): Record<FieldPath, FieldError> {
		const errors: Record<FieldPath, FieldError> = {};
		this.fieldStates.forEach((state, path) => {
			if (state.error) errors[path] = state.error;
		});
		return errors;
	}

	// 获取变更的值（相对于初始值）
	getDirtyValues(): Partial<Record<string, FieldValue>> {
		const dirtyFields = this.getDirtyFields();
		const dirtyValues: Record<string, FieldValue> = {};

		dirtyFields.forEach((path) => {
			const value = this.getValue(path);
			PathUtils.set(dirtyValues, path, value);
		});

		return dirtyValues;
	}

	// ========== 提交 ==========
	async submit(
		onSubmit: (values: Record<string, FieldValue>) => void | Promise<void>
	): Promise<boolean> {
		// 标记所有字段为已触摸
		this.fieldStates.forEach((state, path) => {
			this.fieldStates.set(path, { ...state, touched: true });
		});

		// 验证整个表单
		const errors = await this.validateForm();

		if (Object.keys(errors).length > 0) {
			return false;
		}

		try {
			await onSubmit(this.values);

			this.observers.forEach((observer) => {
				observer.onSubmit?.(this.values);
			});

			return true;
		} catch (error) {
			return false;
		}
	}

	// ========== 观察者模式 ==========
	subscribe(observer: IFormObserver): () => void {
		this.observers.add(observer);
		return () => this.observers.delete(observer);
	}

	// ========== 持久化 ==========
	serialize(): string {
		return JSON.stringify({
			values: this.values,
			initialValues: this.initialValues,
			fieldStates: Array.from(this.fieldStates.entries())
		});
	}

	static deserialize(json: string, config: IFormConfig): FormStateManager {
		const data = JSON.parse(json);
		const manager = new FormStateManager(config);

		manager.values = data.values;
		manager.initialValues = data.initialValues;
		manager.fieldStates = new Map(data.fieldStates);

		return manager;
	}
}
