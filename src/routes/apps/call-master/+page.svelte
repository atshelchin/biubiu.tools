<script lang="ts">
	import { mainnet, polygon, arbitrum, optimism, base, bsc, sepolia } from 'viem/chains';
	import { useI18n } from '@shelchin/i18n';
	import StepBasedApp from '$lib/components/step-based-app.svelte';
	import { stepComponents } from '@/features/call-master/ui/steps';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const i18n = useI18n();
</script>

<StepBasedApp
	config={{
		meta: data.meta,
		structuredData: data.structuredData,
		steps: data.steps,
		appTitle: i18n.t('call-master.title'),
		appDescription: i18n.t('call-master.description'),
		walletConnect: {
			chains: [mainnet, base, bsc, polygon, arbitrum, optimism, sepolia],
			storageKey: 'biubiu-tools-call-master'
		},
		stepComponents,
		status: 'alpha',
		toolKey: 'call-master'
	}}
/>
