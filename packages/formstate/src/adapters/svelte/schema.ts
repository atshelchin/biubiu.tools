/**
 * 表单 Schema 定义 - 配置驱动的表单渲染
 * 支持递归嵌套和动态字段
 */

import type { IFieldConfig, IValidator } from '../../core/interfaces';
import type { Component, ComponentProps } from 'svelte';

/**
 * 字段类型枚举
 */
export type FieldType =
	| 'text'
	| 'email'
	| 'password'
	| 'number'
	| 'textarea'
	| 'select'
	| 'checkbox'
	| 'radio'
	| 'date'
	| 'file'
	| 'custom'
	| 'group' // 嵌套对象
	| 'array'; // 动态数组

/**
 * 字段 Schema 配置
 */
export interface FieldSchema extends IFieldConfig {
	// 基础信息
	name: string; // 字段路径
	type: FieldType;
	label?: string;
	placeholder?: string;
	description?: string;

	// 验证
	required?: boolean;
	validator?: IValidator;

	// 选项类数据（select, radio, checkbox）
	options?: Array<{
		label: string;
		value: unknown;
		disabled?: boolean;
	}>;

	// 自定义组件
	component?: Component;
	componentProps?: Record<string, unknown>;

	// 嵌套字段（group 类型）
	fields?: FieldSchema[];

	// 数组字段配置（array 类型）
	itemSchema?: FieldSchema; // 数组项的 schema
	minItems?: number;
	maxItems?: number;

	// 条件渲染/显示
	condition?: (formValues: Record<string, unknown>) => boolean;
	// 依赖字段条件（更明确的语义）
	showWhen?: {
		field: string; // 依赖的字段路径
		is?: unknown; // 字段值等于此值时显示
		isNot?: unknown; // 字段值不等于此值时显示
		isValid?: boolean; // 依赖字段验证通过时显示
		isTouched?: boolean; // 依赖字段被触摸时显示
		matches?: (value: unknown) => boolean; // 自定义匹配函数
	};

	// UI 配置
	className?: string;
	disabled?: boolean;
	readOnly?: boolean;
	hidden?: boolean;

	// 布局
	col?: number; // 栅格列数 (1-12)
	order?: number; // 排序
}

/**
 * 表单 Schema
 */
export interface FormSchema {
	fields: FieldSchema[];
	layout?: 'vertical' | 'horizontal' | 'inline';
	columns?: number; // 栅格列数
}

/**
 * 字段组件注册表
 */
export interface FieldComponentRegistry {
	[key: string]: Component;
}

/**
 * Schema 验证规则构建器
 */
export interface SchemaValidationBuilder {
	text: () => IValidator;
	email: () => IValidator;
	number: (min?: number, max?: number) => IValidator;
	required: (message?: string) => IValidator;
	minLength: (min: number) => IValidator;
	maxLength: (max: number) => IValidator;
	pattern: (regex: RegExp, message?: string) => IValidator;
}
