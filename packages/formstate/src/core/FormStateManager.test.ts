import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FormStateManager } from './FormStateManager';
import { Validators, createValidator } from './Validators';
import type { IFormObserver, FieldValue } from './interfaces';

describe('FormStateManager', () => {
	describe('constructor', () => {
		it('should create with default config', () => {
			const manager = new FormStateManager();
			expect(manager.getValues()).toEqual({});
		});

		it('should register fields from config', () => {
			const manager = new FormStateManager({
				fields: {
					name: { defaultValue: 'John' },
					age: { defaultValue: 30 }
				}
			});

			expect(manager.getValue('name')).toBe('John');
			expect(manager.getValue('age')).toBe(30);
		});

		it('should apply default validation settings', () => {
			const manager = new FormStateManager();
			// validateOnChange defaults to true
			// validateOnBlur defaults to true
			// validateOnMount defaults to false
			expect(manager.isValidating()).toBe(false);
		});
	});

	describe('registerField', () => {
		it('should register field with default value', () => {
			const manager = new FormStateManager();
			manager.registerField('email', { defaultValue: 'test@example.com' });

			expect(manager.getValue('email')).toBe('test@example.com');
		});

		it('should merge config when field already registered', () => {
			const manager = new FormStateManager();
			manager.registerField('email', { defaultValue: 'old@example.com' });
			manager.registerField('email', { validator: Validators.required() });

			// Default value should remain
			expect(manager.getValue('email')).toBe('old@example.com');
		});

		it('should initialize field state', () => {
			const manager = new FormStateManager();
			manager.registerField('name', { defaultValue: 'John' });

			const state = manager.getFieldState('name');
			expect(state.value).toBe('John');
			expect(state.error).toBeNull();
			expect(state.touched).toBe(false);
			expect(state.dirty).toBe(false);
			expect(state.validating).toBe(false);
		});
	});

	describe('unregisterField', () => {
		it('should remove field and its state', () => {
			const manager = new FormStateManager({
				fields: {
					name: { defaultValue: 'John' },
					age: { defaultValue: 30 }
				}
			});

			manager.unregisterField('name');

			expect(manager.getValue('name')).toBeUndefined();
			expect(manager.getValue('age')).toBe(30);
		});

		it('should cancel pending validation', async () => {
			const manager = new FormStateManager();
			const slowValidator = createValidator<string>(async () => {
				await new Promise((resolve) => setTimeout(resolve, 100));
				return 'error';
			});

			manager.registerField('name', { validator: slowValidator, defaultValue: '' });
			manager.validateField('name');
			manager.unregisterField('name');

			// Should not throw or cause issues
			await new Promise((resolve) => setTimeout(resolve, 150));
		});
	});

	describe('setValue', () => {
		it('should update field value', () => {
			const manager = new FormStateManager({
				fields: { name: { defaultValue: 'John' } }
			});

			manager.setValue('name', 'Jane');
			expect(manager.getValue('name')).toBe('Jane');
		});

		it('should mark field as dirty when value changes', () => {
			const manager = new FormStateManager({
				fields: { name: { defaultValue: 'John' } }
			});

			manager.setValue('name', 'Jane');
			expect(manager.getFieldState('name').dirty).toBe(true);
		});

		it('should apply transformer', () => {
			const manager = new FormStateManager({
				fields: {
					name: {
						defaultValue: '',
						transformer: (value: FieldValue) => (value as string).toUpperCase()
					}
				}
			});

			manager.setValue('name', 'john');
			expect(manager.getValue('name')).toBe('JOHN');
		});

		it('should apply ITransformer object', () => {
			const manager = new FormStateManager({
				fields: {
					name: {
						defaultValue: '',
						transformer: {
							transform: (value: FieldValue) => (value as string).trim()
						}
					}
				}
			});

			manager.setValue('name', '  hello  ');
			expect(manager.getValue('name')).toBe('hello');
		});

		it('should notify observers', () => {
			const manager = new FormStateManager({
				fields: { name: { defaultValue: 'John' } }
			});

			const observer: IFormObserver = {
				onFieldChange: vi.fn()
			};
			manager.subscribe(observer);

			manager.setValue('name', 'Jane');
			expect(observer.onFieldChange).toHaveBeenCalledWith('name', 'Jane');
		});

		it('should trigger validation when validateOnChange is true', async () => {
			const manager = new FormStateManager({
				validateOnChange: true,
				fields: {
					email: {
						defaultValue: '',
						validator: Validators.email()
					}
				}
			});

			manager.setValue('email', 'invalid');
			await new Promise((resolve) => setTimeout(resolve, 0));

			expect(manager.getFieldState('email').error).toBe('Invalid email address');
		});

		it('should not validate when shouldValidate is false', async () => {
			const manager = new FormStateManager({
				validateOnChange: true,
				fields: {
					email: {
						defaultValue: '',
						validator: Validators.email()
					}
				}
			});

			manager.setValue('email', 'invalid', false);
			await new Promise((resolve) => setTimeout(resolve, 0));

			expect(manager.getFieldState('email').error).toBeNull();
		});

		it('should handle nested paths', () => {
			const manager = new FormStateManager();
			manager.registerField('user.name', { defaultValue: '' });

			manager.setValue('user.name', 'John');
			expect(manager.getValue('user.name')).toBe('John');
			expect((manager.getValues() as { user: { name: string } }).user.name).toBe('John');
		});

		it('should handle array paths', () => {
			const manager = new FormStateManager();
			manager.registerField('users[0].name', { defaultValue: '' });

			manager.setValue('users[0].name', 'Alice');
			expect(manager.getValue('users[0].name')).toBe('Alice');
		});
	});

	describe('batchUpdate', () => {
		it('should batch multiple setValue calls', () => {
			const manager = new FormStateManager({
				fields: {
					firstName: { defaultValue: '' },
					lastName: { defaultValue: '' },
					email: { defaultValue: '' }
				}
			});

			const observer: IFormObserver = {
				onFieldChange: vi.fn()
			};
			manager.subscribe(observer);

			manager.batchUpdate(() => {
				manager.setValue('firstName', 'John', false);
				manager.setValue('lastName', 'Doe', false);
				manager.setValue('email', 'john@example.com', false);
			});

			// Should only call onFieldChange once for batch completion
			expect(observer.onFieldChange).toHaveBeenCalledTimes(1);
			expect(observer.onFieldChange).toHaveBeenCalledWith('', expect.any(Object));
		});

		it('should update all values correctly', () => {
			const manager = new FormStateManager({
				fields: {
					a: { defaultValue: '' },
					b: { defaultValue: '' }
				}
			});

			manager.batchUpdate(() => {
				manager.setValue('a', '1', false);
				manager.setValue('b', '2', false);
			});

			expect(manager.getValue('a')).toBe('1');
			expect(manager.getValue('b')).toBe('2');
		});
	});

	describe('setValues', () => {
		it('should set multiple values at once', () => {
			const manager = new FormStateManager({
				fields: {
					name: { defaultValue: '' },
					age: { defaultValue: 0 }
				}
			});

			manager.setValues({ name: 'John', age: 30 });

			expect(manager.getValue('name')).toBe('John');
			expect(manager.getValue('age')).toBe(30);
		});

		it('should validate all fields when shouldValidate is true', async () => {
			const manager = new FormStateManager({
				fields: {
					email: { defaultValue: '', validator: Validators.email() }
				}
			});

			await manager.setValues({ email: 'invalid' }, true);

			expect(manager.getFieldState('email').error).toBe('Invalid email address');
		});
	});

	describe('reset', () => {
		it('should reset to initial values', () => {
			const manager = new FormStateManager({
				fields: {
					name: { defaultValue: 'Initial' }
				}
			});

			manager.setValue('name', 'Changed');
			manager.reset();

			expect(manager.getValue('name')).toBe('Initial');
		});

		it('should clear touched and dirty states', () => {
			const manager = new FormStateManager({
				fields: {
					name: { defaultValue: 'Initial' }
				}
			});

			manager.setValue('name', 'Changed');
			manager.setFieldTouched('name', true);
			manager.reset();

			const state = manager.getFieldState('name');
			expect(state.touched).toBe(false);
			expect(state.dirty).toBe(false);
		});

		it('should clear errors', async () => {
			const manager = new FormStateManager({
				fields: {
					email: { defaultValue: '', validator: Validators.email() }
				}
			});

			manager.setValue('email', 'invalid');
			await manager.validateField('email');
			manager.reset();

			expect(manager.getFieldState('email').error).toBeNull();
		});

		it('should accept new initial values', () => {
			const manager = new FormStateManager({
				fields: {
					name: { defaultValue: 'Original' }
				}
			});

			manager.reset({ name: 'New Initial' });

			expect(manager.getValue('name')).toBe('New Initial');
		});
	});

	describe('setInitialValues', () => {
		it('should set initial values and optionally reset', () => {
			const manager = new FormStateManager({
				fields: {
					name: { defaultValue: '' }
				}
			});

			manager.setValue('name', 'Dirty Value');
			manager.setInitialValues({ name: 'New Initial' }, true);

			expect(manager.getValue('name')).toBe('New Initial');
			expect(manager.getFieldState('name').dirty).toBe(false);
		});

		it('should update only non-dirty fields when not resetting', () => {
			const manager = new FormStateManager({
				fields: {
					clean: { defaultValue: 'old' },
					dirty: { defaultValue: 'old' }
				}
			});

			manager.setValue('dirty', 'modified');
			manager.setInitialValues({ clean: 'new', dirty: 'new' }, false);

			expect(manager.getValue('clean')).toBe('new');
			expect(manager.getValue('dirty')).toBe('modified');
		});
	});

	describe('getFieldState', () => {
		it('should return default state for unregistered field', () => {
			const manager = new FormStateManager();
			const state = manager.getFieldState('unknown');

			expect(state.value).toBeUndefined();
			expect(state.error).toBeNull();
			expect(state.touched).toBe(false);
			expect(state.dirty).toBe(false);
			expect(state.validating).toBe(false);
		});
	});

	describe('setFieldTouched', () => {
		it('should mark field as touched', () => {
			const manager = new FormStateManager({
				fields: { name: { defaultValue: '' } }
			});

			manager.setFieldTouched('name', true);
			expect(manager.getFieldState('name').touched).toBe(true);
		});

		it('should trigger validation on blur when configured', async () => {
			const manager = new FormStateManager({
				validateOnBlur: true,
				fields: {
					email: { defaultValue: 'invalid', validator: Validators.email() }
				}
			});

			manager.setFieldTouched('email', true);
			await new Promise((resolve) => setTimeout(resolve, 0));

			expect(manager.getFieldState('email').error).toBe('Invalid email address');
		});

		it('should notify observers on blur', () => {
			const manager = new FormStateManager({
				fields: { name: { defaultValue: '' } }
			});

			const observer: IFormObserver = {
				onFieldBlur: vi.fn()
			};
			manager.subscribe(observer);

			manager.setFieldTouched('name', true);
			expect(observer.onFieldBlur).toHaveBeenCalledWith('name');
		});
	});

	describe('setFieldError', () => {
		it('should set custom error', () => {
			const manager = new FormStateManager({
				fields: { name: { defaultValue: '' } }
			});

			manager.setFieldError('name', 'Custom error');
			expect(manager.getFieldState('name').error).toBe('Custom error');
		});

		it('should clear error with null', () => {
			const manager = new FormStateManager({
				fields: { name: { defaultValue: '' } }
			});

			manager.setFieldError('name', 'Error');
			manager.setFieldError('name', null);
			expect(manager.getFieldState('name').error).toBeNull();
		});
	});

	describe('validateField', () => {
		it('should validate single field', async () => {
			const manager = new FormStateManager({
				fields: {
					email: { defaultValue: 'invalid', validator: Validators.email() }
				}
			});

			const error = await manager.validateField('email');
			expect(error).toBe('Invalid email address');
			expect(manager.getFieldState('email').error).toBe('Invalid email address');
		});

		it('should return null for valid field', async () => {
			const manager = new FormStateManager({
				fields: {
					email: { defaultValue: 'test@example.com', validator: Validators.email() }
				}
			});

			const error = await manager.validateField('email');
			expect(error).toBeNull();
		});

		it('should return null for field without validator', async () => {
			const manager = new FormStateManager({
				fields: { name: { defaultValue: 'John' } }
			});

			const error = await manager.validateField('name');
			expect(error).toBeNull();
		});

		it('should set validating state during async validation', async () => {
			const manager = new FormStateManager({
				fields: {
					email: {
						defaultValue: 'test',
						validator: createValidator<string>(async () => {
							await new Promise((resolve) => setTimeout(resolve, 50));
							return null;
						})
					}
				}
			});

			const promise = manager.validateField('email');
			expect(manager.getFieldState('email').validating).toBe(true);

			await promise;
			expect(manager.getFieldState('email').validating).toBe(false);
		});

		it('should cancel previous validation and ignore its result', async () => {
			const manager = new FormStateManager({
				fields: {
					name: {
						defaultValue: '',
						validator: createValidator<string>(async (value) => {
							await new Promise((resolve) => setTimeout(resolve, 50));
							// First returns error, second returns null
							return value === 'first' ? 'first error' : null;
						})
					}
				}
			});

			manager.setValue('name', 'first', false);
			manager.validateField('name');

			// Immediately start second validation - this aborts first
			manager.setValue('name', 'second', false);
			await manager.validateField('name');

			// Wait for first validation to complete (but its result should be ignored)
			await new Promise((resolve) => setTimeout(resolve, 100));

			// The field error should be null (from second validation)
			// not 'first error' (from first validation that was aborted)
			expect(manager.getFieldState('name').error).toBeNull();
		});

		it('should notify observers', async () => {
			const manager = new FormStateManager({
				fields: {
					email: { defaultValue: 'invalid', validator: Validators.email() }
				}
			});

			const observer: IFormObserver = {
				onFieldValidation: vi.fn()
			};
			manager.subscribe(observer);

			await manager.validateField('email');
			expect(observer.onFieldValidation).toHaveBeenCalledWith('email', 'Invalid email address');
		});
	});

	describe('validateFields', () => {
		it('should validate multiple specific fields', async () => {
			const manager = new FormStateManager({
				fields: {
					email: { defaultValue: 'invalid', validator: Validators.email() },
					name: { defaultValue: '', validator: Validators.required() },
					age: { defaultValue: 25, validator: Validators.min(18) }
				}
			});

			const errors = await manager.validateFields(['email', 'name']);

			expect(errors.email).toBe('Invalid email address');
			expect(errors.name).toBe('This field is required');
			expect(errors.age).toBeUndefined();
		});
	});

	describe('validateForm', () => {
		it('should validate all registered fields', async () => {
			const manager = new FormStateManager({
				fields: {
					email: { defaultValue: 'invalid', validator: Validators.email() },
					name: { defaultValue: '', validator: Validators.required() }
				}
			});

			const errors = await manager.validateForm();

			expect(errors.email).toBe('Invalid email address');
			expect(errors.name).toBe('This field is required');
		});

		it('should return empty object when all valid', async () => {
			const manager = new FormStateManager({
				fields: {
					email: { defaultValue: 'test@example.com', validator: Validators.email() },
					name: { defaultValue: 'John', validator: Validators.required() }
				}
			});

			const errors = await manager.validateForm();
			expect(errors).toEqual({});
		});

		it('should notify observers', async () => {
			const manager = new FormStateManager({
				fields: {
					email: { defaultValue: 'invalid', validator: Validators.email() }
				}
			});

			const observer: IFormObserver = {
				onFormValidation: vi.fn()
			};
			manager.subscribe(observer);

			await manager.validateForm();
			expect(observer.onFormValidation).toHaveBeenCalledWith({
				email: 'Invalid email address'
			});
		});
	});

	describe('dependent field validation', () => {
		it('should validate dependent fields when dependency changes', async () => {
			const manager = new FormStateManager({
				fields: {
					password: { defaultValue: 'secret' },
					confirmPassword: {
						defaultValue: 'different',
						dependencies: ['password'],
						validator: createValidator<string>((value, allValues) => {
							return value === allValues.password ? null : 'Passwords must match';
						})
					}
				}
			});

			// Change password triggers confirmPassword validation
			manager.setValue('password', 'newsecret');
			await new Promise((resolve) => setTimeout(resolve, 0));

			expect(manager.getFieldState('confirmPassword').error).toBe('Passwords must match');
		});
	});

	describe('form state queries', () => {
		let manager: FormStateManager;

		beforeEach(() => {
			manager = new FormStateManager({
				fields: {
					name: { defaultValue: 'John' },
					email: { defaultValue: 'john@example.com', validator: Validators.email() }
				}
			});
		});

		describe('isDirty', () => {
			it('should return false initially', () => {
				expect(manager.isDirty()).toBe(false);
			});

			it('should return true when any field is dirty', () => {
				manager.setValue('name', 'Jane');
				expect(manager.isDirty()).toBe(true);
			});
		});

		describe('isValid', () => {
			it('should return true when no errors', () => {
				expect(manager.isValid()).toBe(true);
			});

			it('should return false when any field has error', async () => {
				manager.setValue('email', 'invalid');
				await manager.validateField('email');
				expect(manager.isValid()).toBe(false);
			});
		});

		describe('isValidating', () => {
			it('should return false when no validation in progress', () => {
				expect(manager.isValidating()).toBe(false);
			});

			it('should return true during async validation', async () => {
				const asyncManager = new FormStateManager({
					fields: {
						name: {
							defaultValue: '',
							validator: createValidator<string>(async () => {
								await new Promise((resolve) => setTimeout(resolve, 50));
								return null;
							})
						}
					}
				});

				const promise = asyncManager.validateField('name');
				expect(asyncManager.isValidating()).toBe(true);
				await promise;
				expect(asyncManager.isValidating()).toBe(false);
			});
		});

		describe('getTouchedFields', () => {
			it('should return empty array initially', () => {
				expect(manager.getTouchedFields()).toEqual([]);
			});

			it('should return touched field paths', () => {
				manager.setFieldTouched('name', true);
				expect(manager.getTouchedFields()).toEqual(['name']);
			});
		});

		describe('getDirtyFields', () => {
			it('should return empty array initially', () => {
				expect(manager.getDirtyFields()).toEqual([]);
			});

			it('should return dirty field paths', () => {
				manager.setValue('name', 'Jane');
				expect(manager.getDirtyFields()).toEqual(['name']);
			});
		});

		describe('getErrors', () => {
			it('should return empty object when no errors', () => {
				expect(manager.getErrors()).toEqual({});
			});

			it('should return all field errors', async () => {
				manager.setValue('email', 'invalid');
				await manager.validateField('email');
				expect(manager.getErrors()).toEqual({
					email: 'Invalid email address'
				});
			});
		});

		describe('getDirtyValues', () => {
			it('should return empty object when nothing changed', () => {
				expect(manager.getDirtyValues()).toEqual({});
			});

			it('should return only changed values', () => {
				manager.setValue('name', 'Jane');
				expect(manager.getDirtyValues()).toEqual({ name: 'Jane' });
			});
		});
	});

	describe('submit', () => {
		it('should call onSubmit with values when valid', async () => {
			const manager = new FormStateManager({
				fields: {
					name: { defaultValue: 'John', validator: Validators.required() }
				}
			});

			const onSubmit = vi.fn();
			const result = await manager.submit(onSubmit);

			expect(result).toBe(true);
			expect(onSubmit).toHaveBeenCalledWith({ name: 'John' });
		});

		it('should not call onSubmit when invalid', async () => {
			const manager = new FormStateManager({
				fields: {
					name: { defaultValue: '', validator: Validators.required() }
				}
			});

			const onSubmit = vi.fn();
			const result = await manager.submit(onSubmit);

			expect(result).toBe(false);
			expect(onSubmit).not.toHaveBeenCalled();
		});

		it('should mark all fields as touched', async () => {
			const manager = new FormStateManager({
				fields: {
					name: { defaultValue: 'John' },
					email: { defaultValue: 'test@example.com' }
				}
			});

			await manager.submit(() => {});

			expect(manager.getFieldState('name').touched).toBe(true);
			expect(manager.getFieldState('email').touched).toBe(true);
		});

		it('should notify observers on successful submit', async () => {
			const manager = new FormStateManager({
				fields: { name: { defaultValue: 'John' } }
			});

			const observer: IFormObserver = {
				onSubmit: vi.fn()
			};
			manager.subscribe(observer);

			await manager.submit(() => {});
			expect(observer.onSubmit).toHaveBeenCalledWith({ name: 'John' });
		});

		it('should return false when onSubmit throws', async () => {
			const manager = new FormStateManager({
				fields: { name: { defaultValue: 'John' } }
			});

			const result = await manager.submit(() => {
				throw new Error('Submit failed');
			});

			expect(result).toBe(false);
		});

		it('should handle async onSubmit', async () => {
			const manager = new FormStateManager({
				fields: { name: { defaultValue: 'John' } }
			});

			const onSubmit = vi.fn().mockResolvedValue(undefined);
			const result = await manager.submit(onSubmit);

			expect(result).toBe(true);
			expect(onSubmit).toHaveBeenCalled();
		});
	});

	describe('subscribe', () => {
		it('should return unsubscribe function', () => {
			const manager = new FormStateManager({
				fields: { name: { defaultValue: '' } }
			});

			const observer: IFormObserver = {
				onFieldChange: vi.fn()
			};

			const unsubscribe = manager.subscribe(observer);
			manager.setValue('name', 'John');
			expect(observer.onFieldChange).toHaveBeenCalledTimes(1);

			unsubscribe();
			manager.setValue('name', 'Jane');
			expect(observer.onFieldChange).toHaveBeenCalledTimes(1);
		});
	});

	describe('serialization', () => {
		it('should serialize form state', () => {
			const manager = new FormStateManager({
				fields: {
					name: { defaultValue: 'John' },
					age: { defaultValue: 30 }
				}
			});

			const serialized = manager.serialize();
			const parsed = JSON.parse(serialized);

			expect(parsed.values).toEqual({ name: 'John', age: 30 });
			expect(parsed.initialValues).toEqual({ name: 'John', age: 30 });
			expect(Array.isArray(parsed.fieldStates)).toBe(true);
		});

		it('should deserialize form state', () => {
			const original = new FormStateManager({
				fields: {
					name: { defaultValue: 'John' }
				}
			});

			original.setValue('name', 'Jane');
			const serialized = original.serialize();

			const restored = FormStateManager.deserialize(serialized, {
				fields: { name: {} }
			});

			expect(restored.getValue('name')).toBe('Jane');
			expect(restored.getFieldState('name').dirty).toBe(true);
		});
	});

	describe('complete validation', () => {
		it('should debounce validation with validateOnComplete', async () => {
			vi.useFakeTimers();

			const validator = vi.fn().mockReturnValue(null);
			const manager = new FormStateManager({
				fields: {
					search: {
						defaultValue: '',
						validateOnComplete: true,
						debounceMs: 300,
						validator: { validate: validator }
					}
				}
			});

			manager.setValue('search', 'a');
			manager.setValue('search', 'ab');
			manager.setValue('search', 'abc');

			// Validator shouldn't be called yet
			expect(validator).not.toHaveBeenCalled();

			// Fast forward past debounce
			vi.advanceTimersByTime(400);
			await vi.runAllTimersAsync();

			// Only called once after debounce
			expect(validator).toHaveBeenCalledTimes(1);

			vi.useRealTimers();
		});

		it('should use custom completeCondition', async () => {
			vi.useFakeTimers();

			const validator = vi.fn().mockReturnValue(null);
			const manager = new FormStateManager({
				fields: {
					phone: {
						defaultValue: '',
						validateOnComplete: true,
						debounceMs: 100,
						completeCondition: (value) => (value as string).length >= 10,
						validator: { validate: validator }
					}
				}
			});

			manager.setValue('phone', '123'); // Not complete
			vi.advanceTimersByTime(200);
			expect(validator).not.toHaveBeenCalled();

			manager.setValue('phone', '1234567890'); // Complete
			vi.advanceTimersByTime(200);
			await vi.runAllTimersAsync();

			expect(validator).toHaveBeenCalledTimes(1);

			vi.useRealTimers();
		});
	});
});
