<script lang="ts">
	import { createGeneratorState } from '@/features/wallet-generator/stores/generator-state.svelte';
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';

	const generatorState = createGeneratorState();
	const stepManager = useStepManager();

	const isReadyToContinue = $derived(generatorState.isStep2Valid);

	function handleContinue() {
		if (isReadyToContinue) {
			stepManager.next();
		}
	}

	function handleBack() {
		stepManager.prev();
	}
</script>

<StepFooter
	canContinue={isReadyToContinue}
	continueText="Continue to Generation"
	onContinue={handleContinue}
	onBack={handleBack}
	hint="Select blockchain and HD path to continue"
/>
