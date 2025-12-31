<script lang="ts">
	import { useI18n } from '@shelchin/i18n';
	import { Map, ChevronLeft, ExternalLink, GitFork, Swords, ArrowRight } from '@lucide/svelte';
	import SeoHead from '$lib/components/seo-head.svelte';
	import { useGuideProgress } from '@/features/chain-tools/composables/use-guide-progress.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();
	const progress = useGuideProgress(data.guide.categoryId);

	// Base paths for absolute links
	const basePath = $derived(`/apps/chain-tools/${data.guide.categoryId}/guide`);
	const toolPath = '/apps/chain-tools/tool';

	// Active sub-category filter
	let activeSubCategory = $state<string | null>(null);

	// Get localized text
	function t(key: string, params?: Record<string, unknown>): string {
		const fullKey = `${data.guide.i18nKeyPrefix}.${key}`;
		return i18n.t(fullKey as never, params as never) || key;
	}

	// Get tool by ID
	function getToolById(toolId: string) {
		return data.tools.find((tool) => tool.id === toolId);
	}

	// Get relation type icon
	function getRelationIcon(type: string) {
		switch (type) {
			case 'fork':
				return GitFork;
			case 'competitor':
				return Swords;
			default:
				return ArrowRight;
		}
	}

	// Get relation type label
	function getRelationLabel(type: string): string {
		switch (type) {
			case 'fork':
				return 'Fork of';
			case 'competitor':
				return 'Competes with';
			case 'depends_on':
				return 'Depends on';
			case 'integrates':
				return 'Integrates';
			case 'built_on':
				return 'Built on';
			case 'same_ecosystem':
				return 'Same ecosystem';
			default:
				return type;
		}
	}

	// Filter tools by sub-category
	const filteredTools = $derived(() => {
		if (!activeSubCategory) return data.tools;
		const subCat = data.guide.ecosystemSubCategories.find((sc) => sc.id === activeSubCategory);
		if (!subCat) return data.tools;
		return data.tools.filter((tool) => subCat.toolIds.includes(tool.id));
	});

	// Get relations for display
	const displayRelations = $derived(data.guide.relations.slice(0, 8));
</script>

<SeoHead
	title={data.meta.title}
	description={data.meta.description}
	keywords={data.meta.keywords}
	canonical={data.meta.canonical}
	type={data.meta.type}
	image={data.meta.image}
	locale={data.meta.locale}
	structuredData={data.structuredData}
/>

<div class="ecosystem-page">
	<!-- Header -->
	<header class="page-header">
		<a href={basePath} class="back-link">
			<ChevronLeft class="back-icon" />
			<span>Back to Guide</span>
		</a>
		<div class="header-content">
			<Map class="header-icon" />
			<div>
				<h1 class="title">{t('ecosystem.title')}</h1>
				<p class="subtitle">{t('ecosystem.description')}</p>
			</div>
		</div>
	</header>

	<!-- Sub-category filters -->
	<section class="subcategory-section">
		<div class="subcategory-tabs">
			<button
				class="subcategory-tab"
				class:active={activeSubCategory === null}
				onclick={() => (activeSubCategory = null)}
			>
				All
			</button>
			{#each data.guide.ecosystemSubCategories as subCat (subCat.id)}
				<button
					class="subcategory-tab"
					class:active={activeSubCategory === subCat.id}
					onclick={() => (activeSubCategory = subCat.id)}
				>
					{t(`ecosystem.${subCat.id}.label`)}
				</button>
			{/each}
		</div>
	</section>

	<!-- Sub-category cards -->
	<section class="subcategories-grid">
		{#each data.guide.ecosystemSubCategories as subCat (subCat.id)}
			<div class="subcategory-card" class:expanded={activeSubCategory === subCat.id}>
				<button
					class="subcategory-header"
					onclick={() => (activeSubCategory = activeSubCategory === subCat.id ? null : subCat.id)}
				>
					<h3 class="subcategory-title">{t(`ecosystem.${subCat.id}.label`)}</h3>
					<span class="subcategory-count">{subCat.toolIds.length} tools</span>
				</button>
				<p class="subcategory-description">{t(`ecosystem.${subCat.id}.description`)}</p>

				{#if activeSubCategory === subCat.id}
					<div class="subcategory-tools">
						{#each subCat.toolIds as toolId (toolId)}
							{@const tool = getToolById(toolId)}
							{#if tool}
								<a href="{toolPath}/{tool.id}" class="tool-chip">
									<span class="tool-chip-name">{tool.name}</span>
									<ExternalLink class="tool-chip-icon" />
								</a>
							{/if}
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</section>

	<!-- Protocol Relations -->
	<section class="relations-section">
		<h2 class="section-title">Protocol Relationships</h2>
		<p class="section-description">
			Understanding how protocols relate to each other helps you navigate the ecosystem
		</p>

		<div class="relations-grid">
			{#each displayRelations as relation (relation.sourceId + relation.targetId)}
				{@const sourceToolData = getToolById(relation.sourceId)}
				{@const targetToolData = getToolById(relation.targetId)}
				{@const RelationIcon = getRelationIcon(relation.type)}
				{#if sourceToolData && targetToolData}
					<div class="relation-card">
						<div class="relation-source">
							<a href="{toolPath}/{sourceToolData.id}" class="relation-tool">
								{sourceToolData.name}
							</a>
						</div>
						<div class="relation-arrow">
							<RelationIcon class="relation-icon" />
							<span class="relation-type">{getRelationLabel(relation.type)}</span>
						</div>
						<div class="relation-target">
							<a href="{toolPath}/{targetToolData.id}" class="relation-tool">
								{targetToolData.name}
							</a>
						</div>
					</div>
				{/if}
			{/each}
		</div>
	</section>

	<!-- All tools list -->
	<section class="all-tools-section">
		<h2 class="section-title">
			{activeSubCategory ? t(`ecosystem.${activeSubCategory}.label`) : 'All DeFi Tools'}
		</h2>
		<p class="section-description">
			{t('ecosystem.view_all', { count: filteredTools().length })}
		</p>

		<div class="tools-grid">
			{#each filteredTools() as tool (tool.id)}
				<a
					href="{toolPath}/{tool.id}"
					class="tool-card"
					onclick={() => progress.setToolStatus(tool.id, 'viewed')}
				>
					<div class="tool-card-header">
						<h4 class="tool-card-name">{tool.name}</h4>
						{#if progress.getToolStatus(tool.id)}
							<span class="tool-status" data-status={progress.getToolStatus(tool.id)}>
								{progress.getToolStatus(tool.id)}
							</span>
						{/if}
					</div>
					<div class="tool-card-tags">
						{#each tool.tags.slice(0, 3) as tag (tag)}
							<span class="tool-tag">{tag}</span>
						{/each}
					</div>
				</a>
			{/each}
		</div>
	</section>

	<!-- Navigation -->
	<div class="page-nav">
		<a href="{basePath}/fundamentals" class="nav-link prev">
			<ChevronLeft class="nav-icon" />
			<span>Fundamentals</span>
		</a>
		<a href="{basePath}/learning-path" class="nav-link next">
			<span>Learning Path</span>
			<ChevronLeft class="nav-icon rotate" />
		</a>
	</div>
</div>

<style>
	.ecosystem-page {
		max-width: 1000px;
		margin: 0 auto;
		padding: var(--space-6);
	}

	/* Header */
	.page-header {
		margin-bottom: var(--space-6);
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-sm);
		color: var(--color-description-3);
		text-decoration: none;
		margin-bottom: var(--space-4);
	}

	.back-link:hover {
		color: #3b82f6;
	}

	.back-link :global(.back-icon) {
		width: 16px;
		height: 16px;
	}

	.header-content {
		display: flex;
		align-items: center;
		gap: var(--space-4);
	}

	.header-content :global(.header-icon) {
		width: 48px;
		height: 48px;
		color: #3b82f6;
	}

	.title {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--color-heading-1);
		margin-bottom: var(--space-1);
	}

	.subtitle {
		font-size: var(--text-sm);
		color: var(--color-description-2);
	}

	/* Sub-category tabs */
	.subcategory-section {
		margin-bottom: var(--space-6);
	}

	.subcategory-tabs {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.subcategory-tab {
		padding: var(--space-2) var(--space-4);
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-full);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-description-2);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.subcategory-tab:hover {
		background: var(--color-panel-3);
	}

	.subcategory-tab.active {
		background: #3b82f6;
		border-color: #3b82f6;
		color: white;
	}

	/* Sub-category cards */
	.subcategories-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: var(--space-4);
		margin-bottom: var(--space-8);
	}

	.subcategory-card {
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-lg);
		padding: var(--space-4);
		transition: all 0.2s ease;
	}

	.subcategory-card.expanded {
		border-color: #3b82f6;
	}

	.subcategory-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
		margin-bottom: var(--space-2);
	}

	.subcategory-title {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--color-heading-2);
	}

	.subcategory-count {
		font-size: var(--text-xs);
		color: var(--color-description-3);
		background: var(--color-panel-3);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-full);
	}

	.subcategory-description {
		font-size: var(--text-sm);
		color: var(--color-description-3);
		line-height: 1.5;
	}

	.subcategory-tools {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		margin-top: var(--space-4);
		padding-top: var(--space-4);
		border-top: 1px solid var(--color-panel-border-1);
	}

	.tool-chip {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-1) var(--space-3);
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		color: var(--color-description-2);
		text-decoration: none;
		transition: all 0.2s ease;
	}

	.tool-chip:hover {
		border-color: #3b82f6;
		color: var(--color-heading-2);
	}

	.tool-chip :global(.tool-chip-icon) {
		width: 12px;
		height: 12px;
	}

	/* Relations */
	.relations-section {
		margin-bottom: var(--space-8);
	}

	.section-title {
		font-size: var(--text-xl);
		font-weight: var(--font-bold);
		color: var(--color-heading-1);
		margin-bottom: var(--space-2);
	}

	.section-description {
		font-size: var(--text-sm);
		color: var(--color-description-3);
		margin-bottom: var(--space-6);
	}

	.relations-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: var(--space-3);
	}

	.relation-card {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3);
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-md);
	}

	.relation-source,
	.relation-target {
		flex: 1;
	}

	.relation-tool {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: #3b82f6;
		text-decoration: none;
	}

	.relation-tool:hover {
		text-decoration: underline;
	}

	.relation-arrow {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-1);
	}

	.relation-arrow :global(.relation-icon) {
		width: 16px;
		height: 16px;
		color: var(--color-description-3);
	}

	.relation-type {
		font-size: var(--text-xs);
		color: var(--color-description-3);
		white-space: nowrap;
	}

	/* All tools */
	.all-tools-section {
		margin-bottom: var(--space-8);
	}

	.tools-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: var(--space-3);
	}

	.tool-card {
		padding: var(--space-3);
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-md);
		text-decoration: none;
		transition: all 0.2s ease;
	}

	.tool-card:hover {
		border-color: #3b82f6;
		transform: translateY(-2px);
	}

	.tool-card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-2);
	}

	.tool-card-name {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--color-heading-2);
	}

	.tool-status {
		font-size: var(--text-xs);
		padding: 2px 6px;
		border-radius: var(--radius-sm);
	}

	.tool-status[data-status='mastered'] {
		background: #10b981;
		color: white;
	}

	.tool-status[data-status='learning'] {
		background: #f59e0b;
		color: white;
	}

	.tool-status[data-status='viewed'] {
		background: var(--color-panel-3);
		color: var(--color-description-2);
	}

	.tool-card-tags {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-1);
	}

	.tool-tag {
		font-size: var(--text-xs);
		color: var(--color-description-3);
		background: var(--color-panel-3);
		padding: 2px 6px;
		border-radius: var(--radius-sm);
	}

	/* Navigation */
	.page-nav {
		display: flex;
		justify-content: space-between;
		padding-top: var(--space-6);
		border-top: 1px solid var(--color-panel-border-1);
	}

	.nav-link {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-4);
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-description-2);
		text-decoration: none;
		transition: all 0.2s ease;
	}

	.nav-link:hover {
		border-color: #3b82f6;
		color: var(--color-heading-2);
	}

	.nav-link :global(.nav-icon) {
		width: 16px;
		height: 16px;
	}

	.nav-link :global(.rotate) {
		transform: rotate(180deg);
	}

	/* Mobile */
	@media (max-width: 768px) {
		.ecosystem-page {
			padding: var(--space-4);
		}

		.subcategories-grid {
			grid-template-columns: 1fr;
		}

		.relations-grid {
			grid-template-columns: 1fr;
		}

		.tools-grid {
			grid-template-columns: 1fr 1fr;
		}

		.page-nav {
			flex-direction: column;
			gap: var(--space-3);
		}

		.nav-link {
			justify-content: center;
		}
	}
</style>
