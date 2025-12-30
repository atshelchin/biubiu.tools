<script lang="ts">
	/**
	 * Wallet Sweep Step 2: Dependency Check Footer
	 * Uses shared DependencyCheckFooter component
	 */
	import { DependencyCheckFooter } from '$lib/components/step/dependency-check';
	import { step2State } from '@/features/wallet-sweep/stores/step2-state.svelte';

	// Use $derived to get reactive values from step2State
	const summary = $derived(step2State.summary);
	const isChecking = $derived(step2State.isChecking);
</script>

<DependencyCheckFooter i18nPrefix="routes/apps/wallet-sweep" {summary} {isChecking} />
