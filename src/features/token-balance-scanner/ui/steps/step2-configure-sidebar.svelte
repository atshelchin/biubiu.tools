<script lang="ts">
	/**
	 * Token Balance Scanner Step 2: Dependency Check Sidebar
	 * Uses shared DependencyCheckSidebar component
	 */
	import { DependencyCheckSidebar } from '$lib/components/step/dependency-check';
	import { step2State } from '@/features/token-balance-scanner/stores/step2-state.svelte';

	// Use $derived to get reactive value from step2State
	const summary = $derived(step2State.summary);
</script>

<DependencyCheckSidebar {summary} />
