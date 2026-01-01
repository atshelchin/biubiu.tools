<script lang="ts">
	import { mainnet, polygon, arbitrum, optimism, base, bsc } from 'viem/chains';
	import { useI18n } from '@shelchin/i18n';
	import StepBasedApp from '$lib/components/step-based-app.svelte';
	import { stepComponents } from '@/features/contract-events-scanner/ui/steps';
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
		appTitle: i18n.t('routes/apps/contract-events-scanner.title'),
		appDescription: i18n.t('routes/apps/contract-events-scanner.description'),
		walletConnect: {
			chains: [mainnet, base, bsc, polygon, arbitrum, optimism],
			storageKey: 'biubiu-tools-contract-events-scanner'
		},
		stepComponents,
		status: getToolPageStatus('contract-events-scanner'),
		toolKey: 'contract-events-scanner'
	}}
/>
