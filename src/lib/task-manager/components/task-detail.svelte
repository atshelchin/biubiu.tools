<script lang="ts">
	import {
		X,
		Play,
		Pause,
		CheckCircle,
		XCircle,
		Clock,
		AlertCircle,
		ChevronRight,
		Loader2
	} from '@lucide/svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import type { Task, SubTask } from '../types';
	import { formatDistanceToNow } from 'date-fns';
	import { zhCN } from 'date-fns/locale';

	interface Props {
		task: Task | null;
		isOpen: boolean;
		onClose: () => void;
		onResume?: (task: Task) => void;
		onPause?: (task: Task) => void;
		onCancel?: (task: Task) => void;
	}

	let { task = $bindable(), isOpen, onClose, onResume, onPause, onCancel }: Props = $props();

	let expandedSubTasks = new SvelteSet<string>();

	function toggleSubTask(subTaskId: string) {
		if (expandedSubTasks.has(subTaskId)) {
			expandedSubTasks.delete(subTaskId);
		} else {
			expandedSubTasks.add(subTaskId);
		}
	}

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

	function getSubTaskIcon(subTask: SubTask) {
		switch (subTask.status) {
			case 'running':
				return Loader2;
			case 'completed':
				return CheckCircle;
			case 'failed':
				return XCircle;
			default:
				return Clock;
		}
	}
</script>

{#if isOpen && task}
	<!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
	<div class="modal-overlay" onclick={onClose}>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="modal-content"
			onclick={(e) => e.stopPropagation()}
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
				<!-- Task Status -->
				<div class="status-section">
					<div class="status-header">
						<span class="task-status {getStatusColor(task.status)}">
							{getStatusText(task.status)}
						</span>
						<div class="status-meta">
							<span>进度：{task.progress}%</span>
							<span>{task.completedSubTasks}/{task.totalSubTasks} 个子任务完成</span>
							{#if task.failedSubTasks > 0}
								<span class="error-text">{task.failedSubTasks} 个失败</span>
							{/if}
						</div>
					</div>

					<div class="progress-bar">
						<div class="progress-fill" style="width: {task.progress}%"></div>
					</div>
				</div>

				<!-- Task Info -->
				<div class="info-section">
					<div class="info-grid">
						<div class="info-item">
							<span class="label">任务类型</span>
							<span class="value">{task.type}</span>
						</div>
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
								<span class="value">{formatDuration(task.startedAt, task.completedAt)}</span>
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

				<!-- Task Actions -->
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

				<!-- Errors -->
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

				<!-- SubTasks -->
				<div class="subtasks-section">
					<h3>子任务列表 ({task.subTasks.length})</h3>
					<div class="subtask-list">
						{#each task.subTasks as subTask (subTask.id)}
							{@const SubTaskIcon = getSubTaskIcon(subTask)}
							{@const isExpanded = expandedSubTasks.has(subTask.id)}
							<div class="subtask-item {getStatusColor(subTask.status)}">
								<!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
								<div class="subtask-header" onclick={() => toggleSubTask(subTask.id)}>
									<div class="subtask-title">
										<SubTaskIcon size={16} class={subTask.status === 'running' ? 'spinning' : ''} />
										<span class="subtask-number">#{subTask.subTaskNumber}</span>
										<span class="subtask-name">{subTask.name}</span>
									</div>
									<div class="subtask-meta">
										{#if subTask.progress !== undefined}
											<span class="progress-text">{subTask.progress}%</span>
										{/if}
										<span class="status-text">{getStatusText(subTask.status)}</span>
										<ChevronRight size={16} class={isExpanded ? 'chevron-expanded' : ''} />
									</div>
								</div>

								{#if isExpanded}
									<div class="subtask-details">
										{#if subTask.progress !== undefined}
											<div class="progress-bar small">
												<div class="progress-fill" style="width: {subTask.progress}%"></div>
											</div>
										{/if}

										<div class="detail-grid">
											{#if subTask.startedAt}
												<div class="detail-item">
													<span class="label">开始时间</span>
													<span class="value">{formatTime(subTask.startedAt)}</span>
												</div>
											{/if}
											{#if subTask.completedAt}
												<div class="detail-item">
													<span class="label">完成时间</span>
													<span class="value">{formatTime(subTask.completedAt)}</span>
												</div>
												<div class="detail-item">
													<span class="label">执行时长</span>
													<span class="value"
														>{formatDuration(subTask.startedAt, subTask.completedAt)}</span
													>
												</div>
											{/if}
											{#if subTask.attempts > 0}
												<div class="detail-item">
													<span class="label">尝试次数</span>
													<span class="value">{subTask.attempts}/{subTask.maxAttempts}</span>
												</div>
											{/if}
										</div>

										{#if subTask.error}
											<div class="subtask-error">
												<AlertCircle size={14} />
												<span>{subTask.error}</span>
											</div>
										{/if}
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</div>
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
		max-width: 800px;
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

	/* Status Section */
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

	.progress-bar.small {
		height: 4px;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #3b82f6, #2563eb);
		transition: width 0.3s ease;
	}

	/* Info Section */
	.info-section {
		background-color: #f9fafb;
		border-radius: 8px;
		padding: 1rem;
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
	}

	/* Actions Section */
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

	/* Errors Section */
	.errors-section {
		background-color: #fef2f2;
		border: 1px solid #fecaca;
		border-radius: 8px;
		padding: 1rem;
	}

	.errors-section h3 {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 0 0 0.75rem 0;
		font-size: 1rem;
		font-weight: 600;
		color: #991b1b;
	}

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
	}

	/* SubTasks Section */
	.subtasks-section h3 {
		margin: 0 0 1rem 0;
		font-size: 1rem;
		font-weight: 600;
		color: #111827;
	}

	.subtask-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.subtask-item {
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		overflow: hidden;
		transition: all 0.2s;
	}

	.subtask-item:hover {
		border-color: #3b82f6;
	}

	.subtask-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem 1rem;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.subtask-header:hover {
		background-color: #f9fafb;
	}

	.subtask-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex: 1;
	}

	.subtask-number {
		font-weight: 600;
		color: #6b7280;
		font-size: 0.875rem;
	}

	.subtask-name {
		font-size: 0.875rem;
		color: #111827;
	}

	.subtask-meta {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 0.75rem;
	}

	.progress-text {
		color: #6b7280;
		font-weight: 500;
	}

	.status-text {
		padding: 0.125rem 0.5rem;
		border-radius: 9999px;
		font-weight: 500;
	}

	.subtask-item.status-completed .status-text {
		background-color: #d1fae5;
		color: #065f46;
	}

	.subtask-item.status-running .status-text {
		background-color: #dbeafe;
		color: #1e40af;
	}

	.subtask-item.status-failed .status-text {
		background-color: #fee2e2;
		color: #991b1b;
	}

	.subtask-item.status-pending .status-text {
		background-color: #f3f4f6;
		color: #6b7280;
	}

	:global(.chevron-expanded) {
		transform: rotate(90deg);
	}

	.subtask-details {
		padding: 1rem;
		background-color: #f9fafb;
		border-top: 1px solid #e5e7eb;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.detail-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 0.75rem;
	}

	.detail-item {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.detail-item .label {
		font-size: 0.75rem;
		color: #6b7280;
	}

	.detail-item .value {
		font-size: 0.875rem;
		color: #111827;
		font-weight: 500;
	}

	.subtask-error {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem;
		background-color: #fee2e2;
		border-radius: 4px;
		color: #dc2626;
		font-size: 0.875rem;
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
