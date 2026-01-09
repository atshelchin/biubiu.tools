# FormState 示例总结

本目录包含 **17 个示例**，展示 FormState 表单状态管理库的各种功能。示例按由浅入深排序。

---

## 入门级 (Beginner)

### 1. Basic Form - 基础表单
**路径**: `basic-form/+page.svelte`

最简单的入门示例，展示 FormState 核心功能。

**功能演示**:
- 邮箱/密码验证
- 错误信息显示
- 表单状态追踪 (dirty, touched, valid)
- 重置和提交功能

**适合场景**: 初次学习 FormState 的开发者

---

### 2. Transformers - 值转换器
**路径**: `transformers/+page.svelte`

展示输入值的自动转换和格式化。

**功能演示**:
- 电话号码格式化
- 信用卡号格式化
- 货币格式化
- URL 规范化
- 用户名规范化
- 内置转换器: `trim`, `toLowerCase`, `toNumber`

**适合场景**: 需要自动格式化用户输入的表单

---

## 中级 (Intermediate)

### 3. Dynamic Arrays - 动态数组
**路径**: `dynamic-arrays/+page.svelte`

团队成员管理系统，展示 FieldArray 组件。

**功能演示**:
- 添加/删除数组项
- 拖拽排序 (使用 `@shelchin/drag-sortable`)
- 嵌套字段验证
- 数组操作方法 (append, remove, move)

**适合场景**: 需要管理可变数量表单项的场景

---

### 4. Field Dependencies - 字段依赖
**路径**: `field-dependencies/+page.svelte`

展示跨字段验证和依赖关系。

**功能演示**:
- 密码确认验证
- 邮箱确认验证
- 折扣码验证 (依赖订单总额)
- `dependencies` 字段配置
- 访问 `allValues` 参数的自定义验证器

**适合场景**: 字段之间有依赖关系的复杂表单

---

### 5. Complete Validation - 完成时验证
**路径**: `complete-validation/+page.svelte`

对比三种验证策略的性能和体验。

**功能演示**:
- `validateOnComplete` - 智能检测输入完成
- `validateOnChange` - 每次变化时验证
- `validateOnBlur` - 失焦时验证
- `completeCondition` 完成条件回调
- `debounceMs` 防抖配置
- 验证调用次数统计对比

**适合场景**: 需要优化验证性能和用户体验

---

### 6. Form Persistence - 表单持久化
**路径**: `form-persistence/+page.svelte`

自动保存和恢复表单数据。

**功能演示**:
- 自动保存到 localStorage
- 序列化/反序列化表单状态
- 导出为 JSON 文件
- 从 JSON 文件导入
- 实时保存状态指示器

**适合场景**: 需要防止数据丢失的长表单

---

### 7. Conditional Fields - 条件字段
**路径**: `conditional-fields/+page.svelte`

配置驱动的条件渲染。

**功能演示**:
- 订单类型选择器
- `showWhen` 配置实现条件显示
- 根据其他字段值动态显示/隐藏字段
- 复杂多条件场景支持

**适合场景**: 表单字段需要根据条件动态显示

---

## 高级 (Advanced)

### 8. Multi-Step Form - 多步骤表单
**路径**: `multi-step-form/+page.svelte`

注册表单拆分为 4 个步骤。

**功能演示**:
- 步骤: 账户信息 → 个人资料 → 联系方式 → 确认
- 使用 `validateFields()` 进行分步验证
- 进度追踪
- 步骤导航 (前进需验证，后退自由)
- 最终确认步骤的数据预览

**适合场景**: 复杂数据收集需要分步完成

---

### 9. Async Validation - 异步验证
**路径**: `async-validation/+page.svelte`

自定义异步验证器，模拟 API 集成。

**功能演示**:
- 用户名可用性检查
- 邮箱注册状态检查
- 强密码验证器 (大小写/数字/特殊字符)
- 密码匹配 (字段依赖)
- 密码强度指示器
- 网络延迟处理和验证防抖

**适合场景**: 需要服务端验证的表单

---

### 10. ABI Form - Solidity ABI 表单
**路径**: `abi-form/+page.svelte`

Web3 专用示例：智能合约函数参数输入。

**功能演示**:
- 动态数组 (address[], uint256[])
- 嵌套 tuple 结构
- 地址格式验证 (0x...)
- 类型特定验证器和错误消息

**适合场景**: 区块链开发，智能合约交互

---

### 11. Nested ABI Form - 嵌套 ABI 表单
**路径**: `abi-form-nested/+page.svelte`

复杂递归嵌套：tuple 数组包含 tuple 数组。

**功能演示**:
- executeBatchTransactions 多层签名数组
- 无限嵌套深度支持
- 多层数组嵌套
- 真实智能合约交互表单

**适合场景**: 复杂智能合约参数构建

---

### 12. Schema Form - 模式表单
**路径**: `schema-form/+page.svelte`

配置驱动的表单生成，支持自定义组件。

**功能演示**:
- 分组布局
- 自定义组件注册 (ColorPicker, TagsInput, RichTextEditor)
- 多种字段类型: text, email, textarea, select, checkbox, radio
- 可插拔架构

**适合场景**: 需要快速生成表单，减少样板代码

---

### 13. BigInt Serialization - BigInt 序列化
**路径**: `bigint-serialization/+page.svelte`

特殊类型处理：BigInt, Date, Map, Set 序列化。

**功能演示**:
- `safeStringify` 和 `safeParse` 函数
- 复杂嵌套数据结构
- 与原生 JSON.stringify 对比 (原生会报错)

**适合场景**: 区块链/密码学应用，需要处理 BigInt

---

## 质量保证 & 测试

### 14. P0 Bug Fixes - P0 级 Bug 修复演示
**路径**: `p0-bugfixes/+page.svelte`

展示 5 个关键 bug 修复。

**演示修复**:
- Bug 7: `reset()` 正确清除所有字段状态
- Bug 8: `setValues()` 尊重字段依赖
- Bug 10: `getDirtyValues()` 正确处理嵌套路径

---

### 15. Bug Fixes Demo - Bug 修复演示
**路径**: `bug-fixes-demo/+page.svelte`

展示 3 个关键问题修复。

**演示修复**:
- Bug 3: FieldArray 删除后路径重映射
- Bug 4: 依赖字段 onChange 触发
- Bug 2: 动态字段自动清理

---

### 16. Performance Test - 性能测试
**路径**: `performance-test/+page.svelte`

关键性能改进基准测试。

**测试内容**:
- 批量更新 vs 普通更新 (数倍提升)
- 简单路径优化 (跳过 Immer)
- 循环依赖保护 (Bug 6 修复)
- 异步验证值快照 (Bug 5 修复)
- 100 字段表单可扩展性测试

---

### 17. Examples Hub - 示例中心
**路径**: `+page.svelte`

所有示例的索引页面。

**功能**:
- 按难度分类
- 标签标注相关主题
- 快速入门代码片段
- 核心功能概览

---

## 核心功能覆盖

| 功能类别 | 相关示例 |
|---------|---------|
| 验证策略 | Basic Form, Complete Validation, Async Validation |
| 复杂数据结构 | Dynamic Arrays, ABI Form, Nested ABI Form |
| 字段依赖 | Field Dependencies, Async Validation |
| 状态管理 | Basic Form, P0 Bug Fixes |
| 序列化 | Form Persistence, BigInt Serialization |
| UI 模式 | Conditional Fields, Multi-Step Form, Dynamic Arrays |
| 性能优化 | Complete Validation, Performance Test |
| Web3 集成 | ABI Form, Nested ABI Form, BigInt Serialization |

---

## 学习路径建议

```
入门 → 中级 → 高级
  │      │      │
  │      │      ├── Multi-Step Form (理解分步验证)
  │      │      ├── Async Validation (掌握异步处理)
  │      │      ├── Schema Form (配置驱动开发)
  │      │      └── ABI Forms (Web3 场景)
  │      │
  │      ├── Dynamic Arrays (数组操作)
  │      ├── Field Dependencies (依赖管理)
  │      ├── Conditional Fields (条件渲染)
  │      └── Form Persistence (数据持久化)
  │
  ├── Basic Form (核心概念)
  └── Transformers (值转换)
```
