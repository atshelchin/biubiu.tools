<script lang="ts">
	/**
	 * Shared Step 2 Dependency Check Sidebar Component.
	 *
	 * This component provides a sidebar with dependency check summary
	 * that can be used by any step-based tool.
	 *
	 * @example
	 * ```svelte
	 * <DependencyCheckSidebar summary={step2State.summary} />
	 *
	 * <!-- With custom content -->
	 * <DependencyCheckSidebar summary={step2State.summary}>
	 *   <div class="help-section">Custom help content</div>
	 * </DependencyCheckSidebar>
	 * ```
	 */
	import type { DependencyCheckSummary } from '$lib/utils/blockchain-checker';
	import type { Snippet } from 'svelte';

	// Components
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
	import CheckSummary from '$lib/components/ui/check-summary.svelte';

	interface Props {
		/** The summary from dependency checks */
		summary: DependencyCheckSummary | null;
		/** Step number to display (default: 2) */
		stepNumber?: number;
		/** Optional custom content to render after the check summary */
		children?: Snippet;
	}

	let { summary, stepNumber = 2, children }: Props = $props();
</script>

<StepSidebar {stepNumber} title="" description="" showWalletConnect={true}>
	{#if summary}
		<CheckSummary {summary} />
	{/if}
	{#if children}
		{@render children()}
	{/if}
</StepSidebar>
