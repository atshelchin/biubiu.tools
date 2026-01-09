<script lang="ts">
	/**
	 * Drag Sortable Demo Page
	 * A comprehensive demo showcasing all features of the @shelchin/drag-sortable package
	 */
	import { useI18n } from '@shelchin/i18n';
	import { GripVertical, Smartphone, Zap, Move, MousePointer2, ScrollText } from '@lucide/svelte';
	import { PackageDemoLayout, DemoSection, CodeBlock } from '$lib/components/package-demo';

	// Demo components
	import BasicDemo from '$lib/components/package-demo/demos/drag-sortable/basic-demo.svelte';
	import HandleDemo from '$lib/components/package-demo/demos/drag-sortable/handle-demo.svelte';
	import AnimationDemo from '$lib/components/package-demo/demos/drag-sortable/animation-demo.svelte';
	import CardsDemo from '$lib/components/package-demo/demos/drag-sortable/cards-demo.svelte';
	import KanbanDemo from '$lib/components/package-demo/demos/drag-sortable/kanban-demo.svelte';
	import PlaylistDemo from '$lib/components/package-demo/demos/drag-sortable/playlist-demo.svelte';

	const i18n = useI18n();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const t = (key: string) => i18n.t(`routes/packages/drag-sortable.${key}` as any);

	const features = [
		{ icon: GripVertical, text: t('features.ghost_element') },
		{ icon: Move, text: t('features.realtime_reorder') },
		{ icon: Zap, text: t('features.smooth_animation') },
		{ icon: Smartphone, text: t('features.desktop_mobile') },
		{ icon: MousePointer2, text: t('features.drag_handle') },
		{ icon: ScrollText, text: t('features.auto_scroll') }
	];

	const installationCode = `npm install @shelchin/drag-sortable
# or
bun add @shelchin/drag-sortable`;
</script>

<svelte:head>
	<title>{t('title')} | BiuBiu Tools</title>
	<meta name="description" content={t('description')} />
</svelte:head>

<PackageDemoLayout
	packageName="@shelchin/drag-sortable"
	title={t('title')}
	subtitle={t('subtitle')}
	description={t('description')}
	{features}
	heroIcon={GripVertical}
>
	<!-- Demo 1: Basic Usage -->
	<BasicDemo {t} />

	<!-- Demo 2: Drag Handle -->
	<HandleDemo {t} />

	<!-- Demo 3: Animation Settings -->
	<AnimationDemo {t} />

	<!-- Demo 4: Card Layout -->
	<CardsDemo {t} />

	<!-- Demo 5: Kanban Board -->
	<KanbanDemo {t} />

	<!-- Demo 6: Music Playlist -->
	<PlaylistDemo {t} />

	<!-- Installation Section -->
	<DemoSection title={t('code.installation')}>
		<CodeBlock title="npm / bun" code={installationCode} language="bash" />
	</DemoSection>
</PackageDemoLayout>
