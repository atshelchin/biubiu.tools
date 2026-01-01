import { page } from '$app/stores';
import { get } from 'svelte/store';
import { extractLocaleFromPathname } from '../../utils/common.js';

/**
 * Check if a URL is an external link
 *
 * @param url - The URL to check
 * @returns true if the URL is external (http://, https://, //, mailto:, tel:, etc.)
 */
function isExternalUrl(url: string): boolean {
	return (
		url.startsWith('http://') ||
		url.startsWith('https://') ||
		url.startsWith('//') ||
		url.startsWith('mailto:') ||
		url.startsWith('tel:') ||
		url.startsWith('#')
	);
}

/**
 * Get localized href based on current page locale
 *
 * Automatically detects internal vs external links:
 * - External links (http://, https://, mailto:, etc.) are returned unchanged
 * - Internal links get the current locale prefix added (if not 'en')
 *
 * @param path - The path or URL to localize (e.g., '/chains', 'https://example.com')
 * @returns The localized path for internal links, or unchanged URL for external links
 *
 * @example
 * // If current URL is /zh/tools
 * localizeHref('/chains') // returns '/zh/chains'
 * localizeHref('https://google.com') // returns 'https://google.com' (unchanged)
 *
 * // If current URL is /tools (no locale prefix)
 * localizeHref('/chains') // returns '/chains'
 */
export function localizeHref(path: string): string {
	// External URLs are returned unchanged
	if (isExternalUrl(path)) {
		return path;
	}

	const currentPath = get(page).url.pathname;
	const locale = extractLocaleFromPathname(currentPath);

	// Ensure path starts with /
	const normalizedPath = path.startsWith('/') ? path : `/${path}`;

	// Add locale prefix if current page has one (and it's not 'en')
	if (locale && locale !== 'en') {
		return `/${locale}${normalizedPath}`;
	}

	return normalizedPath;
}
