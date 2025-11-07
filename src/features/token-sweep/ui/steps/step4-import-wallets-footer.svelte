<script lang="ts">
	import type { StepManager } from '$lib/components/ui/step-indicator.svelte';
	import { step4State } from '../stores/step4-state.svelte';
	import StepFooter from './components/step-footer.svelte';

	interface Props {
		stepManager?: StepManager;
	}

	let { stepManager }: Props = $props();

	// Derived state
	let importedWallets = $derived(step4State.importedWallets);
	let walletCount = $derived(importedWallets.length);
	let canContinue = $derived(walletCount > 0);

	function handleContinue() {
		if (canContinue && stepManager) {
			stepManager.goTo(5);
		}
	}

	function goBack() {
		if (stepManager) {
			stepManager.goTo(3);
		}
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
