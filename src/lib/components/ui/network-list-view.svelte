<script lang="ts">
	import { Check, Plus, Edit2, ExternalLink } from '@lucide/svelte';
	import NetworkIcon from './network-icon.svelte';
	import ToggleSwitch from './toggle-switch.svelte';
	import SegmentedControl from './segmented-control.svelte';
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

	// Scroll state for fade indicator
	let scrollContainer: HTMLDivElement | undefined = $state();
	let canScrollDown = $state(false);

	function updateScrollState() {
		if (!scrollContainer) return;
		const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
		canScrollDown = scrollTop + clientHeight < scrollHeight - 10;
	}

	// Filter options for segmented control
	const filterOptions = $derived([
		{ value: 'all' as const, label: t('wallet.network_settings.filter_all') },
		{ value: 'enabled' as const, label: t('wallet.network_settings.filter_enabled') },
		{ value: 'disabled' as const, label: t('wallet.network_settings.filter_disabled') }
	]);

	// Count enabled networks to prevent disabling the last one
	const enabledNetworkCount = $derived.by(() => {
		void toggleVersion;
		return networks.filter((n) => isNetworkEnabled(n.chainId)).length;
	});

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

	// Update scroll state when container mounts or content changes
	$effect(() => {
		if (scrollContainer) {
			// Initial check
			updateScrollState();
			// Also check when filtered networks change
			void filteredNetworks.length;
			// Use setTimeout to ensure DOM has updated
			setTimeout(updateScrollState, 100);
		}
	});
</script>

<div class="list-view">
	<div class="list-header">
		<div class="search-row">
			<input
				type="text"
				placeholder={t('wallet.network_settings.search_placeholder')}
				bind:value={searchQuery}
				class="search-input"
			/>
			<span class="network-count">
				{filteredNetworks.length}
				{t('wallet.network_settings.networks_count')}
			</span>
		</div>
		<div class="filter-row">
			<SegmentedControl options={filterOptions} bind:value={filterStatus} />
		</div>
	</div>

	<div
		class="network-cards-wrapper"
		class:has-scroll={canScrollDown}
		bind:this={scrollContainer}
		onscroll={updateScrollState}
	>
		<div class="network-cards">
			{#each filteredNetworks as network, index (network.chainId)}
				{@const networkEnabled = isNetworkEnabled(network.chainId)}
				{@const isLastEnabled = networkEnabled && enabledNetworkCount === 1}
				<div
					class="network-card"
					class:active={network.chainId === currentChainId}
					transition:fade={{ duration: 300, easing: quintOut }}
				>
					<span class="card-index">{index + 1}</span>
					<div class="card-header">
						<NetworkIcon chainId={network.chainId} size={48} />
						<div class="network-info">
							<div class="network-name-row">
								<span class="network-name">{network.name}</span>
								{#if network.chainId === currentChainId}
									<span class="active-badge">
										<Check size={12} />
										{t('wallet.network_settings.active')}
									</span>
								{/if}
							</div>
							<div class="network-details">
								<span class="network-symbol">{network.symbol}</span>
								<span class="separator">•</span>
								<span class="chain-id">Chain ID: {network.chainId}</span>
							</div>
						</div>
						<div class="badge-group">
							<div class="toggle-group">
								<span class="toggle-label" class:enabled={networkEnabled}>
									{networkEnabled
										? t('wallet.network_settings.filter_enabled')
										: t('wallet.network_settings.filter_disabled')}
								</span>
								<ToggleSwitch
									checked={networkEnabled}
									disabled={isLastEnabled}
									onchange={(checked) => handleToggleNetwork(network, checked)}
								/>
							</div>
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

			<!-- Add Network Card -->
			<button class="add-network-card" onclick={onAddNetwork}>
				<div class="add-icon">
					<Plus size={32} />
				</div>
				<span class="add-text">{t('wallet.network_settings.add_network')}</span>
			</button>
		</div>
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

	.search-row {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.search-input {
		flex: 1;
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

	.network-count {
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
		white-space: nowrap;
	}

	.filter-row {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	/* Scroll wrapper with fade indicator */
	.network-cards-wrapper {
		position: relative;
		flex: 1;
		overflow-y: auto;
		max-height: 500px;
		padding-bottom: var(--space-2);
	}

	.network-cards-wrapper::after {
		content: '';
		position: sticky;
		bottom: 0;
		left: 0;
		right: 0;
		height: 60px;
		background: linear-gradient(to top, var(--color-background) 0%, transparent 100%);
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.network-cards-wrapper.has-scroll::after {
		opacity: 1;
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

		.network-cards-wrapper {
			max-height: 440px;
		}
	}

	.network-card {
		position: relative;
		padding: var(--space-4);
		background: var(--color-card);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		transition: all 0.3s ease;
	}

	.card-index {
		position: absolute;
		bottom: 80px;
		right: var(--space-3);
		font-size: 36px;
		font-weight: var(--font-bold);
		color: var(--color-muted-foreground);
		opacity: 0.18;
		pointer-events: none;
		user-select: none;
		line-height: 1;
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

	.network-name-row {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-1);
	}

	.network-name {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--color-foreground);
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
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		padding: 2px var(--space-1-5);
		background: color-mix(in srgb, var(--color-success, #10b981) 10%, transparent);
		color: var(--color-success, #10b981);
		border-radius: var(--radius-sm);
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

	.toggle-group {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.toggle-label {
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		color: var(--color-muted-foreground);
	}

	.toggle-label.enabled {
		color: var(--color-success, #10b981);
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

	/* Add Network Card */
	.add-network-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--space-3);
		padding: var(--space-6);
		background: transparent;
		border: 2px dashed var(--color-border);
		border-radius: var(--radius-lg);
		cursor: pointer;
		transition: all 0.2s ease;
		min-height: 180px;
	}

	.add-network-card:hover {
		border-color: var(--brand-500);
		background: color-mix(in srgb, var(--brand-500) 5%, transparent);
	}

	.add-network-card .add-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 56px;
		height: 56px;
		border-radius: var(--radius-full);
		background: var(--color-muted);
		color: var(--color-muted-foreground);
		transition: all 0.2s ease;
	}

	.add-network-card:hover .add-icon {
		background: var(--brand-100);
		color: var(--brand-600);
	}

	.add-network-card .add-text {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-muted-foreground);
		transition: color 0.2s ease;
	}

	.add-network-card:hover .add-text {
		color: var(--brand-600);
	}

	/* Dark Mode 暗色主题 */
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

	:global([data-theme='dark']) .add-network-card {
		border-color: var(--gray-700);
	}

	:global([data-theme='dark']) .add-network-card:hover {
		border-color: var(--brand-400);
		background: color-mix(in srgb, var(--brand-500) 10%, transparent);
	}

	:global([data-theme='dark']) .add-network-card .add-icon {
		background: var(--gray-800);
		color: var(--gray-500);
	}

	:global([data-theme='dark']) .add-network-card:hover .add-icon {
		background: var(--brand-900);
		color: var(--brand-400);
	}

	:global([data-theme='dark']) .add-network-card:hover .add-text {
		color: var(--brand-400);
	}

	/* Mobile Responsive 移动端响应式 */
	@media (max-width: 640px) {
		.add-network-card {
			min-height: 120px;
			padding: var(--space-4);
		}

		.add-network-card .add-icon {
			width: 44px;
			height: 44px;
		}
	}
</style>
