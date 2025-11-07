<script lang="ts">
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';
	import { resetAllStates } from '../../stores/scanner-state.svelte';

	const stepManager = useStepManager();

	function handleNewScan() {
		// Reset all state
		resetAllStates();
		// Go back to step 1
		stepManager.goTo(1);
	}
</script>

<StepFooter
	showBack={true}
	onBack={() => stepManager.prev()}
	canContinue={true}
	continueText="Start New Scan"
	onContinue={handleNewScan}
/>
