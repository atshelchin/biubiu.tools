<script lang="ts">
	import { step4State } from '@/features/wallet-sweep/stores/step4-state.svelte';
	import { step3State } from '@/features/wallet-sweep/stores/step3-state.svelte';
	import { useConnectStore } from '$lib/stores/connect.svelte.js';
	import ImportMethodSelector from '@/features/wallet-sweep/ui/components/import-method-selector.svelte';
	import MnemonicImportForm from '@/features/wallet-sweep/ui/components/mnemonic-import-form.svelte';
	import PrivateKeyImportForm from '@/features/wallet-sweep/ui/components/private-key-import-form.svelte';
	import WalletImportManager from '@/features/wallet-sweep/ui/components/wallet-import-manager.svelte';
	import { useMnemonicImport } from '@/features/wallet-sweep/composables/use-mnemonic-import.svelte';
	import { usePrivateKeyImport } from '@/features/wallet-sweep/composables/use-private-key-import.svelte';
	import { useRpcManager } from '@/features/wallet-sweep/composables/use-rpc-manager.svelte';
	import { useBalanceScanner } from '@/features/wallet-sweep/composables/use-balance-scanner.svelte';
	import { setDebugConfig } from '@/features/wallet-sweep/utils/balance-scanner';
	import type { ImportMethod } from '@/features/wallet-sweep/types/wallet';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import StepContent from '$lib/components/step/step-content.svelte';
	import QuickRpcManagerModal from '$lib/components/ui/quick-rpc-manager-modal.svelte';
	import RateLimitBanner from '$lib/components/ui/rate-limit-banner.svelte';
	import ErrorBanner from '$lib/components/ui/error-banner.svelte';
	import { useI18n } from '@shelchin/i18n/svelte';

	const i18n = useI18n();
	const connectStore = useConnectStore();
	const mnemonicImport = useMnemonicImport(i18n.t);
	const privateKeyImport = usePrivateKeyImport(i18n.t);
	const rpcManager = useRpcManager();
	const balanceScanner = useBalanceScanner();

	// Expose debug config to browser console
	if (typeof window !== 'undefined') {
		(window as unknown as { setDebugConfig: typeof setDebugConfig }).setDebugConfig =
			setDebugConfig;
	}

	// Local state - default to privateKey as it's the most common use case
	let importMethod = $state<ImportMethod>('privateKey');

	// Derived state
	let importedWallets = $derived(step4State.importedWallets);
	let isScanning = $derived(step4State.isScanning);
	let scanProgress = $derived(step4State.scanProgress);

	// Combined error message from import methods and scan errors
	let errorMessage = $derived(
		step4State.errorMessage ||
			(importMethod === 'mnemonic' ? mnemonicImport.errorMessage : privateKeyImport.errorMessage)
	);

	function handleMethodSelect(method: ImportMethod) {
		importMethod = method;
		mnemonicImport.clearError();
		privateKeyImport.clearError();
		step4State.clearError();
		// Clear imported wallets when switching import method
		step4State.clearWallets();
	}

	async function handleGenerateAddresses() {
		await mnemonicImport.generateAddresses();
	}

	async function handleImportPrivateKeys() {
		await privateKeyImport.importPrivateKeys();
	}

	async function handleScanBalances() {
		// Validate prerequisites
		if (!connectStore.currentChainId) {
			step4State.errorMessage = i18n.t('tools.wallet_sweep.step4.content.errors.no_network');
			return;
		}

		if (importedWallets.length === 0) {
			step4State.errorMessage = i18n.t('tools.wallet_sweep.step4.content.errors.no_wallets');
			return;
		}

		// Get selected tokens from step3
		const selectedTokenIds = Array.from(step3State.selectedTokenIds);
		if (selectedTokenIds.length === 0) {
			step4State.errorMessage = i18n.t('tools.wallet_sweep.step4.content.errors.no_tokens');
			return;
		}

		// Get current network configuration
		const currentNetwork = rpcManager.currentNetwork;
		if (!currentNetwork || currentNetwork.rpcEndpoints.length === 0) {
			step4State.errorMessage = i18n.t('tools.wallet_sweep.step4.content.errors.no_rpc');
			return;
		}

		// Get all tokens for current chain
		const allTokens = step3State.getAvailableTokens(
			connectStore.currentChainId,
			currentNetwork.symbol,
			currentNetwork.name
		);
		const selectedTokens = allTokens.filter((token) => selectedTokenIds.includes(token.id));

		if (selectedTokens.length === 0) {
			step4State.errorMessage = i18n.t('tools.wallet_sweep.step4.content.errors.no_valid_tokens');
			return;
		}

		// Start scanning
		step4State.isScanning = true;
		step4State.errorMessage = '';

		// Calculate initial progress if resuming
		if (step4State.canResumeScan && step4State.scanState) {
			const state = step4State.scanState;
			const batchCount = Math.ceil(importedWallets.length / 1000);
			const totalTokens = 1 + selectedTokens.filter((t) => t.type === 'erc20').length;
			const totalBatches = batchCount * totalTokens;

			let completedBatches = 0;
			if (state.currentTokenIndex === -1) {
				completedBatches = state.currentBatchIndex;
			} else {
				completedBatches =
					batchCount + state.currentTokenIndex * batchCount + state.currentBatchIndex;
			}

			step4State.scanProgress = Math.round((completedBatches / totalBatches) * 100);
		} else {
			step4State.scanProgress = 0;
		}

		try {
			// Clear any previous rate limit error
			step4State.clearRateLimitError();

			const { updates, state } = await balanceScanner.scanBalances({
				wallets: importedWallets,
				selectedTokens,
				currentChainId: connectStore.currentChainId,
				rpcEndpoints: currentNetwork.rpcEndpoints,
				networkName: currentNetwork.name,
				networkSymbol: currentNetwork.symbol,
				onProgress: (progress) => {
					step4State.scanProgress = progress;
				},
				onAllRPCsExhausted: () => {
					// Only show rate limit error when ALL RPCs are exhausted
				},
				onRateLimitError: (error, scanState) => {
					const errorMessage =
						error.scanType === 'native'
							? i18n.t('tools.wallet_sweep.step4.content.rate_limit.error_native', {
									batch: error.currentBatch,
									total: error.totalBatches
								})
							: i18n.t('tools.wallet_sweep.step4.content.rate_limit.error_erc20', {
									batch: error.currentBatch,
									total: error.totalBatches,
									token: error.tokenId || ''
								});
					step4State.handleRateLimitError(errorMessage, scanState);
				},
				initialState: step4State.canResumeScan ? step4State.scanState || undefined : undefined
			});

			step4State.scanState = state;
			step4State.updateWalletBalances(updates);

			if (!state.isPaused) {
				step4State.hasScanned = true;
				step4State.canResumeScan = false;
			}

			// Show summary
			const walletsWithBalance = step4State.getWalletsWithBalance().length;
			if (walletsWithBalance === 0 && !state.isPaused) {
				step4State.errorMessage = i18n.t('tools.wallet_sweep.step4.content.errors.no_balance');
			}
		} catch (error) {
			if (error instanceof Error && error.name === 'RateLimitError') {
				return;
			}
			step4State.errorMessage =
				error instanceof Error
					? error.message
					: i18n.t('tools.wallet_sweep.step4.content.errors.scan_failed');
		} finally {
			step4State.isScanning = false;
		}
	}
</script>

<StepContent>
	<!-- i18n.t('tools.wallet_sweep.step4.content.description') -->
	<StepContentHeader title={i18n.t('tools.wallet_sweep.step4.content.title')} description="" />

	<!-- Import Method Selector -->
	<div>
		<div class="form-label">{i18n.t('tools.wallet_sweep.step4.content.choose_method')}</div>
		<ImportMethodSelector selected={importMethod} onSelect={handleMethodSelect} />
	</div>

	<!-- Mnemonic Import -->
	{#if importMethod === 'mnemonic'}
		<MnemonicImportForm
			bind:mnemonicText={mnemonicImport.mnemonicText}
			bind:pathType={mnemonicImport.pathType}
			bind:startIndex={mnemonicImport.startIndex}
			bind:endIndex={mnemonicImport.endIndex}
			bind:startYear={mnemonicImport.startYear}
			bind:endYear={mnemonicImport.endYear}
			bind:includeMonth={mnemonicImport.includeMonth}
			bind:includeDay={mnemonicImport.includeDay}
			bind:useLeadingZeros={mnemonicImport.useLeadingZeros}
			isGenerating={mnemonicImport.isGenerating}
			generationProgress={mnemonicImport.generationProgress}
			onGenerate={handleGenerateAddresses}
		/>
	{/if}

	<!-- Private Key Import -->
	{#if importMethod === 'privateKey'}
		<PrivateKeyImportForm
			bind:privateKeysText={privateKeyImport.privateKeysText}
			isGenerating={privateKeyImport.isGenerating}
			generationProgress={privateKeyImport.generationProgress}
			invalidPrivateKeys={privateKeyImport.invalidPrivateKeys}
			onImport={handleImportPrivateKeys}
		/>
	{/if}

	<!-- Error Message -->
	{#if errorMessage}
		<ErrorBanner message={errorMessage} />
	{/if}

	<!-- Rate Limit Error Banner -->
	{#if step4State.isRateLimited}
		<RateLimitBanner
			title={i18n.t('tools.wallet_sweep.step4.content.rate_limit.title')}
			message={step4State.rateLimitMessage}
			hint={i18n.t('tools.wallet_sweep.step4.content.rate_limit.hint')}
			primaryButtonText={i18n.t('tools.wallet_sweep.step4.content.rate_limit.manage_rpc_button')}
			secondaryButtonText={i18n.t('tools.wallet_sweep.step4.content.rate_limit.resume_button')}
			onPrimaryClick={rpcManager.openRpcManager}
			onSecondaryClick={handleScanBalances}
		>
			{#snippet recommend()}
				💡 {i18n.t('tools.wallet_sweep.step4.content.rate_limit.recommend_prefix')}
				<a href="https://chainid.network" target="_blank" rel="noopener noreferrer">
					chainid.network
				</a>
				{i18n.t('tools.wallet_sweep.step4.content.rate_limit.recommend_suffix')}
			{/snippet}
		</RateLimitBanner>
	{/if}

	<!-- Wallet List -->

	{#if importedWallets.length > 0}
		<WalletImportManager
			wallets={importedWallets}
			{isScanning}
			{scanProgress}
			onScanBalances={handleScanBalances}
			onRemoveWallet={(address) => step4State.removeWallet(address)}
			onClearAll={() => step4State.clearWallets()}
		/>
	{/if}
</StepContent>

<!-- Quick RPC Manager Modal -->
{#if rpcManager.currentChainId && rpcManager.currentNetwork}
	<QuickRpcManagerModal
		bind:open={rpcManager.showRpcManager}
		network={rpcManager.currentNetwork}
		onClose={rpcManager.closeRpcManager}
		onSave={rpcManager.saveRpcEndpoints}
	/>
{/if}

<style>
	.form-label {
		display: block;
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-700);
		margin-bottom: var(--space-2);
	}
	:global([data-theme='dark']) .form-label {
		color: var(--gray-300);
	}
</style>
