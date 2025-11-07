<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import { scannerState } from '../../stores/scanner-state.svelte';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import { scanMultipleWallets } from '../../utils/balance-scanner';
	import { PREDEFINED_TOKENS } from '$lib/config/tokens';
	import type { NativeToken, ERC20Token } from '$lib/types/token';
	import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-svelte';

	const connectStore = useConnectStore();

	// Get selected tokens
	const selectedTokens = $derived(() => {
		if (!connectStore.currentChainId) return [];
		const chainTokens = PREDEFINED_TOKENS[connectStore.currentChainId];
		if (!chainTokens) return [];

		const allTokens: (NativeToken | ERC20Token)[] = [chainTokens.native, ...chainTokens.erc20];
		return allTokens.filter((token) => scannerState.selectedTokens.has(token.id));
	});

	// Get current network
	const currentNetwork = $derived(
		connectStore.currentChainId
			? connectStore.networks.find((n) => n.chainId === connectStore.currentChainId)
			: undefined
	);

	// Scan status
	const status = $derived(scannerState.scanStatus);
	const progress = $derived(scannerState.progress);
	const error = $derived(scannerState.error);

	// Start scan
	async function startScan() {
		if (!currentNetwork || !connectStore.currentChainId) {
			scannerState.setScanStatus('error');
			scannerState.setError('No network selected');
			return;
		}

		const tokens = selectedTokens();
		if (tokens.length === 0) {
			scannerState.setScanStatus('error');
			scannerState.setError('No tokens selected');
			return;
		}

		if (scannerState.wallets.length === 0) {
			scannerState.setScanStatus('error');
			scannerState.setError('No wallets added');
			return;
		}

		try {
			scannerState.setScanStatus('scanning');
			scannerState.setError(null);

			const results = await scanMultipleWallets(
				scannerState.wallets,
				tokens,
				currentNetwork.rpcUrls[0],
				(prog) => {
					scannerState.setProgress(prog);
				}
			);

			scannerState.setBalances(results);
			scannerState.setScanStatus('completed');
		} catch (err) {
			console.error('Scan failed:', err);
			scannerState.setScanStatus('error');
			scannerState.setError(err instanceof Error ? err.message : 'Scan failed');
		}
	}

	// Retry scan
	function retryScan() {
		startScan();
	}
</script>

<div class="step-content">
	<StepContentHeader title="Scan Token Balances" description="Query balances across all wallets" />

	{#if status === 'idle'}
		<!-- Ready to Scan -->
		<div class="scan-config">
			<div class="config-item">
				<span class="config-label">Network:</span>
				<span class="config-value">{currentNetwork?.name || 'Unknown'}</span>
			</div>
			<div class="config-item">
				<span class="config-label">Wallets:</span>
				<span class="config-value">{scannerState.wallets.length}</span>
			</div>
			<div class="config-item">
				<span class="config-label">Tokens:</span>
				<span class="config-value">{scannerState.selectedTokens.size}</span>
			</div>
		</div>

		<button class="start-scan-btn" onclick={startScan}>
			<Loader2 size={24} />
			<span>Start Scanning</span>
		</button>

		<div class="info-card">
			<p>Click "Start Scanning" to query token balances for all configured wallets.</p>
		</div>
	{:else if status === 'scanning'}
		<!-- Scanning Progress -->
		<div class="scanning-state">
			<div class="scanning-animation">
				<Loader2 size={64} class="spin" />
			</div>
			<h3>Scanning Balances...</h3>
			{#if progress}
				<div class="scan-progress">
					<div class="progress-bar">
						<div class="progress-fill" style="width: {progress.percentage}%"></div>
					</div>
					<p class="progress-text">
						Scanning wallet {progress.current} of {progress.total}
						{#if progress.currentWallet}
							<br />
							<span class="current-wallet">{progress.currentWallet}</span>
						{/if}
					</p>
				</div>
			{/if}
		</div>
	{:else if status === 'completed'}
		<!-- Scan Complete -->
		<div class="success-state">
			<CheckCircle2 size={64} class="success-icon" />
			<h3>Scan Complete!</h3>
			<p>Successfully scanned {scannerState.balances.length} wallets</p>
			<button class="continue-btn" onclick={() => {}}>View Results</button>
		</div>
	{:else if status === 'error'}
		<!-- Error State -->
		<div class="error-state">
			<AlertCircle size={64} class="error-icon" />
			<h3>Scan Failed</h3>
			<p class="error-message">{error || 'An unknown error occurred'}</p>
			<button class="retry-btn" onclick={retryScan}>Retry Scan</button>
		</div>
	{/if}
</div>

<style>
	.step-content {
		padding: var(--space-6);
	}

	/* Scan Configuration */
	.scan-config {
		margin-top: var(--space-6);
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.config-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-2) 0;
		border-bottom: 1px solid var(--color-border);
	}

	.config-item:last-child {
		border-bottom: none;
	}

	.config-label {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .config-label {
		color: var(--gray-400);
	}

	.config-value {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .config-value {
		color: var(--gray-100);
	}

	/* Start Scan Button */
	.start-scan-btn {
		margin-top: var(--space-6);
		padding: var(--space-4) var(--space-8);
		background: linear-gradient(135deg, hsl(210, 100%, 50%), hsl(210, 100%, 40%));
		color: white;
		border: none;
		border-radius: var(--radius-lg);
		font-size: var(--text-xl);
		font-weight: var(--font-bold);
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-3);
		box-shadow: 0 4px 12px hsla(210, 100%, 50%, 0.3);
	}

	.start-scan-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 24px hsla(210, 100%, 50%, 0.4);
	}

	/* Info Card */
	.info-card {
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		text-align: center;
	}

	.info-card p {
		margin: 0;
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .info-card p {
		color: var(--gray-400);
	}

	/* Scanning State */
	.scanning-state {
		margin-top: var(--space-8);
		padding: var(--space-8);
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-4);
	}

	.scanning-animation :global(.spin) {
		color: var(--color-primary);
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.scanning-state h3 {
		margin: 0;
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .scanning-state h3 {
		color: var(--gray-100);
	}

	.scan-progress {
		width: 100%;
		max-width: 500px;
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.progress-bar {
		height: 12px;
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-full);
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--color-primary), hsl(210, 100%, 60%));
		transition: width 0.3s ease;
	}

	.progress-text {
		margin: 0;
		font-size: var(--text-base);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .progress-text {
		color: var(--gray-300);
	}

	.current-wallet {
		font-family: monospace;
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .current-wallet {
		color: var(--gray-400);
	}

	/* Success State */
	.success-state {
		margin-top: var(--space-8);
		padding: var(--space-8);
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-4);
		background: hsla(120, 60%, 98%, 1);
		border: 2px solid hsla(120, 60%, 80%, 1);
		border-radius: var(--radius-lg);
	}

	:global([data-theme='dark']) .success-state {
		background: hsla(120, 60%, 15%, 0.3);
		border-color: hsla(120, 60%, 30%, 1);
	}

	:global(.success-icon) {
		color: hsla(120, 60%, 50%, 1);
	}

	.success-state h3 {
		margin: 0;
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .success-state h3 {
		color: var(--gray-100);
	}

	.success-state p {
		margin: 0;
		font-size: var(--text-base);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .success-state p {
		color: var(--gray-300);
	}

	.continue-btn {
		padding: var(--space-3) var(--space-6);
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.continue-btn:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px hsla(210, 100%, 50%, 0.3);
	}

	/* Error State */
	.error-state {
		margin-top: var(--space-8);
		padding: var(--space-8);
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-4);
		background: hsla(0, 80%, 98%, 1);
		border: 2px solid hsla(0, 80%, 80%, 1);
		border-radius: var(--radius-lg);
	}

	:global([data-theme='dark']) .error-state {
		background: hsla(0, 80%, 15%, 0.3);
		border-color: hsla(0, 80%, 30%, 1);
	}

	:global(.error-icon) {
		color: hsla(0, 80%, 50%, 1);
	}

	.error-state h3 {
		margin: 0;
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .error-state h3 {
		color: var(--gray-100);
	}

	.error-message {
		margin: 0;
		font-size: var(--text-base);
		color: var(--gray-700);
		font-family: monospace;
	}

	:global([data-theme='dark']) .error-message {
		color: var(--gray-300);
	}

	.retry-btn {
		padding: var(--space-3) var(--space-6);
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.retry-btn:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px hsla(210, 100%, 50%, 0.3);
	}

	/* Responsive */
	@media (max-width: 640px) {
		.step-content {
			padding: var(--space-3);
		}
	}
</style>
