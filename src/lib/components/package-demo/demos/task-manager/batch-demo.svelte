<script lang="ts">
	/**
	 * Batch Processing Demo
	 * Demonstrates processing multiple items with progress tracking.
	 */
	import { onMount } from 'svelte';
	import {
		createTaskManager,
		createIndexedDBStorage,
		type TaskRoot,
		type TaskNode,
		type TaskExecutor
	} from '@shelchin/task-manager';
	import { Play, Square, CheckCircle2, XCircle, Clock, Database, Loader2 } from '@lucide/svelte';
	import {
		DemoSection,
		DemoContent,
		DemoEmptyState,
		InputGroup,
		ActionButtons,
		DemoButton
	} from '$lib/components/package-demo';

	interface Props {
		t: (key: string) => string;
	}

	let { t }: Props = $props();

	const STORAGE_NAME = 'task-manager-demo-batch';
	let itemCount = $state(20);
	let task = $state<TaskRoot | null>(null);
	let nodes = $state<TaskNode[]>([]);
	let manager = createTaskManager<{ index: number; shouldFail: boolean }>({
		storage: createIndexedDBStorage(STORAGE_NAME),
		retry: { maxAttempts: 2, baseDelayMs: 100, maxDelayMs: 500 }
	});
	let running = $state(false);
	let loading = $state(true);

	// Restore task from storage on mount
	onMount(async () => {
		const roots = await manager.getAllRoots();
		if (roots.length > 0) {
			task = roots[0];
			nodes = await manager.getNodes(task.id);
		}
		loading = false;
	});

	const stats = $derived({
		completed: nodes.filter((n) => n.status === 'completed').length,
		failed: nodes.filter((n) => n.status === 'failed').length,
		remaining: nodes.filter((n) => n.status === 'pending' || n.status === 'running').length
	});

	async function startProcessing() {
		task = await manager.create({
			name: 'Batch Processing',
			type: 'batch',
			children: Array.from({ length: itemCount }, (_, i) => ({
				name: `Item ${i + 1}`,
				data: { index: i + 1, shouldFail: Math.random() < 0.1 }
			}))
		});

		nodes = await manager.getNodes(task.id);
		running = true;

		const executor: TaskExecutor<{ index: number; shouldFail: boolean }> = async (ctx) => {
			const delay = 100 + Math.random() * 200;
			await new Promise((r) => setTimeout(r, delay));

			if (ctx.data.shouldFail) {
				throw new Error(`Item ${ctx.data.index} failed`);
			}

			await ctx.complete({ processed: true });

			if (task) {
				const taskId = task.id;
				nodes = await manager.getNodes(taskId);
				const updated = await manager.getRoot(taskId);
				if (updated) task = updated;
			}
		};

		task = await manager.execute(task.id, executor);
		nodes = await manager.getNodes(task.id);
		running = false;
	}

	async function stopProcessing() {
		if (!task) return;
		const taskId = task.id;
		await manager.cancel(taskId);
		const updated = await manager.getRoot(taskId);
		if (updated) task = updated;
		nodes = await manager.getNodes(taskId);
		running = false;
	}
</script>

<DemoSection title={t('demo.batch.title')} description={t('demo.batch.description')}>
	<DemoContent>
		{#snippet panel()}
			<InputGroup label={t('demo.batch.items_count')} id="batch-items-count">
				<input id="batch-items-count" type="number" bind:value={itemCount} min="5" max="100" />
			</InputGroup>

			<ActionButtons>
				{#if !running}
					<DemoButton variant="primary" size="lg" icon={Play} onclick={startProcessing}>
						{t('demo.batch.process_all')}
					</DemoButton>
				{:else}
					<DemoButton variant="danger" size="lg" icon={Square} onclick={stopProcessing}>
						{t('demo.batch.stop')}
					</DemoButton>
				{/if}
			</ActionButtons>

			{#if task}
				<div class="batch-stats">
					<div class="stat-item success">
						<CheckCircle2 size={20} />
						<span class="stat-value">{stats.completed}</span>
						<span class="stat-label">{t('demo.batch.completed')}</span>
					</div>
					<div class="stat-item danger">
						<XCircle size={20} />
						<span class="stat-value">{stats.failed}</span>
						<span class="stat-label">{t('demo.batch.failed')}</span>
					</div>
					<div class="stat-item muted">
						<Clock size={20} />
						<span class="stat-value">{stats.remaining}</span>
						<span class="stat-label">{t('demo.batch.remaining')}</span>
					</div>
				</div>
			{/if}
		{/snippet}

		{#snippet result()}
			{#if task}
				<div class="batch-grid">
					{#each nodes as node (node.id)}
						<div
							class="batch-cell"
							class:completed={node.status === 'completed'}
							class:running={node.status === 'running'}
							class:failed={node.status === 'failed'}
							class:cancelled={node.status === 'cancelled'}
							title={node.name}
						>
							{#if node.status === 'running'}
								<Loader2 size={10} class="spin" />
							{:else if node.status === 'completed'}
								<CheckCircle2 size={10} />
							{:else if node.status === 'failed'}
								<XCircle size={10} />
							{/if}
						</div>
					{/each}
				</div>
			{:else}
				<DemoEmptyState icon={Database} message={t('demo.batch.description')} />
			{/if}
		{/snippet}
	</DemoContent>
</DemoSection>

<style>
	.batch-stats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-4);
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: var(--space-4);
		background: var(--color-panel-1);
		border-radius: var(--radius-lg);
	}

	.stat-item.success {
		color: var(--color-success);
	}

	.stat-item.danger {
		color: var(--color-danger);
	}

	.stat-item.muted {
		color: var(--color-muted-foreground);
	}

	.stat-value {
		font-size: var(--text-2xl);
		font-weight: 700;
	}

	.stat-label {
		font-size: var(--text-xs);
		text-transform: uppercase;
	}

	.batch-grid {
		display: grid;
		grid-template-columns: repeat(10, 1fr);
		gap: var(--space-1);
	}

	.batch-cell {
		aspect-ratio: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-panel-2);
		border-radius: var(--radius-sm);
		transition: all 0.2s;
	}

	.batch-cell.completed {
		background: var(--color-success);
		color: white;
	}

	.batch-cell.running {
		background: var(--color-primary);
		color: white;
	}

	.batch-cell.failed {
		background: var(--color-danger);
		color: white;
	}

	.batch-cell.cancelled {
		background: var(--color-muted);
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

	@media (max-width: 768px) {
		.batch-stats {
			grid-template-columns: 1fr;
		}

		.batch-grid {
			grid-template-columns: repeat(5, 1fr);
		}
	}
</style>
