import type {
	SubscribeRequest,
	SubscribeResponse,
	UnsubscribeRequest,
	UnsubscribeResponse
} from './types';
import { collectDeviceInfo, collectLocaleInfo, PROJECT_SOURCE } from './utils';

/**
 * API Configuration
 * In production, this should be the deployed newsletter service URL
 */
const API_CONFIG = {
	baseUrl: 'https://newsletter.appsdata.xyz',
	endpoints: {
		subscribe: '/v1/subscribe',
		unsubscribe: '/v1/unsubscribe'
	}
};

/**
 * Build subscribe request payload with all collected information
 */
export function buildSubscribeRequest(email: string, language: string): SubscribeRequest {
	return {
		email: email.trim().toLowerCase(),
		source: PROJECT_SOURCE,
		locale: collectLocaleInfo(language),
		device: collectDeviceInfo(),
		referrer: typeof window !== 'undefined' ? window.location.href : '',
		timestamp: new Date().toISOString()
	};
}

/**
 * Subscribe to newsletter
 */
export async function subscribe(email: string, language: string): Promise<SubscribeResponse> {
	const request = buildSubscribeRequest(email, language);

	// Log request for development debugging
	if (import.meta.env.DEV) {
		console.log('[Newsletter] Subscribe request:', JSON.stringify(request, null, 2));
	}

	try {
		const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.subscribe}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(request)
		});

		const data = await response.json();

		if (!response.ok) {
			return {
				success: false,
				error: data.error || 'Something went wrong',
				code: data.code || 'SERVER_ERROR'
			};
		}

		return data;
	} catch (error) {
		console.error('[Newsletter] Subscribe error:', error);
		return {
			success: false,
			error: 'Network error. Please check your connection.',
			code: 'SERVER_ERROR'
		};
	}
}

/**
 * Unsubscribe from newsletter
 */
export async function unsubscribe(email: string): Promise<UnsubscribeResponse> {
	const request: UnsubscribeRequest = {
		email: email.trim().toLowerCase(),
		source: PROJECT_SOURCE
	};

	// Log request for development debugging
	if (import.meta.env.DEV) {
		console.log('[Newsletter] Unsubscribe request:', JSON.stringify(request, null, 2));
	}

	try {
		const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.unsubscribe}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(request)
		});

		return await response.json();
	} catch (error) {
		console.error('[Newsletter] Unsubscribe error:', error);
		return {
			success: false,
			message: 'Failed to unsubscribe. Please try again.'
		};
	}
}
