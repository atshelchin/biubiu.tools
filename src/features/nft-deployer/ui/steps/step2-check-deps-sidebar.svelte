<script lang="ts">
	/**
	 * NFT Deployer Step 2: Check Dependencies Sidebar
	 * Uses shared DependencyCheckSidebar component
	 */
	import { DependencyCheckSidebar } from '$lib/components/step/dependency-check';
	import { step2CheckDepsState } from '@/features/nft-deployer/stores/step2-check-deps-state.svelte';

	// Derive state from step2CheckDepsState to pass to shared component
	const summary = $derived(step2CheckDepsState.summary);
</script>

<DependencyCheckSidebar {summary} />
