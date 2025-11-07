<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import { deploymentState } from '../../stores/deployment-state.svelte';

	const i18n = useI18n();

	const statusInfo = $derived.by(() => {
		switch (deploymentState.status) {
			case 'preparing':
				return {
					title: i18n.t('tools.nft_deployer.step5.sidebar.status_preparing'),
					color: 'var(--yellow-600)'
				};
			case 'deploying':
				return {
					title: i18n.t('tools.nft_deployer.step5.sidebar.status_deploying'),
					color: 'var(--blue-600)'
				};
			case 'completed':
				return {
					title: i18n.t('tools.nft_deployer.step5.sidebar.status_completed'),
					color: 'var(--green-600)'
				};
			case 'error':
				return {
					title: i18n.t('tools.nft_deployer.step5.sidebar.status_error'),
					color: 'var(--red-600)'
				};
			default:
				return {
					title: i18n.t('tools.nft_deployer.step5.sidebar.status_ready'),
					color: 'var(--gray-600)'
				};
		}
	});
</script>

<div class="step-sidebar">
	<h3 class="sidebar-title">{i18n.t('tools.nft_deployer.step5.sidebar.title')}</h3>
	<p class="sidebar-description">
		{i18n.t('tools.nft_deployer.step5.sidebar.description')}
	</p>

	{#if deploymentState.status !== 'idle'}
		<div class="status-section">
			<h4 class="info-title">{i18n.t('tools.nft_deployer.step5.sidebar.deployment_status')}</h4>
			<div class="status-card" style="border-color: {statusInfo.color}">
				<div class="status-indicator" style="background: {statusInfo.color}"></div>
				<div class="status-content">
					<div class="status-title" style="color: {statusInfo.color}">{statusInfo.title}</div>
					{#if deploymentState.message}
						<div class="status-message">{deploymentState.message}</div>
					{/if}
				</div>
			</div>

			{#if deploymentState.isDeploying}
				<div class="progress-bar">
					<div
						class="progress-fill"
						style="width: {deploymentState.progress}%; background: {statusInfo.color}"
					></div>
				</div>
				<div class="progress-text">{deploymentState.progress}%</div>
			{/if}
		</div>
	{/if}

	<div class="info-section">
		<h4 class="info-title">{i18n.t('tools.nft_deployer.step5.sidebar.checklist')}</h4>
		<ul class="info-list">
			<li>{i18n.t('tools.nft_deployer.step5.sidebar.check1')}</li>
			<li>{i18n.t('tools.nft_deployer.step5.sidebar.check2')}</li>
			<li>{i18n.t('tools.nft_deployer.step5.sidebar.check3')}</li>
			<li>{i18n.t('tools.nft_deployer.step5.sidebar.check4')}</li>
		</ul>
	</div>
</div>

<style>
	.step-sidebar {
		padding: var(--space-6);
	}

	.sidebar-title {
		font-size: var(--text-xl);
		font-weight: var(--font-bold);
		color: var(--gray-900);
		margin: 0 0 var(--space-3) 0;
	}

	:global([data-theme='dark']) .sidebar-title {
		color: var(--gray-100);
	}

	.sidebar-description {
		font-size: var(--text-base);
		color: var(--gray-600);
		line-height: 1.6;
		margin: 0 0 var(--space-6) 0;
	}

	:global([data-theme='dark']) .sidebar-description {
		color: var(--gray-400);
	}

	.status-section {
		margin-bottom: var(--space-6);
	}

	.info-title {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-700);
		margin: 0 0 var(--space-3) 0;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	:global([data-theme='dark']) .info-title {
		color: var(--gray-300);
	}

	.status-card {
		display: flex;
		gap: var(--space-3);
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 2px solid;
		border-radius: var(--radius-md);
	}

	.status-indicator {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		flex-shrink: 0;
		margin-top: 4px;
	}

	.status-content {
		flex: 1;
	}

	.status-title {
		font-size: var(--text-sm);
		font-weight: var(--font-bold);
		margin-bottom: var(--space-1);
	}

	.status-message {
		font-size: var(--text-xs);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .status-message {
		color: var(--gray-400);
	}

	.progress-bar {
		width: 100%;
		height: 8px;
		background: var(--gray-200);
		border-radius: var(--radius-full);
		overflow: hidden;
		margin-top: var(--space-3);
	}

	:global([data-theme='dark']) .progress-bar {
		background: var(--gray-700);
	}

	.progress-fill {
		height: 100%;
		transition: width 0.3s ease;
		border-radius: var(--radius-full);
	}

	.progress-text {
		text-align: center;
		font-size: var(--text-xs);
		color: var(--gray-600);
		margin-top: var(--space-1);
		font-weight: var(--font-medium);
	}

	:global([data-theme='dark']) .progress-text {
		color: var(--gray-400);
	}

	.info-section {
		margin-bottom: var(--space-6);
	}

	.info-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.info-list li {
		padding: var(--space-2) 0;
		padding-left: var(--space-5);
		position: relative;
		font-size: var(--text-sm);
		color: var(--gray-600);
		line-height: 1.5;
	}

	.info-list li::before {
		content: '✓';
		position: absolute;
		left: 0;
		color: var(--green-600);
		font-weight: var(--font-bold);
	}

	:global([data-theme='dark']) .info-list li {
		color: var(--gray-400);
	}
</style>
