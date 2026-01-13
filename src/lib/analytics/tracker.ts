/**
 * Analytics Tracker
 *
 * Type-safe wrapper around Rybbit analytics API.
 * Provides centralized tracking with automatic attribution injection.
 */

import { browser } from '$app/environment';
import { EVENTS, type EventName, type EventPropsMap } from './events';
import { getAttribution } from './attribution';

// Rybbit global type
declare global {
	interface Window {
		rybbit?: {
			event: (name: string, properties?: Record<string, unknown>) => void;
			pageview: () => void;
			identify: (userId: string, traits?: Record<string, unknown>) => void;
		};
	}
}

/**
 * Check if Rybbit is available
 */
function isRybbitAvailable(): boolean {
	return browser && typeof window.rybbit !== 'undefined';
}

/**
 * Track a typed event
 */
export function trackEvent<T extends EventName>(
	eventName: T,
	properties: T extends keyof EventPropsMap ? EventPropsMap[T] : Record<string, unknown>
): void {
	if (!isRybbitAvailable()) {
		// Log in development for debugging
		if (browser && import.meta.env.DEV) {
			console.log('[Analytics]', eventName, properties);
		}
		return;
	}

	window.rybbit!.event(eventName, properties as unknown as Record<string, unknown>);
}

/**
 * Track purchase event with automatic attribution injection
 */
export function trackPurchase(props: { tool: string; amount: number; currency?: string }): void {
	const attribution = getAttribution();

	trackEvent(EVENTS.PURCHASE, {
		tool: props.tool,
		amount: props.amount,
		currency: props.currency || 'USD',
		...attribution
	});
}

/**
 * Track a manual pageview
 */
export function trackPageview(): void {
	if (!isRybbitAvailable()) return;
	window.rybbit!.pageview();
}

/**
 * Identify a user (optional - for logged-in users)
 */
export function identifyUser(userId: string, traits?: Record<string, unknown>): void {
	if (!isRybbitAvailable()) return;
	window.rybbit!.identify(userId, traits);
}

// ============================================================================
// Convenience Functions for Common Events
// ============================================================================

import { type SectionName, type PersonaType } from './events';

/**
 * Track scroll depth when user reaches a section
 */
export function trackScrollDepth(section: SectionName, percent: number): void {
	trackEvent(EVENTS.SCROLL_DEPTH, { section, percent });
}

/**
 * Track persona carousel view
 */
export function trackPersonaView(persona: PersonaType, painPoint: string, auto: boolean): void {
	trackEvent(EVENTS.PERSONA_VIEW, {
		persona,
		pain_point: painPoint,
		auto
	});
}

/**
 * Track persona tab click
 */
export function trackPersonaClick(fromPersona: PersonaType, toPersona: PersonaType): void {
	trackEvent(EVENTS.PERSONA_CLICK, {
		from_persona: fromPersona,
		to_persona: toPersona
	});
}

/**
 * Track dice roll action
 */
export function trackDiceRoll(persona: PersonaType): void {
	trackEvent(EVENTS.DICE_ROLL, { persona });
}

/**
 * Track dice result
 */
export function trackDiceResult(tool: string, persona: PersonaType): void {
	trackEvent(EVENTS.DICE_RESULT, { tool, persona });
}

/**
 * Track tool click
 */
export function trackToolClick(
	tool: string,
	section: SectionName,
	locale: string,
	persona?: PersonaType
): void {
	trackEvent(EVENTS.TOOL_CLICK, {
		tool,
		section,
		locale,
		persona
	});
}

/**
 * Track CTA button click
 */
export function trackCTAClick(
	variant: string,
	buttonType: 'primary' | 'secondary',
	section: SectionName
): void {
	trackEvent(EVENTS.CTA_CLICK, {
		variant,
		button_type: buttonType,
		section
	});
}

/**
 * Track tool usage action
 */
export function trackToolUse(tool: string, action: string): void {
	trackEvent(EVENTS.TOOL_USE, { tool, action });
}
