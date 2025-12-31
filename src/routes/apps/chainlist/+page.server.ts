import type { PageServerLoad } from './$types';
import { createWebAppData, createHowToData, type HowToStepData } from '$lib/utils/structured-data';
import { createT } from '$i18n/translations';
import { extractLocaleFromPathname } from '$utils/common';
import { getPromotions } from '@/features/promotions';

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
			name: t('routes/apps/chainlist.seo.step_1_name'),
			text: t('routes/apps/chainlist.seo.step_1_text'),
			description: t('routes/apps/chainlist.seo.step_1_description')
		},
		{
			name: t('routes/apps/chainlist.seo.step_2_name'),
			text: t('routes/apps/chainlist.seo.step_2_text'),
			description: t('routes/apps/chainlist.seo.step_2_description')
		},
		{
			name: t('routes/apps/chainlist.seo.step_3_name'),
			text: t('routes/apps/chainlist.seo.step_3_text'),
			description: t('routes/apps/chainlist.seo.step_3_description')
		}
	];

	// Generate structured data
	const webAppData = createWebAppData({
		name: t('routes/apps/chainlist.seo.webapp_name'),
		description: t('routes/apps/chainlist.seo.webapp_description'),
		canonical,
		features: [
			t('routes/apps/chainlist.seo.feature_1'),
			t('routes/apps/chainlist.seo.feature_2'),
			t('routes/apps/chainlist.seo.feature_3'),
			t('routes/apps/chainlist.seo.feature_4')
		]
	});

	const howToData = createHowToData({
		name: t('routes/apps/chainlist.seo.howto_name'),
		description: t('routes/apps/chainlist.seo.howto_description'),
		canonical,
		image,
		steps,
		tools: [
			t('routes/apps/chainlist.seo.howto_tool_1'),
			t('routes/apps/chainlist.seo.howto_tool_2')
		]
	});

	// Map locale to SEO locale format
	const seoLocaleMap: Record<string, string> = {
		en: 'en_US',
		zh: 'zh_CN'
	};

	// Get promotions for this page
	const promotions = getPromotions({
		placement: 'chainlist-bottom',
		locale
	});

	return {
		// chains: processedChains,
		promotions,
		meta: {
			title: t('routes/apps/chainlist.seo.page_title'),
			description: t('routes/apps/chainlist.seo.page_description'),
			keywords: t('routes/apps/chainlist.seo.keywords'),
			canonical,
			type: 'website' as const,
			image,
			locale: seoLocaleMap[locale] || 'en_US'
		},
		structuredData: [webAppData, howToData]
	};
};
