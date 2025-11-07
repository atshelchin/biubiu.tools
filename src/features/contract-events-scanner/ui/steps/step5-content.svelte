<script lang="ts">
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import { resultsState, scanState, contractConfigState } from '../../stores/scanner-state.svelte';
	import { eventsDB } from '../../db/events-db';
	import { Download, FileText, FileJson, Search, ChevronLeft, ChevronRight } from 'lucide-svelte';

	// Load events from scanState
	$effect(() => {
		if (scanState.scannedEvents.length > 0) {
			resultsState.setEvents(scanState.scannedEvents);
		}
	});

	// Pagination
	const paginatedEvents = $derived(resultsState.getPaginatedEvents());
	const totalPages = $derived(resultsState.getTotalPages());
	const filteredCount = $derived(resultsState.getFilteredEvents().length);
	const totalCount = $derived(resultsState.selectedEvents.length);

	// Export to CSV
	async function handleExportCSV() {
		if (!contractConfigState.contractAddress || !contractConfigState.selectedEvent) return;

		const csv = await eventsDB.exportToCSV(
			contractConfigState.contractAddress,
			contractConfigState.selectedEvent.name
		);
		const blob = new Blob([csv], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `events-${contractConfigState.selectedEvent.name}-${Date.now()}.csv`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	// Export to JSON
	async function handleExportJSON() {
		if (!contractConfigState.contractAddress || !contractConfigState.selectedEvent) return;

		const json = await eventsDB.exportToJSON(
			contractConfigState.contractAddress,
			contractConfigState.selectedEvent.name
		);
		const blob = new Blob([json], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `events-${contractConfigState.selectedEvent.name}-${Date.now()}.json`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	// Filter input
	function handleFilterInput(e: Event) {
		const input = e.target as HTMLInputElement;
		resultsState.setFilter(input.value);
	}

	// Pagination controls
	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages) {
			resultsState.setPage(page);
		}
	}

	// Sort toggle
	function toggleSort() {
		const newOrder = resultsState.sortOrder === 'asc' ? 'desc' : 'asc';
		resultsState.setSorting(resultsState.sortBy, newOrder);
	}

	// Format timestamp
	function formatTimestamp(timestamp: number): string {
		return new Date(timestamp * 1000).toLocaleString();
	}

	// Format args for display
	function formatArgs(args: Record<string, unknown>): string {
		return JSON.stringify(args, null, 2);
	}
</script>

<div class="step-content">
	<StepContentHeader title="Event Results" description="View and export your scanned events" />

	<!-- Export Actions -->
	<div class="export-section">
		<h3>Export Results</h3>
		<div class="export-buttons">
			<button class="export-btn csv" onclick={handleExportCSV}>
				<FileText size={20} />
				<span>Export as CSV</span>
				<Download size={16} />
			</button>
			<button class="export-btn json" onclick={handleExportJSON}>
				<FileJson size={20} />
				<span>Export as JSON</span>
				<Download size={16} />
			</button>
		</div>
	</div>

	<!-- Filter and Stats -->
	<div class="filter-section">
		<div class="search-box">
			<Search size={20} class="search-icon" />
			<input
				type="text"
				class="search-input"
				placeholder="Filter events by transaction hash or arguments..."
				value={resultsState.filterText}
				oninput={handleFilterInput}
			/>
		</div>
		<div class="stats">
			<span class="stat">
				Showing <strong>{paginatedEvents.length}</strong> of
				<strong>{filteredCount}</strong>
				{#if filteredCount !== totalCount}
					(filtered from <strong>{totalCount}</strong> total)
				{/if}
			</span>
		</div>
	</div>

	<!-- Events Table -->
	{#if paginatedEvents.length > 0}
		<div class="table-container">
			<table class="events-table">
				<thead>
					<tr>
						<th>
							<button class="sort-btn" onclick={toggleSort}>
								Block Number
								{#if resultsState.sortBy === 'blockNumber'}
									<span class="sort-indicator">{resultsState.sortOrder === 'asc' ? '↑' : '↓'}</span>
								{/if}
							</button>
						</th>
						<th>Timestamp</th>
						<th>Transaction Hash</th>
						<th>Event Arguments</th>
					</tr>
				</thead>
				<tbody>
					{#each paginatedEvents as event (event.id)}
						<tr>
							<td class="block-number">{event.blockNumber.toString()}</td>
							<td class="timestamp">{formatTimestamp(event.blockTimestamp)}</td>
							<td class="tx-hash">
								<code>{event.transactionHash}</code>
							</td>
							<td class="args-cell">
								<details>
									<summary>View Arguments</summary>
									<pre class="args-content">{formatArgs(event.args)}</pre>
								</details>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Pagination -->
		{#if totalPages > 1}
			<div class="pagination">
				<button
					class="page-btn"
					disabled={resultsState.currentPage === 1}
					onclick={() => goToPage(resultsState.currentPage - 1)}
				>
					<ChevronLeft size={20} />
					<span>Previous</span>
				</button>

				<div class="page-numbers">
					{#if resultsState.currentPage > 3}
						<button class="page-number" onclick={() => goToPage(1)}>1</button>
						<span class="ellipsis">...</span>
					{/if}

					{#each Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => Math.abs(p - resultsState.currentPage) <= 2) as page (page)}
						<button
							class="page-number"
							class:active={page === resultsState.currentPage}
							onclick={() => goToPage(page)}
						>
							{page}
						</button>
					{/each}

					{#if resultsState.currentPage < totalPages - 2}
						<span class="ellipsis">...</span>
						<button class="page-number" onclick={() => goToPage(totalPages)}>
							{totalPages}
						</button>
					{/if}
				</div>

				<button
					class="page-btn"
					disabled={resultsState.currentPage === totalPages}
					onclick={() => goToPage(resultsState.currentPage + 1)}
				>
					<span>Next</span>
					<ChevronRight size={20} />
				</button>
			</div>
		{/if}
	{:else}
		<div class="empty-state">
			<p>No events found matching your filter criteria.</p>
		</div>
	{/if}
</div>

<style>
	.step-content {
		padding: var(--space-6);
	}

	h3 {
		margin: 0 0 var(--space-4) 0;
		font-size: var(--text-xl);
		font-weight: var(--font-bold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) h3 {
		color: var(--gray-100);
	}

	/* Export Section */
	.export-section {
		margin-top: var(--space-6);
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
	}

	.export-buttons {
		display: flex;
		gap: var(--space-3);
		flex-wrap: wrap;
	}

	.export-btn {
		flex: 1;
		min-width: 200px;
		padding: var(--space-3) var(--space-4);
		background: var(--color-panel-0);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .export-btn {
		color: var(--gray-100);
	}

	.export-btn:hover {
		border-color: var(--color-primary);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px hsla(0, 0%, 0%, 0.1);
	}

	.export-btn.csv:hover {
		border-color: hsl(120, 60%, 50%);
		background: hsla(120, 60%, 98%, 1);
	}

	:global([data-theme='dark']) .export-btn.csv:hover {
		background: hsla(120, 60%, 15%, 0.3);
	}

	.export-btn.json:hover {
		border-color: hsl(45, 100%, 50%);
		background: hsla(45, 100%, 98%, 1);
	}

	:global([data-theme='dark']) .export-btn.json:hover {
		background: hsla(45, 100%, 15%, 0.3);
	}

	/* Filter Section */
	.filter-section {
		margin-top: var(--space-6);
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.search-box {
		position: relative;
		display: flex;
		align-items: center;
	}

	:global(.search-icon) {
		position: absolute;
		left: var(--space-3);
		color: var(--gray-400);
		pointer-events: none;
	}

	.search-input {
		width: 100%;
		padding: var(--space-3) var(--space-3) var(--space-3) var(--space-10);
		font-size: var(--text-base);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-panel-0);
		color: var(--gray-900);
		transition: all 0.2s ease;
	}

	:global([data-theme='dark']) .search-input {
		color: var(--gray-100);
	}

	.search-input:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.stats {
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .stats {
		color: var(--gray-400);
	}

	.stats strong {
		color: var(--gray-900);
		font-weight: var(--font-semibold);
	}

	:global([data-theme='dark']) .stats strong {
		color: var(--gray-100);
	}

	/* Table */
	.table-container {
		margin-top: var(--space-4);
		overflow-x: auto;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		background: var(--color-panel-0);
	}

	.events-table {
		width: 100%;
		border-collapse: collapse;
		font-size: var(--text-sm);
	}

	.events-table thead {
		background: var(--color-panel-1);
		border-bottom: 2px solid var(--color-border);
	}

	.events-table th {
		padding: var(--space-3);
		text-align: left;
		font-weight: var(--font-semibold);
		color: var(--gray-700);
		white-space: nowrap;
	}

	:global([data-theme='dark']) .events-table th {
		color: var(--gray-300);
	}

	.sort-btn {
		background: none;
		border: none;
		padding: 0;
		font: inherit;
		color: inherit;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: var(--space-1);
	}

	.sort-indicator {
		font-size: var(--text-lg);
	}

	.events-table tbody tr {
		border-bottom: 1px solid var(--color-border);
	}

	.events-table tbody tr:hover {
		background: var(--color-panel-1);
	}

	.events-table tbody tr:last-child {
		border-bottom: none;
	}

	.events-table td {
		padding: var(--space-3);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .events-table td {
		color: var(--gray-100);
	}

	.block-number,
	.timestamp {
		font-family: monospace;
		font-size: var(--text-sm);
	}

	.tx-hash code {
		font-family: monospace;
		font-size: var(--text-xs);
		background: var(--color-panel-1);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-sm);
		display: inline-block;
		max-width: 150px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.args-cell details {
		cursor: pointer;
	}

	.args-cell summary {
		color: var(--color-primary);
		font-weight: var(--font-medium);
	}

	.args-content {
		margin-top: var(--space-2);
		padding: var(--space-3);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-family: monospace;
		font-size: var(--text-xs);
		overflow-x: auto;
		max-width: 400px;
	}

	/* Pagination */
	.pagination {
		margin-top: var(--space-4);
		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--space-2);
	}

	.page-btn {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-2) var(--space-3);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		color: var(--gray-700);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	:global([data-theme='dark']) .page-btn {
		color: var(--gray-300);
	}

	.page-btn:hover:not(:disabled) {
		background: var(--color-panel-1);
		border-color: var(--color-primary);
	}

	.page-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.page-numbers {
		display: flex;
		gap: var(--space-1);
		align-items: center;
	}

	.page-number {
		min-width: 40px;
		padding: var(--space-2);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		color: var(--gray-700);
		cursor: pointer;
		transition: all 0.2s ease;
		text-align: center;
	}

	:global([data-theme='dark']) .page-number {
		color: var(--gray-300);
	}

	.page-number:hover {
		background: var(--color-panel-1);
		border-color: var(--color-primary);
	}

	.page-number.active {
		background: var(--color-primary);
		color: white;
		border-color: var(--color-primary);
	}

	.ellipsis {
		color: var(--gray-500);
		padding: 0 var(--space-2);
	}

	/* Empty State */
	.empty-state {
		margin-top: var(--space-8);
		padding: var(--space-8);
		text-align: center;
		background: var(--color-panel-1);
		border: 2px dashed var(--color-border);
		border-radius: var(--radius-lg);
	}

	.empty-state p {
		margin: 0;
		font-size: var(--text-base);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .empty-state p {
		color: var(--gray-400);
	}

	/* Responsive */
	@media (max-width: 640px) {
		.step-content {
			padding: var(--space-3);
		}

		.export-buttons {
			flex-direction: column;
		}

		.export-btn {
			min-width: 100%;
		}

		.pagination {
			flex-wrap: wrap;
		}

		.page-numbers {
			flex-wrap: wrap;
		}
	}
</style>
