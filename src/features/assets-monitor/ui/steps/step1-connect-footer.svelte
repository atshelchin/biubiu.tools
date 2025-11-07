<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte.js';
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';

	const connectStore = useConnectStore();
	const stepManager = useStepManager();
	const canContinue = $derived(connectStore.isConnected);
</script>

<StepFooter {canContinue} continueText="Continue" onContinue={() => stepManager.next()} />
