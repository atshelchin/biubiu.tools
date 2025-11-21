<script lang="ts">
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import { step4State } from '@/features/token-sweep/stores/step4-state.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';
	import { useI18n } from '@shelchin/i18n/svelte';

	const stepManager = useStepManager();
	const i18n = useI18n();

	// Derived state
	let importedWallets = $derived(step4State.importedWallets);
	let walletCount = $derived(importedWallets.length);
	let canContinue = $derived(walletCount > 0);

	function handleContinue() {
		if (canContinue) {
			stepManager.goTo(5);
		}
	}

	function goBack() {
		stepManager.goTo(3);
	}
</script>

<StepFooter
	showBack={true}
	onBack={goBack}
	{canContinue}
	continueText={i18n.t('tools.token_sweep.step4.footer.continue_text')}
	onContinue={handleContinue}
	hint={i18n.t('tools.token_sweep.step4.footer.hint')}
/>
