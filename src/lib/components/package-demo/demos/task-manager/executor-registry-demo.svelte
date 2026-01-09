<script lang="ts">
	/**
	 * Executor Registry Demo
	 * Demonstrates using multiple executor types within a single task.
	 */
	import { onMount } from 'svelte';
	import {
		createTaskManager,
		createMemoryStorage,
		type TaskRoot,
		type TaskNode,
		type ExecutorRegistry
	} from '@shelchin/task-manager';
	import { Play, RotateCcw, FileUp, Database, Send, Cog } from '@lucide/svelte';
	import {
		DemoSection,
		DemoContent,
		CodeBlock,
		TaskStatusBadge,
		TaskStatusIcon,
		ProgressBar,
		DemoEmptyState,
		ActionButtons,
		DemoButton
	} from '$lib/components/package-demo';

	interface Props {
		t: (key: string) => string;
	}

	let { t }: Props = $props();

	type TaskData = {
		type: 'upload' | 'process' | 'notify';
		fileName?: string;
		dataId?: number;
		email?: string;
	};

	let task = $state<TaskRoot | null>(null);
	let nodes = $state<TaskNode<TaskData>[]>([]);
	let executing = $state(false);
	let updateInterval: ReturnType<typeof setInterval> | null = null;

	const manager = createTaskManager<TaskData>({
		storage: createMemoryStorage()
	});

	// Define multiple executor types
	const executors: ExecutorRegistry<TaskData> = {
		upload: async (ctx) => {
			// Simulate file upload with progress
			for (let i = 0; i <= 100; i += 20) {
				await ctx.progress(i);
				await new Promise((r) => setTimeout(r, 200));
			}
			await ctx.complete({ uploadedUrl: `/files/${ctx.data.fileName}` });
		},

		process: async (ctx) => {
			// Simulate data processing
			for (let i = 0; i <= 100; i += 25) {
				await ctx.progress(i);
				await new Promise((r) => setTimeout(r, 300));
			}
			await ctx.complete({ processed: true, dataId: ctx.data.dataId });
		},

		notify: async (ctx) => {
			// Simulate sending notification (atomic - no progress)
			await new Promise((r) => setTimeout(r, 500));
			await ctx.complete({ sent: true, to: ctx.data.email });
		}
	};

	function getExecutorIcon(executor?: string) {
		switch (executor) {
			case 'upload':
				return FileUp;
			case 'process':
				return Database;
			case 'notify':
				return Send;
			default:
				return Cog;
		}
	}

	function getExecutorColor(executor?: string): string {
		switch (executor) {
			case 'upload':
				return 'var(--color-primary)';
			case 'process':
				return 'var(--color-success)';
			case 'notify':
				return 'var(--color-warning)';
			default:
				return 'var(--color-muted)';
		}
	}

	async function createAndExecute() {
		executing = true;

		// Create task with different executor types
		task = await manager.create({
			name: 'Multi-Step Workflow',
			concurrency: 2, // Execute 2 in parallel
			children: [
				{
					name: 'Upload Image',
					executor: 'upload',
					data: { type: 'upload', fileName: 'photo.jpg' }
				},
				{
					name: 'Upload Document',
					executor: 'upload',
					data: { type: 'upload', fileName: 'report.pdf' }
				},
				{
					name: 'Process Data #1',
					executor: 'process',
					data: { type: 'process', dataId: 101 }
				},
				{
					name: 'Process Data #2',
					executor: 'process',
					data: { type: 'process', dataId: 102 }
				},
				{
					name: 'Send Notification',
					executor: 'notify',
					mode: 'atomic',
					data: { type: 'notify', email: 'user@example.com' }
				}
			]
		});

		nodes = (await manager.getNodes(task.id)) as TaskNode<TaskData>[];

		// Poll for updates
		updateInterval = setInterval(async () => {
			if (task) {
				const updated = await manager.getRoot(task.id);
				if (updated) task = updated;
				nodes = (await manager.getNodes(task.id)) as TaskNode<TaskData>[];
			}
		}, 100);

		try {
			task = await manager.execute(task.id, executors);
		} catch {
			// Task may fail
		}

		if (updateInterval) {
			clearInterval(updateInterval);
			updateInterval = null;
		}

		task = await manager.getRoot(task!.id);
		nodes = (await manager.getNodes(task!.id)) as TaskNode<TaskData>[];
		executing = false;
	}

	async function resetDemo() {
		if (updateInterval) {
			clearInterval(updateInterval);
			updateInterval = null;
		}
		if (task) {
			await manager.delete(task.id);
		}
		task = null;
		nodes = [];
	}

	onMount(() => {
		return () => {
			if (updateInterval) {
				clearInterval(updateInterval);
			}
		};
	});

	const codeExample = `import { createTaskManager, type ExecutorRegistry } from '@shelchin/task-manager';

type TaskData = {
  type: 'upload' | 'process' | 'notify';
  fileName?: string;
  dataId?: number;
  email?: string;
};

const manager = createTaskManager<TaskData>();

// Define multiple executor types
const executors: ExecutorRegistry<TaskData> = {
  upload: async (ctx) => {
    const url = await uploadFile(ctx.data.fileName);
    await ctx.complete({ url });
  },

  process: async (ctx) => {
    const result = await processData(ctx.data.dataId);
    await ctx.complete(result);
  },

  notify: async (ctx) => {
    await sendEmail(ctx.data.email);
    await ctx.complete({ sent: true });
  }
};

// Create task with different executor references
const task = await manager.create({
  name: 'Workflow',
  children: [
    { name: 'Upload', executor: 'upload', data: { type: 'upload', fileName: 'a.jpg' } },
    { name: 'Process', executor: 'process', data: { type: 'process', dataId: 1 } },
    { name: 'Notify', executor: 'notify', data: { type: 'notify', email: 'user@example.com' } }
  ]
});

// Execute with the registry - each node uses its assigned executor
await manager.execute(task.id, executors);`;
</script>

<DemoSection title={t('demo.registry.title')} description={t('demo.registry.description')}>
	<DemoContent>
		{#snippet panel()}
			<div class="executor-legend">
				<div class="legend-title">{t('demo.registry.executor_types')}</div>
				<div class="legend-items">
					<div class="legend-item">
						<FileUp size={16} style="color: var(--color-primary)" />
						<span>upload</span>
						<span class="legend-desc">{t('demo.registry.upload_desc')}</span>
					</div>
					<div class="legend-item">
						<Database size={16} style="color: var(--color-success)" />
						<span>process</span>
						<span class="legend-desc">{t('demo.registry.process_desc')}</span>
					</div>
					<div class="legend-item">
						<Send size={16} style="color: var(--color-warning)" />
						<span>notify</span>
						<span class="legend-desc">{t('demo.registry.notify_desc')}</span>
					</div>
				</div>
			</div>

			<ActionButtons>
				<DemoButton
					variant="success"
					icon={Play}
					loading={executing}
					onclick={createAndExecute}
					disabled={executing}
				>
					{t('demo.registry.run_workflow')}
				</DemoButton>
				<DemoButton variant="outline" icon={RotateCcw} onclick={resetDemo} disabled={executing}>
					{t('demo.lifecycle.reset')}
				</DemoButton>
			</ActionButtons>
		{/snippet}

		{#snippet result()}
			{#if task}
				<div class="workflow-container">
					<div class="workflow-header">
						<h4>{task.name}</h4>
						<TaskStatusBadge status={task.status} label={t(`status.${task.status}`)} />
					</div>

					<ProgressBar progress={task.progress} showLabel />

					<div class="workflow-nodes">
						{#each nodes as node (node.id)}
							{@const ExecutorIcon = getExecutorIcon(node.executor)}
							<div
								class="workflow-node"
								style="--executor-color: {getExecutorColor(node.executor)}"
							>
								<div class="node-icon">
									<ExecutorIcon size={20} />
								</div>
								<div class="node-info">
									<div class="node-header">
										<span class="node-name">{node.name}</span>
										<TaskStatusIcon status={node.status} />
									</div>
									<div class="node-meta">
										<span class="executor-badge">{node.executor}</span>
										<span class="node-progress">{node.progress}%</span>
									</div>
									{#if node.status === 'running'}
										<div class="node-progress-bar">
											<div class="progress-fill" style="width: {node.progress}%"></div>
										</div>
									{/if}
									{#if node.result}
										<div class="node-result">
											<code>{JSON.stringify(node.result)}</code>
										</div>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				</div>
			{:else}
				<DemoEmptyState icon={Cog} message={t('demo.registry.no_workflow')} />
			{/if}
		{/snippet}
	</DemoContent>

	<CodeBlock title={t('code.executor_registry')} code={codeExample} />
</DemoSection>

<style>
	.executor-legend {
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		padding: var(--space-3);
	}

	.legend-title {
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-foreground);
		margin-bottom: var(--space-2);
	}

	.legend-items {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
	}

	.legend-item span:first-of-type {
		font-family: var(--font-family-mono);
		font-weight: 500;
		min-width: 60px;
	}

	.legend-desc {
		color: var(--color-muted-foreground);
		font-size: var(--text-xs);
	}

	.workflow-container {
		background: var(--color-card);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: var(--space-4);
	}

	.workflow-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-4);
	}

	.workflow-header h4 {
		font-size: var(--text-lg);
		font-weight: 600;
		color: var(--color-foreground);
		margin: 0;
	}

	.workflow-nodes {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		margin-top: var(--space-4);
	}

	.workflow-node {
		display: flex;
		gap: var(--space-3);
		padding: var(--space-3);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-left: 3px solid var(--executor-color);
		border-radius: var(--radius);
	}

	.node-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		background: color-mix(in srgb, var(--executor-color) 15%, transparent);
		border-radius: var(--radius);
		color: var(--executor-color);
		flex-shrink: 0;
	}

	.node-info {
		flex: 1;
		min-width: 0;
	}

	.node-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-2);
	}

	.node-name {
		font-weight: 500;
		color: var(--color-foreground);
	}

	.node-meta {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-top: var(--space-1);
	}

	.executor-badge {
		font-family: var(--font-family-mono);
		font-size: var(--text-xs);
		background: var(--executor-color);
		color: white;
		padding: 0 var(--space-2);
		border-radius: var(--radius-full);
	}

	.node-progress {
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
	}

	.node-progress-bar {
		height: 4px;
		background: var(--color-panel-2);
		border-radius: 2px;
		margin-top: var(--space-2);
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: var(--executor-color);
		transition: width 0.2s ease;
	}

	.node-result {
		margin-top: var(--space-2);
	}

	.node-result code {
		font-size: var(--text-xs);
		background: var(--color-panel-2);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius);
		color: var(--color-success);
	}
</style>
