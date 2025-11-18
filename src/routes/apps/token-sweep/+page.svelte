<script lang="ts">
	import { mainnet, polygon, arbitrum, optimism, base, bsc } from 'viem/chains';
	import { useI18n } from '@shelchin/i18n/svelte';
	import StepBasedApp from '$lib/components/step-based-app.svelte';
	import { stepComponents } from '@/features/token-sweep/ui/steps';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();

	const faqs = $derived([
		{
			question: i18n.t('tools.token_sweep.step1.sidebar.what_is_network'),
			answer: i18n.t('tools.token_sweep.step1.sidebar.network_explanation')
		},
		{
			question: i18n.t('tools.token_sweep.step1.sidebar.what_is_wallet'),
			answer: i18n.t('tools.token_sweep.step1.sidebar.wallet_explanation')
		},
		{
			question: i18n.t('tools.token_sweep.step1.sidebar.what_is_native_token'),
			answer: i18n.t('tools.token_sweep.step1.sidebar.native_token_explanation')
		}
	]);
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
		appFeatures: [
			i18n.t('tools.token_sweep.feature_1'),
			i18n.t('tools.token_sweep.feature_2'),
			i18n.t('tools.token_sweep.feature_3'),
			i18n.t('tools.token_sweep.feature_4')
		],
		faqs: {
			title: i18n.t('common.faqs'),
			items: faqs
		},
		walletConnect: {
			chains: [mainnet, polygon, base, bsc, arbitrum, optimism],
			storageKey: 'biubiu-tools-token-sweep'
		},
		stepComponents
	}}
/>
