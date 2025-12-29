<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import { fade } from 'svelte/transition';
	import {
		checkAllDependencies,
		calculateCheckSummary
	} from '@/features/nft-deployer/utils/dependency-checker';
	import ContractDeploymentModal from '$lib/components/ui/contract-deployment-modal.svelte';
	import { getDeploymentConfig } from '$lib/config/deployment-configs';
	import type { ContractDeploymentConfig } from '$lib/types/deployment-config';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import StepContent from '$lib/components/step/step-content.svelte';
	import EmptyState from '$lib/components/ui/empty-state.svelte';
	import BackButton from '$lib/components/ui/back-button.svelte';
	import LoadingState from '$lib/components/ui/loading-state.svelte';
	import SummaryBanner from '$lib/components/ui/summary-banner.svelte';
	import DependencyCheckCard from '$lib/components/ui/dependency-check-card.svelte';
	import { step2CheckDepsState } from '@/features/nft-deployer/stores/step2-check-deps-state.svelte';
	import { useI18n } from '@shelchin/i18n';

	const i18n = useI18n();
	const connectStore = useConnectStore();
	const stepManager = useStepManager();

	// Use $derived for easier access in template
	let checks = $derived(step2CheckDepsState.checks);
	let summary = $derived(step2CheckDepsState.summary);
	let isChecking = $derived(step2CheckDepsState.isChecking);
	let hasChecked = $derived(step2CheckDepsState.hasChecked);

	// Contract deployment modal state
	let showDeploymentModal = $state(false);
	let deploymentConfig = $state<ContractDeploymentConfig | null>(null);

	// Get current network details
	const currentNetwork = $derived(
		connectStore.currentChainId
			? connectStore.networks.find((n) => n.chainId === connectStore.currentChainId)
			: undefined
	);

	// Rechecking state for better UX
	let isRechecking = $state(false);

	// Run dependency checks
	async function runDependencyChecks(isRecheck = false) {
		if (!currentNetwork || !connectStore.isConnected) {
			console.log('[Step2] Cannot run checks - network or wallet not ready');
			return;
		}

		console.log('[Step2] Starting dependency checks for', currentNetwork.name);

		if (isRecheck && step2CheckDepsState.checks.length > 0) {
			// For recheck: keep cards in place, show loading state on each
			isRechecking = true;
			step2CheckDepsState.checks = step2CheckDepsState.checks.map((check) => ({
				...check,
				status: 'checking' as const
			}));
		} else {
			step2CheckDepsState.isChecking = true;
			step2CheckDepsState.hasChecked = false;
		}

		try {
			const results = await checkAllDependencies(
				currentNetwork?.rpcEndpoints?.[0]?.url ?? '',
				currentNetwork.chainId,
				currentNetwork.name,
				i18n.t.bind(i18n)
			);

			console.log('[Step2] Dependency check results:', results);

			// Update shared state - force new references for Svelte reactivity
			step2CheckDepsState.checks = [...results];

			// Force new object reference for summary
			const newSummary = calculateCheckSummary(results);
			step2CheckDepsState.summary = { ...newSummary };

			console.log('[Step2] Calculated summary:', step2CheckDepsState.summary);
			step2CheckDepsState.hasChecked = true;
		} catch (error) {
			console.error('[Step2] Failed to run dependency checks:', error);
		} finally {
			step2CheckDepsState.isChecking = false;
			isRechecking = false;
		}
	}

	// Auto-run checks when wallet is connected and network is selected
	$effect(() => {
		if (connectStore.isConnected && currentNetwork && !hasChecked) {
			runDependencyChecks();
		}
	});

	// Reset checks when network changes
	$effect(() => {
		if (connectStore.currentChainId) {
			step2CheckDepsState.hasChecked = false;
			step2CheckDepsState.checks = [];
			step2CheckDepsState.summary = null;
		}
	});

	// Go back to step 1
	function goBackToStep1() {
		stepManager.goTo(1);
	}

	// Find the first failed check index
	const firstFailedCheckIndex = $derived(() => {
		return checks.findIndex((check) => check.status === 'error');
	});

	// Check if a specific check can be fixed (only the first failed check)
	function canFixCheck(checkIndex: number): boolean {
		const firstFailedIdx = firstFailedCheckIndex();
		return firstFailedIdx === checkIndex;
	}
</script>

<StepContent>
	<StepContentHeader
		title={i18n.t('nft-deployer.step2.content.title')}
		description={i18n.t('nft-deployer.step2.content.description')}
	/>

	{#if isChecking}
		<!-- Checking State -->
		<LoadingState
			message={i18n.t('nft-deployer.step2.content.checking_dependencies_for', {
				network: currentNetwork?.name ?? ''
			})}
		/>
	{:else if !connectStore.isConnected}
		<!-- Not Connected State -->
		<EmptyState
			icon="🔌"
			title={i18n.t('nft-deployer.step2.content.wallet_not_connected_title')}
			message={i18n.t('nft-deployer.step2.content.wallet_not_connected_message')}
		>
			{#snippet action()}
				<BackButton onclick={goBackToStep1}>
					{i18n.t('nft-deployer.step2.content.go_to_step1')}
				</BackButton>
			{/snippet}
		</EmptyState>
	{:else if hasChecked && checks.length > 0}
		<!-- Check Results -->
		<div class="checks-container" in:fade={{ duration: 300 }}>
			{#each checks as check, index (check.id)}
				{@const canFix = canFixCheck(index)}
				{@const config =
					check.type === 'contract' && check.address
						? getDeploymentConfig(check.address as `0x${string}`)
						: null}
				<DependencyCheckCard
					{check}
					{index}
					{canFix}
					blockExplorer={currentNetwork?.blockExplorer}
					onDeploy={config && config.deployFunction
						? () => {
								deploymentConfig = config;
								showDeploymentModal = true;
							}
						: undefined}
					deployButtonText={config
						? i18n.t('nft-deployer.step2.content.deploy_contract', {
								contractName: config.contractName
							})
						: undefined}
					blockedHintText={i18n.t('nft-deployer.step2.content.resolve_previous_issue')}
					addressLabel={i18n.t('nft-deployer.step2.content.address_label')}
					endpointLabel={i18n.t('nft-deployer.step2.content.endpoint_label')}
					viewGuideText={i18n.t('nft-deployer.step2.content.view_deployment_guide')}
					deployComingSoonText={i18n.t('nft-deployer.step2.content.deploy_coming_soon')}
					categoryLabels={{
						network: i18n.t('nft-deployer.step2.content.checks.category.network'),
						protocol: i18n.t('nft-deployer.step2.content.checks.category.protocol'),
						contract: i18n.t('nft-deployer.step2.content.checks.category.contract')
					}}
				/>
			{/each}
		</div>

		<!-- Summary and Continue -->
		{#if summary}
			<SummaryBanner
				retryText={i18n.t('nft-deployer.step2.content.recheck_dependencies')}
				isLoading={isRechecking}
				onRetry={() => runDependencyChecks(true)}
			/>
		{/if}
	{/if}
</StepContent>

<!-- Generic Contract Deployment Modal -->
{#if currentNetwork && deploymentConfig}
	<ContractDeploymentModal
		bind:show={showDeploymentModal}
		config={deploymentConfig}
		chainId={currentNetwork.chainId}
		networkName={currentNetwork.name}
		rpcUrl={currentNetwork.rpcEndpoints[0].url}
		blockExplorer={currentNetwork.blockExplorer}
		onClose={() => {
			showDeploymentModal = false;
			deploymentConfig = null;
		}}
		onSuccess={() => {
			console.log('[Step2] Deployment successful, re-checking dependencies');
			// Don't close modal automatically - let user close it manually
			// Re-run dependency checks after successful deployment
			setTimeout(() => {
				console.log('[Step2] Re-running dependency checks after deployment');
				runDependencyChecks();
			}, 500);
		}}
	/>
{/if}

<style>
	/* Check Cards */
	.checks-container {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		margin-bottom: var(--space-6);
	}
</style>
