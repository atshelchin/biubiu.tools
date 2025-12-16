<script lang="ts">
	// Stores & Context
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import { step2State } from '@/features/wallet-sweep/stores/step2-state.svelte';

	// i18n
	import { useI18n } from '@shelchin/i18n/svelte';

	// Components
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import StepContent from '$lib/components/step/step-content.svelte';
	import EmptyState from '@/features/wallet-sweep/ui/components/empty-state.svelte';
	import BackButton from '$lib/components/ui/back-button.svelte';
	import DependencyChecker, {
		createDependencyChecker
	} from '$lib/components/ui/dependency-checker.svelte';
	import NetworkSettingsModal from '$lib/components/ui/network-settings-modal.svelte';

	// Utils
	import { checkAllDependencies } from '@/features/wallet-sweep/utils/dependency-checker';

	// ============================================================================
	// STORES & CONTEXT
	// ============================================================================

	const i18n = useI18n();
	const connectStore = useConnectStore();
	const stepManager = useStepManager();

	// ============================================================================
	// DEPENDENCY CHECKER
	// ============================================================================

	const checker = createDependencyChecker();

	// ============================================================================
	// STATE
	// ============================================================================

	let showNetworkSettings = $state(false);

	// ============================================================================
	// DERIVED
	// ============================================================================

	const currentNetwork = $derived(
		connectStore.currentChainId
			? connectStore.networks.find((n) => n.chainId === connectStore.currentChainId)
			: undefined
	);

	const networkConfig = $derived(
		currentNetwork
			? {
					chainId: currentNetwork.chainId,
					name: currentNetwork.name,
					rpcUrl: currentNetwork?.rpcEndpoints?.[0]?.url ?? '',
					blockExplorer: currentNetwork.blockExplorer
				}
			: undefined
	);

	// ============================================================================
	// FUNCTIONS
	// ============================================================================

	function createChecker() {
		if (!currentNetwork) return () => Promise.resolve([]);

		return () =>
			checkAllDependencies(
				currentNetwork?.rpcEndpoints?.[0]?.url ?? '',
				currentNetwork.chainId,
				currentNetwork.name,
				i18n.t.bind(i18n),
				undefined, // membershipContract
				undefined // sweepContract
			);
	}

	function goBackToStep1() {
		stepManager.goTo(1);
	}

	function handleDeploySuccess() {
		// Re-run dependency checks after successful deployment
		setTimeout(() => checker.runChecks(createChecker()), 500);
	}

	function handleConfigureRpc() {
		showNetworkSettings = true;
	}

	function handleNetworkSettingsClose() {
		showNetworkSettings = false;
		// Re-run dependency checks after closing settings (user may have added RPC)
		setTimeout(() => {
			checker.reset();
			checker.runChecks(createChecker());
		}, 300);
	}

	// ============================================================================
	// EFFECTS
	// ============================================================================

	// Auto-run checks when wallet is connected and network is selected
	$effect(() => {
		if (connectStore.isConnected && currentNetwork && !checker.hasChecked) {
			// Store the checker factory for later recheck
			checker.setCheckerFactory(createChecker);
			checker.runChecks(createChecker());
		}
	});

	// Reset checks when network changes
	$effect(() => {
		if (connectStore.currentChainId) {
			checker.reset();
		}
	});

	// Sync checker state to step2State for sidebar/footer access
	$effect(() => {
		step2State.checks = checker.checks;
		step2State.summary = checker.summary;
		step2State.isChecking = checker.isChecking;
		step2State.hasChecked = checker.hasChecked;
	});
</script>

<StepContent>
	<StepContentHeader
		title={i18n.t('tools.wallet_sweep.step2.content.title')}
		description={i18n.t('tools.wallet_sweep.step2.content.description')}
	/>

	{#if !connectStore.isConnected && !checker.isChecking}
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
	{:else}
		<DependencyChecker
			{checker}
			network={networkConfig}
			loadingMessage={i18n.t('tools.wallet_sweep.step2.content.checking_dependencies_for', {
				network: currentNetwork?.name ?? ''
			})}
			retryText={i18n.t('tools.wallet_sweep.step2.content.recheck_dependencies')}
			allPassedTitle={i18n.t('tools.wallet_sweep.step2.content.all_dependencies_satisfied')}
			allPassedMessage={i18n.t('tools.wallet_sweep.step2.content.network_properly_configured')}
			issuesFoundTitle={i18n.t('tools.wallet_sweep.step2.content.dependency_issues_found')}
			issuesFoundMessage={i18n.t(
				'tools.wallet_sweep.step2.content.resolve_issues_before_continuing'
			)}
			resolveHintText={i18n.t('tools.wallet_sweep.step2.content.resolve_previous_issue')}
			addressLabel={i18n.t('tools.wallet_sweep.step2.content.address_label')}
			endpointLabel={i18n.t('tools.wallet_sweep.step2.content.endpoint_label')}
			viewGuideText={i18n.t('tools.wallet_sweep.step2.content.view_deployment_guide')}
			deployComingSoonText={i18n.t('tools.wallet_sweep.step2.content.deploy_coming_soon')}
			configureRpcButtonText={i18n.t(
				'tools.wallet_sweep.step2.content.checks.rpc_endpoint.configure_rpc_button'
			)}
			deployButtonText={(contractName) =>
				i18n.t('tools.wallet_sweep.step2.content.deploy_contract', { contractName })}
			categoryLabels={{
				network: i18n.t('tools.wallet_sweep.step2.content.checks.category.network'),
				protocol: i18n.t('tools.wallet_sweep.step2.content.checks.category.protocol'),
				contract: i18n.t('tools.wallet_sweep.step2.content.checks.category.contract')
			}}
			onDeploySuccess={handleDeploySuccess}
			onConfigureRpc={handleConfigureRpc}
		/>
	{/if}
</StepContent>

<!-- Network Settings Modal -->
{#if showNetworkSettings && currentNetwork}
	<NetworkSettingsModal
		open={showNetworkSettings}
		networks={connectStore.networks}
		currentChainId={connectStore.currentChainId ?? undefined}
		initialEditChainId={currentNetwork.chainId}
		onClose={handleNetworkSettingsClose}
		onToggleNetwork={(chainId, enabled) => connectStore.toggleNetwork(chainId, enabled)}
		isNetworkEnabled={(chainId) => connectStore.isNetworkEnabled(chainId)}
		onSaveNetwork={(chainId, rpcEndpoints, blockExplorer) =>
			connectStore.updateNetworkRpc(chainId, rpcEndpoints, blockExplorer)}
		onAddOrUpdateNetwork={(network) => connectStore.addOrUpdateNetwork(network)}
	/>
{/if}
