<script lang="ts">
	import { createGeneratorState } from '@/features/wallet-generator/stores/generator-state.svelte';
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';

	const generatorState = createGeneratorState();
	const stepManager = useStepManager();

	function handleBack() {
		stepManager.prev();
	}

	function handleReset() {
		generatorState.reset();
		stepManager.goTo(1);
	}
</script>

<div class="custom-footer">
	<button class="btn-secondary" onclick={handleBack}>← Back</button>
	<p class="footer-hint">Export your wallets before closing</p>
	<button class="reset-button" onclick={handleReset}>
		<span>🔄</span>
		<span>Generate New Wallets</span>
	</button>
</div>

<style>
	.custom-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		padding: var(--space-4);
		background: var(--color-panel-1);
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

	.btn-secondary:hover {
		background: var(--gray-300);
	}

	.footer-hint {
		color: var(--gray-500);
		font-size: var(--text-sm);
		font-style: italic;
		margin: 0;
		flex: 1;
		text-align: center;
	}

	.reset-button {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: var(--radius-sm);
		font-weight: var(--font-semibold);
		font-size: var(--text-sm);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.reset-button:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px hsla(210, 100%, 50%, 0.3);
	}
</style>
