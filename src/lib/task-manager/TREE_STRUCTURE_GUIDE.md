# 树形任务系统使用指南

## 概述

新的树形任务系统基于递归树结构，支持任意层级的任务嵌套。每个任务可以有子任务，子任务还可以有子任务，形成一个树形结构。

## 核心概念

### 任务类型

- **根任务 (Root Task)**: 顶层任务，没有父任务 (`parentId === null`)
- **父任务 (Parent Task)**: 有子任务的任务 (`children.length > 0`)
- **叶子任务 (Leaf Task)**: 没有子任务的任务，可以被执行 (`isLeaf === true`)

### 关键属性

```typescript
interface Task {
	// 身份标识
	id: string; // 唯一ID
	parentId: string | null; // 父任务ID（根任务为null）

	// 层级关系
	children: Task[]; // 子任务列表
	depth: number; // 深度（根任务为0）
	path: string[]; // 从根到当前任务的路径

	// 执行相关（仅叶子任务）
	isLeaf: boolean; // 是否为叶子任务
	executionData?: Record; // 执行数据
	executor?: string; // 执行器名称

	// 进度统计（从子任务聚合）
	totalLeaves: number; // 总叶子任务数
	completedLeaves: number; // 已完成叶子任务数
	failedLeaves: number; // 失败的叶子任务数
}
```

## 架构示例

### 示例 1：Token Sweep（3层结构）

```
任务: "归集 3 个代币"
├── 任务: "USDT 归集" (2443个钱包)
│   ├── 任务: "批次 1" (钱包 1-100)     [叶子 - 可执行]
│   ├── 任务: "批次 2" (钱包 101-200)   [叶子 - 可执行]
│   ├── ...
│   └── 任务: "批次 25" (钱包 2401-2443) [叶子 - 可执行]
├── 任务: "USDC 归集" (1500个钱包)
│   ├── 任务: "批次 1"                  [叶子 - 可执行]
│   ├── ...
│   └── 任务: "批次 15"                 [叶子 - 可执行]
└── 任务: "DAI 归集" (800个钱包)
    ├── 任务: "批次 1"                  [叶子 - 可执行]
    ├── ...
    └── 任务: "批次 8"                  [叶子 - 可执行]
```

### 示例 2：文件上传（2层结构）

```
任务: "上传 10 个文件"
├── 任务: "文件1.jpg"  [叶子 - 可执行]
├── 任务: "文件2.jpg"  [叶子 - 可执行]
├── 任务: "文件3.jpg"  [叶子 - 可执行]
└── ...
```

### 示例 3：单任务（1层结构）

```
任务: "导出报表"  [叶子 - 可执行]
```

## 使用方法

### 1. 创建任务树

```typescript
import { createTask } from '$lib/task-manager';

const task = await createTask({
  type: 'token-sweep',
  name: '归集 3 个代币',
  config: {
    network: 'mainnet',
    targetAddress: '0x...'
  },

  // 定义子任务（递归嵌套）
  children: [
    {
      name: 'USDT 归集',
      children: [
        {
          name: '批次 1 (钱包 1-100)',
          executionData: {
            tokenId: 'usdt',
            tokenAddress: '0x...',
            walletAddresses: [...],
            targetAddress: '0x...'
          },
          executor: 'sweepBatch', // 执行器函数名
          maxAttempts: 3
        },
        {
          name: '批次 2 (钱包 101-200)',
          executionData: { ... },
          executor: 'sweepBatch'
        }
      ]
    },
    {
      name: 'USDC 归集',
      children: [...]
    }
  ]
});

console.log('任务创建成功:', task.id);
console.log('总共需要执行的叶子任务数:', task.totalLeaves);
```

### 2. 定义执行器

执行器是实际执行叶子任务的函数。使用**执行器注册表**模式：

```typescript
import type { TaskExecutorRegistry } from '$lib/task-manager';

// 定义执行器
const executors: TaskExecutorRegistry = {
	// Token Sweep 批次执行器
	sweepBatch: async (ctx) => {
		const data = ctx.task.executionData as {
			tokenId: string;
			tokenAddress: string;
			walletAddresses: string[];
			targetAddress: string;
		};

		// 检查是否暂停
		if (ctx.isPaused()) {
			await ctx.pauseRoot('user', '用户暂停');
			return;
		}

		// 检查 Gas（可选）
		if (ctx.checkGasBalance) {
			const hasGas = await ctx.checkGasBalance();
			if (!hasGas) {
				await ctx.pauseRoot('insufficient_gas', 'Gas 不足');
				return;
			}
		}

		// 更新进度
		await ctx.updateProgress(10, '准备批次交易...');

		try {
			// 执行归集
			const results = [];
			for (let i = 0; i < data.walletAddresses.length; i++) {
				const wallet = data.walletAddresses[i];

				// 检查暂停
				if (ctx.isPaused()) {
					await ctx.pauseRoot('user', '用户暂停');
					return;
				}

				// 更新进度
				const progress = 10 + Math.floor((i / data.walletAddresses.length) * 80);
				await ctx.updateProgress(progress, `处理钱包 ${i + 1}/${data.walletAddresses.length}`);

				// 执行转账
				const hash = await transferToken({
					from: wallet,
					to: data.targetAddress,
					token: data.tokenAddress
				});

				results.push({ wallet, hash, success: true });
			}

			// 完成任务
			await ctx.updateProgress(100, '批次完成');
			await ctx.completeTask({ results });
		} catch (error) {
			await ctx.failTask(error.message);
		}
	},

	// 文件上传执行器
	uploadFile: async (ctx) => {
		const data = ctx.task.executionData as { file: File };

		await ctx.updateProgress(0, '开始上传...');

		const formData = new FormData();
		formData.append('file', data.file);

		const response = await fetch('/api/upload', {
			method: 'POST',
			body: formData
		});

		if (response.ok) {
			const result = await response.json();
			await ctx.completeTask(result);
		} else {
			await ctx.failTask('上传失败');
		}
	}
};
```

### 3. 执行任务

```typescript
import { executeTask } from '$lib/task-manager';
import { taskStore } from '$lib/task-manager';

// 执行任务树
await executeTask(
	task.id,
	executors, // 执行器注册表
	(rootTask, currentTask) => {
		// 进度回调
		console.log(`当前执行: ${currentTask.name}`);
		console.log(`进度: ${currentTask.progress}%`);

		// 更新 UI
		taskStore.setTask(rootTask);
	}
);

console.log('任务执行完成');
```

### 4. 暂停和恢复

```typescript
import { pauseTask, resumeTask } from '$lib/task-manager';

// 暂停整个任务树
const rootTask = await getTask(taskId);
await pauseTask(rootTask, rootTask.id, 'user', '用户手动暂停');

// 恢复任务
await resumeTask(rootTask, rootTask.id);

// 继续执行
await executeTask(taskId, executors, onProgress);
```

### 5. 查询和遍历

```typescript
import { findTaskById, getLeafTasks, traverseTree, calculateProgress } from '$lib/task-manager';

const rootTask = await getTask(taskId);

// 查找特定任务
const usdtTask = findTaskById(rootTask, 'task-123-usdt');

// 获取所有叶子任务
const leaves = getLeafTasks(rootTask);
console.log(`总共 ${leaves.length} 个叶子任务`);

// 遍历整个树
traverseTree(rootTask, (task, depth) => {
	console.log(`${'  '.repeat(depth)}${task.name} - ${task.status}`);
});

// 计算进度
const progress = calculateProgress(rootTask);
console.log(`整体进度: ${progress}%`);
```

## 进度和状态聚合

### 进度计算规则

- **叶子任务**: 进度 = executor 报告的进度 (0-100)
- **父任务**: 进度 = 所有子任务进度的平均值

```typescript
// 示例：
// 批次1: 100% 完成
// 批次2: 50% 完成
// 批次3: 0% 待开始
// USDT归集的进度 = (100 + 50 + 0) / 3 = 50%
```

### 状态计算规则

- **任意子任务运行中** → 父任务为 `running`
- **任意子任务暂停** → 父任务为 `paused`
- **所有子任务完成** → 父任务为 `completed`
- **所有子任务失败** → 父任务为 `failed`
- **部分完成，部分失败** → 父任务为 `partial`

## 执行上下文 API

叶子任务的 executor 函数接收一个 `TaskExecutionContext` 参数：

```typescript
interface TaskExecutionContext {
	// 任务引用
	task: Task; // 当前叶子任务
	parentTask: Task | null; // 父任务
	rootTask: Task; // 根任务

	// 控制方法
	isPaused: () => boolean;
	checkGasBalance?: () => Promise<boolean>;

	// 进度更新
	updateProgress: (progress: number, message?: string) => Promise<void>;
	updateTaskState: (state: Record) => Promise<void>;

	// 完成/失败
	completeTask: (result?: unknown) => Promise<void>;
	failTask: (error: string) => Promise<void>;

	// 暂停控制
	pauseParent: (reason: PauseReason, message: string) => Promise<void>;
	pauseRoot: (reason: PauseReason, message: string) => Promise<void>;
}
```

## UI 组件使用

### 使用 TaskStore

```svelte
<script lang="ts">
	import { taskStore } from '$lib/task-manager';

	let allTasks = $derived(taskStore.allTasks);
	let runningTasks = $derived(taskStore.runningTasks);
	let stats = $derived(taskStore.getTotalStatistics());
</script>

<div>
	<h2>任务列表</h2>
	<p>总进度: {stats.completionRate}%</p>
	<p>已完成: {stats.completedLeaves}/{stats.totalLeaves}</p>

	{#each allTasks as task}
		<TaskTreeView {task} />
	{/each}
</div>
```

### 递归展示任务树

```svelte
<!-- TaskTreeView.svelte -->
<script lang="ts">
	import type { Task } from '$lib/task-manager';

	interface Props {
		task: Task;
		depth?: number;
	}

	let { task, depth = 0 }: Props = $props();
</script>

<div class="task-node" style="margin-left: {depth * 20}px">
	<div class="task-info">
		<strong>{task.name}</strong>
		<span class="status">{task.status}</span>
		<span class="progress">{task.progress}%</span>
	</div>

	{#if !task.isLeaf}
		<div class="task-children">
			{#each task.children as child}
				<svelte:self task={child} depth={depth + 1} />
			{/each}
		</div>
	{/if}
</div>
```

## 最佳实践

### 1. 合理的任务粒度

- ✅ **推荐**: 每个叶子任务处理 100 个项目
- ❌ **不推荐**: 每个叶子任务处理 1 个项目（太细）
- ❌ **不推荐**: 所有项目在一个叶子任务中（太粗）

### 2. 执行器命名

使用清晰、描述性的执行器名称：

```typescript
✅ 好的命名:
'sweepBatch'
'uploadFile'
'processWallets'

❌ 不好的命名:
'exec'
'run'
'task1'
```

### 3. 进度报告

定期报告进度，让用户了解当前状态：

```typescript
✅ 好的做法:
for (let i = 0; i < items.length; i++) {
  await ctx.updateProgress(
    Math.floor((i / items.length) * 100),
    `处理 ${i + 1}/${items.length}`
  );
  await processItem(items[i]);
}

❌ 不好的做法:
await processAllItems(); // 没有进度更新
await ctx.completeTask();
```

### 4. 错误处理

让系统自动重试小错误，只在严重错误时失败：

```typescript
✅ 好的做法:
try {
  await riskyOperation();
} catch (error) {
  // 抛出错误，让系统自动重试
  throw error;
}

❌ 不好的做法:
try {
  await riskyOperation();
} catch (error) {
  // 直接失败，没有重试机会
  await ctx.failTask(error.message);
}
```

### 5. 暂停检查

在长时间操作中定期检查暂停状态：

```typescript
✅ 好的做法:
for (const item of items) {
  if (ctx.isPaused()) {
    await ctx.pauseRoot('user', '用户暂停');
    return;
  }
  await processItem(item);
}

❌ 不好的做法:
for (const item of items) {
  await processItem(item); // 无法响应暂停请求
}
```

## 迁移指南

从旧的两层结构迁移到树形结构：

### 旧代码（两层结构）

```typescript
// 旧的方式
const task = await createTask({
  type: 'token-sweep',
  name: 'Token Sweep',
  subTasksData: [
    { name: 'USDT批次1', data: {...} },
    { name: 'USDT批次2', data: {...} },
    { name: 'USDC批次1', data: {...} }
  ]
});
```

### 新代码（树形结构）

```typescript
// 新的方式 - 支持分组
const task = await createTask({
  type: 'token-sweep',
  name: 'Token Sweep',
  children: [
    {
      name: 'USDT 归集',
      children: [
        { name: '批次1', executionData: {...}, executor: 'sweepBatch' },
        { name: '批次2', executionData: {...}, executor: 'sweepBatch' }
      ]
    },
    {
      name: 'USDC 归集',
      children: [
        { name: '批次1', executionData: {...}, executor: 'sweepBatch' }
      ]
    }
  ]
});
```

## 总结

树形任务系统的优势：

1. ✅ **完全通用** - 支持任意层级嵌套
2. ✅ **灵活分组** - 可以按代币、按批次等多种方式组织
3. ✅ **清晰进度** - 每一层都有独立的进度和状态
4. ✅ **易于扩展** - 添加新层级不需要修改核心代码
5. ✅ **统一接口** - 所有任务使用相同的数据结构和API
