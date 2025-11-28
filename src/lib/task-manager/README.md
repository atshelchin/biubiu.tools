# Universal Task Management System

通用的、可持久化的任务管理系统，支持暂停/恢复、进度跟踪和浏览器会话恢复。

## 架构概览

```
Task (任务)
├── SubTask 1 (子任务1)
├── SubTask 2 (子任务2)
└── SubTask 3 (子任务3)
```

### 示例：Token Sweep 归集任务

```
Task: "归集 ETH, USDC, DAI (共 500 个钱包)"
├── SubTask 1: ETH from wallets 1-100
├── SubTask 2: ETH from wallets 101-200
├── SubTask 3: ETH from wallets 201-300
├── SubTask 4: ETH from wallets 301-400
├── SubTask 5: ETH from wallets 401-500
├── SubTask 6: USDC from wallets 1-100
├── SubTask 7: USDC from wallets 101-200
... (共 15 个子任务)
```

## 核心特性

1. **多子任务支持**: 一个任务包含多个独立的子任务
2. **持久化存储**: 使用 IndexedDB 保存任务状态
3. **暂停/恢复**: 支持任务暂停和恢复执行
4. **进度跟踪**: 实时跟踪每个子任务和整体进度
5. **错误处理**: 自动重试失败的子任务
6. **会话恢复**: 浏览器关闭后重新打开能恢复任务
7. **通用性**: 可用于任何功能（Token Sweep, 批量转账等）

## 文件结构

```
src/lib/task-manager/
├── README.md              # 本文档
├── types.ts               # ✅ 已完成 - 类型定义
├── db.ts                  # 🚧 需要更新 - IndexedDB 存储
├── task-store.svelte.ts   # ⏳ 待实现 - Svelte 5 状态管理
├── task-manager.ts        # ⏳ 待实现 - 核心任务管理器
└── components/
    ├── task-list.svelte          # ⏳ 待实现 - 任务列表
    ├── task-detail.svelte        # ⏳ 待实现 - 任务详情
    └── task-recovery-modal.svelte # ⏳ 待实现 - 任务恢复弹窗
```

## 使用示例

### 1. 创建任务

```typescript
import { createTask } from '$lib/task-manager/task-manager';

const task = await createTask({
  type: 'token-sweep',
  name: '归集 ETH, USDC, DAI',
  description: '从 500 个钱包归集到目标地址',
  config: {
    targetAddress: '0x...',
    selectedTokens: ['ETH', 'USDC', 'DAI'],
    temporaryWalletAddress: '0x...'
  },
  subTasks: [
    {
      name: 'ETH: Wallets 1-100',
      data: {
        tokenId: 'eth:native',
        walletAddresses: [...], // 100 addresses
        batchSize: 100
      }
    },
    {
      name: 'ETH: Wallets 101-200',
      data: {
        tokenId: 'eth:native',
        walletAddresses: [...], // 100 addresses
        batchSize: 100
      }
    },
    // ... more subtasks
  ]
});
```

### 2. 执行任务

```typescript
import { executeTask } from '$lib/task-manager/task-manager';
import { tokenSweepExecutor } from '@/features/token-sweep/executors/token-sweep-executor';

await executeTask(task.id, tokenSweepExecutor);
```

### 3. 暂停/恢复任务

```typescript
import { pauseTask, resumeTask } from '$lib/task-manager/task-manager';

// 暂停任务
await pauseTask(task.id, 'insufficient-gas', 'Gas 不足，请充值');

// 恢复任务
await resumeTask(task.id);
```

### 4. 查询任务

```typescript
import { getTask, getRecoverableTasks } from '$lib/task-manager/task-manager';

// 获取单个任务
const task = await getTask('task-xxx');

// 获取可恢复的任务（paused 或 running 状态）
const recoverableTasks = await getRecoverableTasks();
```

## 实现清单

### ✅ 已完成

- [x] 类型定义 (types.ts)
- [x] Gas 估算和监控
- [x] 执行前 Gas 检查
- [x] Gas 不足时暂停 UI

### ✅ 核心功能已完成

- [x] 更新 IndexedDB 存储层（db.ts）
  - ✅ 移除 SubTasks 存储（SubTask 现在直接存储在 Task 中）
  - ✅ 简化数据结构
  - ✅ 增加版本号到 v2 以触发迁移

- [x] 任务管理器 (task-manager.ts)
  - ✅ `createTask()`: 创建任务
  - ✅ `executeTask()`: 执行任务
  - ✅ `pauseTask()`: 暂停任务
  - ✅ `resumeTask()`: 恢复任务
  - ✅ `cancelTask()`: 取消任务
  - ✅ `deleteTask()`: 删除任务
  - ✅ `getTask()`: 获取任务
  - ✅ `getAllTasks()`: 获取所有任务
  - ✅ `getRecoverableTasks()`: 获取可恢复任务

- [x] Svelte 5 状态管理 (task-store.svelte.ts)
  - ✅ 使用 $state 和 $derived
  - ✅ 实时同步任务状态
  - ✅ 响应式任务列表

### ✅ UI 组件已完成

- [x] 任务列表组件 (task-list.svelte)
  - ✅ 显示所有任务
  - ✅ 过滤和排序
  - ✅ 快速操作（暂停/恢复/删除）

- [x] 任务详情组件 (task-detail.svelte)
  - ✅ 显示任务进度
  - ✅ 显示子任务列表
  - ✅ 显示错误和日志
  - ✅ 可展开查看子任务详情

- [x] 任务恢复弹窗 (task-recovery-modal.svelte)
  - ✅ 页面加载时检查可恢复任务
  - ✅ 显示任务列表
  - ✅ 一键恢复执行

### ✅ 集成文档已完成

- [x] 集成指南 (INTEGRATION_GUIDE.md)
  - ✅ 完整的集成步骤
  - ✅ Token Sweep 集成示例
  - ✅ API 参考
  - ✅ 最佳实践

- [x] Token Sweep 示例
  - ✅ 任务执行器 (task-executor.ts)
  - ✅ 应用包装组件 (token-sweep-app-with-recovery.svelte)

### ⏳ 待实现

#### Token Sweep 完整集成

- [ ] 在 step5 中集成任务系统
  - 创建任务并执行
  - 显示实时进度
  - 支持暂停/恢复/取消

- [ ] 应用启动时的任务恢复
  - 从任务配置恢复应用状态
  - 自动跳转到执行步骤
  - 继续未完成的任务
  - 询问用户是否继续
  - 显示恢复信息

#### Token Sweep 集成

- [ ] 创建 Token Sweep 执行器
  - 实现 SubTaskExecutor
  - 处理每个子任务的执行
  - 报告进度和结果

- [ ] 集成到 Step5
  - 点击"执行归集"时创建任务
  - 使用任务管理器执行
  - 显示任务进度
  - 处理暂停/恢复

## 设计原则

1. **通用性优先**: 不针对特定功能，任何功能都能使用
2. **简单易用**: API 简洁明了，易于集成
3. **可靠性**: 数据持久化，支持断点续传
4. **用户体验**: 清晰的进度提示，友好的错误处理

## 下一步

1. 更新 `db.ts` 以匹配新的类型定义
2. 实现 `task-manager.ts` 核心功能
3. 实现 `task-store.svelte.ts` 状态管理
4. 创建 `task-recovery-modal.svelte` UI
5. 在 Token Sweep 中集成任务系统

## 注意事项

- **SubTask 存储**: SubTask 直接存储在 Task 的 `subTasks` 数组中，不需要单独的 IndexedDB 存储
- **状态同步**: 使用 Svelte 5 的 $state 确保 UI 实时更新
- **错误恢复**: 失败的子任务会自动重试，达到最大次数后标记为失败
- **清理策略**: 自动清理 7 天前完成或失败的任务
