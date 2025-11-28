# TokenBalanceDisplay Component

可复用的代币余额显示组件，支持智能数字格式化。

## 功能特性

- ✅ **智能数字缩写**：大数字自动使用 K/M/B/T 后缀
- ✅ **精度自适应**：根据数字大小自动调整小数位数
- ✅ **悬停提示**：鼠标悬停显示完整数值
- ✅ **双模式支持**：compact（紧凑）和 full（完整）模式
- ✅ **可自定义样式**：通过 class prop 传递自定义样式

## Props

| 属性       | 类型                  | 必需 | 默认值      | 说明                                |
| ---------- | --------------------- | ---- | ----------- | ----------------------------------- |
| `balance`  | `bigint`              | ✅   | -           | 代币余额（最小单位，如 wei）        |
| `decimals` | `number`              | ✅   | -           | 代币精度（如 ETH=18, USDC=6）       |
| `mode`     | `'compact' \| 'full'` | ❌   | `'compact'` | 显示模式                            |
| `symbol`   | `string`              | ❌   | -           | 代币符号（如 "ETH"）                |
| `class`    | `string`              | ❌   | -           | 自定义 CSS class（可用于颜色/大小） |

## 使用示例

### 基础用法

```svelte
<script>
	import TokenBalanceDisplay from '$lib/components/ui/token-balance-display.svelte';

	let balance = 1234567890123456789012n; // 1234.56 ETH (18 decimals)
</script>

<!-- 显示: 1.23K -->
<TokenBalanceDisplay {balance} decimals={18} />
```

### 显示代币符号

```svelte
<!-- 显示: 724.55M USDC -->
<TokenBalanceDisplay balance={724551000000000n} decimals={6} symbol="USDC" />
```

### 完整模式

```svelte
<!-- 显示: 1,234.567890 -->
<TokenBalanceDisplay balance={1234567890123456789012n} decimals={18} mode="full" />
```

### 自定义样式

```svelte
<TokenBalanceDisplay {balance} decimals={18} symbol="ETH" class="text-green-500 font-bold" />

<style>
	:global(.text-green-500) {
		color: #10b981;
	}
	:global(.font-bold) {
		font-weight: bold;
	}
</style>
```

## 数字格式化规则

### Compact 模式（紧凑）

| 数值范围         | 显示格式   | 示例输入         | 示例输出   |
| ---------------- | ---------- | ---------------- | ---------- |
| >= 1,000,000,000 | 数字 + B/T | 1,234,567,890    | 1.23B      |
| >= 1,000,000     | 数字 + M   | 724,551,000      | 724.55M    |
| >= 1,000         | 数字 + K   | 5,432            | 5.43K      |
| >= 100           | 2 位小数   | 123.456789       | 123.46     |
| >= 1             | 4 位小数   | 12.3456789       | 12.3457    |
| < 1 且 > 0       | 8 位小数   | 0.00012345678912 | 0.00012346 |
| 0                | 0          | 0                | 0          |

### Full 模式（完整）

显示完整数字，带千位分隔符：

- 最少 2 位小数
- 最多 8 位小数
- 自动添加千位分隔符

示例：`1,234,567.89012345`

## 技术细节

- 使用 `tabular-nums` 字体特性确保数字对齐
- 使用等宽字体（Monaco, Courier New）提升可读性
- title 属性始终显示完整数值（用于悬停提示）
- 自动处理 bigint 到 number 的转换
