<script lang="ts">
	import { mainnet } from 'viem/chains';
	import { useI18n } from '@shelchin/i18n';
	import StepBasedApp from '$lib/components/step-based-app.svelte';
	import { stepComponents } from '@/features/ens-scanner/ui/steps';
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
		appTitle: i18n.t('routes/apps/ens-scanner.title'),
		appDescription: i18n.t('routes/apps/ens-scanner.description'),
		walletConnect: {
			chains: [mainnet],
			storageKey: 'biubiu-tools-ens-scanner'
		},
		stepComponents,
		status: getToolPageStatus('ens-scanner'),
		toolKey: 'ens-scanner'
	}}
/>
