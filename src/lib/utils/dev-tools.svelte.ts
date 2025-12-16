/**
 * Dev Tools Toggle Utility
 *
 * Usage in browser console:
 *   window.toggleDevTools()       - Toggle dev tools visibility
 *   window.toggleDevTools(true)   - Show dev tools
 *   window.toggleDevTools(false)  - Hide dev tools
 *
 * The state is persisted in localStorage and survives page refreshes.
 * UI updates in real-time without requiring page refresh.
 */

const DEV_TOOLS_KEY = 'biubiu_show_dev_tools';

// Module-level reactive state for real-time UI updates
let devToolsEnabled = $state(false);

// Initialize from localStorage on module load
if (typeof window !== 'undefined') {
	devToolsEnabled = localStorage.getItem(DEV_TOOLS_KEY) === 'true';
}

/**
 * Reactive getter for dev tools state
 * Use this in components for real-time reactivity
 */
export function useDevToolsEnabled(): boolean {
	return devToolsEnabled;
}

/**
 * Check if dev tools are enabled (non-reactive, reads localStorage directly)
 */
export function isDevToolsEnabled(): boolean {
	if (typeof window === 'undefined') return false;
	return localStorage.getItem(DEV_TOOLS_KEY) === 'true';
}

/**
 * Set dev tools enabled state
 */
export function setDevToolsEnabled(enabled: boolean): void {
	if (typeof window === 'undefined') return;
	if (enabled) {
		localStorage.setItem(DEV_TOOLS_KEY, 'true');
	} else {
		localStorage.removeItem(DEV_TOOLS_KEY);
	}
	// Update reactive state for real-time UI updates
	devToolsEnabled = enabled;
}

/**
 * Toggle dev tools visibility
 * @param forceState - Optional: force to specific state
 * @returns The new state
 */
export function toggleDevTools(forceState?: boolean): boolean {
	const newState = forceState ?? !devToolsEnabled;
	setDevToolsEnabled(newState);
	console.log(`[Dev Tools] ${newState ? 'Enabled' : 'Disabled'}`);
	return newState;
}

// Register global function in browser environment
if (typeof window !== 'undefined') {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(window as any).toggleDevTools = toggleDevTools;
}
