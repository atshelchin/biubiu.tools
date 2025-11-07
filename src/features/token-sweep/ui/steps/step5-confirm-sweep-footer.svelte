<script lang="ts">
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepFooter from '@/features/token-sweep/ui/components/step-footer.svelte';

	const stepManager = useStepManager();

	function goBack() {
		stepManager.goTo(4);
	}
</script>

<StepFooter showBack={true} onBack={goBack} canContinue={false} />
