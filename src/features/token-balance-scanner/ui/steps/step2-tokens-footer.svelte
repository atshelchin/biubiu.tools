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
</script>

<StepFooter
	{canContinue}
	continueText="Continue to Wallet Import"
	onContinue={handleContinue}
	hint="Select at least one token to continue"
/>
