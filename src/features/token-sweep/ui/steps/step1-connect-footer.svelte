<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte.js';
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepFooter from '@/features/token-sweep/ui/components/step-footer.svelte';

	const connectStore = useConnectStore();
	const stepManager = useStepManager();

	// This needs to track the same selectedChainId as content
	// We'll use connectStore.currentChainId which is set after connection
	const isReadyToContinue = $derived(
		Boolean(connectStore.isConnected && connectStore.currentChainId !== null)
	);

	// Handle continue to next step
	function handleContinue() {
		if (isReadyToContinue) {
			stepManager.next();
		}
	}
</script>

<StepFooter
	canContinue={isReadyToContinue}
	continueText="Continue to Configuration"
	onContinue={handleContinue}
	hint="Connect your wallet to continue"
/>
