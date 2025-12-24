import type { PageServerLoad } from './$types';
import { createWebAppData, createHowToData, type HowToStepData } from '$lib/utils/structured-data';
import { createT } from '$i18n/translations';
import { extractLocaleFromPathname } from '$utils/common';

export const load: PageServerLoad = (event) => {
	const { url } = event;

	// Extract locale from URL pathname
	const locale = extractLocaleFromPathname(url.pathname) || 'en';

	// Create translation function for this request
	const t = createT(event);

	const canonical = url.origin + url.pathname;
	const image = `${url.origin}/og-chainlist.png`;

	// Define HowTo steps for SEO
	const steps: HowToStepData[] = [
		{
			name: t('chainlist.seo.step_1_name'),
			text: t('chainlist.seo.step_1_text'),
			description: t('chainlist.seo.step_1_description')
		},
		{
			name: t('chainlist.seo.step_2_name'),
			text: t('chainlist.seo.step_2_text'),
			description: t('chainlist.seo.step_2_description')
		},
		{
			name: t('chainlist.seo.step_3_name'),
			text: t('chainlist.seo.step_3_text'),
			description: t('chainlist.seo.step_3_description')
		}
	];

	// Generate structured data
	const webAppData = createWebAppData({
		name: t('chainlist.seo.webapp_name'),
		description: t('chainlist.seo.webapp_description'),
		canonical,
		features: [
			t('chainlist.seo.feature_1'),
			t('chainlist.seo.feature_2'),
			t('chainlist.seo.feature_3'),
			t('chainlist.seo.feature_4')
		]
	});

	const howToData = createHowToData({
		name: t('chainlist.seo.howto_name'),
		description: t('chainlist.seo.howto_description'),
		canonical,
		image,
		steps,
		tools: [t('chainlist.seo.howto_tool_1'), t('chainlist.seo.howto_tool_2')]
	});

	// Map locale to SEO locale format
	const seoLocaleMap: Record<string, string> = {
		en: 'en_US',
		zh: 'zh_CN'
	};

	return {
		// chains: processedChains,
		meta: {
			title: t('chainlist.seo.page_title'),
			description: t('chainlist.seo.page_description'),
			keywords: t('chainlist.seo.keywords'),
			canonical,
			type: 'website' as const,
			image,
			locale: seoLocaleMap[locale] || 'en_US'
		},
		structuredData: [webAppData, howToData]
	};
};
