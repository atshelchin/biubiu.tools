<script lang="ts">
	import { ExternalLink, Loader2, Search } from '@lucide/svelte';
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import { getUserDeployedTokens, getAllDeployedTokens } from '../utils/token-query';
	import type { DeployedTokenInfo } from '../types/token';
	import type { Address } from 'viem';

	const connectStore = useConnectStore();

	// State
	let tokens = $state<DeployedTokenInfo[]>([]);
	let isLoading = $state(false);
	let error = $state<string | null>(null);
	let showAllTokens = $state(false);
	let searchQuery = $state('');

	// Pagination
	let currentPage = $state(1);
	const itemsPerPage = 10;

	// Filtered and paginated tokens
	const filteredTokens = $derived.by(() => {
		if (!searchQuery.trim()) return tokens;

		const query = searchQuery.toLowerCase();
		return tokens.filter(
			(token) =>
				token.name.toLowerCase().includes(query) ||
				token.symbol.toLowerCase().includes(query) ||
				token.address.toLowerCase().includes(query)
		);
	});

	const paginatedTokens = $derived.by(() => {
		const start = (currentPage - 1) * itemsPerPage;
		const end = start + itemsPerPage;
		return filteredTokens.slice(start, end);
	});

	const totalPages = $derived(Math.ceil(filteredTokens.length / itemsPerPage));

	// Get current network
	const currentNetwork = $derived.by(() => {
		if (!connectStore.currentChainId) return null;
		return connectStore.networks.find((n) => n.chainId === connectStore.currentChainId);
	});

	// Load tokens
	async function loadTokens() {
		if (!connectStore.isConnected || !connectStore.currentChainId) {
			error = 'Please connect your wallet first';
			return;
		}

		isLoading = true;
		error = null;

		try {
			const publicClient = connectStore.publicClient;
			if (!publicClient) {
				throw new Error('Failed to get public client');
			}

			if (showAllTokens) {
				tokens = await getAllDeployedTokens(publicClient, connectStore.currentChainId);
			} else {
				if (!connectStore.address) {
					throw new Error('Wallet address not available');
				}
				tokens = await getUserDeployedTokens(
					publicClient,
					connectStore.address,
					connectStore.currentChainId
				);
			}

			// Reset to first page when reloading
			currentPage = 1;
		} catch (err) {
			console.error('[DeployedTokensList] Failed to load tokens:', err);
			error = err instanceof Error ? err.message : 'Failed to load tokens';
			tokens = [];
		} finally {
			isLoading = false;
		}
	}

	// Format token supply
	function formatSupply(supply: string, decimals: number): string {
		const num = BigInt(supply);
		const divisor = BigInt(10 ** decimals);
		const whole = num / divisor;
		return whole.toLocaleString();
	}

	// Copy to clipboard
	async function copyAddress(address: Address) {
		try {
			await navigator.clipboard.writeText(address);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}

	// Go to page
	function goToPage(page: number) {
		currentPage = Math.max(1, Math.min(page, totalPages));
	}

	// Watch for connection changes
	$effect(() => {
		if (connectStore.isConnected && connectStore.currentChainId) {
			loadTokens();
		}
	});
</script>

<div class="deployed-tokens-container">
	<!-- Header -->
	<div class="header">
		<h2 class="title">Deployed Tokens</h2>
		<div class="header-actions">
			<label class="filter-toggle">
				<input type="checkbox" bind:checked={showAllTokens} onchange={loadTokens} />
				<span>Show All Tokens</span>
			</label>
			<button class="refresh-button" onclick={loadTokens} disabled={isLoading}>
				<Loader2 size={16} class={isLoading ? 'spinning' : ''} />
				Refresh
			</button>
		</div>
	</div>

	<!-- Search bar -->
	<div class="search-bar">
		<Search size={20} class="search-icon" />
		<input
			type="text"
			bind:value={searchQuery}
			placeholder="Search by name, symbol, or address..."
			class="search-input"
		/>
	</div>

	<!-- Loading state -->
	{#if isLoading}
		<div class="loading-container">
			<Loader2 size={48} class="spinning" />
			<p>Loading tokens...</p>
		</div>
	{:else if error}
		<!-- Error state -->
		<div class="error-container">
			<p class="error-message">{error}</p>
			<button class="retry-button" onclick={loadTokens}>Try Again</button>
		</div>
	{:else if paginatedTokens.length === 0}
		<!-- Empty state -->
		<div class="empty-container">
			<p class="empty-message">
				{searchQuery
					? 'No tokens found matching your search'
					: showAllTokens
						? 'No tokens have been deployed yet'
						: "You haven't deployed any tokens yet"}
			</p>
		</div>
	{:else}
		<!-- Token list -->
		<div class="tokens-list">
			{#each paginatedTokens as token (token.address)}
				<div class="token-card">
					<div class="token-header">
						<div class="token-info">
							<h3 class="token-name">{token.name}</h3>
							<span class="token-symbol">{token.symbol}</span>
						</div>
						<div class="token-supply">
							<span class="supply-label">Total Supply</span>
							<span class="supply-value"
								>{formatSupply(token.totalSupply, token.decimals)} {token.symbol}</span
							>
						</div>
					</div>

					<div class="token-details">
						<div class="detail-row">
							<span class="detail-label">Contract Address</span>
							<div class="address-container">
								<button
									class="address-button"
									onclick={() => copyAddress(token.address)}
									title="Click to copy"
								>
									<span class="address-text">{token.address}</span>
								</button>
								<a
									href={`${currentNetwork?.blockExplorer}/address/${token.address}`}
									target="_blank"
									rel="noopener noreferrer"
									class="explorer-link"
									title="View on explorer"
								>
									<ExternalLink size={16} />
								</a>
							</div>
						</div>

						<div class="detail-row">
							<span class="detail-label">Decimals</span>
							<span class="detail-value">{token.decimals}</span>
						</div>

						{#if showAllTokens}
							<div class="detail-row">
								<span class="detail-label">Deployer</span>
								<span class="detail-value mono">{token.deployer}</span>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>

		<!-- Pagination -->
		{#if totalPages > 1}
			<div class="pagination">
				<button
					class="page-button"
					onclick={() => goToPage(currentPage - 1)}
					disabled={currentPage === 1}
				>
					Previous
				</button>

				<div class="page-numbers">
					{#each Array.from({ length: totalPages }, (_, index) => index) as i (i)}
						{@const page = i + 1}
						{#if page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)}
							<button
								class="page-button"
								class:active={page === currentPage}
								onclick={() => goToPage(page)}
							>
								{page}
							</button>
						{:else if page === currentPage - 2 || page === currentPage + 2}
							<span class="page-ellipsis">...</span>
						{/if}
					{/each}
				</div>

				<button
					class="page-button"
					onclick={() => goToPage(currentPage + 1)}
					disabled={currentPage === totalPages}
				>
					Next
				</button>
			</div>
		{/if}

		<!-- Results info -->
		<div class="results-info">
			Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(
				currentPage * itemsPerPage,
				filteredTokens.length
			)} of {filteredTokens.length}
			{filteredTokens.length === 1 ? 'token' : 'tokens'}
		</div>
	{/if}
</div>

<style>
	.deployed-tokens-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: var(--space-6);
	}

	/* Header */
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-6);
		flex-wrap: wrap;
		gap: var(--space-4);
	}

	.title {
		margin: 0;
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .title {
		color: var(--gray-100);
	}

	.header-actions {
		display: flex;
		gap: var(--space-3);
		align-items: center;
	}

	.filter-toggle {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		cursor: pointer;
		font-size: var(--text-sm);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .filter-toggle {
		color: var(--gray-300);
	}

	.filter-toggle input[type='checkbox'] {
		cursor: pointer;
	}

	.refresh-button {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--gray-700);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	:global([data-theme='dark']) .refresh-button {
		color: var(--gray-300);
	}

	.refresh-button:hover:not(:disabled) {
		background: var(--color-panel-2);
	}

	.refresh-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Search bar */
	.search-bar {
		position: relative;
		margin-bottom: var(--space-4);
	}

	:global(.search-icon) {
		position: absolute;
		left: var(--space-3);
		top: 50%;
		transform: translateY(-50%);
		color: var(--gray-400);
		pointer-events: none;
	}

	.search-input {
		width: 100%;
		padding: var(--space-3) var(--space-3) var(--space-3) var(--space-10);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		color: var(--gray-900);
		outline: none;
		transition: all 0.2s ease;
	}

	:global([data-theme='dark']) .search-input {
		color: var(--gray-100);
	}

	.search-input:focus {
		border-color: hsl(210, 100%, 50%);
	}

	/* Loading, error, empty states */
	.loading-container,
	.error-container,
	.empty-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: var(--space-12);
		gap: var(--space-4);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .loading-container,
	:global([data-theme='dark']) .error-container,
	:global([data-theme='dark']) .empty-container {
		color: var(--gray-400);
	}

	:global(.spinning) {
		animation: spin 1s linear infinite;
		color: hsl(210, 100%, 50%);
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.error-message {
		color: hsl(0, 70%, 50%);
		margin: 0;
	}

	.retry-button {
		padding: var(--space-2) var(--space-4);
		background: hsl(0, 70%, 50%);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: opacity 0.2s ease;
	}

	.retry-button:hover {
		opacity: 0.9;
	}

	.empty-message {
		margin: 0;
		font-size: var(--text-base);
	}

	/* Token list */
	.tokens-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.token-card {
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: var(--space-5);
		transition: all 0.2s ease;
	}

	.token-card:hover {
		border-color: hsl(210, 100%, 50%);
		box-shadow: 0 4px 12px hsla(210, 100%, 50%, 0.1);
	}

	.token-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: var(--space-4);
		gap: var(--space-4);
		flex-wrap: wrap;
	}

	.token-info {
		display: flex;
		align-items: baseline;
		gap: var(--space-3);
	}

	.token-name {
		margin: 0;
		font-size: var(--text-xl);
		font-weight: var(--font-bold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .token-name {
		color: var(--gray-100);
	}

	.token-symbol {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-600);
		padding: var(--space-1) var(--space-2);
		background: var(--color-panel-2);
		border-radius: var(--radius-sm);
	}

	:global([data-theme='dark']) .token-symbol {
		color: var(--gray-400);
	}

	.token-supply {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: var(--space-1);
	}

	.supply-label {
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .supply-label {
		color: var(--gray-400);
	}

	.supply-value {
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .supply-value {
		color: var(--gray-100);
	}

	.token-details {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.detail-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-3);
		font-size: var(--text-sm);
	}

	.detail-label {
		font-weight: var(--font-medium);
		color: var(--gray-600);
		flex-shrink: 0;
	}

	:global([data-theme='dark']) .detail-label {
		color: var(--gray-400);
	}

	.detail-value {
		font-weight: var(--font-semibold);
		color: var(--gray-900);
		text-align: right;
	}

	:global([data-theme='dark']) .detail-value {
		color: var(--gray-100);
	}

	.detail-value.mono {
		font-family: monospace;
		font-size: var(--text-xs);
		word-break: break-all;
	}

	.address-container {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.address-button {
		font-family: monospace;
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
		background: var(--color-panel-2);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		padding: var(--space-1) var(--space-2);
		cursor: pointer;
		transition: all 0.2s ease;
		max-width: 200px;
	}

	:global([data-theme='dark']) .address-button {
		color: var(--gray-100);
	}

	.address-button:hover {
		background: var(--color-panel-3);
	}

	.address-text {
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.explorer-link {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-1);
		color: hsl(210, 100%, 50%);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		background: var(--color-panel-1);
		transition: all 0.2s ease;
	}

	.explorer-link:hover {
		background: hsl(210, 100%, 95%);
		border-color: hsl(210, 100%, 50%);
	}

	:global([data-theme='dark']) .explorer-link:hover {
		background: hsl(210, 100%, 20%);
	}

	/* Pagination */
	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--space-2);
		margin-top: var(--space-6);
	}

	.page-numbers {
		display: flex;
		gap: var(--space-1);
	}

	.page-button {
		min-width: 40px;
		padding: var(--space-2) var(--space-3);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--gray-700);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	:global([data-theme='dark']) .page-button {
		color: var(--gray-300);
	}

	.page-button:hover:not(:disabled):not(.active) {
		background: var(--color-panel-2);
		border-color: hsl(210, 100%, 50%);
	}

	.page-button:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.page-button.active {
		background: hsl(210, 100%, 50%);
		border-color: hsl(210, 100%, 50%);
		color: white;
	}

	.page-ellipsis {
		display: flex;
		align-items: center;
		padding: var(--space-2) var(--space-1);
		color: var(--gray-500);
	}

	/* Results info */
	.results-info {
		text-align: center;
		margin-top: var(--space-4);
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .results-info {
		color: var(--gray-400);
	}

	/* Responsive */
	@media (max-width: 768px) {
		.deployed-tokens-container {
			padding: var(--space-4);
		}

		.header {
			flex-direction: column;
			align-items: stretch;
		}

		.header-actions {
			justify-content: space-between;
		}

		.token-header {
			flex-direction: column;
			align-items: stretch;
		}

		.token-supply {
			align-items: flex-start;
		}

		.detail-row {
			flex-direction: column;
			align-items: stretch;
		}

		.detail-value {
			text-align: left;
		}

		.address-button {
			max-width: 100%;
		}
	}
</style>
