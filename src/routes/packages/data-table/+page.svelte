<script lang="ts">
	/**
	 * Data Table Demo Page
	 * A comprehensive demo showcasing all features of the @shelchin/data-table package
	 */
	import { useI18n } from '@shelchin/i18n';
	import { Table2, ArrowUpDown, Layers, Server, Palette, MousePointer2 } from '@lucide/svelte';
	import { PackageDemoLayout, DemoSection, CodeBlock } from '$lib/components/package-demo';

	// Demo components
	import BasicTableDemo from '$lib/components/package-demo/demos/data-table/basic-table-demo.svelte';
	import SortingDemo from '$lib/components/package-demo/demos/data-table/sorting-demo.svelte';
	import PaginationDemo from '$lib/components/package-demo/demos/data-table/pagination-demo.svelte';
	import ServerPaginationDemo from '$lib/components/package-demo/demos/data-table/server-pagination-demo.svelte';
	import CustomCellsDemo from '$lib/components/package-demo/demos/data-table/custom-cells-demo.svelte';
	import RowActionsDemo from '$lib/components/package-demo/demos/data-table/row-actions-demo.svelte';
	import CombinedDemo from '$lib/components/package-demo/demos/data-table/combined-demo.svelte';
	import VariantsDemo from '$lib/components/package-demo/demos/data-table/variants-demo.svelte';

	const i18n = useI18n();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const t = (key: string) => i18n.t(`routes/packages/data-table.${key}` as any);

	const features = [
		{ icon: ArrowUpDown, text: t('features.sorting') },
		{ icon: Layers, text: t('features.pagination') },
		{ icon: Palette, text: t('features.custom_render') },
		{ icon: Server, text: t('features.server_side') },
		{ icon: MousePointer2, text: t('features.responsive') },
		{ icon: Table2, text: t('features.typescript') }
	];

	const installationCode = `npm install @shelchin/data-table
# or
bun add @shelchin/data-table`;
</script>

<svelte:head>
	<title>{t('title')} | BiuBiu Tools</title>
	<meta name="description" content={t('description')} />
</svelte:head>

<PackageDemoLayout
	packageName="@shelchin/data-table"
	title={t('title')}
	subtitle={t('subtitle')}
	description={t('description')}
	{features}
	heroIcon={Table2}
>
	<!-- Demo 1: Basic Table -->
	<BasicTableDemo {t} />

	<!-- Demo 2: Sorting -->
	<SortingDemo {t} />

	<!-- Demo 3: Client-side Pagination -->
	<PaginationDemo {t} />

	<!-- Demo 4: Server-side Pagination -->
	<ServerPaginationDemo {t} />

	<!-- Demo 5: Custom Cell Rendering -->
	<CustomCellsDemo {t} />

	<!-- Demo 6: Row Actions & Styling -->
	<RowActionsDemo {t} />

	<!-- Demo 7: Combined Full-featured Example -->
	<CombinedDemo {t} />

	<!-- Demo 8: Style Variants -->
	<VariantsDemo {t} />

	<!-- Installation Section -->
	<DemoSection title={t('code.installation')}>
		<CodeBlock title="npm / bun" code={installationCode} language="bash" />
	</DemoSection>
</PackageDemoLayout>
