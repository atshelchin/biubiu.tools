<script lang="ts">
	/**
	 * Basic Table Demo
	 * Shows the simplest usage of DataTable component
	 */
	import { DataTable, type DataTableColumn } from '@shelchin/data-table';
	import { DemoSection, DemoContent, CodeBlock } from '$lib/components/package-demo';

	interface Props {
		t: (key: string) => string;
	}

	let { t }: Props = $props();

	// Sample user data
	interface User {
		id: number;
		name: string;
		email: string;
		age: number;
	}

	const users: User[] = [
		{ id: 1, name: 'Alice Johnson', email: 'alice@example.com', age: 28 },
		{ id: 2, name: 'Bob Smith', email: 'bob@example.com', age: 34 },
		{ id: 3, name: 'Charlie Brown', email: 'charlie@example.com', age: 25 },
		{ id: 4, name: 'Diana Ross', email: 'diana@example.com', age: 31 },
		{ id: 5, name: 'Edward Chen', email: 'edward@example.com', age: 29 }
	];

	const columns: DataTableColumn<User>[] = [
		{ id: 'id', header: t('columns.id'), width: '60px', align: 'center' },
		{ id: 'name', header: t('columns.name'), accessor: (row) => row.name },
		{ id: 'email', header: t('columns.email'), accessor: (row) => row.email },
		{
			id: 'age',
			header: t('columns.age'),
			align: 'right',
			width: '80px',
			accessor: (row) => row.age
		}
	];

	const codeExample =
		`<script lang="ts">
  import { DataTable, type DataTableColumn } from '@shelchin/data-table';

  interface User {
    id: number;
    name: string;
    email: string;
    age: number;
  }

  const users: User[] = [
    { id: 1, name: 'Alice', email: 'alice@example.com', age: 28 },
    { id: 2, name: 'Bob', email: 'bob@example.com', age: 34 },
  ];

  const columns: DataTableColumn<User>[] = [
    { id: 'id', header: 'ID', width: '60px', align: 'center' },
    { id: 'name', header: 'Name', accessor: (row) => row.name },
    { id: 'email', header: 'Email', accessor: (row) => row.email },
    { id: 'age', header: 'Age', align: 'right', accessor: (row) => row.age },
  ];
<` +
		`/script>

<DataTable data={users} {columns} getRowKey={(row) => row.id} />`;
</script>

<DemoSection title={t('demo.basic.title')} description={t('demo.basic.description')}>
	<DemoContent fullWidth>
		<DataTable data={users} {columns} getRowKey={(row) => row.id} />
	</DemoContent>

	<CodeBlock title={t('code.basic_usage')} code={codeExample} language="svelte" />
</DemoSection>
