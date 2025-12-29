<script lang="ts">
	/**
	 * Call Master Step 3: Execute Calls Footer
	 */
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';

	const stepManager = useStepManager();

	// For now, always disabled since the feature is coming soon
	const canExecute = false;

	function handleExecute() {
		// Future: Execute the contract call
	}

	function handleBack() {
		stepManager.prev();
	}
</script>

<StepFooter
	canContinue={canExecute}
	continueText="Execute Call"
	onContinue={handleExecute}
	showBack={true}
	onBack={handleBack}
	hint="Execution coming soon"
/>
