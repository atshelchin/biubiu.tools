<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte.js';
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';

	const connectStore = useConnectStore();
	const stepManager = useStepManager();

	const isReadyToContinue = $derived(
		Boolean(connectStore.isConnected && connectStore.currentChainId !== null)
	);

	function handleContinue() {
		if (isReadyToContinue) {
			stepManager.next();
		}
	}
</script>

<StepFooter
	canContinue={isReadyToContinue}
	continueText="Continue to Contract Configuration"
	onContinue={handleContinue}
	hint="Connect your wallet to continue"
/>
