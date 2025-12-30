<script lang="ts">
	/**
	 * Token Deployer Step 2: Check Dependencies Footer
	 * Uses shared DependencyCheckFooter component
	 */
	import { DependencyCheckFooter } from '$lib/components/step/dependency-check';
	import { step2State } from '@/features/token-deployer/stores/step2-state.svelte';

	// Derive state from step2State to pass to shared component
	const summary = $derived(step2State.summary);
	const isChecking = $derived(step2State.isChecking);
</script>

<DependencyCheckFooter i18nPrefix="routes/apps/token-deployer" {summary} {isChecking} />
