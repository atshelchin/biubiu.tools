<script lang="ts">
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';
	import { scanState } from '../../stores/scanner-state.svelte';

	const stepManager = useStepManager();

	// Can continue when scan is complete
	const canContinue = $derived(scanState.progress.status === 'completed');

	function handleContinue() {
		if (canContinue) {
			stepManager.next();
		}
	}
</script>

<StepFooter
	showBack={true}
	onBack={() => stepManager.prev()}
	{canContinue}
	continueText="View Results"
	onContinue={handleContinue}
	hint={scanState.progress.status === 'scanning'
		? 'Scan in progress...'
		: 'Complete the scan to view results'}
/>
