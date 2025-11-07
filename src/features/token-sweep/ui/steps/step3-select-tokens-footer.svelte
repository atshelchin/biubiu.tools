<script lang="ts">
	import type { StepManager } from '$lib/components/ui/step-indicator.svelte';
	import { step3State } from '@/features/token-sweep/stores/step3-state.svelte';
	import StepFooter from '@/features/token-sweep/ui/components/step-footer.svelte';

	interface Props {
		stepManager?: StepManager;
	}

	let { stepManager }: Props = $props();

	// Use shared state from step3State
	let selectedTokenIds = $derived(step3State.selectedTokenIds);

	// Check if can continue
	let canContinue = $derived(selectedTokenIds.size > 0);

	function handleContinue() {
		if (canContinue && stepManager) {
			console.log('Selected tokens:', step3State.getSelectedTokens());
			stepManager.goTo(4);
		}
	}
</script>

<StepFooter
	{canContinue}
	onContinue={handleContinue}
	hint="Please select at least one token to continue"
/>
