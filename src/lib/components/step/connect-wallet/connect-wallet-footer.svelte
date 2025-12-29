<script lang="ts">
	/**
	 * Shared Step 1 Connect Wallet Footer Component.
	 *
	 * Footer with continue button, enabled when wallet is connected.
	 *
	 * @example
	 * ```svelte
	 * <ConnectWalletFooter i18nPrefix="token-balance-scanner" />
	 * ```
	 */
	import { useConnectStore } from '$lib/stores/connect.svelte.js';
	import { useStepManager } from '$lib/components/ui/step-context.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';
	import { useI18n, type TranslationKeys } from '@shelchin/i18n';

	interface Props {
		/** i18n prefix for this tool (e.g., 'token-balance-scanner', 'wallet-sweep') */
		i18nPrefix: string;
	}

	let { i18nPrefix }: Props = $props();

	const connectStore = useConnectStore();
	const stepManager = useStepManager();
	const i18n = useI18n();

	// Helper to translate dynamic keys with type assertion
	function t(key: string): string {
		return i18n.t(key as keyof TranslationKeys);
	}

	const isReadyToContinue = $derived(
		Boolean(connectStore.isConnected && connectStore.currentChainId !== null)
	);

	function handleContinue() {
		if (isReadyToContinue) {
			stepManager.next();
		}
	}
</script>

<StepFooter
	canContinue={isReadyToContinue}
	continueText={t(`${i18nPrefix}.step1.footer.continue`)}
	onContinue={handleContinue}
	hint={t(`${i18nPrefix}.step1.footer.hint`)}
/>
