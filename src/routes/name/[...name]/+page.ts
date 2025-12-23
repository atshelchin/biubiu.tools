import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { I18n } from '@shelchin/i18n';
import { extractLocaleFromPathname } from '@shelchin/i18n/utils';
import type { PackageLocales } from '@shelchin/i18n';
import en from '../../../i18n/locales/en.json';
import zh from '../../../i18n/locales/zh.json';
import { getName, getAddress, getEntity } from '@/features/address/data';
import type { NameRecord, LabeledAddress, Entity } from '@/features/address/types';

export interface NameDetailPageData {
	name: NameRecord;
	entity?: Entity;
	resolvedAddress?: LabeledAddress;
	meta: {
		title: string;
		description: string;
		keywords: string;
		canonical: string;
		type: string;
		image: string;
		locale: string;
	};
	structuredData: object[];
}

export const load: PageLoad = ({ url, params }): NameDetailPageData => {
	const nameParam = params.name;

	// Get name data
	const name = getName(nameParam);
	if (!name) {
		throw error(404, 'Name not found');
	}

	// Get entity if exists
	const entity = name.entityId ? getEntity(name.entityId) : undefined;

	// Get resolved address if exists
	const resolvedAddress = name.address ? getAddress(name.address, 1) : undefined;

	// Extract locale from URL pathname
	const locale = extractLocaleFromPathname(url.pathname) || 'en';

	// Create i18n instance for this request
	const locales = { en, zh } as unknown as PackageLocales;
	const i18n = new I18n(locale);
	i18n.register('__default__', locales);
	const t = i18n.t.bind(i18n);

	// Build canonical URL
	const canonical = url.origin + url.pathname;
	const image = `${url.origin}/og-address.png`;

	// Determine name type label
	const nameTypeLabels: Record<string, string> = {
		ens: 'ENS',
		'spaceid-bnb': 'Space ID (.bnb)',
		'spaceid-arb': 'Space ID (.arb)',
		basename: 'Base Names',
		unstoppable: 'Unstoppable Domains'
	};

	const nameTypeLabel = nameTypeLabels[name.type] || name.type;

	// Build SEO metadata
	const title = `${name.name} - ${nameTypeLabel} Domain | BiuBiu Tools`;
	const description = name.description
		? `${name.name}: ${name.description}. ${t('name.seo.suffix')}`
		: t('name.seo.detail_description', {
			name: name.name,
			type: nameTypeLabel,
			address: name.address
				? `${name.address.slice(0, 10)}...${name.address.slice(-6)}`
				: t('name.not_resolved')
		});

	const keywords = [
		name.name,
		nameTypeLabel,
		name.address || '',
		entity?.name || '',
		'ENS domain',
		'web3 name',
		'blockchain identity',
		'crypto domain'
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
			'@type': 'Thing',
			name: name.name,
			description: name.description || `${nameTypeLabel} domain`,
			identifier: name.name,
			url: canonical
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
					name: name.name,
					item: canonical
				}
			]
		}
	];

	return {
		name,
		entity,
		resolvedAddress,
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
