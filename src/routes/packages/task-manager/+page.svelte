<script lang="ts">
	/**
	 * Task Manager Demo Page
	 * A comprehensive demo showcasing all features of the @shelchin/task-manager package
	 */
	import { useI18n } from '@shelchin/i18n';
	import { TreeDeciduous, Zap, Database, Shield, RefreshCw, Radio } from '@lucide/svelte';
	import { PackageDemoLayout, DemoSection, CodeBlock } from '$lib/components/package-demo';

	// Demo components
	import BasicUsageDemo from '$lib/components/package-demo/demos/task-manager/basic-usage-demo.svelte';
	import LifecycleDemo from '$lib/components/package-demo/demos/task-manager/lifecycle-demo.svelte';
	import BatchDemo from '$lib/components/package-demo/demos/task-manager/batch-demo.svelte';
	import MerkleDemo from '$lib/components/package-demo/demos/task-manager/merkle-demo.svelte';
	import StoreDemo from '$lib/components/package-demo/demos/task-manager/store-demo.svelte';
	import EventsDemo from '$lib/components/package-demo/demos/task-manager/events-demo.svelte';
	import RetryDemo from '$lib/components/package-demo/demos/task-manager/retry-demo.svelte';
	import ExecutorRegistryDemo from '$lib/components/package-demo/demos/task-manager/executor-registry-demo.svelte';
	import TreeHierarchyDemo from '$lib/components/package-demo/demos/task-manager/tree-hierarchy-demo.svelte';
	import PerformanceBenchmarkDemo from '$lib/components/package-demo/demos/task-manager/performance-benchmark-demo.svelte';

	const i18n = useI18n();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const t = (key: string) => i18n.t(`routes/packages/task-manager.${key}` as any);

	const features = [
		{ icon: TreeDeciduous, text: t('features.tree_structure') },
		{ icon: Zap, text: t('features.pause_resume') },
		{ icon: Database, text: t('features.persistence') },
		{ icon: Shield, text: t('features.merkle_tree') },
		{ icon: RefreshCw, text: t('features.retry_logic') },
		{ icon: Radio, text: t('features.event_driven') }
	];

	const installationCode = `npm install @shelchin/task-manager
# or
bun add @shelchin/task-manager`;
</script>

<svelte:head>
	<title>{t('title')} | BiuBiu Tools</title>
	<meta name="description" content={t('description')} />
</svelte:head>

<PackageDemoLayout
	packageName="@shelchin/task-manager"
	title={t('title')}
	subtitle={t('subtitle')}
	description={t('description')}
	{features}
	heroIcon={TreeDeciduous}
>
	<!-- Demo 1: Basic Usage -->
	<BasicUsageDemo {t} />

	<!-- Demo 2: Task Lifecycle -->
	<LifecycleDemo {t} />

	<!-- Demo 3: Batch Processing -->
	<BatchDemo {t} />

	<!-- Demo 4: Merkle Verification -->
	<MerkleDemo {t} />

	<!-- Demo 5: Store Dashboard -->
	<StoreDemo {t} />

	<!-- Demo 6: Event System -->
	<EventsDemo {t} />

	<!-- Demo 7: Automatic Retry -->
	<RetryDemo {t} />

	<!-- Demo 8: Executor Registry -->
	<ExecutorRegistryDemo {t} />

	<!-- Demo 9: Tree Hierarchy -->
	<TreeHierarchyDemo {t} />

	<!-- Demo 10: Performance Benchmark -->
	<PerformanceBenchmarkDemo {t} />

	<!-- Installation Section -->
	<DemoSection title={t('code.installation')}>
		<CodeBlock title="npm / bun" code={installationCode} language="bash" />
	</DemoSection>
</PackageDemoLayout>
