<script lang="ts">
	/**
	 * Shared Step 1 Connect Wallet Sidebar Component.
	 *
	 * Minimal sidebar for the connect wallet step.
	 * Shows wallet connection state if connected.
	 *
	 * @example
	 * ```svelte
	 * <ConnectWalletSidebar i18nPrefix="routes/apps/contract-deployer" />
	 *
	 * <!-- With custom content -->
	 * <ConnectWalletSidebar i18nPrefix="ens-scanner">
	 *   <div class="custom-content">Custom help content</div>
	 * </ConnectWalletSidebar>
	 * ```
	 */
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
	import { useI18n, type TranslationKeys } from '@shelchin/i18n';
	import type { Snippet } from 'svelte';

	interface Props {
		/** Optional i18n prefix for this tool (e.g., 'contract-deployer') */
		i18nPrefix?: string;
		/** Optional custom content to render after the title/description */
		children?: Snippet;
	}

	let { i18nPrefix, children }: Props = $props();

	const i18n = useI18n();

	// Helper to translate dynamic keys with type assertion
	function t(key: string): string {
		return i18n.t(key as keyof TranslationKeys);
	}

	// Use i18n if prefix provided, otherwise empty strings for minimal sidebar
	const title = $derived(i18nPrefix ? t(`${i18nPrefix}.step1.sidebar.title`) : '');
	const description = $derived(i18nPrefix ? t(`${i18nPrefix}.step1.sidebar.description`) : '');
</script>

<StepSidebar stepNumber={1} {title} {description}>
	{#if children}
		{@render children()}
	{/if}
</StepSidebar>
