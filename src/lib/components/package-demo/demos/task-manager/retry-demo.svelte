<script lang="ts">
	/**
	 * Retry Demo
	 * Demonstrates automatic retry with exponential backoff for failed tasks.
	 */
	import { onMount } from 'svelte';
	import {
		createTaskManager,
		createMemoryStorage,
		type TaskRoot,
		type TaskNode,
		type TaskExecutor
	} from '@shelchin/task-manager';
	import { Play, RotateCcw, AlertTriangle, RefreshCw } from '@lucide/svelte';
	import {
		DemoSection,
		DemoContent,
		CodeBlock,
		TaskStatusBadge,
		TaskStatusIcon,
		DemoEmptyState,
		InputGroup,
		ActionButtons,
		DemoButton
	} from '$lib/components/package-demo';

	interface Props {
		t: (key: string) => string;
	}

	let { t }: Props = $props();

	interface RetryLog {
		id: number;
		time: string;
		nodeName: string;
		attempt: number;
		maxAttempts: number;
		status: 'retrying' | 'success' | 'exhausted';
		delay?: number;
	}

	let task = $state<TaskRoot | null>(null);
	let nodes = $state<TaskNode[]>([]);
	let retryLog = $state<RetryLog[]>([]);
	let executing = $state(false);
	let logCounter = 0;

	// Configuration
	let maxAttempts = $state(3);
	let failureRate = $state(70); // 70% chance of failure

	const manager = createTaskManager<{ index: number }>({
		storage: createMemoryStorage(),
		retry: {
			maxAttempts: 3,
			baseDelayMs: 500,
			maxDelayMs: 5000
		}
	});

	// Subscribe to events to track retries
	onMount(() => {
		const trackRetry = (event: string, data: { root: TaskRoot; node?: TaskNode }) => {
			if (!data.node) return;

			const entry: RetryLog = {
				id: logCounter++,
				time: new Date().toLocaleTimeString(),
				nodeName: data.node.name,
				attempt: data.node.attempts,
				maxAttempts: data.node.maxAttempts,
				status:
					event === 'complete'
						? 'success'
						: data.node.attempts >= data.node.maxAttempts
							? 'exhausted'
							: 'retrying',
				delay: data.node.attempts > 1 ? 500 * data.node.attempts : undefined
			};

			// Only log retry-related events
			if (data.node.attempts > 1 || event === 'fail') {
				retryLog = [entry, ...retryLog].slice(0, 30);
			}
		};

		// Subscribe and collect unsubscribe functions
		const unsubscribeStart = manager.on('start', (e, d) => trackRetry(e, d));
		const unsubscribeComplete = manager.on('complete', (e, d) => trackRetry(e, d));
		const unsubscribeFail = manager.on('fail', (e, d) => trackRetry(e, d));

		return () => {
			unsubscribeStart();
			unsubscribeComplete();
			unsubscribeFail();
		};
	});

	async function createAndExecute() {
		executing = true;
		retryLog = [];
		logCounter = 0;

		// Create task with configurable maxAttempts
		task = await manager.create({
			name: 'Retry Demo Task',
			children: [
				{ name: 'Flaky API Call 1', data: { index: 1 }, maxAttempts },
				{ name: 'Flaky API Call 2', data: { index: 2 }, maxAttempts },
				{ name: 'Flaky API Call 3', data: { index: 3 }, maxAttempts }
			]
		});

		nodes = await manager.getNodes(task.id);

		// Execute with random failures
		const executor: TaskExecutor<{ index: number }> = async (ctx) => {
			// Simulate network latency
			await new Promise((r) => setTimeout(r, 300 + Math.random() * 500));

			// Random failure based on failureRate
			if (Math.random() * 100 < failureRate) {
				throw new Error(`Network error (attempt ${ctx.node.attempts})`);
			}

			await ctx.complete({ success: true });
		};

		// Poll for updates
		const interval = setInterval(async () => {
			if (task) {
				const updated = await manager.getRoot(task.id);
				if (updated) task = updated;
				nodes = await manager.getNodes(task.id);
			}
		}, 100);

		try {
			task = await manager.execute(task.id, executor);
		} catch {
			// Task may fail after all retries exhausted
		}

		clearInterval(interval);
		task = await manager.getRoot(task!.id);
		nodes = await manager.getNodes(task!.id);
		executing = false;
	}

	async function resetDemo() {
		if (task) {
			await manager.delete(task.id);
		}
		task = null;
		nodes = [];
		retryLog = [];
		logCounter = 0;
	}

	function getStatusIcon(status: RetryLog['status']): string {
		switch (status) {
			case 'success':
				return '✅';
			case 'exhausted':
				return '❌';
			case 'retrying':
				return '🔄';
		}
	}

	function getStatusColor(status: RetryLog['status']): string {
		switch (status) {
			case 'success':
				return 'var(--color-success)';
			case 'exhausted':
				return 'var(--color-danger)';
			case 'retrying':
				return 'var(--color-warning)';
		}
	}

	const codeExample = `import { createTaskManager } from '@shelchin/task-manager';

// Configure retry behavior
const manager = createTaskManager({
  retry: {
    maxAttempts: 3,      // Default retries per node
    baseDelayMs: 1000,   // Base delay between retries
    maxDelayMs: 10000    // Maximum delay cap
  }
});

// Create task with custom retry per node
const task = await manager.create({
  name: 'API Calls',
  children: [
    { name: 'Critical API', maxAttempts: 5 },  // More retries
    { name: 'Optional API', maxAttempts: 1 }   // No retries
  ]
});

// Execute - failed tasks auto-retry with exponential backoff
await manager.execute(task.id, async (ctx) => {
  console.log(\`Attempt \${ctx.node.attempts} of \${ctx.node.maxAttempts}\`);

  const response = await fetch('/api/data');
  if (!response.ok) {
    throw new Error('API failed'); // Will trigger retry
  }

  await ctx.complete(await response.json());
});

// Delay formula: min(baseDelayMs * attempt, maxDelayMs)
// Attempt 1: 1000ms, Attempt 2: 2000ms, Attempt 3: 3000ms...`;
</script>

<DemoSection title={t('demo.retry.title')} description={t('demo.retry.description')}>
	<DemoContent>
		{#snippet panel()}
			<InputGroup label={t('demo.retry.max_attempts')} id="retry-max-attempts">
				<div class="slider-control">
					<input
						id="retry-max-attempts"
						type="range"
						bind:value={maxAttempts}
						min="1"
						max="5"
						disabled={executing}
					/>
					<span class="slider-value">{maxAttempts}</span>
				</div>
			</InputGroup>

			<InputGroup label={t('demo.retry.failure_rate')} id="retry-failure-rate">
				<div class="slider-control">
					<input
						id="retry-failure-rate"
						type="range"
						bind:value={failureRate}
						min="0"
						max="100"
						step="10"
						disabled={executing}
					/>
					<span class="slider-value">{failureRate}%</span>
				</div>
			</InputGroup>

			<ActionButtons>
				<DemoButton
					variant="success"
					icon={Play}
					loading={executing}
					onclick={createAndExecute}
					disabled={executing}
				>
					{t('demo.retry.run_demo')}
				</DemoButton>
				<DemoButton variant="outline" icon={RotateCcw} onclick={resetDemo} disabled={executing}>
					{t('demo.lifecycle.reset')}
				</DemoButton>
			</ActionButtons>
		{/snippet}

		{#snippet result()}
			<div class="retry-container">
				{#if task}
					<div class="task-status">
						<div class="task-header">
							<h4>{task.name}</h4>
							<TaskStatusBadge status={task.status} label={t(`status.${task.status}`)} />
						</div>

						<div class="nodes-grid">
							{#each nodes as node (node.id)}
								<div class="node-card" class:failed={node.status === 'failed'}>
									<div class="node-header">
										<TaskStatusIcon status={node.status} />
										<span class="node-name">{node.name}</span>
									</div>
									<div class="node-attempts">
										<span class="attempts-label">{t('demo.retry.attempts')}:</span>
										<span class="attempts-value">{node.attempts}/{node.maxAttempts}</span>
									</div>
									{#if node.error}
										<div class="node-error">
											<AlertTriangle size={12} />
											<span>{node.error}</span>
										</div>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<div class="retry-log">
					<div class="log-header">
						<RefreshCw size={18} />
						<span>{t('demo.retry.retry_log')}</span>
						<span class="log-count">{retryLog.length} entries</span>
					</div>

					{#if retryLog.length === 0}
						<DemoEmptyState icon={RefreshCw} message={t('demo.retry.no_retries')} />
					{:else}
						<div class="log-list">
							{#each retryLog as entry (entry.id)}
								<div class="log-item" style="--status-color: {getStatusColor(entry.status)}">
									<span class="log-icon">{getStatusIcon(entry.status)}</span>
									<span class="log-time">{entry.time}</span>
									<span class="log-node">{entry.nodeName}</span>
									<span class="log-attempt">
										{t('demo.retry.attempt')}
										{entry.attempt}/{entry.maxAttempts}
									</span>
									{#if entry.delay}
										<span class="log-delay">+{entry.delay}ms</span>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		{/snippet}
	</DemoContent>

	<CodeBlock title={t('code.retry')} code={codeExample} />
</DemoSection>

<style>
	.slider-control {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.slider-control input[type='range'] {
		flex: 1;
		height: 6px;
		border-radius: 3px;
		background: var(--color-panel-2);
		cursor: pointer;
	}

	.slider-control input[type='range']:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.slider-value {
		min-width: 3ch;
		font-size: var(--text-lg);
		font-weight: 600;
		color: var(--color-primary);
		text-align: right;
	}

	.retry-container {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.task-status {
		background: var(--color-card);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: var(--space-4);
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

	.nodes-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: var(--space-3);
	}

	.node-card {
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		padding: var(--space-3);
	}

	.node-card.failed {
		border-color: var(--color-danger);
		background: color-mix(in srgb, var(--color-danger) 5%, var(--color-panel-1));
	}

	.node-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-2);
	}

	.node-name {
		font-weight: 500;
		color: var(--color-foreground);
		font-size: var(--text-sm);
	}

	.node-attempts {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-xs);
	}

	.attempts-label {
		color: var(--color-muted-foreground);
	}

	.attempts-value {
		font-weight: 600;
		color: var(--color-primary);
	}

	.node-error {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		margin-top: var(--space-2);
		font-size: var(--text-xs);
		color: var(--color-danger);
	}

	.retry-log {
		background: var(--color-card);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		overflow: hidden;
	}

	.log-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-4);
		background: var(--color-panel-1);
		border-bottom: 1px solid var(--color-border);
		font-weight: 500;
		color: var(--color-foreground);
	}

	.log-count {
		margin-left: auto;
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		background: var(--color-panel-2);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-full);
	}

	.log-list {
		max-height: 250px;
		overflow-y: auto;
	}

	.log-item {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-2) var(--space-4);
		border-bottom: 1px solid var(--color-border);
		font-size: var(--text-sm);
	}

	.log-item:last-child {
		border-bottom: none;
	}

	.log-icon {
		font-size: var(--text-base);
	}

	.log-time {
		font-family: var(--font-family-mono);
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		min-width: 80px;
	}

	.log-node {
		flex: 1;
		color: var(--color-foreground);
	}

	.log-attempt {
		font-size: var(--text-xs);
		color: var(--status-color);
		font-weight: 600;
	}

	.log-delay {
		font-size: var(--text-xs);
		color: var(--color-warning);
		background: color-mix(in srgb, var(--color-warning) 15%, transparent);
		padding: 0 var(--space-2);
		border-radius: var(--radius-full);
	}
</style>
