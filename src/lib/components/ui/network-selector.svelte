<script lang="ts">
	import { page } from '$app/stores';
	import type { NetworkConfig } from '@shelchin/ethereum-connectors';
	import type { useConnectStore } from '$lib/stores/connect.svelte';
	import { Settings, CirclePlus } from 'lucide-svelte';
	import NetworkCard from './network-card.svelte';
	import NetworkSettingsModal from './network-settings-modal.svelte';

	interface Props {
		connectStore: ReturnType<typeof useConnectStore>;
		isLoading?: boolean;
		showAddButton?: boolean;
		selectedChainId?: number | null;
		selectedNetwork?: NetworkConfig | undefined;
	}

	let {
		connectStore,
		isLoading = false,
		showAddButton = true,
		selectedChainId = $bindable(null),
		selectedNetwork = $bindable(undefined)
	}: Props = $props();

	let showNetworkSettings = $state(false);

	// Derived network data
	const allNetworks = $derived(connectStore.networks);
	const enabledNetworks = $derived(
		connectStore.networks.filter((network) => connectStore.isNetworkEnabled(network.chainId))
	);

	// Update selectedNetwork when selectedChainId changes
	$effect(() => {
		selectedNetwork = selectedChainId
			? connectStore.networks.find((n) => n.chainId === selectedChainId)
			: undefined;
	});

	// Show settings modal if management functions are provided
	const hasNetworkManagement = $derived(true); // Always true since we have connectStore
	const hasNoEnabledNetworks = $derived(enabledNetworks.length === 0);

	// Initialize selected network from URL or default to first enabled network
	$effect(() => {
		if (typeof window === 'undefined' || isLoading) return;

		const urlParams = new URLSearchParams($page.url.search);
		const networkParam = urlParams.get('network');

		if (networkParam) {
			// Find network by name (case-insensitive)
			const network = enabledNetworks.find(
				(n) => n.name.toLowerCase() === networkParam.toLowerCase()
			);
			if (network) {
				selectedChainId = network.chainId;
				return;
			}
		}

		// Default to current chain or first enabled network
		if (
			connectStore.currentChainId &&
			enabledNetworks.some((n) => n.chainId === connectStore.currentChainId)
		) {
			selectedChainId = connectStore.currentChainId;
		} else if (enabledNetworks.length > 0) {
			selectedChainId = enabledNetworks[0].chainId;
		}
	});

	// Handle network selection
	async function selectNetwork(chainId: number) {
		selectedChainId = chainId;

		// Update URL parameter
		if (typeof window !== 'undefined') {
			const network = connectStore.networks.find((n) => n.chainId === chainId);
			if (network) {
				const currentUrl = new URL($page.url);
				currentUrl.searchParams.set('network', network.name.toLowerCase());
				window.history.replaceState(window.history.state, '', currentUrl.toString());
			}
		}

		// Save selected network to localStorage (via NetworkManager)
		connectStore.setCurrentNetwork(chainId);

		// If wallet is connected and network changed, disconnect to require reconnection
		if (connectStore.isConnected && connectStore.currentChainId !== chainId) {
			await connectStore.disconnect();
		}
	}

	function openNetworkSettings() {
		showNetworkSettings = true;
	}
</script>

{#if hasNoEnabledNetworks}
	<!-- Empty State: No Networks Enabled -->
	<div class="empty-state">
		<div class="empty-icon">🔗</div>
		<h3>No Networks Enabled</h3>
		<p>Please enable at least one network to continue.</p>
		{#if hasNetworkManagement}
			<button class="settings-button" onclick={openNetworkSettings}>
				<Settings size={20} />
				Open Network Settings
			</button>
		{/if}
	</div>
{:else}
	<!-- Network Grid -->
	<div class="network-grid">
		{#each enabledNetworks as network (network.chainId)}
			<NetworkCard
				{network}
				selected={selectedChainId === network.chainId}
				onclick={() => selectNetwork(network.chainId)}
			/>
		{/each}

		{#if showAddButton && hasNetworkManagement}
			<!-- Add Network Card -->
			<button class="network-card add-network-card" onclick={openNetworkSettings}>
				<div class="add-network-icon">
					<CirclePlus size={32} />
				</div>
				<div class="add-network-info">
					<div class="add-network-title">Network not found?</div>
					<div class="add-network-subtitle">Add custom network</div>
				</div>
			</button>
		{/if}
	</div>
{/if}

{#if showNetworkSettings && hasNetworkManagement}
	<NetworkSettingsModal
		open={showNetworkSettings}
		networks={allNetworks}
		currentChainId={selectedChainId ?? undefined}
		onClose={() => {
			showNetworkSettings = false;
		}}
		onToggleNetwork={(chainId, enabled) => {
			// Prevent disabling the currently selected network
			if (!enabled && selectedChainId === chainId) {
				return false;
			}
			connectStore.toggleNetwork(chainId, enabled);
			return true;
		}}
		isNetworkEnabled={(chainId) => connectStore.isNetworkEnabled(chainId)}
		onSaveNetwork={(chainId, rpcEndpoints, blockExplorer) => {
			connectStore.updateNetworkRpc(chainId, rpcEndpoints, blockExplorer);
		}}
		onAddOrUpdateNetwork={(network) => {
			connectStore.addOrUpdateNetwork(network);
		}}
	/>
{/if}

<style>
	/* Empty State */
	.empty-state {
		text-align: center;
		padding: var(--space-12) var(--space-6);
		background: var(--color-panel-1);
		border-radius: var(--radius-lg);
		border: 2px dashed var(--color-border);
	}

	.empty-icon {
		font-size: 4rem;
		margin-bottom: var(--space-4);
		opacity: 0.5;
	}

	.empty-state h3 {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		margin-bottom: var(--space-2);
		color: var(--gray-800);
	}

	:global([data-theme='dark']) .empty-state h3 {
		color: var(--gray-200);
	}

	.empty-state p {
		color: var(--gray-600);
		margin-bottom: var(--space-6);
	}

	:global([data-theme='dark']) .empty-state p {
		color: var(--gray-400);
	}

	.settings-button {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-6);
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.settings-button:hover {
		background: hsl(var(--brand-hue), var(--brand-saturation), 45%);
		transform: translateY(-1px);
		box-shadow: 0 4px 12px hsla(var(--brand-hue), var(--brand-saturation), 50%, 0.3);
	}

	/* Network Grid */
	.network-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: var(--space-4);
	}

	/* Add Network Card */
	:global(.network-card.add-network-card) {
		border-style: dashed;
		justify-content: center;
		flex-direction: column;
	}

	:global(.network-card.add-network-card:hover) {
		background: hsla(var(--brand-hue), var(--brand-saturation), 50%, 0.05);
	}

	.add-network-icon {
		color: var(--gray-400);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	.add-network-card:hover .add-network-icon {
		color: var(--color-primary);
		transform: scale(1.1);
	}

	.add-network-info {
		text-align: center;
	}

	.add-network-title {
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		color: var(--gray-700);
		margin-bottom: var(--space-1);
	}

	.add-network-subtitle {
		font-size: var(--text-sm);
		color: var(--gray-500);
	}

	.add-network-card:hover .add-network-title {
		color: var(--color-primary);
	}

	:global(.network-card.add-network-card:hover) .add-network-subtitle {
		color: var(--gray-600);
	}

	:global([data-theme='dark']) :global(.network-card.add-network-card:hover) {
		background: hsla(var(--brand-hue), var(--brand-saturation), 60%, 0.08);
	}

	:global([data-theme='dark']) .add-network-title {
		color: var(--gray-200);
	}

	:global([data-theme='dark']) .add-network-subtitle {
		color: var(--gray-400);
	}

	:global([data-theme='dark']) :global(.network-card.add-network-card:hover) .add-network-title {
		color: var(--color-primary);
	}

	/* Responsive */
	@media (max-width: 640px) {
		.network-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
