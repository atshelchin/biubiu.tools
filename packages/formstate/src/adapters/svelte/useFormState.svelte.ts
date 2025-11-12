/**
 * Svelte 5 Runes API 适配器
 * 使用 $state 和 $derived 提供响应式表单状态
 */

import { FormStateManager } from '../../core/FormStateManager';
import type { IFormConfig, IFieldConfig, FieldPath, FieldValue } from '../../core/interfaces';
import { PathUtils } from '../../utils/PathUtils';
import { debug } from '../../utils/debug';
import { safeStringify } from '../../utils/serialize';

let instanceCounter = 0;

export function useFormState(config: IFormConfig = {}) {
	const instanceId = ++instanceCounter;
	debug.log(
		`[useFormState #${instanceId}] Called with ${Object.keys(config.fields || {}).length} fields`
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

	debug.log(
		`[useFormState #${instanceId}] state.values after creation:`,
		safeStringify(state.values, 2)
	);

	// 订阅管理器变化，直接更新 $state
	// ⚠️ CRITICAL: 保存 unsubscribe 函数以防止内存泄漏
	const unsubscribe = manager.subscribe({
		onFieldChange: (path, value) => {
			// 更新 state 对象的属性
			const newValues = manager.getValues() as Record<string, FieldValue>;
			debug.log(`[useFormState #${instanceId}] Field changed:`, path);
			debug.log(`[useFormState #${instanceId}] New values (JSON):`, safeStringify(newValues, 2));
			state.values = newValues;
			state.isDirty = manager.isDirty();
			state.isValid = manager.isValid();
			state.fieldStatesVersion++;
		},
		onFieldValidation: () => {
			state.errors = manager.getErrors();
			state.isValid = manager.isValid();
			state.isValidating = manager.isValidating();
			state.fieldStatesVersion++;
		},
		onFieldBlur: () => {
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

		// 字段级响应式状态
		getFieldState: (path: FieldPath) => {
			// 访问响应式状态以建立依赖
			state.fieldStatesVersion;
			const fieldState = manager.getFieldState(path);
			// 确保 value 来自响应式的 values
			return {
				...fieldState,
				value: PathUtils.get(state.values, path)
			};
		},

		getValue: (path: FieldPath) => {
			// 从响应式 values 对象中获取
			return PathUtils.get(state.values, path);
		},

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
