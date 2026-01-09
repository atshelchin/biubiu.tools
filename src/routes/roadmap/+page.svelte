<script lang="ts">
	import { useI18n } from '@shelchin/i18n';
	import { roadmapItems } from '../../features/roadmap/data/roadmap-items';
	import { stageMetadata } from '../../features/roadmap/data/metadata';
	import type { DevStage } from '../../features/roadmap/types';
	import SeoHead from '$lib/components/seo-head.svelte';
	import { localizeHref } from '$lib/utils/localized-url';
	import { ArrowRight, ExternalLink } from '@lucide/svelte';
	import { page } from '$app/state';

	const i18n = useI18n();
	// Use a wrapper that accepts any string key for dynamic translations
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const t = (key: string) => i18n.t(key as any);

	// Filter state
	let selectedStage: DevStage | 'all' = $state('all');

	// Get filtered items
	const filteredItems = $derived(
		selectedStage === 'all'
			? roadmapItems
			: roadmapItems.filter((item) => item.stage === selectedStage)
	);

	// Get stage display info
	function getStageInfo(stage: DevStage) {
		return stageMetadata.find((s) => s.stage === stage);
	}

	// Stage colors - muted tones
	const stageColors: Record<DevStage, string> = {
		planning: '#9ca3af',
		development: '#f59e0b',
		alpha: '#ef4444',
		beta: '#3b82f6',
		stable: '#10b981',
		deprecated: '#6b7280'
	};

	// Group items by expected date within each stage
	function groupByDate(items: typeof roadmapItems): [string, typeof roadmapItems][] {
		const grouped: Record<string, typeof roadmapItems> = {};
		for (const item of items) {
			const date = item.expectedDate || 'TBD';
			if (!grouped[date]) {
				grouped[date] = [];
			}
			grouped[date].push(item);
		}
		return Object.entries(grouped);
	}
</script>

<SeoHead
	title={t('routes/roadmap.meta.title')}
	description={t('routes/roadmap.meta.description')}
	canonical={page.url.href}
/>

<div class="roadmap-page">
	<!-- Header -->
	<header class="roadmap-header">
		<h1>{t('routes/roadmap.title')}</h1>
		<p class="subtitle">{t('routes/roadmap.subtitle')}</p>
	</header>

	<!-- Filter -->
	<div class="filter-bar">
		<button
			class="filter-btn"
			class:active={selectedStage === 'all'}
			onclick={() => (selectedStage = 'all')}
		>
			{t('routes/roadmap.legend.show_all')}
		</button>
		{#each stageMetadata as stage (stage.stage)}
			<button
				class="filter-btn"
				class:active={selectedStage === stage.stage}
				style="--stage-color: {stageColors[stage.stage]}"
				onclick={() => (selectedStage = stage.stage)}
			>
				<span class="filter-dot"></span>
				{t(stage.labelKey)}
			</button>
		{/each}
	</div>

	<!-- Timeline View -->
	<div class="timeline">
		{#each stageMetadata as stage (stage.stage)}
			{@const items = filteredItems.filter((item) => item.stage === stage.stage)}
			{#if items.length > 0}
				{@const groupedItems = groupByDate(items)}
				<section class="stage-section" style="--stage-color: {stageColors[stage.stage]}">
					<!-- Stage Header -->
					<div class="stage-header">
						<div class="stage-label">
							<span class="stage-indicator"></span>
							<h2>{t(stage.labelKey)}</h2>
							<span class="count">{items.length}</span>
						</div>
					</div>

					<!-- Timeline entries by date -->
					{#each groupedItems as [date, dateItems] (date)}
						<div class="timeline-entry">
							<div class="timeline-date">
								<span class="date-text">{date}</span>
								<span class="date-line"></span>
							</div>
							<div class="timeline-content">
								<div class="items-grid">
									{#each dateItems as item (item.id)}
										<article class="item-card">
											<div class="item-header">
												<h3>{t(item.nameKey)}</h3>
												{#if item.link}
													<a href={localizeHref(item.link)} class="item-link" title="Open">
														<ExternalLink size={14} />
													</a>
												{/if}
											</div>

											<p class="item-desc">{t(item.descriptionKey)}</p>

											<!-- Progress -->
											<div class="progress-row">
												<div class="progress-track">
													<div class="progress-bar" style="width: {item.completionPercent}%"></div>
												</div>
												<span class="progress-text">{item.completionPercent}%</span>
											</div>

											<!-- Next stage info -->
											{#if item.nextStage}
												{@const nextStageInfo = getStageInfo(item.nextStage)}
												<div class="next-stage">
													<ArrowRight size={12} />
													<span
														>{t('routes/roadmap.next')}: {nextStageInfo
															? t(nextStageInfo.labelKey)
															: item.nextStage}</span
													>
												</div>
											{/if}

											<!-- Tags -->
											<div class="item-tags">
												<span class="tag tag-stability tag-stability-{item.stability}"
													>{t(`routes/roadmap.stability.${item.stability}`)}</span
												>
												<span
													class="tag tag-recommendation tag-recommendation-{item.recommendation}"
													>{t(`routes/roadmap.recommendation.${item.recommendation}`)}</span
												>
												{#each item.targetAudience as audience (audience)}
													<span class="tag tag-audience tag-audience-{audience}"
														>{t(`routes/roadmap.audience.${audience.replace('-', '_')}`)}</span
													>
												{/each}
											</div>
										</article>
									{/each}
								</div>
							</div>
						</div>
					{/each}
				</section>
			{/if}
		{/each}
	</div>

	<!-- Empty state -->
	{#if filteredItems.length === 0}
		<div class="empty-state">
			<p>{t('routes/roadmap.no_items')}</p>
		</div>
	{/if}
</div>

<style>
	.roadmap-page {
		max-width: 1000px;
		margin: 0 auto;
		padding: 2rem 1rem 4rem;
	}

	/* Header */
	.roadmap-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.roadmap-header h1 {
		font-size: 1.75rem;
		font-weight: 600;
		color: var(--color-foreground);
		margin-bottom: 0.25rem;
	}

	.subtitle {
		color: var(--color-muted-foreground);
		font-size: 0.9rem;
	}

	/* Filter bar */
	.filter-bar {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 2.5rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--color-border);
	}

	.filter-btn {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.375rem 0.75rem;
		font-size: 0.8rem;
		color: var(--color-muted-foreground);
		background: transparent;
		border: 1px solid var(--color-border);
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.15s;
	}

	.filter-btn:hover {
		color: var(--color-foreground);
		border-color: var(--gray-400);
	}

	.filter-btn.active {
		color: var(--color-foreground);
		background: var(--color-muted);
		border-color: var(--color-foreground);
	}

	.filter-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--stage-color);
		opacity: 0.7;
	}

	.filter-btn.active .filter-dot {
		opacity: 1;
	}

	/* Timeline */
	.timeline {
		position: relative;
	}

	/* Stage section */
	.stage-section {
		margin-bottom: 3rem;
	}

	.stage-header {
		margin-bottom: 1.5rem;
	}

	.stage-label {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.stage-indicator {
		width: 12px;
		height: 12px;
		background: var(--stage-color);
		border-radius: 50%;
	}

	.stage-label h2 {
		font-size: 1rem;
		font-weight: 600;
		color: var(--stage-color);
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	.count {
		font-size: 0.7rem;
		color: var(--stage-color);
		background: color-mix(in srgb, var(--stage-color) 12%, transparent);
		padding: 0.125rem 0.5rem;
		border-radius: 10px;
	}

	/* Timeline entry */
	.timeline-entry {
		display: grid;
		grid-template-columns: 100px 1fr;
		gap: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.timeline-date {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding-top: 0.25rem;
	}

	.date-text {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--stage-color);
		white-space: nowrap;
	}

	.date-line {
		flex: 1;
		height: 1px;
		background: var(--color-border);
		margin-top: 0.6rem;
	}

	.timeline-content {
		position: relative;
		padding-left: 1.5rem;
		border-left: 2px solid color-mix(in srgb, var(--stage-color) 30%, transparent);
	}

	.timeline-content::before {
		content: '';
		position: absolute;
		left: -5px;
		top: 0.4rem;
		width: 8px;
		height: 8px;
		background: var(--stage-color);
		border-radius: 50%;
	}

	/* Items grid */
	.items-grid {
		display: grid;
		gap: 0.75rem;
	}

	/* Item card */
	.item-card {
		background: var(--color-card);
		border: 1px solid var(--color-border);
		border-radius: 6px;
		padding: 1rem;
	}

	.item-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 0.375rem;
	}

	.item-header h3 {
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--color-foreground);
	}

	.item-link {
		color: var(--gray-400);
		padding: 0.25rem;
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.item-link:hover {
		color: var(--color-foreground);
		background: var(--color-muted);
	}

	.item-desc {
		font-size: 0.8rem;
		color: var(--color-muted-foreground);
		line-height: 1.4;
		margin-bottom: 0.75rem;
	}

	/* Progress */
	.progress-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.progress-track {
		flex: 1;
		height: 4px;
		background: var(--gray-200);
		border-radius: 2px;
		overflow: hidden;
	}

	.progress-bar {
		height: 100%;
		background: var(--stage-color);
		border-radius: 2px;
		transition: width 0.3s;
		opacity: 0.8;
	}

	.progress-text {
		font-size: 0.7rem;
		color: var(--gray-400);
		min-width: 2.5rem;
		text-align: right;
	}

	/* Next stage */
	.next-stage {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.7rem;
		color: var(--gray-400);
		margin-bottom: 0.5rem;
	}

	/* Tags */
	.item-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
	}

	.tag {
		font-size: 0.65rem;
		padding: 0.125rem 0.375rem;
		border-radius: 3px;
		background: var(--color-muted);
		color: var(--color-muted-foreground);
	}

	/* Stability tags - purple tones */
	.tag-stability {
		background: color-mix(in srgb, #8b5cf6 8%, var(--color-muted));
		color: color-mix(in srgb, #8b5cf6 60%, var(--color-muted-foreground));
	}

	.tag-stability-experimental {
		background: color-mix(in srgb, #ef4444 10%, var(--color-muted));
		color: color-mix(in srgb, #ef4444 70%, var(--color-muted-foreground));
	}

	.tag-stability-unstable {
		background: color-mix(in srgb, #f59e0b 10%, var(--color-muted));
		color: color-mix(in srgb, #f59e0b 70%, var(--color-muted-foreground));
	}

	.tag-stability-stable {
		background: color-mix(in srgb, #10b981 10%, var(--color-muted));
		color: color-mix(in srgb, #10b981 70%, var(--color-muted-foreground));
	}

	.tag-stability-production {
		background: color-mix(in srgb, #059669 10%, var(--color-muted));
		color: color-mix(in srgb, #059669 70%, var(--color-muted-foreground));
	}

	/* Recommendation tags - semantic colors */
	.tag-recommendation-recommended {
		background: color-mix(in srgb, #10b981 10%, var(--color-muted));
		color: color-mix(in srgb, #10b981 70%, var(--color-muted-foreground));
	}

	.tag-recommendation-caution {
		background: color-mix(in srgb, #f59e0b 10%, var(--color-muted));
		color: color-mix(in srgb, #f59e0b 70%, var(--color-muted-foreground));
	}

	.tag-recommendation-not-recommended {
		background: color-mix(in srgb, #ef4444 10%, var(--color-muted));
		color: color-mix(in srgb, #ef4444 70%, var(--color-muted-foreground));
	}

	/* Audience tags - blue tones */
	.tag-audience {
		background: color-mix(in srgb, #3b82f6 8%, var(--color-muted));
		color: color-mix(in srgb, #3b82f6 60%, var(--color-muted-foreground));
	}

	.tag-audience-early-adopter {
		background: color-mix(in srgb, #8b5cf6 10%, var(--color-muted));
		color: color-mix(in srgb, #8b5cf6 70%, var(--color-muted-foreground));
	}

	.tag-audience-developer {
		background: color-mix(in srgb, #3b82f6 10%, var(--color-muted));
		color: color-mix(in srgb, #3b82f6 70%, var(--color-muted-foreground));
	}

	.tag-audience-power-user {
		background: color-mix(in srgb, #f59e0b 10%, var(--color-muted));
		color: color-mix(in srgb, #f59e0b 70%, var(--color-muted-foreground));
	}

	.tag-audience-everyone {
		background: color-mix(in srgb, #10b981 10%, var(--color-muted));
		color: color-mix(in srgb, #10b981 70%, var(--color-muted-foreground));
	}

	/* Empty state */
	.empty-state {
		text-align: center;
		padding: 3rem 1rem;
		color: var(--color-muted-foreground);
	}

	/* Responsive */
	@media (min-width: 768px) {
		.items-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 640px) {
		.timeline-entry {
			grid-template-columns: 1fr;
			gap: 0.5rem;
		}

		.timeline-date {
			padding-left: 0;
		}

		.date-line {
			display: none;
		}

		.timeline-content {
			padding-left: 1rem;
		}
	}

	@media (max-width: 480px) {
		.roadmap-page {
			padding: 1.5rem 1rem 3rem;
		}

		.roadmap-header h1 {
			font-size: 1.5rem;
		}
	}
</style>
