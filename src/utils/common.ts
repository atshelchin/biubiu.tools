import { isValidLanguageCode } from './language-search.js';
import type { Cookies } from '@sveltejs/kit';
/**
 * Extract language code from pathname if it exists and is valid
 * @param pathname - The URL pathname (e.g., '/zh/about' or '/en-US/products')
 * @returns The language code if found and valid, null otherwise
 *
 * @example
 * extractLocaleFromPathname('/zh/about') // 'zh'
 * extractLocaleFromPathname('/en-US/products') // 'en-US'
 * extractLocaleFromPathname('/notlang/about') // null
 * extractLocaleFromPathname('/about') // null
 */
export function extractLocaleFromPathname(pathname: string): string | null {
	// Split pathname into segments and filter out empty strings
	const segments = pathname.split('/').filter(Boolean);

	// If no segments, no locale
	if (segments.length === 0) {
		return null;
	}

	// Check if first segment is a valid language code
	const firstSegment = segments[0];
	if (isValidLanguageCode(firstSegment)) {
		return firstSegment;
	}

	return null;
}

export function extractLocaleFromCookie(cookies: Cookies): string | null {
	const field = cookies.get('locale') || '';
	if (isValidLanguageCode(field)) {
		return field;
	}
	return null;
}

/**
 * Build canonical URL by stripping locale prefix from pathname.
 * This ensures all localized pages point to a single canonical URL for SEO.
 *
 * @param url - The URL object from the request
 * @returns The canonical URL without locale prefix
 *
 * @example
 * // URL: https://biubiu.tools/en/apps/wallet-sweep
 * buildCanonicalUrl(url) // returns 'https://biubiu.tools/apps/wallet-sweep'
 *
 * // URL: https://biubiu.tools/zh/chains/eth
 * buildCanonicalUrl(url) // returns 'https://biubiu.tools/chains/eth'
 *
 * // URL: https://biubiu.tools/apps/wallet-sweep (no locale)
 * buildCanonicalUrl(url) // returns 'https://biubiu.tools/apps/wallet-sweep'
 */
export function buildCanonicalUrl(url: URL): string {
	const locale = extractLocaleFromPathname(url.pathname);
	let canonicalPath = url.pathname;

	// Strip locale prefix if present
	if (locale) {
		canonicalPath = url.pathname.replace(new RegExp(`^/${locale}`), '') || '/';
	}

	return url.origin + canonicalPath;
}
