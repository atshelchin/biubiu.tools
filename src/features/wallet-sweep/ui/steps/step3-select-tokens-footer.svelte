<script lang="ts">
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import { step3State } from '@/features/wallet-sweep/stores/step3-state.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';
	import { useI18n } from '@shelchin/i18n/svelte';

	const stepManager = useStepManager();
	const i18n = useI18n();

	// Check if can continue - derive from size property
	let canContinue = $derived(step3State.selectedTokenIds.size > 0);

	function handleContinue() {
		if (canContinue) {
			console.log('Selected tokens:', step3State.getSelectedTokens());
			stepManager.goTo(4);
		}
	}
	function goBack() {
		stepManager.prev();
	}
</script>

<StepFooter
	showBack={true}
	onBack={goBack}
	{canContinue}
	onContinue={handleContinue}
	hint={i18n.t('tools.wallet_sweep.step3.footer.hint')}
/>
