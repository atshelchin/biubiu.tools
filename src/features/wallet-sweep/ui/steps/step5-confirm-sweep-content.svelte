<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import { step3State } from '@/features/wallet-sweep/stores/step3-state.svelte';
	import { step4State } from '@/features/wallet-sweep/stores/step4-state.svelte';
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import TemporaryWalletManager from '@/features/wallet-sweep/ui/components/temporary-wallet-manager.svelte';
	import SweepProgressDisplay from '@/features/wallet-sweep/ui/components/sweep-progress-display.svelte';
	import EstimateDisplay from '@/features/wallet-sweep/ui/components/estimate-display.svelte';
	import ActionButtons from '@/features/wallet-sweep/ui/components/action-buttons.svelte';
	import {
		estimateSweep,
		validateSweepConfig,
		calculateSweepStats,
		type SweepConfig,
		type SweepProgress
	} from '@/features/wallet-sweep/utils/sweep-executor';
	import {
		executeTokenSweep,
		type TokenSweepConfig,
		type TransactionSigner
	} from '@/features/wallet-sweep/utils/tokensweep-executor';
	import { checkMembership, calculateFeeBreakdown } from '@/features/wallet-sweep/utils/membership';
	import type {
		TransactionMode,
		MembershipStatus,
		FeeBreakdown,
		TemporaryWallet
	} from '@/features/wallet-sweep/types/fee';
	import { createPublicClient, http } from 'viem';
	import type { Address, Hex } from 'viem';
	import { AlertCircle, CheckCircle2 } from '@lucide/svelte';
	import { fade } from 'svelte/transition';
	import { SvelteMap } from 'svelte/reactivity';
	import type { Token, NativeToken, ERC20Token } from '$lib/types/token';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import StepContent from '$lib/components/step/step-content.svelte';

	const i18n = useI18n();

	// State
	let errorMessage = $state('');
	let sweepProgress = $state<SweepProgress | null>(null);
	let isSweeping = $state(false);
	let isEstimating = $state(false);
	let showEstimate = $state(false);
	let estimateData = $state<{
		totalTransactions: number;
		estimatedGas: bigint;
		estimatedCost: bigint;
	} | null>(null);

	// Gas monitoring state
	let isPausedForGas = $state(false);
	let requiredGas = $state<bigint>(0n);
	let currentGasBalance = $state<bigint>(0n);

	// New state for transaction mode and fees
	let transactionMode = $state<TransactionMode>('temporary'); // Only support temporary wallet mode
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

	// Use connected wallet address as target address
	let targetAddress = $derived(connectStore.address || '');

	// Derived from Step 4 (imported wallets)
	let importedWallets = $derived(step4State.importedWallets);
	let walletsWithBalance = $derived(step4State.getWalletsWithBalance());
	let walletCount = $derived(importedWallets.length);
	let isValid = $derived(
		Boolean(connectStore.address) &&
			selectedTokenCount > 0 &&
			walletCount > 0 &&
			temporaryWallet !== null // Only support temporary wallet mode
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
		if (importedWallets.length > 0 && selectedTokenIds.length > 0 && membershipStatus) {
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

	async function simulateGasForTokenBatch(
		tokenId: string,
		walletAddresses: string[]
	): Promise<bigint> {
		try {
			if (!connectStore.currentChainId || !currentNetwork) return BigInt(0);

			// Get first batch of wallets (up to 100)
			const firstBatch = walletAddresses.slice(0, 100);
			if (firstBatch.length === 0) return BigInt(0);

			const publicClient = connectStore.publicClient;
			if (!publicClient) return BigInt(0);

			// Find token object
			const token = selectedTokenObjects.find((t) => t.id === tokenId);
			if (!token) return BigInt(0);

			// Build simulation transaction
			// Note: This is a simplified simulation - actual implementation would need
			// to call the TokenSweep contract's sweep function with proper parameters
			const isNative = token.id.endsWith(':native');

			// Estimate gas based on token type and batch size
			// These are rough estimates that should be replaced with actual contract simulations
			const baseGasPerWallet = isNative ? BigInt(21000) : BigInt(65000); // Native vs ERC20
			const estimatedGas = baseGasPerWallet * BigInt(firstBatch.length);

			return estimatedGas;
		} catch (error) {
			console.error(`Failed to simulate gas for token ${tokenId}:`, error);
			// Return a conservative estimate on error
			return BigInt(100000) * BigInt(100); // 10M gas as fallback
		}
	}

	async function calculateFees() {
		if (!currentNetwork) return;

		// Calculate total batch count across all tokens
		const BATCH_SIZE = 100;
		const stats = new SvelteMap<
			string,
			{ addressCount: number; batchCount: number; walletsWithBalance: string[] }
		>();

		// Initialize stats for selected tokens
		selectedTokenIds.forEach((tokenId) => {
			stats.set(tokenId, {
				addressCount: 0,
				batchCount: 0,
				walletsWithBalance: []
			});
		});

		// Count addresses with balance for each token
		importedWallets.forEach((wallet) => {
			if (!wallet.balances) return;

			selectedTokenIds.forEach((tokenId) => {
				const stat = stats.get(tokenId);
				if (!stat) return;

				// Check if wallet has balance for this token
				const isNative = tokenId.endsWith(':native');
				const balance = isNative ? wallet.balances?.native : wallet.balances?.tokens?.[tokenId];

				if (balance) {
					try {
						const balanceBigInt = BigInt(balance);
						if (balanceBigInt > 0n) {
							stat.addressCount++;
							stat.walletsWithBalance.push(wallet.address);
						}
					} catch {
						// Skip invalid balance values
					}
				}
			});
		});

		// Calculate batch count and simulate gas for each token
		let totalEstimatedGas = BigInt(0);

		for (const [tokenId, stat] of stats.entries()) {
			stat.batchCount = Math.ceil(stat.addressCount / BATCH_SIZE);

			if (stat.batchCount > 0 && stat.walletsWithBalance.length > 0) {
				// Simulate first batch to get accurate gas estimate
				const firstBatchGas = await simulateGasForTokenBatch(tokenId, stat.walletsWithBalance);
				// Multiply by total batch count for this token
				const tokenTotalGas = (firstBatchGas * BigInt(stat.batchCount)) / BigInt(1); // Assuming first batch is representative
				totalEstimatedGas += tokenTotalGas;
			}
		}

		// If simulation failed or returned 0, use fallback estimate
		if (totalEstimatedGas === BigInt(0)) {
			const totalBatchCount = Array.from(stats.values()).reduce(
				(sum, stat) => sum + stat.batchCount,
				0
			);
			totalEstimatedGas = BigInt(100000) * BigInt(totalBatchCount);
		}

		const breakdown = calculateFeeBreakdown(
			1, // Pass 1 as batch count since we're providing total gas directly
			totalEstimatedGas, // Use actual simulated total gas
			membershipStatus.isMember
		);

		feeBreakdown = breakdown;
	}

	function handleWalletCreated(wallet: TemporaryWallet) {
		temporaryWallet = wallet;
		// Re-check membership with signature
		checkMembershipStatus();
	}

	function handleWalletCleared() {
		temporaryWallet = null;
	}

	async function checkTemporaryWalletGasBalance(): Promise<boolean> {
		if (!temporaryWallet || !connectStore.publicClient) return false;

		try {
			const balance = await connectStore.publicClient.getBalance({
				address: temporaryWallet.address as Address
			});

			currentGasBalance = balance;

			// Check if we have enough gas (require at least estimated gas cost)
			if (feeBreakdown && balance < feeBreakdown.estimatedGasFee) {
				requiredGas = feeBreakdown.estimatedGasFee - balance;
				return false;
			}

			return true;
		} catch (error) {
			console.error('Failed to check gas balance:', error);
			return false;
		}
	}

	async function handleResumeAfterGasRefill() {
		// Check gas balance again
		const hasEnoughGas = await checkTemporaryWalletGasBalance();

		if (!hasEnoughGas) {
			errorMessage = i18n.t('tools.token_sweep.step5.content.errors.still_insufficient_gas');
			return;
		}

		// Resume execution
		isPausedForGas = false;
		errorMessage = '';

		// Continue with sweep execution
		// Note: This requires the sweep executor to support pause/resume
		// For now, user would need to restart the sweep
		alert(
			i18n.t('tools.token_sweep.step5.content.gas_refilled_restart', {
				balance: (Number(currentGasBalance) / 1e18).toFixed(6)
			})
		);
	}

	async function handleEstimateSweep() {
		if (!connectStore.currentChainId) {
			errorMessage = i18n.t('tools.token_sweep.step5.content.errors.no_network');
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
			errorMessage = i18n.t('tools.token_sweep.step5.content.errors.no_rpc');
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

		isEstimating = true;
		errorMessage = '';

		try {
			const estimate = await estimateSweep(publicClient, config);
			estimateData = estimate;
			showEstimate = true;
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : 'Failed to estimate';
		} finally {
			isEstimating = false;
		}
	}

	async function handleExecuteSweep() {
		if (!isValid) {
			errorMessage = i18n.t('tools.token_sweep.step5.content.errors.complete_fields');
			return;
		}

		if (!targetAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
			errorMessage = i18n.t('tools.token_sweep.step5.content.errors.invalid_address');
			return;
		}

		if (selectedTokenCount === 0) {
			errorMessage = i18n.t('tools.token_sweep.step5.content.errors.select_tokens');
			return;
		}

		if (walletCount === 0) {
			errorMessage = i18n.t('tools.token_sweep.step5.content.errors.import_wallets');
			return;
		}

		if (!connectStore.address) {
			errorMessage = i18n.t('tools.token_sweep.step5.content.errors.connect_wallet');
			return;
		}

		if (!connectStore.currentChainId) {
			errorMessage = i18n.t('tools.token_sweep.step5.content.errors.no_network');
			return;
		}

		// Determine which wallets to sweep
		const walletsToSweep = onlyWithBalance ? walletsWithBalance : importedWallets;
		const sweepWalletCount = walletsToSweep.length;

		if (onlyWithBalance && sweepWalletCount === 0) {
			errorMessage = i18n.t('tools.token_sweep.step5.content.errors.no_balance');
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
			errorMessage = i18n.t('tools.token_sweep.step5.content.errors.no_rpc');
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

		// Check temporary wallet gas balance before execution
		if (transactionMode === 'temporary') {
			const hasEnoughGas = await checkTemporaryWalletGasBalance();
			if (!hasEnoughGas) {
				isPausedForGas = true;
				errorMessage = i18n.t('tools.token_sweep.step5.content.errors.insufficient_gas', {
					required: (Number(requiredGas) / 1e18).toFixed(6),
					current: (Number(currentGasBalance) / 1e18).toFixed(6),
					symbol: currentNetwork?.symbol || 'ETH'
				});
				return;
			}
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

<StepContent>
	<StepContentHeader
		title={i18n.t('tools.token_sweep.step5.content.title')}
		description={i18n.t('tools.token_sweep.step5.content.description')}
	/>

	<!-- 1. Selected Tokens Display (网络和 token) -->
	<!-- Target Address (uses connected wallet address automatically) -->
	<div class="target-address-info">
		<h4>{i18n.t('tools.token_sweep.step5.target_address_label')}</h4>
		<div class="address-display">
			<span class="address">{targetAddress}</span>
			<span class="hint">{i18n.t('tools.token_sweep.step5.target_address_hint')}</span>
		</div>
	</div>

	<!-- 5. Temporary Wallet Manager (always shown, only support temporary mode) -->
	{#if feeBreakdown && currentNetwork}
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

	<!-- Gas Insufficient Warning with Resume Button -->
	{#if isPausedForGas}
		<div class="gas-warning-banner" transition:fade>
			<AlertCircle size={24} />
			<div class="gas-warning-content">
				<strong>{i18n.t('tools.token_sweep.step5.content.gas_insufficient_title')}</strong>
				<p>
					{i18n.t('tools.token_sweep.step5.content.gas_insufficient_message', {
						required: (Number(requiredGas) / 1e18).toFixed(6),
						current: (Number(currentGasBalance) / 1e18).toFixed(6),
						symbol: currentNetwork?.symbol || 'ETH'
					})}
				</p>
				<button class="btn-resume-gas" onclick={handleResumeAfterGasRefill}>
					{i18n.t('tools.token_sweep.step5.content.check_and_resume')}
				</button>
			</div>
		</div>
	{/if}

	<!-- Sweep Progress -->
	{#if isSweeping && sweepProgress}
		<SweepProgressDisplay progress={sweepProgress} />
	{/if}

	<!-- Estimate Display -->
	<EstimateDisplay {showEstimate} {estimateData} />

	<div class="warning-card">
		<CheckCircle2 size={20} />
		<div>
			<strong>{i18n.t('tools.token_sweep.step5.content.ready_to_execute')}</strong>
			<p>{i18n.t('tools.token_sweep.step5.content.review_carefully')}</p>
		</div>
	</div>

	<!-- Action Buttons -->
	<ActionButtons
		{isEstimating}
		{showEstimate}
		isExecuting={isSweeping}
		canExecute={isValid}
		onEstimate={handleEstimateSweep}
		onExecute={handleExecuteSweep}
	/>
</StepContent>

<style>
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

	.gas-warning-banner {
		display: flex;
		align-items: flex-start;
		gap: var(--space-3);
		padding: var(--space-4);
		background: hsla(45, 100%, 95%, 1);
		border: 2px solid hsl(45, 100%, 50%);
		border-radius: var(--radius-md);
		color: hsl(45, 100%, 25%);
		margin: var(--space-4) 0;
	}

	:global([data-theme='dark']) .gas-warning-banner {
		background: hsla(45, 100%, 15%, 0.3);
		border-color: hsl(45, 100%, 40%);
		color: hsl(45, 100%, 70%);
	}

	.gas-warning-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.gas-warning-content strong {
		font-size: var(--text-lg);
		display: block;
		margin-bottom: var(--space-1);
	}

	.gas-warning-content p {
		margin: 0;
		font-size: var(--text-sm);
		line-height: 1.5;
	}

	.btn-resume-gas {
		align-self: flex-start;
		padding: var(--space-2) var(--space-4);
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.2s;
		margin-top: var(--space-2);
	}

	.btn-resume-gas:hover {
		opacity: 0.9;
		transform: translateY(-1px);
	}

	:global(.spinning) {
		animation: spin 1s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.target-address-info {
		margin-bottom: var(--space-6);
		padding: var(--space-4);
		background: var(--gray-50);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
	}

	:global([data-theme='dark']) .target-address-info {
		background: var(--gray-800);
		border-color: var(--gray-700);
	}

	.target-address-info h4 {
		margin: 0 0 var(--space-2) 0;
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--color-heading-2);
	}

	.address-display {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.address-display .address {
		font-family: var(--font-mono, 'Monaco', 'Courier New', monospace);
		font-size: var(--text-sm);
		color: var(--color-text-1);
		word-break: break-all;
	}

	.address-display .hint {
		font-size: var(--text-xs);
		color: var(--gray-500);
	}
</style>
