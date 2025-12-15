<script lang="ts">
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';
	import { step2State } from '@/features/wallet-sweep/stores/step2-state.svelte';
	import { useI18n } from '@shelchin/i18n/svelte';

	const stepManager = useStepManager();
	const i18n = useI18n();

	// Use $derived for easier access in template
	let summary = $derived(step2State.summary);
	let isChecking = $derived(step2State.isChecking);

	// Check if ready to continue
	const isReadyToContinue = $derived(Boolean(summary?.allPassed));

	// Dynamic footer hint based on state
	const footerHint = $derived.by(() => {
		if (isChecking) return i18n.t('tools.wallet_sweep.step2.footer.checking_dependencies');
		if (summary && !summary.allPassed)
			return i18n.t('tools.wallet_sweep.step2.footer.resolve_issues');
		return i18n.t('tools.wallet_sweep.step2.footer.waiting_for_checks');
	});

	// Handle continue to next step
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
	hint={footerHint}
/>
