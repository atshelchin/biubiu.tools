<script lang="ts">
	import { LifeBuoy, MessageCircleQuestion, Bug, X } from '@lucide/svelte';
	import { browser } from '$app/environment';
	import { useI18n } from '@shelchin/i18n/svelte';
	import { onMount } from 'svelte';

	const STORAGE_KEY = 'floating-help-position';
	const GITHUB_ISSUES_URL = 'https://github.com/atshelchin/biubiu.tools/issues/new';
	const GITHUB_DISCUSSIONS_URL = 'https://github.com/atshelchin/biubiu.tools/discussions';

	const i18n = useI18n();
	let mounted = $state(false);

	// State for UI updates only
	let isDragging = $state(false);
	let isMenuOpen = $state(false);

	// Use regular variables for position (no reactivity needed for performance)
	let currentX = 0;
	let currentY = 0;
	// svelte-ignore non_reactive_update
	let currentSide: 'left' | 'right' = 'right';
	let dragStartX = 0;
	let dragStartY = 0;
	let hasMoved = false;

	// Refs - using bind:this, reactivity handled by Svelte
	// svelte-ignore non_reactive_update
	let buttonRef: HTMLButtonElement | null = null;
	// svelte-ignore non_reactive_update
	let menuRef: HTMLDivElement | null = null;

	// Constants
	const BUTTON_SIZE = 52;
	const EDGE_MARGIN = 12;
	const BOTTOM_OFFSET = 200;
	const DRAG_THRESHOLD = 5;

	onMount(() => {
		loadPosition();
		mounted = true;
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	});

	function loadPosition() {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				currentX = parsed.x;
				currentY = parsed.y;
				currentSide = parsed.side;
				constrainPosition();
			} catch {
				setDefaultPosition();
			}
		} else {
			setDefaultPosition();
		}
		// Schedule position update after DOM is ready
		requestAnimationFrame(() => updateButtonPosition());
	}

	function setDefaultPosition() {
		if (!browser) return;
		currentSide = 'right';
		currentX = window.innerWidth - BUTTON_SIZE - EDGE_MARGIN;
		currentY = window.innerHeight - BOTTOM_OFFSET - BUTTON_SIZE;
	}

	function savePosition() {
		if (!browser) return;
		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({ x: currentX, y: currentY, side: currentSide })
		);
	}

	function constrainPosition() {
		if (!browser) return;
		const maxY = window.innerHeight - BUTTON_SIZE - EDGE_MARGIN;
		const minY = EDGE_MARGIN;
		currentY = Math.max(minY, Math.min(maxY, currentY));

		// Snap to edge
		if (currentSide === 'right') {
			currentX = window.innerWidth - BUTTON_SIZE - EDGE_MARGIN;
		} else {
			currentX = EDGE_MARGIN;
		}
	}

	function updateButtonPosition(animate = false) {
		if (!buttonRef) return;
		if (animate) {
			buttonRef.style.transition = 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)';
		} else {
			buttonRef.style.transition = 'none';
		}
		buttonRef.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
	}

	function updateMenuPosition() {
		if (!menuRef) return;
		const menuX = currentSide === 'right' ? currentX - 200 : currentX + BUTTON_SIZE + 12;
		menuRef.style.transform = `translate3d(${menuX}px, ${currentY}px, 0)`;
	}

	function handleResize() {
		constrainPosition();
		updateButtonPosition();
		savePosition();
	}

	// Drag handlers - using direct DOM manipulation for performance
	function handlePointerDown(e: PointerEvent) {
		if (isMenuOpen) return;

		isDragging = true;
		hasMoved = false;
		dragStartX = e.clientX;
		dragStartY = e.clientY;

		buttonRef?.setPointerCapture(e.pointerId);
		e.preventDefault();
	}

	function handlePointerMove(e: PointerEvent) {
		if (!isDragging || !buttonRef) return;

		const deltaX = e.clientX - dragStartX;
		const deltaY = e.clientY - dragStartY;

		// Check if we've moved enough to consider it a drag
		if (!hasMoved && (Math.abs(deltaX) > DRAG_THRESHOLD || Math.abs(deltaY) > DRAG_THRESHOLD)) {
			hasMoved = true;
		}

		if (hasMoved) {
			// Calculate new position
			let newX = currentX + deltaX;
			let newY = currentY + deltaY;

			// Constrain within bounds
			newX = Math.max(EDGE_MARGIN, Math.min(window.innerWidth - BUTTON_SIZE - EDGE_MARGIN, newX));
			newY = Math.max(EDGE_MARGIN, Math.min(window.innerHeight - BUTTON_SIZE - EDGE_MARGIN, newY));

			currentX = newX;
			currentY = newY;
			dragStartX = e.clientX;
			dragStartY = e.clientY;

			// Direct DOM update for smooth dragging
			buttonRef.style.transition = 'none';
			buttonRef.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
		}
	}

	function handlePointerUp(e: PointerEvent) {
		if (!isDragging) return;

		buttonRef?.releasePointerCapture(e.pointerId);
		isDragging = false;

		if (hasMoved) {
			// Snap to nearest edge with animation
			const centerX = currentX + BUTTON_SIZE / 2;
			const screenCenter = window.innerWidth / 2;

			currentSide = centerX < screenCenter ? 'left' : 'right';
			constrainPosition();
			updateButtonPosition(true);
			savePosition();
		} else {
			// It was a click, not a drag
			toggleMenu();
		}
	}

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
		if (isMenuOpen) {
			// Update menu position after it renders
			requestAnimationFrame(() => updateMenuPosition());
		}
	}

	function closeMenu() {
		isMenuOpen = false;
	}

	function handleGetHelp() {
		window.open(GITHUB_DISCUSSIONS_URL, '_blank');
		closeMenu();
	}

	function handleReportIssue() {
		window.open(GITHUB_ISSUES_URL, '_blank');
		closeMenu();
	}

	// Close menu when clicking outside
	function handleOutsideClick(e: MouseEvent) {
		if (isMenuOpen && buttonRef && !buttonRef.contains(e.target as Node)) {
			if (menuRef && !menuRef.contains(e.target as Node)) {
				closeMenu();
			}
		}
	}

	$effect(() => {
		if (browser && isMenuOpen) {
			document.addEventListener('click', handleOutsideClick);
			return () => document.removeEventListener('click', handleOutsideClick);
		}
	});
</script>

{#if mounted}
	<div class="floating-help-container">
		<button
			bind:this={buttonRef}
			class="floating-help-button"
			class:dragging={isDragging}
			class:menu-open={isMenuOpen}
			onpointerdown={handlePointerDown}
			onpointermove={handlePointerMove}
			onpointerup={handlePointerUp}
			onpointercancel={handlePointerUp}
			aria-label={i18n.t('helpButton.label')}
			aria-expanded={isMenuOpen}
		>
			{#if isMenuOpen}
				<X size={24} strokeWidth={2} />
			{:else}
				<LifeBuoy size={32} strokeWidth={2} />
			{/if}
		</button>

		{#if isMenuOpen}
			<div
				bind:this={menuRef}
				class="floating-help-menu"
				class:menu-left={currentSide === 'right'}
				role="menu"
			>
				<button class="menu-item" onclick={handleGetHelp} role="menuitem">
					<MessageCircleQuestion size={20} />
					<span>{i18n.t('helpButton.getHelp')}</span>
				</button>
				<button class="menu-item" onclick={handleReportIssue} role="menuitem">
					<Bug size={20} />
					<span>{i18n.t('helpButton.reportIssue')}</span>
				</button>
			</div>
		{/if}
	</div>
{/if}

<style>
	.floating-help-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 0;
		height: 0;
		z-index: 50;
		pointer-events: none;
	}

	.floating-help-button {
		position: absolute;
		padding: 4px;
		top: 0;
		left: 0;
		width: 52px;
		height: 52px;
		border-radius: 50%;
		border: 1px solid var(--color-border);
		background: var(--color-background);
		color: var(--color-muted-foreground);
		box-shadow:
			0 4px 12px rgba(0, 0, 0, 0.08),
			0 2px 4px rgba(0, 0, 0, 0.04);
		cursor: grab;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: auto;
		touch-action: none;
		user-select: none;
		-webkit-user-select: none;
		will-change: transform;
	}

	.floating-help-button:hover {
		color: var(--color-foreground);
		border-color: var(--color-border);
		box-shadow:
			0 6px 16px rgba(0, 0, 0, 0.12),
			0 3px 6px rgba(0, 0, 0, 0.06);
	}

	.floating-help-button.dragging {
		cursor: grabbing;
		box-shadow:
			0 12px 28px rgba(0, 0, 0, 0.15),
			0 6px 12px rgba(0, 0, 0, 0.08);
		transform-origin: center center;
	}

	.floating-help-button.menu-open {
		background: var(--brand-500, #10b981);
		border-color: var(--brand-600, #059669);
		color: white;
		cursor: pointer;
	}

	.floating-help-menu {
		position: absolute;
		top: 0;
		left: 0;
		background: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		box-shadow:
			0 8px 24px rgba(0, 0, 0, 0.12),
			0 4px 8px rgba(0, 0, 0, 0.06);
		padding: var(--space-2);
		min-width: 180px;
		pointer-events: auto;
		animation: menu-in 0.2s ease;
		will-change: transform;
	}

	.floating-help-menu.menu-left {
		transform-origin: right center;
	}

	@keyframes menu-in {
		from {
			opacity: 0;
			scale: 0.95;
		}
		to {
			opacity: 1;
			scale: 1;
		}
	}

	.menu-item {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		width: 100%;
		padding: var(--space-3) var(--space-4);
		border: none;
		background: transparent;
		color: var(--color-foreground);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: background 0.15s ease;
		text-align: left;
	}

	.menu-item:hover {
		background: var(--color-muted);
	}

	.menu-item:active {
		background: var(--color-accent);
	}

	/* Dark mode adjustments */
	:global([data-theme='dark']) .floating-help-button {
		background: var(--color-card, #1f2937);
		box-shadow:
			0 4px 12px rgba(0, 0, 0, 0.25),
			0 2px 4px rgba(0, 0, 0, 0.15);
	}

	:global([data-theme='dark']) .floating-help-button:hover {
		box-shadow:
			0 6px 16px rgba(0, 0, 0, 0.35),
			0 3px 6px rgba(0, 0, 0, 0.2);
	}

	:global([data-theme='dark']) .floating-help-menu {
		background: var(--color-card, #1f2937);
		box-shadow:
			0 8px 24px rgba(0, 0, 0, 0.35),
			0 4px 8px rgba(0, 0, 0, 0.2);
	}

	/* Mobile optimizations */
	@media (max-width: 768px) {
		.floating-help-button {
			width: 48px;
			height: 48px;
		}

		.floating-help-menu {
			min-width: 160px;
		}

		.menu-item {
			padding: var(--space-3);
		}
	}

	/* Reduce motion for accessibility */
	@media (prefers-reduced-motion: reduce) {
		.floating-help-menu {
			animation: none;
		}
	}
</style>
