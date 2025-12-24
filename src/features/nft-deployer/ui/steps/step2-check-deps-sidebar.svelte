<script lang="ts">
	import { useI18n } from '@shelchin/i18n';
	import { step2CheckDepsState } from '@/features/nft-deployer/stores/step2-check-deps-state.svelte';

	const i18n = useI18n();

	const summary = $derived(step2CheckDepsState.summary);
	const hasChecked = $derived(step2CheckDepsState.hasChecked);
</script>

<div class="step-sidebar">
	<h3 class="sidebar-title">{i18n.t('nft-deployer.step2.sidebar.title')}</h3>
	<p class="sidebar-description">
		{i18n.t('nft-deployer.step2.sidebar.description')}
	</p>

	{#if hasChecked && summary}
		<div class="status-card" class:success={summary.allPassed} class:error={!summary.allPassed}>
			<div class="status-header">
				<span class="status-icon">
					{#if summary.allPassed}
						✓
					{:else}
						⚠
					{/if}
				</span>
				<span class="status-text">
					{#if summary.allPassed}
						{i18n.t('nft-deployer.step2.sidebar.all_passed')}
					{:else}
						{i18n.t('nft-deployer.step2.sidebar.issues_found')}
					{/if}
				</span>
			</div>

			<div class="status-stats">
				<div class="stat">
					<span class="stat-value">{summary.passed}</span>
					<span class="stat-label">{i18n.t('nft-deployer.step2.sidebar.passed')}</span>
				</div>
				{#if summary.failed > 0}
					<div class="stat error">
						<span class="stat-value">{summary.failed}</span>
						<span class="stat-label">{i18n.t('nft-deployer.step2.sidebar.failed')}</span>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.step-sidebar {
		padding: var(--space-6);
		background: var(--color-panel-1);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
	}

	.sidebar-title {
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		color: var(--gray-900);
		margin: 0 0 var(--space-2) 0;
	}

	:global([data-theme='dark']) .sidebar-title {
		color: var(--gray-100);
	}

	.sidebar-description {
		font-size: var(--text-sm);
		color: var(--gray-600);
		margin: 0 0 var(--space-4) 0;
		line-height: 1.5;
	}

	:global([data-theme='dark']) .sidebar-description {
		color: var(--gray-400);
	}

	.status-card {
		margin-top: var(--space-4);
		padding: var(--space-4);
		border-radius: var(--radius-md);
		border: 2px solid;
	}

	.status-card.success {
		background: var(--green-50);
		border-color: var(--green-500);
	}

	.status-card.error {
		background: var(--red-50);
		border-color: var(--red-500);
	}

	:global([data-theme='dark']) .status-card.success {
		background: rgba(34, 197, 94, 0.1);
	}

	:global([data-theme='dark']) .status-card.error {
		background: rgba(239, 68, 68, 0.1);
	}

	.status-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-3);
	}

	.status-icon {
		font-size: var(--text-xl);
		line-height: 1;
	}

	.status-text {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .status-text {
		color: var(--gray-100);
	}

	.status-stats {
		display: flex;
		gap: var(--space-4);
	}

	.stat {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.stat-value {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--gray-900);
	}

	.stat.error .stat-value {
		color: var(--red-600);
	}

	:global([data-theme='dark']) .stat-value {
		color: var(--gray-100);
	}

	.stat-label {
		font-size: var(--text-xs);
		color: var(--gray-600);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	:global([data-theme='dark']) .stat-label {
		color: var(--gray-400);
	}
</style>
