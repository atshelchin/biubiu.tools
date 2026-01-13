/**
 * Analytics Module
 *
 * Centralized analytics for biubiu.tools
 * - Type-safe event tracking
 * - UTM attribution
 * - Rybbit integration
 *
 * Usage:
 * ```ts
 * import { trackToolClick, captureAttribution, EVENTS, SECTIONS } from '$lib/analytics';
 *
 * // On app init
 * captureAttribution();
 *
 * // Track events
 * trackToolClick('wallet-sweep', SECTIONS.FEATURES, 'en');
 * ```
 */

// Event definitions
export {
	EVENTS,
	SECTIONS,
	PERSONAS,
	type EventName,
	type SectionName,
	type PersonaType,
	type EventPropsMap,
	type ScrollDepthProps,
	type PersonaViewProps,
	type PersonaClickProps,
	type DiceRollProps,
	type DiceResultProps,
	type ToolClickProps,
	type CTAClickProps,
	type ToolUseProps,
	type PurchaseProps
} from './events';

// Attribution
export {
	captureAttribution,
	getAttribution,
	hasAttribution,
	clearAttribution,
	buildUTMParams,
	addUTMToUrl,
	type Attribution
} from './attribution';

// Tracker
export {
	trackEvent,
	trackPageview,
	trackPurchase,
	identifyUser,
	// Convenience functions
	trackScrollDepth,
	trackPersonaView,
	trackPersonaClick,
	trackDiceRoll,
	trackDiceResult,
	trackToolClick,
	trackCTAClick,
	trackToolUse
} from './tracker';
