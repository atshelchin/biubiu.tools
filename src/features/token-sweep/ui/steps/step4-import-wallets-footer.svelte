<script lang="ts">
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import { step4State } from '@/features/token-sweep/stores/step4-state.svelte';
	import StepFooter from '@/features/token-sweep/ui/components/step-footer.svelte';

	const stepManager = useStepManager();

	// Derived state
	let importedWallets = $derived(step4State.importedWallets);
	let walletCount = $derived(importedWallets.length);
	let canContinue = $derived(walletCount > 0);

	function handleContinue() {
		if (canContinue) {
			stepManager.goTo(5);
		}
	}

	function goBack() {
		stepManager.goTo(3);
	}
</script>

<StepFooter
	showBack={true}
	onBack={goBack}
	{canContinue}
	continueText="Continue to Confirm"
	onContinue={handleContinue}
	hint="Please import at least one wallet to continue"
/>
