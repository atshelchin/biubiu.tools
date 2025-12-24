<script lang="ts">
	/**
	 * TaskList v2 - Tree Structure Support
	 *
	 * 显示任务列表，支持树形结构展示和过滤
	 */
	import {
		Play,
		Pause,
		X,
		Trash2,
		ChevronDown,
		ChevronRight,
		Filter,
		CheckCircle,
		XCircle,
		Circle,
		Clock
	} from '@lucide/svelte';
	import type { Task, TaskStatus } from '../types.v2';
	import { formatDistanceToNow } from 'date-fns';
	import { zhCN } from 'date-fns/locale';
	import TaskTreeNode from './task-tree-node.svelte';
	import { SvelteSet } from 'svelte/reactivity';

	interface Props {
		tasks: Task[];
		onResume?: (task: Task) => void;
		onPause?: (task: Task) => void;
		onCancel?: (task: Task) => void;
		onDelete?: (task: Task) => void;
		onTaskClick?: (task: Task) => void;
		showFilter?: boolean;
	}

	let {
		tasks,
		onResume,
		onPause,
		onCancel,
		onDelete,
		onTaskClick,
		showFilter = true
	}: Props = $props();

	// 过滤状态
	type FilterType = 'all' | TaskStatus;
	let currentFilter = $state<FilterType>('all');

	// 展开的任务树
	let expandedTasks = new SvelteSet<string>();

	// 过滤后的任务列表
	let filteredTasks = $derived(
		currentFilter === 'all' ? tasks : tasks.filter((t) => t.status === currentFilter)
	);

	function toggleTaskExpand(taskId: string) {
		if (expandedTasks.has(taskId)) {
			expandedTasks.delete(taskId);
		} else {
			expandedTasks.add(taskId);
		}
	}

	function formatTime(timestamp?: number): string {
		if (!timestamp) return '-';
		return formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: zhCN });
	}

	function getStatusText(status: TaskStatus): string {
		switch (status) {
			case 'pending':
				return '待开始';
			case 'running':
				return '运行中';
			case 'paused':
				return '已暂停';
			case 'completed':
				return '已完成';
			case 'failed':
				return '失败';
			case 'cancelled':
				return '已取消';
			case 'partial':
				return '部分完成';
			default:
				return status;
		}
	}

	function getStatusColor(status: TaskStatus): string {
		switch (status) {
			case 'pending':
				return 'status-pending';
			case 'running':
				return 'status-running';
			case 'paused':
				return 'status-paused';
			case 'completed':
				return 'status-completed';
			case 'failed':
				return 'status-failed';
			case 'cancelled':
				return 'status-cancelled';
			case 'partial':
				return 'status-partial';
			default:
				return '';
		}
	}

	function getStatusIcon(status: TaskStatus) {
		switch (status) {
			case 'completed':
				return CheckCircle;
			case 'failed':
				return XCircle;
			case 'paused':
				return Pause;
			default:
				return Circle;
		}
	}

	// 过滤选项
	const filterOptions: { value: FilterType; label: string }[] = [
		{ value: 'all', label: '全部' },
		{ value: 'running', label: '运行中' },
		{ value: 'paused', label: '已暂停' },
		{ value: 'pending', label: '待开始' },
		{ value: 'completed', label: '已完成' },
		{ value: 'failed', label: '失败' },
		{ value: 'cancelled', label: '已取消' },
		{ value: 'partial', label: '部分完成' }
	];
</script>

<div class="task-list">
	<!-- 过滤器 -->
	{#if showFilter}
		<div class="filter-bar">
			<div class="filter-icon">
				<Filter size={16} />
				<span>筛选：</span>
			</div>
			<div class="filter-buttons">
				{#each filterOptions as option (option.value)}
					<button
						class="filter-button"
						class:active={currentFilter === option.value}
						onclick={() => (currentFilter = option.value)}
					>
						{option.label}
					</button>
				{/each}
			</div>
		</div>
	{/if}

	<!-- 任务列表 -->
	<div class="tasks-container">
		{#if filteredTasks.length === 0}
			<div class="empty-state">
				<Circle size={48} />
				<p>暂无任务</p>
			</div>
		{:else}
			{#each filteredTasks as task (task.id)}
				{@const StatusIcon = getStatusIcon(task.status)}
				<div class="task-card">
					<!-- 任务头部 -->
					<div class="task-header">
						<!-- 展开按钮 -->
						<button
							class="expand-button"
							onclick={() => toggleTaskExpand(task.id)}
							disabled={task.children.length === 0}
						>
							{#if task.children.length > 0}
								{#if expandedTasks.has(task.id)}
									<ChevronDown size={20} />
								{:else}
									<ChevronRight size={20} />
								{/if}
							{:else}
								<span class="placeholder"></span>
							{/if}
						</button>

						<!-- 状态图标和信息 -->
						<StatusIcon size={20} class="status-icon {getStatusColor(task.status)}" />

						<div
							class="task-info"
							onclick={() => onTaskClick?.(task)}
							onkeydown={(e) => e.key === 'Enter' && onTaskClick?.(task)}
							role="button"
							tabindex="0"
						>
							<h3 class="task-name">{task.name}</h3>
							<div class="task-meta">
								<span class="task-status {getStatusColor(task.status)}">
									{getStatusText(task.status)}
								</span>
								{#if task.isLeaf}
									<span class="leaf-badge">叶子任务</span>
								{:else}
									<span class="meta-text">{task.children.length} 个子任务</span>
								{/if}
								<span class="meta-text">{task.totalLeaves} 个叶子任务</span>
								<span class="meta-text"><Clock size={12} /> {formatTime(task.createdAt)}</span>
							</div>
						</div>

						<!-- 操作按钮 -->
						<div class="task-actions">
							{#if task.status === 'paused'}
								<button
									class="action-button btn-resume"
									onclick={(e) => {
										e.stopPropagation();
										onResume?.(task);
									}}
									title="恢复执行"
								>
									<Play size={16} />
								</button>
							{/if}

							{#if task.status === 'running'}
								<button
									class="action-button btn-pause"
									onclick={(e) => {
										e.stopPropagation();
										onPause?.(task);
									}}
									title="暂停"
								>
									<Pause size={16} />
								</button>
							{/if}

							{#if task.status === 'running' || task.status === 'paused'}
								<button
									class="action-button btn-cancel"
									onclick={(e) => {
										e.stopPropagation();
										onCancel?.(task);
									}}
									title="取消任务"
								>
									<X size={16} />
								</button>
							{/if}

							{#if task.status === 'completed' || task.status === 'failed' || task.status === 'cancelled'}
								<button
									class="action-button btn-delete"
									onclick={(e) => {
										e.stopPropagation();
										onDelete?.(task);
									}}
									title="删除任务"
								>
									<Trash2 size={16} />
								</button>
							{/if}
						</div>
					</div>

					<!-- 进度条 -->
					<div class="progress-bar">
						<div class="progress-fill" style="width: {task.progress}%"></div>
					</div>

					<!-- 统计信息 -->
					<div class="task-stats">
						<span>进度：{task.progress}%</span>
						<span>已完成：{task.completedLeaves}/{task.totalLeaves}</span>
						{#if task.failedLeaves > 0}
							<span class="error-text">失败：{task.failedLeaves}</span>
						{/if}
					</div>

					<!-- 展开的任务树 -->
					{#if expandedTasks.has(task.id) && task.children.length > 0}
						<div class="task-tree">
							<TaskTreeNode {task} depth={0} {onTaskClick} />
						</div>
					{/if}
				</div>
			{/each}
		{/if}
	</div>
</div>

<style>
	.task-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	/* 过滤器 */
	.filter-bar {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background-color: #f9fafb;
		border-radius: 8px;
		flex-wrap: wrap;
	}

	.filter-icon {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: #6b7280;
		font-size: 0.875rem;
		font-weight: 500;
	}

	.filter-buttons {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.filter-button {
		padding: 0.375rem 0.75rem;
		border: 1px solid #e5e7eb;
		background-color: white;
		color: #6b7280;
		border-radius: 6px;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.filter-button:hover {
		background-color: #f3f4f6;
		border-color: #d1d5db;
	}

	.filter-button.active {
		background-color: #3b82f6;
		color: white;
		border-color: #3b82f6;
	}

	/* 任务容器 */
	.tasks-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem;
		color: #9ca3af;
		gap: 0.75rem;
	}

	.empty-state p {
		margin: 0;
		font-size: 0.875rem;
	}

	/* 任务卡片 */
	.task-card {
		background-color: white;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		transition: box-shadow 0.2s;
	}

	.task-card:hover {
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	/* 任务头部 */
	.task-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.expand-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		padding: 0;
		border: none;
		background: transparent;
		color: #6b7280;
		cursor: pointer;
		border-radius: 4px;
		transition: all 0.2s;
		flex-shrink: 0;
	}

	.expand-button:hover:not(:disabled) {
		background-color: #f3f4f6;
	}

	.expand-button:disabled {
		cursor: default;
		opacity: 0;
	}

	.placeholder {
		width: 20px;
		height: 20px;
		display: block;
	}

	.task-info {
		flex: 1;
		min-width: 0;
		cursor: pointer;
	}

	.task-name {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
		color: #111827;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.task-meta {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-top: 0.25rem;
		flex-wrap: wrap;
	}

	.task-status {
		padding: 0.125rem 0.5rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.leaf-badge {
		padding: 0.125rem 0.5rem;
		background-color: #dbeafe;
		color: #1e40af;
		border-radius: 9999px;
		font-size: 0.625rem;
		font-weight: 600;
		text-transform: uppercase;
	}

	.meta-text {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.75rem;
		color: #6b7280;
	}

	/* 操作按钮 */
	.task-actions {
		display: flex;
		gap: 0.5rem;
		flex-shrink: 0;
	}

	.action-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s;
		color: white;
	}

	.btn-resume {
		background-color: #3b82f6;
	}

	.btn-resume:hover {
		background-color: #2563eb;
	}

	.btn-pause {
		background-color: #f59e0b;
	}

	.btn-pause:hover {
		background-color: #d97706;
	}

	.btn-cancel {
		background-color: #ef4444;
	}

	.btn-cancel:hover {
		background-color: #dc2626;
	}

	.btn-delete {
		background-color: #6b7280;
	}

	.btn-delete:hover {
		background-color: #4b5563;
	}

	/* 进度条 */
	.progress-bar {
		height: 6px;
		background-color: #e5e7eb;
		border-radius: 9999px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #3b82f6, #2563eb);
		transition: width 0.3s ease;
	}

	/* 统计信息 */
	.task-stats {
		display: flex;
		gap: 1rem;
		font-size: 0.875rem;
		color: #6b7280;
	}

	.error-text {
		color: #dc2626;
		font-weight: 500;
	}

	/* 任务树 */
	.task-tree {
		background-color: #f9fafb;
		border-radius: 6px;
		padding: 1rem;
		margin-top: 0.5rem;
	}

	/* 状态颜色 */
	.status-pending {
		background-color: #fef3c7;
		color: #92400e;
	}

	.status-running {
		background-color: #dbeafe;
		color: #1e40af;
	}

	.status-paused {
		background-color: #fecaca;
		color: #991b1b;
	}

	.status-completed {
		background-color: #d1fae5;
		color: #065f46;
	}

	.status-failed {
		background-color: #fee2e2;
		color: #991b1b;
	}

	.status-cancelled {
		background-color: #f3f4f6;
		color: #6b7280;
	}

	.status-partial {
		background-color: #fef3c7;
		color: #92400e;
	}

	/* 状态图标颜色 */
	:global(.status-icon.status-pending) {
		color: #f59e0b;
	}

	:global(.status-icon.status-running) {
		color: #3b82f6;
	}

	:global(.status-icon.status-paused) {
		color: #ef4444;
	}

	:global(.status-icon.status-completed) {
		color: #10b981;
	}

	:global(.status-icon.status-failed) {
		color: #dc2626;
	}

	:global(.status-icon.status-cancelled) {
		color: #6b7280;
	}

	:global(.status-icon.status-partial) {
		color: #f59e0b;
	}
</style>
