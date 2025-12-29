<script lang="ts">
	/**
	 * Token Distribution Step 2: Dependency Check Footer
	 * Uses shared DependencyCheckFooter component
	 */
	import { DependencyCheckFooter } from '$lib/components/step/dependency-check';
	import { step2State } from '@/features/one-to-many-transfer/stores/step2-state.svelte';

	// Use $derived to get reactive values from step2State
	const summary = $derived(step2State.summary);
	const isChecking = $derived(step2State.isChecking);
</script>

<DependencyCheckFooter i18nPrefix="one-to-many-transfer" {summary} {isChecking} />
