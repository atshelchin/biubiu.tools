/**
 * Options for the copy function
 */
export interface ClipboardOptions {
	/**
	 * Duration to show success feedback in milliseconds
	 * @default 2000
	 */
	duration?: number;
}

/**
 * Return type of useClipboard composable
 */
export interface ClipboardReturn {
	/**
	 * Whether the last copy operation was successful
	 * Automatically resets after the specified duration
	 */
	readonly copySuccess: boolean;

	/**
	 * Copy text to clipboard
	 * @param text - Text to copy
	 * @param duration - Duration to show success feedback (ms, default: 2000)
	 * @returns Promise that resolves when copy is complete
	 */
	copy: (text: string, duration?: number) => Promise<void>;

	/**
	 * Manually reset the success state
	 */
	reset: () => void;
}
