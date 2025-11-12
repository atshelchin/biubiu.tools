# Lessons Learned: Svelte 5 Reactivity with Immer

## Problem Summary

在实现表单实时预览功能时，遇到了深层嵌套字段（如 `config.metadata.tags[0]`）不触发响应式更新的问题。调试过程发现了两个关键 bug。

## Root Causes

### Bug 1: 错误的组件 Prop 名称 ⚠️

**问题代码**：

```svelte
<!-- +page.svelte -->
const form = useFormState({ fields: {...} });

<Form {form} onSubmit={handleSubmit}>
  <!-- ... -->
</Form>
```

```svelte
<!-- Form.svelte -->
interface Props {
  formState?: FormState;  // 期望的 prop 名
  // ...
}

let { formState: externalFormState, ... }: Props = $props();

// 如果没传入 formState，创建一个新的
const formState = externalFormState || useFormState(config);
```

**后果**：

- 页面传递 `{form}`，但 Form 组件期望 `formState`
- `externalFormState` 为 `undefined`
- 触发 fallback 逻辑：`useFormState(config)` 其中 `config = {}`
- 创建了**第二个空的 FormStateManager 实例**
- 第二个实例的 `this.values = {}`，导致所有表单数据丢失

**解决方案**：

```svelte
<!-- 正确的 prop 名称 -->
<Form formState={form} onSubmit={handleSubmit}>
```

**教训**：

- ⚠️ **Svelte 5 的 `$props()` 不会在 prop 名称错误时报错**
- ⚠️ **使用 TypeScript 也无法捕获这类错误，因为 `{form}` 语法糖会被解释为 `form={form}`**
- ✅ 始终明确写出 prop 名称：`propName={value}` 而不是简写 `{value}`
- ✅ 在开发时添加 console.log 检查关键 props 是否正确传递
- ✅ 为可选 props 提供明确的 fallback 时要小心，可能会隐藏传递错误

### Bug 2: Immer draft 对象的错误使用 ⚠️

**问题代码**：

```typescript
// PathUtils.set() 返回新对象，不修改原对象
set(obj: unknown, path: string, value: unknown): unknown {
  const root = { ...(obj as object) };
  // ... 深度复制并设置值
  return root;  // 返回新对象
}

// 错误的 Immer 使用
setValue(path: string, value: unknown): void {
  this.values = produce(this.values, (draft) => {
    PathUtils.set(draft, path, value);  // ❌ 返回值被丢弃！
    // draft 本身没有被修改
  });
}
```

**后果**：

- Immer 的 `draft` 对象期望被**直接修改**（mutable operations）
- `PathUtils.set()` 返回新对象但不修改 draft
- 返回值被忽略，导致 `produce()` 返回未修改的对象
- 表单值没有更新

**解决方案**：

```typescript
// 新增专门用于 Immer draft 的方法
setMutable(obj: unknown, path: string, value: unknown): void {
  const keys = parsePath(path);
  let current: any = obj;

  // 直接修改对象，不创建副本
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (current[key] == null) {
      current[key] = isArrayIndex(keys[i + 1]) ? [] : {};
    }
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;  // 直接赋值
}

// 正确的 Immer 使用
setValue(path: string, value: unknown): void {
  this.values = produce(this.values, (draft) => {
    PathUtils.setMutable(draft, path, value);  // ✅ 直接修改 draft
  });
}
```

**教训**：

- ⚠️ **Immer 的 `produce()` 期望在 draft 上执行 mutable operations**
- ⚠️ **不要在 draft 上使用返回新对象的不可变更新函数**
- ✅ Immer draft 模式：`draft.foo = value` 或 `draft.arr.push(item)`
- ✅ 传统不可变模式：`obj = { ...obj, foo: value }` 或 `arr = [...arr, item]`
- ✅ 这两种模式不能混用

## Svelte 5 Reactivity 核心原理

### 为什么需要 Immer？

**问题**：Svelte 5 通过**引用相等性**检测变化

```typescript
// ❌ 不会触发响应式更新
const state = $state({ nested: { value: 1 } });
state.nested.value = 2; // 修改了深层属性，但 state.nested 引用未变

// ✅ 会触发响应式更新
state.nested = { ...state.nested, value: 2 }; // 创建新的 nested 对象
```

**手动不可变更新的问题**：

```typescript
// 深层嵌套需要大量样板代码
this.values = {
	...this.values,
	config: {
		...this.values.config,
		metadata: {
			...this.values.config.metadata,
			tags: [...this.values.config.metadata.tags, newTag]
		}
	}
};
```

**Immer 的优势**：

```typescript
// 简洁的语法 + 自动结构共享
this.values = produce(this.values, (draft) => {
	draft.config.metadata.tags.push(newTag);
});
```

- 只复制修改路径上的对象
- 未修改的部分保持相同引用（节省内存）
- 代码更简洁、更接近 mutable 写法

### Getter 无法追踪深层变化

**问题代码**：

```typescript
const state = $state({ values: {...} });

return {
  get values() { return state.values; }  // ❌ Getter 不会触发追踪
};
```

**为什么不工作**：

- Svelte 5 在访问 getter 时创建快照
- 后续对 `state.values` 的修改不会触发 getter 重新求值
- `$derived` 无法追踪到深层属性变化

**解决方案**：

```typescript
const state = $state({ values: {...} });

manager.subscribe({
  onFieldChange: () => {
    state.values = manager.getValues();  // ✅ 直接赋值新对象
  }
});

return {
  get values() { return state.values; }  // 现在 state.values 本身会变化
};
```

## Best Practices

### 1. 明确的 Prop 传递

```svelte
<!-- ✅ 或确保变量名与 prop 名完全一致 -->
<script>
	const formState = useFormState();
</script>

<!-- ❌ 避免使用简写，容易出错 -->
<Component {propName} />

<!-- ✅ 明确写出 prop 名称 -->
<Component propName={value} />
<Form {formState} />
<!-- 此时简写安全 -->
```

### 2. 调试多实例问题

```typescript
// 添加实例计数器
let instanceCounter = 0;

export function useFormState(config: IFormConfig = {}) {
	const instanceId = ++instanceCounter;
	console.log(`[useFormState #${instanceId}] Created`);

	// 在关键方法中记录 instanceId
	manager.subscribe({
		onFieldChange: (path) => {
			console.log(`[Instance #${instanceId}] Field changed:`, path);
		}
	});
}
```

### 3. Immer 使用模式

```typescript
// ✅ 正确：直接修改 draft
produce(state, (draft) => {
	draft.foo = 'bar';
	draft.arr.push(item);
	draft.nested.value = 123;
});

// ❌ 错误：在 draft 上使用不可变更新函数
produce(state, (draft) => {
	draft = { ...draft, foo: 'bar' }; // 错误！draft 重新赋值无效
	const result = set(draft, 'path', value); // 错误！返回值被忽略
});

// ✅ 如果必须使用返回值，需要 return
produce(state, (draft) => {
	return set(draft, 'path', value); // 替换整个 draft
});
```

### 4. 响应式状态管理

```typescript
// ✅ 使用 $state 包装，通过重新赋值触发更新
const state = $state({
	values: initialValues
});

manager.subscribe({
	onFieldChange: () => {
		state.values = manager.getValues(); // 新对象引用
	}
});

return {
	get values() {
		return state.values;
	}
};
```

## Debugging Checklist

遇到响应式更新问题时，按以下顺序检查：

1. **[ ] Props 是否正确传递？**
   - 添加 `console.log` 检查 props 值
   - 确认 prop 名称与组件定义一致

2. **[ ] 是否有多个实例？**
   - 添加实例计数器
   - 检查是否有意外的 fallback 创建

3. **[ ] 对象引用是否改变？**
   - `console.log(Object.is(oldValue, newValue))`
   - 应该返回 `false` 才能触发响应式

4. **[ ] Immer draft 是否正确修改？**
   - 在 `produce()` 内部添加 `console.log`
   - 检查 draft 被修改后的状态
   - 确保使用 mutable operations

5. **[ ] $state 是否正确更新？**
   - 检查 state 对象的引用是否改变
   - 不要依赖 getter 自动追踪深层变化

## Performance Notes

**Immer 的性能特点**：

- ✅ 结构共享（structural sharing）- 只复制修改的路径
- ✅ 避免手动深拷贝的样板代码
- ⚠️ 对于大型对象有一定开销（Proxy）
- ⚠️ 不适合高频更新（如拖拽、动画）

**何时使用 Immer**：

- ✅ 复杂的嵌套状态更新
- ✅ 表单管理（中等更新频率）
- ✅ 配置对象管理
- ❌ 实时动画/游戏循环
- ❌ 简单的顶层属性更新

## References

- [Svelte 5 Runes Documentation](https://svelte-5-preview.vercel.app/docs/runes)
- [Immer Documentation](https://immerjs.github.io/immer/)
- [Svelte 5 Reactivity Deep Dive](https://svelte.dev/blog/runes)

## Summary

**关键要点**：

1. ⚠️ Svelte 5 组件 prop 名称错误不会报错，使用明确的 `prop={value}` 语法
2. ⚠️ Immer draft 必须直接修改，不能使用返回新对象的函数
3. ✅ Svelte 5 响应式依赖对象引用变化，Immer 自动处理
4. ✅ 使用实例计数器和详细日志来调试多实例问题
5. ✅ 不要依赖 getter 追踪深层变化，通过重新赋值触发更新
