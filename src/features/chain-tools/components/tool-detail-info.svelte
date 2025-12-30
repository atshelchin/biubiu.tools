<script lang="ts">
	import { Info, Calendar, Users, Coins, ExternalLink } from '@lucide/svelte';
	import { useI18n, type TranslationKeys } from '@shelchin/i18n';
	import type { ToolDetail } from '../types';

	interface Props {
		detail: ToolDetail;
	}

	let { detail }: Props = $props();

	const i18n = useI18n();

	// Social link icons and labels
	const socialConfig = {
		twitter: { label: 'Twitter', icon: 'X' },
		discord: { label: 'Discord', icon: 'Discord' },
		telegram: { label: 'Telegram', icon: 'Telegram' },
		github: { label: 'GitHub', icon: 'GitHub' },
		docs: { label: 'Docs', icon: 'Docs' }
	};

	const hasSocialLinks = $derived(detail.socialLinks && Object.keys(detail.socialLinks).length > 0);
	const hasProjectInfo = $derived(detail.founded || detail.team || detail.funding);
</script>

{#if hasProjectInfo || hasSocialLinks}
	<section class="info-section">
		<h2 class="section-title">
			<Info class="section-icon" />
			<span
				>{i18n.t('routes/apps/chain-tools/chain-tools.project_info' as keyof TranslationKeys, {
					defaultValue: 'Project Info'
				})}</span
			>
		</h2>

		<div class="info-container">
			<!-- Project Details -->
			{#if hasProjectInfo}
				<div class="info-grid">
					{#if detail.founded}
						<div class="info-item">
							<Calendar class="info-icon" />
							<div class="info-content">
								<span class="info-label"
									>{i18n.t('routes/apps/chain-tools/chain-tools.founded' as keyof TranslationKeys, {
										defaultValue: 'Founded'
									})}</span
								>
								<span class="info-value">{detail.founded}</span>
							</div>
						</div>
					{/if}

					{#if detail.team}
						<div class="info-item">
							<Users class="info-icon" />
							<div class="info-content">
								<span class="info-label"
									>{i18n.t('routes/apps/chain-tools/chain-tools.team' as keyof TranslationKeys, {
										defaultValue: 'Team'
									})}</span
								>
								<span class="info-value">{detail.team}</span>
							</div>
						</div>
					{/if}

					{#if detail.funding}
						<div class="info-item">
							<Coins class="info-icon" />
							<div class="info-content">
								<span class="info-label"
									>{i18n.t('routes/apps/chain-tools/chain-tools.funding' as keyof TranslationKeys, {
										defaultValue: 'Funding'
									})}</span
								>
								<span class="info-value">{detail.funding}</span>
							</div>
						</div>
					{/if}
				</div>
			{/if}

			<!-- Social Links -->
			{#if hasSocialLinks && detail.socialLinks}
				<div class="social-section">
					<span class="social-label"
						>{i18n.t('routes/apps/chain-tools/chain-tools.links' as keyof TranslationKeys, {
							defaultValue: 'Links'
						})}:</span
					>
					<div class="social-links">
						{#each Object.entries(detail.socialLinks) as [key, url] (key)}
							{#if url}
								<a href={url} target="_blank" rel="noopener noreferrer" class="social-link">
									<span>{socialConfig[key as keyof typeof socialConfig]?.label || key}</span>
									<ExternalLink class="link-icon" />
								</a>
							{/if}
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</section>
{/if}

<style>
	.info-section {
		margin-top: var(--space-8);
	}

	.section-title {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		color: var(--color-heading-1);
		margin: 0 0 var(--space-5) 0;
	}

	:global(.section-icon) {
		width: 22px;
		height: 22px;
		color: var(--color-description-3);
	}

	.info-container {
		padding: var(--space-6);
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-xl);
	}

	:global(.light) .info-container {
		background: var(--color-panel-2);
	}

	/* Info Grid */
	.info-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-4);
	}

	.info-item {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3);
		background: var(--color-panel-2);
		border-radius: var(--radius-lg);
	}

	:global(.light) .info-item {
		background: var(--color-panel-1);
	}

	:global(.info-icon) {
		width: 20px;
		height: 20px;
		color: var(--color-description-3);
		flex-shrink: 0;
	}

	.info-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-0-5);
	}

	.info-label {
		font-size: var(--text-xs);
		color: var(--color-description-3);
	}

	.info-value {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-heading-1);
	}

	/* Social Section */
	.social-section {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: var(--space-3);
		margin-top: var(--space-5);
		padding-top: var(--space-5);
		border-top: 1px solid var(--color-panel-border-2);
	}

	.social-label {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-description-3);
	}

	.social-links {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.social-link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-2) var(--space-3);
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-description-2);
		text-decoration: none;
		transition: all 0.2s ease;
	}

	:global(.light) .social-link {
		background: var(--color-panel-1);
	}

	.social-link:hover {
		border-color: var(--color-panel-border-3);
		color: var(--color-heading-1);
		transform: translateY(-1px);
	}

	:global(.link-icon) {
		width: 12px;
		height: 12px;
		opacity: 0.6;
	}

	/* Mobile */
	@media (max-width: 768px) {
		.info-section {
			margin-top: var(--space-6);
		}

		.section-title {
			font-size: var(--text-lg);
		}

		.info-container {
			padding: var(--space-4);
		}

		.info-grid {
			grid-template-columns: 1fr;
			gap: var(--space-3);
		}

		.social-section {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--space-2);
			margin-top: var(--space-4);
			padding-top: var(--space-4);
		}
	}
</style>
