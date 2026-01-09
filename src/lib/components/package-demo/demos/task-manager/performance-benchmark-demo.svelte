<script lang="ts">
	/**
	 * Performance Benchmark Demo
	 * Tests task creation and execution performance across different scales.
	 * Supports both Memory and IndexedDB storage backends.
	 */
	import {
		createTaskManager,
		createMemoryStorage,
		createIndexedDBStorage,
		type TaskExecutor
	} from '@shelchin/task-manager';
	import {
		Play,
		RotateCcw,
		Gauge,
		AlertTriangle,
		CheckCircle,
		Clock,
		Loader,
		Database,
		HardDrive
	} from '@lucide/svelte';
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

	type StorageType = 'memory' | 'indexeddb';
	type TestType = 'create' | 'execute' | 'both';

	interface BenchmarkResult {
		count: number;
		createTime: number;
		executeTime: number;
		status: 'pending' | 'running' | 'completed' | 'skipped';
	}

	// Test scales - includes 100k for stress testing
	const TEST_SCALES = [100, 1_000, 10_000, 100_000];
	const WARN_THRESHOLD = 10_000; // Show warning for scales >= this

	let storageType = $state<StorageType>('memory');
	let testType = $state<TestType>('both');
	let skipMerkle = $state(true); // Default to skip for performance
	let useWorker = $state(false);
	let results = $state<BenchmarkResult[]>(createInitialResults());
	let running = $state(false);
	let currentTest = $state<number | null>(null);
	let currentPhase = $state<'create' | 'execute' | null>(null);
	let executionProgress = $state(0);
	let aborted = $state(false);

	function createInitialResults(): BenchmarkResult[] {
		return TEST_SCALES.map((count) => ({
			count,
			createTime: 0,
			executeTime: 0,
			status: 'pending'
		}));
	}

	function formatTime(ms: number): string {
		if (ms < 1000) return `${ms.toFixed(0)}ms`;
		return `${(ms / 1000).toFixed(2)}s`;
	}

	function createStorage() {
		const storage =
			storageType === 'indexeddb'
				? createIndexedDBStorage({ dbName: `benchmark-${Date.now()}` })
				: createMemoryStorage();

		return createTaskManager<{ index: number }>({
			storage,
			skipMerkle,
			useWorker
		});
	}

	async function runBenchmark() {
		running = true;
		aborted = false;

		// Reset results
		results = createInitialResults();

		for (let i = 0; i < TEST_SCALES.length; i++) {
			if (aborted) break;

			const count = TEST_SCALES[i];
			currentTest = count;

			// Update status to running
			results = results.map((r, idx) => (idx === i ? { ...r, status: 'running' as const } : r));

			try {
				console.log(`[Benchmark] Starting test for ${count} tasks, storage: ${storageType}`);
				const manager = createStorage();
				console.log(`[Benchmark] Manager created`);

				// Build children array
				const children = [];
				for (let j = 0; j < count; j++) {
					children.push({ name: `Task ${j}`, data: { index: j } });
				}
				console.log(`[Benchmark] Children array built: ${children.length} items`);

				let createTime = 0;
				let executeTime = 0;
				let task = null;

				// Test creation if needed
				if (testType === 'create' || testType === 'both') {
					currentPhase = 'create';
					console.log(`[Benchmark] Starting create phase...`);

					const createStart = performance.now();
					task = await manager.create({
						name: 'Benchmark Task',
						concurrency: Infinity, // Parallel execution for speed
						children
					});
					const createEnd = performance.now();
					createTime = createEnd - createStart;
					console.log(`[Benchmark] Create completed in ${createTime}ms`);
				}

				// Test execution if needed
				if ((testType === 'execute' || testType === 'both') && task) {
					currentPhase = 'execute';
					executionProgress = 0;

					// Subscribe to progress events with throttling for large task counts
					let lastUpdate = 0;
					const throttleMs = count >= 10000 ? 100 : count >= 1000 ? 50 : 0;
					const unsubscribe = manager.on('complete', (_event, data) => {
						const now = Date.now();
						if (now - lastUpdate >= throttleMs) {
							executionProgress = Math.round((data.root.stats.completed / count) * 100);
							lastUpdate = now;
						}
					});

					const executeStart = performance.now();
					const executor: TaskExecutor<{ index: number }> = async (ctx) => {
						// Minimal work - just complete
						await ctx.complete({ done: true });
					};
					await manager.execute(task.id, executor);
					const executeEnd = performance.now();
					executeTime = executeEnd - executeStart;
					executionProgress = 100;

					unsubscribe();
				}

				// If only testing execute, create task first without timing
				if (testType === 'execute' && !task) {
					currentPhase = 'create';
					console.log(`[Benchmark] Execute mode: creating task first...`);
					task = await manager.create({
						name: 'Benchmark Task',
						concurrency: Infinity, // Parallel execution for speed
						children
					});
					console.log(`[Benchmark] Execute mode: task created, id=${task.id}`);

					currentPhase = 'execute';
					console.log(`[Benchmark] Starting execute phase...`);
					executionProgress = 0;

					// Subscribe to progress events with throttling for large task counts
					let lastUpdate = 0;
					const throttleMs = count >= 10000 ? 100 : count >= 1000 ? 50 : 0;
					const unsubscribe = manager.on('complete', (_event, data) => {
						const now = Date.now();
						if (now - lastUpdate >= throttleMs) {
							executionProgress = Math.round((data.root.stats.completed / count) * 100);
							lastUpdate = now;
						}
					});

					const executeStart = performance.now();
					const executor: TaskExecutor<{ index: number }> = async (ctx) => {
						await ctx.complete({ done: true });
					};
					await manager.execute(task.id, executor);
					const executeEnd = performance.now();
					executeTime = executeEnd - executeStart;
					executionProgress = 100;

					unsubscribe();
				}

				// Update result
				results = results.map((r, idx) =>
					idx === i
						? {
								...r,
								createTime,
								executeTime,
								status: 'completed' as const
							}
						: r
				);

				// Clean up
				await manager.clear();

				// Small delay between tests to let GC run
				await new Promise((resolve) => setTimeout(resolve, 100));
			} catch (error) {
				console.error(`Benchmark failed for ${count} tasks:`, error);
				results = results.map((r, idx) => (idx === i ? { ...r, status: 'skipped' as const } : r));
			}
		}

		currentTest = null;
		currentPhase = null;
		running = false;
	}

	function stopBenchmark() {
		aborted = true;
	}

	function resetBenchmark() {
		results = createInitialResults();
		currentTest = null;
		currentPhase = null;
		aborted = false;
	}

	function setStorageType(type: StorageType) {
		if (!running) {
			storageType = type;
			resetBenchmark();
		}
	}

	function setTestType(type: TestType) {
		if (!running) {
			testType = type;
			resetBenchmark();
		}
	}

	function getStatusIcon(status: BenchmarkResult['status']) {
		switch (status) {
			case 'completed':
				return CheckCircle;
			case 'running':
				return Loader;
			case 'skipped':
				return AlertTriangle;
			default:
				return Clock;
		}
	}

	function getStatusColor(status: BenchmarkResult['status']): string {
		switch (status) {
			case 'completed':
				return 'var(--color-success)';
			case 'running':
				return 'var(--color-primary)';
			case 'skipped':
				return 'var(--color-danger)';
			default:
				return 'var(--color-muted-foreground)';
		}
	}

	const completedCount = $derived(results.filter((r) => r.status === 'completed').length);
	const progress = $derived(Math.round((completedCount / TEST_SCALES.length) * 100));
	const showCreateTime = $derived(testType === 'create' || testType === 'both');
	const showExecuteTime = $derived(testType === 'execute' || testType === 'both');

	const codeExample = `import { createTaskManager, createMemoryStorage, createIndexedDBStorage } from '@shelchin/task-manager';

// Choose storage backend
const storage = createMemoryStorage();        // Fast, in-memory
// or: createIndexedDBStorage()               // Persistent, browser storage

const manager = createTaskManager({
  storage,
  skipMerkle: true,  // Skip Merkle tree for better performance
  useWorker: true    // Use Web Worker for hash computation
});

// Build large task tree
const children = [];
for (let i = 0; i < 10000; i++) {
  children.push({ name: \`Task \${i}\`, data: { index: i } });
}

// Measure creation time
const createStart = performance.now();
const task = await manager.create({
  name: 'Large Task',
  children
});
const createTime = performance.now() - createStart;

// Measure execution time (separate test)
const executeStart = performance.now();
await manager.execute(task.id, async (ctx) => {
  await ctx.complete({ done: true });
});
const executeTime = performance.now() - executeStart;

console.log(\`Created in \${createTime}ms, executed in \${executeTime}ms\`);

// Performance tips:
// - skipMerkle: true - Skip Merkle hash computation (50%+ faster)
// - useWorker: true - Offload hashing to Web Worker (non-blocking)
// - Memory storage: faster for benchmarks and testing
// - IndexedDB storage: persistent, slightly slower`;
</script>

<DemoSection title={t('demo.benchmark.title')} description={t('demo.benchmark.description')}>
	<DemoContent>
		{#snippet panel()}
			<div class="benchmark-info">
				<AlertTriangle size={16} class="warning-icon" />
				<span>{t('demo.benchmark.warning')}</span>
			</div>

			<div class="options-row">
				<div class="storage-toggle">
					<span class="toggle-label">{t('demo.benchmark.storage_type')}:</span>
					<div class="toggle-buttons">
						<button
							class="toggle-btn"
							class:active={storageType === 'memory'}
							onclick={() => setStorageType('memory')}
							disabled={running}
						>
							<HardDrive size={14} />
							Memory
						</button>
						<button
							class="toggle-btn"
							class:active={storageType === 'indexeddb'}
							onclick={() => setStorageType('indexeddb')}
							disabled={running}
						>
							<Database size={14} />
							IndexedDB
						</button>
					</div>
				</div>

				<div class="test-type-toggle">
					<span class="toggle-label">{t('demo.benchmark.test_type')}:</span>
					<div class="toggle-buttons">
						<button
							class="toggle-btn"
							class:active={testType === 'create'}
							onclick={() => setTestType('create')}
							disabled={running}
						>
							{t('demo.benchmark.create_only')}
						</button>
						<button
							class="toggle-btn"
							class:active={testType === 'execute'}
							onclick={() => setTestType('execute')}
							disabled={running}
						>
							{t('demo.benchmark.execute_only')}
						</button>
						<button
							class="toggle-btn"
							class:active={testType === 'both'}
							onclick={() => setTestType('both')}
							disabled={running}
						>
							{t('demo.benchmark.both')}
						</button>
					</div>
				</div>
			</div>

			<div class="options-row">
				<div class="checkbox-toggle">
					<label class="checkbox-label">
						<input type="checkbox" bind:checked={skipMerkle} disabled={running} />
						<span>{t('demo.benchmark.skip_merkle')}</span>
					</label>
				</div>

				<div class="checkbox-toggle">
					<label class="checkbox-label">
						<input type="checkbox" bind:checked={useWorker} disabled={running || skipMerkle} />
						<span>{t('demo.benchmark.use_worker')}</span>
					</label>
				</div>
			</div>

			<ActionButtons>
				{#if running}
					<DemoButton variant="danger" icon={RotateCcw} onclick={stopBenchmark}>
						{t('demo.benchmark.stop')}
					</DemoButton>
				{:else}
					<DemoButton variant="success" icon={Play} onclick={runBenchmark} disabled={running}>
						{t('demo.benchmark.run_all')}
					</DemoButton>
					<DemoButton
						variant="outline"
						icon={RotateCcw}
						onclick={resetBenchmark}
						disabled={running}
					>
						{t('demo.lifecycle.reset')}
					</DemoButton>
				{/if}
			</ActionButtons>
		{/snippet}

		{#snippet result()}
			<div class="benchmark-container">
				<div class="benchmark-header">
					<Gauge size={18} />
					<span>{t('demo.benchmark.results')}</span>
					<span class="storage-badge" class:indexeddb={storageType === 'indexeddb'}>
						{storageType === 'memory' ? 'Memory' : 'IndexedDB'}
					</span>
					{#if running}
						<span class="progress-badge">{progress}%</span>
					{/if}
				</div>

				{#if results.every((r) => r.status === 'pending')}
					<DemoEmptyState icon={Gauge} message={t('demo.benchmark.no_results')} />
				{:else}
					<div class="results-table">
						<div
							class="table-header"
							class:show-both={showCreateTime && showExecuteTime}
							class:show-single={!showCreateTime || !showExecuteTime}
						>
							<span class="col-count">{t('demo.benchmark.subtasks')}</span>
							{#if showCreateTime}
								<span class="col-time">{t('demo.benchmark.create_time')}</span>
							{/if}
							{#if showExecuteTime}
								<span class="col-time">{t('demo.benchmark.execute_time')}</span>
							{/if}
							<span class="col-status">{t('demo.benchmark.status_col')}</span>
						</div>

						{#each results as result (result.count)}
							{@const StatusIcon = getStatusIcon(result.status)}
							<div
								class="table-row"
								class:running={result.status === 'running'}
								class:warning={result.count >= WARN_THRESHOLD}
								class:show-both={showCreateTime && showExecuteTime}
								class:show-single={!showCreateTime || !showExecuteTime}
							>
								<span class="col-count">
									{result.count.toLocaleString()}
									{#if result.count >= WARN_THRESHOLD}
										<AlertTriangle size={12} class="inline-warning" />
									{/if}
								</span>
								{#if showCreateTime}
									<span class="col-time">
										{#if result.status === 'completed' && result.createTime > 0}
											{formatTime(result.createTime)}
										{:else if result.status === 'running' && currentPhase === 'create'}
											<span class="running-text">...</span>
										{:else}
											-
										{/if}
									</span>
								{/if}
								{#if showExecuteTime}
									<span class="col-time">
										{#if result.status === 'completed' && result.executeTime > 0}
											{formatTime(result.executeTime)}
										{:else if result.status === 'running' && currentPhase === 'execute'}
											<span class="running-text">{executionProgress}%</span>
										{:else}
											-
										{/if}
									</span>
								{/if}
								<span class="col-status" style="color: {getStatusColor(result.status)}">
									<StatusIcon size={14} class={result.status === 'running' ? 'spin' : ''} />
								</span>
							</div>
						{/each}
					</div>

					{#if running && currentTest}
						<div class="progress-bar-container">
							<div class="progress-label">
								{#if currentPhase === 'create'}
									{t('demo.benchmark.creating')}
								{:else}
									{t('demo.benchmark.executing')}
								{/if}
								{currentTest.toLocaleString()}
								{t('demo.benchmark.tasks')}...
							</div>
							<div class="progress-bar">
								<div class="progress-fill" style="width: {progress}%"></div>
							</div>
						</div>
					{/if}
				{/if}
			</div>
		{/snippet}
	</DemoContent>

	<CodeBlock title={t('code.performance_benchmark')} code={codeExample} />
</DemoSection>

<style>
	.benchmark-info {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3);
		background: color-mix(in srgb, var(--color-warning) 10%, transparent);
		border: 1px solid var(--color-warning);
		border-radius: var(--radius);
		font-size: var(--text-sm);
		color: var(--color-warning);
		margin-bottom: var(--space-3);
	}

	.benchmark-info :global(.warning-icon) {
		flex-shrink: 0;
	}

	.options-row {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-4);
		margin-bottom: var(--space-3);
	}

	.storage-toggle,
	.test-type-toggle,
	.checkbox-toggle {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
		color: var(--color-foreground);
		cursor: pointer;
	}

	.checkbox-label input[type='checkbox'] {
		width: 16px;
		height: 16px;
		accent-color: var(--color-primary);
		cursor: pointer;
	}

	.checkbox-label input[type='checkbox']:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.checkbox-label input[type='checkbox']:disabled + span {
		opacity: 0.5;
	}

	.toggle-label {
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
		white-space: nowrap;
	}

	.toggle-buttons {
		display: flex;
		gap: var(--space-1);
		background: var(--color-panel-1);
		padding: var(--space-1);
		border-radius: var(--radius);
		border: 1px solid var(--color-border);
	}

	.toggle-btn {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-1) var(--space-2);
		border: none;
		background: transparent;
		color: var(--color-muted-foreground);
		font-size: var(--text-xs);
		border-radius: var(--radius);
		cursor: pointer;
		transition: all 0.15s;
		white-space: nowrap;
	}

	.toggle-btn:hover:not(:disabled) {
		color: var(--color-foreground);
	}

	.toggle-btn.active {
		background: var(--color-primary);
		color: white;
	}

	.toggle-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.benchmark-container {
		background: var(--color-card);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		overflow: hidden;
	}

	.benchmark-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-4);
		background: var(--color-panel-1);
		border-bottom: 1px solid var(--color-border);
		font-weight: 500;
		color: var(--color-foreground);
	}

	.storage-badge {
		font-size: var(--text-xs);
		background: var(--color-success);
		color: white;
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-full);
	}

	.storage-badge.indexeddb {
		background: var(--color-primary);
	}

	.progress-badge {
		margin-left: auto;
		font-size: var(--text-xs);
		background: var(--color-primary);
		color: white;
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-full);
	}

	.results-table {
		width: 100%;
	}

	.table-header {
		display: grid;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		background: var(--color-panel-2);
		font-size: var(--text-xs);
		font-weight: 600;
		color: var(--color-muted-foreground);
		text-transform: uppercase;
	}

	.table-header.show-both {
		grid-template-columns: 1fr 1fr 1fr 60px;
	}

	.table-header.show-single {
		grid-template-columns: 1fr 1fr 60px;
	}

	.table-row {
		display: grid;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-4);
		border-bottom: 1px solid var(--color-border);
		font-size: var(--text-sm);
		align-items: center;
		transition: background 0.2s;
	}

	.table-row.show-both {
		grid-template-columns: 1fr 1fr 1fr 60px;
	}

	.table-row.show-single {
		grid-template-columns: 1fr 1fr 60px;
	}

	.table-row:last-child {
		border-bottom: none;
	}

	.table-row:hover {
		background: var(--color-panel-1);
	}

	.table-row.running {
		background: color-mix(in srgb, var(--color-primary) 5%, transparent);
	}

	.table-row.warning .col-count {
		color: var(--color-warning);
	}

	.col-count {
		font-weight: 600;
		display: flex;
		align-items: center;
		gap: var(--space-1);
	}

	.col-time {
		font-family: var(--font-family-mono);
		color: var(--color-foreground);
	}

	.col-status {
		display: flex;
		justify-content: center;
	}

	:global(.inline-warning) {
		color: var(--color-warning);
	}

	.running-text {
		animation: pulse 1s infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
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

	.progress-bar-container {
		padding: var(--space-3) var(--space-4);
		border-top: 1px solid var(--color-border);
		background: var(--color-panel-1);
	}

	.progress-label {
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
		margin-bottom: var(--space-2);
	}

	.progress-bar {
		height: 8px;
		background: var(--color-panel-2);
		border-radius: 4px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: var(--color-primary);
		transition: width 0.3s ease;
	}
</style>
