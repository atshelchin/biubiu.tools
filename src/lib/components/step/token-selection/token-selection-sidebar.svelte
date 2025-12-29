<script lang="ts">
	/**
	 * Shared Token Selection Step Sidebar Component.
	 *
	 * Shows selected token count summary.
	 *
	 * @example
	 * ```svelte
	 * <TokenSelectionSidebar
	 *   i18nPrefix="wallet-sweep"
	 *   selectedCount={state.selectedTokenIds.size}
	 * />
	 * ```
	 */
	import { fade } from 'svelte/transition';
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
	import StepSummary from '$lib/components/step/step-summary.svelte';
	import EmptyHint from '$lib/components/ui/empty-hint.svelte';
	import { useI18n, type TranslationKeys } from '@shelchin/i18n';

	interface Props {
		/** i18n prefix for this tool (e.g., 'wallet-sweep') */
		i18nPrefix: string;
		/** Step number for i18n keys and sidebar display (default: 3) */
		stepNumber?: number;
		/** Number of selected tokens */
		selectedCount: number;
	}

	let { i18nPrefix, stepNumber = 3, selectedCount }: Props = $props();

	const i18n = useI18n();

	// Helper to translate dynamic keys with type assertion
	function t(key: string): string {
		return i18n.t(key as keyof TranslationKeys);
	}
</script>

<StepSidebar title="" description="" {stepNumber} showWalletConnect={true}>
	{#if selectedCount > 0}
		<div transition:fade>
			<StepSummary title={t(`${i18nPrefix}.step${stepNumber}.sidebar.selected_tokens_title`)}>
				<div class="summary-item">
					<span>{t(`${i18nPrefix}.step${stepNumber}.sidebar.count_label`)}</span>
					<strong>{selectedCount}</strong>
				</div>
			</StepSummary>
		</div>
	{:else}
		<EmptyHint message={t(`${i18nPrefix}.step${stepNumber}.sidebar.empty_hint`)} />
	{/if}
</StepSidebar>
