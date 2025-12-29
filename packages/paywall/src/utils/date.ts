/**
 * Date utilities for usage quota tracking
 */

/**
 * Get today's date string in YYYY-MM-DD format
 */
export function getTodayDate(): string {
	return new Date().toISOString().split('T')[0];
}

/**
 * Get cutoff date for cleanup (default: 7 days ago)
 */
export function getCutoffDate(daysAgo: number = 7): string {
	const cutoffMs = Date.now() - daysAgo * 24 * 60 * 60 * 1000;
	return new Date(cutoffMs).toISOString().split('T')[0];
}
