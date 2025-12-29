# Step-Based App Framework Refactoring Plan

> 目标：提升开发体验、可维护性、代码复用率，同时增强类型安全和测试覆盖

## 项目概述

### 背景

当前项目有多个基于步骤的区块链工具（wallet-sweep, token-balance-scanner 等），存在大量重复代码和样板文件。本次重构旨在：

1. 建立统一的工具开发框架
2. 减少新工具开发时间（从 2 天到 30 分钟）
3. 提高代码复用率（减少 60% 重复代码）
4. 增强类型安全和测试覆盖

### 核心改进

- [x] 分析现有架构
- [x] 阶段 1：基础设施（`createStepAppPageLoad`、自动加载步骤组件）✅
- [x] 阶段 2：状态管理重构（Context 模式、模块化）✅ 基础完成
- [x] 阶段 3：共享组件提取（`ConnectWallet*`、`DependencyCheck*` 等）✅ 大部分完成
- [ ] 阶段 4：Plop 脚手架生成器
- [ ] 阶段 5：测试覆盖
- [ ] 阶段 6：文档和面试准备

---

## 阶段 1：基础设施 ✅ 已完成

### 1.1 创建 `createStepAppPageLoad` 工厂函数 ✅

- [x] 创建 `src/lib/utils/create-step-app-page-load.ts`
- [x] 实现配置驱动的 SSR 数据加载
- [x] 支持自定义 stepCount、featureCount、toolCount
- [x] 添加单元测试 (11 tests passing)
- [x] 迁移 token-balance-scanner 使用新工厂函数验证
- **成果**: 从 ~100 行减少到 6 行 (减少 94%)

### 1.2 步骤组件自动加载 ✅

- [x] 创建通用的 `createStepComponents` 工具函数
- [x] 使用 `import.meta.glob` 实现自动发现
- [x] 确保 SSR 兼容性
- [x] 添加单元测试 (9 tests passing)
- [x] 迁移 token-balance-scanner 使用新工具验证
- **成果**: 从 ~50 行减少到 ~25 行 (减少 50%)

---

## 阶段 2：状态管理重构 ✅ 基础完成

### 2.1 设计 Context 模式状态管理 ✅

- [x] 创建 `src/lib/stores/create-app-state-context.svelte.ts`
- [x] 定义状态模块接口规范 (`StateModule`)
- [x] 实现 `setContext`/`getContext` 包装
- [x] 添加单元测试 (14 tests passing)
- **成果**: 提供类型安全的 Context 工厂，支持模块组合

### 2.2 创建共享状态模块 ✅

- [x] `src/lib/stores/modules/dependency-check.svelte.ts` (14 tests)
- [x] `src/lib/stores/modules/token-selection.svelte.ts` (17 tests)
- [x] `src/lib/stores/modules/wallet-addresses.svelte.ts` (18 tests)
- [x] `src/lib/stores/modules/scan-progress.svelte.ts` (26 tests)
- **成果**: 89 个测试全部通过，模块可跨工具复用

### 2.3 状态持久化与恢复（可选，延后）

- [ ] 创建 `src/lib/stores/utils/state-persistence.ts`
- [ ] 实现 IndexedDB 状态快照自动保存（使用 $effect 监听变化）
- [ ] 实现防抖机制避免频繁写入
- [ ] 实现状态恢复逻辑
- [ ] 添加步骤回滚能力

> 注：此功能为可选增强，当前工具运行良好，可根据实际需求决定是否实现

### 2.4 迁移现有工具（可选，延后）

- [ ] 选择 token-balance-scanner 作为试点
- [ ] 重构为 Context 模式
- [ ] 验证功能完整性
- [ ] 性能对比测试

> 注：现有工具已稳定运行，迁移为可选优化

---

## 阶段 3：共享组件提取 ✅ 大部分完成

### 3.1 ConnectWallet 组件套件 ✅

- [x] 创建 `src/lib/components/step/connect-wallet/connect-wallet-content.svelte`
- [x] 创建 `src/lib/components/step/connect-wallet/connect-wallet-footer.svelte`
- [x] 创建 `src/lib/components/step/connect-wallet/connect-wallet-sidebar.svelte`
- [x] 支持 `i18nPrefix` 配置
- [x] 支持 `requiredChainId` 配置（如 ENS 需要以太坊主网）
- [x] 支持 `children` slot 自定义内容
- **已迁移工具**: contract-deployer, ens-scanner, contract-events-scanner, assets-monitor

### 3.2 DependencyCheck 组件套件 ✅

- [x] 创建 `src/lib/components/step/dependency-check/dependency-check-content.svelte`
- [x] 创建 `src/lib/components/step/dependency-check/dependency-check-footer.svelte`
- [x] 创建 `src/lib/components/step/dependency-check/dependency-check-sidebar.svelte`
- [x] 支持自定义检查项配置
- [x] 支持 `i18nPrefix` 配置
- **已迁移工具**: contract-deployer

### 3.3 SharedTokenSelectionStep 组件（待实现）

- [ ] 创建 `src/lib/components/step/token-selection/token-selection-content.svelte`
- [ ] 创建 `src/lib/components/step/token-selection/token-selection-footer.svelte`
- [ ] 创建 `src/lib/components/step/token-selection/token-selection-sidebar.svelte`
- [ ] 支持自定义 Token 过滤
- [ ] 添加组件测试

---

## 阶段 4：Plop 脚手架生成器

### 4.1 Plop 基础配置

- [ ] 安装 plop 依赖
- [ ] 创建 `plop/plopfile.js`
- [ ] 添加 npm script: `create-tool`

### 4.2 step-app 生成器

- [ ] 创建交互式 prompts
- [ ] 创建模板文件：
  - [ ] `templates/step-app/routes/+page.svelte.hbs`
  - [ ] `templates/step-app/routes/+page.server.ts.hbs`
  - [ ] `templates/step-app/features/stores/app-state.svelte.ts.hbs`
  - [ ] `templates/step-app/features/ui/steps/index.ts.hbs`
  - [ ] `templates/step-app/features/ui/steps/step-sidebar.svelte.hbs`
  - [ ] `templates/step-app/features/ui/steps/step-content.svelte.hbs`
  - [ ] `templates/step-app/features/ui/steps/step-footer.svelte.hbs`
  - [ ] `templates/step-app/features/types/index.ts.hbs`
  - [ ] `templates/step-app/features/paywall.ts.hbs`
  - [ ] `templates/step-app/i18n/en.json.hbs`
  - [ ] `templates/step-app/i18n/zh.json.hbs`
- [ ] 实现动态步骤生成
- [ ] 添加生成后说明

### 4.3 生成器测试

- [ ] 创建测试工具验证生成器
- [ ] 验证生成的代码可以正常运行
- [ ] 验证 lint 和 type check 通过

---

## 阶段 5：测试覆盖

### 5.1 单元测试

- [x] 状态模块测试（每个模块 > 80% 覆盖率）✅ 89 tests
- [x] 工具函数测试 ✅
- [x] 工厂函数测试 ✅
- [ ] 共享组件单元测试

### 5.2 组件测试

- [ ] ConnectWallet\* 组件测试
- [ ] DependencyCheck\* 组件测试
- [ ] StepBasedApp 集成测试

### 5.3 E2E 测试

- [ ] 新工具完整流程测试
- [ ] 状态恢复测试
- [ ] 错误边界测试

---

## 阶段 6：文档和面试准备

### 6.1 技术文档

- [ ] 架构决策记录 (ADR)
- [ ] 新工具开发指南
- [ ] 状态模块 API 文档
- [ ] 常见问题排查指南

### 6.2 面试准备材料

- [ ] 项目亮点总结（中/英/德）
- [ ] 面试题设计与最佳回答
- [ ] 技术深度准备（L1-L5）
- [ ] 架构图和流程图

---

## 技术决策记录

### ADR-001: 使用 Context 而非单例管理状态

**状态**: 已决定

**背景**:
需要在多步骤工具中管理复杂状态，当前使用模块级单例。

**决定**:
使用 Svelte Context API，每个页面实例独立状态。

**原因**:

1. 避免多标签页状态污染
2. 页面卸载时自动清理
3. 更容易测试（可注入 mock 状态）
4. 符合 Svelte 最佳实践

**后果**:

- 需要在组件树顶层设置 Context
- 子组件需要通过 `getContext` 获取状态
- 需要迁移现有工具

---

### ADR-002: 使用 import.meta.glob 自动加载步骤组件

**状态**: 已决定

**背景**:
每个工具需要手动导入 15+ 个步骤组件并组装。

**决定**:
使用 Vite 的 `import.meta.glob` 自动发现和加载。

**原因**:

1. 减少样板代码
2. 添加新步骤只需创建文件
3. SSR 兼容（eager: true）
4. 编译时静态分析，无运行时开销

**后果**:

- 文件命名必须遵循约定
- 需要排序逻辑确保顺序正确

---

### ADR-003: 使用 Plop 作为脚手架工具

**状态**: 已决定

**背景**:
创建新工具需要手动创建 25+ 个文件。

**决定**:
使用 Plop.js 实现交互式脚手架。

**原因**:

1. 成熟稳定，社区广泛使用
2. Handlebars 模板灵活
3. 支持复杂的文件生成逻辑
4. 易于维护和扩展

**替代方案**:

- Hygen: 更轻量但功能较少
- 自定义 Node 脚本: 灵活但维护成本高

---

### ADR-004: 共享组件使用 i18nPrefix 模式

**状态**: 已决定 (2024-12)

**背景**:
共享组件需要支持多语言，但每个工具的翻译 key 不同。

**决定**:
使用 `i18nPrefix` 参数，组件内部拼接完整的翻译 key。

**原因**:

1. 统一的翻译 key 命名规范：`{tool}.step{N}.{area}.{key}`
2. 减少组件参数数量
3. 便于批量迁移

**示例**:

```svelte
<ConnectWalletFooter i18nPrefix="ens-scanner" />
<!-- 内部使用: t(`ens-scanner.step1.footer.continue`) -->
```

---

## 进度跟踪

| 阶段     | 预估工时 | 实际工时 | 状态          | 完成日期 |
| -------- | -------- | -------- | ------------- | -------- |
| 阶段 1   | 4h       | ~4h      | ✅ 已完成     | 2024-12  |
| 阶段 2   | 8h       | ~6h      | ✅ 基础完成   | 2024-12  |
| 阶段 3   | 4h       | ~5h      | ✅ 大部分完成 | 2024-12  |
| 阶段 4   | 6h       | -        | ❌ 未开始     | -        |
| 阶段 5   | 6h       | -        | 🔄 部分完成   | -        |
| 阶段 6   | 4h       | -        | ❌ 未开始     | -        |
| **总计** | **32h**  | ~15h     | -             | -        |

---

## 已完成成果汇总

### 代码复用率提升

| 工具                           | 迁移前代码行 | 迁移后代码行 | 减少比例 |
| ------------------------------ | ------------ | ------------ | -------- |
| contract-deployer Step 1       | ~150         | ~30          | -80%     |
| contract-deployer Step 2       | ~200         | ~50          | -75%     |
| ens-scanner Step 1             | ~170         | ~30          | -82%     |
| contract-events-scanner Step 1 | ~140         | ~30          | -79%     |
| assets-monitor Step 1          | ~60          | ~30          | -50%     |

### 共享组件清单

| 组件                   | 路径                                     | 功能           |
| ---------------------- | ---------------------------------------- | -------------- |
| ConnectWalletContent   | `$lib/components/step/connect-wallet/`   | 钱包连接主内容 |
| ConnectWalletFooter    | 同上                                     | 底部继续按钮   |
| ConnectWalletSidebar   | 同上                                     | 侧边栏提示     |
| DependencyCheckContent | `$lib/components/step/dependency-check/` | 依赖检查主内容 |
| DependencyCheckFooter  | 同上                                     | 底部继续按钮   |
| DependencyCheckSidebar | 同上                                     | 侧边栏提示     |

---

## 风险和缓解措施

| 风险                         | 可能性 | 影响 | 缓解措施                   |
| ---------------------------- | ------ | ---- | -------------------------- |
| Context 模式迁移破坏现有功能 | 中     | 高   | 先在新工具验证，再逐步迁移 |
| import.meta.glob SSR 问题    | 低     | 中   | 使用 eager: true，充分测试 |
| Plop 模板维护成本            | 中     | 低   | 保持模板简单，文档清晰     |
| 测试覆盖不足导致回归         | 中     | 高   | 边重构边补充测试           |

---

## 参考资料

- [Svelte 5 Runes 文档](https://svelte.dev/docs/svelte/$state)
- [SvelteKit Context API](https://kit.svelte.dev/docs/state-management)
- [Vite import.meta.glob](https://vitejs.dev/guide/features.html#glob-import)
- [Plop.js 文档](https://plopjs.com/documentation/)
