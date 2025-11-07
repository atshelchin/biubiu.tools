<script lang="ts">
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
	const stepNum = $derived(parseInt('3'));
	const title = 'Scan Names';
</script>

<StepSidebar stepNumber={stepNum} {title} description="Scan ENS names">
	<div class="info">Scanning in progress...</div>
</StepSidebar>

<style>
	.info {
		padding: var(--space-3);
	}
</style>
