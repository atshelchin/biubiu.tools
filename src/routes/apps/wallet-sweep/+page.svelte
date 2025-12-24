<script lang="ts">
	import { mainnet, polygon, base, bsc } from 'viem/chains';
	import { useI18n } from '@shelchin/i18n';
	import StepBasedApp from '$lib/components/step-based-app.svelte';
	import { stepComponents } from '@/features/wallet-sweep/ui/steps';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();

	const faqs = $derived([
		{
			question: i18n.t('wallet-sweep.faqs.what_is_network'),
			answer: i18n.t('wallet-sweep.faqs.network_explanation')
		},
		{
			question: i18n.t('wallet-sweep.faqs.what_is_wallet'),
			answer: i18n.t('wallet-sweep.faqs.wallet_explanation')
		},
		{
			question: i18n.t('wallet-sweep.faqs.what_is_native_token'),
			answer: i18n.t('wallet-sweep.faqs.native_token_explanation')
		},
		{
			question: i18n.t('wallet-sweep.faqs.can_select_multiple_tokens'),
			answer: i18n.t('wallet-sweep.faqs.can_select_multiple_tokens_explanation')
		},
		{
			question: i18n.t('wallet-sweep.faqs.what_happens_zero_balance'),
			answer: i18n.t('wallet-sweep.faqs.what_happens_zero_balance_explanation')
		},
		{
			question: i18n.t('wallet-sweep.faqs.what_tokens_supported'),
			answer: i18n.t('wallet-sweep.faqs.what_tokens_supported_explanation')
		},
		{
			question: i18n.t('wallet-sweep.faqs.how_add_custom_token'),
			answer: i18n.t('wallet-sweep.faqs.how_add_custom_token_explanation')
		},
		{
			question: i18n.t('wallet-sweep.faqs.what_is_eip7702'),
			answer: i18n.t('wallet-sweep.faqs.eip7702_explanation')
		},
		{
			question: i18n.t('wallet-sweep.faqs.why_need_eip7702'),
			answer: i18n.t('wallet-sweep.faqs.why_need_eip7702_explanation')
		},
		{
			question: i18n.t('wallet-sweep.faqs.what_is_create2_proxy'),
			answer: i18n.t('wallet-sweep.faqs.create2_proxy_explanation')
		},
		{
			question: i18n.t('wallet-sweep.faqs.what_is_multicall3'),
			answer: i18n.t('wallet-sweep.faqs.multicall3_explanation')
		},
		{
			question: i18n.t('wallet-sweep.faqs.what_is_biubiu_premium'),
			answer: i18n.t('wallet-sweep.faqs.biubiu_premium_explanation')
		},
		{
			question: i18n.t('wallet-sweep.faqs.what_is_wallet_sweep'),
			answer: i18n.t('wallet-sweep.faqs.wallet_sweep_explanation')
		}
	]);
</script>

<StepBasedApp
	config={{
		meta: data.meta,
		structuredData: data.structuredData,
		steps: [
			{
				label: 'wallet-sweep.seo.step_1_name',
				description: 'wallet-sweep.seo.step_1_description'
			},
			{
				label: 'wallet-sweep.seo.step_2_name',
				description: 'wallet-sweep.seo.step_2_description'
			},
			{
				label: 'wallet-sweep.seo.step_3_name',
				description: 'wallet-sweep.seo.step_3_description'
			},
			{
				label: 'wallet-sweep.seo.step_4_name',
				description: 'wallet-sweep.seo.step_4_description'
			},
			{
				label: 'wallet-sweep.seo.step_5_name',
				description: 'wallet-sweep.seo.step_5_description'
			}
		],
		useI18nKeys: true,
		appTitle: i18n.t('wallet-sweep.title'),
		appDescription: i18n.t('wallet-sweep.description'),
		faqs: {
			title: i18n.t('common.faqs'),
			items: faqs
		},
		walletConnect: {
			chains: [mainnet, polygon, base, bsc],
			storageKey: 'biubiu-tools-wallet-sweep'
		},
		stepComponents
	}}
/>
