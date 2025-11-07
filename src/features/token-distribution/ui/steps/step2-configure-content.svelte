<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import { CheckCircle2 } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	const connectStore = useConnectStore();
	const stepManager = useStepManager();

	// Get current network details
	const currentNetwork = $derived(
		connectStore.currentChainId
			? connectStore.networks.find((n) => n.chainId === connectStore.currentChainId)
			: undefined
	);

	const isConnected = $derived(connectStore.isConnected);

	function goBackToStep1() {
		stepManager.goTo(1);
	}
</script>

<div class="step-content">
	<StepContentHeader
		title="Source Wallet Ready"
		description="Your wallet is connected and ready for token distribution"
	/>

	{#if isConnected && currentNetwork}
		<div class="status-container" transition:fade>
			<div class="status-card success">
				<CheckCircle2 size={48} class="status-icon" />
				<h3>Wallet Connected</h3>
				<p class="wallet-address">{connectStore.address || ''}</p>
				<p class="network-info">Network: {currentNetwork.name}</p>
			</div>

			<div class="info-box">
				<h4>Before Continuing:</h4>
				<ul class="checklist">
					<li>Ensure you have enough tokens to distribute</li>
					<li>Verify you have sufficient gas fees (ETH)</li>
					<li>Double-check you're on the correct network</li>
				</ul>
			</div>
		</div>
	{:else}
		<div class="error-state">
			<p>Wallet not connected. Please go back to Step 1.</p>
			<button class="back-button" onclick={goBackToStep1}>Go Back to Step 1</button>
		</div>
	{/if}
</div>

<style>
	.step-content {
		padding: var(--space-6);
	}

	.status-container {
		margin-top: var(--space-6);
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}

	.status-card {
		padding: var(--space-8);
		background: var(--color-panel-1);
		border-radius: var(--radius-lg);
		border: 2px solid var(--color-border);
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-3);
	}

	.status-card.success {
		border-color: hsla(120, 60%, 50%, 0.5);
		background: hsla(120, 60%, 98%, 1);
	}

	:global([data-theme='dark']) .status-card.success {
		background: hsla(120, 60%, 10%, 0.2);
		border-color: hsla(120, 60%, 30%, 0.5);
	}

	.status-card h3 {
		margin: 0;
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .status-card h3 {
		color: var(--gray-100);
	}

	:global(.status-icon) {
		color: hsla(120, 60%, 50%, 1);
	}

	.wallet-address {
		font-family: monospace;
		font-size: var(--text-sm);
		color: var(--gray-600);
		margin: 0;
		word-break: break-all;
	}

	:global([data-theme='dark']) .wallet-address {
		color: var(--gray-400);
	}

	.network-info {
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		color: var(--gray-700);
		margin: 0;
	}

	:global([data-theme='dark']) .network-info {
		color: var(--gray-300);
	}

	.info-box {
		padding: var(--space-4);
		background: var(--color-panel-1);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
	}

	.info-box h4 {
		margin: 0 0 var(--space-3) 0;
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .info-box h4 {
		color: var(--gray-100);
	}

	.checklist {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.checklist li {
		padding-left: var(--space-6);
		position: relative;
		font-size: var(--text-sm);
		color: var(--gray-700);
		line-height: 1.5;
	}

	:global([data-theme='dark']) .checklist li {
		color: var(--gray-300);
	}

	.checklist li::before {
		content: '✓';
		position: absolute;
		left: 0;
		color: hsla(120, 60%, 50%, 1);
		font-weight: bold;
	}

	.error-state {
		margin-top: var(--space-6);
		padding: var(--space-8);
		background: var(--color-panel-1);
		border-radius: var(--radius-lg);
		border: 2px solid hsla(0, 80%, 50%, 0.3);
		text-align: center;
	}

	.error-state p {
		color: var(--gray-700);
		font-size: var(--text-base);
		margin-bottom: var(--space-4);
	}

	:global([data-theme='dark']) .error-state p {
		color: var(--gray-300);
	}

	.back-button {
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

	.back-button:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 8px hsla(0, 0%, 0%, 0.15);
	}

	@media (max-width: 640px) {
		.step-content {
			padding: var(--space-3);
		}
	}
</style>
