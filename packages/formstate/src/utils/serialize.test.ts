import { describe, it, expect } from 'vitest';
import { safeStringify, safeParse, canSerialize, cloneViaSerialization } from './serialize';

describe('safeStringify', () => {
	it('should stringify simple objects', () => {
		const obj = { name: 'John', age: 30 };
		const json = safeStringify(obj);
		expect(JSON.parse(json)).toEqual(obj);
	});

	it('should handle BigInt', () => {
		const obj = { amount: 123456789012345678901234567890n };
		const json = safeStringify(obj);
		const parsed = JSON.parse(json);

		expect(parsed.amount).toEqual({
			__type: 'bigint',
			value: '123456789012345678901234567890'
		});
	});

	it('should handle Date', () => {
		const date = new Date('2024-01-15T12:00:00.000Z');
		const obj = { createdAt: date };
		const json = safeStringify(obj);
		const parsed = JSON.parse(json);

		expect(parsed.createdAt).toEqual({
			__type: 'date',
			value: '2024-01-15T12:00:00.000Z'
		});
	});

	it('should handle Map', () => {
		const obj = {
			metadata: new Map([
				['key1', 'value1'],
				['key2', 'value2']
			])
		};
		const json = safeStringify(obj);
		const parsed = JSON.parse(json);

		expect(parsed.metadata).toEqual({
			__type: 'map',
			value: [
				['key1', 'value1'],
				['key2', 'value2']
			]
		});
	});

	it('should handle Set', () => {
		const obj = { tags: new Set(['a', 'b', 'c']) };
		const json = safeStringify(obj);
		const parsed = JSON.parse(json);

		expect(parsed.tags).toEqual({
			__type: 'set',
			value: ['a', 'b', 'c']
		});
	});

	it('should handle undefined', () => {
		const obj = { value: undefined };
		const json = safeStringify(obj);
		const parsed = JSON.parse(json);

		expect(parsed.value).toEqual({ __type: 'undefined' });
	});

	it('should handle circular references', () => {
		const obj: Record<string, unknown> = { name: 'root' };
		obj.self = obj;

		const json = safeStringify(obj);
		const parsed = JSON.parse(json);

		expect(parsed.name).toBe('root');
		expect(parsed.self).toEqual({ __type: 'circular' });
	});

	it('should support pretty printing with space parameter', () => {
		const obj = { name: 'John' };
		const json = safeStringify(obj, 2);

		expect(json).toContain('\n');
		expect(json).toContain('  ');
	});

	it('should handle nested special types', () => {
		const obj = {
			user: {
				id: 12345n,
				createdAt: new Date('2024-01-01'),
				roles: new Set(['admin', 'user'])
			}
		};
		const json = safeStringify(obj);
		const parsed = JSON.parse(json);

		expect(parsed.user.id.__type).toBe('bigint');
		expect(parsed.user.createdAt.__type).toBe('date');
		expect(parsed.user.roles.__type).toBe('set');
	});

	it('should handle arrays with special types', () => {
		const obj = {
			items: [1n, 2n, 3n]
		};
		const json = safeStringify(obj);
		const parsed = JSON.parse(json);

		expect(parsed.items).toHaveLength(3);
		expect(parsed.items[0]).toEqual({ __type: 'bigint', value: '1' });
	});
});

describe('safeParse', () => {
	it('should parse simple JSON', () => {
		const json = '{"name":"John","age":30}';
		const obj = safeParse(json);

		expect(obj).toEqual({ name: 'John', age: 30 });
	});

	it('should restore BigInt', () => {
		const json = '{"amount":{"__type":"bigint","value":"123456789012345678901234567890"}}';
		const obj = safeParse<{ amount: bigint }>(json);

		expect(obj.amount).toBe(123456789012345678901234567890n);
	});

	it('should restore Date', () => {
		const json = '{"createdAt":{"__type":"date","value":"2024-01-15T12:00:00.000Z"}}';
		const obj = safeParse<{ createdAt: Date }>(json);

		expect(obj.createdAt instanceof Date).toBe(true);
		expect(obj.createdAt.toISOString()).toBe('2024-01-15T12:00:00.000Z');
	});

	it('should restore Map', () => {
		const json = '{"metadata":{"__type":"map","value":[["key1","value1"],["key2","value2"]]}}';
		const obj = safeParse<{ metadata: Map<string, string> }>(json);

		expect(obj.metadata instanceof Map).toBe(true);
		expect(obj.metadata.get('key1')).toBe('value1');
		expect(obj.metadata.get('key2')).toBe('value2');
	});

	it('should restore Set', () => {
		const json = '{"tags":{"__type":"set","value":["a","b","c"]}}';
		const obj = safeParse<{ tags: Set<string> }>(json);

		expect(obj.tags instanceof Set).toBe(true);
		expect(obj.tags.has('a')).toBe(true);
		expect(obj.tags.has('b')).toBe(true);
		expect(obj.tags.has('c')).toBe(true);
	});

	it('should restore undefined', () => {
		const json = '{"value":{"__type":"undefined"}}';
		const obj = safeParse<{ value: undefined }>(json);

		expect(obj.value).toBeUndefined();
	});

	it('should handle circular reference markers', () => {
		const json = '{"name":"root","self":{"__type":"circular"}}';
		const obj = safeParse<{ name: string; self: null }>(json);

		expect(obj.name).toBe('root');
		expect(obj.self).toBeNull();
	});

	it('should throw on invalid JSON', () => {
		expect(() => safeParse('invalid json')).toThrow('Failed to parse JSON');
	});
});

describe('canSerialize', () => {
	it('should return true for serializable values', () => {
		expect(canSerialize({ name: 'John' })).toBe(true);
		expect(canSerialize([1, 2, 3])).toBe(true);
		expect(canSerialize('string')).toBe(true);
		expect(canSerialize(123)).toBe(true);
		expect(canSerialize(null)).toBe(true);
	});

	it('should return true for special types (handled by safeStringify)', () => {
		expect(canSerialize({ amount: 123n })).toBe(true);
		expect(canSerialize({ date: new Date() })).toBe(true);
		expect(canSerialize({ map: new Map() })).toBe(true);
		expect(canSerialize({ set: new Set() })).toBe(true);
	});

	it('should return true for circular references (handled by safeStringify)', () => {
		const obj: Record<string, unknown> = {};
		obj.self = obj;
		expect(canSerialize(obj)).toBe(true);
	});
});

describe('cloneViaSerialization', () => {
	it('should create deep clone of simple objects', () => {
		const original = { user: { name: 'John', address: { city: 'NYC' } } };
		const clone = cloneViaSerialization(original);

		expect(clone).toEqual(original);
		expect(clone).not.toBe(original);
		expect(clone.user).not.toBe(original.user);
		expect(clone.user.address).not.toBe(original.user.address);
	});

	it('should preserve special types', () => {
		const original = {
			amount: 123456789n,
			createdAt: new Date('2024-01-15'),
			tags: new Set(['a', 'b'])
		};
		const clone = cloneViaSerialization(original);

		expect(clone.amount).toBe(123456789n);
		expect(clone.createdAt instanceof Date).toBe(true);
		expect(clone.createdAt.toISOString()).toBe(original.createdAt.toISOString());
		expect(clone.tags instanceof Set).toBe(true);
		expect(Array.from(clone.tags)).toEqual(['a', 'b']);
	});

	it('should handle arrays', () => {
		const original = [1, 2, { nested: true }];
		const clone = cloneViaSerialization(original);

		expect(clone).toEqual(original);
		expect(clone).not.toBe(original);
		expect(clone[2]).not.toBe(original[2]);
	});
});

describe('roundtrip (stringify + parse)', () => {
	it('should roundtrip complex objects', () => {
		const original = {
			id: 123456789012345678901234567890n,
			name: 'Test',
			createdAt: new Date('2024-01-15T10:30:00.000Z'),
			tags: new Set(['tag1', 'tag2']),
			metadata: new Map([
				['key1', 'value1'],
				['key2', 'value2']
			]),
			nested: {
				bigint: 999n,
				date: new Date('2023-06-01'),
				optional: undefined
			}
		};

		const json = safeStringify(original);
		const restored = safeParse<typeof original>(json);

		expect(restored.id).toBe(original.id);
		expect(restored.name).toBe(original.name);
		expect(restored.createdAt.getTime()).toBe(original.createdAt.getTime());
		expect(Array.from(restored.tags)).toEqual(Array.from(original.tags));
		expect(restored.metadata.get('key1')).toBe('value1');
		expect(restored.nested.bigint).toBe(999n);
		expect(restored.nested.optional).toBeUndefined();
	});
});
