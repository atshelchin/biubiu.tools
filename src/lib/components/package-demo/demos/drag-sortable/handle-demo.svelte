<script lang="ts">
	/**
	 * Handle Demo
	 * Demonstrates using a specific element as drag handle
	 */
	import { dragSortable } from '@shelchin/drag-sortable';
	import { GripVertical, Pencil, Trash2, Plus } from '@lucide/svelte';
	import { DemoSection, DemoContent, CodeBlock, DemoButton } from '$lib/components/package-demo';

	interface Props {
		t: (key: string) => string;
	}

	let { t }: Props = $props();

	interface Task {
		id: number;
		name: string;
		completed: boolean;
	}

	let nextId = 5;
	let tasks = $state<Task[]>([
		{ id: 1, name: 'task_1', completed: false },
		{ id: 2, name: 'task_2', completed: true },
		{ id: 3, name: 'task_3', completed: false },
		{ id: 4, name: 'task_4', completed: false }
	]);

	function getTaskName(task: Task): string {
		return task.name.startsWith('task_') ? t(`demo.handle.${task.name}`) : task.name;
	}

	let newTaskName = $state('');

	function handleSort(from: number, to: number) {
		const item = tasks.splice(from, 1)[0];
		tasks.splice(to, 0, item);
	}

	function addTask() {
		if (!newTaskName.trim()) return;
		tasks = [...tasks, { id: nextId++, name: newTaskName, completed: false }];
		newTaskName = '';
	}

	function deleteTask(id: number) {
		tasks = tasks.filter((task) => task.id !== id);
	}

	function toggleComplete(id: number) {
		const task = tasks.find((t) => t.id === id);
		if (task) task.completed = !task.completed;
	}

	const codeExample = `import { dragSortable } from '@shelchin/drag-sortable';

let tasks = $state([
  { id: 1, name: 'Task 1' },
  { id: 2, name: 'Task 2' }
]);

function handleSort(from: number, to: number) {
  const item = tasks.splice(from, 1)[0];
  tasks.splice(to, 0, item);
}

// In template - only .handle triggers drag:
// <div use:dragSortable={{ onSort: handleSort, handle: '.handle' }}>
//   {#each tasks as task (task.id)}
//     <div class="task">
//       <span class="handle">⋮⋮</span>
//       <span>{task.name}</span>
//       <button>Delete</button>
//     </div>
//   {/each}
// </div>`;
</script>

<DemoSection title={t('demo.handle.title')} description={t('demo.handle.description')}>
	<DemoContent>
		{#snippet panel()}
			<div class="add-task-form">
				<input
					type="text"
					bind:value={newTaskName}
					placeholder={t('demo.handle.task_placeholder')}
					onkeydown={(e) => e.key === 'Enter' && addTask()}
				/>
				<DemoButton icon={Plus} onclick={addTask}>
					{t('demo.handle.add')}
				</DemoButton>
			</div>
		{/snippet}

		{#snippet result()}
			<div class="task-list" use:dragSortable={{ onSort: handleSort, handle: '.drag-handle' }}>
				{#each tasks as task (task.id)}
					<div class="task-item" class:completed={task.completed}>
						<button class="drag-handle" aria-label="Drag to reorder">
							<GripVertical size={18} />
						</button>

						<label class="task-checkbox">
							<input
								type="checkbox"
								checked={task.completed}
								onchange={() => toggleComplete(task.id)}
							/>
							<span class="checkmark"></span>
						</label>

						<span class="task-name">{getTaskName(task)}</span>

						<div class="task-actions">
							<button class="action-btn edit" aria-label={t('demo.handle.edit')}>
								<Pencil size={14} />
							</button>
							<button
								class="action-btn delete"
								aria-label={t('demo.handle.delete')}
								onclick={() => deleteTask(task.id)}
							>
								<Trash2 size={14} />
							</button>
						</div>
					</div>
				{/each}
			</div>
		{/snippet}
	</DemoContent>

	<CodeBlock title={t('code.with_handle')} code={codeExample} />
</DemoSection>

<style>
	.add-task-form {
		display: flex;
		gap: var(--space-3);
	}

	.add-task-form input {
		flex: 1;
		padding: var(--space-3) var(--space-4);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		background: var(--color-input);
		color: var(--color-foreground);
		font-size: var(--text-sm);
	}

	.add-task-form input:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.task-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.task-item {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		background: var(--color-card);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		transition: all 200ms ease;
	}

	.task-item:hover {
		border-color: var(--color-border-hover, var(--color-primary));
	}

	.task-item.completed .task-name {
		text-decoration: line-through;
		color: var(--color-muted-foreground);
	}

	.drag-handle {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-1);
		background: none;
		border: none;
		color: var(--color-muted-foreground);
		cursor: grab;
		border-radius: var(--radius);
		transition: all 150ms ease;
	}

	.drag-handle:hover {
		background: var(--color-panel-2);
		color: var(--color-foreground);
	}

	.drag-handle:active {
		cursor: grabbing;
	}

	.task-checkbox {
		position: relative;
		display: flex;
		align-items: center;
		cursor: pointer;
	}

	.task-checkbox input {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
	}

	.checkmark {
		width: 20px;
		height: 20px;
		border: 2px solid var(--color-border);
		border-radius: var(--radius);
		transition: all 150ms ease;
	}

	.task-checkbox input:checked + .checkmark {
		background: var(--color-primary);
		border-color: var(--color-primary);
	}

	.task-checkbox input:checked + .checkmark::after {
		content: '';
		position: absolute;
		left: 7px;
		top: 3px;
		width: 5px;
		height: 10px;
		border: solid white;
		border-width: 0 2px 2px 0;
		transform: rotate(45deg);
	}

	.task-name {
		flex: 1;
		font-size: var(--text-sm);
		color: var(--color-foreground);
		transition: all 200ms ease;
	}

	.task-actions {
		display: flex;
		gap: var(--space-1);
		opacity: 0;
		transition: opacity 150ms ease;
	}

	.task-item:hover .task-actions {
		opacity: 1;
	}

	.action-btn {
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

	.action-btn:hover {
		background: var(--color-panel-3, var(--color-border));
	}

	.action-btn.edit:hover {
		color: var(--color-primary);
	}

	.action-btn.delete:hover {
		color: var(--color-destructive, #ef4444);
		background: rgba(239, 68, 68, 0.1);
	}
</style>
