<script lang="ts">
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';
	import { scannerState } from '../../stores/scanner-state.svelte';

	const stepManager = useStepManager();

	const canContinue = $derived(scannerState.scanStatus === 'completed');

	function handleContinue() {
		if (canContinue) {
			stepManager.next();
		}
	}
</script>

<StepFooter
	{canContinue}
	continueText="View Results"
	onContinue={handleContinue}
	hint="Complete the scan to continue"
/>
