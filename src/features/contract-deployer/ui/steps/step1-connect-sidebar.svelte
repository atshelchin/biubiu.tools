<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';

	const i18n = useI18n();
</script>

<div class="info-card">
	<h3 class="info-title">{i18n.t('tools.contract_deployer.step1.sidebar.title')}</h3>
	<div class="info-content">
		<p>{i18n.t('tools.contract_deployer.step1.sidebar.description')}</p>
	</div>
</div>

<style>
	.info-card {
		background-color: var(--color-surface);
		border-radius: var(--border-radius-lg);
		padding: var(--space-6);
		border: 1px solid var(--color-border);
	}

	.info-title {
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-semibold);
		margin-bottom: var(--space-4);
		color: var(--color-text-primary);
	}

	.info-content {
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		line-height: 1.6;
	}

	.info-content p {
		margin-bottom: var(--space-3);
	}

	.info-content p:last-child {
		margin-bottom: 0;
	}
</style>
