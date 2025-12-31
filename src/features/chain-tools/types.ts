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
// Category Guide System Types
// ============================================================================

/**
 * Tool relation types for ecosystem visualization
 */
export type ToolRelationType =
	| 'fork' // SushiSwap fork of Uniswap
	| 'competitor' // Aave vs Compound
	| 'depends_on' // Yearn depends on Curve
	| 'integrates' // 1inch integrates Uniswap
	| 'built_on' // Convex built on Curve
	| 'same_ecosystem'; // Same team/ecosystem

/**
 * Relation between two tools
 */
export interface ToolRelation {
	sourceId: string;
	targetId: string;
	type: ToolRelationType;
	descriptionKey?: string; // i18n key for relation description
}

/**
 * Sub-category within a main category
 * e.g., "DEX", "Lending", "Stablecoin" within DeFi
 */
export interface SubCategory {
	id: string;
	labelKey: string; // i18n key
	descriptionKey: string; // i18n key
	toolIds: string[]; // Tools in this sub-category
}

/**
 * Core project with additional context for learning
 */
export interface CoreProject {
	toolId: string;
	significanceKey: string; // i18n key: why this project matters
	tier: 1 | 2 | 3; // 1 = must know, 2 = should know, 3 = nice to know
}

/**
 * Learning task in a phase
 */
export interface LearningTask {
	id: string;
	actionKey: string; // i18n key: what to do
	type: 'read' | 'research' | 'practice' | 'quiz';
	toolId?: string; // Related tool (optional)
	link?: string; // External link (optional)
}

/**
 * Learning phase in the learning path
 */
export interface LearningPhase {
	id: string;
	titleKey: string; // i18n key
	descriptionKey: string; // i18n key
	estimatedDays: string; // e.g., "3-5 days"
	tasks: LearningTask[];
	coreToolIds: string[]; // Key tools for this phase
}

/**
 * Glossary term
 */
export interface GlossaryTerm {
	id: string;
	termKey: string; // i18n key for term name
	definitionKey: string; // i18n key for definition
	relatedToolIds?: string[];
	relatedTermIds?: string[];
}

/**
 * Quiz question types
 */
export type QuizQuestionType =
	| 'single_choice'
	| 'multiple_choice'
	| 'true_false'
	| 'matching'
	| 'ordering';

/**
 * Quiz question
 */
export interface QuizQuestion {
	id: string;
	type: QuizQuestionType;
	difficulty: 'beginner' | 'intermediate' | 'expert';
	questionKey: string; // i18n key
	optionKeys: string[]; // i18n keys for options
	correctAnswers: number[]; // Indices of correct options
	explanationKey: string; // i18n key
	relatedToolIds?: string[];
	tags: string[]; // For categorizing scores
}

/**
 * Quiz achievement level
 */
export interface QuizAchievement {
	minScore: number; // Minimum percentage (0-1)
	titleKey: string; // i18n key
	badge: string; // Emoji or icon identifier
}

/**
 * Complete quiz data for a category
 */
export interface CategoryQuiz {
	categoryId: CategoryId;
	questions: QuizQuestion[];
	achievements: QuizAchievement[];
}

/**
 * Complete guide data for a category
 * All text content uses i18n keys
 */
export interface CategoryGuide {
	categoryId: CategoryId;

	// i18n key prefix for this guide
	// e.g., 'routes/apps/chain-tools/guide/defi'
	i18nKeyPrefix: string;

	// Content structure (counts for rendering)
	fundamentalsCount: number; // Number of fundamental sections
	ecosystemSubCategories: SubCategory[];
	coreProjects: CoreProject[];
	learningPath: LearningPhase[];
	glossary: GlossaryTerm[];

	// Tool relations for ecosystem graph
	relations: ToolRelation[];

	// Quiz
	quiz: CategoryQuiz;

	// Metadata
	lastUpdated: string;
}

/**
 * User's progress for a category (stored in localStorage)
 */
export interface UserCategoryProgress {
	categoryId: CategoryId;

	// Reading progress
	readSections: string[]; // Section IDs that have been read

	// Tool status
	toolStatus: Record<string, 'viewed' | 'learning' | 'mastered' | 'bookmarked'>;

	// Quiz attempts
	quizAttempts: {
		difficulty: 'beginner' | 'intermediate' | 'expert';
		score: number;
		totalQuestions: number;
		wrongQuestionIds: string[];
		timestamp: number;
	}[];

	// Learning path progress
	learningPathProgress: {
		currentPhase: number;
		completedTaskIds: string[];
	};

	// Best achievement
	bestAchievement?: {
		titleKey: string;
		badge: string;
		score: number;
	};

	// Timestamps
	lastVisited: number;
	startedAt: number;
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
