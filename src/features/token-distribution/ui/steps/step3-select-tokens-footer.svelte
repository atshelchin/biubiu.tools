<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';
	import { step3State } from '@/features/token-distribution/stores/step3-state.svelte';

	const i18n = useI18n();
	const stepManager = useStepManager();

	const isReadyToContinue = $derived(step3State.isValid);

	function handleContinue() {
		if (isReadyToContinue) {
			stepManager.next();
		}
	}
</script>

<StepFooter
	canContinue={isReadyToContinue}
	continueText={i18n.t('tools.one_to_many_transfer.step3.footer.continue')}
	onContinue={handleContinue}
	hint={i18n.t('tools.one_to_many_transfer.step3.footer.hint')}
/>
