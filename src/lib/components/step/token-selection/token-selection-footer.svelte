<script lang="ts">
	/**
	 * Shared Token Selection Step Footer Component.
	 *
	 * Shows continue button that's enabled when tokens are selected.
	 *
	 * @example
	 * ```svelte
	 * <TokenSelectionFooter
	 *   i18nPrefix="wallet-sweep"
	 *   selectedCount={state.selectedTokenIds.size}
	 * />
	 * ```
	 */
	import { useStepManager } from '$lib/components/ui/step-context.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';
	import { useI18n, type TranslationKeys } from '@shelchin/i18n';

	interface Props {
		/** i18n prefix for this tool (e.g., 'wallet-sweep') */
		i18nPrefix: string;
		/** Step number for i18n keys (default: 3) */
		stepNumber?: number;
		/** Number of selected tokens */
		selectedCount: number;
	}

	let { i18nPrefix, stepNumber = 3, selectedCount }: Props = $props();

	const stepManager = useStepManager();
	const i18n = useI18n();

	// Helper to translate dynamic keys with type assertion
	function t(key: string): string {
		return i18n.t(key as keyof TranslationKeys);
	}

	// Check if can continue
	let canContinue = $derived(selectedCount > 0);

	function handleContinue() {
		if (canContinue) {
			stepManager.next();
		}
	}

	function goBack() {
		stepManager.prev();
	}
</script>

<StepFooter
	showBack={true}
	onBack={goBack}
	{canContinue}
	onContinue={handleContinue}
	hint={t(`${i18nPrefix}.step${stepNumber}.footer.hint`)}
/>
