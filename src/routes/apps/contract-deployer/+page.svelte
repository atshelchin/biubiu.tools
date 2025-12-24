<script lang="ts">
	import { mainnet, polygon, base, bsc, sepolia } from 'viem/chains';
	import { useI18n } from '@shelchin/i18n';
	import StepBasedApp from '$lib/components/step-based-app.svelte';
	import { stepComponents } from '@/features/contract-deployer/ui/steps';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();

	const faqs = $derived([
		{
			question: i18n.t('contract-deployer.faqs.what_is_create2'),
			answer: i18n.t('contract-deployer.faqs.create2_explanation')
		},
		{
			question: i18n.t('contract-deployer.faqs.what_is_deterministic'),
			answer: i18n.t('contract-deployer.faqs.deterministic_explanation')
		},
		{
			question: i18n.t('contract-deployer.faqs.what_is_bytecode'),
			answer: i18n.t('contract-deployer.faqs.bytecode_explanation')
		},
		{
			question: i18n.t('contract-deployer.faqs.what_is_abi'),
			answer: i18n.t('contract-deployer.faqs.abi_explanation')
		},
		{
			question: i18n.t('contract-deployer.faqs.what_is_salt'),
			answer: i18n.t('contract-deployer.faqs.salt_explanation')
		}
	]);
</script>

<StepBasedApp
	config={{
		meta: data.meta,
		structuredData: data.structuredData,
		steps: [
			{
				label: 'contract-deployer.seo.step_1_name',
				description: 'contract-deployer.seo.step_1_description'
			},
			{
				label: 'contract-deployer.seo.step_2_name',
				description: 'contract-deployer.seo.step_2_description'
			},
			{
				label: 'contract-deployer.seo.step_3_name',
				description: 'contract-deployer.seo.step_3_description'
			}
		],
		useI18nKeys: true,
		appTitle: i18n.t('contract-deployer.title'),
		appDescription: i18n.t('contract-deployer.description'),
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
