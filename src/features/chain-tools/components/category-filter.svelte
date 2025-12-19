<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import type { Category, CategoryId } from '../types';

	interface Props {
		categories: Category[];
		selected: CategoryId;
		onselect: (id: CategoryId) => void;
	}

	let { categories, selected, onselect }: Props = $props();

	const i18n = useI18n();
</script>

<div class="category-filter">
	<div class="filter-scroll">
		{#each categories as category (category.id)}
			{@const Icon = category.icon}
			<button
				class="filter-btn"
				class:active={selected === category.id}
				style="--category-color: {category.color}"
				onclick={() => onselect(category.id)}
			>
				<Icon class="filter-icon" />
				<span class="filter-label">{i18n.t(category.labelKey)}</span>
			</button>
		{/each}
	</div>
</div>

<style>
	.category-filter {
		width: 100%;
		overflow: hidden;
	}

	.filter-scroll {
		display: flex;
		gap: var(--space-2);
		overflow-x: auto;
		padding: var(--space-2) var(--space-1);
		scrollbar-width: none;
		-ms-overflow-style: none;
	}

	.filter-scroll::-webkit-scrollbar {
		display: none;
	}

	.filter-btn {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-full);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-description-2);
		white-space: nowrap;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	:global(.light) .filter-btn {
		background: var(--color-panel-2);
	}

	.filter-btn:hover {
		background: var(--color-panel-2);
		border-color: var(--color-panel-border-3);
		color: var(--color-text-primary);
	}

	:global(.light) .filter-btn:hover {
		background: var(--color-panel-3);
	}

	.filter-btn.active {
		background: var(--category-color);
		border-color: var(--category-color);
		color: white;
	}

	.filter-btn.active:hover {
		background: var(--category-color);
		filter: brightness(1.1);
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
		.filter-btn {
			padding: var(--space-2) var(--space-3);
			font-size: var(--text-xs);
		}

		:global(.filter-icon) {
			width: 14px;
			height: 14px;
		}
	}
</style>
