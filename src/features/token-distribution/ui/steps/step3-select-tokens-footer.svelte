<script lang="ts">
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';
	import { step3State } from '@/features/token-distribution/stores/step3-state.svelte';

	const stepManager = useStepManager();

	const isReadyToContinue = $derived(step3State.isValid);

	function handleContinue() {
		if (isReadyToContinue) {
			stepManager.next();
		}
	}
</script>

<StepFooter
	canContinue={isReadyToContinue}
	continueText="Continue to Recipients"
	onContinue={handleContinue}
	hint="Select a token and configure amounts to continue"
/>
