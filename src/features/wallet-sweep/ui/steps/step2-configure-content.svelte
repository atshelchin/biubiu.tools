<script lang="ts">
	// ============================================================================
	// IMPORTS
	// ============================================================================

	// Svelte
	import { fade } from 'svelte/transition';

	// Stores & Context
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import { step2State } from '@/features/wallet-sweep/stores/step2-state.svelte';

	// i18n
	import { useI18n } from '@shelchin/i18n/svelte';

	// Components
	import ContractDeploymentModal from '$lib/components/ui/contract-deployment-modal.svelte';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import StepContent from '$lib/components/step/step-content.svelte';
	import EmptyState from '@/features/wallet-sweep/ui/components/empty-state.svelte';
	import BackButton from '$lib/components/ui/back-button.svelte';
	import LoadingState from '$lib/components/ui/loading-state.svelte';
	import SummaryBanner from '$lib/components/ui/summary-banner.svelte';
	import DependencyCheckCard from '$lib/components/ui/dependency-check-card.svelte';

	// Utils & Config
	import {
		checkAllDependencies,
		calculateCheckSummary
	} from '@/features/wallet-sweep/utils/dependency-checker';
	import { getDeploymentConfig } from '$lib/config/deployment-configs';

	// Types
	import type { ContractDeploymentConfig } from '$lib/types/deployment-config';

	// ============================================================================
	// STORES & CONTEXT
	// ============================================================================

	const i18n = useI18n();
	const connectStore = useConnectStore();
	const stepManager = useStepManager();

	// ============================================================================
	// STATE
	// ============================================================================

	let showDeploymentModal = $state(false);
	let deploymentConfig = $state<ContractDeploymentConfig | null>(null);

	// ============================================================================
	// DERIVED
	// ============================================================================

	// Step2 state shortcuts
	let checks = $derived(step2State.checks);
	let summary = $derived(step2State.summary);
	let isChecking = $derived(step2State.isChecking);
	let hasChecked = $derived(step2State.hasChecked);

	// Network
	const currentNetwork = $derived(
		connectStore.currentChainId
			? connectStore.networks.find((n) => n.chainId === connectStore.currentChainId)
			: undefined
	);

	// Summary display properties
	let summaryVariant = $derived<'success' | 'error'>(summary?.allPassed ? 'success' : 'error');
	let summaryTitle = $derived(
		summary?.allPassed
			? i18n.t('tools.wallet_sweep.step2.content.all_dependencies_satisfied')
			: i18n.t('tools.wallet_sweep.step2.content.dependency_issues_found')
	);
	let summaryMessage = $derived(
		summary?.allPassed
			? i18n.t('tools.wallet_sweep.step2.content.network_properly_configured')
			: i18n.t('tools.wallet_sweep.step2.content.resolve_issues_before_continuing')
	);

	// Find the first failed check index (for sequential fix flow)
	const firstFailedCheckIndex = $derived(() => {
		return checks.findIndex((check) => check.status === 'error');
	});

	// ============================================================================
	// FUNCTIONS
	// ============================================================================

	async function runDependencyChecks() {
		if (!currentNetwork || !connectStore.isConnected) {
			return;
		}

		step2State.isChecking = true;
		step2State.hasChecked = false;

		try {
			const membershipContract = undefined;
			const sweepContract = undefined;

			const results = await checkAllDependencies(
				currentNetwork.rpcEndpoints[0].url,
				currentNetwork.chainId,
				currentNetwork.name,
				i18n.t.bind(i18n),
				membershipContract,
				sweepContract
			);

			// Update shared state - force new references for Svelte reactivity
			step2State.checks = [...results];
			step2State.summary = { ...calculateCheckSummary(results) };
			step2State.hasChecked = true;
		} catch {
			// Silently handle errors - checks will show as incomplete
		} finally {
			step2State.isChecking = false;
		}
	}

	function goBackToStep1() {
		stepManager.goTo(1);
	}

	function canFixCheck(checkIndex: number): boolean {
		return firstFailedCheckIndex() === checkIndex;
	}

	function openDeploymentModal(config: ContractDeploymentConfig) {
		deploymentConfig = config;
		showDeploymentModal = true;
	}

	function closeDeploymentModal() {
		showDeploymentModal = false;
		deploymentConfig = null;
	}

	function handleDeploymentSuccess() {
		// Re-run dependency checks after successful deployment
		setTimeout(() => runDependencyChecks(), 500);
	}

	// ============================================================================
	// EFFECTS
	// ============================================================================

	// Auto-run checks when wallet is connected and network is selected
	$effect(() => {
		if (connectStore.isConnected && currentNetwork && !hasChecked) {
			runDependencyChecks();
		}
	});

	// Reset checks when network changes
	$effect(() => {
		if (connectStore.currentChainId) {
			step2State.hasChecked = false;
			step2State.checks = [];
			step2State.summary = null;
		}
	});
</script>

<StepContent>
	<StepContentHeader
		title={i18n.t('tools.wallet_sweep.step2.content.title')}
		description={i18n.t('tools.wallet_sweep.step2.content.description')}
	/>

	{#if isChecking}
		<!-- Checking State -->
		<LoadingState
			message={i18n.t('tools.wallet_sweep.step2.content.checking_dependencies_for', {
				network: currentNetwork?.name ?? ''
			})}
		/>
	{:else if !connectStore.isConnected}
		<!-- Not Connected State -->
		<EmptyState
			icon="🔌"
			title={i18n.t('tools.wallet_sweep.step2.content.wallet_not_connected_title')}
			message={i18n.t('tools.wallet_sweep.step2.content.wallet_not_connected_message')}
		>
			{#snippet action()}
				<BackButton onclick={goBackToStep1}>
					{i18n.t('tools.wallet_sweep.step2.content.go_to_step1')}
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
					onDeploy={config?.deployFunction ? () => openDeploymentModal(config) : undefined}
					deployButtonText={config
						? i18n.t('tools.wallet_sweep.step2.content.deploy_contract', {
								contractName: config.contractName
							})
						: undefined}
					blockedHintText={i18n.t('tools.wallet_sweep.step2.content.resolve_previous_issue')}
					addressLabel={i18n.t('tools.wallet_sweep.step2.content.address_label')}
					endpointLabel={i18n.t('tools.wallet_sweep.step2.content.endpoint_label')}
					viewGuideText={i18n.t('tools.wallet_sweep.step2.content.view_deployment_guide')}
					deployComingSoonText={i18n.t('tools.wallet_sweep.step2.content.deploy_coming_soon')}
				/>
			{/each}
		</div>

		<!-- Summary and Continue -->
		{#if summary}
			<SummaryBanner
				variant={summaryVariant}
				title={summaryTitle}
				message={summaryMessage}
				retryText={i18n.t('tools.wallet_sweep.step2.content.recheck_dependencies')}
				onRetry={runDependencyChecks}
			/>
		{/if}
	{/if}
</StepContent>

<!-- Contract Deployment Modal -->
{#if currentNetwork && deploymentConfig}
	<ContractDeploymentModal
		bind:show={showDeploymentModal}
		config={deploymentConfig}
		chainId={currentNetwork.chainId}
		networkName={currentNetwork.name}
		rpcUrl={currentNetwork.rpcEndpoints[0].url}
		blockExplorer={currentNetwork.blockExplorer}
		onClose={closeDeploymentModal}
		onSuccess={handleDeploymentSuccess}
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
