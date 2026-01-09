/**
 * Svelte 5 Runes API 适配器
 * 使用 $state 和 $derived 提供响应式表单状态
 */

import { FormStateManager } from '../../core/FormStateManager';
import type { IFormConfig, FieldPath, FieldValue, FieldError } from '../../core/interfaces';
import { PathUtils } from '../../utils/PathUtils';
import { debug } from '../../utils/debug';
import { safeStringify } from '../../utils/serialize';

let instanceCounter = 0;

/**
 * 细粒度状态更新配置
 */
interface UseFormStateOptions {
	/**
	 * 启用细粒度状态更新（实验性）
	 * 当启用时，只有变化的字段会触发重新渲染
	 * @default false
	 */
	fineGrainedUpdates?: boolean;
}

export function useFormState(config: IFormConfig = {}, options: UseFormStateOptions = {}) {
	const instanceId = ++instanceCounter;
	const { fineGrainedUpdates = false } = options;

	debug.log(
		`[useFormState #${instanceId}] Called with ${Object.keys(config.fields || {}).length} fields, fineGrainedUpdates: ${fineGrainedUpdates}`
	);

	const manager = new FormStateManager(config);

	// 直接使用 $state 维护响应式状态副本
	const initialValues = manager.getValues() as Record<string, FieldValue>;
	debug.log(`[useFormState #${instanceId}] Initial values:`, safeStringify(initialValues, 2));

	// 创建一个响应式容器对象，而不是直接暴露值
	const state = $state({
		values: initialValues,
		errors: manager.getErrors(),
		isDirty: manager.isDirty(),
		isValid: manager.isValid(),
		isValidating: manager.isValidating(),
		fieldStatesVersion: 0
	});

	// P1: 细粒度字段状态追踪
	// 每个字段有独立的版本号，只有特定字段变化时才触发相关组件更新
	const fieldVersions = $state<Record<FieldPath, number>>({});

	/**
	 * 获取字段版本号（用于建立细粒度依赖）
	 */
	function getFieldVersion(path: FieldPath): number {
		return fieldVersions[path] ?? 0;
	}

	/**
	 * 增加字段版本号（触发细粒度更新）
	 */
	function incrementFieldVersion(path: FieldPath): void {
		fieldVersions[path] = (fieldVersions[path] ?? 0) + 1;
	}

	debug.log(
		`[useFormState #${instanceId}] state.values after creation:`,
		safeStringify(state.values, 2)
	);

	// 订阅管理器变化，直接更新 $state
	// ⚠️ CRITICAL: 保存 unsubscribe 函数以防止内存泄漏
	const unsubscribe = manager.subscribe({
		onFieldChange: (path) => {
			// 更新 state 对象的属性
			const newValues = manager.getValues() as Record<string, FieldValue>;
			debug.log(`[useFormState #${instanceId}] Field changed:`, path);
			debug.log(`[useFormState #${instanceId}] New values (JSON):`, safeStringify(newValues, 2));

			if (fineGrainedUpdates) {
				// P1: 细粒度更新 - 只更新变化的字段值
				const newValue = PathUtils.get(newValues, path);
				PathUtils.setMutable(state.values, path, newValue);
				incrementFieldVersion(path);
			} else {
				// 传统模式 - 替换整个 values 对象
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

	// 返回响应式 API - 直接暴露 state 对象的属性
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

		// 字段级响应式状态
		getFieldState: (path: FieldPath) => {
			// 访问响应式状态以建立依赖
			if (fineGrainedUpdates) {
				// P1: 细粒度模式 - 只依赖特定字段的版本
				// eslint-disable-next-line @typescript-eslint/no-unused-expressions
				getFieldVersion(path);
			} else {
				// 传统模式 - 依赖全局版本
				// eslint-disable-next-line @typescript-eslint/no-unused-expressions
				state.fieldStatesVersion;
			}
			const fieldState = manager.getFieldState(path);
			// 确保 value 来自响应式的 values
			return {
				...fieldState,
				value: PathUtils.get(state.values, path)
			};
		},

		getValue: (path: FieldPath) => {
			// 从响应式 values 对象中获取
			if (fineGrainedUpdates) {
				// P1: 建立细粒度依赖
				// eslint-disable-next-line @typescript-eslint/no-unused-expressions
				getFieldVersion(path);
			}
			return PathUtils.get(state.values, path);
		},

		/**
		 * P1: 获取字段错误（细粒度）
		 * 只在特定字段的错误变化时触发重新渲染
		 */
		getFieldError: (path: FieldPath): FieldError => {
			if (fineGrainedUpdates) {
				// eslint-disable-next-line @typescript-eslint/no-unused-expressions
				getFieldVersion(path);
			}
			return state.errors[path] ?? null;
		},

		/**
		 * P1: 获取字段版本（用于自定义细粒度依赖）
		 */
		getFieldVersion,

		// 字段查询 API（P0: 暴露正式 API，避免私有属性访问）
		hasField: manager.hasField.bind(manager),
		getFieldConfig: manager.getFieldConfig.bind(manager),
		getRegisteredFields: manager.getRegisteredFields.bind(manager),

		// 操作方法
		registerField: manager.registerField.bind(manager),
		unregisterField: manager.unregisterField.bind(manager),
		setValue: manager.setValue.bind(manager),
		setValues: manager.setValues.bind(manager),
		setFieldTouched: manager.setFieldTouched.bind(manager),
		setFieldError: manager.setFieldError.bind(manager),
		validateField: manager.validateField.bind(manager),
		validateFields: manager.validateFields.bind(manager),
		validateForm: manager.validateForm.bind(manager),
		submit: manager.submit.bind(manager),
		reset: manager.reset.bind(manager),
		setInitialValues: manager.setInitialValues.bind(manager),
		getDirtyFields: manager.getDirtyFields.bind(manager),
		getDirtyValues: manager.getDirtyValues.bind(manager),

		// 数组字段操作（供 FieldArray 组件使用）
		remapArrayFields: manager.remapArrayFields.bind(manager),

		// Watch API（P2: 监听特定字段变化）
		watch: manager.watch.bind(manager),

		// 性能优化
		batchUpdate: manager.batchUpdate.bind(manager),

		// 资源清理（防止内存泄漏）
		destroy: () => {
			debug.log(`[useFormState #${instanceId}] Destroying form state`);
			unsubscribe();
		},

		// 原始 manager 暴露（高级用法）
		_manager: manager
	};
}

export type FormState = ReturnType<typeof useFormState>;
