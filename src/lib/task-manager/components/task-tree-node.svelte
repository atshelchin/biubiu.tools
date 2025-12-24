<script lang="ts">
	/**
	 * TaskTreeNode - 递归的任务树节点组件
	 *
	 * 用于展示任务树的单个节点，支持递归嵌套显示子节点
	 */
	import { ChevronRight, ChevronDown, Circle, CheckCircle, XCircle, Pause } from '@lucide/svelte';
	import type { Task } from '../types.v2';
	import Self from './task-tree-node.svelte';

	interface Props {
		task: Task;
		depth?: number;
		onTaskClick?: (task: Task) => void;
		expanded?: boolean;
	}

	let { task, depth = 0, onTaskClick, expanded = true }: Props = $props();

	// 控制子节点展开/收起
	let isExpanded = $state(expanded);

	function toggleExpand() {
		if (task.children.length > 0) {
			isExpanded = !isExpanded;
		}
	}

	function handleClick() {
		onTaskClick?.(task);
	}

	// 获取状态图标组件 (derived)
	let StatusIcon = $derived(
		(() => {
			switch (task.status) {
				case 'completed':
					return CheckCircle;
				case 'failed':
					return XCircle;
				case 'paused':
					return Pause;
				default:
					return Circle;
			}
		})()
	);

	// 获取状态颜色类
	function getStatusClass(status: string): string {
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

<div class="task-tree-node" style="--depth: {depth}">
	<div
		class="node-header {getStatusClass(task.status)}"
		onclick={handleClick}
		onkeydown={(e) => e.key === 'Enter' && handleClick()}
		role="button"
		tabindex="0"
	>
		<!-- 展开/收起按钮 -->
		<button
			class="expand-button"
			onclick={(e) => {
				e.stopPropagation();
				toggleExpand();
			}}
			disabled={task.children.length === 0}
		>
			{#if task.children.length > 0}
				{#if isExpanded}
					<ChevronDown size={16} />
				{:else}
					<ChevronRight size={16} />
				{/if}
			{:else}
				<span class="placeholder"></span>
			{/if}
		</button>

		<!-- 状态图标 -->
		<StatusIcon size={16} class="status-icon" />

		<!-- 任务信息 -->
		<div class="node-info">
			<span class="node-name">{task.name}</span>

			<!-- 叶子任务标记 -->
			{#if task.isLeaf}
				<span class="leaf-badge">叶子</span>
			{/if}

			<!-- 子任务统计 -->
			{#if !task.isLeaf}
				<span class="children-count">({task.children.length}个子任务)</span>
			{/if}
		</div>

		<!-- 进度信息 -->
		<div class="node-stats">
			<span class="progress">{task.progress}%</span>
			{#if task.totalLeaves > 0}
				<span class="leaves-stat">{task.completedLeaves}/{task.totalLeaves}</span>
			{/if}
		</div>
	</div>

	<!-- 进度条 -->
	<div class="progress-bar">
		<div class="progress-fill" style="width: {task.progress}%"></div>
	</div>

	<!-- 递归展示子节点 -->
	{#if isExpanded && task.children.length > 0}
		<div class="children">
			{#each task.children as child (child.id)}
				<Self task={child} depth={depth + 1} {onTaskClick} />
			{/each}
		</div>
	{/if}
</div>

<style>
	.task-tree-node {
		--indent-size: 24px;
		margin-left: calc(var(--depth) * var(--indent-size));
	}

	.node-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem;
		border-radius: 6px;
		cursor: pointer;
		transition: background-color 0.2s;
		user-select: none;
	}

	.node-header:hover {
		background-color: #f3f4f6;
	}

	.expand-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		padding: 0;
		border: none;
		background: transparent;
		color: #6b7280;
		cursor: pointer;
		border-radius: 4px;
		transition: all 0.2s;
	}

	.expand-button:hover:not(:disabled) {
		background-color: #e5e7eb;
	}

	.expand-button:disabled {
		cursor: default;
		opacity: 0;
	}

	.placeholder {
		width: 16px;
		height: 16px;
		display: block;
	}

	.status-icon {
		flex-shrink: 0;
	}

	.node-info {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex: 1;
		min-width: 0;
	}

	.node-name {
		font-weight: 500;
		color: #111827;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.leaf-badge {
		padding: 0.125rem 0.375rem;
		background-color: #dbeafe;
		color: #1e40af;
		border-radius: 9999px;
		font-size: 0.625rem;
		font-weight: 600;
		text-transform: uppercase;
		flex-shrink: 0;
	}

	.children-count {
		color: #6b7280;
		font-size: 0.875rem;
		flex-shrink: 0;
	}

	.node-stats {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 0.875rem;
		flex-shrink: 0;
	}

	.progress {
		font-weight: 600;
		color: #6b7280;
	}

	.leaves-stat {
		color: #9ca3af;
		font-size: 0.75rem;
	}

	.progress-bar {
		height: 3px;
		background-color: #e5e7eb;
		border-radius: 9999px;
		overflow: hidden;
		margin: 0.25rem 0.5rem 0.5rem calc(20px + 16px + 1rem);
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #3b82f6, #2563eb);
		transition: width 0.3s ease;
	}

	.children {
		margin-top: 0.25rem;
	}

	/* 状态颜色 */
	.status-pending :global(.status-icon) {
		color: #f59e0b;
	}

	.status-running :global(.status-icon) {
		color: #3b82f6;
	}

	.status-paused :global(.status-icon) {
		color: #ef4444;
	}

	.status-completed :global(.status-icon) {
		color: #10b981;
	}

	.status-failed :global(.status-icon) {
		color: #dc2626;
	}

	.status-cancelled :global(.status-icon) {
		color: #6b7280;
	}

	.status-partial :global(.status-icon) {
		color: #f59e0b;
	}
</style>
