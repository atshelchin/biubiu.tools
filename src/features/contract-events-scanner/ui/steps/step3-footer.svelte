<script lang="ts">
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';
	import { timeRangeState } from '../../stores/scanner-state.svelte';

	const stepManager = useStepManager();

	// Validation
	const isReady = $derived(timeRangeState.isValid());

	function handleContinue() {
		if (isReady) {
			stepManager.next();
		}
	}
</script>

<StepFooter
	showBack={true}
	onBack={() => stepManager.prev()}
	canContinue={isReady}
	continueText="Continue to Scan"
	onContinue={handleContinue}
	hint="Set a valid time or block range to continue"
/>
