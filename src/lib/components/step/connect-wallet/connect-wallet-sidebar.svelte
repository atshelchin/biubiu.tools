<script lang="ts">
	/**
	 * Shared Step 1 Connect Wallet Sidebar Component.
	 *
	 * Minimal sidebar for the connect wallet step.
	 * Shows wallet connection state if connected.
	 *
	 * @example
	 * ```svelte
	 * <ConnectWalletSidebar i18nPrefix="contract-deployer" />
	 * ```
	 */
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
	import { useI18n, type TranslationKeys } from '@shelchin/i18n';

	interface Props {
		/** Optional i18n prefix for this tool (e.g., 'contract-deployer') */
		i18nPrefix?: string;
	}

	let { i18nPrefix }: Props = $props();

	const i18n = useI18n();

	// Helper to translate dynamic keys with type assertion
	function t(key: string): string {
		return i18n.t(key as keyof TranslationKeys);
	}

	// Use i18n if prefix provided, otherwise empty strings for minimal sidebar
	const title = $derived(i18nPrefix ? t(`${i18nPrefix}.step1.sidebar.title`) : '');
	const description = $derived(i18nPrefix ? t(`${i18nPrefix}.step1.sidebar.description`) : '');
</script>

<StepSidebar stepNumber={1} {title} {description} />
