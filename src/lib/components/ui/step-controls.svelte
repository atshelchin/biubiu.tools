<script lang="ts">
	import type { StepManager } from './step-indicator.svelte';

	interface Props {
		manager: StepManager;
		showInfo?: boolean;
	}

	let { manager, showInfo = true }: Props = $props();
</script>

<div class="step-controls">
	<button class="step-btn" disabled={!manager.canGoPrev} onclick={() => manager.prev()}>
		Previous
	</button>

	{#if showInfo}
		<span class="step-info">
			Step {manager.currentStep} of {manager.steps.length}
		</span>
	{/if}

	<button class="step-btn" disabled={!manager.canGoNext} onclick={() => manager.next()}>
		Next
	</button>

	<button class="step-btn reset" onclick={() => manager.reset()}> Reset </button>
</div>

<style>
	.step-controls {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-4);
		background: var(--white);
		border-radius: var(--radius-md);
		border: 1px solid var(--gray-200);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
		flex-wrap: wrap;
	}

	:global([data-theme='dark']) .step-controls {
		background: var(--gray-900);
		border-color: var(--gray-700);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
	}

	.step-btn {
		padding: var(--space-2) var(--space-4);
		background: var(--white);
		border: 1px solid var(--gray-300);
		border-radius: var(--radius-sm);
		cursor: pointer;
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--gray-700);
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		white-space: nowrap;
	}

	:global([data-theme='dark']) .step-btn {
		background: var(--gray-800);
		border-color: var(--gray-600);
		color: var(--gray-200);
	}

	.step-btn:hover:not(:disabled) {
		background: var(--gray-50);
		border-color: var(--gray-400);
		transform: translateY(-1px);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	:global([data-theme='dark']) .step-btn:hover:not(:disabled) {
		background: var(--gray-700);
		border-color: var(--gray-500);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
	}

	.step-btn:active:not(:disabled) {
		transform: translateY(0);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	}

	.step-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
		transform: none;
	}

	.step-btn.reset {
		margin-left: auto;
		background: linear-gradient(135deg, #fee2e2, #fecaca);
		border-color: #ef4444;
		color: #dc2626;
	}

	:global([data-theme='dark']) .step-btn.reset {
		background: linear-gradient(135deg, rgba(220, 38, 38, 0.1), rgba(220, 38, 38, 0.15));
		border-color: #dc2626;
		color: #fca5a5;
	}

	.step-btn.reset:hover:not(:disabled) {
		background: linear-gradient(135deg, #ef4444, #dc2626);
		border-color: #dc2626;
		color: white;
		box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
	}

	:global([data-theme='dark']) .step-btn.reset:hover:not(:disabled) {
		background: linear-gradient(135deg, #dc2626, #b91c1c);
		border-color: #b91c1c;
		color: white;
		box-shadow: 0 2px 8px rgba(220, 38, 38, 0.4);
	}

	.step-info {
		padding: 0 var(--space-2);
		font-size: var(--text-sm);
		color: var(--gray-600);
		font-weight: var(--font-medium);
		white-space: nowrap;
	}

	:global([data-theme='dark']) .step-info {
		color: var(--gray-400);
	}

	/* 手机端适配 */
	@media (max-width: 640px) {
		.step-controls {
			gap: var(--space-2);
			padding: var(--space-3);
		}

		.step-btn {
			flex: 1;
			min-width: 0;
			padding: var(--space-2) var(--space-3);
			font-size: var(--text-xs);
		}

		.step-btn.reset {
			margin-left: 0;
			flex-basis: 100%;
			order: 3;
		}

		.step-info {
			flex-basis: 100%;
			order: -1;
			text-align: center;
			padding: 0 0 var(--space-2) 0;
			font-size: var(--text-xs);
		}
	}
</style>
