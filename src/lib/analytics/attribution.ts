/**
 * Attribution Tracking
 *
 * Captures and persists UTM parameters for conversion attribution.
 * Uses first-touch attribution (saves only on first visit).
 */

import { browser } from '$app/environment';

const STORAGE_KEY = 'biubiu_attribution';

export interface Attribution {
	utm_source?: string;
	utm_medium?: string;
	utm_campaign?: string;
	utm_content?: string;
	utm_term?: string;
	first_visit: string;
	landing_page: string;
	referrer?: string;
}

/**
 * Extract UTM parameters from current URL
 */
function extractUTMParams(): Partial<Attribution> {
	if (!browser) return {};

	const params = new URLSearchParams(window.location.search);

	return {
		utm_source: params.get('utm_source') || undefined,
		utm_medium: params.get('utm_medium') || undefined,
		utm_campaign: params.get('utm_campaign') || undefined,
		utm_content: params.get('utm_content') || undefined,
		utm_term: params.get('utm_term') || undefined
	};
}

/**
 * Save attribution data on first visit (first-touch attribution)
 * Call this on app initialization
 */
export function captureAttribution(): void {
	if (!browser) return;

	// Only save if not already captured
	if (localStorage.getItem(STORAGE_KEY)) return;

	const utmParams = extractUTMParams();

	const attribution: Attribution = {
		...utmParams,
		first_visit: new Date().toISOString(),
		landing_page: window.location.pathname,
		referrer: document.referrer || undefined
	};

	localStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
}

/**
 * Get stored attribution data
 */
export function getAttribution(): Partial<Attribution> {
	if (!browser) return {};

	const data = localStorage.getItem(STORAGE_KEY);
	if (!data) return {};

	try {
		return JSON.parse(data) as Attribution;
	} catch {
		return {};
	}
}

/**
 * Check if user has attribution data
 */
export function hasAttribution(): boolean {
	if (!browser) return false;
	return localStorage.getItem(STORAGE_KEY) !== null;
}

/**
 * Clear attribution data (for testing or reset)
 */
export function clearAttribution(): void {
	if (!browser) return;
	localStorage.removeItem(STORAGE_KEY);
}

/**
 * Build UTM query string for internal links
 */
export function buildUTMParams(params: {
	source: string;
	medium: string;
	campaign?: string;
	content?: string;
	term?: string;
}): string {
	const searchParams = new URLSearchParams();

	searchParams.set('utm_source', params.source);
	searchParams.set('utm_medium', params.medium);

	if (params.campaign) searchParams.set('utm_campaign', params.campaign);
	if (params.content) searchParams.set('utm_content', params.content);
	if (params.term) searchParams.set('utm_term', params.term);

	return searchParams.toString();
}

/**
 * Add UTM parameters to a URL
 */
export function addUTMToUrl(
	url: string,
	params: {
		source: string;
		medium: string;
		campaign?: string;
		content?: string;
		term?: string;
	}
): string {
	const utmString = buildUTMParams(params);
	const separator = url.includes('?') ? '&' : '?';
	return `${url}${separator}${utmString}`;
}
