<script lang="ts">
	/**
	 * Store Dashboard Demo
	 * Demonstrates reactive store with real-time state management.
	 */
	import { onMount } from 'svelte';
	import {
		createTaskStore,
		createIndexedDBStorage,
		type TaskExecutor
	} from '@shelchin/task-manager';
	import { Plus, RefreshCw, Play, Pause, Trash2, Database, Loader2 } from '@lucide/svelte';
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
	// Use createTaskStore for reactive state management
	let store = createTaskStore<{ step: number }>({
		storage: createIndexedDBStorage(STORAGE_NAME)
	});

	// Derived stats from store's reactive values
	const stats = $derived({
		total: store.allRoots.length,
		pending: store.pendingRoots.length,
		running: store.runningRoots.length,
		completed: store.completedRoots.length,
		failed: store.failedRoots.length,
		paused: store.pausedRoots.length
	});

	async function createTask() {
		const names = ['Data Sync', 'File Upload', 'Report Generation', 'API Call', 'Cache Update'];
		const name = names[Math.floor(Math.random() * names.length)];

		await store.create({
			name: `${name} #${store.allRoots.length + 1}`,
			children: Array.from({ length: 3 + Math.floor(Math.random() * 5) }, (_, i) => ({
				name: `Step ${i + 1}`,
				data: { step: i + 1 }
			}))
		});
	}

	async function executeTask(taskId: string) {
		const executor: TaskExecutor<{ step: number }> = async (ctx) => {
			await new Promise((r) => setTimeout(r, 200 + Math.random() * 300));

			if (Math.random() < 0.15) {
				throw new Error('Random failure');
			}

			await ctx.complete();
		};

		await store.execute(taskId, executor);
	}

	async function pauseTask(taskId: string) {
		await store.pause(taskId);
	}

	async function resumeTask(taskId: string) {
		const executor: TaskExecutor<{ step: number }> = async (ctx) => {
			await new Promise((r) => setTimeout(r, 200 + Math.random() * 300));

			if (Math.random() < 0.15) {
				throw new Error('Random failure');
			}

			await ctx.complete();
		};

		await store.resume(taskId, executor);
	}

	async function deleteTask(taskId: string) {
		await store.delete(taskId);
	}

	async function clearCompleted() {
		await store.clearCompleted();
	}

	async function clearFailed() {
		await store.clearFailed();
	}

	async function refreshAll() {
		await store.refreshAll();
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
		store.init();
	});

	const codeExample = `import { createTaskStore } from '@shelchin/task-manager';

// Create a reactive store (Svelte 5)
const store = createTaskStore();

// Initialize from storage
await store.init();

// Reactive derived values (auto-update when state changes)
console.log(store.allRoots);       // All tasks
console.log(store.pendingRoots);   // Pending tasks
console.log(store.completedRoots); // Completed tasks
console.log(store.stats);          // { total, completed, failed }

// CRUD operations (automatically sync state)
await store.create({ name: 'Task', children: [...] });
await store.execute(taskId, executor);
await store.delete(taskId);

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
				<DemoButton variant="outline" onclick={refreshAll}>
					{#if store.isLoading}
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
				{#if store.allRoots.length === 0}
					<DemoEmptyState icon={Database} message={t('messages.no_tasks')} />
				{:else}
					{#each store.allRoots as task (task.id)}
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
								{:else if task.status === 'running'}
									<IconButton
										icon={Pause}
										iconSize={14}
										variant="warning"
										onclick={() => pauseTask(task.id)}
										title={t('actions.pause')}
									/>
								{:else if task.status === 'paused'}
									<IconButton
										icon={Play}
										iconSize={14}
										variant="success"
										onclick={() => resumeTask(task.id)}
										title={t('actions.resume')}
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
