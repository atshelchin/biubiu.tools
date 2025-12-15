<script lang="ts">
	import { Send, Loader2 } from '@lucide/svelte';
	import { useI18n } from '@shelchin/i18n/svelte';
	import Modal from './modal.svelte';

	interface Props {
		open: boolean;
		walletAddress: string;
		estimatedGasCost: string;
		suggestedAmount: string;
		networkSymbol: string;
		isSendingGas: boolean;
		gasSendAmount: string;
		isConnected: boolean;
		onClose: () => void;
		onSend: () => void;
		onAmountChange: (amount: string) => void;
	}

	let {
		open,
		walletAddress,
		estimatedGasCost,
		suggestedAmount,
		networkSymbol,
		isSendingGas,
		gasSendAmount,
		isConnected,
		onClose,
		onSend,
		onAmountChange
	}: Props = $props();

	const i18n = useI18n();
</script>

<Modal {open} {onClose} title={i18n.t('components.gas_funding.title')} maxWidth="500px">
	<div class="modal-body">
		<div class="wallet-info">
			<span class="label">{i18n.t('components.gas_funding.target_wallet')}</span>
			<code class="wallet-address">{walletAddress}</code>
		</div>

		<div class="gas-info">
			<p class="info-item">
				<span class="info-label">{i18n.t('components.gas_funding.estimated_gas')}:</span>
				<strong>{estimatedGasCost} {networkSymbol}</strong>
			</p>
			<p class="info-item suggested">
				<span class="info-label">{i18n.t('components.gas_funding.suggested_amount')}:</span>
				<strong>{suggestedAmount} {networkSymbol}</strong>
			</p>
		</div>

		<div class="input-group">
			<label for="gas-amount">{i18n.t('components.gas_funding.send_amount')}</label>
			<div class="input-wrapper">
				<input
					id="gas-amount"
					type="number"
					value={gasSendAmount}
					oninput={(e) => onAmountChange(e.currentTarget.value)}
					placeholder={i18n.t('components.gas_funding.amount_placeholder')}
					step="0.001"
					min="0"
				/>
				<span class="unit">{networkSymbol}</span>
			</div>
		</div>

		<p class="hint">
			💡 {i18n.t('components.gas_funding.tip')}
		</p>

		<p class="security-notice">
			{i18n.t('components.gas_funding.security_notice')}
		</p>
	</div>

	{#snippet footer()}
		<div class="modal-footer">
			<button class="btn-secondary" onclick={onClose} disabled={isSendingGas}>
				{i18n.t('components.gas_funding.cancel')}
			</button>
			<button class="btn-primary" onclick={onSend} disabled={isSendingGas || !isConnected}>
				{#if isSendingGas}
					<Loader2 size={16} class="spinning" />
					{i18n.t('components.gas_funding.sending')}
				{:else}
					<Send size={16} />
					{i18n.t('components.gas_funding.btn_send')}
				{/if}
			</button>
		</div>
	{/snippet}
</Modal>

<style>
	.modal-body {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.wallet-info {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.wallet-info .label {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-muted-foreground);
	}

	.wallet-address {
		padding: var(--space-2);
		background: var(--color-muted);
		border-radius: var(--radius-md);
		font-family: var(--font-mono);
		font-size: var(--text-sm);
		word-break: break-all;
	}

	.gas-info {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		padding: var(--space-3);
		background: var(--color-muted);
		border-radius: var(--radius-md);
	}

	.info-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 0;
		font-size: var(--text-sm);
	}

	.info-item.suggested {
		color: #10b981;
	}

	.info-label {
		color: var(--color-muted-foreground);
	}

	.input-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.input-group label {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-foreground);
	}

	.input-wrapper {
		position: relative;
		display: flex;
		align-items: center;
	}

	.input-wrapper input {
		flex: 1;
		padding: var(--space-2) var(--space-3);
		padding-right: 60px;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-background);
		color: var(--color-foreground);
		font-size: var(--text-base);
		transition: border-color 0.2s ease;
	}

	.input-wrapper input:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.input-wrapper .unit {
		position: absolute;
		right: var(--space-3);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-muted-foreground);
	}

	.hint {
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
		padding: var(--space-2);
		background: rgba(59, 130, 246, 0.1);
		border-radius: var(--radius-md);
		border-left: 3px solid #3b82f6;
		margin: 0;
	}

	.security-notice {
		font-size: var(--text-sm);
		color: #10b981;
		padding: var(--space-2);
		background: rgba(16, 185, 129, 0.1);
		border-radius: var(--radius-md);
		border-left: 3px solid #10b981;
		margin: 0;
	}

	.modal-footer {
		display: flex;
		gap: var(--space-2);
	}

	.btn-secondary,
	.btn-primary {
		flex: 1;
		padding: var(--space-2) var(--space-4);
		border-radius: var(--radius-md);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
	}

	.btn-secondary {
		background: var(--color-muted);
		border: 1px solid var(--color-border);
		color: var(--color-foreground);
	}

	.btn-secondary:hover:not(:disabled) {
		background: var(--color-accent);
	}

	.btn-primary {
		background: var(--color-primary);
		border: 1px solid var(--color-primary);
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		opacity: 0.9;
	}

	.btn-secondary:disabled,
	.btn-primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	:global(.spinning) {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
