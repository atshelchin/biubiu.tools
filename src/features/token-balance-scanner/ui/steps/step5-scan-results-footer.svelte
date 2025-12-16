<script lang="ts">
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';
	import { scannerState } from '../../stores/scanner-state.svelte';

	const stepManager = useStepManager();

	const status = $derived(scannerState.scanStatus);

	// Dynamic hint based on status
	const footerHint = $derived.by(() => {
		if (status === 'idle') return 'Click "Start Scanning" to begin';
		if (status === 'scanning') return 'Scanning in progress...';
		if (status === 'completed') return 'Export your results or start a new scan';
		if (status === 'error') return 'Retry the scan or go back to fix the issue';
		return '';
	});

	function handleNewScan() {
		scannerState.reset();
		stepManager.goTo(1);
	}

	function goBack() {
		stepManager.prev();
	}
</script>

<StepFooter
	showBack={true}
	onBack={goBack}
	canContinue={status === 'completed'}
	continueText="Start New Scan"
	onContinue={handleNewScan}
	hint={footerHint}
/>
