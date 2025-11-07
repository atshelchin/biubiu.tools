<script lang="ts">
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';

	const stepManager = useStepManager();

	function handleBack() {
		stepManager.prev();
	}
</script>

<StepFooter canContinue={false} showBack={true} onBack={handleBack} hint="Execute trades above" />
