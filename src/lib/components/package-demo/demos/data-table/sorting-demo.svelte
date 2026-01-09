<script lang="ts">
	/**
	 * Sorting Demo
	 * Demonstrates sortable columns with visual feedback
	 */
	import { DataTable, type DataTableColumn, type SortState } from '@shelchin/data-table';
	import { DemoSection, DemoContent, CodeBlock } from '$lib/components/package-demo';
	import { ArrowUpDown, ArrowUp, ArrowDown } from '@lucide/svelte';

	interface Props {
		t: (key: string) => string;
	}

	let { t }: Props = $props();

	interface Employee {
		id: number;
		name: string;
		department: string;
		salary: number;
		joined: string;
	}

	const employees: Employee[] = [
		{
			id: 1,
			name: 'Alice Johnson',
			department: 'Engineering',
			salary: 95000,
			joined: '2021-03-15'
		},
		{ id: 2, name: 'Bob Smith', department: 'Marketing', salary: 72000, joined: '2020-07-22' },
		{
			id: 3,
			name: 'Charlie Brown',
			department: 'Engineering',
			salary: 88000,
			joined: '2022-01-10'
		},
		{ id: 4, name: 'Diana Ross', department: 'Sales', salary: 68000, joined: '2019-11-05' },
		{ id: 5, name: 'Edward Chen', department: 'Engineering', salary: 105000, joined: '2018-06-20' },
		{ id: 6, name: 'Fiona Green', department: 'HR', salary: 62000, joined: '2021-09-01' },
		{ id: 7, name: 'George Wang', department: 'Sales', salary: 78000, joined: '2020-02-14' },
		{ id: 8, name: 'Hannah Lee', department: 'Marketing', salary: 85000, joined: '2019-04-30' }
	];

	let sortState = $state<SortState>({ columnId: null, direction: null });

	const sortedData = $derived.by(() => {
		if (!sortState.columnId || !sortState.direction) return employees;

		return [...employees].sort((a, b) => {
			const key = sortState.columnId as keyof Employee;
			const aVal = a[key];
			const bVal = b[key];
			const modifier = sortState.direction === 'desc' ? -1 : 1;

			if (typeof aVal === 'number' && typeof bVal === 'number') {
				return (aVal - bVal) * modifier;
			}
			return String(aVal).localeCompare(String(bVal)) * modifier;
		});
	});

	const columns: DataTableColumn<Employee>[] = [
		{ id: 'name', header: t('columns.name'), sortable: true, accessor: (row) => row.name },
		{
			id: 'department',
			header: t('columns.department'),
			sortable: true,
			accessor: (row) => row.department
		},
		{
			id: 'salary',
			header: t('columns.salary'),
			sortable: true,
			align: 'right',
			render: (row) => `$${row.salary.toLocaleString()}`
		},
		{
			id: 'joined',
			header: t('columns.joined'),
			sortable: true,
			align: 'center',
			accessor: (row) => row.joined
		}
	];

	function handleSortChange(state: SortState) {
		sortState = state;
	}

	const codeExample =
		`<script lang="ts">
  import { DataTable, type SortState } from '@shelchin/data-table';

  let sortState = $state<SortState>({ columnId: null, direction: null });

  // Client-side sorting
  const sortedData = $derived.by(() => {
    if (!sortState.columnId) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortState.columnId];
      const bVal = b[sortState.columnId];
      const modifier = sortState.direction === 'desc' ? -1 : 1;
      return aVal > bVal ? modifier : -modifier;
    });
  });

  const columns = [
    { id: 'name', header: 'Name', sortable: true },
    { id: 'salary', header: 'Salary', sortable: true, align: 'right' },
  ];
<` +
		`/script>

<DataTable
  data={sortedData}
  {columns}
  getRowKey={(row) => row.id}
  {sortState}
  onSortChange={(state) => sortState = state}
/>`;
</script>

<DemoSection title={t('demo.sorting.title')} description={t('demo.sorting.description')}>
	<DemoContent fullWidth>
		<div class="sort-status">
			<span class="sort-label">{t('demo.sorting.current_sort')}:</span>
			{#if sortState.columnId}
				<span class="sort-badge">
					{sortState.columnId}
					{#if sortState.direction === 'asc'}
						<ArrowUp size={14} />
						<span>({t('demo.sorting.ascending')})</span>
					{:else}
						<ArrowDown size={14} />
						<span>({t('demo.sorting.descending')})</span>
					{/if}
				</span>
			{:else}
				<span class="sort-none">
					<ArrowUpDown size={14} />
					{t('demo.sorting.none')}
				</span>
			{/if}
		</div>

		<DataTable
			data={sortedData}
			{columns}
			getRowKey={(row) => row.id}
			{sortState}
			onSortChange={handleSortChange}
		/>
	</DemoContent>

	<CodeBlock title={t('code.with_sorting')} code={codeExample} language="svelte" />
</DemoSection>

<style>
	.sort-status {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		background: var(--color-panel-1);
		border-radius: var(--radius-lg);
		margin-bottom: var(--space-4);
		font-size: var(--text-sm);
	}

	.sort-label {
		color: var(--color-muted-foreground);
		font-weight: 500;
	}

	.sort-badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-1) var(--space-2);
		background: var(--color-primary);
		color: white;
		border-radius: var(--radius-md);
		font-weight: 500;
	}

	.sort-none {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		color: var(--color-muted-foreground);
	}
</style>
