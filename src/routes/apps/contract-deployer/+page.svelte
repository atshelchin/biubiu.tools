<script lang="ts">
	import { mainnet, polygon, base, bsc, sepolia } from 'viem/chains';
	import { useI18n } from '@shelchin/i18n/svelte';
	import StepBasedApp from '$lib/components/step-based-app.svelte';
	import { stepComponents } from '@/features/contract-deployer/ui/steps';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();

	const faqs = $derived([
		{
			question: i18n.t('tools.contract_deployer.faqs.what_is_create2'),
			answer: i18n.t('tools.contract_deployer.faqs.create2_explanation')
		},
		{
			question: i18n.t('tools.contract_deployer.faqs.what_is_deterministic'),
			answer: i18n.t('tools.contract_deployer.faqs.deterministic_explanation')
		},
		{
			question: i18n.t('tools.contract_deployer.faqs.what_is_bytecode'),
			answer: i18n.t('tools.contract_deployer.faqs.bytecode_explanation')
		},
		{
			question: i18n.t('tools.contract_deployer.faqs.what_is_abi'),
			answer: i18n.t('tools.contract_deployer.faqs.abi_explanation')
		},
		{
			question: i18n.t('tools.contract_deployer.faqs.what_is_salt'),
			answer: i18n.t('tools.contract_deployer.faqs.salt_explanation')
		}
	]);
</script>

<StepBasedApp
	config={{
		meta: data.meta,
		structuredData: data.structuredData,
		steps: [
			{
				label: 'tools.contract_deployer.seo.step_1_name',
				description: 'tools.contract_deployer.seo.step_1_description'
			},
			{
				label: 'tools.contract_deployer.seo.step_2_name',
				description: 'tools.contract_deployer.seo.step_2_description'
			},
			{
				label: 'tools.contract_deployer.seo.step_3_name',
				description: 'tools.contract_deployer.seo.step_3_description'
			}
		],
		useI18nKeys: true,
		appTitle: i18n.t('tools.contract_deployer.title'),
		appDescription: i18n.t('tools.contract_deployer.description'),
		appFeatures: [
			i18n.t('tools.contract_deployer.feature_1'),
			i18n.t('tools.contract_deployer.feature_2'),
			i18n.t('tools.contract_deployer.feature_3')
		],
		faqs: {
			title: i18n.t('common.faqs'),
			items: faqs
		},
		walletConnect: {
			chains: [mainnet, polygon, base, bsc, sepolia],
			storageKey: 'biubiu-tools-contract-deployer'
		},
		stepComponents
	}}
/>
