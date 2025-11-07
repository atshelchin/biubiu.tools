<script lang="ts">
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';
	import { step4State } from '@/features/token-distribution/stores/step4-state.svelte';

	const stepManager = useStepManager();

	const isReadyToContinue = $derived(step4State.isValid);

	function handleContinue() {
		if (isReadyToContinue) {
			stepManager.next();
		}
	}
</script>

<StepFooter
	canContinue={isReadyToContinue}
	continueText="Continue to Review"
	onContinue={handleContinue}
	hint="Add at least one recipient to continue"
/>
