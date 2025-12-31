<script lang="ts">
	import { useI18n } from '@shelchin/i18n';
	import { SvelteSet } from 'svelte/reactivity';
	import {
		Route,
		ChevronLeft,
		ChevronDown,
		ChevronUp,
		CheckCircle2,
		Circle,
		BookOpen,
		Search,
		Wrench,
		CircleHelp,
		Clock,
		ExternalLink
	} from '@lucide/svelte';
	import SeoHead from '$lib/components/seo-head.svelte';
	import { useGuideProgress } from '@/features/chain-tools/composables/use-guide-progress.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();
	const progress = useGuideProgress(data.guide.categoryId);

	// Base paths for absolute links
	const basePath = $derived(`/apps/chain-tools/${data.guide.categoryId}/guide`);
	const toolPath = '/apps/chain-tools/tool';

	// Expanded phases state
	const expandedPhases = new SvelteSet([data.guide.learningPath[0]?.id ?? '']);

	// Get localized text
	function t(key: string, params?: Record<string, unknown>): string {
		const fullKey = `${data.guide.i18nKeyPrefix}.${key}`;
		return i18n.t(fullKey as never, params as never) || key;
	}

	// Toggle phase expansion
	function togglePhase(phaseId: string) {
		if (expandedPhases.has(phaseId)) {
			expandedPhases.delete(phaseId);
		} else {
			expandedPhases.add(phaseId);
		}
	}

	// Get task type icon
	function getTaskIcon(type: string) {
		switch (type) {
			case 'read':
				return BookOpen;
			case 'research':
				return Search;
			case 'practice':
				return Wrench;
			case 'quiz':
				return CircleHelp;
			default:
				return Circle;
		}
	}

	// Get task type label
	function getTaskTypeLabel(type: string): string {
		switch (type) {
			case 'read':
				return 'Read';
			case 'research':
				return 'Research';
			case 'practice':
				return 'Practice';
			case 'quiz':
				return 'Quiz';
			default:
				return type;
		}
	}

	// Get tool by ID
	function getToolById(toolId: string) {
		return data.tools.find((tool) => tool.id === toolId);
	}

	// Toggle task completion
	function toggleTask(taskId: string) {
		if (progress.isTaskCompleted(taskId)) {
			// Uncomplete task - need to manually update
			const updatedTasks = progress.progress.learningPathProgress.completedTaskIds.filter(
				(id) => id !== taskId
			);
			progress.progress.learningPathProgress.completedTaskIds = updatedTasks;
		} else {
			progress.completeTask(taskId);
		}
	}

	// Calculate phase progress
	function getPhaseProgress(phaseId: string): number {
		const phase = data.guide.learningPath.find((p) => p.id === phaseId);
		if (!phase) return 0;
		const completed = phase.tasks.filter((task) => progress.isTaskCompleted(task.id)).length;
		return Math.round((completed / phase.tasks.length) * 100);
	}

	// Check if phase is complete
	function isPhaseComplete(phaseId: string): boolean {
		const phase = data.guide.learningPath.find((p) => p.id === phaseId);
		if (!phase) return false;
		return phase.tasks.every((task) => progress.isTaskCompleted(task.id));
	}

	// Overall progress
	const overallProgress = $derived(() => {
		const totalTasks = data.guide.learningPath.reduce((acc, phase) => acc + phase.tasks.length, 0);
		const completedTasks = progress.progress.learningPathProgress.completedTaskIds.length;
		return Math.round((completedTasks / totalTasks) * 100);
	});

	const completedTasksCount = $derived(
		progress.progress.learningPathProgress.completedTaskIds.length
	);
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

<div class="learning-path-page">
	<!-- Header -->
	<header class="page-header">
		<a href={basePath} class="back-link">
			<ChevronLeft class="back-icon" />
			<span>Back to Guide</span>
		</a>
		<div class="header-content">
			<Route class="header-icon" />
			<div>
				<h1 class="title">{t('learning.title')}</h1>
				<p class="subtitle">{t('learning.description')}</p>
			</div>
		</div>
	</header>

	<!-- Overall Progress -->
	<section class="overall-progress">
		<div class="progress-header">
			<h2 class="progress-title">{t('learning.your_progress')}</h2>
			<span class="progress-percentage">{overallProgress()}%</span>
		</div>
		<div class="progress-bar-container">
			<div class="progress-bar" style="width: {overallProgress()}%"></div>
		</div>
		<div class="progress-stats">
			<span class="stat">{completedTasksCount} / {data.totalTasks} tasks completed</span>
			<span class="stat"
				>{data.guide.learningPath.filter((p) => isPhaseComplete(p.id)).length} / {data.guide
					.learningPath.length} phases completed</span
			>
		</div>
	</section>

	<!-- Phases -->
	<section class="phases-section">
		{#each data.guide.learningPath as phase, phaseIndex (phase.id)}
			{@const isExpanded = expandedPhases.has(phase.id)}
			{@const phaseProgress = getPhaseProgress(phase.id)}
			{@const isComplete = isPhaseComplete(phase.id)}

			<div class="phase-card" class:complete={isComplete} class:expanded={isExpanded}>
				<button class="phase-header" onclick={() => togglePhase(phase.id)}>
					<div class="phase-indicator">
						{#if isComplete}
							<CheckCircle2 class="phase-check" />
						{:else}
							<span class="phase-number">{phaseIndex + 1}</span>
						{/if}
					</div>
					<div class="phase-info">
						<h3 class="phase-title">{t(`learning.phase${phaseIndex + 1}.title`)}</h3>
						<p class="phase-description">{t(`learning.phase${phaseIndex + 1}.description`)}</p>
					</div>
					<div class="phase-meta">
						<span class="phase-time">
							<Clock class="time-icon" />
							{t('learning.estimated_time', { days: phase.estimatedDays })}
						</span>
						<div class="phase-progress-mini">
							<div class="mini-bar">
								<div class="mini-bar-fill" style="width: {phaseProgress}%"></div>
							</div>
							<span class="mini-text">{phaseProgress}%</span>
						</div>
					</div>
					<div class="phase-toggle">
						{#if isExpanded}
							<ChevronUp class="toggle-icon" />
						{:else}
							<ChevronDown class="toggle-icon" />
						{/if}
					</div>
				</button>

				{#if isExpanded}
					<div class="phase-content">
						<!-- Core tools for this phase -->
						{#if phase.coreToolIds.length > 0}
							<div class="phase-tools">
								<h4 class="tools-title">Key Tools</h4>
								<div class="tools-list">
									{#each phase.coreToolIds as toolId (toolId)}
										{@const tool = getToolById(toolId)}
										{#if tool}
											<a href="{toolPath}/{tool.id}" class="tool-link">
												{tool.name}
												<ExternalLink class="link-icon" />
											</a>
										{/if}
									{/each}
								</div>
							</div>
						{/if}

						<!-- Tasks -->
						<div class="tasks-list">
							{#each phase.tasks as task (task.id)}
								{@const TaskIcon = getTaskIcon(task.type)}
								{@const isCompleted = progress.isTaskCompleted(task.id)}
								{@const relatedTool = task.toolId ? getToolById(task.toolId) : null}

								<div class="task-item" class:completed={isCompleted}>
									<button class="task-checkbox" onclick={() => toggleTask(task.id)}>
										{#if isCompleted}
											<CheckCircle2 class="check-icon completed" />
										{:else}
											<Circle class="check-icon" />
										{/if}
									</button>
									<div class="task-content">
										<div class="task-header">
											<span class="task-type" data-type={task.type}>
												<TaskIcon class="type-icon" />
												{getTaskTypeLabel(task.type)}
											</span>
										</div>
										<p class="task-action">
											{t(`learning.phase${phaseIndex + 1}.task${phase.tasks.indexOf(task) + 1}`)}
										</p>
										{#if task.link}
											<a href={task.link} class="task-link">
												→ Go to resource
												<ExternalLink class="link-icon-small" />
											</a>
										{:else if relatedTool}
											<a href="{toolPath}/{relatedTool.id}" class="task-tool">
												→ {relatedTool.name}
											</a>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		{/each}
	</section>

	<!-- Navigation -->
	<div class="page-nav">
		<a href="{basePath}/ecosystem" class="nav-link prev">
			<ChevronLeft class="nav-icon" />
			<span>Ecosystem</span>
		</a>
		<a href="{basePath}/glossary" class="nav-link next">
			<span>Glossary</span>
			<ChevronLeft class="nav-icon rotate" />
		</a>
	</div>
</div>

<style>
	.learning-path-page {
		max-width: 800px;
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
		color: #2563eb;
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

	/* Overall Progress */
	.overall-progress {
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-lg);
		padding: var(--space-4);
		margin-bottom: var(--space-6);
	}

	.progress-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-3);
	}

	.progress-title {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--color-heading-2);
	}

	.progress-percentage {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: #3b82f6;
	}

	.progress-bar-container {
		height: 12px;
		background: var(--color-panel-3);
		border-radius: var(--radius-full);
		overflow: hidden;
		margin-bottom: var(--space-3);
	}

	.progress-bar {
		height: 100%;
		background: linear-gradient(90deg, #3b82f6, #10b981);
		border-radius: var(--radius-full);
		transition: width 0.3s ease;
	}

	.progress-stats {
		display: flex;
		justify-content: space-between;
		font-size: var(--text-sm);
		color: var(--color-description-3);
	}

	/* Phases */
	.phases-section {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		margin-bottom: var(--space-6);
	}

	.phase-card {
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-lg);
		overflow: hidden;
		transition: all 0.2s ease;
	}

	.phase-card.complete {
		border-color: #10b981;
	}

	.phase-card.expanded {
		border-color: #3b82f6;
	}

	.phase-header {
		display: flex;
		align-items: flex-start;
		gap: var(--space-4);
		padding: var(--space-4);
		width: 100%;
		background: transparent;
		border: none;
		cursor: pointer;
		text-align: left;
	}

	.phase-indicator {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-panel-3);
		border-radius: var(--radius-full);
		flex-shrink: 0;
	}

	.phase-card.complete .phase-indicator {
		background: #10b981;
	}

	.phase-indicator :global(.phase-check) {
		width: 24px;
		height: 24px;
		color: white;
	}

	.phase-number {
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		color: var(--color-description-2);
	}

	.phase-info {
		flex: 1;
		min-width: 0;
	}

	.phase-title {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--color-heading-2);
		margin-bottom: var(--space-1);
	}

	.phase-description {
		font-size: var(--text-sm);
		color: var(--color-description-3);
	}

	.phase-meta {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: var(--space-2);
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

	.phase-progress-mini {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.mini-bar {
		width: 60px;
		height: 6px;
		background: var(--color-panel-3);
		border-radius: var(--radius-full);
		overflow: hidden;
	}

	.mini-bar-fill {
		height: 100%;
		background: #3b82f6;
		border-radius: var(--radius-full);
	}

	.mini-text {
		font-size: var(--text-xs);
		color: var(--color-description-3);
		min-width: 30px;
	}

	.phase-toggle {
		display: flex;
		align-items: center;
		padding: var(--space-2);
	}

	.phase-toggle :global(.toggle-icon) {
		width: 20px;
		height: 20px;
		color: var(--color-description-3);
	}

	/* Phase Content */
	.phase-content {
		padding: 0 var(--space-4) var(--space-4);
		border-top: 1px solid var(--color-panel-border-1);
	}

	.phase-tools {
		padding: var(--space-4) 0;
		border-bottom: 1px solid var(--color-panel-border-1);
	}

	.tools-title {
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		color: var(--color-description-3);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: var(--space-2);
	}

	.tools-list {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.tool-link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-1) var(--space-3);
		background: var(--color-panel-3);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		color: var(--color-heading-2);
		text-decoration: none;
		font-weight: var(--font-medium);
		transition: all 0.2s ease;
	}

	.tool-link:hover {
		background: #3b82f6;
		border-color: #3b82f6;
		color: #fff;
	}

	.tool-link :global(.link-icon) {
		width: 12px;
		height: 12px;
	}

	/* Tasks */
	.tasks-list {
		padding-top: var(--space-4);
	}

	.task-item {
		display: flex;
		gap: var(--space-3);
		padding: var(--space-3) 0;
		border-bottom: 1px solid var(--color-panel-border-1);
	}

	.task-item:last-child {
		border-bottom: none;
	}

	.task-item.completed {
		opacity: 0.6;
	}

	.task-checkbox {
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
		flex-shrink: 0;
	}

	.task-checkbox :global(.check-icon) {
		width: 24px;
		height: 24px;
		color: var(--color-description-3);
	}

	.task-checkbox :global(.check-icon.completed) {
		color: #10b981;
	}

	.task-checkbox:hover :global(.check-icon) {
		color: #3b82f6;
	}

	.task-content {
		flex: 1;
	}

	.task-header {
		margin-bottom: var(--space-1);
	}

	.task-type {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		padding: 2px 8px;
		border-radius: var(--radius-sm);
	}

	.task-type[data-type='read'] {
		background: #3b82f6;
		color: #fff;
	}

	.task-type[data-type='research'] {
		background: #f59e0b;
		color: #fff;
	}

	.task-type[data-type='practice'] {
		background: #10b981;
		color: #fff;
	}

	.task-type[data-type='quiz'] {
		background: #a855f7;
		color: #fff;
	}

	.task-type :global(.type-icon) {
		width: 12px;
		height: 12px;
	}

	.task-action {
		font-size: var(--text-sm);
		color: var(--color-description-2);
		margin-bottom: var(--space-1);
	}

	.task-tool,
	.task-link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-sm);
		color: #2563eb;
		text-decoration: none;
		font-weight: var(--font-medium);
	}

	.task-tool:hover,
	.task-link:hover {
		color: #1d4ed8;
		text-decoration: underline;
	}

	.task-link :global(.link-icon-small) {
		width: 12px;
		height: 12px;
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
		.learning-path-page {
			padding: var(--space-4);
		}

		.phase-header {
			flex-wrap: wrap;
		}

		.phase-meta {
			width: 100%;
			flex-direction: row;
			justify-content: space-between;
			margin-top: var(--space-2);
		}

		.phase-toggle {
			position: absolute;
			top: var(--space-4);
			right: var(--space-4);
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
