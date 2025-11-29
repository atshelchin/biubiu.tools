<script lang="ts">
	import type { Address } from 'viem';
	import type { NFTInfo } from '../../types/nft';
	import NFTCard from './nft-card.svelte';
	import LoadingState from '$lib/components/ui/loading-state.svelte';
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';

	interface Props {
		nfts: NFTInfo[];
		loading?: boolean;
		error?: string | null;
		currentPage: number;
		totalPages: number;
		blockExplorer?: string;
		userAddress?: Address;
		onPageChange: (page: number) => void;
		onMint?: (nftAddress: string) => void;
	}

	let {
		nfts,
		loading = false,
		error = null,
		currentPage,
		totalPages,
		blockExplorer,
		userAddress,
		onPageChange,
		onMint
	}: Props = $props();

	function handlePrevPage() {
		if (currentPage > 1) {
			onPageChange(currentPage - 1);
		}
	}

	function handleNextPage() {
		if (currentPage < totalPages) {
			onPageChange(currentPage + 1);
		}
	}
</script>

<div class="nft-list-container">
	{#if loading}
		<LoadingState message="Loading NFTs..." />
	{:else if error}
		<div class="error-message">
			<p>{error}</p>
		</div>
	{:else if nfts.length === 0}
		<div class="empty-state">
			<p>No NFTs found</p>
		</div>
	{:else}
		<div class="nft-grid">
			{#each nfts as nft (nft.nftAddress)}
				<NFTCard
					{nft}
					{blockExplorer}
					canMint={true}
					isOwner={userAddress ? nft.creator.toLowerCase() === userAddress.toLowerCase() : false}
					{onMint}
				/>
			{/each}
		</div>

		{#if totalPages > 1}
			<div class="pagination">
				<button
					class="pagination-btn"
					onclick={handlePrevPage}
					disabled={currentPage === 1}
					aria-label="Previous page"
				>
					<ChevronLeft size={20} />
					Previous
				</button>

				<div class="pagination-info">
					Page {currentPage} of {totalPages}
				</div>

				<button
					class="pagination-btn"
					onclick={handleNextPage}
					disabled={currentPage === totalPages}
					aria-label="Next page"
				>
					Next
					<ChevronRight size={20} />
				</button>
			</div>
		{/if}
	{/if}
</div>

<style>
	.nft-list-container {
		width: 100%;
	}

	.nft-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: var(--space-4);
		margin-bottom: var(--space-6);
	}

	.error-message,
	.empty-state {
		text-align: center;
		padding: var(--space-8);
		background: var(--color-panel-1);
		border: 2px dashed var(--color-border);
		border-radius: var(--radius-lg);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .error-message,
	:global([data-theme='dark']) .empty-state {
		background: var(--color-panel-2);
		border-color: var(--color-panel-border-2);
		color: var(--gray-400);
	}

	.error-message p,
	.empty-state p {
		margin: 0;
		font-size: var(--text-base);
	}

	.pagination {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-4);
		padding: var(--space-4);
		background: var(--color-background);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-lg);
	}

	:global([data-theme='dark']) .pagination {
		background: var(--color-panel-1);
		border-color: var(--color-panel-border-2);
	}

	.pagination-btn {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		color: var(--gray-700);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	:global([data-theme='dark']) .pagination-btn {
		background: var(--color-panel-2);
		border-color: var(--color-panel-border-2);
		color: var(--gray-300);
	}

	.pagination-btn:hover:not(:disabled) {
		background: var(--color-primary);
		color: white;
		border-color: var(--color-primary);
	}

	.pagination-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.pagination-info {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .pagination-info {
		color: var(--gray-300);
	}
</style>
