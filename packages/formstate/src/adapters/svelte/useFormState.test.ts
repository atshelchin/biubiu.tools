/**
 * useFormState 功能测试
 */

import { describe, it, expect, vi } from 'vitest';
import { useFormState } from './useFormState.svelte';
import { Validators } from '../../core/Validators';

describe('useFormState', () => {
	describe('initialization', () => {
		it('should initialize with empty config', () => {
			const form = useFormState();

			expect(form.values).toEqual({});
			expect(form.errors).toEqual({});
			expect(form.isDirty).toBe(false);
			expect(form.isValid).toBe(true);
			expect(form.isValidating).toBe(false);
			expect(form.isSubmitting).toBe(false);

			form.destroy();
		});

		it('should initialize with field config', () => {
			const form = useFormState({
				fields: {
					name: { defaultValue: 'John' },
					age: { defaultValue: 30 }
				}
			});

			expect(form.values).toEqual({ name: 'John', age: 30 });
			expect(form.isDirty).toBe(false);

			form.destroy();
		});

		it('should initialize with nested field config', () => {
			const form = useFormState({
				fields: {
					'user.name': { defaultValue: 'John' },
					'user.email': { defaultValue: 'john@example.com' }
				}
			});

			expect(form.getValue('user.name')).toBe('John');
			expect(form.getValue('user.email')).toBe('john@example.com');

			form.destroy();
		});
	});

	describe('getValue / setValue', () => {
		it('should get and set simple values', () => {
			const form = useFormState({
				fields: {
					name: { defaultValue: '' }
				}
			});

			form.setValue('name', 'Jane');
			expect(form.getValue('name')).toBe('Jane');

			form.destroy();
		});

		it('should get and set nested values', () => {
			const form = useFormState({
				fields: {
					'user.profile.bio': { defaultValue: '' }
				}
			});

			form.setValue('user.profile.bio', 'Hello world');
			expect(form.getValue('user.profile.bio')).toBe('Hello world');

			form.destroy();
		});

		it('should track dirty state', () => {
			const form = useFormState({
				fields: {
					name: { defaultValue: 'initial' }
				}
			});

			expect(form.isDirty).toBe(false);

			form.setValue('name', 'changed');
			expect(form.isDirty).toBe(true);

			form.setValue('name', 'initial');
			expect(form.isDirty).toBe(false);

			form.destroy();
		});
	});

	describe('getFieldState', () => {
		it('should return field state', () => {
			const form = useFormState({
				fields: {
					email: { defaultValue: 'test@example.com' }
				}
			});

			const state = form.getFieldState('email');
			expect(state.value).toBe('test@example.com');
			expect(state.error).toBeNull();
			expect(state.touched).toBe(false);
			expect(state.dirty).toBe(false);
			expect(state.validating).toBe(false);

			form.destroy();
		});

		it('should return default state for unregistered field', () => {
			const form = useFormState();

			const state = form.getFieldState('nonexistent');
			expect(state.value).toBeUndefined();
			expect(state.error).toBeNull();
			expect(state.touched).toBe(false);

			form.destroy();
		});
	});

	describe('getFieldError', () => {
		it('should return null for valid field', () => {
			const form = useFormState({
				fields: {
					email: { defaultValue: 'test@example.com' }
				}
			});

			expect(form.getFieldError('email')).toBeNull();

			form.destroy();
		});
	});

	describe('setFieldTouched', () => {
		it('should mark field as touched', () => {
			const form = useFormState({
				fields: {
					name: { defaultValue: '' }
				}
			});

			expect(form.getFieldState('name').touched).toBe(false);

			form.setFieldTouched('name');
			expect(form.getFieldState('name').touched).toBe(true);

			form.destroy();
		});

		it('should trigger validation on blur by default', async () => {
			const form = useFormState({
				fields: {
					email: {
						defaultValue: 'invalid',
						validator: Validators.email('Invalid email')
					}
				},
				validateOnBlur: true
			});

			form.setFieldTouched('email');

			// Wait for async validation
			await new Promise((r) => setTimeout(r, 10));

			expect(form.getFieldState('email').error).toBe('Invalid email');

			form.destroy();
		});
	});

	describe('setFieldError', () => {
		it('should set custom error', () => {
			const form = useFormState({
				fields: {
					name: { defaultValue: '' }
				}
			});

			form.setFieldError('name', 'Custom error');
			expect(form.getFieldState('name').error).toBe('Custom error');

			form.destroy();
		});

		it('should clear error with null', () => {
			const form = useFormState({
				fields: {
					name: { defaultValue: '' }
				}
			});

			form.setFieldError('name', 'Error');
			form.setFieldError('name', null);
			expect(form.getFieldState('name').error).toBeNull();

			form.destroy();
		});
	});

	describe('validation', () => {
		it('should validate field', async () => {
			const form = useFormState({
				fields: {
					email: {
						defaultValue: 'invalid',
						validator: Validators.email('Invalid email')
					}
				}
			});

			const error = await form.validateField('email');
			expect(error).toBe('Invalid email');

			form.destroy();
		});

		it('should validate multiple fields', async () => {
			const form = useFormState({
				fields: {
					email: {
						defaultValue: 'invalid',
						validator: Validators.email('Invalid email')
					},
					password: {
						defaultValue: 'short',
						validator: Validators.minLength(8, 'Too short')
					}
				}
			});

			const errors = await form.validateFields(['email', 'password']);
			expect(errors.email).toBe('Invalid email');
			expect(errors.password).toBe('Too short');

			form.destroy();
		});

		it('should validate entire form', async () => {
			const form = useFormState({
				fields: {
					name: {
						defaultValue: '',
						validator: Validators.required('Required')
					},
					email: {
						defaultValue: 'invalid',
						validator: Validators.email('Invalid email')
					}
				}
			});

			const errors = await form.validateForm();
			expect(errors.name).toBe('Required');
			expect(errors.email).toBe('Invalid email');
			expect(form.isValid).toBe(false);

			form.destroy();
		});
	});

	describe('field registration', () => {
		it('should register field dynamically', () => {
			const form = useFormState();

			form.registerField('newField', { defaultValue: 'test' });

			expect(form.hasField('newField')).toBe(true);
			// Note: getValue returns from reactive state which updates via observer callbacks
			// For dynamically registered fields, the manager has the value but reactive state
			// only updates after setValue triggers onFieldChange
			expect(form._manager.getValue('newField')).toBe('test');

			form.destroy();
		});

		it('should unregister field', () => {
			const form = useFormState({
				fields: {
					name: { defaultValue: 'John' }
				}
			});

			expect(form.hasField('name')).toBe(true);

			form.unregisterField('name');

			expect(form.hasField('name')).toBe(false);

			form.destroy();
		});

		it('should get field config', () => {
			const validator = Validators.required();
			const form = useFormState({
				fields: {
					name: { defaultValue: 'John', validator }
				}
			});

			const config = form.getFieldConfig('name');
			expect(config?.defaultValue).toBe('John');
			expect(config?.validator).toBeDefined();

			form.destroy();
		});

		it('should get registered fields', () => {
			const form = useFormState({
				fields: {
					name: { defaultValue: '' },
					email: { defaultValue: '' }
				}
			});

			const fields = form.getRegisteredFields();
			expect(fields).toContain('name');
			expect(fields).toContain('email');

			form.destroy();
		});
	});

	describe('dirty tracking', () => {
		it('should get dirty fields', () => {
			const form = useFormState({
				fields: {
					name: { defaultValue: 'John' },
					email: { defaultValue: 'john@example.com' }
				}
			});

			form.setValue('name', 'Jane');

			const dirtyFields = form.getDirtyFields();
			expect(dirtyFields).toContain('name');
			expect(dirtyFields).not.toContain('email');

			form.destroy();
		});

		it('should get dirty values', () => {
			const form = useFormState({
				fields: {
					name: { defaultValue: 'John' },
					email: { defaultValue: 'john@example.com' }
				}
			});

			form.setValue('name', 'Jane');

			const dirtyValues = form.getDirtyValues();
			expect(dirtyValues).toHaveProperty('name', 'Jane');
			expect(dirtyValues).not.toHaveProperty('email');

			form.destroy();
		});
	});

	describe('reset', () => {
		it('should reset to initial values', () => {
			const form = useFormState({
				fields: {
					name: { defaultValue: 'John' }
				}
			});

			form.setValue('name', 'Jane');
			expect(form.getValue('name')).toBe('Jane');

			form.reset();
			expect(form.getValue('name')).toBe('John');
			expect(form.isDirty).toBe(false);

			form.destroy();
		});

		it('should reset to new initial values', () => {
			const form = useFormState({
				fields: {
					name: { defaultValue: 'John' }
				}
			});

			form.reset({ name: 'Bob' });
			expect(form.getValue('name')).toBe('Bob');

			form.destroy();
		});
	});

	describe('setInitialValues', () => {
		it('should set new initial values', () => {
			const form = useFormState({
				fields: {
					name: { defaultValue: '' }
				}
			});

			form.setInitialValues({ name: 'Loaded' }, true);
			expect(form.getValue('name')).toBe('Loaded');
			expect(form.isDirty).toBe(false);

			form.destroy();
		});
	});

	describe('setValues', () => {
		it('should set multiple values', () => {
			const form = useFormState({
				fields: {
					name: { defaultValue: '' },
					email: { defaultValue: '' }
				}
			});

			form.setValues({ name: 'John', email: 'john@example.com' });

			expect(form.getValue('name')).toBe('John');
			expect(form.getValue('email')).toBe('john@example.com');

			form.destroy();
		});
	});

	describe('submit', () => {
		it('should call onSubmit with values', async () => {
			const form = useFormState({
				fields: {
					name: { defaultValue: 'John' }
				}
			});

			const onSubmit = vi.fn();
			await form.submit(onSubmit);

			expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ name: 'John' }));

			form.destroy();
		});

		it('should not call onSubmit if validation fails', async () => {
			const form = useFormState({
				fields: {
					email: {
						defaultValue: 'invalid',
						validator: Validators.email('Invalid')
					}
				}
			});

			const onSubmit = vi.fn();
			const result = await form.submit(onSubmit);

			expect(result).toBe(false);
			expect(onSubmit).not.toHaveBeenCalled();

			form.destroy();
		});

		it('should track isSubmitting state', async () => {
			const form = useFormState({
				fields: {
					name: { defaultValue: 'John' }
				}
			});

			let resolveSubmit: () => void;
			const submitPromise = new Promise<void>((resolve) => {
				resolveSubmit = resolve;
			});

			const onSubmit = vi.fn().mockImplementation(() => submitPromise);

			const submitResult = form.submit(onSubmit);
			expect(form.isSubmitting).toBe(true);

			resolveSubmit!();
			await submitResult;

			expect(form.isSubmitting).toBe(false);

			form.destroy();
		});
	});

	describe('watch API', () => {
		it('should watch single field', () => {
			const form = useFormState({
				fields: {
					name: { defaultValue: 'initial' }
				}
			});

			const callback = vi.fn();
			const unwatch = form.watch('name', callback);

			form.setValue('name', 'changed');

			expect(callback).toHaveBeenCalledWith('changed', 'initial');

			unwatch();
			form.destroy();
		});

		it('should stop watching after unwatch', () => {
			const form = useFormState({
				fields: {
					name: { defaultValue: 'initial' }
				}
			});

			const callback = vi.fn();
			const unwatch = form.watch('name', callback);

			form.setValue('name', 'first');
			expect(callback).toHaveBeenCalledTimes(1);

			unwatch();

			form.setValue('name', 'second');
			expect(callback).toHaveBeenCalledTimes(1);

			form.destroy();
		});
	});

	describe('batchUpdate', () => {
		it('should batch multiple updates', () => {
			const form = useFormState({
				fields: {
					name: { defaultValue: '' },
					email: { defaultValue: '' }
				}
			});

			form.batchUpdate(() => {
				form.setValue('name', 'John', false);
				form.setValue('email', 'john@example.com', false);
			});

			expect(form.getValue('name')).toBe('John');
			expect(form.getValue('email')).toBe('john@example.com');

			form.destroy();
		});
	});

	describe('fine-grained updates', () => {
		it('should track field versions when enabled', () => {
			const form = useFormState(
				{
					fields: {
						name: { defaultValue: '' },
						email: { defaultValue: '' }
					}
				},
				{ fineGrainedUpdates: true }
			);

			const initialNameVersion = form.getFieldVersion('name');
			const initialEmailVersion = form.getFieldVersion('email');

			form.setValue('name', 'John');

			expect(form.getFieldVersion('name')).toBe(initialNameVersion + 1);
			expect(form.getFieldVersion('email')).toBe(initialEmailVersion);

			form.destroy();
		});
	});

	describe('subscribe', () => {
		it('should notify observers on field change', () => {
			const form = useFormState({
				fields: {
					name: { defaultValue: '' }
				}
			});

			const observer = {
				onFieldChange: vi.fn()
			};

			const unsubscribe = form.subscribe(observer);

			form.setValue('name', 'John');

			expect(observer.onFieldChange).toHaveBeenCalled();

			unsubscribe();
			form.destroy();
		});
	});

	describe('destroy', () => {
		it('should cleanup resources', () => {
			const form = useFormState({
				fields: {
					name: { defaultValue: '' }
				}
			});

			// Should not throw
			expect(() => form.destroy()).not.toThrow();
		});
	});
});
