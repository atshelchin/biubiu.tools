<script lang="ts">
	import { useStepManager } from '$lib/components/ui/step-context.svelte';

	const stepManager = useStepManager();

	const canContinue = $derived(stepManager.isCurrentStepValid);
</script>

<div class="step-footer">
	<button class="btn-secondary" onclick={() => stepManager?.previousStep()}>Previous</button>
	<button class="btn-primary" disabled={!canContinue} onclick={() => stepManager?.nextStep()}>
		Start Scanning
	</button>
</div>

<style>
	.step-footer {
		display: flex;
		justify-content: flex-end;
		gap: var(--space-3);
		padding: var(--space-4);
		border-top: 1px solid var(--color-border);
	}

	.btn-primary,
	.btn-secondary {
		padding: var(--space-3) var(--space-6);
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.btn-primary {
		background: var(--color-primary);
		color: white;
		border: none;
	}

	.btn-primary:hover:not(:disabled) {
		background: var(--brand-700);
		transform: translateY(-1px);
	}

	.btn-primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none;
	}

	.btn-secondary {
		background: var(--color-panel-2);
		color: var(--color-heading-2);
		border: 1px solid var(--color-border);
	}

	.btn-secondary:hover {
		background: var(--color-panel-3);
		border-color: var(--color-primary);
	}
</style>
