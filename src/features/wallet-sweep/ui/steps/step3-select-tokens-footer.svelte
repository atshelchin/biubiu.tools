<script lang="ts">
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import { step3State } from '@/features/wallet-sweep/stores/step3-state.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';
	import { useI18n } from '@shelchin/i18n';

	const stepManager = useStepManager();
	const i18n = useI18n();

	// Check if can continue - derive from size property
	let isReadyToContinue = $derived(step3State.selectedTokenIds.size > 0);

	function handleContinue() {
		if (isReadyToContinue) {
			stepManager.next();
		}
	}
	function goBack() {
		stepManager.prev();
	}
</script>

<StepFooter
	showBack={true}
	onBack={goBack}
	canContinue={isReadyToContinue}
	onContinue={handleContinue}
	hint={i18n.t('wallet-sweep.step3.footer.hint')}
/>
