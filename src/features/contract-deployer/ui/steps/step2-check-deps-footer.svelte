<script lang="ts">
	/**
	 * Contract Deployer Step 2: Dependency Check Footer
	 * Uses shared DependencyCheckFooter component
	 */
	import { DependencyCheckFooter } from '$lib/components/step/dependency-check';
	import { step2State } from '@/features/contract-deployer/stores/step2-state.svelte';

	// Use $derived to get reactive values from step2State
	const summary = $derived(step2State.summary);
	const isChecking = $derived(step2State.isChecking);
</script>

<DependencyCheckFooter i18nPrefix="contract-deployer" {summary} {isChecking} />
