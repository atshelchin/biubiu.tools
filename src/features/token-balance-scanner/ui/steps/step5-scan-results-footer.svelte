<script lang="ts">
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';
	import { step3State } from '../../stores/step3-state.svelte';
	import { step4State } from '../../stores/step4-state.svelte';
	import { step5State } from '../../stores/step5-state.svelte';

	const stepManager = useStepManager();

	const status = $derived(step5State.scanStatus);

	// Dynamic hint based on status
	const footerHint = $derived.by(() => {
		if (status === 'idle') return 'Click "Start Scanning" to begin';
		if (status === 'scanning') return 'Scanning in progress...';
		if (status === 'completed') return 'Export your results or start a new scan';
		if (status === 'error') return 'Retry the scan or go back to fix the issue';
		return '';
	});

	function handleNewScan() {
		step3State.reset();
		step4State.reset();
		step5State.reset();
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
