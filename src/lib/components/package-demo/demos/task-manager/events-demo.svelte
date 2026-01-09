<script lang="ts">
	/**
	 * Events Demo
	 * Demonstrates real-time event subscription and live event log.
	 */
	import { onMount } from 'svelte';
	import {
		createTaskManager,
		createMemoryStorage,
		type TaskRoot,
		type TaskExecutor,
		type TaskEvent,
		type TaskEventData
	} from '@shelchin/task-manager';
	import { Play, Radio, Trash2, RotateCcw } from '@lucide/svelte';
	import {
		DemoSection,
		DemoContent,
		CodeBlock,
		DemoEmptyState,
		ActionButtons,
		DemoButton
	} from '$lib/components/package-demo';

	interface Props {
		t: (key: string) => string;
	}

	let { t }: Props = $props();

	interface EventLogEntry {
		id: number;
		time: string;
		event: TaskEvent;
		taskName: string;
		nodeName?: string;
		progress?: number;
		status?: string;
	}

	let task = $state<TaskRoot | null>(null);
	let eventLog = $state<EventLogEntry[]>([]);
	let executing = $state(false);
	let eventCounter = 0;

	// Use memory storage for this demo (no persistence needed)
	const manager = createTaskManager<{ index: number }>({
		storage: createMemoryStorage()
	});

	function getEventIcon(event: TaskEvent): string {
		const icons: Record<TaskEvent, string> = {
			start: '▶️',
			progress: '📊',
			complete: '✅',
			fail: '❌',
			pause: '⏸️',
			resume: '▶️',
			cancel: '🚫'
		};
		return icons[event] || '📌';
	}

	function getEventColor(event: TaskEvent): string {
		const colors: Record<TaskEvent, string> = {
			start: 'var(--color-primary)',
			progress: 'var(--color-info)',
			complete: 'var(--color-success)',
			fail: 'var(--color-danger)',
			pause: 'var(--color-warning)',
			resume: 'var(--color-primary)',
			cancel: 'var(--color-muted)'
		};
		return colors[event] || 'var(--color-foreground)';
	}

	// Subscribe to all events
	onMount(() => {
		const events: TaskEvent[] = [
			'start',
			'progress',
			'complete',
			'fail',
			'pause',
			'resume',
			'cancel'
		];

		const handler = (event: TaskEvent, data: TaskEventData) => {
			const entry: EventLogEntry = {
				id: eventCounter++,
				time: new Date().toLocaleTimeString(),
				event,
				taskName: data.root.name,
				nodeName: data.node?.name,
				progress: data.node?.progress,
				status: data.node?.status || data.root.status
			};
			eventLog = [entry, ...eventLog].slice(0, 50); // Keep last 50 events
		};

		// Subscribe and collect unsubscribe functions
		const unsubscribes = events.map((event) => manager.on(event, handler));

		return () => {
			// Call all unsubscribe functions
			unsubscribes.forEach((unsubscribe) => unsubscribe());
		};
	});

	async function createAndExecute() {
		executing = true;
		eventLog = [];
		eventCounter = 0;

		// Create task
		task = await manager.create({
			name: 'Event Demo Task',
			children: [
				{ name: 'Step 1', data: { index: 1 } },
				{ name: 'Step 2', data: { index: 2 } },
				{ name: 'Step 3', data: { index: 3 } },
				{ name: 'Step 4', data: { index: 4 } }
			]
		});

		// Execute with progress updates
		const executor: TaskExecutor<{ index: number }> = async (ctx) => {
			// Simulate work with progress
			for (let i = 0; i <= 100; i += 25) {
				await ctx.progress(i);
				await new Promise((r) => setTimeout(r, 200));
			}

			// Random failure for demo
			if (ctx.data.index === 3 && Math.random() < 0.5) {
				throw new Error('Random failure for demo');
			}

			await ctx.complete({ processed: true });
		};

		try {
			task = await manager.execute(task.id, executor);
		} catch {
			// Task may fail, that's ok for demo
		}

		task = await manager.getRoot(task!.id);
		executing = false;
	}

	async function resetDemo() {
		if (task) {
			await manager.delete(task.id);
		}
		task = null;
		eventLog = [];
		eventCounter = 0;
	}

	const codeExample = `import { createTaskManager } from '@shelchin/task-manager';

const manager = createTaskManager();

// Subscribe to events - returns unsubscribe function
const unsubscribeStart = manager.on('start', (event, { root, node }) => {
  console.log(\`Started: \${node.name}\`);
});

const unsubscribeProgress = manager.on('progress', (event, { root, node }) => {
  console.log(\`Progress: \${node.name} - \${node.progress}%\`);
});

const unsubscribeComplete = manager.on('complete', (event, { root, node }) => {
  console.log(\`Completed: \${node.name}\`);
});

const unsubscribeFail = manager.on('fail', (event, { root, node }) => {
  console.log(\`Failed: \${node.name} - \${node.error}\`);
});

// Unsubscribe when done
unsubscribeStart();
unsubscribeProgress();
// ... etc

// Available events:
// 'start' | 'progress' | 'complete' | 'fail' | 'pause' | 'resume' | 'cancel'`;
</script>

<DemoSection title={t('demo.events.title')} description={t('demo.events.description')}>
	<DemoContent>
		{#snippet panel()}
			<ActionButtons>
				<DemoButton
					variant="success"
					icon={Play}
					loading={executing}
					onclick={createAndExecute}
					disabled={executing}
				>
					{t('demo.events.run_demo')}
				</DemoButton>
				<DemoButton variant="outline" icon={RotateCcw} onclick={resetDemo} disabled={executing}>
					{t('demo.lifecycle.reset')}
				</DemoButton>
			</ActionButtons>
		{/snippet}

		{#snippet result()}
			<div class="events-container">
				<div class="events-header">
					<Radio size={18} />
					<span>{t('demo.events.event_log')}</span>
					<span class="event-count">{eventLog.length} events</span>
				</div>

				{#if eventLog.length === 0}
					<DemoEmptyState icon={Radio} message={t('demo.events.no_events')} />
				{:else}
					<div class="event-list">
						{#each eventLog as entry (entry.id)}
							<div class="event-item" style="--event-color: {getEventColor(entry.event)}">
								<span class="event-icon">{getEventIcon(entry.event)}</span>
								<span class="event-time">{entry.time}</span>
								<span class="event-type">{entry.event}</span>
								<span class="event-details">
									{#if entry.nodeName}
										<span class="node-name">{entry.nodeName}</span>
									{:else}
										<span class="task-name">{entry.taskName}</span>
									{/if}
									{#if entry.event === 'progress' && entry.progress !== undefined}
										<span class="progress-badge">{entry.progress}%</span>
									{/if}
								</span>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/snippet}
	</DemoContent>

	<CodeBlock title={t('code.events')} code={codeExample} />
</DemoSection>

<style>
	.events-container {
		background: var(--color-card);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		overflow: hidden;
	}

	.events-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-4);
		background: var(--color-panel-1);
		border-bottom: 1px solid var(--color-border);
		font-weight: 500;
		color: var(--color-foreground);
	}

	.event-count {
		margin-left: auto;
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		background: var(--color-panel-2);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-full);
	}

	.event-list {
		max-height: 400px;
		overflow-y: auto;
	}

	.event-item {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-2) var(--space-4);
		border-bottom: 1px solid var(--color-border);
		font-size: var(--text-sm);
		transition: background 0.2s;
	}

	.event-item:hover {
		background: var(--color-panel-1);
	}

	.event-item:last-child {
		border-bottom: none;
	}

	.event-icon {
		font-size: var(--text-base);
	}

	.event-time {
		font-family: var(--font-family-mono);
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		min-width: 80px;
	}

	.event-type {
		font-weight: 600;
		color: var(--event-color);
		min-width: 70px;
		text-transform: uppercase;
		font-size: var(--text-xs);
	}

	.event-details {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		flex: 1;
	}

	.node-name {
		color: var(--color-foreground);
	}

	.task-name {
		color: var(--color-muted-foreground);
		font-style: italic;
	}

	.progress-badge {
		font-size: var(--text-xs);
		background: var(--color-primary);
		color: white;
		padding: 0 var(--space-2);
		border-radius: var(--radius-full);
	}
</style>
