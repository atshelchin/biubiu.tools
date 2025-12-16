<script lang="ts">
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';
	import { scannerState } from '../../stores/scanner-state.svelte';

	const stepManager = useStepManager();

	const canContinue = $derived(scannerState.selectedTokens.size > 0);

	function handleContinue() {
		if (canContinue) {
			stepManager.next();
		}
	}

	function goBack() {
		stepManager.prev();
	}
</script>

<StepFooter
	showBack={true}
	onBack={goBack}
	{canContinue}
	continueText="Continue to Import Addresses"
	onContinue={handleContinue}
	hint="Select at least one token to continue"
/>
