<script lang="ts">
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';
	import { appState } from '../../stores/app-state.svelte';

	const stepManager = useStepManager();

	const isReadyToContinue = $derived(Boolean(appState.tokenInfo && appState.tokenAddress));

	function handleContinue() {
		if (isReadyToContinue) {
			stepManager.next();
		}
	}

	function handleBack() {
		stepManager.prev();
	}
</script>

<StepFooter
	canContinue={isReadyToContinue}
	continueText="Continue to Trading"
	onContinue={handleContinue}
	showBack={true}
	onBack={handleBack}
	hint="Validate token address to continue"
/>
