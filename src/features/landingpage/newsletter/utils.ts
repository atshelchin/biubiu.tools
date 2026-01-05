import type { DeviceInfo, LocaleInfo } from './types';

/**
 * Detect device type based on screen width and user agent
 */
function detectDeviceType(): DeviceInfo['deviceType'] {
	if (typeof window === 'undefined') return 'desktop';

	const ua = navigator.userAgent.toLowerCase();
	const width = window.innerWidth;

	// Check user agent for mobile/tablet indicators
	const isMobile = /iphone|ipod|android.*mobile|windows phone|blackberry/i.test(ua);
	const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(ua);

	if (isMobile || width < 768) return 'mobile';
	if (isTablet || (width >= 768 && width < 1024)) return 'tablet';
	return 'desktop';
}

/**
 * Detect operating system
 */
function detectPlatform(): DeviceInfo['platform'] {
	if (typeof navigator === 'undefined') return 'other';

	const ua = navigator.userAgent;

	if (/iPhone|iPad|iPod/.test(ua)) return 'ios';
	if (/Android/.test(ua)) return 'android';
	if (/Mac/.test(ua)) return 'macos';
	if (/Win/.test(ua)) return 'windows';
	if (/Linux/.test(ua)) return 'linux';
	return 'other';
}

/**
 * Detect browser
 */
function detectBrowser(): DeviceInfo['browser'] {
	if (typeof navigator === 'undefined') return 'other';

	const ua = navigator.userAgent;

	// Order matters - check more specific patterns first
	if (/Edg/.test(ua)) return 'edge';
	if (/Chrome/.test(ua)) return 'chrome';
	if (/Safari/.test(ua)) return 'safari';
	if (/Firefox/.test(ua)) return 'firefox';
	return 'other';
}

/**
 * Collect device information
 */
export function collectDeviceInfo(): DeviceInfo {
	if (typeof window === 'undefined' || typeof navigator === 'undefined') {
		return {
			userAgent: '',
			deviceType: 'desktop',
			platform: 'other',
			browser: 'other',
			screenWidth: 0,
			screenHeight: 0,
			touchSupport: false
		};
	}

	return {
		userAgent: navigator.userAgent,
		deviceType: detectDeviceType(),
		platform: detectPlatform(),
		browser: detectBrowser(),
		screenWidth: window.screen.width,
		screenHeight: window.screen.height,
		touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0
	};
}

/**
 * Collect locale information
 */
export function collectLocaleInfo(language: string): LocaleInfo {
	if (typeof Intl === 'undefined') {
		return {
			language,
			timezone: 'UTC',
			utcOffset: 0
		};
	}

	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
	const utcOffset = new Date().getTimezoneOffset(); // Returns offset in minutes

	return {
		language,
		timezone,
		utcOffset
	};
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
	// RFC 5322 simplified pattern
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email.trim());
}

/**
 * API endpoint configuration
 * TODO: Replace with actual API endpoint when ready
 */
export const API_CONFIG = {
	baseUrl: 'https://api.biubiu.tools', // Placeholder
	endpoints: {
		subscribe: '/v1/newsletter/subscribe',
		unsubscribe: '/v1/newsletter/unsubscribe'
	}
} as const;

/**
 * Source identifier for this project
 */
export const PROJECT_SOURCE = 'biubiu.tools';
