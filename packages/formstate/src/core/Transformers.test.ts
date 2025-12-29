import { describe, it, expect } from 'vitest';
import { Transformers } from './Transformers';

describe('Transformers', () => {
	describe('trim', () => {
		it('should trim whitespace from string', () => {
			expect(Transformers.trim('  hello  ')).toBe('hello');
			expect(Transformers.trim('\t\nhello\n\t')).toBe('hello');
		});

		it('should handle empty string', () => {
			expect(Transformers.trim('   ')).toBe('');
		});

		it('should handle null/undefined safely', () => {
			expect(Transformers.trim(null as unknown as string)).toBeUndefined();
			expect(Transformers.trim(undefined as unknown as string)).toBeUndefined();
		});
	});

	describe('toUpperCase', () => {
		it('should convert string to uppercase', () => {
			expect(Transformers.toUpperCase('hello')).toBe('HELLO');
			expect(Transformers.toUpperCase('HeLLo WoRLd')).toBe('HELLO WORLD');
		});

		it('should handle empty string', () => {
			expect(Transformers.toUpperCase('')).toBe('');
		});

		it('should handle null/undefined safely', () => {
			expect(Transformers.toUpperCase(null as unknown as string)).toBeUndefined();
			expect(Transformers.toUpperCase(undefined as unknown as string)).toBeUndefined();
		});
	});

	describe('toLowerCase', () => {
		it('should convert string to lowercase', () => {
			expect(Transformers.toLowerCase('HELLO')).toBe('hello');
			expect(Transformers.toLowerCase('HeLLo WoRLd')).toBe('hello world');
		});

		it('should handle empty string', () => {
			expect(Transformers.toLowerCase('')).toBe('');
		});

		it('should handle null/undefined safely', () => {
			expect(Transformers.toLowerCase(null as unknown as string)).toBeUndefined();
			expect(Transformers.toLowerCase(undefined as unknown as string)).toBeUndefined();
		});
	});

	describe('toNumber', () => {
		it('should convert string to number', () => {
			expect(Transformers.toNumber('42')).toBe(42);
			expect(Transformers.toNumber('3.14')).toBe(3.14);
			expect(Transformers.toNumber('-10')).toBe(-10);
		});

		it('should return number as-is', () => {
			expect(Transformers.toNumber(42)).toBe(42);
			expect(Transformers.toNumber(3.14)).toBe(3.14);
		});

		it('should return original string if not a valid number', () => {
			expect(Transformers.toNumber('hello')).toBe('hello');
			expect(Transformers.toNumber('')).toBe('');
		});

		it('should handle scientific notation', () => {
			expect(Transformers.toNumber('1e5')).toBe(100000);
			expect(Transformers.toNumber('1.5e-3')).toBe(0.0015);
		});
	});

	describe('compose', () => {
		it('should compose multiple transformers', () => {
			const transformer = Transformers.compose(
				Transformers.trim as (value: unknown) => unknown,
				Transformers.toLowerCase as (value: unknown) => unknown
			);

			expect(transformer('  HELLO  ')).toBe('hello');
		});

		it('should apply transformers in order', () => {
			const transformer = Transformers.compose(
				Transformers.trim as (value: unknown) => unknown,
				Transformers.toUpperCase as (value: unknown) => unknown,
				(s) => (s as string).replace('HELLO', 'HI')
			);

			expect(transformer('  hello  ')).toBe('HI');
		});

		it('should work with custom transformers', () => {
			const addPrefix = (value: unknown) => `prefix_${value}`;
			const addSuffix = (value: unknown) => `${value}_suffix`;

			const transformer = Transformers.compose(addPrefix, addSuffix);

			expect(transformer('value')).toBe('prefix_value_suffix');
		});

		it('should handle empty composition', () => {
			const transformer = Transformers.compose();
			expect(transformer('hello')).toBe('hello');
		});

		it('should handle single transformer', () => {
			const transformer = Transformers.compose(
				Transformers.toUpperCase as (value: unknown) => unknown
			);
			expect(transformer('hello')).toBe('HELLO');
		});
	});
});
