/**
 * Short link service using sndra.link API
 * https://github.com/atshelchin/sndra-link
 */

export interface ShortLinkResponse {
	success: boolean;
	shortUrl?: string;
	error?: string;
}

/**
 * Create a short link using our API proxy (to avoid CORS)
 * @param longUrl - The full URL to shorten
 * @returns Promise with shortened URL or error
 */
export async function createShortLink(longUrl: string): Promise<ShortLinkResponse> {
	try {
		const response = await fetch('/api/shortlink', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				url: longUrl
			})
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		const data = await response.json();

		if (data.success && data.shortUrl) {
			return {
				success: true,
				shortUrl: data.shortUrl
			};
		}

		return {
			success: false,
			error: data.error || 'Unknown error creating short link'
		};
	} catch (error) {
		console.error('Failed to create short link:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : String(error)
		};
	}
}

/**
 * Build UTM campaign tracking parameters
 */
export interface UTMParams {
	source?: string; // utm_source: identifies traffic source
	medium?: string; // utm_medium: identifies medium (referral, social, email, etc)
	campaign?: string; // utm_campaign: campaign name
	term?: string; // utm_term: paid search keywords
	content?: string; // utm_content: differentiate similar content/links
}

/**
 * Add UTM parameters to a URL
 * @param baseUrl - The base URL to add parameters to
 * @param params - UTM parameters to add
 * @returns URL with UTM parameters
 */
export function addUTMParams(baseUrl: string, params: UTMParams): string {
	const url = new URL(baseUrl);

	if (params.source) url.searchParams.set('utm_source', params.source);
	if (params.medium) url.searchParams.set('utm_medium', params.medium);
	if (params.campaign) url.searchParams.set('utm_campaign', params.campaign);
	if (params.term) url.searchParams.set('utm_term', params.term);
	if (params.content) url.searchParams.set('utm_content', params.content);

	return url.toString();
}

/**
 * Get user's timezone in Intl format (e.g., "Asia/Shanghai", "America/New_York")
 */
function getUserTimezone(): string {
	try {
		return Intl.DateTimeFormat().resolvedOptions().timeZone;
	} catch {
		return 'UTC';
	}
}

/**
 * Get user's language preference (e.g., "en", "zh", "zh-CN")
 */
function getUserLanguage(): string {
	if (typeof window === 'undefined') return 'en';
	// Get the first preferred language from navigator
	return navigator.language || navigator.languages?.[0] || 'en';
}

/**
 * Generate referral URL with UTM tracking parameters
 * Based on current page URL, preserving path and existing query params
 * @param referrerAddress - The referrer's wallet address
 * @returns Full URL with ref param and UTM tracking
 */
export function generateTrackingUrl(referrerAddress: string): string {
	if (typeof window === 'undefined') return '';

	// Use current page's full URL (includes path and query params)
	const baseUrl = new URL(window.location.href);

	// Remove any existing ref and UTM parameters to avoid conflicts
	baseUrl.searchParams.delete('ref');
	baseUrl.searchParams.delete('utm_source');
	baseUrl.searchParams.delete('utm_medium');
	baseUrl.searchParams.delete('utm_campaign');
	baseUrl.searchParams.delete('utm_content');
	baseUrl.searchParams.delete('utm_term');

	// Add referral parameter
	baseUrl.searchParams.set('ref', referrerAddress);

	// Get user context for better tracking
	const userLanguage = getUserLanguage();
	const userTimezone = getUserTimezone();

	// Add UTM tracking parameters for referral campaign
	const trackedUrl = addUTMParams(baseUrl.toString(), {
		source: userLanguage, // User's language (e.g., "en", "zh-CN")
		medium: userTimezone, // User's timezone (e.g., "Asia/Shanghai")
		campaign: 'referral_program',
		content: referrerAddress
	});

	return trackedUrl;
}
