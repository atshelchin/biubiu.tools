/**
 * Auto-loader for step components using Vite's import.meta.glob.
 *
 * This utility eliminates the need to manually import and export
 * 15+ step components in each tool's steps/index.ts file.
 *
 * ## Convention
 *
 * Step component files must follow the naming pattern:
 * - `step{N}-{topic}-sidebar.svelte`
 * - `step{N}-{topic}-content.svelte`
 * - `step{N}-{topic}-footer.svelte`
 *
 * Where:
 * - `{N}` is the step number (1, 2, 3, ...)
 * - `{topic}` is a kebab-case descriptor (e.g., "connect", "configure", "import-wallets")
 *
 * ## Usage
 *
 * ```typescript
 * // features/my-tool/ui/steps/index.ts
 * import { createStepComponents } from '$lib/utils/create-step-components';
 *
 * // Use import.meta.glob with eager loading for SSR compatibility
 * const sidebarModules = import.meta.glob('./step*-*-sidebar.svelte', { eager: true });
 * const contentModules = import.meta.glob('./step*-*-content.svelte', { eager: true });
 * const footerModules = import.meta.glob('./step*-*-footer.svelte', { eager: true });
 *
 * export const stepComponents = createStepComponents({
 *   sidebar: sidebarModules,
 *   content: contentModules,
 *   footer: footerModules
 * });
 * ```
 *
 * ## SSR Compatibility
 *
 * This approach is SSR-safe because:
 * 1. `import.meta.glob` with `eager: true` is resolved at build time
 * 2. Vite statically analyzes the glob patterns and generates deterministic imports
 * 3. No dynamic imports or async loading required
 *
 * @module
 */

import type { Component } from 'svelte';

/**
 * Module map from import.meta.glob with eager loading.
 */
export type GlobModuleMap = Record<string, { default: Component }>;

/**
 * Input for createStepComponents - three module maps from import.meta.glob.
 */
export interface StepComponentsInput {
	sidebar: GlobModuleMap;
	content: GlobModuleMap;
	footer: GlobModuleMap;
}

/**
 * Output structure matching StepBasedApp's stepComponents prop.
 */
export interface StepComponents {
	readonly sidebar: readonly Component[];
	readonly content: readonly Component[];
	readonly footer: readonly Component[];
}

/**
 * Extract step number from a file path.
 *
 * @example
 * extractStepNumber('./step1-connect-sidebar.svelte') // 1
 * extractStepNumber('./step12-results-content.svelte') // 12
 */
function extractStepNumber(path: string): number {
	const match = path.match(/step(\d+)/);
	return match ? parseInt(match[1], 10) : 0;
}

/**
 * Sort paths by step number.
 *
 * Ensures components are ordered correctly regardless of
 * filesystem ordering or glob return order.
 */
function sortByStepNumber(paths: string[]): string[] {
	return [...paths].sort((a, b) => extractStepNumber(a) - extractStepNumber(b));
}

/**
 * Extract component defaults from a module map, sorted by step number.
 */
function extractComponents(modules: GlobModuleMap): Component[] {
	const sortedPaths = sortByStepNumber(Object.keys(modules));
	return sortedPaths.map((path) => modules[path].default);
}

/**
 * Create step components mapping from glob module maps.
 *
 * This function:
 * 1. Extracts default exports from each module
 * 2. Sorts components by step number
 * 3. Returns a readonly structure for StepBasedApp
 *
 * @param input - Module maps from import.meta.glob
 * @returns Readonly step components structure
 *
 * @example
 * ```typescript
 * const sidebarModules = import.meta.glob('./step*-sidebar.svelte', { eager: true });
 * const contentModules = import.meta.glob('./step*-content.svelte', { eager: true });
 * const footerModules = import.meta.glob('./step*-footer.svelte', { eager: true });
 *
 * export const stepComponents = createStepComponents({
 *   sidebar: sidebarModules,
 *   content: contentModules,
 *   footer: footerModules
 * });
 * ```
 */
export function createStepComponents(input: StepComponentsInput): StepComponents {
	const sidebar = extractComponents(input.sidebar);
	const content = extractComponents(input.content);
	const footer = extractComponents(input.footer);

	// Validate component counts match
	if (sidebar.length !== content.length || content.length !== footer.length) {
		console.warn(
			`[createStepComponents] Component count mismatch: ` +
				`sidebar=${sidebar.length}, content=${content.length}, footer=${footer.length}. ` +
				`Ensure all steps have all three component files.`
		);
	}

	return {
		sidebar,
		content,
		footer
	} as const;
}

/**
 * Validate step components have correct count.
 *
 * Useful for development-time checks.
 *
 * @param components - Step components to validate
 * @param expectedCount - Expected number of steps
 * @throws Error if counts don't match
 */
export function validateStepComponents(
	components: StepComponents,
	expectedCount: number
): asserts components is StepComponents {
	const { sidebar, content, footer } = components;

	if (sidebar.length !== expectedCount) {
		throw new Error(`Expected ${expectedCount} sidebar components, got ${sidebar.length}`);
	}
	if (content.length !== expectedCount) {
		throw new Error(`Expected ${expectedCount} content components, got ${content.length}`);
	}
	if (footer.length !== expectedCount) {
		throw new Error(`Expected ${expectedCount} footer components, got ${footer.length}`);
	}
}
