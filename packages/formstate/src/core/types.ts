/**
 * 类型定义 - 从接口派生的具体类型
 * 保持向后兼容，同时导出接口定义
 */

export type {
	FieldValue,
	FieldPath,
	FieldError,
	IFieldState as FieldState,
	IFieldConfig as FieldConfig,
	IFormConfig as FormConfig,
	IFormObserver as FormObserver,
	IValidator,
	ITransformer,
	IFormStateManager,
	IPathUtils
} from './interfaces';

export type FormValues = Record<string, unknown>;
