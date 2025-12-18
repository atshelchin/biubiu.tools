<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';
	import { step3State } from '../../stores/step3-state.svelte';
	import { step4State } from '../../stores/step4-state.svelte';
	import { step5State } from '../../stores/step5-state.svelte';

	const i18n = useI18n();
	const stepManager = useStepManager();

	const status = $derived(step5State.scanStatus);

	// Dynamic hint based on status
	const footerHint = $derived.by(() => {
		if (status === 'idle')
			return (
				i18n.t('tools.token_balance_scanner.step5.footer.hint_idle') ||
				'Click "Start Scanning" to begin'
			);
		if (status === 'scanning')
			return (
				i18n.t('tools.token_balance_scanner.step5.footer.hint_scanning') ||
				'Scanning in progress...'
			);
		if (status === 'paused')
			return (
				i18n.t('tools.token_balance_scanner.step5.footer.hint_paused') ||
				'Scan paused. Resume or start a new scan.'
			);
		if (status === 'completed') return '';
		if (status === 'error')
			return (
				i18n.t('tools.token_balance_scanner.step5.footer.hint_error') ||
				'Retry the scan or go back to fix the issue'
			);
		return '';
	});

	// Continue button text based on status
	const continueText = $derived.by(() => {
		if (status === 'completed' || status === 'error' || status === 'paused') {
			return i18n.t('tools.token_balance_scanner.step5.footer.new_scan') || 'Start New Scan';
		}
		return i18n.t('tools.token_balance_scanner.step5.footer.continue') || 'Continue';
	});

	// Can show back button
	const showBack = $derived(status === 'idle' || status === 'error' || status === 'paused');

	function handleNewScan() {
		step3State.reset();
		step4State.reset();
		step5State.reset();
		stepManager.goTo(1);
	}

	function goBack() {
		// If scanning, don't allow going back
		if (status === 'scanning') return;
		stepManager.prev();
	}
</script>

<StepFooter
	{showBack}
	onBack={goBack}
	canContinue={false}
	{continueText}
	onContinue={handleNewScan}
	hint={footerHint}
/>
