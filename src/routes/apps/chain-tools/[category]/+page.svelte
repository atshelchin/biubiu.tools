<script lang="ts">
	import { useI18n } from '@shelchin/i18n';
	import { FolderOpen, BookOpen, ChevronRight } from '@lucide/svelte';
	import ExternalToolCard from '@/features/chain-tools/components/external-tool-card.svelte';
	import SeoHead from '$lib/components/seo-head.svelte';
	import Faqs from '$lib/components/ui/faqs.svelte';
	import Pagination from '$lib/components/ui/pagination.svelte';
	import { allTools as toolsData } from '@/features/chain-tools/data/tools';
	import { getCategoryGuide } from '@/features/chain-tools/data/guides';
	import type { ExternalTool } from '@/features/chain-tools/types';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();

	// Pagination settings
	const ITEMS_PER_PAGE = 12;
	let currentPage = $state(1);

	/**
	 * Sort tools: BiuBiu tools first
	 */
	function sortToolsWithBiubiuFirst(tools: ExternalTool[]): ExternalTool[] {
		return [...tools].sort((a, b) => {
			const aIsBiubiu = a.id.startsWith('biubiu-');
			const bIsBiubiu = b.id.startsWith('biubiu-');
			if (aIsBiubiu && !bIsBiubiu) return -1;
			if (!aIsBiubiu && bIsBiubiu) return 1;
			return 0;
		});
	}

	// Filtered tools by category
	const filteredTools = $derived.by(() => {
		const result = toolsData.filter((tool) => tool.category === data.categoryId);
		return sortToolsWithBiubiuFirst(result);
	});

	// Pagination calculations
	const totalPages = $derived(Math.ceil(filteredTools.length / ITEMS_PER_PAGE));

	// Reset to page 1 when category changes
	$effect(() => {
		void data.categoryId;
		currentPage = 1;
	});

	// Paginated tools for current page
	const paginatedTools = $derived.by(() => {
		const start = (currentPage - 1) * ITEMS_PER_PAGE;
		const end = start + ITEMS_PER_PAGE;
		return filteredTools.slice(start, end);
	});

	function handlePageChange(page: number) {
		currentPage = page;
		// Scroll to top of tools grid smoothly
		const grid = document.querySelector('.tools-grid');
		if (grid) {
			grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	// Pagination labels (i18n)
	const paginationLabels = $derived({
		previous: i18n.t('common.pagination.previous' as never, { defaultValue: 'Previous' }),
		next: i18n.t('common.pagination.next' as never, { defaultValue: 'Next' }),
		first: i18n.t('common.pagination.first' as never, { defaultValue: 'First' }),
		last: i18n.t('common.pagination.last' as never, { defaultValue: 'Last' }),
		page: i18n.t('common.pagination.page' as never, { defaultValue: 'Page' })
	});

	// Check if guide exists for this category
	const hasGuide = $derived(Boolean(getCategoryGuide(data.categoryId)));
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

<!-- Guide Banner -->
{#if hasGuide}
	<a href="/apps/chain-tools/{data.categoryId}/guide" target="_blank" class="guide-banner">
		<div class="guide-banner-content">
			<div class="guide-banner-icon">
				<BookOpen class="icon" />
			</div>
			<div class="guide-banner-text">
				<h3 class="guide-banner-title">
					{i18n.t('routes/apps/chain-tools.guide_banner_title' as never, {
						defaultValue: 'Learn {category}',
						category: data.categoryId.toUpperCase()
					})}
				</h3>
				<p class="guide-banner-description">
					{i18n.t('routes/apps/chain-tools.guide_banner_description' as never, {
						defaultValue: 'Complete guide with tutorials, glossary, and quizzes'
					})}
				</p>
			</div>
		</div>
		<ChevronRight class="guide-banner-arrow" />
	</a>
{/if}

<!-- Tools Grid -->
{#if filteredTools.length > 0}
	<div class="tools-grid">
		{#each paginatedTools as tool, index (tool.id)}
			<ExternalToolCard {tool} {index} />
		{/each}
	</div>

	<!-- Pagination -->
	{#if totalPages > 1}
		<Pagination
			{currentPage}
			{totalPages}
			onPageChange={handlePageChange}
			labels={paginationLabels}
		/>
	{/if}
{:else}
	<!-- Empty State -->
	<div class="empty-state">
		<div class="empty-icon">
			<FolderOpen class="icon" />
		</div>
		<h3 class="empty-title">{i18n.t('routes/apps/chain-tools.empty_title')}</h3>
		<p class="empty-description">
			{i18n.t('routes/apps/chain-tools.empty_description')}
		</p>
	</div>
{/if}

<!-- Footer Stats -->
<div class="page-footer">
	<p class="stats">
		{#if totalPages > 1}
			{i18n.t('common.pagination.showing_range' as never, {
				defaultValue: 'Showing {start}-{end} of {total}',
				start: (currentPage - 1) * ITEMS_PER_PAGE + 1,
				end: Math.min(currentPage * ITEMS_PER_PAGE, filteredTools.length),
				total: filteredTools.length
			})}
		{:else}
			{i18n.t('routes/apps/chain-tools.showing_count', {
				count: filteredTools.length,
				total: toolsData.length
			})}
		{/if}
	</p>
	<p class="disclaimer">{i18n.t('routes/apps/chain-tools.disclaimer')}</p>
</div>

<!-- FAQs Section -->
{#if data.faqs && data.faqs.length > 0}
	<section class="faqs-section">
		<Faqs
			faqs={data.faqs}
			title={i18n.t('routes/apps/chain-tools.faqs_title', {
				defaultValue: 'Frequently Asked Questions'
			})}
		/>
	</section>
{/if}

<style>
	/* Guide Banner */
	.guide-banner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-4);
		padding: var(--space-4) var(--space-5);
		margin-bottom: var(--space-6);
		background: linear-gradient(135deg, var(--color-panel-2), var(--color-panel-3));
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-lg);
		text-decoration: none;
		transition: all 0.2s ease;
	}

	.guide-banner:hover {
		border-color: var(--color-accent);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.guide-banner-content {
		display: flex;
		align-items: center;
		gap: var(--space-4);
	}

	.guide-banner-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		background: var(--color-accent);
		border-radius: var(--radius-md);
		flex-shrink: 0;
	}

	.guide-banner-icon :global(.icon) {
		width: 24px;
		height: 24px;
		color: var(--color-heading-2);
	}

	.guide-banner-title {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--color-heading-1);
		margin-bottom: var(--space-1);
	}

	.guide-banner-description {
		font-size: var(--text-sm);
		color: var(--color-description-2);
	}

	.guide-banner :global(.guide-banner-arrow) {
		width: 24px;
		height: 24px;
		color: var(--color-description-3);
		flex-shrink: 0;
		transition: transform 0.2s ease;
	}

	.guide-banner:hover :global(.guide-banner-arrow) {
		color: var(--color-accent);
		transform: translateX(4px);
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
		max-width: 320px;
	}

	/* FAQs Section */
	.faqs-section {
		margin-top: var(--space-12);
		padding-top: var(--space-8);
		border-top: 1px solid var(--color-panel-border-1);
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

	.disclaimer {
		font-size: var(--text-xs);
		color: var(--color-description-3);
		margin-top: var(--space-3);
		opacity: 0.7;
	}

	/* Mobile */
	@media (max-width: 768px) {
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

		.faqs-section {
			margin-top: var(--space-8);
			padding-top: var(--space-6);
		}

		.page-footer {
			margin-top: var(--space-8);
			padding-top: var(--space-4);
		}
	}
</style>
