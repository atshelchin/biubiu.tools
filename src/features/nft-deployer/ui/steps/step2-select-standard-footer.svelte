<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import { useStepManager } from '$lib/components/ui/step-context.svelte';
	import { step2State } from '../../stores/step2-state.svelte';

	const i18n = useI18n();
	const stepManager = useStepManager();

	const canContinue = $derived(step2State.isValid());

	function handleBack() {
		stepManager.prev();
	}

	function handleNext() {
		if (canContinue) {
			stepManager.next();
		}
	}
</script>

<div class="step-footer">
	<button class="footer-button secondary" onclick={handleBack}>
		{i18n.t('common.back')}
	</button>
	<button class="footer-button primary" disabled={!canContinue} onclick={handleNext}>
		{i18n.t('common.next')}
	</button>
</div>

<style>
	.step-footer {
		display: flex;
		justify-content: space-between;
		gap: var(--space-4);
		padding: var(--space-4);
		border-top: 1px solid var(--color-border);
	}

	.footer-button {
		flex: 1;
		min-height: 48px;
		padding: var(--space-3) var(--space-6);
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.2s ease;
		border: none;
	}

	.footer-button.secondary {
		background: var(--gray-100);
		color: var(--gray-700);
	}

	.footer-button.secondary:hover:not(:disabled) {
		background: var(--gray-200);
	}

	.footer-button.primary {
		background: var(--color-primary);
		color: white;
	}

	.footer-button.primary:hover:not(:disabled) {
		background: var(--color-primary-hover);
	}

	.footer-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	:global([data-theme='dark']) .footer-button.secondary {
		background: var(--gray-800);
		color: var(--gray-300);
	}

	:global([data-theme='dark']) .footer-button.secondary:hover:not(:disabled) {
		background: var(--gray-700);
	}

	@media (max-width: 640px) {
		.step-footer {
			flex-direction: column;
		}

		.footer-button {
			width: 100%;
		}
	}
</style>
