/**
 * Svelte action for detecting long press
 * @param node - The DOM element
 * @param options - Long press configuration
 */
export function longPress(
	node: HTMLElement,
	options: {
		duration?: number;
		onProgress?: (progress: number) => void;
		onComplete?: () => void;
	} = {}
) {
	const { duration = 5000, onProgress, onComplete } = options;

	let timer: ReturnType<typeof setInterval> | null = null;
	let startTime: number = 0;

	function handlePointerDown(event: PointerEvent) {
		// Prevent default to avoid text selection
		event.preventDefault();

		// If duration is 0 or negative, trigger immediately
		if (duration <= 0) {
			onComplete?.();
			return;
		}

		startTime = Date.now();

		timer = setInterval(() => {
			const elapsed = Date.now() - startTime;
			const progress = Math.min((elapsed / duration) * 100, 100);

			onProgress?.(progress);

			if (elapsed >= duration) {
				cleanup();
				onComplete?.();
			}
		}, 50);
	}

	function cleanup() {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
		onProgress?.(0);
	}

	function handlePointerUp() {
		cleanup();
	}

	function handlePointerLeave() {
		cleanup();
	}

	node.addEventListener('pointerdown', handlePointerDown);
	node.addEventListener('pointerup', handlePointerUp);
	node.addEventListener('pointerleave', handlePointerLeave);

	return {
		update(newOptions: typeof options) {
			// Can update options dynamically if needed
			Object.assign(options, newOptions);
		},
		destroy() {
			cleanup();
			node.removeEventListener('pointerdown', handlePointerDown);
			node.removeEventListener('pointerup', handlePointerUp);
			node.removeEventListener('pointerleave', handlePointerLeave);
		}
	};
}
