<script lang="ts">
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';
	import { scannerState } from '../../stores/scanner-state.svelte';

	const stepManager = useStepManager();

	function handleNewScan() {
		scannerState.reset();
		stepManager.goTo(1);
	}
</script>

<StepFooter
	canContinue={false}
	continueText="Start New Scan"
	onContinue={handleNewScan}
	hint="Export your results or start a new scan"
	showBackButton={false}
/>
