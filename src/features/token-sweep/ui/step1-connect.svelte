<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte.js';
	import NetworkSelector from '@/lib/components/ui/network-selector.svelte';
	import WalletConnectButton from '@/lib/components/ui/wallet-connect-button.svelte';
	import type { NetworkConfig } from '@shelchin/ethereum-connectors';
	import type { StepManager } from '@/lib/components/ui/step-indicator.svelte';
	import StepSidebar from './components/step-sidebar.svelte';
	import StepContentHeader from './components/step-content-header.svelte';

	interface Props {
		section: 'sidebar' | 'footer' | 'content';
		stepManager?: StepManager;
	}

	let { section, stepManager }: Props = $props();

	const connectStore = useConnectStore();

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
		if (stepManager && isReadyToContinue) {
			stepManager.next();
		}
	}
</script>

{#if section === 'sidebar'}
	<StepSidebar
		stepNumber={1}
		title="Connect Wallet"
		description="Connect your Web3 wallet to start sweeping tokens"
	>
		<div class="feature-highlights">
			<ul class="feature-list">
				<li>
					<span class="feature-icon">⚡</span>
					<span>Batch transfer ERC20 tokens efficiently</span>
				</li>
				<li>
					<span class="feature-icon">🌐</span>
					<span>Support any EVM-compatible network with EIP-7702</span>
				</li>
				<li>
					<span class="feature-icon">🔒</span>
					<span>Non-custodial and secure</span>
				</li>
			</ul>
		</div>

		<div class="security-note">
			<span class="security-icon">🛡️</span>
			<p>Your private keys never leave your wallet. All transactions are signed locally.</p>
		</div>
	</StepSidebar>
{:else if section === 'footer'}
	<div class="step-footer">
		{#if isReadyToContinue}
			<button class="footer-continue-btn" onclick={handleContinue}>
				Continue to Configuration
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M5 12h14M12 5l7 7-7 7" />
				</svg>
			</button>
		{:else}
			<p class="footer-hint">Connect your wallet to continue</p>
		{/if}
	</div>
{:else if section === 'content'}
	<div class="step-content">
		<StepContentHeader
			title="Select Network"
			description="Choose the blockchain network for token sweeping"
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

	<!-- WalletConnector uses connectStore to manage its own visibility -->
	<!-- <WalletConnector /> -->
{/if}

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
		background: linear-gradient(135deg, hsl(120, 60%, 50%), hsl(120, 60%, 40%));
		color: white;
		border: none;
		border-radius: var(--radius-lg);
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 12px hsla(120, 60%, 50%, 0.3);
	}

	.continue-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 24px hsla(120, 60%, 50%, 0.4);
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

	/* Footer Continue Button */
	.footer-continue-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		width: 100%;
		padding: var(--space-3) var(--space-4);
		background: hsl(120, 60%, 50%);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.footer-continue-btn:hover {
		background: hsl(120, 60%, 45%);
		transform: translateY(-1px);
		box-shadow: 0 4px 12px hsla(120, 60%, 50%, 0.3);
	}

	.footer-hint {
		margin: 0;
		color: var(--gray-600);
		font-size: var(--text-sm);
		text-align: center;
	}

	:global([data-theme='dark']) .footer-hint {
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

	/* Sidebar/Footer styles */
	h3 {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		margin-bottom: var(--space-2);
		color: var(--gray-800);
	}

	:global([data-theme='dark']) h3 {
		color: var(--gray-200);
	}

	.step-sidebar > p {
		color: var(--gray-600);
		line-height: 1.6;
		margin-bottom: var(--space-4);
	}

	:global([data-theme='dark']) .step-sidebar > p {
		color: var(--gray-400);
	}

	.step-footer p {
		color: var(--gray-600);
		line-height: 1.6;
	}

	:global([data-theme='dark']) .step-footer p {
		color: var(--gray-400);
	}

	/* Feature Highlights */
	.feature-highlights {
		margin: var(--space-4) 0;
		padding: var(--space-3);
		background: var(--color-panel-1);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
	}

	.feature-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.feature-list li {
		display: flex;
		align-items: flex-start;
		gap: var(--space-2);
		font-size: var(--text-sm);
		color: var(--gray-700);
		line-height: 1.5;
	}

	:global([data-theme='dark']) .feature-list li {
		color: var(--gray-300);
	}

	.feature-icon {
		font-size: var(--text-lg);
		flex-shrink: 0;
		line-height: 1;
	}

	/* Security Note */
	.security-note {
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: hsla(120, 60%, 95%, 1);
		border-radius: var(--radius-md);
		border: 1px solid hsla(120, 60%, 80%, 1);
		display: flex;
		gap: var(--space-2);
		align-items: flex-start;
	}

	:global([data-theme='dark']) .security-note {
		background: hsla(120, 60%, 15%, 0.3);
		border-color: hsla(120, 60%, 25%, 1);
	}

	.security-icon {
		font-size: var(--text-xl);
		flex-shrink: 0;
		line-height: 1;
	}

	.security-note p {
		margin: 0;
		font-size: var(--text-sm);
		color: var(--gray-700);
		line-height: 1.5;
	}

	:global([data-theme='dark']) .security-note p {
		color: var(--gray-300);
	}
</style>
