/**
 * Svelte action for drag-and-drop sorting
 * Features:
 * - Dragged element follows cursor with visual lift effect
 * - Other items animate smoothly via CSS transforms
 * - Desktop and mobile support (touch with immediate response)
 * - Cross-container drag and drop (via group option)
 */

export interface DragSortableOptions {
	onSort: (fromIndex: number, toIndex: number) => void;
	handle?: string; // CSS selector for drag handle
	animationDuration?: number; // Animation duration in ms (default: 150)
	group?: string; // Group name for cross-container drag and drop
	onReceive?: (fromIndex: number, fromContainerId: string) => void;
	onSend?: (fromIndex: number, toContainerId: string, toIndex: number) => void;
	containerId?: string; // Unique identifier for this container
}

// Global state for cross-container drag
interface GlobalDragState {
	active: boolean;
	element: HTMLElement | null;
	sourceContainer: HTMLElement | null;
	sourceContainerId: string | null;
	sourceIndex: number;
	group: string | null;
}

const globalState: GlobalDragState = {
	active: false,
	element: null,
	sourceContainer: null,
	sourceContainerId: null,
	sourceIndex: -1,
	group: null
};

// Registry for grouped containers
const groupRegistry = new Map<
	string,
	Map<string, { container: HTMLElement; options: DragSortableOptions }>
>();

function registerContainer(
	group: string,
	containerId: string,
	container: HTMLElement,
	options: DragSortableOptions
) {
	if (!groupRegistry.has(group)) {
		groupRegistry.set(group, new Map());
	}
	groupRegistry.get(group)!.set(containerId, { container, options });
}

function unregisterContainer(group: string, containerId: string) {
	groupRegistry.get(group)?.delete(containerId);
	if (groupRegistry.get(group)?.size === 0) {
		groupRegistry.delete(group);
	}
}

export function dragSortable(node: HTMLElement, options: DragSortableOptions) {
	const animationDuration = options.animationDuration ?? 150;

	// Drag state
	let draggedElement: HTMLElement | null = null;
	let draggedClone: HTMLElement | null = null;
	let originalIndex = -1;
	let currentIndex = -1;
	let isDragging = false;

	// Pointer tracking
	let offsetX = 0;
	let offsetY = 0;

	// Touch state
	let touchIdentifier: number | null = null;

	// Scroll handling
	let scrollRAF: number | null = null;

	// Item positions cache
	const itemRects: Map<HTMLElement, DOMRect> = new Map();

	// Register for cross-container
	if (options.group && options.containerId) {
		registerContainer(options.group, options.containerId, node, options);
	}

	function getItems(container: HTMLElement = node): HTMLElement[] {
		return Array.from(container.children).filter(
			(child) =>
				child instanceof HTMLElement &&
				!child.classList.contains('drag-clone') &&
				child.getAttribute('data-draggable') === 'true'
		) as HTMLElement[];
	}

	function getIndex(element: HTMLElement): number {
		return getItems().indexOf(element);
	}

	// Cache item positions before drag
	function cacheItemRects() {
		itemRects.clear();
		getItems().forEach((item) => {
			itemRects.set(item, item.getBoundingClientRect());
		});
	}

	// Create visual clone for dragging
	function createClone(element: HTMLElement): HTMLElement {
		const rect = element.getBoundingClientRect();
		const clone = element.cloneNode(true) as HTMLElement;

		clone.className = element.className + ' drag-clone';
		clone.style.cssText = `
			position: fixed;
			left: ${rect.left}px;
			top: ${rect.top}px;
			width: ${rect.width}px;
			height: ${rect.height}px;
			margin: 0;
			z-index: 10000;
			pointer-events: none;
			transform: scale(1.03);
			box-shadow: 0 15px 35px rgba(0,0,0,0.15), 0 0 0 1px var(--color-primary, #6366f1);
			opacity: 1;
			cursor: grabbing;
			will-change: transform;
			transition: box-shadow 150ms ease, transform 150ms ease;
		`;

		document.body.appendChild(clone);
		return clone;
	}

	// Update clone position
	function updateClonePosition(clientX: number, clientY: number) {
		if (!draggedClone) return;

		const x = clientX - offsetX;
		const y = clientY - offsetY;

		draggedClone.style.left = `${x}px`;
		draggedClone.style.top = `${y}px`;
	}

	// Calculate target index based on cursor position
	function calculateTargetIndex(clientY: number): number {
		const items = getItems();
		if (items.length === 0) return 0;

		// Use cached rects for stable calculation
		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			if (item === draggedElement) continue;

			const rect = itemRects.get(item);
			if (!rect) continue;

			const midY = rect.top + rect.height / 2;
			if (clientY < midY) {
				// If dragging upward and we're above an item's midpoint
				return i <= originalIndex ? i : i;
			}
		}

		return items.length - 1;
	}

	// Apply transforms to items to show drop position
	function updateItemTransforms(targetIndex: number) {
		const items = getItems();
		if (!draggedElement) return;

		const draggedRect = itemRects.get(draggedElement);
		if (!draggedRect) return;

		const itemHeight = draggedRect.height;
		const gap = getComputedGap();
		const moveDistance = itemHeight + gap;

		items.forEach((item, index) => {
			if (item === draggedElement) {
				// Hide original element
				item.style.opacity = '0';
				item.style.transform = 'none';
				return;
			}

			let transform = '';
			if (originalIndex < targetIndex) {
				// Dragging down: items between original and target move up
				if (index > originalIndex && index <= targetIndex) {
					transform = `translateY(${-moveDistance}px)`;
				}
			} else if (originalIndex > targetIndex) {
				// Dragging up: items between target and original move down
				if (index >= targetIndex && index < originalIndex) {
					transform = `translateY(${moveDistance}px)`;
				}
			}

			item.style.transition = `transform ${animationDuration}ms cubic-bezier(0.2, 0, 0, 1)`;
			item.style.transform = transform;
		});
	}

	// Get gap between items
	function getComputedGap(): number {
		const style = window.getComputedStyle(node);
		const gap = parseFloat(style.gap) || parseFloat(style.rowGap) || 0;
		return gap;
	}

	// Reset all transforms
	function resetTransforms() {
		getItems().forEach((item) => {
			item.style.transition = '';
			item.style.transform = '';
			item.style.opacity = '';
		});
	}

	// Auto-scroll
	function handleAutoScroll(clientY: number) {
		const scrollThreshold = 50;
		const maxScrollSpeed = 12;

		const doScroll = () => {
			if (!isDragging) return;

			const vh = window.innerHeight;
			let scrollSpeed = 0;

			if (clientY < scrollThreshold) {
				scrollSpeed = -Math.min(maxScrollSpeed, (scrollThreshold - clientY) / 3);
			} else if (clientY > vh - scrollThreshold) {
				scrollSpeed = Math.min(maxScrollSpeed, (clientY - (vh - scrollThreshold)) / 3);
			}

			if (scrollSpeed !== 0) {
				window.scrollBy(0, scrollSpeed);
				// Re-cache rects after scroll
				cacheItemRects();
				scrollRAF = requestAnimationFrame(doScroll);
			}
		};

		if (scrollRAF) cancelAnimationFrame(scrollRAF);
		scrollRAF = requestAnimationFrame(doScroll);
	}

	// Start drag
	function startDrag(element: HTMLElement, clientX: number, clientY: number) {
		if (isDragging) return;

		isDragging = true;
		draggedElement = element;
		originalIndex = getIndex(element);
		currentIndex = originalIndex;

		const rect = element.getBoundingClientRect();
		offsetX = clientX - rect.left;
		offsetY = clientY - rect.top;

		// Cache positions
		cacheItemRects();

		// Create clone
		draggedClone = createClone(element);

		// Set global state
		globalState.active = true;
		globalState.element = element;
		globalState.sourceContainer = node;
		globalState.sourceContainerId = options.containerId || null;
		globalState.sourceIndex = originalIndex;
		globalState.group = options.group || null;

		// Body styles
		document.body.style.cursor = 'grabbing';
		document.body.style.userSelect = 'none';

		// Haptic feedback
		if ('vibrate' in navigator) {
			navigator.vibrate(10);
		}
	}

	// Handle drag move
	function handleDragMove(clientX: number, clientY: number) {
		if (!isDragging || !draggedElement) return;

		updateClonePosition(clientX, clientY);
		handleAutoScroll(clientY);

		// Calculate target index
		const targetIndex = calculateTargetIndex(clientY);

		if (targetIndex !== currentIndex) {
			currentIndex = targetIndex;
			updateItemTransforms(targetIndex);
		}
	}

	// End drag
	function endDrag() {
		if (!isDragging || !draggedElement) return;

		isDragging = false;

		if (scrollRAF) {
			cancelAnimationFrame(scrollRAF);
			scrollRAF = null;
		}

		const element = draggedElement;
		const clone = draggedClone;
		const fromIndex = originalIndex;
		const toIndex = currentIndex;

		// Animate clone to final position
		if (clone && element) {
			let targetY: number;

			if (fromIndex === toIndex) {
				// No change, return to original position
				const rect = itemRects.get(element);
				targetY = rect ? rect.top : 0;
			} else {
				// Calculate final position
				const rect = itemRects.get(element);
				if (rect) {
					const gap = getComputedGap();
					const moveDistance = rect.height + gap;
					if (toIndex > fromIndex) {
						targetY = rect.top + (toIndex - fromIndex) * moveDistance;
					} else {
						targetY = rect.top - (fromIndex - toIndex) * moveDistance;
					}
				} else {
					targetY = parseFloat(clone.style.top);
				}
			}

			clone.style.transition = `all ${animationDuration}ms cubic-bezier(0.2, 0, 0, 1)`;
			clone.style.transform = 'scale(1)';
			clone.style.boxShadow = 'none';
			clone.style.top = `${targetY}px`;

			setTimeout(() => {
				clone.remove();
				resetTransforms();

				// Call callback
				if (fromIndex !== toIndex) {
					options.onSort(fromIndex, toIndex);
				}
			}, animationDuration);
		}

		// Reset body styles
		document.body.style.cursor = '';
		document.body.style.userSelect = '';

		// Reset state
		draggedElement = null;
		draggedClone = null;
		originalIndex = -1;
		currentIndex = -1;
		touchIdentifier = null;

		// Reset global state
		globalState.active = false;
		globalState.element = null;
		globalState.sourceContainer = null;
		globalState.sourceContainerId = null;
		globalState.sourceIndex = -1;
		globalState.group = null;
	}

	// Cancel drag
	function cancelDrag() {
		if (!isDragging) return;

		isDragging = false;

		if (scrollRAF) {
			cancelAnimationFrame(scrollRAF);
			scrollRAF = null;
		}

		const clone = draggedClone;
		const element = draggedElement;

		if (clone && element) {
			const rect = itemRects.get(element);
			if (rect) {
				clone.style.transition = `all ${animationDuration}ms cubic-bezier(0.2, 0, 0, 1)`;
				clone.style.transform = 'scale(1)';
				clone.style.boxShadow = 'none';
				clone.style.top = `${rect.top}px`;
				clone.style.left = `${rect.left}px`;
			}

			setTimeout(() => {
				clone.remove();
				resetTransforms();
			}, animationDuration);
		}

		// Reset
		document.body.style.cursor = '';
		document.body.style.userSelect = '';
		draggedElement = null;
		draggedClone = null;
		originalIndex = -1;
		currentIndex = -1;
		touchIdentifier = null;

		globalState.active = false;
		globalState.element = null;
		globalState.sourceContainer = null;
		globalState.sourceContainerId = null;
		globalState.sourceIndex = -1;
		globalState.group = null;
	}

	// Mouse events
	function handleMouseDown(e: MouseEvent) {
		if (e.button !== 0) return;

		const target = e.target as HTMLElement;

		if (options.handle) {
			const handle = target.closest(options.handle);
			if (!handle) return;
		}

		const item = target.closest('[data-draggable="true"]') as HTMLElement;
		if (!item || !node.contains(item)) return;

		e.preventDefault();
		startDrag(item, e.clientX, e.clientY);

		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseup', handleMouseUp);
	}

	function handleMouseMove(e: MouseEvent) {
		e.preventDefault();
		handleDragMove(e.clientX, e.clientY);
	}

	function handleMouseUp() {
		window.removeEventListener('mousemove', handleMouseMove);
		window.removeEventListener('mouseup', handleMouseUp);
		endDrag();
	}

	// Touch events - immediate response, no delay
	function handleTouchStart(e: TouchEvent) {
		if (e.touches.length !== 1) return;

		const touch = e.touches[0];
		const target = touch.target as HTMLElement;

		if (options.handle) {
			const handle = target.closest(options.handle);
			if (!handle) return;
		}

		const item = target.closest('[data-draggable="true"]') as HTMLElement;
		if (!item || !node.contains(item)) return;

		touchIdentifier = touch.identifier;

		// Start drag immediately for better feel
		e.preventDefault();
		startDrag(item, touch.clientX, touch.clientY);
	}

	function handleTouchMove(e: TouchEvent) {
		const touch = Array.from(e.touches).find((t) => t.identifier === touchIdentifier);
		if (!touch) return;

		if (!isDragging) return;

		e.preventDefault();
		handleDragMove(touch.clientX, touch.clientY);
	}

	function handleTouchEnd(e: TouchEvent) {
		const touch = Array.from(e.changedTouches).find((t) => t.identifier === touchIdentifier);
		if (!touch) return;

		if (isDragging) {
			endDrag();
		}

		touchIdentifier = null;
	}

	function handleTouchCancel() {
		if (isDragging) {
			cancelDrag();
		}
		touchIdentifier = null;
	}

	// Keyboard
	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape' && isDragging) {
			cancelDrag();
		}
	}

	// Setup items
	function setupItems() {
		const items = node.querySelectorAll(':scope > *:not(.drag-clone)');
		items.forEach((item) => {
			const el = item as HTMLElement;
			if (!el.classList.contains('drag-clone')) {
				el.setAttribute('data-draggable', 'true');
				el.style.cursor = options.handle ? 'default' : 'grab';

				if (options.handle) {
					const handles = el.querySelectorAll(options.handle);
					handles.forEach((handle) => {
						(handle as HTMLElement).style.cursor = 'grab';
						(handle as HTMLElement).style.touchAction = 'none';
					});
				}
			}
		});
	}

	// Prevent default touch behavior on container
	node.style.touchAction = 'none';

	// Event listeners
	node.addEventListener('mousedown', handleMouseDown);
	node.addEventListener('touchstart', handleTouchStart, { passive: false });
	node.addEventListener('touchmove', handleTouchMove, { passive: false });
	node.addEventListener('touchend', handleTouchEnd);
	node.addEventListener('touchcancel', handleTouchCancel);
	document.addEventListener('keydown', handleKeyDown);

	setupItems();

	const observer = new MutationObserver(setupItems);
	observer.observe(node, { childList: true });

	return {
		update(newOptions: DragSortableOptions) {
			if (
				options.group &&
				options.containerId &&
				(newOptions.group !== options.group || newOptions.containerId !== options.containerId)
			) {
				unregisterContainer(options.group, options.containerId);
			}

			Object.assign(options, newOptions);

			if (options.group && options.containerId) {
				registerContainer(options.group, options.containerId, node, options);
			}

			setupItems();
		},
		destroy() {
			node.removeEventListener('mousedown', handleMouseDown);
			node.removeEventListener('touchstart', handleTouchStart);
			node.removeEventListener('touchmove', handleTouchMove);
			node.removeEventListener('touchend', handleTouchEnd);
			node.removeEventListener('touchcancel', handleTouchCancel);
			document.removeEventListener('keydown', handleKeyDown);

			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseup', handleMouseUp);

			if (scrollRAF) cancelAnimationFrame(scrollRAF);

			draggedClone?.remove();
			observer.disconnect();

			if (options.group && options.containerId) {
				unregisterContainer(options.group, options.containerId);
			}
		}
	};
}
