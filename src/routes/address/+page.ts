import type { PageLoad } from './$types';
import { I18n } from '@shelchin/i18n';
import { extractLocaleFromPathname } from '@shelchin/i18n/utils';
import type { PackageLocales } from '@shelchin/i18n';
import en from '../../i18n/locales/en.json';
import zh from '../../i18n/locales/zh.json';
import { allAddresses, allNames, stats } from '@/features/address/data';
import type { LabeledAddress, NameRecord } from '@/features/address/types';

export interface AddressIndexPageData {
	popularAddresses: LabeledAddress[];
	popularNames: NameRecord[];
	stats: typeof stats;
	meta: {
		title: string;
		description: string;
		keywords: string;
		canonical: string;
		type: 'website' | 'article';
		image: string;
		locale: string;
	};
	structuredData: Array<Record<string, unknown>>;
}

export const load: PageLoad = ({ url }): AddressIndexPageData => {
	// Extract locale from URL pathname
	const locale = extractLocaleFromPathname(url.pathname) || 'en';

	// Create i18n instance for this request
	const locales = { en, zh } as unknown as PackageLocales;
	const i18n = new I18n(locale);
	i18n.register('__default__', locales);
	const t = i18n.t.bind(i18n);

	// Get popular addresses (safe, verified)
	const popularAddresses = allAddresses
		.filter((addr) => addr.riskLevel === 'safe' && addr.source === 'verified')
		.slice(0, 20);

	// Get notable ENS names
	const popularNames = allNames.filter((name) => name.notable).slice(0, 20);

	// Build canonical URL
	const canonical = url.origin + url.pathname;
	const image = `${url.origin}/og-address.png`;

	// Build SEO metadata
	const title = t('address.seo.index_title');
	const description = t('address.seo.index_description', {
		addressCount: stats.totalAddresses,
		nameCount: stats.totalNames
	});

	const keywords = [
		'ethereum address',
		'wallet lookup',
		'contract address',
		'ENS name',
		'address labels',
		'blockchain explorer',
		'crypto wallet',
		'DeFi protocols',
		'NFT contracts',
		'exchange wallets'
	].join(', ');

	// Map locale to SEO locale format
	const seoLocaleMap: Record<string, string> = {
		en: 'en_US',
		zh: 'zh_CN'
	};

	// Generate structured data
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
					name: t('address.title'),
					item: canonical
				}
			]
		}
	];

	return {
		popularAddresses,
		popularNames,
		stats,
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
