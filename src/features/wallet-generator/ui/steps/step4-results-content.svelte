<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { createGeneratorState } from '@/features/wallet-generator/stores/generator-state.svelte';
	import { generateWalletsBatch } from '@/features/wallet-generator/utils/wallet-generator';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';

	const generatorState = createGeneratorState();

	let generating = $state(false);
	let error = $state<string | null>(null);
	let showPrivateKeys = $state(false);
	let selectedWallets = new SvelteSet<number>();

	// Start generation on mount if no wallets exist
	onMount(() => {
		if (generatorState.generatedWallets.length === 0 && !generating) {
			startGeneration();
		}
	});

	async function startGeneration() {
		generating = true;
		error = null;

		try {
			const config = generatorState.getConfig();
			generatorState.startGeneration(config.count);

			const wallets = await generateWalletsBatch(config, 10, (current, total) => {
				generatorState.updateProgress({
					current,
					total,
					percentage: Math.round((current / total) * 100)
				});
			});

			generatorState.setGeneratedWallets(wallets);
			generatorState.completeGeneration();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Unknown error occurred';
			console.error('Generation error:', err);
		} finally {
			generating = false;
		}
	}

	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text);
		// TODO: Show toast notification
	}

	function togglePrivateKeys() {
		showPrivateKeys = !showPrivateKeys;
	}

	function toggleWalletSelection(index: number) {
		if (selectedWallets.has(index)) {
			selectedWallets.delete(index);
		} else {
			selectedWallets.add(index);
		}
		selectedWallets = selectedWallets; // Trigger reactivity
	}

	function selectAll() {
		selectedWallets = new Set(generatorState.generatedWallets.map((w) => w.index));
	}

	function deselectAll() {
		selectedWallets = new Set();
	}

	function downloadCSV() {
		const headers = ['Index', 'Address', 'Private Key', 'Path'];
		const rows = generatorState.generatedWallets.map((w) => [
			w.index.toString(),
			w.address,
			w.privateKey,
			w.path
		]);

		const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
		const blob = new Blob([csv], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `wallets-${Date.now()}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}

	function downloadJSON() {
		const data = {
			generatedAt: new Date().toISOString(),
			blockchain: generatorState.blockchain,
			hdPath: generatorState.hdPath,
			wallets: generatorState.generatedWallets
		};

		const json = JSON.stringify(data, null, 2);
		const blob = new Blob([json], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `wallets-${Date.now()}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<div class="step-content">
	<StepContentHeader
		title="Generated Wallets"
		description="Your wallets have been generated. Export them securely."
	/>

	<!-- Progress Section -->
	{#if generating}
		<div class="progress-section">
			<div class="progress-info">
				<h3>Generating Wallets...</h3>
				<p>{generatorState.progress.current} / {generatorState.progress.total} wallets generated</p>
			</div>
			<div class="progress-bar">
				<div class="progress-fill" style="width: {generatorState.progress.percentage}%"></div>
			</div>
			<p class="progress-percentage">{generatorState.progress.percentage}%</p>
		</div>
	{/if}

	<!-- Error Section -->
	{#if error}
		<div class="error-section">
			<span class="error-icon">⚠️</span>
			<div>
				<h3>Generation Failed</h3>
				<p>{error}</p>
				<button class="retry-button" onclick={startGeneration}>Retry</button>
			</div>
		</div>
	{/if}

	<!-- Results Section -->
	{#if generatorState.generatedWallets.length > 0 && !generating}
		<div class="results-section">
			<!-- Action Bar -->
			<div class="action-bar">
				<div class="action-left">
					<button class="action-button secondary" onclick={selectAll}>Select All</button>
					<button class="action-button secondary" onclick={deselectAll}>Deselect All</button>
					<button class="action-button secondary" onclick={togglePrivateKeys}>
						{showPrivateKeys ? 'Hide' : 'Show'} Private Keys
					</button>
				</div>
				<div class="action-right">
					<button class="action-button primary" onclick={downloadCSV}>
						<span>📥</span>
						<span>Download CSV</span>
					</button>
					<button class="action-button primary" onclick={downloadJSON}>
						<span>📥</span>
						<span>Download JSON</span>
					</button>
				</div>
			</div>

			<!-- Results Table -->
			<div class="table-container">
				<table class="results-table">
					<thead>
						<tr>
							<th class="col-select">
								<input
									type="checkbox"
									checked={selectedWallets.size === generatorState.generatedWallets.length}
									onchange={selectedWallets.size === generatorState.generatedWallets.length
										? deselectAll
										: selectAll}
								/>
							</th>
							<th class="col-index">#</th>
							<th class="col-address">Address</th>
							<th class="col-key">Private Key</th>
							<th class="col-actions">Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each generatorState.generatedWallets as wallet (wallet.index)}
							<tr class:selected={selectedWallets.has(wallet.index)}>
								<td class="col-select">
									<input
										type="checkbox"
										checked={selectedWallets.has(wallet.index)}
										onchange={() => toggleWalletSelection(wallet.index)}
									/>
								</td>
								<td class="col-index">{wallet.index}</td>
								<td class="col-address">
									<code class="address-text">{wallet.address}</code>
								</td>
								<td class="col-key">
									{#if showPrivateKeys}
										<code class="key-text">{wallet.privateKey}</code>
									{:else}
										<span class="key-hidden">••••••••••••••••</span>
									{/if}
								</td>
								<td class="col-actions">
									<button
										class="icon-button"
										onclick={() => copyToClipboard(wallet.address)}
										title="Copy Address"
									>
										📋
									</button>
									{#if showPrivateKeys}
										<button
											class="icon-button"
											onclick={() => copyToClipboard(wallet.privateKey)}
											title="Copy Private Key"
										>
											🔑
										</button>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<!-- Summary Stats -->
			<div class="summary-stats">
				<div class="stat-item">
					<span class="stat-label">Total Wallets:</span>
					<span class="stat-value">{generatorState.generatedWallets.length}</span>
				</div>
				<div class="stat-item">
					<span class="stat-label">Selected:</span>
					<span class="stat-value">{selectedWallets.size}</span>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.step-content {
		max-width: 1200px;
		margin: 0 auto;
	}

	/* Progress Section */
	.progress-section {
		margin: var(--space-8) 0;
		padding: var(--space-6);
		background: var(--color-panel-1);
		border-radius: var(--radius-lg);
		border: 2px solid var(--color-border);
	}

	.progress-info h3 {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
		margin: 0 0 var(--space-2);
	}

	.progress-info p {
		font-size: var(--text-base);
		color: var(--gray-600);
		margin: 0;
	}

	.progress-bar {
		width: 100%;
		height: 12px;
		background: var(--color-panel-2);
		border-radius: var(--radius-full);
		overflow: hidden;
		margin: var(--space-4) 0;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, hsl(210, 100%, 50%), hsl(210, 100%, 40%));
		transition: width 0.3s ease;
	}

	.progress-percentage {
		text-align: center;
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--color-primary);
		margin: var(--space-2) 0 0;
	}

	/* Error Section */
	.error-section {
		margin: var(--space-8) 0;
		padding: var(--space-6);
		background: hsla(0, 70%, 95%, 1);
		border: 2px solid hsla(0, 70%, 80%, 1);
		border-radius: var(--radius-lg);
		display: flex;
		gap: var(--space-4);
		align-items: flex-start;
	}

	.error-icon {
		font-size: 2rem;
	}

	.error-section h3 {
		font-size: var(--text-lg);
		color: hsl(0, 70%, 40%);
		margin: 0 0 var(--space-2);
	}

	.error-section p {
		color: hsl(0, 70%, 35%);
		margin: 0 0 var(--space-3);
	}

	.retry-button {
		padding: var(--space-2) var(--space-4);
		background: hsl(0, 70%, 50%);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-weight: var(--font-semibold);
		cursor: pointer;
	}

	/* Action Bar */
	.action-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-4);
		margin-bottom: var(--space-4);
		flex-wrap: wrap;
	}

	.action-left,
	.action-right {
		display: flex;
		gap: var(--space-2);
		flex-wrap: wrap;
	}

	.action-button {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		border: none;
		border-radius: var(--radius-md);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.action-button.secondary {
		background: var(--color-panel-1);
		color: var(--gray-900);
		border: 2px solid var(--color-border);
	}

	.action-button.secondary:hover {
		border-color: var(--color-primary);
	}

	.action-button.primary {
		background: var(--color-primary);
		color: white;
	}

	.action-button.primary:hover {
		filter: brightness(1.1);
	}

	/* Table */
	.table-container {
		overflow-x: auto;
		border: 2px solid var(--color-border);
		border-radius: var(--radius-lg);
	}

	.results-table {
		width: 100%;
		border-collapse: collapse;
		background: var(--color-panel-1);
	}

	.results-table thead {
		background: var(--color-panel-2);
	}

	.results-table th,
	.results-table td {
		padding: var(--space-3);
		text-align: left;
		border-bottom: 1px solid var(--color-border);
	}

	.results-table th {
		font-weight: var(--font-semibold);
		color: var(--gray-900);
		font-size: var(--text-sm);
		text-transform: uppercase;
	}

	.results-table tbody tr:hover {
		background: var(--color-panel-2);
	}

	.results-table tbody tr.selected {
		background: hsla(210, 100%, 50%, 0.05);
	}

	.col-select {
		width: 40px;
		text-align: center;
	}

	.col-index {
		width: 60px;
		font-weight: var(--font-medium);
	}

	.col-address {
		min-width: 300px;
	}

	.col-key {
		min-width: 200px;
	}

	.col-actions {
		width: 100px;
		text-align: center;
	}

	.address-text,
	.key-text {
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		font-size: var(--text-sm);
		color: var(--gray-800);
		word-break: break-all;
	}

	.key-hidden {
		color: var(--gray-400);
		font-size: var(--text-lg);
	}

	.icon-button {
		padding: var(--space-1) var(--space-2);
		background: transparent;
		border: none;
		cursor: pointer;
		font-size: var(--text-lg);
		transition: transform 0.2s ease;
	}

	.icon-button:hover {
		transform: scale(1.2);
	}

	/* Summary Stats */
	.summary-stats {
		display: flex;
		gap: var(--space-6);
		margin-top: var(--space-4);
		padding: var(--space-4);
		background: var(--color-panel-1);
		border-radius: var(--radius-md);
	}

	.stat-item {
		display: flex;
		gap: var(--space-2);
		align-items: center;
	}

	.stat-label {
		font-weight: var(--font-medium);
		color: var(--gray-600);
	}

	.stat-value {
		font-weight: var(--font-semibold);
		color: var(--gray-900);
		font-size: var(--text-lg);
	}

	@media (max-width: 768px) {
		.action-bar {
			flex-direction: column;
			align-items: stretch;
		}

		.action-left,
		.action-right {
			width: 100%;
			justify-content: center;
		}

		.results-table {
			font-size: var(--text-sm);
		}

		.results-table th,
		.results-table td {
			padding: var(--space-2);
		}
	}
</style>
