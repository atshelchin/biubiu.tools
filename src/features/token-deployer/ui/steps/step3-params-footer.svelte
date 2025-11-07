<script lang="ts">
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';
	import { validateStep3 } from '@/features/token-deployer/stores/step3-state.svelte';

	const stepManager = useStepManager();

	const validation = $derived(validateStep3());
	const isReadyToContinue = $derived(validation.isValid);

	function handleContinue() {
		if (isReadyToContinue) {
			stepManager.next();
		}
	}

	function handleBack() {
		stepManager.previous();
	}
</script>

<StepFooter
	canContinue={isReadyToContinue}
	continueText="Review & Deploy"
	onContinue={handleContinue}
	showBack={true}
	onBack={handleBack}
	hint={validation.isValid
		? 'All parameters are valid'
		: validation.errors[0] || 'Fix validation errors'}
/>
