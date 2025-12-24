import type { PageServerLoad } from './$types';
import { allAddresses, allNames, stats } from '@/features/address/data';
import type { LabeledAddress, NameRecord } from '@/features/address/types';
import { createT } from '$i18n/translations';
import { extractLocaleFromPathname } from '$utils/common';

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

export const load: PageServerLoad = (event): AddressIndexPageData => {
	const { url } = event;

	// Extract locale from URL pathname
	const locale = extractLocaleFromPathname(url.pathname) || 'en';

	// Create translation function for this request
	const t = createT(event);

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
