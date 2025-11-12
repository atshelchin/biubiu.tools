/**
 * Svelte action for drag-and-drop sorting with real-time reordering
 * Features:
 * - Ghost element that follows cursor/finger
 * - Real-time card reordering (items move aside for dragged item)
 * - Smooth transitions and animations
 * - Desktop and mobile support
 */

interface DragSortableOptions {
	onSort: (fromIndex: number, toIndex: number) => void;
	handle?: string; // CSS selector for drag handle
	animationDuration?: number; // Animation duration in ms (default: 200)
}

export function dragSortable(node: HTMLElement, options: DragSortableOptions) {
	let draggedElement: HTMLElement | null = null;
	let draggedIndex: number = -1;
	let currentHoverIndex: number = -1;
	let ghostElement: HTMLElement | null = null;
	const animationDuration = options.animationDuration || 200;

	// Touch support variables
	let touchStartY = 0;
	let touchStartX = 0;
	let isTouchDragging = false;
	let scrollInterval: ReturnType<typeof setInterval> | null = null;

	// Desktop drag control
	let isDragAllowed = false;

	// Container setup
	node.style.position = 'relative';

	function getItemIndex(element: HTMLElement): number {
		const items = Array.from(node.children).filter(
			(child) => !child.classList.contains('drag-ghost') && child instanceof HTMLElement
		);
		return items.indexOf(element);
	}

	function getAllItems(): HTMLElement[] {
		return Array.from(node.children).filter(
			(child) => !child.classList.contains('drag-ghost') && child instanceof HTMLElement
		) as HTMLElement[];
	}

	function createGhostElement(element: HTMLElement): HTMLElement {
		const ghost = element.cloneNode(true) as HTMLElement;
		ghost.className = element.className + ' drag-ghost';

		// Style the ghost
		const rect = element.getBoundingClientRect();
		ghost.style.position = 'fixed';
		ghost.style.width = `${rect.width}px`;
		ghost.style.height = `${rect.height}px`;
		ghost.style.pointerEvents = 'none';
		ghost.style.zIndex = '10000';
		ghost.style.opacity = '0.9';
		ghost.style.transform = 'rotate(-2deg) scale(1.05)';
		ghost.style.transition = 'transform 150ms ease, opacity 150ms ease';
		ghost.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(102, 126, 234, 0.3)';
		ghost.style.borderRadius = '0.75rem';
		ghost.style.cursor = 'grabbing';

		document.body.appendChild(ghost);
		return ghost;
	}

	function updateGhostPosition(x: number, y: number) {
		if (!ghostElement) return;

		// Smooth following with slight offset
		const offsetX = 10;
		const offsetY = 10;
		ghostElement.style.left = `${x + offsetX}px`;
		ghostElement.style.top = `${y + offsetY}px`;
	}

	// Real-time reordering: move items visually
	function reorderItems(newHoverIndex: number) {
		if (newHoverIndex === currentHoverIndex || !draggedElement) return;
		if (newHoverIndex === draggedIndex) return;

		currentHoverIndex = newHoverIndex;
		const items = getAllItems();

		// Move dragged element to new position in DOM
		const targetElement = items[newHoverIndex];
		if (!targetElement) return;

		// Insert before or after depending on direction
		if (newHoverIndex < draggedIndex) {
			// Moving up - insert before target
			node.insertBefore(draggedElement, targetElement);
		} else {
			// Moving down - insert after target
			node.insertBefore(draggedElement, targetElement.nextSibling);
		}

		// Update dragged index
		draggedIndex = newHoverIndex;
	}

	function autoScroll(clientY: number) {
		const scrollThreshold = 80;
		const scrollSpeed = 8;

		// Check if container has scrollable content
		const containerScrollParent = findScrollableParent(node);

		let scrolled = false;

		// Priority 1: Try scrolling the closest scrollable parent container
		if (containerScrollParent) {
			const parentRect = containerScrollParent.getBoundingClientRect();
			const parentRelativeY = clientY - parentRect.top;

			if (parentRelativeY < scrollThreshold && containerScrollParent.scrollTop > 0) {
				// Scroll parent container up
				containerScrollParent.scrollTop -= scrollSpeed;
				scrolled = true;
			} else if (
				parentRelativeY > parentRect.height - scrollThreshold &&
				containerScrollParent.scrollTop <
					containerScrollParent.scrollHeight - containerScrollParent.clientHeight
			) {
				// Scroll parent container down
				containerScrollParent.scrollTop += scrollSpeed;
				scrolled = true;
			}
		}

		// Priority 2: Only scroll window if no container was scrolled
		if (!scrolled) {
			const viewportHeight = window.innerHeight;

			if (clientY < scrollThreshold) {
				// Scroll window up
				window.scrollBy(0, -scrollSpeed);
			} else if (clientY > viewportHeight - scrollThreshold) {
				// Scroll window down
				window.scrollBy(0, scrollSpeed);
			}
		}
	}

	// Helper to find the closest scrollable parent
	function findScrollableParent(element: HTMLElement): HTMLElement | null {
		let parent = element.parentElement;

		while (parent) {
			const hasOverflow = window.getComputedStyle(parent).overflow;
			const hasOverflowY = window.getComputedStyle(parent).overflowY;

			if (
				(hasOverflow === 'auto' ||
					hasOverflow === 'scroll' ||
					hasOverflowY === 'auto' ||
					hasOverflowY === 'scroll') &&
				parent.scrollHeight > parent.clientHeight
			) {
				return parent;
			}

			parent = parent.parentElement;
		}

		return null;
	}

	// Mouse down handler to check if drag is allowed
	function handleMouseDown(e: MouseEvent) {
		const target = e.target as HTMLElement;

		// Check if mouse down on handle
		if (options.handle) {
			const handle = target.closest(options.handle);
			isDragAllowed = !!handle;
		} else {
			isDragAllowed = true;
		}
	}

	// Desktop drag handlers
	function handleDragStart(e: DragEvent) {
		// Check if drag is allowed (must have pressed down on handle)
		if (options.handle && !isDragAllowed) {
			e.preventDefault();
			return;
		}

		const target = e.target as HTMLElement;
		const item = target.closest('[draggable="true"]') as HTMLElement;
		if (!item) return;

		draggedElement = item;
		draggedIndex = getItemIndex(item);
		currentHoverIndex = draggedIndex;

		// Hide default ghost
		const img = new Image();
		img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
		e.dataTransfer!.setDragImage(img, 0, 0);
		e.dataTransfer!.effectAllowed = 'move';

		// Create custom ghost
		setTimeout(() => {
			if (draggedElement) {
				ghostElement = createGhostElement(draggedElement);
				draggedElement.style.opacity = '0.4';
			}
		}, 0);
	}

	function handleDrag(e: DragEvent) {
		if (!ghostElement || (e.clientX === 0 && e.clientY === 0)) return;
		updateGhostPosition(e.clientX, e.clientY);
		autoScroll(e.clientY);
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		if (!draggedElement) return;

		const target = (e.target as HTMLElement).closest('[draggable="true"]') as HTMLElement;
		if (!target || target === draggedElement) return;

		const targetIndex = getItemIndex(target);
		if (targetIndex === -1) return;

		// Determine position based on mouse Y relative to target
		const rect = target.getBoundingClientRect();
		const midpoint = rect.top + rect.height / 2;

		let newHoverIndex = targetIndex;
		if (e.clientY < midpoint && targetIndex < draggedIndex) {
			// Moving up - place before target
			newHoverIndex = targetIndex;
		} else if (e.clientY >= midpoint && targetIndex > draggedIndex) {
			// Moving down - place after target
			newHoverIndex = targetIndex;
		}

		reorderItems(newHoverIndex);
	}

	function handleDragEnd(e: DragEvent) {
		if (!draggedElement) return;

		// Animate ghost back to original position
		if (ghostElement && draggedElement) {
			const rect = draggedElement.getBoundingClientRect();
			ghostElement.style.transition = `all ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
			ghostElement.style.left = `${rect.left}px`;
			ghostElement.style.top = `${rect.top}px`;
			ghostElement.style.opacity = '0';
			ghostElement.style.transform = 'rotate(0deg) scale(1)';

			setTimeout(() => {
				ghostElement?.remove();
				ghostElement = null;
			}, animationDuration);
		}

		// Reset dragged element
		draggedElement.style.opacity = '1';

		// Call sort callback if position changed
		const finalIndex = getItemIndex(draggedElement);
		const originalIndex = draggedIndex;

		if (finalIndex !== originalIndex && finalIndex !== -1) {
			// Need to call onSort with the original indices before DOM changed
			// Reset to original position first
			const items = getAllItems();
			if (originalIndex < items.length) {
				// Move back to calculate correct indices
				const originalPosition = items[originalIndex];
				if (originalPosition) {
					if (originalIndex < finalIndex) {
						node.insertBefore(draggedElement, originalPosition);
					} else {
						node.insertBefore(draggedElement, originalPosition.nextSibling);
					}
				}
			}

			// Now call onSort which will update the data
			options.onSort(originalIndex, finalIndex);
		}

		draggedElement = null;
		draggedIndex = -1;
		currentHoverIndex = -1;
	}

	// Touch event handlers for mobile
	function handleTouchStart(e: TouchEvent) {
		const target = e.target as HTMLElement;

		// Check if touch started from handle
		if (options.handle) {
			const handle = target.closest(options.handle);
			if (!handle) {
				return;
			}
		}

		const item = target.closest('[draggable="true"]') as HTMLElement;
		if (!item) return;

		draggedElement = item;
		draggedIndex = getItemIndex(item);
		currentHoverIndex = draggedIndex;
		touchStartY = e.touches[0].clientY;
		touchStartX = e.touches[0].clientX;
		isTouchDragging = true;

		// Haptic feedback on mobile
		if ('vibrate' in navigator) {
			navigator.vibrate(10);
		}

		// Create ghost after a short delay
		setTimeout(() => {
			if (isTouchDragging && draggedElement) {
				ghostElement = createGhostElement(draggedElement);
				updateGhostPosition(touchStartX, touchStartY);
				draggedElement.style.opacity = '0.4';
			}
		}, 50);

		// Start auto-scroll check
		scrollInterval = setInterval(() => {
			if (isTouchDragging) {
				autoScroll(touchStartY);
			}
		}, 50);
	}

	function handleTouchMove(e: TouchEvent) {
		if (!isTouchDragging || !draggedElement) return;

		e.preventDefault();
		const touch = e.touches[0];
		touchStartY = touch.clientY;
		touchStartX = touch.clientX;

		// Update ghost position
		updateGhostPosition(touch.clientX, touch.clientY);

		// Find element at touch position
		const elementAtPoint = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement;
		const target = elementAtPoint?.closest('[draggable="true"]') as HTMLElement;

		if (!target || target === draggedElement) return;

		const targetIndex = getItemIndex(target);
		if (targetIndex === -1) return;

		// Determine position
		const rect = target.getBoundingClientRect();
		const midpoint = rect.top + rect.height / 2;

		let newHoverIndex = targetIndex;
		if (touch.clientY < midpoint && targetIndex < draggedIndex) {
			newHoverIndex = targetIndex;
		} else if (touch.clientY >= midpoint && targetIndex > draggedIndex) {
			newHoverIndex = targetIndex;
		}

		reorderItems(newHoverIndex);
	}

	function handleTouchEnd(e: TouchEvent) {
		if (!isTouchDragging || !draggedElement) return;

		isTouchDragging = false;

		// Clear auto-scroll
		if (scrollInterval) {
			clearInterval(scrollInterval);
			scrollInterval = null;
		}

		// Haptic feedback
		if ('vibrate' in navigator) {
			navigator.vibrate(10);
		}

		// Animate ghost back
		if (ghostElement && draggedElement) {
			const rect = draggedElement.getBoundingClientRect();
			ghostElement.style.transition = `all ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
			ghostElement.style.left = `${rect.left}px`;
			ghostElement.style.top = `${rect.top}px`;
			ghostElement.style.opacity = '0';
			ghostElement.style.transform = 'rotate(0deg) scale(1)';

			setTimeout(() => {
				ghostElement?.remove();
				ghostElement = null;
			}, animationDuration);
		}

		// Reset styles
		draggedElement.style.opacity = '1';

		// Call sort callback
		const finalIndex = getItemIndex(draggedElement);
		const originalIndex = draggedIndex;

		if (finalIndex !== originalIndex && finalIndex !== -1) {
			// Reset to original position first
			const items = getAllItems();
			if (originalIndex < items.length) {
				const originalPosition = items[originalIndex];
				if (originalPosition) {
					if (originalIndex < finalIndex) {
						node.insertBefore(draggedElement, originalPosition);
					} else {
						node.insertBefore(draggedElement, originalPosition.nextSibling);
					}
				}
			}

			options.onSort(originalIndex, finalIndex);
		}

		draggedElement = null;
		draggedIndex = -1;
		currentHoverIndex = -1;
	}

	// Make all direct children draggable
	function updateDraggableItems() {
		const items = node.querySelectorAll(':scope > *:not(.drag-ghost)');
		items.forEach((item) => {
			const el = item as HTMLElement;
			el.setAttribute('draggable', 'true');
			el.style.cursor = options.handle ? 'default' : 'grab';
			el.style.transition = `transform ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${animationDuration}ms ease`;

			// If there's a handle, only that should show grab cursor
			if (options.handle) {
				const handles = el.querySelectorAll(options.handle);
				handles.forEach((handle) => {
					(handle as HTMLElement).style.cursor = 'grab';
				});
			}
		});
	}

	// Setup event listeners
	node.addEventListener('mousedown', handleMouseDown);
	node.addEventListener('dragstart', handleDragStart);
	node.addEventListener('drag', handleDrag);
	node.addEventListener('dragover', handleDragOver);
	node.addEventListener('dragend', handleDragEnd);

	// Touch event listeners
	node.addEventListener('touchstart', handleTouchStart, { passive: false });
	node.addEventListener('touchmove', handleTouchMove, { passive: false });
	node.addEventListener('touchend', handleTouchEnd);

	// Initial setup
	updateDraggableItems();

	// Watch for changes
	const observer = new MutationObserver(updateDraggableItems);
	observer.observe(node, { childList: true });

	return {
		update(newOptions: DragSortableOptions) {
			options = newOptions;
			updateDraggableItems();
		},
		destroy() {
			node.removeEventListener('mousedown', handleMouseDown);
			node.removeEventListener('dragstart', handleDragStart);
			node.removeEventListener('drag', handleDrag);
			node.removeEventListener('dragover', handleDragOver);
			node.removeEventListener('dragend', handleDragEnd);
			node.removeEventListener('touchstart', handleTouchStart);
			node.removeEventListener('touchmove', handleTouchMove);
			node.removeEventListener('touchend', handleTouchEnd);

			if (scrollInterval) clearInterval(scrollInterval);
			ghostElement?.remove();
			observer.disconnect();
		}
	};
}
