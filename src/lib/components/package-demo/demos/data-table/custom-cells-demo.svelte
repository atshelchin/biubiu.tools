<script lang="ts">
	/**
	 * Custom Cell Rendering Demo
	 * Demonstrates using Snippets for custom cell content
	 */
	import { DataTable, type DataTableColumn } from '@shelchin/data-table';
	import { DemoSection, DemoContent, CodeBlock } from '$lib/components/package-demo';
	import { Eye, Pencil, CheckCircle, XCircle, Clock } from '@lucide/svelte';

	interface Props {
		t: (key: string) => string;
	}

	let { t }: Props = $props();

	interface User {
		id: number;
		name: string;
		email: string;
		role: string;
		status: 'active' | 'inactive' | 'pending';
		avatar: string;
	}

	const users: User[] = [
		{
			id: 1,
			name: 'Alice Johnson',
			email: 'alice@example.com',
			role: 'Admin',
			status: 'active',
			avatar: 'AJ'
		},
		{
			id: 2,
			name: 'Bob Smith',
			email: 'bob@example.com',
			role: 'Editor',
			status: 'active',
			avatar: 'BS'
		},
		{
			id: 3,
			name: 'Charlie Brown',
			email: 'charlie@example.com',
			role: 'Viewer',
			status: 'pending',
			avatar: 'CB'
		},
		{
			id: 4,
			name: 'Diana Ross',
			email: 'diana@example.com',
			role: 'Editor',
			status: 'inactive',
			avatar: 'DR'
		},
		{
			id: 5,
			name: 'Edward Chen',
			email: 'edward@example.com',
			role: 'Admin',
			status: 'active',
			avatar: 'EC'
		}
	];

	const columns: DataTableColumn<User>[] = [
		{ id: 'name', header: t('columns.name') },
		{ id: 'email', header: t('columns.email'), accessor: (row) => row.email },
		{ id: 'role', header: t('columns.role') },
		{ id: 'status', header: t('columns.status'), align: 'center' },
		{ id: 'actions', header: t('columns.actions'), align: 'center', width: '120px' }
	];

	function handleView(user: User) {
		alert(`View user: ${user.name}`);
	}

	function handleEdit(user: User) {
		alert(`Edit user: ${user.name}`);
	}

	const codeExample =
		`<script lang="ts">
  import { DataTable } from '@shelchin/data-table';
  import { Eye, Pencil, CheckCircle, XCircle, Clock } from '@lucide/svelte';
<` +
		`/script>

<DataTable {data} {columns} getRowKey={(row) => row.id}>
  {#snippet cellSnippet({ row, column, value })}
    {#if column.id === 'name'}
      <div class="user-cell">
        <span class="avatar">{row.avatar}</span>
        <span>{row.name}</span>
      </div>
    {:else if column.id === 'status'}
      <span class="status-badge status-{row.status}">
        {#if row.status === 'active'}
          <CheckCircle size={14} />
        {:else if row.status === 'inactive'}
          <XCircle size={14} />
        {:else}
          <Clock size={14} />
        {/if}
        {row.status}
      </span>
    {:else if column.id === 'role'}
      <span class="role-badge">{row.role}</span>
    {:else if column.id === 'actions'}
      <div class="action-buttons">
        <button onclick={() => handleView(row)}><Eye size={16} /></button>
        <button onclick={() => handleEdit(row)}><Pencil size={16} /></button>
      </div>
    {:else}
      {value}
    {/if}
  {/snippet}
</DataTable>`;
</script>

<DemoSection title={t('demo.custom_cells.title')} description={t('demo.custom_cells.description')}>
	<DemoContent fullWidth>
		<DataTable data={users} {columns} getRowKey={(row) => row.id}>
			{#snippet cellSnippet({ row, column, value })}
				{#if column.id === 'name'}
					<div class="user-cell">
						<span class="avatar">{row.avatar}</span>
						<span class="user-name">{row.name}</span>
					</div>
				{:else if column.id === 'status'}
					<span class="status-badge status-{row.status}">
						{#if row.status === 'active'}
							<CheckCircle size={14} />
							{t('demo.custom_cells.status_active')}
						{:else if row.status === 'inactive'}
							<XCircle size={14} />
							{t('demo.custom_cells.status_inactive')}
						{:else}
							<Clock size={14} />
							{t('demo.custom_cells.status_pending')}
						{/if}
					</span>
				{:else if column.id === 'role'}
					<span class="role-badge">{row.role}</span>
				{:else if column.id === 'actions'}
					<div class="action-buttons">
						<button
							class="action-btn"
							onclick={() => handleView(row)}
							title={t('demo.custom_cells.view')}
						>
							<Eye size={16} />
						</button>
						<button
							class="action-btn"
							onclick={() => handleEdit(row)}
							title={t('demo.custom_cells.edit')}
						>
							<Pencil size={16} />
						</button>
					</div>
				{:else}
					{value}
				{/if}
			{/snippet}
		</DataTable>
	</DemoContent>

	<CodeBlock title={t('code.custom_cells')} code={codeExample} language="svelte" />
</DemoSection>

<style>
	.user-cell {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.avatar {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: linear-gradient(135deg, var(--color-primary), var(--color-accent, #10b981));
		color: white;
		font-size: var(--text-xs);
		font-weight: 600;
	}

	.user-name {
		font-weight: 500;
	}

	.status-badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-full);
		font-size: var(--text-xs);
		font-weight: 500;
		text-transform: capitalize;
	}

	.status-active {
		background: color-mix(in srgb, #10b981 15%, transparent);
		color: #059669;
	}

	.status-inactive {
		background: color-mix(in srgb, #ef4444 15%, transparent);
		color: #dc2626;
	}

	.status-pending {
		background: color-mix(in srgb, #f59e0b 15%, transparent);
		color: #d97706;
	}

	.role-badge {
		display: inline-block;
		padding: var(--space-1) var(--space-2);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-xs);
		font-weight: 500;
	}

	.action-buttons {
		display: flex;
		justify-content: center;
		gap: var(--space-2);
	}

	.action-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-2);
		min-width: 32px;
		min-height: 32px;
		border: 1px solid var(--color-panel-border-3, var(--color-border));
		border-radius: var(--radius-md);
		background: var(--color-panel-2, var(--color-panel-0));
		color: var(--color-foreground);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.action-btn :global(svg) {
		flex-shrink: 0;
		width: 16px;
		height: 16px;
		stroke: currentColor;
	}

	.action-btn:hover {
		border-color: var(--color-primary);
		color: var(--color-primary);
		background: color-mix(in srgb, var(--color-primary) 15%, var(--color-panel-2, transparent));
	}
</style>
