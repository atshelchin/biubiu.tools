<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import type { Category, CategoryId } from '../types';

	interface Props {
		categories: Category[];
		selected: CategoryId;
		onselect: (id: CategoryId) => void;
	}

	let { categories, selected, onselect }: Props = $props();

	const i18n = useI18n();

	// Reference to the scroll container
	let scrollContainer: HTMLDivElement | undefined = $state();

	// Store button references by category id
	let buttonRefs = new SvelteMap<CategoryId, HTMLButtonElement>();

	function handleSelect(id: CategoryId, button: HTMLButtonElement) {
		// Scroll the clicked button to center
		scrollToCenter(button);
		// Call the parent's onselect
		onselect(id);
	}

	function scrollToCenter(button: HTMLButtonElement) {
		if (!scrollContainer) return;

		const containerRect = scrollContainer.getBoundingClientRect();
		const buttonRect = button.getBoundingClientRect();

		// Calculate the scroll position to center the button
		const buttonCenter = buttonRect.left + buttonRect.width / 2;
		const containerCenter = containerRect.left + containerRect.width / 2;
		const scrollOffset = buttonCenter - containerCenter;

		scrollContainer.scrollBy({
			left: scrollOffset,
			behavior: 'smooth'
		});
	}

	// Action to register button reference
	function registerButton(node: HTMLButtonElement, id: CategoryId) {
		buttonRefs.set(id, node);

		return {
			destroy() {
				buttonRefs.delete(id);
			}
		};
	}

	// Auto-scroll to selected category on mount and when selected changes
	$effect(() => {
		if (selected && scrollContainer) {
			// Small delay to ensure buttons are rendered
			requestAnimationFrame(() => {
				const button = buttonRefs.get(selected);
				if (button) {
					scrollToCenter(button);
				}
			});
		}
	});
</script>

<div class="category-filter">
	<div class="filter-scroll" bind:this={scrollContainer}>
		{#each categories as category (category.id)}
			{@const Icon = category.icon}
			<button
				class="filter-btn"
				class:active={selected === category.id}
				style="--category-color: {category.color}"
				onclick={(e) => handleSelect(category.id, e.currentTarget)}
				use:registerButton={category.id}
			>
				<Icon class="filter-icon" />
				<span class="filter-label">{i18n.t(category.labelKey)}</span>
			</button>
		{/each}
	</div>
	<!-- Scroll fade indicators -->
	<div class="scroll-fade scroll-fade-left"></div>
	<div class="scroll-fade scroll-fade-right"></div>
</div>

<style>
	.category-filter {
		position: relative;
		width: 100%;
		overflow: hidden;
	}

	.filter-scroll {
		display: flex;
		gap: var(--space-3);
		overflow-x: auto;
		padding: var(--space-2) var(--space-4);
		scrollbar-width: none;
		-ms-overflow-style: none;
		scroll-behavior: smooth;
		-webkit-overflow-scrolling: touch;
	}

	.filter-scroll::-webkit-scrollbar {
		display: none;
	}

	/* Scroll fade indicators */
	.scroll-fade {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 40px;
		pointer-events: none;
		z-index: 1;
	}

	.scroll-fade-left {
		left: 0;
		background: linear-gradient(to right, var(--color-background), transparent);
	}

	.scroll-fade-right {
		right: 0;
		background: linear-gradient(to left, var(--color-background), transparent);
	}

	.filter-btn {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2-5) var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-full);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-description-2);
		white-space: nowrap;
		cursor: pointer;
		transition: all 0.2s ease;
		min-height: 40px;
	}

	:global(.light) .filter-btn {
		background: var(--color-panel-2);
	}

	.filter-btn:hover {
		background: var(--color-panel-2);
		border-color: var(--color-panel-border-3);
		color: var(--color-text-primary);
		transform: translateY(-1px);
	}

	:global(.light) .filter-btn:hover {
		background: var(--color-panel-3);
	}

	.filter-btn.active {
		background: var(--category-color);
		border-color: var(--category-color);
		color: white;
		box-shadow: 0 2px 8px color-mix(in srgb, var(--category-color) 40%, transparent);
	}

	.filter-btn.active:hover {
		background: var(--category-color);
		filter: brightness(1.1);
		transform: translateY(-1px);
	}

	:global(.filter-icon) {
		width: 16px;
		height: 16px;
		flex-shrink: 0;
	}

	.filter-label {
		line-height: 1;
	}

	@media (max-width: 768px) {
		.filter-scroll {
			gap: var(--space-2);
			padding: var(--space-2) var(--space-3);
		}

		.filter-btn {
			padding: var(--space-2) var(--space-3);
			font-size: var(--text-xs);
			min-height: 36px;
		}

		:global(.filter-icon) {
			width: 14px;
			height: 14px;
		}

		.scroll-fade {
			width: 24px;
		}
	}
</style>
