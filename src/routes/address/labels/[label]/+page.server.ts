import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getAddressesByLabel } from '@/features/address/data';
import { LABEL_META } from '@/features/address/types';
import type { LabeledAddress, AddressLabel } from '@/features/address/types';
import { createT } from '$i18n/translations';
import { extractLocaleFromPathname, buildCanonicalUrl } from '$utils/common';
import type { TranslationKeys } from '@shelchin/i18n';

export interface LabelPageData {
	label: AddressLabel;
	addresses: LabeledAddress[];
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

export const load: PageServerLoad = (event): LabelPageData => {
	const { url, params } = event;
	const labelParam = params.label as AddressLabel;

	// Validate label
	if (!LABEL_META[labelParam]) {
		throw error(404, 'Label not found');
	}

	// Get addresses with this label
	const addresses = getAddressesByLabel(labelParam);

	// Extract locale from URL pathname
	const locale = extractLocaleFromPathname(url.pathname) || 'en';

	// Create translation function for this request
	const t = createT(event);

	// Build canonical URL
	const canonical = buildCanonicalUrl(url);
	const image = `${url.origin}/og-address.png`;

	// Get translated label name
	const labelName = t(`address.labels.${labelParam}` as keyof TranslationKeys);

	// Build SEO metadata
	const title = `${labelName} Addresses - Blockchain Address Directory | BiuBiu Tools`;
	const description = `Browse ${addresses.length} ${labelName.toLowerCase()} addresses. Find verified wallet addresses for ${labelName.toLowerCase()} entities.`;

	const keywords = [
		labelName,
		`${labelName} addresses`,
		`${labelName} wallets`,
		'blockchain addresses',
		'crypto wallets',
		'ethereum addresses'
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
			'@type': 'CollectionPage',
			name: title,
			description,
			url: canonical,
			inLanguage: locale,
			numberOfItems: addresses.length,
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
					item: `${url.origin}/address`
				},
				{
					'@type': 'ListItem',
					position: 3,
					name: 'Labels',
					item: `${url.origin}/address/labels`
				},
				{
					'@type': 'ListItem',
					position: 4,
					name: labelName,
					item: canonical
				}
			]
		}
	];

	return {
		label: labelParam,
		addresses,
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
