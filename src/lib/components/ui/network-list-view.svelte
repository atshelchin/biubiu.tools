<script lang="ts">
	import { Check, Plus, Edit2, ExternalLink } from '@lucide/svelte';
	import NetworkIcon from './network-icon.svelte';
	import ToggleSwitch from './toggle-switch.svelte';
	import type { NetworkConfig } from '@shelchin/ethereum-connectors';
	import { useI18n } from '@shelchin/i18n/svelte';
	import { fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	interface Props {
		networks: NetworkConfig[];
		currentChainId?: number;
		isNetworkEnabled: (chainId: number) => boolean;
		onToggleNetwork: (chainId: number, enabled: boolean) => boolean;
		onEditNetwork: (network: NetworkConfig) => void;
		onAddNetwork: () => void;
	}

	let {
		networks,
		currentChainId,
		isNetworkEnabled,
		onToggleNetwork,
		onEditNetwork,
		onAddNetwork
	}: Props = $props();

	const i18n = useI18n();
	const t = i18n.t;

	let searchQuery = $state('');
	let filterStatus = $state<'all' | 'enabled' | 'disabled'>('all');
	let toggleVersion = $state(0);

	// Filter networks based on search query and status
	const filteredNetworks = $derived.by(() => {
		void toggleVersion;

		return networks.filter((network) => {
			const matchesSearch =
				network.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				network.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
				network.chainId.toString().includes(searchQuery);

			const enabled = isNetworkEnabled(network.chainId);
			const matchesStatus =
				filterStatus === 'all' ||
				(filterStatus === 'enabled' && enabled) ||
				(filterStatus === 'disabled' && !enabled);

			return matchesSearch && matchesStatus;
		});
	});

	function handleToggleNetwork(network: NetworkConfig, enabled: boolean) {
		const success = onToggleNetwork(network.chainId, enabled);
		if (success) {
			toggleVersion++;
		}
	}
</script>

<div class="list-view">
	<div class="list-header">
		<input
			type="text"
			placeholder={t('wallet.network_settings.search_placeholder')}
			bind:value={searchQuery}
			class="search-input"
		/>
		<div class="filter-row">
			<div class="status-filter">
				<button
					class="filter-btn"
					class:active={filterStatus === 'all'}
					onclick={() => (filterStatus = 'all')}
				>
					{t('wallet.network_settings.filter_all')}
				</button>
				<button
					class="filter-btn"
					class:active={filterStatus === 'enabled'}
					onclick={() => (filterStatus = 'enabled')}
				>
					{t('wallet.network_settings.filter_enabled')}
				</button>
				<button
					class="filter-btn"
					class:active={filterStatus === 'disabled'}
					onclick={() => (filterStatus = 'disabled')}
				>
					{t('wallet.network_settings.filter_disabled')}
				</button>
			</div>
			<button class="add-network-btn" onclick={onAddNetwork}>
				<Plus size={20} />
				{t('wallet.network_settings.add_network')}
			</button>
		</div>
	</div>

	<div class="network-cards">
		{#each filteredNetworks as network (network.chainId)}
			<div
				class="network-card"
				class:active={network.chainId === currentChainId}
				transition:fade={{ duration: 300, easing: quintOut }}
			>
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
								{t('wallet.network_settings.active')}
							</div>
						{/if}
						<ToggleSwitch
							checked={isNetworkEnabled(network.chainId)}
							onchange={(checked) => handleToggleNetwork(network, checked)}
						/>
					</div>
				</div>

				<div class="card-body">
					<div class="rpc-count">
						{network.rpcEndpoints.length}

						{network.rpcEndpoints.length === 1
							? t('wallet.network_settings.rpc_endpoint')
							: t('wallet.network_settings.rpc_endpoints_plural')}
					</div>
					{#if network.blockExplorer}
						<a
							href={network.blockExplorer}
							target="_blank"
							rel="noopener noreferrer"
							class="explorer-link"
						>
							<ExternalLink size={12} />
							{t('wallet.network_settings.block_explorer')}
						</a>
					{/if}
				</div>

				<div class="card-actions">
					<button class="action-btn edit" onclick={() => onEditNetwork(network)}>
						<Edit2 size={14} />
						{t('wallet.network_settings.edit_rpc')}
					</button>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
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

	.filter-row {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.search-input {
		padding: var(--space-2-5) var(--space-3);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		background: var(--color-input);
		color: var(--color-foreground);
		transition: border-color 0.2s;
	}

	.search-input:focus {
		outline: none;
		border-color: var(--brand-500);
	}

	/* Segmented Control 分段控制器 */
	.status-filter {
		display: inline-flex;
		background: var(--gray-100);
		border-radius: var(--radius-lg);
		padding: var(--space-1);
		gap: var(--space-1);
	}

	.filter-btn {
		padding: var(--space-2) var(--space-4);
		background: transparent;
		border: none;
		border-radius: var(--radius-md);
		color: var(--gray-600);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.2s ease;
		white-space: nowrap;
	}

	.filter-btn:hover {
		color: var(--gray-700);
	}

	.filter-btn.active {
		background: var(--color-background);
		color: var(--brand-600);
		box-shadow: var(--shadow-sm);
	}

	.network-cards {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
		gap: var(--space-3);
	}

	@media (max-width: 80rem) {
		.network-cards {
			grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
		}
	}

	@media (max-width: 900px) {
		.network-cards {
			grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		}
	}

	@media (max-width: 640px) {
		.network-cards {
			grid-template-columns: 1fr;
		}
	}

	.network-card {
		padding: var(--space-4);
		background: var(--color-card);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		transition: all 0.3s ease;
	}

	.network-card:hover {
		border-color: var(--color-border);
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
		background: transparent;
		color: var(--color-muted-foreground);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
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
		color: var(--color-muted-foreground);
		text-decoration: none;
		transition: color 0.2s;
	}

	.explorer-link:hover {
		color: var(--color-foreground);
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
		background: var(--gray-50);
		border: 1px solid var(--gray-200);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.2s;
		width: 100%;
		color: var(--gray-700);
	}

	.action-btn:hover:not(:disabled) {
		background: var(--gray-100);
		border-color: var(--gray-300);
		color: var(--gray-800);
	}

	.action-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.add-network-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-5);
		background: var(--brand-600);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.2s ease;
		white-space: nowrap;
		box-shadow: var(--shadow-sm);
	}

	.add-network-btn:hover {
		background: var(--brand-700);
		box-shadow: var(--shadow-md);
		transform: translateY(-1px);
	}

	/* Dark Mode 暗色主题 */
	:global([data-theme='dark']) .status-filter {
		background: var(--gray-800);
	}

	:global([data-theme='dark']) .filter-btn {
		color: var(--gray-400);
	}

	:global([data-theme='dark']) .filter-btn:hover {
		color: var(--gray-300);
	}

	:global([data-theme='dark']) .filter-btn.active {
		background: var(--gray-700);
		color: var(--brand-400);
	}

	:global([data-theme='dark']) .action-btn {
		background: var(--gray-800);
		border-color: var(--gray-700);
		color: var(--gray-300);
	}

	:global([data-theme='dark']) .action-btn:hover:not(:disabled) {
		background: var(--gray-700);
		border-color: var(--gray-600);
		color: var(--gray-200);
	}

	:global([data-theme='dark']) .add-network-btn {
		background: var(--brand-600);
		color: white;
	}

	:global([data-theme='dark']) .add-network-btn:hover {
		background: var(--brand-500);
	}

	/* Mobile Responsive 移动端响应式 */
	@media (max-width: 640px) {
		.filter-row {
			flex-direction: column;
			align-items: stretch;
			gap: var(--space-2);
		}

		.status-filter {
			width: 100%;
		}

		.add-network-btn {
			padding: var(--space-2-5) var(--space-4);
			font-size: var(--text-sm);
			font-weight: var(--font-medium);
		}
	}
</style>
