<script module lang="ts">
	import type {
		DependencyCheck as ImportedDependencyCheck,
		DependencyCheckSummary as ImportedDependencyCheckSummary
	} from '$lib/utils/blockchain-checker';

	export type DependencyCheck = ImportedDependencyCheck;
	export type DependencyCheckSummary = ImportedDependencyCheckSummary;

	/**
	 * Checker factory type - returns a function that performs all dependency checks
	 */
	export type CheckerFactory = () => () => Promise<DependencyCheck[]>;

	/**
	 * Create a dependency checker instance
	 * Manages state for dependency checking workflow
	 */
	export function createDependencyChecker() {
		let checks = $state<DependencyCheck[]>([]);
		let summary = $state<DependencyCheckSummary | null>(null);
		let isChecking = $state(false);
		let hasChecked = $state(false);
		let isRechecking = $state(false);

		// Store the checker factory for recheck
		let storedCheckerFactory: CheckerFactory | null = null;

		async function runChecks(checker: () => Promise<DependencyCheck[]>) {
			isChecking = true;
			hasChecked = false;

			try {
				const results = await checker();
				checks = [...results];

				// Calculate summary
				updateSummary();

				hasChecked = true;
			} catch {
				// Silently handle errors - checks will show as incomplete
			} finally {
				isChecking = false;
			}
		}

		/**
		 * Set the checker factory for later use in recheckAll
		 */
		function setCheckerFactory(factory: CheckerFactory) {
			storedCheckerFactory = factory;
		}

		/**
		 * Recheck all dependencies
		 * Sets all cards to 'checking' status first, then re-runs all checks
		 * This provides a smooth visual experience with cards staying in place
		 */
		async function recheckAll() {
			if (!storedCheckerFactory || checks.length === 0) return;

			isRechecking = true;

			// Set all checks to 'checking' status while preserving other data
			checks = checks.map((check) => ({ ...check, status: 'checking' as const }));

			try {
				const checker = storedCheckerFactory();
				const results = await checker();
				checks = [...results];

				// Recalculate summary
				updateSummary();
			} catch {
				// On error, restore checks to error state
				checks = checks.map((check) => ({
					...check,
					status: 'error' as const,
					message: 'Recheck failed'
				}));
			} finally {
				isRechecking = false;
			}
		}

		/**
		 * Recheck a single dependency by its ID
		 * Only updates that specific check, keeping others intact
		 * This provides better UX after deploying a contract
		 */
		async function recheckSingle(checkId: string, checker: () => Promise<DependencyCheck>) {
			const checkIndex = checks.findIndex((c) => c.id === checkId);
			if (checkIndex === -1) return;

			// Set the specific check to 'checking' status
			const currentCheck = checks[checkIndex];
			checks[checkIndex] = { ...currentCheck, status: 'checking' };
			// Force reactivity by creating new array reference
			checks = [...checks];

			try {
				const result = await checker();
				// Update only this check with the result
				checks[checkIndex] = result;
				checks = [...checks];

				// Recalculate summary
				updateSummary();
			} catch {
				// On error, restore the previous check state
				checks[checkIndex] = currentCheck;
				checks = [...checks];
			}
		}

		/**
		 * Update the summary based on current checks
		 */
		function updateSummary() {
			const total = checks.length;
			const passed = checks.filter((c) => c.status === 'success').length;
			const warnings = checks.filter((c) => c.status === 'warning').length;
			const failed = checks.filter((c) => c.status === 'error').length;

			summary = {
				total,
				passed,
				warnings,
				failed,
				allPassed: failed === 0
			};
		}

		function reset() {
			checks = [];
			summary = null;
			hasChecked = false;
			isChecking = false;
			isRechecking = false;
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
			get isRechecking() {
				return isRechecking;
			},
			get allPassed() {
				return summary?.allPassed ?? false;
			},

			// API
			runChecks,
			setCheckerFactory,
			recheckAll,
			recheckSingle,
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

	/* eslint-disable svelte/no-unused-props, @typescript-eslint/no-unused-vars */
	// checker props are used by parent via the exported object, some props reserved for future use
	let {
		checker,
		network,
		loadingMessage = 'Checking dependencies...',
		retryText = 'Recheck',
		// Reserved for future use by SummaryBanner
		allPassedTitle = 'All checks passed',
		allPassedMessage = 'All dependencies are satisfied',
		issuesFoundTitle = 'Issues found',
		issuesFoundMessage = 'Please resolve the issues below',
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
	/* eslint-enable svelte/no-unused-props, @typescript-eslint/no-unused-vars */

	// ============================================================================
	// STATE
	// ============================================================================

	let showDeploymentModal = $state(false);
	let deploymentConfig = $state<ContractDeploymentConfig | null>(null);

	// ============================================================================
	// DERIVED
	// ============================================================================

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

{#if checker.isChecking || !checker.hasChecked}
	{#if empty && !checker.isChecking}
		{@render empty()}
	{:else}
		<LoadingState message={loadingMessage} />
	{/if}
{:else if checker.checks.length > 0}
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
			{retryText}
			isLoading={checker.isRechecking}
			onRetry={() => checker.recheckAll()}
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
