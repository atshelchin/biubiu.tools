<script lang="ts">
	import Modal from './modal.svelte';
	import { Check, Plus, Trash2, Edit2, ArrowLeft, ExternalLink } from 'lucide-svelte';
	import NetworkIcon from './network-icon.svelte';
	import type { NetworkConfig } from '@shelchin/ethereum-connectors';

	interface Props {
		open: boolean;
		networks: NetworkConfig[];
		currentChainId?: number;
		onClose: () => void;
		onToggleNetwork: (chainId: number, enabled: boolean) => boolean;
		isNetworkEnabled: (chainId: number) => boolean;
	}

	let { open, networks, currentChainId, onClose, onToggleNetwork, isNetworkEnabled }: Props =
		$props();

	type ViewMode = 'list' | 'edit' | 'add';
	let viewMode = $state<ViewMode>('list');
	let editingNetwork = $state<NetworkConfig | null>(null);
	let newRpcUrl = $state('');
	let isSubmitting = $state(false);
	let searchQuery = $state('');
	let filterStatus = $state<'all' | 'enabled' | 'disabled'>('all');

	// Edit/Add form state
	let formData = $state({
		chainId: 0,
		name: '',
		symbol: '',
		blockExplorer: '',
		enabled: true,
		rpcEndpoints: [] as Array<{
			url: string;
			isPrimary: boolean;
			latency?: number;
			testing?: boolean;
		}>
	});

	// Filter networks based on search query and status
	const filteredNetworks = $derived(
		networks.filter((network) => {
			// Search filter
			const matchesSearch =
				network.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				network.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
				network.chainId.toString().includes(searchQuery);

			// Status filter
			const enabled = isNetworkEnabled(network.chainId);
			const matchesStatus =
				filterStatus === 'all' ||
				(filterStatus === 'enabled' && enabled) ||
				(filterStatus === 'disabled' && !enabled);

			return matchesSearch && matchesStatus;
		})
	);

	// RPC latency testing
	async function testRpcLatency(rpcUrl: string): Promise<number> {
		const startTime = performance.now();
		try {
			const response = await fetch(rpcUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					jsonrpc: '2.0',
					method: 'eth_blockNumber',
					params: [],
					id: 1
				}),
				signal: AbortSignal.timeout(5000)
			});
			if (!response.ok) throw new Error('RPC request failed');
			const endTime = performance.now();
			return Math.round(endTime - startTime);
		} catch {
			return -1; // Failed
		}
	}

	async function testAllRpcs() {
		for (let i = 0; i < formData.rpcEndpoints.length; i++) {
			const rpc = formData.rpcEndpoints[i];
			rpc.testing = true;
			const latency = await testRpcLatency(rpc.url);
			rpc.latency = latency;
			rpc.testing = false;
		}
	}

	function handleAddNetwork() {
		viewMode = 'add';
		formData = {
			chainId: 0,
			name: '',
			symbol: '',
			blockExplorer: '',
			enabled: true,
			rpcEndpoints: []
		};
	}

	function handleEditNetwork(network: NetworkConfig) {
		viewMode = 'edit';
		editingNetwork = network;
		formData = {
			chainId: network.chainId,
			name: network.name,
			symbol: network.symbol,
			blockExplorer: network.blockExplorer || '',
			enabled: isNetworkEnabled(network.chainId),
			rpcEndpoints: network.rpcEndpoints.map((rpc) => ({
				url: rpc.url,
				isPrimary: rpc.isPrimary
			}))
		};
		newRpcUrl = '';
		// Test RPC latencies when opening edit view
		testAllRpcs();
	}

	function handleBackToList() {
		viewMode = 'list';
		editingNetwork = null;
		newRpcUrl = '';
	}

	async function handleAddRpcToForm() {
		if (!newRpcUrl.trim()) return;
		const isPrimary = formData.rpcEndpoints.length === 0;
		const url = newRpcUrl.trim();
		const newRpc: {
			url: string;
			isPrimary: boolean;
			testing: boolean;
			latency?: number;
		} = {
			url,
			isPrimary,
			testing: true,
			latency: undefined
		};
		formData.rpcEndpoints.push(newRpc);
		newRpcUrl = '';

		// Test latency for the new RPC
		const latency = await testRpcLatency(url);
		newRpc.latency = latency;
		newRpc.testing = false;
	}

	function handleRemoveRpcFromForm(index: number) {
		formData.rpcEndpoints.splice(index, 1);
		// If removed primary, make first one primary
		if (formData.rpcEndpoints.length > 0 && !formData.rpcEndpoints.some((r) => r.isPrimary)) {
			formData.rpcEndpoints[0].isPrimary = true;
		}
	}

	function handleSetPrimaryInForm(index: number) {
		formData.rpcEndpoints.forEach((rpc, i) => {
			rpc.isPrimary = i === index;
		});
	}

	async function handleSaveNetwork() {
		if (isSubmitting) return;

		isSubmitting = true;
		try {
			// Here you would call the appropriate API to save the network
			// For now, just close the modal
			console.log('Saving network:', formData);
			handleBackToList();
		} catch (error) {
			console.error('Failed to save network:', error);
		} finally {
			isSubmitting = false;
		}
	}

	function handleToggleNetwork(network: NetworkConfig, enabled: boolean) {
		const success = onToggleNetwork(network.chainId, enabled);
		if (!success) {
			console.error('Failed to toggle network:', network.chainId);
		}
	}
</script>

<Modal {open} {onClose} title="Network Settings">
	{#snippet footer()}
		{#if viewMode === 'list'}
			<button class="add-network-btn" onclick={handleAddNetwork}>
				<Plus size={18} />
				Add Network
			</button>
		{/if}
	{/snippet}

	<div class="network-settings">
		{#if viewMode === 'list'}
			<!-- List View -->
			<div class="list-view">
				<div class="list-header">
					<h3>Available Networks</h3>

					<div class="filter-group">
						<input
							type="text"
							placeholder="Search networks by name, symbol, or chain ID..."
							bind:value={searchQuery}
							class="search-input"
						/>
						<div class="status-filter">
							<button
								class="filter-btn"
								class:active={filterStatus === 'all'}
								onclick={() => (filterStatus = 'all')}
							>
								All
							</button>
							<button
								class="filter-btn"
								class:active={filterStatus === 'enabled'}
								onclick={() => (filterStatus = 'enabled')}
							>
								Enabled
							</button>
							<button
								class="filter-btn"
								class:active={filterStatus === 'disabled'}
								onclick={() => (filterStatus = 'disabled')}
							>
								Disabled
							</button>
						</div>
					</div>
				</div>

				<div class="network-cards">
					{#each filteredNetworks as network (network.chainId)}
						<div class="network-card" class:active={network.chainId === currentChainId}>
							<div class="card-header">
								<NetworkIcon chainId={network.chainId} size={48} />
								<div class="network-info">
									<div class="network-name">{network.name}</div>
									<div class="network-details">
										<span class="network-symbol">{network.symbol}</span>
										<span class="separator">•</span>
										<span class="chain-id">Chain ID: {network.chainId}</span>
									</div>
								</div>
								<div class="badge-group">
									{#if network.chainId === currentChainId}
										<div class="active-badge">
											<Check size={14} />
											Active
										</div>
									{/if}
									<label class="toggle-switch">
										<input
											type="checkbox"
											checked={isNetworkEnabled(network.chainId)}
											onchange={(e) => handleToggleNetwork(network, e.currentTarget.checked)}
										/>
										<span class="toggle-slider"></span>
									</label>
								</div>
							</div>

							<div class="card-body">
								<div class="rpc-count">
									{network.rpcEndpoints.length} RPC
									{network.rpcEndpoints.length === 1 ? 'endpoint' : 'endpoints'}
								</div>
								{#if network.blockExplorer}
									<a
										href={network.blockExplorer}
										target="_blank"
										rel="noopener noreferrer"
										class="explorer-link"
									>
										<ExternalLink size={12} />
										Block Explorer
									</a>
								{/if}
							</div>

							<div class="card-actions">
								<button class="action-btn edit" onclick={() => handleEditNetwork(network)}>
									<Edit2 size={14} />
									Edit RPC
								</button>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<!-- Edit/Add View -->
			<div class="form-view">
				<div class="form-header">
					<button class="back-btn" onclick={handleBackToList}>
						<ArrowLeft size={18} />
						Back
					</button>
					<h3>{viewMode === 'edit' ? 'Edit Network' : 'Add Network'}</h3>
				</div>

				<div class="form-content">
					<div class="form-group">
						<label for="chainId">Chain ID</label>
						<input
							id="chainId"
							type="number"
							bind:value={formData.chainId}
							disabled={viewMode === 'edit'}
							placeholder="1"
						/>
					</div>

					<div class="form-group">
						<label for="name">Network Name</label>
						<input
							id="name"
							type="text"
							bind:value={formData.name}
							placeholder="Ethereum Mainnet"
						/>
					</div>

					<div class="form-group">
						<label for="symbol">Currency Symbol</label>
						<input id="symbol" type="text" bind:value={formData.symbol} placeholder="ETH" />
					</div>

					<div class="form-group">
						<label for="explorer">Block Explorer (Optional)</label>
						<input
							id="explorer"
							type="text"
							bind:value={formData.blockExplorer}
							placeholder="https://etherscan.io"
						/>
					</div>

					<div class="form-group">
						<label class="checkbox-label">
							<input type="checkbox" bind:checked={formData.enabled} />
							<span>Enable this network</span>
						</label>
					</div>

					<div class="form-group rpc-group">
						<div class="rpc-label">RPC Endpoints</div>
						<div class="rpc-list-form">
							{#each formData.rpcEndpoints as rpc, index (index)}
								<div class="rpc-item-form" class:primary={rpc.isPrimary}>
									<div class="rpc-info-wrapper">
										<div class="rpc-url-display">{rpc.url}</div>
										{#if rpc.testing}
											<div class="rpc-latency testing">Testing...</div>
										{:else if rpc.latency !== undefined}
											<div class="rpc-latency" class:failed={rpc.latency === -1}>
												{rpc.latency === -1 ? 'Failed' : `${rpc.latency}ms`}
											</div>
										{/if}
									</div>
									<div class="rpc-actions-form">
										{#if rpc.isPrimary}
											<span class="primary-badge-small">Primary</span>
										{:else}
											<button
												type="button"
												class="rpc-action-btn-small"
												onclick={() => handleSetPrimaryInForm(index)}
											>
												Set Primary
											</button>
										{/if}
										<button
											type="button"
											class="rpc-action-btn-small danger"
											onclick={() => handleRemoveRpcFromForm(index)}
										>
											<Trash2 size={12} />
										</button>
									</div>
								</div>
							{/each}
						</div>

						<div class="add-rpc-input">
							<input
								type="text"
								placeholder="https://your-rpc-endpoint.com"
								bind:value={newRpcUrl}
								onkeydown={(e) => e.key === 'Enter' && handleAddRpcToForm()}
							/>
							<button type="button" class="add-btn-small" onclick={handleAddRpcToForm}>
								<Plus size={14} />
								Add
							</button>
						</div>
					</div>

					<div class="form-actions">
						<button class="save-btn" onclick={handleSaveNetwork} disabled={isSubmitting}>
							{isSubmitting ? 'Saving...' : 'Save Network'}
						</button>
						<button class="cancel-btn" onclick={handleBackToList} disabled={isSubmitting}>
							Cancel
						</button>
					</div>
				</div>
			</div>
		{/if}
	</div>
</Modal>

<style>
	.network-settings {
		min-height: 400px;
		max-height: 70vh;
		overflow-y: auto;
		overflow-x: hidden;
	}

	/* 滚动条样式适配暗色模式 */
	.network-settings::-webkit-scrollbar {
		width: 8px;
	}

	.network-settings::-webkit-scrollbar-track {
		background: var(--color-muted);
		border-radius: var(--radius-md);
	}

	.network-settings::-webkit-scrollbar-thumb {
		background: var(--color-border);
		border-radius: var(--radius-md);
		transition: background 0.2s;
	}

	.network-settings::-webkit-scrollbar-thumb:hover {
		background: color-mix(in srgb, var(--color-foreground) 30%, transparent);
	}

	h3 {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--color-foreground);
	}

	/* List View */
	.list-view {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.list-header {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.add-network-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-4);
		background: var(--color-secondary);
		color: var(--color-foreground);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.3s ease;
		width: 100%;
		position: relative;
		overflow: hidden;
	}

	.add-network-btn::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, var(--brand-500), var(--brand-600));
		opacity: 0;
		transition: opacity 0.3s ease;
		z-index: -1;
	}

	.add-network-btn:hover::before {
		opacity: 1;
	}

	.add-network-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 16px color-mix(in srgb, var(--brand-500) 40%, transparent);
		color: var(--color-card);
	}

	.add-network-btn:active {
		transform: translateY(0);
	}

	.filter-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.search-input {
		width: 100%;
		padding: var(--space-2-5) var(--space-3);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		background: var(--color-input);
		color: var(--color-foreground);
		transition: all 0.2s;
	}

	.search-input:focus {
		outline: none;
		border-color: var(--brand-500);
		box-shadow: 0 0 0 3px rgba(var(--brand-500-rgb, 59, 130, 246), 0.1);
	}

	.search-input::placeholder {
		color: var(--color-muted-foreground);
	}

	.status-filter {
		display: flex;
		gap: var(--space-2);
	}

	.filter-btn {
		flex: 1;
		padding: var(--space-2) var(--space-3);
		background: var(--color-secondary);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-muted-foreground);
		cursor: pointer;
		transition: all 0.2s;
	}

	.filter-btn:hover {
		background: var(--color-secondary);
		color: var(--color-foreground);
	}

	.filter-btn.active {
		background: var(--brand-500);
		color: white;
		border-color: var(--brand-500);
	}

	.network-cards {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.network-card {
		padding: var(--space-4);
		background: var(--color-card);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		transition: all 0.3s ease;
	}

	.network-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px var(--color-ring);
	}

	.network-card.active {
		border-color: var(--color-success, #10b981);
		background: color-mix(in srgb, var(--color-success, #10b981) 5%, transparent);
	}

	.card-header {
		display: flex;
		align-items: flex-start;
		gap: var(--space-3);
		margin-bottom: var(--space-3);
	}

	.network-info {
		flex: 1;
	}

	.network-name {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--color-foreground);
		margin-bottom: var(--space-1);
	}

	.network-details {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
	}

	.separator {
		color: var(--color-border);
	}

	.badge-group {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: var(--space-2);
	}

	.active-badge {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-1) var(--space-2);
		background: var(--color-success, #10b981);
		color: var(--color-card);
		border-radius: var(--radius-md);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		animation: check-in 0.3s ease;
	}

	/* Toggle Switch */
	.toggle-switch {
		position: relative;
		display: inline-block;
		width: 44px;
		height: 24px;
		cursor: pointer;
	}

	.toggle-switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	.toggle-slider {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: var(--color-secondary);
		border: 1px solid var(--color-border);
		border-radius: 24px;
		transition: all 0.3s;
	}

	.toggle-slider::before {
		content: '';
		position: absolute;
		height: 18px;
		width: 18px;
		left: 3px;
		bottom: 2px;
		background: var(--color-foreground);
		border-radius: 50%;
		transition: all 0.3s;
		opacity: 0.7;
	}

	.toggle-switch input:checked + .toggle-slider {
		background: var(--color-success, #10b981);
		border-color: var(--color-success, #10b981);
	}

	.toggle-switch input:checked + .toggle-slider::before {
		transform: translateX(20px);
		background: var(--color-card);
		opacity: 1;
	}

	.toggle-switch:hover .toggle-slider {
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-500) 10%, transparent);
	}

	.card-body {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-2) 0;
		margin-bottom: var(--space-3);
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
	}

	.rpc-count {
		padding: var(--space-1) var(--space-2);
		background: var(--color-muted);
		border-radius: var(--radius-sm);
	}

	.explorer-link {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		color: var(--brand-600);
		text-decoration: none;
		transition: color 0.2s;
	}

	.explorer-link:hover {
		color: var(--brand-700);
		text-decoration: underline;
	}

	.card-actions {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.action-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-1-5);
		padding: var(--space-2-5) var(--space-3);
		background: var(--color-secondary);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.2s;
		width: 100%;
		color: var(--color-foreground);
	}

	.action-btn:hover:not(:disabled) {
		background: var(--color-secondary);
		transform: translateY(-1px);
	}

	.action-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Form View */
	.form-view {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.form-header {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.back-btn {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-2);
		background: transparent;
		border: none;
		color: var(--color-muted-foreground);
		cursor: pointer;
		transition: all 0.2s;
		border-radius: var(--radius-md);
	}

	.back-btn:hover {
		background: var(--color-secondary);
		color: var(--color-foreground);
	}

	.form-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.form-group label,
	.rpc-label {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-foreground);
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		cursor: pointer;
	}

	.checkbox-label input[type='checkbox'] {
		width: 18px;
		height: 18px;
		cursor: pointer;
	}

	.form-group input:not([type='checkbox']) {
		padding: var(--space-2-5) var(--space-3);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		background: var(--color-input);
		color: var(--color-foreground);
		transition: all 0.2s;
	}

	.form-group input:not([type='checkbox']):focus {
		outline: none;
		border-color: var(--brand-500);
		box-shadow: 0 0 0 3px rgba(var(--brand-500-rgb, 59, 130, 246), 0.1);
	}

	.form-group input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.rpc-list-form {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		margin-bottom: var(--space-2);
	}

	.rpc-item-form {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-2-5);
		background: var(--color-card);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		transition: all 0.2s;
	}

	.rpc-item-form.primary {
		border-color: var(--brand-500);
		background: color-mix(in srgb, var(--brand-500) 5%, transparent);
	}

	.rpc-info-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		flex: 1;
		margin-right: var(--space-3);
	}

	.rpc-url-display {
		font-size: var(--text-xs);
		font-family: monospace;
		color: var(--color-foreground);
		word-break: break-all;
	}

	.rpc-latency {
		font-size: var(--text-xs);
		padding: var(--space-0-5) var(--space-1-5);
		border-radius: var(--radius-sm);
		display: inline-flex;
		align-items: center;
		width: fit-content;
	}

	.rpc-latency.testing {
		color: var(--color-muted-foreground);
		background: var(--color-muted);
		animation: pulse-opacity 1.5s ease-in-out infinite;
	}

	.rpc-latency:not(.testing):not(.failed) {
		color: var(--color-success, #10b981);
		background: color-mix(in srgb, var(--color-success, #10b981) 10%, transparent);
	}

	.rpc-latency.failed {
		color: var(--color-danger);
		background: color-mix(in srgb, var(--color-danger) 10%, transparent);
	}

	@keyframes pulse-opacity {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	.rpc-actions-form {
		display: flex;
		gap: var(--space-2);
		align-items: center;
	}

	.primary-badge-small {
		padding: var(--space-1) var(--space-2);
		background: var(--brand-500);
		color: var(--color-card);
		border-radius: var(--radius-sm);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
	}

	.rpc-action-btn-small {
		padding: var(--space-1) var(--space-2);
		background: var(--color-secondary);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		font-size: var(--text-xs);
		cursor: pointer;
		transition: all 0.2s;
		white-space: nowrap;
		color: var(--color-foreground);
	}

	.rpc-action-btn-small:hover {
		background: var(--color-secondary);
	}

	.rpc-action-btn-small.danger:hover {
		background: var(--color-danger);
		color: var(--color-card);
		border-color: var(--color-danger);
	}

	.add-rpc-input {
		display: flex;
		gap: var(--space-2);
	}

	.add-rpc-input input {
		flex: 1;
		padding: var(--space-2) var(--space-3);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		background: var(--color-input);
	}

	.add-btn-small {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-2) var(--space-3);
		background: var(--brand-500);
		color: var(--color-card);
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.2s;
		white-space: nowrap;
	}

	.add-btn-small:hover {
		background: var(--brand-600);
	}

	.form-actions {
		display: flex;
		gap: var(--space-3);
		padding-top: var(--space-2);
	}

	.save-btn,
	.cancel-btn {
		flex: 1;
		padding: var(--space-3) var(--space-4);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.save-btn {
		background: linear-gradient(135deg, var(--brand-500), var(--brand-600));
		color: var(--color-card);
		border: none;
	}

	.save-btn:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px color-mix(in srgb, var(--brand-500) 30%, transparent);
	}

	.save-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.cancel-btn {
		background: var(--color-secondary);
		color: var(--color-foreground);
		border: 1px solid var(--color-border);
	}

	.cancel-btn:hover:not(:disabled) {
		background: var(--color-secondary);
	}

	@keyframes check-in {
		0% {
			transform: scale(0);
			opacity: 0;
		}
		50% {
			transform: scale(1.1);
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}
</style>
