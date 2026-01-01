<script lang="ts">
	import { useI18n } from '@shelchin/i18n';
	import { Clock, ExternalLink, ChevronRight, BookOpen } from '@lucide/svelte';
	import { marked } from 'marked';
	import SeoHead from '$lib/components/seo-head.svelte';
	import { localizeHref } from '$lib/utils/localized-url';
	import type { PageData } from './$types';
	import type { GuideSection, CaseStudy } from '@/features/chain-tools/types';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();

	// Configure marked for GFM tables
	marked.setOptions({
		gfm: true,
		breaks: true
	});

	// Get translated text
	function t(key: string): string {
		return i18n.t(key as never) || key;
	}

	// Parse markdown content to HTML
	function md(key: string): string {
		const content = t(key);
		return marked.parse(content) as string;
	}

	// Build table of contents from sections
	interface TocItem {
		id: string;
		title: string;
		level: number;
		children?: TocItem[];
	}

	function buildToc(sections: GuideSection[]): TocItem[] {
		return sections.map((section) => ({
			id: section.id,
			title: t(section.titleKey),
			level: 1,
			children: section.subsections?.map((sub) => ({
				id: sub.id,
				title: t(sub.titleKey),
				level: 2
			}))
		}));
	}

	const toc = $derived(buildToc(data.guide.sections));

	// Scroll to section
	function scrollToSection(id: string) {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	// Get tool by ID
	function getTool(toolId: string) {
		return data.tools.find((tool) => tool.id === toolId);
	}

	// Check if any tools exist for tool mentions
	function hasValidTools(toolMentions: Array<{ toolId: string; context?: string }> | undefined) {
		if (!toolMentions || toolMentions.length === 0) return false;
		return toolMentions.some((mention) => getTool(mention.toolId));
	}

	// Check if any tools exist for glossary tool IDs
	function hasValidToolIds(toolIds: string[] | undefined) {
		if (!toolIds || toolIds.length === 0) return false;
		return toolIds.some((id) => getTool(id));
	}

	// Render case study source link
	function getCaseStudyLink(caseStudy: CaseStudy): string | undefined {
		if (caseStudy.txHash) {
			return `https://etherscan.io/tx/${caseStudy.txHash}`;
		}
		if (caseStudy.duneQuery) {
			return caseStudy.duneQuery;
		}
		if (caseStudy.sourceUrl) {
			return caseStudy.sourceUrl;
		}
		return undefined;
	}
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

<article class="guide-article">
	<!-- Header -->
	<header class="article-header">
		<a href={localizeHref(`/apps/chain-tools/${data.guide.categoryId}`)} class="back-link">
			← {t('routes/apps/chain-tools.back_to_tools')}
		</a>

		<h1 class="article-title">{t(`${data.guide.i18nKeyPrefix}.title`)}</h1>
		<p class="article-subtitle">{t(`${data.guide.i18nKeyPrefix}.subtitle`)}</p>

		<div class="article-meta">
			<span class="read-time">
				<Clock class="meta-icon" />
				{data.guide.estimatedReadTime}
			</span>
			<span class="last-updated">
				{t('routes/apps/chain-tools.last_updated')}: {data.guide.lastUpdated}
			</span>
		</div>
	</header>

	<div class="article-layout">
		<!-- Table of Contents (Sidebar) -->
		<aside class="toc-sidebar">
			<nav class="toc">
				<h2 class="toc-title">{t('routes/apps/chain-tools.table_of_contents')}</h2>
				<ul class="toc-list">
					{#each toc as item (item.id)}
						<li class="toc-item">
							<button class="toc-link" onclick={() => scrollToSection(item.id)}>
								{item.title}
							</button>
							{#if item.children && item.children.length > 0}
								<ul class="toc-sublist">
									{#each item.children as child (child.id)}
										<li class="toc-subitem">
											<button class="toc-sublink" onclick={() => scrollToSection(child.id)}>
												{child.title}
											</button>
										</li>
									{/each}
								</ul>
							{/if}
						</li>
					{/each}
					<li class="toc-item">
						<button class="toc-link" onclick={() => scrollToSection('glossary')}>
							{t('routes/apps/chain-tools.glossary')}
						</button>
					</li>
				</ul>
			</nav>
		</aside>

		<!-- Main Content -->
		<div class="article-content">
			{#each data.guide.sections as section (section.id)}
				<section id={section.id} class="content-section">
					<h2 class="section-title">{t(section.titleKey)}</h2>
					<div class="section-content markdown-content">
						{@html md(section.contentKey)}
					</div>

					<!-- Tool mentions - only show if at least one tool exists -->
					{#if hasValidTools(section.toolMentions)}
						<div class="tool-mentions">
							<span class="tool-mentions-label">{t('routes/apps/chain-tools.related_tools')}:</span>
							{#each section.toolMentions as mention (mention.toolId)}
								{@const tool = getTool(mention.toolId)}
								{#if tool}
									<a href={localizeHref(`/apps/chain-tools/tool/${tool.id}`)} class="tool-chip">
										{tool.name}
										{#if mention.context}
											<span class="tool-context">({mention.context})</span>
										{/if}
									</a>
								{/if}
							{/each}
						</div>
					{/if}

					<!-- Subsections -->
					{#if section.subsections}
						{#each section.subsections as subsection (subsection.id)}
							<div id={subsection.id} class="subsection">
								<h3 class="subsection-title">{t(subsection.titleKey)}</h3>
								<div class="subsection-content markdown-content">
									{@html md(subsection.contentKey)}
								</div>

								<!-- Subsection tool mentions - only show if at least one tool exists -->
								{#if hasValidTools(subsection.toolMentions)}
									<div class="tool-mentions">
										<span class="tool-mentions-label"
											>{t('routes/apps/chain-tools.related_tools')}:</span
										>
										{#each subsection.toolMentions as mention (mention.toolId)}
											{@const tool = getTool(mention.toolId)}
											{#if tool}
												<a
													href={localizeHref(`/apps/chain-tools/tool/${tool.id}`)}
													class="tool-chip"
												>
													{tool.name}
												</a>
											{/if}
										{/each}
									</div>
								{/if}

								<!-- Case studies -->
								{#if subsection.caseStudies && subsection.caseStudies.length > 0}
									<div class="case-studies">
										{#each subsection.caseStudies as caseStudy (caseStudy.id)}
											<div class="case-study">
												<div class="case-study-header">
													<h4 class="case-study-title">{t(caseStudy.titleKey)}</h4>
													{#if caseStudy.profit}
														<span class="case-study-profit">{caseStudy.profit}</span>
													{/if}
												</div>
												<p class="case-study-description">{t(caseStudy.descriptionKey)}</p>
												{#if caseStudy.date}
													<span class="case-study-date">{caseStudy.date}</span>
												{/if}
												{#if getCaseStudyLink(caseStudy)}
													{@const link = getCaseStudyLink(caseStudy)}
													<a href={link} target="_blank" rel="noopener" class="case-study-link">
														{t('routes/apps/chain-tools.view_source')}
														<ExternalLink class="link-icon" />
													</a>
												{/if}
											</div>
										{/each}
									</div>
								{/if}
							</div>
						{/each}
					{/if}

					<!-- Section case studies (if at section level) -->
					{#if section.caseStudies && section.caseStudies.length > 0}
						<div class="case-studies">
							{#each section.caseStudies as caseStudy (caseStudy.id)}
								<div class="case-study">
									<div class="case-study-header">
										<h4 class="case-study-title">{t(caseStudy.titleKey)}</h4>
										{#if caseStudy.profit}
											<span class="case-study-profit">{caseStudy.profit}</span>
										{/if}
									</div>
									<p class="case-study-description">{t(caseStudy.descriptionKey)}</p>
									{#if getCaseStudyLink(caseStudy)}
										{@const link = getCaseStudyLink(caseStudy)}
										<a href={link} target="_blank" rel="noopener" class="case-study-link">
											{t('routes/apps/chain-tools.view_source')}
											<ExternalLink class="link-icon" />
										</a>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				</section>
			{/each}

			<!-- Glossary Section -->
			<section id="glossary" class="content-section glossary-section">
				<h2 class="section-title">{t('routes/apps/chain-tools.glossary')}</h2>
				<div class="glossary-grid">
					{#each data.guide.glossary as term (term.id)}
						<div class="glossary-item" id={`term-${term.id}`}>
							<dt class="glossary-term">{t(term.termKey)}</dt>
							<dd class="glossary-definition">{t(term.definitionKey)}</dd>
							{#if hasValidToolIds(term.relatedToolIds)}
								<div class="glossary-tools">
									{#each term.relatedToolIds as toolId (toolId)}
										{@const tool = getTool(toolId)}
										{#if tool}
											<a
												href={localizeHref(`/apps/chain-tools/tool/${tool.id}`)}
												class="tool-chip small"
											>
												{tool.name}
											</a>
										{/if}
									{/each}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</section>

			<!-- Featured Tools -->
			<section class="featured-tools-section">
				<h2 class="section-title">{t('routes/apps/chain-tools.featured_tools')}</h2>
				<div class="featured-tools-grid">
					{#each data.guide.featuredToolIds as toolId (toolId)}
						{@const tool = getTool(toolId)}
						{#if tool}
							<a
								href={localizeHref(`/apps/chain-tools/tool/${tool.id}`)}
								class="featured-tool-card"
							>
								<span class="featured-tool-name">{tool.name}</span>
								<ChevronRight class="featured-tool-arrow" />
							</a>
						{/if}
					{/each}
				</div>
			</section>

			<!-- Back to category -->
			<div class="article-footer">
				<a href="/" class="back-link-footer">
					<BookOpen class="footer-icon" />
					{t('routes/apps/chain-tools.explore_more_tools')}
				</a>
			</div>
		</div>
	</div>
</article>

<style>
	.guide-article {
		max-width: 1200px;
		margin: 0 auto;
		padding: var(--space-6);
	}

	/* Header */
	.article-header {
		margin-bottom: var(--space-8);
		padding-bottom: var(--space-6);
		border-bottom: 1px solid var(--color-panel-border-1);
	}

	.back-link {
		display: inline-block;
		font-size: var(--text-sm);
		color: var(--color-description-3);
		text-decoration: none;
		margin-bottom: var(--space-4);
	}

	.back-link:hover {
		color: #3b82f6;
	}

	.article-title {
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		color: var(--color-heading-1);
		margin-bottom: var(--space-3);
		line-height: 1.2;
	}

	.article-subtitle {
		font-size: var(--text-lg);
		color: var(--color-description-2);
		margin-bottom: var(--space-4);
	}

	.article-meta {
		display: flex;
		gap: var(--space-4);
		font-size: var(--text-sm);
		color: var(--color-description-3);
	}

	.read-time {
		display: flex;
		align-items: center;
		gap: var(--space-1);
	}

	.read-time :global(.meta-icon) {
		width: 16px;
		height: 16px;
	}

	/* Layout */
	.article-layout {
		display: grid;
		grid-template-columns: 240px 1fr;
		gap: var(--space-8);
	}

	/* Table of Contents */
	.toc-sidebar {
		position: sticky;
		top: var(--space-6);
		height: fit-content;
	}

	.toc {
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-lg);
		padding: var(--space-4);
	}

	.toc-title {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--color-heading-2);
		margin-bottom: var(--space-3);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.toc-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.toc-item {
		margin-bottom: var(--space-2);
	}

	.toc-link {
		display: block;
		width: 100%;
		text-align: left;
		background: none;
		border: none;
		padding: var(--space-1) 0;
		font-size: var(--text-sm);
		color: var(--color-description-2);
		cursor: pointer;
	}

	.toc-link:hover {
		color: #3b82f6;
	}

	.toc-sublist {
		list-style: none;
		padding-left: var(--space-3);
		margin-top: var(--space-1);
	}

	.toc-subitem {
		margin-bottom: var(--space-1);
	}

	.toc-sublink {
		display: block;
		width: 100%;
		text-align: left;
		background: none;
		border: none;
		padding: var(--space-1) 0;
		font-size: var(--text-xs);
		color: var(--color-description-3);
		cursor: pointer;
	}

	.toc-sublink:hover {
		color: #3b82f6;
	}

	/* Content */
	.article-content {
		min-width: 0;
	}

	.content-section {
		margin-bottom: var(--space-10);
		scroll-margin-top: var(--space-6);
	}

	.section-title {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--color-heading-1);
		margin-bottom: var(--space-4);
		padding-bottom: var(--space-2);
		border-bottom: 2px solid var(--color-panel-border-1);
	}

	.section-content {
		font-size: var(--text-base);
		color: var(--color-description-1);
		line-height: 1.8;
	}

	.section-content :global(p) {
		margin-bottom: var(--space-4);
	}

	.section-content :global(ul),
	.section-content :global(ol) {
		margin-bottom: var(--space-4);
		padding-left: var(--space-6);
	}

	.section-content :global(li) {
		margin-bottom: var(--space-2);
	}

	/* Markdown tables */
	.markdown-content :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin: var(--space-4) 0;
		font-size: var(--text-sm);
		overflow-x: auto;
		display: block;
	}

	.markdown-content :global(thead) {
		background: var(--color-panel-2);
	}

	.markdown-content :global(th),
	.markdown-content :global(td) {
		padding: var(--space-2) var(--space-3);
		border: 1px solid var(--color-panel-border-1);
		text-align: left;
	}

	.markdown-content :global(th) {
		font-weight: var(--font-semibold);
		color: var(--color-heading-2);
	}

	.markdown-content :global(tr:nth-child(even)) {
		background: var(--color-panel-2);
	}

	.markdown-content :global(tr:hover) {
		background: var(--color-panel-3);
	}

	/* Markdown code blocks */
	.markdown-content :global(code) {
		background: var(--color-panel-2);
		padding: 0.125em 0.375em;
		border-radius: var(--radius-sm);
		font-family: monospace;
		font-size: 0.9em;
	}

	.markdown-content :global(pre) {
		background: var(--color-panel-2);
		padding: var(--space-3);
		border-radius: var(--radius-md);
		overflow-x: auto;
		margin: var(--space-4) 0;
	}

	.markdown-content :global(pre code) {
		background: none;
		padding: 0;
	}

	/* Subsections */
	.subsection {
		margin-top: var(--space-6);
		scroll-margin-top: var(--space-6);
	}

	.subsection-title {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		color: var(--color-heading-2);
		margin-bottom: var(--space-3);
	}

	.subsection-content {
		font-size: var(--text-base);
		color: var(--color-description-1);
		line-height: 1.8;
	}

	/* Tool mentions */
	.tool-mentions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-2);
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: var(--color-panel-2);
		border-radius: var(--radius-md);
	}

	.tool-mentions-label {
		font-size: var(--text-sm);
		color: var(--color-description-3);
	}

	.tool-chip {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-1) var(--space-3);
		background: var(--color-panel-3);
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-full);
		font-size: var(--text-sm);
		color: var(--color-heading-2);
		text-decoration: none;
		transition: all 0.2s ease;
	}

	.tool-chip:hover {
		border-color: #3b82f6;
		color: #3b82f6;
	}

	.tool-chip.small {
		padding: var(--space-1) var(--space-2);
		font-size: var(--text-xs);
	}

	.tool-context {
		font-size: var(--text-xs);
		color: var(--color-description-3);
	}

	/* Case studies */
	.case-studies {
		margin-top: var(--space-6);
	}

	.case-study {
		padding: var(--space-4);
		background: linear-gradient(135deg, var(--color-panel-2), var(--color-panel-3));
		border: 1px solid var(--color-panel-border-1);
		border-left: 4px solid #f59e0b;
		border-radius: var(--radius-md);
		margin-bottom: var(--space-4);
	}

	.case-study-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-2);
	}

	.case-study-title {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--color-heading-1);
	}

	.case-study-profit {
		font-size: var(--text-sm);
		font-weight: var(--font-bold);
		color: #10b981;
		background: rgba(16, 185, 129, 0.1);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-sm);
	}

	.case-study-description {
		font-size: var(--text-sm);
		color: var(--color-description-2);
		line-height: 1.6;
		margin-bottom: var(--space-2);
	}

	.case-study-date {
		font-size: var(--text-xs);
		color: var(--color-description-3);
	}

	.case-study-link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-sm);
		color: #3b82f6;
		text-decoration: none;
		margin-top: var(--space-2);
	}

	.case-study-link:hover {
		text-decoration: underline;
	}

	.case-study-link :global(.link-icon) {
		width: 14px;
		height: 14px;
	}

	/* Glossary */
	.glossary-section {
		background: var(--color-panel-2);
		border-radius: var(--radius-lg);
		padding: var(--space-6);
	}

	.glossary-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: var(--space-4);
	}

	.glossary-item {
		padding: var(--space-3);
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-md);
	}

	.glossary-term {
		font-weight: var(--font-semibold);
		color: var(--color-heading-2);
		margin-bottom: var(--space-1);
	}

	.glossary-definition {
		font-size: var(--text-sm);
		color: var(--color-description-2);
		line-height: 1.5;
	}

	.glossary-tools {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-1);
		margin-top: var(--space-2);
	}

	/* Featured tools */
	.featured-tools-section {
		margin-top: var(--space-10);
		padding: var(--space-6);
		background: var(--color-panel-2);
		border-radius: var(--radius-lg);
	}

	.featured-tools-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		gap: var(--space-3);
	}

	.featured-tool-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-3) var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-md);
		text-decoration: none;
		transition: all 0.2s ease;
	}

	.featured-tool-card:hover {
		border-color: #3b82f6;
		transform: translateY(-2px);
	}

	.featured-tool-name {
		font-weight: var(--font-medium);
		color: var(--color-heading-2);
	}

	.featured-tool-card :global(.featured-tool-arrow) {
		width: 16px;
		height: 16px;
		color: var(--color-description-3);
	}

	/* Footer */
	.article-footer {
		margin-top: var(--space-10);
		padding-top: var(--space-6);
		border-top: 1px solid var(--color-panel-border-1);
		text-align: center;
	}

	.back-link-footer {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-6);
		background: #3b82f6;
		color: white;
		border-radius: var(--radius-md);
		text-decoration: none;
		font-weight: var(--font-medium);
		transition: all 0.2s ease;
	}

	.back-link-footer:hover {
		background: #2563eb;
		transform: translateY(-2px);
	}

	.back-link-footer :global(.footer-icon) {
		width: 20px;
		height: 20px;
	}

	/* Mobile */
	@media (max-width: 900px) {
		.article-layout {
			grid-template-columns: 1fr;
		}

		.toc-sidebar {
			position: relative;
			top: 0;
		}

		.toc {
			margin-bottom: var(--space-6);
		}
	}

	@media (max-width: 640px) {
		.guide-article {
			padding: var(--space-4);
		}

		.article-title {
			font-size: var(--text-2xl);
		}

		.section-title {
			font-size: var(--text-xl);
		}

		.glossary-grid {
			grid-template-columns: 1fr;
		}

		.featured-tools-grid {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
