<script lang="ts">
	import { X, Loader2 } from '@lucide/svelte';
	import type { Address, PublicClient, WalletClient } from 'viem';
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import type { NFTInfo, MintStatus } from '../../types/nft';
	import { formatAddress } from '$lib/utils/wallet-utils';

	interface Props {
		nft: NFTInfo | null;
		isOwner: boolean;
		onClose: () => void;
	}

	let { nft, isOwner, onClose }: Props = $props();

	const store = useConnectStore();

	const walletClient = $derived(store.getWalletClient ? store.getWalletClient() : null);
	const publicClient = $derived(store.publicClient);

	let mintStatus = $state<MintStatus>('idle');
	let error = $state<string | null>(null);
	let txHash = $state<string | null>(null);
	let tokenId = $state<bigint | null>(null);

	// NFT ABI for mint functions
	const NFT_ABI = [
		{
			inputs: [],
			name: 'publicMint',
			outputs: [{ name: '', type: 'uint256' }],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [
				{ name: 'to', type: 'address' },
				{ name: 'amount', type: 'uint256' }
			],
			name: 'ownerMint',
			outputs: [{ name: '', type: 'uint256' }],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [],
			name: 'stakeAmount',
			outputs: [{ name: '', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function'
		},
		{
			inputs: [],
			name: 'totalMinted',
			outputs: [{ name: '', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function'
		}
	] as const;

	// ERC20 ABI for approve
	const ERC20_ABI = [
		{
			inputs: [
				{ name: 'spender', type: 'address' },
				{ name: 'amount', type: 'uint256' }
			],
			name: 'approve',
			outputs: [{ name: '', type: 'bool' }],
			stateMutability: 'nonpayable',
			type: 'function'
		},
		{
			inputs: [
				{ name: 'owner', type: 'address' },
				{ name: 'spender', type: 'address' }
			],
			name: 'allowance',
			outputs: [{ name: '', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function'
		}
	] as const;

	async function handleMint() {
		if (!nft || !walletClient || !publicClient) return;

		try {
			mintStatus = 'minting';
			error = null;
			txHash = null;

			const account = walletClient.account?.address;
			if (!account) {
				throw new Error('No account connected');
			}

			if (isOwner) {
				// Owner mint - direct mint without stake
				const hash = await walletClient.writeContract({
					address: nft.nftAddress,
					abi: NFT_ABI,
					functionName: 'ownerMint',
					args: [account as Address, BigInt(1)],
					account
				});

				txHash = hash;

				// Wait for transaction
				const receipt = await publicClient.waitForTransactionReceipt({ hash });

				if (receipt.status === 'success') {
					// Get the minted token ID
					const totalMinted = await publicClient.readContract({
						address: nft.nftAddress,
						abi: NFT_ABI,
						functionName: 'totalMinted'
					});

					tokenId = totalMinted - BigInt(1);
					mintStatus = 'success';
				} else {
					throw new Error('Transaction failed');
				}
			} else {
				// Stake-to-mint flow
				if (!nft.stakeToMintEnabled) {
					throw new Error('Stake-to-mint is not enabled for this NFT');
				}

				// Get stake amount
				const stakeAmount = await publicClient.readContract({
					address: nft.nftAddress,
					abi: NFT_ABI,
					functionName: 'stakeAmount'
				});

				// Check allowance
				const allowance = await publicClient.readContract({
					address: nft.stakeToken,
					abi: ERC20_ABI,
					functionName: 'allowance',
					args: [account as Address, nft.nftAddress]
				});

				// Approve if needed
				if (allowance < stakeAmount) {
					mintStatus = 'approving';

					const approveHash = await walletClient.writeContract({
						address: nft.stakeToken,
						abi: ERC20_ABI,
						functionName: 'approve',
						args: [nft.nftAddress, stakeAmount],
						account
					});

					await publicClient.waitForTransactionReceipt({ hash: approveHash });
					mintStatus = 'minting';
				}

				// Public mint with stake
				const hash = await walletClient.writeContract({
					address: nft.nftAddress,
					abi: NFT_ABI,
					functionName: 'publicMint',
					account
				});

				txHash = hash;

				// Wait for transaction
				const receipt = await publicClient.waitForTransactionReceipt({ hash });

				if (receipt.status === 'success') {
					// Get the minted token ID
					const totalMinted = await publicClient.readContract({
						address: nft.nftAddress,
						abi: NFT_ABI,
						functionName: 'totalMinted'
					});

					tokenId = totalMinted - BigInt(1);
					mintStatus = 'success';
				} else {
					throw new Error('Transaction failed');
				}
			}
		} catch (err) {
			console.error('Mint error:', err);
			error = err instanceof Error ? err.message : 'Failed to mint NFT';
			mintStatus = 'error';
		}
	}

	function handleClose() {
		if (mintStatus === 'approving' || mintStatus === 'minting') {
			return; // Don't allow closing during transaction
		}
		onClose();
	}
</script>

<div class="modal-overlay" onclick={handleClose}>
	<div class="modal-content" onclick={(e) => e.stopPropagation()}>
		<div class="modal-header">
			<h2>Mint NFT</h2>
			<button
				class="close-btn"
				onclick={handleClose}
				disabled={mintStatus === 'approving' || mintStatus === 'minting'}
			>
				<X size={24} />
			</button>
		</div>

		{#if nft}
			<div class="modal-body">
				<div class="nft-info">
					<div class="info-row">
						<span class="label">NFT:</span>
						<span class="value">{nft.name} ({nft.symbol})</span>
					</div>
					<div class="info-row">
						<span class="label">Contract:</span>
						<span class="value mono">{formatAddress(nft.nftAddress)}</span>
					</div>
					{#if !isOwner && nft.stakeToMintEnabled}
						<div class="info-row">
							<span class="label">Mint Type:</span>
							<span class="value">Stake-to-Mint</span>
						</div>
						<div class="info-row">
							<span class="label">Stake Token:</span>
							<span class="value mono">{formatAddress(nft.stakeToken)}</span>
						</div>
					{/if}
					{#if isOwner}
						<div class="info-row">
							<span class="label">Mint Type:</span>
							<span class="value">Owner Mint</span>
						</div>
					{/if}
				</div>

				{#if mintStatus === 'idle'}
					<button class="mint-btn" onclick={handleMint}>
						{isOwner ? 'Mint as Owner' : 'Stake & Mint'}
					</button>
				{:else if mintStatus === 'approving'}
					<div class="status-message">
						<Loader2 class="spinner" size={24} />
						<p>Approving stake token...</p>
					</div>
				{:else if mintStatus === 'minting'}
					<div class="status-message">
						<Loader2 class="spinner" size={24} />
						<p>Minting NFT...</p>
					</div>
				{:else if mintStatus === 'success'}
					<div class="success-message">
						<p>✅ Successfully minted!</p>
						{#if tokenId !== null}
							<p class="token-id">Token ID: {tokenId.toString()}</p>
						{/if}
						{#if txHash}
							<p class="tx-hash">
								Transaction: <span class="mono">{formatAddress(txHash)}</span>
							</p>
						{/if}
					</div>
				{:else if mintStatus === 'error'}
					<div class="error-message">
						<p>❌ Mint failed</p>
						{#if error}
							<p class="error-text">{error}</p>
						{/if}
						<button class="retry-btn" onclick={handleMint}>Retry</button>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: var(--space-4);
	}

	.modal-content {
		background: var(--color-background);
		border-radius: var(--radius-lg);
		width: 100%;
		max-width: 500px;
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
	}

	:global([data-theme='dark']) .modal-content {
		background: var(--color-panel-1);
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-4);
		border-bottom: 1px solid var(--color-border);
	}

	:global([data-theme='dark']) .modal-header {
		border-color: var(--color-panel-border-2);
	}

	.modal-header h2 {
		margin: 0;
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .modal-header h2 {
		color: var(--gray-100);
	}

	.close-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-2);
		background: transparent;
		border: none;
		color: var(--gray-500);
		cursor: pointer;
		border-radius: var(--radius-md);
		transition: all 0.2s ease;
	}

	.close-btn:hover:not(:disabled) {
		background: var(--color-panel-1);
		color: var(--gray-900);
	}

	.close-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	:global([data-theme='dark']) .close-btn:hover:not(:disabled) {
		background: var(--color-panel-2);
		color: var(--gray-100);
	}

	.modal-body {
		padding: var(--space-4);
	}

	.nft-info {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		margin-bottom: var(--space-4);
		padding: var(--space-4);
		background: var(--color-panel-1);
		border-radius: var(--radius-md);
	}

	:global([data-theme='dark']) .nft-info {
		background: var(--color-panel-2);
	}

	.info-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: var(--text-sm);
	}

	.label {
		color: var(--gray-600);
		font-weight: var(--font-medium);
	}

	:global([data-theme='dark']) .label {
		color: var(--gray-400);
	}

	.value {
		color: var(--gray-900);
		font-weight: var(--font-medium);
	}

	:global([data-theme='dark']) .value {
		color: var(--gray-100);
	}

	.mono {
		font-family: var(--font-mono);
		font-size: var(--text-xs);
	}

	.mint-btn,
	.retry-btn {
		width: 100%;
		padding: var(--space-3);
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.mint-btn:hover,
	.retry-btn:hover {
		background: var(--color-primary-dark);
		transform: translateY(-1px);
	}

	.status-message,
	.success-message,
	.error-message {
		text-align: center;
		padding: var(--space-4);
	}

	.status-message {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-3);
	}

	.status-message p {
		margin: 0;
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .status-message p {
		color: var(--gray-300);
	}

	.success-message p {
		margin: 0 0 var(--space-2) 0;
		color: hsl(142, 70%, 45%);
		font-weight: var(--font-medium);
	}

	.token-id {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
	}

	.tx-hash {
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .tx-hash {
		color: var(--gray-400);
	}

	.error-message p {
		margin: 0 0 var(--space-2) 0;
		color: hsl(0, 70%, 50%);
		font-weight: var(--font-medium);
	}

	.error-text {
		font-size: var(--text-sm);
		color: var(--gray-600);
		margin-bottom: var(--space-4);
	}

	:global([data-theme='dark']) .error-text {
		color: var(--gray-400);
	}

	:global(.spinner) {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
