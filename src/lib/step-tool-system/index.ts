/**
 * Step Tool System
 *
 * A declarative system for defining step-based tools (wizard-style multi-step interfaces).
 *
 * This is specifically for tools that have:
 * - Multi-step navigation (Step 1, Step 2, etc.)
 * - Sidebar, content, and footer components for each step
 * - Optional wallet connection
 * - Optional dependency checks
 *
 * Not all features use this system. Simple features like chainlist
 * or chain-tools don't need step-based navigation.
 *
 * @example
 * ```typescript
 * // In tool definition file
 * import { defineStepTool } from '$lib/step-tool-system';
 *
 * export const myTool = defineStepTool({
 *   id: 'my-tool',
 *   i18nPrefix: 'my-tool',
 *   steps: [...],
 *   stepComponents,
 *   walletConnect: { ... }
 * });
 *
 * // In route page
 * import StepToolApp from '$lib/step-tool-system/step-tool-app.svelte';
 * import tool from '@/features/my-tool/tool';
 *
 * <StepToolApp {tool} meta={data.meta} structuredData={data.structuredData} />
 * ```
 */

export { defineStepTool } from './define-step-tool';
export { default as StepToolApp } from './step-tool-app.svelte';
export type {
	StepToolDefinition,
	StepToolContext,
	StepConfig,
	WalletConnectConfig,
	PaywallConfig,
	ToolMeta,
	FAQItem,
	StepComponentSet,
	// Backwards compatibility (deprecated)
	FeatureDefinition,
	FeatureContext,
	FeatureMeta
} from './types';
