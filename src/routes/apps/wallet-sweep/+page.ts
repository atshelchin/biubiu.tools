import type { PageLoad } from './$types';
import { createWebAppData, createHowToData, type HowToStepData } from '$lib/utils/structured-data';
import { createServerT } from '$i18n/server';
import { extractLocaleFromPathname } from '$utils/common';

export const load: PageLoad = ({ url }) => {
	// Extract locale from URL pathname (e.g., /zh/apps/wallet-sweep -> 'zh')
	const locale = extractLocaleFromPathname(url.pathname) || 'en';

	// Create translation function for this request
	const t = createServerT(locale);

	const canonical = url.origin + url.pathname;
	const image = `${url.origin}/og-wallet-sweep.png`;

	// Define steps with both SEO text and UI description using i18n
	const steps: HowToStepData[] = [
		{
			name: t('wallet-sweep.seo.step_1_name'),
			text: t('wallet-sweep.seo.step_1_text'),
			description: t('wallet-sweep.seo.step_1_description')
		},
		{
			name: t('wallet-sweep.seo.step_2_name'),
			text: t('wallet-sweep.seo.step_2_text'),
			description: t('wallet-sweep.seo.step_2_description')
		},
		{
			name: t('wallet-sweep.seo.step_3_name'),
			text: t('wallet-sweep.seo.step_3_text'),
			description: t('wallet-sweep.seo.step_3_description')
		},
		{
			name: t('wallet-sweep.seo.step_4_name'),
			text: t('wallet-sweep.seo.step_4_text'),
			description: t('wallet-sweep.seo.step_4_description')
		},
		{
			name: t('wallet-sweep.seo.step_5_name'),
			text: t('wallet-sweep.seo.step_5_text'),
			description: t('wallet-sweep.seo.step_5_description')
		}
	];

	// Generate structured data from steps config
	const webAppData = createWebAppData({
		name: t('wallet-sweep.seo.webapp_name'),
		description: t('wallet-sweep.seo.webapp_description'),
		canonical,
		features: [
			t('wallet-sweep.seo.feature_1'),
			t('wallet-sweep.seo.feature_2'),
			t('wallet-sweep.seo.feature_3'),
			t('wallet-sweep.seo.feature_4'),
			t('wallet-sweep.seo.feature_5')
		]
	});

	const howToData = createHowToData({
		name: t('wallet-sweep.seo.howto_name'),
		description: t('wallet-sweep.seo.howto_description'),
		canonical,
		image,
		steps,
		tools: [t('wallet-sweep.seo.howto_tool_1'), t('wallet-sweep.seo.howto_tool_2')]
	});

	// Map locale to SEO locale format (e.g., 'zh' -> 'zh_CN', 'en' -> 'en_US')
	const seoLocaleMap: Record<string, string> = {
		en: 'en_US',
		zh: 'zh_CN',
		ja: 'ja_JP',
		fr: 'fr_FR'
	};

	// FAQs configuration
	const faqs = [
		{
			question: t('wallet-sweep.step1.sidebar.what_is_network'),
			answer: t('wallet-sweep.step1.sidebar.network_explanation')
		},
		{
			question: t('wallet-sweep.step1.sidebar.what_is_wallet'),
			answer: t('wallet-sweep.step1.sidebar.wallet_explanation')
		},
		{
			question: t('wallet-sweep.step1.sidebar.what_is_native_token'),
			answer: t('wallet-sweep.step1.sidebar.native_token_explanation')
		}
	];

	return {
		meta: {
			title: t('wallet-sweep.seo.page_title'),
			description: t('wallet-sweep.seo.page_description'),
			keywords: t('wallet-sweep.seo.keywords'),
			canonical,
			type: 'website' as const,
			image,
			locale: seoLocaleMap[locale] || 'en_US'
		},
		steps,
		structuredData: [webAppData, howToData],
		faqs
	};
};
