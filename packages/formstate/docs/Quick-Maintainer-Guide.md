# 维护者快速指南 🔧

> **5分钟速成**：如何快速修改和扩展 FormState

---

## 常见维护任务

### 任务 1: 添加新的验证器

**场景**: 用户需要验证手机号

**步骤**:

1. 打开 `src/core/Validators.ts`
2. 添加新方法：

```typescript
// src/core/Validators.ts
export const Validators = {
	// ... 现有验证器

	// 🆕 新增手机号验证器
	phone(message = 'Invalid phone number'): IValidator<string> {
		return {
			validate(value: string) {
				// 简单的手机号正则（可根据需求调整）
				const phoneRegex = /^1[3-9]\d{9}$/;

				if (!phoneRegex.test(value)) {
					return message;
				}
				return null;
			}
		};
	}
};
```

3. 使用：

```typescript
const form = useFormState({
	fields: {
		phone: {
			validator: Validators.phone('请输入正确的手机号')
		}
	}
});
```

✅ **完成！** 只需修改一个文件。

---

### 任务 2: 添加新的转换器

**场景**: 自动移除所有空格

**步骤**:

1. 打开 `src/core/Transformers.ts`
2. 添加：

```typescript
// src/core/Transformers.ts
export const Transformers = {
	// ... 现有转换器

	// 🆕 移除所有空格
	removeSpaces(): ITransformer<string, string> {
		return {
			transform(value: string): string {
				return value.replace(/\s+/g, '');
			}
		};
	}
};
```

3. 使用：

```typescript
const form = useFormState({
	fields: {
		idNumber: {
			transformer: Transformers.removeSpaces()
		}
	}
});
```

---

### 任务 3: 修复一个Bug

**场景**: 用户报告 reset() 后某个状态没清除

**步骤**:

1. **复现问题**:

```typescript
// 创建测试用例
const form = useFormState({ ... });
form.setValue('email', 'test');
console.log('before reset:', form.getFieldState('email'));

form.reset();
console.log('after reset:', form.getFieldState('email'));
// 检查输出，看哪个状态没清除
```

2. **定位代码**:
   打开 `FormStateManager.ts`，搜索 `reset()` 方法（约330行）

3. **修复**:

```typescript
reset(newInitialValues?: Record<string, FieldValue>): void {
  // ...

  this.fieldStates.forEach((state, path) => {
    const value = PathUtils.get(this.initialValues, path);
    this.fieldStates.set(path, {
      value,
      error: null,
      touched: false,
      dirty: false,
      validating: false,
      // 🆕 如果有新状态需要清除，在这里添加
      someNewState: null
    });
  });
}
```

4. **测试**:

```bash
bun run check  # 类型检查
bun run dev    # 手动测试
```

---

### 任务 4: 添加新的表单级方法

**场景**: 用户需要 `clearErrors()` 方法

**步骤**:

1. **定义接口** (`src/core/interfaces.ts`):

```typescript
export interface IFormStateManager {
	// ... 现有方法

	// 🆕 清除所有错误
	clearErrors(): void;
}
```

2. **实现方法** (`src/core/FormStateManager.ts`):

```typescript
export class FormStateManager implements IFormStateManager {
	// ... 现有方法

	// 🆕 实现清除错误
	clearErrors(): void {
		this.fieldStates.forEach((state, path) => {
			if (state.error) {
				this.fieldStates.set(path, {
					...state,
					error: null
				});
			}
		});

		// 通知观察者
		this.observers.forEach((observer) => {
			observer.onFormValidation?.({});
		});
	}
}
```

3. **暴露到 Svelte API** (`src/adapters/svelte/useFormState.svelte.ts`):

```typescript
export function useFormState(config: IFormConfig = {}) {
	const manager = new FormStateManager(config);

	return {
		// ... 现有方法

		// 🆕 暴露清除错误
		clearErrors: manager.clearErrors.bind(manager)
	};
}
```

4. **使用**:

```svelte
<script>
const form = useFormState({ ... });

function handleClearErrors() {
  form.clearErrors();
}
</script>

<button onclick={handleClearErrors}>清除所有错误</button>
```

---

### 任务 5: 优化性能

**场景**: PathUtils.get() 被频繁调用，需要缓存

**步骤**:

1. 打开 `src/utils/PathUtils.ts`
2. 添加 LRU 缓存：

```typescript
// PathUtils.ts

// 🆕 添加缓存
const pathCache = new Map<string, string[]>();
const MAX_CACHE_SIZE = 100;

export const PathUtils = {
	// 🆕 路径解析（缓存）
	parsePath(path: FieldPath): string[] {
		let keys = pathCache.get(path);

		if (!keys) {
			// 解析路径：'user.profile[0].name' → ['user', 'profile', '0', 'name']
			keys = path.split(/[.\[\]]+/).filter(Boolean);

			// LRU: 超过限制删除最旧的
			if (pathCache.size >= MAX_CACHE_SIZE) {
				const firstKey = pathCache.keys().next().value;
				pathCache.delete(firstKey);
			}

			pathCache.set(path, keys);
		}

		return keys;
	},

	get(obj: unknown, path: FieldPath): FieldValue {
		// ✅ 使用缓存的解析结果
		const keys = this.parsePath(path);

		let current = obj;
		for (const key of keys) {
			if (current == null) return undefined;
			current = (current as Record<string, unknown>)[key];
		}
		return current as FieldValue;
	}

	// set() 和其他方法也使用 parsePath()
};
```

3. **性能测试**:

```typescript
// 测试脚本
const start = performance.now();
for (let i = 0; i < 10000; i++) {
	PathUtils.get(data, 'user.profile.name');
}
const duration = performance.now() - start;
console.log('Duration:', duration, 'ms');
```

**预期提升**: 50ms → 5ms (10x faster)

---

## 常见问题排查

### 问题 1: UI 不更新

**症状**: 调用 `form.setValue()` 后，界面没变化

**排查步骤**:

1. **检查订阅**:

```typescript
console.log('Observers:', form._manager['observers'].size);
// 应该 > 0
```

2. **检查 destroy()**:

```svelte
<script>
const form = useFormState({ ... });

onDestroy(() => {
  form.destroy();  // ✅ 确保只在组件销毁时调用
});
</script>
```

3. **检查响应式依赖**:

```svelte
<!-- ❌ 错误：没有建立响应式依赖 -->
<div>{form._manager.getValue('email')}</div>

<!-- ✅ 正确：通过 getter 建立依赖 -->
<div>{form.getValue('email')}</div>
```

---

### 问题 2: 验证没触发

**排查**:

1. **检查配置**:

```typescript
console.log('Field config:', form._manager.fieldConfigs.get('email'));
console.log('validateOnChange:', form._manager.config.validateOnChange);
```

2. **检查验证器**:

```typescript
const config = form._manager.fieldConfigs.get('email');
if (!config?.validator) {
	console.warn('No validator registered!');
}
```

3. **手动触发**:

```typescript
await form.validateField('email');
console.log('Error:', form.getFieldState('email').error);
```

---

### 问题 3: 异步验证卡住

**症状**: `validating` 状态一直是 `true`

**排查**:

1. **检查 AbortController**:

```typescript
const controllers = form._manager['validationAbortControllers'];
console.log('Active validations:', controllers.size);
```

2. **手动取消**:

```typescript
const controller = controllers.get('email');
controller?.abort();
```

3. **检查验证器错误**:

```typescript
const validator = {
	async validate(value) {
		try {
			const response = await fetch('...');
			// ✅ 确保有 return
			return response.ok ? null : 'Error';
		} catch (err) {
			console.error('Validator error:', err);
			return 'Validation failed'; // ✅ 错误处理
		}
	}
};
```

---

## 开发工作流

### 1. 启动开发服务器

```bash
bun run dev
```

浏览器访问: http://localhost:5173/examples

### 2. 修改代码

文件位置：

- **核心逻辑**: `packages/formstate/src/core/`
- **Svelte 适配**: `packages/formstate/src/adapters/svelte/`
- **工具函数**: `packages/formstate/src/utils/`

### 3. 热重载

保存文件后，Vite 自动重载，无需刷新浏览器。

### 4. 类型检查

```bash
bun run check   # TypeScript 类型检查
bun run lint    # ESLint + Prettier
```

### 5. 提交代码

```bash
git add .
git commit -m "feat: 添加 XXX 功能"
```

---

## 代码规范

### 命名约定

- **接口**: `IFormStateManager`, `IValidator`
- **类型**: `FieldPath`, `FieldValue`
- **方法**: camelCase (`setValue`, `validateField`)
- **私有属性**: `private values`, `private observers`

### 注释规范

````typescript
/**
 * 设置字段的值
 *
 * @param path 字段路径，如 'email' 或 'user.profile.name'
 * @param value 新值
 * @param shouldValidate 是否触发验证（默认 true）
 *
 * @example
 * ```typescript
 * form.setValue('email', 'test@example.com');
 * form.setValue('user.age', 25, false); // 不验证
 * ```
 */
setValue(path: FieldPath, value: FieldValue, shouldValidate = true): void {
  // 实现...
}
````

### 错误处理

```typescript
// ❌ 不好：吞掉错误
try {
	await validator.validate(value);
} catch (err) {
	// 空的
}

// ✅ 好：记录日志
try {
	await validator.validate(value);
} catch (err) {
	debug.error('[validateField] Error:', err);
	return 'Validation failed';
}
```

---

## 测试策略

### 单元测试（TODO）

```typescript
// validators.test.ts
import { Validators } from './Validators';

test('required validator', () => {
	const validator = Validators.required('Required');

	expect(validator.validate('')).toBe('Required');
	expect(validator.validate('hello')).toBe(null);
});
```

### 集成测试（手动）

1. 打开 `examples/` 中的示例
2. 测试所有交互：输入、提交、重置
3. 检查浏览器控制台是否有错误

### 回归测试

修复 Bug 后，添加示例到 `examples/bug-fixes-demo/`：

```svelte
<!-- 测试 Bug 10: getDirtyValues() -->
<script>
	const form = useFormState({
		fields: {
			'user.name': { defaultValue: '' },
			'user.email': { defaultValue: '' }
		}
	});

	form.setValue('user.name', 'Alice');
	const dirtyValues = form._manager.getDirtyValues();

	console.log('Dirty values:', dirtyValues);
	// ✅ 应该输出: { user: { name: 'Alice' } }
	// ❌ 修复前: {}
</script>
```

---

## 发布流程（TODO）

1. **更新版本号** (`package.json`)
2. **运行测试**: `bun run check && bun run lint`
3. **构建**: `bun run build`
4. **发布**: `npm publish`

---

## 获取帮助

### 文档

- [Architecture.md](./Architecture.md) - 架构详解（30分钟）
- [ultra-deep-analysis-v2.md](./ultra-deep-analysis-v2.md) - 深度分析报告

### 调试技巧

启用调试日志：

```typescript
// src/utils/debug.ts
export const debug = {
	enabled: true // ← 改为 true
	// ...
};
```

检查内部状态：

```javascript
// 浏览器控制台
console.log('Values:', form._manager.getValues());
console.log('Errors:', form._manager.getErrors());
console.log('Field states:', Array.from(form._manager['fieldStates'].entries()));
```

---

## 快速参考

### 核心文件

| 文件                     | 行数 | 职责              |
| ------------------------ | ---- | ----------------- |
| `FormStateManager.ts`    | 650  | 核心状态管理      |
| `useFormState.svelte.ts` | 130  | Svelte 响应式适配 |
| `interfaces.ts`          | 130  | 类型定义          |
| `PathUtils.ts`           | 150  | 路径操作          |
| `Validators.ts`          | 100  | 内置验证器        |

### 关键方法

| 方法              | 用途         | 调用频率       |
| ----------------- | ------------ | -------------- |
| `setValue()`      | 设置字段值   | 极高           |
| `validateField()` | 验证单个字段 | 高             |
| `validateForm()`  | 验证整个表单 | 中             |
| `reset()`         | 重置表单     | 低             |
| `subscribe()`     | 订阅变化     | 低（初始化时） |

---

**维护愉快！** 🎉

有问题？查看 [Architecture.md](./Architecture.md) 或提 Issue。
