<script lang="ts">
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';
	import { ensState } from '../../stores/ens-state.svelte';

	const stepManager = useStepManager();
	const canContinue = $derived(ensState.allNames.length > 0);

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
	hint="Generate or import at least one name"
/>
