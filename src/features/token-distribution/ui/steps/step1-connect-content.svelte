<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte.js';
	import NetworkSelector from '@/lib/components/ui/network-selector.svelte';
	import WalletConnectButton from '@/lib/components/ui/wallet-connect-button.svelte';
	import type { NetworkConfig } from '@shelchin/ethereum-connectors';
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';

	const connectStore = useConnectStore();
	const stepManager = useStepManager();

	// Loading state
	const isLoading = $derived(!connectStore.isInitialized);

	// Bind selected network state from NetworkSelector
	let selectedChainId = $state<number | null>(null);
	let selectedNetwork = $state<NetworkConfig | undefined>(undefined);

	const hasEnabledNetworks = $derived(
		connectStore.networks.some((n) => connectStore.isNetworkEnabled(n.chainId))
	);

	// Check if ready to continue to next step
	const isReadyToContinue = $derived(
		connectStore.isConnected && selectedChainId && connectStore.currentChainId === selectedChainId
	);

	// Handle continue to next step
	function handleContinue() {
		if (isReadyToContinue) {
			stepManager.next();
		}
	}
</script>

<div class="step-content">
	<StepContentHeader
		title="Select Network"
		description="Choose the blockchain network for token distribution"
	/>

	{#if isLoading}
		<!-- Loading State -->
		<div class="loading-container">
			<div class="loading-spinner"></div>
			<p class="loading-text">Loading network configuration...</p>
		</div>
	{:else}
		<NetworkSelector {connectStore} {isLoading} bind:selectedChainId bind:selectedNetwork />

		<!-- Wallet Connection Section -->
		{#if selectedChainId && hasEnabledNetworks}
			<WalletConnectButton {selectedChainId} {selectedNetwork} class="wallet-section" />
		{/if}

		<!-- Continue Button -->
		{#if isReadyToContinue}
			<div class="continue-section">
				<button class="continue-button" onclick={handleContinue}>
					<span>Continue to Next Step</span>
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M5 12h14M12 5l7 7-7 7" />
					</svg>
				</button>
				<p class="continue-hint">
					Your wallet is connected and ready. Click to proceed with configuration.
				</p>
			</div>
		{/if}
	{/if}
</div>

<style>
	/* Wallet Section */
	:global(.wallet-section) {
		margin-top: var(--space-8);
	}

	/* Continue Section */
	.continue-section {
		margin-top: var(--space-8);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-3);
	}

	.continue-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-3);
		width: 100%;
		max-width: 400px;
		min-height: 56px;
		padding: var(--space-4) var(--space-6);
		background: linear-gradient(135deg, hsl(210, 100%, 50%), hsl(210, 100%, 40%));
		color: white;
		border: none;
		border-radius: var(--radius-lg);
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 12px hsla(210, 100%, 50%, 0.3);
	}

	.continue-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 24px hsla(210, 100%, 50%, 0.4);
	}

	.continue-button:active {
		transform: translateY(0);
	}

	.continue-hint {
		font-size: var(--text-sm);
		color: var(--gray-600);
		text-align: center;
		margin: 0;
	}

	:global([data-theme='dark']) .continue-hint {
		color: var(--gray-400);
	}

	/* Loading State */
	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: var(--space-12) var(--space-6);
		background: var(--color-panel-1);
		border-radius: var(--radius-lg);
		border: 2px solid var(--color-border);
		min-height: 200px;
	}

	.loading-spinner {
		width: 48px;
		height: 48px;
		border: 4px solid var(--color-border);
		border-top-color: var(--color-primary);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
		margin-bottom: var(--space-4);
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.loading-text {
		color: var(--gray-600);
		font-size: var(--text-base);
		font-weight: var(--font-medium);
	}

	:global([data-theme='dark']) .loading-text {
		color: var(--gray-400);
	}

	/* Responsive */
	@media (max-width: 640px) {
		.step-content {
			padding: var(--space-3);
		}
	}
</style>
