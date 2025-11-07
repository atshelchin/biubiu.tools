<script lang="ts">
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import { step3State } from '@/features/token-sweep/stores/step3-state.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';

	const stepManager = useStepManager();

	// Use shared state from step3State
	let selectedTokenIds = $derived(step3State.selectedTokenIds);

	// Check if can continue
	let canContinue = $derived(selectedTokenIds.size > 0);

	function handleContinue() {
		if (canContinue) {
			console.log('Selected tokens:', step3State.getSelectedTokens());
			stepManager.goTo(4);
		}
	}
</script>

<StepFooter
	{canContinue}
	onContinue={handleContinue}
	hint="Please select at least one token to continue"
/>
