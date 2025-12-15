<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';

	interface Props<T> {
		items: T[];
		itemHeight: number;
		maxHeight?: number;
		children: Snippet<[T, number]>;
	}

	let { items, itemHeight, maxHeight = 400, children }: Props<T> = $props();

	let scrollContainer: HTMLDivElement;
	let scrollTop = $state(0);

	// Calculate visible range
	let visibleStart = $derived(Math.floor(scrollTop / itemHeight));
	let visibleCount = $derived(Math.ceil(maxHeight / itemHeight) + 2); // +2 for buffer
	let visibleEnd = $derived(Math.min(visibleStart + visibleCount, items.length));

	// Virtual list dimensions
	let totalHeight = $derived(items.length * itemHeight);
	let offsetY = $derived(visibleStart * itemHeight);

	// Get visible items
	let visibleItems = $derived(items.slice(visibleStart, visibleEnd));

	function handleScroll(event: Event) {
		const target = event.target as HTMLDivElement;
		scrollTop = target.scrollTop;
	}
</script>

<div
	bind:this={scrollContainer}
	class="virtual-list"
	style="max-height: {maxHeight}px; overflow-y: auto;"
	onscroll={handleScroll}
>
	<div class="virtual-list-spacer" style="height: {totalHeight}px;">
		<div class="virtual-list-content" style="transform: translateY({offsetY}px);">
			{#each visibleItems as item, index (visibleStart + index)}
				<div class="virtual-list-item" style="height: {itemHeight}px;">
					{@render children(item, visibleStart + index)}
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.virtual-list {
		position: relative;
		overflow-y: auto;
	}

	.virtual-list-spacer {
		position: relative;
	}

	.virtual-list-content {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		will-change: transform;
	}

	.virtual-list-item {
		overflow: hidden;
	}

	/* Scrollbar styling */
	.virtual-list::-webkit-scrollbar {
		width: 6px;
	}

	.virtual-list::-webkit-scrollbar-track {
		background: rgba(0, 0, 0, 0.05);
		border-radius: var(--radius-sm);
	}

	.virtual-list::-webkit-scrollbar-thumb {
		background: rgba(0, 0, 0, 0.2);
		border-radius: var(--radius-sm);
	}

	.virtual-list::-webkit-scrollbar-thumb:hover {
		background: rgba(0, 0, 0, 0.3);
	}
</style>
