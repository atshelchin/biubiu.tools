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
	structuredData: Array<Record<string, unknown>>;
}

/**
 * Social links for a tool
 */
export interface ToolSocialLinks {
	twitter?: string;
	discord?: string;
	telegram?: string;
	github?: string;
	docs?: string;
}

/**
 * FAQ item
 */
export interface ToolFAQ {
	question: string;
	answer: string;
}

/**
 * Tool detail page extended data
 * Used for rich content pages with SEO optimization
 *
 * Note: Text content uses i18n keys, actual content is in translation files
 */
export interface ToolDetail {
	id: string; // Matches ExternalTool.id

	// i18n key prefix for this tool's content
	// e.g., 'chain-tools-detail.tools.uniswap'
	i18nKeyPrefix: string;

	// Number of content items (for rendering)
	featureCount: number; // Number of features (5-8)
	useCaseCount: number; // Number of use cases (3-5)
	faqCount: number; // Number of FAQs (4-6)

	// Project info (not translated - factual data)
	founded?: string; // Year founded
	team?: string; // Team name/info
	funding?: string; // Funding info

	// Social links (URLs, not translated)
	socialLinks?: ToolSocialLinks;

	// Related tools (tool IDs, not translated)
	relatedTools: string[];

	// Metadata
	lastUpdated: string; // ISO date string
}

/**
 * Tool detail page data for SSR
 */
export interface ToolDetailPageData {
	tool: ExternalTool;
	detail: ToolDetail;
	category: Category;
	relatedToolsData: ExternalTool[];
	meta: {
		title: string;
		description: string;
		keywords: string;
		canonical: string;
		type: 'website';
		image: string;
		locale: string;
	};
	structuredData: Array<Record<string, unknown>>;
}
