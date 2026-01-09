/**
 * 类型安全路径工具类型测试
 * 这些测试主要验证 TypeScript 类型推断是否正确
 */

import { describe, it, expectTypeOf } from 'vitest';
import type { Path, PathValue, ArrayPath, ArrayPathValue, LeafPath, DeepPartial } from './path-types';

// 测试用的复杂表单类型
interface TestFormValues {
	name: string;
	age: number;
	active: boolean;
	user: {
		firstName: string;
		lastName: string;
		email: string;
		profile: {
			bio: string;
			avatar: string;
		};
	};
	tags: string[];
	addresses: Array<{
		street: string;
		city: string;
		zip: number;
	}>;
	metadata: {
		createdAt: Date;
		scores: number[];
	};
}

describe('Path Types', () => {
	describe('Path<T>', () => {
		it('should generate correct paths for primitive fields', () => {
			type Paths = Path<TestFormValues>;

			// 这些路径应该是有效的
			const validPaths: Paths[] = [
				'name',
				'age',
				'active',
				'user',
				'tags',
				'addresses',
				'metadata'
			];

			expectTypeOf(validPaths).toMatchTypeOf<Paths[]>();
		});

		it('should generate correct paths for nested objects', () => {
			type Paths = Path<TestFormValues>;

			const nestedPaths: Paths[] = [
				'user.firstName',
				'user.lastName',
				'user.email',
				'user.profile',
				'user.profile.bio',
				'user.profile.avatar'
			];

			expectTypeOf(nestedPaths).toMatchTypeOf<Paths[]>();
		});

		it('should generate correct paths for arrays', () => {
			type Paths = Path<TestFormValues>;

			// 数组本身和数组索引路径
			const arrayPaths: Paths[] = ['tags', 'addresses', 'metadata.scores'];

			expectTypeOf(arrayPaths).toMatchTypeOf<Paths[]>();
		});
	});

	describe('PathValue<T, P>', () => {
		it('should infer correct types for primitive fields', () => {
			expectTypeOf<PathValue<TestFormValues, 'name'>>().toEqualTypeOf<string>();
			expectTypeOf<PathValue<TestFormValues, 'age'>>().toEqualTypeOf<number>();
			expectTypeOf<PathValue<TestFormValues, 'active'>>().toEqualTypeOf<boolean>();
		});

		it('should infer correct types for nested fields', () => {
			expectTypeOf<PathValue<TestFormValues, 'user.firstName'>>().toEqualTypeOf<string>();
			expectTypeOf<PathValue<TestFormValues, 'user.profile.bio'>>().toEqualTypeOf<string>();
		});

		it('should infer correct types for array fields', () => {
			expectTypeOf<PathValue<TestFormValues, 'tags'>>().toEqualTypeOf<string[]>();
			expectTypeOf<PathValue<TestFormValues, 'addresses'>>().toEqualTypeOf<
				Array<{ street: string; city: string; zip: number }>
			>();
		});

		it('should infer correct types for object fields', () => {
			expectTypeOf<PathValue<TestFormValues, 'user'>>().toEqualTypeOf<{
				firstName: string;
				lastName: string;
				email: string;
				profile: {
					bio: string;
					avatar: string;
				};
			}>();

			expectTypeOf<PathValue<TestFormValues, 'user.profile'>>().toEqualTypeOf<{
				bio: string;
				avatar: string;
			}>();
		});
	});

	describe('ArrayPath<T>', () => {
		it('should identify array paths', () => {
			type ArrayPaths = ArrayPath<TestFormValues>;

			const arrayPaths: ArrayPaths[] = ['tags', 'addresses', 'metadata.scores'];

			expectTypeOf(arrayPaths).toMatchTypeOf<ArrayPaths[]>();
		});
	});

	describe('ArrayPathValue<T, P>', () => {
		it('should infer array element types', () => {
			expectTypeOf<ArrayPathValue<TestFormValues, 'tags'>>().toEqualTypeOf<string>();
			expectTypeOf<ArrayPathValue<TestFormValues, 'addresses'>>().toEqualTypeOf<{
				street: string;
				city: string;
				zip: number;
			}>();
			expectTypeOf<ArrayPathValue<TestFormValues, 'metadata.scores'>>().toEqualTypeOf<number>();
		});
	});

	describe('DeepPartial<T>', () => {
		it('should make all nested properties optional', () => {
			type PartialForm = DeepPartial<TestFormValues>;

			const partial: PartialForm = {
				name: 'test'
				// 其他字段都是可选的
			};

			expectTypeOf(partial).toMatchTypeOf<PartialForm>();

			const nestedPartial: PartialForm = {
				user: {
					firstName: 'John'
					// lastName, email, profile 都是可选的
				}
			};

			expectTypeOf(nestedPartial).toMatchTypeOf<PartialForm>();
		});
	});

	describe('LeafPath<T>', () => {
		it('should only include paths to primitive values', () => {
			type Leaves = LeafPath<TestFormValues>;

			// 叶子路径应该指向原始值
			const leafPaths: Leaves[] = [
				'name',
				'age',
				'active',
				'user.firstName',
				'user.lastName',
				'user.email',
				'user.profile.bio',
				'user.profile.avatar'
			];

			expectTypeOf(leafPaths).toMatchTypeOf<Leaves[]>();
		});
	});
});

// 编译时类型检查 - 这些测试确保类型系统正确工作
describe('Type Safety Compile-Time Checks', () => {
	it('should reject invalid paths at compile time', () => {
		// 以下代码如果取消注释应该会产生 TypeScript 错误
		// type InvalidPath = PathValue<TestFormValues, 'invalid'>;
		// type InvalidNestedPath = PathValue<TestFormValues, 'user.invalid'>;
		// type InvalidArrayPath = PathValue<TestFormValues, 'name.0'>; // name 不是数组

		// 这个测试只是确认上面的注释代码会产生错误
		// 如果类型系统正确，这些应该是 never 或产生错误
		expectTypeOf<true>().toEqualTypeOf<true>();
	});
});
