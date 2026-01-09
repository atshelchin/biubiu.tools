<script lang="ts">
	/**
	 * Server-side Pagination Demo
	 * Demonstrates loading data page-by-page from a simulated server
	 */
	import {
		DataTable,
		type DataTableColumn,
		type PaginationState,
		type SortState
	} from '@shelchin/data-table';
	import { DemoSection, DemoContent, CodeBlock, InputGroup } from '$lib/components/package-demo';
	import { Server, Clock } from '@lucide/svelte';
	import { untrack } from 'svelte';

	interface Props {
		t: (key: string) => string;
	}

	let { t }: Props = $props();

	interface Order {
		id: number;
		customer: string;
		product: string;
		total: number;
		date: string;
		status: string;
	}

	// Simulated server-side data store (in real app, this would be on a server)
	const TOTAL_RECORDS = 500;
	const allOrders: Order[] = Array.from({ length: TOTAL_RECORDS }, (_, i) => ({
		id: 1000 + i,
		customer: `Customer ${i + 1}`,
		product: `Product ${(i % 20) + 1}`,
		total: Math.floor(Math.random() * 1000) + 50,
		date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
			.toISOString()
			.split('T')[0],
		status: ['Pending', 'Shipped', 'Delivered', 'Cancelled'][i % 4]
	}));

	let data = $state<Order[]>([]);
	let loading = $state(false);
	let loadTime = $state(300);
	let pagination = $state<PaginationState>({
		page: 1,
		pageSize: 10,
		totalItems: 0,
		totalPages: 0
	});
	let sortState = $state<SortState>({ columnId: null, direction: null });

	// Simulate server request
	async function fetchFromServer(
		page: number,
		pageSize: number,
		sort?: SortState
	): Promise<{ items: Order[]; total: number }> {
		// Simulate network delay
		await new Promise((r) => setTimeout(r, loadTime));

		// Server-side sorting
		let sorted = [...allOrders];
		if (sort?.columnId && sort.direction) {
			sorted.sort((a, b) => {
				const key = sort.columnId as keyof Order;
				const aVal = a[key];
				const bVal = b[key];
				const modifier = sort.direction === 'desc' ? -1 : 1;

				if (typeof aVal === 'number' && typeof bVal === 'number') {
					return (aVal - bVal) * modifier;
				}
				return String(aVal).localeCompare(String(bVal)) * modifier;
			});
		}

		// Server-side pagination
		const start = (page - 1) * pageSize;
		const items = sorted.slice(start, start + pageSize);

		return {
			items,
			total: TOTAL_RECORDS
		};
	}

	async function loadPage(page: number) {
		loading = true;
		try {
			const response = await fetchFromServer(page, pagination.pageSize, sortState);
			data = response.items;
			pagination = {
				page,
				pageSize: pagination.pageSize,
				totalItems: response.total,
				totalPages: Math.ceil(response.total / pagination.pageSize)
			};
		} finally {
			loading = false;
		}
	}

	async function handlePageSizeChange(size: number) {
		pagination = { ...pagination, pageSize: size };
		await loadPage(1);
	}

	async function handleSortChange(state: SortState) {
		sortState = state;
		await loadPage(1);
	}

	// Initial load - only run once on mount
	$effect(() => {
		untrack(() => {
			loadPage(1);
		});
	});

	const columns: DataTableColumn<Order>[] = [
		{ id: 'id', header: t('columns.id'), width: '80px', sortable: true, accessor: (row) => row.id },
		{ id: 'customer', header: t('columns.name'), sortable: true, accessor: (row) => row.customer },
		{ id: 'product', header: t('columns.category'), accessor: (row) => row.product },
		{
			id: 'total',
			header: t('columns.total'),
			align: 'right',
			sortable: true,
			render: (row) => `$${row.total.toFixed(2)}`
		},
		{
			id: 'date',
			header: t('columns.date'),
			sortable: true,
			align: 'center',
			accessor: (row) => row.date
		},
		{ id: 'status', header: t('columns.status'), align: 'center', accessor: (row) => row.status }
	];

	const codeExample =
		`<script lang="ts">
  import { DataTable, type PaginationState, type SortState } from '@shelchin/data-table';

  let data = $state<Order[]>([]);
  let loading = $state(false);
  let pagination = $state<PaginationState>({
    page: 1, pageSize: 10, totalItems: 0, totalPages: 0
  });
  let sortState = $state<SortState>({ columnId: null, direction: null });

  // Fetch data from server
  async function loadPage(page: number) {
    loading = true;
    const params = new URLSearchParams({
      page: String(page),
      size: String(pagination.pageSize),
    });
    if (sortState.columnId) {
      params.set('sortBy', sortState.columnId);
      params.set('sortDir', sortState.direction!);
    }

    const response = await fetch(\`/api/orders?\${params}\`);
    const result = await response.json();

    data = result.items;  // Only current page data
    pagination = {
      ...pagination,
      page,
      totalItems: result.total,
      totalPages: Math.ceil(result.total / pagination.pageSize)
    };
    loading = false;
  }

  async function handleSortChange(state: SortState) {
    sortState = state;
    await loadPage(1);  // Reset to first page on sort change
  }

  $effect(() => { loadPage(1); });  // Initial load
<` +
		`/script>

<DataTable
  {data}
  {columns}
  getRowKey={(row) => row.id}
  {pagination}
  {loading}
  {sortState}
  onPageChange={loadPage}
  onPageSizeChange={(s) => { pagination.pageSize = s; loadPage(1); }}
  onSortChange={handleSortChange}
/>`;
</script>

<DemoSection title={t('demo.server.title')} description={t('demo.server.description')}>
	<DemoContent fullWidth>
		<div class="server-info">
			<div class="info-card">
				<Server size={18} />
				<div>
					<span class="label">{t('demo.server.total_records')}</span>
					<span class="value">{TOTAL_RECORDS.toLocaleString()}</span>
				</div>
			</div>

			<div class="info-card">
				<Clock size={18} />
				<div>
					<InputGroup label={t('demo.server.load_time')} id="server-load-time">
						<input
							type="range"
							min="100"
							max="1000"
							step="100"
							bind:value={loadTime}
							class="slider"
							id="server-load-time"
						/>
						<span class="slider-value">{loadTime}ms</span>
					</InputGroup>
				</div>
			</div>

			<div class="info-card">
				<span class="label">{t('demo.server.current_page_data')}</span>
				<span class="value">{data.length} items</span>
			</div>
		</div>

		{#if loading}
			<div class="loading-overlay">
				<div class="loading-spinner"></div>
				<span>{t('demo.server.simulating')}</span>
			</div>
		{/if}

		<DataTable
			{data}
			{columns}
			getRowKey={(row) => row.id}
			{pagination}
			{loading}
			{sortState}
			onPageChange={loadPage}
			onPageSizeChange={handlePageSizeChange}
			onSortChange={handleSortChange}
			pageSizeOptions={[10, 25, 50]}
		/>
	</DemoContent>

	<CodeBlock title={t('code.server_side')} code={codeExample} language="svelte" />
</DemoSection>

<style>
	.server-info {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-4);
		margin-bottom: var(--space-4);
	}

	.info-card {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		font-size: var(--text-sm);
	}

	.info-card :global(svg) {
		color: var(--color-primary);
	}

	.info-card .label {
		display: block;
		color: var(--color-muted-foreground);
		font-size: var(--text-xs);
	}

	.info-card .value {
		font-weight: 600;
		color: var(--color-foreground);
	}

	.slider {
		width: 100px;
		accent-color: var(--color-primary);
	}

	.slider-value {
		font-weight: 600;
		color: var(--color-primary);
		min-width: 50px;
	}

	.loading-overlay {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-3);
		padding: var(--space-4);
		background: color-mix(in srgb, var(--color-primary) 10%, transparent);
		border-radius: var(--radius-lg);
		margin-bottom: var(--space-4);
		color: var(--color-primary);
		font-weight: 500;
	}

	.loading-spinner {
		width: 20px;
		height: 20px;
		border: 2px solid var(--color-primary);
		border-top-color: transparent;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
