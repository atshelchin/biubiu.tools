<script lang="ts">
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import { useI18n } from '@shelchin/i18n';
	import { step2State } from '@/features/token-deployer/stores/step2-state.svelte';

	const stepManager = useStepManager();
	const i18n = useI18n();

	// Derive can continue state
	let summary = $derived(step2State.summary);
	let canContinue = $derived(Boolean(summary?.allPassed));

	function handleBack() {
		stepManager.prev();
	}

	function handleContinue() {
		if (canContinue) {
			stepManager.next();
		}
	}
</script>

<div class="footer-buttons">
	<button class="button button-secondary" onclick={handleBack}>
		{i18n.t('token-deployer.step2.footer.back')}
	</button>
	<button class="button button-primary" disabled={!canContinue} onclick={handleContinue}>
		{i18n.t('token-deployer.step2.footer.continue')}
	</button>
</div>

<style>
	.footer-buttons {
		display: flex;
		gap: var(--space-3);
		justify-content: flex-end;
	}

	.button {
		padding: var(--space-3) var(--space-6);
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.2s;
		border: none;
		min-width: 120px;
	}

	.button-secondary {
		background: var(--color-panel-2);
		color: var(--color-text-primary);
		border: 2px solid var(--color-border);
	}

	.button-secondary:hover {
		background: var(--color-panel-3);
	}

	.button-primary {
		background: var(--color-primary);
		color: white;
	}

	.button-primary:hover:not(:disabled) {
		opacity: 0.9;
		transform: translateY(-1px);
	}

	.button-primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
