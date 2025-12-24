<script lang="ts">
	import { Play, Pause, X, Trash2, CheckCircle, XCircle, Clock, AlertCircle } from '@lucide/svelte';
	import type { Task } from '../types';
	import { taskStore } from '../task-store.svelte';
	import { formatDistanceToNow } from 'date-fns';
	import { zhCN } from 'date-fns/locale';

	interface Props {
		filter?: 'all' | 'running' | 'paused' | 'completed' | 'failed';
		onTaskClick?: (task: Task) => void;
		onResumeClick?: (task: Task) => void;
		onPauseClick?: (task: Task) => void;
		onCancelClick?: (task: Task) => void;
	}

	let { filter = 'all', onTaskClick, onResumeClick, onPauseClick, onCancelClick }: Props = $props();

	// Get tasks based on filter
	let tasks = $derived(() => {
		switch (filter) {
			case 'running':
				return taskStore.runningTasks;
			case 'paused':
				return taskStore.pausedTasks;
			case 'completed':
				return taskStore.completedTasks;
			case 'failed':
				return taskStore.failedTasks;
			default:
				return taskStore.allTasks;
		}
	});

	function formatTime(timestamp?: number): string {
		if (!timestamp) return '-';
		return formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: zhCN });
	}

	function getStatusIcon(status: string) {
		switch (status) {
			case 'running':
				return Play;
			case 'paused':
				return Pause;
			case 'completed':
				return CheckCircle;
			case 'failed':
				return XCircle;
			case 'cancelled':
				return X;
			default:
				return Clock;
		}
	}

	function getStatusText(status: string): string {
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

	function getStatusColor(status: string): string {
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

	function handleTaskClick(task: Task) {
		onTaskClick?.(task);
	}

	function handleResume(task: Task, event: Event) {
		event.stopPropagation();
		onResumeClick?.(task);
	}

	function handlePause(task: Task, event: Event) {
		event.stopPropagation();
		onPauseClick?.(task);
	}

	function handleCancel(task: Task, event: Event) {
		event.stopPropagation();
		onCancelClick?.(task);
	}

	async function handleDelete(task: Task, event: Event) {
		event.stopPropagation();
		if (confirm(`确定要删除任务 "${task.name}" 吗？`)) {
			await taskStore.deleteTask(task.id);
		}
	}
</script>

<div class="task-list">
	{#if taskStore.isLoading}
		<div class="loading-state">
			<Clock size={32} class="spinning" />
			<p>加载任务中...</p>
		</div>
	{:else if tasks().length === 0}
		<div class="empty-state">
			<AlertCircle size={48} />
			<p>暂无任务</p>
		</div>
	{:else}
		{#each tasks() as task (task.id)}
			{@const StatusIcon = getStatusIcon(task.status)}
			<div
				class="task-card"
				onclick={() => handleTaskClick(task)}
				onkeydown={(e) => e.key === 'Enter' && handleTaskClick(task)}
				role="button"
				tabindex="0"
			>
				<div class="task-header">
					<div class="task-title">
						<StatusIcon size={20} />
						<h3>{task.name}</h3>
					</div>
					<span class="task-status {getStatusColor(task.status)}">
						{getStatusText(task.status)}
					</span>
				</div>

				<div class="task-meta">
					<div class="meta-item">
						<span class="label">进度：</span>
						<span class="value"
							>{task.completedSubTasks}/{task.totalSubTasks} 子任务 ({task.progress}%)</span
						>
					</div>
					{#if task.failedSubTasks > 0}
						<div class="meta-item error">
							<span class="label">失败：</span>
							<span class="value">{task.failedSubTasks} 个子任务</span>
						</div>
					{/if}
					<div class="meta-item">
						<span class="label">更新：</span>
						<span class="value">{formatTime(task.updatedAt)}</span>
					</div>
				</div>

				<div class="progress-bar">
					<div class="progress-fill" style="width: {task.progress}%"></div>
				</div>

				<div class="task-actions">
					{#if task.status === 'paused'}
						<button class="btn-action btn-resume" onclick={(e) => handleResume(task, e)}>
							<Play size={16} />
							恢复
						</button>
					{/if}
					{#if task.status === 'running'}
						<button class="btn-action btn-pause" onclick={(e) => handlePause(task, e)}>
							<Pause size={16} />
							暂停
						</button>
					{/if}
					{#if task.status === 'running' || task.status === 'paused'}
						<button class="btn-action btn-cancel" onclick={(e) => handleCancel(task, e)}>
							<X size={16} />
							取消
						</button>
					{/if}
					{#if task.status === 'completed' || task.status === 'failed' || task.status === 'cancelled'}
						<button class="btn-action btn-delete" onclick={(e) => handleDelete(task, e)}>
							<Trash2 size={16} />
							删除
						</button>
					{/if}
				</div>
			</div>
		{/each}
	{/if}
</div>

<style>
	.task-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.loading-state,
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem 1rem;
		color: #9ca3af;
	}

	.loading-state p,
	.empty-state p {
		margin-top: 1rem;
		font-size: 1rem;
	}

	.task-card {
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		padding: 1rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.task-card:hover {
		border-color: #3b82f6;
		box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.1);
	}

	.task-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.task-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex: 1;
		min-width: 0;
	}

	.task-title h3 {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
		color: #111827;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.task-status {
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 500;
		white-space: nowrap;
	}

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

	.task-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 0.75rem;
		font-size: 0.875rem;
	}

	.meta-item {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.meta-item .label {
		color: #6b7280;
	}

	.meta-item .value {
		color: #111827;
		font-weight: 500;
	}

	.meta-item.error .value {
		color: #dc2626;
	}

	.progress-bar {
		height: 6px;
		background-color: #e5e7eb;
		border-radius: 9999px;
		overflow: hidden;
		margin-bottom: 0.75rem;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #3b82f6, #2563eb);
		transition: width 0.3s ease;
	}

	.task-actions {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.btn-action {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.375rem 0.75rem;
		border: none;
		border-radius: 6px;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-resume {
		background-color: #3b82f6;
		color: white;
	}

	.btn-resume:hover {
		background-color: #2563eb;
	}

	.btn-pause {
		background-color: #f59e0b;
		color: white;
	}

	.btn-pause:hover {
		background-color: #d97706;
	}

	.btn-cancel {
		background-color: #ef4444;
		color: white;
	}

	.btn-cancel:hover {
		background-color: #dc2626;
	}

	.btn-delete {
		background-color: #f3f4f6;
		color: #6b7280;
	}

	.btn-delete:hover {
		background-color: #fee2e2;
		color: #dc2626;
	}

	:global(.spinning) {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
