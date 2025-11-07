<script lang="ts">
	import StepFooter from '$lib/components/step/step-footer.svelte';
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	const stepManager = useStepManager();
</script>

<StepFooter canContinue={true} continueText="Continue" onContinue={() => stepManager.next()} />
