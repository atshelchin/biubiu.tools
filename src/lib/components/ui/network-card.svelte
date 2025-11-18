<script lang="ts">
	import type { NetworkConfig } from '@shelchin/ethereum-connectors';
	import NetworkIcon from './network-icon.svelte';
	import SelectionIndicator from './selection-indicator.svelte';

	interface Props {
		/** Network configuration */
		network: NetworkConfig;
		/** Whether this network is selected */
		selected?: boolean;
		/** Click handler */
		onclick?: () => void;
		/** Custom class for styling */
		class?: string;
	}

	let { network, selected = false, onclick, class: className = '' }: Props = $props();
</script>

<button class="network-card {className}" class:selected {onclick}>
	<NetworkIcon chainId={network.chainId} size={36} />
	<div class="network-info">
		<div class="network-name">{network.name}</div>
		<div class="network-chain-id">Chain ID: {network.chainId}</div>
	</div>
	<SelectionIndicator visible={selected} />
</button>

<style>
	.network-card {
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3);
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
</style>
