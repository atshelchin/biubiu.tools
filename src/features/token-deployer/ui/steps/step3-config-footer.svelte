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
		stepManager.prev();
	}
</script>

<StepFooter
	canContinue={isReadyToContinue}
	continueText="Continue to Advanced Settings"
	onContinue={handleContinue}
	showBack={true}
	onBack={handleBack}
	hint={validation.isValid
		? 'Ready to proceed'
		: validation.errors[0] || 'Fill in all required fields'}
/>
