<script lang="ts">
	/**
	 * Call Master Step 2: Configure Contract Footer
	 */
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';

	const stepManager = useStepManager();

	// For now, always disabled since the feature is coming soon
	const canContinue = false;

	function handleContinue() {
		if (canContinue) {
			stepManager.next();
		}
	}

	function handleBack() {
		stepManager.prev();
	}
</script>

<StepFooter
	{canContinue}
	continueText="Continue to Execute"
	onContinue={handleContinue}
	showBack={true}
	onBack={handleBack}
	hint="Contract configuration coming soon"
/>
