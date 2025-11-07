<script lang="ts">
	import { monitorState } from '../../stores/monitor-state.svelte';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import { Download, ExternalLink, TrendingUp, TrendingDown, Activity } from 'lucide-svelte';
	import { formatUnits } from 'viem';

	// Tab state
	let activeTab = $state<'movements' | 'balances' | 'analytics'>('movements');

	// Filter state
	let searchQuery = $state('');
	let filterAssetType = $state<string>('all');
	let filterDirection = $state<string>('all');

	// Computed filtered movements
	const filteredMovements = $derived(() => {
		let filtered = [...monitorState.movements];

		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(m) =>
					m.txHash.toLowerCase().includes(query) ||
					m.tokenSymbol?.toLowerCase().includes(query) ||
					m.tokenName?.toLowerCase().includes(query)
			);
		}

		if (filterAssetType !== 'all') {
			filtered = filtered.filter((m) => m.assetType === filterAssetType);
		}

		if (filterDirection !== 'all') {
			filtered = filtered.filter((m) => m.direction === filterDirection);
		}

		return filtered;
	});

	function exportToCSV() {
		const movements = filteredMovements();
		const headers = [
			'Tx Hash',
			'Block',
			'Timestamp',
			'Direction',
			'Asset Type',
			'Token',
			'Amount',
			'From',
			'To'
		];
		const rows = movements.map((m) => [
			m.txHash,
			m.blockNumber,
			new Date(m.timestamp).toISOString(),
			m.direction,
			m.assetType,
			m.tokenSymbol || 'ETH',
			m.formattedValue || m.value || '',
			m.from,
			m.to
		]);

		const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
		const blob = new Blob([csv], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `asset-movements-${Date.now()}.csv`;
		a.click();
	}

	function formatDate(timestamp: number) {
		return new Date(timestamp).toLocaleString();
	}

	function getExplorerUrl(txHash: string) {
		const chainId = monitorState.scanConfig?.chainId;
		const explorers: Record<number, string> = {
			1: 'https://etherscan.io',
			137: 'https://polygonscan.com',
			56: 'https://bscscan.com',
			42161: 'https://arbiscan.io',
			10: 'https://optimistic.etherscan.io',
			8453: 'https://basescan.org'
		};
		const baseUrl = explorers[chainId || 1];
		return `${baseUrl}/tx/${txHash}`;
	}
</script>

<div class="step-content">
	<StepContentHeader
		title="Asset Movements Analysis"
		description="View and analyze scanned asset movements"
	/>

	<!-- Tabs -->
	<div class="tabs">
		<button
			class="tab"
			class:active={activeTab === 'movements'}
			onclick={() => (activeTab = 'movements')}
		>
			<Activity size={18} />
			Movements ({monitorState.movements.length})
		</button>
		<button
			class="tab"
			class:active={activeTab === 'balances'}
			onclick={() => (activeTab = 'balances')}
		>
			<Activity size={18} />
			Balances ({monitorState.balances.length})
		</button>
	</div>

	{#if activeTab === 'movements'}
		<!-- Filters -->
		<div class="filters-section">
			<div class="search-box">
				<input type="text" placeholder="Search by hash, token..." bind:value={searchQuery} />
			</div>
			<div class="filter-controls">
				<select bind:value={filterAssetType}>
					<option value="all">All Assets</option>
					<option value="native">Native (ETH)</option>
					<option value="erc20">ERC-20</option>
					<option value="erc721">ERC-721</option>
				</select>
				<select bind:value={filterDirection}>
					<option value="all">All Directions</option>
					<option value="in">Incoming</option>
					<option value="out">Outgoing</option>
				</select>
				<button class="export-btn" onclick={exportToCSV}>
					<Download size={16} />
					Export CSV
				</button>
			</div>
		</div>

		<!-- Movements List -->
		<div class="movements-list">
			{#each filteredMovements() as movement (movement.id)}
				<div class="movement-card">
					<div class="movement-header">
						<span class="direction-badge" class:incoming={movement.direction === 'in'}>
							{#if movement.direction === 'in'}
								<TrendingUp size={14} />
								Incoming
							{:else}
								<TrendingDown size={14} />
								Outgoing
							{/if}
						</span>
						<span class="asset-type">{movement.assetType.toUpperCase()}</span>
					</div>

					<div class="movement-content">
						<div class="movement-row">
							<span class="label">Token:</span>
							<span class="value token">{movement.tokenSymbol || 'ETH'}</span>
						</div>
						<div class="movement-row">
							<span class="label">Amount:</span>
							<span class="value">{movement.formattedValue || movement.value || 'N/A'}</span>
						</div>
						<div class="movement-row">
							<span class="label">Block:</span>
							<span class="value">{movement.blockNumber.toLocaleString()}</span>
						</div>
						<div class="movement-row">
							<span class="label">Time:</span>
							<span class="value">{formatDate(movement.timestamp)}</span>
						</div>
						<div class="movement-row">
							<span class="label">Tx Hash:</span>
							<a
								href={getExplorerUrl(movement.txHash)}
								target="_blank"
								rel="noopener noreferrer"
								class="tx-link"
							>
								{movement.txHash.slice(0, 10)}...{movement.txHash.slice(-8)}
								<ExternalLink size={12} />
							</a>
						</div>
					</div>
				</div>
			{:else}
				<div class="empty-state">
					<p>No movements found matching your filters</p>
				</div>
			{/each}
		</div>
	{:else}
		<!-- Balances Summary -->
		<div class="balances-grid">
			{#each monitorState.balances as balance (balance.tokenAddress || balance.assetType)}
				<div class="balance-card">
					<div class="balance-header">
						<h3>{balance.tokenSymbol || 'ETH'}</h3>
						<span class="asset-type">{balance.assetType.toUpperCase()}</span>
					</div>
					<div class="balance-content">
						{#if balance.tokenDecimals && balance.balance}
							<div class="balance-amount">
								{formatUnits(BigInt(balance.balance), balance.tokenDecimals)}
							</div>
						{/if}
						<div class="balance-stats">
							<div class="stat-row">
								<span>Transactions:</span>
								<span>{balance.transactionCount || 0}</span>
							</div>
						</div>
					</div>
				</div>
			{:else}
				<div class="empty-state">
					<p>No balances data available</p>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.step-content {
		padding: var(--space-6);
		max-width: 1200px;
		margin: 0 auto;
	}

	/* Tabs */
	.tabs {
		display: flex;
		gap: var(--space-2);
		margin: var(--space-6) 0;
		border-bottom: 2px solid var(--color-border);
	}

	.tab {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-4);
		background: none;
		border: none;
		border-bottom: 2px solid transparent;
		margin-bottom: -2px;
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-description-2);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.tab:hover {
		color: var(--color-heading-2);
		background: var(--color-panel-1);
	}

	.tab.active {
		color: var(--color-primary);
		border-bottom-color: var(--color-primary);
	}

	/* Filters */
	.filters-section {
		margin: var(--space-6) 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.search-box input {
		width: 100%;
		padding: var(--space-3);
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-base);
	}

	.filter-controls {
		display: flex;
		gap: var(--space-3);
		flex-wrap: wrap;
	}

	.filter-controls select {
		padding: var(--space-2) var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
	}

	.export-btn {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.export-btn:hover {
		background: var(--brand-700);
	}

	/* Movements List */
	.movements-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.movement-card {
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: var(--space-4);
		transition: all 0.2s ease;
	}

	.movement-card:hover {
		border-color: var(--color-primary);
		transform: translateY(-1px);
	}

	.movement-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-3);
		padding-bottom: var(--space-3);
		border-bottom: 1px solid var(--color-border);
	}

	.direction-badge {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-1) var(--space-3);
		background: var(--color-panel-2);
		border-radius: var(--radius-full);
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		color: var(--color-error);
	}

	.direction-badge.incoming {
		color: var(--color-success);
	}

	.asset-type {
		font-size: var(--text-xs);
		font-weight: var(--font-bold);
		color: var(--color-description-2);
		text-transform: uppercase;
	}

	.movement-content {
		display: grid;
		gap: var(--space-2);
	}

	.movement-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: var(--text-sm);
	}

	.movement-row .label {
		color: var(--color-description-2);
		font-weight: var(--font-medium);
	}

	.movement-row .value {
		color: var(--color-heading-2);
		font-weight: var(--font-semibold);
	}

	.movement-row .value.token {
		font-family: 'Monaco', 'Menlo', monospace;
	}

	.tx-link {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		color: var(--color-primary);
		text-decoration: none;
		font-family: 'Monaco', 'Menlo', monospace;
		font-size: var(--text-xs);
	}

	.tx-link:hover {
		text-decoration: underline;
	}

	/* Balances Grid */
	.balances-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: var(--space-4);
		margin-top: var(--space-6);
	}

	.balance-card {
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: var(--space-6);
	}

	.balance-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-4);
	}

	.balance-header h3 {
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		color: var(--color-heading-1);
		margin: 0;
	}

	.balance-amount {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--color-primary);
		margin-bottom: var(--space-4);
		font-family: 'Monaco', 'Menlo', monospace;
	}

	.balance-stats {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.stat-row {
		display: flex;
		justify-content: space-between;
		font-size: var(--text-sm);
		color: var(--color-description-3);
	}

	/* Empty State */
	.empty-state {
		padding: var(--space-12);
		text-align: center;
		background: var(--color-panel-1);
		border: 2px dashed var(--color-border);
		border-radius: var(--radius-lg);
	}

	.empty-state p {
		margin: 0;
		font-size: var(--text-base);
		color: var(--color-description-3);
	}

	/* Responsive */
	@media (max-width: 640px) {
		.step-content {
			padding: var(--space-4);
		}

		.filter-controls {
			flex-direction: column;
		}

		.filter-controls select,
		.export-btn {
			width: 100%;
		}
	}
</style>
