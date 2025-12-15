<script lang="ts">
	import type { NFTInfo } from '../../types/nft';
	import { ExternalLink, Image } from '@lucide/svelte';
	import { slide } from 'svelte/transition';
	import CopyButton from '$lib/components/ui/copy-button.svelte';
	import { formatAddress } from '$lib/utils/wallet-utils';

	interface Props {
		nft: NFTInfo;
		blockExplorer?: string;
		onMint?: (nftAddress: string) => void;
		canMint?: boolean;
		isOwner?: boolean;
	}

	let { nft, blockExplorer, onMint, canMint = false, isOwner = false }: Props = $props();

	function handleMint() {
		onMint?.(nft.nftAddress);
	}

	const explorerUrl = $derived(
		blockExplorer ? `${blockExplorer}/address/${nft.nftAddress}` : undefined
	);
</script>

<div class="nft-card" transition:slide={{ duration: 200 }}>
	<div class="nft-card-header">
		<div class="nft-icon">
			<Image size={32} />
		</div>
		<div class="nft-info">
			<h3 class="nft-name">{nft.name}</h3>
			<p class="nft-symbol">{nft.symbol}</p>
		</div>
		{#if canMint}
			<button class="mint-btn" onclick={handleMint}>
				{isOwner ? 'Owner Mint' : 'Stake & Mint'}
			</button>
		{/if}
	</div>

	<div class="nft-details">
		<div class="detail-row">
			<span class="label">Contract:</span>
			<div class="address-group">
				<span class="address" title={nft.nftAddress}>
					{formatAddress(nft.nftAddress)}
				</span>
				<!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
				<span onclick={(e) => e.stopPropagation()}>
					<CopyButton value={nft.nftAddress} size={14} />
				</span>
				{#if explorerUrl}
					<a href={explorerUrl} target="_blank" rel="noopener noreferrer" class="explorer-link">
						<ExternalLink size={14} />
					</a>
				{/if}
			</div>
		</div>

		<div class="detail-row">
			<span class="label">Creator:</span>
			<div class="address-group">
				<span class="address" title={nft.creator}>
					{formatAddress(nft.creator)}
				</span>
				<!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
				<span onclick={(e) => e.stopPropagation()}>
					<CopyButton value={nft.creator} size={14} />
				</span>
			</div>
		</div>

		{#if nft.stakeToMintEnabled}
			<div class="detail-row">
				<span class="label">Stake Token:</span>
				<div class="address-group">
					<span class="address" title={nft.stakeToken}>
						{formatAddress(nft.stakeToken)}
					</span>
					<!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
					<span onclick={(e) => e.stopPropagation()}>
						<CopyButton value={nft.stakeToken} size={14} />
					</span>
				</div>
			</div>
		{/if}

		<div class="badges">
			{#if nft.stakeToMintEnabled}
				<span class="badge stake-badge">Stake-to-Mint</span>
			{/if}
			{#if isOwner}
				<span class="badge owner-badge">Your NFT</span>
			{/if}
		</div>
	</div>
</div>

<style>
	.nft-card {
		background: var(--color-background);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: var(--space-4);
		transition: all 0.2s ease;
	}

	.nft-card:hover {
		background: var(--color-panel-1);
		border-color: var(--color-primary);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	:global([data-theme='dark']) .nft-card {
		background: var(--color-panel-1);
		border-color: var(--color-panel-border-2);
	}

	:global([data-theme='dark']) .nft-card:hover {
		background: var(--color-panel-2);
		border-color: var(--color-primary);
	}

	.nft-card-header {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		margin-bottom: var(--space-4);
	}

	.nft-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		background: var(--color-panel-1);
		border-radius: var(--radius-md);
		color: var(--color-primary);
	}

	:global([data-theme='dark']) .nft-icon {
		background: var(--color-panel-2);
	}

	.nft-info {
		flex: 1;
	}

	.nft-name {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
		margin: 0 0 var(--space-1) 0;
	}

	:global([data-theme='dark']) .nft-name {
		color: var(--gray-100);
	}

	.nft-symbol {
		font-size: var(--text-sm);
		color: var(--gray-500);
		margin: 0;
	}

	:global([data-theme='dark']) .nft-symbol {
		color: var(--gray-400);
	}

	.mint-btn {
		padding: var(--space-2) var(--space-3);
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.mint-btn:hover {
		background: var(--color-primary-dark);
		transform: translateY(-1px);
	}

	.nft-details {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.detail-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-2);
		font-size: var(--text-sm);
	}

	.label {
		color: var(--gray-600);
		font-weight: var(--font-medium);
	}

	:global([data-theme='dark']) .label {
		color: var(--gray-400);
	}

	.address-group {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.address {
		color: var(--gray-700);
		font-family: var(--font-mono);
		font-size: var(--text-xs);
	}

	:global([data-theme='dark']) .address {
		color: var(--gray-300);
	}

	.explorer-link {
		display: flex;
		align-items: center;
		color: var(--color-primary);
		transition: color 0.2s ease;
	}

	.explorer-link:hover {
		color: var(--color-primary-dark);
	}

	.badges {
		display: flex;
		gap: var(--space-2);
		flex-wrap: wrap;
		margin-top: var(--space-2);
	}

	.badge {
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-sm);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
	}

	.stake-badge {
		background: hsla(var(--brand-hue), 70%, 50%, 0.1);
		color: var(--color-primary);
		border: 1px solid var(--color-primary);
	}

	.owner-badge {
		background: hsla(142, 70%, 45%, 0.1);
		color: hsl(142, 70%, 45%);
		border: 1px solid hsl(142, 70%, 45%);
	}

	:global([data-theme='dark']) .stake-badge {
		background: hsla(var(--brand-hue), 70%, 50%, 0.2);
	}

	:global([data-theme='dark']) .owner-badge {
		background: hsla(142, 70%, 45%, 0.2);
	}
</style>
