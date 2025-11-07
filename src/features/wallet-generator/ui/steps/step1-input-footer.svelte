<script lang="ts">
	import { createGeneratorState } from '@/features/wallet-generator/stores/generator-state.svelte';
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';

	const generatorState = createGeneratorState();
	const stepManager = useStepManager();

	const isReadyToContinue = $derived(generatorState.isStep1Valid);

	function handleContinue() {
		if (isReadyToContinue) {
			stepManager.next();
		}
	}
</script>

<StepFooter
	canContinue={isReadyToContinue}
	continueText="Continue to HD Path Configuration"
	onContinue={handleContinue}
	hint="Enter valid input to continue"
/>
