/**
 * useTypedFormState 功能测试
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTypedFormState } from './useTypedFormState.svelte';
import { Validators } from '../../core/Validators';

// 测试用的表单类型
interface TestForm {
	email: string;
	password: string;
	profile: {
		name: string;
		age: number;
	};
	tags: string[];
	addresses: Array<{
		street: string;
		city: string;
	}>;
}

describe('useTypedFormState', () => {
	describe('initialization', () => {
		it('should initialize with typed initial values', () => {
			const form = useTypedFormState<TestForm>({
				initialValues: {
					email: 'test@example.com',
					password: '',
					profile: { name: 'John', age: 30 },
					tags: ['svelte', 'typescript'],
					addresses: [{ street: '123 Main St', city: 'NYC' }]
				}
			});

			expect(form.values.email).toBe('test@example.com');
			expect(form.values.profile.name).toBe('John');
			expect(form.values.tags).toEqual(['svelte', 'typescript']);
			expect(form.values.addresses[0].city).toBe('NYC');

			form.destroy();
		});
	});

	describe('getValue / setValue with type safety', () => {
		it('should get and set values with correct types', () => {
			const form = useTypedFormState<TestForm>({
				initialValues: {
					email: '',
					password: '',
					profile: { name: '', age: 0 },
					tags: [],
					addresses: []
				}
			});

			// 设置原始值
			form.setValue('email', 'new@example.com');
			expect(form.getValue('email')).toBe('new@example.com');

			// 设置嵌套对象的值
			form.setValue('profile.name', 'Jane');
			expect(form.getValue('profile.name')).toBe('Jane');

			form.setValue('profile.age', 25);
			expect(form.getValue('profile.age')).toBe(25);

			form.destroy();
		});

		it('should set array values', () => {
			const form = useTypedFormState<TestForm>({
				initialValues: {
					email: '',
					password: '',
					profile: { name: '', age: 0 },
					tags: [],
					addresses: []
				}
			});

			form.setValue('tags', ['new', 'tags']);
			expect(form.getValue('tags')).toEqual(['new', 'tags']);

			form.destroy();
		});
	});

	describe('array operations', () => {
		it('should push items to array', () => {
			const form = useTypedFormState<TestForm>({
				initialValues: {
					email: '',
					password: '',
					profile: { name: '', age: 0 },
					tags: ['initial'],
					addresses: []
				}
			});

			form.pushArrayItem('tags', 'new-tag');
			expect(form.getArrayValue('tags')).toEqual(['initial', 'new-tag']);

			form.destroy();
		});

		it('should remove items from array', () => {
			const form = useTypedFormState<TestForm>({
				initialValues: {
					email: '',
					password: '',
					profile: { name: '', age: 0 },
					tags: ['a', 'b', 'c'],
					addresses: []
				}
			});

			form.removeArrayItem('tags', 1);
			expect(form.getArrayValue('tags')).toEqual(['a', 'c']);

			form.destroy();
		});

		it('should insert items at specific index', () => {
			const form = useTypedFormState<TestForm>({
				initialValues: {
					email: '',
					password: '',
					profile: { name: '', age: 0 },
					tags: ['a', 'c'],
					addresses: []
				}
			});

			form.insertArrayItem('tags', 1, 'b');
			expect(form.getArrayValue('tags')).toEqual(['a', 'b', 'c']);

			form.destroy();
		});

		it('should move items within array', () => {
			const form = useTypedFormState<TestForm>({
				initialValues: {
					email: '',
					password: '',
					profile: { name: '', age: 0 },
					tags: ['a', 'b', 'c'],
					addresses: []
				}
			});

			form.moveArrayItem('tags', 0, 2);
			expect(form.getArrayValue('tags')).toEqual(['b', 'c', 'a']);

			form.destroy();
		});

		it('should work with object arrays', () => {
			const form = useTypedFormState<TestForm>({
				initialValues: {
					email: '',
					password: '',
					profile: { name: '', age: 0 },
					tags: [],
					addresses: [{ street: 'First', city: 'A' }]
				}
			});

			form.pushArrayItem('addresses', { street: 'Second', city: 'B' });
			expect(form.getArrayValue('addresses')).toEqual([
				{ street: 'First', city: 'A' },
				{ street: 'Second', city: 'B' }
			]);

			form.destroy();
		});
	});

	describe('validation', () => {
		it('should validate with field config', async () => {
			const form = useTypedFormState<TestForm>({
				initialValues: {
					email: '',
					password: '',
					profile: { name: '', age: 0 },
					tags: [],
					addresses: []
				},
				fields: {
					email: { validator: Validators.email('Invalid email') },
					password: { validator: Validators.minLength(8, 'Min 8 chars') }
				}
			});

			const emailError = await form.validateField('email');
			expect(emailError).toBeNull(); // 空字符串通过 email 验证（因为不是 required）

			form.setValue('email', 'invalid');
			const emailError2 = await form.validateField('email');
			expect(emailError2).toBe('Invalid email');

			form.setValue('password', 'short');
			const passwordError = await form.validateField('password');
			expect(passwordError).toBe('Min 8 chars');

			form.destroy();
		});
	});

	describe('watch API', () => {
		it('should watch single field changes', async () => {
			const form = useTypedFormState<TestForm>({
				initialValues: {
					email: 'initial',
					password: '',
					profile: { name: '', age: 0 },
					tags: [],
					addresses: []
				}
			});

			const callback = vi.fn();
			const unwatch = form.watch('email', callback);

			form.setValue('email', 'changed@example.com');

			// watch 是同步的
			expect(callback).toHaveBeenCalledWith('changed@example.com', 'initial');

			unwatch();
			form.destroy();
		});

		it('should watch multiple fields', () => {
			const form = useTypedFormState<TestForm>({
				initialValues: {
					email: '',
					password: '',
					profile: { name: '', age: 0 },
					tags: [],
					addresses: []
				}
			});

			const callback = vi.fn();
			const unwatch = form.watch(['email', 'password'], callback);

			form.setValue('email', 'test@example.com');

			expect(callback).toHaveBeenCalled();

			unwatch();
			form.destroy();
		});
	});

	describe('form state queries', () => {
		it('should track dirty state', () => {
			const form = useTypedFormState<TestForm>({
				initialValues: {
					email: 'initial@example.com',
					password: '',
					profile: { name: '', age: 0 },
					tags: [],
					addresses: []
				}
			});

			expect(form.isDirty).toBe(false);

			form.setValue('email', 'changed@example.com');
			expect(form.isDirty).toBe(true);

			form.destroy();
		});

		it('should get dirty fields and values', () => {
			const form = useTypedFormState<TestForm>({
				initialValues: {
					email: '',
					password: '',
					profile: { name: '', age: 0 },
					tags: [],
					addresses: []
				}
			});

			form.setValue('email', 'test@example.com');
			form.setValue('profile.name', 'John');

			const dirtyFields = form.getDirtyFields();
			expect(dirtyFields).toContain('email');
			expect(dirtyFields).toContain('profile.name');

			const dirtyValues = form.getDirtyValues();
			expect(dirtyValues).toHaveProperty('email', 'test@example.com');

			form.destroy();
		});
	});

	describe('reset and setValues', () => {
		it('should reset to initial values', () => {
			const form = useTypedFormState<TestForm>({
				initialValues: {
					email: 'initial@example.com',
					password: '',
					profile: { name: 'Initial', age: 0 },
					tags: [],
					addresses: []
				}
			});

			form.setValue('email', 'changed@example.com');
			form.setValue('profile.name', 'Changed');

			form.reset();

			expect(form.getValue('email')).toBe('initial@example.com');
			expect(form.getValue('profile.name')).toBe('Initial');

			form.destroy();
		});

		it('should set multiple values at once', () => {
			const form = useTypedFormState<TestForm>({
				initialValues: {
					email: '',
					password: '',
					profile: { name: '', age: 0 },
					tags: [],
					addresses: []
				}
			});

			form.setValues({
				email: 'batch@example.com',
				profile: { name: 'Batch' }
			});

			expect(form.getValue('email')).toBe('batch@example.com');
			expect(form.getValue('profile.name')).toBe('Batch');

			form.destroy();
		});
	});

	describe('field registration', () => {
		it('should track registered fields', () => {
			const form = useTypedFormState<TestForm>({
				initialValues: {
					email: '',
					password: '',
					profile: { name: '', age: 0 },
					tags: [],
					addresses: []
				}
			});

			// 初始应该有配置的字段
			expect(form.hasField('email')).toBe(true);

			// 动态注册新字段
			form.registerField('profile.name', {
				validator: Validators.required()
			});

			expect(form.hasField('profile.name')).toBe(true);

			const config = form.getFieldConfig('profile.name');
			expect(config?.validator).toBeDefined();

			form.destroy();
		});
	});

	describe('submit', () => {
		it('should call onSubmit with typed values', async () => {
			const form = useTypedFormState<TestForm>({
				initialValues: {
					email: 'test@example.com',
					password: '12345678',
					profile: { name: 'John', age: 30 },
					tags: ['svelte'],
					addresses: []
				}
			});

			const onSubmit = vi.fn();
			await form.submit(onSubmit);

			expect(onSubmit).toHaveBeenCalledWith(
				expect.objectContaining({
					email: 'test@example.com',
					password: '12345678'
				})
			);

			form.destroy();
		});

		it('should prevent duplicate submissions', async () => {
			const form = useTypedFormState<TestForm>({
				initialValues: {
					email: '',
					password: '',
					profile: { name: '', age: 0 },
					tags: [],
					addresses: []
				}
			});

			let resolveSubmit: () => void;
			const submitPromise = new Promise<void>((resolve) => {
				resolveSubmit = resolve;
			});

			const onSubmit = vi.fn().mockImplementation(() => submitPromise);

			// 第一次提交
			const firstSubmit = form.submit(onSubmit);
			expect(form.isSubmitting).toBe(true);

			// 第二次提交应该被阻止
			const secondResult = await form.submit(onSubmit);
			expect(secondResult).toBe(false);

			// 完成第一次提交
			resolveSubmit!();
			await firstSubmit;

			expect(onSubmit).toHaveBeenCalledTimes(1);

			form.destroy();
		});
	});

	describe('fine-grained updates', () => {
		it('should track field versions when enabled', () => {
			const form = useTypedFormState<TestForm>(
				{
					initialValues: {
						email: '',
						password: '',
						profile: { name: '', age: 0 },
						tags: [],
						addresses: []
					}
				},
				{ fineGrainedUpdates: true }
			);

			const initialVersion = form.getFieldVersion('email');
			expect(initialVersion).toBe(0);

			form.setValue('email', 'test@example.com');

			const newVersion = form.getFieldVersion('email');
			expect(newVersion).toBe(1);

			// 其他字段版本不应该改变
			expect(form.getFieldVersion('password')).toBe(0);

			form.destroy();
		});
	});

	describe('edge cases for initialValues flattening', () => {
		it('should handle empty nested object', () => {
			interface FormWithEmptyObject {
				name: string;
				metadata: Record<string, unknown>;
			}

			const form = useTypedFormState<FormWithEmptyObject>({
				initialValues: {
					name: 'test',
					metadata: {}
				}
			});

			expect(form.getValue('name')).toBe('test');
			// Empty object is registered as a field
			expect(form.hasField('metadata')).toBe(true);

			form.destroy();
		});

		it('should handle null values', () => {
			interface FormWithNull {
				name: string;
				optional: string | null;
			}

			const form = useTypedFormState<FormWithNull>({
				initialValues: {
					name: 'test',
					optional: null
				}
			});

			expect(form.getValue('name')).toBe('test');
			// null values are registered as a field with null value
			// getValue returns undefined for unregistered fields, but the field is registered
			expect(form.hasField('optional')).toBe(true);

			form.destroy();
		});

		it('should handle undefined values', () => {
			interface FormWithUndefined {
				name: string;
				optional?: string;
			}

			const form = useTypedFormState<FormWithUndefined>({
				initialValues: {
					name: 'test',
					optional: undefined
				}
			});

			expect(form.getValue('name')).toBe('test');
			expect(form.getValue('optional')).toBeUndefined();

			form.destroy();
		});

		it('should handle deeply nested objects', () => {
			interface DeeplyNested {
				level1: {
					level2: {
						level3: {
							value: string;
						};
					};
				};
			}

			const form = useTypedFormState<DeeplyNested>({
				initialValues: {
					level1: {
						level2: {
							level3: {
								value: 'deep'
							}
						}
					}
				}
			});

			expect(form.getValue('level1.level2.level3.value')).toBe('deep');

			form.destroy();
		});
	});
});
