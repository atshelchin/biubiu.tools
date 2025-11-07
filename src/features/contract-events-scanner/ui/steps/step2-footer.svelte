<script lang="ts">
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';
	import { contractConfigState } from '../../stores/scanner-state.svelte';
	import { isAddress } from 'viem';

	const stepManager = useStepManager();

	// Validation
	const isReady = $derived(
		isAddress(contractConfigState.contractAddress) &&
			contractConfigState.selectedEvent !== null &&
			contractConfigState.parsedEvents.length > 0
	);

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
	continueText="Continue to Time Range"
	onContinue={handleContinue}
	hint="Configure contract address, ABI, and select an event to continue"
/>
