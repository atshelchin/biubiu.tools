<script lang="ts">
	import { mainnet, polygon, arbitrum, optimism, base, bsc } from 'viem/chains';
	import { useI18n } from '@shelchin/i18n/svelte';
	import StepBasedApp from '$lib/components/step-based-app.svelte';
	import { stepComponents } from '@/features/token-balance-scanner/ui/steps';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const i18n = useI18n();

	const faqs = $derived([
		{
			question: i18n.t('tools.token_balance_scanner.faqs.what_is_balance_checker'),
			answer: i18n.t('tools.token_balance_scanner.faqs.balance_checker_explanation')
		},
		{
			question: i18n.t('tools.token_balance_scanner.faqs.how_many_addresses'),
			answer: i18n.t('tools.token_balance_scanner.faqs.how_many_addresses_explanation')
		},
		{
			question: i18n.t('tools.token_balance_scanner.faqs.what_tokens_supported'),
			answer: i18n.t('tools.token_balance_scanner.faqs.what_tokens_supported_explanation')
		},
		{
			question: i18n.t('tools.token_balance_scanner.faqs.is_it_free'),
			answer: i18n.t('tools.token_balance_scanner.faqs.is_it_free_explanation')
		},
		{
			question: i18n.t('tools.token_balance_scanner.faqs.what_is_multicall'),
			answer: i18n.t('tools.token_balance_scanner.faqs.multicall_explanation')
		},
		{
			question: i18n.t('tools.token_balance_scanner.faqs.can_export_results'),
			answer: i18n.t('tools.token_balance_scanner.faqs.can_export_explanation')
		},
		{
			question: i18n.t('tools.token_balance_scanner.faqs.what_networks_supported'),
			answer: i18n.t('tools.token_balance_scanner.faqs.networks_supported_explanation')
		}
	]);
</script>

<StepBasedApp
	config={{
		meta: data.meta,
		structuredData: data.structuredData,
		steps: [
			{
				label: 'tools.token_balance_scanner.seo.step_1_name',
				description: 'tools.token_balance_scanner.seo.step_1_description'
			},
			{
				label: 'tools.token_balance_scanner.seo.step_2_name',
				description: 'tools.token_balance_scanner.seo.step_2_description'
			},
			{
				label: 'tools.token_balance_scanner.seo.step_3_name',
				description: 'tools.token_balance_scanner.seo.step_3_description'
			},
			{
				label: 'tools.token_balance_scanner.seo.step_4_name',
				description: 'tools.token_balance_scanner.seo.step_4_description'
			},
			{
				label: 'tools.token_balance_scanner.seo.step_5_name',
				description: 'tools.token_balance_scanner.seo.step_5_description'
			}
		],
		useI18nKeys: true,
		appTitle: i18n.t('tools.token_balance_scanner.title'),
		appDescription: i18n.t('tools.token_balance_scanner.description'),
		faqs: {
			title: i18n.t('common.faqs'),
			items: faqs
		},
		walletConnect: {
			chains: [mainnet, polygon, base, bsc, arbitrum, optimism],
			storageKey: 'biubiu-tools-token-balance-scanner'
		},
		stepComponents
	}}
/>
