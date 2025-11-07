<script lang="ts">
	import { fade } from 'svelte/transition';
	import { step3State } from '@/features/token-sweep/stores/step3-state.svelte';
	import StepSidebar from '@/features/token-sweep/ui/components/step-sidebar.svelte';
	import StepSummary from '@/features/token-sweep/ui/components/step-summary.svelte';

	// Use shared state from step3State
	let selectedTokenIds = $derived(step3State.selectedTokenIds);
</script>

<StepSidebar stepNumber={3} title="Select Tokens" description="Choose which tokens to sweep">
	{#if selectedTokenIds.size > 0}
		<div transition:fade>
			<StepSummary title="Selected Tokens">
				<div class="summary-item">
					<span>Count:</span>
					<strong>{selectedTokenIds.size}</strong>
				</div>
			</StepSummary>
		</div>
	{:else}
		<p class="empty-hint">No tokens selected</p>
	{/if}
</StepSidebar>

<style>
	.empty-hint {
		margin-top: var(--space-4);
		padding: var(--space-3);
		text-align: center;
		font-size: var(--text-sm);
		color: var(--gray-500);
		font-style: italic;
	}
</style>
