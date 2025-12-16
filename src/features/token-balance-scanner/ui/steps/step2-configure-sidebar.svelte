<script lang="ts">
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
	import CheckSummary from '$lib/components/ui/check-summary.svelte';
	import { step2State } from '@/features/token-balance-scanner/stores/step2-state.svelte';
	// Use $derived for easier access in template
	let summary = $derived(step2State.summary);
</script>

<StepSidebar stepNumber={2} title="" description="" showWalletConnect={true}>
	{#if summary}
		<CheckSummary {summary} />
	{/if}
</StepSidebar>
