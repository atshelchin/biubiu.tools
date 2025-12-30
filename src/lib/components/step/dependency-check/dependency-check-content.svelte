<script lang="ts">
	/**
	 * Shared Step 2 Dependency Check Content Component.
	 *
	 * This component provides the dependency checking UI used by step-based tools
	 * that need to verify blockchain dependencies before proceeding.
	 *
	 * @example
	 * ```svelte
	 * <DependencyCheckContent
	 *   i18nPrefix="routes/apps/token-balance-scanner"
	 *   checkDependencies={(network, t) => checkAllDependencies(network, t)}
	 *   onStateChange={(state) => { step2State.checks = state.checks; }}
	 * />
	 * ```
	 */
	import type { DependencyCheck } from '$lib/utils/blockchain-checker';

	// Stores & Context
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import { useStepManager } from '$lib/components/ui/step-context.svelte';

	// i18n
	import { useI18n, type TranslationKeys } from '@shelchin/i18n';
	import { untrack } from 'svelte';

	// Components
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import StepContent from '$lib/components/step/step-content.svelte';
	import EmptyState from '$lib/components/ui/empty-state.svelte';
	import BackButton from '$lib/components/ui/back-button.svelte';
	import DependencyChecker, {
		createDependencyChecker
	} from '$lib/components/ui/dependency-checker.svelte';
	import NetworkSettingsModal from '$lib/components/ui/network-settings-modal.svelte';

	interface Props {
		/** i18n prefix for this tool (e.g., 'token-balance-scanner', 'wallet-sweep') */
		i18nPrefix: string;
		/**
		 * Function to check dependencies for the current network.
		 * @param rpcUrl - The RPC URL to use for checks
		 * @param chainId - The chain ID
		 * @param networkName - Human-readable network name
		 * @param t - Translation function
		 * @returns Promise resolving to dependency check results
		 */
		checkDependencies: (
			rpcUrl: string,
			chainId: number,
			networkName: string,
			t: (key: string, params?: Record<string, unknown>) => string
		) => Promise<DependencyCheck[]>;
		/**
		 * Optional callback when state changes, for syncing to external state store.
		 */
		onStateChange?: (state: {
			checks: DependencyCheck[];
			summary: {
				allPassed: boolean;
				passed: number;
				failed: number;
				warnings: number;
				total: number;
			} | null;
			isChecking: boolean;
			hasChecked: boolean;
		}) => void;
	}

	let { i18nPrefix, checkDependencies, onStateChange }: Props = $props();

	// ============================================================================
	// STORES & CONTEXT
	// ============================================================================

	const i18n = useI18n();

	// Helper to translate dynamic keys with type assertion
	function t(key: string, params?: Record<string, unknown>): string {
		return i18n.t(key as keyof TranslationKeys, params as Record<string, string | number | Date>);
	}
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
			checkDependencies(
				currentNetwork?.rpcEndpoints?.[0]?.url ?? '',
				currentNetwork.chainId,
				currentNetwork.name,
				t
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

	// Track the chain ID that we're currently checking or have checked
	let checkedForChainId = $state<number | null>(null);

	// Effect: Auto-run checks when wallet is connected and network is selected
	// Uses checkedForChainId to prevent re-running for the same network
	$effect(() => {
		const chainId = connectStore.currentChainId;
		const isConnected = connectStore.isConnected;
		const network = currentNetwork;

		// Skip if no chain selected
		if (!chainId || !isConnected || !network) {
			return;
		}

		// If this is a different chain than we've checked, reset and run
		if (chainId !== checkedForChainId) {
			// Update tracking FIRST to prevent re-triggering
			checkedForChainId = chainId;
			// Reset previous results
			checker.reset();
			// Run new checks
			checker.setCheckerFactory(createChecker);
			checker.runChecks(createChecker());
		}
	});

	// Sync checker state via callback
	// Use untrack for the callback to prevent infinite loops
	$effect(() => {
		// Read values to track dependencies
		const currentChecks = checker.checks;
		const currentSummary = checker.summary;
		const currentIsChecking = checker.isChecking;
		const currentHasChecked = checker.hasChecked;

		// Call onStateChange without tracking to prevent loops
		untrack(() => {
			onStateChange?.({
				checks: currentChecks,
				summary: currentSummary,
				isChecking: currentIsChecking,
				hasChecked: currentHasChecked
			});
		});
	});
</script>

<StepContent>
	<StepContentHeader
		title={t(`${i18nPrefix}.step2.content.title`)}
		description={t(`${i18nPrefix}.step2.content.description`)}
	/>

	{#if !connectStore.isConnected && !checker.isChecking}
		<!-- Not Connected State -->
		<EmptyState
			icon="🔌"
			title={t(`${i18nPrefix}.step2.content.wallet_not_connected_title`)}
			message={t(`${i18nPrefix}.step2.content.wallet_not_connected_message`)}
		>
			{#snippet action()}
				<BackButton onclick={goBackToStep1}>
					{t(`${i18nPrefix}.step2.content.go_to_step1`)}
				</BackButton>
			{/snippet}
		</EmptyState>
	{:else}
		<DependencyChecker
			{checker}
			network={networkConfig}
			loadingMessage={t(`${i18nPrefix}.step2.content.checking_dependencies_for`, {
				network: currentNetwork?.name ?? ''
			})}
			retryText={t(`${i18nPrefix}.step2.content.recheck_dependencies`)}
			allPassedTitle={t(`${i18nPrefix}.step2.content.all_dependencies_satisfied`)}
			allPassedMessage={t(`${i18nPrefix}.step2.content.network_properly_configured`)}
			issuesFoundTitle={t(`${i18nPrefix}.step2.content.dependency_issues_found`)}
			issuesFoundMessage={t(`${i18nPrefix}.step2.content.resolve_issues_before_continuing`)}
			resolveHintText={t(`${i18nPrefix}.step2.content.resolve_previous_issue`)}
			addressLabel={t(`${i18nPrefix}.step2.content.address_label`)}
			endpointLabel={t(`${i18nPrefix}.step2.content.endpoint_label`)}
			viewGuideText={t(`${i18nPrefix}.step2.content.view_deployment_guide`)}
			deployComingSoonText={t(`${i18nPrefix}.step2.content.deploy_coming_soon`)}
			configureRpcButtonText={t(
				`${i18nPrefix}.step2.content.checks.rpc_endpoint.configure_rpc_button`
			)}
			deployButtonText={(contractName) =>
				t(`${i18nPrefix}.step2.content.deploy_contract`, { contractName })}
			categoryLabels={{
				network: t(`${i18nPrefix}.step2.content.checks.category.network`),
				protocol: t(`${i18nPrefix}.step2.content.checks.category.protocol`),
				contract: t(`${i18nPrefix}.step2.content.checks.category.contract`)
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
