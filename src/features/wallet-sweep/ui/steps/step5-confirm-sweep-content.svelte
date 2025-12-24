<script lang="ts">
	import { useI18n, type TranslationKeys } from '@shelchin/i18n';
	import { step3State } from '@/features/wallet-sweep/stores/step3-state.svelte';
	import { step4State } from '@/features/wallet-sweep/stores/step4-state.svelte';
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import TemporaryWalletManager from '@/features/wallet-sweep/ui/components/temporary-wallet-manager.svelte';
	import SweepProgressDisplay from '@/features/wallet-sweep/ui/components/sweep-progress-display.svelte';
	import EstimateDisplay from '@/features/wallet-sweep/ui/components/estimate-display.svelte';
	import ActionButtons from '@/features/wallet-sweep/ui/components/action-buttons.svelte';
	import TargetAddressInfo from '@/features/wallet-sweep/ui/components/target-address-info.svelte';
	import GasWarningBanner from '@/features/wallet-sweep/ui/components/gas-warning-banner.svelte';
	import { useFeeCalculator } from '@/features/wallet-sweep/composables/use-fee-calculator.svelte';
	import { useGasMonitor } from '@/features/wallet-sweep/composables/use-gas-monitor.svelte';
	import { useSweepExecutor } from '@/features/wallet-sweep/composables/use-sweep-executor.svelte';
	import { checkMembership } from '@/features/wallet-sweep/utils/membership';
	import {
		estimateSweep,
		validateSweepConfig,
		type SweepConfig
	} from '@/features/wallet-sweep/utils/sweep-executor';
	import type { MembershipStatus, TemporaryWallet } from '@/features/wallet-sweep/types/fee';
	import type { Token, NativeToken, ERC20Token } from '$lib/types/token';
	import type { Address } from 'viem';
	import { createPublicClient, http } from 'viem';
	import { AlertCircle, CheckCircle2 } from '@lucide/svelte';
	import { fade } from 'svelte/transition';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import StepContent from '$lib/components/step/step-content.svelte';

	const i18n = useI18n();
	const connectStore = useConnectStore();

	// Initialize composables
	/* eslint-disable @typescript-eslint/no-explicit-any -- Work around viem type version conflicts */
	const feeCalculator = useFeeCalculator({
		getPublicClient: () => connectStore.publicClient as any
	});

	const gasMonitor = useGasMonitor({
		getPublicClient: () => connectStore.publicClient as any
	});
	/* eslint-enable @typescript-eslint/no-explicit-any */

	const sweepExecutor = useSweepExecutor({
		getConnectedAddress: () => connectStore.address,
		getWalletClient: () => connectStore.getWalletClient()
	});

	// Local state
	let membershipStatus = $state<MembershipStatus>({ isMember: false });
	let temporaryWallet = $state<TemporaryWallet | null>(null);
	let taskId = $state(`task-${Date.now()}`);
	let isEstimating = $state(false);
	let showEstimate = $state(false);
	let estimateData = $state<{
		totalTransactions: number;
		estimatedGas: bigint;
		estimatedCost: bigint;
	} | null>(null);

	// Derived from stores
	let selectedTokenIds = $derived(step3State.getSelectedTokens());
	let selectedTokenCount = $derived(step3State.getSelectedCount());
	let importedWallets = $derived(step4State.importedWallets);
	let walletCount = $derived(importedWallets.length);
	let targetAddress = $derived(connectStore.address || '');

	let currentNetwork = $derived.by(() => {
		if (!connectStore.currentChainId) return null;
		return connectStore.networks.find((n) => n.chainId === connectStore.currentChainId);
	});

	let selectedTokenObjects: Token[] = $derived.by(() => {
		const chainId = connectStore.currentChainId;
		if (!chainId) return [];
		const network = connectStore.networks.find((n) => n.chainId === chainId);
		const allTokens = step3State.getAvailableTokens(chainId, network?.symbol, network?.name);
		return allTokens.filter((token) => selectedTokenIds.includes(token.id));
	});

	let isValid = $derived(
		Boolean(connectStore.address) &&
			selectedTokenCount > 0 &&
			walletCount > 0 &&
			temporaryWallet !== null
	);

	// Check membership when address changes
	$effect(() => {
		if (connectStore.address) {
			checkMembershipStatus();
		}
	});

	// Calculate fees when relevant data changes
	$effect(() => {
		if (importedWallets.length > 0 && selectedTokenIds.length > 0 && membershipStatus) {
			feeCalculator.calculateFees(
				selectedTokenIds,
				selectedTokenObjects,
				importedWallets,
				membershipStatus
			);
		}
	});

	async function checkMembershipStatus() {
		if (!connectStore.address) return;
		const status = await checkMembership(
			connectStore.address,
			taskId,
			temporaryWallet?.signature as `0x${string}` | undefined,
			temporaryWallet?.signature ? `task-${taskId}` : undefined
		);
		membershipStatus = status;
	}

	function handleWalletCreated(wallet: TemporaryWallet) {
		temporaryWallet = wallet;
		checkMembershipStatus();
	}

	async function handleResumeAfterGasRefill() {
		const canResume = await gasMonitor.tryResume(temporaryWallet, feeCalculator.feeBreakdown);
		if (!canResume) {
			sweepExecutor.clearError();
			alert(i18n.t('wallet-sweep.step5.content.errors.still_insufficient_gas'));
			return;
		}

		alert(
			i18n.t('wallet-sweep.step5.content.gas_refilled_restart', {
				balance: gasMonitor.formatGasAmount(gasMonitor.currentGasBalance)
			})
		);
	}

	async function handleEstimateSweep() {
		if (!connectStore.currentChainId || !currentNetwork) {
			return;
		}

		const config: SweepConfig = {
			targetAddress: targetAddress as Address,
			wallets: importedWallets,
			tokens: selectedTokenObjects as (NativeToken | ERC20Token)[],
			chainId: connectStore.currentChainId,
			includeNative: true,
			batchSize: 100
		};

		const validation = validateSweepConfig(config);
		if (!validation.valid) {
			return;
		}

		if (currentNetwork.rpcEndpoints.length === 0) {
			return;
		}

		const rpcUrl = currentNetwork.rpcEndpoints[0].url;
		const chain = {
			id: currentNetwork.chainId,
			name: currentNetwork.name,
			nativeCurrency: { name: currentNetwork.symbol, symbol: currentNetwork.symbol, decimals: 18 },
			rpcUrls: { default: { http: [rpcUrl] } }
		} as const;

		const publicClient = createPublicClient({ chain, transport: http(rpcUrl) });

		isEstimating = true;

		try {
			const estimate = await estimateSweep(publicClient, config);
			estimateData = estimate;
			showEstimate = true;
		} catch (error) {
			console.error('Estimate failed:', error);
		} finally {
			isEstimating = false;
		}
	}

	async function handleExecuteSweep() {
		// Validate inputs
		const validationError = sweepExecutor.validateInputs(
			targetAddress,
			selectedTokenCount,
			walletCount,
			connectStore.address,
			connectStore.currentChainId,
			temporaryWallet
		);

		if (validationError) {
			alert(i18n.t(validationError as keyof TranslationKeys));
			return;
		}

		if (!currentNetwork || currentNetwork.rpcEndpoints.length === 0) {
			alert(i18n.t('wallet-sweep.step5.content.errors.no_rpc'));
			return;
		}

		// Check gas balance
		const hasEnoughGas = await gasMonitor.checkGasBalance(
			temporaryWallet,
			feeCalculator.feeBreakdown
		);

		if (!hasEnoughGas) {
			gasMonitor.pauseForGas();
			return;
		}

		// Show confirmation
		const confirmMessage = sweepExecutor.buildConfirmationMessage(
			selectedTokenCount,
			walletCount,
			targetAddress,
			false, // onlyWithBalance
			membershipStatus.isMember
		);

		if (!confirm(confirmMessage)) {
			return;
		}

		// Execute sweep
		await sweepExecutor.execute(
			targetAddress as Address,
			importedWallets,
			selectedTokenObjects,
			currentNetwork,
			temporaryWallet!,
			membershipStatus
		);
	}
</script>

<StepContent>
	<StepContentHeader
		title={i18n.t('wallet-sweep.step5.content.title')}
		description={i18n.t('wallet-sweep.step5.content.description')}
	/>

	<!-- Target Address -->
	<TargetAddressInfo
		label={i18n.t('wallet-sweep.step5.target_address_label')}
		address={targetAddress}
		hint={i18n.t('wallet-sweep.step5.target_address_hint')}
	/>

	<!-- Temporary Wallet Manager -->
	{#if feeCalculator.feeBreakdown && currentNetwork}
		<TemporaryWalletManager
			{taskId}
			estimatedGasCost={feeCalculator.feeBreakdown.estimatedGasFee}
			networkSymbol={currentNetwork.symbol}
			onWalletCreated={handleWalletCreated}
		/>
	{/if}

	<!-- Error Banner -->
	{#if sweepExecutor.errorMessage}
		<div class="error-banner" transition:fade>
			<AlertCircle size={20} />
			<span>{sweepExecutor.errorMessage}</span>
		</div>
	{/if}

	<!-- Gas Insufficient Warning -->
	{#if gasMonitor.isPausedForGas}
		<GasWarningBanner
			title={i18n.t('wallet-sweep.step5.content.gas_insufficient_title')}
			message={i18n.t('wallet-sweep.step5.content.gas_insufficient_message', {
				required: gasMonitor.formatGasAmount(gasMonitor.requiredGas),
				current: gasMonitor.formatGasAmount(gasMonitor.currentGasBalance),
				symbol: currentNetwork?.symbol || 'ETH'
			})}
			buttonText={i18n.t('wallet-sweep.step5.content.check_and_resume')}
			onResume={handleResumeAfterGasRefill}
		/>
	{/if}

	<!-- Sweep Progress -->
	{#if sweepExecutor.isSweeping && sweepExecutor.sweepProgress}
		<SweepProgressDisplay progress={sweepExecutor.sweepProgress} />
	{/if}

	<!-- Estimate Display -->
	<EstimateDisplay {showEstimate} {estimateData} />

	<!-- Ready Card -->
	<div class="warning-card">
		<CheckCircle2 size={20} />
		<div>
			<strong>{i18n.t('wallet-sweep.step5.content.ready_to_execute')}</strong>
			<p>{i18n.t('wallet-sweep.step5.content.review_carefully')}</p>
		</div>
	</div>

	<!-- Action Buttons -->
	<ActionButtons
		{isEstimating}
		{showEstimate}
		isExecuting={sweepExecutor.isSweeping}
		canExecute={isValid}
		onEstimate={handleEstimateSweep}
		onExecute={handleExecuteSweep}
	/>
</StepContent>

<style>
	.warning-card {
		background: hsla(120, 60%, 95%, 1);
		border: 1px solid hsl(120, 60%, 60%);
		display: flex;
		gap: var(--space-3);
		color: hsl(120, 60%, 30%);
		padding: var(--space-4);
		border-radius: var(--radius-md);
		margin: var(--space-4) 0;
	}

	:global([data-theme='dark']) .warning-card {
		background: hsla(120, 60%, 15%, 0.3);
		border-color: hsl(120, 60%, 40%);
		color: hsl(120, 60%, 70%);
	}

	.error-banner {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3);
		background: hsla(0, 80%, 95%, 1);
		border: 1px solid hsl(0, 80%, 60%);
		border-radius: var(--radius-sm);
		color: hsl(0, 80%, 40%);
		margin: var(--space-4) 0;
	}

	:global([data-theme='dark']) .error-banner {
		background: hsla(0, 80%, 15%, 0.3);
		border-color: hsl(0, 80%, 40%);
		color: hsl(0, 80%, 70%);
	}
</style>
