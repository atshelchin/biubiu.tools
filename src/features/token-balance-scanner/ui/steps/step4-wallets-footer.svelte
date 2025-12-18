<script lang="ts">
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';
	import { step4State } from '../../stores/step4-state.svelte';

	const stepManager = useStepManager();

	const canContinue = $derived(step4State.wallets.length > 0);

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
	continueText="Continue to Scan"
	onContinue={handleContinue}
	hint="Add at least one wallet to continue"
/>
