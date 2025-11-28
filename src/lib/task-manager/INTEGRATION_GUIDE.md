# 任务管理系统集成指南

## 概述

本文档以 Token Sweep 功能为例，展示如何将任务管理系统集成到您的应用中。

## 架构概述

任务管理系统提供：

- ✅ **任务持久化**：IndexedDB 存储，浏览器刷新后可恢复
- ✅ **暂停/恢复**：支持任务暂停和恢复执行
- ✅ **进度跟踪**：实时追踪每个子任务的进度
- ✅ **错误处理**：自动重试，记录错误信息
- ✅ **UI 组件**：开箱即用的任务列表、详情、恢复模态框

## 核心概念

### Task（任务）

一个完整的工作，包含多个子任务。例如："Token Sweep - 归集 3 个代币"

### SubTask（子任务）

任务中的独立执行单元。例如："批次 #1 - 归集 USDT（钱包 1-100）"

## 集成步骤

### 1. 定义任务类型

在 `types.ts` 中添加您的任务类型：

```typescript
// src/lib/task-manager/types.ts
export type TaskType =
	| 'token-sweep' // Token 归集
	| 'batch-transfer' // 批量转账
	| 'your-feature'; // 您的功能
```

### 2. 应用启动时检查未完成任务

在应用的主入口组件（例如 Token Sweep 的根组件）中：

```typescript
// src/features/token-sweep/+page.svelte
import { taskStore, getRecoverableTasks } from '$lib/task-manager';
import TaskRecoveryModal from '$lib/task-manager/components/task-recovery-modal.svelte';

let showRecoveryModal = $state(false);
let hasRecoverableTasks = $state(false);

// 检查是否有未完成的任务
$effect(() => {
	async function checkTasks() {
		await taskStore.init();
		const recoverableTasks = await getRecoverableTasks();

		// 过滤出属于当前应用的任务
		const myTasks = recoverableTasks.filter((t) => t.type === 'token-sweep');

		if (myTasks.length > 0) {
			hasRecoverableTasks = true;
			showRecoveryModal = true;
		}
	}

	checkTasks();
});

// 恢复任务处理
function handleRecoverTask(task: Task) {
	// 1. 恢复任务配置和状态
	const config = task.config;
	const state = task.state;

	// 2. 跳转到执行步骤（第五步）
	currentStep = 5;

	// 3. 从任务中恢复数据
	// 例如：selectedTokens, wallets, network 等

	// 4. 继续执行任务
	resumeSweepTask(task);
}
```

```svelte
<!-- 在模板中添加恢复模态框 -->
<TaskRecoveryModal
	bind:isOpen={showRecoveryModal}
	onClose={() => (showRecoveryModal = false)}
	onRecover={handleRecoverTask}
/>
```

### 3. 创建任务执行器

创建一个执行器函数来处理每个子任务：

```typescript
// src/features/token-sweep/task-executor.ts
import type { TaskExecutionContext } from '$lib/task-manager';
import type { Address } from 'viem';

export interface SweepSubTaskData {
	name: string;
	tokenId: string;
	tokenAddress?: Address;
	walletAddresses: Address[];
	targetAddress: Address;
	batchNumber: number;
	isNative: boolean;
}

export async function executeSweepSubTask(ctx: TaskExecutionContext) {
	const data = ctx.subTask.data as SweepSubTaskData;

	try {
		// 检查是否暂停
		if (ctx.isPaused()) {
			await ctx.pauseTask('user', '用户暂停');
			return;
		}

		// 检查 Gas 余额（针对临时钱包模式）
		if (ctx.checkGasBalance) {
			const hasGas = await ctx.checkGasBalance();
			if (!hasGas) {
				await ctx.pauseTask('insufficient_gas', 'Gas 余额不足');
				return;
			}
		}

		// 更新进度：准备阶段
		await ctx.updateProgress(10, '准备批次交易...');

		// 执行归集逻辑
		const results = [];
		const totalWallets = data.walletAddresses.length;

		for (let i = 0; i < totalWallets; i++) {
			const wallet = data.walletAddresses[i];

			// 检查是否暂停
			if (ctx.isPaused()) {
				await ctx.pauseTask('user', '用户暂停');
				return;
			}

			// 更新进度
			const progress = 10 + Math.floor((i / totalWallets) * 80);
			await ctx.updateProgress(progress, `处理钱包 ${i + 1}/${totalWallets}...`);

			try {
				// 执行转账
				const hash = await transferToken({
					from: wallet,
					to: data.targetAddress,
					token: data.tokenAddress,
					isNative: data.isNative
				});

				results.push({ wallet, hash, success: true });
			} catch (error) {
				results.push({
					wallet,
					error: error instanceof Error ? error.message : String(error),
					success: false
				});
			}
		}

		// 检查结果
		const successCount = results.filter((r) => r.success).length;

		if (successCount === 0) {
			await ctx.failSubTask('所有转账均失败');
		} else {
			await ctx.updateProgress(100, '批次完成');
			await ctx.completeSubTask({ results, successCount });
		}
	} catch (error) {
		await ctx.failSubTask(error instanceof Error ? error.message : String(error));
	}
}
```

### 4. 在执行步骤中集成任务系统

在第五步（执行步骤）中创建和执行任务：

```typescript
// src/features/token-sweep/ui/steps/step5-confirm-sweep-content.svelte
import { createTask, executeTask, taskStore } from '$lib/task-manager';
import { executeSweepSubTask } from '../../task-executor';
import type { SweepSubTaskData } from '../../task-executor';

let currentTask = $state<Task | null>(null);
let isExecuting = $state(false);

async function handleStartSweep() {
	try {
		isExecuting = true;

		// 1. 准备子任务数据
		const subTasksData: SweepSubTaskData[] = [];

		for (const [tokenId, stat] of tokenStats) {
			const batchCount = Math.ceil(stat.walletsWithBalance.length / 100);

			for (let i = 0; i < batchCount; i++) {
				const batchWallets = stat.walletsWithBalance.slice(i * 100, (i + 1) * 100);

				subTasksData.push({
					name: `${stat.symbol} - 批次 ${i + 1}`,
					tokenId,
					tokenAddress: stat.address as Address,
					walletAddresses: batchWallets as Address[],
					targetAddress: targetWallet as Address,
					batchNumber: i + 1,
					isNative: tokenId.endsWith(':native')
				});
			}
		}

		// 2. 创建任务
		const task = await createTask({
			type: 'token-sweep',
			name: `Token Sweep - ${selectedTokenIds.length} 个代币`,
			subTasksData,
			config: {
				// 不可变的配置（用于恢复时重建状态）
				network: currentNetwork,
				targetAddress: targetWallet,
				transactionMode,
				selectedTokenIds
				// ... 其他配置
			},
			maxAttempts: 3
		});

		currentTask = task;
		taskStore.setTask(task);

		// 3. 执行任务
		await executeTask(task.id, executeSweepSubTask, (task, subTask) => {
			// 进度回调 - 更新 UI
			taskStore.setTask(task);
			currentTask = task;

			// 可选：显示通知
			console.log(`${subTask.name}: ${subTask.progress}%`);
		});

		// 4. 任务完成
		if (currentTask.status === 'completed') {
			showSuccessNotification('归集完成！');
		} else if (currentTask.status === 'paused') {
			showInfoNotification('任务已暂停');
		} else if (currentTask.status === 'failed') {
			showErrorNotification('任务失败');
		}
	} catch (error) {
		console.error('执行任务失败:', error);
		showErrorNotification('任务执行出错');
	} finally {
		isExecuting = false;
	}
}

// 恢复已有任务
async function resumeSweepTask(task: Task) {
	currentTask = task;
	isExecuting = true;

	try {
		// 恢复执行
		await executeTask(task.id, executeSweepSubTask, (task, subTask) => {
			taskStore.setTask(task);
			currentTask = task;
		});

		// 检查最终状态
		if (currentTask.status === 'completed') {
			showSuccessNotification('归集完成！');
		}
	} catch (error) {
		showErrorNotification('恢复任务失败');
	} finally {
		isExecuting = false;
	}
}

// 暂停任务
async function handlePauseTask() {
	if (currentTask) {
		await pauseTask(currentTask.id, 'user', '用户手动暂停');
		taskStore.refreshTask(currentTask.id);
	}
}

// 取消任务
async function handleCancelTask() {
	if (currentTask && confirm('确定要取消任务吗？')) {
		await cancelTask(currentTask.id);
		taskStore.refreshTask(currentTask.id);
	}
}
```

### 5. 在 UI 中显示任务进度

```svelte
<!-- step5-confirm-sweep-content.svelte -->

{#if currentTask}
	<div class="task-progress">
		<h3>{currentTask.name}</h3>

		<div class="progress-bar">
			<div class="progress-fill" style="width: {currentTask.progress}%"></div>
		</div>

		<div class="task-stats">
			<span>进度：{currentTask.progress}%</span>
			<span>{currentTask.completedSubTasks}/{currentTask.totalSubTasks} 个批次完成</span>
			{#if currentTask.failedSubTasks > 0}
				<span class="error">{currentTask.failedSubTasks} 个失败</span>
			{/if}
		</div>

		<!-- 当前子任务 -->
		{#if currentTask.currentSubTaskNumber < currentTask.totalSubTasks}
			{@const currentSubTask = currentTask.subTasks[currentTask.currentSubTaskNumber]}
			<div class="current-subtask">
				<p>{currentSubTask.name}</p>
				<div class="progress-bar small">
					<div class="progress-fill" style="width: {currentSubTask.progress || 0}%"></div>
				</div>
			</div>
		{/if}

		<!-- 控制按钮 -->
		<div class="task-actions">
			{#if currentTask.status === 'running' && !currentTask.isPaused}
				<button onclick={handlePauseTask}>暂停</button>
			{/if}
			{#if currentTask.status === 'paused'}
				<button onclick={() => resumeSweepTask(currentTask)}>继续</button>
			{/if}
			<button onclick={handleCancelTask} class="danger">取消</button>
		</div>
	</div>
{/if}
```

## 高级功能

### Gas 余额检查

在创建任务执行上下文时提供 `checkGasBalance` 函数：

```typescript
// 在 task-manager.ts 的 executeTask 函数中添加
const context: TaskExecutionContext = {
	// ... 其他属性
	checkGasBalance: async () => {
		if (transactionMode === 'temporary' && temporaryWallet) {
			const balance = await getBalance(temporaryWallet.address);
			const required = estimatedGasForRemaining;

			if (balance < required) {
				return false;
			}
		}
		return true;
	}
};
```

### 任务状态持久化

所有任务状态自动保存到 IndexedDB，包括：

- 任务配置（`task.config`）
- 运行时状态（`task.state`）
- 子任务进度
- 错误信息

### 浏览器刷新恢复

当用户刷新浏览器时：

1. `taskStore.init()` 自动从 IndexedDB 加载所有任务
2. 检测到未完成任务时显示恢复模态框
3. 用户选择恢复后，从上次中断的子任务继续执行

## 完整示例文件

查看以下文件了解完整实现：

- `src/features/token-sweep/+page.svelte` - 应用入口，任务恢复
- `src/features/token-sweep/task-executor.ts` - 子任务执行器
- `src/features/token-sweep/ui/steps/step5-confirm-sweep-content.svelte` - 任务集成

## API 参考

### 创建任务

```typescript
import { createTask } from '$lib/task-manager';

const task = await createTask({
	type: 'your-task-type',
	name: '任务名称',
	subTasksData: [
		{ name: '子任务 1', ...data },
		{ name: '子任务 2', ...data }
	],
	config: {
		/* 不可变配置 */
	},
	maxAttempts: 3 // 子任务失败时重试次数
});
```

### 执行任务

```typescript
import { executeTask } from '$lib/task-manager';

await executeTask(taskId, executorFunction, (task, subTask) => {
	// 进度回调
	console.log(`${subTask.name}: ${subTask.progress}%`);
});
```

### 暂停/恢复/取消

```typescript
import { pauseTask, resumeTask, cancelTask } from '$lib/task-manager';

// 暂停
await pauseTask(taskId, 'user', '用户暂停');

// 恢复
await resumeTask(taskId);

// 取消
await cancelTask(taskId);
```

### 使用 Svelte Store

```typescript
import { taskStore } from '$lib/task-manager';

// 初始化
await taskStore.init();

// 获取任务
const allTasks = taskStore.allTasks;
const runningTasks = taskStore.runningTasks;
const pausedTasks = taskStore.pausedTasks;

// 更新任务
taskStore.setTask(updatedTask);

// 刷新任务
await taskStore.refreshTask(taskId);
```

## 最佳实践

### 1. 子任务粒度

将工作分解为合理大小的子任务：

- ✅ **推荐**：每 100 个钱包一个批次
- ❌ **不推荐**：所有钱包放在一个子任务中
- ❌ **不推荐**：每个钱包一个子任务（太细）

### 2. 检查暂停状态

在长时间操作中定期检查：

```typescript
for (let i = 0; i < items.length; i++) {
	if (ctx.isPaused()) {
		await ctx.pauseTask('user', '用户暂停');
		return;
	}
	// 处理 item
}
```

### 3. 错误处理

让系统自动重试小错误，只在严重错误时失败：

```typescript
try {
	await riskyOperation();
} catch (error) {
	// 小错误会自动重试（maxAttempts 次）
	throw error;
}
```

### 4. 进度更新

提供有意义的进度和消息：

```typescript
await ctx.updateProgress(50, '正在处理钱包 50/100...');
```

### 5. 任务配置 vs 状态

- **config**：不可变，用于恢复时重建（网络、地址等）
- **state**：可变，存储运行时数据（当前索引、临时结果等）

```typescript
config: {
  network: 'sepolia',
  targetAddress: '0x...',
  tokens: ['USDT', 'USDC']
}

// 执行过程中更新状态
await ctx.updateTaskState({
  processedWallets: 150,
  lastProcessedIndex: 149
});
```

## 常见问题

### Q: 如何处理网络错误？

A: 系统会自动重试（根据 `maxAttempts`）。如果需要暂停等待网络恢复：

```typescript
try {
	await networkOperation();
} catch (error) {
	if (isNetworkError(error)) {
		await ctx.pauseTask('network_error', '网络错误，请稍后重试');
		return;
	}
	throw error;
}
```

### Q: 如何在任务间共享数据？

A: 使用 `task.state` 存储共享数据：

```typescript
// 在子任务中保存
await ctx.updateTaskState({
	totalProcessed: existingState.totalProcessed + batchResults.length
});

// 在下一个子任务中读取
const totalProcessed = ctx.task.state.totalProcessed || 0;
```

### Q: 如何清理已完成的任务？

A: 使用 taskStore 提供的方法：

```typescript
// 清理所有已完成的任务
await taskStore.clearCompleted();

// 清理所有失败的任务
await taskStore.clearFailed();

// 删除特定任务
await taskStore.deleteTask(taskId);
```

## 总结

通过集成任务管理系统，您的应用将获得：

1. ✅ 可靠的任务执行和恢复机制
2. ✅ 友好的用户体验（暂停/恢复）
3. ✅ 详细的进度追踪和错误处理
4. ✅ 开箱即用的 UI 组件
5. ✅ 浏览器刷新后自动恢复

参考 Token Sweep 的实现，您可以快速为任何长时间运行的操作添加任务管理功能！
