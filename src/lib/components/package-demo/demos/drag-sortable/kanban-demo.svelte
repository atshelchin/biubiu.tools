<script lang="ts">
	/**
	 * Kanban Demo
	 * Demonstrates building a kanban board with sortable columns and cross-column drag
	 */
	import { dragSortable } from '@shelchin/drag-sortable';
	import { Plus, Circle, Clock, CheckCircle2 } from '@lucide/svelte';
	import { DemoSection, DemoContent } from '$lib/components/package-demo';

	interface Props {
		t: (key: string) => string;
	}

	let { t }: Props = $props();

	interface Task {
		id: number;
		name: string;
		priority: 'low' | 'medium' | 'high';
	}

	interface Column {
		id: string;
		name: string;
		icon: typeof Circle;
		color: string;
		tasks: Task[];
	}

	let columns = $state<Column[]>([
		{
			id: 'todo',
			name: 'col_todo',
			icon: Circle,
			color: '#6b7280',
			tasks: [
				{ id: 1, name: 'task_design', priority: 'high' },
				{ id: 2, name: 'task_api', priority: 'medium' }
			]
		},
		{
			id: 'progress',
			name: 'col_progress',
			icon: Clock,
			color: '#f59e0b',
			tasks: [
				{ id: 3, name: 'task_testing', priority: 'medium' },
				{ id: 4, name: 'task_review', priority: 'low' }
			]
		},
		{
			id: 'done',
			name: 'col_done',
			icon: CheckCircle2,
			color: '#10b981',
			tasks: [
				{ id: 5, name: 'task_deploy', priority: 'high' },
				{ id: 6, name: 'task_docs', priority: 'low' }
			]
		}
	]);

	let nextTaskId = 7;

	// Handle sorting within the same column
	function createSortHandler(columnId: string) {
		return (from: number, to: number) => {
			const columnIndex = columns.findIndex((c) => c.id === columnId);
			if (columnIndex === -1) return;

			const newTasks = [...columns[columnIndex].tasks];
			const [item] = newTasks.splice(from, 1);
			newTasks.splice(to, 0, item);

			// Create new columns array to trigger reactivity
			columns = columns.map((col, i) => (i === columnIndex ? { ...col, tasks: newTasks } : col));
		};
	}

	// Handle sending a task to another column
	function createSendHandler(columnId: string) {
		return (fromIndex: number, toColumnId: string, toIndex: number) => {
			const fromColumn = columns.find((c) => c.id === columnId);
			const toColumn = columns.find((c) => c.id === toColumnId);
			if (!fromColumn || !toColumn) return;

			// Remove from source column
			const newFromTasks = [...fromColumn.tasks];
			const [item] = newFromTasks.splice(fromIndex, 1);

			// Add to target column
			const newToTasks = [...toColumn.tasks];
			newToTasks.splice(toIndex, 0, item);

			// Update columns with new task arrays
			columns = columns.map((col) => {
				if (col.id === columnId) return { ...col, tasks: newFromTasks };
				if (col.id === toColumnId) return { ...col, tasks: newToTasks };
				return col;
			});
		};
	}

	function addTask(columnId: string) {
		const columnIndex = columns.findIndex((c) => c.id === columnId);
		if (columnIndex === -1) return;

		const newTask = { id: nextTaskId++, name: `task_${nextTaskId}`, priority: 'medium' as const };
		columns = columns.map((col, i) =>
			i === columnIndex ? { ...col, tasks: [...col.tasks, newTask] } : col
		);
	}

	function getPriorityColor(priority: string): string {
		switch (priority) {
			case 'high':
				return '#ef4444';
			case 'medium':
				return '#f59e0b';
			case 'low':
				return '#10b981';
			default:
				return '#6b7280';
		}
	}
</script>

<DemoSection title={t('demo.kanban.title')} description={t('demo.kanban.description')}>
	<DemoContent fullWidth>
		<div class="kanban-board">
			{#each columns as column (column.id)}
				{@const ColumnIcon = column.icon}
				<div class="kanban-column">
					<div class="column-header">
						<div class="column-title">
							<ColumnIcon size={18} style="color: {column.color}" />
							<span>{t(`demo.kanban.${column.name}`)}</span>
							<span class="task-count">{column.tasks.length}</span>
						</div>
						<button
							class="add-btn"
							onclick={() => addTask(column.id)}
							aria-label={t('demo.kanban.add_task')}
						>
							<Plus size={16} />
						</button>
					</div>

					<div
						class="column-tasks"
						use:dragSortable={{
							onSort: createSortHandler(column.id),
							onSend: createSendHandler(column.id),
							group: 'kanban',
							containerId: column.id
						}}
					>
						{#each column.tasks as task (task.id)}
							<div class="task-card">
								<div
									class="task-priority"
									style="background: {getPriorityColor(task.priority)}"
								></div>
								<span class="task-text">
									{task.name.startsWith('task_') && !task.name.startsWith('task_1')
										? `New Task #${task.id}`
										: t(`demo.kanban.${task.name}`)}
								</span>
							</div>
						{/each}

						{#if column.tasks.length === 0}
							<div class="empty-column">
								<span>Drop tasks here</span>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</DemoContent>
</DemoSection>

<style>
	.kanban-board {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-4);
		padding: var(--space-4);
		min-height: 400px;
	}

	.kanban-column {
		background: var(--color-panel-1);
		border-radius: var(--radius-xl);
		padding: var(--space-4);
		display: flex;
		flex-direction: column;
	}

	.column-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-4);
		padding-bottom: var(--space-3);
		border-bottom: 1px solid var(--color-border);
	}

	.column-title {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-weight: 600;
		color: var(--color-foreground);
	}

	.task-count {
		background: var(--color-panel-2);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-full);
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
	}

	.add-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border: none;
		border-radius: var(--radius);
		background: var(--color-panel-2);
		color: var(--color-muted-foreground);
		cursor: pointer;
		transition: all 150ms ease;
	}

	.add-btn:hover {
		background: var(--color-primary);
		color: white;
	}

	.column-tasks {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		min-height: 200px;
	}

	.task-card {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		background: var(--color-card);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		cursor: grab;
		transition: all 200ms ease;
	}

	.task-card:hover {
		border-color: var(--color-primary);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	.task-card:active {
		cursor: grabbing;
	}

	.task-priority {
		width: 4px;
		height: 24px;
		border-radius: 2px;
		flex-shrink: 0;
	}

	.task-text {
		font-size: var(--text-sm);
		color: var(--color-foreground);
	}

	.empty-column {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2px dashed var(--color-border);
		border-radius: var(--radius-lg);
		color: var(--color-muted-foreground);
		font-size: var(--text-sm);
	}

	@media (max-width: 900px) {
		.kanban-board {
			grid-template-columns: 1fr;
		}

		.kanban-column {
			min-height: auto;
		}

		.column-tasks {
			min-height: 150px;
		}
	}
</style>
