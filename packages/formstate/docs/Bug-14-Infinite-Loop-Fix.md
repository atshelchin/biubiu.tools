# Bug 14: Dynamic Field Registration Infinite Loop

## 问题描述

当使用 `{#if}` 条件渲染 `FormField` 组件时，切换显示/隐藏会导致页面冻结，浏览器抛出 `effect_update_depth_exceeded` 错误。

**触发条件**：

```svelte
<Form formState={form}>
	{#if showOptionalField}
		<FormField name="optionalField" label="Optional Field">
			<!-- ... -->
		</FormField>
	{/if}
</Form>
```

当 `showOptionalField` 从 `false` 变为 `true` 时，页面进入无限循环。

## 根本原因

### 问题链路

1. **动态字段注册触发观察者通知**
   - `FormField` 组件 `onMount` → `registerField('optionalField')`
   - `registerField` 内部调用 `PathUtils.set` 更新 `this.values`
   - ❌ **关键错误**：然后调用 `observer.onFieldChange(path, defaultValue)`

2. **全局版本号递增**
   - `useFormState.svelte.ts` 的 `onFieldChange` 回调被触发
   - `state.fieldStatesVersion++` (Line 52)
   - 这是一个全局计数器，影响所有字段

3. **所有 FormField 组件重新计算**
   - 每个 `FormField` 都有 `$derived(formState.getFieldState(name))`
   - `getFieldState` 内部访问 `state.fieldStatesVersion` (Line 86)
   - Svelte 5 的 `$derived` 检测到 `fieldStatesVersion` 变化 → 重新计算

4. **依赖验证触发循环**
   - `maxValue` 字段有 `dependencies: ['minValue']`
   - 重新计算时，依赖字段的验证可能被触发
   - 验证调用 `onFieldValidation` → `fieldStatesVersion++` (Line 58)
   - 回到步骤 3 → **无限循环**

### 代码追踪

**问题代码 1**: `FormStateManager.ts` (修复前)

```typescript
registerField(path: FieldPath, config: IFieldConfig = {}): void {
  // ...
  if (defaultValue !== undefined) {
    this.values = PathUtils.set(this.values, path, defaultValue); // 更新值
  }

  // ❌ 触发观察者，导致 fieldStatesVersion++
  if (isNewField && defaultValue !== undefined) {
    this.observers.forEach((observer) => {
      observer.onFieldChange?.(path, defaultValue);
    });
  }
}
```

**问题代码 2**: `useFormState.svelte.ts`

```typescript
const unsubscribe = manager.subscribe({
	onFieldChange: (path, value) => {
		const newValues = manager.getValues();
		state.values = newValues;
		state.fieldStatesVersion++; // ❌ 全局版本号，影响所有 FormField
	},
	onFieldValidation: () => {
		state.errors = manager.getErrors();
		state.fieldStatesVersion++; // ❌ 再次递增
	}
});
```

**问题代码 3**: `FormField.svelte`

```typescript
const fieldState = $derived(formState.getFieldState(name)); // 依赖 fieldStatesVersion
const value = $derived(PathUtils.get(formState.values, name));
```

**问题代码 4**: `useFormState.svelte.ts` 的 `getFieldState`

```typescript
getFieldState: (path: FieldPath) => {
	state.fieldStatesVersion; // ← 任何字段变化都会触发所有 FormField 重算
	const fieldState = manager.getFieldState(path);
	return { ...fieldState, value: PathUtils.get(state.values, path) };
};
```

## 修复方案

### Bug 14 修复

**移除 `registerField` 中的观察者通知**

```typescript
registerField(path: FieldPath, config: IFieldConfig = {}): void {
  // ...
  if (defaultValue !== undefined) {
    // ✅ 使用 Immer produce 保证不可变性
    this.values = produce(this.values, (draft) => {
      PathUtils.setMutable(draft, path, defaultValue);
    });

    this.initialValues = produce(this.initialValues, (draft) => {
      PathUtils.setMutable(draft, path, defaultValue);
    });
  }

  // ✅ 不调用 observer.onFieldChange，避免触发 fieldStatesVersion++
  // FormField 的 $derived(formState.values) 会自动检测到新字段
}
```

### 为什么这个修复有效？

1. **不触发全局版本号递增**
   - `registerField` 不再调用 `observer.onFieldChange`
   - `fieldStatesVersion` 保持稳定

2. **Svelte 5 自动检测值变化**
   - `FormField` 的 `$derived(PathUtils.get(formState.values, name))` 会自动检测到新字段
   - 因为 `this.values` 被 `produce` 更新为新引用
   - Svelte 5 的响应式系统会检测到 `state.values` 变化

3. **避免连锁反应**
   - 只有新字段的 `FormField` 会更新
   - 其他字段的 `FormField` 不会因为 `fieldStatesVersion` 递增而重新计算

## 测试验证

### 测试场景

1. 点击"Show Optional Field"按钮
2. `showOptionalField` 变为 `true`
3. `FormField` 组件挂载并注册字段
4. **期望结果**：页面正常渲染，无冻结
5. 点击"Hide Optional Field"按钮
6. `FormField` 组件卸载并注销字段
7. **期望结果**：fieldStates 数量减 1

### 验证代码

```svelte
<script>
	let showOptionalField = $state(false);

	const form = useFormState({
		validateOnChange: false, // 已禁用，防止其他循环
		validateOnBlur: true,
		fields: {
			minValue: { defaultValue: 10, validator: Validators.required() },
			maxValue: {
				defaultValue: 20,
				validator: {
					validate: (value, values) => {
						/* ... */
					}
				},
				dependencies: ['minValue'] // 依赖字段
			}
		}
	});
</script>

<button onclick={() => (showOptionalField = !showOptionalField)}>
	{showOptionalField ? 'Hide' : 'Show'} Optional Field
</button>

<Form formState={form}>
	{#if showOptionalField}
		<FormField name="optionalField" label="Optional Field">
			<!-- ... -->
		</FormField>
	{/if}
</Form>

<p>Field States Count: {form._manager.fieldStates.size}</p>
```

## 相关 Bug

### Bug 13: validateDependentFields 无限循环

- **问题**：`validateDependentFields` 调用 `observer.onFieldChange` 导致无限循环
- **修复**：移除 `validateDependentFields` 中的 `onFieldChange` 调用
- **关联**：Bug 13 和 Bug 14 都是因为过度调用 `observer.onFieldChange`

### Bug 4: 依赖字段验证不触发

- **问题**：依赖字段值变化时，被依赖字段的验证不执行
- **修复**：`validateDependentFields` 调用 `validateField` 并通知观察者
- **副作用**：引入了 Bug 13（后续修复）

## 设计反思

### 全局版本号的局限性

**问题**：

- `fieldStatesVersion` 是全局计数器
- 任何字段变化都会触发所有 `FormField` 的 `$derived` 重新计算
- 在大型表单中（100+ 字段），性能影响显著

**潜在优化**（Phase 2）：

```typescript
// 字段级版本号
const state = $state({
	values: {},
	errors: {},
	fieldVersions: new Map<FieldPath, number>() // 每个字段独立版本号
});

getFieldState: (path: FieldPath) => {
	const version = state.fieldVersions.get(path) ?? 0; // 只访问本字段版本
	const fieldState = manager.getFieldState(path);
	return { ...fieldState, version };
};
```

### Observer 通知的时机

**原则**：

- ✅ **用户操作**触发通知：`setValue`, `setFieldTouched`, `validateField`
- ❌ **内部初始化**不触发通知：`registerField`, `reset` (部分)
- ✅ **批量操作**合并通知：`batchUpdate`

## 总结

Bug 14 是 Svelte 5 响应式系统与表单状态管理交互的经典案例：

1. **全局状态变化**（`fieldStatesVersion++`）触发**全局重新计算**（所有 `$derived`）
2. **动态组件挂载**（`registerField`）不应该触发**观察者通知**
3. **依赖字段验证**需要**精确控制**通知时机，避免连锁反应

修复后，动态字段注册不再触发全局重新计算，避免了无限循环，同时 Svelte 5 的响应式系统仍能正确检测到值变化。

---

**修复提交**: [Commit Hash]
**测试页面**: `/examples/bug-fixes-demo` (Bug 2 测试部分)
**相关文档**: [Bug 13 修复文档](./Bug-13-Fix.md)
