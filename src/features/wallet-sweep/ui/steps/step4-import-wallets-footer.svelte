<script lang="ts">
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import { step4State } from '@/features/wallet-sweep/stores/step4-state.svelte';
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
	{canContinue}
	continueText={i18n.t('tools.wallet_sweep.step4.footer.continue_text')}
	onContinue={handleContinue}
	hint={i18n.t('tools.wallet_sweep.step4.footer.hint')}
/>
