# FormState

一个功能强大、类型安全的表单状态管理库，支持递归嵌套、动态字段、异步验证。

## 特性

✅ **接口先行** - 面向接口编程，易于扩展和测试
✅ **框架适配** - 核心逻辑框架无关，提供 Svelte 5 适配器
✅ **Svelte 5 Runes** - 使用最新的 Svelte 5 响应式 API
✅ **递归嵌套** - 支持深层对象和数组（`user.addresses[0].street`）
✅ **动态字段** - 运行时添加/删除字段
✅ **异步验证** - 支持异步验证器，自动防抖和取消
✅ **可组合 UI** - Headless 组件 + 可选 UI 组件
✅ **Schema 驱动** - 支持配置驱动的表单渲染
✅ **TypeScript** - 完整的类型支持

## 安装

```bash
npm install @biubiu/formstate
```

## 基础用法

### 1. 手动控制字段（推荐）

用户完全控制渲染哪些字段，最灵活：

```svelte
<script lang="ts">
	import { useFormState, Form, FormField, Validators } from '@biubiu/formstate';

	const form = useFormState({
		fields: {
			email: {
				defaultValue: '',
				validator: Validators.compose(Validators.required(), Validators.email())
			},
			password: {
				defaultValue: '',
				validator: Validators.compose(Validators.required(), Validators.minLength(8))
			}
		}
	});

	async function handleSubmit(values: Record<string, unknown>) {
		console.log('Submitted:', values);
	}
</script>

<Form {form} onSubmit={handleSubmit}>
	<FormField name="email" label="Email">
		{#snippet children({ value, onInput, onBlur })}
			<input type="email" {value} oninput={(e) => onInput(e.currentTarget.value)} onblur={onBlur} />
		{/snippet}
	</FormField>

	<FormField name="password" label="Password">
		{#snippet children({ value, onInput, onBlur })}
			<input
				type="password"
				{value}
				oninput={(e) => onInput(e.currentTarget.value)}
				onblur={onBlur}
			/>
		{/snippet}
	</FormField>

	<button type="submit" disabled={!form.isValid}>Submit</button>
</Form>
```

### 2. Headless 组件（完全自定义 UI）

使用 `Field` 组件获得完全的 UI 控制权：

```svelte
<script lang="ts">
	import {
		useFormState,
		Form,
		Field,
		FieldLabel,
		FieldError,
		FieldValidating
	} from '@biubiu/formstate';

	const form = useFormState();
</script>

<Form {form}>
	<Field name="username">
		{#snippet children({ value, error, touched, validating, setValue, setTouched })}
			<div class="my-custom-field">
				<FieldLabel required>Username</FieldLabel>

				<input
					type="text"
					{value}
					class:error={touched && error}
					oninput={(e) => setValue(e.currentTarget.value)}
					onblur={() => setTouched()}
				/>

				<FieldError {error} show={touched} />
				<FieldValidating show={validating} />
			</div>
		{/snippet}
	</Field>
</Form>
```

### 3. 动态数组字段

使用 `FieldArray` 管理动态列表：

```svelte
<script lang="ts">
	import { Form, FieldArray, FormField } from '@biubiu/formstate';
</script>

<Form {form}>
	<FieldArray name="addresses">
		{#snippet children({ fields, append, remove })}
			<div class="addresses-list">
				<h3>Addresses</h3>

				{#each fields as field (field.key)}
					<div class="address-item">
						<FormField name="{field.name}.street" label="Street">
							{#snippet children({ value, onInput, onBlur })}
								<input
									type="text"
									{value}
									oninput={(e) => onInput(e.currentTarget.value)}
									onblur={onBlur}
								/>
							{/snippet}
						</FormField>

						<FormField name="{field.name}.city" label="City">
							{#snippet children({ value, onInput, onBlur })}
								<input
									type="text"
									{value}
									oninput={(e) => onInput(e.currentTarget.value)}
									onblur={onBlur}
								/>
							{/snippet}
						</FormField>

						<button type="button" onclick={() => remove(field.index)}>Remove</button>
					</div>
				{/each}

				<button type="button" onclick={() => append({ street: '', city: '' })}>
					Add Address
				</button>
			</div>
		{/snippet}
	</FieldArray>
</Form>
```

### 4. Schema 驱动（可选）

使用配置自动渲染表单：

```svelte
<script lang="ts">
	import { Form, Validators } from '@biubiu/formstate';
	import type { FormSchema } from '@biubiu/formstate';

	const schema: FormSchema = {
		layout: 'vertical',
		fields: [
			{
				name: 'name',
				type: 'text',
				label: 'Full Name',
				required: true,
				validator: Validators.required()
			},
			{
				name: 'email',
				type: 'email',
				label: 'Email',
				required: true,
				validator: Validators.compose(Validators.required(), Validators.email())
			},
			{
				name: 'role',
				type: 'select',
				label: 'Role',
				options: [
					{ label: 'User', value: 'user' },
					{ label: 'Admin', value: 'admin' }
				]
			},
			{
				name: 'addresses',
				type: 'array',
				label: 'Addresses',
				itemSchema: {
					name: 'address',
					type: 'group',
					fields: [
						{ name: 'street', type: 'text', label: 'Street' },
						{ name: 'city', type: 'text', label: 'City' }
					]
				}
			}
		]
	};
</script>

<Form {schema} onSubmit={handleSubmit} />
```

## 自定义验证器

```typescript
import { createValidator, createCustomValidator, Validators } from '@biubiu/formstate';

// 简单自定义验证
const passwordMatch = createValidator((value, allValues) => {
	if (value !== allValues.password) {
		return 'Passwords do not match';
	}
	return null;
});

// 异步验证（如检查用户名是否可用）
const usernameAvailable = createCustomValidator(async (value) => {
	const response = await fetch(`/api/check-username?username=${value}`);
	const data = await response.json();
	return data.available;
}, 'Username is already taken');

// 使用
const form = useFormState({
	fields: {
		username: {
			validator: Validators.compose(
				Validators.required(),
				Validators.minLength(3),
				usernameAvailable
			)
		},
		confirmPassword: {
			validator: passwordMatch,
			dependencies: ['password'] // 当 password 变化时重新验证
		}
	}
});
```

## API

### useFormState(config)

创建表单状态管理器。

**响应式状态:**

- `form.values` - 所有字段值
- `form.errors` - 所有错误
- `form.isDirty` - 是否有修改
- `form.isValid` - 是否验证通过
- `form.isValidating` - 是否验证中

**方法:**

- `form.setValue(path, value)` - 设置字段值
- `form.getValue(path)` - 获取字段值
- `form.validateField(path)` - 验证单个字段
- `form.validateForm()` - 验证整个表单
- `form.submit(onSubmit)` - 提交表单
- `form.reset()` - 重置表单

### 组件

- **Form** - 表单根组件，提供上下文
- **Field** - Headless 字段组件（无样式）
- **FormField** - 带样式的字段组件
- **FieldArray** - 动态数组字段
- **SchemaRenderer** - Schema 驱动渲染器

### UI 组件

- **FieldLabel** - 标签组件
- **FieldError** - 错误提示组件
- **FieldDescription** - 描述文本组件
- **FieldValidating** - 验证中指示器（带动画）

## 架构设计

```
packages/formstate/
├── src/
│   ├── core/                    # 框架无关的核心逻辑
│   │   ├── interfaces.ts        # 接口定义（接口先行）
│   │   ├── FormStateManager.ts  # 状态管理器实现
│   │   ├── Validators.ts        # 验证器系统
│   │   └── Transformers.ts      # 值转换器
│   ├── utils/
│   │   └── PathUtils.ts         # 路径工具（支持递归）
│   └── adapters/
│       └── svelte/              # Svelte 5 适配器
│           ├── useFormState.svelte.ts  # Runes API
│           ├── schema.ts        # Schema 定义
│           └── components/      # Svelte 组件
│               ├── Form.svelte
│               ├── Field.svelte
│               ├── FormField.svelte
│               ├── FieldArray.svelte
│               └── ui/          # 可组合 UI 组件
│                   ├── FieldLabel.svelte
│                   ├── FieldError.svelte
│                   ├── FieldDescription.svelte
│                   └── FieldValidating.svelte
```

## License

MIT
