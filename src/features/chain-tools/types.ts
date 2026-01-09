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
 * Tool feature item
 */
export interface ToolFeature {
	title: string;
	description: string;
}

/**
 * Tool use case item
 */
export interface ToolUseCase {
	title: string;
	description: string;
}

/**
 * Tool about section (legacy format)
 */
export interface ToolAbout {
	overview: string;
	features: ToolFeature[];
	useCases: ToolUseCase[];
}

/**
 * Tool CTA section (legacy format)
 */
export interface ToolCTA {
	ready: string;
	button: string;
	note: string;
}

/**
 * Tool detail page extended data - i18n format
 * Used for rich content pages with SEO optimization
 *
 * Note: Text content uses i18n keys, actual content is in translation files
 */
export interface ToolDetailI18n {
	id: string; // Matches ExternalTool.id

	// i18n key prefix for this tool's content
	// e.g., 'routes/apps/chain-tools.tools.uniswap'
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
 * Tool detail page extended data - legacy format
 * Contains inline content instead of i18n keys
 */
export interface ToolDetailLegacy {
	about: ToolAbout;
	faqs: ToolFAQ[];
	cta: ToolCTA;
	relatedTools?: string[];
}

/**
 * Tool detail - supports both i18n and legacy formats
 */
export type ToolDetail = ToolDetailI18n | ToolDetailLegacy;

/**
 * Serializable version of ExternalTool (without Svelte component icon)
 * Used for server-side data that needs to be serialized
 */
export type SerializableExternalTool = Omit<ExternalTool, 'icon'>;

/**
 * Serializable version of Category (without Svelte component icon)
 */
export type SerializableCategory = Omit<Category, 'icon'>;

/**
 * Tool detail page data for SSR
 * Uses serializable versions of types to avoid Svelte component serialization issues
 */
export interface ToolDetailPageData {
	tool: SerializableExternalTool;
	detail: ToolDetail;
	category: SerializableCategory;
	relatedToolsData: SerializableExternalTool[];
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

// ============================================================================
// Category Guide System Types (Simplified - Long-form Article)
// ============================================================================

/**
 * Tool mention within article content
 * For embedding tool links naturally in the text
 */
export interface ToolMention {
	toolId: string;
	context?: string; // Optional context for why this tool is mentioned
}

/**
 * Case study with real on-chain evidence
 * All case studies must have verifiable sources
 */
export interface CaseStudy {
	id: string;
	titleKey: string; // i18n key
	descriptionKey: string; // i18n key
	// Verifiable sources (at least one required)
	txHash?: string; // Etherscan transaction hash
	duneQuery?: string; // Dune Analytics query URL
	sourceUrl?: string; // External article/source URL
	// Context
	date?: string; // When this happened
	profit?: string; // Profit amount if applicable
	relatedToolIds?: string[];
}

/**
 * Article section for structured long-form content
 */
export interface GuideSection {
	id: string;
	titleKey: string; // i18n key
	contentKey: string; // i18n key for main content (markdown supported)
	// Optional enhancements
	toolMentions?: ToolMention[]; // Tools to highlight in this section
	caseStudies?: CaseStudy[]; // Real examples with sources
	subsections?: GuideSection[]; // Nested sections for ToC
}

/**
 * Glossary term (kept for quick reference at article end)
 */
export interface GlossaryTerm {
	id: string;
	termKey: string; // i18n key for term name
	definitionKey: string; // i18n key for definition
	relatedToolIds?: string[];
}

/**
 * Simplified category guide - long-form article format
 * Focus on quality content with real examples
 */
export interface CategoryGuide {
	categoryId: CategoryId;

	// i18n key prefix for this guide
	// e.g., 'routes/apps/chain-tools/defi/guide'
	i18nKeyPrefix: string;

	// Article structure
	sections: GuideSection[];

	// Quick reference glossary (displayed at end)
	glossary: GlossaryTerm[];

	// Featured tools for this category (shown in sidebar/footer)
	featuredToolIds: string[];

	// Metadata
	lastUpdated: string;
	estimatedReadTime: string; // e.g., "15 min read"
}

/**
 * Guide page data for SSR
 */
export interface CategoryGuidePageData {
	guide: CategoryGuide;
	category: SerializableCategory;
	tools: SerializableExternalTool[];
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
