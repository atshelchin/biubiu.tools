<script lang="ts">
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';
	import { scannerState } from '../../stores/scanner-state.svelte';
	import { useI18n } from '@shelchin/i18n/svelte';

	const stepManager = useStepManager();
	const i18n = useI18n();

	const canContinue = $derived(scannerState.selectedTokens.size > 0);

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
	onContinue={handleContinue}
	hint={i18n.t('tools.token_balance_scanner.step3.footer.hint')}
/>
