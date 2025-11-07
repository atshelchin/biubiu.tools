<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte.js';
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';

	const connectStore = useConnectStore();
	const stepManager = useStepManager();

	const isReadyToContinue = $derived(
		Boolean(connectStore.isConnected && connectStore.currentChainId === 1)
	);

	function handleContinue() {
		if (isReadyToContinue) {
			stepManager.next();
		}
	}
</script>

<StepFooter
	canContinue={isReadyToContinue}
	continueText="Continue to Name Generation"
	onContinue={handleContinue}
	hint="Connect to Ethereum Mainnet to continue"
/>
