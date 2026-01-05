/**
 * Newsletter Subscription API Types
 *
 * These interfaces define the contract between frontend and the external
 * subscription API service. The API is designed to be shared across multiple projects.
 */

// ============================================================================
// Request Types
// ============================================================================

/**
 * Device and environment information collected for analytics
 */
export interface DeviceInfo {
	/** User agent string */
	userAgent: string;
	/** Device type: desktop, tablet, mobile */
	deviceType: 'desktop' | 'tablet' | 'mobile';
	/** Operating system: windows, macos, linux, ios, android, other */
	platform: 'windows' | 'macos' | 'linux' | 'ios' | 'android' | 'other';
	/** Browser name: chrome, firefox, safari, edge, other */
	browser: 'chrome' | 'firefox' | 'safari' | 'edge' | 'other';
	/** Screen width in pixels */
	screenWidth: number;
	/** Screen height in pixels */
	screenHeight: number;
	/** Whether touch is supported */
	touchSupport: boolean;
}

/**
 * Locale and timezone information
 */
export interface LocaleInfo {
	/** Language code from i18n, e.g., "en", "zh", "ja" */
	language: string;
	/** IANA timezone, e.g., "America/New_York", "Asia/Tokyo" */
	timezone: string;
	/** UTC offset in minutes, e.g., -480 for UTC-8 */
	utcOffset: number;
}

/**
 * Subscribe request payload
 */
export interface SubscribeRequest {
	/** Email address to subscribe */
	email: string;
	/** Source project identifier, e.g., "biubiu.tools" */
	source: string;
	/** Locale information */
	locale: LocaleInfo;
	/** Device information */
	device: DeviceInfo;
	/** Page URL where subscription was initiated */
	referrer: string;
	/** Timestamp when the request was made (ISO 8601) */
	timestamp: string;
}

/**
 * Unsubscribe request payload
 */
export interface UnsubscribeRequest {
	/** Email address to unsubscribe */
	email: string;
	/** Source project identifier */
	source: string;
}

// ============================================================================
// Response Types
// ============================================================================

/**
 * Successful subscribe response
 */
export interface SubscribeSuccessResponse {
	success: true;
	/** Message to display to user */
	message: string;
}

/**
 * Error codes for subscription failures
 */
export type SubscribeErrorCode =
	| 'INVALID_EMAIL'
	| 'ALREADY_SUBSCRIBED'
	| 'RATE_LIMITED'
	| 'INVALID_REQUEST'
	| 'SERVER_ERROR';

/**
 * Failed subscribe response
 */
export interface SubscribeErrorResponse {
	success: false;
	/** Error message */
	error: string;
	/** Error code for programmatic handling */
	code: SubscribeErrorCode;
}

/**
 * Subscribe response union type
 */
export type SubscribeResponse = SubscribeSuccessResponse | SubscribeErrorResponse;

/**
 * Unsubscribe response
 */
export interface UnsubscribeResponse {
	success: boolean;
	message: string;
}

// ============================================================================
// Component State Types
// ============================================================================

/**
 * Form submission state
 */
export type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Newsletter form state
 */
export interface NewsletterFormState {
	email: string;
	submitState: SubmitState;
	errorCode: SubscribeErrorCode | null;
}
