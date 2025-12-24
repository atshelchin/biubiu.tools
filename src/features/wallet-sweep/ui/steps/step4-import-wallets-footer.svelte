<script lang="ts">
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import { step4State } from '@/features/wallet-sweep/stores/step4-state.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';
	import { useI18n } from '@shelchin/i18n';

	const stepManager = useStepManager();
	const i18n = useI18n();

	// Derived state
	let importedWallets = $derived(step4State.importedWallets);
	let walletCount = $derived(importedWallets.length);
	let scanCompleted = $derived(step4State.scanCompleted);
	// Can only continue after scan is completed
	let canContinue = $derived(walletCount > 0 && scanCompleted);

	// Dynamic hint based on state
	let hint = $derived.by(() => {
		if (walletCount === 0) {
			// No wallets imported yet
			return i18n.t('wallet-sweep.step4.footer.hint');
		} else if (!scanCompleted) {
			// Wallets imported but not scanned
			return i18n.t('wallet-sweep.step4.footer.hint_scan_required');
		}
		// All conditions met
		return '';
	});

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
	continueText={i18n.t('wallet-sweep.step4.footer.continue_text')}
	onContinue={handleContinue}
	{hint}
/>
