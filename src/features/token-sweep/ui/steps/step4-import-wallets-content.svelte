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
	import type { ImportMethod, DerivationPathType } from '@/features/token-sweep/types/wallet';
	import type { WalletGenerationRequest } from '$lib/workers/wallet-import.worker';
	import { AlertCircle } from '@lucide/svelte';
	import { slide } from 'svelte/transition';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import StepContent from '$lib/components/step/step-content.svelte';
	import { useI18n } from '@shelchin/i18n/svelte';

	const i18n = useI18n();
	const connectStore = useConnectStore();
	const walletGeneration = useWalletGeneration();
	const balanceScanner = useBalanceScanner();

	// Local state
	let importMethod = $state<ImportMethod>('mnemonic');
	let pathType = $state<DerivationPathType>('sequential');
	let mnemonicText = $state('');
	let startIndex = $state(0);
	let endIndex = $state(99);
	let startYear = $state(new Date().getFullYear() - 10);
	let endYear = $state(new Date().getFullYear());
	let includeMonth = $state(false);
	let includeDay = $state(false);
	let useLeadingZeros = $state(true);
	let privateKeysText = $state('');
	let isGenerating = $state(false);
	let generationProgress = $state(0);
	let errorMessage = $state('');

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

	async function handleScanBalances() {
		// Validate prerequisites
		if (!connectStore.currentChainId) {
			errorMessage = i18n.t('tools.token_sweep.step4.content.errors.no_network');
			return;
		}

		if (importedWallets.length === 0) {
			errorMessage = i18n.t('tools.token_sweep.step4.content.errors.no_wallets');
			return;
		}

		// Get selected tokens from step3
		const selectedTokenIds = Array.from(step3State.selectedTokenIds);
		if (selectedTokenIds.length === 0) {
			errorMessage = i18n.t('tools.token_sweep.step4.content.errors.no_tokens');
			return;
		}

		// Get current network configuration
		const currentNetwork = connectStore.networks.find(
			(n) => n.chainId === connectStore.currentChainId
		);

		if (!currentNetwork || currentNetwork.rpcEndpoints.length === 0) {
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

		if (selectedTokens.length === 0) {
			errorMessage = i18n.t('tools.token_sweep.step4.content.errors.no_valid_tokens');
			return;
		}

		const rpcUrl = currentNetwork.rpcEndpoints[0].url;

		// Start scanning
		step4State.isScanning = true;
		step4State.scanProgress = 0;
		errorMessage = '';

		try {
			// Scan balances using composable
			const updates = await balanceScanner.scanBalances({
				wallets: importedWallets,
				selectedTokens,
				currentChainId: connectStore.currentChainId,
				rpcUrl,
				networkName: currentNetwork.name,
				networkSymbol: currentNetwork.symbol,
				onProgress: (progress) => {
					step4State.scanProgress = progress;
				}
			});

			step4State.updateWalletBalances(updates);
			step4State.hasScanned = true;

			// Show summary
			const walletsWithBalance = step4State.getWalletsWithBalance().length;
			if (walletsWithBalance === 0) {
				errorMessage = i18n.t('tools.token_sweep.step4.content.errors.no_balance');
			}
		} catch (error) {
			console.error('Balance scanning error:', error);
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
</style>
