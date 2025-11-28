<script lang="ts">
	/**
	 * TaskRecoveryModal v2 - Tree Structure Support
	 *
	 * 显示可恢复的任务列表，支持树形结构
	 */
	import { X, PlayCircle, Trash2, Clock, AlertCircle, Layers } from '@lucide/svelte';
	import type { Task } from '../types.v2';
	import { formatDistanceToNow } from 'date-fns';
	import { zhCN } from 'date-fns/locale';

	interface Props {
		isOpen: boolean;
		recoverableTasks: Task[];
		onClose: () => void;
		onRecover: (task: Task) => void;
		onDelete: (task: Task) => void;
	}

	let { isOpen = $bindable(), recoverableTasks, onClose, onRecover, onDelete }: Props = $props();

	function handleRecover(task: Task) {
		onRecover(task);
		onClose();
	}

	async function handleDelete(task: Task) {
		if (confirm(`确定要删除任务 "${task.name}" 吗？这将删除整个任务树。`)) {
			onDelete(task);
		}
	}

	function formatTime(timestamp?: number): string {
		if (!timestamp) return '-';
		return formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: zhCN });
	}

	function getStatusText(task: Task): string {
		switch (task.status) {
			case 'pending':
				return '待开始';
			case 'running':
				return '运行中';
			case 'paused':
				return '已暂停';
			default:
				return task.status;
		}
	}

	function getStatusColor(task: Task): string {
		switch (task.status) {
			case 'pending':
				return 'status-pending';
			case 'running':
				return 'status-running';
			case 'paused':
				return 'status-paused';
			default:
				return '';
		}
	}

	function getPauseReasonText(task: Task): string {
		if (!task.pauseReason) return '';
		switch (task.pauseReason) {
			case 'user':
				return '用户暂停';
			case 'insufficient_gas':
				return 'Gas 不足';
			case 'network_error':
				return '网络错误';
			case 'rate_limit':
				return '速率限制';
			case 'error':
				return '执行错误';
			default:
				return task.pauseReason;
		}
	}
</script>

{#if isOpen}
	<div class="modal-overlay" onclick={onClose} role="button" tabindex="-1">
		<div class="modal-content" onclick={(e) => e.stopPropagation()} role="dialog">
			<div class="modal-header">
				<h2>
					<Clock size={24} />
					恢复未完成的任务
				</h2>
				<button class="btn-close" onclick={onClose} aria-label="关闭">
					<X size={20} />
				</button>
			</div>

			<div class="modal-body">
				{#if recoverableTasks.length === 0}
					<div class="empty-state">
						<AlertCircle size={48} />
						<p>没有可恢复的任务</p>
					</div>
				{:else}
					<p class="hint">
						检测到 {recoverableTasks.length} 个未完成的任务，您可以选择恢复执行或删除它们。
					</p>

					<div class="task-list">
						{#each recoverableTasks as task (task.id)}
							<div class="task-card">
								<div class="task-info">
									<div class="task-header">
										<h3>{task.name}</h3>
										<span class="task-status {getStatusColor(task)}">
											{getStatusText(task)}
										</span>
									</div>

									<div class="task-meta">
										<!-- 进度信息 -->
										<div class="meta-item">
											<span class="label">进度：</span>
											<span class="value">{task.progress}%</span>
										</div>

										<!-- 叶子任务统计 -->
										<div class="meta-item">
											<Layers size={14} />
											<span class="value">
												{task.completedLeaves}/{task.totalLeaves} 个叶子任务完成
											</span>
										</div>

										<!-- 失败任务数 -->
										{#if task.failedLeaves > 0}
											<div class="meta-item error">
												<span class="label">失败：</span>
												<span class="value">{task.failedLeaves} 个</span>
											</div>
										{/if}

										<!-- 暂停原因 -->
										{#if task.pauseReason}
											<div class="meta-item pause-reason">
												<span class="label">暂停原因：</span>
												<span class="value">{getPauseReasonText(task)}</span>
												{#if task.pauseMessage}
													<span class="message">({task.pauseMessage})</span>
												{/if}
											</div>
										{/if}

										<!-- 任务类型 -->
										<div class="meta-item">
											<span class="label">类型：</span>
											<span class="value">{task.type}</span>
										</div>

										<!-- 深度信息 -->
										{#if !task.isLeaf}
											<div class="meta-item">
												<span class="label">结构：</span>
												<span class="value">
													{task.depth === 0 ? '根任务' : `第 ${task.depth} 层`}，包含 {task.children
														.length} 个子任务
												</span>
											</div>
										{/if}

										<!-- 更新时间 -->
										<div class="meta-item">
											<span class="label">更新时间：</span>
											<span class="value">{formatTime(task.updatedAt)}</span>
										</div>
									</div>

									<!-- 进度条 -->
									<div class="progress-bar">
										<div class="progress-fill" style="width: {task.progress}%"></div>
									</div>
								</div>

								<div class="task-actions">
									<button class="btn-recover" onclick={() => handleRecover(task)}>
										<PlayCircle size={16} />
										恢复执行
									</button>
									<button
										class="btn-delete"
										onclick={() => handleDelete(task)}
										aria-label="删除任务"
									>
										<Trash2 size={16} />
									</button>
								</div>
							</div>
						{/each}
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
		max-width: 700px;
		width: 100%;
		max-height: 80vh;
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
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 0;
		font-size: 1.25rem;
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
	}

	.hint {
		color: #6b7280;
		font-size: 0.875rem;
		margin-bottom: 1.5rem;
		line-height: 1.5;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem 1rem;
		color: #9ca3af;
	}

	.empty-state p {
		margin-top: 1rem;
		font-size: 1rem;
	}

	.task-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.task-card {
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		padding: 1rem;
		display: flex;
		gap: 1rem;
		transition: all 0.2s;
	}

	.task-card:hover {
		border-color: #3b82f6;
		box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.1);
	}

	.task-info {
		flex: 1;
		min-width: 0;
	}

	.task-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.task-header h3 {
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
		flex-shrink: 0;
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

	.task-meta {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.meta-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
	}

	.meta-item .label {
		color: #6b7280;
	}

	.meta-item .value {
		color: #111827;
		font-weight: 500;
	}

	.meta-item .message {
		color: #6b7280;
		font-weight: 400;
		font-size: 0.8125rem;
	}

	.meta-item.error .value {
		color: #dc2626;
	}

	.pause-reason .value {
		color: #dc2626;
	}

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

	.task-actions {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.btn-recover,
	.btn-delete {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 6px;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
		white-space: nowrap;
	}

	.btn-recover {
		background-color: #3b82f6;
		color: white;
	}

	.btn-recover:hover {
		background-color: #2563eb;
	}

	.btn-delete {
		background-color: #f3f4f6;
		color: #6b7280;
		padding: 0.5rem;
	}

	.btn-delete:hover {
		background-color: #fee2e2;
		color: #dc2626;
	}
</style>
