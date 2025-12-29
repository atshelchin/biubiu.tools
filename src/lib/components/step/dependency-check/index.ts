/**
 * Shared Dependency Check Step Components.
 *
 * These components provide reusable UI for the dependency checking step
 * in step-based blockchain tools.
 *
 * @example
 * ```svelte
 * <script>
 *   import {
 *     DependencyCheckContent,
 *     DependencyCheckSidebar,
 *     DependencyCheckFooter
 *   } from '$lib/components/step/dependency-check';
 * </script>
 *
 * <DependencyCheckContent
 *   i18nPrefix="my-tool"
 *   checkDependencies={checkAllDependencies}
 *   onStateChange={(state) => { step2State.summary = state.summary; }}
 * />
 * ```
 *
 * @module
 */

export { default as DependencyCheckContent } from './dependency-check-content.svelte';
export { default as DependencyCheckSidebar } from './dependency-check-sidebar.svelte';
export { default as DependencyCheckFooter } from './dependency-check-footer.svelte';
