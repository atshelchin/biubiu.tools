/**
 * Debug utility for conditional logging
 * Set FORMSTATE_DEBUG=true in environment or localStorage to enable
 */

const isDebugEnabled = (): boolean => {
	// Check environment variable (for Node.js/SSR)
	try {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const globalWithProcess = globalThis as any;
		if (
			typeof globalWithProcess.process !== 'undefined' &&
			globalWithProcess.process?.env?.FORMSTATE_DEBUG === 'true'
		) {
			return true;
		}
	} catch {
		// Ignore if process is not available
	}

	// Check localStorage (for browser)
	if (typeof localStorage !== 'undefined') {
		return localStorage.getItem('FORMSTATE_DEBUG') === 'true';
	}

	return false;
};

const debugEnabled = isDebugEnabled();

export const debug = {
	log: (...args: unknown[]) => {
		if (debugEnabled) {
			console.log(...args);
		}
	},

	warn: (...args: unknown[]) => {
		if (debugEnabled) {
			console.warn(...args);
		}
	},

	error: (...args: unknown[]) => {
		// Errors are always logged
		console.error(...args);
	},

	group: (label: string) => {
		if (debugEnabled) {
			console.group(label);
		}
	},

	groupEnd: () => {
		if (debugEnabled) {
			console.groupEnd();
		}
	}
};

/**
 * Enable debug mode programmatically
 */
export function enableDebug(): void {
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem('FORMSTATE_DEBUG', 'true');
	}
	console.log('[FormState] Debug mode enabled. Reload page to see debug logs.');
}

/**
 * Disable debug mode
 */
export function disableDebug(): void {
	if (typeof localStorage !== 'undefined') {
		localStorage.removeItem('FORMSTATE_DEBUG');
	}
	console.log('[FormState] Debug mode disabled.');
}
