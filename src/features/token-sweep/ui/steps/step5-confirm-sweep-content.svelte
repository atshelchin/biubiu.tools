<script lang="ts">
	import { step3State } from '@/features/token-sweep/stores/step3-state.svelte';
	import { step4State } from '@/features/token-sweep/stores/step4-state.svelte';
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import TokenListDisplay from '@/features/token-sweep/ui/components/token-list-display.svelte';
	import TransactionModeSelector from '@/features/token-sweep/ui/components/transaction-mode-selector.svelte';
	import FeeBreakdownDisplay from '@/features/token-sweep/ui/components/fee-breakdown-display.svelte';
	import TemporaryWalletManager from '@/features/token-sweep/ui/components/temporary-wallet-manager.svelte';
	import {
		estimateSweep,
		validateSweepConfig,
		calculateSweepStats,
		type SweepConfig,
		type SweepProgress
	} from '@/features/token-sweep/utils/sweep-executor';
	import {
		executeTokenSweep,
		type TokenSweepConfig,
		type TransactionSigner
	} from '@/features/token-sweep/utils/tokensweep-executor';
	import { checkMembership, calculateFeeBreakdown } from '@/features/token-sweep/utils/membership';
	import type {
		TransactionMode,
		MembershipStatus,
		FeeBreakdown,
		TemporaryWallet
	} from '@/features/token-sweep/types/fee';
	import { createPublicClient, http } from 'viem';
	import type { Address, Hex } from 'viem';
	import { AlertCircle, CheckCircle2, Loader2 } from '@lucide/svelte';
	import { fade, slide } from 'svelte/transition';
	import type { Token, NativeToken, ERC20Token } from '$lib/types/token';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';

	// State
	let targetAddress = $state('');
	let errorMessage = $state('');
	let sweepProgress = $state<SweepProgress | null>(null);
	let isSweeping = $state(false);
	let showEstimate = $state(false);
	let estimateData = $state<{
		totalTransactions: number;
		estimatedGas: bigint;
		estimatedCost: bigint;
	} | null>(null);

	// New state for transaction mode and fees
	let transactionMode = $state<TransactionMode>('connected');
	let membershipStatus = $state<MembershipStatus>({ isMember: false });
	let feeBreakdown = $state<FeeBreakdown | null>(null);
	let temporaryWallet = $state<TemporaryWallet | null>(null);
	let taskId = $state(`task-${Date.now()}`); // Generate unique task ID

	const connectStore = useConnectStore();

	// Derived from Step 3 (selected tokens)
	let selectedTokenIds = $derived(step3State.getSelectedTokens());
	let selectedTokenCount = $derived(step3State.getSelectedCount());

	// Get full token objects from token IDs
	let selectedTokenObjects: Token[] = $derived.by(() => {
		const chainId = connectStore.currentChainId;
		if (!chainId) return [];

		const network = connectStore.networks.find((n) => n.chainId === chainId);
		const allTokens = step3State.getAvailableTokens(chainId, network?.symbol, network?.name);
		return allTokens.filter((token) => selectedTokenIds.includes(token.id));
	});

	let currentNetwork = $derived.by(() => {
		if (!connectStore.currentChainId) return null;
		return connectStore.networks.find((n) => n.chainId === connectStore.currentChainId);
	});

	// Derived from Step 4 (imported wallets)
	let importedWallets = $derived(step4State.importedWallets);
	let walletsWithBalance = $derived(step4State.getWalletsWithBalance());
	let hasScanned = $derived(step4State.hasScanned);
	let walletCount = $derived(importedWallets.length);
	let walletWithBalanceCount = $derived(walletsWithBalance.length);
	let batchCount = $derived(Math.ceil(walletCount / 100));
	let isValid = $derived(
		targetAddress.match(/^0x[a-fA-F0-9]{40}$/) &&
			selectedTokenCount > 0 &&
			walletCount > 0 &&
			(transactionMode === 'connected' || temporaryWallet !== null)
	);

	// Option to only sweep wallets with balance
	let onlyWithBalance = $state(false);

	// Check membership when address changes
	$effect(() => {
		if (connectStore.address) {
			checkMembershipStatus();
		}
	});

	// Calculate fees when relevant data changes
	$effect(() => {
		if (batchCount > 0 && membershipStatus) {
			calculateFees();
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

	function calculateFees() {
		if (!currentNetwork) return;

		// Estimate 100,000 gas per transaction (rough estimate)
		const estimatedGasPerTx = BigInt(100000);

		const breakdown = calculateFeeBreakdown(
			batchCount,
			estimatedGasPerTx,
			membershipStatus.isMember
		);

		feeBreakdown = breakdown;
	}

	function handleModeChange(mode: TransactionMode) {
		transactionMode = mode;
	}

	function handleWalletCreated(wallet: TemporaryWallet) {
		temporaryWallet = wallet;
		// Re-check membership with signature
		checkMembershipStatus();
	}

	function handleWalletCleared() {
		temporaryWallet = null;
	}

	async function handleEstimateSweep() {
		if (!connectStore.currentChainId) {
			errorMessage = 'No network connected';
			return;
		}

		const walletsToSweep = onlyWithBalance ? walletsWithBalance : importedWallets;

		// Build config
		const config: SweepConfig = {
			targetAddress: targetAddress as Address,
			wallets: walletsToSweep,
			tokens: selectedTokenObjects as (NativeToken | ERC20Token)[],
			chainId: connectStore.currentChainId,
			includeNative: true,
			batchSize: 100
		};

		// Validate
		const validation = validateSweepConfig(config);
		if (!validation.valid) {
			errorMessage = validation.errors.join(', ');
			return;
		}

		// Get RPC
		const network = connectStore.networks.find((n) => n.chainId === connectStore.currentChainId);
		if (!network || network.rpcEndpoints.length === 0) {
			errorMessage = 'No RPC endpoint available';
			return;
		}

		const rpcUrl = network.rpcEndpoints[0].url;
		const chain = {
			id: network.chainId,
			name: network.name,
			nativeCurrency: { name: network.symbol, symbol: network.symbol, decimals: 18 },
			rpcUrls: { default: { http: [rpcUrl] } }
		} as const;

		const publicClient = createPublicClient({ chain, transport: http(rpcUrl) });

		try {
			const estimate = await estimateSweep(publicClient, config);
			estimateData = estimate;
			showEstimate = true;
			errorMessage = '';
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : 'Failed to estimate';
		}
	}

	async function handleExecuteSweep() {
		if (!isValid) {
			errorMessage = 'Please complete all required fields';
			return;
		}

		if (!targetAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
			errorMessage = 'Invalid target address';
			return;
		}

		if (selectedTokenCount === 0) {
			errorMessage = 'Please select at least one token in Step 3';
			return;
		}

		if (walletCount === 0) {
			errorMessage = 'Please import at least one wallet in Step 4';
			return;
		}

		if (!connectStore.address) {
			errorMessage = 'Please connect your wallet first';
			return;
		}

		if (!connectStore.currentChainId) {
			errorMessage = 'No network connected';
			return;
		}

		// Determine which wallets to sweep
		const walletsToSweep = onlyWithBalance ? walletsWithBalance : importedWallets;
		const sweepWalletCount = walletsToSweep.length;

		if (onlyWithBalance && sweepWalletCount === 0) {
			errorMessage = 'No wallets with balance to sweep. Please scan balances first in Step 4.';
			return;
		}

		// Create member signer if user is a member
		// This allows the contract to identify the member and waive fees
		let memberSigner: TransactionSigner | undefined;

		console.log('🔍 Checking membership status:', {
			isMember: membershipStatus.isMember,
			transactionMode,
			address: connectStore.address
		});

		if (membershipStatus.isMember && transactionMode === 'temporary') {
			// User is a member - create signer from connected wallet to sign authorization
			// This signature proves membership for fee discount
			console.log('👑 Member detected! Creating member signer for fee discount');
			console.log('👤 Member address:', connectStore.address);

			const memberWalletClient = await connectStore.getWalletClient();

			memberSigner = {
				address: connectStore.address,
				signMessage: async (message: string): Promise<Hex> => {
					console.log('🔔 Member signMessage called!');
					console.log('📄 Message to sign:', message);

					const sig = await memberWalletClient.signMessage({
						account: connectStore.address,
						message
					});

					console.log('✅ Member signature obtained:', sig.slice(0, 20) + '...');
					return sig;
				},
				sendTransaction: async () => {
					throw new Error('Member signer should not send transactions');
				}
			};

			console.log('✅ Member signer created successfully');
		} else {
			console.log('ℹ️ No member signer needed:', {
				reason: !membershipStatus.isMember ? 'Not a member' : 'Not using temporary wallet mode'
			});
		}

		// Build TokenSweep config
		const tokenSweepConfig: TokenSweepConfig = {
			targetAddress: targetAddress as Address,
			wallets: walletsToSweep,
			tokens: selectedTokenObjects as (NativeToken | ERC20Token)[],
			chainId: connectStore.currentChainId,
			referrer: undefined, // Can be set if referral system is implemented
			useTemporaryWallet: transactionMode === 'temporary', // Only temporary wallets need signature
			memberSigner, // Member account to sign authorization (for fee discount)
			onProgress: (message: string, percentage: number) => {
				// Update progress in real-time
				if (sweepProgress) {
					sweepProgress = {
						...sweepProgress,
						message,
						percentage
					};
				}
			}
		};

		// Get stats for confirmation
		calculateSweepStats({
			targetAddress: targetAddress as Address,
			wallets: walletsToSweep,
			tokens: selectedTokenObjects as (NativeToken | ERC20Token)[],
			chainId: connectStore.currentChainId,
			includeNative: true,
			batchSize: 100
		});

		// Show confirmation with EIP-7702 info
		const feeInfo = membershipStatus.isMember
			? 'As a premium member, you will not be charged tool fees.'
			: 'Non-member fee: 0.005 ETH (refunded for premium members)';

		const signatureSteps =
			transactionMode === 'temporary' && membershipStatus.isMember
				? `\n📝 SIGNATURES YOU WILL NEED TO APPROVE:\n` +
					`1. Member Authorization (MetaMask) - Proves membership for fee discount\n` +
					`2. Transaction Submission (Temporary Wallet) - Sends the actual transaction\n\n`
				: transactionMode === 'temporary'
					? `\n📝 SIGNATURES YOU WILL NEED TO APPROVE:\n` +
						`1. Transaction Submission (Temporary Wallet) - Sends the transaction\n\n`
					: ``;

		const modeWarning =
			transactionMode === 'connected'
				? `\n⚠️ WALLET MODE WARNING:\n` +
					`• You are using CONNECTED WALLET mode\n` +
					`• MetaMask does NOT support EIP-7702 authorizationList\n` +
					`• This transaction will likely FAIL\n` +
					`• RECOMMENDED: Switch to TEMPORARY WALLET mode below\n\n`
				: `\n✅ WALLET MODE:\n` +
					`• Using TEMPORARY WALLET (supports EIP-7702)\n` +
					(membershipStatus.isMember
						? `• 👑 MEMBER: Your connected wallet will sign authorization for fee discount\n`
						: `• NON-MEMBER: 0.005 ETH tool fee will be charged\n`) +
					`\n`;

		const confirmed = confirm(
			`🚀 Ready to execute TokenSweep via EIP-7702:\n\n` +
				`• ${selectedTokenCount} token(s)\n` +
				`• From ${sweepWalletCount} wallet(s)${onlyWithBalance ? ' (with balance only)' : ''}\n` +
				`• To ${targetAddress}\n\n` +
				`How it works:\n` +
				`1. Your imported wallets will be temporarily upgraded to smart contracts (EIP-7702)\n` +
				`2. The TokenSweep contract (0x28ab...239) will execute on their behalf\n` +
				`3. All tokens will be transferred to the target address in one transaction\n\n` +
				`Fees:\n` +
				`${feeInfo}\n` +
				`Gas fees still apply (~0.01-0.05 ETH estimated)\n` +
				signatureSteps +
				modeWarning +
				`⚠️ NETWORK REQUIREMENTS:\n` +
				`• Your network MUST support EIP-7702 (Prague upgrade)\n` +
				`• Most public RPCs do NOT support EIP-7702 yet (2024)\n` +
				`• Requires local testnet (Anvil/Hardhat) or dedicated EIP-7702 RPC\n` +
				`• If error occurs, check console logs for details\n\n` +
				`Continue?`
		);

		if (!confirmed) {
			return;
		}

		// Get RPC
		const network = connectStore.networks.find((n) => n.chainId === connectStore.currentChainId);
		if (!network || network.rpcEndpoints.length === 0) {
			errorMessage = 'No RPC endpoint available';
			return;
		}

		const rpcUrl = network.rpcEndpoints[0].url;
		const chain = {
			id: network.chainId,
			name: network.name,
			nativeCurrency: { name: network.symbol, symbol: network.symbol, decimals: 18 },
			rpcUrls: { default: { http: [rpcUrl] } }
		} as const;

		const publicClient = createPublicClient({ chain, transport: http(rpcUrl) });

		// Create signer based on transaction mode
		let signer: TransactionSigner;

		if (transactionMode === 'temporary' && temporaryWallet) {
			// Use temporary wallet - direct signing with private key (supports EIP-7702)
			console.log('🔑 Using temporary wallet for EIP-7702 transaction');
			const { privateKeyToAccount } = await import('viem/accounts');
			const { createWalletClient } = await import('viem');

			const account = privateKeyToAccount(temporaryWallet.privateKey as `0x${string}`);
			const tempWalletClient = createWalletClient({
				account,
				chain,
				transport: http(rpcUrl)
			});

			signer = {
				address: account.address,
				signMessage: async (message: string): Promise<Hex> => {
					return await account.signMessage({ message });
				},
				sendTransaction: async (tx) => {
					// Direct transaction with EIP-7702 support
					return await tempWalletClient.sendTransaction(tx);
				}
			};
		} else {
			// Use connected wallet (MetaMask) - does NOT support EIP-7702 authorizationList
			console.log('⚠️ Using connected wallet - EIP-7702 may not be supported by MetaMask');
			const walletClient = await connectStore.getWalletClient();

			signer = {
				address: connectStore.address,
				signMessage: async (message: string): Promise<Hex> => {
					return await walletClient.signMessage({
						account: connectStore.address,
						message
					});
				},
				sendTransaction: async (tx) => {
					// MetaMask provider - may not support authorizationList
					return await walletClient.sendTransaction({
						account: connectStore.address,
						...tx
					});
				}
			};
		}

		// Execute TokenSweep
		isSweeping = true;
		errorMessage = '';
		sweepProgress = null;

		try {
			// Initialize progress
			sweepProgress = {
				phase: 'preparing',
				currentBatch: 0,
				totalBatches: 1,
				currentWallet: 0,
				totalWallets: sweepWalletCount,
				percentage: 5,
				message:
					transactionMode === 'temporary'
						? '🚀 Starting TokenSweep (Temporary Wallet Mode)...'
						: '🚀 Starting TokenSweep (Connected Wallet Mode)...',
				results: []
			};

			// Execute with real-time progress updates via callback
			const result = await executeTokenSweep(publicClient, signer, tokenSweepConfig);

			if (result.success) {
				// Success
				sweepProgress = {
					phase: 'completed',
					currentBatch: 1,
					totalBatches: 1,
					currentWallet: result.walletsProcessed,
					totalWallets: sweepWalletCount,
					percentage: 100,
					message: `✅ Sweep completed! TX: ${result.transactionHash}`,
					results: [
						{
							wallet: targetAddress as Address,
							success: true,
							tokenSymbol: 'ALL',
							txHash: result.transactionHash as `0x${string}`
						}
					]
				};
			} else {
				errorMessage = result.error || 'Sweep failed';
				sweepProgress = {
					phase: 'error',
					currentBatch: 0,
					totalBatches: 1,
					currentWallet: 0,
					totalWallets: sweepWalletCount,
					percentage: 0,
					message: result.error || 'Sweep failed',
					results: [],
					error: result.error
				};
			}
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : 'Sweep failed';
			sweepProgress = {
				phase: 'error',
				currentBatch: 0,
				totalBatches: 1,
				currentWallet: 0,
				totalWallets: sweepWalletCount,
				percentage: 0,
				message: 'Sweep failed',
				results: [],
				error: error instanceof Error ? error.message : 'Unknown error'
			};
		} finally {
			isSweeping = false;
		}
	}
</script>

<div class="step-content">
	<StepContentHeader
		title="Confirm Sweep"
		description="Review your configuration and execute the asset sweep"
	/>

	<!-- 1. Selected Tokens Display (网络和token) -->
	<div class="form-section">
		<div class="form-label">Selected Network & Tokens ({selectedTokenCount})</div>
		{#if currentNetwork}
			<div class="network-info">
				<span class="network-name">{currentNetwork.name}</span>
				<span class="network-symbol">({currentNetwork.symbol})</span>
			</div>
		{/if}
		<TokenListDisplay tokens={selectedTokenObjects} {currentNetwork} />
	</div>

	<!-- 2. Batch Info (批次信息) -->
	<div class="info-card">
		<div class="info-header">
			<AlertCircle size={20} />
			<h4>Batch Processing</h4>
		</div>
		<p>
			Your {walletCount} wallet(s) will be processed in {batchCount} batch(es). Each batch can process
			up to 100 wallets.
		</p>
		<div class="batch-list">
			{#each Array.from({ length: batchCount }, (_, i) => i) as batchIndex (batchIndex)}
				<div class="batch-item">
					<span>Batch {batchIndex + 1}</span>
					<span class="batch-size">
						{Math.min(100, walletCount - batchIndex * 100)} wallet(s)
					</span>
				</div>
			{/each}
		</div>
	</div>

	<!-- 3. Target Address (接收地址) -->
	<div class="form-section">
		<label class="form-label" for="target-address-input">Target Address</label>
		<input
			id="target-address-input"
			type="text"
			class="form-input"
			bind:value={targetAddress}
			placeholder="0x... (Address to receive all assets)"
		/>
		<p class="form-hint">💡 All assets will be transferred to this address</p>
	</div>

	<!-- Balance Filter Option -->
	{#if hasScanned && walletWithBalanceCount < walletCount}
		<div class="form-section">
			<label class="checkbox-label">
				<input type="checkbox" bind:checked={onlyWithBalance} />
				<span>
					Only sweep wallets with balance ({walletWithBalanceCount} of {walletCount})
				</span>
			</label>
			<p class="form-hint">
				💡 {onlyWithBalance
					? `Only ${walletWithBalanceCount} wallets with confirmed balance will be processed`
					: `All ${walletCount} wallets will be processed (including those without balance)`}
			</p>
		</div>
	{/if}

	<!-- 4. Fee Breakdown Display (费用计算) -->
	{#if feeBreakdown && currentNetwork}
		<FeeBreakdownDisplay {feeBreakdown} {membershipStatus} networkSymbol={currentNetwork.symbol} />
	{/if}

	<!-- 5. Transaction Mode Selector (发送方式选择) -->
	<TransactionModeSelector mode={transactionMode} onModeChange={handleModeChange} />

	<!-- 6. Temporary Wallet Manager (only shown when temporary mode selected) -->
	{#if transactionMode === 'temporary' && feeBreakdown && currentNetwork}
		<TemporaryWalletManager
			{taskId}
			estimatedGasCost={feeBreakdown.estimatedGasFee}
			networkSymbol={currentNetwork.symbol}
			onWalletCreated={handleWalletCreated}
			onWalletCleared={handleWalletCleared}
		/>
	{/if}

	{#if errorMessage}
		<div class="error-banner" transition:fade>
			<AlertCircle size={20} />
			<span>{errorMessage}</span>
		</div>
	{/if}

	<!-- Sweep Progress -->
	{#if isSweeping && sweepProgress}
		<div class="progress-card" transition:slide>
			<h4>
				{#if sweepProgress.phase === 'preparing'}
					⏳ Preparing...
				{:else if sweepProgress.phase === 'building'}
					🔧 Building Transactions...
				{:else if sweepProgress.phase === 'executing'}
					⚡ Executing Sweep...
				{:else if sweepProgress.phase === 'confirming'}
					⏰ Confirming Transactions...
				{:else if sweepProgress.phase === 'completed'}
					✅ Completed!
				{:else if sweepProgress.phase === 'error'}
					❌ Error
				{/if}
			</h4>

			<p class="progress-message">{sweepProgress.message}</p>

			<div class="progress-bar-container">
				<div class="progress-bar" style="width: {sweepProgress.percentage}%"></div>
			</div>

			<div class="progress-stats">
				<span>Batch {sweepProgress.currentBatch} / {sweepProgress.totalBatches}</span>
				<span>Wallet {sweepProgress.currentWallet} / {sweepProgress.totalWallets}</span>
				<span>{sweepProgress.percentage}%</span>
			</div>

			{#if sweepProgress.results.length > 0}
				<div class="progress-results">
					<h5>Results ({sweepProgress.results.length}):</h5>
					<div class="results-list">
						{#each sweepProgress.results.slice(-5) as result (result.wallet + result.tokenSymbol)}
							<div class="result-item" class:success={result.success} class:error={!result.success}>
								{#if result.success}
									<CheckCircle2 size={14} />
								{:else}
									<AlertCircle size={14} />
								{/if}
								<span class="result-wallet">{result.wallet.slice(0, 8)}...</span>
								<span class="result-token">{result.tokenSymbol}</span>
								{#if result.error}
									<span class="result-error">{result.error}</span>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Estimate Display -->
	{#if showEstimate && estimateData}
		<div class="estimate-card" transition:slide>
			<h4>📊 Cost Estimate</h4>
			<div class="estimate-row">
				<span>Total Transactions:</span>
				<strong>{estimateData.totalTransactions}</strong>
			</div>
			<div class="estimate-row">
				<span>Estimated Gas:</span>
				<strong>{estimateData.estimatedGas.toString()} units</strong>
			</div>
			<div class="estimate-row">
				<span>Estimated Cost:</span>
				<strong>{(Number(estimateData.estimatedCost) / 1e18).toFixed(6)} ETH</strong>
			</div>
		</div>
	{/if}

	<div class="warning-card">
		<CheckCircle2 size={20} />
		<div>
			<strong>Ready to execute</strong>
			<p>Please review all information carefully before proceeding.</p>
		</div>
	</div>

	<!-- Action Buttons -->
	<div class="action-buttons">
		<button class="btn-secondary" onclick={handleEstimateSweep} disabled={!isValid || isSweeping}>
			📊 Estimate Cost
		</button>
		<button class="btn-execute" onclick={handleExecuteSweep} disabled={!isValid || isSweeping}>
			{#if isSweeping}
				<Loader2 size={20} class="spinning" />
				Sweeping...
			{:else}
				Execute Sweep 🚀
			{/if}
		</button>
	</div>
</div>

<style>
	.step-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.form-hint {
		font-size: var(--text-sm);
		color: var(--gray-600);
		margin: var(--space-1) 0 0 0;
	}
	:global([data-theme='dark']) .form-hint {
		color: var(--gray-400);
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		cursor: pointer;
		font-size: var(--text-base);
		color: var(--gray-700);
	}
	:global([data-theme='dark']) .checkbox-label {
		color: var(--gray-300);
	}

	.checkbox-label input[type='checkbox'] {
		width: 18px;
		height: 18px;
		cursor: pointer;
	}

	.checkbox-label span {
		user-select: none;
	}

	.btn-secondary,
	.btn-execute {
		padding: var(--space-3) var(--space-5);
		border: none;
		border-radius: var(--radius-md);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-secondary {
		background: var(--gray-200);
		color: var(--gray-700);
	}
	:global([data-theme='dark']) .btn-secondary {
		background: var(--gray-700);
		color: var(--gray-200);
	}

	.btn-execute {
		background: linear-gradient(135deg, #10b981, #059669);
		color: white;
		box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
	}
	.btn-execute:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
	}
	.btn-execute:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.form-section {
		margin-bottom: var(--space-5);
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

	.network-info {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3);
		margin-bottom: var(--space-2);
		background: var(--gray-50);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
	}
	:global([data-theme='dark']) .network-info {
		background: var(--gray-800);
	}

	.network-name {
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}
	:global([data-theme='dark']) .network-name {
		color: var(--gray-100);
	}

	.network-symbol {
		color: var(--gray-600);
	}
	:global([data-theme='dark']) .network-symbol {
		color: var(--gray-400);
	}

	.form-input {
		width: 100%;
		padding: var(--space-3);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		font-family: 'Courier New', monospace;
	}
	.form-input:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.info-card,
	.warning-card {
		padding: var(--space-4);
		border-radius: var(--radius-lg);
	}

	.info-card {
		background: hsla(45, 100%, 95%, 1);
		border: 1px solid hsl(45, 100%, 60%);
	}
	:global([data-theme='dark']) .info-card {
		background: hsla(45, 100%, 15%, 0.3);
		border-color: hsl(45, 100%, 40%);
	}

	.info-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-2);
		color: hsl(45, 100%, 35%);
	}

	.batch-list {
		margin-top: var(--space-3);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.batch-item {
		display: flex;
		justify-content: space-between;
		padding: var(--space-2);
		background: white;
		border-radius: var(--radius-sm);
	}

	:global([data-theme='dark']) .batch-item {
		background: var(--gray-900);
	}

	.warning-card {
		background: hsla(120, 60%, 95%, 1);
		border: 1px solid hsl(120, 60%, 60%);
		display: flex;
		gap: var(--space-3);
		color: hsl(120, 60%, 30%);
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
	}

	:global([data-theme='dark']) .error-banner {
		background: hsla(0, 80%, 15%, 0.3);
		border-color: hsl(0, 80%, 40%);
		color: hsl(0, 80%, 70%);
	}

	.action-buttons {
		display: flex;
		gap: var(--space-3);
		margin-top: var(--space-4);
	}

	.btn-secondary {
		flex: 1;
		padding: var(--space-3) var(--space-4);
		background: var(--gray-200);
		color: var(--gray-800);
		border: none;
		border-radius: var(--radius-md);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.2s;
	}
	.btn-secondary:hover:not(:disabled) {
		background: var(--gray-300);
	}
	.btn-secondary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	:global([data-theme='dark']) .btn-secondary {
		background: var(--gray-700);
		color: var(--gray-200);
	}

	.progress-card,
	.estimate-card {
		padding: var(--space-4);
		background: var(--gray-50);
		border: 1px solid var(--gray-200);
		border-radius: var(--radius-md);
		margin: var(--space-4) 0;
	}
	:global([data-theme='dark']) .progress-card,
	:global([data-theme='dark']) .estimate-card {
		background: var(--gray-800);
		border-color: var(--gray-700);
	}

	.progress-message {
		margin: var(--space-2) 0;
		color: var(--gray-600);
	}
	:global([data-theme='dark']) .progress-message {
		color: var(--gray-400);
	}

	.progress-bar-container {
		width: 100%;
		height: 8px;
		background: var(--gray-200);
		border-radius: var(--radius-sm);
		overflow: hidden;
		margin: var(--space-3) 0;
	}
	:global([data-theme='dark']) .progress-bar-container {
		background: var(--gray-700);
	}

	.progress-bar {
		height: 100%;
		background: linear-gradient(90deg, #3b82f6, #2563eb);
		transition: width 0.3s ease;
	}

	.progress-stats {
		display: flex;
		justify-content: space-between;
		font-size: var(--text-sm);
		color: var(--gray-600);
	}
	:global([data-theme='dark']) .progress-stats {
		color: var(--gray-400);
	}

	.progress-results {
		margin-top: var(--space-4);
	}

	.progress-results h5 {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		margin: 0 0 var(--space-2) 0;
	}

	.results-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.result-item {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2);
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
	}

	.result-item.success {
		background: hsla(120, 60%, 95%, 1);
		color: hsl(120, 60%, 30%);
	}
	.result-item.error {
		background: hsla(0, 60%, 95%, 1);
		color: hsl(0, 60%, 40%);
	}

	:global([data-theme='dark']) .result-item.success {
		background: hsla(120, 60%, 15%, 0.3);
		color: hsl(120, 60%, 70%);
	}

	:global([data-theme='dark']) .result-item.error {
		background: hsla(0, 60%, 15%, 0.3);
		color: hsl(0, 60%, 70%);
	}

	.result-wallet {
		font-family: monospace;
		font-weight: var(--font-semibold);
	}

	.result-token {
		padding: 2px 6px;
		background: var(--color-primary);
		color: white;
		font-size: var(--text-xs);
		border-radius: var(--radius-sm);
	}

	.result-error {
		margin-left: auto;
		font-size: var(--text-xs);
	}

	.estimate-row {
		display: flex;
		justify-content: space-between;
		padding: var(--space-2) 0;
		border-bottom: 1px solid var(--gray-200);
	}
	.estimate-row:last-child {
		border-bottom: none;
	}
	:global([data-theme='dark']) .estimate-row {
		border-bottom-color: var(--gray-700);
	}

	:global(.spinning) {
		animation: spin 1s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
