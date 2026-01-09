<script lang="ts">
	/**
	 * Row Actions Demo
	 * Demonstrates row click handlers and conditional styling
	 */
	import { DataTable, type DataTableColumn } from '@shelchin/data-table';
	import { DemoSection, DemoContent, CodeBlock } from '$lib/components/package-demo';
	import { AlertTriangle, AlertCircle, Info, MousePointer2 } from '@lucide/svelte';

	interface Props {
		t: (key: string) => string;
	}

	let { t }: Props = $props();

	interface Task {
		id: number;
		title: string;
		priority: 'high' | 'medium' | 'low';
		assignee: string;
		dueDate: string;
	}

	const tasks: Task[] = [
		{
			id: 1,
			title: 'Fix critical bug in payment',
			priority: 'high',
			assignee: 'Alice',
			dueDate: '2024-01-15'
		},
		{
			id: 2,
			title: 'Update documentation',
			priority: 'low',
			assignee: 'Bob',
			dueDate: '2024-01-25'
		},
		{
			id: 3,
			title: 'Review pull requests',
			priority: 'medium',
			assignee: 'Charlie',
			dueDate: '2024-01-18'
		},
		{
			id: 4,
			title: 'Deploy to production',
			priority: 'high',
			assignee: 'Diana',
			dueDate: '2024-01-16'
		},
		{
			id: 5,
			title: 'Write unit tests',
			priority: 'medium',
			assignee: 'Edward',
			dueDate: '2024-01-20'
		},
		{
			id: 6,
			title: 'Clean up old branches',
			priority: 'low',
			assignee: 'Fiona',
			dueDate: '2024-01-30'
		}
	];

	let clickLog = $state<Array<{ time: string; task: Task }>>([]);

	const columns: DataTableColumn<Task>[] = [
		{
			id: 'id',
			header: t('columns.id'),
			width: '60px',
			align: 'center',
			accessor: (row) => row.id
		},
		{ id: 'title', header: t('columns.name'), accessor: (row) => row.title },
		{ id: 'priority', header: t('columns.priority'), align: 'center' },
		{ id: 'assignee', header: t('columns.name'), accessor: (row) => row.assignee },
		{ id: 'dueDate', header: t('columns.date'), align: 'center', accessor: (row) => row.dueDate }
	];

	function handleRowClick(task: Task) {
		clickLog = [{ time: new Date().toLocaleTimeString(), task }, ...clickLog.slice(0, 4)];
	}

	function getRowClass(task: Task): string {
		return `priority-row priority-${task.priority}`;
	}

	const codeExample =
		`<script lang="ts">
  import { DataTable } from '@shelchin/data-table';

  let clickLog = $state<Array<{ time: string; task: Task }>>([]);

  function handleRowClick(task: Task) {
    clickLog = [{ time: new Date().toLocaleTimeString(), task }, ...clickLog];
  }

  function getRowClass(task: Task): string {
    return \`priority-row priority-\${task.priority}\`;
  }
<` +
		`/script>

<DataTable
  {data}
  {columns}
  getRowKey={(row) => row.id}
  onRowClick={handleRowClick}
  getRowClass={getRowClass}
/>

<style>
  :global(.priority-high) { background: #fef2f2 !important; }
  :global(.priority-medium) { background: #fffbeb !important; }
  :global(.priority-low) { background: #f0fdf4 !important; }
</style>`;
</script>

<DemoSection title={t('demo.row_actions.title')} description={t('demo.row_actions.description')}>
	<DemoContent fullWidth>
		<div class="priority-legend">
			<div class="legend-item high">
				<AlertTriangle size={14} />
				{t('demo.row_actions.priority_high')}
			</div>
			<div class="legend-item medium">
				<AlertCircle size={14} />
				{t('demo.row_actions.priority_medium')}
			</div>
			<div class="legend-item low">
				<Info size={14} />
				{t('demo.row_actions.priority_low')}
			</div>
		</div>

		<div class="demo-grid">
			<div class="table-container">
				<DataTable
					data={tasks}
					{columns}
					getRowKey={(row) => row.id}
					onRowClick={handleRowClick}
					{getRowClass}
				>
					{#snippet cellSnippet({ row, column, value })}
						{#if column.id === 'priority'}
							<span class="priority-badge priority-{row.priority}">
								{#if row.priority === 'high'}
									<AlertTriangle size={12} />
								{:else if row.priority === 'medium'}
									<AlertCircle size={12} />
								{:else}
									<Info size={12} />
								{/if}
								{row.priority}
							</span>
						{:else}
							{value}
						{/if}
					{/snippet}
				</DataTable>
			</div>

			<div class="click-log">
				<h4>
					<MousePointer2 size={16} />
					{t('demo.row_actions.click_log')}
				</h4>
				{#if clickLog.length === 0}
					<p class="no-clicks">{t('demo.row_actions.no_clicks')}</p>
				{:else}
					<ul>
						{#each clickLog as log (log.time + log.task.id)}
							<li class="log-item">
								<span class="log-time">{log.time}</span>
								<span class="log-task">{log.task.title}</span>
								<span class="log-priority priority-{log.task.priority}">{log.task.priority}</span>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		</div>
	</DemoContent>

	<CodeBlock title="Row Click & Styling" code={codeExample} language="svelte" />
</DemoSection>

<style>
	.priority-legend {
		display: flex;
		gap: var(--space-4);
		margin-bottom: var(--space-4);
		flex-wrap: wrap;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: 500;
	}

	.legend-item.high {
		background: #fef2f2;
		color: #dc2626;
	}

	.legend-item.medium {
		background: #fffbeb;
		color: #d97706;
	}

	.legend-item.low {
		background: #f0fdf4;
		color: #16a34a;
	}

	.demo-grid {
		display: grid;
		grid-template-columns: 1fr 300px;
		gap: var(--space-4);
	}

	@media (max-width: 900px) {
		.demo-grid {
			grid-template-columns: 1fr;
		}
	}

	.table-container {
		min-width: 0;
	}

	:global(.priority-row) {
		transition: background 0.2s ease;
	}

	:global(.priority-high) {
		background: #fef2f2 !important;
	}

	:global(.priority-high:hover) {
		background: #fee2e2 !important;
	}

	:global(.priority-medium) {
		background: #fffbeb !important;
	}

	:global(.priority-medium:hover) {
		background: #fef3c7 !important;
	}

	:global(.priority-low) {
		background: #f0fdf4 !important;
	}

	:global(.priority-low:hover) {
		background: #dcfce7 !important;
	}

	.priority-badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-full);
		font-size: var(--text-xs);
		font-weight: 500;
		text-transform: capitalize;
	}

	.priority-badge.priority-high {
		background: #fee2e2;
		color: #dc2626;
	}

	.priority-badge.priority-medium {
		background: #fef3c7;
		color: #d97706;
	}

	.priority-badge.priority-low {
		background: #dcfce7;
		color: #16a34a;
	}

	.click-log {
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: var(--space-4);
	}

	.click-log h4 {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-3);
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-foreground);
	}

	.no-clicks {
		color: var(--color-muted-foreground);
		font-size: var(--text-sm);
		text-align: center;
		padding: var(--space-4);
	}

	.click-log ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.log-item {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		padding: var(--space-2);
		border-bottom: 1px solid var(--color-border);
		font-size: var(--text-sm);
	}

	.log-item:last-child {
		border-bottom: none;
	}

	.log-time {
		color: var(--color-muted-foreground);
		font-family: monospace;
		font-size: var(--text-xs);
	}

	.log-task {
		flex: 1;
		color: var(--color-foreground);
		font-weight: 500;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.log-priority {
		padding: 0 var(--space-2);
		border-radius: var(--radius-full);
		font-size: var(--text-xs);
		font-weight: 500;
		text-transform: capitalize;
	}

	.log-priority.priority-high {
		background: #fee2e2;
		color: #dc2626;
	}

	.log-priority.priority-medium {
		background: #fef3c7;
		color: #d97706;
	}

	.log-priority.priority-low {
		background: #dcfce7;
		color: #16a34a;
	}
</style>
