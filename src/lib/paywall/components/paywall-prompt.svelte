<script lang="ts">
	import { Crown, CreditCard, X, Sparkles } from '@lucide/svelte';
	import { useI18n } from '@shelchin/i18n';
	import type { PaywallResult } from '../types';

	const i18n = useI18n();

	interface Props {
		/** Paywall check result */
		result: PaywallResult;
		/** Network symbol for displaying fees (e.g., 'ETH', 'BNB') */
		networkSymbol?: string;
		/** Called when user wants to upgrade membership */
		onUpgrade?: () => void;
		/** Called when user confirms pay-per-use */
		onPayPerUse?: () => void;
		/** Called when user cancels */
		onCancel?: () => void;
	}

	let { result, networkSymbol = 'ETH', onUpgrade, onPayPerUse, onCancel }: Props = $props();

	// Only show if not allowed or not free
	const shouldShow = $derived(!result.allowed || !result.freeUse);
</script>

{#if shouldShow}
	<div class="paywall-prompt">
		<div class="prompt-header">
			<div class="icon-wrapper">
				{#if !result.allowed}
					<Crown size={24} />
				{:else}
					<CreditCard size={24} />
				{/if}
			</div>
			<button class="close-btn" onclick={onCancel} aria-label={i18n.t('paywall.prompt.close')}>
				<X size={18} />
			</button>
		</div>

		<div class="prompt-content">
			{#if result.message}
				<p class="message">{result.message}</p>
			{/if}

			{#if result.upgradeHint}
				<p class="hint">
					<Sparkles size={14} />
					{result.upgradeHint}
				</p>
			{/if}
		</div>

		<div class="prompt-actions">
			{#if result.showUpgrade}
				<button class="btn btn-upgrade" onclick={onUpgrade}>
					<Crown size={18} />
					<span>{i18n.t('paywall.prompt.upgrade_membership')}</span>
				</button>
			{/if}

			{#if result.showPayPerUse && result.totalFee !== undefined}
				<button class="btn btn-pay" onclick={onPayPerUse}>
					<CreditCard size={18} />
					<span
						>{i18n.t('paywall.prompt.pay', {
							amount: result.totalFee.toFixed(4),
							symbol: networkSymbol
						})}</span
					>
				</button>
			{/if}
		</div>

		{#if result.showUpgrade && result.showPayPerUse}
			<p class="recommend-tip">{i18n.t('paywall.prompt.recommend_tip')}</p>
		{/if}
	</div>
{/if}

<style>
	.paywall-prompt {
		background: var(--gray-50);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: var(--space-4);
		margin: var(--space-4) 0;
	}

	:global([data-theme='dark']) .paywall-prompt {
		background: var(--gray-800);
	}

	.prompt-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-3);
	}

	.icon-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		background: linear-gradient(135deg, #f97316, #ea580c);
		border-radius: 50%;
		color: white;
	}

	.icon-wrapper :global(svg) {
		width: 20px;
		height: 20px;
	}

	.close-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		background: transparent;
		border: none;
		border-radius: var(--radius-md);
		color: var(--gray-500);
		cursor: pointer;
		transition: all 0.2s;
	}

	.close-btn:hover {
		background: var(--gray-100);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .close-btn:hover {
		background: var(--gray-700);
		color: var(--gray-300);
	}

	.prompt-content {
		margin-bottom: var(--space-4);
	}

	.message {
		margin: 0 0 var(--space-2) 0;
		font-size: var(--text-sm);
		color: var(--gray-700);
		line-height: 1.5;
	}

	:global([data-theme='dark']) .message {
		color: var(--gray-300);
	}

	.hint {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		margin: 0;
		font-size: var(--text-xs);
		color: #f97316;
	}

	.hint :global(svg) {
		flex-shrink: 0;
	}

	.prompt-actions {
		display: flex;
		gap: var(--space-3);
		flex-wrap: wrap;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.2s;
		flex: 1;
		min-width: 140px;
	}

	.btn :global(svg) {
		width: 16px;
		height: 16px;
	}

	.btn-upgrade {
		background: linear-gradient(135deg, #f97316, #ea580c);
		color: white;
	}

	.btn-upgrade:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
	}

	.btn-pay {
		background: var(--gray-100);
		color: var(--gray-700);
		border: 1px solid var(--color-border);
	}

	:global([data-theme='dark']) .btn-pay {
		background: var(--gray-700);
		color: var(--gray-200);
	}

	.btn-pay:hover {
		background: var(--gray-200);
	}

	:global([data-theme='dark']) .btn-pay:hover {
		background: var(--gray-600);
	}

	.recommend-tip {
		margin: var(--space-3) 0 0 0;
		font-size: var(--text-xs);
		color: var(--gray-500);
		text-align: center;
	}
</style>
