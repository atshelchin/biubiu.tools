<script lang="ts">
	import { mainnet, polygon, arbitrum, optimism, base, bsc } from 'viem/chains';
	import { useI18n } from '@shelchin/i18n';
	import StepBasedApp from '$lib/components/step-based-app.svelte';
	import { stepComponents } from '@/features/one-to-many-transfer/ui/steps';
	import { getToolPageStatus } from '@/features/roadmap/data/roadmap-items';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();

	const faqs = $derived([
		{
			question: i18n.t('routes/apps/one-to-many-transfer.faqs.what_is_one_to_many'),
			answer: i18n.t('routes/apps/one-to-many-transfer.faqs.one_to_many_explanation')
		},
		{
			question: i18n.t('routes/apps/one-to-many-transfer.faqs.what_tokens_supported'),
			answer: i18n.t('routes/apps/one-to-many-transfer.faqs.tokens_supported_explanation')
		},
		{
			question: i18n.t('routes/apps/one-to-many-transfer.faqs.what_is_equal_distribution'),
			answer: i18n.t('routes/apps/one-to-many-transfer.faqs.equal_distribution_explanation')
		},
		{
			question: i18n.t('routes/apps/one-to-many-transfer.faqs.what_is_custom_amounts'),
			answer: i18n.t('routes/apps/one-to-many-transfer.faqs.custom_amounts_explanation')
		},
		{
			question: i18n.t('routes/apps/one-to-many-transfer.faqs.how_to_import_recipients'),
			answer: i18n.t('routes/apps/one-to-many-transfer.faqs.import_recipients_explanation')
		},
		{
			question: i18n.t('routes/apps/one-to-many-transfer.faqs.what_networks_supported'),
			answer: i18n.t('routes/apps/one-to-many-transfer.faqs.networks_supported_explanation')
		}
	]);
</script>

<StepBasedApp
	config={{
		meta: data.meta,
		structuredData: data.structuredData,
		steps: [
			{
				label: 'routes/apps/one-to-many-transfer.seo.step_1_name',
				description: 'routes/apps/one-to-many-transfer.seo.step_1_description'
			},
			{
				label: 'routes/apps/one-to-many-transfer.seo.step_2_name',
				description: 'routes/apps/one-to-many-transfer.seo.step_2_description'
			},
			{
				label: 'routes/apps/one-to-many-transfer.seo.step_3_name',
				description: 'routes/apps/one-to-many-transfer.seo.step_3_description'
			},
			{
				label: 'routes/apps/one-to-many-transfer.seo.step_4_name',
				description: 'routes/apps/one-to-many-transfer.seo.step_4_description'
			},
			{
				label: 'routes/apps/one-to-many-transfer.seo.step_5_name',
				description: 'routes/apps/one-to-many-transfer.seo.step_5_description'
			}
		],
		useI18nKeys: true,
		appTitle: i18n.t('routes/apps/one-to-many-transfer.title'),
		appDescription: i18n.t('routes/apps/one-to-many-transfer.description'),
		faqs: {
			title: i18n.t('common.faqs.title'),
			items: faqs
		},
		walletConnect: {
			chains: [mainnet, base, bsc, polygon, arbitrum, optimism],
			storageKey: 'biubiu-tools-one-to-many-transfer'
		},
		stepComponents,
		status: getToolPageStatus('one-to-many-transfer'),
		toolKey: 'one-to-many-transfer'
	}}
/>
