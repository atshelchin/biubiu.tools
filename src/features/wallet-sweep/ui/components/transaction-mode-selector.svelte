<script lang="ts">
	import type { TransactionMode } from '@/features/wallet-sweep/types/fee';
	import { Wallet, Key, AlertCircle } from '@lucide/svelte';

	interface Props {
		mode: TransactionMode;
		onModeChange: (mode: TransactionMode) => void;
		disabled?: boolean;
	}

	let { mode = $bindable('connected'), onModeChange, disabled = false }: Props = $props();

	function handleModeChange(newMode: TransactionMode) {
		if (!disabled) {
			mode = newMode;
			onModeChange(newMode);
		}
	}
</script>

<div class="transaction-mode-selector">
	<h4 class="selector-title">Transaction Mode</h4>
	<p class="selector-description">Choose how to sign and send transactions</p>

	<div class="mode-options">
		<!-- Connected Wallet Mode -->
		<button
			class="mode-option"
			class:selected={mode === 'connected'}
			class:disabled
			onclick={() => handleModeChange('connected')}
			{disabled}
		>
			<div class="mode-icon">
				<Wallet size={24} />
			</div>
			<div class="mode-content">
				<h5>Connected Wallet</h5>
				<p>Sign each transaction manually</p>
				<ul class="mode-features">
					<li>✓ Most secure</li>
					<li>✓ No private key exposure</li>
					<li>⚠️ Requires manual approval for each transaction</li>
					<li>⚠️ Not suitable for batch operations (100+ transactions)</li>
				</ul>
			</div>
		</button>

		<!-- Temporary Wallet Mode -->
		<button
			class="mode-option"
			class:selected={mode === 'temporary'}
			class:disabled
			onclick={() => handleModeChange('temporary')}
			{disabled}
		>
			<div class="mode-icon">
				<Key size={24} />
			</div>
			<div class="mode-content">
				<h5>Temporary Wallet (Recommended for Batch)</h5>
				<p>Sign once, automate all transactions</p>
				<ul class="mode-features">
					<li>✓ Perfect for batch operations (100+ transactions)</li>
					<li>✓ Sign once, no more prompts</li>
					<li>✓ Private key stored in browser only</li>
					<li>✓ Can export private key for recovery</li>
					<li>⚠️ Requires funding the temporary wallet with gas</li>
				</ul>
			</div>
		</button>
	</div>

	{#if mode === 'temporary'}
		<div class="mode-warning">
			<AlertCircle size={18} />
			<div>
				<strong>Important:</strong> You'll need to fund the temporary wallet with enough native coins
				(ETH/BNB/MATIC) to cover gas fees for all transactions.
			</div>
		</div>
	{/if}
</div>

<style>
	.transaction-mode-selector {
		margin: var(--space-4) 0;
	}

	.selector-title {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--gray-800);
		margin: 0 0 var(--space-2) 0;
	}
	:global([data-theme='dark']) .selector-title {
		color: var(--gray-200);
	}

	.selector-description {
		font-size: var(--text-sm);
		color: var(--gray-600);
		margin: 0 0 var(--space-4) 0;
	}
	:global([data-theme='dark']) .selector-description {
		color: var(--gray-400);
	}

	.mode-options {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-4);
		margin-bottom: var(--space-4);
	}

	@media (max-width: 768px) {
		.mode-options {
			grid-template-columns: 1fr;
		}
	}

	.mode-option {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-lg);
		cursor: pointer;
		transition: all 0.2s;
		text-align: left;
	}

	.mode-option:hover:not(.disabled) {
		border-color: var(--color-primary);
		box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
	}

	.mode-option.selected {
		border-color: var(--color-primary);
		background: rgba(59, 130, 246, 0.05);
	}

	.mode-option.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	:global([data-theme='dark']) .mode-option {
		background: var(--gray-800);
		border-color: var(--gray-700);
	}

	:global([data-theme='dark']) .mode-option.selected {
		background: rgba(59, 130, 246, 0.15);
		border-color: var(--color-primary);
	}

	.mode-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		background: var(--color-primary);
		color: white;
		border-radius: var(--radius-md);
		margin-bottom: var(--space-3);
	}

	.mode-option.selected .mode-icon {
		background: linear-gradient(135deg, #3b82f6, #2563eb);
	}

	.mode-content {
		width: 100%;
	}

	.mode-content h5 {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-800);
		margin: 0 0 var(--space-1) 0;
	}
	:global([data-theme='dark']) .mode-content h5 {
		color: var(--gray-200);
	}

	.mode-content > p {
		font-size: var(--text-sm);
		color: var(--gray-600);
		margin: 0 0 var(--space-3) 0;
	}
	:global([data-theme='dark']) .mode-content > p {
		color: var(--gray-400);
	}

	.mode-features {
		list-style: none;
		padding: 0;
		margin: 0;
		font-size: var(--text-sm);
	}

	.mode-features li {
		padding: var(--space-1) 0;
		color: var(--gray-700);
	}
	:global([data-theme='dark']) .mode-features li {
		color: var(--gray-300);
	}

	.mode-warning {
		display: flex;
		gap: var(--space-2);
		padding: var(--space-3);
		background: hsla(45, 100%, 95%, 1);
		border: 1px solid hsl(45, 100%, 60%);
		border-radius: var(--radius-md);
		color: hsl(45, 100%, 25%);
		font-size: var(--text-sm);
	}
	:global([data-theme='dark']) .mode-warning {
		background: hsla(45, 100%, 15%, 0.3);
		border-color: hsl(45, 100%, 40%);
		color: hsl(45, 100%, 70%);
	}

	.mode-warning strong {
		font-weight: var(--font-semibold);
	}
</style>
