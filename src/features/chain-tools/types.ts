import type { Component } from 'svelte';

/**
 * Tool category identifiers
 */
export type CategoryId =
	| 'featured'
	| 'defi'
	| 'nft'
	| 'analytics'
	| 'security'
	| 'bridge'
	| 'wallet'
	| 'explorer'
	| 'dev'
	| 'dao'
	| 'infra'
	| 'launchpad'
	| 'identity'
	| 'social'
	| 'l2'
	| 'gamefi'
	| 'payments'
	| 'funding'
	| 'news'
	| 'community'
	| 'jobs'
	| 'stablecoin'
	| 'oracle'
	| 'dao-token'
	| 'whale-address'
	| 'airdrop-token'
	| 'non-evm'
	| 'legendary-token'
	| 'mev'
	| 'privacy'
	| 'rwa'
	| 'ai-crypto'
	| 'restaking'
	| 'cex'
	| 'gas-burner'
	| 'trends'
	| 'web3-teams'
	| 'regulation'
	| 'influencer'
	| 'product-hunt';

/**
 * Category definition with i18n keys and styling
 */
export interface Category {
	id: CategoryId;
	labelKey: string;
	color: string;
	icon: Component;
}

/**
 * External tool definition
 */
export interface ExternalTool {
	id: string;
	name: string;
	descriptionKey: string;
	url: string;
	icon: Component;
	category: Exclude<CategoryId, 'featured'>;
	tags: string[];
	chains?: string[];
	color: string;
	isFeatured?: boolean;
}

/**
 * Page metadata for SEO
 */
export interface ChainToolsPageData {
	meta: {
		title: string;
		description: string;
		keywords: string;
		canonical: string;
		type: 'website';
		image: string;
		locale: string;
	};
	structuredData: object[];
}
