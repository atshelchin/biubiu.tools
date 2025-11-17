<script lang="ts">
	import { mainnet, polygon, arbitrum, optimism, base, bsc } from 'viem/chains';
	import { useI18n } from '@shelchin/i18n/svelte';
	import StepBasedApp from '$lib/components/step-based-app.svelte';
	import { stepComponents } from '@/features/token-sweep/ui/steps';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();
</script>

<StepBasedApp
	config={{
		meta: data.meta,
		structuredData: data.structuredData,
		steps: [
			{
				label: 'tools.token_sweep.seo.step_1_name',
				description: 'tools.token_sweep.seo.step_1_description'
			},
			{
				label: 'tools.token_sweep.seo.step_2_name',
				description: 'tools.token_sweep.seo.step_2_description'
			},
			{
				label: 'tools.token_sweep.seo.step_3_name',
				description: 'tools.token_sweep.seo.step_3_description'
			},
			{
				label: 'tools.token_sweep.seo.step_4_name',
				description: 'tools.token_sweep.seo.step_4_description'
			},
			{
				label: 'tools.token_sweep.seo.step_5_name',
				description: 'tools.token_sweep.seo.step_5_description'
			}
		],
		useI18nKeys: true,
		appTitle: i18n.t('tools.token_sweep.title'),
		appDescription: i18n.t('tools.token_sweep.description'),
		walletConnect: {
			chains: [mainnet, polygon, base, bsc, arbitrum, optimism],
			storageKey: 'biubiu-tools-token-sweep'
		},
		stepComponents
	}}
/>
