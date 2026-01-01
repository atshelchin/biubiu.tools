<script lang="ts">
	import { mainnet, polygon, arbitrum, optimism, base, bsc } from 'viem/chains';
	import { useI18n } from '@shelchin/i18n';
	import StepBasedApp from '$lib/components/step-based-app.svelte';
	import { stepComponents } from '@/features/assets-monitor/ui/steps';
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
		appTitle: i18n.t('routes/apps/assets-monitor.title'),
		appDescription: i18n.t('routes/apps/assets-monitor.description'),
		walletConnect: {
			chains: [mainnet, base, bsc, polygon, arbitrum, optimism],
			storageKey: 'biubiu-tools-assets-monitor'
		},
		stepComponents,
		status: getToolPageStatus('assets-monitor'),
		toolKey: 'assets-monitor'
	}}
/>
