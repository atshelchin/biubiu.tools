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
 * Get user's timezone offset in numeric format (e.g., "+8", "-5", "+0")
 */
function getUserTimezoneOffset(): string {
	const offset = -new Date().getTimezoneOffset() / 60;
	const sign = offset >= 0 ? '+' : '';
	return `${sign}${offset}`;
}

/**
 * Get user's timezone name (e.g., "Asia/Shanghai", "America/New_York")
 */
function getUserTimezoneName(): string {
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
 * Get detailed device information including OS, browser, and model
 * @returns Device string like "iOS17_Safari_iPhone14Pro" or "Windows11_Chrome_Desktop"
 */
function getDeviceType(): string {
	if (typeof window === 'undefined') return 'Unknown';

	const ua = navigator.userAgent;

	// Detect OS and version
	let os = 'Unknown';
	if (/Windows NT 10\.0/.test(ua)) {
		os = 'Win11';
	} else if (/Windows NT/.test(ua)) {
		os = 'Win10';
	} else if (/Mac OS X (\d+)_(\d+)/.test(ua)) {
		const match = ua.match(/Mac OS X (\d+)_(\d+)/);
		if (match) os = `macOS${match[1]}`;
	} else if (/iPhone OS (\d+)_/.test(ua)) {
		const match = ua.match(/iPhone OS (\d+)_/);
		if (match) os = `iOS${match[1]}`;
	} else if (/iPad.*OS (\d+)_/.test(ua)) {
		const match = ua.match(/iPad.*OS (\d+)_/);
		if (match) os = `iPadOS${match[1]}`;
	} else if (/Android (\d+)/.test(ua)) {
		const match = ua.match(/Android (\d+)/);
		if (match) os = `Android${match[1]}`;
	} else if (/Linux/.test(ua)) {
		os = 'Linux';
	}

	// Detect Browser
	let browser = 'Unknown';
	if (/Edg\//.test(ua)) {
		browser = 'Edge';
	} else if (/Chrome\//.test(ua) && !/Edg/.test(ua)) {
		browser = 'Chrome';
	} else if (/Safari\//.test(ua) && !/Chrome/.test(ua)) {
		browser = 'Safari';
	} else if (/Firefox\//.test(ua)) {
		browser = 'Firefox';
	} else if (/OPR\/|Opera\//.test(ua)) {
		browser = 'Opera';
	}

	// Detect Device Model
	let model = 'Desktop';
	if (/iPhone/.test(ua)) {
		// Try to detect iPhone model
		if (/iPhone14,/.test(ua)) model = 'iPhone13';
		else if (/iPhone15,/.test(ua)) model = 'iPhone14';
		else if (/iPhone16,/.test(ua)) model = 'iPhone15';
		else if (/iPhone17,/.test(ua)) model = 'iPhone16';
		else model = 'iPhone';
	} else if (/iPad/.test(ua)) {
		if (/iPad14,/.test(ua)) model = 'iPadPro';
		else model = 'iPad';
	} else if (/Android/.test(ua)) {
		// Try to extract device model
		const modelMatch = ua.match(/;\s*([^;)]+)\s+Build/);
		if (modelMatch) {
			// Clean and shorten model name
			model = modelMatch[1]
				.replace(/\s+/g, '')
				.replace(/[^a-zA-Z0-9]/g, '')
				.slice(0, 15);
		} else {
			model = 'Android';
		}
	} else if (/(tablet|ipad)/i.test(ua)) {
		model = 'Tablet';
	} else if (/(mobile|android|iphone)/i.test(ua)) {
		model = 'Mobile';
	}

	// Combine: OS_Browser_Model (e.g., "iOS17_Safari_iPhone15")
	return `${os}_${browser}_${model}`;
}

/**
 * Get ISO 8601 week number in UTC0 timezone (YYYY-Www format)
 * @returns Week string like "2025-W47"
 */
function getUTC0YearWeek(): string {
	const now = new Date();

	// Get UTC date
	const utcDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

	// ISO 8601 week date calculation
	// Week starts on Monday, first week contains Jan 4th
	const dayNum = utcDate.getUTCDay() || 7; // Sunday = 7
	utcDate.setUTCDate(utcDate.getUTCDate() + 4 - dayNum); // Thursday of this week

	// Get first day of year
	const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));

	// Calculate week number
	const weekNum = Math.ceil(((utcDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);

	const year = utcDate.getUTCFullYear();
	const week = String(weekNum).padStart(2, '0');

	return `${year}-W${week}`;
}

function getTrafficSource(): string {
	if (typeof window === 'undefined') return 'direct';

	const referrer = document.referrer;

	// 从社交媒体来
	if (/twitter\.com|t\.co|x\.com/.test(referrer)) return 'twitter';
	if (/facebook\.com|fb\.com/.test(referrer)) return 'facebook';
	if (/telegram\.org|t\.me/.test(referrer)) return 'telegram';
	if (/discord\.com|discord\.gg/.test(referrer)) return 'discord';
	if (/reddit\.com/.test(referrer)) return 'reddit';
	if (/linkedin\.com/.test(referrer)) return 'linkedin';
	if (/wechat\.com|weixin\.qq\.com/.test(referrer)) return 'wechat';

	// 从搜索引擎来
	if (/google\.com/.test(referrer)) return 'google';
	if (/bing\.com/.test(referrer)) return 'bing';
	if (/baidu\.com/.test(referrer)) return 'baidu';

	// 从其他网站来
	if (referrer && referrer !== window.location.href) return 'referral';

	// 直接访问（收藏夹、直接输入 URL、扫码等）
	return 'direct';
}

function getUserType(): string {
	if (typeof window === 'undefined') return 'unknown';

	const hasVisited = localStorage.getItem('visited');

	if (!hasVisited) {
		localStorage.setItem('visited', Date.now().toString());
		return 'new'; // 新用户
	}

	const firstVisit = parseInt(hasVisited);
	const daysSinceFirst = (Date.now() - firstVisit) / (1000 * 60 * 60 * 24);

	if (daysSinceFirst < 1) return 'new';
	if (daysSinceFirst < 7) return 'active'; // 活跃用户（7 天内回访）
	if (daysSinceFirst < 30) return 'returning'; // 回访用户
	return 'dormant'; // 沉睡用户（30 天+）
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

	// Get user context for better tracking
	const userLanguage = getUserLanguage();
	const timezoneOffset = getUserTimezoneOffset();
	const timezoneName = getUserTimezoneName();
	const deviceType = getDeviceType();
	const utcYearWeek = getUTC0YearWeek();

	// Combine UTC year-week + timezone offset for source
	// Example: "2025-W47_+8"
	const combinedSource = `${utcYearWeek}_${timezoneOffset}_${userLanguage}`;

	// Add UTM tracking parameters for referral campaign
	const trackedUrl = addUTMParams(baseUrl.toString(), {
		campaign: 'referral_program',
		source: combinedSource, // Week + timezone (e.g., "2025-W47_+8")
		medium: `${userLanguage}_${deviceType}`, // Language + device (e.g., "zh-CN_mobile")
		content: timezoneName + '_' + getTrafficSource() + '_' + getUserType(), // Timezone name (e.g., "Asia/Shanghai")
		term: 'eth:' + referrerAddress // Full referrer address with prefix
	});

	return trackedUrl;
}
