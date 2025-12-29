/**
 * Step Tool System Types
 *
 * Type definitions for step-based tools (wizard-style multi-step interfaces).
 *
 * This is specifically for tools that have:
 * - Multi-step navigation (Step 1, Step 2, etc.)
 * - Sidebar, content, and footer components for each step
 * - Optional wallet connection
 * - Optional dependency checks
 *
 * Not all features use this system. Simple features like chainlist
 * or chain-tools don't need step-based navigation.
 */

import type { Component } from 'svelte';
import type { Chain } from 'viem';
import type { CheckType, DependencyConfig } from '$lib/utils/dependency-runner';

// Generic component type for step components (matches step-based-app.svelte)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StepComponent = Component<any, any>;

/**
 * Step configuration
 */
export interface StepConfig {
	/** i18n key for step label */
	label: string;
	/** i18n key for step description */
	description: string;
}

/**
 * Wallet connection configuration
 */
export interface WalletConnectConfig {
	/** Supported chains */
	chains: Chain[];
	/** Local storage key for wallet state */
	storageKey: string;
}

/**
 * Paywall configuration
 */
export interface PaywallConfig {
	/** Paywall type */
	type: 'pay-per-use' | 'membership' | 'none';
	/** Fee amount (for pay-per-use) */
	fee?: number;
}

/**
 * Tool metadata for SEO
 */
export interface ToolMeta {
	title: string;
	description: string;
	keywords: string;
	canonical: string;
	type: 'website';
	image: string;
	locale: string;
}

/**
 * FAQ item
 */
export interface FAQItem {
	question: string;
	answer: string;
}

/**
 * Step components set (for a single step)
 */
export interface StepComponentSet {
	sidebar: Component;
	content: Component;
	footer: Component;
}

/**
 * Step-based tool definition
 *
 * Use this for tools that follow the step-by-step wizard pattern:
 * - wallet-sweep
 * - token-balance-scanner
 * - contract-deployer
 * - token-deployer
 * - nft-deployer
 * - token-distribution
 * - etc.
 */
export interface StepToolDefinition {
	/** Unique tool ID (e.g., 'wallet-sweep', 'token-balance-scanner') */
	id: string;

	/** i18n prefix for all translations */
	i18nPrefix: string;

	/**
	 * Step configuration
	 * - If useI18nSteps is true (default), labels/descriptions are i18n keys
	 * - If useI18nSteps is false, they are literal strings
	 */
	steps: StepConfig[];

	/**
	 * Whether steps use i18n keys (default: true)
	 * Set to false if steps are defined with literal strings (e.g., from +page.ts)
	 */
	useI18nSteps?: boolean;

	/** Step components mapping */
	stepComponents: {
		readonly sidebar: readonly StepComponent[];
		readonly content: readonly StepComponent[];
		readonly footer: readonly StepComponent[];
	};

	/** Wallet connection config (optional) */
	walletConnect?: WalletConnectConfig;

	/** Dependency check configuration (optional) */
	dependencyChecks?: DependencyConfig | CheckType[];

	/** Paywall configuration (optional) */
	paywall?: PaywallConfig;

	/** FAQs i18n key prefix (optional, will load from i18n) */
	faqsPrefix?: string;
}

/**
 * Runtime tool context (created from definition)
 */
export interface StepToolContext {
	/** The tool definition */
	definition: StepToolDefinition;

	/** Resolved FAQs */
	faqs: FAQItem[];

	/** Meta information for SEO */
	meta: ToolMeta;

	/** Structured data for SEO */
	structuredData: Record<string, unknown>[];
}

// Re-export old names for backwards compatibility (deprecated)
/** @deprecated Use StepToolDefinition instead */
export type FeatureDefinition = StepToolDefinition;
/** @deprecated Use ToolMeta instead */
export type FeatureMeta = ToolMeta;
/** @deprecated Use StepToolContext instead */
export type FeatureContext = StepToolContext;
