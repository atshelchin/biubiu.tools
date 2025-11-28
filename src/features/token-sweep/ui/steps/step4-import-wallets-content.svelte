<script lang="ts">
	import { step4State } from '@/features/token-sweep/stores/step4-state.svelte';
	import { step3State } from '@/features/token-sweep/stores/step3-state.svelte';
	import { useConnectStore } from '$lib/stores/connect.svelte.js';
	import ImportMethodSelector from '@/features/token-sweep/ui/components/import-method-selector.svelte';
	import MnemonicImportForm from '@/features/token-sweep/ui/components/mnemonic-import-form.svelte';
	import PrivateKeyImportForm from '@/features/token-sweep/ui/components/private-key-import-form.svelte';
	import WalletImportManager from '@/features/token-sweep/ui/components/wallet-import-manager.svelte';
	import { validateMnemonicPhrase } from '@/features/token-sweep/utils/wallet-import';
	import { useWalletGeneration } from '@/features/token-sweep/composables/use-wallet-generation.svelte';
	import { useBalanceScanner } from '@/features/token-sweep/composables/use-balance-scanner.svelte';
	import { setDebugConfig } from '@/features/token-sweep/utils/balance-scanner';
	import type { ImportMethod, DerivationPathType } from '@/features/token-sweep/types/wallet';
	import type { WalletGenerationRequest } from '$lib/workers/wallet-import.worker';
	import { AlertCircle } from '@lucide/svelte';
	import { slide } from 'svelte/transition';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import StepContent from '$lib/components/step/step-content.svelte';
	import QuickRpcManagerModal from '$lib/components/ui/quick-rpc-manager-modal.svelte';
	import { useI18n } from '@shelchin/i18n/svelte';

	const i18n = useI18n();
	const connectStore = useConnectStore();
	const walletGeneration = useWalletGeneration();
	const balanceScanner = useBalanceScanner();

	// Expose debug config to browser console
	if (typeof window !== 'undefined') {
		(window as any).setDebugConfig = setDebugConfig;
		console.log(
			'💡 Debug mode available! Use setDebugConfig({ batchSize: 1 }) in console to enable single-address mode'
		);
	}

	// Local state
	let importMethod = $state<ImportMethod>('mnemonic');
	let pathType = $state<DerivationPathType>('sequential');
	let mnemonicText = $state('');
	let startIndex = $state(0);
	let endIndex = $state(999);
	let startYear = $state(new Date().getFullYear() - 10);
	let endYear = $state(new Date().getFullYear());
	let includeMonth = $state(false);
	let includeDay = $state(false);
	let useLeadingZeros = $state(true);
	let privateKeysText = $state('');
	let isGenerating = $state(false);
	let generationProgress = $state(0);
	let errorMessage = $state('');
	let showRpcManager = $state(false);

	// Derived state
	let importedWallets = $derived(step4State.importedWallets);
	let isScanning = $derived(step4State.isScanning);
	let scanProgress = $derived(step4State.scanProgress);
	let hasScanned = $derived(step4State.hasScanned);
	let walletsWithBalance = $derived(step4State.getWalletsWithBalance().length);

	function handleMethodSelect(method: ImportMethod) {
		importMethod = method;
		errorMessage = '';
	}

	async function handleGenerateAddresses() {
		if (!mnemonicText.trim()) {
			errorMessage = i18n.t('tools.token_sweep.step4.content.mnemonic.error_empty');
			return;
		}

		if (!validateMnemonicPhrase(mnemonicText.trim())) {
			errorMessage = i18n.t('tools.token_sweep.step4.content.mnemonic.error_invalid');
			return;
		}

		// Clear existing wallets before generating new ones
		step4State.clearWallets();

		isGenerating = true;
		generationProgress = 0;
		errorMessage = '';

		try {
			// Prepare request data
			let requestData: WalletGenerationRequest;
			let totalAddresses = 0;

			if (pathType === 'sequential') {
				// Sequential mode validation
				if (startIndex < 0 || endIndex < startIndex) {
					errorMessage = i18n.t('tools.token_sweep.step4.content.mnemonic.error_range');
					isGenerating = false;
					return;
				}

				totalAddresses = endIndex - startIndex + 1;

				// if (totalAddresses > 10000) {
				// 	errorMessage = i18n.t('tools.token_sweep.step4.content.mnemonic.error_max');
				// 	isGenerating = false;
				// 	return;
				// }

				requestData = {
					mnemonic: mnemonicText.trim(),
					pathType: 'sequential' as const,
					startIndex,
					endIndex,
					batchSize: 50
				};
			} else {
				// Date mode
				const startDate = `${startYear}-01-01`;
				const endDate = `${endYear}-12-31`;

				// Determine date format based on granularity
				let dateFormat: 'yyyy' | 'yyyymm' | 'yyyym' | 'yyyymmdd' | 'yyyymdd';
				if (!includeMonth && !includeDay) {
					dateFormat = 'yyyy';
					totalAddresses = endYear - startYear + 1;
				} else if (includeMonth && !includeDay) {
					dateFormat = useLeadingZeros ? 'yyyymm' : 'yyyym';
					totalAddresses = (endYear - startYear + 1) * 12;
				} else {
					dateFormat = useLeadingZeros ? 'yyyymmdd' : 'yyyymdd';
					// Estimate days (rough calculation)
					const start = new Date(startDate);
					const end = new Date(endDate);
					totalAddresses = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
				}

				requestData = {
					mnemonic: mnemonicText.trim(),
					pathType: 'date' as const,
					startDate,
					endDate,
					dateFormat,
					batchSize: 50
				};
			}

			// Generate wallets using composable
			const result = await walletGeneration.generateFromMnemonic(
				requestData,
				totalAddresses,
				(p) => (generationProgress = p)
			);

			if (result.error) {
				errorMessage = result.error;
			} else {
				// Add wallets (without privateKey field - already stored in walletKeysStore)
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				step4State.addWallets(result.wallets.map(({ privateKey: _pk, ...wallet }) => wallet));
			}
		} catch (error) {
			console.error('Generate addresses error:', error);
			errorMessage =
				error instanceof Error
					? error.message
					: i18n.t('tools.token_sweep.step4.content.errors.generate_failed');
		} finally {
			isGenerating = false;
			generationProgress = 0;
		}
	}

	async function handleImportPrivateKeys() {
		if (!privateKeysText.trim()) {
			errorMessage = i18n.t('tools.token_sweep.step4.content.private_key.error_empty');
			return;
		}

		const lines = privateKeysText
			.split('\n')
			.map((line) => line.trim())
			.filter((line) => line.length > 0);

		if (lines.length === 0) {
			errorMessage = i18n.t('tools.token_sweep.step4.content.private_key.error_none');
			return;
		}

		// Clear existing wallets before importing new ones
		step4State.clearWallets();

		isGenerating = true;
		generationProgress = 0;
		errorMessage = '';

		try {
			// Import private keys using composable
			const result = await walletGeneration.importPrivateKeys(
				lines,
				(p) => (generationProgress = p)
			);

			if (result.error) {
				errorMessage = result.error;
			} else {
				// Add wallets (without privateKey field - already stored in walletKeysStore)
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				step4State.addWallets(result.wallets.map(({ privateKey: _pk, ...wallet }) => wallet));
				if (result.invalidKeys.length > 0) {
					errorMessage = i18n.t(
						'tools.token_sweep.step4.content.private_key.success_with_invalid',
						{
							valid: result.wallets.length,
							invalid: result.invalidKeys.length
						}
					);
				}
			}
		} catch (error) {
			console.error('Import private keys error:', error);
			errorMessage =
				error instanceof Error
					? error.message
					: i18n.t('tools.token_sweep.step4.content.errors.import_failed');
		} finally {
			isGenerating = false;
			generationProgress = 0;
		}
	}

	function handleOpenRpcManager() {
		showRpcManager = true;
	}

	function handleSaveRpcEndpoints(rpcEndpoints: { url: string; isPrimary: boolean }[]) {
		// Update the current network's RPC endpoints
		const currentNetwork = connectStore.networks.find(
			(n) => n.chainId === connectStore.currentChainId
		);
		if (currentNetwork) {
			currentNetwork.rpcEndpoints = rpcEndpoints;
			connectStore.updateNetworkRpc(currentNetwork.chainId, rpcEndpoints);
			console.log('✅ RPC endpoints updated:', rpcEndpoints);
		}
	}

	async function handleScanBalances() {
		console.log('🔍 handleScanBalances called');
		console.log('📊 currentChainId:', connectStore.currentChainId);
		console.log('📊 importedWallets.length:', importedWallets.length);
		console.log('📊 selectedTokenIds:', Array.from(step3State.selectedTokenIds));

		// Validate prerequisites
		if (!connectStore.currentChainId) {
			console.log('❌ No network connected');
			errorMessage = i18n.t('tools.token_sweep.step4.content.errors.no_network');
			return;
		}

		if (importedWallets.length === 0) {
			console.log('❌ No wallets imported');
			errorMessage = i18n.t('tools.token_sweep.step4.content.errors.no_wallets');
			return;
		}

		// Get selected tokens from step3
		const selectedTokenIds = Array.from(step3State.selectedTokenIds);
		if (selectedTokenIds.length === 0) {
			console.log('❌ No tokens selected');
			errorMessage = i18n.t('tools.token_sweep.step4.content.errors.no_tokens');
			return;
		}

		// Get current network configuration
		const currentNetwork = connectStore.networks.find(
			(n) => n.chainId === connectStore.currentChainId
		);
		console.log('📊 currentNetwork:', currentNetwork);
		console.log('📊 RPC Endpoints:', currentNetwork?.rpcEndpoints);
		console.log(
			'📊 RPC URLs:',
			currentNetwork?.rpcEndpoints.map((ep) => ep.url)
		);

		if (!currentNetwork || currentNetwork.rpcEndpoints.length === 0) {
			console.log('❌ No RPC endpoint');
			errorMessage = i18n.t('tools.token_sweep.step4.content.errors.no_rpc');
			return;
		}

		// Get all tokens for current chain
		const allTokens = step3State.getAvailableTokens(
			connectStore.currentChainId,
			currentNetwork?.symbol,
			currentNetwork?.name
		);
		const selectedTokens = allTokens.filter((token) => selectedTokenIds.includes(token.id));
		console.log('📊 selectedTokens:', selectedTokens);

		if (selectedTokens.length === 0) {
			console.log('❌ No valid tokens');
			errorMessage = i18n.t('tools.token_sweep.step4.content.errors.no_valid_tokens');
			return;
		}

		console.log(
			`✅ All validations passed, starting scan with ${currentNetwork.rpcEndpoints.length} RPC endpoints`
		);

		// Start scanning
		step4State.isScanning = true;
		errorMessage = '';

		// Calculate initial progress if resuming
		if (step4State.canResumeScan && step4State.scanState) {
			const state = step4State.scanState;
			const batchCount = Math.ceil(importedWallets.length / 1000); // Default batch size
			const totalTokens = 1 + selectedTokens.filter((t) => t.type === 'erc20').length;
			const totalBatches = batchCount * totalTokens;

			let completedBatches = 0;
			if (state.currentTokenIndex === -1) {
				// Still scanning native token
				completedBatches = state.currentBatchIndex;
			} else {
				// Scanning ERC20 tokens
				completedBatches =
					batchCount + state.currentTokenIndex * batchCount + state.currentBatchIndex;
			}

			step4State.scanProgress = Math.round((completedBatches / totalBatches) * 100);
			console.log(
				`🔄 Resuming scan from batch ${state.currentBatchIndex}, token ${state.currentTokenIndex}, progress: ${step4State.scanProgress}%`
			);
		} else {
			// New scan starts from 0
			step4State.scanProgress = 0;
		}

		try {
			// Clear any previous rate limit error
			step4State.clearRateLimitError();

			console.log('🚀 Calling balanceScanner.scanBalances...');
			// Scan balances using composable (resumable)
			// Only pass initialState if we're resuming from a paused scan (canResumeScan = true)
			// Otherwise start fresh scan
			const { updates, state } = await balanceScanner.scanBalances({
				wallets: importedWallets,
				selectedTokens,
				currentChainId: connectStore.currentChainId,
				rpcEndpoints: currentNetwork.rpcEndpoints, // Pass all RPC endpoints
				networkName: currentNetwork.name,
				networkSymbol: currentNetwork.symbol,
				onProgress: (progress) => {
					step4State.scanProgress = progress;
				},
				onAllRPCsExhausted: () => {
					// Only show rate limit error when ALL RPCs are exhausted
					console.log('❌ All RPCs exhausted, showing error to user');
				},
				onRateLimitError: (error, scanState) => {
					// Format error message with i18n (only called when all RPCs exhausted)
					const errorMessage =
						error.scanType === 'native'
							? i18n.t('tools.token_sweep.step4.content.rate_limit.error_native', {
									batch: error.currentBatch,
									total: error.totalBatches
								})
							: i18n.t('tools.token_sweep.step4.content.rate_limit.error_erc20', {
									batch: error.currentBatch,
									total: error.totalBatches,
									token: error.tokenId || ''
								});
					step4State.handleRateLimitError(errorMessage, scanState);
				},
				initialState: step4State.canResumeScan ? step4State.scanState || undefined : undefined
			});

			console.log('✅ Scan completed, updates:', updates.size, 'state:', state);
			step4State.scanState = state;
			step4State.updateWalletBalances(updates);

			if (!state.isPaused) {
				step4State.hasScanned = true;
				step4State.canResumeScan = false;
			}

			// Show summary
			const walletsWithBalance = step4State.getWalletsWithBalance().length;
			if (walletsWithBalance === 0 && !state.isPaused) {
				errorMessage = i18n.t('tools.token_sweep.step4.content.errors.no_balance');
			}
		} catch (error) {
			console.error('Balance scanning error:', error);
			if (error instanceof Error && error.name === 'RateLimitError') {
				// Already handled by onRateLimitError callback
				return;
			}
			errorMessage =
				error instanceof Error
					? error.message
					: i18n.t('tools.token_sweep.step4.content.errors.scan_failed');
		} finally {
			step4State.isScanning = false;
		}
	}
</script>

<StepContent>
	<StepContentHeader
		title={i18n.t('tools.token_sweep.step4.content.title')}
		description={i18n.t('tools.token_sweep.step4.content.description')}
	/>

	<!-- Import Method Selector -->
	<div class="form-section">
		<div class="form-label">{i18n.t('tools.token_sweep.step4.content.choose_method')}</div>
		<ImportMethodSelector selected={importMethod} onSelect={handleMethodSelect} />
	</div>

	<!-- Mnemonic Import -->
	{#if importMethod === 'mnemonic'}
		<MnemonicImportForm
			bind:mnemonicText
			bind:pathType
			bind:startIndex
			bind:endIndex
			bind:startYear
			bind:endYear
			bind:includeMonth
			bind:includeDay
			bind:useLeadingZeros
			{isGenerating}
			{generationProgress}
			onGenerate={handleGenerateAddresses}
		/>
	{/if}

	<!-- Private Key Import -->
	{#if importMethod === 'privateKey'}
		<PrivateKeyImportForm
			bind:privateKeysText
			{isGenerating}
			{generationProgress}
			onImport={handleImportPrivateKeys}
		/>
	{/if}

	<!-- Error Message -->
	{#if errorMessage}
		<div class="error-banner" transition:slide>
			<AlertCircle size={20} />
			<span>{errorMessage}</span>
		</div>
	{/if}

	<!-- Rate Limit Error Banner -->
	{#if step4State.isRateLimited}
		<div class="rate-limit-banner" transition:slide>
			<div class="banner-icon">⚠️</div>
			<div class="banner-content">
				<div class="banner-title">
					{i18n.t('tools.token_sweep.step4.content.rate_limit.title')}
				</div>
				<div class="banner-message">
					{step4State.rateLimitMessage}
				</div>
				<div class="banner-hint">
					{i18n.t('tools.token_sweep.step4.content.rate_limit.hint')}
				</div>
			</div>
			<div class="banner-actions">
				<button class="btn-manage-rpc" onclick={handleOpenRpcManager}>
					{i18n.t('tools.token_sweep.step4.content.rate_limit.manage_rpc_button')}
				</button>
				<button class="btn-resume" onclick={handleScanBalances}>
					{i18n.t('tools.token_sweep.step4.content.rate_limit.resume_button')}
				</button>
			</div>
		</div>
	{/if}

	<!-- Wallet List -->
	<WalletImportManager
		wallets={importedWallets}
		{isScanning}
		{scanProgress}
		{hasScanned}
		{walletsWithBalance}
		onScanBalances={handleScanBalances}
		onRemoveWallet={(address) => step4State.removeWallet(address)}
		onClearAll={() => step4State.clearWallets()}
	/>
</StepContent>

<!-- Quick RPC Manager Modal -->
{#if connectStore.currentChainId}
	{@const currentNetwork = connectStore.networks.find(
		(n) => n.chainId === connectStore.currentChainId
	)}
	{#if currentNetwork}
		<QuickRpcManagerModal
			bind:open={showRpcManager}
			network={currentNetwork}
			onClose={() => (showRpcManager = false)}
			onSave={handleSaveRpcEndpoints}
		/>
	{/if}
{/if}

<style>
	.form-section {
		margin-bottom: var(--space-6);
	}

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

	.error-banner {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3);
		background: hsla(0, 80%, 95%, 1);
		border: 1px solid hsl(0, 80%, 60%);
		border-radius: var(--radius-sm);
		color: hsl(0, 80%, 40%);
		margin-bottom: var(--space-4);
	}

	.rate-limit-banner {
		display: flex;
		align-items: flex-start;
		gap: var(--space-3);
		padding: var(--space-4);
		background: linear-gradient(135deg, #fff7ed, #ffedd5);
		border: 2px solid #fb923c;
		border-radius: var(--radius-md);
		margin-bottom: var(--space-4);
		box-shadow: 0 2px 8px rgba(251, 146, 60, 0.1);
	}
	:global([data-theme='dark']) .rate-limit-banner {
		background: linear-gradient(135deg, #431407, #7c2d12);
		border-color: #ea580c;
	}

	.banner-icon {
		font-size: 24px;
		flex-shrink: 0;
		margin-top: 2px;
	}

	.banner-content {
		flex: 1;
	}

	.banner-title {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: #c2410c;
		margin-bottom: var(--space-2);
	}
	:global([data-theme='dark']) .banner-title {
		color: #fb923c;
	}

	.banner-message {
		font-size: var(--text-sm);
		color: #9a3412;
		margin-bottom: var(--space-2);
		line-height: 1.5;
	}
	:global([data-theme='dark']) .banner-message {
		color: #fdba74;
	}

	.banner-hint {
		font-size: var(--text-sm);
		color: #c2410c;
		padding: var(--space-2);
		background: rgba(255, 255, 255, 0.5);
		border-radius: var(--radius-sm);
		border-left: 3px solid #fb923c;
		margin-bottom: var(--space-3);
	}
	:global([data-theme='dark']) .banner-hint {
		color: #fed7aa;
		background: rgba(0, 0, 0, 0.2);
	}

	.banner-actions {
		display: flex;
		gap: var(--space-2);
		flex-shrink: 0;
		flex-direction: column;
	}

	.btn-manage-rpc {
		padding: var(--space-2) var(--space-4);
		background: linear-gradient(135deg, #3b82f6, #2563eb);
		color: white;
		border: none;
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.2s;
		white-space: nowrap;
	}

	.btn-manage-rpc:hover {
		transform: translateY(-1px);
		box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
	}

	.btn-resume {
		padding: var(--space-2) var(--space-4);
		background: linear-gradient(135deg, #fb923c, #f97316);
		color: white;
		border: none;
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.2s;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.btn-resume:hover {
		transform: translateY(-1px);
		box-shadow: 0 2px 8px rgba(249, 115, 22, 0.3);
	}
</style>
