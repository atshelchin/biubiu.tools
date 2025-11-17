<script lang="ts">
	import { mainnet, polygon, arbitrum, optimism, base, bsc } from 'viem/chains';
	import { useI18n } from '@shelchin/i18n/svelte';
	import StepBasedApp from '$lib/components/step-based-app.svelte';
	import { stepComponents } from '@/features/token-sweep/ui/steps';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();

	// Define steps with both SEO text and UI description using i18n
	// Use $derived to make steps reactive to locale changes
	const steps = $derived([
		{
			name: i18n.t('tools.token_sweep.seo.step_1_name'),
			text: i18n.t('tools.token_sweep.seo.step_1_text'),
			description: i18n.t('tools.token_sweep.seo.step_1_description')
		},
		{
			name: i18n.t('tools.token_sweep.seo.step_2_name'),
			text: i18n.t('tools.token_sweep.seo.step_2_text'),
			description: i18n.t('tools.token_sweep.seo.step_2_description')
		},
		{
			name: i18n.t('tools.token_sweep.seo.step_3_name'),
			text: i18n.t('tools.token_sweep.seo.step_3_text'),
			description: i18n.t('tools.token_sweep.seo.step_3_description')
		},
		{
			name: i18n.t('tools.token_sweep.seo.step_4_name'),
			text: i18n.t('tools.token_sweep.seo.step_4_text'),
			description: i18n.t('tools.token_sweep.seo.step_4_description')
		},
		{
			name: i18n.t('tools.token_sweep.seo.step_5_name'),
			text: i18n.t('tools.token_sweep.seo.step_5_text'),
			description: i18n.t('tools.token_sweep.seo.step_5_description')
		}
	]);
</script>

<StepBasedApp
	config={{
		meta: data.meta,
		structuredData: data.structuredData,
		steps: steps,
		appTitle: i18n.t('tools.token_sweep.title'),
		appDescription: i18n.t('tools.token_sweep.description'),
		walletConnect: {
			chains: [mainnet, polygon, base, bsc, arbitrum, optimism],
			storageKey: 'biubiu-tools-token-sweep'
		},
		stepComponents
	}}
/>
