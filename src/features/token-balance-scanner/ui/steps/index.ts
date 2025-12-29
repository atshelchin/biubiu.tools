/**
 * Step components for token-balance-scanner tool.
 *
 * Uses Vite's import.meta.glob for automatic component discovery.
 * Components are sorted by step number extracted from filenames.
 *
 * Naming convention:
 * - step{N}-{topic}-sidebar.svelte
 * - step{N}-{topic}-content.svelte
 * - step{N}-{topic}-footer.svelte
 */
import { createStepComponents } from '$lib/utils/create-step-components';

// Auto-discover step components using Vite glob imports
// Note: Patterns must be string literals for Vite's static analysis
const sidebarModules = import.meta.glob('./step*-*-sidebar.svelte', { eager: true });
const contentModules = import.meta.glob('./step*-*-content.svelte', { eager: true });
const footerModules = import.meta.glob('./step*-*-footer.svelte', { eager: true });

// Create step components mapping (sorted by step number)
export const stepComponents = createStepComponents({
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	sidebar: sidebarModules as any,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	content: contentModules as any,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	footer: footerModules as any
});
