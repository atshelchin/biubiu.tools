<script lang="ts">
	/**
	 * NFT Deployer Step 2: Check Dependencies Footer
	 * Uses shared DependencyCheckFooter component
	 */
	import { DependencyCheckFooter } from '$lib/components/step/dependency-check';
	import { step2CheckDepsState } from '@/features/nft-deployer/stores/step2-check-deps-state.svelte';

	// Derive state from step2CheckDepsState to pass to shared component
	const summary = $derived(step2CheckDepsState.summary);
	const isChecking = $derived(step2CheckDepsState.isChecking);
</script>

<DependencyCheckFooter i18nPrefix="routes/apps/nft-deployer" {summary} {isChecking} />
