<script lang="ts">
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';
	import { useI18n } from '@shelchin/i18n/svelte';
	import { getContext } from 'svelte';

	const stepManager = useStepManager();
	const i18n = useI18n();

	// Get check result from step2 content component
	const contentComponent = getContext<{
		getCheckResult: () => { allPassed: boolean; hasChecked: boolean };
	}>('step2-content');

	let checkResult = $state({ allPassed: false, hasChecked: false });

	// Poll check result
	$effect(() => {
		const interval = setInterval(() => {
			if (contentComponent?.getCheckResult) {
				checkResult = contentComponent.getCheckResult();
			}
		}, 100);

		return () => clearInterval(interval);
	});

	const isReadyToContinue = $derived(checkResult.hasChecked && checkResult.allPassed);

	function handleContinue() {
		if (isReadyToContinue) {
			stepManager.next();
		}
	}
</script>

<StepFooter
	canContinue={isReadyToContinue}
	continueText={i18n.t('tools.contract_deployer.step2.footer.continue')}
	onContinue={handleContinue}
	hint={i18n.t('tools.contract_deployer.step2.footer.hint')}
/>
