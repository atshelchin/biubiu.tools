# @shelchin/data-table

A powerful, flexible data table component for Svelte 5 with sorting, pagination, and custom cell rendering.

## Features

- **Sorting** - Click column headers to sort (ascending/descending/none)
- **Pagination** - Full pagination controls with customizable page sizes
- **Custom Rendering** - Use Svelte 5 Snippets for custom cell/header content
- **TypeScript** - Full generic type support for type-safe data binding
- **Responsive** - Mobile-friendly with adaptive pagination controls
- **Theming** - CSS variables for easy customization
- **Server-side Ready** - Controlled component design supports server-side pagination/sorting

## Installation

```bash
npm install @shelchin/data-table
# or
bun add @shelchin/data-table
```

## Quick Start

```svelte
<script lang="ts">
	import { DataTable, type DataTableColumn } from '@shelchin/data-table';

	interface User {
		id: number;
		name: string;
		email: string;
		age: number;
	}

	const data: User[] = [
		{ id: 1, name: 'Alice', email: 'alice@example.com', age: 28 },
		{ id: 2, name: 'Bob', email: 'bob@example.com', age: 32 },
		{ id: 3, name: 'Charlie', email: 'charlie@example.com', age: 25 }
	];

	const columns: DataTableColumn<User>[] = [
		{ id: 'name', header: 'Name', sortable: true },
		{ id: 'email', header: 'Email', accessor: (row) => row.email },
		{ id: 'age', header: 'Age', sortable: true, align: 'right', accessor: (row) => row.age }
	];
</script>

<DataTable {data} {columns} getRowKey={(row) => row.id} />
```

## API Reference

### Props

| Prop                   | Type                           | Default                               | Description                             |
| ---------------------- | ------------------------------ | ------------------------------------- | --------------------------------------- |
| `data`                 | `T[]`                          | required                              | Array of data rows                      |
| `columns`              | `DataTableColumn<T>[]`         | required                              | Column definitions                      |
| `getRowKey`            | `(row: T) => string \| number` | required                              | Function to get unique key for each row |
| `sortState`            | `SortState`                    | `{ columnId: null, direction: null }` | Current sort state                      |
| `onSortChange`         | `(state: SortState) => void`   | -                                     | Callback when sort changes              |
| `pagination`           | `PaginationState`              | -                                     | Pagination state (enables pagination)   |
| `onPageChange`         | `(page: number) => void`       | -                                     | Callback when page changes              |
| `onPageSizeChange`     | `(size: number) => void`       | -                                     | Callback when page size changes         |
| `pageSizeOptions`      | `number[]`                     | `[25, 50, 100]`                       | Available page size options             |
| `onRowClick`           | `(row: T) => void`             | -                                     | Callback when row is clicked            |
| `getRowClass`          | `(row: T) => string`           | -                                     | Function to add custom class to rows    |
| `emptyMessage`         | `string`                       | `'No data'`                           | Message when data is empty              |
| `loading`              | `boolean`                      | `false`                               | Show loading state                      |
| `cellSnippet`          | `Snippet`                      | -                                     | Custom cell renderer                    |
| `headerSnippet`        | `Snippet`                      | -                                     | Custom header renderer                  |
| `showMobilePagination` | `boolean`                      | `true`                                | Show bottom pagination on mobile        |
| `resultsLabel`         | `string`                       | `'results'`                           | Label for results count                 |
| `filteredCount`        | `number`                       | -                                     | Filtered count (shows "X / Total")      |
| `class`                | `string`                       | -                                     | Additional CSS class                    |

### Column Definition

```typescript
interface DataTableColumn<T> {
	id: string; // Unique column identifier
	header: string; // Display header text
	sortable?: boolean; // Enable sorting (default: false)
	width?: string; // Column width (e.g., '100px', '20%')
	minWidth?: string; // Minimum width
	align?: 'left' | 'center' | 'right'; // Text alignment
	className?: string; // Custom CSS class
	accessor?: (row: T) => string | number | bigint | boolean | null | undefined;
	render?: (row: T) => string; // Custom render function
}
```

### Sort State

```typescript
interface SortState {
	columnId: string | null;
	direction: 'asc' | 'desc' | null;
}
```

### Pagination State

```typescript
interface PaginationState {
	page: number; // Current page (1-indexed)
	pageSize: number; // Items per page
	totalItems: number; // Total item count
	totalPages: number; // Total page count
}
```

## Usage Examples

### With Sorting

```svelte
<script lang="ts">
	import { DataTable, type SortState } from '@shelchin/data-table';

	let sortState = $state<SortState>({ columnId: null, direction: null });

	// Sort data based on state
	const sortedData = $derived.by(() => {
		if (!sortState.columnId) return data;

		return [...data].sort((a, b) => {
			const aVal = a[sortState.columnId as keyof typeof a];
			const bVal = b[sortState.columnId as keyof typeof b];
			const modifier = sortState.direction === 'desc' ? -1 : 1;
			return aVal > bVal ? modifier : -modifier;
		});
	});

	function handleSortChange(state: SortState) {
		sortState = state;
	}
</script>

<DataTable
	data={sortedData}
	{columns}
	getRowKey={(row) => row.id}
	{sortState}
	onSortChange={handleSortChange}
/>
```

### With Client-side Pagination

```svelte
<script lang="ts">
	let page = $state(1);
	let pageSize = $state(10);

	const paginatedData = $derived(data.slice((page - 1) * pageSize, page * pageSize));

	const pagination = $derived({
		page,
		pageSize,
		totalItems: data.length,
		totalPages: Math.ceil(data.length / pageSize)
	});
</script>

<DataTable
	data={paginatedData}
	{columns}
	getRowKey={(row) => row.id}
	{pagination}
	onPageChange={(p) => (page = p)}
	onPageSizeChange={(s) => {
		pageSize = s;
		page = 1;
	}}
/>
```

### With Server-side Pagination

```svelte
<script lang="ts">
	let data = $state<Item[]>([]);
	let loading = $state(false);
	let pagination = $state({
		page: 1,
		pageSize: 25,
		totalItems: 0,
		totalPages: 0
	});

	async function loadPage(page: number) {
		loading = true;
		const response = await fetch(`/api/items?page=${page}&size=${pagination.pageSize}`);
		const result = await response.json();

		data = result.items;
		pagination = {
			...pagination,
			page,
			totalItems: result.total,
			totalPages: Math.ceil(result.total / pagination.pageSize)
		};
		loading = false;
	}

	$effect(() => {
		loadPage(1);
	});
</script>

<DataTable
	{data}
	{columns}
	getRowKey={(row) => row.id}
	{pagination}
	{loading}
	onPageChange={loadPage}
/>
```

### Custom Cell Rendering with Snippets

```svelte
<script lang="ts">
	import { DataTable } from '@shelchin/data-table';
</script>

<DataTable {data} {columns} getRowKey={(row) => row.id}>
	{#snippet cellSnippet({ row, column, value })}
		{#if column.id === 'status'}
			<span class="badge" class:success={value === 'active'}>
				{value}
			</span>
		{:else if column.id === 'actions'}
			<button onclick={() => handleEdit(row)}>Edit</button>
		{:else}
			{value}
		{/if}
	{/snippet}
</DataTable>
```

### Row Click Handler

```svelte
<DataTable
	{data}
	{columns}
	getRowKey={(row) => row.id}
	onRowClick={(row) => {
		console.log('Clicked row:', row);
		// Navigate to detail page, open modal, etc.
	}}
/>
```

### Conditional Row Styling

```svelte
<DataTable
	{data}
	{columns}
	getRowKey={(row) => row.id}
	getRowClass={(row) => {
		if (row.status === 'error') return 'row-error';
		if (row.status === 'warning') return 'row-warning';
		return '';
	}}
/>

<style>
	:global(.row-error) {
		background: #fef2f2 !important;
	}
	:global(.row-warning) {
		background: #fffbeb !important;
	}
</style>
```

## Theming

The component uses CSS variables for styling. Override these in your CSS:

```css
:root {
	--color-panel-0: #ffffff;
	--color-panel-1: #f9fafb;
	--color-panel-2: #f3f4f6;
	--color-border: #e5e7eb;
	--color-primary: #3b82f6;
	--gray-300: #d1d5db;
	--gray-400: #9ca3af;
	--gray-500: #6b7280;
	--gray-600: #4b5563;
	--gray-700: #374151;
	--gray-800: #1f2937;
}
```

## License

MIT
