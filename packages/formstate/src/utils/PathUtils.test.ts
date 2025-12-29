import { describe, it, expect } from 'vitest';
import { PathUtils } from './PathUtils';

describe('PathUtils', () => {
	describe('get', () => {
		it('should get value at simple path', () => {
			const obj = { name: 'John', age: 30 };
			expect(PathUtils.get(obj, 'name')).toBe('John');
			expect(PathUtils.get(obj, 'age')).toBe(30);
		});

		it('should get value at nested path', () => {
			const obj = {
				user: {
					name: 'John',
					address: {
						city: 'NYC'
					}
				}
			};
			expect(PathUtils.get(obj, 'user.name')).toBe('John');
			expect(PathUtils.get(obj, 'user.address.city')).toBe('NYC');
		});

		it('should get value at array index path', () => {
			const obj = {
				users: [{ name: 'Alice' }, { name: 'Bob' }]
			};
			expect(PathUtils.get(obj, 'users[0].name')).toBe('Alice');
			expect(PathUtils.get(obj, 'users[1].name')).toBe('Bob');
		});

		it('should return undefined for non-existent path', () => {
			const obj = { name: 'John' };
			expect(PathUtils.get(obj, 'age')).toBeUndefined();
			expect(PathUtils.get(obj, 'user.name')).toBeUndefined();
		});

		it('should handle null/undefined objects', () => {
			expect(PathUtils.get(null, 'name')).toBeUndefined();
			expect(PathUtils.get(undefined, 'name')).toBeUndefined();
		});

		it('should handle complex nested array paths', () => {
			const obj = {
				users: [
					{
						addresses: [{ street: '123 Main St' }, { street: '456 Oak Ave' }]
					}
				]
			};
			expect(PathUtils.get(obj, 'users[0].addresses[1].street')).toBe('456 Oak Ave');
		});
	});

	describe('set', () => {
		it('should set value at simple path (immutable)', () => {
			const obj = { name: 'John' };
			const result = PathUtils.set(obj, 'name', 'Jane');

			expect(result).toEqual({ name: 'Jane' });
			expect(obj.name).toBe('John'); // Original unchanged
		});

		it('should set value at nested path (immutable)', () => {
			const obj = { user: { name: 'John' } };
			const result = PathUtils.set(obj, 'user.name', 'Jane');

			expect(result).toEqual({ user: { name: 'Jane' } });
			expect(obj.user.name).toBe('John'); // Original unchanged
		});

		it('should create nested structure if not exists', () => {
			const obj = {};
			const result = PathUtils.set(obj, 'user.address.city', 'NYC');

			expect(result).toEqual({
				user: {
					address: {
						city: 'NYC'
					}
				}
			});
		});

		it('should set value at array index path', () => {
			const obj = { users: [{ name: 'Alice' }] };
			const result = PathUtils.set(obj, 'users[0].name', 'Bob');

			expect(result).toEqual({ users: [{ name: 'Bob' }] });
		});

		it('should create array if path indicates array index', () => {
			const obj = {};
			const result = PathUtils.set(obj, 'users[0].name', 'Alice');

			expect(result).toEqual({
				users: [{ name: 'Alice' }]
			});
		});
	});

	describe('setMutable', () => {
		it('should set value at simple path (mutable)', () => {
			const obj: Record<string, unknown> = { name: 'John' };
			PathUtils.setMutable(obj, 'name', 'Jane');

			expect(obj.name).toBe('Jane');
		});

		it('should set value at nested path (mutable)', () => {
			const obj: Record<string, unknown> = { user: { name: 'John' } };
			PathUtils.setMutable(obj, 'user.name', 'Jane');

			expect((obj.user as Record<string, unknown>).name).toBe('Jane');
		});

		it('should create nested structure if not exists', () => {
			const obj: Record<string, unknown> = {};
			PathUtils.setMutable(obj, 'user.address.city', 'NYC');

			expect(obj).toEqual({
				user: {
					address: {
						city: 'NYC'
					}
				}
			});
		});
	});

	describe('delete', () => {
		it('should delete value at simple path (immutable)', () => {
			const obj = { name: 'John', age: 30 };
			const result = PathUtils.delete(obj, 'age');

			expect(result).toEqual({ name: 'John' });
			expect(obj.age).toBe(30); // Original unchanged
		});

		it('should delete value at nested path', () => {
			const obj = { user: { name: 'John', age: 30 } };
			const result = PathUtils.delete(obj, 'user.age') as { user: { name: string } };

			expect(result.user.name).toBe('John');
			expect('age' in result.user).toBe(false);
		});

		it('should remove array element by index', () => {
			const obj = { users: ['Alice', 'Bob', 'Charlie'] };
			const result = PathUtils.delete(obj, 'users[1]');

			expect(result).toEqual({ users: ['Alice', 'Charlie'] });
		});

		it('should return unchanged object if path does not exist', () => {
			const obj = { name: 'John' };
			const result = PathUtils.delete(obj, 'age');

			expect(result).toEqual({ name: 'John' });
		});
	});

	describe('insertAt', () => {
		it('should insert element at specified index', () => {
			const obj = { items: ['a', 'b', 'c'] };
			const result = PathUtils.insertAt(obj, 'items', 1, 'x');

			expect(result).toEqual({ items: ['a', 'x', 'b', 'c'] });
		});

		it('should throw error if path does not point to array', () => {
			const obj = { name: 'John' };

			expect(() => PathUtils.insertAt(obj, 'name', 0, 'x')).toThrow(
				'Path "name" does not point to an array'
			);
		});
	});

	describe('push', () => {
		it('should add element to end of array', () => {
			const obj = { items: ['a', 'b'] };
			const result = PathUtils.push(obj, 'items', 'c');

			expect(result).toEqual({ items: ['a', 'b', 'c'] });
		});

		it('should throw error if path does not point to array', () => {
			const obj = { name: 'John' };

			expect(() => PathUtils.push(obj, 'name', 'x')).toThrow(
				'Path "name" does not point to an array'
			);
		});
	});

	describe('removeAt', () => {
		it('should remove element at specified index', () => {
			const obj = { items: ['a', 'b', 'c'] };
			const result = PathUtils.removeAt(obj, 'items', 1);

			expect(result).toEqual({ items: ['a', 'c'] });
		});

		it('should throw error if path does not point to array', () => {
			const obj = { name: 'John' };

			expect(() => PathUtils.removeAt(obj, 'name', 0)).toThrow(
				'Path "name" does not point to an array'
			);
		});
	});

	describe('move', () => {
		it('should move element from one index to another', () => {
			const obj = { items: ['a', 'b', 'c', 'd'] };
			const result = PathUtils.move(obj, 'items', 0, 2);

			expect(result).toEqual({ items: ['b', 'c', 'a', 'd'] });
		});

		it('should move element backwards', () => {
			const obj = { items: ['a', 'b', 'c', 'd'] };
			const result = PathUtils.move(obj, 'items', 3, 1);

			expect(result).toEqual({ items: ['a', 'd', 'b', 'c'] });
		});

		it('should throw error if path does not point to array', () => {
			const obj = { name: 'John' };

			expect(() => PathUtils.move(obj, 'name', 0, 1)).toThrow(
				'Path "name" does not point to an array'
			);
		});
	});
});
