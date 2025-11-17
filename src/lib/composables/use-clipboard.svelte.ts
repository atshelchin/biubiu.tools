/**
 * Clipboard composable for copying text with success feedback
 * Uses Svelte 5 runes for reactive state management
 */

export function useClipboard() {
	let copySuccess = $state(false);
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	/**
	 * Copy text to clipboard and show success feedback
	 * @param text - Text to copy
	 * @param duration - Duration to show success feedback (ms, default: 2000)
	 */
	async function copy(text: string, duration: number = 2000): Promise<void> {
		try {
			await navigator.clipboard.writeText(text);
			copySuccess = true;

			// Clear existing timeout
			if (timeoutId) {
				clearTimeout(timeoutId);
			}

			// Reset success state after duration
			timeoutId = setTimeout(() => {
				copySuccess = false;
				timeoutId = null;
			}, duration);
		} catch (error) {
			console.error('Failed to copy to clipboard:', error);
			copySuccess = false;
		}
	}

	/**
	 * Manually reset the success state
	 */
	function reset(): void {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}
		copySuccess = false;
	}

	return {
		get copySuccess() {
			return copySuccess;
		},
		copy,
		reset
	};
}
