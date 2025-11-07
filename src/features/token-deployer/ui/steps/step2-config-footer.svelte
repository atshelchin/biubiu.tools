<script lang="ts">
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';
	import { validateStep2 } from '@/features/token-deployer/stores/step2-state.svelte';

	const stepManager = useStepManager();

	const validation = $derived(validateStep2());
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
	continueText="Continue to Advanced Settings"
	onContinue={handleContinue}
	showBack={true}
	onBack={handleBack}
	hint={validation.isValid
		? 'Ready to proceed'
		: validation.errors[0] || 'Fill in all required fields'}
/>
