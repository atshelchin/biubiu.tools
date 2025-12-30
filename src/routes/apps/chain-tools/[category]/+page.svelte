<script lang="ts">
	import { useI18n } from '@shelchin/i18n';
	import { SearchX } from '@lucide/svelte';
	import ExternalToolCard from '@/features/chain-tools/components/external-tool-card.svelte';
	import SeoHead from '$lib/components/seo-head.svelte';
	import Faqs from '$lib/components/ui/faqs.svelte';
	import { allTools as toolsData } from '@/features/chain-tools/data/tools';
	import type { ExternalTool } from '@/features/chain-tools/types';
	import type { PageData } from './$types';
	import { getContext } from 'svelte';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();

	// Get search query from layout context
	const searchContext = getContext<{ query: string }>('chainToolsSearch');
	const searchQuery = $derived(searchContext?.query || '');

	/**
	 * Tokenize search query
	 */
	function tokenizeQuery(query: string): string[] {
		return query
			.toLowerCase()
			.split(/\s+/)
			.filter((t) => t.length > 0);
	}

	/**
	 * Get tool descriptions using i18n
	 * descriptionKey format: chain-tools.{category}.tools.{toolId}.description
	 */
	function getToolDescriptions(tool: ExternalTool): string[] {
		const descriptions: string[] = [];

		// Get description in current locale
		const currentDesc = i18n.t(tool.descriptionKey as never, { defaultValue: '' });
		if (currentDesc) {
			descriptions.push(currentDesc.toLowerCase());
		}

		// Tool name is always searchable
		descriptions.push(tool.name.toLowerCase());

		return descriptions;
	}

	/**
	 * Check if a tool matches the search query
	 */
	function matchesTool(tool: ExternalTool, tokens: string[]): boolean {
		const searchableTexts: string[] = [
			tool.name.toLowerCase(),
			...tool.tags.map((t) => t.toLowerCase()),
			...(tool.chains || []).map((c) => c.toLowerCase()),
			...getToolDescriptions(tool)
		];

		const combinedText = searchableTexts.join(' ');
		return tokens.every((token) => combinedText.includes(token));
	}

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

	// Filtered tools
	const filteredTools = $derived.by(() => {
		// Filter by category
		let result = toolsData.filter((tool) => tool.category === data.categoryId);

		// Apply search filter if query exists
		if (searchQuery.trim().length > 0) {
			const tokens = tokenizeQuery(searchQuery);
			if (tokens.length > 0) {
				result = result.filter((tool) => matchesTool(tool, tokens));
			}
		}

		return sortToolsWithBiubiuFirst(result);
	});
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
		<h3 class="empty-title">{i18n.t('routes/apps/chain-tools/chain-tools.empty_title')}</h3>
		<p class="empty-description">
			{i18n.t('routes/apps/chain-tools/chain-tools.empty_description')}
		</p>
	</div>
{/if}

<!-- Footer Stats -->
<div class="page-footer">
	<p class="stats">
		{i18n.t('routes/apps/chain-tools/chain-tools.showing_count', {
			count: filteredTools.length,
			total: toolsData.length
		})}
	</p>
	<p class="disclaimer">{i18n.t('routes/apps/chain-tools/chain-tools.disclaimer')}</p>
</div>

<!-- FAQs Section -->
{#if data.faqs && data.faqs.length > 0}
	<section class="faqs-section">
		<Faqs
			faqs={data.faqs}
			title={i18n.t('routes/apps/chain-tools/chain-tools.faqs_title', {
				defaultValue: 'Frequently Asked Questions'
			})}
		/>
	</section>
{/if}

<style>
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
