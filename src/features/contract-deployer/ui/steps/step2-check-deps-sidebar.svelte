<script lang="ts">
	/**
	 * Contract Deployer Step 2: Dependency Check Sidebar
	 * Uses shared DependencyCheckSidebar component with custom help section
	 */
	import { DependencyCheckSidebar } from '$lib/components/step/dependency-check';
	import { step2State } from '@/features/contract-deployer/stores/step2-state.svelte';
	import { useI18n } from '@shelchin/i18n';

	const i18n = useI18n();

	// Use $derived to get reactive value from step2State
	const summary = $derived(step2State.summary);
</script>

<DependencyCheckSidebar {summary}>
	<div class="help-section">
		<h3>{i18n.t('contract-deployer.step2.sidebar.title')}</h3>
		<p>{i18n.t('contract-deployer.step2.sidebar.description')}</p>

		<div class="required-contracts">
			<h4>{i18n.t('contract-deployer.step2.sidebar.required_contracts')}</h4>
			<ul>
				<li>
					<strong>CREATE2 Proxy</strong>
					<code>0x4e59b44847b379578588920cA78FbF26c0B4956C</code>
				</li>
			</ul>
		</div>
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
	}

	.help-section p {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		line-height: 1.6;
		margin-bottom: var(--space-4);
	}

	.required-contracts {
		margin-top: var(--space-4);
		padding: var(--space-4);
		background: var(--color-panel-1);
		border-radius: var(--border-radius-md);
	}

	.required-contracts h4 {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin-bottom: var(--space-3);
	}

	.required-contracts ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.required-contracts li {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.required-contracts li strong {
		color: var(--color-text-primary);
		font-weight: var(--font-semibold);
	}

	.required-contracts code {
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		background: var(--color-panel-2);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--border-radius-sm);
		word-break: break-all;
	}
</style>
