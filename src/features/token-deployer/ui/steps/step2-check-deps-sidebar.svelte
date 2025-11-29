<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import { step2State } from '@/features/token-deployer/stores/step2-state.svelte';
	import { useConnectStore } from '$lib/stores/connect.svelte';

	const i18n = useI18n();
	const connectStore = useConnectStore();

	// Derive summary stats
	let summary = $derived(step2State.summary);
	let isChecking = $derived(step2State.isChecking);
	let hasChecked = $derived(step2State.hasChecked);

	const currentNetwork = $derived(
		connectStore.currentChainId
			? connectStore.networks.find((n) => n.chainId === connectStore.currentChainId)
			: undefined
	);
</script>

<div class="sidebar-content">
	<h2>{i18n.t('tools.token_deployer.step2.sidebar.title')}</h2>
	<p class="description">{i18n.t('tools.token_deployer.step2.sidebar.description')}</p>

	{#if isChecking}
		<div class="status-card checking">
			<div class="spinner"></div>
			<p>{i18n.t('tools.token_deployer.step2.sidebar.checking')}</p>
		</div>
	{:else if hasChecked && summary}
		<div class="status-card" class:success={summary.allPassed} class:error={!summary.allPassed}>
			<div class="status-icon">
				{summary.allPassed ? '✅' : '❌'}
			</div>
			<div class="status-details">
				<div class="status-row">
					<span class="label">{i18n.t('tools.token_deployer.step2.sidebar.total')}</span>
					<span class="value">{summary.total}</span>
				</div>
				<div class="status-row">
					<span class="label">{i18n.t('tools.token_deployer.step2.sidebar.passed')}</span>
					<span class="value">{summary.passed}</span>
				</div>
				{#if summary.failed > 0}
					<div class="status-row">
						<span class="label">{i18n.t('tools.token_deployer.step2.sidebar.failed')}</span>
						<span class="value error-text">{summary.failed}</span>
					</div>
				{/if}
			</div>
		</div>
	{/if}

	{#if currentNetwork}
		<div class="network-info">
			<h3>{i18n.t('tools.token_deployer.step2.sidebar.network')}</h3>
			<p class="network-name">{currentNetwork.name}</p>
		</div>
	{/if}

	<div class="help-section">
		<h3>{i18n.t('tools.token_deployer.step2.sidebar.what_is_this')}</h3>
		<p>{i18n.t('tools.token_deployer.step2.sidebar.what_is_this_desc')}</p>

		<h3>{i18n.t('tools.token_deployer.step2.sidebar.dependencies')}</h3>
		<ul>
			<li>
				<strong>{i18n.t('tools.token_deployer.step2.sidebar.rpc_endpoint')}</strong>
				{i18n.t('tools.token_deployer.step2.sidebar.rpc_endpoint_desc')}
			</li>
			<li>
				<strong>{i18n.t('tools.token_deployer.step2.sidebar.create2_proxy')}</strong>
				{i18n.t('tools.token_deployer.step2.sidebar.create2_proxy_desc')}
			</li>
			<li>
				<strong>{i18n.t('tools.token_deployer.step2.sidebar.multicall3')}</strong>
				{i18n.t('tools.token_deployer.step2.sidebar.multicall3_desc')}
			</li>
			<li>
				<strong>{i18n.t('tools.token_deployer.step2.sidebar.biubiu_premium')}</strong>
				{i18n.t('tools.token_deployer.step2.sidebar.biubiu_premium_desc')}
			</li>
			<li>
				<strong>{i18n.t('tools.token_deployer.step2.sidebar.token_factory')}</strong>
				{i18n.t('tools.token_deployer.step2.sidebar.token_factory_desc')}
			</li>
		</ul>
	</div>
</div>

<style>
	.sidebar-content {
		padding: var(--space-6);
		background: var(--color-panel-1);
		border-radius: var(--radius-lg);
	}

	h2 {
		font-size: var(--text-xl);
		font-weight: var(--font-bold);
		color: var(--color-text-primary);
		margin-bottom: var(--space-3);
	}

	.description {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		margin-bottom: var(--space-6);
		line-height: 1.6;
	}

	/* Status Card */
	.status-card {
		padding: var(--space-4);
		border-radius: var(--radius-md);
		margin-bottom: var(--space-6);
	}

	.status-card.checking {
		background: var(--color-panel-2);
		border: 2px solid var(--color-border);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-3);
	}

	.spinner {
		width: 32px;
		height: 32px;
		border: 3px solid var(--color-border);
		border-top-color: var(--color-primary);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.status-card.success {
		background: var(--color-success-light);
		border: 2px solid var(--color-success);
	}

	.status-card.error {
		background: var(--color-error-light);
		border: 2px solid var(--color-error);
	}

	.status-icon {
		font-size: 32px;
		text-align: center;
		margin-bottom: var(--space-3);
	}

	.status-details {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.status-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.status-row .label {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}

	.status-row .value {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
	}

	.error-text {
		color: var(--color-error);
	}

	/* Network Info */
	.network-info {
		margin-bottom: var(--space-6);
	}

	.network-info h3 {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--color-text-secondary);
		margin-bottom: var(--space-2);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.network-name {
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		color: var(--color-text-primary);
	}

	/* Help Section */
	.help-section {
		border-top: 1px solid var(--color-border);
		padding-top: var(--space-6);
	}

	.help-section h3 {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin-bottom: var(--space-2);
		margin-top: var(--space-4);
	}

	.help-section h3:first-child {
		margin-top: 0;
	}

	.help-section p {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		line-height: 1.6;
		margin-bottom: var(--space-4);
	}

	.help-section ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.help-section li {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		line-height: 1.6;
		margin-bottom: var(--space-3);
		padding-left: var(--space-4);
		position: relative;
	}

	.help-section li::before {
		content: '•';
		position: absolute;
		left: 0;
		color: var(--color-primary);
		font-weight: var(--font-bold);
	}

	.help-section li strong {
		color: var(--color-text-primary);
		font-weight: var(--font-semibold);
	}
</style>
