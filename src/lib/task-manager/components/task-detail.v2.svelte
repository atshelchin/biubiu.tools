<script lang="ts">
	/**
	 * TaskDetail v2 - Tree Structure Support
	 *
	 * 显示任务树的详细信息，包括递归展示所有子任务
	 */
	import { X, Play, Pause, AlertCircle, Calendar, Clock, Activity, Layers } from '@lucide/svelte';
	import type { Task } from '../types.v2';
	import { formatDistanceToNow } from 'date-fns';
	import { zhCN } from 'date-fns/locale';
	import TaskTreeNode from './task-tree-node.svelte';

	interface Props {
		task: Task | null;
		isOpen: boolean;
		onClose: () => void;
		onResume?: (task: Task) => void;
		onPause?: (task: Task) => void;
		onCancel?: (task: Task) => void;
	}

	let { task = $bindable(), isOpen, onClose, onResume, onPause, onCancel }: Props = $props();

	function formatTime(timestamp?: number): string {
		if (!timestamp) return '-';
		return formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: zhCN });
	}

	function formatDuration(start?: number, end?: number): string {
		if (!start) return '-';
		const endTime = end || Date.now();
		const durationMs = endTime - start;
		const seconds = Math.floor(durationMs / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);

		if (hours > 0) {
			return `${hours}小时${minutes % 60}分钟`;
		} else if (minutes > 0) {
			return `${minutes}分钟${seconds % 60}秒`;
		} else {
			return `${seconds}秒`;
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
</script>

{#if isOpen && task}
	<div
		class="modal-overlay"
		onclick={onClose}
		onkeydown={(e) => e.key === 'Escape' && onClose()}
		role="presentation"
	>
		<div
			class="modal-content"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			role="dialog"
			aria-modal="true"
			tabindex="-1"
		>
			<div class="modal-header">
				<h2>{task.name}</h2>
				<button class="btn-close" onclick={onClose} aria-label="关闭">
					<X size={20} />
				</button>
			</div>

			<div class="modal-body">
				<!-- 任务状态概览 -->
				<div class="status-section">
					<div class="status-header">
						<span class="task-status {getStatusColor(task.status)}">
							{getStatusText(task.status)}
						</span>
						<div class="status-meta">
							<span><Activity size={14} /> 进度：{task.progress}%</span>
							<span
								><Layers size={14} /> {task.completedLeaves}/{task.totalLeaves} 个叶子任务完成</span
							>
							{#if task.failedLeaves > 0}
								<span class="error-text">{task.failedLeaves} 个失败</span>
							{/if}
						</div>
					</div>

					<div class="progress-bar">
						<div class="progress-fill" style="width: {task.progress}%"></div>
					</div>
				</div>

				<!-- 任务信息 -->
				<div class="info-section">
					<h3><Calendar size={18} /> 任务信息</h3>
					<div class="info-grid">
						<div class="info-item">
							<span class="label">任务类型</span>
							<span class="value">{task.type}</span>
						</div>
						<div class="info-item">
							<span class="label">深度</span>
							<span class="value">{task.depth === 0 ? '根任务' : `第 ${task.depth} 层`}</span>
						</div>
						{#if !task.isLeaf}
							<div class="info-item">
								<span class="label">子任务数</span>
								<span class="value">{task.children.length} 个</span>
							</div>
							<div class="info-item">
								<span class="label">叶子任务数</span>
								<span class="value">{task.totalLeaves} 个</span>
							</div>
						{:else}
							<div class="info-item">
								<span class="label">任务类型</span>
								<span class="value leaf-badge">叶子任务（可执行）</span>
							</div>
							{#if task.executor}
								<div class="info-item">
									<span class="label">执行器</span>
									<span class="value code">{task.executor}</span>
								</div>
							{/if}
						{/if}
						<div class="info-item">
							<span class="label">创建时间</span>
							<span class="value">{formatTime(task.createdAt)}</span>
						</div>
						{#if task.startedAt}
							<div class="info-item">
								<span class="label">开始时间</span>
								<span class="value">{formatTime(task.startedAt)}</span>
							</div>
						{/if}
						{#if task.completedAt}
							<div class="info-item">
								<span class="label">完成时间</span>
								<span class="value">{formatTime(task.completedAt)}</span>
							</div>
							<div class="info-item">
								<span class="label">执行时长</span>
								<span class="value"
									><Clock size={14} /> {formatDuration(task.startedAt, task.completedAt)}</span
								>
							</div>
						{/if}
						{#if task.isPaused && task.pauseReason}
							<div class="info-item">
								<span class="label">暂停原因</span>
								<span class="value error-text">{task.pauseReason}</span>
							</div>
						{/if}
					</div>
				</div>

				<!-- 任务操作 -->
				{#if task.status === 'paused' || task.status === 'running'}
					<div class="actions-section">
						{#if task.status === 'paused'}
							<button class="btn-action btn-resume" onclick={() => onResume?.(task)}>
								<Play size={16} />
								恢复执行
							</button>
						{/if}
						{#if task.status === 'running'}
							<button class="btn-action btn-pause" onclick={() => onPause?.(task)}>
								<Pause size={16} />
								暂停
							</button>
						{/if}
						<button class="btn-action btn-cancel" onclick={() => onCancel?.(task)}>
							<X size={16} />
							取消任务
						</button>
					</div>
				{/if}

				<!-- 错误信息 -->
				{#if task.errors.length > 0}
					<div class="errors-section">
						<h3>
							<AlertCircle size={18} />
							错误信息 ({task.errors.length})
						</h3>
						<div class="error-list">
							{#each task.errors as error, index (index)}
								<div class="error-item">{error}</div>
							{/each}
						</div>
					</div>
				{/if}

				<!-- 任务树展示 -->
				{#if task.children.length > 0}
					<div class="tree-section">
						<h3>
							<Layers size={18} />
							任务树 ({task.totalLeaves} 个叶子任务)
						</h3>
						<div class="tree-container">
							<TaskTreeNode {task} depth={0} />
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-overlay {
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 1rem;
	}

	.modal-content {
		background: white;
		border-radius: 12px;
		max-width: 900px;
		width: 100%;
		max-height: 90vh;
		display: flex;
		flex-direction: column;
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.5rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.modal-header h2 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 600;
		color: #111827;
	}

	.btn-close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border: none;
		background: transparent;
		color: #6b7280;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-close:hover {
		background-color: #f3f4f6;
		color: #111827;
	}

	.modal-body {
		padding: 1.5rem;
		overflow-y: auto;
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	/* 状态区域 */
	.status-section {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.status-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.task-status {
		padding: 0.375rem 1rem;
		border-radius: 9999px;
		font-size: 0.875rem;
		font-weight: 600;
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

	.status-meta {
		display: flex;
		gap: 1rem;
		font-size: 0.875rem;
		color: #6b7280;
		align-items: center;
	}

	.status-meta span {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.error-text {
		color: #dc2626;
		font-weight: 500;
	}

	.progress-bar {
		height: 8px;
		background-color: #e5e7eb;
		border-radius: 9999px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #3b82f6, #2563eb);
		transition: width 0.3s ease;
	}

	/* 信息区域 */
	.info-section,
	.tree-section,
	.errors-section {
		background-color: #f9fafb;
		border-radius: 8px;
		padding: 1rem;
	}

	.info-section h3,
	.tree-section h3,
	.errors-section h3 {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 0 0 1rem 0;
		font-size: 1rem;
		font-weight: 600;
		color: #111827;
	}

	.info-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}

	.info-item {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.info-item .label {
		font-size: 0.75rem;
		color: #6b7280;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.info-item .value {
		font-size: 0.875rem;
		color: #111827;
		font-weight: 500;
		display: flex;
		align-items: center;
		gap: 0.25rem;
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

	.code {
		font-family: 'Courier New', monospace;
		background-color: #f3f4f6;
		padding: 0.125rem 0.375rem;
		border-radius: 4px;
		font-size: 0.75rem;
	}

	/* 操作按钮 */
	.actions-section {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.btn-action {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.625rem 1.25rem;
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

	/* 错误列表 */
	.error-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.error-item {
		padding: 0.5rem;
		background-color: white;
		border-radius: 4px;
		font-size: 0.875rem;
		color: #dc2626;
		border-left: 3px solid #dc2626;
	}

	/* 树形展示 */
	.tree-container {
		background-color: white;
		border-radius: 6px;
		padding: 1rem;
		max-height: 400px;
		overflow-y: auto;
	}
</style>
