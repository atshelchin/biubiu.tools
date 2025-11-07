<script lang="ts">
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';
	import { scannerState } from '../../stores/scanner-state.svelte';

	const stepManager = useStepManager();

	const canContinue = $derived(scannerState.wallets.length > 0);

	function handleContinue() {
		if (canContinue) {
			stepManager.next();
		}
	}
</script>

<StepFooter
	{canContinue}
	continueText="Continue to Scan"
	onContinue={handleContinue}
	hint="Add at least one wallet to continue"
/>
