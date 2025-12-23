import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { I18n } from '@shelchin/i18n';
import { extractLocaleFromPathname } from '@shelchin/i18n/utils';
import type { PackageLocales } from '@shelchin/i18n';
import en from '../../../i18n/locales/en.json';
import zh from '../../../i18n/locales/zh.json';
import { getName, getAddress, getEntity } from '@/features/address/data';
import type { NameRecord, LabeledAddress, Entity } from '@/features/address/types';
import {
	fetchENSRecords,
	formatSocialLink,
	type ENSRecords
} from '@/features/address/ens-resolver';

export interface SocialLink {
	platform: string;
	url: string;
	display: string;
}

export interface NameDetailPageData {
	name: NameRecord;
	entity?: Entity;
	resolvedAddress?: LabeledAddress;
	ensRecords?: ENSRecords;
	socialLinks: SocialLink[];
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

export const load: PageServerLoad = async ({ url, params }): Promise<NameDetailPageData> => {
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

	// Fetch ENS records via RPC (only for .eth domains)
	let ensRecords: ENSRecords | undefined;
	const socialLinks: SocialLink[] = [];

	if (name.type === 'ens' && name.name.endsWith('.eth')) {
		try {
			const records = await fetchENSRecords(name.name);
			if (records) {
				ensRecords = records;

				// Extract social links
				for (const [key, value] of Object.entries(records.textRecords)) {
					const link = formatSocialLink(key, value);
					if (link) {
						socialLinks.push(link);
					}
				}
			}
		} catch {
			// ENS fetch failed, continue without enriched data
		}
	}

	// Extract locale from URL pathname
	const locale = extractLocaleFromPathname(url.pathname) || 'en';

	// Create i18n instance for this request
	const locales = { en, zh } as unknown as PackageLocales;
	const i18n = new I18n(locale);
	i18n.register('__default__', locales);
	const t = i18n.t.bind(i18n);

	// Build canonical URL
	const canonical = url.origin + url.pathname;
	// Use avatar from ENS if available
	const image = ensRecords?.avatar || `${url.origin}/og-address.png`;

	// Determine name type label
	const nameTypeLabels: Record<string, string> = {
		ens: 'ENS',
		'spaceid-bnb': 'Space ID (.bnb)',
		'spaceid-arb': 'Space ID (.arb)',
		basename: 'Base Names',
		unstoppable: 'Unstoppable Domains'
	};

	const nameTypeLabel = nameTypeLabels[name.type] || name.type;

	// Build description with ENS records
	let descriptionParts: string[] = [];

	// Add basic info
	descriptionParts.push(
		name.description ||
			t('name.seo.detail_description', {
				name: name.name,
				type: nameTypeLabel,
				address: name.address
					? `${name.address.slice(0, 10)}...${name.address.slice(-6)}`
					: t('name.not_resolved')
			})
	);

	// Add social presence if available
	if (socialLinks.length > 0) {
		const platforms = socialLinks.map((l) => l.platform).join(', ');
		descriptionParts.push(`${t('name.social_presence')}: ${platforms}`);
	}

	// Add ENS description if available
	if (ensRecords?.textRecords['description']) {
		descriptionParts = [ensRecords.textRecords['description'], ...descriptionParts.slice(1)];
	}

	// Build SEO metadata
	const title = `${name.name} - ${nameTypeLabel} Domain | BiuBiu Tools`;
	const description = descriptionParts.join('. ');

	const keywords = [
		name.name,
		nameTypeLabel,
		name.address || '',
		entity?.name || '',
		...socialLinks.map((l) => l.platform),
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
	const structuredData: object[] = [
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
			description:
				ensRecords?.textRecords['description'] || name.description || `${nameTypeLabel} domain`,
			identifier: name.name,
			url: canonical,
			...(ensRecords?.avatar && { image: ensRecords.avatar })
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

	// Add Person structured data if we have social links
	if (socialLinks.length > 0 || ensRecords?.textRecords['description']) {
		const personData: Record<string, unknown> = {
			'@context': 'https://schema.org',
			'@type': 'Person',
			name: ensRecords?.textRecords['display'] || ensRecords?.textRecords['name'] || name.name,
			identifier: name.name
		};

		if (ensRecords?.avatar) {
			personData.image = ensRecords.avatar;
		}

		if (ensRecords?.textRecords['description']) {
			personData.description = ensRecords.textRecords['description'];
		}

		if (ensRecords?.textRecords['url']) {
			personData.url = ensRecords.textRecords['url'];
		}

		// Add sameAs for social profiles
		const sameAs = socialLinks
			.filter((l) => l.platform !== 'Email' && l.platform !== 'Website')
			.map((l) => l.url);

		if (sameAs.length > 0) {
			personData.sameAs = sameAs;
		}

		structuredData.push(personData);
	}

	return {
		name,
		entity,
		resolvedAddress,
		ensRecords,
		socialLinks,
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
