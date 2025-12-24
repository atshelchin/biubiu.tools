import type { PageServerLoad } from './$types';
import { allChains, getChainStats } from '@/features/chains/data/chains';
import { createT } from '$i18n/translations';
import { extractLocaleFromPathname } from '$utils/common';

export const load: PageServerLoad = (event) => {
	const { url } = event;

	// Extract locale from URL pathname
	const locale = extractLocaleFromPathname(url.pathname) || 'en';

	// Create translation function for this request
	const t = createT(event);

	const canonical = url.origin + url.pathname;
	const image = `${url.origin}/og-chains.png`;

	const stats = getChainStats();

	const title = `${t('chains.title')} - ${stats.totalChains} EVM Networks | BiuBiu Tools`;
	const description = `${t('chains.subtitle')}. Browse ${stats.mainnetChains} mainnets and ${stats.testnetChains} testnets. Find RPC endpoints, block explorers, and network information for all EVM-compatible blockchains.`;
	const keywords =
		'EVM chains, blockchain networks, RPC endpoints, chain ID, Ethereum, Polygon, BSC, Arbitrum, Optimism, Base, blockchain explorer, web3';

	// Map locale to SEO locale format
	const seoLocaleMap: Record<string, string> = {
		en: 'en_US',
		zh: 'zh_CN'
	};

	// Structured data
	const structuredData = [
		{
			'@context': 'https://schema.org',
			'@type': 'WebPage',
			name: title,
			description,
			url: canonical,
			inLanguage: locale,
			isPartOf: {
				'@type': 'WebSite',
				name: 'BiuBiu Tools',
				url: url.origin
			}
		},
		{
			'@context': 'https://schema.org',
			'@type': 'ItemList',
			name: t('chains.title'),
			description: t('chains.subtitle'),
			numberOfItems: stats.totalChains,
			itemListElement: allChains.slice(0, 10).map((chain, index) => ({
				'@type': 'ListItem',
				position: index + 1,
				name: chain.name,
				url: `${url.origin}/chains/${chain.chainSlug || chain.shortName || chain.chainId}`
			}))
		}
	];

	return {
		chains: allChains,
		stats,
		meta: {
			title,
			description,
			keywords,
			canonical,
			type: 'website' as const,
			image,
			locale: seoLocaleMap[locale] || 'en_US'
		},
		structuredData
	};
};
