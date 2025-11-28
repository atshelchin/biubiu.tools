# 通用任务管理系统 - 树形结构版本

## ⭐ 新特性

这是任务管理系统的全新树形结构版本，相比原有的两层结构（Task → SubTask），新版本提供了：

### ✅ 完全通用的树形架构

- 支持任意层级嵌套（2层、3层、4层...）
- 统一的数据结构和接口
- 父任务的进度和状态自动从子任务聚合
- 只有叶子任务可以被执行

### ✅ 更强大的功能

- **递归遍历**: 使用深度优先遍历执行所有叶子任务
- **灵活分组**: 可以按任意维度组织任务（如按代币、按批次、按地区等）
- **细粒度控制**: 可以在任意层级暂停/恢复/取消任务
- **智能聚合**: 进度、状态、统计数据自动聚合到父任务

## 📁 文件结构

### 核心文件 (v2)

```
src/lib/task-manager/
├── types.v2.ts                    # 树形结构类型定义
├── tree-utils.ts                  # 树操作工具函数
├── db.v2.ts                       # IndexedDB 存储层
├── task-manager.v2.ts             # 核心任务管理器
├── task-store.v2.svelte.ts        # Svelte 5 响应式存储
├── index.v2.ts                    # 统一导出
├── TREE_STRUCTURE_GUIDE.md        # 详细使用指南
└── README.v2.md                   # 本文件
```

### 示例文件

```
src/features/token-sweep/
└── task-executor.v2.ts            # Token Sweep 执行器示例
```

### 旧文件（向后兼容）

```
src/lib/task-manager/
├── types.ts                       # 旧的两层结构类型
├── db.ts                          # 旧的数据库层
├── task-manager.ts                # 旧的任务管理器
├── task-store.svelte.ts           # 旧的存储
└── index.ts                       # 旧的导出
```

## 🆚 新旧对比

### 旧架构（两层）

```
Task: "Token Sweep"
├── SubTask: "USDT 批次 1"
├── SubTask: "USDT 批次 2"
├── SubTask: "USDC 批次 1"
└── SubTask: "USDC 批次 2"
```

**问题**:

- ❌ 无法按代币分组
- ❌ 进度显示不清晰
- ❌ 难以暂停单个代币的归集
- ❌ 不够通用，难以适配其他场景

### 新架构（树形）

```
Task: "Token Sweep"
├── Task: "USDT 归集"
│   ├── Task: "批次 1" [叶子 - 可执行]
│   └── Task: "批次 2" [叶子 - 可执行]
└── Task: "USDC 归集"
    ├── Task: "批次 1" [叶子 - 可执行]
    └── Task: "批次 2" [叶子 - 可执行]
```

**优势**:

- ✅ 清晰的层次结构
- ✅ 每层都有独立的进度和状态
- ✅ 可以暂停/恢复任意层级
- ✅ 完全通用，适配任何场景

## 🚀 快速开始

### 1. 导入 API

```typescript
// 使用新的 v2 API
import {
	createTask,
	executeTask,
	pauseTask,
	resumeTask,
	type Task,
	type TaskExecutorRegistry
} from '$lib/task-manager/index.v2';
```

### 2. 创建任务树

```typescript
const task = await createTask({
	type: 'token-sweep',
	name: '归集 3 个代币',

	children: [
		{
			name: 'USDT 归集',
			children: [
				{
					name: '批次 1',
					executionData: {
						/*...*/
					},
					executor: 'sweepBatch'
				},
				{
					name: '批次 2',
					executionData: {
						/*...*/
					},
					executor: 'sweepBatch'
				}
			]
		},
		{
			name: 'USDC 归集',
			children: [
				/* ... */
			]
		}
	]
});
```

### 3. 定义执行器

```typescript
const executors: TaskExecutorRegistry = {
	sweepBatch: async (ctx) => {
		// 执行单个批次
		await ctx.updateProgress(50, '处理中...');
		// ...
		await ctx.completeTask(result);
	}
};
```

### 4. 执行任务

```typescript
await executeTask(task.id, executors, (root, current) => {
	console.log(`执行: ${current.name}, 进度: ${current.progress}%`);
});
```

## 📚 完整文档

详细的使用指南、API 参考、最佳实践，请查看：

- [TREE_STRUCTURE_GUIDE.md](./TREE_STRUCTURE_GUIDE.md) - 完整使用指南

## 🔄 迁移指南

如果你正在使用旧的两层结构，可以这样迁移到新版本：

### 旧代码

```typescript
import { createTask } from '$lib/task-manager';

const task = await createTask({
	type: 'token-sweep',
	name: 'Token Sweep',
	subTasks: [
		{
			name: 'USDT批次1',
			data: {
				/*...*/
			},
			maxAttempts: 3
		}
	]
});
```

### 新代码

```typescript
import { createTask } from '$lib/task-manager/index.v2';

const task = await createTask({
	type: 'token-sweep',
	name: 'Token Sweep',
	children: [
		{
			name: 'USDT批次1',
			executionData: {
				/*...*/
			}, // data → executionData
			executor: 'sweepBatch', // 需要指定执行器名称
			maxAttempts: 3
		}
	]
});
```

### 执行器改动

```typescript
// 旧的执行器签名
type SubTaskExecutor = (context: TaskExecutionContext) => Promise<void>;

// 新的执行器签名（相同！）
type TaskExecutor = (context: TaskExecutionContext) => Promise<void>;

// 但需要注册到 Registry
const executors: TaskExecutorRegistry = {
	sweepBatch: mySweepBatchExecutor
};

// 执行时传入 registry
await executeTask(taskId, executors, onProgress);
```

## 📊 架构优势

### 1. 通用性

可以处理各种复杂场景：

```typescript
// 简单场景（1层）
Task: "导出报表" [叶子]

// 中等场景（2层）
Task: "上传文件"
├── Task: "file1.jpg" [叶子]
├── Task: "file2.jpg" [叶子]
└── Task: "file3.jpg" [叶子]

// 复杂场景（3层+）
Task: "多地区部署"
├── Task: "美国"
│   ├── Task: "东部"
│   │   ├── Task: "服务器1" [叶子]
│   │   └── Task: "服务器2" [叶子]
│   └── Task: "西部"
│       └── Task: "服务器3" [叶子]
└── Task: "欧洲"
    └── Task: "德国"
        └── Task: "服务器4" [叶子]
```

### 2. 清晰的进度

每一层都有自己的进度：

```
Token Sweep: 50% (2/4 代币完成)
├── USDT: 100% (2/2 批次完成) ✓
├── USDC: 100% (1/1 批次完成) ✓
├── DAI: 0% (0/2 批次完成)
│   ├── 批次1: 0%
│   └── 批次2: 0%
└── WETH: 0% (未开始)
```

### 3. 灵活控制

可以在任意层级操作：

```typescript
// 暂停整个任务
await pauseTask(rootTask, rootTask.id, 'user', '暂停所有');

// 暂停单个代币
await pauseTask(rootTask, usdtTaskId, 'user', '暂停USDT');

// 暂停单个批次（叶子任务自己暂停）
await ctx.pauseRoot('user', '暂停当前批次');
```

## 🛠 开发工具

### 树遍历

```typescript
import { traverseTree } from '$lib/task-manager/index.v2';

// 打印整个树
traverseTree(rootTask, (task, depth) => {
	console.log(`${'  '.repeat(depth)}${task.name} [${task.status}]`);
});
```

### 查找任务

```typescript
import { findTaskById, findTasks } from '$lib/task-manager/index.v2';

// 通过ID查找
const task = findTaskById(rootTask, 'task-123-usdt');

// 通过条件查找
const failedTasks = findTasks(rootTask, (t) => t.status === 'failed');
```

### 统计信息

```typescript
import { getLeafTasks } from '$lib/task-manager/index.v2';

const leaves = getLeafTasks(rootTask);
console.log(`总共需要执行 ${leaves.length} 个叶子任务`);

const completed = leaves.filter((t) => t.status === 'completed').length;
console.log(`已完成 ${completed}/${leaves.length}`);
```

## 🔮 未来计划

- [ ] 更新 UI 组件支持树形展示
- [ ] 添加任务树可视化组件
- [ ] 支持任务优先级
- [ ] 支持并行执行（多个叶子任务同时执行）
- [ ] 添加任务调度器

## 📝 注意事项

### 1. 数据库版本

新版本使用 IndexedDB v3，会自动迁移：

```typescript
const DB_VERSION = 3; // 从 v2 升级到 v3
```

### 2. 向后兼容

旧代码仍然可以正常工作，新旧两个版本可以共存：

```typescript
// 旧版本
import { createTask } from '$lib/task-manager';

// 新版本
import { createTask } from '$lib/task-manager/index.v2';
```

### 3. 执行器注册表

新版本使用执行器注册表模式，更加灵活和可维护：

```typescript
// ✅ 推荐：集中管理执行器
const executors = {
	sweepBatch: executeSweepBatch,
	uploadFile: executeUploadFile,
	processData: executeProcessData
};

await executeTask(taskId, executors);
```

## 🤝 贡献

欢迎提 Issue 和 PR！

## 📄 许可证

MIT
