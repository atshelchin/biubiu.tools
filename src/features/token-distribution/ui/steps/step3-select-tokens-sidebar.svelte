<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import WalletConnectionStatus from '@/lib/components/ui/wallet-connection-status.svelte';
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import { step3State } from '@/features/token-distribution/stores/step3-state.svelte';

	const i18n = useI18n();
	const stepManager = useStepManager();

	function goBackToStep1() {
		stepManager.goTo(1);
	}
</script>

<StepSidebar
	stepNumber={3}
	title={i18n.t('tools.one_to_many_transfer.step3.sidebar.title')}
	description={i18n.t('tools.one_to_many_transfer.step3.sidebar.description')}
>
	<WalletConnectionStatus
		showChangeButton={true}
		onChangeWallet={goBackToStep1}
		class="wallet-status-section"
	/>

	<!-- Current Selection Summary -->
	{#if step3State.selectedToken}
		<div class="selection-summary">
			<h4>{i18n.t('tools.one_to_many_transfer.step3.content.select_token.title')}</h4>
			<div class="selected-token">
				<span class="token-symbol">{step3State.selectedToken.symbol}</span>
				<span class="token-type-badge">{step3State.tokenType.toUpperCase()}</span>
			</div>
			{#if step3State.isFungible && step3State.amountPerRecipient}
				<div class="amount-info">
					<span class="label"
						>{i18n.t('tools.one_to_many_transfer.step3.content.amount_input.title')}:</span
					>
					<span class="value"
						>{step3State.amountPerRecipient} {step3State.selectedToken.symbol}</span
					>
				</div>
			{/if}
		</div>
	{/if}

	<div class="help-box">
		<h4>{i18n.t('tools.one_to_many_transfer.step3.content.token_type.title')}</h4>
		<div class="type-info">
			<strong>{i18n.t('tools.one_to_many_transfer.step3.content.token_type.native')}:</strong>
			{i18n.t('tools.one_to_many_transfer.step3.content.token_type.native_desc')}
		</div>
		<div class="type-info">
			<strong>{i18n.t('tools.one_to_many_transfer.step3.content.token_type.erc20')}:</strong>
			{i18n.t('tools.one_to_many_transfer.step3.content.token_type.erc20_desc')}
		</div>
		<div class="type-info">
			<strong>{i18n.t('tools.one_to_many_transfer.step3.content.token_type.erc721')}:</strong>
			{i18n.t('tools.one_to_many_transfer.step3.content.token_type.erc721_desc')}
		</div>
		<div class="type-info">
			<strong>{i18n.t('tools.one_to_many_transfer.step3.content.token_type.erc1155')}:</strong>
			{i18n.t('tools.one_to_many_transfer.step3.content.token_type.erc1155_desc')}
		</div>
	</div>
</StepSidebar>

<style>
	:global(.wallet-status-section) {
		margin: var(--space-4) 0;
	}

	.selection-summary {
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: hsla(210, 100%, 95%, 1);
		border-radius: var(--radius-md);
		border: 1px solid hsla(210, 100%, 80%, 1);
	}

	:global([data-theme='dark']) .selection-summary {
		background: hsla(210, 100%, 10%, 0.3);
		border-color: hsla(210, 100%, 30%, 1);
	}

	.selection-summary h4 {
		margin: 0 0 var(--space-2) 0;
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .selection-summary h4 {
		color: var(--gray-300);
	}

	.selected-token {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-2);
	}

	.token-symbol {
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .token-symbol {
		color: var(--gray-100);
	}

	.token-type-badge {
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		padding: var(--space-1) var(--space-2);
		background: hsl(210, 100%, 50%);
		color: white;
		border-radius: var(--radius-sm);
	}

	.amount-info {
		font-size: var(--text-sm);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .amount-info {
		color: var(--gray-300);
	}

	.amount-info .label {
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .amount-info .label {
		color: var(--gray-400);
	}

	.amount-info .value {
		font-weight: var(--font-semibold);
	}

	.help-box {
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: var(--color-panel-1);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
	}

	.help-box h4 {
		margin: 0 0 var(--space-3) 0;
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .help-box h4 {
		color: var(--gray-100);
	}

	.type-info {
		font-size: var(--text-sm);
		color: var(--gray-700);
		line-height: 1.6;
		margin-bottom: var(--space-2);
	}

	:global([data-theme='dark']) .type-info {
		color: var(--gray-300);
	}

	.type-info strong {
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .type-info strong {
		color: var(--gray-100);
	}
</style>
