import type { Component } from 'svelte';

/**
 * Tool category identifiers
 */
export type CategoryId =
	| 'featured'
	| 'all'
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
	| 'payments';

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
	category: Exclude<CategoryId, 'all' | 'featured'>;
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
