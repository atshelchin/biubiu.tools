/**
 * Shared Connect Wallet Step Components.
 *
 * Provides reusable content, sidebar, and footer components for
 * the wallet connection step in step-based tools.
 *
 * ## Usage
 *
 * ```typescript
 * import {
 *   ConnectWalletContent,
 *   ConnectWalletSidebar,
 *   ConnectWalletFooter
 * } from '$lib/components/step/connect-wallet';
 * ```
 *
 * Or use directly in step components:
 * ```svelte
 * <ConnectWalletContent i18nPrefix="my-tool" />
 * <ConnectWalletFooter i18nPrefix="my-tool" />
 * ```
 *
 * @module
 */

export { default as ConnectWalletContent } from './connect-wallet-content.svelte';
export { default as ConnectWalletSidebar } from './connect-wallet-sidebar.svelte';
export { default as ConnectWalletFooter } from './connect-wallet-footer.svelte';
