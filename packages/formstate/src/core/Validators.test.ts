import { describe, it, expect } from 'vitest';
import { Validators, createValidator, createCustomValidator } from './Validators';

describe('Validators', () => {
	describe('required', () => {
		it('should return error for null/undefined', async () => {
			const validator = Validators.required();
			expect(await validator.validate(null, {})).toBe('This field is required');
			expect(await validator.validate(undefined, {})).toBe('This field is required');
		});

		it('should return error for empty string', async () => {
			const validator = Validators.required();
			expect(await validator.validate('', {})).toBe('This field is required');
		});

		it('should return error for empty array', async () => {
			const validator = Validators.required();
			expect(await validator.validate([], {})).toBe('This field is required');
		});

		it('should return null for valid values', async () => {
			const validator = Validators.required();
			expect(await validator.validate('hello', {})).toBeNull();
			expect(await validator.validate(0, {})).toBeNull();
			expect(await validator.validate(false, {})).toBeNull();
			expect(await validator.validate(['item'], {})).toBeNull();
		});

		it('should use custom error message', async () => {
			const validator = Validators.required('Name is required');
			expect(await validator.validate('', {})).toBe('Name is required');
		});
	});

	describe('email', () => {
		it('should return null for valid emails', async () => {
			const validator = Validators.email();
			expect(await validator.validate('test@example.com', {})).toBeNull();
			expect(await validator.validate('user.name@domain.co.uk', {})).toBeNull();
		});

		it('should return error for invalid emails', async () => {
			const validator = Validators.email();
			expect(await validator.validate('invalid', {})).toBe('Invalid email address');
			expect(await validator.validate('no@domain', {})).toBe('Invalid email address');
			expect(await validator.validate('@domain.com', {})).toBe('Invalid email address');
		});

		it('should return null for empty value (use compose with required)', async () => {
			const validator = Validators.email();
			expect(await validator.validate('', {})).toBeNull();
		});

		it('should use custom error message', async () => {
			const validator = Validators.email('Please enter a valid email');
			expect(await validator.validate('invalid', {})).toBe('Please enter a valid email');
		});
	});

	describe('minLength', () => {
		it('should return null for strings meeting minimum length', async () => {
			const validator = Validators.minLength(3);
			expect(await validator.validate('abc', {})).toBeNull();
			expect(await validator.validate('abcd', {})).toBeNull();
		});

		it('should return error for strings below minimum length', async () => {
			const validator = Validators.minLength(3);
			expect(await validator.validate('ab', {})).toBe('Minimum length is 3');
		});

		it('should return null for empty value', async () => {
			const validator = Validators.minLength(3);
			expect(await validator.validate('', {})).toBeNull();
		});

		it('should use custom error message', async () => {
			const validator = Validators.minLength(5, 'At least 5 characters required');
			expect(await validator.validate('abc', {})).toBe('At least 5 characters required');
		});
	});

	describe('maxLength', () => {
		it('should return null for strings within maximum length', async () => {
			const validator = Validators.maxLength(5);
			expect(await validator.validate('abc', {})).toBeNull();
			expect(await validator.validate('abcde', {})).toBeNull();
		});

		it('should return error for strings exceeding maximum length', async () => {
			const validator = Validators.maxLength(5);
			expect(await validator.validate('abcdef', {})).toBe('Maximum length is 5');
		});

		it('should use custom error message', async () => {
			const validator = Validators.maxLength(5, 'Maximum 5 characters allowed');
			expect(await validator.validate('abcdef', {})).toBe('Maximum 5 characters allowed');
		});
	});

	describe('min', () => {
		it('should return null for numbers meeting minimum', async () => {
			const validator = Validators.min(5);
			expect(await validator.validate(5, {})).toBeNull();
			expect(await validator.validate(10, {})).toBeNull();
		});

		it('should return error for numbers below minimum', async () => {
			const validator = Validators.min(5);
			expect(await validator.validate(4, {})).toBe('Minimum value is 5');
		});

		it('should return null for null value', async () => {
			const validator = Validators.min(5);
			expect(await validator.validate(null as unknown as number, {})).toBeNull();
		});

		it('should use custom error message', async () => {
			const validator = Validators.min(18, 'Must be 18 or older');
			expect(await validator.validate(15, {})).toBe('Must be 18 or older');
		});
	});

	describe('max', () => {
		it('should return null for numbers within maximum', async () => {
			const validator = Validators.max(10);
			expect(await validator.validate(5, {})).toBeNull();
			expect(await validator.validate(10, {})).toBeNull();
		});

		it('should return error for numbers exceeding maximum', async () => {
			const validator = Validators.max(10);
			expect(await validator.validate(11, {})).toBe('Maximum value is 10');
		});

		it('should use custom error message', async () => {
			const validator = Validators.max(100, 'Cannot exceed 100');
			expect(await validator.validate(150, {})).toBe('Cannot exceed 100');
		});
	});

	describe('pattern', () => {
		it('should return null for strings matching pattern', async () => {
			const validator = Validators.pattern(/^[A-Z]{3}$/);
			expect(await validator.validate('ABC', {})).toBeNull();
		});

		it('should return error for strings not matching pattern', async () => {
			const validator = Validators.pattern(/^[A-Z]{3}$/);
			expect(await validator.validate('abc', {})).toBe('Invalid format');
			expect(await validator.validate('ABCD', {})).toBe('Invalid format');
		});

		it('should return null for empty value', async () => {
			const validator = Validators.pattern(/^[A-Z]{3}$/);
			expect(await validator.validate('', {})).toBeNull();
		});

		it('should use custom error message', async () => {
			const validator = Validators.pattern(/^[A-Z]{3}$/, 'Must be 3 uppercase letters');
			expect(await validator.validate('abc', {})).toBe('Must be 3 uppercase letters');
		});
	});

	describe('compose', () => {
		it('should combine multiple validators', async () => {
			const validator = Validators.compose(
				Validators.required(),
				Validators.minLength(3),
				Validators.maxLength(10)
			);

			expect(await validator.validate('', {})).toBe('This field is required');
			expect(await validator.validate('ab', {})).toBe('Minimum length is 3');
			expect(await validator.validate('abcdefghijk', {})).toBe('Maximum length is 10');
			expect(await validator.validate('hello', {})).toBeNull();
		});

		it('should return first error encountered', async () => {
			const validator = Validators.compose(Validators.required(), Validators.email());

			expect(await validator.validate('', {})).toBe('This field is required');
			expect(await validator.validate('invalid', {})).toBe('Invalid email address');
		});
	});
});

describe('createValidator', () => {
	it('should create custom validator with validate function', async () => {
		const isEven = createValidator<number>((value) => {
			return value % 2 === 0 ? null : 'Must be even';
		});

		expect(await isEven.validate(2, {})).toBeNull();
		expect(await isEven.validate(3, {})).toBe('Must be even');
	});

	it('should support async validation', async () => {
		const asyncValidator = createValidator<string>(async (value) => {
			await new Promise((resolve) => setTimeout(resolve, 10));
			return value === 'valid' ? null : 'Invalid value';
		});

		expect(await asyncValidator.validate('valid', {})).toBeNull();
		expect(await asyncValidator.validate('invalid', {})).toBe('Invalid value');
	});

	it('should have access to all form values', async () => {
		const passwordMatch = createValidator<string>((value, allValues) => {
			return value === allValues.password ? null : 'Passwords must match';
		});

		expect(await passwordMatch.validate('secret', { password: 'secret' })).toBeNull();
		expect(await passwordMatch.validate('different', { password: 'secret' })).toBe(
			'Passwords must match'
		);
	});
});

describe('createCustomValidator', () => {
	it('should create validator from boolean function', async () => {
		const isPositive = createCustomValidator<number>(
			(value) => value > 0,
			'Must be a positive number'
		);

		expect(await isPositive.validate(5, {})).toBeNull();
		expect(await isPositive.validate(-1, {})).toBe('Must be a positive number');
	});

	it('should support async boolean function', async () => {
		const asyncCheck = createCustomValidator<string>(async (value) => {
			await new Promise((resolve) => setTimeout(resolve, 10));
			return value.length > 0;
		}, 'Value is required');

		expect(await asyncCheck.validate('hello', {})).toBeNull();
		expect(await asyncCheck.validate('', {})).toBe('Value is required');
	});
});
