<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import { SearchX } from '@lucide/svelte';
	import SearchBar from './components/search-bar.svelte';
	import CategoryFilter from './components/category-filter.svelte';
	import ExternalToolCard from './components/external-tool-card.svelte';
	import { categories } from './data/categories';
	import { allTools as toolsData } from './data/tools';
	import type { CategoryId, ExternalTool } from './types';

	// Import both locales for bilingual search
	import enLocale from '@/i18n/locales/en.json';
	import zhLocale from '@/i18n/locales/zh.json';

	const i18n = useI18n();

	// State
	let searchQuery = $state('');
	let selectedCategory = $state<CategoryId>('featured');

	// Debounced search
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
		selectedCategory = id;
	}

	function clearFilters() {
		searchQuery = '';
		debouncedQuery = '';
		selectedCategory = 'featured';
	}

	/**
	 * Tokenize search query - split by spaces and handle both English and Chinese
	 */
	function tokenizeQuery(query: string): string[] {
		// Split by whitespace for English words
		const tokens = query
			.toLowerCase()
			.split(/\s+/)
			.filter((t) => t.length > 0);
		return tokens;
	}

	/**
	 * Get tool description from both locales
	 */
	function getToolDescriptions(tool: ExternalTool): string[] {
		const descriptions: string[] = [];

		// Extract tool id from descriptionKey (e.g., "chain_tools.tools.uniswap.description" -> "uniswap")
		const keyParts = tool.descriptionKey.split('.');
		const toolId = keyParts[keyParts.length - 2]; // Get the tool id part

		// Get English description
		const enTools = enLocale.chain_tools?.tools as Record<
			string,
			{ description?: string } | undefined
		>;
		if (enTools?.[toolId]?.description) {
			descriptions.push(enTools[toolId].description.toLowerCase());
		}

		// Get Chinese description
		const zhTools = zhLocale.chain_tools?.tools as Record<
			string,
			{ description?: string } | undefined
		>;
		if (zhTools?.[toolId]?.description) {
			descriptions.push(zhTools[toolId].description.toLowerCase());
		}

		return descriptions;
	}

	/**
	 * Check if a tool matches the search query
	 * Supports: name, description (both EN/ZH), tags, chains
	 * Uses token-based matching for multi-word queries
	 */
	function matchesTool(tool: ExternalTool, tokens: string[]): boolean {
		// Build searchable text from all fields
		const searchableTexts: string[] = [
			tool.name.toLowerCase(),
			...tool.tags.map((t) => t.toLowerCase()),
			...(tool.chains || []).map((c) => c.toLowerCase()),
			...getToolDescriptions(tool)
		];

		const combinedText = searchableTexts.join(' ');

		// All tokens must match somewhere in the combined text
		return tokens.every((token) => combinedText.includes(token));
	}

	/**
	 * Sort tools: BiuBiu tools before competitors (only within same category filter)
	 */
	function sortToolsWithBiubiuFirst(tools: ExternalTool[]): ExternalTool[] {
		return [...tools].sort((a, b) => {
			const aIsBiubiu = a.id.startsWith('biubiu-');
			const bIsBiubiu = b.id.startsWith('biubiu-');

			// BiuBiu tools before competitors
			if (aIsBiubiu && !bIsBiubiu) return -1;
			if (!aIsBiubiu && bIsBiubiu) return 1;

			// Keep original order for tools in the same group
			return 0;
		});
	}

	// Filtered tools
	const filteredTools = $derived.by(() => {
		let result = toolsData;
		const hasSearchQuery = debouncedQuery.trim().length > 0;

		// When searching, ignore category filter and search all tools
		if (hasSearchQuery) {
			const tokens = tokenizeQuery(debouncedQuery);
			if (tokens.length > 0) {
				result = result.filter((tool) => matchesTool(tool, tokens));
			}
			return result;
		}

		// No search query - apply category filter
		if (selectedCategory === 'featured') {
			// Show only featured tools
			result = result.filter((tool) => tool.isFeatured === true);
		} else {
			// Filter by specific category
			result = result.filter((tool) => tool.category === selectedCategory);
			// Sort BiuBiu tools first when filtering by specific category
			return sortToolsWithBiubiuFirst(result);
		}

		return result;
	});

	const hasActiveFilters = $derived(
		selectedCategory !== 'featured' || debouncedQuery.trim() !== ''
	);
</script>

<div class="chain-tools-page">
	<!-- Header -->
	<header class="page-header">
		<!-- <div class="header-icon">
			<Link2 class="icon" />
		</div> -->
		<h1 class="page-title">{i18n.t('chain_tools.title')}</h1>
		<p class="page-subtitle">{i18n.t('chain_tools.subtitle')}</p>
	</header>

	<!-- Search and Filter -->
	<div class="controls">
		<SearchBar value={searchQuery} onchange={handleSearchChange} />
		<CategoryFilter {categories} selected={selectedCategory} onselect={handleCategorySelect} />
	</div>

	<!-- Tools Grid -->
	{#if filteredTools.length > 0}
		<div class="tools-grid">
			{#each filteredTools as tool, index (tool.id)}
				<ExternalToolCard {tool} {index} />
			{/each}
		</div>
	{:else}
		<!-- Empty State -->
		<div class="empty-state">
			<div class="empty-icon">
				<SearchX class="icon" />
			</div>
			<h3 class="empty-title">{i18n.t('chain_tools.empty_title')}</h3>
			<p class="empty-description">{i18n.t('chain_tools.empty_description')}</p>
			{#if hasActiveFilters}
				<button class="clear-filters-btn" onclick={clearFilters}>
					{i18n.t('chain_tools.clear_filters')}
				</button>
			{/if}
		</div>
	{/if}

	<!-- Footer Stats -->
	<div class="page-footer">
		<p class="stats">
			{i18n.t('chain_tools.showing_count', {
				count: filteredTools.length,
				total: toolsData.length
			})}
		</p>
	</div>
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

	/* Grid */
	.tools-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
		gap: var(--space-5);
	}

	@media (min-width: 640px) {
		.tools-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 900px) {
		.tools-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (min-width: 1200px) {
		.tools-grid {
			grid-template-columns: repeat(4, 1fr);
			gap: var(--space-6);
		}
	}

	/* Empty State */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: var(--space-16) var(--space-6);
		text-align: center;
	}

	.empty-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 72px;
		height: 72px;
		margin-bottom: var(--space-5);
		background: linear-gradient(135deg, var(--color-panel-2), var(--color-panel-3));
		border-radius: var(--radius-full);
	}

	.empty-icon :global(.icon) {
		width: 32px;
		height: 32px;
		color: var(--color-description-3);
	}

	.empty-title {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--color-heading-2);
		margin-bottom: var(--space-2);
	}

	.empty-description {
		font-size: var(--text-sm);
		color: var(--color-description-3);
		margin-bottom: var(--space-5);
		max-width: 320px;
	}

	.clear-filters-btn {
		padding: var(--space-2-5) var(--space-5);
		background: var(--color-primary);
		border: none;
		border-radius: var(--radius-lg);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: white;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.clear-filters-btn:hover {
		background: var(--color-primary-dark);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px color-mix(in srgb, var(--color-primary) 30%, transparent);
	}

	/* Footer */
	.page-footer {
		margin-top: var(--space-10);
		padding-top: var(--space-5);
		border-top: 1px solid var(--color-panel-border-1);
		text-align: center;
	}

	.stats {
		font-size: var(--text-sm);
		color: var(--color-description-3);
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

		.tools-grid {
			gap: var(--space-3);
		}

		.empty-state {
			padding: var(--space-10) var(--space-4);
		}

		.empty-icon {
			width: 60px;
			height: 60px;
		}

		.empty-icon :global(.icon) {
			width: 28px;
			height: 28px;
		}

		.page-footer {
			margin-top: var(--space-8);
			padding-top: var(--space-4);
		}
	}
</style>
