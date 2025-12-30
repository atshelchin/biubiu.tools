<script lang="ts">
	/**
	 * Shared Step 2 Dependency Check Footer Component.
	 *
	 * This component provides navigation controls for the dependency check step,
	 * with dynamic hints based on check state.
	 *
	 * @example
	 * ```svelte
	 * <DependencyCheckFooter
	 *   i18nPrefix="routes/apps/token-balance-scanner"
	 *   summary={step2State.summary}
	 *   isChecking={step2State.isChecking}
	 * />
	 * ```
	 */
	import type { DependencyCheckSummary } from '$lib/utils/blockchain-checker';

	// Context & Stores
	import { useStepManager } from '$lib/components/ui/step-context.svelte';

	// i18n
	import { useI18n, type TranslationKeys } from '@shelchin/i18n';

	// Components
	import StepFooter from '$lib/components/step/step-footer.svelte';

	interface Props {
		/** i18n prefix for this tool (e.g., 'token-balance-scanner', 'wallet-sweep') */
		i18nPrefix: string;
		/** The summary from dependency checks */
		summary: DependencyCheckSummary | null;
		/** Whether currently checking dependencies */
		isChecking: boolean;
	}

	let { i18nPrefix, summary, isChecking }: Props = $props();

	// Context
	const stepManager = useStepManager();
	const i18n = useI18n();

	// Helper to translate dynamic keys with type assertion
	function t(key: string): string {
		return i18n.t(key as keyof TranslationKeys);
	}

	// Derived state
	const isReadyToContinue = $derived(Boolean(summary?.allPassed));

	// Dynamic footer hint based on state
	const footerHint = $derived.by(() => {
		if (isChecking) return t(`${i18nPrefix}.step2.footer.checking_dependencies`);
		if (summary && !summary.allPassed) return t(`${i18nPrefix}.step2.footer.resolve_issues`);
		return t(`${i18nPrefix}.step2.footer.waiting_for_checks`);
	});

	// Handlers
	function handleContinue() {
		if (isReadyToContinue) {
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
	canContinue={isReadyToContinue}
	onContinue={handleContinue}
	hint={footerHint}
/>
