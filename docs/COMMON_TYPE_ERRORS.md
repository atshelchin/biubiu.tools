# 常见类型错误总结

本文档总结了在项目开发中经常出现的类型错误和修复方法，帮助开发者避免重复犯错。

## 📋 目录

1. [Svelte 5 Runes 相关](#svelte-5-runes-相关)
2. [类型转换问题](#类型转换问题)
3. [API 调用错误](#api-调用错误)
4. [响应式集合](#响应式集合)
5. [可访问性 (a11y)](#可访问性-a11y)
6. [ESLint 常见警告](#eslint-常见警告)
7. [CSS 相关](#css-相关)

---

## Svelte 5 Runes 相关

### 1. `<svelte:self>` 已弃用

**❌ 错误代码：**

```svelte
<svelte:self schema={{ fields: field.fields }} />
```

**✅ 正确代码：**

```svelte
<script>
	import Self from './SchemaRenderer.svelte';
</script>

<Self schema={{ fields: field.fields }} />
```

### 2. `<svelte:component>` 已弃用

**❌ 错误代码：**

```svelte
<svelte:component this={option.icon} size={24} />
```

**✅ 正确代码：**

```svelte
{#each options as option}
	{@const Icon = option.icon}
	<Icon size={24} />
{/each}
```

**注意：** `{@const}` 必须直接在 `{#each}`, `{#if}`, `{:else}` 等块内部，不能在子元素中。

### 3. SvelteSet/SvelteMap 不需要 $state 包装

**❌ 错误代码：**

```svelte
let selectedItems = $state(new SvelteSet<string>());
```

**✅ 正确代码：**

```svelte
let selectedItems = new SvelteSet<string>();
```

**原因：** SvelteSet 和 SvelteMap 本身就是响应式的，再包装 $state 是多余的。

### 4. $bindable() 使用

**❌ 错误代码：**

```svelte
interface Props {
  open: boolean;  // 不可绑定
}
let { open }: Props = $props();
```

**✅ 正确代码：**

```svelte
interface Props {
  open?: boolean;
}
let { open = $bindable(false) }: Props = $props();
```

在父组件中使用：

```svelte
<Component bind:open={showDialog} />
```

---

## 类型转换问题

### 1. blockNumber 类型转换

**❌ 错误代码：**

```typescript
const block = await client.getBlock({ blockNumber: log.blockNumber });
// 错误：log.blockNumber 可能是 `0x${string}` 类型
```

**✅ 正确代码：**

```typescript
const blockNumberValue =
	typeof log.blockNumber === 'string' ? BigInt(log.blockNumber) : log.blockNumber;
const block = await client.getBlock({
	blockNumber: blockNumberValue as bigint
});
```

### 2. Address 类型转换

**❌ 错误代码：**

```typescript
const targetAddress = '0x123...'; // string
// 传递给需要 Address 类型的函数
```

**✅ 正确代码：**

```typescript
import type { Address } from 'viem';
const targetAddress = '0x123...' as Address;
```

### 3. BigInt 转换

**❌ 错误代码：**

```typescript
gasUsed: '0.001'; // string，但期望 bigint
```

**✅ 正确代码：**

```typescript
gasUsed: BigInt(1000000000000000);
// 或
gasUsed: BigInt(Math.floor(value * 1e18));
```

---

## API 调用错误

### 1. StepManager API 变更

**❌ 错误代码：**

```typescript
stepManager.previous(); // 旧 API
```

**✅ 正确代码：**

```typescript
stepManager.prev(); // 新 API
```

### 2. ConnectStore API

**❌ 错误代码：**

```typescript
connectStore.currentAddress; // 不存在的属性
```

**✅ 正确代码：**

```typescript
connectStore.address; // 正确的属性名
```

### 3. StepSummary 组件使用

**❌ 错误代码：**

```svelte
<StepSummary items={summaryItems} title="Summary" />
```

**✅ 正确代码：**

```svelte
<StepSummary title="Summary">
	{#each summaryItems as item}
		<div class="summary-item">
			<span>{item.label}</span>
			<strong>{item.value}</strong>
		</div>
	{/each}
</StepSummary>
```

### 4. 统一类型定义

**❌ 错误情况：**
在多个文件中定义相同但不兼容的类型：

```typescript
// 文件 A
type TransactionStatusCallback = (status: {
	stage: 'signing' | 'broadcasting' | 'confirming';
}) => void;

// 文件 B
type TransactionStatusCallback = (status: {
	stage: 'signing' | 'signed' | 'broadcasting' | 'confirmed';
}) => void;
```

**✅ 正确做法：**
在一个共享文件中定义，其他地方导入使用。

---

## 响应式集合

### SvelteSet 和 SvelteMap 的使用

```typescript
import { SvelteSet, SvelteMap } from 'svelte/reactivity';

// ✅ 正确
let selectedIds = new SvelteSet<number>();
let dataMap = new SvelteMap<string, Data>();

// ❌ 错误 - 不要使用普通的 Set/Map
let selectedIds = new Set<number>();
let dataMap = new Map<string, Data>();

// ❌ 错误 - 不要用 $state 包装
let selectedIds = $state(new SvelteSet<number>());
```

---

## 可访问性 (a11y)

### 1. Label 必须关联控件

**❌ 错误代码：**

```svelte
<label>Block Range</label><div>...</div>
```

**✅ 正确代码（方案1 - 改为div）：**

```svelte
<div class="form-label">Block Range</div><div>...</div>
```

**✅ 正确代码（方案2 - 添加for属性）：**

```svelte
<label for="block-range-input">Block Range</label>
<input id="block-range-input" type="text" />
```

### 2. 按钮需要可访问的文本

**❌ 错误代码：**

```svelte
<button onclick={handler}>
	<Icon />
</button>
```

**✅ 正确代码：**

```svelte
<button onclick={handler} aria-label="Close">
	<Icon />
</button>
```

---

## ESLint 常见警告

### 1. 未使用的变量

**❌ 产生警告：**

```typescript
const stepManager = useStepManager(); // 未使用
```

**✅ 方案1 - 删除：**
如果确实不需要，直接删除。

**✅ 方案2 - 添加注释：**

```typescript
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const stepManager = useStepManager();
```

### 2. 解构中未使用的变量

**❌ 产生警告：**

```typescript
const { privateKey: _pk, ...wallet } = data; // _pk 未使用
```

**✅ 正确代码：**

```typescript
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { privateKey: _pk, ...wallet } = data;
```

### 3. 未使用的 Props

**❌ 产生警告：**

```typescript
interface Props {
	id: string; // 在组件中未使用
}
```

**✅ 方案1 - 删除未使用的属性：**

```typescript
interface Props {
	// 移除 id
}
```

**✅ 方案2 - 添加注释：**

```typescript
// eslint-disable-next-line svelte/no-unused-props
interface Props {
	id: string;
}
```

---

## CSS 相关

### 1. 删除未使用的 CSS 选择器

定期检查和删除未使用的 CSS：

```bash
bun run check  # 会显示未使用的选择器
```

### 2. 删除空的 CSS 规则集

**❌ 错误代码：**

```css
.empty-rule {
	/* 所有属性都被注释掉了 */
}
```

**✅ 正确做法：**
直接删除整个规则集。

### 3. 添加标准属性前缀

**⚠️ 警告：**

```css
.text {
	-webkit-background-clip: text;
}
```

**✅ 正确代码：**

```css
.text {
	background-clip: text;
	-webkit-background-clip: text;
}
```

---

## 🔧 开发流程建议

### Pre-commit 检查清单

在提交代码前，务必运行：

```bash
# 1. 格式化代码
bun run format

# 2. 运行 linter
bun run lint

# 3. 类型检查
bun run check
```

确保所有检查都通过（0 errors），警告数量尽可能少。

### 常用修复命令

```bash
# 自动修复 ESLint 问题
bun run lint --fix

# 自动格式化代码
bun run format

# 监听模式下的类型检查
bun run check:watch
```

---

## 📚 参考资源

- [Svelte 5 Migration Guide](https://svelte.dev/docs/svelte/v5-migration-guide)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Viem Documentation](https://viem.sh/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

---

## 📝 维护说明

本文档应该随着项目的发展持续更新。当发现新的常见错误模式时，请添加到相应的章节中。

**最后更新：** 2025-01-18
