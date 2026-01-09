<script lang="ts">
	/**
	 * Client-side Pagination Demo
	 * Demonstrates pagination with customizable page sizes
	 */
	import { DataTable, type DataTableColumn, type PaginationState } from '@shelchin/data-table';
	import {
		DemoSection,
		DemoContent,
		CodeBlock,
		DemoButton,
		InputGroup
	} from '$lib/components/package-demo';
	import { RefreshCw } from '@lucide/svelte';

	interface Props {
		t: (key: string) => string;
	}

	let { t }: Props = $props();

	interface Product {
		id: number;
		name: string;
		category: string;
		price: number;
		quantity: number;
	}

	// Generate sample data
	const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Food'];
	const adjectives = ['Premium', 'Basic', 'Pro', 'Ultra', 'Mini', 'Max', 'Deluxe', 'Standard'];
	const nouns = ['Widget', 'Gadget', 'Tool', 'Device', 'Item', 'Product', 'Kit', 'Set'];

	function generateProducts(count: number): Product[] {
		return Array.from({ length: count }, (_, i) => ({
			id: i + 1,
			name: `${adjectives[i % adjectives.length]} ${nouns[i % nouns.length]} ${i + 1}`,
			category: categories[i % categories.length],
			price: Math.floor(Math.random() * 500) + 10,
			quantity: Math.floor(Math.random() * 100) + 1
		}));
	}

	let itemCount = $state(100);
	let products = $state<Product[]>(generateProducts(100));
	let page = $state(1);
	let pageSize = $state(10);

	function regenerateData() {
		products = generateProducts(itemCount);
		page = 1;
	}

	const paginatedData = $derived(products.slice((page - 1) * pageSize, page * pageSize));

	const pagination = $derived<PaginationState>({
		page,
		pageSize,
		totalItems: products.length,
		totalPages: Math.ceil(products.length / pageSize)
	});

	const columns: DataTableColumn<Product>[] = [
		{
			id: 'id',
			header: t('columns.id'),
			width: '70px',
			align: 'center',
			accessor: (row) => row.id
		},
		{ id: 'name', header: t('columns.name'), accessor: (row) => row.name },
		{ id: 'category', header: t('columns.category'), accessor: (row) => row.category },
		{
			id: 'price',
			header: t('columns.price'),
			align: 'right',
			render: (row) => `$${row.price.toFixed(2)}`
		},
		{
			id: 'quantity',
			header: t('columns.quantity'),
			align: 'right',
			accessor: (row) => row.quantity
		}
	];

	function handlePageChange(newPage: number) {
		page = newPage;
	}

	function handlePageSizeChange(newSize: number) {
		pageSize = newSize;
		page = 1;
	}

	const codeExample =
		`<script lang="ts">
  import { DataTable, type PaginationState } from '@shelchin/data-table';

  let page = $state(1);
  let pageSize = $state(10);

  // Client-side pagination
  const paginatedData = $derived(
    allData.slice((page - 1) * pageSize, page * pageSize)
  );

  const pagination = $derived<PaginationState>({
    page,
    pageSize,
    totalItems: allData.length,
    totalPages: Math.ceil(allData.length / pageSize)
  });
<` +
		`/script>

<DataTable
  data={paginatedData}
  {columns}
  getRowKey={(row) => row.id}
  {pagination}
  onPageChange={(p) => page = p}
  onPageSizeChange={(s) => { pageSize = s; page = 1; }}
  pageSizeOptions={[10, 25, 50, 100]}
/>`;
</script>

<DemoSection title={t('demo.pagination.title')} description={t('demo.pagination.description')}>
	<DemoContent fullWidth>
		<div class="controls">
			<InputGroup label={t('demo.pagination.items_count')}>
				<input type="number" min="10" max="1000" bind:value={itemCount} class="number-input" />
			</InputGroup>

			<DemoButton onclick={regenerateData} variant="secondary">
				<RefreshCw size={16} />
				{t('demo.pagination.generate_data')}
			</DemoButton>
		</div>

		<DataTable
			data={paginatedData}
			{columns}
			getRowKey={(row) => row.id}
			{pagination}
			onPageChange={handlePageChange}
			onPageSizeChange={handlePageSizeChange}
			pageSizeOptions={[10, 25, 50, 100]}
		/>
	</DemoContent>

	<CodeBlock title={t('code.with_pagination')} code={codeExample} language="svelte" />
</DemoSection>

<style>
	.controls {
		display: flex;
		align-items: flex-end;
		gap: var(--space-4);
		margin-bottom: var(--space-4);
		flex-wrap: wrap;
	}

	.number-input {
		width: 120px;
		padding: var(--space-2) var(--space-3);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		background: var(--color-panel-0);
		color: var(--color-foreground);
	}

	.number-input:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 20%, transparent);
	}
</style>
