import type { PageServerLoad } from './$types';
import { createWebAppData, createHowToData, type HowToStepData } from '$lib/utils/structured-data';
import { createT } from '$i18n/translations';
import { extractLocaleFromPathname, buildCanonicalUrl } from '$utils/common';

export const load: PageServerLoad = (event) => {
	const { url } = event;

	// Extract locale from URL pathname
	const locale = extractLocaleFromPathname(url.pathname) || 'en';

	// Create translation function for this request
	const t = createT(event);

	const canonical = buildCanonicalUrl(url);
	const image = `${url.origin}/og-contract-deployer.png`;

	// Define steps with both SEO text and UI description using i18n
	const steps: HowToStepData[] = [
		{
			name: t('routes/apps/contract-deployer.seo.step_1_name'),
			text: t('routes/apps/contract-deployer.seo.step_1_text'),
			description: t('routes/apps/contract-deployer.seo.step_1_description')
		},
		{
			name: t('routes/apps/contract-deployer.seo.step_2_name'),
			text: t('routes/apps/contract-deployer.seo.step_2_text'),
			description: t('routes/apps/contract-deployer.seo.step_2_description')
		},
		{
			name: t('routes/apps/contract-deployer.seo.step_3_name'),
			text: t('routes/apps/contract-deployer.seo.step_3_text'),
			description: t('routes/apps/contract-deployer.seo.step_3_description')
		}
	];

	// Generate structured data from steps config
	const webAppData = createWebAppData({
		name: t('routes/apps/contract-deployer.seo.webapp_name'),
		description: t('routes/apps/contract-deployer.seo.webapp_description'),
		canonical,
		features: [
			t('routes/apps/contract-deployer.seo.feature_1'),
			t('routes/apps/contract-deployer.seo.feature_2'),
			t('routes/apps/contract-deployer.seo.feature_3')
		]
	});

	const howToData = createHowToData({
		name: t('routes/apps/contract-deployer.seo.howto_name'),
		description: t('routes/apps/contract-deployer.seo.howto_description'),
		canonical,
		image,
		steps,
		tools: [t('routes/apps/contract-deployer.seo.howto_tool_1')]
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
			title: t('routes/apps/contract-deployer.seo.page_title'),
			description: t('routes/apps/contract-deployer.seo.page_description'),
			keywords: t('routes/apps/contract-deployer.seo.keywords'),
			canonical,
			type: 'website' as const,
			image,
			locale: seoLocaleMap[locale] || 'en_US'
		},
		steps,
		structuredData: [webAppData, howToData]
	};
};
