<script lang="ts">
	import type { StepManager } from '$lib/components/ui/step-indicator.svelte';
	import { step3State } from '@/features/token-sweep/stores/step3-state.svelte';
	import { step4State } from '@/features/token-sweep/stores/step4-state.svelte';
	import StepFooter from '@/features/token-sweep/ui/components/step-footer.svelte';

	interface Props {
		stepManager?: StepManager;
		targetAddress: string;
		onExecuteSweep: () => void;
	}

	let { stepManager, targetAddress, onExecuteSweep }: Props = $props();

	// Derived from Step 3 (selected tokens)
	let selectedTokenCount = $derived(step3State.getSelectedCount());

	// Derived from Step 4 (imported wallets)
	let importedWallets = $derived(step4State.importedWallets);
	let walletCount = $derived(importedWallets.length);
	let isValid = $derived(
		targetAddress.match(/^0x[a-fA-F0-9]{40}$/) && selectedTokenCount > 0 && walletCount > 0
	);

	function goBack() {
		if (stepManager) {
			stepManager.goTo(4);
		}
	}
</script>

<StepFooter
	showBack={true}
	onBack={goBack}
	canContinue={isValid}
	continueText="Execute Sweep 🚀"
	onContinue={onExecuteSweep}
	continueButtonClass="btn-execute"
/>
