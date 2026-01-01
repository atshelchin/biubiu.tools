/**
 * Roadmap Types
 * Types for tracking tool development stages and recommendations
 */

/**
 * Development stage of a tool
 */
export type DevStage = 'planning' | 'development' | 'alpha' | 'beta' | 'stable' | 'deprecated';

/**
 * Stability level indicator
 */
export type StabilityLevel = 'experimental' | 'unstable' | 'stable' | 'production';

/**
 * Target audience for the tool
 */
export type TargetAudience = 'early-adopter' | 'developer' | 'power-user' | 'everyone';

/**
 * Recommendation level
 */
export type RecommendationLevel = 'recommended' | 'caution' | 'not-recommended';

/**
 * Roadmap item representing a single tool
 */
export interface RoadmapItem {
	/** Unique identifier */
	id: string;
	/** Tool name i18n key */
	nameKey: string;
	/** Tool description i18n key */
	descriptionKey: string;
	/** Route path (if available) */
	link?: string;
	/** Current development stage */
	stage: DevStage;
	/** Next planned stage */
	nextStage?: DevStage;
	/** Expected date for next stage (e.g., "2025-Q2", "2025-03") */
	expectedDate?: string;
	/** Stability level */
	stability: StabilityLevel;
	/** Target audience */
	targetAudience: TargetAudience[];
	/** Recommendation level */
	recommendation: RecommendationLevel;
	/** Completion percentage (0-100) */
	completionPercent: number;
	/** Theme color */
	color: string;
	/** Known issues i18n keys */
	knownIssueKeys?: string[];
	/** Changelog URL */
	changelogUrl?: string;
	/** Last updated date */
	lastUpdated?: string;
}

/**
 * Stage metadata for display
 */
export interface StageMetadata {
	stage: DevStage;
	labelKey: string;
	color: string;
	bgColor: string;
	order: number;
}

/**
 * Stability metadata for display
 */
export interface StabilityMetadata {
	level: StabilityLevel;
	labelKey: string;
	color: string;
	icon: string;
}

/**
 * Audience metadata for display
 */
export interface AudienceMetadata {
	audience: TargetAudience;
	labelKey: string;
	color: string;
}
