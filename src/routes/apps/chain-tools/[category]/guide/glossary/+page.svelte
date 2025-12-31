<script lang="ts">
	import { useI18n } from '@shelchin/i18n';
	import { BookA, ChevronLeft, Search, ExternalLink, Link } from '@lucide/svelte';
	import SeoHead from '$lib/components/seo-head.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();

	// Base paths for absolute links
	const basePath = $derived(`/apps/chain-tools/${data.guide.categoryId}/guide`);
	const toolPath = '/apps/chain-tools/tool';

	// Search state
	let searchQuery = $state('');

	// Active term for detailed view
	let activeTerm = $state<string | null>(null);

	// Get localized text
	function t(key: string, params?: Record<string, unknown>): string {
		const fullKey = `${data.guide.i18nKeyPrefix}.${key}`;
		return i18n.t(fullKey as never, params as never) || key;
	}

	// Filter terms by search
	const filteredTerms = $derived(() => {
		if (!searchQuery.trim()) return data.guide.glossary;
		const query = searchQuery.toLowerCase();
		return data.guide.glossary.filter((term) => {
			const termText = t(`glossary.${term.id.replace(/-/g, '_')}.term`).toLowerCase();
			const defText = t(`glossary.${term.id.replace(/-/g, '_')}.definition`).toLowerCase();
			return termText.includes(query) || defText.includes(query);
		});
	});

	// Get tool by ID
	function getToolById(toolId: string) {
		return data.tools.find((tool) => tool.id === toolId);
	}

	// Get term by ID
	function getTermById(termId: string) {
		return data.guide.glossary.find((term) => term.id === termId);
	}

	// Get i18n key for term (handle hyphen to underscore conversion)
	function getTermKey(termId: string): string {
		return termId.replace(/-/g, '_');
	}

	// Group terms by first letter
	const groupedTerms = $derived(() => {
		const groups: Record<string, typeof data.guide.glossary> = {};
		filteredTerms().forEach((term) => {
			const termText = t(`glossary.${getTermKey(term.id)}.term`);
			const letter = termText.charAt(0).toUpperCase();
			if (!groups[letter]) {
				groups[letter] = [];
			}
			groups[letter].push(term);
		});
		return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
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

<div class="glossary-page">
	<!-- Header -->
	<header class="page-header">
		<a href={basePath} class="back-link">
			<ChevronLeft class="back-icon" />
			<span>Back to Guide</span>
		</a>
		<div class="header-content">
			<BookA class="header-icon" />
			<div>
				<h1 class="title">{t('glossary.title')}</h1>
				<p class="subtitle">{t('glossary.description')}</p>
			</div>
		</div>
	</header>

	<!-- Search -->
	<div class="search-section">
		<div class="search-input-wrapper">
			<Search class="search-icon" />
			<input
				type="text"
				class="search-input"
				placeholder={t('glossary.search_placeholder')}
				bind:value={searchQuery}
			/>
		</div>
		<div class="search-stats">
			{filteredTerms().length} / {data.guide.glossary.length} terms
		</div>
	</div>

	<!-- Quick nav (alphabet) -->
	<nav class="alphabet-nav">
		{#each groupedTerms() as [letter] (letter)}
			<a href="#{letter}" class="letter-link">{letter}</a>
		{/each}
	</nav>

	<!-- Main content area -->
	<div class="content-layout">
		<!-- Terms list -->
		<main class="terms-list">
			{#each groupedTerms() as [letter, terms] (letter)}
				<section class="letter-section" id={letter}>
					<h2 class="letter-heading">{letter}</h2>
					<div class="terms-in-letter">
						{#each terms as term (term.id)}
							<article class="term-card" class:active={activeTerm === term.id}>
								<button
									class="term-header"
									onclick={() => (activeTerm = activeTerm === term.id ? null : term.id)}
								>
									<h3 class="term-name">{t(`glossary.${getTermKey(term.id)}.term`)}</h3>
								</button>

								<div class="term-definition">
									{t(`glossary.${getTermKey(term.id)}.definition`)}
								</div>

								{#if activeTerm === term.id}
									<div class="term-details">
										<!-- Related tools -->
										{#if term.relatedToolIds && term.relatedToolIds.length > 0}
											<div class="related-section">
												<h4 class="related-title">
													<ExternalLink class="related-icon" />
													Related Tools
												</h4>
												<div class="related-items">
													{#each term.relatedToolIds as toolId (toolId)}
														{@const tool = getToolById(toolId)}
														{#if tool}
															<a href="{toolPath}/{tool.id}" class="related-link tool">
																{tool.name}
															</a>
														{/if}
													{/each}
												</div>
											</div>
										{/if}

										<!-- Related terms -->
										{#if term.relatedTermIds && term.relatedTermIds.length > 0}
											<div class="related-section">
												<h4 class="related-title">
													<Link class="related-icon" />
													Related Terms
												</h4>
												<div class="related-items">
													{#each term.relatedTermIds as relatedId (relatedId)}
														{@const relatedTerm = getTermById(relatedId)}
														{#if relatedTerm}
															<button
																class="related-link term"
																onclick={() => (activeTerm = relatedId)}
															>
																{t(`glossary.${getTermKey(relatedId)}.term`)}
															</button>
														{/if}
													{/each}
												</div>
											</div>
										{/if}
									</div>
								{/if}
							</article>
						{/each}
					</div>
				</section>
			{/each}

			{#if filteredTerms().length === 0}
				<div class="empty-state">
					<p>No terms found matching "{searchQuery}"</p>
				</div>
			{/if}
		</main>
	</div>

	<!-- Navigation -->
	<div class="page-nav">
		<a href="{basePath}/learning-path" class="nav-link prev">
			<ChevronLeft class="nav-icon" />
			<span>Learning Path</span>
		</a>
		<a href="{basePath}/quiz" class="nav-link next">
			<span>Take the Quiz</span>
			<ChevronLeft class="nav-icon rotate" />
		</a>
	</div>
</div>

<style>
	.glossary-page {
		max-width: 900px;
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

	/* Search */
	.search-section {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		margin-bottom: var(--space-4);
	}

	.search-input-wrapper {
		flex: 1;
		position: relative;
	}

	.search-input-wrapper :global(.search-icon) {
		position: absolute;
		left: var(--space-3);
		top: 50%;
		transform: translateY(-50%);
		width: 20px;
		height: 20px;
		color: var(--color-description-3);
	}

	.search-input {
		width: 100%;
		padding: var(--space-3) var(--space-4) var(--space-3) var(--space-10);
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-lg);
		font-size: var(--text-base);
		color: var(--color-heading-1);
	}

	.search-input:focus {
		outline: none;
		border-color: #3b82f6;
	}

	.search-input::placeholder {
		color: var(--color-description-3);
	}

	.search-stats {
		font-size: var(--text-sm);
		color: var(--color-description-3);
		white-space: nowrap;
	}

	/* Alphabet nav */
	.alphabet-nav {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-1);
		margin-bottom: var(--space-6);
		padding: var(--space-3);
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-lg);
	}

	.letter-link {
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--color-description-2);
		text-decoration: none;
		border-radius: var(--radius-md);
		transition: all 0.2s ease;
	}

	.letter-link:hover {
		background: var(--color-panel-3);
		color: #3b82f6;
	}

	/* Content */
	.content-layout {
		margin-bottom: var(--space-6);
	}

	.terms-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-8);
	}

	.letter-section {
		scroll-margin-top: var(--space-4);
	}

	.letter-heading {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: #3b82f6;
		margin-bottom: var(--space-4);
		padding-bottom: var(--space-2);
		border-bottom: 2px solid #3b82f6;
	}

	.terms-in-letter {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.term-card {
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-lg);
		overflow: hidden;
		transition: all 0.2s ease;
	}

	.term-card.active {
		border-color: #3b82f6;
	}

	.term-header {
		width: 100%;
		padding: var(--space-4);
		background: transparent;
		border: none;
		cursor: pointer;
		text-align: left;
	}

	.term-name {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--color-heading-2);
	}

	.term-definition {
		padding: 0 var(--space-4) var(--space-4);
		font-size: var(--text-sm);
		color: var(--color-description-2);
		line-height: 1.7;
	}

	.term-details {
		padding: var(--space-4);
		background: var(--color-panel-3);
		border-top: 1px solid var(--color-panel-border-1);
	}

	.related-section {
		margin-bottom: var(--space-3);
	}

	.related-section:last-child {
		margin-bottom: 0;
	}

	.related-title {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		color: var(--color-description-3);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: var(--space-2);
	}

	.related-title :global(.related-icon) {
		width: 14px;
		height: 14px;
	}

	.related-items {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.related-link {
		padding: var(--space-1) var(--space-3);
		font-size: var(--text-sm);
		border-radius: var(--radius-md);
		text-decoration: none;
		transition: all 0.2s ease;
	}

	.related-link.tool {
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-1);
		color: #3b82f6;
	}

	.related-link.tool:hover {
		border-color: #3b82f6;
	}

	.related-link.term {
		background: #3b82f6;
		border: none;
		color: white;
		cursor: pointer;
	}

	.related-link.term:hover {
		opacity: 0.9;
	}

	/* Empty state */
	.empty-state {
		text-align: center;
		padding: var(--space-10);
		color: var(--color-description-3);
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
		.glossary-page {
			padding: var(--space-4);
		}

		.search-section {
			flex-direction: column;
			align-items: stretch;
		}

		.alphabet-nav {
			justify-content: center;
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
