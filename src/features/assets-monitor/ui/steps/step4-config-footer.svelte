<script lang="ts">
	import { useStepManager } from '$lib/components/ui/step-context.svelte';
	import { monitorState } from '../../stores/monitor-state.svelte';

	const stepManager = useStepManager();

	function handleNewScan() {
		monitorState.reset();
		stepManager?.goToStep(0);
	}
</script>

<div class="step-footer">
	<button class="btn-secondary" onclick={handleNewScan}>New Scan</button>
</div>

<style>
	.step-footer {
		display: flex;
		justify-content: flex-end;
		gap: var(--space-3);
		padding: var(--space-4);
		border-top: 1px solid var(--color-border);
	}

	.btn-secondary {
		padding: var(--space-3) var(--space-6);
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all 0.2s ease;
		background: var(--color-panel-2);
		color: var(--color-heading-2);
		border: 1px solid var(--color-border);
	}

	.btn-secondary:hover {
		background: var(--color-panel-3);
		border-color: var(--color-primary);
	}
</style>
