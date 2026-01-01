<script lang="ts">
	import { useI18n } from '@shelchin/i18n';
	import StepBasedApp from '$lib/components/step-based-app.svelte';
	import { stepComponents } from '@/features/wallet-generator/ui/steps';
	import { getToolPageStatus } from '@/features/roadmap/data/roadmap-items';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const i18n = useI18n();
</script>

<StepBasedApp
	config={{
		meta: data.meta,
		structuredData: data.structuredData,
		steps: data.steps,
		appTitle: i18n.t('routes/apps/wallet-generator.title'),
		appDescription: i18n.t('routes/apps/wallet-generator.description'),
		stepComponents,
		status: getToolPageStatus('wallet-generator'),
		toolKey: 'wallet-generator'
	}}
/>
