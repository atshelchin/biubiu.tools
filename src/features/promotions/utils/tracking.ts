/**
 * Tracking URL Generation
 *
 * Generates URLs with UTM parameters for analytics.
 * Only used client-side after hydration.
 */

import { checkConsent } from '@shelchin/cookie-consent';
import type { TrackingContext } from '../types';
import { getUTCTimeInfo } from './rotation';

/**
 * Get user's timezone offset as string (e.g., '+8', '-5', '+0')
 */
function getTimezoneOffset(): string {
	const offset = -new Date().getTimezoneOffset() / 60;
	const sign = offset >= 0 ? '+' : '';
	return `${sign}${offset}`;
}

/**
 * Get device type based on viewport width
 */
function getDeviceType(): string {
	if (typeof window === 'undefined') return 'unknown';

	const width = window.innerWidth;
	if (width < 768) return 'mobile';
	if (width < 1024) return 'tablet';
	return 'desktop';
}

/**
 * Get user type from localStorage (respects analytics consent)
 */
function getUserType(): string {
	if (typeof window === 'undefined') return 'unknown';

	if (!checkConsent('analytics')) {
		return 'unknown';
	}

	const hasVisited = localStorage.getItem('visited');

	if (!hasVisited) {
		return 'new';
	}

	const firstVisit = parseInt(hasVisited);
	const daysSinceFirst = (Date.now() - firstVisit) / (1000 * 60 * 60 * 24);

	if (daysSinceFirst < 1) return 'new';
	if (daysSinceFirst < 7) return 'active';
	if (daysSinceFirst < 30) return 'returning';
	return 'dormant';
}

/**
 * Add UTM parameters to a path (works with relative paths)
 */
function addUTMToPath(
	path: string,
	params: {
		source: string;
		medium: string;
		campaign: string;
		content: string;
		term: string;
	}
): string {
	const searchParams = new URLSearchParams();
	searchParams.set('utm_source', params.source);
	searchParams.set('utm_medium', params.medium);
	searchParams.set('utm_campaign', params.campaign);
	searchParams.set('utm_content', params.content);
	searchParams.set('utm_term', params.term);

	const separator = path.includes('?') ? '&' : '?';
	return `${path}${separator}${searchParams.toString()}`;
}

/**
 * Add tracking parameters to a tool URL
 *
 * UTM Parameter Mapping:
 * - utm_source: Source page path (e.g., '/chains', '/address')
 * - utm_medium: Placement ID (e.g., 'bottom', 'sidebar', 'completion')
 * - utm_campaign: Time dimension (hour_dayOfWeek)
 * - utm_content: User context (locale_timezone)
 * - utm_term: Device and user type (device_userType)
 *
 * @param toolPath - The tool's URL path
 * @param context - Tracking context with source, placement, and locale
 * @returns URL with UTM parameters
 */
export function addTrackingParams(toolPath: string, context: TrackingContext): string {
	const { hour, dayOfWeek } = getUTCTimeInfo();
	const timezone = getTimezoneOffset();
	const deviceType = getDeviceType();
	const userType = getUserType();

	return addUTMToPath(toolPath, {
		source: context.sourcePath,
		medium: context.placement,
		campaign: `${hour}_${dayOfWeek}`,
		content: `${context.locale}_${timezone}`,
		term: `${deviceType}_${userType}`
	});
}

/**
 * Check if we're in a browser environment
 */
export function isBrowser(): boolean {
	return typeof window !== 'undefined';
}
