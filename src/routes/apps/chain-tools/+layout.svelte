<script lang="ts">
	import { useI18n } from '@shelchin/i18n';
	import SearchBar from '@/features/chain-tools/components/search-bar.svelte';
	import CategoryFilter from '@/features/chain-tools/components/category-filter.svelte';
	import { categories } from '@/features/chain-tools/data/categories';
	import type { CategoryId } from '@/features/chain-tools/types';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let { children } = $props();

	const i18n = useI18n();

	// Get current category from URL
	const currentCategory = $derived.by(() => {
		const pathParts = $page.url.pathname.split('/');
		const lastPart = pathParts[pathParts.length - 1];
		// If we're at /chain-tools, show featured
		if (lastPart === 'chain-tools') return 'featured' as CategoryId;
		// Otherwise use the category from URL
		return lastPart as CategoryId;
	});

	// Search state
	let searchQuery = $state('');
	let debouncedQuery = $state('');
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;

	function handleSearchChange(value: string) {
		searchQuery = value;

		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}

		debounceTimer = setTimeout(() => {
			debouncedQuery = value;
		}, 300);
	}

	function handleCategorySelect(id: CategoryId) {
		// Clear search when changing category
		searchQuery = '';
		debouncedQuery = '';

		// Navigate to category route
		const basePath = $page.url.pathname.includes('/zh/')
			? '/zh/apps/chain-tools'
			: '/apps/chain-tools';

		if (id === 'featured') {
			goto(basePath);
		} else {
			goto(`${basePath}/${id}`);
		}
	}

	// Expose search query to child pages via context or props
	import { setContext } from 'svelte';
	setContext('chainToolsSearch', {
		get query() {
			return debouncedQuery;
		}
	});
</script>

<div class="chain-tools-page">
	<!-- Header -->
	<header class="page-header">
		<h1 class="page-title">{i18n.t('routes/apps/chain-tools/chain-tools.title')}</h1>
		<p class="page-subtitle">{i18n.t('routes/apps/chain-tools/chain-tools.subtitle')}</p>
	</header>

	<!-- Search and Filter -->
	<div class="controls">
		<SearchBar value={searchQuery} onchange={handleSearchChange} />
		<CategoryFilter {categories} selected={currentCategory} onselect={handleCategorySelect} />
	</div>

	<!-- Page Content -->
	{@render children()}
</div>

<style>
	.chain-tools-page {
		max-width: 1280px;
		margin: 0 auto;
	}

	/* Header */
	.page-header {
		text-align: center;
		margin-bottom: var(--space-8);
	}

	.page-title {
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		color: var(--color-heading-1);
		margin-bottom: var(--space-2);
		letter-spacing: -0.02em;
	}

	.page-subtitle {
		font-size: var(--text-base);
		color: var(--color-description-2);
		max-width: 480px;
		margin: 0 auto;
		line-height: 1.6;
	}

	/* Controls */
	.controls {
		display: flex;
		flex-direction: column;
		gap: var(--space-5);
		margin-bottom: var(--space-8);
	}

	/* Mobile */
	@media (max-width: 768px) {
		.chain-tools-page {
			padding: var(--space-4) var(--space-3);
		}

		.page-header {
			margin-bottom: var(--space-6);
		}

		.page-title {
			font-size: var(--text-xl);
		}

		.page-subtitle {
			font-size: var(--text-sm);
		}

		.controls {
			gap: var(--space-4);
			margin-bottom: var(--space-6);
		}
	}
</style>
