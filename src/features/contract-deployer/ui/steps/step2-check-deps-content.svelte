<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte.js';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import StepContent from '$lib/components/step/step-content.svelte';
	import { useI18n } from '@shelchin/i18n/svelte';
	import { checkAllDependencies, type DependencyCheckResult } from '../../utils/dependency-checker';
	import { CircleCheckBig, CircleX } from '@lucide/svelte';

	const connectStore = useConnectStore();
	const i18n = useI18n();

	let isChecking = $state(false);
	let dependencies = $state<DependencyCheckResult[]>([]);
	let hasChecked = $state(false);

	const allPassed = $derived(
		hasChecked && dependencies.length > 0 && dependencies.every((d) => d.exists)
	);

	async function handleCheck() {
		if (!connectStore.publicClient) {
			return;
		}

		isChecking = true;
		try {
			const results = await checkAllDependencies(connectStore.publicClient);
			dependencies = results;
			hasChecked = true;
		} catch (error) {
			console.error('Failed to check dependencies:', error);
		} finally {
			isChecking = false;
		}
	}

	// Auto-check when component mounts
	$effect(() => {
		if (connectStore.publicClient && !hasChecked && !isChecking) {
			handleCheck();
		}
	});

	// Export check result for footer
	export function getCheckResult() {
		return { allPassed, hasChecked };
	}
</script>

<StepContent>
	<StepContentHeader
		title={i18n.t('tools.contract_deployer.step2.content.title')}
		description={i18n.t('tools.contract_deployer.step2.content.description')}
	/>

	<div class="dependencies-container">
		{#if isChecking}
			<div class="checking-state">
				<div class="spinner"></div>
				<p>{i18n.t('tools.contract_deployer.step2.content.checking')}</p>
			</div>
		{:else if hasChecked}
			<div class="dependencies-list">
				{#each dependencies as dep (dep.address)}
					<div class="dependency-item" class:passed={dep.exists} class:failed={!dep.exists}>
						<div class="dependency-icon">
							{#if dep.exists}
								<CircleCheckBig size={24} strokeWidth={2} />
							{:else}
								<CircleX size={24} strokeWidth={2} />
							{/if}
						</div>
						<div class="dependency-info">
							<h4>{dep.name}</h4>
							<code class="address">{dep.address}</code>
							{#if dep.error}
								<p class="error-message">{dep.error}</p>
							{/if}
						</div>
						<div class="dependency-status">
							{#if dep.exists}
								<span class="status-badge success">
									{i18n.t('tools.contract_deployer.step2.content.available')}
								</span>
							{:else}
								<span class="status-badge error">
									{i18n.t('tools.contract_deployer.step2.content.not_available')}
								</span>
							{/if}
						</div>
					</div>
				{/each}
			</div>

			{#if allPassed}
				<div class="success-message">
					<CircleCheckBig size={20} strokeWidth={2} />
					<p>{i18n.t('tools.contract_deployer.step2.content.all_passed')}</p>
				</div>
			{:else}
				<div class="error-message-box">
					<CircleX size={20} strokeWidth={2} />
					<p>{i18n.t('tools.contract_deployer.step2.content.some_failed')}</p>
				</div>
			{/if}
		{:else}
			<button type="button" class="check-button" onclick={handleCheck}>
				{i18n.t('tools.contract_deployer.step2.content.check_button')}
			</button>
		{/if}
	</div>
</StepContent>

<style>
	.dependencies-container {
		margin-top: var(--space-6);
	}

	.checking-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-8);
		background: var(--color-panel-1);
		border-radius: var(--border-radius-lg);
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 4px solid var(--color-border);
		border-top-color: var(--color-primary);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.dependencies-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.dependency-item {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-4);
		background: var(--color-panel-1);
		border-radius: var(--border-radius-md);
		border: 2px solid var(--color-border);
	}

	.dependency-item.passed {
		border-color: var(--color-success);
	}

	.dependency-item.failed {
		border-color: var(--color-error);
	}

	.dependency-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-text-secondary);
	}

	.dependency-item.passed .dependency-icon {
		color: var(--color-success);
	}

	.dependency-item.failed .dependency-icon {
		color: var(--color-error);
	}

	.dependency-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.dependency-info h4 {
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
		margin: 0;
	}

	.dependency-info .address {
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		color: var(--color-text-secondary);
		background: var(--color-panel-2);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--border-radius-sm);
		display: inline-block;
		word-break: break-all;
	}

	.error-message {
		font-size: var(--font-size-xs);
		color: var(--color-error);
		margin: 0;
	}

	.dependency-status {
		display: flex;
		align-items: center;
	}

	.status-badge {
		padding: var(--space-1) var(--space-3);
		border-radius: var(--border-radius-full);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-medium);
	}

	.status-badge.success {
		background: var(--color-success-bg);
		color: var(--color-success);
	}

	.status-badge.error {
		background: var(--color-error-bg);
		color: var(--color-error);
	}

	.success-message,
	.error-message-box {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-4);
		border-radius: var(--border-radius-md);
		margin-top: var(--space-4);
	}

	.success-message {
		background: var(--color-success-bg);
		color: var(--color-success);
	}

	.error-message-box {
		background: var(--color-error-bg);
		color: var(--color-error);
	}

	.success-message p,
	.error-message-box p {
		margin: 0;
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
	}

	.check-button {
		padding: var(--space-3) var(--space-6);
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: var(--border-radius-md);
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-medium);
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.check-button:hover {
		background: var(--color-primary-hover);
	}
</style>
