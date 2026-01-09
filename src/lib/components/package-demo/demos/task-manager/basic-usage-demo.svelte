<script lang="ts">
	/**
	 * Basic Usage Demo
	 * Demonstrates parallel execution with atomic (no-progress) tasks.
	 */
	import { onMount } from 'svelte';
	import {
		createTaskManager,
		createIndexedDBStorage,
		type TaskRoot,
		type TaskNode,
		type TaskExecutor
	} from '@shelchin/task-manager';
	import { Play, Plus, Trash2, TreeDeciduous, RotateCcw } from '@lucide/svelte';
	import {
		DemoSection,
		DemoContent,
		CodeBlock,
		TaskStatusBadge,
		TaskStatusIcon,
		ProgressBar,
		DemoEmptyState,
		InputGroup,
		ActionButtons,
		DemoButton,
		IconButton
	} from '$lib/components/package-demo';

	interface Props {
		t: (key: string) => string;
	}

	let { t }: Props = $props();

	const STORAGE_NAME = 'task-manager-demo-basic';
	let taskName = $state('My First Task');
	let concurrency = $state(3); // Default parallel execution with 3 concurrent tasks
	let subtasks = $state([
		{ name: 'Subtask 1', data: { value: 1 } },
		{ name: 'Subtask 2', data: { value: 2 } },
		{ name: 'Subtask 3', data: { value: 3 } },
		{ name: 'Subtask 4', data: { value: 4 } },
		{ name: 'Subtask 5', data: { value: 5 } },
		{ name: 'Subtask 6', data: { value: 6 } }
	]);
	let task = $state<TaskRoot | null>(null);
	let nodes = $state<TaskNode[]>([]);
	let manager = createTaskManager<{ value: number }>({
		storage: createIndexedDBStorage(STORAGE_NAME)
	});
	let executing = $state(false);
	let loading = $state(true);
	let updateInterval: ReturnType<typeof setInterval> | null = null;

	// Restore task from storage on mount
	onMount(() => {
		// Load existing tasks
		manager.getAllRoots().then(async (roots) => {
			if (roots.length > 0) {
				task = roots[0];
				nodes = await manager.getNodes(task.id);
			}
			loading = false;
		});

		// Cleanup interval on unmount
		return () => {
			if (updateInterval) {
				clearInterval(updateInterval);
			}
		};
	});

	async function createTask() {
		// Create plain objects to avoid Svelte proxy issues with IndexedDB
		// Use atomic mode (no progress) and parallel execution
		task = await manager.create({
			name: taskName,
			concurrency, // Parallel execution
			children: subtasks.map((s) => ({
				name: s.name,
				mode: 'atomic' as const, // No progress, just waiting -> complete/fail
				data: { value: s.data.value }
			}))
		});
		nodes = await manager.getNodes(task.id);
	}

	async function executeTask() {
		if (!task) return;
		executing = true;
		const taskId = task.id;

		console.log(`[TaskManager] 🚀 Starting task: "${task.name}" (concurrency: ${task.concurrency})`);

		// Start polling for UI updates during parallel execution
		updateInterval = setInterval(async () => {
			const updated = await manager.getRoot(taskId);
			if (updated) task = updated;
			nodes = await manager.getNodes(taskId);
		}, 100);

		const executor: TaskExecutor<{ value: number }> = async (ctx) => {
			console.log(`[TaskManager] ▶️ Starting subtask: "${ctx.node.name}" (data: ${JSON.stringify(ctx.data)})`);

			// Simulate async work (API call, etc.) - atomic task, no progress updates
			const delay = 500 + Math.random() * 1500; // Random 0.5-2s delay
			await new Promise((r) => setTimeout(r, delay));

			const result = { result: ctx.data.value * 2 };
			console.log(`[TaskManager] ✅ Completed subtask: "${ctx.node.name}" (result: ${JSON.stringify(result)})`);
			await ctx.complete(result);
		};

		task = await manager.execute(taskId, executor);
		nodes = await manager.getNodes(taskId);

		// Stop polling
		if (updateInterval) {
			clearInterval(updateInterval);
			updateInterval = null;
		}

		console.log(`[TaskManager] 🎉 Task "${task.name}" finished with status: ${task.status}`);
		executing = false;
	}

	async function resetTask() {
		if (task) {
			await manager.delete(task.id);
			task = null;
			nodes = [];
		}
	}

	function addSubtask() {
		const num = subtasks.length + 1;
		subtasks = [...subtasks, { name: `Subtask ${num}`, data: { value: num } }];
	}

	function removeSubtask(index: number) {
		subtasks = subtasks.filter((_, i) => i !== index);
	}

	const codeExample = `import { createTaskManager } from '@shelchin/task-manager';

// Create a task manager
const manager = createTaskManager();

// Create a task with parallel execution and atomic subtasks
const task = await manager.create({
  name: 'My Task',
  concurrency: 3, // Execute 3 tasks in parallel
  children: [
    { name: 'API Call 1', mode: 'atomic', data: { id: 1 } },
    { name: 'API Call 2', mode: 'atomic', data: { id: 2 } },
    { name: 'API Call 3', mode: 'atomic', data: { id: 3 } },
    { name: 'API Call 4', mode: 'atomic', data: { id: 4 } },
  ]
});

// Execute - atomic tasks don't report progress, just complete/fail
await manager.execute(task.id, async (ctx) => {
  const response = await fetch(\`/api/\${ctx.data.id}\`);
  await ctx.complete({ data: await response.json() });
});`;
</script>

<DemoSection title={t('demo.basic.title')} description={t('demo.basic.description')}>
	<DemoContent>
		{#snippet panel()}
			<InputGroup label={t('demo.basic.task_name')} id="basic-task-name">
				<input
					id="basic-task-name"
					type="text"
					bind:value={taskName}
					placeholder={t('demo.basic.task_name_placeholder')}
				/>
			</InputGroup>

			<InputGroup label={t('demo.basic.concurrency')} id="basic-concurrency">
				<div class="concurrency-control">
					<input
						id="basic-concurrency"
						type="range"
						bind:value={concurrency}
						min="1"
						max="10"
						disabled={Boolean(task)}
					/>
					<span class="concurrency-value">{concurrency}</span>
				</div>
			</InputGroup>

			<div class="subtasks-list">
				<div class="list-header">
					<span>{t('demo.basic.subtask_name')}</span>
					<IconButton icon={Plus} iconSize={16} onclick={addSubtask} />
				</div>
				{#each subtasks as subtask, index (index)}
					<div class="subtask-item">
						<input type="text" bind:value={subtask.name} />
						<IconButton
							icon={Trash2}
							iconSize={14}
							variant="danger"
							onclick={() => removeSubtask(index)}
						/>
					</div>
				{/each}
			</div>

			<ActionButtons>
				<DemoButton onclick={createTask} disabled={executing || Boolean(task)}>
					{t('demo.basic.create_task')}
				</DemoButton>
				<DemoButton
					variant="success"
					icon={Play}
					loading={executing}
					onclick={executeTask}
					disabled={!task || executing || task?.status === 'completed'}
				>
					{t('demo.basic.execute')}
				</DemoButton>
				{#if task}
					<DemoButton variant="outline" icon={RotateCcw} onclick={resetTask} disabled={executing}>
						{t('demo.lifecycle.reset')}
					</DemoButton>
				{/if}
			</ActionButtons>
		{/snippet}

		{#snippet result()}
			{#if loading}
				<DemoEmptyState icon={TreeDeciduous} message={t('messages.loading')} />
			{:else if task}
				<div class="task-card">
					<div class="task-header">
						<h4>{task.name}</h4>
						<TaskStatusBadge status={task.status} label={t(`status.${task.status}`)} />
					</div>

					<ProgressBar progress={task.progress} showLabel />

					<div class="nodes-list">
						{#each nodes as node (node.id)}
							<div class="node-item">
								<TaskStatusIcon status={node.status} />
								<span class="node-name">{node.name}</span>
								<span class="node-progress">{node.progress}%</span>
							</div>
						{/each}
					</div>
				</div>
			{:else}
				<DemoEmptyState icon={TreeDeciduous} message={t('messages.no_tasks')} />
			{/if}
		{/snippet}
	</DemoContent>

	<CodeBlock title={t('code.basic_usage')} code={codeExample} />
</DemoSection>

<style>
	.concurrency-control {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.concurrency-control input[type='range'] {
		flex: 1;
		height: 6px;
		border-radius: 3px;
		background: var(--color-panel-2);
		cursor: pointer;
	}

	.concurrency-control input[type='range']:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.concurrency-value {
		min-width: 2ch;
		font-size: var(--text-lg);
		font-weight: 600;
		color: var(--color-primary);
	}

	.subtasks-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.list-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--color-foreground);
	}

	.subtask-item {
		display: flex;
		gap: var(--space-2);
	}

	.subtask-item input {
		flex: 1;
		padding: var(--space-2) var(--space-3);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		background: var(--color-input);
		color: var(--color-foreground);
		font-size: var(--text-sm);
	}

	.task-card {
		background: var(--color-card);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: var(--space-5);
	}

	.task-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-4);
	}

	.task-header h4 {
		font-size: var(--text-lg);
		font-weight: 600;
		color: var(--color-foreground);
		margin: 0;
	}

	.nodes-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		margin-top: var(--space-4);
	}

	.node-item {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-2) var(--space-3);
		background: var(--color-panel-1);
		border-radius: var(--radius);
	}

	.node-name {
		flex: 1;
		font-size: var(--text-sm);
		color: var(--color-foreground);
	}

	.node-progress {
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
	}
</style>
