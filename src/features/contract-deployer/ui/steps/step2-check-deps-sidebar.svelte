<script lang="ts">
	import { useI18n } from '@shelchin/i18n';

	const i18n = useI18n();
</script>

<div class="info-card">
	<h3 class="info-title">{i18n.t('contract-deployer.step2.sidebar.title')}</h3>
	<div class="info-content">
		<p>{i18n.t('contract-deployer.step2.sidebar.description')}</p>
		<div class="dependency-list">
			<h4>{i18n.t('contract-deployer.step2.sidebar.required_contracts')}</h4>
			<ul>
				<li>
					<strong>CREATE2 Proxy</strong>
					<code>0x4e59b44847b379578588920cA78FbF26c0B4956C</code>
				</li>
			</ul>
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

	.info-content p {
		margin-bottom: var(--space-4);
	}

	.dependency-list {
		margin-top: var(--space-4);
		padding: var(--space-4);
		background-color: var(--color-panel-1);
		border-radius: var(--border-radius-md);
	}

	.dependency-list h4 {
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
		margin-bottom: var(--space-3);
		color: var(--color-text-primary);
	}

	.dependency-list ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.dependency-list li {
		margin-bottom: var(--space-2);
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.dependency-list code {
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		background-color: var(--color-panel-2);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--border-radius-sm);
		word-break: break-all;
	}
</style>
