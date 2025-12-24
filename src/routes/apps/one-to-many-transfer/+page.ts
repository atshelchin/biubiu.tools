import type { PageLoad } from './$types';
import { createWebAppData, createHowToData, type HowToStepData } from '$lib/utils/structured-data';
import { createServerT } from '$i18n/server';
import { extractLocaleFromPathname } from '$utils/common';

export const load: PageLoad = ({ url }) => {
	// Extract locale from URL pathname (e.g., /zh/apps/one-to-many-transfer -> 'zh')
	const locale = extractLocaleFromPathname(url.pathname) || 'en';

	// Create translation function for this request
	const t = createServerT(locale);

	const canonical = url.origin + url.pathname;
	const image = `${url.origin}/og-one-to-many-transfer.png`;

	// Define steps with both SEO text and UI description using i18n
	const steps: HowToStepData[] = [
		{
			name: t('one-to-many-transfer.seo.step_1_name'),
			text: t('one-to-many-transfer.seo.step_1_text'),
			description: t('one-to-many-transfer.seo.step_1_description')
		},
		{
			name: t('one-to-many-transfer.seo.step_2_name'),
			text: t('one-to-many-transfer.seo.step_2_text'),
			description: t('one-to-many-transfer.seo.step_2_description')
		},
		{
			name: t('one-to-many-transfer.seo.step_3_name'),
			text: t('one-to-many-transfer.seo.step_3_text'),
			description: t('one-to-many-transfer.seo.step_3_description')
		},
		{
			name: t('one-to-many-transfer.seo.step_4_name'),
			text: t('one-to-many-transfer.seo.step_4_text'),
			description: t('one-to-many-transfer.seo.step_4_description')
		},
		{
			name: t('one-to-many-transfer.seo.step_5_name'),
			text: t('one-to-many-transfer.seo.step_5_text'),
			description: t('one-to-many-transfer.seo.step_5_description')
		}
	];

	// Generate structured data from steps config
	const webAppData = createWebAppData({
		name: t('one-to-many-transfer.seo.webapp_name'),
		description: t('one-to-many-transfer.seo.webapp_description'),
		canonical,
		features: [
			t('one-to-many-transfer.seo.feature_1'),
			t('one-to-many-transfer.seo.feature_2'),
			t('one-to-many-transfer.seo.feature_3'),
			t('one-to-many-transfer.seo.feature_4'),
			t('one-to-many-transfer.seo.feature_5')
		]
	});

	const howToData = createHowToData({
		name: t('one-to-many-transfer.seo.howto_name'),
		description: t('one-to-many-transfer.seo.howto_description'),
		canonical,
		image,
		steps,
		tools: [t('one-to-many-transfer.seo.howto_tool_1'), t('one-to-many-transfer.seo.howto_tool_2')]
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
			title: t('one-to-many-transfer.seo.page_title'),
			description: t('one-to-many-transfer.seo.page_description'),
			keywords: t('one-to-many-transfer.seo.keywords'),
			canonical,
			type: 'website' as const,
			image,
			locale: seoLocaleMap[locale] || 'en_US'
		},
		steps,
		structuredData: [webAppData, howToData]
	};
};
