import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { I18n } from '@shelchin/i18n';
import { extractLocaleFromPathname } from '@shelchin/i18n/utils';
import type { PackageLocales } from '@shelchin/i18n';
import en from '../../../i18n/locales/en.json';
import zh from '../../../i18n/locales/zh.json';
import {
	getChainBySlug,
	getChainById,
	parseRpcEndpoints
} from '@/features/chains/data/chains';
import type { ChainPageData } from '@/features/chains/types';

export const load: PageLoad = ({ url, params }): ChainPageData => {
	const slug = params.slug;

	// Try to find chain by slug or chainId
	let chain = getChainBySlug(slug);
	if (!chain) {
		// Try parsing as chainId
		const chainId = parseInt(slug, 10);
		if (!isNaN(chainId)) {
			chain = getChainById(chainId);
		}
	}

	if (!chain) {
		throw error(404, 'Chain not found');
	}

	// Extract locale from URL pathname
	const locale = extractLocaleFromPathname(url.pathname) || 'en';

	// Create i18n instance for this request
	const locales = { en, zh } as unknown as PackageLocales;
	const i18n = new I18n(locale);
	i18n.register('__default__', locales);
	const t = i18n.t.bind(i18n);

	// Parse RPC endpoints
	const parsedRpcs = parseRpcEndpoints(chain);

	// Build canonical URL
	const canonical = url.origin + url.pathname;
	const image = `${url.origin}/og-chains.png`;

	// Build SEO metadata
	const networkType = chain.isTestnet ? t('chains.testnet') : t('chains.mainnet');

	const title = `${chain.name} (Chain ID: ${chain.chainId}) - RPC Endpoints & Info | BiuBiu Tools`;
	const description = t('chains.seo.description', {
		name: chain.name,
		chainId: chain.chainId,
		symbol: chain.nativeCurrency?.symbol || chain.chain,
		rpcCount: parsedRpcs.length,
		networkType
	});

	const keywords = [
		chain.name,
		`chain ${chain.chainId}`,
		`${chain.name} RPC`,
		`${chain.name} endpoint`,
		chain.nativeCurrency?.symbol,
		chain.chain,
		'EVM',
		'blockchain',
		'RPC URL',
		chain.isTestnet ? 'testnet' : 'mainnet'
	]
		.filter(Boolean)
		.join(', ');

	// Map locale to SEO locale format
	const seoLocaleMap: Record<string, string> = {
		en: 'en_US',
		zh: 'zh_CN'
	};

	// Generate structured data
	const structuredData = [
		// WebPage
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
		// TechArticle for technical information
		{
			'@context': 'https://schema.org',
			'@type': 'TechArticle',
			headline: `${chain.name} Network Information`,
			description: `Technical details and RPC endpoints for ${chain.name} blockchain network`,
			author: {
				'@type': 'Organization',
				name: 'BiuBiu Tools',
				url: 'https://biubiu.tools'
			},
			publisher: {
				'@type': 'Organization',
				name: 'BiuBiu Tools',
				url: 'https://biubiu.tools'
			},
			mainEntityOfPage: canonical,
			about: {
				'@type': 'Thing',
				name: chain.name,
				identifier: chain.chainId.toString()
			}
		},
		// BreadcrumbList
		{
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{
					'@type': 'ListItem',
					position: 1,
					name: 'Home',
					item: url.origin
				},
				{
					'@type': 'ListItem',
					position: 2,
					name: t('chains.title'),
					item: `${url.origin}/chains`
				},
				{
					'@type': 'ListItem',
					position: 3,
					name: chain.name,
					item: canonical
				}
			]
		}
	];

	return {
		chain,
		parsedRpcs,
		meta: {
			title,
			description,
			keywords,
			canonical,
			type: 'website',
			image,
			locale: seoLocaleMap[locale] || 'en_US'
		},
		structuredData
	};
};
