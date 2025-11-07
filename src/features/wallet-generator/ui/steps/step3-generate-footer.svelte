<script lang="ts">
	import { createGeneratorState } from '@/features/wallet-generator/stores/generator-state.svelte';
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';

	const generatorState = createGeneratorState();
	const stepManager = useStepManager();

	const isReadyToContinue = $derived(
		generatorState.isStep3Valid && !generatorState.progress.isGenerating
	);

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
	continueText="Generate Wallets"
	onContinue={handleContinue}
	onBack={handleBack}
	hint="Configure generation parameters"
/>
