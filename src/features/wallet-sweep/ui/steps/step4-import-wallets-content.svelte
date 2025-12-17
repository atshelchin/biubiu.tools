<script lang="ts">
	import { step4State } from '@/features/wallet-sweep/stores/step4-state.svelte';
	import { step3State } from '@/features/wallet-sweep/stores/step3-state.svelte';
	import { useConnectStore } from '$lib/stores/connect.svelte.js';
	import ImportMethodSelector from '@/features/wallet-sweep/ui/components/import-method-selector.svelte';
	import MnemonicImportForm from '@/features/wallet-sweep/ui/components/mnemonic-import-form.svelte';
	import PrivateKeyImportForm from '@/features/wallet-sweep/ui/components/private-key-import-form.svelte';
	import WalletImportManager from '@/features/wallet-sweep/ui/components/wallet-import-manager.svelte';
	import ScanBalanceButton from '$lib/components/ui/scan-balance-button.svelte';
	import { useMnemonicImport } from '@/features/wallet-sweep/composables/use-mnemonic-import.svelte';
	import { usePrivateKeyImport } from '@/features/wallet-sweep/composables/use-private-key-import.svelte';
	import { useRpcManager } from '@/features/wallet-sweep/composables/use-rpc-manager.svelte';
	import { useBalanceScannerV2 } from '@/features/wallet-sweep/composables/use-balance-scanner-v2.svelte';
	import type { ScanState, ScanTaskStatus } from '$lib/services/balance-scanner/types';
	import type { ImportMethod } from '@/features/wallet-sweep/types/wallet';
	import type { ERC20Token } from '$lib/types/token';
	import type { Address } from 'viem';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import StepContent from '$lib/components/step/step-content.svelte';
	import QuickRpcManagerModal from '$lib/components/ui/quick-rpc-manager-modal.svelte';
	import InlineAlert from '$lib/components/ui/inline-alert.svelte';
	import { useI18n } from '@shelchin/i18n/svelte';
	import { useDevToolsEnabled } from '$lib/utils/dev-tools.svelte';

	const i18n = useI18n();
	const connectStore = useConnectStore();
	const mnemonicImport = useMnemonicImport(i18n.t);
	const privateKeyImport = usePrivateKeyImport(i18n.t);
	const rpcManager = useRpcManager();
	const balanceScanner = useBalanceScannerV2();

	// Local state - default to privateKey as it's the most common use case
	let importMethod = $state<ImportMethod>('privateKey');

	// Dev tools visibility - reactive, updates in real-time when window.toggleDevTools() is called
	let showDevTools = $derived(import.meta.env.DEV && useDevToolsEnabled());

	// Derived state
	let importedWallets = $derived(step4State.importedWallets);
	let isScanning = $derived(step4State.isScanning);
	let scanProgress = $derived(step4State.scanProgress);
	let scanCompleted = $derived(step4State.scanCompleted);

	// RPC count for showing guidance hint
	let rpcCount = $derived(rpcManager.currentNetwork?.rpcEndpoints.length ?? 0);
	let showRpcHint = $derived(rpcCount === 1 && importedWallets.length > 0 && !scanCompleted);

	// Import error message (from mnemonic or private key import)
	let importErrorMessage = $derived(
		importMethod === 'mnemonic' ? mnemonicImport.errorMessage : privateKeyImport.errorMessage
	);

	// Scan error message (from balance scanning)
	let scanErrorMessage = $derived(step4State.errorMessage);

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
		step4State.scanProgress = 0;
		step4State.clearScanEvents(); // Clear previous scan events
		step4State.startScanTracking(); // Start scan rate tracking

		try {
			// Clear any previous rate limit error
			step4State.clearRateLimitError();

			const { updates, state, completed } = await balanceScanner.scanBalances({
				wallets: importedWallets,
				selectedTokens,
				currentChainId: connectStore.currentChainId,
				rpcEndpoints: currentNetwork.rpcEndpoints,
				networkName: currentNetwork.name,
				networkSymbol: currentNetwork.symbol,
				onProgress: (stats) => {
					step4State.scanProgress = stats.progress;
				},
				onEvent: (event) => {
					// Store events for log display in sidebar
					step4State.addScanEvent(event);
					// Track scanned addresses for rate calculation
					if (event.type === 'batch_completed' && event.details?.successCount) {
						step4State.addScannedAddresses(event.details.successCount as number);
					}
				},
				onStateChange: (scanState) => {
					// Always keep track of the latest scan state for resume capability
					step4State.scanState = scanState;
					step4State.canResumeScan = true;
				},
				onPause: (reason, scanState) => {
					const errorMessage = i18n.t('tools.wallet_sweep.step4.content.rate_limit.error_generic', {
						reason
					});
					step4State.handleRateLimitError(errorMessage, scanState);
				},
				initialState: step4State.canResumeScan ? (step4State.scanState ?? undefined) : undefined
			});

			step4State.scanState = state;
			step4State.updateWalletBalances(updates);

			if (completed) {
				step4State.hasScanned = true;
				step4State.scanCompleted = true;
				step4State.canResumeScan = false;
			}

			// Show summary
			const walletsWithBalance = step4State.getWalletsWithBalance().length;
			if (walletsWithBalance === 0 && completed) {
				step4State.errorMessage = i18n.t('tools.wallet_sweep.step4.content.errors.no_balance');
				step4State.isInfoMessage = true; // This is info, not an error
			}
		} catch (error) {
			step4State.errorMessage =
				error instanceof Error
					? error.message
					: i18n.t('tools.wallet_sweep.step4.content.errors.scan_failed');
			step4State.isInfoMessage = false; // This is an actual error
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

	<!-- Import Error Message (near import forms) -->
	{#if importErrorMessage}
		<InlineAlert variant="error" message={importErrorMessage} />
	{/if}

	<!-- Wallet List -->

	{#if importedWallets.length > 0}
		<WalletImportManager
			wallets={importedWallets}
			onRemoveWallet={(address) => step4State.removeWallet(address)}
			onClearAll={() => step4State.clearWallets()}
		/>

		<!-- Scan Balance Section -->
		<div>
			<!-- RPC Guidance Hint - shown when only 1 RPC is configured -->
			{#if showRpcHint}
				<div class="rpc-hint">
					<InlineAlert
						variant="info"
						title={i18n.t('tools.wallet_sweep.step4.content.rpc_hint.title')}
						message={i18n.t('tools.wallet_sweep.step4.content.rpc_hint.message')}
						primaryButtonText={i18n.t('tools.wallet_sweep.step4.content.rpc_hint.add_rpc_button')}
						onPrimaryClick={rpcManager.openRpcManager}
					/>
				</div>
			{/if}

			<ScanBalanceButton
				{isScanning}
				{scanProgress}
				{scanCompleted}
				disabled={importedWallets.length === 0}
				scanningText={i18n.t('tools.wallet_sweep.step4.content.wallet_list.scanning', {
					progress: scanProgress
				})}
				scanButtonText={i18n.t('tools.wallet_sweep.step4.content.wallet_list.scan_button')}
				completedText={i18n.t('tools.wallet_sweep.step4.content.wallet_list.scan_completed')}
				onScan={handleScanBalances}
			/>

			<!-- Scan Error/Info Message (inline, close to scan button) -->
			{#if scanErrorMessage && !step4State.isRateLimited}
				<div class="scan-error-inline">
					<InlineAlert
						variant={step4State.isInfoMessage ? 'info' : 'error'}
						title={scanErrorMessage}
						message=""
					/>
				</div>
			{/if}

			<!-- Rate Limit Error (inline, close to scan button) -->
			{#if step4State.isRateLimited}
				<div class="scan-error-inline">
					<InlineAlert
						variant="warning"
						title={i18n.t('tools.wallet_sweep.step4.content.rate_limit.title')}
						message={step4State.rateLimitMessage}
						hint={i18n.t('tools.wallet_sweep.step4.content.rate_limit.hint')}
						primaryButtonText={i18n.t(
							'tools.wallet_sweep.step4.content.rate_limit.manage_rpc_button'
						)}
						secondaryButtonText={i18n.t(
							'tools.wallet_sweep.step4.content.rate_limit.resume_button'
						)}
						onPrimaryClick={rpcManager.openRpcManager}
						onSecondaryClick={handleScanBalances}
					/>
				</div>
			{/if}

			<!-- Developer Debug Buttons (controlled by localStorage, toggle with window.toggleDevTools()) -->
			{#if showDevTools}
				<div class="dev-tools">
					<span class="dev-label">Dev Tools:</span>
					<button
						class="dev-btn"
						onclick={() => {
							step4State.scanCompleted = true;
							step4State.hasScanned = true;
						}}
					>
						Mark Complete
					</button>
					<button
						class="dev-btn"
						onclick={() => {
							step4State.scanCompleted = false;
							step4State.hasScanned = false;
						}}
					>
						Reset Scan
					</button>
					<button
						class="dev-btn dev-btn-error"
						onclick={() => {
							step4State.errorMessage = 'Simulated scan error for testing';
						}}
					>
						Trigger Error
					</button>
					<button
						class="dev-btn dev-btn-warning"
						onclick={() => {
							// Use actual imported wallets and selected tokens for realistic simulation
							const addresses = importedWallets.map((w) => w.address) as Address[];
							const currentNetwork = rpcManager.currentNetwork;
							const chainId = connectStore.currentChainId ?? 0;
							const allTokens = currentNetwork
								? step3State.getAvailableTokens(chainId, currentNetwork.symbol, currentNetwork.name)
								: [];
							const selectedIds = Array.from(step3State.selectedTokenIds);
							const tokens = allTokens
								.filter((t) => selectedIds.includes(t.id))
								.map((t) => ({
									id: t.id,
									address: t.type === 'erc20' ? (t as ERC20Token).address : undefined,
									decimals: t.decimals,
									chainId: t.chainId,
									symbol: t.symbol
								}));

							// Create task status map with 50% progress
							/* eslint-disable-next-line svelte/prefer-svelte-reactivity -- mock state for dev tools only */
							const taskStatus = new Map<string, ScanTaskStatus>();
							const totalTasks = addresses.length * tokens.length;
							const completedTasks = Math.floor(totalTasks / 2);
							let taskCount = 0;
							for (const addr of addresses) {
								for (const token of tokens) {
									const key = `${addr.toLowerCase()}:${token.id}`;
									taskStatus.set(key, taskCount < completedTasks ? 'success' : 'pending');
									taskCount++;
								}
							}

							const mockState: ScanState = {
								sessionId: `mock_session_${Date.now()}`,
								chainId,
								addresses,
								tokens,
								taskStatus,
								balances: new Map(),
								stats: {
									total: totalTasks,
									success: completedTasks,
									failed: 0,
									pending: totalTasks - completedTasks,
									progress: Math.round((completedTasks / totalTasks) * 100) || 0
								},
								config: {
									batchSize: 100,
									maxRetries: 3,
									retryDelay: 1000,
									rateLimitDelay: 5000,
									maxConsecutiveErrors: 5
								},
								startedAt: Date.now() - 30000, // Started 30 seconds ago
								lastActivityAt: Date.now(),
								isPaused: true,
								pauseReason: 'rate_limit'
							};
							step4State.handleRateLimitError('Simulated rate limit error', mockState);
						}}
					>
						Rate Limit
					</button>
				</div>
			{/if}
		</div>
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

	.scan-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-3);
		margin-top: var(--space-4);
		padding: var(--space-4);
		background: linear-gradient(135deg, var(--color-muted) 0%, var(--color-background) 100%);
		border-radius: var(--radius-lg);
		border: 2px dashed var(--color-border);
		transition: all 0.3s ease;
	}

	.scan-section:hover {
		border-color: var(--color-primary);
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--color-primary) 5%, var(--color-muted)) 0%,
			var(--color-background) 100%
		);
	}

	.scan-section.completed {
		border-style: solid;
		border-color: var(--color-success, #10b981);
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--color-success, #10b981) 5%, var(--color-muted)) 0%,
			var(--color-background) 100%
		);
	}

	.scan-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.scan-title {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--color-foreground);
	}

	.scan-required-badge {
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		color: var(--color-warning, #f59e0b);
		background: color-mix(in srgb, var(--color-warning, #f59e0b) 15%, transparent);
		padding: var(--space-0-5) var(--space-2);
		border-radius: var(--radius-full);
	}

	/* Inline error container within scan section */
	.scan-error-inline {
		width: 100%;
		margin-top: var(--space-2);
	}

	/* RPC hint container */
	.rpc-hint {
		margin-bottom: var(--space-3);
	}

	/* Developer Tools Styles */
	.dev-tools {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		align-items: center;
		margin-top: var(--space-2);
		padding-top: var(--space-2);
		border-top: 1px dashed var(--color-border);
		width: 100%;
		justify-content: center;
	}

	.dev-label {
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		font-weight: var(--font-medium);
	}

	.dev-btn {
		font-size: var(--text-xs);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-sm);
		border: 1px solid var(--color-border);
		background: var(--color-background);
		color: var(--color-foreground);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.dev-btn:hover {
		background: var(--color-muted);
		border-color: var(--color-primary);
	}

	.dev-btn-error {
		border-color: hsl(0, 70%, 50%);
		color: hsl(0, 70%, 50%);
	}

	.dev-btn-error:hover {
		background: hsl(0, 70%, 95%);
	}

	.dev-btn-warning {
		border-color: var(--color-warning, #f59e0b);
		color: var(--color-warning, #f59e0b);
	}

	.dev-btn-warning:hover {
		background: color-mix(in srgb, var(--color-warning, #f59e0b) 10%, transparent);
	}
</style>
