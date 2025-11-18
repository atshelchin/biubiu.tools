/**
 * Format a Unix timestamp to a human-readable date string with relative time
 * @param timestamp Unix timestamp in seconds
 * @returns Formatted date string with relative time (e.g., "Jan 15, 2024 14:30 (2 days ago)")
 */
export function formatTimestamp(timestamp: number): string {
	const date = new Date(timestamp * 1000);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	// Format the date
	const dateStr = date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});

	const timeStr = date.toLocaleTimeString('en-US', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	});

	// Add relative time
	let relativeStr = '';
	if (diffDays === 0) {
		relativeStr = 'today';
	} else if (diffDays === 1) {
		relativeStr = 'yesterday';
	} else if (diffDays < 30) {
		relativeStr = `${diffDays} days ago`;
	} else if (diffDays < 365) {
		const months = Math.floor(diffDays / 30);
		relativeStr = `${months} month${months > 1 ? 's' : ''} ago`;
	} else {
		const years = Math.floor(diffDays / 365);
		relativeStr = `${years} year${years > 1 ? 's' : ''} ago`;
	}

	return `${dateStr} ${timeStr} (${relativeStr})`;
}

/**
 * Format a Unix timestamp to a simple date string
 * @param timestamp Unix timestamp in seconds
 * @returns Formatted date string (e.g., "Jan 15, 2024")
 */
export function formatDate(timestamp: number): string {
	const date = new Date(timestamp * 1000);
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
}

/**
 * Format a Unix timestamp to a simple time string
 * @param timestamp Unix timestamp in seconds
 * @returns Formatted time string (e.g., "14:30")
 */
export function formatTime(timestamp: number): string {
	const date = new Date(timestamp * 1000);
	return date.toLocaleTimeString('en-US', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	});
}

/**
 * Get relative time string from a Unix timestamp
 * @param timestamp Unix timestamp in seconds
 * @returns Relative time string (e.g., "2 days ago", "today")
 */
export function getRelativeTime(timestamp: number): string {
	const date = new Date(timestamp * 1000);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffDays === 0) {
		return 'today';
	} else if (diffDays === 1) {
		return 'yesterday';
	} else if (diffDays < 30) {
		return `${diffDays} days ago`;
	} else if (diffDays < 365) {
		const months = Math.floor(diffDays / 30);
		return `${months} month${months > 1 ? 's' : ''} ago`;
	} else {
		const years = Math.floor(diffDays / 365);
		return `${years} year${years > 1 ? 's' : ''} ago`;
	}
}
