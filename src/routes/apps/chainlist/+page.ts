import type { PageLoad } from './$types';
import type { Chain, RpcEndpoint, Explorer } from '@/features/chainlist/types/chain';
import { createWebAppData, createHowToData, type HowToStepData } from '$lib/utils/structured-data';
import { I18n } from '@shelchin/i18n';
import { extractLocaleFromPathname } from '@shelchin/i18n/utils';
import en from '../../../i18n/locales/en.json';
import zh from '../../../i18n/locales/zh.json';
import type { PackageLocales } from '@shelchin/i18n';

// Dedupe arrays by a key field (keep first occurrence)
function dedupeByKey<T>(items: T[], keyFn: (item: T) => string): T[] {
	const seen = new Set<string>();
	return items.filter((item) => {
		const key = keyFn(item);
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}

export const load: PageLoad = async ({ fetch, url }) => {
	// Extract locale from URL pathname
	const locale = extractLocaleFromPathname(url.pathname) || 'en';

	// Create i18n instance for this request
	const locales = { en, zh } as unknown as PackageLocales;
	const i18n = new I18n(locale);
	i18n.register('__default__', locales);
	const t = i18n.t.bind(i18n);

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
