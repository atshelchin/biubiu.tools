<script lang="ts">
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepFooter from '@/features/token-sweep/ui/components/step-footer.svelte';
	import { step2State } from '@/features/token-sweep/stores/step2-state.svelte';

	const stepManager = useStepManager();

	// Use $derived for easier access in template
	let summary = $derived(step2State.summary);
	let isChecking = $derived(step2State.isChecking);

	// Check if ready to continue
	const isReadyToContinue = $derived(summary?.allPassed === true);

	// Dynamic footer hint based on state
	const footerHint = $derived.by(() => {
		if (isChecking) return 'Checking dependencies...';
		if (summary && !summary.allPassed) return 'Please resolve all dependency issues to continue';
		return 'Waiting for dependency checks...';
	});

	// Handle continue to next step
	function handleContinue() {
		console.log('handleContinue called', { isReadyToContinue, summary });
		if (isReadyToContinue) {
			console.log('Calling stepManager.next()');
			stepManager.next();
		} else {
			console.log('Cannot continue:', {
				isReady: isReadyToContinue,
				summary
			});
		}
	}
</script>

<StepFooter canContinue={isReadyToContinue} onContinue={handleContinue} hint={footerHint} />
