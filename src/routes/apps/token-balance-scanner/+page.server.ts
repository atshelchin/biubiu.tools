import type { PageServerLoad } from './$types';
import { createWebAppData, createHowToData, type HowToStepData } from '$lib/utils/structured-data';
import { createT } from '$i18n/translations';
import { extractLocaleFromPathname } from '$utils/common';

export const load: PageServerLoad = (event) => {
	const { url } = event;

	// Extract locale from URL pathname (e.g., /zh/apps/token-balance-scanner -> 'zh')
	const locale = extractLocaleFromPathname(url.pathname) || 'en';

	// Create translation function for this request
	const t = createT(event);

	const canonical = url.origin + url.pathname;
	const image = `${url.origin}/og-token-balance-scanner.png`;

	// Define steps with both SEO text and UI description using i18n
	const steps: HowToStepData[] = [
		{
			name: t('token-balance-scanner.seo.step_1_name'),
			text: t('token-balance-scanner.seo.step_1_text'),
			description: t('token-balance-scanner.seo.step_1_description')
		},
		{
			name: t('token-balance-scanner.seo.step_2_name'),
			text: t('token-balance-scanner.seo.step_2_text'),
			description: t('token-balance-scanner.seo.step_2_description')
		},
		{
			name: t('token-balance-scanner.seo.step_3_name'),
			text: t('token-balance-scanner.seo.step_3_text'),
			description: t('token-balance-scanner.seo.step_3_description')
		},
		{
			name: t('token-balance-scanner.seo.step_4_name'),
			text: t('token-balance-scanner.seo.step_4_text'),
			description: t('token-balance-scanner.seo.step_4_description')
		},
		{
			name: t('token-balance-scanner.seo.step_5_name'),
			text: t('token-balance-scanner.seo.step_5_text'),
			description: t('token-balance-scanner.seo.step_5_description')
		}
	];

	// Generate structured data from steps config
	const webAppData = createWebAppData({
		name: t('token-balance-scanner.seo.webapp_name'),
		description: t('token-balance-scanner.seo.webapp_description'),
		canonical,
		features: [
			t('token-balance-scanner.seo.feature_1'),
			t('token-balance-scanner.seo.feature_2'),
			t('token-balance-scanner.seo.feature_3'),
			t('token-balance-scanner.seo.feature_4'),
			t('token-balance-scanner.seo.feature_5')
		]
	});

	const howToData = createHowToData({
		name: t('token-balance-scanner.seo.howto_name'),
		description: t('token-balance-scanner.seo.howto_description'),
		canonical,
		image,
		steps,
		tools: [
			t('token-balance-scanner.seo.howto_tool_1'),
			t('token-balance-scanner.seo.howto_tool_2')
		]
	});

	// Map locale to SEO locale format (e.g., 'zh' -> 'zh_CN', 'en' -> 'en_US')
	const seoLocaleMap: Record<string, string> = {
		en: 'en_US',
		zh: 'zh_CN',
		ja: 'ja_JP',
		fr: 'fr_FR'
	};

	return {
		meta: {
			title: t('token-balance-scanner.seo.page_title'),
			description: t('token-balance-scanner.seo.page_description'),
			keywords: t('token-balance-scanner.seo.keywords'),
			canonical,
			type: 'website' as const,
			image,
			locale: seoLocaleMap[locale] || 'en_US'
		},
		steps,
		structuredData: [webAppData, howToData]
	};
};
