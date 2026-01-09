<script lang="ts">
	/**
	 * Store Dashboard Demo
	 * Demonstrates reactive store with real-time state management.
	 */
	import { onMount } from 'svelte';
	import {
		createTaskManager,
		createIndexedDBStorage,
		type TaskRoot,
		type TaskExecutor
	} from '@shelchin/task-manager';
	import { Plus, RefreshCw, Play, Trash2, Database, Loader2 } from '@lucide/svelte';
	import {
		DemoSection,
		DemoContent,
		CodeBlock,
		TaskStatusIcon,
		ProgressBar,
		DemoEmptyState,
		StatCard,
		ActionButtons,
		DemoButton,
		IconButton
	} from '$lib/components/package-demo';

	interface Props {
		t: (key: string) => string;
	}

	let { t }: Props = $props();

	const STORAGE_NAME = 'task-manager-demo-store';
	let manager = createTaskManager<{ step: number }>({
		storage: createIndexedDBStorage(STORAGE_NAME)
	});
	let tasks = $state<TaskRoot[]>([]);
	let loading = $state(false);

	const stats = $derived({
		total: tasks.length,
		pending: tasks.filter((t) => t.status === 'pending').length,
		running: tasks.filter((t) => t.status === 'running').length,
		completed: tasks.filter((t) => t.status === 'completed').length,
		failed: tasks.filter((t) => t.status === 'failed').length,
		paused: tasks.filter((t) => t.status === 'paused').length
	});

	async function refreshTasks() {
		loading = true;
		tasks = await manager.getAllRoots();
		loading = false;
	}

	async function createTask() {
		const names = ['Data Sync', 'File Upload', 'Report Generation', 'API Call', 'Cache Update'];
		const name = names[Math.floor(Math.random() * names.length)];

		await manager.create({
			name: `${name} #${tasks.length + 1}`,
			children: Array.from({ length: 3 + Math.floor(Math.random() * 5) }, (_, i) => ({
				name: `Step ${i + 1}`,
				data: { step: i + 1 }
			}))
		});

		await refreshTasks();
	}

	async function executeTask(taskId: string) {
		const executor: TaskExecutor<{ step: number }> = async (ctx) => {
			await new Promise((r) => setTimeout(r, 200 + Math.random() * 300));

			if (Math.random() < 0.15) {
				throw new Error('Random failure');
			}

			await ctx.complete();
		};

		await manager.execute(taskId, executor);
		await refreshTasks();
	}

	async function deleteTask(taskId: string) {
		await manager.delete(taskId);
		await refreshTasks();
	}

	async function clearCompleted() {
		const completed = tasks.filter((t) => t.status === 'completed');
		for (const task of completed) {
			await manager.delete(task.id);
		}
		await refreshTasks();
	}

	async function clearFailed() {
		const failed = tasks.filter((t) => t.status === 'failed');
		for (const task of failed) {
			await manager.delete(task.id);
		}
		await refreshTasks();
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

	onMount(() => {
		refreshTasks();
	});

	const codeExample = `import { createTaskStore } from '@shelchin/task-manager';

// Create a reactive store (Svelte 5)
const store = createTaskStore();

// Initialize from storage
await store.init();

// Reactive derived values
console.log(store.allRoots);      // All tasks
console.log(store.pendingRoots);  // Pending tasks
console.log(store.completedRoots); // Completed tasks
console.log(store.stats);         // { total, completed, failed }

// Clear completed/failed
await store.clearCompleted();
await store.clearFailed();`;
</script>

<DemoSection title={t('demo.store.title')} description={t('demo.store.description')}>
	<DemoContent fullWidth>
		<div class="store-dashboard">
			<div class="store-stats">
				<StatCard value={stats.total} label={t('demo.store.all_tasks')} />
				<StatCard value={stats.pending} label={t('demo.store.pending')} variant="pending" />
				<StatCard value={stats.running} label={t('demo.store.running')} variant="running" />
				<StatCard value={stats.completed} label={t('demo.store.completed')} variant="completed" />
				<StatCard value={stats.failed} label={t('demo.store.failed')} variant="failed" />
			</div>

			<ActionButtons>
				<DemoButton icon={Plus} onclick={createTask}>
					{t('demo.basic.create_task')}
				</DemoButton>
				<DemoButton variant="outline" onclick={refreshTasks}>
					{#if loading}
						<Loader2 size={16} class="spin" />
					{:else}
						<RefreshCw size={16} />
					{/if}
					{t('demo.store.refresh')}
				</DemoButton>
				<DemoButton
					variant="success-outline"
					onclick={clearCompleted}
					disabled={stats.completed === 0}
				>
					{t('demo.store.clear_completed')}
				</DemoButton>
				<DemoButton variant="danger-outline" onclick={clearFailed} disabled={stats.failed === 0}>
					{t('demo.store.clear_failed')}
				</DemoButton>
			</ActionButtons>

			<div class="store-tasks">
				{#if tasks.length === 0}
					<DemoEmptyState icon={Database} message={t('messages.no_tasks')} />
				{:else}
					{#each tasks as task (task.id)}
						<div class="store-task-card">
							<div class="task-info">
								<TaskStatusIcon status={task.status} size={20} />
								<div class="task-details">
									<span class="task-name">{task.name}</span>
									<span class="task-meta">
										{task.stats.completed}/{task.stats.total} completed
									</span>
								</div>
							</div>

							<div class="task-progress">
								<ProgressBar
									progress={task.progress}
									color={getStatusColor(task.status)}
									size="sm"
								/>
								<span class="progress-text">{task.progress}%</span>
							</div>

							<div class="task-actions">
								{#if task.status === 'pending'}
									<IconButton
										icon={Play}
										iconSize={14}
										variant="success"
										onclick={() => executeTask(task.id)}
										title={t('actions.execute')}
									/>
								{/if}
								<IconButton
									icon={Trash2}
									iconSize={14}
									variant="danger"
									onclick={() => deleteTask(task.id)}
									title={t('actions.delete')}
								/>
							</div>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	</DemoContent>

	<CodeBlock title={t('code.svelte_store')} code={codeExample} />
</DemoSection>

<style>
	.store-dashboard {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}

	.store-stats {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: var(--space-4);
	}

	.store-tasks {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		min-height: 200px;
	}

	.store-task-card {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
	}

	.task-info {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		flex: 1;
	}

	.task-details {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.task-name {
		font-weight: 500;
		color: var(--color-foreground);
	}

	.task-meta {
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
	}

	.task-progress {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		width: 200px;
	}

	.progress-text {
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
		min-width: 3ch;
	}

	.task-actions {
		display: flex;
		gap: var(--space-2);
	}

	:global(.spin) {
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

	@media (max-width: 1024px) {
		.store-stats {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (max-width: 768px) {
		.store-stats {
			grid-template-columns: repeat(2, 1fr);
		}

		.task-progress {
			display: none;
		}
	}
</style>
