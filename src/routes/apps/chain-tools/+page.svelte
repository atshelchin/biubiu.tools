<script lang="ts">
	import { useI18n } from '@shelchin/i18n';
	import { SearchX } from '@lucide/svelte';
	import ExternalToolCard from '@/features/chain-tools/components/external-tool-card.svelte';
	import SeoHead from '$lib/components/seo-head.svelte';
	import { allTools as toolsData } from '@/features/chain-tools/data/tools';
	import type { ExternalTool } from '@/features/chain-tools/types';
	import type { PageData } from './$types';
	import { getContext } from 'svelte';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();

	// Get search query from layout context
	const searchContext = getContext<{ query: string }>('chainToolsSearch');
	const searchQuery = $derived(searchContext?.query || '');

	// Import both locales for bilingual search
	import enChainTools from '@/i18n/locales/en/chain-tools.json';
	import zhChainTools from '@/i18n/locales/zh/chain-tools.json';

	const enLocale = { chain_tools: enChainTools };
	const zhLocale = { chain_tools: zhChainTools };

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
	 * Get tool description from both locales
	 */
	function getToolDescriptions(tool: ExternalTool): string[] {
		const descriptions: string[] = [];
		const keyParts = tool.descriptionKey.split('.');
		const toolId = keyParts[keyParts.length - 2];

		const enTools = enLocale.chain_tools?.tools as Record<
			string,
			{ description?: string } | undefined
		>;
		if (enTools?.[toolId]?.description) {
			descriptions.push(enTools[toolId].description.toLowerCase());
		}

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

	// Filtered tools - show featured tools on main page
	const filteredTools = $derived.by(() => {
		const hasSearchQuery = searchQuery.trim().length > 0;

		// When searching, search all tools
		if (hasSearchQuery) {
			const tokens = tokenizeQuery(searchQuery);
			if (tokens.length > 0) {
				return toolsData.filter((tool) => matchesTool(tool, tokens));
			}
			return toolsData;
		}

		// No search - show featured tools
		return toolsData.filter((tool) => tool.isFeatured === true);
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
		<h3 class="empty-title">{i18n.t('chain-tools.empty_title')}</h3>
		<p class="empty-description">{i18n.t('chain-tools.empty_description')}</p>
	</div>
{/if}

<!-- Footer Stats -->
<div class="page-footer">
	<p class="stats">
		{i18n.t('chain-tools.showing_count', {
			count: filteredTools.length,
			total: toolsData.length
		})}
	</p>
	<p class="disclaimer">{i18n.t('chain-tools.disclaimer')}</p>
</div>

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

		.page-footer {
			margin-top: var(--space-8);
			padding-top: var(--space-4);
		}
	}
</style>
