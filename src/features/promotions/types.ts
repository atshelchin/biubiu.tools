/**
 * Promotions Feature Types
 *
 * Internal link promotion system for cross-linking BiuBiu tools
 */

/**
 * A BiuBiu tool that can be promoted
 */
export interface PromotableTool {
	/** Unique tool identifier, matches route path segment */
	id: string;
	/** Route path (e.g., '/apps/token-deployer') */
	path: string;
	/** Lucide icon name */
	icon: string;
	/** i18n key for tool name */
	nameKey: string;
	/** i18n key for short description */
	descriptionKey: string;
	/** Tags for contextual matching */
	tags: string[];
}

/**
 * Placement configuration for a promotion zone
 */
export interface Placement {
	/** Unique placement identifier */
	id: string;
	/** Maximum number of promotions to show */
	maxCount: number;
	/** Pool of tool IDs available for this placement */
	toolPool: string[];
}

/**
 * A promotion instance ready for rendering
 */
export interface Promotion {
	/** The tool being promoted */
	tool: PromotableTool;
	/** Clean URL for SEO (no tracking params) */
	href: string;
	/** Placement ID this promotion belongs to */
	placement: string;
}

/**
 * Options for getting promotions
 */
export interface GetPromotionsOptions {
	/** Placement ID to get promotions for */
	placement: string;
	/** Number of promotions (defaults to placement.maxCount) */
	count?: number;
	/** Tool IDs to exclude (e.g., current tool) */
	exclude?: string[];
	/** Current site locale */
	locale: string;
}

/**
 * Context for tracking URL generation (client-side only)
 */
export interface TrackingContext {
	/** Source page pathname */
	sourcePath: string;
	/** Placement ID */
	placement: string;
	/** Current site locale */
	locale: string;
}
