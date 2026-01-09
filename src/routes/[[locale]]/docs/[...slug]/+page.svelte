<script lang="ts">
	import { page } from '$app/stores';
	import { useI18n } from '@shelchin/i18n';
	import { Calendar, ChevronRight, Clock, Edit, User } from '@lucide/svelte';
	import type { ParsedDoc, DocNavigation } from '@/features/docs/types';

	interface Props {
		data: {
			doc: ParsedDoc;
			navigation: DocNavigation;
		};
	}

	let { data }: Props = $props();
	const i18n = useI18n();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const t = (key: string) => i18n.t(key as any);

	// Find prev/next documents
	const allDocs = $derived.by(() => {
		const docs: { path: string; title: string }[] = [];
		for (const category of data.navigation.categories) {
			for (const item of category.items) {
				docs.push({ path: `/docs${item.path}`, title: item.title });
			}
		}
		return docs;
	});

	const currentIndex = $derived(allDocs.findIndex((d) => d.path === $page.url.pathname));
	const prevDoc = $derived(currentIndex > 0 ? allDocs[currentIndex - 1] : null);
	const nextDoc = $derived(currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null);

	// Get localized category label
	const categoryLabel = $derived(
		data.navigation.categories.find((c) => c.slug === data.doc.category)?.label ?? data.doc.category
	);

	// Active TOC tracking
	let activeTocId = $state('');

	$effect(() => {
		if (typeof window === 'undefined') return;

		const headings = document.querySelectorAll('.doc-content h2, .doc-content h3');
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						activeTocId = entry.target.id;
						break;
					}
				}
			},
			{ rootMargin: '-80px 0px -80% 0px' }
		);

		headings.forEach((h) => observer.observe(h));

		return () => observer.disconnect();
	});

	// JSON-LD structured data
	const jsonLd = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'TechArticle',
			headline: data.doc.frontmatter.title,
			description: data.doc.frontmatter.description,
			author: data.doc.frontmatter.author
				? {
						'@type': 'Person',
						name: data.doc.frontmatter.author
					}
				: {
						'@type': 'Organization',
						name: 'biubiu.tools'
					},
			dateModified: data.doc.frontmatter.lastUpdated,
			publisher: {
				'@type': 'Organization',
				name: 'biubiu.tools',
				url: 'https://biubiu.tools'
			},
			mainEntityOfPage: {
				'@type': 'WebPage',
				'@id': `https://biubiu.tools${$page.url.pathname}`
			}
		})
	);
</script>

<svelte:head>
	<title>{data.doc.frontmatter.title} | {t('common.docs.title')} | biubiu.tools</title>
	<meta name="description" content={data.doc.frontmatter.description ?? ''} />

	<!-- Open Graph -->
	<meta property="og:title" content="{data.doc.frontmatter.title} | biubiu.tools Docs" />
	<meta property="og:description" content={data.doc.frontmatter.description ?? ''} />
	<meta property="og:type" content="article" />

	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html '<' + 'script type="application/ld+json">' + jsonLd + '<' + '/script>'}
</svelte:head>

<article class="doc-page">
	<div class="doc-container">
		<!-- Breadcrumb -->
		<nav class="breadcrumb" aria-label="Breadcrumb">
			<a href="/docs">{t('common.docs.title')}</a>
			<ChevronRight size={14} />
			<span>{categoryLabel}</span>
			<ChevronRight size={14} />
			<span class="current">{data.doc.frontmatter.title}</span>
		</nav>

		<div class="doc-grid">
			<!-- Main content -->
			<div class="doc-content-wrapper">
				<header class="doc-header">
					<h1>{data.doc.frontmatter.title}</h1>
					{#if data.doc.frontmatter.description}
						<p class="doc-description">{data.doc.frontmatter.description}</p>
					{/if}

					<div class="doc-meta">
						{#if data.doc.frontmatter.author}
							<span class="meta-item">
								<User size={14} />
								{data.doc.frontmatter.author}
							</span>
						{/if}
						{#if data.doc.frontmatter.lastUpdated}
							<span class="meta-item">
								<Calendar size={14} />
								{data.doc.frontmatter.lastUpdated}
							</span>
						{/if}
						<span class="meta-item reading-time">
							<Clock size={14} />
							{Math.ceil(data.doc.content.split(/\s+/).length / 200)} min read
						</span>
					</div>
				</header>

				<!-- eslint-disable svelte/no-at-html-tags -->
				<div class="doc-content prose">
					{@html data.doc.html}
				</div>

				<!-- Prev/Next navigation -->
				<nav class="doc-nav">
					{#if prevDoc}
						<a href={prevDoc.path} class="nav-link prev">
							<span class="nav-label">← {t('common.docs.previous')}</span>
							<span class="nav-title">{prevDoc.title}</span>
						</a>
					{:else}
						<div></div>
					{/if}
					{#if nextDoc}
						<a href={nextDoc.path} class="nav-link next">
							<span class="nav-label">{t('common.docs.next')} →</span>
							<span class="nav-title">{nextDoc.title}</span>
						</a>
					{/if}
				</nav>

				<!-- Edit link -->
				<div class="doc-footer">
					<a
						href="https://github.com/atshelchin/biubiu.tools/edit/main{data.doc.path}"
						target="_blank"
						rel="noopener noreferrer"
						class="edit-link"
					>
						<Edit size={14} />
						{t('common.docs.edit_on_github')}
					</a>
				</div>
			</div>

			<!-- Table of Contents -->
			{#if data.doc.toc.length > 0}
				<aside class="doc-toc">
					<div class="toc-wrapper">
						<h4 class="toc-title">{t('common.docs.on_this_page')}</h4>
						<nav class="toc-nav">
							{#each data.doc.toc as item (item.id)}
								<a
									href="#{item.id}"
									class="toc-link"
									class:active={activeTocId === item.id}
									class:level-3={item.level === 3}
									class:level-4={item.level === 4}
								>
									{item.text}
								</a>
								{#if item.children}
									{#each item.children as child (child.id)}
										<a
											href="#{child.id}"
											class="toc-link level-3"
											class:active={activeTocId === child.id}
										>
											{child.text}
										</a>
									{/each}
								{/if}
							{/each}
						</nav>
					</div>
				</aside>
			{/if}
		</div>
	</div>
</article>

<style>
	.doc-page {
		padding: var(--space-8) var(--space-6);
		max-width: 100%;
	}

	.doc-container {
		max-width: 1200px;
		margin: 0 auto;
	}

	/* Breadcrumb */
	.breadcrumb {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
		margin-bottom: var(--space-6);
		flex-wrap: wrap;
	}

	.breadcrumb a {
		color: var(--color-muted-foreground);
		text-decoration: none;
		transition: color 0.2s;
	}

	.breadcrumb a:hover {
		color: var(--color-primary);
	}

	.breadcrumb .current {
		color: var(--color-foreground);
		font-weight: var(--font-medium);
	}

	/* Grid layout */
	.doc-grid {
		display: grid;
		grid-template-columns: 1fr 220px;
		gap: var(--space-8);
	}

	/* Header */
	.doc-header {
		margin-bottom: var(--space-8);
		padding-bottom: var(--space-6);
		border-bottom: 1px solid var(--color-border);
	}

	.doc-header h1 {
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		color: var(--color-foreground);
		margin: 0;
		line-height: 1.2;
	}

	.doc-description {
		margin-top: var(--space-3);
		font-size: var(--text-lg);
		color: var(--color-muted-foreground);
		line-height: 1.6;
	}

	.doc-meta {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-4);
		margin-top: var(--space-4);
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
	}

	.meta-item {
		display: flex;
		align-items: center;
		gap: var(--space-1);
	}

	/* Content */
	.doc-content-wrapper {
		min-width: 0;
	}

	.doc-content {
		font-size: var(--text-base);
		line-height: 1.8;
		color: var(--color-foreground);
	}

	/* Prose styles for markdown content */
	.doc-content :global(h2) {
		font-size: var(--text-2xl);
		font-weight: var(--font-semibold);
		margin-top: var(--space-10);
		margin-bottom: var(--space-4);
		padding-bottom: var(--space-2);
		border-bottom: 1px solid var(--color-border);
		scroll-margin-top: 5rem;
	}

	.doc-content :global(h3) {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		margin-top: var(--space-8);
		margin-bottom: var(--space-3);
		scroll-margin-top: 5rem;
	}

	.doc-content :global(h4) {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		margin-top: var(--space-6);
		margin-bottom: var(--space-2);
		scroll-margin-top: 5rem;
	}

	.doc-content :global(p) {
		margin-bottom: var(--space-4);
	}

	.doc-content :global(ul),
	.doc-content :global(ol) {
		margin-bottom: var(--space-4);
		padding-left: var(--space-6);
	}

	.doc-content :global(li) {
		margin-bottom: var(--space-2);
	}

	.doc-content :global(a) {
		color: var(--color-primary);
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.doc-content :global(a:hover) {
		text-decoration-thickness: 2px;
	}

	.doc-content :global(code) {
		font-family: var(--font-mono);
		font-size: 0.9em;
		padding: 0.2em 0.4em;
		background: var(--color-muted);
		border-radius: var(--radius-sm);
	}

	.doc-content :global(.code-block) {
		margin: var(--space-4) 0;
		border-radius: var(--radius-lg);
		overflow: hidden;
	}

	.doc-content :global(.code-block pre) {
		margin: 0;
		padding: var(--space-4);
		overflow-x: auto;
		font-size: var(--text-sm);
		line-height: 1.6;
	}

	.doc-content :global(.code-block code) {
		background: none;
		padding: 0;
	}

	.doc-content :global(blockquote) {
		margin: var(--space-4) 0;
		padding: var(--space-4);
		padding-left: var(--space-5);
		border-left: 4px solid var(--color-primary);
		background: var(--color-muted);
		border-radius: 0 var(--radius-md) var(--radius-md) 0;
	}

	.doc-content :global(blockquote p:last-child) {
		margin-bottom: 0;
	}

	.doc-content :global(table) {
		width: 100%;
		margin: var(--space-4) 0;
		border-collapse: collapse;
	}

	.doc-content :global(th),
	.doc-content :global(td) {
		padding: var(--space-3);
		border: 1px solid var(--color-border);
		text-align: left;
	}

	.doc-content :global(th) {
		background: var(--color-muted);
		font-weight: var(--font-semibold);
	}

	.doc-content :global(img) {
		max-width: 100%;
		height: auto;
		border-radius: var(--radius-lg);
		margin: var(--space-4) 0;
	}

	.doc-content :global(hr) {
		margin: var(--space-8) 0;
		border: none;
		border-top: 1px solid var(--color-border);
	}

	/* Navigation */
	.doc-nav {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-4);
		margin-top: var(--space-12);
		padding-top: var(--space-8);
		border-top: 1px solid var(--color-border);
	}

	.nav-link {
		display: flex;
		flex-direction: column;
		padding: var(--space-4);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		text-decoration: none;
		transition: all 0.2s;
	}

	.nav-link:hover {
		border-color: var(--color-primary);
		background: var(--color-muted);
	}

	.nav-link.next {
		text-align: right;
	}

	.nav-label {
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
	}

	.nav-title {
		font-weight: var(--font-medium);
		color: var(--color-foreground);
		margin-top: var(--space-1);
	}

	/* Footer */
	.doc-footer {
		margin-top: var(--space-8);
		padding-top: var(--space-6);
		/* border-top: 1px solid var(--color-border); */
	}

	.edit-link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
		text-decoration: none;
		transition: color 0.2s;
	}

	.edit-link:hover {
		color: var(--color-primary);
	}

	/* Table of Contents */
	.doc-toc {
		position: relative;
	}

	.toc-wrapper {
		position: sticky;
		top: var(--space-8);
	}

	.toc-title {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--color-foreground);
		margin: 0 0 var(--space-3) 0;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.toc-nav {
		display: flex;
		flex-direction: column;
	}

	.toc-link {
		padding: var(--space-1) 0;
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
		text-decoration: none;
		border-left: 2px solid transparent;
		padding-left: var(--space-3);
		transition: all 0.2s;
	}

	.toc-link:hover {
		color: var(--color-foreground);
	}

	.toc-link.active {
		color: var(--color-primary);
		border-left-color: var(--color-primary);
	}

	.toc-link.level-3 {
		padding-left: var(--space-6);
		font-size: var(--text-xs);
	}

	.toc-link.level-4 {
		padding-left: var(--space-8);
		font-size: var(--text-xs);
	}

	/* Responsive */
	@media (max-width: 1200px) {
		.doc-grid {
			grid-template-columns: 1fr;
		}

		.doc-toc {
			display: none;
		}
	}

	@media (max-width: 768px) {
		.doc-page {
			padding: var(--space-4);
		}

		.doc-header h1 {
			font-size: var(--text-2xl);
		}

		.doc-nav {
			grid-template-columns: 1fr;
		}
	}

	/* Dark mode code blocks */
	:global([data-theme='dark']) .doc-content :global(.shiki),
	:global([data-theme='dark']) .doc-content :global(.shiki span) {
		color: var(--shiki-dark) !important;
		background-color: var(--shiki-dark-bg) !important;
	}

	:global([data-theme='light']) .doc-content :global(.shiki),
	:global([data-theme='light']) .doc-content :global(.shiki span) {
		color: var(--shiki-light) !important;
		background-color: var(--shiki-light-bg) !important;
	}
</style>
