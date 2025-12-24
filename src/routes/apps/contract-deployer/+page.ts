import type { PageLoad } from './$types';
import { createWebAppData, createHowToData, type HowToStepData } from '$lib/utils/structured-data';
import { createServerT } from '$i18n/server';
import { extractLocaleFromPathname } from '$utils/common';

export const load: PageLoad = ({ url }) => {
	// Extract locale from URL pathname
	const locale = extractLocaleFromPathname(url.pathname) || 'en';

	// Create translation function for this request
	const t = createServerT(locale);

	const canonical = url.origin + url.pathname;
	const image = `${url.origin}/og-contract-deployer.png`;

	// Define steps with both SEO text and UI description using i18n
	const steps: HowToStepData[] = [
		{
			name: t('contract-deployer.seo.step_1_name'),
			text: t('contract-deployer.seo.step_1_text'),
			description: t('contract-deployer.seo.step_1_description')
		},
		{
			name: t('contract-deployer.seo.step_2_name'),
			text: t('contract-deployer.seo.step_2_text'),
			description: t('contract-deployer.seo.step_2_description')
		},
		{
			name: t('contract-deployer.seo.step_3_name'),
			text: t('contract-deployer.seo.step_3_text'),
			description: t('contract-deployer.seo.step_3_description')
		}
	];

	// Generate structured data from steps config
	const webAppData = createWebAppData({
		name: t('contract-deployer.seo.webapp_name'),
		description: t('contract-deployer.seo.webapp_description'),
		canonical,
		features: [
			t('contract-deployer.seo.feature_1'),
			t('contract-deployer.seo.feature_2'),
			t('contract-deployer.seo.feature_3')
		]
	});

	const howToData = createHowToData({
		name: t('contract-deployer.seo.howto_name'),
		description: t('contract-deployer.seo.howto_description'),
		canonical,
		image,
		steps,
		tools: [t('contract-deployer.seo.howto_tool_1')]
	});

	// Map locale to SEO locale format
	const seoLocaleMap: Record<string, string> = {
		en: 'en_US',
		zh: 'zh_CN',
		ja: 'ja_JP',
		fr: 'fr_FR'
	};

	return {
		meta: {
			title: t('contract-deployer.seo.page_title'),
			description: t('contract-deployer.seo.page_description'),
			keywords: t('contract-deployer.seo.keywords'),
			canonical,
			type: 'website' as const,
			image,
			locale: seoLocaleMap[locale] || 'en_US'
		},
		steps,
		structuredData: [webAppData, howToData]
	};
};
