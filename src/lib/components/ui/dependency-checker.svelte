<script module lang="ts">
	import type { DependencyCheck, DependencyCheckSummary } from '$lib/utils/blockchain-checker';

	export { type DependencyCheck, type DependencyCheckSummary };

	/**
	 * Create a dependency checker instance
	 * Manages state for dependency checking workflow
	 */
	export function createDependencyChecker() {
		let checks = $state<DependencyCheck[]>([]);
		let summary = $state<DependencyCheckSummary | null>(null);
		let isChecking = $state(false);
		let hasChecked = $state(false);

		async function runChecks(checker: () => Promise<DependencyCheck[]>) {
			isChecking = true;
			hasChecked = false;

			try {
				const results = await checker();
				checks = [...results];

				// Calculate summary
				const total = results.length;
				const passed = results.filter((c) => c.status === 'success').length;
				const warnings = results.filter((c) => c.status === 'warning').length;
				const failed = results.filter((c) => c.status === 'error').length;

				summary = {
					total,
					passed,
					warnings,
					failed,
					allPassed: failed === 0
				};

				hasChecked = true;
			} catch {
				// Silently handle errors - checks will show as incomplete
			} finally {
				isChecking = false;
			}
		}

		function reset() {
			checks = [];
			summary = null;
			hasChecked = false;
			isChecking = false;
		}

		return {
			// Readonly state getters
			get checks() {
				return checks;
			},
			get summary() {
				return summary;
			},
			get isChecking() {
				return isChecking;
			},
			get hasChecked() {
				return hasChecked;
			},
			get allPassed() {
				return summary?.allPassed ?? false;
			},

			// API
			runChecks,
			reset
		};
	}

	export type DependencyCheckerInstance = ReturnType<typeof createDependencyChecker>;
</script>

<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { Snippet } from 'svelte';

	// Components
	import ContractDeploymentModal from '$lib/components/ui/contract-deployment-modal.svelte';
	import LoadingState from '$lib/components/ui/loading-state.svelte';
	import SummaryBanner from '$lib/components/ui/summary-banner.svelte';
	import DependencyCheckCard from '$lib/components/ui/dependency-check-card.svelte';

	// Utils
	import { getDeploymentConfig } from '$lib/config/deployment-configs';

	// Types
	import type { ContractDeploymentConfig } from '$lib/types/deployment-config';

	// ============================================================================
	// PROPS
	// ============================================================================

	interface Props {
		// Required: checker instance from createDependencyChecker()
		checker: DependencyCheckerInstance;

		// Required: current network info for deployment modal
		network?: {
			chainId: number;
			name: string;
			rpcUrl: string;
			blockExplorer?: string;
		};

		// i18n texts
		loadingMessage?: string;
		retryText?: string;
		allPassedTitle?: string;
		allPassedMessage?: string;
		issuesFoundTitle?: string;
		issuesFoundMessage?: string;
		resolveHintText?: string;
		addressLabel?: string;
		endpointLabel?: string;
		viewGuideText?: string;
		deployComingSoonText?: string;
		categoryLabels?: {
			network: string;
			protocol: string;
			contract: string;
		};

		// Deploy button text factory
		deployButtonText?: (contractName: string) => string;

		// Callbacks
		onDeploySuccess?: () => void;

		// Slots
		empty?: Snippet;
	}

	let {
		checker,
		network,
		loadingMessage = 'Checking dependencies...',
		retryText = 'Recheck',
		allPassedTitle = 'All dependencies satisfied',
		allPassedMessage = 'Network is properly configured',
		issuesFoundTitle = 'Dependency issues found',
		issuesFoundMessage = 'Please resolve the issues before continuing',
		resolveHintText = 'Please resolve the previous issue first',
		addressLabel = 'Address',
		endpointLabel = 'Endpoint',
		viewGuideText = 'View deployment guide',
		deployComingSoonText = 'Deploy coming soon',
		categoryLabels = {
			network: 'Network',
			protocol: 'Protocol',
			contract: 'Contract'
		},
		deployButtonText = (name: string) => `Deploy ${name}`,
		onDeploySuccess,
		empty
	}: Props = $props();

	// ============================================================================
	// STATE
	// ============================================================================

	let showDeploymentModal = $state(false);
	let deploymentConfig = $state<ContractDeploymentConfig | null>(null);

	// ============================================================================
	// DERIVED
	// ============================================================================

	let summaryVariant = $derived<'success' | 'error'>(
		checker.summary?.allPassed ? 'success' : 'error'
	);
	let summaryTitle = $derived(checker.summary?.allPassed ? allPassedTitle : issuesFoundTitle);
	let summaryMessage = $derived(checker.summary?.allPassed ? allPassedMessage : issuesFoundMessage);

	// Find first failed check index (for sequential fix flow)
	const firstFailedCheckIndex = $derived(() => {
		return checker.checks.findIndex((check) => check.status === 'error');
	});

	// ============================================================================
	// FUNCTIONS
	// ============================================================================

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
		onDeploySuccess?.();
	}
</script>

{#if checker.isChecking}
	<LoadingState message={loadingMessage} />
{:else if !checker.hasChecked && empty}
	{@render empty()}
{:else if checker.hasChecked && checker.checks.length > 0}
	<!-- Check Results -->
	<div class="checks-container" in:fade={{ duration: 300 }}>
		{#each checker.checks as check, index (check.id)}
			{@const canFix = canFixCheck(index)}
			{@const config =
				check.type === 'contract' && check.address
					? getDeploymentConfig(check.address as `0x${string}`)
					: null}
			<DependencyCheckCard
				{check}
				{index}
				{canFix}
				blockExplorer={network?.blockExplorer}
				onDeploy={config?.deployFunction ? () => openDeploymentModal(config) : undefined}
				deployButtonText={config ? deployButtonText(config.contractName) : undefined}
				blockedHintText={resolveHintText}
				{addressLabel}
				{endpointLabel}
				{viewGuideText}
				{deployComingSoonText}
				{categoryLabels}
			/>
		{/each}
	</div>

	<!-- Summary Banner -->
	{#if checker.summary}
		<SummaryBanner
			variant={summaryVariant}
			title={summaryTitle}
			message={summaryMessage}
			{retryText}
			onRetry={() => checker.runChecks(() => Promise.resolve(checker.checks))}
		/>
	{/if}
{/if}

<!-- Contract Deployment Modal -->
{#if network && deploymentConfig}
	<ContractDeploymentModal
		bind:show={showDeploymentModal}
		config={deploymentConfig}
		chainId={network.chainId}
		networkName={network.name}
		rpcUrl={network.rpcUrl}
		blockExplorer={network.blockExplorer}
		onClose={closeDeploymentModal}
		onSuccess={handleDeploymentSuccess}
	/>
{/if}

<style>
	.checks-container {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		margin-bottom: var(--space-6);
	}
</style>
