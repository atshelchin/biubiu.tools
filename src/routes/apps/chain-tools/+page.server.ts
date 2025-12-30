import type { PageServerLoad } from './$types';
import { createWebAppData } from '$lib/utils/structured-data';
import { createT } from '$i18n/translations';
import { extractLocaleFromPathname } from '$utils/common';

export const load: PageServerLoad = (event) => {
	const { url } = event;

	// Extract locale from URL pathname
	const locale = extractLocaleFromPathname(url.pathname) || 'en';

	// Create translation function for this request
	const t = createT(event);

	const canonical = url.origin + url.pathname;
	const image = `${url.origin}/og-chain-tools.png`;

	// Generate structured data
	const webAppData = createWebAppData({
		name: t('routes/apps/chain-tools/chain-tools.seo.webapp_name'),
		description: t('routes/apps/chain-tools/chain-tools.seo.webapp_description'),
		canonical,
		features: [
			t('routes/apps/chain-tools/chain-tools.seo.feature_1'),
			t('routes/apps/chain-tools/chain-tools.seo.feature_2'),
			t('routes/apps/chain-tools/chain-tools.seo.feature_3'),
			t('routes/apps/chain-tools/chain-tools.seo.feature_4')
		]
	});

	// ItemList structured data for tool directory
	const itemListData = {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name: t('routes/apps/chain-tools/chain-tools.seo.webapp_name'),
		description: t('routes/apps/chain-tools/chain-tools.seo.webapp_description'),
		numberOfItems: 25,
		itemListElement: [
			{
				'@type': 'ListItem',
				position: 1,
				name: 'Uniswap',
				url: 'https://app.uniswap.org'
			},
			{
				'@type': 'ListItem',
				position: 2,
				name: 'Aave',
				url: 'https://app.aave.com'
			},
			{
				'@type': 'ListItem',
				position: 3,
				name: 'Dune Analytics',
				url: 'https://dune.com'
			}
		]
	};

	// Map locale to SEO locale format
	const seoLocaleMap: Record<string, string> = {
		en: 'en_US',
		zh: 'zh_CN',
		ja: 'ja_JP',
		fr: 'fr_FR'
	};

	return {
		meta: {
			title: t('routes/apps/chain-tools/chain-tools.seo.page_title'),
			description: t('routes/apps/chain-tools/chain-tools.seo.page_description'),
			keywords: t('routes/apps/chain-tools/chain-tools.seo.keywords'),
			canonical,
			type: 'website' as const,
			image,
			locale: seoLocaleMap[locale] || 'en_US'
		},
		structuredData: [webAppData, itemListData]
	};
};
