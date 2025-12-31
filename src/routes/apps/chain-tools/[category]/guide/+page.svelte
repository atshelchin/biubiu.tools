<script lang="ts">
	import { useI18n } from '@shelchin/i18n';
	import {
		BookOpen,
		Map,
		Route,
		BookA,
		CircleHelp,
		ChartBar,
		ChevronRight,
		Star,
		CheckCircle2,
		Clock
	} from '@lucide/svelte';
	import SeoHead from '$lib/components/seo-head.svelte';
	import { useGuideProgress } from '@/features/chain-tools/composables/use-guide-progress.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();
	const progress = useGuideProgress(data.guide.categoryId);

	// Calculate total tasks
	const totalTasks = $derived(
		data.guide.learningPath.reduce((acc, phase) => acc + phase.tasks.length, 0)
	);
	const totalSections = $derived(data.guide.fundamentalsCount);
	const totalTools = $derived(data.tools.length);

	// Overall progress percentage
	const overallProgress = $derived(
		progress.calculateOverallProgress(totalSections, totalTools, totalTasks)
	);

	// Base path for guide pages
	const basePath = $derived(`/apps/chain-tools/${data.guide.categoryId}/guide`);

	// Navigation items
	const navItems = [
		{
			id: 'fundamentals',
			icon: BookOpen,
			labelKey: 'navigation.fundamentals',
			href: `${basePath}/fundamentals`,
			count: data.guide.fundamentalsCount
		},
		{
			id: 'ecosystem',
			icon: Map,
			labelKey: 'navigation.ecosystem',
			href: `${basePath}/ecosystem`,
			count: data.guide.ecosystemSubCategories.length
		},
		{
			id: 'learning-path',
			icon: Route,
			labelKey: 'navigation.learning_path',
			href: `${basePath}/learning-path`,
			count: data.guide.learningPath.length
		},
		{
			id: 'glossary',
			icon: BookA,
			labelKey: 'navigation.glossary',
			href: `${basePath}/glossary`,
			count: data.guide.glossary.length
		},
		{
			id: 'quiz',
			icon: CircleHelp,
			labelKey: 'navigation.quiz',
			href: `${basePath}/quiz`,
			count: data.guide.quiz.questions.length
		}
	];

	// Get localized text
	function t(key: string, params?: Record<string, unknown>): string {
		const fullKey = `${data.guide.i18nKeyPrefix}.${key}`;
		return i18n.t(fullKey as never, params as never) || key;
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

<div class="guide-page">
	<!-- Header -->
	<header class="guide-header">
		<div class="header-content">
			<h1 class="title">{t('title')}</h1>
			<p class="subtitle">{t('subtitle')}</p>
		</div>

		<!-- Progress Card -->
		<div class="progress-card">
			<div class="progress-header">
				<ChartBar class="progress-icon" />
				<span class="progress-label">{t('progress.overall')}</span>
			</div>
			<div class="progress-bar-container">
				<div class="progress-bar" style="width: {overallProgress}%"></div>
			</div>
			<div class="progress-text">{overallProgress}%</div>
		</div>
	</header>

	<!-- Introduction -->
	<section class="intro-section">
		<p class="intro-text">{t('intro')}</p>
	</section>

	<!-- Stats -->
	<section class="stats-section">
		<div class="stat-item">
			<span class="stat-value">{data.tools.length}</span>
			<span class="stat-label">{t('stats.tools_count', { count: data.tools.length })}</span>
		</div>
		<div class="stat-item">
			<span class="stat-value">{data.guide.ecosystemSubCategories.length}</span>
			<span class="stat-label"
				>{t('stats.sub_categories', { count: data.guide.ecosystemSubCategories.length })}</span
			>
		</div>
		<div class="stat-item">
			<span class="stat-value">{data.guide.learningPath.length}</span>
			<span class="stat-label"
				>{t('stats.learning_phases', { count: data.guide.learningPath.length })}</span
			>
		</div>
		<div class="stat-item">
			<span class="stat-value">{data.guide.quiz.questions.length}</span>
			<span class="stat-label"
				>{t('stats.quiz_questions', { count: data.guide.quiz.questions.length })}</span
			>
		</div>
	</section>

	<!-- Navigation Cards -->
	<section class="nav-section">
		<div class="nav-grid">
			{#each navItems as item (item.id)}
				<a href={item.href} class="nav-card">
					<div class="nav-card-icon">
						<item.icon class="icon" />
					</div>
					<div class="nav-card-content">
						<h3 class="nav-card-title">{t(item.labelKey)}</h3>
						<span class="nav-card-count">{item.count} items</span>
					</div>
					<ChevronRight class="nav-card-arrow" />
				</a>
			{/each}
		</div>
	</section>

	<!-- Core Projects Preview -->
	<section class="core-projects-section">
		<h2 class="section-title">{t('core.title')}</h2>
		<p class="section-description">{t('core.description')}</p>

		<div class="tier-groups">
			<!-- Tier 1: Must Know -->
			<div class="tier-group">
				<div class="tier-header">
					<Star class="tier-icon tier-1" />
					<span class="tier-label">{t('core.tier1')}</span>
				</div>
				<div class="tier-tools">
					{#each data.guide.coreProjects.filter((p) => p.tier === 1) as project (project.toolId)}
						{@const tool = data.tools.find((t) => t.id === project.toolId)}
						{#if tool}
							<a href="/apps/chain-tools/tool/{tool.id}" class="core-tool-card">
								<div class="tool-name">{tool.name}</div>
								<div class="tool-significance">{t(`core.${project.toolId}`)}</div>
								{#if progress.getToolStatus(tool.id) === 'mastered'}
									<CheckCircle2 class="mastered-icon" />
								{/if}
							</a>
						{/if}
					{/each}
				</div>
			</div>

			<!-- Tier 2: Should Know -->
			<div class="tier-group">
				<div class="tier-header">
					<Star class="tier-icon tier-2" />
					<span class="tier-label">{t('core.tier2')}</span>
				</div>
				<div class="tier-tools">
					{#each data.guide.coreProjects.filter((p) => p.tier === 2) as project (project.toolId)}
						{@const tool = data.tools.find((t) => t.id === project.toolId)}
						{#if tool}
							<a href="/apps/chain-tools/tool/{tool.id}" class="core-tool-card">
								<div class="tool-name">{tool.name}</div>
								<div class="tool-significance">{t(`core.${project.toolId}`)}</div>
								{#if progress.getToolStatus(tool.id) === 'mastered'}
									<CheckCircle2 class="mastered-icon" />
								{/if}
							</a>
						{/if}
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- Quick Start Learning Path -->
	<section class="quick-start-section">
		<h2 class="section-title">{t('learning.title')}</h2>
		<p class="section-description">{t('learning.description')}</p>

		<div class="phases-preview">
			{#each data.guide.learningPath.slice(0, 2) as phase, index (phase.id)}
				{@const completedInPhase = phase.tasks.filter((task) =>
					progress.isTaskCompleted(task.id)
				).length}
				<div
					class="phase-card"
					class:current={index === progress.progress.learningPathProgress.currentPhase}
				>
					<div class="phase-header">
						<span class="phase-number">Phase {index + 1}</span>
						<span class="phase-time">
							<Clock class="time-icon" />
							{phase.estimatedDays} days
						</span>
					</div>
					<h3 class="phase-title">{t(`learning.phase${index + 1}.title`)}</h3>
					<p class="phase-description">{t(`learning.phase${index + 1}.description`)}</p>
					<div class="phase-progress">
						<div class="phase-progress-bar">
							<div
								class="phase-progress-fill"
								style="width: {(completedInPhase / phase.tasks.length) * 100}%"
							></div>
						</div>
						<span class="phase-progress-text">{completedInPhase}/{phase.tasks.length} tasks</span>
					</div>
				</div>
			{/each}
		</div>

		<a href="{basePath}/learning-path" class="view-all-link">
			{t('common.view_all')}
			<ChevronRight class="link-arrow" />
		</a>
	</section>

	<!-- Quiz CTA -->
	<section class="quiz-cta-section">
		<div class="quiz-cta-content">
			<CircleHelp class="quiz-cta-icon" />
			<div class="quiz-cta-text">
				<h3>{t('quiz.title')}</h3>
				<p>{t('quiz.description')}</p>
			</div>
		</div>
		<div class="quiz-cta-actions">
			<a href="{basePath}/quiz?difficulty=beginner" class="quiz-btn beginner"
				>{t('quiz.beginner')}</a
			>
			<a href="{basePath}/quiz?difficulty=intermediate" class="quiz-btn intermediate"
				>{t('quiz.intermediate')}</a
			>
			<a href="{basePath}/quiz?difficulty=expert" class="quiz-btn expert">{t('quiz.expert')}</a>
		</div>
	</section>

	<!-- Back to Tools -->
	<div class="back-link">
		<a href="/apps/chain-tools/{data.guide.categoryId}">← Back to {data.category.labelKey} Tools</a>
	</div>
</div>

<style>
	.guide-page {
		max-width: 1000px;
		margin: 0 auto;
		padding: var(--space-6);
	}

	/* Header */
	.guide-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: var(--space-6);
		margin-bottom: var(--space-8);
		flex-wrap: wrap;
	}

	.header-content {
		flex: 1;
		min-width: 280px;
	}

	.title {
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		color: var(--color-heading-1);
		margin-bottom: var(--space-2);
	}

	.subtitle {
		font-size: var(--text-lg);
		color: var(--color-description-2);
	}

	.progress-card {
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-lg);
		padding: var(--space-4);
		min-width: 200px;
	}

	.progress-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-3);
	}

	.progress-header :global(.progress-icon) {
		width: 20px;
		height: 20px;
		color: #3b82f6;
	}

	.progress-label {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-heading-2);
	}

	.progress-bar-container {
		height: 8px;
		background: var(--color-panel-3);
		border-radius: var(--radius-full);
		overflow: hidden;
		margin-bottom: var(--space-2);
	}

	.progress-bar {
		height: 100%;
		background: linear-gradient(90deg, #3b82f6, #60a5fa);
		border-radius: var(--radius-full);
		transition: width 0.3s ease;
	}

	.progress-text {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--color-heading-1);
		text-align: center;
	}

	/* Intro */
	.intro-section {
		margin-bottom: var(--space-8);
	}

	.intro-text {
		font-size: var(--text-base);
		color: var(--color-description-2);
		line-height: 1.7;
	}

	/* Stats */
	.stats-section {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: var(--space-4);
		margin-bottom: var(--space-10);
	}

	.stat-item {
		text-align: center;
		padding: var(--space-4);
		background: var(--color-panel-3);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-md);
	}

	.stat-value {
		display: block;
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--color-heading-1);
	}

	.stat-label {
		font-size: var(--text-xs);
		color: var(--color-description-2);
	}

	/* Navigation Cards */
	.nav-section {
		margin-bottom: var(--space-10);
	}

	.nav-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: var(--space-4);
	}

	.nav-card {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-4);
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-lg);
		text-decoration: none;
		transition: all 0.2s ease;
	}

	.nav-card:hover {
		background: var(--color-panel-3);
		border-color: #3b82f6;
		transform: translateY(-2px);
	}

	.nav-card-icon {
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-panel-3);
		border-radius: var(--radius-md);
	}

	.nav-card-icon :global(.icon) {
		width: 24px;
		height: 24px;
		color: #3b82f6;
	}

	.nav-card-content {
		flex: 1;
	}

	.nav-card-title {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--color-heading-2);
		margin-bottom: var(--space-1);
	}

	.nav-card-count {
		font-size: var(--text-sm);
		color: var(--color-description-3);
	}

	.nav-card :global(.nav-card-arrow) {
		width: 20px;
		height: 20px;
		color: var(--color-description-3);
	}

	/* Sections */
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

	/* Core Projects */
	.core-projects-section {
		margin-bottom: var(--space-10);
	}

	.tier-groups {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}

	.tier-group {
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-lg);
		padding: var(--space-4);
	}

	.tier-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-4);
	}

	.tier-header :global(.tier-icon) {
		width: 20px;
		height: 20px;
	}

	.tier-header :global(.tier-1) {
		color: #f59e0b;
	}

	.tier-header :global(.tier-2) {
		color: #6b7280;
	}

	.tier-label {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--color-heading-2);
	}

	.tier-tools {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: var(--space-3);
	}

	.core-tool-card {
		position: relative;
		padding: var(--space-3);
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-md);
		text-decoration: none;
		transition: all 0.2s ease;
	}

	.core-tool-card:hover {
		border-color: #3b82f6;
	}

	.tool-name {
		font-weight: var(--font-semibold);
		color: var(--color-heading-2);
		margin-bottom: var(--space-1);
	}

	.tool-significance {
		font-size: var(--text-xs);
		color: var(--color-description-3);
		line-height: 1.4;
	}

	.core-tool-card :global(.mastered-icon) {
		position: absolute;
		top: var(--space-2);
		right: var(--space-2);
		width: 16px;
		height: 16px;
		color: #10b981;
	}

	/* Quick Start */
	.quick-start-section {
		margin-bottom: var(--space-10);
	}

	.phases-preview {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: var(--space-4);
		margin-bottom: var(--space-4);
	}

	.phase-card {
		padding: var(--space-4);
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-lg);
	}

	.phase-card.current {
		border-color: #3b82f6;
	}

	.phase-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-2);
	}

	.phase-number {
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		color: #3b82f6;
		text-transform: uppercase;
	}

	.phase-time {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-xs);
		color: var(--color-description-3);
	}

	.phase-time :global(.time-icon) {
		width: 12px;
		height: 12px;
	}

	.phase-title {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--color-heading-2);
		margin-bottom: var(--space-2);
	}

	.phase-description {
		font-size: var(--text-sm);
		color: var(--color-description-3);
		margin-bottom: var(--space-3);
	}

	.phase-progress {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.phase-progress-bar {
		flex: 1;
		height: 6px;
		background: var(--color-panel-3);
		border-radius: var(--radius-full);
		overflow: hidden;
	}

	.phase-progress-fill {
		height: 100%;
		background: #3b82f6;
		border-radius: var(--radius-full);
	}

	.phase-progress-text {
		font-size: var(--text-xs);
		color: var(--color-description-3);
		white-space: nowrap;
	}

	.view-all-link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: #2563eb;
		text-decoration: none;
	}

	.view-all-link:hover {
		text-decoration: underline;
	}

	.view-all-link :global(.link-arrow) {
		width: 16px;
		height: 16px;
	}

	/* Quiz CTA */
	.quiz-cta-section {
		background: linear-gradient(135deg, var(--color-panel-2), var(--color-panel-3));
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-lg);
		padding: var(--space-6);
		margin-bottom: var(--space-8);
	}

	.quiz-cta-content {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		margin-bottom: var(--space-4);
	}

	.quiz-cta-content :global(.quiz-cta-icon) {
		width: 48px;
		height: 48px;
		color: #3b82f6;
	}

	.quiz-cta-text h3 {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--color-heading-1);
		margin-bottom: var(--space-1);
	}

	.quiz-cta-text p {
		font-size: var(--text-sm);
		color: var(--color-description-2);
	}

	.quiz-cta-actions {
		display: flex;
		gap: var(--space-3);
		flex-wrap: wrap;
	}

	.quiz-btn {
		padding: var(--space-2) var(--space-4);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		border-radius: var(--radius-md);
		text-decoration: none;
		transition: all 0.2s ease;
	}

	.quiz-btn.beginner {
		background: #10b981;
		color: white;
	}

	.quiz-btn.intermediate {
		background: #f59e0b;
		color: white;
	}

	.quiz-btn.expert {
		background: #ef4444;
		color: white;
	}

	.quiz-btn:hover {
		transform: translateY(-2px);
		opacity: 0.9;
	}

	/* Back Link */
	.back-link {
		text-align: center;
	}

	.back-link a {
		font-size: var(--text-sm);
		color: var(--color-description-3);
		text-decoration: none;
	}

	.back-link a:hover {
		color: #2563eb;
	}

	/* Mobile */
	@media (max-width: 768px) {
		.guide-page {
			padding: var(--space-4);
		}

		.guide-header {
			flex-direction: column;
		}

		.progress-card {
			width: 100%;
		}

		.stats-section {
			grid-template-columns: repeat(2, 1fr);
		}

		.title {
			font-size: var(--text-2xl);
		}
	}
</style>
