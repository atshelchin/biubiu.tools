<script lang="ts">
	import { slide } from 'svelte/transition';
	import { Trash2, ChevronLeft, ChevronRight } from 'lucide-svelte';

	interface Wallet {
		id: string;
		address: string | `0x${string}`; // Support both string and Address type
		derivationPath?: string;
		[key: string]: unknown; // Allow additional properties
	}

	interface Props {
		/** Array of wallets to display */
		wallets: Wallet[];
		/** Items per page */
		pageSize?: number;
		/** Show pagination controls */
		showPagination?: boolean;
		/** Enable remove button */
		canRemove?: boolean;
		/** Callback when remove button is clicked */
		onRemove?: (address: string) => void;
		/** Custom empty state message */
		emptyMessage?: string;
		/** Show wallet derivation path */
		showDerivationPath?: boolean;
	}

	let {
		wallets,
		pageSize = 20,
		showPagination = true,
		canRemove = true,
		onRemove,
		emptyMessage = 'No wallets added yet',
		showDerivationPath = true
	}: Props = $props();

	// Pagination state
	let currentPage = $state(1);

	// Computed values
	const totalPages = $derived(Math.ceil(wallets.length / pageSize));
	const startIndex = $derived((currentPage - 1) * pageSize);
	const endIndex = $derived(Math.min(startIndex + pageSize, wallets.length));
	const paginatedWallets = $derived(wallets.slice(startIndex, endIndex));
	const isEmpty = $derived(wallets.length === 0);

	// Pagination controls
	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
		}
	}

	function nextPage() {
		goToPage(currentPage + 1);
	}

	function previousPage() {
		goToPage(currentPage - 1);
	}

	// Reset to page 1 when wallets change
	$effect(() => {
		if (wallets.length > 0 && currentPage > totalPages) {
			currentPage = totalPages;
		}
	});

	// Handle remove
	function handleRemove(address: string) {
		onRemove?.(address);
	}
</script>

<div class="wallet-list-container">
	{#if isEmpty}
		<!-- Empty State -->
		<div class="empty-state">
			<p>{emptyMessage}</p>
		</div>
	{:else}
		<!-- Wallet List -->
		<div class="wallet-list">
			{#each paginatedWallets as wallet (wallet.id)}
				<div class="wallet-item" transition:slide={{ duration: 200 }}>
					<div class="wallet-info">
						<code class="wallet-address">{wallet.address}</code>
						{#if showDerivationPath && wallet.derivationPath}
							<small class="wallet-path">{wallet.derivationPath}</small>
						{/if}
					</div>
					{#if canRemove}
						<button
							class="btn-icon-danger"
							onclick={() => handleRemove(wallet.address)}
							title="Remove wallet"
						>
							<Trash2 size={16} />
						</button>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Pagination Controls -->
		{#if showPagination && totalPages > 1}
			<div class="pagination">
				<div class="pagination-info">
					Showing {startIndex + 1}-{endIndex} of {wallets.length}
				</div>
				<div class="pagination-controls">
					<button
						class="pagination-btn"
						onclick={previousPage}
						disabled={currentPage === 1}
						title="Previous page"
					>
						<ChevronLeft size={18} />
					</button>

					<div class="page-numbers">
						{#if totalPages <= 7}
							<!-- Show all pages if total is 7 or less -->
							<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
							{#each { length: totalPages } as _, i (i)}
								<button
									class="page-btn"
									class:active={currentPage === i + 1}
									onclick={() => goToPage(i + 1)}
								>
									{i + 1}
								</button>
							{/each}
						{:else}
							<!-- Show first page -->
							<button class="page-btn" class:active={currentPage === 1} onclick={() => goToPage(1)}>
								1
							</button>

							{#if currentPage > 3}
								<span class="ellipsis">...</span>
							{/if}

							<!-- Show pages around current page -->
							<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
							{#each { length: 5 } as _, i (i)}
								{@const pageNum = Math.max(2, Math.min(currentPage - 2 + i, totalPages - 1))}
								{#if pageNum > 1 && pageNum < totalPages && (i === 0 || pageNum !== Math.max(2, Math.min(currentPage - 2 + i - 1, totalPages - 1)))}
									<button
										class="page-btn"
										class:active={currentPage === pageNum}
										onclick={() => goToPage(pageNum)}
									>
										{pageNum}
									</button>
								{/if}
							{/each}

							{#if currentPage < totalPages - 2}
								<span class="ellipsis">...</span>
							{/if}

							<!-- Show last page -->
							<button
								class="page-btn"
								class:active={currentPage === totalPages}
								onclick={() => goToPage(totalPages)}
							>
								{totalPages}
							</button>
						{/if}
					</div>

					<button
						class="pagination-btn"
						onclick={nextPage}
						disabled={currentPage === totalPages}
						title="Next page"
					>
						<ChevronRight size={18} />
					</button>
				</div>
			</div>
		{/if}
	{/if}
</div>

<style>
	.wallet-list-container {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	/* Empty State */
	.empty-state {
		text-align: center;
		padding: var(--space-8) var(--space-4);
		color: var(--gray-500);
		background: var(--color-panel-1);
		border: 1px dashed var(--color-border);
		border-radius: var(--radius-md);
	}

	.empty-state p {
		margin: 0;
		font-size: var(--text-base);
	}

	/* Wallet List */
	.wallet-list {
		max-height: 500px;
		overflow-y: auto;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-panel-1);
	}

	/* Scrollbar styling */
	.wallet-list::-webkit-scrollbar {
		width: 8px;
	}

	.wallet-list::-webkit-scrollbar-track {
		background: var(--gray-200);
		border-radius: var(--radius-md);
	}

	.wallet-list::-webkit-scrollbar-thumb {
		background: var(--gray-400);
		border-radius: var(--radius-md);
		transition: background 0.2s;
	}

	.wallet-list::-webkit-scrollbar-thumb:hover {
		background: var(--gray-500);
	}

	:global([data-theme='dark']) .wallet-list::-webkit-scrollbar-track {
		background: var(--gray-800);
	}

	:global([data-theme='dark']) .wallet-list::-webkit-scrollbar-thumb {
		background: var(--gray-600);
	}

	:global([data-theme='dark']) .wallet-list::-webkit-scrollbar-thumb:hover {
		background: var(--gray-500);
	}

	/* Wallet Item */
	.wallet-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-3);
		border-bottom: 1px solid var(--color-border);
		transition: background 0.2s;
	}

	.wallet-item:last-child {
		border-bottom: none;
	}

	.wallet-item:hover {
		background: rgba(0, 0, 0, 0.02);
	}

	:global([data-theme='dark']) .wallet-item:hover {
		background: rgba(255, 255, 255, 0.02);
	}

	.wallet-info {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.wallet-address {
		display: block;
		font-size: var(--text-sm);
		font-family: monospace;
		color: var(--gray-900);
		word-break: break-all;
	}

	:global([data-theme='dark']) .wallet-address {
		color: var(--gray-100);
	}

	.wallet-path {
		display: block;
		font-size: var(--text-xs);
		color: var(--gray-500);
		font-family: monospace;
	}

	.btn-icon-danger {
		background: none;
		border: none;
		color: hsl(0, 70%, 50%);
		cursor: pointer;
		padding: var(--space-2);
		border-radius: var(--radius-sm);
		transition: all 0.2s;
		flex-shrink: 0;
	}

	.btn-icon-danger:hover {
		background: hsla(0, 70%, 50%, 0.1);
		color: hsl(0, 80%, 40%);
	}

	/* Pagination */
	.pagination {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		padding: var(--space-3);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
	}

	.pagination-info {
		font-size: var(--text-sm);
		color: var(--gray-600);
		text-align: center;
	}

	:global([data-theme='dark']) .pagination-info {
		color: var(--gray-400);
	}

	.pagination-controls {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
	}

	.pagination-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		padding: 0;
		background: var(--white);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		color: var(--gray-700);
		cursor: pointer;
		transition: all 0.2s;
	}

	:global([data-theme='dark']) .pagination-btn {
		background: var(--gray-700);
		color: var(--gray-300);
	}

	.pagination-btn:hover:not(:disabled) {
		background: var(--color-primary);
		border-color: var(--color-primary);
		color: white;
	}

	.pagination-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.page-numbers {
		display: flex;
		align-items: center;
		gap: var(--space-1);
	}

	.page-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 36px;
		height: 36px;
		padding: 0 var(--space-2);
		background: var(--white);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		color: var(--gray-700);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.2s;
	}

	:global([data-theme='dark']) .page-btn {
		background: var(--gray-700);
		color: var(--gray-300);
	}

	.page-btn:hover {
		background: var(--color-primary);
		border-color: var(--color-primary);
		color: white;
	}

	.page-btn.active {
		background: var(--color-primary);
		border-color: var(--color-primary);
		color: white;
		cursor: default;
	}

	.ellipsis {
		color: var(--gray-500);
		font-size: var(--text-sm);
		padding: 0 var(--space-1);
	}

	/* Mobile Responsive */
	@media (max-width: 640px) {
		.wallet-list {
			max-height: 400px;
		}

		.wallet-item {
			padding: var(--space-2);
		}

		.pagination {
			padding: var(--space-2);
		}

		.page-btn,
		.pagination-btn {
			width: 32px;
			height: 32px;
			min-width: 32px;
		}

		.page-numbers {
			gap: 2px;
		}
	}
</style>
