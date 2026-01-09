<script lang="ts">
	import { onMount } from 'svelte';
	import { useI18n } from '@shelchin/i18n';
	import { createTaskManager, TabCoordinator, type TaskRoot } from '@shelchin/task-manager';

	const i18n = useI18n();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const t = (key: string) => i18n.t(`routes/packages/task-manager.demo.multi_tab.${key}` as any);

	// State
	let tabId = $state(Math.random().toString(36).substring(2, 8));
	let isSupported = $state(false);
	let lockInfo = $state<{ held: number; pending: number } | null>(null);
	let logCounter = 0;
	let logs = $state<
		Array<{
			id: number;
			time: string;
			tab: string;
			message: string;
			type: 'info' | 'success' | 'error' | 'lock';
		}>
	>([]);
	let tasks = $state<TaskRoot[]>([]);
	let isOperating = $state(false);

	// Task managers - one with coordination, one without
	let tmWithLock: ReturnType<typeof createTaskManager> | null = null;
	let tmWithoutLock: ReturnType<typeof createTaskManager> | null = null;

	// Coordinator for lock status display
	let coordinator: TabCoordinator | null = null;

	function log(message: string, type: 'info' | 'success' | 'error' | 'lock' = 'info') {
		const time = new Date().toLocaleTimeString();
		logCounter++;
		logs = [{ id: logCounter, time, tab: tabId, message, type }, ...logs.slice(0, 49)];
	}

	async function updateLockInfo() {
		if (coordinator) {
			lockInfo = await coordinator.getLockInfo();
		}
	}

	async function loadTasks() {
		if (!tmWithLock) return;
		tasks = await tmWithLock.getAllRoots();
	}

	// Simulate a slow write operation
	async function createTaskWithLock() {
		if (!tmWithLock || isOperating) return;
		isOperating = true;
		log(t('requesting_lock'), 'lock');

		const startTime = Date.now();
		try {
			await tmWithLock.create({
				name: `Task from Tab ${tabId}`,
				type: 'demo',
				children: [
					{ name: 'Step 1', data: { value: 1 } },
					{ name: 'Step 2', data: { value: 2 } },
					{ name: 'Step 3', data: { value: 3 } }
				]
			});

			const elapsed = Date.now() - startTime;
			log(t('created_task').replace('{time}', String(elapsed)), 'success');
			await loadTasks();
		} catch (err) {
			log(`Error: ${err instanceof Error ? err.message : String(err)}`, 'error');
		} finally {
			isOperating = false;
			await updateLockInfo();
		}
	}

	// Create without lock (potential data corruption)
	async function createTaskWithoutLock() {
		if (!tmWithoutLock || isOperating) return;
		isOperating = true;
		log(t('creating_unsafe'), 'info');

		const startTime = Date.now();
		try {
			await tmWithoutLock.create({
				name: `Unsafe Task from Tab ${tabId}`,
				type: 'demo-unsafe',
				children: [
					{ name: 'Step 1', data: { value: 1 } },
					{ name: 'Step 2', data: { value: 2 } },
					{ name: 'Step 3', data: { value: 3 } }
				]
			});

			const elapsed = Date.now() - startTime;
			log(t('created_unsafe').replace('{time}', String(elapsed)), 'success');
			await loadTasks();
		} catch (err) {
			log(`Error: ${err instanceof Error ? err.message : String(err)}`, 'error');
		} finally {
			isOperating = false;
		}
	}

	// Simulate heavy write operation that holds lock for a while
	async function heavyWriteOperation() {
		if (!tmWithLock || isOperating) return;
		isOperating = true;
		log(t('heavy_started'), 'lock');

		const startTime = Date.now();
		try {
			// Create multiple tasks in sequence
			for (let i = 0; i < 5; i++) {
				await tmWithLock.create({
					name: `Heavy Task ${i + 1} from Tab ${tabId}`,
					type: 'heavy',
					children: Array.from({ length: 10 }, (_, j) => ({
						name: `Step ${j + 1}`,
						data: { value: j }
					}))
				});
				// Simulate processing time
				await new Promise((r) => setTimeout(r, 600));
				log(t('heavy_task').replace('{n}', String(i + 1)), 'info');
			}

			const elapsed = Date.now() - startTime;
			log(t('heavy_completed').replace('{time}', String(elapsed)), 'success');
			await loadTasks();
		} catch (err) {
			log(`Error: ${err instanceof Error ? err.message : String(err)}`, 'error');
		} finally {
			isOperating = false;
			await updateLockInfo();
		}
	}

	async function clearAllTasks() {
		if (!tmWithLock) return;
		log(t('clearing'), 'info');
		try {
			await tmWithLock.clear();
			if (tmWithoutLock) await tmWithoutLock.clear();
			tasks = [];
			log(t('cleared'), 'success');
		} catch (err) {
			log(`Error: ${err instanceof Error ? err.message : String(err)}`, 'error');
		}
	}

	async function verifyIntegrity() {
		if (!tmWithLock) return;
		log(t('verifying'), 'info');
		try {
			for (const task of tasks) {
				const result = await tmWithLock.verifyIntegrity(task.id);
				if (result.valid) {
					log(t('task_valid'), 'success');
				} else {
					log(t('task_invalid'), 'error');
				}
			}
		} catch (err) {
			log(`Error: ${err instanceof Error ? err.message : String(err)}`, 'error');
		}
	}

	onMount(async () => {
		// Create coordinator for lock status
		coordinator = new TabCoordinator({
			lockName: 'task-manager-MultiTabDemo'
		});
		isSupported = coordinator.supported;

		// Create task manager WITH tab coordination
		tmWithLock = createTaskManager({
			dbName: 'MultiTabDemo',
			enableTabCoordination: true,
			skipMerkle: true
		});

		// Create task manager WITHOUT tab coordination (for comparison)
		tmWithoutLock = createTaskManager({
			dbName: 'MultiTabDemo',
			enableTabCoordination: false,
			skipMerkle: true
		});

		log(`${t('tab_initialized')} ${isSupported ? t('supported') : t('not_supported')}`, 'info');

		// Load existing tasks
		await loadTasks();

		// Poll lock status
		const interval = setInterval(updateLockInfo, 500);

		return () => {
			clearInterval(interval);
			tmWithLock?.close();
			tmWithoutLock?.close();
		};
	});
</script>

<div class="container">
	<h1>{t('title')}</h1>
	<p class="description">{t('description')}</p>

	<div class="info-box">
		<p><strong>{t('tab_id')}:</strong> {tabId}</p>
		<p>
			<strong>{t('web_locks_api')}:</strong>
			{#if isSupported}
				<span class="badge success">{t('supported')}</span>
			{:else}
				<span class="badge error">{t('not_supported')}</span>
			{/if}
		</p>
		<p>
			<strong>{t('lock_status')}:</strong>
			{#if lockInfo}
				{t('held')}: {lockInfo.held}, {t('pending')}: {lockInfo.pending}
			{:else}
				N/A
			{/if}
		</p>
	</div>

	<div class="instructions">
		<h3>{t('how_to_test')}</h3>
		<ol>
			<li>{t('step1')}</li>
			<li>{t('step2')}</li>
			<li>{t('step3')}</li>
			<li>{t('step4')}</li>
		</ol>
	</div>

	<div class="actions">
		<button onclick={createTaskWithLock} disabled={isOperating} class="btn primary">
			{isOperating ? t('working') : t('create_safe')}
		</button>

		<button onclick={heavyWriteOperation} disabled={isOperating} class="btn warning">
			{isOperating ? t('working') : t('heavy_write')}
		</button>

		<button onclick={createTaskWithoutLock} disabled={isOperating} class="btn danger">
			{isOperating ? t('working') : t('create_unsafe')}
		</button>

		<button onclick={verifyIntegrity} class="btn secondary">
			{t('verify_integrity')}
		</button>

		<button onclick={clearAllTasks} class="btn secondary">
			{t('clear_all')}
		</button>
	</div>

	<div class="panel-container">
		<div class="panel">
			<h3>{t('tasks_panel')} ({tasks.length})</h3>
			<div class="task-list">
				{#each tasks as task (task.id)}
					<div class="task-item">
						<span class="task-name">{task.name}</span>
						<span class="task-type badge {task.type === 'demo-unsafe' ? 'error' : 'info'}">
							{task.type}
						</span>
					</div>
				{/each}
				{#if tasks.length === 0}
					<p class="empty">{t('no_tasks')}</p>
				{/if}
			</div>
		</div>

		<div class="panel">
			<h3>{t('activity_log')}</h3>
			<div class="log-list">
				{#each logs as logItem (logItem.id)}
					<div class="log-item {logItem.type}">
						<span class="log-time">{logItem.time}</span>
						<span class="log-tab">[{logItem.tab}]</span>
						<span class="log-message">{logItem.message}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
	}

	h1 {
		text-align: center;
		color: var(--color-foreground);
	}

	.description {
		text-align: center;
		color: var(--color-muted-foreground);
		margin-bottom: 24px;
	}

	.info-box {
		background: var(--color-panel-1);
		border-radius: 8px;
		padding: 16px;
		margin-bottom: 20px;
	}

	.info-box p {
		margin: 8px 0;
	}

	.instructions {
		background: var(--color-panel-accent);
		border: 1px solid var(--brand-200);
		border-radius: 8px;
		padding: 16px;
		margin-bottom: 20px;
	}

	.instructions h3 {
		margin-top: 0;
		color: var(--color-primary);
	}

	.instructions ol {
		margin-bottom: 0;
		padding-left: 20px;
	}

	.instructions li {
		margin: 8px 0;
	}

	.badge {
		display: inline-block;
		padding: 2px 8px;
		border-radius: 4px;
		font-size: 12px;
		font-weight: 500;
	}

	.badge.success {
		background: color-mix(in srgb, var(--color-success) 15%, transparent);
		color: var(--color-success);
	}

	.badge.error {
		background: color-mix(in srgb, var(--color-danger) 15%, transparent);
		color: var(--color-danger);
	}

	.badge.info {
		background: color-mix(in srgb, var(--color-info) 15%, transparent);
		color: var(--color-info);
	}

	.actions {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
		margin-bottom: 20px;
	}

	.btn {
		padding: 10px 20px;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-size: 14px;
		font-weight: 500;
		transition: opacity 0.2s;
	}

	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn.primary {
		background: var(--color-button-primary);
		color: var(--color-button-primary-foreground);
	}

	.btn.warning {
		background: var(--color-warning);
		color: white;
	}

	.btn.danger {
		background: var(--color-danger);
		color: white;
	}

	.btn.secondary {
		background: var(--gray-500);
		color: white;
	}

	.panel-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
	}

	@media (max-width: 768px) {
		.panel-container {
			grid-template-columns: 1fr;
		}
	}

	.panel {
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: 8px;
		padding: 16px;
	}

	.panel h3 {
		margin-top: 0;
		color: var(--color-foreground);
		border-bottom: 1px solid var(--color-border);
		padding-bottom: 8px;
	}

	.task-list,
	.log-list {
		max-height: 400px;
		overflow-y: auto;
	}

	.task-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px;
		border-bottom: 1px solid var(--color-panel-border-1);
	}

	.task-name {
		font-weight: 500;
	}

	.log-item {
		padding: 6px 8px;
		font-size: 13px;
		font-family: monospace;
		border-bottom: 1px solid var(--color-panel-border-1);
	}

	.log-item.success {
		background: color-mix(in srgb, var(--color-success) 10%, transparent);
	}

	.log-item.error {
		background: color-mix(in srgb, var(--color-danger) 10%, transparent);
	}

	.log-item.lock {
		background: color-mix(in srgb, var(--color-warning) 10%, transparent);
	}

	.log-time {
		color: var(--color-muted-foreground);
		margin-right: 8px;
	}

	.log-tab {
		color: var(--color-primary);
		font-weight: 500;
		margin-right: 8px;
	}

	.empty {
		color: var(--color-muted-foreground);
		text-align: center;
		padding: 20px;
	}
</style>
