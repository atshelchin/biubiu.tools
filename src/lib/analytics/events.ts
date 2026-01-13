/**
 * Analytics Event Definitions
 *
 * Centralized event names and property types for type-safe tracking.
 * All events should be defined here to ensure consistency across the app.
 */

// ============================================================================
// Event Names
// ============================================================================

export const EVENTS = {
	// Page & Scroll Events
	SCROLL_DEPTH: 'scroll_depth',

	// Persona Carousel Events
	PERSONA_VIEW: 'persona_view',
	PERSONA_CLICK: 'persona_click',
	DICE_ROLL: 'dice_roll',
	DICE_RESULT: 'dice_result',

	// Tool Interaction Events
	TOOL_CLICK: 'tool_click',

	// CTA Events
	CTA_CLICK: 'cta_click',

	// Conversion Events
	TOOL_USE: 'tool_use',
	PURCHASE: 'purchase'
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

// ============================================================================
// Section Names (for scroll tracking & attribution)
// ============================================================================

export const SECTIONS = {
	HERO: 'hero',
	PERSONA: 'persona',
	FEATURES: 'features',
	CTA: 'cta',
	FAQ: 'faq',
	PRICING: 'pricing',
	NEWSLETTER: 'newsletter'
} as const;

export type SectionName = (typeof SECTIONS)[keyof typeof SECTIONS];

// ============================================================================
// Persona Types
// ============================================================================

export const PERSONAS = {
	DATA_ANALYST: 'data_analyst',
	DEVELOPER: 'developer',
	AIRDROP_HUNTER: 'airdrop_hunter'
} as const;

export type PersonaType = (typeof PERSONAS)[keyof typeof PERSONAS];

// ============================================================================
// Event Property Types
// ============================================================================

export interface ScrollDepthProps {
	section: SectionName;
	percent: number;
}

export interface PersonaViewProps {
	persona: PersonaType;
	pain_point: string;
	auto: boolean;
}

export interface PersonaClickProps {
	from_persona: PersonaType;
	to_persona: PersonaType;
}

export interface DiceRollProps {
	persona: PersonaType;
}

export interface DiceResultProps {
	tool: string;
	persona: PersonaType;
}

export interface ToolClickProps {
	tool: string;
	section: SectionName;
	persona?: PersonaType;
	locale: string;
}

export interface CTAClickProps {
	variant: string;
	button_type: 'primary' | 'secondary';
	section: SectionName;
}

export interface ToolUseProps {
	tool: string;
	action: string;
}

export interface PurchaseProps {
	tool: string;
	amount: number;
	currency: string;
	// Attribution fields (injected automatically)
	utm_source?: string;
	utm_medium?: string;
	utm_campaign?: string;
	utm_content?: string;
	utm_term?: string;
	first_visit?: string;
	landing_page?: string;
}

// ============================================================================
// Event Map (for type inference)
// ============================================================================

export interface EventPropsMap {
	[EVENTS.SCROLL_DEPTH]: ScrollDepthProps;
	[EVENTS.PERSONA_VIEW]: PersonaViewProps;
	[EVENTS.PERSONA_CLICK]: PersonaClickProps;
	[EVENTS.DICE_ROLL]: DiceRollProps;
	[EVENTS.DICE_RESULT]: DiceResultProps;
	[EVENTS.TOOL_CLICK]: ToolClickProps;
	[EVENTS.CTA_CLICK]: CTAClickProps;
	[EVENTS.TOOL_USE]: ToolUseProps;
	[EVENTS.PURCHASE]: PurchaseProps;
}
