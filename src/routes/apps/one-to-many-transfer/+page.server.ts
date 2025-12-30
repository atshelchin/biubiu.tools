import type { PageServerLoad } from './$types';
import { createWebAppData, createHowToData, type HowToStepData } from '$lib/utils/structured-data';
import { createT } from '$i18n/translations';
import { extractLocaleFromPathname } from '$utils/common';

export const load: PageServerLoad = (event) => {
	const { url } = event;

	// Extract locale from URL pathname (e.g., /zh/apps/one-to-many-transfer -> 'zh')
	const locale = extractLocaleFromPathname(url.pathname) || 'en';

	// Create translation function for this request
	const t = createT(event);

	const canonical = url.origin + url.pathname;
	const image = `${url.origin}/og-one-to-many-transfer.png`;

	// Define steps with both SEO text and UI description using i18n
	const steps: HowToStepData[] = [
		{
			name: t('routes/apps/one-to-many-transfer.seo.step_1_name'),
			text: t('routes/apps/one-to-many-transfer.seo.step_1_text'),
			description: t('routes/apps/one-to-many-transfer.seo.step_1_description')
		},
		{
			name: t('routes/apps/one-to-many-transfer.seo.step_2_name'),
			text: t('routes/apps/one-to-many-transfer.seo.step_2_text'),
			description: t('routes/apps/one-to-many-transfer.seo.step_2_description')
		},
		{
			name: t('routes/apps/one-to-many-transfer.seo.step_3_name'),
			text: t('routes/apps/one-to-many-transfer.seo.step_3_text'),
			description: t('routes/apps/one-to-many-transfer.seo.step_3_description')
		},
		{
			name: t('routes/apps/one-to-many-transfer.seo.step_4_name'),
			text: t('routes/apps/one-to-many-transfer.seo.step_4_text'),
			description: t('routes/apps/one-to-many-transfer.seo.step_4_description')
		},
		{
			name: t('routes/apps/one-to-many-transfer.seo.step_5_name'),
			text: t('routes/apps/one-to-many-transfer.seo.step_5_text'),
			description: t('routes/apps/one-to-many-transfer.seo.step_5_description')
		}
	];

	// Generate structured data from steps config
	const webAppData = createWebAppData({
		name: t('routes/apps/one-to-many-transfer.seo.webapp_name'),
		description: t('routes/apps/one-to-many-transfer.seo.webapp_description'),
		canonical,
		features: [
			t('routes/apps/one-to-many-transfer.seo.feature_1'),
			t('routes/apps/one-to-many-transfer.seo.feature_2'),
			t('routes/apps/one-to-many-transfer.seo.feature_3'),
			t('routes/apps/one-to-many-transfer.seo.feature_4'),
			t('routes/apps/one-to-many-transfer.seo.feature_5')
		]
	});

	const howToData = createHowToData({
		name: t('routes/apps/one-to-many-transfer.seo.howto_name'),
		description: t('routes/apps/one-to-many-transfer.seo.howto_description'),
		canonical,
		image,
		steps,
		tools: [
			t('routes/apps/one-to-many-transfer.seo.howto_tool_1'),
			t('routes/apps/one-to-many-transfer.seo.howto_tool_2')
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
			title: t('routes/apps/one-to-many-transfer.seo.page_title'),
			description: t('routes/apps/one-to-many-transfer.seo.page_description'),
			keywords: t('routes/apps/one-to-many-transfer.seo.keywords'),
			canonical,
			type: 'website' as const,
			image,
			locale: seoLocaleMap[locale] || 'en_US'
		},
		steps,
		structuredData: [webAppData, howToData]
	};
};
