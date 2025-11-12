/**
 * 验证器系统 - 基于接口实现
 * 提供内置验证器和自定义验证器创建工厂
 */

import type { IValidator, IValidatorFactory, FieldError, FieldValue } from './interfaces';

/**
 * 创建自定义验证器
 */
export function createValidator<T = FieldValue>(
	validate: (value: T, allValues: Record<string, FieldValue>) => FieldError | Promise<FieldError>
): IValidator<T> {
	return { validate };
}

/**
 * 验证器工厂类 - 实现 IValidatorFactory 接口
 */
class ValidatorFactory implements IValidatorFactory {
	required(message = 'This field is required'): IValidator {
		return createValidator((value: FieldValue) => {
			if (value == null || value === '' || (Array.isArray(value) && value.length === 0)) {
				return message;
			}
			return null;
		});
	}

	email(message = 'Invalid email address'): IValidator<string> {
		return createValidator((value: string) => {
			if (!value) return null;
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			return emailRegex.test(value) ? null : message;
		});
	}

	minLength(min: number, message?: string): IValidator<string> {
		return createValidator((value: string) => {
			if (!value) return null;
			return value.length >= min ? null : message || `Minimum length is ${min}`;
		});
	}

	maxLength(max: number, message?: string): IValidator<string> {
		return createValidator((value: string) => {
			if (!value) return null;
			return value.length <= max ? null : message || `Maximum length is ${max}`;
		});
	}

	min(min: number, message?: string): IValidator<number> {
		return createValidator((value: number) => {
			if (value == null) return null;
			return value >= min ? null : message || `Minimum value is ${min}`;
		});
	}

	max(max: number, message?: string): IValidator<number> {
		return createValidator((value: number) => {
			if (value == null) return null;
			return value <= max ? null : message || `Maximum value is ${max}`;
		});
	}

	pattern(regex: RegExp, message = 'Invalid format'): IValidator<string> {
		return createValidator((value: string) => {
			if (!value) return null;
			return regex.test(value) ? null : message;
		});
	}

	compose(...validators: IValidator[]): IValidator {
		return createValidator(async (value: FieldValue, allValues: Record<string, FieldValue>) => {
			for (const validator of validators) {
				const error = await Promise.resolve(validator.validate(value, allValues));
				if (error) return error;
			}
			return null;
		});
	}
}

/**
 * 导出验证器单例
 */
export const Validators = new ValidatorFactory();

/**
 * 辅助函数：创建带业务逻辑的自定义验证器
 */
export function createCustomValidator<T = FieldValue>(
	validator: (value: T, allValues: Record<string, FieldValue>) => boolean | Promise<boolean>,
	message: string
): IValidator<T> {
	return createValidator(async (value: T, allValues: Record<string, FieldValue>) => {
		const isValid = await Promise.resolve(validator(value, allValues));
		return isValid ? null : message;
	});
}
