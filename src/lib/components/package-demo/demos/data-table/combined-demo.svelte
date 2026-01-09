<script lang="ts">
	/**
	 * Combined Demo
	 * Full-featured example with sorting, pagination, filtering, and custom rendering
	 */
	import {
		DataTable,
		type DataTableColumn,
		type SortState,
		type PaginationState
	} from '@shelchin/data-table';
	import { DemoSection, DemoContent, DemoButton } from '$lib/components/package-demo';
	import { Search, RotateCcw, CheckCircle, XCircle, Clock } from '@lucide/svelte';

	interface Props {
		t: (key: string) => string;
	}

	let { t }: Props = $props();

	interface Employee {
		id: number;
		name: string;
		email: string;
		department: string;
		status: 'active' | 'inactive' | 'pending';
		salary: number;
		joined: string;
	}

	// Generate sample data
	const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
	const statuses: Array<'active' | 'inactive' | 'pending'> = ['active', 'inactive', 'pending'];
	const firstNames = [
		'Alice',
		'Bob',
		'Charlie',
		'Diana',
		'Edward',
		'Fiona',
		'George',
		'Hannah',
		'Ivan',
		'Julia'
	];
	const lastNames = [
		'Johnson',
		'Smith',
		'Brown',
		'Wilson',
		'Chen',
		'Garcia',
		'Kim',
		'Lee',
		'Martinez',
		'Anderson'
	];

	const allEmployees: Employee[] = Array.from({ length: 150 }, (_, i) => {
		const firstName = firstNames[i % firstNames.length];
		const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
		return {
			id: i + 1,
			name: `${firstName} ${lastName}`,
			email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@company.com`,
			department: departments[i % departments.length],
			status: statuses[i % statuses.length],
			salary: 50000 + Math.floor(Math.random() * 80000),
			joined: new Date(
				2018 + Math.floor(Math.random() * 6),
				Math.floor(Math.random() * 12),
				1 + Math.floor(Math.random() * 28)
			)
				.toISOString()
				.split('T')[0]
		};
	});

	// State
	let searchQuery = $state('');
	let statusFilter = $state<'all' | 'active' | 'inactive'>('all');
	let sortState = $state<SortState>({ columnId: null, direction: null });
	let page = $state(1);
	let pageSize = $state(10);

	// Filtered and sorted data
	const filteredData = $derived.by(() => {
		let result = allEmployees;

		// Search filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			result = result.filter(
				(e) => e.name.toLowerCase().includes(query) || e.email.toLowerCase().includes(query)
			);
		}

		// Status filter
		if (statusFilter !== 'all') {
			result = result.filter((e) => e.status === statusFilter);
		}

		// Sorting
		if (sortState.columnId && sortState.direction) {
			const key = sortState.columnId as keyof Employee;
			result = [...result].sort((a, b) => {
				const aVal = a[key];
				const bVal = b[key];
				const modifier = sortState.direction === 'desc' ? -1 : 1;

				if (typeof aVal === 'number' && typeof bVal === 'number') {
					return (aVal - bVal) * modifier;
				}
				return String(aVal).localeCompare(String(bVal)) * modifier;
			});
		}

		return result;
	});

	// Paginated data
	const paginatedData = $derived(filteredData.slice((page - 1) * pageSize, page * pageSize));

	const pagination = $derived<PaginationState>({
		page,
		pageSize,
		totalItems: filteredData.length,
		totalPages: Math.ceil(filteredData.length / pageSize)
	});

	const columns: DataTableColumn<Employee>[] = [
		{
			id: 'id',
			header: t('columns.id'),
			width: '60px',
			align: 'center',
			sortable: true,
			accessor: (row) => row.id
		},
		{ id: 'name', header: t('columns.name'), sortable: true, accessor: (row) => row.name },
		{ id: 'email', header: t('columns.email'), accessor: (row) => row.email },
		{
			id: 'department',
			header: t('columns.department'),
			sortable: true,
			accessor: (row) => row.department
		},
		{ id: 'status', header: t('columns.status'), align: 'center' },
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
		page = 1;
	}

	function handlePageChange(newPage: number) {
		page = newPage;
	}

	function handlePageSizeChange(newSize: number) {
		pageSize = newSize;
		page = 1;
	}

	function resetFilters() {
		searchQuery = '';
		statusFilter = 'all';
		sortState = { columnId: null, direction: null };
		page = 1;
	}

	// Reset page when filters change
	$effect(() => {
		// Track reactive dependencies
		void searchQuery;
		void statusFilter;
		page = 1;
	});
</script>

<DemoSection title={t('demo.combined.title')} description={t('demo.combined.description')}>
	<DemoContent fullWidth>
		<!-- Filter Controls -->
		<div class="filter-bar">
			<div class="search-box">
				<Search size={18} />
				<input
					type="text"
					placeholder={t('demo.combined.search_placeholder')}
					bind:value={searchQuery}
				/>
			</div>

			<div class="filter-group">
				<label>{t('demo.combined.status_filter')}</label>
				<select bind:value={statusFilter}>
					<option value="all">{t('demo.combined.all')}</option>
					<option value="active">{t('demo.combined.active')}</option>
					<option value="inactive">{t('demo.combined.inactive')}</option>
				</select>
			</div>

			<DemoButton onclick={resetFilters} variant="outline">
				<RotateCcw size={16} />
				{t('demo.combined.reset_filters')}
			</DemoButton>
		</div>

		<!-- Stats -->
		<div class="filter-stats">
			<span>
				{t('demo.combined.showing')} <strong>{filteredData.length}</strong>
				{t('demo.combined.of')} <strong>{allEmployees.length}</strong>
				{#if filteredData.length !== allEmployees.length}
					({t('demo.combined.filtered')})
				{/if}
			</span>
		</div>

		<!-- Table -->
		<DataTable
			data={paginatedData}
			{columns}
			getRowKey={(row) => row.id}
			{sortState}
			onSortChange={handleSortChange}
			{pagination}
			onPageChange={handlePageChange}
			onPageSizeChange={handlePageSizeChange}
			pageSizeOptions={[10, 25, 50]}
			filteredCount={filteredData.length}
			emptyMessage={t('messages.no_results')}
		>
			{#snippet cellSnippet({ row, column, value })}
				{#if column.id === 'name'}
					<div class="name-cell">
						<span class="avatar"
							>{row.name
								.split(' ')
								.map((n) => n[0])
								.join('')}</span
						>
						<span class="name">{row.name}</span>
					</div>
				{:else if column.id === 'status'}
					<span class="status-badge status-{row.status}">
						{#if row.status === 'active'}
							<CheckCircle size={12} />
						{:else if row.status === 'inactive'}
							<XCircle size={12} />
						{:else}
							<Clock size={12} />
						{/if}
						{row.status}
					</span>
				{:else if column.id === 'department'}
					<span class="dept-badge">{row.department}</span>
				{:else}
					{value}
				{/if}
			{/snippet}
		</DataTable>
	</DemoContent>
</DemoSection>

<style>
	.filter-bar {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-4);
		margin-bottom: var(--space-4);
		align-items: flex-end;
	}

	.search-box {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		flex: 1;
		min-width: 200px;
		max-width: 400px;
		padding: var(--space-2) var(--space-3);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
	}

	.search-box :global(svg) {
		color: var(--color-muted-foreground);
		flex-shrink: 0;
	}

	.search-box input {
		flex: 1;
		border: none;
		background: transparent;
		outline: none;
		font-size: var(--text-sm);
		color: var(--color-foreground);
	}

	.search-box input::placeholder {
		color: var(--color-muted-foreground);
	}

	.filter-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.filter-group label {
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		font-weight: 500;
	}

	.filter-group select {
		padding: var(--space-2) var(--space-3);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-panel-0);
		font-size: var(--text-sm);
		color: var(--color-foreground);
		cursor: pointer;
		min-width: 120px;
	}

	.filter-stats {
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
		margin-bottom: var(--space-3);
	}

	.filter-stats strong {
		color: var(--color-foreground);
	}

	.name-cell {
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

	.name {
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

	.dept-badge {
		display: inline-block;
		padding: var(--space-1) var(--space-2);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-xs);
		font-weight: 500;
	}

	@media (max-width: 640px) {
		.filter-bar {
			flex-direction: column;
			align-items: stretch;
		}

		.search-box {
			max-width: none;
		}
	}
</style>
