<script lang="ts">
	import { useI18n } from '@shelchin/i18n';

	const i18n = useI18n();
</script>

<div class="info-card">
	<h3 class="info-title">{i18n.t('routes/apps/contract-deployer.step3.sidebar.title')}</h3>
	<div class="info-content">
		<p>{i18n.t('routes/apps/contract-deployer.step3.sidebar.description')}</p>

		<div class="info-section">
			<h4>{i18n.t('routes/apps/contract-deployer.step3.sidebar.bytecode_title')}</h4>
			<p>{i18n.t('routes/apps/contract-deployer.step3.sidebar.bytecode_description')}</p>
		</div>

		<div class="info-section">
			<h4>{i18n.t('routes/apps/contract-deployer.step3.sidebar.abi_title')}</h4>
			<p>{i18n.t('routes/apps/contract-deployer.step3.sidebar.abi_description')}</p>
		</div>

		<div class="info-section">
			<h4>{i18n.t('routes/apps/contract-deployer.step3.sidebar.constructor_title')}</h4>
			<p>{i18n.t('routes/apps/contract-deployer.step3.sidebar.constructor_description')}</p>
		</div>

		<div class="info-section">
			<h4>{i18n.t('routes/apps/contract-deployer.step3.sidebar.salt_title')}</h4>
			<p>{i18n.t('routes/apps/contract-deployer.step3.sidebar.salt_description')}</p>
		</div>
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

	.info-content > p {
		margin-bottom: var(--space-4);
	}

	.info-section {
		margin-bottom: var(--space-4);
		padding: var(--space-3);
		background-color: var(--color-panel-1);
		border-radius: var(--border-radius-md);
	}

	.info-section:last-child {
		margin-bottom: 0;
	}

	.info-section h4 {
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
		margin-bottom: var(--space-2);
		color: var(--color-text-primary);
	}

	.info-section p {
		margin: 0;
		font-size: var(--font-size-xs);
		line-height: 1.5;
	}
</style>
