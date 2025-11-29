<script lang="ts">
	/**
	 * Token Sweep with Task Manager v2 - Integration Example
	 *
	 * 展示如何使用树形任务管理系统来执行 Token Sweep
	 */
	import { onMount } from 'svelte';
	import type { Address } from 'viem';
	import {
		createTask,
		executeTask,
		pauseTask,
		resumeTask,
		cancelTask
	} from '$lib/task-manager/task-manager.v2';
	import { taskStore } from '$lib/task-manager/task-store.v2.svelte';
	import {
		tokenSweepExecutors,
		buildTokenSweepTaskTree
	} from '@/features/token-sweep/task-executor.v2';
	import type { TokenSweepConfig } from '@/features/token-sweep/task-executor.v2';

	import TaskList from '$lib/task-manager/components/task-list.v2.svelte';
	import TaskDetail from '$lib/task-manager/components/task-detail.v2.svelte';
	import TaskRecoveryModal from '$lib/task-manager/components/task-recovery-modal.v2.svelte';
	import type { Task } from '$lib/task-manager/types.v2';

	// Example configuration
	const exampleConfig: TokenSweepConfig = {
		network: 'ethereum',
		tokens: [
			{
				id: 'usdt',
				address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' as Address, // USDT
				symbol: 'USDT',
				decimals: 6,
				isNative: false,
				wallets: [
					// Example wallets
					'0x0000000000000000000000000000000000000001' as Address,
					'0x0000000000000000000000000000000000000002' as Address,
					'0x0000000000000000000000000000000000000003' as Address
				]
			},
			{
				id: 'usdc',
				address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as Address, // USDC
				symbol: 'USDC',
				decimals: 6,
				isNative: false,
				wallets: [
					'0x0000000000000000000000000000000000000004' as Address,
					'0x0000000000000000000000000000000000000005' as Address
				]
			}
		],
		targetAddress: '0x0000000000000000000000000000000000000000' as Address,
		batchSize: 10
	};

	// UI State
	let selectedTask = $state<Task | null>(null);
	let showTaskDetail = $state(false);
	let showRecoveryModal = $state(false);

	// Task store data
	let tasks = $derived(taskStore.allTasks);
	let recoverableTasks = $derived(
		tasks.filter((t) => t.status === 'paused' || t.status === 'running')
	);

	// Load tasks from DB on mount
	onMount(async () => {
		await taskStore.init();

		// Show recovery modal if there are recoverable tasks
		if (recoverableTasks.length > 0) {
			showRecoveryModal = true;
		}
	});

	// Start new token sweep
	async function startTokenSweep() {
		try {
			// Build task tree
			const taskOptions = buildTokenSweepTaskTree(exampleConfig);

			// Create and save task
			const rootTask = await createTask(taskOptions);

			// Add to store
			taskStore.setTask(rootTask);

			// Execute task
			executeTask(
				rootTask.id,
				tokenSweepExecutors,
				// Progress callback
				async (root, current) => {
					// Update store
					taskStore.setTask(root);

					console.log(
						`Task progress: ${root.progress}%, Current: ${current.name}, Status: ${current.status}`
					);
				}
			).catch((error) => {
				console.error('Task execution failed:', error);
			});
		} catch (error) {
			console.error('Failed to start token sweep:', error);
		}
	}

	// Task actions
	async function handlePauseTask(task: Task) {
		try {
			await pauseTask(task, task.id, 'user', '用户暂停');
			await taskStore.refreshTask(task.id);
		} catch (error) {
			console.error('Failed to pause task:', error);
		}
	}

	async function handleResumeTask(task: Task) {
		try {
			// Resume task by setting isPaused to false
			await resumeTask(task, task.id);

			// Resume task execution
			executeTask(task.id, tokenSweepExecutors, async (root, current) => {
				taskStore.setTask(root);
				console.log(`Task resumed: ${root.progress}%`);
			}).catch((error) => {
				console.error('Task resume failed:', error);
			});
		} catch (error) {
			console.error('Failed to resume task:', error);
		}
	}

	async function handleCancelTask(task: Task) {
		if (confirm(`确定要取消任务 "${task.name}" 吗？`)) {
			try {
				await cancelTask(task, task.id);
				await taskStore.refreshTask(task.id);
			} catch (error) {
				console.error('Failed to cancel task:', error);
			}
		}
	}

	async function handleDeleteTask(task: Task) {
		if (confirm(`确定要删除任务 "${task.name}" 吗？`)) {
			try {
				await taskStore.deleteTask(task.id);
			} catch (error) {
				console.error('Failed to delete task:', error);
			}
		}
	}

	function handleTaskClick(task: Task) {
		selectedTask = task;
		showTaskDetail = true;
	}

	function handleCloseDetail() {
		showTaskDetail = false;
		selectedTask = null;
	}
</script>

<div class="token-sweep-example">
	<div class="header">
		<h1>Token Sweep - 任务管理示例</h1>
		<p class="description">
			演示如何使用树形任务管理系统来执行多代币批量归集操作。本示例创建一个包含多个代币和批次的任务树。
		</p>
	</div>

	<!-- Start Button -->
	<div class="actions">
		<button class="btn-start" onclick={startTokenSweep}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<polygon points="5 3 19 12 5 21 5 3"></polygon>
			</svg>
			开始归集任务
		</button>

		<div class="stats">
			<span class="stat-item">
				总任务数：<strong>{tasks.length}</strong>
			</span>
			<span class="stat-item">
				运行中：<strong>{taskStore.runningTasks.length}</strong>
			</span>
			<span class="stat-item">
				已暂停：<strong>{taskStore.pausedTasks.length}</strong>
			</span>
			<span class="stat-item">
				已完成：<strong>{taskStore.completedTasks.length}</strong>
			</span>
		</div>
	</div>

	<!-- Task List -->
	<div class="task-list-container">
		<h2>任务列表</h2>
		<TaskList
			{tasks}
			onResume={handleResumeTask}
			onPause={handlePauseTask}
			onCancel={handleCancelTask}
			onDelete={handleDeleteTask}
			onTaskClick={handleTaskClick}
		/>
	</div>

	<!-- Task Detail Modal -->
	<TaskDetail
		task={selectedTask}
		isOpen={showTaskDetail}
		onClose={handleCloseDetail}
		onResume={handleResumeTask}
		onPause={handlePauseTask}
		onCancel={handleCancelTask}
	/>

	<!-- Task Recovery Modal -->
	<TaskRecoveryModal
		isOpen={showRecoveryModal}
		{recoverableTasks}
		onClose={() => (showRecoveryModal = false)}
		onRecover={handleResumeTask}
		onDelete={handleDeleteTask}
	/>
</div>

<style>
	.token-sweep-example {
		max-width: 80rem;
		margin: 0 auto;
		padding: 2rem;
	}

	.header {
		margin-bottom: 2rem;
	}

	.header h1 {
		margin: 0 0 0.5rem 0;
		font-size: 2rem;
		font-weight: 700;
		color: #111827;
	}

	.description {
		margin: 0;
		color: #6b7280;
		font-size: 1rem;
		line-height: 1.6;
	}

	.actions {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.5rem;
		background-color: #f9fafb;
		border-radius: 12px;
		margin-bottom: 2rem;
		flex-wrap: wrap;
	}

	.btn-start {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		background-color: #3b82f6;
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.btn-start:hover {
		background-color: #2563eb;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.stats {
		display: flex;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	.stat-item {
		font-size: 0.875rem;
		color: #6b7280;
	}

	.stat-item strong {
		color: #111827;
		font-weight: 600;
	}

	.task-list-container {
		background-color: white;
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.task-list-container h2 {
		margin: 0 0 1.5rem 0;
		font-size: 1.25rem;
		font-weight: 600;
		color: #111827;
	}
</style>
