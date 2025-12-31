<script lang="ts">
	import { useI18n } from '@shelchin/i18n';
	import { BookOpen, ChevronRight, ChevronLeft, CheckCircle2 } from '@lucide/svelte';
	import SeoHead from '$lib/components/seo-head.svelte';
	import { useGuideProgress } from '@/features/chain-tools/composables/use-guide-progress.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();
	const progress = useGuideProgress(data.guide.categoryId);

	// Section IDs based on fundamentalsCount
	const sectionIds = $derived(
		Array.from({ length: data.guide.fundamentalsCount }, (_, i) => `section${i + 1}`)
	);

	// Current section state
	let currentSectionIndex = $state(0);

	// Get localized text
	function t(key: string, params?: Record<string, unknown>): string {
		const fullKey = `${data.guide.i18nKeyPrefix}.${key}`;
		return i18n.t(fullKey as never, params as never) || key;
	}

	// Navigate between sections
	function goToSection(index: number) {
		if (index >= 0 && index < sectionIds.length) {
			currentSectionIndex = index;
			// Mark as read when viewing
			const sectionId = sectionIds[index];
			if (sectionId) {
				progress.markSectionRead(sectionId);
			}
		}
	}

	// Check if section is read
	function isSectionRead(sectionId: string): boolean {
		return progress.isSectionRead(sectionId);
	}

	// Parse markdown-like content for display
	function parseContent(content: string): string {
		return (
			content
				// Bold
				.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
				// Headers in content
				.replace(/^### (.*?)$/gm, '<h4>$1</h4>')
				// Lists
				.replace(/^- (.*?)$/gm, '<li>$1</li>')
				// Wrap consecutive list items
				.replace(/(<li>.*?<\/li>\n?)+/g, '<ul>$&</ul>')
				// Line breaks
				.replace(/\n\n/g, '</p><p>')
		);
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

<div class="fundamentals-page">
	<!-- Header -->
	<header class="page-header">
		<a href=".." class="back-link">
			<ChevronLeft class="back-icon" />
			<span>Back to Guide</span>
		</a>
		<div class="header-content">
			<BookOpen class="header-icon" />
			<div>
				<h1 class="title">{t('fundamentals.title')}</h1>
				<p class="subtitle">{t('fundamentals.description')}</p>
			</div>
		</div>
	</header>

	<!-- Progress indicator -->
	<div class="progress-indicator">
		<div class="progress-steps">
			{#each sectionIds as sectionId, index (sectionId)}
				<button
					class="step"
					class:active={index === currentSectionIndex}
					class:completed={isSectionRead(sectionId)}
					onclick={() => goToSection(index)}
				>
					{#if isSectionRead(sectionId)}
						<CheckCircle2 class="step-check" />
					{:else}
						<span class="step-number">{index + 1}</span>
					{/if}
				</button>
				{#if index < sectionIds.length - 1}
					<div class="step-connector" class:completed={isSectionRead(sectionId)}></div>
				{/if}
			{/each}
		</div>
		<div class="progress-text">
			{progress.progress.readSections.filter((s) => s.startsWith('section')).length} / {sectionIds.length}
			sections completed
		</div>
	</div>

	<!-- Table of Contents (sidebar on desktop) -->
	<aside class="toc-sidebar">
		<h3 class="toc-title">Contents</h3>
		<nav class="toc-nav">
			{#each sectionIds as sectionId, index (sectionId)}
				<button
					class="toc-item"
					class:active={index === currentSectionIndex}
					class:read={isSectionRead(sectionId)}
					onclick={() => goToSection(index)}
				>
					<span class="toc-number">{index + 1}</span>
					<span class="toc-text">{t(`fundamentals.${sectionId}.title`)}</span>
					{#if isSectionRead(sectionId)}
						<CheckCircle2 class="toc-check" />
					{/if}
				</button>
			{/each}
		</nav>
	</aside>

	<!-- Main content area -->
	<main class="content-area">
		{#each sectionIds as sectionId, index (sectionId)}
			{#if index === currentSectionIndex}
				<article class="section-content">
					<h2 class="section-title">{t(`fundamentals.${sectionId}.title`)}</h2>
					<div class="section-body">
						{@html parseContent(t(`fundamentals.${sectionId}.content`))}
					</div>

					<!-- Navigation buttons -->
					<div class="section-nav">
						{#if index > 0}
							<button class="nav-btn prev" onclick={() => goToSection(index - 1)}>
								<ChevronLeft class="nav-icon" />
								<span>{t(`fundamentals.section${index}.title`)}</span>
							</button>
						{:else}
							<div></div>
						{/if}

						{#if index < sectionIds.length - 1}
							<button class="nav-btn next" onclick={() => goToSection(index + 1)}>
								<span>{t(`fundamentals.section${index + 2}.title`)}</span>
								<ChevronRight class="nav-icon" />
							</button>
						{:else}
							<a href="../ecosystem" class="nav-btn next complete">
								<span>Continue to Ecosystem</span>
								<ChevronRight class="nav-icon" />
							</a>
						{/if}
					</div>
				</article>
			{/if}
		{/each}
	</main>
</div>

<style>
	.fundamentals-page {
		max-width: 1200px;
		margin: 0 auto;
		padding: var(--space-6);
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-6);
	}

	@media (min-width: 1024px) {
		.fundamentals-page {
			grid-template-columns: 250px 1fr;
			grid-template-rows: auto auto 1fr;
		}

		.page-header {
			grid-column: 1 / -1;
		}

		.progress-indicator {
			grid-column: 1 / -1;
		}

		.toc-sidebar {
			grid-row: 3;
			position: sticky;
			top: var(--space-6);
			align-self: start;
		}

		.content-area {
			grid-row: 3;
		}
	}

	/* Header */
	.page-header {
		margin-bottom: var(--space-4);
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
		color: var(--color-accent);
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
		color: var(--color-accent);
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

	/* Progress Indicator */
	.progress-indicator {
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-lg);
		padding: var(--space-4);
	}

	.progress-steps {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0;
		margin-bottom: var(--space-3);
	}

	.step {
		width: 32px;
		height: 32px;
		border-radius: var(--radius-full);
		border: 2px solid var(--color-panel-border-1);
		background: var(--color-panel-1);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.step:hover {
		border-color: var(--color-accent);
	}

	.step.active {
		border-color: var(--color-accent);
		background: var(--color-accent);
	}

	.step.active .step-number {
		color: white;
	}

	.step.completed {
		border-color: #10b981;
		background: #10b981;
	}

	.step :global(.step-check) {
		width: 16px;
		height: 16px;
		color: white;
	}

	.step-number {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--color-description-2);
	}

	.step-connector {
		width: 40px;
		height: 2px;
		background: var(--color-panel-border-1);
	}

	.step-connector.completed {
		background: #10b981;
	}

	.progress-text {
		text-align: center;
		font-size: var(--text-sm);
		color: var(--color-description-3);
	}

	/* TOC Sidebar */
	.toc-sidebar {
		display: none;
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-lg);
		padding: var(--space-4);
	}

	@media (min-width: 1024px) {
		.toc-sidebar {
			display: block;
		}
	}

	.toc-title {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--color-heading-2);
		margin-bottom: var(--space-3);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.toc-nav {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.toc-item {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2);
		border-radius: var(--radius-md);
		background: transparent;
		border: none;
		cursor: pointer;
		text-align: left;
		transition: all 0.2s ease;
	}

	.toc-item:hover {
		background: var(--color-panel-3);
	}

	.toc-item.active {
		background: var(--color-accent);
	}

	.toc-item.active .toc-text,
	.toc-item.active .toc-number {
		color: white;
	}

	.toc-number {
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-panel-3);
		border-radius: var(--radius-full);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		color: var(--color-description-2);
	}

	.toc-item.active .toc-number {
		background: rgba(255, 255, 255, 0.2);
	}

	.toc-text {
		flex: 1;
		font-size: var(--text-sm);
		color: var(--color-description-2);
	}

	.toc-item :global(.toc-check) {
		width: 16px;
		height: 16px;
		color: #10b981;
	}

	.toc-item.active :global(.toc-check) {
		color: white;
	}

	/* Content Area */
	.content-area {
		min-height: 400px;
	}

	.section-content {
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-lg);
		padding: var(--space-6);
	}

	.section-title {
		font-size: var(--text-xl);
		font-weight: var(--font-bold);
		color: var(--color-heading-1);
		margin-bottom: var(--space-4);
	}

	.section-body {
		font-size: var(--text-base);
		color: var(--color-description-2);
		line-height: 1.8;
	}

	.section-body :global(p) {
		margin-bottom: var(--space-4);
	}

	.section-body :global(strong) {
		color: var(--color-heading-2);
		font-weight: var(--font-semibold);
	}

	.section-body :global(h4) {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--color-heading-2);
		margin-top: var(--space-6);
		margin-bottom: var(--space-3);
	}

	.section-body :global(ul) {
		margin: var(--space-4) 0;
		padding-left: var(--space-6);
	}

	.section-body :global(li) {
		margin-bottom: var(--space-2);
	}

	.section-body :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin: var(--space-4) 0;
	}

	.section-body :global(th),
	.section-body :global(td) {
		padding: var(--space-3);
		border: 1px solid var(--color-panel-border-1);
		text-align: left;
	}

	.section-body :global(th) {
		background: var(--color-panel-3);
		font-weight: var(--font-semibold);
		color: var(--color-heading-2);
	}

	/* Section Navigation */
	.section-nav {
		display: flex;
		justify-content: space-between;
		margin-top: var(--space-8);
		padding-top: var(--space-6);
		border-top: 1px solid var(--color-panel-border-1);
	}

	.nav-btn {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-4);
		background: var(--color-panel-3);
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-description-2);
		cursor: pointer;
		text-decoration: none;
		transition: all 0.2s ease;
	}

	.nav-btn:hover {
		background: var(--color-panel-2);
		border-color: var(--color-accent);
		color: var(--color-heading-2);
	}

	.nav-btn.complete {
		background: var(--color-accent);
		border-color: var(--color-accent);
		color: white;
	}

	.nav-btn.complete:hover {
		background: var(--color-accent-hover);
	}

	.nav-btn :global(.nav-icon) {
		width: 16px;
		height: 16px;
	}

	/* Mobile */
	@media (max-width: 768px) {
		.fundamentals-page {
			padding: var(--space-4);
		}

		.step {
			width: 28px;
			height: 28px;
		}

		.step-connector {
			width: 20px;
		}

		.section-content {
			padding: var(--space-4);
		}

		.section-nav {
			flex-direction: column;
			gap: var(--space-3);
		}

		.nav-btn {
			justify-content: center;
		}
	}
</style>
