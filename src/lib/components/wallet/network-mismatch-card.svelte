<script lang="ts">
	import { AlertTriangle, RefreshCw, Wallet } from '@lucide/svelte';
	import { useI18n } from '@shelchin/i18n';
	import type { NetworkConfig } from '@shelchin/ethereum-connectors';

	interface Props {
		/** Target network to switch to */
		targetNetwork?: NetworkConfig;
		/** Target chain ID */
		targetChainId: number;
		/** Whether network is currently switching */
		isSwitching?: boolean;
		/** Handler for switching network */
		onSwitchNetwork?: () => void;
		/** Handler for connecting different wallet */
		onConnectWallet?: () => void;
	}

	let {
		targetNetwork,
		targetChainId,
		isSwitching = false,
		onSwitchNetwork,
		onConnectWallet
	}: Props = $props();

	const i18n = useI18n();
	const networkName = $derived(targetNetwork?.name || `Chain ${targetChainId}`);
</script>

<div class="network-mismatch-container">
	<div class="warning-card">
		<div class="warning-header">
			<AlertTriangle size={24} class="warning-icon" />
			<h4>{i18n.t('wallet.network_mismatch')}</h4>
		</div>
		<p class="warning-text">
			{i18n.t('wallet.network_mismatch_hint')}
			<strong>{networkName}</strong>
		</p>
	</div>

	<div class="action-buttons">
		<button class="switch-button primary" onclick={onSwitchNetwork} disabled={isSwitching}>
			<RefreshCw size={20} class={isSwitching ? 'spinning' : ''} />
			<span
				>{isSwitching ? i18n.t('wallet.switching_network') : i18n.t('wallet.switch_network')}</span
			>
		</button>
		<button class="switch-button secondary" onclick={onConnectWallet}>
			<Wallet size={20} />
			<span>{i18n.t('wallet.connect_different_wallet')}</span>
		</button>
	</div>
</div>

<style>
	.network-mismatch-container {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.warning-card {
		padding: var(--space-5);
		background: hsla(45, 100%, 50%, 0.08);
		border: 2px solid hsl(45, 100%, 50%);
		border-radius: var(--radius-lg);
	}

	:global([data-theme='dark']) .warning-card {
		background: hsla(45, 100%, 60%, 0.12);
		border-color: hsl(45, 100%, 60%);
	}

	.warning-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-3);
	}

	.warning-header h4 {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: hsl(45, 100%, 35%);
		margin: 0;
	}

	:global([data-theme='dark']) .warning-header h4 {
		color: hsl(45, 100%, 60%);
	}

	:global(.warning-icon) {
		color: hsl(45, 100%, 45%);
		flex-shrink: 0;
	}

	:global([data-theme='dark']) :global(.warning-icon) {
		color: hsl(45, 100%, 60%);
	}

	.warning-text {
		font-size: var(--text-base);
		color: var(--gray-700);
		line-height: 1.6;
		margin: 0;
	}

	:global([data-theme='dark']) .warning-text {
		color: var(--gray-300);
	}

	.warning-text strong {
		color: hsl(45, 100%, 30%);
	}

	:global([data-theme='dark']) .warning-text strong {
		color: hsl(45, 100%, 70%);
	}

	.action-buttons {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-3);
	}

	.switch-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		min-height: 56px;
		padding: var(--space-4) var(--space-5);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-lg);
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.switch-button.primary {
		background: var(--color-primary);
		color: white;
		border-color: var(--color-primary);
	}

	.switch-button.primary:hover:not(:disabled) {
		background: hsl(var(--brand-hue), var(--brand-saturation), 45%);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px hsla(var(--brand-hue), var(--brand-saturation), 50%, 0.3);
	}

	.switch-button.secondary {
		background: var(--color-background);
		color: var(--gray-700);
		border-color: var(--color-border);
	}

	:global([data-theme='dark']) .switch-button.secondary {
		color: var(--gray-300);
	}

	.switch-button.secondary:hover {
		background: var(--color-panel-1);
		border-color: var(--color-primary);
		transform: translateY(-2px);
	}

	.switch-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	:global(.switch-button .spinning) {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (max-width: 640px) {
		.action-buttons {
			grid-template-columns: 1fr;
		}
	}
</style>
