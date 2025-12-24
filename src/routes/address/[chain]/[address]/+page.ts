import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import {
	getAddress as getAddressData,
	getEntity,
	getAddressesByEntity,
	allNames
} from '@/features/address/data';
import { CHAIN_META } from '@/features/address/types';
import type { LabeledAddress, NameRecord, Entity } from '@/features/address/types';
import { isAddress, getAddress as toChecksumAddress } from 'viem';
import { createServerT } from '$i18n/server';
import { extractLocaleFromPathname } from '$utils/common';

export interface AddressDetailPageData {
	address: LabeledAddress;
	entity: Entity;
	chainId: number;
	relatedAddresses: LabeledAddress[];
	relatedNames: NameRecord[];
	isUnlisted: boolean;
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

export const load: PageLoad = ({ url, params }): AddressDetailPageData => {
	const chainId = parseInt(params.chain, 10);
	const addressParam = params.address;

	// Validate chain
	if (!CHAIN_META[chainId]) {
		throw error(404, 'Chain not found');
	}

	// Validate and normalize address format
	// First convert to lowercase for basic format validation (0x + 40 hex chars)
	const lowerAddress = addressParam.toLowerCase();
	if (!isAddress(lowerAddress)) {
		throw error(404, 'Invalid address format');
	}

	// Normalize address to checksum format
	const normalizedAddress = toChecksumAddress(lowerAddress);

	// Get address data (try original, lowercase, and normalized checksum)
	let address =
		getAddressData(addressParam, chainId) ||
		getAddressData(lowerAddress, chainId) ||
		getAddressData(normalizedAddress, chainId);
	let isUnlisted = false;

	// For unlisted addresses, create a dynamic record
	if (!address) {
		isUnlisted = true;
		// Create a minimal address record for unlisted addresses
		// Use checksum address for display
		address = {
			address: normalizedAddress,
			chainId,
			name: `${normalizedAddress.slice(0, 6)}...${normalizedAddress.slice(-4)}`,
			labels: ['eoa'],
			riskLevel: 'neutral',
			source: 'community',
			updatedAt: new Date().toISOString().split('T')[0]
		};
	}

	// Get entity info
	const entity = address.entityId ? getEntity(address.entityId) : getEntity('unknown');

	// Get related addresses (same entity, different addresses)
	const relatedAddresses = address.entityId
		? getAddressesByEntity(address.entityId)
				.filter((a) => a.address.toLowerCase() !== address.address.toLowerCase())
				.slice(0, 5)
		: [];

	// Get related names (names that resolve to this address)
	const relatedNames = allNames
		.filter((n) => n.address?.toLowerCase() === address.address.toLowerCase())
		.slice(0, 5);

	// Extract locale from URL pathname
	const locale = extractLocaleFromPathname(url.pathname) || 'en';

	// Create translation function for this request
	const t = createServerT(locale);

	// Build canonical URL
	const canonical = url.origin + url.pathname;
	const image = `${url.origin}/og-address.png`;

	// Build SEO metadata
	const chainName = CHAIN_META[chainId].name;
	const labelText = address.labels.map((l) => t(`address.labels.${l}`)).join(', ');

	const title = `${address.name} | ${entity.name} - ${chainName} Address | BiuBiu Tools`;
	const description = t('address.seo.detail_description', {
		name: address.name,
		entity: entity.name,
		chain: chainName,
		labels: labelText,
		address: `${address.address.slice(0, 10)}...${address.address.slice(-6)}`
	});

	const keywords = [
		address.name,
		entity.name,
		address.address,
		chainName,
		...address.labels,
		'ethereum address',
		'blockchain',
		'crypto wallet'
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
			'@type': 'Thing',
			name: address.name,
			description: address.description || `${entity.name} wallet address on ${chainName}`,
			identifier: address.address,
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
					name: chainName,
					item: `${url.origin}/address/${chainId}`
				},
				{
					'@type': 'ListItem',
					position: 4,
					name: address.name,
					item: canonical
				}
			]
		}
	];

	return {
		address,
		entity,
		chainId,
		relatedAddresses,
		relatedNames,
		isUnlisted,
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
