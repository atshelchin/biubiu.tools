<script lang="ts">
	/**
	 * Task Debugger - IndexedDB Task Management Debugger
	 *
	 * 通用的任务调试工具，用于查看、编辑、删除 IndexedDB 中的任务
	 */
	import { onMount } from 'svelte';
	import {
		Database,
		Trash2,
		RefreshCw,
		Eye,
		Download,
		Upload,
		X,
		Search,
		Filter
	} from '@lucide/svelte';
	import type { Task, TaskStatus } from '../types.v2';
	import * as db from '../db.v2';
	import { formatDistanceToNow } from 'date-fns';
	import { zhCN } from 'date-fns/locale';
	import { SvelteSet } from 'svelte/reactivity';

	// 状态
	let tasks = $state<Task[]>([]);
	let filteredTasks = $state<Task[]>([]);
	let selectedTask = $state<Task | null>(null);
	let isLoading = $state(false);
	let searchQuery = $state('');
	let filterStatus = $state<TaskStatus | 'all'>('all');
	let filterType = $state<string>('all');

	// 展开的任务树
	let expandedTasks = new SvelteSet<string>();

	// 任务类型列表（从任务中提取）
	let taskTypes = $derived(Array.from(new Set(tasks.map((t) => t.type))));

	// 过滤后的任务
	$effect(() => {
		let result = tasks;

		// 按状态过滤
		if (filterStatus !== 'all') {
			result = result.filter((t) => t.status === filterStatus);
		}

		// 按类型过滤
		if (filterType !== 'all') {
			result = result.filter((t) => t.type === filterType);
		}

		// 按搜索关键词过滤
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			result = result.filter(
				(t) =>
					t.name.toLowerCase().includes(query) ||
					t.id.toLowerCase().includes(query) ||
					t.type.toLowerCase().includes(query)
			);
		}

		filteredTasks = result;
	});

	// 加载所有任务
	async function loadTasks() {
		isLoading = true;
		try {
			tasks = await db.getAllTasks();
		} catch (error) {
			console.error('Failed to load tasks:', error);
			alert('加载任务失败：' + (error instanceof Error ? error.message : String(error)));
		} finally {
			isLoading = false;
		}
	}

	// 删除任务
	async function deleteTask(taskId: string) {
		if (!confirm(`确定要删除任务 ${taskId} 吗？此操作不可恢复。`)) {
			return;
		}

		try {
			await db.deleteTask(taskId);
			await loadTasks();
			if (selectedTask?.id === taskId) {
				selectedTask = null;
			}
		} catch (error) {
			console.error('Failed to delete task:', error);
			alert('删除失败：' + (error instanceof Error ? error.message : String(error)));
		}
	}

	// 清理旧任务
	async function cleanupOldTasks() {
		if (!confirm('确定要清理 7 天前完成的任务吗？')) {
			return;
		}

		try {
			const count = await db.cleanupOldTasks(7);
			alert(`已清理 ${count} 个旧任务`);
			await loadTasks();
		} catch (error) {
			console.error('Failed to cleanup tasks:', error);
			alert('清理失败：' + (error instanceof Error ? error.message : String(error)));
		}
	}

	// 导出任务为 JSON
	function exportTask(task: Task) {
		const json = JSON.stringify(task, null, 2);
		const blob = new Blob([json], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `task-${task.id}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}

	// 导出所有任务
	function exportAllTasks() {
		const json = JSON.stringify(tasks, null, 2);
		const blob = new Blob([json], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `all-tasks-${Date.now()}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}

	// 导入任务
	async function importTasks() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'application/json';
		input.onchange = async (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (!file) return;

			try {
				const text = await file.text();
				const data = JSON.parse(text);
				const tasksToImport = Array.isArray(data) ? data : [data];

				for (const task of tasksToImport) {
					await db.saveTask(task);
				}

				alert(`成功导入 ${tasksToImport.length} 个任务`);
				await loadTasks();
			} catch (error) {
				console.error('Failed to import tasks:', error);
				alert('导入失败：' + (error instanceof Error ? error.message : String(error)));
			}
		};
		input.click();
	}

	// 格式化时间
	function formatTime(timestamp?: number): string {
		if (!timestamp) return '-';
		return formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: zhCN });
	}

	// 获取状态颜色
	function getStatusColor(status: TaskStatus): string {
		switch (status) {
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'running':
				return 'bg-blue-100 text-blue-800';
			case 'paused':
				return 'bg-red-100 text-red-800';
			case 'completed':
				return 'bg-green-100 text-green-800';
			case 'failed':
				return 'bg-red-200 text-red-900';
			case 'cancelled':
				return 'bg-gray-100 text-gray-800';
			case 'partial':
				return 'bg-orange-100 text-orange-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	// 获取状态文本
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

	// 递归渲染任务树节点
	function renderTreeNode(task: Task, depth: number = 0): string {
		const indent = '  '.repeat(depth);
		const icon = task.children.length > 0 ? '📁' : '📄';
		let result = `${indent}${icon} ${task.name} [${task.status}] (${task.progress}%)\n`;

		if (task.children.length > 0 && expandedTasks.has(task.id)) {
			for (const child of task.children) {
				result += renderTreeNode(child, depth + 1);
			}
		}

		return result;
	}

	// 计算任务统计
	let statistics = $derived({
		total: tasks.length,
		pending: tasks.filter((t) => t.status === 'pending').length,
		running: tasks.filter((t) => t.status === 'running').length,
		paused: tasks.filter((t) => t.status === 'paused').length,
		completed: tasks.filter((t) => t.status === 'completed').length,
		failed: tasks.filter((t) => t.status === 'failed').length,
		cancelled: tasks.filter((t) => t.status === 'cancelled').length,
		partial: tasks.filter((t) => t.status === 'partial').length
	});

	onMount(() => {
		loadTasks();
	});
</script>

<div class="task-debugger">
	<!-- 头部 -->
	<div class="header">
		<div class="title">
			<Database size={24} />
			<h1>任务调试器</h1>
			<span class="subtitle">IndexedDB Task Manager Debugger</span>
		</div>

		<div class="actions">
			<button class="btn-icon" onclick={loadTasks} title="刷新">
				<RefreshCw size={18} class={isLoading ? 'spinning' : ''} />
			</button>
			<button class="btn-icon" onclick={importTasks} title="导入任务">
				<Upload size={18} />
			</button>
			<button class="btn-icon" onclick={exportAllTasks} title="导出所有任务">
				<Download size={18} />
			</button>
			<button class="btn-danger" onclick={cleanupOldTasks} title="清理旧任务">
				<Trash2 size={18} />
				清理旧任务
			</button>
		</div>
	</div>

	<!-- 统计信息 -->
	<div class="statistics">
		<div class="stat-card">
			<div class="stat-label">总计</div>
			<div class="stat-value">{statistics.total}</div>
		</div>
		<div class="stat-card stat-pending">
			<div class="stat-label">待开始</div>
			<div class="stat-value">{statistics.pending}</div>
		</div>
		<div class="stat-card stat-running">
			<div class="stat-label">运行中</div>
			<div class="stat-value">{statistics.running}</div>
		</div>
		<div class="stat-card stat-paused">
			<div class="stat-label">已暂停</div>
			<div class="stat-value">{statistics.paused}</div>
		</div>
		<div class="stat-card stat-completed">
			<div class="stat-label">已完成</div>
			<div class="stat-value">{statistics.completed}</div>
		</div>
		<div class="stat-card stat-failed">
			<div class="stat-label">失败</div>
			<div class="stat-value">{statistics.failed}</div>
		</div>
		<div class="stat-card stat-partial">
			<div class="stat-label">部分完成</div>
			<div class="stat-value">{statistics.partial}</div>
		</div>
	</div>

	<!-- 过滤器和搜索 -->
	<div class="filters">
		<div class="search-box">
			<Search size={18} />
			<input type="text" placeholder="搜索任务..." bind:value={searchQuery} />
		</div>

		<div class="filter-group">
			<Filter size={18} />
			<select bind:value={filterStatus}>
				<option value="all">所有状态</option>
				<option value="pending">待开始</option>
				<option value="running">运行中</option>
				<option value="paused">已暂停</option>
				<option value="completed">已完成</option>
				<option value="failed">失败</option>
				<option value="cancelled">已取消</option>
				<option value="partial">部分完成</option>
			</select>

			<select bind:value={filterType}>
				<option value="all">所有类型</option>
				{#each taskTypes as type (type)}
					<option value={type}>{type}</option>
				{/each}
			</select>
		</div>
	</div>

	<!-- 任务列表和详情 -->
	<div class="content">
		<!-- 任务列表 -->
		<div class="task-list">
			<div class="list-header">
				<h2>任务列表</h2>
				<span class="count">{filteredTasks.length} 个任务</span>
			</div>

			{#if isLoading}
				<div class="loading">加载中...</div>
			{:else if filteredTasks.length === 0}
				<div class="empty">暂无任务</div>
			{:else}
				<div class="list-items">
					{#each filteredTasks as task (task.id)}
						<div class="task-item" class:selected={selectedTask?.id === task.id}>
							<button class="task-button" onclick={() => (selectedTask = task)}>
								<div class="task-header-row">
									<span class="task-name">{task.name}</span>
									<span class="badge {getStatusColor(task.status)}">
										{getStatusText(task.status)}
									</span>
								</div>

								<div class="task-meta-row">
									<span class="task-id">{task.id}</span>
									<span class="task-type">{task.type}</span>
									<span class="task-time">{formatTime(task.updatedAt)}</span>
								</div>

								<div class="task-progress-row">
									<div class="progress-bar-small">
										<div class="progress-fill-small" style="width: {task.progress}%"></div>
									</div>
									<span class="progress-text">{task.progress}%</span>
								</div>

								<div class="task-stats-row">
									<span>深度: {task.depth}</span>
									<span>子任务: {task.children.length}</span>
									<span>叶子: {task.totalLeaves}</span>
									<span>完成: {task.completedLeaves}</span>
									{#if task.failedLeaves > 0}
										<span class="text-red">失败: {task.failedLeaves}</span>
									{/if}
								</div>
							</button>

							<div class="task-actions">
								<button class="btn-icon-small" onclick={() => exportTask(task)} title="导出">
									<Download size={16} />
								</button>
								<button
									class="btn-icon-small btn-danger"
									onclick={() => deleteTask(task.id)}
									title="删除"
								>
									<Trash2 size={16} />
								</button>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- 任务详情 -->
		<div class="task-detail">
			{#if selectedTask}
				<div class="detail-header">
					<h2>任务详情</h2>
					<button class="btn-icon" onclick={() => (selectedTask = null)} title="关闭">
						<X size={20} />
					</button>
				</div>

				<div class="detail-content">
					<!-- 基本信息 -->
					<div class="detail-section">
						<h3>基本信息</h3>
						<div class="detail-grid">
							<div class="detail-item">
								<span class="label">ID:</span>
								<span class="value mono">{selectedTask.id}</span>
							</div>
							<div class="detail-item">
								<span class="label">名称:</span>
								<span class="value">{selectedTask.name}</span>
							</div>
							<div class="detail-item">
								<span class="label">类型:</span>
								<span class="value">{selectedTask.type}</span>
							</div>
							<div class="detail-item">
								<span class="label">状态:</span>
								<span class="badge {getStatusColor(selectedTask.status)}">
									{getStatusText(selectedTask.status)}
								</span>
							</div>
							<div class="detail-item">
								<span class="label">进度:</span>
								<span class="value">{selectedTask.progress}%</span>
							</div>
							<div class="detail-item">
								<span class="label">父任务:</span>
								<span class="value mono">{selectedTask.parentId || '无（根任务）'}</span>
							</div>
							<div class="detail-item">
								<span class="label">深度:</span>
								<span class="value">{selectedTask.depth}</span>
							</div>
							<div class="detail-item">
								<span class="label">是否叶子:</span>
								<span class="value">{selectedTask.isLeaf ? '是' : '否'}</span>
							</div>
						</div>
					</div>

					<!-- 统计信息 -->
					<div class="detail-section">
						<h3>统计信息</h3>
						<div class="detail-grid">
							<div class="detail-item">
								<span class="label">子任务数:</span>
								<span class="value">{selectedTask.children.length}</span>
							</div>
							<div class="detail-item">
								<span class="label">总叶子任务:</span>
								<span class="value">{selectedTask.totalLeaves}</span>
							</div>
							<div class="detail-item">
								<span class="label">已完成:</span>
								<span class="value">{selectedTask.completedLeaves}</span>
							</div>
							<div class="detail-item">
								<span class="label">失败:</span>
								<span class="value">{selectedTask.failedLeaves}</span>
							</div>
							{#if selectedTask.isLeaf}
								<div class="detail-item">
									<span class="label">重试次数:</span>
									<span class="value">{selectedTask.attempts}/{selectedTask.maxAttempts}</span>
								</div>
								<div class="detail-item">
									<span class="label">执行器:</span>
									<span class="value mono">{selectedTask.executor || '-'}</span>
								</div>
							{/if}
						</div>
					</div>

					<!-- 时间信息 -->
					<div class="detail-section">
						<h3>时间信息</h3>
						<div class="detail-grid">
							<div class="detail-item">
								<span class="label">创建时间:</span>
								<span class="value">{formatTime(selectedTask.createdAt)}</span>
							</div>
							<div class="detail-item">
								<span class="label">更新时间:</span>
								<span class="value">{formatTime(selectedTask.updatedAt)}</span>
							</div>
							{#if selectedTask.startedAt}
								<div class="detail-item">
									<span class="label">开始时间:</span>
									<span class="value">{formatTime(selectedTask.startedAt)}</span>
								</div>
							{/if}
							{#if selectedTask.completedAt}
								<div class="detail-item">
									<span class="label">完成时间:</span>
									<span class="value">{formatTime(selectedTask.completedAt)}</span>
								</div>
							{/if}
							{#if selectedTask.pausedAt}
								<div class="detail-item">
									<span class="label">暂停时间:</span>
									<span class="value">{formatTime(selectedTask.pausedAt)}</span>
								</div>
							{/if}
							{#if selectedTask.failedAt}
								<div class="detail-item">
									<span class="label">失败时间:</span>
									<span class="value">{formatTime(selectedTask.failedAt)}</span>
								</div>
							{/if}
						</div>
					</div>

					<!-- 暂停信息 -->
					{#if selectedTask.pauseReason}
						<div class="detail-section">
							<h3>暂停信息</h3>
							<div class="detail-grid">
								<div class="detail-item">
									<span class="label">暂停原因:</span>
									<span class="value">{selectedTask.pauseReason}</span>
								</div>
								{#if selectedTask.pauseMessage}
									<div class="detail-item full-width">
										<span class="label">暂停消息:</span>
										<span class="value">{selectedTask.pauseMessage}</span>
									</div>
								{/if}
							</div>
						</div>
					{/if}

					<!-- 错误信息 -->
					{#if selectedTask.errors.length > 0}
						<div class="detail-section">
							<h3>错误列表</h3>
							<div class="error-list">
								{#each selectedTask.errors as error, index (index)}
									<div class="error-item">
										<span class="error-index">{index + 1}</span>
										<span class="error-message">{error}</span>
									</div>
								{/each}
							</div>
						</div>
					{/if}

					<!-- 任务树 -->
					{#if selectedTask.children.length > 0}
						<div class="detail-section">
							<h3>任务树结构</h3>
							<pre class="tree-view">{renderTreeNode(selectedTask)}</pre>
						</div>
					{/if}

					<!-- 执行数据 -->
					{#if selectedTask.executionData}
						<div class="detail-section">
							<h3>执行数据</h3>
							<pre class="json-view">{JSON.stringify(selectedTask.executionData, null, 2)}</pre>
						</div>
					{/if}

					<!-- 结果 -->
					{#if selectedTask.result}
						<div class="detail-section">
							<h3>执行结果</h3>
							<pre class="json-view">{JSON.stringify(selectedTask.result, null, 2)}</pre>
						</div>
					{/if}

					<!-- JSON 原始数据 -->
					<div class="detail-section">
						<h3>原始 JSON 数据</h3>
						<pre class="json-view">{JSON.stringify(selectedTask, null, 2)}</pre>
					</div>
				</div>
			{:else}
				<div class="empty-detail">
					<Eye size={48} />
					<p>选择一个任务查看详情</p>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.task-debugger {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #f9fafb;
	}

	/* 头部 */
	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.5rem 2rem;
		background-color: white;
		border-bottom: 1px solid #e5e7eb;
	}

	.title {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.title h1 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 700;
		color: #111827;
	}

	.subtitle {
		color: #6b7280;
		font-size: 0.875rem;
	}

	.actions {
		display: flex;
		gap: 0.5rem;
	}

	.btn-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.5rem;
		border: 1px solid #e5e7eb;
		background-color: white;
		color: #6b7280;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-icon:hover {
		background-color: #f3f4f6;
		border-color: #d1d5db;
	}

	.btn-danger {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		border: 1px solid #ef4444;
		background-color: #ef4444;
		color: white;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 500;
		transition: all 0.2s;
	}

	.btn-danger:hover {
		background-color: #dc2626;
	}

	.spinning {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	/* 统计卡片 */
	.statistics {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: 1rem;
		padding: 1.5rem 2rem;
		background-color: white;
		border-bottom: 1px solid #e5e7eb;
	}

	.stat-card {
		padding: 1rem;
		background-color: #f9fafb;
		border-radius: 8px;
		text-align: center;
	}

	.stat-label {
		font-size: 0.875rem;
		color: #6b7280;
		margin-bottom: 0.5rem;
	}

	.stat-value {
		font-size: 1.875rem;
		font-weight: 700;
		color: #111827;
	}

	.stat-pending {
		background-color: #fef3c7;
	}
	.stat-running {
		background-color: #dbeafe;
	}
	.stat-paused {
		background-color: #fee2e2;
	}
	.stat-completed {
		background-color: #d1fae5;
	}
	.stat-failed {
		background-color: #fecaca;
	}
	.stat-partial {
		background-color: #fed7aa;
	}

	/* 过滤器 */
	.filters {
		display: flex;
		gap: 1rem;
		padding: 1rem 2rem;
		background-color: white;
		border-bottom: 1px solid #e5e7eb;
	}

	.search-box {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		background-color: white;
	}

	.search-box input {
		flex: 1;
		border: none;
		outline: none;
		font-size: 0.875rem;
	}

	.filter-group {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.filter-group select {
		padding: 0.5rem 1rem;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		font-size: 0.875rem;
		background-color: white;
		cursor: pointer;
	}

	/* 内容区域 */
	.content {
		flex: 1;
		display: grid;
		grid-template-columns: 400px 1fr;
		gap: 0;
		overflow: hidden;
	}

	/* 任务列表 */
	.task-list {
		display: flex;
		flex-direction: column;
		background-color: white;
		border-right: 1px solid #e5e7eb;
		overflow: hidden;
	}

	.list-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.5rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.list-header h2 {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 600;
		color: #111827;
	}

	.count {
		font-size: 0.875rem;
		color: #6b7280;
	}

	.list-items {
		flex: 1;
		overflow-y: auto;
	}

	.task-item {
		display: flex;
		align-items: stretch;
		border-bottom: 1px solid #e5e7eb;
		transition: background-color 0.2s;
	}

	.task-item:hover {
		background-color: #f9fafb;
	}

	.task-item.selected {
		background-color: #eff6ff;
		border-left: 3px solid #3b82f6;
	}

	.task-button {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1rem;
		border: none;
		background: transparent;
		text-align: left;
		cursor: pointer;
	}

	.task-header-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.task-name {
		font-weight: 600;
		color: #111827;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.task-meta-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 0.75rem;
		color: #6b7280;
	}

	.task-id {
		font-family: 'Monaco', 'Courier New', monospace;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 120px;
	}

	.task-type {
		padding: 0.125rem 0.5rem;
		background-color: #e5e7eb;
		border-radius: 9999px;
		font-size: 0.625rem;
	}

	.task-progress-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.progress-bar-small {
		flex: 1;
		height: 4px;
		background-color: #e5e7eb;
		border-radius: 9999px;
		overflow: hidden;
	}

	.progress-fill-small {
		height: 100%;
		background: linear-gradient(90deg, #3b82f6, #2563eb);
		transition: width 0.3s;
	}

	.progress-text {
		font-size: 0.75rem;
		color: #6b7280;
		min-width: 40px;
		text-align: right;
	}

	.task-stats-row {
		display: flex;
		gap: 0.75rem;
		font-size: 0.75rem;
		color: #6b7280;
	}

	.text-red {
		color: #dc2626;
	}

	.task-actions {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 0.5rem;
		border-left: 1px solid #e5e7eb;
	}

	.btn-icon-small {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		border: 1px solid #e5e7eb;
		background-color: white;
		color: #6b7280;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-icon-small:hover {
		background-color: #f3f4f6;
	}

	.btn-icon-small.btn-danger:hover {
		background-color: #fee2e2;
		color: #dc2626;
		border-color: #dc2626;
	}

	/* 任务详情 */
	.task-detail {
		display: flex;
		flex-direction: column;
		background-color: white;
		overflow: hidden;
	}

	.detail-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.5rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.detail-header h2 {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 600;
		color: #111827;
	}

	.detail-content {
		flex: 1;
		overflow-y: auto;
		padding: 1.5rem;
	}

	.detail-section {
		margin-bottom: 2rem;
	}

	.detail-section h3 {
		margin: 0 0 1rem 0;
		font-size: 1rem;
		font-weight: 600;
		color: #111827;
		border-bottom: 2px solid #3b82f6;
		padding-bottom: 0.5rem;
	}

	.detail-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	.detail-item {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.detail-item.full-width {
		grid-column: 1 / -1;
	}

	.detail-item .label {
		font-size: 0.75rem;
		color: #6b7280;
		font-weight: 500;
		text-transform: uppercase;
	}

	.detail-item .value {
		font-size: 0.875rem;
		color: #111827;
	}

	.mono {
		font-family: 'Monaco', 'Courier New', monospace;
	}

	.badge {
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 600;
		white-space: nowrap;
	}

	.bg-yellow-100 {
		background-color: #fef3c7;
		color: #92400e;
	}
	.bg-blue-100 {
		background-color: #dbeafe;
		color: #1e40af;
	}
	.bg-red-100 {
		background-color: #fee2e2;
		color: #991b1b;
	}
	.bg-green-100 {
		background-color: #d1fae5;
		color: #065f46;
	}
	.bg-red-200 {
		background-color: #fecaca;
		color: #991b1b;
	}
	.bg-gray-100 {
		background-color: #f3f4f6;
		color: #6b7280;
	}
	.bg-orange-100 {
		background-color: #fed7aa;
		color: #92400e;
	}

	.error-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.error-item {
		display: flex;
		gap: 0.5rem;
		padding: 0.75rem;
		background-color: #fee2e2;
		border-left: 3px solid #dc2626;
		border-radius: 4px;
	}

	.error-index {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		background-color: #dc2626;
		color: white;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 600;
		flex-shrink: 0;
	}

	.error-message {
		flex: 1;
		font-size: 0.875rem;
		color: #991b1b;
	}

	.tree-view,
	.json-view {
		padding: 1rem;
		background-color: #1f2937;
		color: #f9fafb;
		border-radius: 6px;
		font-family: 'Monaco', 'Courier New', monospace;
		font-size: 0.875rem;
		overflow-x: auto;
		margin: 0;
	}

	.empty-detail {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: #9ca3af;
		gap: 1rem;
	}

	.empty-detail p {
		margin: 0;
		font-size: 1rem;
	}

	.loading,
	.empty {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 3rem;
		color: #9ca3af;
	}
</style>
