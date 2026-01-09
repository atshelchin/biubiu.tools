/**
 * 表单状态管理器 - 实现 IFormStateManager 接口
 * 核心业务逻辑：字段管理、验证、状态追踪
 */

import { produce, setAutoFreeze } from 'immer';
import { PathUtils } from '../utils/PathUtils';
import { debug } from '../utils/debug';
import { safeStringify, safeParse } from '../utils/serialize';
import { FormWarnings, checkPerformance } from '../utils/warnings';
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

	// ⚡ Feature 1: 批量更新支持
	private isBatching = false;
	private batchedChanges = new Set<FieldPath>();

	// P0: 提交状态
	private _isSubmitting = false;

	// P2: Watch API - 字段监听器
	private fieldWatchers: Map<FieldPath, Set<(value: FieldValue, prevValue: FieldValue) => void>> =
		new Map();
	private previousValues: Map<FieldPath, FieldValue> = new Map();

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
			const fieldCount = Object.keys(config.fields).length;
			debug.log('[FormStateManager.constructor] Registering', fieldCount, 'fields');

			// P2: 性能检查 - 大型表单警告
			checkPerformance(fieldCount);

			Object.entries(config.fields).forEach(([path, fieldConfig]) => {
				this.registerField(path, fieldConfig);
			});
		} else {
			debug.log('[FormStateManager.constructor] NO FIELDS TO REGISTER!');
		}
		debug.log('[FormStateManager.constructor] Final this.values:', safeStringify(this.values, 2));
	}

	// ========== 字段注册 ==========
	registerField(path: FieldPath, config: IFieldConfig = {}): void {
		debug.log(`[registerField] START: ${path}`);

		// 如果字段已注册，合并配置而不是覆盖
		const existingConfig = this.fieldConfigs.get(path);

		if (existingConfig) {
			// 已存在配置，只更新非空字段
			debug.log(`[registerField] Field already exists: ${path}, merging config`);
			this.fieldConfigs.set(path, {
				...existingConfig,
				...Object.fromEntries(Object.entries(config).filter(([, v]) => v !== undefined))
			});
		} else {
			// 新字段，直接设置
			debug.log(`[registerField] New field: ${path}`);
			this.fieldConfigs.set(path, config);
		}

		// 初始化字段状态
		if (!this.fieldStates.has(path)) {
			const defaultValue = config.defaultValue ?? PathUtils.get(this.initialValues, path);
			debug.log(`[registerField] Initializing field state with defaultValue:`, defaultValue);

			this.fieldStates.set(path, {
				value: defaultValue,
				error: null,
				touched: false,
				dirty: false,
				validating: false
			});

			// 设置初始值（使用 Immer 保证不可变性）
			if (defaultValue !== undefined) {
				// ⚠️ Bug 14 修复：动态字段注册时使用 produce 保证不可变性
				// 直接修改 this.values 而不通过 setValue，避免触发观察者和验证链
				debug.log(`[registerField] Setting this.values for ${path}`);
				this.values = produce(this.values, (draft) => {
					PathUtils.setMutable(draft, path, defaultValue);
				}) as Record<string, FieldValue>;

				this.initialValues = produce(this.initialValues, (draft) => {
					PathUtils.setMutable(draft, path, defaultValue);
				}) as Record<string, FieldValue>;
				debug.log(`[registerField] this.values updated`);
			}

			// ⚠️ Bug 14 修复：不在注册时通知观察者，避免触发 fieldStatesVersion++
			// 导致所有 FormField 的 $derived 重新计算，进而可能触发依赖验证的无限循环
			// FormField 的 $derived(formState.values) 会自动检测到新字段，无需主动通知
		} else {
			debug.log(`[registerField] Field state already exists: ${path}`);
		}

		// 如果配置了立即验证
		if (this.config.validateOnMount && config.validator) {
			debug.log(`[registerField] Validating on mount: ${path}`);
			this.validateField(path);
		}

		debug.log(`[registerField] END: ${path}`);
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

		// 清理 Watch 监听器
		this.fieldWatchers.delete(path);
		this.previousValues.delete(path);

		// 清理配置和状态
		this.fieldConfigs.delete(path);
		this.fieldStates.delete(path);
		this.values = PathUtils.delete(this.values, path) as Record<string, FieldValue>;
	}

	// ========== 字段查询 API (P0: 暴露正式 API) ==========

	/**
	 * 检查字段是否已注册
	 */
	hasField(path: FieldPath): boolean {
		return this.fieldConfigs.has(path);
	}

	/**
	 * 获取字段配置（只读）
	 */
	getFieldConfig(path: FieldPath): IFieldConfig | undefined {
		const config = this.fieldConfigs.get(path);
		// 返回副本以防止外部修改
		return config ? { ...config } : undefined;
	}

	/**
	 * 获取所有已注册的字段路径
	 */
	getRegisteredFields(): FieldPath[] {
		return Array.from(this.fieldConfigs.keys());
	}

	/**
	 * 重新映射数组字段的路径（供 FieldArray 组件使用）
	 * 防止删除/移动后路径错位
	 */
	remapArrayFields(
		arrayPath: FieldPath,
		operation: 'remove' | 'insert' | 'move',
		fromIndex: number,
		toIndex?: number
	): void {
		// 转义正则特殊字符
		const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

		// 找出所有受影响的字段路径
		const allPaths = Array.from(this.fieldStates.keys());
		const regex = new RegExp(`^${escapeRegex(arrayPath)}\\[(\\d+)\\]`);

		const affectedPaths = allPaths.filter((path) => {
			const match = path.match(regex);
			if (!match) return false;
			const pathIndex = parseInt(match[1]);
			return pathIndex >= fromIndex;
		});

		// 计算新索引并收集所有需要重新映射的路径
		const remapped: Array<{ oldPath: string; newPath: string; oldIndex: number; newIndex: number }> =
			[];

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

			if (newIndex !== oldIndex) {
				const newPath = oldPath.replace(/\[\d+\]/, `[${newIndex}]`);
				remapped.push({ oldPath, newPath, oldIndex, newIndex });
			}
		}

		// 根据操作类型决定处理顺序
		// - remove: 索引减小，从低到高处理（先移动items[1]到items[0]，再移动items[2]到items[1]）
		// - insert: 索引增大，从高到低处理（先移动items[2]到items[3]，再移动items[1]到items[2]）
		// - move: 需要先提取被移动的项，再处理其他
		if (operation === 'remove') {
			remapped.sort((a, b) => a.oldIndex - b.oldIndex);
		} else if (operation === 'insert') {
			remapped.sort((a, b) => b.oldIndex - a.oldIndex);
		}

		// 对于 move 操作，需要特殊处理避免覆盖
		// 先提取所有状态到临时存储，然后一次性写入
		const tempStates = new Map<string, IFieldState>();
		const tempConfigs = new Map<string, IFieldConfig>();

		for (const { oldPath, newPath } of remapped) {
			const state = this.fieldStates.get(oldPath);
			if (state) {
				tempStates.set(newPath, state);
				this.fieldStates.delete(oldPath);
			}
			const config = this.fieldConfigs.get(oldPath);
			if (config) {
				tempConfigs.set(newPath, config);
				this.fieldConfigs.delete(oldPath);
			}
		}

		// 写入新位置
		for (const [path, state] of tempStates) {
			this.fieldStates.set(path, state);
		}
		for (const [path, config] of tempConfigs) {
			this.fieldConfigs.set(path, config);
		}

		// 清理超出范围的索引
		const arrayValue = this.getValue(arrayPath);
		const arrayLength = Array.isArray(arrayValue) ? arrayValue.length : 0;

		const allPathsAfterRemap = Array.from(this.fieldStates.keys());
		for (const path of allPathsAfterRemap) {
			const match = path.match(regex);
			if (match) {
				const pathIndex = parseInt(match[1]);
				if (pathIndex >= arrayLength) {
					this.fieldStates.delete(path);
					this.fieldConfigs.delete(path);
				}
			}
		}
	}

	// ========== 值管理 ==========
	setValue(path: FieldPath, value: FieldValue, shouldValidate = true): void {
		const config = this.fieldConfigs.get(path);

		// 应用转换（支持函数和 ITransformer 对象）
		let transformedValue = value;
		if (config?.transformer) {
			if (typeof config.transformer === 'function') {
				// 直接是函数
				transformedValue = (config.transformer as (value: FieldValue) => FieldValue)(value);
			} else if (typeof config.transformer.transform === 'function') {
				// ITransformer 对象
				transformedValue = config.transformer.transform(value);
			}
		}

		// ⚡ 优化 Perf 1: 简单路径（无嵌套）直接赋值，跳过 Immer 以提升性能
		let newValues: Record<string, FieldValue>;

		if (!path.includes('.') && !path.includes('[')) {
			// 简单路径：直接浅拷贝（10x faster）
			debug.log('[setValue] FAST path (no Immer):', path);
			newValues = { ...this.values, [path]: transformedValue };
		} else {
			// 复杂路径：使用 Immer 确保不可变性和深层嵌套的正确更新
			debug.log('[setValue] BEFORE produce, path:', path);
			debug.log('[setValue] this.values:', safeStringify(this.values, 2));
			newValues = produce(this.values, (draft) => {
				debug.log('[setValue] IN produce draft keys:', Object.keys(draft));
				PathUtils.setMutable(draft, path, transformedValue);
				debug.log('[setValue] AFTER setMutable, draft keys:', Object.keys(draft));
			}) as Record<string, FieldValue>;
			debug.log('[setValue] AFTER produce, newValues keys:', Object.keys(newValues));
		}

		this.values = newValues;

		// 更新字段状态
		const fieldState = this.getFieldState(path);
		const initialValue = PathUtils.get(this.initialValues, path);

		this.fieldStates.set(path, {
			...fieldState,
			value: transformedValue,
			dirty: transformedValue !== initialValue
		});

		// ⚡ Feature 1: 批量更新模式 - 延迟通知和验证
		if (this.isBatching) {
			this.batchedChanges.add(path);
			return; // 延迟到 batchUpdate 结束时处理
		}

		// P2: 触发 Watch 回调
		this.notifyWatchers(path, transformedValue);

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
	 * 批量更新多个字段（Feature 1）
	 * 避免每次 setValue 都触发验证和观察者，显著提升性能
	 *
	 * @example
	 * ```typescript
	 * form.batchUpdate(() => {
	 *   form.setValue('firstName', 'John', false);
	 *   form.setValue('lastName', 'Doe', false);
	 *   form.setValue('email', 'john@example.com', false);
	 * }); // 只触发一次验证和 UI 更新
	 * ```
	 */
	batchUpdate(fn: () => void): void {
		this.isBatching = true;
		this.batchedChanges.clear();

		try {
			fn();
		} finally {
			this.isBatching = false;

			// 批量触发验证
			this.batchedChanges.forEach((path) => {
				if (this.config.validateOnChange) {
					this.validateField(path);
				}
				// 验证依赖字段
				this.validateDependentFields(path);
			});

			// ✅ Bug 11 修复：通知全局变更，让 UI 一次性刷新所有字段
			if (this.batchedChanges.size > 0) {
				this.observers.forEach((observer) => {
					// 使用空字符串表示批量变更（多个字段）
					observer.onFieldChange?.('', this.values);
				});
			}
		}
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
		// 记录哪些字段的值改变了（用于触发依赖验证）
		const changedPaths: FieldPath[] = [];

		// 使用 Immer 确保深层不可变性，与 setValue 保持一致
		this.values = produce({}, (draft) => {
			Object.assign(draft, values);
		}) as Record<string, FieldValue>;

		// 更新所有字段状态
		this.fieldStates.forEach((state, path) => {
			const value = PathUtils.get(values, path);
			const initialValue = PathUtils.get(this.initialValues, path);

			// 检查值是否改变
			if (value !== state.value) {
				changedPaths.push(path);
			}

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

			// ✅ Bug 8 修复：触发依赖字段验证
			changedPaths.forEach((path) => {
				this.validateDependentFields(path);
			});
		}
	}

	// 重置到初始值
	reset(newInitialValues?: Record<string, FieldValue>): void {
		if (newInitialValues) {
			// 使用 JSON 序列化进行深拷贝，避免 Immer draft 对象的循环引用问题
			this.initialValues = safeParse(safeStringify(newInitialValues)) || newInitialValues;
		}

		// 深拷贝初始值以确保不可变性
		this.values = safeParse(safeStringify(this.initialValues)) || this.initialValues;

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
		this.initialValues = safeParse(safeStringify(values)) || values;

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
			// ⚠️ 修复 Bug 5: 快照 values，防止异步验证期间 values 被修改导致不一致
			// 使用 JSON 序列化来克隆，避免 Immer draft 对象的循环引用问题
			const valuesSnapshot = (safeParse(safeStringify(this.values)) || this.values) as Record<
				string,
				unknown
			>;
			const error = await Promise.resolve(config.validator.validate(value, valuesSnapshot));

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
				// ⚠️ 保留错误详情，不要丢失原始错误信息
				const errorMessage =
					err instanceof Error ? err.message : typeof err === 'string' ? err : 'Validation error';
				debug.error('[validateField] Validation threw error:', errorMessage);
				// P2: 开发警告
				FormWarnings.validatorThrewError(path, err);
				this.fieldStates.set(path, {
					...this.getFieldState(path),
					error: errorMessage,
					validating: false
				});
				return errorMessage;
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

	private validateDependentFields(
		changedPath: FieldPath,
		visitedPaths: Set<FieldPath> = new Set()
	): void {
		// ⚠️ 修复 Bug 6: 防止循环依赖导致无限递归
		if (visitedPaths.has(changedPath)) return;
		visitedPaths.add(changedPath);

		this.fieldConfigs.forEach((config, path) => {
			if (config.dependencies?.includes(changedPath)) {
				this.validateField(path);

				// ⚠️ 修复 Bug 13: 移除 onFieldChange 调用，避免 Svelte 5 无限更新
				// 验证完成后，onFieldValidation 会自动触发，无需额外的 onFieldChange
				// 之前的 Bug 4 修复引入了新问题：在 Svelte 5 中触发无限 effect 更新

				// 递归验证依赖链（带循环检测）
				this.validateDependentFields(path, visitedPaths);
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

	/**
	 * P0: 检查表单是否正在提交
	 */
	isSubmitting(): boolean {
		return this._isSubmitting;
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
		let dirtyValues: Record<string, FieldValue> = {};

		dirtyFields.forEach((path) => {
			const value = this.getValue(path);
			// ✅ Bug 10 修复：使用 PathUtils.set 的返回值（不可变操作）
			dirtyValues = PathUtils.set(dirtyValues, path, value) as Record<string, FieldValue>;
		});

		return dirtyValues;
	}

	// ========== 提交 ==========
	async submit(
		onSubmit: (values: Record<string, FieldValue>) => void | Promise<void>
	): Promise<boolean> {
		// P0: 防止重复提交 - 必须在任何异步操作之前检查并设置
		if (this._isSubmitting) {
			debug.warn('[submit] Form is already submitting, ignoring duplicate submit');
			// P2: 开发警告
			FormWarnings.duplicateSubmission();
			return false;
		}
		this._isSubmitting = true;

		try {
			// 标记所有字段为已触摸
			this.fieldStates.forEach((state, path) => {
				this.fieldStates.set(path, { ...state, touched: true });
			});

			// 验证整个表单
			const errors = await this.validateForm();

			if (Object.keys(errors).length > 0) {
				return false;
			}

			await onSubmit(this.values);

			this.observers.forEach((observer) => {
				observer.onSubmit?.(this.values);
			});

			return true;
		} catch {
			return false;
		} finally {
			// P0: 重置提交状态
			this._isSubmitting = false;
		}
	}

	// ========== 观察者模式 ==========
	subscribe(observer: IFormObserver): () => void {
		this.observers.add(observer);
		return () => this.observers.delete(observer);
	}

	// ========== 持久化 ==========
	/**
	 * 序列化表单状态（支持 BigInt、Date、Map、Set 等特殊类型）
	 */
	serialize(): string {
		return safeStringify({
			values: this.values,
			initialValues: this.initialValues,
			fieldStates: Array.from(this.fieldStates.entries())
		});
	}

	/**
	 * 反序列化表单状态
	 */
	static deserialize(json: string, config: IFormConfig): FormStateManager {
		const data = safeParse<{
			values: Record<string, FieldValue>;
			initialValues: Record<string, FieldValue>;
			fieldStates: [FieldPath, IFieldState][];
		}>(json);
		const manager = new FormStateManager(config);

		manager.values = data.values;
		manager.initialValues = data.initialValues;
		manager.fieldStates = new Map(data.fieldStates);

		return manager;
	}

	// ========== Watch API (P2) ==========

	/**
	 * 监听单个或多个字段的变化
	 *
	 * @example
	 * ```typescript
	 * // 监听单个字段
	 * const unwatch = form.watch('email', (value, prevValue) => {
	 *   console.log(`Email changed from ${prevValue} to ${value}`);
	 * });
	 *
	 * // 监听多个字段
	 * const unwatch = form.watch(['firstName', 'lastName'], (values) => {
	 *   console.log(`Name: ${values.firstName} ${values.lastName}`);
	 * });
	 * ```
	 */
	watch(
		pathOrPaths: FieldPath | FieldPath[],
		callback:
			| ((value: FieldValue, prevValue: FieldValue) => void)
			| ((values: Record<FieldPath, FieldValue>) => void)
	): () => void {
		if (Array.isArray(pathOrPaths)) {
			// 监听多个字段
			const paths = pathOrPaths;
			const multiCallback = callback as (values: Record<FieldPath, FieldValue>) => void;

			const singleFieldCallback = () => {
				const values: Record<FieldPath, FieldValue> = {};
				paths.forEach((p) => {
					values[p] = this.getValue(p);
				});
				multiCallback(values);
			};

			// 为每个字段注册监听器
			const unsubscribers: (() => void)[] = [];
			paths.forEach((path) => {
				let watchers = this.fieldWatchers.get(path);
				if (!watchers) {
					watchers = new Set();
					this.fieldWatchers.set(path, watchers);
				}
				// 包装为单字段回调格式
				const wrappedCallback = () => singleFieldCallback();
				watchers.add(wrappedCallback as (value: FieldValue, prevValue: FieldValue) => void);

				unsubscribers.push(() => {
					watchers?.delete(wrappedCallback as (value: FieldValue, prevValue: FieldValue) => void);
				});
			});

			// 返回取消订阅函数
			return () => {
				unsubscribers.forEach((unsub) => unsub());
			};
		} else {
			// 监听单个字段
			const path = pathOrPaths;
			const singleCallback = callback as (value: FieldValue, prevValue: FieldValue) => void;

			let watchers = this.fieldWatchers.get(path);
			if (!watchers) {
				watchers = new Set();
				this.fieldWatchers.set(path, watchers);
			}

			// 初始化 previousValue
			if (!this.previousValues.has(path)) {
				this.previousValues.set(path, this.getValue(path));
			}

			watchers.add(singleCallback);

			// 返回取消订阅函数
			return () => {
				watchers?.delete(singleCallback);
			};
		}
	}

	/**
	 * 通知字段监听器（内部方法）
	 */
	private notifyWatchers(path: FieldPath, newValue: FieldValue): void {
		const watchers = this.fieldWatchers.get(path);
		if (!watchers || watchers.size === 0) return;

		const prevValue = this.previousValues.get(path);
		this.previousValues.set(path, newValue);

		watchers.forEach((callback) => {
			try {
				callback(newValue, prevValue);
			} catch (err) {
				debug.error('[watch] Watcher callback threw error:', err);
			}
		});
	}
}
