<script lang="ts">
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
</script>

<StepSidebar stepNumber={1} title="Connect Wallet" description="Connect to start monitoring">
	<div class="features">
		<ul>
			<li>📊 Track all asset movements</li>
			<li>🔍 Deep transaction analysis</li>
			<li>💾 Store results locally</li>
		</ul>
	</div>
</StepSidebar>

<style>
	.features {
		padding: var(--space-4);
	}
	.features ul {
		list-style: none;
		padding: 0;
	}
	.features li {
		padding: var(--space-2) 0;
	}
</style>
