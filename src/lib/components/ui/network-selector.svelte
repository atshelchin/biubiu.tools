<script lang="ts">
	import { page } from '$app/stores';
	import type { NetworkConfig } from '@shelchin/ethereum-connectors';
	import type { useConnectStore } from '$lib/stores/connect.svelte';
	import NetworkIcon from './network-icon.svelte';
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

		// If wallet is connected, try to switch network
		if (connectStore.isConnected && connectStore.currentChainId !== chainId) {
			try {
				await connectStore.switchNetwork(chainId);
			} catch (error) {
				console.error('Failed to switch network:', error);
			}
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
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<circle cx="12" cy="12" r="3"></circle>
					<path
						d="M12 1v6m0 6v6m7.071-13.071l-4.242 4.242m0 6l-4.242 4.242M1 12h6m6 0h6M4.929 4.929l4.242 4.242m0 6l4.242 4.242"
					></path>
				</svg>
				Open Network Settings
			</button>
		{/if}
	</div>
{:else}
	<!-- Network Grid -->
	<div class="network-grid">
		{#each enabledNetworks as network (network.chainId)}
			<button
				class="network-card"
				class:selected={selectedChainId === network.chainId}
				onclick={() => selectNetwork(network.chainId)}
			>
				<NetworkIcon chainId={network.chainId} size={48} />
				<div class="network-info">
					<div class="network-name">{network.name}</div>
					<div class="network-chain-id">Chain ID: {network.chainId}</div>
				</div>
				{#if selectedChainId === network.chainId}
					<div class="selected-indicator">
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="3"
						>
							<polyline points="20 6 9 17 4 12"></polyline>
						</svg>
					</div>
				{/if}
			</button>
		{/each}

		{#if showAddButton && hasNetworkManagement}
			<!-- Add Network Card -->
			<button class="network-card add-network-card" onclick={openNetworkSettings}>
				<div class="add-network-icon">
					<svg
						width="32"
						height="32"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<circle cx="12" cy="12" r="10"></circle>
						<line x1="12" y1="8" x2="12" y2="16"></line>
						<line x1="8" y1="12" x2="16" y2="12"></line>
					</svg>
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

	.network-card {
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-4);
		background: var(--color-background);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-lg);
		cursor: pointer;
		transition: all 0.2s ease;
		text-align: left;
		width: 100%;
	}

	.network-card:hover {
		background: var(--color-panel-1);
		border-color: var(--color-primary);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.network-card.selected {
		background: hsla(var(--brand-hue), var(--brand-saturation), 50%, 0.1);
		border-color: var(--color-primary);
		border-width: 2px;
	}

	.add-network-card {
		border-style: dashed;
		border-width: 2px;
		border-color: var(--color-border);
		background: transparent;
		justify-content: center;
		flex-direction: column;
		gap: var(--space-2);
	}

	.add-network-card:hover {
		border-color: var(--color-primary);
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

	.add-network-card:hover .add-network-subtitle {
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .network-card {
		background: var(--color-panel-1);
		border-color: var(--color-panel-border-2);
	}

	:global([data-theme='dark']) .network-card:hover {
		background: var(--color-panel-2);
		border-color: var(--color-primary);
	}

	:global([data-theme='dark']) .network-card.selected {
		background: hsla(var(--brand-hue), var(--brand-saturation), 60%, 0.15);
	}

	:global([data-theme='dark']) .add-network-card {
		background: transparent;
		border-color: var(--color-panel-border-2);
	}

	:global([data-theme='dark']) .add-network-card:hover {
		border-color: var(--color-primary);
		background: hsla(var(--brand-hue), var(--brand-saturation), 60%, 0.08);
	}

	:global([data-theme='dark']) .add-network-title {
		color: var(--gray-200);
	}

	:global([data-theme='dark']) .add-network-subtitle {
		color: var(--gray-400);
	}

	:global([data-theme='dark']) .add-network-card:hover .add-network-title {
		color: var(--color-primary);
	}

	.network-info {
		flex: 1;
	}

	.network-name {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
		margin-bottom: var(--space-1);
	}

	:global([data-theme='dark']) .network-name {
		color: var(--gray-100);
	}

	.network-chain-id {
		font-size: var(--text-sm);
		color: var(--gray-500);
	}

	:global([data-theme='dark']) .network-chain-id {
		color: var(--gray-400);
	}

	.selected-indicator {
		position: absolute;
		top: var(--space-3);
		right: var(--space-3);
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background: var(--color-primary);
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		animation: scaleIn 0.2s ease;
	}

	@keyframes scaleIn {
		from {
			transform: scale(0);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	/* Responsive */
	@media (max-width: 640px) {
		.network-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
