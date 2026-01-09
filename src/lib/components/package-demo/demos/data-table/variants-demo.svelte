<script lang="ts">
	/**
	 * Variants Demo
	 * Demonstrates different table style variants
	 */
	import { DataTable, type DataTableColumn, type DataTableVariant } from '@shelchin/data-table';
	import { DemoSection, DemoContent } from '$lib/components/package-demo';
	import { Palette } from '@lucide/svelte';

	interface Props {
		t: (key: string) => string;
	}

	let { t }: Props = $props();

	interface Product {
		id: number;
		name: string;
		category: string;
		price: number;
		stock: number;
	}

	const products: Product[] = [
		{ id: 1, name: 'Wireless Mouse', category: 'Electronics', price: 29.99, stock: 150 },
		{ id: 2, name: 'Mechanical Keyboard', category: 'Electronics', price: 89.99, stock: 75 },
		{ id: 3, name: 'USB-C Hub', category: 'Accessories', price: 45.99, stock: 200 },
		{ id: 4, name: 'Monitor Stand', category: 'Furniture', price: 59.99, stock: 50 },
		{ id: 5, name: 'Webcam HD', category: 'Electronics', price: 79.99, stock: 120 }
	];

	const columns: DataTableColumn<Product>[] = [
		{
			id: 'id',
			header: t('columns.id'),
			width: '60px',
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
			id: 'stock',
			header: t('columns.quantity'),
			align: 'right',
			accessor: (row) => row.stock
		}
	];

	const variants: { value: DataTableVariant; label: string; description: string }[] = [
		{ value: 'default', label: 'Default', description: t('demo.variants.default_desc') },
		{ value: 'striped', label: 'Striped', description: t('demo.variants.striped_desc') },
		{ value: 'bordered', label: 'Bordered', description: t('demo.variants.bordered_desc') },
		{ value: 'minimal', label: 'Minimal', description: t('demo.variants.minimal_desc') },
		{ value: 'modern', label: 'Modern', description: t('demo.variants.modern_desc') }
	];

	let selectedVariant = $state<DataTableVariant>('default');
</script>

<DemoSection title={t('demo.variants.title')} description={t('demo.variants.description')}>
	<DemoContent fullWidth>
		<div class="variant-selector">
			<div class="selector-header">
				<Palette size={18} />
				<span>{t('demo.variants.select_style')}</span>
			</div>
			<div class="variant-buttons">
				{#each variants as v (v.value)}
					<button
						class="variant-btn"
						class:active={selectedVariant === v.value}
						onclick={() => (selectedVariant = v.value)}
					>
						<span class="variant-name">{v.label}</span>
						<span class="variant-desc">{v.description}</span>
					</button>
				{/each}
			</div>
		</div>

		<div class="table-preview">
			<DataTable data={products} {columns} getRowKey={(row) => row.id} variant={selectedVariant} />
		</div>

		<div class="usage-hint">
			<code>&lt;DataTable variant="{selectedVariant}" ... /&gt;</code>
		</div>
	</DemoContent>
</DemoSection>

<style>
	.variant-selector {
		margin-bottom: var(--space-6);
	}

	.selector-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-3);
		font-weight: 600;
		color: var(--color-foreground);
	}

	.selector-header :global(svg) {
		color: var(--color-primary);
	}

	.variant-buttons {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: var(--space-3);
	}

	.variant-btn {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space-1);
		padding: var(--space-3) var(--space-4);
		background: var(--color-panel-0);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-lg);
		cursor: pointer;
		transition: all 0.2s ease;
		text-align: left;
	}

	.variant-btn:hover {
		border-color: var(--color-primary);
		background: color-mix(in srgb, var(--color-primary) 5%, transparent);
	}

	.variant-btn.active {
		border-color: var(--color-primary);
		background: color-mix(in srgb, var(--color-primary) 10%, transparent);
	}

	.variant-name {
		font-weight: 600;
		color: var(--color-foreground);
		font-size: var(--text-sm);
	}

	.variant-btn.active .variant-name {
		color: var(--color-primary);
	}

	.variant-desc {
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
	}

	.table-preview {
		margin-bottom: var(--space-4);
	}

	.usage-hint {
		padding: var(--space-3) var(--space-4);
		background: var(--color-panel-1);
		border-radius: var(--radius-md);
		text-align: center;
	}

	.usage-hint code {
		font-family: monospace;
		font-size: var(--text-sm);
		color: var(--color-primary);
	}

	@media (max-width: 640px) {
		.variant-buttons {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
