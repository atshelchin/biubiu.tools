<script lang="ts">
	/**
	 * Token Deployer Step 2: Dependency Check Sidebar
	 * Uses shared DependencyCheckSidebar component with custom help section
	 */
	import { DependencyCheckSidebar } from '$lib/components/step/dependency-check';
	import { step2State } from '@/features/token-deployer/stores/step2-state.svelte';
	import { useI18n } from '@shelchin/i18n';

	const i18n = useI18n();

	// Use $derived to get reactive value from step2State
	const summary = $derived(step2State.summary);
</script>

<DependencyCheckSidebar {summary}>
	<div class="help-section">
		<h3>{i18n.t('token-deployer.step2.sidebar.what_is_this')}</h3>
		<p>{i18n.t('token-deployer.step2.sidebar.what_is_this_desc')}</p>

		<h3>{i18n.t('token-deployer.step2.sidebar.dependencies')}</h3>
		<ul>
			<li>
				<strong>{i18n.t('token-deployer.step2.sidebar.rpc_endpoint')}</strong>
				{i18n.t('token-deployer.step2.sidebar.rpc_endpoint_desc')}
			</li>
			<li>
				<strong>{i18n.t('token-deployer.step2.sidebar.create2_proxy')}</strong>
				{i18n.t('token-deployer.step2.sidebar.create2_proxy_desc')}
			</li>
			<li>
				<strong>{i18n.t('token-deployer.step2.sidebar.multicall3')}</strong>
				{i18n.t('token-deployer.step2.sidebar.multicall3_desc')}
			</li>
			<li>
				<strong>{i18n.t('token-deployer.step2.sidebar.biubiu_premium')}</strong>
				{i18n.t('token-deployer.step2.sidebar.biubiu_premium_desc')}
			</li>
			<li>
				<strong>{i18n.t('token-deployer.step2.sidebar.token_factory')}</strong>
				{i18n.t('token-deployer.step2.sidebar.token_factory_desc')}
			</li>
		</ul>
	</div>
</DependencyCheckSidebar>

<style>
	/* Help Section */
	.help-section {
		border-top: 1px solid var(--color-border);
		padding-top: var(--space-6);
		margin-top: var(--space-4);
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
