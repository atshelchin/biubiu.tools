import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { zodValidator, zodFormValidator, composeZodValidators } from './zod';

describe('Zod Adapter', () => {
	describe('zodValidator', () => {
		it('should validate with simple schema', async () => {
			const schema = z.string().email();
			const validator = zodValidator(schema);

			expect(await validator.validate('test@example.com', {})).toBeNull();
			expect(await validator.validate('invalid', {})).toBe('Invalid email address');
		});

		it('should return custom error message from schema', async () => {
			const schema = z.string().min(3, '至少3个字符');
			const validator = zodValidator(schema);

			expect(await validator.validate('ab', {})).toBe('至少3个字符');
		});

		it('should use custom message option', async () => {
			const schema = z.string().min(3);
			const validator = zodValidator(schema, { message: '自定义错误' });

			expect(await validator.validate('ab', {})).toBe('自定义错误');
		});

		it('should handle async validation', async () => {
			const schema = z.string().refine(
				async (val) => {
					// Simulate async validation
					await new Promise((r) => setTimeout(r, 10));
					return val.length >= 3;
				},
				{ message: '异步验证失败' }
			);
			const validator = zodValidator(schema, { async: true });

			expect(await validator.validate('ab', {})).toBe('异步验证失败');
			expect(await validator.validate('abc', {})).toBeNull();
		});

		it('should handle number validation', async () => {
			const schema = z.number().min(0).max(100);
			const validator = zodValidator(schema);

			expect(await validator.validate(50, {})).toBeNull();
			expect(await validator.validate(-1, {})).not.toBeNull();
			expect(await validator.validate(101, {})).not.toBeNull();
		});

		it('should handle optional fields', async () => {
			const schema = z.string().email().optional();
			const validator = zodValidator(schema);

			expect(await validator.validate(undefined, {})).toBeNull();
			expect(await validator.validate('', {})).not.toBeNull();
		});
	});

	describe('zodFormValidator', () => {
		const formSchema = z
			.object({
				email: z.string().email('邮箱格式不正确'),
				password: z.string().min(8, '密码至少8位'),
				confirmPassword: z.string()
			})
			.refine((data) => data.password === data.confirmPassword, {
				message: '密码不匹配',
				path: ['confirmPassword']
			});

		it('should validate entire form', async () => {
			const validator = zodFormValidator(formSchema);

			const validData = {
				email: 'test@example.com',
				password: '12345678',
				confirmPassword: '12345678'
			};
			expect(await validator.validateForm(validData)).toEqual({});

			const invalidData = {
				email: 'invalid',
				password: '123',
				confirmPassword: '456'
			};
			const errors = await validator.validateForm(invalidData);
			expect(errors.email).toBe('邮箱格式不正确');
			expect(errors.password).toBe('密码至少8位');
			expect(errors.confirmPassword).toBe('密码不匹配');
		});

		it('should validate single field', async () => {
			const validator = zodFormValidator(formSchema);

			const data = {
				email: 'invalid',
				password: '12345678',
				confirmPassword: '12345678'
			};

			expect(await validator.validateField('email', data)).toBe('邮箱格式不正确');
			expect(await validator.validateField('password', data)).toBeNull();
		});
	});

	describe('composeZodValidators', () => {
		it('should compose multiple validators', async () => {
			const validator = composeZodValidators(
				zodValidator(z.string().min(1, '不能为空')),
				zodValidator(z.string().email('邮箱格式不正确'))
			);

			expect(await validator.validate('', {})).toBe('不能为空');
			expect(await validator.validate('invalid', {})).toBe('邮箱格式不正确');
			expect(await validator.validate('test@example.com', {})).toBeNull();
		});

		it('should stop at first error', async () => {
			let secondValidatorCalled = false;
			const validator = composeZodValidators(zodValidator(z.string().min(3, '太短')), {
				validate: async () => {
					secondValidatorCalled = true;
					return '第二个错误';
				}
			});

			await validator.validate('ab', {});
			expect(secondValidatorCalled).toBe(false);
		});
	});
});
