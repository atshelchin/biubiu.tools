<script lang="ts">
	import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from '@lucide/svelte';

	interface Props {
		currentPage: number;
		totalPages: number;
		onPageChange: (page: number) => void;
		/** Number of page buttons to show on each side of current page (desktop) */
		siblingCount?: number;
		/** Show first/last buttons */
		showFirstLast?: boolean;
		/** Labels for accessibility */
		labels?: {
			previous?: string;
			next?: string;
			first?: string;
			last?: string;
			page?: string;
		};
	}

	let {
		currentPage,
		totalPages,
		onPageChange,
		siblingCount = 1,
		showFirstLast = true,
		labels = {}
	}: Props = $props();

	const defaultLabels = {
		previous: 'Previous',
		next: 'Next',
		first: 'First',
		last: 'Last',
		page: 'Page'
	};

	const mergedLabels = $derived({ ...defaultLabels, ...labels });

	/**
	 * Generate page numbers to display
	 * Shows: first, ..., siblings around current, ..., last
	 */
	const pageNumbers = $derived.by(() => {
		const pages: (number | 'ellipsis')[] = [];

		if (totalPages <= 7) {
			// Show all pages if total is small
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
			return pages;
		}

		// Always show first page
		pages.push(1);

		// Calculate range around current page
		const leftSibling = Math.max(2, currentPage - siblingCount);
		const rightSibling = Math.min(totalPages - 1, currentPage + siblingCount);

		// Add left ellipsis if needed
		if (leftSibling > 2) {
			pages.push('ellipsis');
		}

		// Add pages around current
		for (let i = leftSibling; i <= rightSibling; i++) {
			if (i !== 1 && i !== totalPages) {
				pages.push(i);
			}
		}

		// Add right ellipsis if needed
		if (rightSibling < totalPages - 1) {
			pages.push('ellipsis');
		}

		// Always show last page
		if (totalPages > 1) {
			pages.push(totalPages);
		}

		return pages;
	});

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages && page !== currentPage) {
			onPageChange(page);
		}
	}
</script>

{#if totalPages > 1}
	<nav class="pagination" aria-label="Pagination">
		<!-- Mobile: Simple prev/next with page indicator -->
		<div class="pagination-mobile">
			<button
				class="nav-btn"
				onclick={() => goToPage(currentPage - 1)}
				disabled={currentPage === 1}
				aria-label={mergedLabels.previous}
			>
				<ChevronLeft class="icon" />
				<span class="btn-text">{mergedLabels.previous}</span>
			</button>

			<span class="page-indicator">
				{currentPage} / {totalPages}
			</span>

			<button
				class="nav-btn"
				onclick={() => goToPage(currentPage + 1)}
				disabled={currentPage === totalPages}
				aria-label={mergedLabels.next}
			>
				<span class="btn-text">{mergedLabels.next}</span>
				<ChevronRight class="icon" />
			</button>
		</div>

		<!-- Desktop: Full pagination -->
		<div class="pagination-desktop">
			{#if showFirstLast}
				<button
					class="page-btn nav-btn-icon"
					onclick={() => goToPage(1)}
					disabled={currentPage === 1}
					aria-label={mergedLabels.first}
				>
					<ChevronsLeft class="icon" />
				</button>
			{/if}

			<button
				class="page-btn nav-btn-icon"
				onclick={() => goToPage(currentPage - 1)}
				disabled={currentPage === 1}
				aria-label={mergedLabels.previous}
			>
				<ChevronLeft class="icon" />
			</button>

			<div class="page-numbers">
				{#each pageNumbers as item, index (index)}
					{#if item === 'ellipsis'}
						<span class="ellipsis">...</span>
					{:else}
						<button
							class="page-btn"
							class:active={item === currentPage}
							onclick={() => goToPage(item)}
							aria-label="{mergedLabels.page} {item}"
							aria-current={item === currentPage ? 'page' : undefined}
						>
							{item}
						</button>
					{/if}
				{/each}
			</div>

			<button
				class="page-btn nav-btn-icon"
				onclick={() => goToPage(currentPage + 1)}
				disabled={currentPage === totalPages}
				aria-label={mergedLabels.next}
			>
				<ChevronRight class="icon" />
			</button>

			{#if showFirstLast}
				<button
					class="page-btn nav-btn-icon"
					onclick={() => goToPage(totalPages)}
					disabled={currentPage === totalPages}
					aria-label={mergedLabels.last}
				>
					<ChevronsRight class="icon" />
				</button>
			{/if}
		</div>
	</nav>
{/if}

<style>
	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--space-2);
		margin-top: var(--space-6);
	}

	/* Mobile pagination */
	.pagination-mobile {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		width: 100%;
		justify-content: space-between;
	}

	.pagination-desktop {
		display: none;
	}

	.nav-btn {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-2) var(--space-3);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-heading-2);
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.nav-btn:hover:not(:disabled) {
		background: var(--color-panel-3);
		border-color: var(--color-panel-border-2);
	}

	.nav-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.nav-btn :global(.icon) {
		width: 16px;
		height: 16px;
	}

	.page-indicator {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-description-2);
		white-space: nowrap;
	}

	/* Desktop pagination */
	@media (min-width: 640px) {
		.pagination-mobile {
			display: none;
		}

		.pagination-desktop {
			display: flex;
			align-items: center;
			gap: var(--space-1);
		}

		.page-numbers {
			display: flex;
			align-items: center;
			gap: var(--space-1);
		}

		.page-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			min-width: 36px;
			height: 36px;
			padding: 0 var(--space-2);
			font-size: var(--text-sm);
			font-weight: var(--font-medium);
			color: var(--color-heading-2);
			background: var(--color-panel-2);
			border: 1px solid var(--color-panel-border-1);
			border-radius: var(--radius-md);
			cursor: pointer;
			transition: all 0.15s ease;
		}

		.page-btn:hover:not(:disabled):not(.active) {
			background: var(--color-panel-3);
			border-color: var(--color-panel-border-2);
		}

		.page-btn:disabled {
			opacity: 0.4;
			cursor: not-allowed;
		}

		.page-btn.active {
			background: var(--color-accent);
			border-color: var(--color-accent);
			color: white;
		}

		.page-btn :global(.icon) {
			width: 16px;
			height: 16px;
		}

		.nav-btn-icon {
			padding: 0;
		}

		.ellipsis {
			display: flex;
			align-items: center;
			justify-content: center;
			min-width: 36px;
			height: 36px;
			font-size: var(--text-sm);
			color: var(--color-description-3);
		}
	}

	/* Touch-friendly on tablets */
	@media (min-width: 640px) and (max-width: 1024px) {
		.page-btn {
			min-width: 40px;
			height: 40px;
		}

		.ellipsis {
			min-width: 40px;
			height: 40px;
		}
	}
</style>
