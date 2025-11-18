<script lang="ts">
	import { ChevronRight } from '@lucide/svelte';
	import { useI18n } from '@shelchin/i18n/svelte';

	interface Props {
		/** Show back button */
		showBack?: boolean;
		/** Back button click handler */
		onBack?: () => void;
		/** Can continue to next step */
		canContinue: boolean;
		/** Continue button text (dynamic) */
		continueText?: string;
		/** Continue button click handler */
		onContinue?: () => void;
		/** Hint message when cannot continue (can be dynamic based on state) */
		hint?: string;
		/** Custom continue button class */
		continueButtonClass?: string;
		/** Disable continue button even when canContinue is true */
		continueDisabled?: boolean;
	}

	let {
		showBack = false,
		onBack,
		canContinue,
		continueText,
		onContinue,
		hint = '',
		continueButtonClass = 'continue-btn',
		continueDisabled = false
	}: Props = $props();

	const i18n = useI18n();
	const defaultContinueText = $derived(i18n.t('common.continue'));
	const backText = $derived(i18n.t('common.back'));
</script>

<div class="step-footer">
	{#if showBack && onBack}
		<button class="btn-secondary" onclick={onBack}>← {backText}</button>
	{/if}

	{#if canContinue && onContinue}
		<button class={continueButtonClass} onclick={onContinue} disabled={continueDisabled}>
			{continueText || defaultContinueText}
			<ChevronRight size={18} />
		</button>
	{:else if hint}
		<p class="footer-hint">{hint}</p>
	{/if}
</div>

<style>
	button {
		/* width: 100%; */
	}
	.step-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		/* padding: var(--space-4); */
		/* background: var(--color-panel-1); */
		/* border-top: 1px solid var(--color-border); */
		width: 100%;
	}

	:global([data-theme='dark']) .step-footer {
		background: var(--gray-800);
	}

	.btn-secondary {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		background: var(--gray-200);
		color: var(--gray-700);
		border: none;
		border-radius: var(--radius-sm);
		font-weight: var(--font-medium);
		font-size: var(--text-sm);
		cursor: pointer;
		transition: all 0.2s;
	}

	:global([data-theme='dark']) .btn-secondary {
		background: var(--gray-700);
		color: var(--gray-200);
	}

	.btn-secondary:hover {
		background: var(--gray-300);
	}

	:global([data-theme='dark']) .btn-secondary:hover {
		background: var(--gray-600);
	}

	.footer-hint {
		color: var(--gray-500);
		font-size: var(--text-sm);
		font-style: italic;
		margin: 0;
		flex: 1;
		text-align: center;
	}

	:global([data-theme='dark']) .footer-hint {
		color: var(--gray-400);
	}

	/* Continue button styles - can be overridden by parent */
	:global(.step-footer .continue-btn),
	:global(.step-footer .footer-continue-btn),
	:global(.step-footer .btn-execute) {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		background: var(--color-button-primary);
		color: var(--color-button-primary-foreground);
		border: none;
		border-radius: var(--radius-sm);
		font-weight: var(--font-semibold);
		font-size: var(--text-sm);
		cursor: pointer;
		transition: all 0.2s;
		margin-left: auto;
	}

	:global([data-theme='dark']) :global(.step-footer .continue-btn),
	:global([data-theme='dark']) :global(.step-footer .footer-continue-btn),
	:global([data-theme='dark']) :global(.step-footer .btn-execute) {
		background: var(--brand-600);
		color: var(--gray-200);
		box-shadow: var(--shadow-sm);
	}

	:global(.step-footer .continue-btn:hover),
	:global(.step-footer .footer-continue-btn:hover),
	:global(.step-footer .btn-execute:hover:not(:disabled)) {
		opacity: 0.9;
		transform: translateY(-1px);
		box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
	}

	:global([data-theme='dark']) :global(.step-footer .continue-btn:hover),
	:global([data-theme='dark']) :global(.step-footer .footer-continue-btn:hover),
	:global([data-theme='dark']) :global(.step-footer .btn-execute:hover:not(:disabled)) {
		opacity: 0.85;
		box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
	}

	:global(.step-footer .btn-execute:disabled) {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
