<script lang="ts">
	/**
	 * Task Lifecycle Demo
	 * Demonstrates pause, resume, and cancel functionality.
	 */
	import { onMount } from 'svelte';
	import {
		createTaskManager,
		createIndexedDBStorage,
		type TaskRoot,
		type TaskNode,
		type TaskExecutor
	} from '@shelchin/task-manager';
	import { Play, Pause, Square, RotateCcw, Zap } from '@lucide/svelte';
	import {
		DemoSection,
		DemoContent,
		CodeBlock,
		TaskStatusBadge,
		TaskStatusIcon,
		ProgressBar,
		DemoEmptyState,
		DemoButton
	} from '$lib/components/package-demo';

	interface Props {
		t: (key: string) => string;
	}

	let { t }: Props = $props();

	const STORAGE_NAME = 'task-manager-demo-lifecycle';
	let task = $state<TaskRoot | null>(null);
	let nodes = $state<TaskNode[]>([]);
	let manager = createTaskManager<{ index: number }>({
		storage: createIndexedDBStorage(STORAGE_NAME),
		retry: { maxAttempts: 1, baseDelayMs: 100, maxDelayMs: 500 }
	});
	let running = $state(false);
	void running; // Used in template conditionals
	let currentItem = $state(0);
	let loading = $state(true);
	void loading; // Used in template conditionals
	const ITEMS_COUNT = 10;

	// Calculate progress based on completed tasks (not internal progress)
	let completedProgress = $derived(
		task ? Math.round((task.stats.completed / task.stats.total) * 100) : 0
	);

	// Restore task from storage on mount
	onMount(async () => {
		const roots = await manager.getAllRoots();
		if (roots.length > 0) {
			task = roots[0];
			nodes = await manager.getNodes(task.id);
			// Calculate current item based on completed nodes
			currentItem = nodes.filter((n) => n.status === 'completed').length;
		}
		loading = false;
	});

	async function startTask() {
		currentItem = 0;

		task = await manager.create({
			name: 'Lifecycle Demo',
			children: Array.from({ length: ITEMS_COUNT }, (_, i) => ({
				name: `Item ${i + 1}`,
				data: { index: i + 1 }
			}))
		});

		const taskId = task.id;
		nodes = await manager.getNodes(taskId);
		running = true;

		const executor: TaskExecutor<{ index: number }> = async (ctx) => {
			currentItem = ctx.data.index;

			for (let i = 0; i <= 100; i += 10) {
				if (ctx.isPaused()) return;
				await ctx.progress(i);
				await new Promise((r) => setTimeout(r, 100));

				const updated = await manager.getRoot(taskId);
				if (updated) task = updated;
				nodes = await manager.getNodes(taskId);
			}
			await ctx.complete();

			const finalTask = await manager.getRoot(taskId);
			if (finalTask) task = finalTask;
			nodes = await manager.getNodes(taskId);
		};

		task = await manager.execute(taskId, executor);
		nodes = await manager.getNodes(taskId);
		running = false;
	}

	async function pauseTask() {
		if (!task) return;
		const taskId = task.id;
		await manager.pause(taskId, 'User requested pause');
		const updated = await manager.getRoot(taskId);
		if (updated) task = updated;
	}

	async function resumeTask() {
		if (!task) return;
		const taskId = task.id;
		running = true;

		const executor: TaskExecutor<{ index: number }> = async (ctx) => {
			currentItem = ctx.data.index;

			// Resume from saved progress instead of starting from 0
			const startProgress = ctx.node.progress;
			for (let i = startProgress; i <= 100; i += 10) {
				if (ctx.isPaused()) return;
				await ctx.progress(i);
				await new Promise((r) => setTimeout(r, 100));

				const updated = await manager.getRoot(taskId);
				if (updated) task = updated;
				nodes = await manager.getNodes(taskId);
			}
			await ctx.complete();

			const finalTask = await manager.getRoot(taskId);
			if (finalTask) task = finalTask;
			nodes = await manager.getNodes(taskId);
		};

		task = await manager.resume(taskId, executor);
		nodes = await manager.getNodes(taskId);
		running = false;
	}

	async function cancelTask() {
		if (!task) return;
		const taskId = task.id;
		await manager.cancel(taskId);
		const updated = await manager.getRoot(taskId);
		if (updated) task = updated;
		nodes = await manager.getNodes(taskId);
		running = false;
	}

	async function resetTask() {
		if (task) {
			await manager.delete(task.id);
		}
		task = null;
		nodes = [];
		currentItem = 0;
		running = false;
	}

	function getStatusColor(status: string): string {
		const colors: Record<string, string> = {
			completed: 'var(--color-success)',
			failed: 'var(--color-danger)',
			running: 'var(--color-primary)',
			paused: 'var(--color-warning)',
			cancelled: 'var(--color-muted)',
			pending: 'var(--color-muted-foreground)'
		};
		return colors[status] || 'var(--color-muted-foreground)';
	}

	const codeExample = `// Pause a running task
await manager.pause(task.id, 'Need to pause');

// Resume a paused task
await manager.resume(task.id, executor);

// Cancel a task
await manager.cancel(task.id);

// Subscribe to events
manager.on('progress', (event, { root, node }) => {
  console.log(\`\${root.name}: \${root.progress}%\`);
});

manager.on('complete', (event, { root }) => {
  console.log(\`Task \${root.name} completed!\`);
});`;
</script>

<DemoSection title={t('demo.lifecycle.title')} description={t('demo.lifecycle.description')}>
	<DemoContent>
		{#snippet panel()}
			<div class="lifecycle-controls">
				{#if !task}
					<DemoButton variant="primary" size="lg" icon={Play} onclick={startTask}>
						{t('demo.lifecycle.start')}
					</DemoButton>
				{:else}
					<DemoButton
						variant="warning"
						icon={Pause}
						onclick={pauseTask}
						disabled={task.status !== 'running'}
					>
						{t('demo.lifecycle.pause')}
					</DemoButton>
					<DemoButton
						variant="success"
						icon={Play}
						onclick={resumeTask}
						disabled={task.status !== 'paused'}
					>
						{t('demo.lifecycle.resume')}
					</DemoButton>
					<DemoButton
						variant="danger"
						icon={Square}
						onclick={cancelTask}
						disabled={task.status !== 'running' && task.status !== 'paused'}
					>
						{t('demo.lifecycle.cancel')}
					</DemoButton>
					<DemoButton variant="outline" icon={RotateCcw} onclick={resetTask}>
						{t('demo.lifecycle.reset')}
					</DemoButton>
				{/if}
			</div>

			{#if task}
				<div class="lifecycle-status">
					<div class="status-item">
						<span class="label">{t('demo.basic.status')}</span>
						<TaskStatusBadge status={task.status} label={t(`status.${task.status}`)} />
					</div>
					<div class="status-item">
						<span class="label">{t('demo.basic.progress')}</span>
						<span class="value">{completedProgress}%</span>
					</div>
					<div class="status-item">
						<span class="label">{t('demo.lifecycle.processing')}</span>
						<span class="value">{currentItem} / {ITEMS_COUNT}</span>
					</div>
				</div>
			{/if}
		{/snippet}

		{#snippet result()}
			{#if task}
				<div class="progress-grid">
					{#each nodes as node, index (node.id)}
						<div
							class="progress-cell"
							class:completed={node.status === 'completed'}
							class:running={node.status === 'running'}
							class:failed={node.status === 'failed'}
							class:cancelled={node.status === 'cancelled'}
							class:paused={node.status === 'paused'}
						>
							{#if node.status === 'running' || node.status === 'paused'}
								<span class="node-progress">{node.progress}%</span>
							{:else if node.status === 'pending'}
								<span>{index + 1}</span>
							{:else}
								<TaskStatusIcon status={node.status} size={14} />
							{/if}
						</div>
					{/each}
				</div>

				<ProgressBar
					progress={completedProgress}
					color={getStatusColor(task.status)}
					size="lg"
					class="mt-4"
				/>
			{:else}
				<DemoEmptyState icon={Zap} message={t('demo.lifecycle.description')} />
			{/if}
		{/snippet}
	</DemoContent>

	<CodeBlock title={t('code.pause_resume')} code={codeExample} />
</DemoSection>

<style>
	.lifecycle-controls {
		display: flex;
		gap: var(--space-3);
		flex-wrap: wrap;
	}

	.lifecycle-status {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-4);
		padding: var(--space-4);
		background: var(--color-panel-1);
		border-radius: var(--radius-lg);
	}

	.status-item {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.status-item .label {
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		text-transform: uppercase;
	}

	.status-item .value {
		font-size: var(--text-lg);
		font-weight: 600;
		color: var(--color-foreground);
	}

	.progress-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: var(--space-2);
	}

	.progress-cell {
		aspect-ratio: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-panel-2);
		border-radius: var(--radius);
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
		transition: all 0.3s;
	}

	.progress-cell.completed {
		background: var(--color-success);
		color: white;
	}

	.progress-cell.running {
		background: var(--color-primary);
		color: white;
	}

	.progress-cell.failed {
		background: var(--color-danger);
		color: white;
	}

	.progress-cell.cancelled {
		background: var(--color-muted);
		color: white;
	}

	.progress-cell.paused {
		background: var(--color-warning);
		color: white;
	}

	.node-progress {
		font-size: var(--text-xs);
		font-weight: 600;
	}

	:global(.mt-4) {
		margin-top: var(--space-4);
	}

	@media (max-width: 768px) {
		.lifecycle-status {
			grid-template-columns: 1fr;
		}
	}
</style>
