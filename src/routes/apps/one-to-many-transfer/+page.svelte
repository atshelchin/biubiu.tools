<script lang="ts">
	import { mainnet, polygon, arbitrum, optimism, base, bsc } from 'viem/chains';
	import { useI18n } from '@shelchin/i18n/svelte';
	import StepBasedApp from '$lib/components/step-based-app.svelte';
	import { stepComponents } from '@/features/token-distribution/ui/steps';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();

	const faqs = $derived([
		{
			question: i18n.t('tools.one_to_many_transfer.faqs.what_is_one_to_many'),
			answer: i18n.t('tools.one_to_many_transfer.faqs.one_to_many_explanation')
		},
		{
			question: i18n.t('tools.one_to_many_transfer.faqs.what_tokens_supported'),
			answer: i18n.t('tools.one_to_many_transfer.faqs.tokens_supported_explanation')
		},
		{
			question: i18n.t('tools.one_to_many_transfer.faqs.what_is_equal_distribution'),
			answer: i18n.t('tools.one_to_many_transfer.faqs.equal_distribution_explanation')
		},
		{
			question: i18n.t('tools.one_to_many_transfer.faqs.what_is_custom_amounts'),
			answer: i18n.t('tools.one_to_many_transfer.faqs.custom_amounts_explanation')
		},
		{
			question: i18n.t('tools.one_to_many_transfer.faqs.how_to_import_recipients'),
			answer: i18n.t('tools.one_to_many_transfer.faqs.import_recipients_explanation')
		},
		{
			question: i18n.t('tools.one_to_many_transfer.faqs.what_networks_supported'),
			answer: i18n.t('tools.one_to_many_transfer.faqs.networks_supported_explanation')
		}
	]);
</script>

<StepBasedApp
	config={{
		meta: data.meta,
		structuredData: data.structuredData,
		steps: [
			{
				label: 'tools.one_to_many_transfer.seo.step_1_name',
				description: 'tools.one_to_many_transfer.seo.step_1_description'
			},
			{
				label: 'tools.one_to_many_transfer.seo.step_2_name',
				description: 'tools.one_to_many_transfer.seo.step_2_description'
			},
			{
				label: 'tools.one_to_many_transfer.seo.step_3_name',
				description: 'tools.one_to_many_transfer.seo.step_3_description'
			},
			{
				label: 'tools.one_to_many_transfer.seo.step_4_name',
				description: 'tools.one_to_many_transfer.seo.step_4_description'
			},
			{
				label: 'tools.one_to_many_transfer.seo.step_5_name',
				description: 'tools.one_to_many_transfer.seo.step_5_description'
			}
		],
		useI18nKeys: true,
		appTitle: i18n.t('tools.one_to_many_transfer.title'),
		appDescription: i18n.t('tools.one_to_many_transfer.description'),
		faqs: {
			title: i18n.t('common.faqs'),
			items: faqs
		},
		walletConnect: {
			chains: [mainnet, base, bsc, polygon, arbitrum, optimism],
			storageKey: 'biubiu-tools-one-to-many-transfer'
		},
		stepComponents
	}}
/>
