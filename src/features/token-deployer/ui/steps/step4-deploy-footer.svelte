<script lang="ts">
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';
	import { step4State } from '@/features/token-deployer/stores/step4-state.svelte';

	const stepManager = useStepManager();

	const isCompleted = $derived(step4State.deploymentStatus === 'completed');

	function handleBack() {
		stepManager.previous();
	}
</script>

<StepFooter
	canContinue={false}
	showBack={!isCompleted}
	onBack={handleBack}
	hint={isCompleted ? 'Deployment completed!' : 'Review your configuration above'}
/>
