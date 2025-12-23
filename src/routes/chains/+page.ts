import type { PageLoad } from './$types';
import { I18n } from '@shelchin/i18n';
import { extractLocaleFromPathname } from '@shelchin/i18n/utils';
import type { PackageLocales } from '@shelchin/i18n';
import en from '../../i18n/locales/en.json';
import zh from '../../i18n/locales/zh.json';
import { allChains, getChainStats } from '@/features/chains/data/chains';

export const load: PageLoad = ({ url }) => {
	// Extract locale from URL pathname
	const locale = extractLocaleFromPathname(url.pathname) || 'en';

	// Create i18n instance for this request
	const locales = { en, zh } as unknown as PackageLocales;
	const i18n = new I18n(locale);
	i18n.register('__default__', locales);
	const t = i18n.t.bind(i18n);

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
